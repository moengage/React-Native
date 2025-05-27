const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Compile TypeScript
console.log('Compiling TypeScript files...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('TypeScript compilation completed successfully.');
} catch (error) {
  console.error('TypeScript compilation failed:', error);
  process.exit(1);
}

// Copy package.json to build directory
console.log('Copying package.json to build directory...');
const packageJson = require('./package.json');
// Remove dev dependencies for the published version
delete packageJson.devDependencies;
delete packageJson.scripts;
packageJson.main = 'index.js';
packageJson.types = 'index.d.ts';

fs.writeFileSync(
  path.join(buildDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// Copy README.md to build directory
console.log('Copying README.md to build directory...');
fs.copyFileSync(
  path.join(__dirname, 'README.md'),
  path.join(buildDir, 'README.md')
);

console.log('Build completed successfully.');