<!--
程序名：问卷设计主页面
功能：对问卷进行设计
-->
<template>
  <div class="home">
    <el-row>
      <!-- 左侧问卷记录 -->
      <el-col
        :xs="xsLeftSpan"
        :sm="{ span: 3 }"
        :md="{ span: 4 }"
        :lg="{ span: 5 }"
        :xl="{ span: 6 }"
      >
        <!--操作栏-->
        <div class="opera">
          <el-tooltip
            class="item"
            effect="dark"
            content="创建问卷"
            placement="bottom"
          >
            <el-button
              icon="el-icon-plus"
              type="text"
              class="rightButton"
              @click="addWjButtonClick"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑问卷"
            placement="bottom"
          >
            <el-button
              icon="el-icon-edit"
              type="text"
              class="rightButton"
              @click="editWj"
              :disabled="nowSelect.sn == null"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            v-if="nowSelect.auditStatus"
            :content="nowSelect.queStatus == 0 ? '发布问卷' : '暂停问卷'"
            placement="bottom"
          >
            <el-button
              :icon="
                nowSelect.queStatus == 0
                  ? 'el-icon-video-play'
                  : 'el-icon-video-pause'
              "
              type="text"
              class="rightButton"
              @click="pushWj"
              :disabled="nowSelect.sn == null"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="预览问卷"
            placement="bottom"
          >
            <el-button
              icon="el-icon-view"
              type="text"
              class="rightButton"
              @click="previewWj"
              :disabled="nowSelect.sn == null"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除问卷"
            placement="bottom"
          >
            <el-button
              icon="el-icon-delete"
              type="text"
              class="rightButton"
              @click="deleteWj"
              :disabled="nowSelect.sn == null"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="分享问卷"
            placement="bottom"
          >
            <el-button
              icon="el-icon-share"
              type="text"
              class="rightButton"
              @click="shareWj"
              :disabled="nowSelect.sn == null"
            ></el-button>
          </el-tooltip>
          <!-- 关闭问卷列表 -->
          <el-tooltip
            class="item hidden-sm-and-up"
            style="margin-right:5px; margin-left:50px; "
            effect="dark"
            content="折叠"
            placement="bottom"
          >
            <el-button
              icon="el-icon-d-arrow-left"
              type="text"
              class="rightButton"
              style="font-weight: bold;color: rgb(1,171,158)"
              @click="closeRightCol"
            ></el-button>
          </el-tooltip>
        </div>

        <!--左侧导航栏-->
        <el-menu
          :default-active="defaultActive.toString()"
          v-loading="loading"
          class="menu"
        >
          <!--问卷列表-->
          <div
            style="width:100%;text-align: center;font-size: 15px;line-height: 20px;margin-top: 20px;color: #303133"
            v-if="nowSelect.sn == null"
          >
            点击上方&nbsp;+&nbsp;创建第一个问卷
          </div>
          <el-menu-item
            v-for="(item, index) in wjList"
            :key="(index + 1).toString()"
            :index="(index + 1).toString()"
            @click="wjClick(item.sn, index)"
          >
            <i class="el-icon-tickets"></i>
            <span slot="title" style="display: inline-block">
              {{ item.queTitle }}
              <span
                style="color: #F56C6C;font-size: 13px;"
                v-if="item.queStatus == 0 && item.auditStatus"
              >
                <i
                  class="el-icon-link"
                  style="margin:0;font-size: 13px;color: #F56C6C;width:10px;"
                ></i>
                未发布
              </span>
              <span
                style="color: #67C23A;font-size: 13px;"
                v-if="item.queStatus == 1 && item.auditStatus"
              >
                <i
                  class="el-icon-link"
                  style="margin:0;font-size: 13px;color: #67C23A;width:10px;"
                ></i>
                已发布
              </span>
              <span
                style="color: #F56C6C;font-size: 13px;"
                v-if="!item.auditStatus"
              >
                <i
                  class="el-icon-link"
                  style="margin:0;font-size: 13px;color: #67C23A;width:10px;"
                ></i>
                待审核
              </span>
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col
        :xs="xsRightSpan"
        :sm="{ span: 21 }"
        :md="{ span: 20 }"
        :lg="{ span: 19 }"
        :xl="{ span: 18 }"
      >
        <!--标签页-->
        <el-tabs
          type="border-card"
          v-model="activeName"
          :before-leave="openLeftCol"
        >
          <el-tab-pane name="openLeftCol" class="hidden-sm-and-up">
            <span slot="label" style="padding: 8px">
              <div
                class="el-icon-d-arrow-right hidden-sm-and-up"
                style="font-weight: bold;color: rgb(1,171,158)"
              />
            </span>
          </el-tab-pane>
          <el-tab-pane label="问卷设计" name="wjsj">
            <!--内容区域-->
            <div class="content" ref="questionDiv">
              <div v-show="nowSelect.sn == 0 || nowSelect.sn == null">
                请先选择问卷
              </div>
              <design
                ref="design"
                v-show="nowSelect.sn != null"
                @divScroll="divScroll"
                @setDivScroll="setDivScroll"
              ></design>
            </div>
          </el-tab-pane>
          <el-tab-pane label="回答统计" name="hdtj">
            <div class="content" ref="pdf">
              <div v-show="nowSelect.sn == 0 || nowSelect.sn == null">
                请先选择问卷
              </div>
              <data-show
                ref="dataShow"
                v-show="nowSelect.sn != null"
              ></data-show>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!--添加问卷弹窗-->
    <el-dialog
      :title="formTitle"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :width="`${this.dialogWidth}%`"
    >
      <el-form ref="willAddWj" :model="willAddWj">
        <el-form-item label="问卷标题" style="width: 100%;" required>
          <el-input
            v-model="willAddWj.queTitle"
            placeholder="请输入问卷标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="问卷描述" style="width: 100%;">
          <el-input
            v-model="willAddWj.queDescribe"
            type="textarea"
            placeholder="请输入问卷描述"
            rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%;text-align: right">
        <el-button style="margin-left: 10px;" @click="openTemp"
          >从模板库创建</el-button
        >
        <el-button style="margin-left: 10px;" @click="dialogShow = false"
          >取消</el-button
        >
        <el-button type="primary" style="margin-left: 10px;" @click="addWj"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!--模板库弹窗-->
    <el-dialog
      title="模板库"
      :visible.sync="tempDialog"
      :close-on-click-modal="false"
      class="dialog"
      :width="`${this.dialogWidth}%`"
    >
      <el-input
        placeholder="请输入关键词搜索"
        prefix-icon="el-icon-search"
        v-model="tempSearchText"
      ></el-input>
      <el-table
        :data="tempData"
        style="width: 100%;"
        v-loading="tempLoading"
        element-loading-text="加载中..."
      >
        <el-table-column
          prop="queTitle"
          label="模板名"
          width="250"
        ></el-table-column>
        <el-table-column prop="useCount" label="使用次数"></el-table-column>
        <el-table-column label="预览">
          <el-link slot-scope="scope" type="primary" @click="lookTempWj(scope)"
            >预览</el-link
          >
        </el-table-column>
        <el-table-column label="操作">
          <el-link slot-scope="scope" type="primary" @click="useTemp(scope)"
            >使用此模板</el-link
          >
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="tempPage.total"
        @current-change="changeTempPage"
        :page-size="5"
      ></el-pagination>
    </el-dialog>

    <!--分享问卷弹窗-->
    <el-dialog
      title="分享问卷"
      :visible.sync="shareDialogShow"
      :close-on-click-modal="true"
      class="dialog"
      @opened="makeQrcode"
      :width="`${this.dialogWidth}%`"
    >
      <el-form ref="form" :model="shareInfo">
        <el-form-item label="问卷链接" style="width: 100%;">
          <el-row>
            <el-col
              :xs="{ span: 24 }"
              :sm="{ span: 16 }"
              :md="{ span: 16 }"
              :lg="{ span: 16 }"
              :xl="{ span: 16 }"
            >
              <el-input v-model="shareInfo.url" readonly></el-input>
            </el-col>
            <el-col
              :xs="{ span: 24 }"
              :sm="{ span: 8 }"
              :md="{ span: 8 }"
              :lg="{ span: 8 }"
              :xl="{ span: 8 }"
            >
              <el-button
                style="margin-left: 5px;"
                v-clipboard:copy="shareInfo.url"
                v-clipboard:success="copySuccess"
                v-clipboard:error="copyError"
                >复制</el-button
              >
              <el-button style="margin-left: 5px;" @click="openShareUrl"
                >打开</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="二维码" style="width: 100%;">
          <canvas id="canvas" style="width: 150px;height: 150px;"></canvas>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Design from "./Design.vue";
