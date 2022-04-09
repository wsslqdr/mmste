import axios from "axios";
import { Loading } from "element-ui";

const loading = {
  loadingInstance: null,
  open: function() {
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        text: "加载中~",
        target: ".main",
        background: "rbga(0,0,0,0.5)"
      });
    }
  },
  close: function() {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close();
      this.loadingInstance = null;
    }
  }
};
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    loading.open(); // 打开加载效果
    return config;
  },
  error => {
    // 出现异常
    loading.close(); // 关闭加载效果
    return Promise.reject(error);
  }
);
// 响应拦截器
request.interceptors.response.use(
  response => {
    loading.close(); // 关闭加载效果
    return response;
  },
  error => {
    loading.close(); // 关闭加载效果
    return Promise.reject(error);
  }
);

export default request;
