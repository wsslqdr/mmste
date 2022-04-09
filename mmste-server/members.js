const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wailian');

//规则对象
let Schema = mongoose.Schema
let userSchema = new Schema({
    //赞助商名称
    MemberNumber: {
        type: String,
        required: true
    },
    //联系方式
    name: {
        type: String,
        required: true
    },
    //金额
    duty: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    JoinDate: {
        type: String,
        required: true
    }

})
module.exports = mongoose.model('members', userSchema);


