async function getSitemapUrls(sitemapUrl, limit = 2) {
  try {
    const response = await fetch(sitemapUrl);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    let urls = Array.from(xmlDoc.querySelectorAll("loc")).map(
      (loc) => loc.textContent
    );

    // Limit the URLs
    urls = urls.slice(0, limit);

    console.log(`Found ${urls.length} URLs in sitemap (limited to ${limit}).`);
    return urls;
  } catch (error) {
    console.error("Error fetching or parsing sitemap:", error);
    return [];
  }
}

async function extractTextFromUrl(url) {
  try {
    const response = await fetch(url);
    const htmlText = await response.text();

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlText, "text/html");

    // Remove scripts and styles
    const scriptTags = htmlDoc.querySelectorAll('script');
    scriptTags.forEach(script => script.remove());
    const styleTags = htmlDoc.querySelectorAll('style');
    styleTags.forEach(style => style.remove());

    // Remove unwanted tags
    const unwantedTags = htmlDoc.querySelectorAll('nav, footer, aside, header, [aria-hidden="true"]');
    unwantedTags.forEach(tag => tag.remove());

    // Try to extract text from paragraphs first
    let extractedText = "";
    const paragraphs = htmlDoc.querySelectorAll('p');
    if (paragraphs.length > 0) {
      paragraphs.forEach(p => {
        extractedText += (p.textContent || p.innerText) + "\n";
      });
    } else {
      // Fallback to body text if no paragraphs are found
      extractedText = htmlDoc.body.innerText || htmlDoc.body.textContent;
    }

    // Clean up whitespace and line breaks
    extractedText = extractedText.replace(/\s+/g, ' ').trim(); // Remove consecutive whitespace
    extractedText = extractedText.replace(/\n+/g, '\n'); // Remove consecutive line breaks

    return extractedText;
  } catch (error) {
    console.error(`Error fetching or parsing URL ${url}:`, error);
    return "";
  }
}

async function delayedExtractText(url, delay) {
  return new Promise(resolve => {
    setTimeout(async () => {
      const text = await extractTextFromUrl(url);
      resolve(text);
    }, delay);
  });
}

async function getAllTextFromSitemap(sitemapUrl, delay = 500, limit = 2) {
  const urls = await getSitemapUrls(sitemapUrl, limit);
  let allText = "";

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Processing URL ${i + 1} of ${urls.length}: ${url}`);
    const pageText = await delayedExtractText(url, delay);
    allText += pageText + "\n\n"; // Separate pages with two line breaks
    console.log(`Finished processing URL ${i + 1} of ${urls.length}: ${url}`);
  }

  console.log("Finished scraping all URLs.");
  return allText;
}

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

getAllTextFromSitemap("", 500, 1000000)
  .then(allText => {
    download("website_text.txt", allText);
    console.log("Extracted Text:\n", allText);
  })
  .catch(error => {
    console.error("An error occurred:", error);
  });