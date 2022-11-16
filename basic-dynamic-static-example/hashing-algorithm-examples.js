const hashString = (s, maxCode = 65536) => (
  [...s]
    .reduce((acc, e, i) => (
      ((acc + (e.charCodeAt(0) * 31 ** i)) % maxCode) % maxCode
    ), 0)
);

const hash = (e, maxCode = 65536) => {
  if (typeof e === 'string') {
    return hashString(e, maxCode);
  }

  if (Number.isInteger(e)) {
    return e % maxCode;
  }

  return undefined;
};

export default hash;
