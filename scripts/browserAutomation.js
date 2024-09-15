const puppeteer = require('puppeteer');

async function loginAndSearch(userEmail, userPassword, searchQuery) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.youtube.com');
        await page.click('ytd-button-renderer.style-scope.ytd-topbar-menu-button-renderer');
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', userEmail);
        await page.click('#identifierNext');
        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="password"]', userPassword);
        await page.click('#passwordNext');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await page.type('input#search', searchQuery);
        await page.click('button#search-icon-legacy');
        await page.waitForSelector('ytd-video-renderer');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

module.exports = { loginAndSearch };
