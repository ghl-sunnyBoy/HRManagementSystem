<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- src="https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0" -->
    <div class="right-menu">
      <Logo v-if="showLogo" :collapse="isCollapse" />
      <div class="time"><Showtime /></div>
      <div class="info">
        <lang />
        <img :src="baseUrl + userInfo.avatar" alt="">
        <span>{{ userInfo.role }},{{ $i18n.t('user.hello') }}</span>
        <el-tooltip class="item" effect="light" content="暂无该模块" placement="bottom-end">
          <el-badge is-dot class="item">
            <i class="el-icon-bell" />
          </el-badge>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="点击退出登录" placement="bottom">
          <span class="iconfont icon-tuichu" @click="logOut" />
        </el-tooltip>
      </div>
    </div>
    <div class="zhanwei" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import lang from '@/components/lib/lang.vue'
import Showtime from '@/components/lib/time.vue'
import Logo from '@/layout/components/Sidebar/Logo.vue'
export default {
  components: {
    // Breadcrumb,
    Hamburger,
    lang,
    Showtime,
    Logo
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    ...mapState('user', ['userInfo'])
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      showLogo: true,
      isCollapse: false
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 退出登录
    logOut() {
      this.$confirm('确认退出登录', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('退出登录')
        this.$store.commit('user/logOut')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
    // 全屏功能
    // 全屏点击
    // fullClick() {
    //   if (screenfull.isEnabled) {
    //     screenfull.toggle()
    //   } else {
    //     this.$message.error('该浏览器不支持全屏')
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  // margin-left: -100px;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 30px;
    padding-left: 30px;

    img {
      width: 40px;
      height: 40px;
      margin-left: 50px;
    }

    span {
      margin-left: 10px;
      margin-right: 20px;
      font-family: '黑体';
      font-size: 18px;
    }

    .item {
      margin-right: 20px;
    }

    .el-icon-bell {
      font-size: 20px;

      &:hover {
        cursor: pointer
      }
    }

    .icon-tuichu {
      font-size: 18px;

      &:hover {
        cursor: pointer
      }
    }
  }
}
.info{
  display: flex;
  align-items: center;
}
::v-deep #he-plugin-simple{
  width: 200px !important;
}
.time{
  margin-left: -20px;
}
::v-deep .sidebar-logo-container{
  margin-left: -45px;
  width: 200px !important;
}
.boss{
  padding-left: 10px !important;
}
.navbar{
  position: fixed;
    top: 0;
    z-index: 99;
    width: 100%;
}

</style>
