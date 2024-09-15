// api/youtube.js
const express = require('express');
const { detoxify } = require('../controllers/youtubeController');

const app = express();

app.use(express.json());

app.post('/detoxify', detoxify);

module.exports = app;
