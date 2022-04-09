import Vue from "vue";
import Router from "vue-router";
import Register from "./views/register";
import Login from "./views/login";
import LayOut from "./components/LayOut";
import Sponsor from "./views/sponsor";
import Home from "./views/home";
import Members from "./views/members";
import Event from "./views/event";
import Admin from './views/admin'

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/register",
            name: "register",
            component: Register
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/",
            name: "layout",
            component: LayOut,
            redirect: "/home"
        },
        {
            path: "/home",
            component: LayOut,
            children: [
                {
                    path: "/",
                    component: Home,
                    meta: {title: "首页"}
                }
            ]
        },
        {
            path: "/members",
            component: LayOut,
            children: [
                {
                    path: "/",
                    component: Members,
                    meta: {title: "部员管理"}
                }
            ]
        },
        {
            path: "/sponsor",
            component: LayOut,
            children: [
                {
                    path: "/",
                    component: Sponsor,
                    meta: {title: "赞助管理"}
                }
            ]
        },
        {
            path: "/event",
            component: LayOut,
            children: [
                {
                    path: "/",
                    component: Event,
                    meta: {title: "活动管理"}
                }
            ]
        },
        {
            path: "/admin",
            component: LayOut,
            children: [
                {
                    path: "/",
                    component: Admin,
                    meta: {title: "账户管理"}
                }
            ]
        }
    ]
});
