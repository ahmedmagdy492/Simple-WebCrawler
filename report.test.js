const { sortPages } = require('./report.js');
const { test, expect } = require("@jest/globals");

test("sortPages", () => {
  const inputPages = {
    'http://localhost.com': 1,
    'http://localhost.com/path': 2
  };
  const actual = sortPages(inputPages);
  const expected = [
    ['http://localhost.com/path', 2],
    ['http://localhost.com', 1]
  ];

  expect(actual).toEqual(expected);
});
