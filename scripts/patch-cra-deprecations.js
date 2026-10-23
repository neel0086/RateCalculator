const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

function patchFile(relativePath, transform, description) {
  const filePath = path.join(projectRoot, 'node_modules', relativePath);
  if (!fs.existsSync(filePath)) return;

  const original = fs.readFileSync(filePath, 'utf8');
  const updated = transform(original);
  if (updated !== original) fs.writeFileSync(filePath, updated);
  if (updated === original && !description.isPatched(original)) {
    console.warn(`Could not apply compatibility patch: ${relativePath}`);
  }
}

patchFile(
  path.join('react-dev-utils', 'checkRequiredFiles.js'),
  (source) => source.replace(/fs\.F_OK\b/g, 'fs.constants.F_OK'),
  { isPatched: (source) => source.includes('fs.constants.F_OK') }
);

patchFile(
  path.join('react-scripts', 'config', 'webpackDevServer.config.js'),
  (source) => {
    const wrongOrder = /      middlewares\.unshift\(\{\n        name: 'eval-source-map-middleware',[\s\S]*?\n      \}\);/;
    if (source.includes('setupMiddlewares(middlewares, devServer)')) {
      return source.replace(wrongOrder, '      devServer.app.use(evalSourceMapMiddleware(devServer));');
    }
    const legacyHooks = /    onBeforeSetupMiddleware\(devServer\) \{[\s\S]*?    onAfterSetupMiddleware\(devServer\) \{[\s\S]*?\n    \},\n(?=  \};)/;
    return source.replace(legacyHooks, `    setupMiddlewares(middlewares, devServer) {
      // Preserve CRA's middleware order using webpack-dev-server's current API.
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }

      middlewares.push(
        {
          name: 'redirect-served-path-middleware',
          middleware: redirectServedPath(paths.publicUrlOrPath),
        },
        {
          name: 'noop-service-worker-middleware',
          middleware: noopServiceWorkerMiddleware(paths.publicUrlOrPath),
        }
      );
      return middlewares;
    },
`);
  },
  { isPatched: (source) => source.includes('setupMiddlewares(middlewares, devServer)') }
);

patchFile(
  path.join('spawn-command', 'lib', 'spawn-command.js'),
  (source) => source
    .replace("var util = require('util');\n", '')
    .replace('util._extend({}, options)', 'Object.assign({}, options)'),
  { isPatched: (source) => source.includes('Object.assign({}, options)') }
);
