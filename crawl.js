const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {

  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if(baseURLObj.hostname !== currentURLObj.hostname) {
    console.log(`skipping ${currentURL} because it's from a different domain`);
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if(pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`activley crawling: ${currentURL}`);

  try {
    const response = await fetch(currentURL);

    if(response.status > 399) {
      console.log(`error in fetch with status code ${response.status} on page: ${currentURL}`);
      return pages;
    }

    const contentType = response.headers.get("content-type");
    if(!contentType.includes('text/html')) {
      console.log(`error did not receive html but instead ${contentType} on page: ${currentURL}`);
      return pages;
    }

    const nextURLs = getURLsFromHTML(await response.text(), baseURL);

    for(const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  }
  catch(err) {
    console.log(`Error in fetch: ${err.message} while visting ${currentURL}`);
  }

  return pages;
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
