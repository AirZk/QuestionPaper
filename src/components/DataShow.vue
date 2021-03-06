<!--
程序名：数据分析页面
功能：对问卷调查结果的数据进行分析并用图表可视化展示
-->
<template>
  <div
    id="pdfDom"
    class="Count"
    v-loading="loading"
    element-loading-text="生成中..."
  >
    <div v-if="!(detail.length == 0)" class="opera-buttons">
      <el-button
        type="primary"
        size="mini"
        @click.native="analysisExportExcel"
        :loading="exportExcelLoading"
        >导出excel</el-button
      >
      <!-- <el-button type="success" size="mini" @click.native="exportPdf"
        >导出PDF</el-button
      > -->
    </div>
    <div v-if="detail.length == 0">暂时没有数据</div>
    <el-card class="question" :key="index" v-for="(item, index) in detail">
      <div slot="header" class="clearfix">
        <span>{{ index + 1 + "." + item.mainTitle }}</span>
      </div>
      <!--如果数据库中的问题类型为单项选择或者多项选择-->
      <!--则将数据库中的数据以表格、柱状图、饼状图、圆环图、条形图的方式进行展示-->
      <div v-if="item.questionType == '2' || item.questionType == '3'">
        <el-table
          size="small"
          :data="item.result"
          style="width: 100%"
          stripe
          class="table"
        >
          <el-table-column prop="option" label="选项"></el-table-column>
          <el-table-column
            prop="count"
            label="数量"
            width="180"
          ></el-table-column>
          <el-table-column prop="percent" label="占比%" width="180">
          </el-table-column>
        </el-table>
        <br />

        <el-button
          class="hidden-sm-and-down"
          size="mini"
          type="primary"
          plain
          @click.native="changeValue(index, 1)"
          >柱状图</el-button
        >
        <el-button
          class="hidden-sm-and-down"
          size="mini"
          type="primary"
          plain
          @click.native="changeValue(index, 2)"
          >饼状图</el-button
        >
        <el-button
          class="hidden-sm-and-down"
          size="mini"
          type="primary"
          plain
          @click.native="changeValue(index, 3)"
          >圆环图</el-button
        >
        <el-button
          class="hidden-sm-and-down"
          size="mini"
          type="primary"
          plain
          @click.native="changeValue(index, 4)"
          >条形图</el-button
        >
        <el-button
          class="hidden-sm-and-down"
          size="mini"
          type="primary"
          plain
          @click.native="changeValue(index, 0)"
          >隐藏图表</el-button
        >

        <div :id="'img' + index" class="img" v-show="visible[index] == 1"></div>
        <div
          :id="'bing' + index"
          class="bing"
          v-show="visible[index] == 2"
        ></div>
        <div
          :id="'ring' + index"
          class="ring"
          v-show="visible[index] == 3"
        ></div>
        <div :id="'tz' + index" class="tz" v-show="visible[index] == 4"></div>
      </div>
      <!--如果数据库中的问题类型为text类型则将数据表格的形式进行显示-->
      <div v-if="item.questionType == '1'">
        <el-table :data="item.answerList">
          <el-table-column
            property="answerOption"
            label="回答结果"
          ></el-table-column>
        </el-table>
      </div>
      <!-- 评分题展示 -->
      <div v-if="item.questionType == '4'">
        <el-table :data="item.answerList">
          <el-table-column label="评分结果">
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row.answerOption"
                disabled
                show-score
                :colors="colors"
              >
              </el-rate>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