import DataShow from "./DataShow.vue";
import ElButton from "../../node_modules/element-ui/packages/button/src/button";
import QRCode from "qrcode";
export default {
  components: {
    ElButton,
    Design,
    QRCode,
    DataShow
  },
  data() {
    return {
      defaultActive: 1, //当前激活菜单
      formTitle: "添加问卷",
      activeName: "wjsj", //标签页当前选择项
      wjList: [], //问卷列表
      loading: false, //是否显示加载中
      dialogShow: false, //添加问卷弹窗是否显示
      shareDialogShow: false, //分享问卷弹窗是否显示
      tempDialog: false, //模板库弹窗是否显示
      tempData: [], //模板信息
      tempPage: {
        //模板分页信息
        page: 1, //当前页
        rows: 10, //页面数据数量
        total: 1, //页数
        records: 10 //总数
      },
      tempLoading: false, //模板加载状态
      tempSearchText: "", //模板查询信息
      willAddWj: {
        sn: "", //问卷标识
        queTitle: "", //问卷标题
        queDescribe:
          "感谢您能抽时间参与本次问卷，您的意见和建议就是我们前行的动力！" //问卷描述
      },
      shareInfo: {
        url: ""
      },
      divScrollHeight: 0, //问卷设计页面浏览高度
      xsLeftSpan: 0, //小屏幕左侧占比
      xsRightSpan: 24, //小屏幕左侧占比
      xsWidows: false, //是否为手机打开
      dialogHeight: 70, //弹出dialog的高度百分比
      dialogWidth: 50 //弹出dialog的宽度百分比
    };
  },
  mounted() {
    this.getWjList();
    // this.logincheck();
  },

  computed: {
    //现在选中的问卷信息
    nowSelect() {
      let now = this.wjList[this.defaultActive - 1];
      if (this.wjList.length == 0) {
        return {
          sn: null,
          queTitle: null,
          queDescribe: null,
          queStatus: null,
          auditStatus: null
        };
      }
      return {
        sn: now.sn,
        queTitle: now.queTitle,
        queDescribe: now.queDescribe,
        queStatus: now.queStatus,
        auditStatus: now.auditStatus
      };
    }
  },
  methods: {
    //使用模板
    useTemp(item) {
      this.tempLoading = true;
      this.$axios.put(`/papers/template/${item.row.sn}`).then(data => {
        console.log(data);
        this.tempLoading = false;
        this.$message({
          type: "success",
          message: "使用模板成功！",
          showClose: true
        });
        this.tempDialog = false;
        this.dialogShow = false;
        this.getWjList();
      });
    },
    //打开问卷库
    openTemp() {
      this.tempDialog = true;
      this.tempPage = {
        page: 1, //当前页
        rows: 10, //页面数据数量
        total: 1, //页数
        records: 10 //总数
      };
      this.getTempList();
    },
    //获取模板库信息
    getTempList() {
      this.tempLoading = true;
      this.$axios
        .get("/modular/queryGridJson", {
          params: {
            queryJson: this.tempSearchText,
            page: this.tempPage.page, //当前页
            rows: this.tempPage.rows, //页面数据数量
            total: this.tempPage.total, //页数
            records: this.tempPage.records //总数
          }
        })
        .then(req => {
          console.log(req);
          let tempDatas = req.data.data;
          if (req.data.code == 200) {
            this.tempData = tempDatas.rows;
            this.tempPage = {
              page: tempDatas.page, //当前页
              rows: tempDatas.pagesize, //页面数据数量
              total: tempDatas.total, //页数
              records: tempDatas.records //总数
            };
          } else {
            this.$message.error({
              message: "获取失败!!",
              showClose: true
            });
          }
          this.tempLoading = false;
        });
    },
    //翻页
    changeTempPage(val) {
      this.tempPage.page = val;
      this.getTempList();
    },
    //预览模板问卷
    lookTempWj(item) {
      let url = `${window.location.origin}/dom/#/tempDisplay/${item.row.sn}`; //问卷链接
      window.open(url);
    },
    //发布问卷/暂停问卷
    pushWj() {
      this.$axios.post(`/papers/state/${this.nowSelect.sn}`).then(data => {
        console.log(data);
        if (data.data.code == 200) {
          this.$message({
            type: "success",
            message:
              this.nowSelect.queStatus == 0
                ? "问卷发布成功！"
                : "问卷暂停成功！"
          });
          this.getWjList();
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
    },
    //分享问卷
    shareWj() {
      if (!this.nowSelect.auditStatus) {
        //问卷未发布
        this.$message({
          type: "error",
          message: "问卷还未审核"
        });
        return;
      }
      if (this.nowSelect.queStatus == 0) {
        //问卷未发布
        this.$message({
          type: "error",
          message: "请先发布问卷能分享！"
        });
        return;
      }
      this.shareInfo.url =
        window.location.origin + "/dom/#/display/" + this.nowSelect.sn; //问卷链接
      this.shareDialogShow = true;
    },
    //生成二维码
    makeQrcode() {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, this.shareInfo.url);
    },
    //复制分享链接成功
    copySuccess(e) {
      console.log(e);
      this.$message({
        type: "success",
        message: "已复制链接到剪切板"
      });
    },
    //复制分享链接失败
    copyError(e) {
      console.log(e);
      this.$message({
        type: "error",
        message: "复制失败"
      });
    },
    //打开分享链接
    openShareUrl() {
      window.open(this.shareInfo.url);
    },
    //预览问卷
    previewWj() {
      let url = window.location.origin + "/dom/#/display/" + this.nowSelect.sn; //问卷链接
      //this.$router.push({path:`/display/${this.nowSelect}`})
      window.open(url);
    },
    //编辑问卷
    editWj() {
      this.formTitle = "编辑问卷";
      this.dialogShow = true;
      this.willAddWj = this.nowSelect;
    },
    //添加问卷按钮点击
    addWjButtonClick() {
      this.formTitle = "添加问卷";
      this.dialogShow = true;
      this.willAddWj = {
        queTitle: "",
        queDescribe:
          "感谢您能抽时间参与本次问卷，您的意见和建议就是我们前行的动力！"
      };
    },
    //设计问卷界面的进度条
    divScroll() {
      this.divScrollHeight = this.$refs.questionDiv.scrollTop;
    },
    setDivScroll() {
      setTimeout(() => {
        this.$refs.questionDiv.scrollTop = this.divScrollHeight;
      }, 100);
    },
    //保存问卷
    addWj() {
      if (this.willAddWj.queTitle == "") {
        this.$message({
          type: "error",
          message: "标题不能为空"
        });
        return;
      }
      this.$axios.post("/papers", this.willAddWj).then(data => {
        if (data.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          this.getWjList();
        } else {
          this.$message({
            type: "error",
            message: "保存失败!"
          });
        }
      });
      this.dialogShow = false;
      //this.willAddWj.queTitle='';
    },
    //获取问卷列表
    getWjList() {
      this.loading = true;
      this.$axios.get("/papers").then(res => {
        this.wjList = res.data.data;
        this.loading = false;
        //获取当前选中问卷题目
        this.lookDetail();
      });
    },
    //删除问卷
    deleteWj() {
      this.$confirm(
        "确定删除" + this.nowSelect.queTitle + "? 删除后不可恢复！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.loading = true;
        this.$axios.delete(`/papers/${this.nowSelect.sn}`).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.loading = false;
            this.getWjList();
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
    //问卷点击
    wjClick(id, index) {
      this.defaultActive = (index + 1).toString();
      if (this.xsWidows) {
        this.closeRightCol();
      }
      this.lookDetail();
    },
    //查看问卷详情
    lookDetail() {
      console.log(this.nowSelect.sn);
      this.$refs.design.init(
        this.nowSelect.sn,
        this.nowSelect.queTitle,
        this.nowSelect.queDescribe,
        this.xsWidows
      );
      this.$refs.dataShow.dataAnalysis(
        this.nowSelect.sn,
        this.xsWidows,
        this.nowSelect.queTitle
      );
    },
    //打开问卷列表
    openLeftCol(currentName, oldName) {
      if (currentName == "openLeftCol") {
        this.xsWidows = true;
        this.dialogWidth = 80;
        this.xsLeftSpan = 20;
        this.xsRightSpan = 4;
        return false;
      }
    },
    //关闭问卷列表
    closeRightCol() {
      this.xsLeftSpan = 0;
      this.xsRightSpan = 24;
      this.xsWidows = true;
      this.dialogWidth = 80;
    }
  }
};
</script>
<style scoped>
.home {
  position: absolute;
  width: 100%;
  height: calc(100vh - 100px);
  text-align: left;
}
.home .badgeItem {
  margin-top: 40px;
}
.content {
  padding: 20px;
  padding-right: 50px;
  height: calc(100vh - 175px);
  text-align: center;
  overflow-y: scroll;
  overflow-x: hidden;
}
.menu {
  background-color: white;
  height: calc(100vh - 100px);
  overflow-x: scroll;
  overflow-y: scroll;
  left: 0;
}
.home .opera {
  position: relative;
  background-color: #fafafa;
  text-align: center;
  height: 40px;
}
.home .rightButton {
  font-size: 16px;
}
.home .addWjDiv {
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
</style>
