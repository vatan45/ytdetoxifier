const express = require('express');
const router = express.Router();
const { detoxify } = require('../controllers/youtubeController');

// Define the route for detoxify
router.post('/detoxify', detoxify);

module.exports = router;
