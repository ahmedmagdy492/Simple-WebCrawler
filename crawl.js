const { JSDOM } = require('jsdom');

async function crawlPage(currentURL) {
  console.log(`activley crawling: ${currentURL}`);

  try {
    const response = await fetch(currentURL);

    if(response.status > 399) {
      console.log(`error in fetch with status code ${response.status} on page: ${currentURL}`);
      return;
    }

    const contentType = response.headers.get("content-type");
    if(!contentType.includes('text/html')) {
      console.log(`error did not receive html but instead ${contentType} on page: ${currentURL}`);
      return;
    }

    console.log(await response.text());
  }
  catch(err) {
    console.log(`Error in fetch: ${err.message} while visting ${currentURL}`);
  }
}

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
  getURLsFromHTML,
  crawlPage
}
