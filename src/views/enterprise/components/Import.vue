<template>
  <div class="import">
    <el-card>
      <h3 class="title">企业导入</h3>
      <UploadExcel
        :on-success="onSuccess"
        :before-upload="beforeUpload"
      />
    </el-card>
  </div></template>

<script>
import UploadExcel from '@/components/lib/UploadExcel.vue'
import { enterpriseAdd } from '@/api/enterprise'
export default {
  components: { UploadExcel },
  methods: {
    async onSuccess(res) {
      console.log(res)
      const newArr = res.results.map((item) => {
        return {
          name: item['企业名称'],
          eid: item['企业编号'],
          short_name: item['企业简称'],
          intro: item['企业简介']
        }
      })
      console.log(newArr)
      newArr.map(async(item) => {
        return await enterpriseAdd(item)
      })

      this.$message.success('导入成功')
      this.$router.push('/Enterprise')
    },

    beforeUpload(file) {
      const isExcel = /\.(xlsx|xls|csv)$/.test(file.name)
      if (!isExcel) {
        this.$message.error('请上传1Mb以内的数据')
      }
      const limit = file.size / 1024 / 1024 < 1
      if (!limit) {
        this.$message.error('请上传1mb以内的数据')
      }
      return limit && isExcel
    }

  }
}
</script>

<style lang="scss" scoped>
.import {
  padding: 15px;
  .title {
    text-align: center;
    padding-bottom: 30px;
  }
}
</style>
