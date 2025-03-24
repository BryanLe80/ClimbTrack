const mongoose = require('mongoose');

const climbSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Boulder', 'Sport', 'Trad', 'Top Rope'],
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        // Using standard climbing grade systems
        // Boulders: V0-V15
        // Sport/Trad: 5.0-5.15
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    dateCompleted: {
        type: Date
    },
    notes: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Climb', climbSchema); 