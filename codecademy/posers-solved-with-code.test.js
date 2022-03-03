const { reverseSimGame } = require('./posers-solved-with-code');

test('solves the original poser', () => {
  expect(reverseSimGame([0, 1, 2], [16, 16, 16])).toEqual([26, 14, 8]);
});
