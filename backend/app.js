#!/usr/bin/env node

// Load environment variables from .env file
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const PORT = process.env.PORT || 4000;
const API_PORT = process.env.API_PORT || 3001;

console.log('Starting Finance Backend...');
console.log('PORT:', PORT);
console.log('API_PORT:', API_PORT);

// Start the application using npx tsx
// This ensures tsx is available regardless of global installation
const appPath = path.join(__dirname, 'src/index.ts');

const child = spawn('npx', ['tsx', appPath], {
  cwd: __dirname,
  env: { ...process.env },
  stdio: 'inherit'
});

child.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});
