/**
 * 程序名：Vue全局配置
 * 功能：Vue全局配置
 */
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/display.css";
import "element-ui/lib/theme-chalk/index.css";
import VueClipboard from "vue-clipboard2";
import md5 from "./md5";
import axios from "axios";

Vue.use(VueClipboard);
Vue.use(ElementUI);
Vue.use(md5);
Vue.prototype.$axios = axios;
axios.defaults.baseURL = "/api";
//打包時使用
// axios.defaults.baseURL =
//   "http://crm.hserp.xin:8080/QuestionPaper-0.0.1-SNAPSHOT/";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.withCredentials = true; //设置cross跨域 并设置访问权限 允许跨域携带cookie信息

Vue.config.productionTip = false;

//对返回的状态进行判断，比如token是否过期
axios.interceptors.response.use(
  response => {
    // token 已过期，重定向到登录页面
    if (response.data.message == "需要重新登陆系统") {
      localStorage.clear();
      router.push({
        path: "/"
      });
    }
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});

// //百度统计 id替换为自己的

// var _hmt = _hmt || [];
// window._hmt = _hmt;
// (function() {
//   var hm = document.createElement("script");
//   hm.src = "https://hm.baidu.com/hm.js?9354205e2c5c77a15e07019792243422";
//   var s = document.getElementsByTagName("script")[0];
//   s.parentNode.insertBefore(hm, s);
// })();

// router.afterEach((to, from, next) => {
//   setTimeout(() => {
//     var _hmt = _hmt || [];
//     (function() {
//       //每次执行前，先移除上次插入的代码
//       document.getElementById("baidu_tj") &&
//         document.getElementById("baidu_tj").remove();
//       var hm = document.createElement("script");
//       hm.src = "https://hm.baidu.com/hm.js?9354205e2c5c77a15e07019792243422";
//       hm.id = "baidu_tj";
//       var s = document.getElementsByTagName("script")[0];
//       s.parentNode.insertBefore(hm, s);
//     })();
//   }, 0);
// });
