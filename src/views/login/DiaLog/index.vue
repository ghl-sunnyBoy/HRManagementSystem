<template>
  <div>
    <el-dialog title="用户注册" :visible.sync="show" @close="close">
      {{ form }}
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="头像" prop="avatar">
          <hearPhoto v-model="img" @head="head" @photo="photo" />
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password />
        </el-form-item>
        <el-form-item label="图形码" prop="code">
          <div class="code">
            <el-input v-model="form.code" class="input" />
            <img :src="`${baseURl}/captcha?type=sendsms&${num}`" alt="" @click="changeCode">
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <div class="code">
            <el-input v-model="form.rcode" class="input" />
            <el-button ref="btn" :disabled="disabled" @click="getCode">{{ text }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="sumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import hearPhoto from '@/components/lib/headPhoto.vue'
import { putCodeAPI, putSendsmsAPI } from '@/api/login'
export default {
  components: {
    hearPhoto
  },
  data() {
    return {
      show: false,
      form: {
        // 昵称
        username: '',
        // 手机
        phone: '',
        // 邮箱
        email: '',
        // 头像地址
        avatar: '',
        // 密码
        password: '',
        // 验证码
        rcode: '',
        // 图形码
        code: ''
      },
      // code: '',
      img: '',
      //   表单验证
      rules: {
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确手机号', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确邮箱', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ],
        rcode: [
          { required: true, message: '请输入验证码', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入图形吗', trigger: 'change' }
        ],
        avatar: [
          // { required: true, message: '请选择头像', trigger: 'blur' },
          { validator: (bulr, value, ballback) => {
            if (this.form.avatar !== '') {
              ballback()
            } else {
              ballback(new Error('请选择头像'))
            }
          }, trigger: 'change' }
        ]
      },
      num: '',
      //   基地址
      baseURl: process.env.VUE_APP_BASE_URL,
      disabled: false,
      text: '获取用户验证码',
      jishiqi: ''
    }
  },
  methods: {
    // 改变图形码
    changeCode() {
      this.num = Date.now()
    },
    // 获取用户验证码
    async getCode() {
      let rls = 0
      let time = 6
      this.$refs.form.validateField(['phone', 'code'], async(error) => {
        // console.log('error', error)
        if (error === '') {
          rls++
          console.log(rls)
          if (rls === 2) {
            const res = await putCodeAPI({
              code: this.form.code,
              phone: this.form.phone
            })
            this.disabled = true
            this.jishiqi = setInterval(() => {
              time--
              this.text = `获取用户验证码(${time})`
              if (time <= 0) {
                this.disabled = false
                this.text = `获取用户验证码`
                clearInterval(this.jishiqi)
              }
            }, 1000)
            this.$message.success('验证码' + res.data.captcha)
          }
        }
      })
    },
    // 头像赋值
    photo(v) {
      this.form.avatar = v
    },
    // 确定
    sumbit() {
      this.$refs.form.validate(async x => {
        if (x) {
          const res = await putSendsmsAPI(this.form)
          this.$message.success('注册成功')
          console.log(res)
          this.show = false
        }
      })
    },
    // 关闭清空
    close() {
      this.$refs.form.resetFields()
      this.form = {
      // 昵称
        username: '',
        // 手机
        phone: '',
        // 邮箱
        email: '',
        // 头像地址
        avatar: '',
        // 密码
        password: '',
        // 验证码
        rcode: '',
        // 图形码
        code: ''
      }
    },
    // 头像验证
    head() {
      this.$refs.form.validateField(['avatar'], (error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped  lang="scss">
::v-deep .el-dialog__header{
    height: 60px;
    background-color: #03befa;
    text-align: center;
    .el-dialog__title{
        color: #fff;
    }
}
::v-deep .dialog-footer{
    text-align: center;
}
::v-deep .el-upload{
    margin-left: 100px;
}
.demo-ruleForm{
    padding-left: 40px;
}
::v-deep .el-input{
    width: 400px;
}

.code{
      display: flex;
      align-items: center;
      img{
        width: 130px;
        height: 40px;
        margin-left: 20px;
      }
      .el-button{
        margin-left: 20px;
      }
      .input{
        width: 250px;
      }
     }
</style>
