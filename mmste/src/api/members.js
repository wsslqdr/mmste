import request from "../utils/request";

export default {
  getList() {
    return request({
      url: "/members/list",
      method: "get"
    });
  },
  search(page, size, searchMap) {
    return request({
      url: "/members/list",
      method: "post",
      data: {
        page,
        size,
        searchMap
      }
    });
  },
  add(members) {
    return request({
      url: "/members",
      method: "post",
      data: members
    });
  },
  getById(id) {
    return request({
      url: `/members?id=${id}`,
      method: "get"
    });
  },
  update(members) {
    return request({
      url: "/members",
      method: "put",
      data: members
    });
  },
  deleteById(id) {
    return request({
      url: "/members",
      method: "delete",
      data: {
        id
      }
    });
  }
};
