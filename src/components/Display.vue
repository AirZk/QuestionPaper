<!--
程序名：问卷填写页面
功能：用户打开问卷链接对问卷进行填写
-->
<template>
  <div class="display">
    <div class="content">
      <h3>{{ title }}</h3>
      <div class="top" v-if="desc != null">
        {{ desc }}
      </div>
      <el-form>
        <el-card class="box-card" :key="index" v-for="(item, index) in detail">
          <div slot="header" class="clearfix">
            <div class="questionTitle">
              <!--显示必填标识-->
              <span style="color: #F56C6C;">
                <span v-if="item.isMust">*</span>
                <span v-else>&nbsp;</span>
              </span>
              {{ index + 1 + "." + item.mainTitle }}
            </div>
            <el-divider
              class="divider"
              v-if="item.subtitile != null || item.subtitile != ''"
              content-position="left"
              >{{ item.subtitle }}</el-divider
            >
          </div>

          <el-form-item
            :prop="item.isMust ? item.mainTitle + '.' + index + '.v' : ''"
            :rules="[
              {
                required: true,
                message: item.mainTitle + '必须填写',
                trigger: 'blur'
              }
            ]"
          >
            <!--单选题展示-->
            <div
              class="text item"
              :key="index"
              v-for="(option, index) in item.options"
            >
              <div v-if="item.questionType == '2'">
                <el-radio
                  v-model="item.answerOption"
                  :label="option"
                  style="margin: 5px;"
                  >{{ option }}</el-radio
                >
              </div>
            </div>
            <!--多选题展示-->
            <el-checkbox-group
              v-if="item.questionType == '3'"
              v-model="item.answerOptionList"
              :min="item.isMust ? 1 : 0"
            >
              <div
                class="text item"
                :key="index"
                v-for="(option, index) in item.options"
              >
                <el-checkbox
                  :label="option + ''"
                  style="margin: 5px;"
                ></el-checkbox>
              </div>
            </el-checkbox-group>
            <!--填空题展示-->
            <el-input
              v-if="item.questionType == '1'"
              type="text"
              v-model="item.answerOption"
              resize="none"
            >
            </el-input>
            <!--评分题展示-->
            <el-rate
              v-if="item.questionType == '4'"
              v-model="item.answerOption"
              show-text
              :colors="colors"
            ></el-rate>
          </el-form-item>
        </el-card>
        <el-form-item>
          <el-button
            type="primary"
            style="margin: 5px;"
            @click="submit"
            :loading="submitLoading"
            >{{ submitText }}</el-button
          >
        </el-form-item>
      </el-form>
      <div class="bottom">
        <el-link type="info" href="http://www.huashasoft.com/index.html"
          >郑州华砂信息信息技术有限公司&nbsp;提供技术支持</el-link
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogShow: false,
      dialogTitle: "",
      dialogType: 1, //1添加 2修改

      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      oldItem: null, //编辑中问题的对象
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
      ],
      sn: "", //问卷SN
      title: "", //问卷标题
      desc: "", //问卷备注
      detail: [],
      startTimestamp: 0, //填写问卷开始时间戳 毫秒
      submitLoading: false, //提交按钮 加载中状态
      submitText: "提交" //提交按钮文字
    };
  },
  rules: {
    text: [
      {
        required: true,
        message: `请输入!!!`,
        trigger: "blur"
      }
    ]
  },
  mounted() {
    //初始化数据
    let papersn = this.$route.params.sn;
    this.$axios.get(`/papers/${papersn}`).then(data => {
      let datas = data.data;
      if (datas.code == 200) {
        this.title = datas.data.queTitle;
        this.desc = datas.data.queDescribe;
        this.detail = datas.data.queQuestionEntities;
        this.detail.forEach(t => {
          if (this.isSelectQuestionType(t.questionType)) {
            if (t.options.length != null && t.options.length != 0) {
              t.options.shift();
              this.$set(t, "answerOptionList", []);
            }
          }
          //对属性设置响应式属性
          this.$set(this.detail, t.mainTitle, true);
          this.detail[t.mainTitle] = [{ v: "" }];
        });
        document.title = datas.data.queTitle;
      } else {
        this.$message({
          type: "error",
          message: "获取失败，请重试"
        });
      }
    });
    this.startTimestamp = new Date().getTime(); //时间戳 毫秒
  },
  methods: {
    //提交问卷
    submit() {
      let answerIsNull = false;
      this.detail.forEach(t => {
        //判断内容是否为空
        if (t.answerOption === undefined && t.isMust) {
          answerIsNull = true;
          this.$message({
            type: "error",
            message: `${t.mainTitle}必须填写`
          });
        }
      });
      //
      if (answerIsNull) {
        return;
      }

      this.submitLoading = true;
      this.submitText = "提交中";
      let paperSN = this.$route.params.sn;
      let useTime = parseInt(
        (new Date().getTime() - this.startTimestamp) / 1000
      ); //填写问卷用时 秒
      let answer = [];
      //对提交到后台的数据进行整理
      this.detail.forEach(t => {
        //将多选题的答案拼到一个内容里
        if (t.questionType == 3) {
          t.answerOption = "";
          t.answerOptionList.forEach(answerOptionStr => {
            t.answerOption = `${t.answerOption}| ${answerOptionStr}`;
          });
        }
        //将值添加到数组对象中
        answer.push({
          questionTitle: t.mainTitle,
          paperSN: t.paperSN,
          questionSN: t.sn,
          answerOption: t.answerOption
        });
      });
      //将填写时间添加到数组对象中
      answer.push({
        questionTitle: "填写用时",
        paperSN: paperSN,
        questionSN: "useTime",
        answerOption: useTime
      });

      this.$axios.post("/answers", answer).then(data => {
        console.log(data);
        if (data.data.code == 200) {
          //提交成功
          this.submitLoading = false;
          this.submitText = "提交";
          this.$router.push({ path: "/thankyou" }); //跳到欢迎页
        } else {
          this.submitLoading = false;
          this.submitText = "提交";
          this.$notify.error({
            title: "错误",
            message: data.msg
          });
        }
      });
    },
    //判断是否为选择题
    isSelectQuestionType(questionType) {
      if (questionType == 2 || questionType == 3) {
        return true;
      }
      return false;
    },
    //获取微信用户信息
    getVx() {}
  }
};
</script>
<style scoped>
.display {
  text-align: center;
  padding: 20px;
}
.display .top {
  color: #606266;
  padding: 0 10px 10px 10px;
  border-bottom: 3px solid #409eff;
  font-size: 15px;
  line-height: 22px;
  text-align: left;
}
.display .content {
  width: 100%;
  max-width: 800px;
  display: inline-block;
  text-align: center;
}
.display .box-card {
  text-align: left;
  width: 100%;
  margin: 10px 0 10px 0;
}
.display .bottom {
  margin: 20px 10px 20px 10px;
  color: #909399;
}
.display a:link,
a:visited,
a:active {
  color: #909399;
  text-decoration: none;
}
.divider {
  color: #8b9094;
  text-decoration: none;
}
</style>
