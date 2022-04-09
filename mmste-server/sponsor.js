const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wailian');

//规则对象
let Schema = mongoose.Schema
let userSchema = new Schema({
    //赞助商名称
    sponsorName: {
        type: String,
        required: true
    },
    //联系方式
    phone: {
        type: String,
        required: true
    },
    //金额
    cash: {
        type: String,
        required: true
    },
    //开始时间
    beginDate:{
        type: String,
        required: true
    },
    //结束时间
    endDate:{
        type: String,
        required: true
    },
    //负责人
    chargeMember:{
        type: String,
        required: true
    }

})
module.exports = mongoose.model('Sponsor', userSchema);


