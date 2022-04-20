const { Octokit } = require('@octokit/core');
const { createActionAuth } = require('@octokit/auth-action');
const globber = require('glob');
const { readFile } = require('fs');

const pattern = './@(dist)/**/*.@(user|meta).js';

const glob = (globPattern) => (new Promise((r) => { globber(globPattern, (_, s) => r(s)); }));

const octokit = new Octokit({
  authStrategy: createActionAuth,
});

glob(pattern)
  .then((files) => {
    const upload = function upload(i = 0) {
      if (i < files.length) {
        const file = files[i];
        readFile(file, (err, contentBuffer) => {
          if (err) {
            console.error(err);
          } else {
            const content = contentBuffer.toString();
            const gistId = content.match(/downloadURL.*joshparkerj\/([^/]*)/)[1];
            const description = content.match(/description\s+(.*)/)[1];
            const filename = file.includes('meta') ? content.match(/updateURL.*raw\/[^/]+\/([^/]*)/)[1] : content.match(/downloadURL.*raw\/[^/]+\/([^/]*)/)[1];

            console.log(content);
            console.log(gistId);
            console.log(description);
            console.log(filename);
            octokit.request(`PATCH /gists/${gistId}`, {
              gist_id: gistId,
              description,
              files: {
                [filename]: {
                  filename,
                  content,
                },
              },
            })
              .then(() => {
                upload(i + 1);
              });
          }
        });
      }
    };

    upload();
  });
