const fs = require('fs');
const path = require('path');

exports.default = async function afterPack(context) {
  const localesDir = path.join(context.appOutDir, 'locales');
  const keepLocales = new Set(['en-US.pak']);

  if (!fs.existsSync(localesDir)) {
    return;
  }

  for (const fileName of fs.readdirSync(localesDir)) {
    if (fileName.endsWith('.pak') && !keepLocales.has(fileName)) {
      fs.rmSync(path.join(localesDir, fileName), { force: true });
    }
  }
};
