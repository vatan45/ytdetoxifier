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

// Server Listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
