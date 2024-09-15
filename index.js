// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const youtubeRoutes = require('./routes/youtubeRoutes');
const userRoutes = require('./routes/userRoutes');
require('./config/cron'); // Include cron job

dotenv.config();
const app = express();

app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/youtube', youtubeRoutes);
app.use('/api/user', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the YouTube Detoxifier API. Use /api/youtube for YouTube operations.');
});

// Server Listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
