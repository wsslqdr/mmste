let express = require("express")
let User = require("./user")
let Sponsor = require("./sponsor")
let Members = require("./members")
let router = express.Router();
let md5 = require("blueimp-md5")
//注册
router.post("/user/register", function (req, res) {
    var body = req.body;
    console.log(body);
    User.find({
            $or: [
                {username: body.username},
                {nickname: body.nickname}
            ]
        }, function (err, data) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server error'
                })
            }
            if (data.length !== 0) {
                return res.status(200).json({
                    code: 4000,
                    flag: false,
                    message: 'username or nickname already exists!'
                })
            }
            body.token = md5(md5(body.username) + "wailian")
            new User(body).save(function (err, data) {
                if (err) {
                    return res.status(500).json({
                        code: 3000,
                        flag: false,
                        message: '存储失败'
                    })
                }
                return res.status(200).json({
                    code: 2000,
                    flag: true,
                    message: '注册成功'
                })
            })
        }
    )
})
//登录
router.post("/user/login", function (req, res) {
    var body = req.body;
    console.log(body)
    User.findOne({
        username: body.username,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号或密码错误'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '登陆成功',
            "data": {
                token: data.token
            }
        })
    })
})
//获取用户信息
router.get("/user/info", function (req, res) {
    var body = req.query;
    User.findOne({
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: 'missing token'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "Success getting user token.",
            data: {
                nickname: data.nickname,
                id: data._id
            }
        })
    })
})
//退出登录
router.post("/user/logout", function (req, res) {
    var body = req.body;
    User.findOne({token: body.token}, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: 'token不存在'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '退出成功'
        })
    })
})
//验证token
router.post("/user/token", function (req, res) {
    var body = req.body;
    User.findOne({token: body.token}, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: 'token不存在'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: 'token查询成功'
        })
    })
})
//校验密码
router.post("/user/pwd", function (req, res) {
    let body = req.body;
    console.log(req.body)
    User.findOne({
        _id: body.id,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '校验密码错误'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '原密码错误'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '校验密码成功'
        })
    })
})
//修改密码
router.put("/user/pwd", function (req, res) {
    let id = req.body.id;
    User.findOne({
        _id: id
    }, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '修改密码错误'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '修改密码错误'
            })
        }
        data.password = req.body.password;
        User.findOneAndUpdate(id, data, function (err) {
            if (err) {
                return res.status(200).json({
                    code: 3000,
                    flag: false,
                    message: 'findOneAndUpdate 错误'
                })
            }
        })
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '修改密码成功'
        })
    })
})
//admin页面获取所有用户信息
router.get("/user/admin", function (req, res) {
    User.find({}, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '查询用户信息失败！'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '查询所有用户信息成功',
            data: {
                total: data.length,
                rows: data
            }
        })
    })
})
//admin页面修改管理权限
router.put("/user/admin", function (req, res) {
    User.findByIdAndUpdate(req.body.user._id, req.body.user, function (err) {
        console.log(req.body.user._id)
        console.log(req.body)
        if (err) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '修改失败！'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '设置成功！'
        })
    })
})
//admin鉴权
router.get("/user/adminInfo", function (req, res) {
    var body = req.query;
    User.findOne({
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: 'missing token'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "鉴权成功",
            data: {
                admin: data.admin,
                id: data._id
            }
        })
    })
})

//-----------------------------------------------------------------

