import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
	{ app: 'vercel', file: 'apps/vercel/public/version.json' },
	{ app: 'pages', file: 'apps/pages/out/version.json' },
];
const versions = [];

for (const target of targets) {
	const filePath = path.join(root, target.file);
	if (!fs.existsSync(filePath)) {
		throw new Error(`Missing build version artifact: ${target.file}`);
	}
	const version = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	if (version.app !== target.app) {
		throw new Error(`${target.file} declares app=${version.app}`);
	}
	if (
		typeof version.commit !== 'string' ||
		!/^[0-9a-f]{7,64}$/i.test(version.commit)
	) {
		throw new Error(`${target.file} is missing its source commit`);
	}
	if (Number.isNaN(Date.parse(version.builtAt))) {
		throw new Error(`${target.file} has an invalid builtAt value`);
	}
	versions.push(version);
}

const expectedCommit = process.env.GITHUB_SHA ?? process.env.BUILD_COMMIT;
const commits = new Set(versions.map((version) => version.commit));
if (commits.size !== 1) {
	throw new Error(`Build versions disagree: ${[...commits].join(', ')}`);
}
if (expectedCommit && !commits.has(expectedCommit)) {
	throw new Error(
		`Build version ${[...commits][0]} does not match expected ${expectedCommit}`,
	);
}

console.log(`Build version audit passed for commit ${[...commits][0]}.`);
