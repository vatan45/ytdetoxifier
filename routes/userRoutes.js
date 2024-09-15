const express = require('express');
const User = require('../models/userModel');

const router = express.Router();

// POST: Add a user
router.post('/add', async (req, res) => {
    const { email, topic } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, topics: [topic] });
        } else {
            if (!user.topics.includes(topic)) {
                user.topics.push(topic);
            }
        }
        await user.save();
        res.status(201).json({ message: 'User and topic added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Retrieve user topics
router.get('/topics', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
