const mongoose = require('mongoose');
const mongooseValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }
}, {timestamps: true, minimize: false});

exports.User = mongoose.model('User', userSchema);

const boardSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },

    public: {
        type: Boolean,
        default: false
    },

    notes: [{
        content: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true, minimize: false});

boardSchema.plugin(mongooseValidator);

exports.Board = mongoose.model('Board', boardSchema);
