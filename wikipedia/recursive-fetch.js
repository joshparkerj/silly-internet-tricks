const parser = new DOMParser();

export default function recursiveFetch(doc, docHref, baseCase, docHandler) {
  return new Promise((resolve) => {
    if (baseCase(doc, docHref, baseCase, docHandler)) {
      resolve();
      return;
    }

    fetch(docHref)
      .then((r) => r.text())
      .then((text) => parser.parseFromString(text, 'text/html'))
      .then((nextDoc) => {
        docHandler(doc, nextDoc, baseCase, docHandler).then(() => resolve());
      });
  });
}
