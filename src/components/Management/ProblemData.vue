<!--
程序名：问题设计页面
功能：对问卷中问题的添加、编辑、删除
-->
<template>
  <div class="Design" v-loading="loading" element-loading-text="加载中...">
    <el-button type="primary" plain style="float:right" @click="back()">返回</el-button>
    <h3>{{ this.title }}</h3>
    <div class="top" v-if="desc != ''">
      {{ desc }}
    </div>
    <el-card
      class="box-card"
      :key="index"
      v-for="(item, index) in detail"
      style="margin: 10px;"
    >
      <div slot="header" class="clearfix">
        <div class="questionTitle">
          <!--显示必填标识-->
          <span style="color: #F56C6C;">
            <span v-if="item.isMust">*</span>
            <span v-else>&nbsp;</span>
          </span>
          <span style="color: black;margin-right: 3px;">{{
            index + 1 + "."
          }}</span>
          {{ item.mainTitle }}
          <el-divider content-position="left">{{ item.subtitle }}</el-divider>
        </div>
        <!-- 下移 -->
        <div style="float: right;">
          <el-button
            style="padding: 2px; "
            icon="el-icon-sort-down "
            type="text"
            @click="downQuestionSourt(item)"
          ></el-button>
          <!-- 上移 -->
          <el-button
            style="padding: 2px; color: #F56C6C"
            icon="el-icon-sort-up"
            type="text"
            @click="upQuestionSourt(item)"
            v-if="item.sortOrder != 1"
          ></el-button>
          <!-- 编辑 -->
          <el-button
            style="padding: 2px"
            type="text"
            @click="editorQuestion(item)"
            >编辑</el-button
          >
          <!-- 删除 -->
          <el-button
            style="padding: 2px;color: #F56C6C"
            type="text"
            @click="deleteQuestion(index)"
            >删除</el-button
          >
        </div>
      </div>

      <!--单选题展示-->
      <div
        class="text item"
        :key="index"
        v-for="(option, index) in item.options"
      >
        <div v-if="item.questionType == '2'">
          <el-radio
            v-model="item.radioValue"
            :label="index"
            style="margin: 5px;"
            >{{ option }}</el-radio
          >
        </div>
      </div>

      <!--多选题展示-->
      <el-checkbox-group
        v-if="item.questionType == '3'"
        v-model="item.checkboxValue"
      >
        <div
          class="text item"
          :key="index"
          v-for="(option, index) in item.options"
        >
          <el-checkbox :label="index" style="margin: 5px;">{{
            option
          }}</el-checkbox>
        </div>
      </el-checkbox-group>

      <!--填空题展示-->
      <el-input
        v-if="item.questionType == '1'"
        type="textarea"
        resize="none"
        v-model="item.textValue"
      >
      </el-input>
    </el-card>

    <el-button
      icon="el-icon-circle-plus"
      @click="addQuestion"
      style="margin-top: 10px;"
      >添加题目</el-button
    >

    <br /><br /><br /><br /><br />

    <!--保存题目弹窗-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :width="`${this.dialogWidth}%`"
      class="dialog"
    >
      <el-form ref="form" :model="willAddQuestion" label-width="80px">
        <el-form-item label="题目类型" style="width: 100%;">
          <el-select
            v-model="willAddQuestion.questionType"
            placeholder="请选择题目类型"
            @change="typeChange"
          >
            <el-option
              v-for="item in allType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否必填" style="width: 100%;">
          <el-checkbox v-model="willAddQuestion.isMust">必填</el-checkbox>
        </el-form-item>
        <el-form-item label="题目标题" style="width: 100%;">
          <el-input
            v-model="willAddQuestion.mainTitle"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="副标题" style="width: 100%;">
          <el-input
            v-model="willAddQuestion.subtitle"
            placeholder="请输入副标题"
          ></el-input>
        </el-form-item>

        <template
          v-if="
            willAddQuestion.questionType == '2' ||
              willAddQuestion.questionType == '3'
          "
        >
          <el-form-item
            :label="'选项' + (index + 1)"
            :key="index"
            v-for="(item, index) in willAddQuestion.options"
          >
            <el-row>
              <el-col :span="16">
                <el-input
                  v-model="item.title"
                  placeholder="请输入选项名"
                  style="width: 90%;"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-button
                  type="danger"
                  plain
                  class=""
                  @click="deleteOption(index)"
                  >删除选项</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
          <el-button
            type="primary"
            plain
            class="addOptionButton"
            @click="addOption"
            >新增选项</el-button
          >
        </template>
        <template v-if="willAddQuestion.questionType == '1'">
          <el-form-item label="填空">
            <el-input
              type="textarea"
              style="width: 80%"
              resize="none"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <br />
      <div style="width: 100%;text-align: right">
        <el-button style="margin-left: 10px;" @click="dialogShow = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="margin-left: 10px;"
          @click="checkAddQuestion"
          >完成</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      loading: false, //页面加载中
      dialogShow: false,
      dialogTitle: "",
      detail: [],
      sn: "", //问卷SN
      title: "", //问卷标题
      desc: "", //问卷备注
      xsWidows: false, //当前是否为手机打开
      dialogWidth: 50,
      willAddQuestion: {
        //保存问卷问题信息
        paperSN: this.sn, //问卷SN
        questionType: "", //问题类型
        mainTitle: "", //问题主标题
        subtitle: "", //问题副标题
        option: [],
        options: [
          {
            title: ""
          }
        ],
        sortOrder: 1, //问题顺序
        isMust: false //是否必填
      },
      allType: [
        {
          value: "2",
          label: "单选题"
        },
        {
          value: "3",
          label: "多选题"
        },
        {
          value: "1",
          label: "填空题"
        }
        // {
        //   value: "4",
        //   label: "评分题"
        // }
      ]
    };
  },
  mounted(){
 //初始化问卷所有问题
  
        this.sn = this.$route.params.sn;
        debugger;
        this.$axios.get(`/modular/${this.sn}`).then(data => {
            this.title=data.data.data.queTitle;
            this.desc=data.data.data.queDescribe;
        });
        this.getQuestionList();
    
  },
  methods: {
    back(){
      this.$router.push({ path: "/management/modular" });
    },
    //获取问题列表(问卷内容)
    getQuestionList() {
      this.detail = [];
      this.loading = true;
      this.paperSN=this.sn;
      debugger;
      this.$axios.get(`/qub/${this.paperSN}`,).then(data => {
        let datas = data.data.data;
        this.detail = datas;
        if(this.detail==null || this.detail==""){
          this.loading = false;
          return;
        }
        this.detail.forEach(t => {
          if (this.isSelectQuestionType(t.questionType)) {
            if (t.options != null) {
              if (t.options.size != 0) {
                t.options.shift();
              }
            }
          }
        });
        this.loading = false;
      });
    },
    //点击添加问题按钮
    addQuestion() {
      if (this.sn == 0 || this.sn == null) {
        this.$message({
          type: "error",
          message: "请先创建问卷!"
        });
        return;
      }
      this.dialogTitle = "添加题目";
      this.willAddQuestion = {
        //初始化问题信息
        paperSN: this.sn, //问卷SN
        questionType: "", //问题类型
        mainTitle: "", //问题主标题
        option: [],
        options: [
          {
            title: ""
          }
        ],
        sortOrder: 1, //问题顺序
        isMust: false //是否必填
      };
      this.willAddQuestion.sortOrder = this.detail.length + 1;
      this.dialogShow = true;
    },
    //删除问题
    deleteQuestion(index) {
      this.$confirm("确定删除此题目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.delete(`/qub/${this.detail[index].sn}`).then(data => {
          console.log(data);
          if (data.data.code == 200) {
            this.detail.splice(index, 1);
            //this.getQuestionList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: data.msg
            });
          }
        });
      });
    },
    //确认添加/保存题目
    checkAddQuestion() {
      //添加保存问题
      let newItem = {}; //新添加的问题对象
      newItem = {
        questionType: this.willAddQuestion.questionType,
        mainTitle: this.willAddQuestion.mainTitle,
        options: this.willAddQuestion.options,
        sortOrder: this.sortOrder,
        isMust: this.willAddQuestion.isMust
      };
      newItem.radioValue = -1;
      newItem.checkboxValue = [];
      newItem.textValue = "";
      //拼接选项字符串
      if (
        this.willAddQuestion.questionType == 2 ||
        this.willAddQuestion.questionType == 3
      ) {
        this.willAddQuestion.option = "";
        this.willAddQuestion.options.forEach(item => {
          this.willAddQuestion.option = `${this.willAddQuestion.option}|${
            item.title
          }`;
          console.log(this.willAddQuestion.option);
        });
      }
      this.willAddQuestion.paperSN = this.sn;
      debugger;
      this.$axios.post("/qub/saveQuestion", this.willAddQuestion).then(data => {
        newItem.id = data.data.code;
        if (data.data.code == 200) {
          this.dialogShow = false;
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          this.getQuestionList();
        } else {
          this.dialogShow = false;
          this.$message({
            type: "error",
            message: "添加失败! 请重新尝试。"
          });
        }
      });
    },
    //点击编辑问题按钮
    editorQuestion(item) {
      this.willAddQuestion.mainTitle = item.mainTitle;
      this.willAddQuestion.subtitle = item.subtitle;
      this.willAddQuestion.questionType = item.questionType;
      if (this.isSelectQuestionType(item.questionType)) {
        this.willAddQuestion.options = item.options.map(t => ({
          title: t
        }));
      }
      this.willAddQuestion.sn = item.sn;
      this.willAddQuestion.isMust = item.isMust;
      this.willAddQuestion.sn = item.sn;
      this.dialogTitle = "编辑问题";
      this.dialogShow = true;
    },
    //添加选项
    addOption() {
      this.willAddQuestion.options.push({
        title: ""
      });
    },
    //删除选项
    deleteOption(index) {
      this.willAddQuestion.options.splice(index, 1);
    },
    //切换问题类型
    typeChange(value) {
      console.log(value);
      this.willAddQuestion.questionType = value;
      this.willAddQuestion.options = [{}];
    },
    //判断是否为选择题
    isSelectQuestionType(questionType) {
      if (questionType == 2 || questionType == 3) {
        return true;
      }
      return false;
    },
    //更改问题排序
    upQuestionSourt(item) {
      this.alertQuestionSourt(2, item);
    },
    downQuestionSourt(item) {
      this.alertQuestionSourt(1, item);
    },
    alertQuestionSourt(alert, item) {
      this.$axios
        .post(`/qub/sortOrder/${alert}/${item.paperSN}/${item.sn}`)
        .then(res => {
          this.getQuestionList();
        });
    }
  }
};
</script>
<style scoped>
.Design {
  padding: 0%;
}
.Design .dialog {
  text-align: left;
}
.Design .questionTitle {
  display: inline-block;
  width: 80%;
  font-size: 16px;
  color: #303133;
}
.Design .addOptionButton {
  display: inline-block;
  margin-left: 80px;
}
.box-card {
  width: 100%;
  text-align: left;
}
.Design .top {
  color: #606266;
  margin-left: 20px;
  padding: 0 10px 10px 10px;
  border-bottom: 3px solid #409eff;
  font-size: 15px;
  line-height: 22px;
  text-align: left;
}
</style>
