<template>
  <div :class="{ 'has-logo': showLogo }" class="boss">
    <!-- <nav-bar /> -->
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div ref="kaiiguan" class="kaiiguan" @click="kaiiguan()">
      <span />
      <svg v-if="bul" class="icon" aria-hidden="true">
        <use xlink:href="#icon-kaixinxingxing" />
      </svg>
      <svg v-else class="icon" aria-hidden="true">
        <use xlink:href="#icon-bukaixinxingxing2" />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
// import NavBar from '@/layout/components/Navbar.vue'
export default {
  components: {
    SidebarItem
    // NavBar,
    // Logo
  },
  data() {
    return {
      bul: true
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.live2d()
  },
  methods: {
    kaiiguan() {
      if (this.bul) {
        this.bul = !this.bul
        this.$refs.kaiiguan.style.transform = 'translateY(40px)'
        setTimeout(() => {
          this.$refs.kaiiguan.style.transform = 'translateY(0px)'
        // this.$router.go(0)
        }, 500)
        // this.live2d()
      } else {
        this.bul = !this.bul
        this.$refs.kaiiguan.style.transform = 'translateY(40px)'
        setTimeout(() => {
          this.$refs.kaiiguan.style.transform = 'translateY(0px)'
        // this.$router.go(0)
        }, 500)
      }
    },
    live2d() {
      setTimeout(() => {
        window.L2Dwidget.init({
          // pluginRootPath: '../public/static/live2dw/',
          pluginRootPath: '../../../../public/static/live2dw/',
          pluginJsPath: 'lib/',
          pluginModelPath: `live2d-widget-model-haru_2/assets/`, // 中间这个haru_2就是你的老婆,想换个老婆,换这个就可以了
          tagMode: false,
          debug: false,
          model: { jsonPath: `../static/live2dw/live2d-widget-model-haru_2/assets/haru02.model.json` },
          display: { position: 'left', width: 200, height: 430, vOffset: 10 }, // 调整大小,和位置
          mobile: { show: true }, // 要不要盯着你的鼠标看
          react: { opacity: 1 },
          log: false
        })
      }, 1000)
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-scrollbar {
  background-color: #fff;
}

::v-deep .el-menu {
  background-color: #fff !important;
}

::v-deep .el-menu-item {
  background-color: #fff !important;
  color: #000000 !important;
}

::v-deep .el-menu-item:hover {
  background-color: red;
}

::v-deep a {

  &.router-link-exact-active,
  &:hover {
    .svg-icon {
      color: #66b1ff;
    }

    span {
      color: #66b1ff;
    }

    .el-menu-item {
      background-color: #ecf5ff !important;
    }
  }
}

.boss {
  margin-top: 50px;
  background-color: #fff;
  position: relative;
}

.kaiiguan {
  width: 50px;
  height: 100px;
  // background-color: red;
  position: absolute;
  left: 10px;
  top: 380px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 1s;
  &:hover{
    cursor:pointer
  }
  span{
    width: 2px;
    height: 60px;
    background-color: #66b1ff;
  }
  .icon{
    width: 30px;
    height: 30px;
  }
}
</style>
