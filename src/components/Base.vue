<!--
程序名：网站导航栏
功能：网站顶部导航栏
-->
<template>
  <div class="main">
    <!-- 电脑显示 -->
    <el-container class="hidden-xs-only">
      <el-header>
        <div class="logo" @click="toIndex">
          <img src="/static/images/hslogo.png" class="logoImg" />
          <span style="color: #303133">华砂信息</span>
          <span
            style="font-size: 13px;margin-left: 5px;color: #606266;height:200px"
            >——客户信息调查系统</span
          >
        </div>
        <div style="float: right;margin-right: 50px;line-height: 60px;">
          <!-- 未登录时显示 -->
          <template v-if="!showname">
            <el-button
              type="primary"
              plain
              style="font-size: 15px;"
              @click="toLogin"
              >登录</el-button
            >
            <!-- <el-button plain style="font-size: 15px;" @click="toRegiste">注册</el-button> -->
          </template>
          <!-- 登录时显示 -->
          <template v-else>
            <!-- 登录成功，显示用户名 -->
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <!-- 退出登录 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">问卷管理</el-dropdown-item>
                <el-dropdown-item command="b" v-if="administrator"
                  >后台管理</el-dropdown-item
                >
                <el-dropdown-item command="d">修改密码</el-dropdown-item>
                <el-dropdown-item command="c">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <router-view @state="state" />
      </el-main>
    </el-container>
    <!-- 手机显示 -->
    <el-container class="hidden-sm-and-up">
      <el-header>
        <div class="logo-xs" @click="toIndex">
          <img src="/static/images/hslogo.png" class="logoImg" />
          <span style="color: #303133">华砂信息</span>
          <span
            class="hidden-md-and-down"
            style="font-size: 13px;margin-left: 5px;color: #606266;height:200px"
            >——客户信息调查系统</span
          >
        </div>
        <div style="float: right;line-height: 60px;">
          <!-- 未登录时显示 -->
          <template v-if="!showname">
            <el-button
              type="primary"
              plain
              style="font-size: 15px;"
              @click="toLogin"
              >登录</el-button
            >
            <!-- <el-button plain style="font-size: 15px;" @click="toRegiste">注册</el-button> -->
          </template>
          <!-- 登录时显示 -->
          <template v-else>
            <!-- 登录成功，显示用户名 -->
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <!-- 退出登录 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">问卷管理</el-dropdown-item>
                <el-dropdown-item command="b" v-if="administrator"
                  >后台管理</el-dropdown-item
                >
                <el-dropdown-item command="d">修改密码</el-dropdown-item>
                <el-dropdown-item command="c">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <router-view @state="state" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "Base",
  data: function() {
    return {
      showname: false, //登录，注册按钮的显示状态
      username: "", //用户名
      administrator: false //是否为管理员
    };
  },
  methods: {
    //跳转到主页
    toIndex() {
      this.$router.push({ path: "/home" });
    },
    // 跳转问卷管理页面方法
    toHome() {
      this.$router.push({ path: "/home" });
    },
    // 跳转登录页面方法
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    //跳转到修改密码页面
    toChangePassword() {
      this.$router.push({ path: "/changePassword" });
    },
    // 跳转注册页面方法
    toRegiste() {
      this.$router.push({ path: "/register" });
    },
    //跳转到后台管理用户管理页面
    toManage() {
      this.$router.push({ path: "/management/user" });
    },
    //判断session中是否存在数据，存在将showname置为true，否则false
    state() {
      if (sessionStorage.getItem("account") != null) {
        this.showname = true;
        this.username = sessionStorage.getItem("account");
        this.isUserAdmin();
      } else {
        this.showname = false;
      }
    },
    //下拉菜单操作
    handleCommand(command) {
      switch (command) {
        case "a":
          this.toHome();
          break;
        case "b":
          this.toManage();
          break;
        case "c":
          this.exit();
          break;
        case "d":
          this.toChangePassword();
          break;
        default:
          break;
      }
    },

    //登出
    exit(command) {
      sessionStorage.clear(); //登出成功，清空session
      this.state(); // 调用state方法
      this.toLogin(); // 调用toLogin方法
    },
    //判断当前用户是否为管理员
    isUserAdmin() {
      this.$axios.get("/user/currentUser").then(data => {
        this.administrator = data.data.data.administrator;
      });
    }
  },
  // 页面初始化
  mounted() {}
};
</script>
<style scoped>
.main {
  position: absolute;
  width: 100%;
  height: 100%;
}
/* logo图片样式 */
.logoImg {
  width: 30px;
  vertical-align: middle;
}
/* logo框样式 */
.logo {
  height: 60px;
  display: inline-block;
  line-height: 60px;
  font-size: 20px;
  position: absolute;
  left: 100px;
  color: #303133;
  cursor: pointer;
}
.logo-xs {
  height: 60px;
  display: inline-block;
  line-height: 60px;
  font-size: 20px;
  position: absolute;
  left: 20px;
  color: #303133;
  cursor: pointer;
}

.el-header {
  border-bottom: 2px solid #409eff;
  background-color: white;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
