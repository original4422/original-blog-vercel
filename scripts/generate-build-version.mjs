import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = process.argv[2];

if (!['vercel', 'pages'].includes(app)) {
	throw new Error('Usage: node scripts/generate-build-version.mjs <vercel|pages>');
}

function localGitCommit() {
	try {
		return execFileSync('git', ['rev-parse', 'HEAD'], {
			cwd: root,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
	} catch {
		return undefined;
	}
}

const commit =
	(app === 'vercel'
		? process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA
		: process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA) ??
	process.env.BUILD_COMMIT ??
	localGitCommit();

if (!commit || !/^[0-9a-f]{7,64}$/i.test(commit)) {
	throw new Error(
		'Unable to resolve a Git commit for version.json. Expose the platform commit environment variable.',
	);
}

const version = {
	commit,
	builtAt: new Date().toISOString(),
	app,
};

const destination = path.join(root, 'apps', app, 'public', 'version.json');
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, `${JSON.stringify(version, null, 2)}\n`);

console.log(`Generated apps/${app}/public/version.json for ${commit}.`);
