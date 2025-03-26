const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    grade: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['boulder', 'sport', 'trad']
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    attempts: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    climbingLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    routes: [routeSchema],
    sessions: [sessionSchema]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        // Update passwordChangedAt field
        this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after password change
        
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    
    return resetToken;
};

module.exports = mongoose.model('User', userSchema); 