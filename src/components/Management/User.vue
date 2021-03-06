<!--
程序名：用户管理
功能：管理网站的所有用户
-->
<template>
  <section>
    <!--工具条-->
    <el-col
      :span="24"
      class="el-table_headtoolbar"
      style="padding-bottom: 15px;"
    >
      <el-col :span="4" :offset="20">
        <el-button plain type="primary" icon="el-icon-plus" @click="addUser()"
          >添加用户</el-button
        >
      </el-col>
    </el-col>
    <el-table
      :data="userList"
      :default-sort="{ prop: 'date', order: 'descending' }"
      :height="screenHeight"
      border
    >
      <el-table-column prop="sn" sortable label="编号"> </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="fullName" label="姓名"> </el-table-column>
      <el-table-column label="是否为管理员">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.administrator"
            active-text="是"
            inactive-text="否"
            @change="changeAdministrator(scope.$index, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabledMark"
            active-text="是"
            inactive-text="否"
            @change="changeEnabledMark(scope.$index, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="right" fixed="right" width="300">
        <template slot="header">
          <el-autocomplete
            class="input-with-select"
            v-model="queryString"
            size="mini"
            :fetch-suggestions="querySearch"
            placeholder="输入姓名搜索"
            :trigger-on-focus="true"
            @select="handleSelect"
            clearable
          >
          </el-autocomplete>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="resetPassword(scope.$index, scope.row)"
            >重置密码</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--翻页栏-->
    <el-col :span="24" class="el-table_footertoolbar">
      <el-pagination
        :hide-on-single-page="false"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 20, 50, 100]"
        :total="records"
        style="float:right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-col>

    <!--保存用户界面-->
    <el-dialog :title="fromTitle" :visible.sync="formVisible" width="25%">
      <el-form :model="profile" :rules="profileRules" ref="profile">
        <el-form-item label="登录账户" prop="account" style="width: 100%;">
          <el-input
            v-model="profile.account"
            auto-complete="off"
            @keyup.enter.native="formSubmit()"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullName" style="width: 100%;">
          <el-input
            v-model="profile.fullName"
            auto-complete="off"
            @keyup.enter.native="formSubmit()"
          ></el-input>
        </el-form-item>

        <el-form-item label="是否为管理员" style="width: 100%;">
          <el-switch
            v-model="profile.administrator"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="备注" style="width: 100%;">
          <el-input
            v-model="profile.remarks"
            @keyup.enter.native="formSubmit()"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="width: 100%;">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="formSubmit()"
          :loading="formLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userList: [], //用户信息
      queryUserList: [], //用户信息 用户搜索框查询使用
      queryString: "", //搜索条件
      screenHeight: window.innerHeight - 220, //当前窗体高度-导航栏高度
      //分页信息
      page: 1, //当前页
      rows: 10, //页面数据数量
      total: 1, //页数
      records: 10, //总数
      profile: {
        //保存用户信息
        account: "", //账户名称
        password: "0000", //密码
        fullName: "", //姓名
        remarks: "", //备注
        administrator: false, //是否为管理员
        sn: "" //用戶SN
      },
      profileRules: {
        //表单用户信息的格式显示
        account: [
          {
            required: true,
            message: "账户必须填写!!",
            trigger: "blur"
          }
        ],
        fullName: [
          {
            required: true,
            message: "姓名必须填写!!",
            trigger: "blur"
          }
        ]
      },
      formVisible: false, //表单的打开和关闭的控制
      formLoading: false, //表单
      fromTitle: "新增用户" //
    };
  },
  methods: {
    //删除用户信息
    handleDelete(index, row) {
      this.$confirm("确认要删除此用户信息吗？", "提示", {}).then(() => {
        this.$axios.delete(`/user/${row.sn}`).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.loading = false;
            this.getAllUserList();
            this.defaultActive = 1;
          } else {
            this.$message({
              type: "error",
              message: data.msg
            });
          }
        });
      });
    },
    //重置用户密码
    resetPassword(index, row) {
      this.$confirm("确认要重置密码吗？", "提示", {}).then(() => {
        this.$axios.post(`/user/resetUserPassword/${row.sn}`).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "重置密码成功，重置密码为0000!"
            });
            this.loading = false;
            this.getAllUserList();
            this.defaultActive = 1;
          } else {
            this.$message({
              type: "error",
              message: data.msg
            });
          }
        });
      });
    },
    //搜索
    querySearch(queryString, cb) {
      if (queryString == "" || queryString == null) {
        this.getAllUserList();
      }

      this.getAllUsers();
      let userList = this.queryUserList;
      let users = queryString
        ? userList.filter(this.createFilter(queryString))
        : userList;
      let userValue = [];
      users.forEach(user => {
        userValue.push({ value: user.fullName });
      });
      // 调用 callback 返回建议列表的数据
      cb(userValue);
    },
    createFilter(queryString) {
      return user => {
        return (
          user.fullName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    handleSelect(item) {
      console.log(item);
      this.queryString = item.value;
      this.getAllUserList();
    },
    //获取用户列表
    getAllUserList() {
      this.$axios
        .get("/user/queryGridJson", {
          params: {
            queryJson: this.queryString,
            page: this.page, //当前页
            rows: this.rows, //页面数据数量
            total: this.total, //页数
            records: this.records, //总数
            code: ""
          }
        })
        .then(res => {
          let userData = res.data.data;
          if (userData !== null) {
            this.userList = userData.rows;
            this.page = userData.page;
            this.rows = userData.pagesize;
            this.total = userData.total;
            this.records = userData.records;
          }
        });
    },
    //获取所有的用户信息，不包含查询和分页
    getAllUsers() {
      this.$axios
        .get("/user/queryGridJson", {
          params: {
            rows: 99999 //页面数据数量
          }
        })
        .then(res => {
          this.queryUserList = res.data.data.rows;
        });
    },
    //翻页
    handleSizeChange(size) {
      this.rows = size;
      this.getAllUserList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAllUserList();
    },
    //保存用户信息
    formSubmit() {
      this.$refs.profile.validate(valid => {
        if (valid) {
          debugger;
          if (this.verifyUserName(this.profile.account) != null) {
            this.formVisible = false;
            this.$message({
              type: "info",
              message: "保存失败!用户名冲突!!!"
            });
            return;
          }
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.formLoading = true;

            if (this.profile.sn === "") {
              this.profile.password = this.$md5(this.profile.password);
            }
            console.log(this.profile);
            this.$axios.post("/user/saveUserInfo", this.profile).then(res => {
              this.formLoading = false;
              if (res.data.code == 200) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.$refs["profile"].resetFields();
                this.getAllUserList();
              } else {
                this.$message({
                  type: "error",
                  message: "保存失败!"
                });
              }
              this.formVisible = false;
            });
          });
        }
      });
    },
    //打开添加用户表单
    addUser() {
      this.fromTitle = "新增用户";
      //初始化表单
      this.profile = {
        account: "", //账户名称
        password: "0000", //密码
        fullName: "", //姓名
        remarks: "", //备注
        administrator: false, //是否为管理员
        sn: "" //用戶SN
      };
      this.formVisible = true;
    },
    //打开编辑用户表单
    handleEdit(index, row) {
      this.fromTitle = "编辑用户信息";
      //初始化表单
      this.profile = {
        account: row.account, //账户名称
        fullName: row.fullName, //姓名
        remarks: row.remarks, //备注
        administrator: row.administrator, //是否为管理员
        sn: row.sn //用戶SN
      };
      this.formVisible = true;
    },
    //改变管理员状态
    changeAdministrator(index, row) {
      this.$confirm("是否确认更改当前用户的管理员状态？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$axios.post(`/user/adminState/${row.sn}`).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "更改管理员状态成功"
              });
            } else if (res.data.code == 400) {
              this.$message.error("更改管理员状态失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更改"
          });
          this.getAllUserList();
        });
    },
    //更改账户启用状态
    changeEnabledMark(index, row) {
      this.$confirm("是否确认更改当前用户的启用状态？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          if (row.enabledMark) {
            this.$axios.post(`/user/enabledUser/${row.sn}`).then(res => {
              let resCode = res.data.code;
              if (resCode == 200) {
                this.$message({
                  type: "success",
                  message: "启用成功"
                });
              } else if (resCode == 400) {
                this.$message.error("启用失败");
              }
            });
          } else {
            this.$axios.post(`/user/disabledUser/${row.sn}`).then(res => {
              let resCode = res.data.code;
              if (resCode == 200) {
                this.$message({
                  type: "success",
                  message: "停用成功"
                });
              } else if (resCode == 400) {
                this.$message.error("停用失败");
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更改"
          });
          this.getAllUserList();
        });
    },
    //验证用户名是否重复
    verifyUserName(name = "") {
      let userList = [];
      this.queryUserList.length > this.userList.length
        ? (userList = this.queryUserList)
        : (userList = this.userList);
      let duplicateUser = userList.find(user => user.account == name);

      return duplicateUser;
    }
  },
  mounted() {
    //监听当前窗口高度
    window.onresize = () => {
      return (() => {
        this.screenHeight = window.innerHeight - 220;
      })();
    };
    this.getAllUserList();
  }
};
</script>
<style></style>
