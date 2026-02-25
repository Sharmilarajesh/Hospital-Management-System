const mongoose = require('mongoose');

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
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient'],
        required: true
    },
    // Doctor specific fields
    specialization: {
        type: String,
        default: null
    },
    experience: {
        type: Number,
        default: null
    },
    phone: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);