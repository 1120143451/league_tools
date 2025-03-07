<template>
  <div id="app" :style="appStyle" ref="appRef">
    <el-container>
      <el-row ref="topRow">
        <el-col :span="24">
          <el-card :body-style="{padding: '15px'}">
            <el-row :gutter="10" type="flex" justify="center">
              <!--              <el-col :span="6">-->
              <!--                <el-form :inline="true" id="login-form">-->
              <!--                  <el-form-item style="width: 40%">-->
              <!--                    <el-input-->
              <!--                        placeholder="账号"-->
              <!--                        v-model="username">-->
              <!--                      <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
              <!--                    </el-input>-->
              <!--                  </el-form-item>-->
              <!--                  <el-form-item style="width: 40%">-->
              <!--                    <el-input-->
              <!--                        placeholder="密码"-->
              <!--                        v-model="password">-->
              <!--                      <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
              <!--                    </el-input>-->
              <!--                  </el-form-item>-->
              <!--                  <el-form-item>-->
              <!--                    <el-button type="primary" @click="">登录</el-button>-->
              <!--                  </el-form-item>-->
              <!--                </el-form>-->
              <!--              </el-col>-->

              <el-col :span="2">
                <!--                <el-button type="danger" plain>开启监控</el-button>-->
                <el-button type="success" plain @click="getTableData()">获取今日比赛</el-button>
              </el-col>
            </el-row>

          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px 0" ref="mainRow">
        <el-col :span="5">
          <el-card ref="leftCard" :body-style="{height: '100%', overflow: 'auto', boxSizing: 'border-box'}">
            <div style="margin-bottom: 10px;text-align: center;">
              <el-button type="primary" plain icon="el-icon-refresh" @click="get_league()">刷新今日联赛</el-button>
            </div>
            <el-checkbox-group v-model="checkedList" id="left-checkbox" @change="leagueChange">
              <el-checkbox v-for="(item, index) in league_list" :key="index" :label="item.league" border></el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-card ref="rightCard" :body-style="{padding: '0'}">
            <el-table ref="cardTable"
                      stripe
                      :max-height="cardTableHeight"
                      :data="tableData"
                      :cell-style="{padding: '3px'}">
              <el-table-column prop="league" label="赛事"></el-table-column>
              <el-table-column label="时间">
                <template slot-scope="scope">
                  <div>{{ scope.row.date_str }}</div>
                  <div>{{ scope.row.time_str }}</div>
                </template>
              </el-table-column>
              <el-table-column label="球队">
                <template slot-scope="scope">
                  <div>{{ scope.row.team_1 }}</div>
                  <div>{{ scope.row.team_2 }}</div>
                  <div>和局</div>
                </template>
              </el-table-column>
              <el-table-column label="平博" header-align="center">
                <el-table-column label="输赢盘" header-align="center" align="center">
                  <template slot-scope="scope">
                    <div style="display: flex;justify-content: center;">
                      <div>
                        <div :style="{ color: getColor(scope.row.all.change.odds_team_1.color) }">
                          {{ scope.row.all.odds_team_1 }}
                          <i :class="getIconClass(scope.row.all.change.odds_team_1.direction)"></i>
                        </div>
                        <div :style="{ color: getColor(scope.row.all.change.odds_team_2.color) }">
                          {{ scope.row.all.odds_team_2 }}
                          <i :class="getIconClass(scope.row.all.change.odds_team_2.direction)"></i>
                        </div>
                        <div :style="{ color: getColor(scope.row.all.change.odds_and.color) }">
                          {{ scope.row.all.odds_and }}
                          <i :class="getIconClass(scope.row.all.change.odds_and.direction)"></i>
                        </div>
                      </div>
                      <div style="margin-left: 10px;box-sizing: border-box;">
                        <div :style="{ color: getColor(scope.row.all.change.odds_team_1.color) }">
                          {{ get_diff_str(scope.row.all.change.odds_team_1) }}
                        </div>
                        <div :style="{ color: getColor(scope.row.all.change.odds_team_2.color) }">
                          {{ get_diff_str(scope.row.all.change.odds_team_2) }}
                        </div>
                        <div :style="{ color: getColor(scope.row.all.change.odds_and.color) }">
                          {{ get_diff_str(scope.row.all.change.odds_and) }}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="让球盘" header-align="center">
                  <template slot-scope="scope">
                    <div style="display: flex;justify-content: center;">
                      <div v-if="scope.row.lets.let_team === 'team_1'">
                        <div>{{ scope.row.lets.let }}</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                      </div>
                      <div v-if="scope.row.lets.let_team === 'team_2'">
                        <div>&nbsp;</div>
                        <div>{{ scope.row.lets.let }}</div>
                        <div>&nbsp;</div>
                      </div>
                      <div style="margin-left: 10px;box-sizing: border-box;">
                        <div :style="{ color: getColor(scope.row.lets.change.odds_team_1.color) }">
                          {{ scope.row.lets.odds_team_1 }}
                          <i :class="getIconClass(scope.row.lets.change.odds_team_1.direction)"></i>
                        </div>
                        <div :style="{ color: getColor(scope.row.lets.change.odds_team_2.color) }">
                          {{ scope.row.lets.odds_team_2 }}
                          <i :class="getIconClass(scope.row.lets.change.odds_team_2.direction)"></i>
                        </div>
                        <div>&nbsp;</div>
                      </div>
                      <div style="margin-left: 10px;box-sizing: border-box;">
                        <div :style="{ color: getColor(scope.row.lets.change.odds_team_1.color) }">
                          {{ get_diff_str(scope.row.lets.change.odds_team_1) }}
                        </div>
                        <div :style="{ color: getColor(scope.row.lets.change.odds_team_2.color) }">
                          {{ get_diff_str(scope.row.lets.change.odds_team_2) }}
                        </div>
                        <div>&nbsp;</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="大小盘" header-align="center">
                  <template slot-scope="scope">
                    <div style="display: flex;justify-content: center;">
                      <div>
                        <div>{{ scope.row.sizes.range }}</div>
                        <div>{{ scope.row.sizes.size }}</div>
                        <div>&nbsp;</div>
                      </div>
                      <div style="margin-left: 10px;box-sizing: border-box;">
                        <div :style="{ color: getColor(scope.row.sizes.change.odds_team_1.color) }">
                          {{ scope.row.sizes.odds_team_1 }}
                          <i :class="getIconClass(scope.row.sizes.change.odds_team_1.direction)"></i>
                        </div>
                        <div :style="{ color: getColor(scope.row.sizes.change.odds_team_2.color) }">
                          {{ scope.row.sizes.odds_team_2 }}
                          <i :class="getIconClass(scope.row.sizes.change.odds_team_2.direction)"></i>
                        </div>
                        <div>&nbsp;</div>
                      </div>
                      <div style="margin-left: 20px;box-sizing: border-box;">
                        <div :style="{ color: getColor(scope.row.sizes.change.odds_team_1.color) }">
                          {{ get_diff_str(scope.row.sizes.change.odds_team_1) }}
                        </div>
                        <div :style="{ color: getColor(scope.row.sizes.change.odds_team_2.color) }">
                          {{ get_diff_str(scope.row.sizes.change.odds_team_2) }}
                        </div>
                        <div>&nbsp;</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row ref="footerRow" style="height: 260px">
        <el-col :span="24">
          <el-card style="height: 260px;"
                   ref="footCard"
                   :body-style="{ padding: '15px', overflow: 'auto', height: '100%', boxSizing: 'border-box'}" >
            <div :style="{color: getColor(log.color)}" v-for="(log, index) in logs_list" :key="index">
              【 {{ log.czsj }} 】{{ log.league }} {{ log.team_1 }} VS {{ log.team_2 }} 赔率从 {{ log.odds_val_db }} ~ {{ log.odds_val_now }} <span v-html="upDownSymbol[log.direction]"></span> {{ log.diff }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  components: {},
  data() {
    return {
      appStyle: {},
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      tableData: [],
      logs_list: [],
      cardTableHeight: 200,
      checkedList: [],
      username: "",
      password: "",
      spanArr: [],
      position: 0,
      league_list: [], // 联赛列表
      league_selected: [], // 选中联赛列表
      apiUrl: "http://8.138.17.106:8999",
      logMaxDate: "",
      logIntervalId: "",
      upDownSymbol: {
        "上升": "&uarr;&uarr;&uarr;&uarr;&uarr;&uarr;&uarr;&uarr;&uarr;&uarr;",
        "下降": "&darr;&darr;&darr;&darr;&darr;&darr;&darr;&darr;&darr;&darr;",
      }
    };
  },
  mounted() {
    document.title = '联赛工具';
    this.handleResize();
    this.get_league();
    this.getTableData();
    this.getLogMaxDate();
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听器，避免内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
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
    // 根据涨跌幅设置文字颜色
    getColor(value) {
      console.log("value", value)
      if (value === "红色") {
        return 'red';
      } else if (value === "绿色") {
        return 'green';
      }
      return 'black';
    },
    // 根据涨跌幅设置图标类名
    getIconClass(value) {
      if (value === "上升") {
        return 'el-icon-arrow-up';
      } else if (value === "下降") {
        return 'el-icon-arrow-down';
      }
      return '';
    },
    get_league() {
      let league_list = [];
      axios.request({
        method: 'post',
        url: this.apiUrl + '/boping/datas_boping',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "league": []
        })
      }).then((response) => {
        // console.log("get_league", response)
        for (let key in response.data.data) {
          league_list.push({
            "league": response.data.data[key].league
          })
        }
        this.league_list = league_list;
      }).catch((error) => {
        console.log("get_league", error);
        this.$notify({
          title: '警告',
          message: '网络请求失败请刷新或更换网络后重试！',
          type: 'warning'
        });
      });

    },
    async getTableData() {
      let tableData = [];
      await axios.request({
        method: 'post',
        url: this.apiUrl + '/boping/datas_boping',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "league": this.league_selected
        })
      }).then((response) => {
        console.log("response2", response)
        for (let key in response.data.data) {
          tableData.push(JSON.parse(response.data.data[key].data));
        }
        console.log("tableData", tableData)
        this.tableData = tableData;
      }).catch((error) => {
        console.log("getTableData", error);
        this.$notify({
          title: '警告',
          message: '网络请求失败请刷新或更换网络后重试！',
          type: 'warning'
        });
      });
      if (this.logIntervalId !== "") {
        clearInterval(this.logIntervalId)
      }
      this.logIntervalId = setInterval(() => {
        this.getLogData();
      }, 5000)
    },
    get_diff_str(data) {
      // console.log("data", data)
      let diff_str = ""
      try {
        let num = data.diff;
        let diff = Number(num.toFixed(3));
        if (data.direction === '上升') {
          diff_str = "+" + diff;
        } else if (data.direction === '下降') {
          diff_str = "-" + diff;
        }
      } catch (e) {
        console.log("getDiffStr", e)
      }
      return diff_str
    },
    leagueChange(value) {
      console.log("leagueChange", value)
      this.league_selected = value;
    },
    getNowDate() {
      let now = new Date();
      let year = now.getFullYear();
      let month = String(now.getMonth() + 1).padStart(2, '0');
      let day = String(now.getDate()).padStart(2, '0');
      let hours = String(now.getHours()).padStart(2, '0');
      let minutes = String(now.getMinutes()).padStart(2, '0');
      let seconds = String(now.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getLogMaxDate() {
      try {
        axios.request({
          method: 'post',
          url: this.apiUrl + '/boping/get_boping_log_max',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            "league": this.league_selected,
          })
        }).then((response) => {
          this.logMaxDate = response.data.data[0].czsj;
        }).catch((error) => {
          console.log("getLogMaxDate", error);
          this.logMaxDate = ""
          this.$notify({
            title: '警告',
            message: '网络请求失败请刷新或更换网络后重试！',
            type: 'warning'
          });
        });
      } catch (e) {
        this.logMaxDate = ""
      }
    },
    async getLogData() {
      let logs_list = [
        {
          "platform": "平博",
          "id": "1605177219",
          "timestamp": "1741255200000",
          "date_str": "2025-03-06",
          "time_str": "18:00:00",
          "league": "阿塞拜疆 - 甲级联赛",
          "team_1": "巴库MOIK",
          "team_2": "洛克巴坦卡拉巴赫",
          "typename": "输赢盘",
          "key": "odds_team_1",
          "odds_val_now": "2.06",
          "odds_val_db": "2.07",
          "diff": "0.01",
          "color": "绿色",
          "direction": "下降",
          "czsj": "2025-03-06 15:45:17"
        },
        {
          "platform": "平博",
          "id": "1605177219",
          "timestamp": "1741255200000",
          "date_str": "2025-03-06",
          "time_str": "18:00:00",
          "league": "阿塞拜疆 - 甲级联赛",
          "team_1": "巴库MOIK",
          "team_2": "洛克巴坦卡拉巴赫",
          "typename": "输赢盘",
          "key": "odds_team_2",
          "odds_val_now": "2.84",
          "odds_val_db": "2.85",
          "diff": "0.01",
          "color": "绿色",
          "direction": "下降",
          "czsj": "2025-03-06 15:45:17"
        },
        {
          "platform": "平博",
          "id": "1605177219",
          "timestamp": "1741255200000",
          "date_str": "2025-03-06",
          "time_str": "18:00:00",
          "league": "阿塞拜疆 - 甲级联赛",
          "team_1": "巴库MOIK",
          "team_2": "洛克巴坦卡拉巴赫",
          "typename": "输赢盘",
          "key": "odds_and",
          "odds_val_now": "3.56",
          "odds_val_db": "3.51",
          "diff": "0.05",
          "color": "红色",
          "direction": "上升",
          "czsj": "2025-03-06 15:45:17"
        },
        {
          "platform": "平博",
          "id": "1605177219",
          "timestamp": "1741255200000",
          "date_str": "2025-03-06",
          "time_str": "18:00:00",
          "league": "阿塞拜疆 - 甲级联赛",
          "team_1": "巴库MOIK",
          "team_2": "洛克巴坦卡拉巴赫",
          "typename": "让球盘",
          "key": "odds_team_1",
          "odds_val_now": "1.826",
          "odds_val_db": "1.833",
          "diff": "0.007",
          "color": "绿色",
          "direction": "下降",
          "czsj": "2025-03-06 15:45:17"
        },
        {
          "platform": "平博",
          "id": "1605177219",
          "timestamp": "1741255200000",
          "date_str": "2025-03-06",
          "time_str": "18:00:00",
          "league": "阿塞拜疆 - 甲级联赛",
          "team_1": "巴库MOIK",
          "team_2": "洛克巴坦卡拉巴赫",
          "typename": "让球盘",
          "key": "odds_team_2",
          "odds_val_now": "1.884",
          "odds_val_db": "1.877",
          "diff": "0.007",
          "color": "红色",
          "direction": "上升",
          "czsj": "2025-03-06 15:45:17"
        },
        {
          "platform": "平博",
          "id": "1605177219",
          "timestamp": "1741255200000",
          "date_str": "2025-03-06",
          "time_str": "18:00:00",
          "league": "阿塞拜疆 - 甲级联赛",
          "team_1": "巴库MOIK",
          "team_2": "洛克巴坦卡拉巴赫",
          "typename": "大小盘",
          "key": "odds_team_1",
          "odds_val_now": "1.819",
          "odds_val_db": "1.877",
          "diff": "0.058",
          "color": "绿色",
          "direction": "下降",
          "czsj": "2025-03-06 15:45:17"
        },
        {
          "platform": "平博",
          "id": "1605177219",
          "timestamp": "1741255200000",
          "date_str": "2025-03-06",
          "time_str": "18:00:00",
          "league": "阿塞拜疆 - 甲级联赛",
          "team_1": "巴库MOIK",
          "team_2": "洛克巴坦卡拉巴赫",
          "typename": "大小盘",
          "key": "odds_team_2",
          "odds_val_now": "1.884",
          "odds_val_db": "1.833",
          "diff": "0.051",
          "color": "红色",
          "direction": "上升",
          "czsj": "2025-03-06 15:45:17"
        }
      ]
      logs_list = [];
      axios.request({
        method: 'post',
        url: this.apiUrl + '/boping/datas_boping_log',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "league": this.league_selected,
          // "czsj": now_str
          "czsj": this.logMaxDate
        })
      }).then((response) => {
        console.log("getLogData", response)
        logs_list = response.data.data;
        if (this.logs_list.length <= 0) {
          this.logs_list = logs_list;
        } else {
          this.logs_list.concat(logs_list);
        }
        let last_key = this.logs_list.length - 1
        this.logMaxDate = this.logs_list[last_key].czsj;
        let footCardBody = this.$refs['footCard'].$el.querySelector('.el-card__body');
        // console.log("footCardBody", footCardBody)
        footCardBody.scrollTop = footCardBody.scrollHeight;

      }).catch((error) => {
        console.log("getLogData", error);
        // this.$notify({
        //   title: '警告',
        //   message: '网络请求失败请刷新或更换网络后重试！',
        //   type: 'warning'
        // });
      });
    },
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
