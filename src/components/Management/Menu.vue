<!--
程序名：网站后台管理的左侧菜单栏
功能：通过route导航到其他页面
-->
<template>
  <el-container style="height: 100%; border: 1px solid #eee;">
    <el-aside width="200px">
      <el-menu router default-active="1-1" style="height: 100%;">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="1-1" route="/management/user"
            >账户管理</el-menu-item
          >
        </el-submenu>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span>题库管理</span>
          </template>
          <el-menu-item index="2-1" route="/management/modular"
            >模板管理</el-menu-item
          >
          <!-- <el-menu-item index="2-2" route='/management/question'>问题管理</el-menu-item>
          <el-menu-item index="2-3" route='/management/classification'>问题分类</el-menu-item> -->
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>问卷管理</span>
          </template>
          <el-menu-item index="3-1" route="/management/auditPaper"
            >问卷审核</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <!-- 引用路由 -->
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style></style>
