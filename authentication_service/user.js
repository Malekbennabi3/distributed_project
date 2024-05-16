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

userSchema.plugin(mongooseValidator);

exports.model = mongoose.model('User', userSchema);
