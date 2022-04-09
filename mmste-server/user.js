const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wailian');

//规则对象
let Schema = mongoose.Schema
let userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: false,
    }
})
module.exports = mongoose.model('User', userSchema);


