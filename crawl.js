const { JSDOM } = require('jsdom');

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom  = new JSDOM(htmlBody);
  const aTags = dom.window.document.querySelectorAll('a');

  [...aTags].forEach(a => {
    if(a.href.slice(0, 1) === '/') {
      // relative url
      try {
        const urlObj = new URL(`${baseURL}${a.href}`);
        urls.push(urlObj.href);
      }
      catch (err) {
        console.log("Error with relative url: " + err.message);
      }
    }
    else {
      // absoulte url
      try {
        const urlObj = new URL(a.href);
        urls.push(urlObj.href);
      }
      catch (err) {
        console.log("Error with absoulte url: " + err.message);
      }
    }
  });

  return urls;
}

function normalizeURL(urlStr) {
  const urlObj = new URL(urlStr);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }

  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML
}
