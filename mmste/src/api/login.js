import request from "../utils/request";

export function register(username, nickname, password) {
  return request({
    url: "/user/register",
    method: "post",
    data: {
      username,
      nickname,
      password
    }
  });
}

export function login(username, password) {
  return request({
    url: "/user/login",
    method: "post",
    data: {
      username,
      password
    }
  });
}

export function getUserInfo(token) {
  return request({
    url: `/user/info?token=${token}`,
    method: "get"
  });
}

export function getUserAdmin(token) {
  return request({
    url: `/user/adminInfo?token=${token}`,
    method: "get"
  });
}

export function logout(token) {
  return request({
    url: `/user/logout`,
    method: "post",
    data: {
      token
    }
  });
}

export function examToken(token) {
  return request({
    url: `/user/token`,
    method: "post",
    data: {
      token
    }
  });
}
