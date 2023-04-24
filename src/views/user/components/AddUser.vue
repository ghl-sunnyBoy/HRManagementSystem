<template>
  <div class="add">
    <el-dialog
      :title="{add:'新增用户',edit:'编辑用户'}[mode]"
      :visible.sync="isShow"
      @close="closeEvent"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="form.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="form.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.trim="form.phone" />
        </el-form-item>
        <el-form-item class="role" label="角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="请选择">
            <el-option label="管理员" value="2" />
            <el-option label="老师" value="3" />
            <el-option label="学生" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item class="status" label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="禁用" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input v-model="form.remark" type="text" />
        </el-form-item>

        <el-form-item class="footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { userAdd, userEdit } from '@/api/user'

export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isShow: false,
      mode: 'add',
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let bol = false
              if (this.mode === 'add') {
                bol = this.list.every(item => {
                  return item.username !== value
                })
              } else if (this.mode === 'edit') {
                const newList = this.list.filter(item => {
                  return item.id !== this.form.id
                })
                bol = newList.every(item => {
                  return item.username !== value
                })
              }
              bol ? callback() : callback(new Error('用户名重复:' + value))
            }
          }
        ],
        email: [{ required: true, message: '请输入', trigger: 'change' },
          { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '请正确输入邮箱地址' },
          {
            validator: (rule, value, callback) => {
              let bol = false
              if (this.mode === 'add') {
                bol = this.list.every(item => {
                  return item.email !== value
                })
              } else if (this.mode === 'edit') {
                const newList = this.list.filter(item => {
                  return item.id !== this.form.id
                })
                bol = newList.every(item => {
                  return item.email !== value
                })
              }
              bol ? callback() : callback(new Error('邮箱地址重复:' + value))
            }
          }
        ],
        phone: [{ required: true, message: '请输入', trigger: 'change' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          {
            validator: (rule, value, callback) => {
              let bol = false
              if (this.mode === 'add') {
                bol = this.list.every(item => {
                  return item.phone !== value
                })
              } else if (this.mode === 'edit') {
                const newList = this.list.filter(item => {
                  return item.id !== this.form.id
                })
                bol = newList.every(item => {
                  return item.phone !== value
                })
              }
              bol ? callback() : callback(new Error('手机号重复:' + value))
            }
          }
        ],

        role_id: [{ required: true, message: '请输入', trigger: 'change' }],
        status: [{ required: true, message: '请输入', trigger: 'change' }],
        remark: [{ min: 1, max: 300, trigger: 'change' }]

      },
      form: {
        username: '', //	是	string	用户名
        email: '', //	是	string	邮箱
        phone: '', //	是	string	手机号
        role_id: '', //	是	string	角色 、2 管理员、3 老师、4 学生
        status: '', //	否	string	1(启用)0(禁用)
        remark: '' //	否	string	备注
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(async(result) => {
        if (result) {
          if (this.mode === 'add') {
            await userAdd(this.form)
            // console.log('res', res)
            this.$message.success('success')
          } else if (this.mode === 'edit') {
            await userEdit(this.form)
            // console.log('res', res)
            this.$message.success('success')
          }
          this.isShow = false
          this.$emit('getUserList')
        }
      })
    },
    closeEvent() {
      this.$refs.form.resetFields()
      this.form = {
        username: '', //	是	string	用户名
        email: '', //	是	string	邮箱
        phone: '', //	是	string	手机号
        role_id: '', //	是	string	角色 、2 管理员、3 老师、4 学生
        status: '', //	否	string	1(启用)0(禁用)
        remark: '' //	否	string	备注
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add{
text-align: center;

.role,.status{
  text-align: left;;
}
}

</style>
