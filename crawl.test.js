const {normalizeURL} = require('./crawl.js');
const { test, expect } = require('@jest/globals');

test('normalizeURL Strip Protocol', () => {
  const input = 'https://blog.boot.dev/path';
  const actual = normalizeURL(input);
  const expected  = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeURL strip trailing slashes', () => {
  const input = 'https://blog.boot.dev/path/';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';

  expect(actual).toEqual(expected);
})

test('normalizeURL capitals', () => {
  const input = 'https://BLOG.boOt.dev/path';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';

  expect(actual).toEqual(expected);
})
