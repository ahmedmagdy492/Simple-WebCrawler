const {normalizeURL, getURLsFromHTML} = require('./crawl.js');
const { test, expect } = require('@jest/globals');

// normalizeURL Tests
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

// getURLsFromHTML tests
test("getURLsFromHTML absoulte URLs", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/">
          Boot Dev Blog
        </a>
      </body>
    </html>
  `;
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHtmlBody, inputBaseUrl);
  const expected = ['https://blog.boot.dev/'];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative URLs", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href="/user/1aa865d3-d678-437a-a689-5dc5c3c1448d">
          Ahmed Magdy
        </a>
      </body>
    </html>
  `;
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHtmlBody, inputBaseUrl);
  const expected = ['https://blog.boot.dev/user/1aa865d3-d678-437a-a689-5dc5c3c1448d']

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both relative and absoulte URLs", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/">
          Boot dev blog
        </a>
        <a href="/user/1aa865d3-d678-437a-a689-5dc5c3c1448d">
          Ahmed Magdy
        </a>
      </body>
    </html>
  `;
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHtmlBody, inputBaseUrl);
  const expected = [
    'https://blog.boot.dev/',
    'https://blog.boot.dev/user/1aa865d3-d678-437a-a689-5dc5c3c1448d'
  ];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML do not include bad URLs", () => {
  const inputHtmlBody = `
    <html>
      <body>
        <a href"invalid url">
          Bad URL
        </a>
        <a href="https://blog.boot.dev/">
          Boot dev blog
        </a>
        <a href="/user/1aa865d3-d678-437a-a689-5dc5c3c1448d">
          Ahmed Magdy
        </a>
      </body>
    </html>
  `;
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHtmlBody, inputBaseUrl);
  const expected = [
    'https://blog.boot.dev/',
    'https://blog.boot.dev/user/1aa865d3-d678-437a-a689-5dc5c3c1448d'
  ];

  expect(actual).toEqual(expected);
});
