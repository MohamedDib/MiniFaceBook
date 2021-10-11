const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 30,
        required: true
    },mail: {
        type: String,
        trim: true,
        maxlength: 30,
        required: true,
        unique: true
    },password: {
        type: String,
        trim: true,
        maxlength: 30,
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
