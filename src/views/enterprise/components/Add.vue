<template>
  <div>
    <el-dialog
      :title="title"
      width="500px"
      :visible.sync="isShow"
      @close="CloseEvent"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="form.eid" />
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="form.short_name" />
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="form.intro" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>

      </template>
    </el-dialog>
  </div>
</template>

<script>
import { enterpriseAdd, enterpriseEdit } from '@/api/enterprise'
export default {
  props: {
    initData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      isShow: false,
      title: '',
      form: {
        eid: '',
        id: '',
        intro: '',
        is_del: '',
        name: '',
        remark: '',
        short_name: '',
        status: '',
        user_id: '',
        username: ''
      },
      rules: {
        name: [
          { required: true, message: '输入不能为空', trigger: 'change' },
          { validator: (rule, value, callback) => {
            let bol = false
            if (this.title === '添加企业') {
              bol = this.initData.every((item) => {
                return item.name !== value
              })
            } else {
              // 排除自己
              const newArr = this.initData.filter((item) => {
                return item.id !== this.form.id
              })
              bol = newArr.every((item) => {
                return item.name !== value
              })
            }
            bol ? callback() : callback(new Error('名称重复'))
          } }
        ],
        eid: [
          { required: true, message: '输入不能为空', trigger: 'change' },
          { validator: (rule, value, callback) => {
            let bol = false
            if (this.title === '添加企业') {
              bol = this.initData.every((item) => {
                return item.eid !== value
              })
            } else {
              // 排除自己
              const newArr = this.initData.filter((item) => {
                return item.id !== this.form.id
              })
              bol = newArr.every((item) => {
                return item.eid !== value
              })
            }
            bol ? callback() : callback(new Error('名称重复'))
          } }
        ],
        short_name: [
          { required: true, message: '输入不能为空', trigger: 'change' }

        ],
        intro: [
          { required: true, message: '输入不能为空', trigger: 'change' }
        ]

      }
    }
  },
  methods: {
    CloseEvent() {
      this.$refs.form.resetFields()
      this.form = {
        eid: '',
        id: '',
        intro: '',
        is_del: '',
        name: '',
        remark: '',
        short_name: '',
        status: '',
        user_id: '',
        username: ''
      }
    },
    cancel() {
      this.isShow = false
    },
    submit() {
      this.$refs.form.validate(async(result) => {
        if (!result) return
        if (this.title === '添加企业') {
          await enterpriseAdd(this.form)
          this.$message.success('添加成功')
        } else {
          await enterpriseEdit(this.form)
          this.$message.success('编辑成功')
        }
        this.isShow = false
        this.$emit('getData')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer{
    text-align: center;
}

</style>
