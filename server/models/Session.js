const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    duration: {
        type: Number, // in minutes
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['indoor', 'outdoor']
    },
    energyLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    quality: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
        default: 3
    },
    notes: {
        type: String,
        trim: true
    },
    climbs: [{
        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true
        },
        attempts: {
            type: Number,
            required: true,
            min: 0
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema); 