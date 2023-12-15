const { Octokit } = require('@octokit/core');
const globber = require('glob');
const { readFile } = require('fs');

const pattern = './@(dist)/**/*.@(user|meta).js';

const glob = (globPattern) => new Promise((r) => {
 globber(globPattern, (_, s) => r(s));
});

const auth = process.env.PERSONAL_ACCESS_TOKEN;

const octokit = new Octokit({
 auth,
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
            const gistIdMatch = content.match(/downloadURL.*joshparkerj\/([^/]*)/);
            if (gistIdMatch) {
              const gistId = gistIdMatch[1];
              const description = content.match(/description\s+(.*)/)[1];
              const filename = file.includes('meta') ? content.match(/updateURL.*raw\/([^/]*)/)[1] : content.match(/downloadURL.*raw\/([^/]*)/)[1];

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
          }
        });
      }
    };

 upload();
});
