<template>
  <div class="boss">
    <div class="time">
      <lottie
        :options="defaultOptions2"
        :width="50"
        :height="40"
        class="shijian"
      />
      <span class="span1">{{ dateFormat(newDate) }}</span>
      <!-- <span style="margin-left: 15px; color:red ;">今</span>
      <span style="color: yellow;">日</span>
      <span style="color: aqua;">易</span>
      <span style="color: aquamarine;">上</span>
      <span style="color: pink;">分</span> -->
      <div v-if="buzhidao" class="buzhidao">
        <lottie
          :options="defaultOptions1"
          :width="50"
          :height="80"
          class="qiche"
        />
        <span class="span2">{{ $t('dashboard.goDuty') }}！{{ $t('dashboard.goDuty') }}！</span>
      </div>
      <div v-else class="buzhidao">
        <lottie
          :options="defaultOptions3"
          :width="50"
          :height="80"
          class="qiche"
        />
        <span class="span2">{{ $t('dashboard.offDuty') }}！{{ $t('dashboard.offDuty') }}！</span>
      </div>
    </div>
  </div>
</template>

<script>
import Anim1 from '@/assets/lottie/programmer.json'
import Anim2 from '@/assets/lottie/3_实时分析.json'
import Anim3 from '@/assets/lottie/car-loading4-data.json'
export default {
  data() {
    return {
      newDate: new Date(),
      defaultOptions1: { animationData: Anim1, loop: true, autoplay: true },
      defaultOptions2: { animationData: Anim2, loop: true, autoplay: true },
      defaultOptions3: { animationData: Anim3, loop: true, autoplay: true },
      buzhidao: true
    }
  },
  // 挂载时间
  mounted() {
    const that = this
    this.timer = setInterval(function() {
      that.newDate = new Date().toLocaleString()
    })
  },

  // 销毁时清除计时器
  beforeDestroy: function() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // 时间格式化
    dateFormat() {
      var date = new Date()
      var year = date.getFullYear()
      //  * 在日期格式中，月份是从0开始的
      //  * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
      //  * /
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      const week = date.getDay() // 星期
      // 星期日到星期六
      const weekArr = [this.$t('dashboard.sunday'), this.$t('dashboard.monday'), this.$t('dashboard.tuesday'), this.$t('dashboard.wednesday'), this.$t('dashboard.thursday'), this.$t('dashboard.friday'), this.$t('dashboard.saturday')]
      if (hours >= 18) {
        this.buzhidao = false
      }
      // 拼接 时间格式处理
      return year + this.$t('dashboard.year') + month + this.$t('dashboard.month') + day + this.$t('dashboard.day') + hours + ':' + minutes + ':' + seconds + ' ' + weekArr[week]
    }
  }
}
</script>

<style scoped lang="scss">
.time{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -60px;
    // border: 1px solid red;
    .span1{
        font-family: 'ghlh';
        font-size: 20px;
        background-image:-webkit-linear-gradient(top, #bc2f08,#d75d10,#de6912);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        margin-right: 20px;
    }
    .span2{
        // margin-left: 20px;
        font-family: "楷体";
        font-weight: bolder;
        letter-spacing: 2px;
        font-size: 20px;
        background-image:-webkit-linear-gradient(top, #409eff,#8cc5ff);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
    }
}
::v-deep .shijian{
    background-color:transparent !important;
}
.buzhidao{
    display: flex;
    align-items: center;
}
</style>