//部员
router.get("/members/list", function (req, res) {
    Members.find({}, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        let count = data.length
        return res.status(200).json({
            code: 2000,
            flag: true,
            data: {
                total: count,
                rows: data
            },
            message: '查询赞助商成功'
        })
    })
})
//分页查询
router.post("/members/list", function (req, res) {
    let page = req.body.page || 1;
    let size = req.body.size || 20;
    let searchMap = req.body.searchMap || {};
    let obj = {};
    searchMap.MemberNumber ? obj["MemberNumber"] = searchMap.MemberNumber : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.duty ? obj["duty"] = searchMap.duty : obj;
    searchMap.phone ? obj["phone"] = searchMap.phone : obj;
    Members.find(obj, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        let count = data.length;
        Members
            .find(obj)
            .skip((page - 1) * parseInt(size))
            .limit(parseInt(size))
            .exec(function (err, data) {
                if (err) {
                    return res.status(200).json({
                        code: 3000,
                        flag: false,
                        message: 'server error'
                    })
                }
                return res.status(200).json({
                    code: 2000,
                    flag: true,
                    message: '查询成功',
                    data: {
                        total: count,
                        rows: data
                    }
                })
            })
    })
})
//新增部员
router.post("/members", function (req, res) {
    new Members(req.body).save(function (err) {
        if (err) {
            console.log(err)
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '新增失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '新增部员成功'
        })
    })
})
//根据id查询部员
router.get("/members", function (req, res) {
    Members.findById(req.query.id, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '根据id查询失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据id查询成功',
            data: data
        })
    })
})
//根据id修改部员信息
router.put("/members", function (req, res) {
    Members.findByIdAndUpdate(req.body._id, req.body, function (err) {
        console.log(req.body._id)
        console.log(req.body)
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '根据id修改失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据id修改成功'
        })
    })
})
//根据id删除部员信息
router.delete("/members", function (req, res) {
    Members.findByIdAndRemove(req.body.id, function (err) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '根据id删除失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据id删除成功',
        })
    })
})

//------------------------------------------------------------------------

//赞助商
router.get("/sponsor/list", function (req, res) {
    Sponsor.find({}, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        let count = data.length
        return res.status(200).json({
            code: 2000,
            flag: true,
            data: {
                total: count,
                rows: data
            },
            message: '查询赞助商成功'
        })
    })
})
//新增赞助商
router.post("/sponsor", function (req, res) {
    new Sponsor(req.body).save(function (err) {
        if (err) {
            console.log(err)
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '新增失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '新增赞助商成功'
        })
    })
})
//赞助商分页查询
router.post("/sponsor/list", function (req, res) {
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    let searchMap = req.body.searchMap || {};
    let obj = {};
    searchMap.sponsorName ? obj["sponsorName"] = searchMap.sponsorName : obj;
    searchMap.phone ? obj["phone"] = searchMap.phone : obj;
    searchMap.cash ? obj["cash"] = searchMap.cash : obj;
    searchMap.beginDate ? obj["beginDate"] = searchMap.beginDate : obj;
    searchMap.endDate ? obj["endDate"] = searchMap.endDate : obj;
    searchMap.chargeMember ? obj["chargeMember"] = searchMap.chargeMember : obj;
    Sponsor.find(obj, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '所有赞助商查询失败'
            })
        }
        let count = data.length
        Sponsor
            .find(obj)
            .skip((page - 1) * parseInt(size))
            .limit(parseInt(size))
            .exec(function (err, sponsor) {
                if (err) {
                    return res.status(200).json({
                        code: 3000,
                        flag: false,
                        message: '分页赞助商查询失败'
                    })
                }
                return res.status(200).json({
                    code: 2000,
                    flag: true,
                    message: '分页赞助商查询成功',
                    data: {
                        total: count,
                        rows: sponsor
                    }
                })
            })
    })
})
//根据id查询赞助商信息
router.get("/sponsor", function (req, res) {
    Sponsor.findById(req.query.id, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '根据id查询失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据id查询成功',
            data: data
        })
    })
})
//根据id修改赞助商信息
router.put("/sponsor", function (req, res) {
    Sponsor.findByIdAndUpdate(req.body._id, req.body, function (err) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '根据id修改失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据id修改成功'
        })
    })
})
//根据id删除赞助商信息
router.delete("/sponsor", function (req, res) {
    Sponsor.findByIdAndRemove(req.body.id, function (err) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: '根据id删除失败'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据id删除成功'
        })
    })
})

module.exports = router