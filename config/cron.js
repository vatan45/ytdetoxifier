const cron = require('node-cron');
const { surfYouTubeForUser } = require('../controllers/youtubeController');
const User = require('../models/userModel');

// Schedule browsing every day at 6 AM
cron.schedule('0 6 * * *', async () => {
    try {
        const users = await User.find();
        for (const user of users) {
            await surfYouTubeForUser({ body: { email: user.email } });
        }
        console.log('Finished daily YouTube browsing.');
    } catch (error) {
        console.error('Error in scheduled task:', error.message);
    }
});
