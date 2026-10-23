const { spawn } = require('child_process');

const env = { ...process.env };
// The environment used by some Node/Electron launchers sets this flag globally.
// Electron interprets it by running as plain Node, so remove it before launch.
delete env.ELECTRON_RUN_AS_NODE;

const child = process.platform === 'win32'
  ? spawn(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm run start-app'], {
    env,
    stdio: 'inherit',
  })
  : spawn('npm', ['run', 'start-app'], { env, stdio: 'inherit' });

child.on('error', (error) => {
  console.error('Unable to start the app:', error);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
