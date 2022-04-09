import request from "../utils/request";
export default {
  checkPwd(id, password) {
    console.log(id, password);
    return request({
      url: "/user/pwd",
      method: "post",
      data: {
        id,
        password
      }
    });
  },
  updatePwd(id, password) {
    return request({
      url: "/user/pwd",
      method: "put",
      data: {
        id,
        password
      }
    });
  }
};
