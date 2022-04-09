import router from "./router";
import {getUserInfo, examToken} from "./api/login";

router.beforeEach((to, from, next) => {
    //获取token
    const token = localStorage.getItem("token");

    async function tokenExam() {
        //检验token 防止篡改也可访问页面
        var data = await examToken(token)
        var isTrue = data.data.flag
        //检验token和token判空
        if (!isTrue || !token) {
            if (to.path === "/login") {
                next();
            } else if (to.path === "/register") {
                next();
            } else {
                next({path: "/login"});
            }
        } else {
            if (to.path === "/login") {
                next();
            } else if (to.path === "/register") {
                next();
            } else {
                const userInfo = localStorage.getItem("user");
                if (userInfo) {
                    next();
                } else {
                    getUserInfo(token).then(res => {
                        const resp = res.data;
                        if (resp.flag) {
                            localStorage.setItem("user", JSON.stringify(resp.data));
                            next();
                        } else {
                            next({path: "/login"});
                        }
                    });
                }
            }
        }
    }

    tokenExam()

});
