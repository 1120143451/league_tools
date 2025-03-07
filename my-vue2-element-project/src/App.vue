<template>
  <div id="app" :style="appStyle" ref="appRef">
    <el-container>
      <el-row ref="topRow">
        <el-col :span="24">
          <el-card :body-style="{padding: '15px'}">
            <el-row :gutter="10" type="flex">
              <el-col :span="24">
                <el-form :inline="true" id="login-form">
                  <el-select
                      v-model="league_selected"
                      @change="leagueChange"
                      multiple
                      collapse-tags
                      style="width: 300px"
                      placeholder="请选择">
                    <el-option
                        v-for="item in league_list"
                        :key="item.league_id"
                        :label="item.league"
                        :value="item.league_id">
                    </el-option>
                  </el-select>
                  <el-form-item style="margin-left: 10px;">
                    <el-button type="primary" @click="get_league">刷新联赛</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getTableData(true)">获取比赛</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" plain>开启监控</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>

          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 10px 0" ref="mainRow">
        <el-col :span="24">
          <el-card ref="rightCard" :body-style="{padding: '0'}">
            <el-table ref="cardTable"
                      class="cardTable"
                      stripe
                      :max-height="cardTableHeight"
                      :data="tableData"
                      :cell-style="{padding: '3px'}">
              <el-table-column prop="league" label="赛事" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="时间" width="60">
                <template slot-scope="scope">
                  <div>{{ getDateStr(scope.row.timestamp, '年月') }}</div>
                  <div>{{ getDateStr(scope.row.timestamp, '分秒') }}</div>
                </template>
              </el-table-column>
              <el-table-column label="球队" class-name="qd_column" width="120">
                <template slot-scope="scope">
                  <div>
                    <div>{{ scope.row.team_1 }}</div>
                    <div>{{ scope.row.team_2 }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="平博" header-align="center">
                <el-table-column label="让球盘" header-align="center" class-name="rqp_column">
                  <template slot-scope="scope">
                    <div class="rqp_div">
                      <div class="rqp_item">
                        {{scope.row.data.lets.let}}
                      </div>
                      <div class="rqp_item">
                        <div :style="{ color: getColor(scope.row.data.lets.change.odds_team_1.color) }">
                          <span>{{scope.row.data.lets.odds_team_1}}</span>
                          <span>{{getIconClass(scope.row.data.lets.change.odds_team_1.direction)}}</span>
                          <span v-if="scope.row.data.lets.change.odds_team_1.direction === '上升' || scope.row.data.lets.change.odds_team_1.direction === '下降'">
                            （{{ get_diff_str(scope.row.data.lets.change.odds_team_1) }}）
                          </span>
                        </div>
                      </div>
                      <div class="rqp_item">
                        <div :style="{ color: getColor(scope.row.data.lets.change.odds_team_2.color) }">
                          <span>{{scope.row.data.lets.odds_team_2}}</span>
                          <span>{{getIconClass(scope.row.data.lets.change.odds_team_2.direction)}}</span>
                          <span v-if="scope.row.data.lets.change.odds_team_2.direction === '上升' || scope.row.data.lets.change.odds_team_2.direction === '下降'">
                            （{{ get_diff_str(scope.row.data.lets.change.odds_team_2) }}）
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="大小盘" header-align="center" class-name="rqp_column">
                  <template slot-scope="scope">
                    <div class="rqp_div">
                      <div class="rqp_item">
                        {{scope.row.data.sizes.range}}
                      </div>
                      <div class="rqp_item">
                        <div :style="{ color: getColor(scope.row.data.sizes.change.odds_team_1.color) }">
                          <span>{{scope.row.data.sizes.odds_team_1}}</span>
                          <span>{{getIconClass(scope.row.data.sizes.change.odds_team_1.direction)}}</span>
                          <span v-if="scope.row.data.sizes.change.odds_team_1.direction === '上升' || scope.row.data.sizes.change.odds_team_1.direction === '下降'">
                            （{{ get_diff_str(scope.row.data.sizes.change.odds_team_1) }}）
                          </span>
                        </div>
                      </div>
                      <div class="rqp_item">
                        <div>
                          <span>{{scope.row.data.sizes.odds_team_2}}</span>
                          <span>{{getIconClass(scope.row.data.sizes.change.odds_team_2.direction)}}</span>
                          <span v-if="scope.row.data.sizes.change.odds_team_2.direction === '上升' || scope.row.data.sizes.change.odds_team_2.direction === '下降'">
                            （{{ get_diff_str(scope.row.data.sizes.change.odds_team_2) }}）
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row ref="footerRow" style="height: 260px" :gutter="5">
        <el-col :span="12">
          <el-card style="height: 260px;"
                   ref="footCard"
                   :body-style="{ padding: '15px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box'}" >
            <div style="font-size: 18px;font-weight: bolder;padding-bottom: 10px;text-align: center;">让球盘日志</div>
            <div v-if="lets_logs.length > 0" style="overflow:auto">
              <div :style="{color: getColor(log.color)}" v-for="(log, index) in lets_logs" :key="index">
                【 {{ log.czsj }} 】{{ log.league }} {{ log.team_1 }} VS {{ log.team_2 }} 赔率从 {{ log.odds_val_db }} ~ {{ log.odds_val_now }} {{upDownSymbol[log.direction]}} {{ log.diff }}
              </div>
            </div>
            <div v-if="lets_logs.length <= 0">
              <div>暂时无日志</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="height: 260px;"
                   ref="footCard"
                   :body-style="{ padding: '15px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box'}" >
            <div style="font-size: 18px;font-weight: bolder;padding-bottom: 10px;text-align: center;">大小盘日志</div>
            <div v-if="sizes_logs.length > 0" style="overflow:auto">
              <div :style="{color: getColor(log.color)}" v-for="(log, index) in lets_logs" :key="index">
                【 {{ log.czsj }} 】{{ log.league }} {{ log.team_1 }} VS {{ log.team_2 }} 赔率从 {{ log.odds_val_db }} ~ {{ log.odds_val_now }} {{upDownSymbol[log.direction]}} {{ log.diff }}
              </div>
            </div>
            <div v-if="lets_logs.length <= 0">
              <div>暂时无日志</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import Mock from 'mockjs'

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
      lets_logs: [], // 让球盘日志
      sizes_logs: [], // 大小盘日志
      league_list: [], // 联赛列表
      league_selected: [], // 选中联赛列表
      apiUrl: "http://8.138.17.106:8999",
      logMaxDate: "",
      logIntervalId: "",
      upDownSymbol: {
        "上升": "↑↑↑↑↑↑↑↑↑↑",
        "下降": "↓↓↓↓↓↓↓↓↓↓",
      }
    };
  },
  mounted() {
    document.title = '联赛工具';
    this.handleResize();
    this.get_league();
    this.getLogData();
    // this.getTableData();
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
      // let leftCard = this.$refs.leftCard;
      let rightCard = this.$refs.rightCard;
      let cardTable = this.$refs.cardTable;
      let mainHeight = this.windowHeight - topRow.$el.offsetHeight - footerRow.$el.offsetHeight;
      mainHeight -= 20; // 20 是内边距的和
      let cardHeight = mainHeight - 20 // 20 是内边距的和
      mainRow.$el.style.height = mainHeight + 'px';
      // leftCard.$el.style.height = cardHeight + 'px';
      rightCard.$el.style.height = cardHeight + 'px';
      this.$nextTick(() => {
        this.cardTableHeight = cardHeight;

      });
      // cardTable.$el.style.maxHeight = cardHeight + 'px';
      // cardTable.$el.style.overflow = 'auto';
      // console.log("cardTable", cardTable)
    },
    // 根据涨跌幅设置文字颜色
    getColor(value) {
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
        // return 'el-icon-arrow-up';
        return '↑';
      } else if (value === "下降") {
        return '↓';
      }
      return '';
    },
    get_league() {
      this.league_selected = [];
      let league_list = [];
      axios.request({
        method: 'post',
        url: this.apiUrl + '/boping/datas_boping',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "ids": []
        })
      }).then((response) => {
        // console.log("get_league", response)
        for (let key in response.data.data) {
          let league_name = response.data.data[key].league;
          let league_id = response.data.data[key].id;
          let flag = league_list.some(item => item.league === league_name);
          if (!flag) {
            league_list.push({
              "league_id": league_id,
              "league":league_name
            })
          }
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
    async getTableData(is_new=false) {
      let tableData = [
        {
          "id": "1605660728",
          "timestamp": "1741309200000",
          "date_str": "2025-03-07",
          "time_str": "09:00:00",
          "league": "北美中美和加勒比足球联合会 - 冠军杯",
          "team_1": "迈阿密国际",
          "team_2": "骑士",
          "data": {
            "lets": {
              "odds_team_1": "0.877",
              "odds_team_2": "0.952",
              "let": "0.5-1",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.877,
                  "odds_old": 0.877,
                  "diff": 1.278,
                  "color": "红色",
                  "direction": "上升"
                },
                "odds_team_2": {
                  "odds_now": 0.952,
                  "odds_old": 0.952,
                  "diff": 0.127,
                  "color": "绿色",
                  "direction": "下降"
                }
              }
            },
            "sizes": {
              "odds_team_1": "1.090",
              "odds_team_2": "0.751",
              "range": "2-2.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.09,
                  "odds_old": 1.09,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.751,
                  "odds_old": 0.751,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605660736",
          "timestamp": "1741309200000",
          "date_str": "2025-03-07",
          "time_str": "09:00:00",
          "league": "墨西哥 - 女子足球甲级联赛",
          "team_1": "蒙特雷",
          "team_2": "帕丘卡\r\n",
          "data": {
            "lets": {
              "odds_team_1": "1.220",
              "odds_team_2": "0.684",
              "let": "0.0",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.22,
                  "odds_old": 1.22,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.684,
                  "odds_old": 0.684,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            },
            "sizes": {
              "odds_team_1": "0.781",
              "odds_team_2": "1.050",
              "range": "3.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.781,
                  "odds_old": 0.781,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 1.05,
                  "odds_old": 1.05,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605670274",
          "timestamp": "1741309200000",
          "date_str": "2025-03-07",
          "time_str": "09:00:00",
          "league": "哥斯达黎加 - 乙级联赛",
          "team_1": "Antioquia",
          "team_2": "卡里阿利波科奇",
          "data": {
            "lets": {
              "odds_team_1": "1.250",
              "odds_team_2": "0.574",
              "let": "0-0.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.25,
                  "odds_old": 1.25,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.574,
                  "odds_old": 0.574,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            },
            "sizes": {
              "odds_team_1": "0.793",
              "odds_team_2": "0.925",
              "range": "4.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.793,
                  "odds_old": 0.793,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.925,
                  "odds_old": 0.925,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605660727",
          "timestamp": "1741309200000",
          "date_str": "2025-03-07",
          "time_str": "09:00:00",
          "league": "墨西哥 - 墨西哥足球拓展联赛",
          "team_1": "UAT走鹃",
          "team_2": "Tepatitlan",
          "data": {
            "lets": {
              "odds_team_1": "1.030",
              "odds_team_2": "0.819",
              "let": "0.0",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.03,
                  "odds_old": 1.03,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.819,
                  "odds_old": 0.819,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            },
            "sizes": {
              "odds_team_1": "1.410",
              "odds_team_2": "0.578",
              "range": "0.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.41,
                  "odds_old": 1.41,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.578,
                  "odds_old": 0.578,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605671483",
          "timestamp": "1741309200000",
          "date_str": "2025-03-07",
          "time_str": "09:00:00",
          "league": "巴拿马女足联赛",
          "team_1": "圣菲",
          "team_2": "马里奥门德斯学院",
          "data": {
            "lets": {
              "odds_team_1": "0.793",
              "odds_team_2": "0.943",
              "let": "0.0",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.793,
                  "odds_old": 0.793,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.943,
                  "odds_old": 0.943,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            },
            "sizes": {
              "odds_team_1": "1.160",
              "odds_team_2": "0.632",
              "range": "3.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.16,
                  "odds_old": 1.16,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.632,
                  "odds_old": 0.632,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605660735",
          "timestamp": "1741309560000",
          "date_str": "2025-03-07",
          "time_str": "09:06:00",
          "league": "危地马拉 - 全国联赛",
          "team_1": "马拉卡特科",
          "team_2": "科班帝国",
          "data": {
            "lets": {
              "odds_team_1": "0.934",
              "odds_team_2": "0.862",
              "let": "0-0.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.934,
                  "odds_old": 0.934,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.862,
                  "odds_old": 0.862,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            },
            "sizes": {
              "odds_team_1": "0.952",
              "odds_team_2": "0.833",
              "range": "3.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.952,
                  "odds_old": 0.952,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.833,
                  "odds_old": 0.833,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605700523",
          "timestamp": "1741311000000",
          "date_str": "2025-03-07",
          "time_str": "09:30:00",
          "league": "洪都拉斯 - Ascenso联赛",
          "team_1": "Parrillas One",
          "team_2": "CD Choloma",
          "data": {
            "lets": {
              "odds_team_1": "0.990",
              "odds_team_2": "0.735",
              "let": "0.5-1",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.99,
                  "odds_old": 0.99,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.735,
                  "odds_old": 0.735,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            },
            "sizes": {
              "odds_team_1": "0.900",
              "odds_team_2": "0.819",
              "range": "2-2.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.9,
                  "odds_old": 0.9,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.819,
                  "odds_old": 0.819,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605660896",
          "timestamp": "1741311000000",
          "date_str": "2025-03-07",
          "time_str": "09:30:00",
          "league": "洪都拉斯 - 全国联赛",
          "team_1": "皇家社会",
          "team_2": "莫塔瓜",
          "data": {
            "lets": {
              "odds_team_1": "0.636",
              "odds_team_2": "1.220",
              "let": "0.0",
              "change": {
                "odds_team_1": {
                  "odds_now": 0.636,
                  "odds_old": 0.636,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 1.22,
                  "odds_old": 1.22,
                  "diff": 0,
                  "color": "绿色",
                  "direction": "下降"
                }
              }
            },
            "sizes": {
              "odds_team_1": "1.030",
              "odds_team_2": "0.751",
              "range": "1.0",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.03,
                  "odds_old": 1.03,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.751,
                  "odds_old": 0.751,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        },
        {
          "id": "1605661966",
          "timestamp": "1741312800000",
          "date_str": "2025-03-07",
          "time_str": "10:00:00",
          "league": "南美足协 - 南美俱乐部杯",
          "team_1": "基多天主教大学足球俱乐部",
          "team_2": "奥卡斯",
          "data": {
            "lets": {
              "odds_team_1": "1.090",
              "odds_team_2": "0.769",
              "let": "0-0.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.09,
                  "odds_old": 1.09,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                },
                "odds_team_2": {
                  "odds_now": 0.769,
                  "odds_old": 0.769,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            },
            "sizes": {
              "odds_team_1": "1.040",
              "odds_team_2": "0.793",
              "range": "1.5",
              "change": {
                "odds_team_1": {
                  "odds_now": 1.04,
                  "odds_old": 1.04,
                  "diff": 0,
                  "color": "红色",
                  "direction": "上升"
                },
                "odds_team_2": {
                  "odds_now": 0.793,
                  "odds_old": 0.793,
                  "diff": 0,
                  "color": "黑色",
                  "direction": "不变"
                }
              }
            }
          },
          "czsj": "2025-03-07 10:44:13"
        }
      ];
      this.tableData = tableData;
      tableData = [];
      await axios.request({
        method: 'post',
        url: this.apiUrl + '/boping/datas_boping',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "ids": this.league_selected
        })
      }).then((response) => {
        console.log("response2", response)
        tableData = response.data.data;
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
      if(is_new) {
        this.getLogMaxDate();
      }
      await this.getLogData();
      this.logIntervalId = setInterval(() => {
         this.getLogData();
      }, 5000)
      // await this.getLogData();
    },
    get_diff_str(data) {
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
    /**
     *
     * @param timestamp
     * @param type 年月|分秒
     * @returns string
     */
    getDateStr(timestamp, type) {
      timestamp = parseInt(timestamp)
      // 创建 Date 对象
      let date = new Date(timestamp);
      // 获取月份（注意：getMonth() 返回的月份是从 0 开始计数的，所以要加 1）
      let month = String(date.getMonth() + 1).padStart(2, '0');
      // 获取日期
      let day = String(date.getDate()).padStart(2, '0');
      // 获取小时
      let hours = String(date.getHours()).padStart(2, '0');
      // 获取分钟
      let minutes = String(date.getMinutes()).padStart(2, '0');
      if (type === '年月') {
        return `${month}/${day}`
      } else if (type === '分秒') {
        return `${hours}:${minutes}`
      }
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
    mockLogData() {
      // 定义可能的值数组
      let platforms = ['平博'];
      let leagues = ['阿塞拜疆 - 甲级联赛'];
      let team1s = ['巴库MOIK'];
      let team2s = ['洛克巴坦卡拉巴赫'];
      let typenames = ['输赢盘', '让球盘', '大小盘'];
      let keys = ['odds_team_1', 'odds_team_2', 'odds_and'];
      let directions = ['上升', '下降'];

      // 定义数据模板
      let dataTemplate = {
        'list|20': [
          {
            'platform': () => Mock.Random.pick(platforms),
            'id': () => Mock.Random.string('number', 10),
            'timestamp': () => Mock.Random.date('T'),
            'date_str': () => Mock.Random.date('yyyy-MM-dd'),
            'time_str': () => Mock.Random.time('HH:mm:ss'),
            'league': () => Mock.Random.pick(leagues),
            'team_1': () => Mock.Random.pick(team1s),
            'team_2': () => Mock.Random.pick(team2s),
            'typename': () => Mock.Random.pick(typenames),
            'key': () => Mock.Random.pick(keys),
            'odds_val_now': () => (Math.random() * 5 + 1).toFixed(3),
            'direction': () => Mock.Random.pick(directions),
            'odds_val_db': function () {
              const now = parseFloat(this.odds_val_now);
              const diff = Math.random() * 0.1;
              return (this.direction === '上升' ? now - diff : now + diff).toFixed(3);
            },
            'diff': function () {
              return (Math.abs(parseFloat(this.odds_val_now) - parseFloat(this.odds_val_db))).toFixed(3);
            },
            'color': function () {
              return this.direction === '上升' ? '红色' : '绿色';
            },
            'czsj': () => Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
          }
        ]
      };

      // 生成模拟数据
      let mock_list = Mock.mock(dataTemplate);
      console.log("mock_log_list", mock_list);
      return mock_list['list'];
    },
    async getLogData() {
      this.lets_logs = this.mockLogData();
      this.sizes_logs = this.mockLogData();
      return;
      // this.logs_list = [];
      let logs_list = [];
      await axios.request({
        method: 'post',
        url: this.apiUrl + '/boping/datas_boping_log',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "ids": this.league_selected,
          // "czsj": now_str
          "czsj": this.logMaxDate
        })
      }).then((response) => {
        // console.log("getLogData", response)
        logs_list = response.data.data;
        if (this.logs_list.length <= 0) {
          this.logs_list = logs_list;
          // this.logs_list = [...this.logs_list, ...logs_list2];
        } else {
          // this.logs_list.concat(logs_list);
          this.logs_list = [...this.logs_list, ...logs_list];
          // this.logs_list = [...this.logs_list, ...logs_list2];
        }
        if (this.logs_list.length > 0) {
          let last_key = this.logs_list.length - 1;
          this.logMaxDate = this.logs_list[last_key].czsj;
        }
        console.log("this.logs_list", this.logs_list)
        setTimeout(() => {
          let footCardBody = this.$refs['footCard'].$el.querySelector('.el-card__body');
          // console.log("footCardBody", footCardBody)
          footCardBody.scrollTop = footCardBody.scrollHeight;
        }, 300)


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



.cardTable .el-table__body .cell, .qd_column, .rqp_column,.cardTable .el-table__cell {
  padding: 0 !important;
}

.cardTable, .el-table th {
  color: #000000 !important;
  font-size: 16px!important;
  font-weight: bold!important;
}


.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf, .el-table .el-table__cell.is-center {
  border-bottom: 2px solid #DCDFE6!important;
}

.el-table--border .el-table__cell, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixe {
  border-right: 2px solid #DCDFE6!important;
}
/*.el-table__body {
  border-bottom: 1px solid #000!important;
}
.el-table__header {
  border-bottom: none;
}

.el-table--border .el-table__cell, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
  border-right: 1px solid #000!important;
}

.el-table--border th.el-table__cell, .el-table__fixed-right-patch {
  border-bottom: 1px solid #000!important;
}*/

.rqp_div{
  display: flex;
}

.rqp_item{
  height: 50px;
  flex: 1;
  /*border-left: 1px solid #000;*/
  place-items: center;
  /* 让边框包含在元素的宽度和高度内 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.rqp_item:first-child {
  border-left: none;
}
.rqp_item div {
  /*border-bottom: 1px solid #000;*/
  width: 100%;
  text-align: center;
}
.rqp_item div:last-child {
  border-bottom: none;
}
</style>
