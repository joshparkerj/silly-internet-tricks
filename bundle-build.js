const webpack = require('webpack');
const globber = require('glob');
const { readFile, writeFile } = require('fs');

const buildPattern = './@(stack)/**/*.user.js';

const glob = (globPattern) => (new Promise((r) => { globber(globPattern, (_, s) => r(s)); }));

glob(buildPattern)
  .then((files) => {
    const bundle = function bundle(i = 0) {
      if (i < files.length) {
        const entryFile = files[i];
        const outputFile = entryFile.replace('user.js', 'bundle.user.js');
        const distFile = `./dist${outputFile.slice(1)}`;
        const metaFile = distFile.replace('user.js', 'meta.js');
        console.log(entryFile);
        console.log(outputFile);
        console.log(distFile);
        webpack({
          mode: 'production',
          entry: entryFile,
          output: {
            filename: outputFile,
          },
        }, (err, stats) => {
          if (err) {
            console.error(err.stack || err);
            if (err.details) {
              console.error(err.details);
            }

            return;
          }

          const info = stats.toJson();

          if (stats.hasErrors()) {
            console.error(info.errors);
          }

          if (stats.hasWarnings()) {
            console.warn(info.warnings);
          }

          const delimiter = '==/UserScript==\n';
          readFile(entryFile, (readEntryFileErr, result) => {
            if (readEntryFileErr) {
              console.error(readEntryFileErr);
            } else if (result.toString().includes(delimiter)) {
              const userscriptHeader = result.toString().split(delimiter)[0] + delimiter;
              readFile(distFile, (readDistFileErr, distFileContent) => {
                if (readDistFileErr) {
                  console.error(readDistFileErr);
                } else {
                  const bundleWithHeader = userscriptHeader + distFileContent.toString();
                  writeFile(distFile, bundleWithHeader, (writeDistFileErr) => {
                    if (writeDistFileErr) {
                      console.error(writeDistFileErr);
                    } else {
                      writeFile(metaFile, userscriptHeader, (writeMetaFileErr) => {
                        if (writeMetaFileErr) {
                          console.error(writeMetaFileErr);
                        } else {
                          bundle(i + 1);
                        }
                      });
                    }
                  });
                }
              });
            } else {
              console.log('no userscript header');
              bundle(i + 1);
            }
          });
        });
      }
    };
    bundle();
  });
