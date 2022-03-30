/* eslint-disable no-undef */
// https://jestjs.io/docs/puppeteer#use-jest-puppeteer-preset
describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  });
});

describe('Wikipedia', () => {
  beforeAll(async () => {
    await page.goto('https://en.wikipedia.org');
  });

  it('should load page' , async () => {
    await expect(page.title()).resolves.toMatch('Wikipedia');
  });
});
