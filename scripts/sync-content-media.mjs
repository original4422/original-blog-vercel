import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appName = process.argv[2];

if (!['vercel', 'pages'].includes(appName)) {
	throw new Error('Usage: node scripts/sync-content-media.mjs <vercel|pages>');
}

const source = path.join(root, 'packages/content/media');
const destination = path.join(root, 'apps', appName, 'public/content');

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.cpSync(source, destination, { recursive: true });

console.log(`Synced canonical media to apps/${appName}/public/content.`);
