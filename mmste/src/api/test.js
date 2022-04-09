import request from "../utils/request";

// request.get('/db.json').then(res => {
//     console.log("get1", res.data)
// })
//
// request({
//     url: '/db.json',
//     method: 'get'
// }).then(res => {
//     console.log("get2", res.data)
// })

export default {
  getList() {
    return request({
      url: process.env.VUE_APP_BASE_API + "/db.json",
      method: "get"
    });
  }
};
