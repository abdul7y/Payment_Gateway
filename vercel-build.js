import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Run the build command
console.log('Building the application...');
execSync('vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

// Make sure the dist/public directory exists
const publicDir = path.join(process.cwd(), 'dist', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Build complete!');