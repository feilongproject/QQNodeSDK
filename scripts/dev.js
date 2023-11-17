const { execSync } = require('child_process');

try {
  execSync('npm link');
  execSync('cd example && npm link qq-bot-sdk');
} catch (error) { }
