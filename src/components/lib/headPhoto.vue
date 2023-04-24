<template>
  <div class="uploadimage">
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :auto-upload="false"
      :before-upload="beforeAvatarUpload"
      :on-change="onChange"
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <i v-if="value" class="el-icon-delete-solid" @click="devimage" />
  </div>
</template>

<script>
import { putHeadPhotoAPI } from '@/api/login'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: ''
    }
  },
  methods: {
    // 图片改变时的事件
    async onChange(file) {
      const fm = new FormData()
      fm.append('image', file.raw)
      console.log(file)
      const res = await putHeadPhotoAPI(fm)
      if (!res) return this.$message.error('请上传jpeg、png、gif格式图片')
      console.log(res)
      // this.value = process.env.VUE_APP_BASE_URL + res.data.file_path
      this.$emit('input', process.env.VUE_APP_BASE_URL + res.data.file_path)
      this.$emit('photo', res.data.file_path)
      this.$emit('head', res.data.file_path)
    //   console.log(res)
    },
    // 图片的判断
    beforeAvatarUpload(file) {
      console.log(file)
      this.data.image = file.name
      const format = ['image/jpeg', 'image/png', 'image/gif']
      const isJPG = format.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,PNG.GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 图片改变时的事件
    // 删除
    async devimage() {
      await this.$confirm('确定要删除视频吗', '提示')
      this.$emit('input', '')
    }
  }
}
</script>

<style scoped lang="scss">
.uploadimage{
  position: relative;
}
.avatar-uploader .el-upload {
  border: 1px dashed red;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
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

::v-deep .el-upload {
  border: 1px dashed #ccc;
}
  .el-icon-delete-solid{
        font-size: 20px;
        position: absolute;
        top: 5px;
        right: 5px;
        &:hover{
            color:#f00;
        }
    }
</style>
