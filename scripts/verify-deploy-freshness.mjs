const expectedCommit = process.env.EXPECTED_COMMIT;
const timeoutSeconds = Number(process.env.FRESHNESS_TIMEOUT_SECONDS ?? 900);
const pollSeconds = Number(process.env.FRESHNESS_POLL_SECONDS ?? 30);
const targets = [
	{ app: 'vercel', url: process.env.VERCEL_VERSION_URL },
	{ app: 'pages', url: process.env.PAGES_VERSION_URL },
];

if (!expectedCommit || targets.some((target) => !target.url)) {
	throw new Error(
		'EXPECTED_COMMIT, VERCEL_VERSION_URL and PAGES_VERSION_URL are required.',
	);
}
if (!Number.isFinite(timeoutSeconds) || timeoutSeconds < 0) {
	throw new Error('FRESHNESS_TIMEOUT_SECONDS must be a non-negative number.');
}
if (!Number.isFinite(pollSeconds) || pollSeconds <= 0) {
	throw new Error('FRESHNESS_POLL_SECONDS must be a positive number.');
}

const deadline = Date.now() + timeoutSeconds * 1000;
const wait = (milliseconds) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

async function readVersion(target) {
	try {
		const url = new URL(target.url);
		url.searchParams.set('expected', expectedCommit);
		url.searchParams.set('checkedAt', String(Date.now()));
		const response = await fetch(url, {
			headers: { Accept: 'application/json' },
			cache: 'no-store',
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) return { ...target, state: `HTTP ${response.status}` };
		const version = await response.json();
		return {
			...target,
			state:
				version.commit === expectedCommit
					? 'current'
					: `commit ${version.commit ?? 'missing'}`,
			version,
		};
	} catch (error) {
		return { ...target, state: error instanceof Error ? error.message : 'error' };
	}
}

while (true) {
	const results = await Promise.all(targets.map(readVersion));
	console.log(
		`${new Date().toISOString()} ${results
			.map((result) => `${result.app}=${result.state}`)
			.join(' ')}`,
	);
	if (results.every((result) => result.state === 'current')) {
		console.log(`Both deployments expose commit ${expectedCommit}.`);
		break;
	}
	if (Date.now() >= deadline) {
		throw new Error(
			`Deployments did not converge to ${expectedCommit} within ${timeoutSeconds} seconds.`,
		);
	}
	await wait(Math.min(pollSeconds * 1000, Math.max(0, deadline - Date.now())));
}
