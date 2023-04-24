<template>
  <div>
    <el-dialog :title="{add:'新增试题',edit:'编辑试题'}[mode]" :visible.sync="isShow" width="100%" @close="closeDialog">
      <div class="formbofy">
        <el-form ref="form" label-width="80px" :model="form" :rules="rules">
          <el-form-item label="学科" prop="subject">
            <!-- @focus="getSubjectList" -->
            <el-select v-model="form.subject">
              <el-option
                v-for="item in subjectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="阶段" prop="step">
            <el-select v-model="form.step">
              <el-option
                v-for="item in question.stepList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="企业" prop="enterprise">
            <!-- @focus="getEnterpriseList" -->
            <el-select v-model="form.enterprise">
              <el-option
                v-for="item in enterpriseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <!-- v-model="form.city" -->
            <!-- @change="cityChange"  -->
            <!-- ref="city" -->
            <el-cascader
              v-model="form.city"
              :options="cityList"
            />
          </el-form-item>
          <el-form-item label="题型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio v-for="item in question.typeList" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度" prop="difficulty">
            <el-radio-group v-model="form.difficulty">
              <el-radio v-for="item in question.difficultyList" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <hr>
          <el-form-item label="试题标题" prop="title" class="questiontitle">
            <!-- 富文本编辑器 -->
            <quillEditor
              v-model="form.title"
              :options="editorOption"
              @change="titleBlur"
            />
          </el-form-item>
          <!-- 单选框 -->
          <el-form-item v-if="form.type===1" prop="single_select_answer" label="单选" class="radio">
            <el-radio-group v-model="form.single_select_answer">
              <template>
                <div class="item">
                  <el-radio label="A" />
                  <el-input v-model="form.select_options[0].text" />
                  <headPhoto v-model="form.select_options[0].image" />
                </div>
              </template>
              <template>
                <div class="item">
                  <el-radio label="B" />
                  <el-input v-model="form.select_options[1].text" />
                  <headPhoto v-model="form.select_options[1].image" />
                </div>
              </template>
              <template>
                <div class="item">
                  <el-radio label="C" />
                  <el-input v-model="form.select_options[2].text" />
                  <headPhoto v-model="form.select_options[2].image" />
                </div>
              </template>
              <template>
                <div class="item">
                  <el-radio label="D" />
                  <el-input v-model="form.select_options[3].text" />
                  <headPhoto v-model="form.select_options[3].image" />
                </div>
              </template>
            </el-radio-group>
          </el-form-item>
          <!-- 多选框 -->
          <el-form-item v-if="form.type===2" prop="multiple_select_answer" label="多选" class="checkbox">
            <el-checkbox-group v-model="form.multiple_select_answer">
              <template>
                <div class="item">
                  <el-checkbox label="A" />
                  <el-input v-model="form.select_options[0].text" />
                  <headPhoto v-model="form.select_options[0].image" />
                </div>
              </template>
              <template class="item">
                <div class="item">
                  <el-checkbox label="B" />
                  <el-input v-model="form.select_options[1].text" />
                  <headPhoto v-model="form.select_options[1].image" />
                </div>
              </template>
              <template class="item">
                <div class="item">
                  <el-checkbox label="C" />
                  <el-input v-model="form.select_options[2].text" />
                  <headPhoto v-model="form.select_options[2].image" />
                </div>
              </template>
              <template class="item">
                <div class="item">
                  <el-checkbox label="D" />
                  <el-input v-model="form.select_options[3].text" />
                  <headPhoto v-model="form.select_options[3].image" />
                </div>
              </template>
              <!-- <div class="item">
                <el-checkbox label="B" /><el-input v-model="form.select_options[1].text" /><headPhoto @photo="getPhoto($event,1)" />
              </div>
              <div class="item">
                <el-checkbox label="C" /><el-input v-model="form.select_options[2].text" /><headPhoto @photo="getPhoto($event,2)" />
              </div>
              <div class="item">
                <el-checkbox label="D" /><el-input v-model="form.select_options[3].text" /><headPhoto @photo="getPhoto($event,3)" />
              </div> -->
            </el-checkbox-group>
          </el-form-item>
          <!-- 简答 -->
          <el-form-item v-if="form.type===3" prop="short_answer" label="简答">
            <el-input
              v-model="form.short_answer"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10}"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="解析视频" prop="video">
            <uploadVadio v-model="form.video" @changevideo="changeVideo" />
          </el-form-item>
          <el-form-item label="答案解析" prop="answer_analyze" class="questiontitle">
            <!-- 富文本编辑器 -->
            <quillEditor
              v-model="form.answer_analyze"
              :options="editorOption"
              @change="analyzeBlur"
            />
          </el-form-item>
          <hr style="margin-top:40px;">
          <el-form-item class="remark" prop="remark" label="试题备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="isShow=false">取消</el-button>
        <el-button type="primary" @click="Add">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { questionAdd, questionEdit } from '@/api/question'
