const { crawlPage, getURLsFromHTML } = require('./crawl.js');

function main() {
  if(process.argv.length < 3) {
    console.log(`Usage: ${process.argv[1]} <url>`);
    process.exit(1);
  }

  try {
    const baseURL = new URL(process.argv[2]);
    console.log(`starting to crawl ${baseURL}...`);

    crawlPage(baseURL);
  }
  catch(err) {
    console.log(err.message);
  }
}

main()
