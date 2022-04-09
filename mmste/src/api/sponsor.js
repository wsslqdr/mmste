import request from "../utils/request";
export default {
  getList() {
    return request({
      url: "/sponsor/list",
      method: "get"
    });
  },
  search(page, size, searchMap) {
    return request({
      url: "/sponsor/list",
      method: "post",
      data: {
        page,
        size,
        searchMap
      }
    });
  },
  add(sponsor) {
    return request({
      url: "/sponsor",
      method: "post",
      data: sponsor
    });
  },
  getById(id) {
    return request({
      url: `/sponsor?id=${id}`,
      method: "get"
    });
  },
  update(sponsor) {
    return request({
      url: `/sponsor`,
      method: "put",
      data: sponsor
    });
  },
  deleteById(id) {
    return request({
      url: "/sponsor",
      method: "delete",
      data: {
        id
      }
    });
  }
};