import echarts from "echarts";
import Design from "./Design.vue";
export default {
  data() {
    return {
      dialogTableVisible: false, //导出表格的dialog显示状态
      visible: [], //填空题详细内容
      loading: false, //加载状态
      detail: [], //详细数据
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"], //评分题的颜色
      currentPage: 1, //当前页码
      pageSize: 10, //当前页数量
      total: 0, //总数
      tableData: [], //表格数据
      paperSn: "", //问卷SN
      exportExcelLoading: false, //导出加载状态
      answerText2ExcelQeustionId: 0, //导出填空题表格问题的SN
      dialogWidth: 50, //弹出窗的宽度
      paperTitle: "" //问卷标题
    };
  },
  mounted() {
    this.dataAnalysis();
  },
  methods: {
    answerText2Excel(questionId) {
      this.$alert("正在开发...", "提示");
      // this.answerText2ExcelQeustionId = questionId;
      // this.$axios({
      //   opera_type: "answer_text_to_excel",
      //   questionId: questionId
      // }).then(data => {
      //   this.doDownload(data.b64data, data.filename, "excel");
      //   this.answerText2ExcelQeustionId = 0;
      // });
    },
    // 导出pdf
    exportPdf() {
      this.$alert("正在开发...", "提示");
    },
    // 导出excel
    analysisExportExcel() {
      this.$axios({
        method: "GET",
        url: `/excel/answer/${this.paperSn}`,
        responseType: "blob"
      })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          //设置连接
          link.href = URL.createObjectURL(blob);
          link.download = this.paperTitle;
          document.body.appendChild(link);
          //模拟点击事件
          link.click();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取表格数据
    getTableData() {
      ({
        opera_type: "get_text_answer_detail",
        questionId: this.questionId,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }.then(data => {
        console.log(data);
        this.tableData = data.detail;
        this.total = data.total;
      }));
    },
    sizeChange() {
      this.getTableData();
    },
    currentChange() {
      this.getTableData();
    },
    //查看文本回答详情
    lookTextDetail(questionId) {
      this.tableData = [];
      this.pageSize = 10;
      this.total = 0;
      this.currentPage = 1;
      this.dialogTableVisible = true;
      this.questionId = questionId;
      this.getTableData();
    },
    //切换图表
    changeValue(num, value) {
      this.$set(this.visible, num, value);
      console.log("num=" + num);
      console.log("value=" + value);
      if (value == 1) {
        this.setImg(num);
      } else if (value == 2) {
        this.setPar(num);
      } else if (value == 3) {
        this.setRing(num);
      } else if (value == 4) {
        this.setTz(num);
      }
    },
    //初始化数据
    dataAnalysis(sn, xsWidows, paperTitle) {
      //判断当前xsWidows是否使用手机打开
      if (xsWidows) {
        this.dialogWidth = 80;
      }
      this.paperTitle = paperTitle;
      this.loading = true;
      this.detail = [];
      this.paperSn = sn;
      //获取问题的答案信息
      this.$axios(`/questions/answer/${this.paperSn}`).then(data => {
        this.detail = data.data.data;
        if (this.detail.length !== 0) {
          this.detail.forEach(t => {
            // 重新计算多选题的占比
            if (t.questionType == 3) {
              let resultCount = 0;
              t.result.forEach(res => {
                resultCount = resultCount + res.count;
              });
              t.result.forEach(resu => {
                resu.percent = (resu.count / resultCount) * 100 || 0;
              });
            }
            //将评分题的答案转为数字
            if (t.questionType == 4) {
              t.answerList.forEach(answer => {
                answer.answerOption = Number.parseInt(answer.answerOption);
              });
            }
          });
        }
        this.visible = [];
        this.loading = false;
      });

      this.dialogShow = false;
    },
    //柱状图
    setImg(id) {
      console.log(id);
      console.log(this.detail[id].result);
      let myChart = echarts.init(document.getElementById("img" + id));
      var option = {
        tooltip: {},
        legend: {
          data: ["数量"]
        },
        dataset: {
          dimensions: ["option", "count", "percent"],
          source: this.detail[id].result
        },
        xAxis: {
          type: "category"
        },
        yAxis: {},
        series: [
          {
            name: "数量：",
            type: "bar",
            barWidth: 30,
            color: "deepskyblue"
          }
        ]
      };
      myChart.setOption(option);
    },
    // 饼状图
    setPar(id) {
      let myChart = echarts.init(document.getElementById("bing" + id));
      var option = {
        tooltip: {},

        color: ["#409EFF", "#FFB54D", "#FF7466", "#44DB5E"],
        legend: {
          data: ["数量"]
        },
        dataset: {
          dimensions: ["option", "count", "percent"],
          source: this.detail[id].result
        },
        series: [
          {
            name: "统计结果：",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    // 圆环图
    setRing(id) {
      //console.log(id);
      let myChart = echarts.init(document.getElementById("ring" + id));
      var option = {
        tooltip: {},
        legend: {},
        color: ["#409EFF", "#FFB54D", "#FF7466", "#44DB5E"],
        dataset: {
          dimensions: ["option", "count", "percent"],
          source: this.detail[id].result
        },
        series: [
          {
            name: "数量：",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    //圆环图
    setTz(id) {
      //console.log(id);
      let myChart = echarts.init(document.getElementById("tz" + id));
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        dataset: {
          dimensions: ["option", "count", "percent"],
          source: this.detail[id].result
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category"
        },
        series: [
          {
            name: "数量：",
            type: "bar",
            barWidth: 30,
            color: "#409EFF"
          }
        ]
      };
      myChart.setOption(option);
    },
    //文本内容
    setText(id) {
      return {
        resule: this.detail[id].result
      };
    },
    //判断是否为选择题
    isSelectQuestionType(questionType) {
      if (questionType == 2 || questionType == 3) {
        return true;
      }
      return false;
    }
  }
};
</script>
<style scoped>
.Count {
  padding: 0%;
}
.Count .question {
  max-width: 800px;
  width: 80%;
  display: inline-block;
  margin: 5px;
  text-align: left;
}
.Count .table {
  padding: 0px;
}
.Count .img {
  width: 500px;
  height: 300px;
}
.Count .bing {
  width: 500px;
  height: 300px;
}
.Count .ring {
  width: 500px;
  height: 300px;
}
.Count .tz {
  width: 500px;
  height: 300px;
}
.opera-buttons {
  padding: 10px;
}
</style>
