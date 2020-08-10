const fs = require('fs');

class WebpackCopyDocumentsPlugin {
  apply(compiler) {
    compiler.hooks.done.tapPromise('FileCopyPlugin', (compilation) => {
      return new Promise((resolve, reject) => {
        try {
          fs.copyFileSync('./README.md', './dist/README.md');
          fs.copyFileSync('./LICENSE', './dist/LICENSE');
          console.log('success to copy document files');
          resolve();
        } catch (err) {
          console.log(err);
          reject();
        }
      });
    });
  }
}

module.exports = WebpackCopyDocumentsPlugin;
