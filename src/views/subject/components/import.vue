<template>
  <div class="import-box">
    <el-card>
      <h3>学科导入</h3>
      <UploadExcel :before-upload="beforeUpload" :on-success="onSuccess" />
    </el-card>
  </div>
</template>

<script>
import { subjectAdd } from '@/api/subject'
import UploadExcel from '@/components/lib/UploadExcel.vue'
export default {
  components: {
    UploadExcel
  },
  methods: {
    async onSuccess(res) {
      const newArr = res.results.map(item => {
        return {
          rid: item['学科编号'],
          name: item['学科名称'],
          short_name: item['学科简称'],
          remark: item['备注']
        }
      })
      // console.log(newArr)
      await newArr.map(async(item) => {
        return await subjectAdd(item)
      })
      this.$nextTick()
      this.$message.success('导入成功')
      this.$router.push('/subject')
    },
    beforeUpload(file) {
      const isExcel = /\.(xlsx|xls|csv)$/.test(file.name)
      // 判断文件类型
      if (!isExcel) {
        this.$message.error('请上传 .xlsx|.xls|.csv 格式的文件')
      }
      // 判断文件大小
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传文件大小不超过2M')
      }
      // console.log('file', file)
      return isExcel && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.import-box {
  padding: 20px;

  h3 {
    text-align: center;
  }
}
</style>
