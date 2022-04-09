import request from "../utils/request";
import {getUserAdmin} from "./login";

export default {
    getUserData() {
        return request({
            url: `/user/admin`,
            method: 'GET'
        })
    },
    updateAdmin(user) {
        return request({
            url: `/user/admin`,
            method: 'PUT',
            data: {
                user
            }
        })
    },
}
