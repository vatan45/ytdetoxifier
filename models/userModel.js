const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    topics: [String], // Array of topics
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
