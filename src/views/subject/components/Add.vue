<template>
  <div>
    <el-dialog :visible.sync="isShow" width="600px" :title="title[mode]" center @closed="closeEvnet">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="rid" label="学科编号">
          <el-input v-model.trim="form.rid" />
        </el-form-item>
        <el-form-item prop="name" label="学科名称">
          <el-input v-model.trim="form.name" />
        </el-form-item>
        <el-form-item prop="short_name" label="学科简称">
          <el-input v-model.trim="form.short_name" />
        </el-form-item>
        <el-form-item prop="intro" label="学科简介">
          <el-input v-model.trim="form.intro" />
        </el-form-item>
        <el-form-item prop="remark" label="学科备注">
          <el-input v-model.trim="form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="center">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { subjectAdd, subjectEdit } from '@/api/subject'
export default {
  name: 'Add',
  props: {
    initList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      mode: 'add',
      isShow: false,
      form: {
        rid: '', //	是	string	学科编号
        name: '', //	是	string	学科名称
        short_name: '', //	否	string	学科简称
        intro: '', //	否	string	学科简介
        remark: '' //	否	string	备注
        // id: '',
        // rid: '',
        // name: '',
        // short_name: '',
        // intro: '',
        // remark: '',
        // user_id: '',
        // status: '',
        // create_time: '',
        // update_time: '',
        // is_del: '',
        // username: ''
      },
      rules: {
        rid: [
          { required: true, message: '必填', trigger: 'change' },
          { max: 10, message: '最多输入20个字符', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let bol = false
              if (this.mode === 'add') {
                // 需求：当前输入的学科编码不能和其他的学科编码重复
                bol = this.initList.every(item => item.rid !== value)
              } else if (this.mode === 'edit') {
                // 需求：1.除了当前的学科编码  2.修改的学科编码不能和其他的学科编码重复
                // 先排除自己
                const arr = this.initList.filter(item => item.id !== this.form.id)
                bol = arr.every(item => item.rid !== value)
              }
              bol ? callback() : callback(new Error('学科编码重复:' + value))
            }
          }
        ],
        name: [
          { required: true, message: '必填', trigger: 'change' },
          { max: 10, message: '最多输入10个字符', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let bol = false
              if (this.mode === 'add') {
                // 需求：当前输入的学科名称不能和其他的学科名称重复
                bol = this.initList.every(item => item.name !== value)
              } else if (this.mode === 'edit') {
                // 需求：1.除了当前的学科名称  2.修改的学科名称不能和其他的学科名称重复
                // 先排除自己
                const arr = this.initList.filter(item => item.id !== this.form.id)
                // console.log(arr)
                bol = arr.every(item => item.name !== value)
                // console.log(bol)
              }
              bol ? callback() : callback(new Error('学科名称重复:' + value))
            }
          }
        ],
        short_name: [
          { max: 10, message: '最多输入10个字符', trigger: 'change' }
        ],
        intro: [
          { max: 100, message: '最多输入100个字符', trigger: 'change' }
        ],
        remark: [
          { max: 100, message: '最多输入100个字符', trigger: 'change' }
        ]
      },
      title: { 'add': '新增学科', 'edit': '编辑学科' }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(async result => {
        if (result) {
          if (this.mode === 'add') {
            await subjectAdd(this.form)
            this.$message.success('新增学科成功')
          } else if (this.mode === 'edit') {
            await subjectEdit(this.form)
            this.$message.success('编辑学科成功')
          }
          this.isShow = false
          this.$emit('getData')
          this.$emit('getAllData')
        }
      })
    },
    closeEvnet() {
      // 清除表单验证
      this.$refs.form.resetFields()
      this.form = {
        rid: '', //	是	string	学科编号
        name: '', //	是	string	学科名称
        short_name: '', //	否	string	学科简称
        intro: '', //	否	string	学科简介
        remark: '' //	否	string	备注
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
}
::v-deep .el-dialog {
  .el-dialog__header {
      background: linear-gradient(90deg,#01c4fa,#1294fa);
      .el-dialog__title {
        color: #fff;
      }
  }
}
</style>