// import { subjectList } from '@/api/subject.js'
// import { getEnterpriseGet } from '@/api/enterprise.js'
import { regionData } from 'element-china-area-data'
import question from '@/api/constant/question'
// 引入样式和quillEditor
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

import headPhoto from '@/components/lib/headPhoto.vue'
import uploadVadio from './uploadVadio.vue'
export default {
  components: {
    quillEditor, headPhoto, uploadVadio
  },
  props: {
    enterpriseList: {
      required: true,
      type: Array
    },
    subjectList: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      isClear: true,
      mode: 'add',
      isShow: false,
      form: {
        title: '', //	是	string	标题
        subject: '', //	是	int	学科id标识
        step: '', //	是	int	阶段1、初级 2、中级 3、高级
        enterprise: '', //	是	int	企业id标识
        city: [], //	是	array	[省、市、区县]
        type: 1, //	是	string	题型 1单选 、2多选 、3简答
        difficulty: '', //	是	int	题目难度 1简单 、2一般 、3困难
        single_select_answer: 'A', // 	是	string	单选题答案
        multiple_select_answer: [], // 	是	array	多选题答案
        short_answer: '', // 	是	string	简答题答案
        video: '', //	否	string	解析视频地址
        answer_analyze: '', // 	是	string	答案解析
        remark: '', //	是	string	答案备注
        select_options: [
          {
            label: 'A',
            text: '',
            image: ''
          },
          {
            label: 'B',
            text: '',
            image: ''
          },
          {
            label: 'C',
            text: '',
            image: ''
          },
          {
            label: 'D',
            text: '',
            image: ''
          }
        ] // 	是	array	选项，介绍，图片介绍
      },
      rules: {
        title: [{ required: true, message: '必填', trigger: 'change' }], //	是	string	标题
        subject: [{ required: true, message: '必填', trigger: 'change' }], //	是	int	学科id标识
        step: [{ required: true, message: '必填', trigger: 'change' }], //	是	int	阶段1、初级 2、中级 3、高级
        enterprise: [{ required: true, message: '必填', trigger: 'change' }], //	是	int	企业id标识
        city: [{ required: true, message: '必填', trigger: 'change' }], //	是	array	[省、市、区县]
        type: [{ required: true, message: '必填', trigger: 'change' }], //	是	string	题型 1单选 、2多选 、3简答
        difficulty: [{ required: true, message: '必填', trigger: 'change' }], //	是	int	题目难度 1简单 、2一般 、3困难
        single_select_answer: [{ required: true, message: '必填', trigger: 'change' }], // 	是	string	单选题答案
        multiple_select_answer: [{ required: true, message: '必填', trigger: 'change' }], // 	是	array	多选题答案
        short_answer: [{ required: true, message: '必填', trigger: 'change' }], // 	是	string	简答题答案
        video: [{ required: true, message: '必填', trigger: 'change' }], //	否	string	解析视频地址
        answer_analyze: [{ required: true, message: '必填', trigger: 'change' }], // 	是	string	答案解析
        remark: [{ required: true, message: '必填', trigger: 'change' }] //	是	string	答案备注
        // select_options: [{ required: true, message: '必填', trigger: 'change' }]
      },
      question,
      cityList: regionData,
      editorOption: {
        theme: 'snow',
        placeholder: '请输入正文'
        // Some Quill optiosn...
      }
    }
  },
  methods: {
    // async getSubjectList() {
    //   if (this.subjectList.length === 0) {
    //     const res = await subjectList()
    //     console.log('学科', res)
    //     this.subjectList = res.data.items
    //   }
    // },
    // async getEnterpriseList() {
    //   if (this.enterpriseList.length === 0) {
    //     const res = await getEnterpriseGet()
    //     this.enterpriseList = res.data.items
    //   }
    // },
    getPhoto(e, num) {
      this.form.select_options[num].image = process.env.VUE_APP_BASE_URL + e
    },
    getvideo(e) {
      this.form.video = e
    },
    // cityChange(e) {
    //   console.log(this.cityList)
    //   console.log(e)
    //   // this.form.city = this.citys(e)
    //   // console.log(this.$refs.city)
    // },
    // citys(e) {
    //   if (e.length !== 0) {
    //     const obj0 = this.cityList.find(i => i.value === e[0])
    //     const obj1 = obj0.children.find(i => i.value === e[1])
    //     const obj2 = obj1.children.find(i => i.value === e[2])
    //     return [obj0.label, obj1.label, obj2.label]
    //   } else {
    //     return []
    //   }
    // },
    titleBlur() {
      if (this.isClear) {
        this.$refs.form.validateField('title')
      }
    },
    analyzeBlur() {
      if (this.isClear) {
        this.$refs.form.validateField('answer_analyze')
      }
    },
    async Add() {
      await this.$refs.form.validate()
      if (this.mode === 'add') {
        // console.log(this.form.city)
        await questionAdd(this.form)
        // console.log(this.form)
        this.$message.success('新增试题成功')
      } else if (this.mode === 'edit') {
        this.form.city = this.form.city.join(',')
        // console.log(this.form.city)
        await questionEdit(this.form)
        // console.log(res)
        this.$message.success('编辑试题成功')
      }
      // console.log('city', this.form.city)
      this.$emit('getData')
      this.isShow = false
    },
    closeDialog() {
      this.isClear = false
      this.$refs.form.resetFields()
      // this.$refs.city.$refs.panel.clearCheckedNodes()
      this.form = {
        title: '', //	是	string	标题
        subject: '', //	是	int	学科id标识
        step: '', //	是	int	阶段1、初级 2、中级 3、高级
        enterprise: '', //	是	int	企业id标识
        city: [], //	是	array	[省、市、区县]
        type: 1, //	是	string	题型 1单选 、2多选 、3简答
        difficulty: '', //	是	int	题目难度 1简单 、2一般 、3困难
        single_select_answer: 'A', // 	是	string	单选题答案
        multiple_select_answer: [], // 	是	array	多选题答案
        short_answer: '', // 	是	string	简答题答案
        video: '', //	否	string	解析视频地址
        answer_analyze: '', // 	是	string	答案解析
        remark: '', //	是	string	答案备注
        select_options: [
          {
            label: 'A',
            text: '',
            image: ''
          },
          {
            label: 'B',
            text: '',
            image: ''
          },
          {
            label: 'C',
            text: '',
            image: ''
          },
          {
            label: 'D',
            text: '',
            image: ''
          }
        ] // 	是	array	选项，介绍，图片介绍
      }
    },
    // 视频改变
    changeVideo() {
      this.$refs.form.validateField('video')
    }

    /* async getone(id) {
      const res = await questionOne(id)
      this.form = res.data
      this.form.select_options = res.data.options ? res.data.options : [{
        label: 'A',
        text: '',
        image: ''
      },
      {
        label: 'B',
        text: '',
        image: ''
      },
      {
        label: 'C',
        text: '',
        image: ''
      },
      {
        label: 'D',
        text: '',
        image: ''
      }]
      this.form.city = res.data.city.split(',')
      console.log('city', this.form.city)
      console.log('回显数据', res.data)
      const c = res.data.multiple_select_answer
      this.form.multiple_select_answer = c ? c.split(',') : []
      const a = this.subjectList.find(i => i.name === res.data.subject)
      this.form.subject = a ? a.id : ''
      const b = this.enterpriseList.find(i => i.name === res.data.enterprise)
      this.form.enterprise = b ? b.id : ''
      console.log(res.data)
    } */
  }
}

</script>

<style lang="scss" scoped>
::v-deep .el-dialog{
    margin: 0 !important;
    .formbofy{
        width: 832px;
        .el-input__inner{
            width: 217px;
        }
        .el-form-item__label{
            text-align: left;
            font-weight: normal;
        }
        .questiontitle{
          .el-form-item__label{
            display: block;
            float:none;
            height: 40px;
          }
          .el-form-item__content{
            margin: 0 !important;
            margin-top: 10px !important;
          }
        }
        .radio,.checkbox{
          .item{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            .el-input__inner{
              width: 490px;
              margin-right: 10px;
            }
          }
        }
        .checkbox{
          .el-input{
            width: 500px;
            margin-left: 25px;
          }
        }
        .remark{
          margin-top: 40px;
        }
    }
    .el-dialog__body,.el-dialog__footer{
        display: flex;
        justify-content: center;
    }
}
hr{
    margin: 0;
}

</style>
