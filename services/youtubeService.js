// services/youtubeService.js
const puppeteer = require('puppeteer');

const searchAndInteractWithYouTube = async (email, password, searchQuery) => {
    const browser = await puppeteer.launch({ headless: false }); // Set to true if you don't want to see the browser
    const page = await browser.newPage();

    try {
        // Open YouTube and log in
        await page.goto('https://www.youtube.com');
        await page.waitForSelector('button[aria-label="Sign in"]');
        await page.click('button[aria-label="Sign in"]');
        await page.waitForNavigation();

        // Enter email
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', email);
        await page.click('#identifierNext');
        await page.waitForNavigation();

        // Enter password
        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="password"]', password);
        await page.click('#passwordNext');
        await page.waitForNavigation();

        // Search for the topic
        await page.waitForSelector('input#search');
        await page.type('input#search', searchQuery);
        await page.click('button#search-icon-legacy');
        await page.waitForNavigation();

        // Interact with videos
        const videoLinks = await page.evaluate(() => {
            const links = [];
            document.querySelectorAll('a#video-title').forEach((element) => {
                links.push(element.href);
            });
            return links.slice(0, 5); // Limit to 5 videos
        });

        for (const link of videoLinks) {
            const videoPage = await browser.newPage();
            await videoPage.goto(link);

            // Watch the video for 10 minutes
            await videoPage.waitForTimeout(600000); // 10 minutes in milliseconds

            // Like the video
            await videoPage.waitForSelector('button[aria-label="I like this"]');
            await videoPage.click('button[aria-label="I like this"]');

            await videoPage.close();
        }

    } catch (error) {
        console.error('Error in YouTube automation:', error);
    } finally {
        await browser.close();
    }
};

module.exports = {
    searchAndInteractWithYouTube,
};
