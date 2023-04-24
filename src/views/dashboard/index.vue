<template>
  <div class="boss">
    <el-card class="box-card1">
      <div class="tp">
        <div class="item">
          <span class="iconfont icon-xinzengyonghu" />
          <div class="data">
            <span>{{ panel.increment_users }}</span>
            <!--今日新增用户  -->
            <span>{{ $t('dashboard.newUserToday') }}</span>
          </div>
        </div>
        <div class="item">
          <span class="iconfont icon-renyuanzongshu" />
          <div class="data">
            <span>{{ panel.total_users }}</span>
            <!--用户总量  -->
            <span>{{ $t('dashboard.userGross') }}</span>
          </div>
        </div>
        <div class="item">
          <span class="iconfont icon-shiti" />
          <div class="data">
            <span>{{ panel.increment_questions }}</span>
            <!-- 新增试题 -->
            <span>{{ $t('dashboard.Newquestion') }}</span>
          </div>
        </div>
        <div class="item">
          <span class="iconfont icon-mianshitiku" />
          <div class="data">
            <span>{{ panel.total_questions }}</span>
            <!-- 总试题量 -->
            <span>总试题量</span>
          </div>
        </div>
        <div class="item">
          <span class="el-icon-s-open " />
          <div class="data">
            <span>{{ panel.total_done_questions }}</span>
            <!-- 总刷题量 -->
            <span>总刷题量</span>
          </div>
        </div>
        <div class="item">
          <span class="iconfont icon-woxiezuoye" />
          <div class="data">
            <span>{{ panel.personal_questions }}</span>
            <!-- 人均刷题量 -->
            <span>人均刷题量</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card3">
      <div class="tianqi">
        <div class="xuexi">
          <div class="biaoti">
            干了这碗鸡汤
            <div ref="soup" class="soup" @click="soup">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiaojijiniaodongwu" />
              </svg>
            </div>
          </div>
          <span class="juzi">{{ soupList[num] }}</span>
        </div>
        <div id="he-plugin-standard">
          1
        </div>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div class="tubiao">
        <div id="main" ref="main" style="width: 100%; height: 500px;">
          <template />
        </div>
        <div id="main1" ref="main1" style="width: 100%; height: 500px;">
          <template />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDataAPI, dataStatisticsAPI, hotCitiesAPI } from '@/api/dashboard'
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      panel: {
        // int	刷题总数
        total_done_questions: 0,
        // int	人均刷题数量
        personal_questions: 0,
        // int	用户总数
        total_users: 0,
        // int	今日增长用户数量
        increment_users: 0,
        // int	今日增加题数
        increment_questions: 0,
        // int	题总数
        total_questions: 0
      },
      statistics: '',
      hotCities: '',
      soupList: [
        '我们的目标：向钱看，向厚赚',
        '有梦就去追 没死就别停',
        '既然选择远方，当不负青春，砥砺前行',
        '但行前路，不负韶华',
        '心态决定高度，细节决定成败',
        '琴棋书画不会，洗衣做饭嫌累',
        '恋情就象鬼，信赖的人多，见到的人少',
        '调节好兴奋期，学习一浪高一浪',
        '世界会向那些有目标和远见的人让路',
        '吃掉开心 消化掉不开心',
        '小人间 小人物 小欲望 小美好 小快乐'
      ],
      num: 0,
      dingshiqi: ''
    }
  },
  created() {
    this.getData()
  },
  async mounted() {
    window.WIDGET = {
      'CONFIG': {
        'layout': '1',
        'width': 450,
        'height': 150,
        'background': '1',
        'dataColor': 'FFFFFF',
        'borderRadius': '6',
        'key': '28e4ad04974442bbab29bb1d7514950c'
      }
    };
    (function(d) {
      var c = d.createElement('link')
      c.rel = 'stylesheet'
      c.href = 'https://widget.qweather.net/standard/static/css/he-standard.css?v=1.4.0'
      var s = d.createElement('script')
      s.src = 'https://widget.qweather.net/standard/static/js/he-standard.js?v=1.4.0'
      var sn = d.getElementsByTagName('script')[0]
      sn.parentNode.insertBefore(c, sn)
      sn.parentNode.insertBefore(s, sn)
    })(document)
    await this.getStatistics()
    await this.gethotCities()
    this.myEcharts()
    this.myEcharts1()
    this.dingshiqi = setInterval(() => {
      this.soup()
    }, 7000)
  },
  // 销毁之前
  // 取消定时器
  beforeDestroy() {
    clearInterval(this.dingshiqi)
  },
  methods: {
    // 获取面板数据
    async getData() {
      const res = await getDataAPI()
      this.panel = res.data
      // console.log(res)
    },
    // 企业题目数据统计
    async getStatistics() {
      const res = await dataStatisticsAPI()
      this.statistics = res.data
      // console.log(res.data)
    },
    // 热门城市题目统计
    async gethotCities() {
      const res = await hotCitiesAPI()
      this.hotCities = res.data.map(v => {
        return { id: v.id, name: v.name, value: v.hotNumber }
      })
      // console.log(res.data)
    },
    // 题目图表
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main) // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: '题目统计',
          left: 'left'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 30,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.statistics
            // [
            //   { value: 1048, name: 'Search Engine' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union Ads' },
            //   { value: 300, name: 'Video Ads' }
            // ]
          }
        ]
      }
      myChart.setOption(option)
    },
    // 城市图表
    myEcharts1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main1) // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: '热门城市题目统计',
          left: 'left'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 30,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data:
            // [
            //   { id: 1, name: '北京', value: 10 },
            //   { id: 2, name: '天津', value: 20 },
            //   { id: 3, name: '上海', value: 30 },
            //   { id: 4, name: '重庆', value: 40 },
            //   { id: 5, name: '河北', value: 50 }
            // ]
            this.hotCities
          }
        ]
      }
      myChart.setOption(option)
    },
    // 鸡汤
    soup: _.throttle(function(event) {
      this.$refs.soup.style.transform = 'rotate(-40deg)'
      this.num = parseInt(Math.random() * this.soupList.length)
      // console.log(this.$refs.soup.style)
      setTimeout(() => {
        this.$refs.soup.style.transform = 'rotate(0deg)'
      }, 500)
    }, 1000)
  }
}
</script>

