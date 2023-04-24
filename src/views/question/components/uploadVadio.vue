<template>
  <div class="hm-upload">
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="httpRequest"
    >
      <video v-if="value" :src="value" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <i v-if="value" class="el-icon-delete-solid" @click="devVideo" />
    <el-progress v-if="pShow" class="progress" type="circle" :percentage="percentage" :width="180" />
  </div>
</template>
<script>
import Cos from 'cos-js-sdk-v5'
const cos = new Cos({
  SecretId: 'AKIDMYVBdtugDXdT1JO6g5D4fzAC1bx5RffR', // 身份识别 ID
  SecretKey: 'Ysyve6KL8i5RgiV3OUWUJuKYkxzXu2xe' // 身份密钥
})
export default {
  name: 'HmUpload',
  props: {
    value: {
      required: true,
      type: String
    }
  }, // 可以通过导入的组件.name访问
  data() {
    return {
      imageUrl: '',
      pShow: false,
      percentage: 0
    }
  },
  methods: {
    //   上传前的限制
    beforeAvatarUpload(file) {
      // file:type  size
      //   限制文件类型
      const typeArr = ['video/mp4']
      const typeBol = typeArr.includes(file.type)
      if (!typeBol) {
        this.$message.error('请上传MP4视频')
      }
      //   限制文件大小
      const limit1M = file.size / 1024 / 1024 < 100
      if (!limit1M) {
        this.$message.error('只允许上传100Mb内文件')
      }
      return typeBol && limit1M
    },
    // 自定义上传
    httpRequest(res) {
      this.pShow = true
      // res.file:上传文件对象
      //   腾讯云上传使用  1：装插件cos-js-sdk-v5  2：导入插件  3：实例化   4：调用上传方法
      cos.putObject(
        {
          Bucket: 'kingbabbywang-1317620043' /* 填入您自己的存储桶，必须字段 */,
          Region: 'ap-guangzhou' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key:
              res.file
                .name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          StorageClass: 'STANDARD', // 固定参数不用修改
          Body: res.file, // 上传文件对象
          onProgress: progressData => {
            // 上传进度条显示
            console.log(JSON.stringify(progressData))
            this.percentage = +(progressData.percent * 100).toFixed(2)
            if (progressData.percent === 1) {
              setTimeout(() => { this.pShow = false }, 200)
            }
          }
        },
        (err, data) => {
          // 上传成功的回调  err:如果有错误就显示err 没有就显示data
          this.imageUrl = 'http://' + data.Location
          this.$emit('input', this.imageUrl)
          this.$emit('changevideo')
          console.log(err || data)
        }
      )
    },
    async devVideo() {
      await this.$confirm('确定要删除视频吗', '提示')
      this.$emit('input', '')
    }
  }
}
</script>
  <style lang="scss" scoped>
  // 加上scoped如果不显示了，基本可以肯定就是class没选中
  .hm-upload {
    //   background-color: #f00;
    position: relative;
    width: 180px;
    .el-icon-delete-solid{
        font-size: 20px;
        position: absolute;
        top: 5px;
        right: 5px;
        &:hover{
            color:#f00;
        }
    }
  }
  .avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader ::v-deep .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .progress{
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px;
    background-color: #eee;
  }
  </style>

