const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const detoxify = async (req, res) => {
    const { topic } = req.body;

    let browser;

    try {
        // Launch Puppeteer with chrome-aws-lambda
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true, // Must be headless for serverless environments
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // Go to YouTube (assuming you're already logged in)
        await page.goto('https://www.youtube.com');

        // Wait for the search input field and type the topic
        await page.waitForSelector('input[name="search_query"]', { visible: true });
        await page.type('input[name="search_query"]', topic);

        // Click on the search button
        await page.click('button[id="search-icon-legacy"]');

        // Wait for search results to load
        await page.waitForSelector('ytd-video-renderer');

        // Select the top 10 videos by clicking the video title (anchor tag inside video renderer)
        const videos = await page.$$('ytd-video-renderer');
        const topVideos = videos.slice(0, 10); // Only select the top 10 videos

        for (const video of topVideos) {
            // Click the video title to open the video
            const videoTitle = await video.$('a#video-title');
            if (videoTitle) {
                await videoTitle.click();
            }

            // Wait for the video player to load
            await page.waitForSelector('.html5-video-container');

            // Set video playback speed to 2x
            await page.evaluate(() => {
                const video = document.querySelector('video');
                if (video) {
                    video.playbackRate = 2.0; // Set playback speed to 2x
                }
            });

            // Play video for 15 seconds (since it's 2x speed, it simulates 30 seconds of real time)
            await new Promise(resolve => setTimeout(resolve, 15000)); // Introducing a 15-second wait

            // Like the video
            const likeButton = await page.$('button[aria-label="Like this video"]');
            if (likeButton) {
                await likeButton.click();
            }

            // Subscribe to the channel
            const subscribeButton = await page.$('button[aria-label*="Subscribe"]');
            if (subscribeButton) {
                await subscribeButton.click();
            }

            // Go back to the search results
            await page.goBack();
            await page.waitForSelector('ytd-video-renderer'); // Wait for the videos to appear again
        }

        await browser.close();
        res.status(200).send('Detoxification completed. Watched, liked, and subscribed to the top 10 videos.');
    } catch (error) {
        console.error('Error in YouTube automation:', error);
        if (browser) {
            await browser.close();
        }
        res.status(500).send('Error occurred during detoxification.');
    }
};

module.exports = { detoxify };