<style scoped lang="scss">
.boss{
  padding: 20px;
  .tp{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .item{
      display: flex;
      align-items: center;
      width: 160px;
      border-radius: 8px;
      height: 100px;
      background-color: #fff;
      .iconfont,.el-icon-s-open{
        text-align: center;
        line-height: 100px;
        font-size: 30px;
        height: 100px;
        width: 60px;
        color: #fff;
        border-radius: 8px 0 0 8px;
        background-color: #5bddc9;
      }
      .icon-xinzengyonghu{
        background-color: #348eed;
      }
      .icon-renyuanzongshu{
        background-color: #28bc6e;
      }
      .icon-shiti{
        background-color: #fd9827;
      }
      .icon-mianshitiku{
        background-color: #ff8eaf;
      }
      .icon-woxiezuoye{
        background-color: #c69bea;
      }
      .data{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        span:nth-child(1){
          font-size: 36px;
          color: #515b6d;
        }
        span:nth-child(2){
          margin-top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
.box-card1{
  background-color: #f5f7f9;
}
.tubiao{
  display: flex;
  align-items: center;
}
.box-card2{
  margin-top: 15px;
  padding-top: 15px;
}
::v-deep .wv-lt-col-5{
  display: none !important;
}
.tianqi{
  display: flex;
  align-items: center;
  .xuexi{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 150px;
    width: 550px;
    border: 1px solid red;
    border-radius: 6px;
    margin-right: 60px;
    font-size: 30px;
    font-family: 'ghl';
    .biaoti{
      font-size: 20px;
      position: absolute;
      padding: 3px;
      background-color: #f5f7f9;
      top: -19px;
      left: 20px;
      display: flex;
      align-items: center;
      .icon{
        margin-left: 10px;
        font-size: 34px;
        &:hover{
          cursor: pointer
        }
      }
    }
  }
}
.box-card3{
  padding-left: 80px;
  margin-top: 15px;
  background-color: #f5f7f9;
}
.soup{
  transform-origin: 50% bottom;
  transition: all 1s;
}
::v-deep .juzi{
  font-family: '楷体';
}
</style>
