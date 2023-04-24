<template>
  <div>
    <el-dropdown>
      <i class="iconfont icon-fanyi" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="$i18n.locale === 'zh'" @click.native="changeLang('zh')">中文</el-dropdown-item>
        <el-dropdown-item :disabled="$i18n.locale === 'en'" @click.native="changeLang('en')">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import jsCookie from 'js-cookie'
export default {
  methods: {
    changeLang(v) {
      jsCookie.set('lang', v)
      this.$i18n.locale = v
      this.$router.go(0)
    }
  }
}
</script>

<style scoped lang="scss">
 .icon-fanyi{
      font-size: 30px;
      &:hover{
        cursor:pointer
      }
    }
</style>
