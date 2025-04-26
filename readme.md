# Website Text Extractor

This JavaScript code extracts text content from a website for use with Large Language Models (LLMs) or other text analysis purposes. It leverages the website's `sitemap.xml` to discover all pages and then scrapes the text from each page, removing irrelevant elements and cleaning up whitespace for better LLM input.

## Features

*   **Sitemap-Driven:** Efficiently discovers all pages to scrape using the `sitemap.xml` file.
*   **Content Extraction:** Extracts visible text content from each page, focusing on the main content areas.
*   **Element Removal:** Removes `<script>`, `<style>`, `<nav>`, `<footer>`, `<aside>`, and `<header>` elements, as well as elements with `aria-hidden="true"` to reduce noise.
*   **Whitespace Cleaning:** Removes excessive whitespace and line breaks to improve text formatting.
*   **Paragraph Extraction:** Prioritizes text extraction from `<p>` elements when available, falling back to the entire `body` text if not.
*   **Rate Limiting:** Includes a configurable delay between requests to avoid overloading the server and potential blocking.
*   **Progress Logging:** Logs the progress of the scraping process to the console, showing which URLs are being processed.
*   **Automatic Download:** Automatically downloads the extracted text as a `.txt` file.
*   **Limited Testing Mode:** Allows you to process only the first few links of the sitemap to speed up testing and debugging.

## Usage

1.  **Open Chrome Developer Tools:**
    *   Navigate to the target website in your Chrome browser.
    *   Press `Ctrl+Shift+J` (Windows/Linux) or `Cmd+Option+J` (Mac) to open the Developer Tools.

2.  **Paste the Code:**
    *   Select the "Console" tab in the Developer Tools.
    *   Copy the entire JavaScript code from this repository and paste it into the console.

3.  **Press Enter:**
    *   Press the Enter key to execute the code.

4.  **Monitor the Console:**
    *   Observe the console output for progress updates and any error messages. The script will log each URL being processed.

5.  **Download the Output:**
    *   Once the script finishes, a file will automatically be downloaded to your computer's default download location.

## Configuration

The following parameters can be adjusted directly in the JavaScript code:

*   **`sitemapUrl`:** The URL of the `sitemap.xml` file.  Modify this to point to the correct sitemap.

*   **`delay`:** The delay in milliseconds between requests.  The default value is `500` (0.5 seconds).  Increase this value if you encounter rate limiting or blocking issues.

*   **`limit`:** The number of URLs to process from the sitemap. The default is `2` for fast testing. Set to `undefined` to remove the limit and process the entire sitemap (or comment out the `limit` parameter in the function calls).

*   **CSS Selectors:** The CSS selectors used in the `extractTextFromUrl` function (e.g., `p`, `nav`, `footer`) can be modified to target specific content areas or remove different elements based on the website's structure.

## Code Structure

*   **`getSitemapUrls(sitemapUrl, limit)`:** Fetches and parses the `sitemap.xml` file, returning an array of URLs.  An optional `limit` parameter allows you to process only a subset of the URLs.

*   **`extractTextFromUrl(url)`:** Fetches the content of a given URL, extracts the visible text, removes unwanted elements, and cleans up whitespace.

*   **`delayedExtractText(url, delay)`:** Wraps the `extractTextFromUrl` function in a `setTimeout` call to introduce a delay between requests.

*   **`getAllTextFromSitemap(sitemapUrl, delay, limit)`:** Orchestrates the entire process: fetching URLs from the sitemap, extracting text from each URL, and concatenating the results.

*   **`download(filename, text)`:** Downloads the extracted text to a local file.

## Important Considerations

*   **robots.txt:** Always check the target website's `robots.txt` file to ensure that you are not scraping disallowed sections of the site.

*   **Website Changes:** Websites change their structure frequently. This code might need to be adjusted if the target website updates its HTML.

*   **Legal and Ethical Considerations:** Respect the website's terms of service. Avoid scraping excessively or in a way that could harm the website's performance. Be aware of copyright laws and fair use principles.

*   **JavaScript Rendering:** Some websites rely heavily on JavaScript to render content. If the text you need is only loaded by JavaScript, this simple scraping method will fail. You would need a more sophisticated approach using tools like Puppeteer or Selenium, which can execute JavaScript and render the page before extracting the text.

## Disclaimer

This code is provided as-is, with no guarantees of functionality or suitability for any particular purpose. Use it at your own risk. The author is not responsible for any damages or legal issues arising from the use of this code.