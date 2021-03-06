<!--
程序名：网站登录页面
功能：进入网站的入口
-->
<template>
  <div class="login">
    <div class="main_login">
      <div class="title">登 录</div>
      <el-row type="flex" justify="center">
        <!-- 登录表单 -->
        <el-form ref="loginForm" :rules="rules" :model="loginForm">
          <el-form-item prop="account">
            <el-input
              @keyup.enter.native="login('loginForm')"
              icon="el-icon-search"
              placeholder="请输入用户名"
              v-model="loginForm.account"
            >
              <i class="el-icon-user" slot="prefix"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              @keyup.enter.native="login('loginForm')"
              placeholder="请输入密码"
              v-model="loginForm.password"
              show-password
            >
              <i class="el-icon-lock" slot="prefix"></i>
            </el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click.prevent="login('loginForm')"
              :loading="loading"
              style="text-align: center;width: 150px"
              >{{ messagesStr }}</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import axios from "axios";
import qs from "qs";
export default {
  name: "Login",
  data() {
    return {
      // 表单数据
      loginForm: {
        account: "", //用户名
        password: "", //密码
        tenant: "ZZHS", //租户
        token: "" //登录后获取的token
      },
      loading: false, //加载状态
      messagesStr: "登 录", //登录状态提示
      rules: {
        //表单验证（用户名验证规则）
        account: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { max: 20, message: "账号长度最长20位", trigger: "blur" }
        ],
        //表单验证（密码验证规则）
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  //页面初始化
  mounted() {
    this.clearAccount();
  },
  //方法定义
  methods: {
    //登录方法
    login(formName) {
      // 表单验证通过，可进行操作
      this.$refs[formName].validate(valid => {
        this.loading = true;
        this.messagesStr = "登录中...";
        let params = new URLSearchParams();
        params.append("account", this.loginForm.account); //用户名
        params.append("password", this.$md5(this.loginForm.password)); //密码md5加密
        params.append("tenant", this.loginForm.tenant); //租户标识
        if (valid) {
          this.$axios.post("/user/login", params).then(res => {
            this.loading = false;
            this.messagesStr = "登 录";
            if (res.data.code == 200) {
              //将后端返回的token保存在headers中
              this.token = res.data.data;
              //登录成功，并提示
              this.$notify({
                type: "success",
                message: "欢迎你," + this.loginForm.account + "!",
                duration: 3000
              });
              this.$router.push({ path: "/home" }); //跳转到用户主页面
              sessionStorage.setItem("account", this.loginForm.account); //将用户名存入session中

              this.$emit("state");
            } else {
              if (res.data.code == 404) {
                //不存在
                this.$message({
                  type: "error",
                  message: "该账户不存在",
                  showClose: true
                });
              } else {
                //账号或密码错误提示
                this.$message({
                  type: "error",
                  message: "账号或密码错误",
                  showClose: true
                });
              }
            }
          });
        } else {
          return false; //表单验证错误返回false
        }
      });
    },

    clearAccount() {
      sessionStorage.clear(); //清空session
      this.$emit("state"); // 调用state方法

      //配置登录后将token放入headers,所有请求都会携带这个参数,并且配置请求格式
      this.$axios.interceptors.request.use(
        config => {
          if (this.token != null && config.url != "/user/login") {
            config.data = qs.stringify({ ...config.data });
            config.params = { ...config.params };
            //config.headers["Content-Type"] = "application/json";
            config.headers["ylhsAccessToken"] = this.token;
          }
          if (config.method === "post") {
            config.headers["Content-Type"] =
              "application/x-www-form-urlencoded";
          }
          return config;
        },
        function(error) {
          return Promise.reject(error);
        }
      );
    }
  }
};
</script>

<style scoped>
/* 主页面样式 */
.login {
  position: absolute; /*绝对定位*/
  width: 100%;
  height: 100%;
  background-color: #e4e7ed;
}
/* 标题样式 */
.title {
  font-size: large; /*字体大小*/
  font-weight: bolder; /*字体加粗*/
  text-align: center;
  color: black;
}
/* 登录部分div样式 */
.main_login {
  position: absolute;
  left: 48%;
  top: 40%;
  width: 320px;
  height: 250px;
  margin: -190px 0 0 -190px;
  padding: 40px;
  border-radius: 5px; /*圆角边框*/
  background: #f2f6fc;
}
/* 表单样式 */
.el-form {
  padding-top: 5%;
  padding-left: 10%;
  padding-right: 10%;
  width: 280px;
}
/* .el-row标签样式 */
.el-row {
  height: 100%;
  width: 100%;
}
/* 文字链接div样式 */
.link {
  margin-top: -13%;
  text-align: center; /* 文本居中 */
  margin-left: -5%;
}
/* 文字链接样式 */
.el-link {
  margin-left: 8px;
  line-height: 20px;
  font-size: 8px;
}
</style>
