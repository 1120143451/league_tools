<template>
  <div id="app" :style="appStyle" ref="appRef">
    <el-container>
      <el-row ref="topRow">
        <el-col :span="24">
          <el-card :body-style="{padding: '15px'}">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form :inline="true" id="login-form">
                  <el-form-item style="width: 40%">
                    <el-input
                        placeholder="账号"
                        v-model="username">
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item style="width: 40%">
                    <el-input
                        placeholder="密码"
                        v-model="password">
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="">登录</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="18">
                <el-button type="danger" plain>开启监控</el-button>
                <el-button type="success" plain>获取今日比赛</el-button>
              </el-col>
            </el-row>

          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px 0" ref="mainRow">
        <el-col :span="4">
          <el-card ref="leftCard" :body-style="{height: '100%', overflow: 'auto', boxSizing: 'border-box'}">
            <div style="margin-bottom: 10px;text-align: center;">
              <el-button type="primary" plain icon="el-icon-refresh">刷新今日联赛</el-button>
            </div>
            <el-checkbox-group v-model="checkedList" id="left-checkbox">
              <el-checkbox label="联赛1" border></el-checkbox>
              <el-checkbox label="联赛2" border></el-checkbox>
              <el-checkbox label="联赛3" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
              <el-checkbox label="联赛4" border></el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-col>
        <el-col :span="20">
          <el-card ref="rightCard" :body-style="{padding: '0'}">
            <el-table ref="cardTable"
                      :max-height="cardTableHeight"
                      :data="tableData2"
                      :row-style="{ height: '20px' }"
                      :cell-style="{padding: '3px'}">
              <el-table-column prop="赛事" label="赛事"></el-table-column>
              <el-table-column prop="时间" label="时间"></el-table-column>
              <el-table-column prop="球队" label="球队"></el-table-column>
              <el-table-column prop="盘口" label="盘口">
                <template slot-scope="scope">
                  <span :style="{ color: getColor(scope.row['盘口']) }">
                    {{ scope.row['盘口'] }}
                    <i :class="getIconClass(scope.row['盘口'])" style="margin-left: 5px;"></i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="最佳" label="最佳"></el-table-column>
              <el-table-column prop="皇冠" label="皇冠"></el-table-column>
              <el-table-column prop="利记" label="利记"></el-table-column>
              <el-table-column prop="澳門" label="澳門"></el-table-column>
              <el-table-column prop="智博" label="智博"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row ref="footerRow" style="height: 260px">
        <el-col :span="24">
          <el-card style="height: 260px;"
                   :body-style="{ padding: '15px', overflow: 'auto', height: '100%', boxSizing: 'border-box'}">
            <div :style="{color: logColor[log.type]}" v-for="(log, index) in logs_list" :key="index">
              {{ log.msg }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data() {
    return {
      appStyle: {},
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      tabledata: [
        {orderid: '12345', productname: '苹果', date: '2024-12-10', quantity: 3},
        {orderid: '12345', productname: '香蕉', date: '2024-12-10', quantity: 2},
        {orderid: '12346', productname: '橘子', date: '2024-12-11', quantity: 5}
      ],
      // 模拟日志数据
      logColor: {
        "success": "green",
        "error": "red",
      },
      logs_list: [
        {
          type: "success",
          msg: "2024-10-01 10:00:00 - 日志记录 1"
        },
        {
          type: "error",
          msg: "2024-10-01 10:01:00 - 日志记录 2"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
        {
          type: "success",
          msg: "2024-10-01 10:02:00 - 日志记录 3"
        },
      ],
      tableData2: [],
      cardTableHeight: 200,
      checkedList: [],
      username: "",
      password: "",
      spanArr: [],
      position: 0
    };
  },
  mounted() {
    document.title = '联赛工具';
    this.handleResize();
    const randomData = [];
    const events = ["印尼甲", "土甲", "欧赔U19", "印度超", "阿塞超", "亚冠精英", "南非超", "欧冠"];
    const teams = ["球队A", "球队B", "球队C", "球队D", "球队E", "球队F", "球队G", "球队H"];

    for (let i = 0; i < 20; i++) {
      const item = {
        "赛事": events[Math.floor(Math.random() * events.length)],
        "时间": `03/${Math.floor(Math.random() * 31) + 1}`,
        "球队": teams[Math.floor(Math.random() * teams.length)],
        "盘口": (Math.random() * 2).toFixed(1),
        "最佳": (Math.random() + 0.8).toFixed(3),
        "皇冠": (Math.random() + 0.8).toFixed(3),
        "利记": (Math.random() + 0.8).toFixed(3),
        "澳門": (Math.random() + 0.8).toFixed(3),
        "智博": (Math.random() + 0.8).toFixed(3)
      };
      randomData.push(item);
    }

    console.log(randomData);
    this.tableData2 = randomData
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听器，避免内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    created() {
      this.getSpanArr(this.tableData2);
    },
    handleResize() {
      // 更新窗口宽度和高度数据
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.appStyle = {
        height: window.innerHeight + 'px',
        width: window.innerWidth + 'px',
      }
      let topRow = this.$refs.topRow;
      // let appRef = this.$refs.appRef;
      let mainRow = this.$refs.mainRow;
      let footerRow = this.$refs.footerRow;
      let leftCard = this.$refs.leftCard;
      let rightCard = this.$refs.rightCard;
      let cardTable = this.$refs.cardTable;
      let mainHeight = this.windowHeight - topRow.$el.offsetHeight - footerRow.$el.offsetHeight;
      mainHeight -= 20; // 20 是内边距的和
      let cardHeight = mainHeight - 20 // 20 是内边距的和
      mainRow.$el.style.height = mainHeight + 'px';
      leftCard.$el.style.height = cardHeight + 'px';
      rightCard.$el.style.height = cardHeight + 'px';
      this.$nextTick(() => {
        this.cardTableHeight = cardHeight;

      });
      // cardTable.$el.style.maxHeight = cardHeight + 'px';
      // cardTable.$el.style.overflow = 'auto';
      console.log("cardTable", cardTable)
    },
    // 合并行
    spanmethod({row, column, rowIndex}) {
      let key = '赛事';
      console.log("row", row)
      console.log("column", column)
      console.log("rowIndex", rowIndex)
      let searchData = this.tableData2
      // 仅对订单号列生效
      if (column.property === key) {
        // 获取当前订单号
        let currentData = row[key];
        // 判断上一行的订单号是否相同
        if (rowIndex === 0 || currentData !== searchData[rowIndex - 1][key]) {
          // 找到当前订单号的重复行数
          const count = searchData.filter(item => item[key] === currentData).length;
          return [count, 1];
        }
        // 否则隐藏该单元格
        return [0, 0];
      }
      return [1, 1];
    },
    // 根据涨跌幅设置文字颜色
    getColor(value) {
      return Math.random() < 0.5 ? "red" : "green";
      if (value == "苹果") {
        return 'red';
      } else if (value == "香蕉") {
        return 'green';
      }
      return 'black';
    },
    // 根据涨跌幅设置图标类名
    getIconClass(value) {
      return Math.random() < 0.5 ? "el-icon-arrow-up" : "el-icon-arrow-down";
      if (value == "苹果") {
        return 'el-icon-arrow-up';
      } else if (value == "香蕉") {
        return 'el-icon-arrow-down';
      }
      return '';
    },
    getSpanArr(data) {
      this.spanArr = [];
      this.position = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i]['赛事'] === data[i - 1]['赛事']) {
            this.spanArr[this.position]++;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let _row = this.spanArr[rowIndex];
        let _col = _row > 0? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    }
  } // methods end
}
</script>

<style>
html,
body {
  margin: 0 !important;
}

/* 让 app 根 div 撑满浏览器 */
#app {
  overflow: hidden;
  color: #2c3e50;
  background-color: #e6e6e6;
  padding: 10px;
  box-sizing: border-box;
}

.el-container {
  flex-direction: column !important;
}


/* WebKit 浏览器滚动条样式 */
::-webkit-scrollbar {
  width: 10px; /* 滚动条宽度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #e0f7fa; /* 淡蓝色轨道背景 */
  border-radius: 5px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #4fc3f7; /* 较深的淡蓝色滑块 */
  border-radius: 5px;
}

/* 滑块悬停效果 */
::-webkit-scrollbar-thumb:hover {
  background: #03a9f4; /* 悬停时更深的蓝色 */
}

/* Firefox 浏览器滚动条样式 */
* {
  scrollbar-color: #4fc3f7 #e0f7fa;
  scrollbar-width: thin;
}

#left-checkbox .el-checkbox {
  display: block;
  margin: 0 0 10px;
}

#left-checkbox .el-checkbox:last-child {
  margin-bottom: 0;
}
#login-form .el-form-item {
  margin: 0 10px 0 0;
}

#login-form .el-form-item:last-child {
  margin: 0;
}
</style>
