<template>
  <div class="login">
    <div class="boss">
      <div class="title">
        <img src="@/assets/img/layout_logo.png" alt="">
        黑马面面 | 用户登录
      </div>
      <div class="form">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="code">
            <div class="code">
              <el-input v-model="form.code" class="input" placeholder="请输入验证码" />
              <img :src="`${baseURl}/captcha?type=login&${xxx=num}`" alt="" @click="code">
            </div>
          </el-form-item>
          <el-form-item prop="checked">
            <el-checkbox v-model="checked">我已阅读并同意<a ref="#">用户协议</a>和<a ref="#">隐私条款</a></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sumbit">登录</el-button>
            <el-button @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bg" />
    <register ref="dialog" />
  </div>
</template>

<script>
import { postLoginAPI } from '@/api/login'
import register from './DiaLog/index.vue'
import jsCookie from 'js-cookie'
export default {
  components: {
    register
  },
  inject: ['reload'],
  data() {
    return {
      form: {
        phone: '18511111111',
        password: '12345678',
        code: ''
      },
      checked: '',
      num: '',
      baseURl: process.env.VUE_APP_BASE_URL,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
          // { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确手机号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'change' }
        ],
        checked: [
          { validator: (rule, value, callback) => {
            if (this.checked) {
              callback()
            } else {
              callback(new Error('请勾选协议'))
            }
          }, trigger: 'change' }
        ]
      },
      a: jsCookie.get('b') && true
    }
  },
  created() {
    if (location.href.indexOf('#reloaded') === -1) {
      location.href = location.href + '#reloaded'
      location.reload()
    }
  },

  methods: {
    // 改变验证码
    code() {
      this.num = Date.now()
    },
    // 登录
    async sumbit() {
      this.$refs.form.validate(async x => {
        if (x) {
          const res = await postLoginAPI(this.form)
          console.log(res)
          this.$message.success('登录成功')
          this.$store.commit('user/setToken', res.data.token)
          this.$router.push('/dashboard')
        }
      })
    },
    // 注册
    register() {
      this.$refs.dialog.show = true
    }
  }
}
</script>

<style scoped lang="scss">
.login{
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background:linear-gradient(#1493fa,#01c6fa) !important;
  padding-left: 100px;
  background-position: 760px;
  .bg{
    width: 633px;
    height: 435px;
    background: url('~@/assets/img/login_banner_ele.png') no-repeat;
    margin-left: 200px;
  }
}
.boss{
  width: 480px;
  height: 550px;
  background-color: #f5f5f5;
  padding: 40px 30px 0 40px;
  .title{
    font-size: 24px;
    img{
      width: 25px;
      height: 18px;
    }
  }
  .form{
      margin-top: 30px;
     .code{
      display: flex;
      align-items: center;
      img{
        width: 130px;
        height: 40px;
      }
      .input{
        flex: 1;
      }
     }
     a{
      color: #07b5fa;
     }
    }
}
::v-deep .el-form-item__content{
  margin-left: 0 !important;
}
.el-button{
  width: 100%;
}
.el-button--default{
  margin-left: 0;
  margin-top: 30px;
}

::v-deep .el-form-item__error{
  left: 100px;
}
</style>
