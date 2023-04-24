<template>
  <div class="question">
    <el-card class="headform">
      <el-form label-width="80px" inline>
        <div>
          <el-form-item label="学科">
            <!-- @focus="getSubjectList" -->
            <el-select v-model="form.subject" placeholder="请选择">
              <el-option
                v-for="item in subjectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="阶段">
            <el-select v-model="form.step" placeholder="请选择">
              <el-option
                v-for="item in question.stepList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="企业">
            <el-select v-model="form.enterprise" placeholder="请选择" @focus="getEnterpriseList">
              <el-option
                v-for="item in enterpriseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="题型">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                v-for="item in question.typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="难度">
            <el-select v-model="form.difficulty" placeholder="请选择">
              <el-option
                v-for="item in question.difficultyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in question.statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="form.create"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </div>
        <el-form-item label="标题">
          <el-input v-model="form.title" class="titleipt" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="clearForm">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" type="primary" @click="addQuestion">新增试题</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="bodytable">
      <el-table
        :data="questionList"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          width="70"
        >
          <template #default="{$index}">
            <div>
              {{ (page.page-1)*page.limit + $index+1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="题目"
          width="180"
        >
          <template #default="{row}">
            <div v-html="row.title" />
          </template>
        </el-table-column>
        <el-table-column
          label="学科.阶段"
        >
          <template #default="{row}">
            <div v-subjectAndStep="row" />
          </template>
        </el-table-column>
        <el-table-column
          label="题型"
        >
          <template #default="{row}">
            <div v-formated:typeList="row.type" />
          </template>
        </el-table-column>
        <el-table-column
          prop="enterprise_name"
          label="企业"
        />
        <el-table-column
          prop="username"
          label="创建者"
        />
        <el-table-column
          label="状态"
        >
          <template #default="{row}">
            <div v-formated:statusList="row.status" :class="{start:true,forbidden:row.status===0,}" />
            <!-- <div v-formated:statusList="row.status" /> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="reads"
          label="访问量"
        />
        <el-table-column
          label="操作"
          width="200"
        >
          <template #default="{row}">
            <el-button type="text" @click="editQuestion(row)">编辑</el-button>
            <el-button v-if="row.status===1" type="text" @click="changeStatus(row)">禁用</el-button>
            <el-button v-else type="text" @click="changeStatus(row)">启用</el-button>
            <el-button type="text" @click="delQuestion(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page.sync="page.page"
          :page-sizes="[1, 5, 10, 20, 50]"
          :page-size.sync="page.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <add ref="add" :enterprise-list="enterpriseList" :subject-list="subjectList" @getData="getQuestionList" />
  </div>
</template>

<script>
import question from '@/api/constant/question.js'
import { subjectList } from '@/api/subject.js'
import { getEnterpriseGet } from '@/api/enterprise.js'
import { questionGet, questionStatus, questionRemove } from '@/api/question.js'
import add from './components/add.vue'
import jsCookie from 'js-cookie'
export default {
  components: {
    add
  },
  data() {
    return {
      isSearch: false,
      page: {
        page: 1,
        limit: +jsCookie.get('questionPageSize') || 10
      },
      form: {
        title: '', //	否	string	标题名称
        subject: '', //	否	int	学科id
        enterprise: '', //	否	int	企业id
        type: '', //	否	int	题目类型:1(单选),2(多选),3(简答)
        step: '', //	否	string	题目阶段:1(初级),2(中级),3(高级)
        username: '', //	否	string	作者
        status: '', //	否	int	状态:0(禁用),1(启用)
        difficulty: '', //	否	int	题目难度: 1(简单),2(一般),3(困难)
        create: '' // _date	否	string	创建日期
        // page: '', //	否	string	页码 默认为1
        // limit: ''//	否	string	页尺寸 默认为10
      },
      total: 10,
      // 学科列表
      subjectList: [],
      // 阶段列表
      question,
      // stepList: question.stepList,
      // 企业列表
      enterpriseList: [],
      // 题型列表
      // typeList: question.typeList,
      // 难度列表
      // difficultyList: question.difficultyList,
      // 状态列表
      // statusList: question.statusList
      questionList: []
    }
  },
  created() {
    // 题目列表
    this.getQuestionList()
    // 学科列表
    this.getSubjectList()
    // 企业列表
    this.getEnterpriseList()
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      jsCookie.set('questionPageSize', val)
      this.getQuestionList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.getQuestionList()
    },
    // 获取学科列表
    async getSubjectList() {
      const res = await subjectList({ limit: '9999' })
      this.subjectList = res.data.items
    },
    // 获取企业列表
    async getEnterpriseList() {
      const res = await getEnterpriseGet({ limit: '9999' })
      // console.log(res)
      this.enterpriseList = res.data.items
    },
    // 获取题目列表
    async getQuestionList() {
      let res
      // 如果是true就加form的内容，false就不带form的内容
      if (this.isSearch) {
        res = await questionGet({ ...this.form, ...this.page })
      } else {
        res = await questionGet(this.page)
      }
      this.total = res.data.pagination.total
      this.questionList = res.data.items
    },
    // 清空表单
    clearForm() {
      this.isSearch = false
      this.form = {
        ...this.form,
        title: '', //	否	string	标题名称
        subject: '', //	否	int	学科id
        enterprise: '', //	否	int	企业id
        type: '', //	否	int	题目类型:1(单选),2(多选),3(简答)
        step: '', //	否	string	题目阶段:1(初级),2(中级),3(高级)
        username: '', //	否	string	作者
        status: '', //	否	int	状态:0(禁用),1(启用)
        difficulty: '', //	否	int	题目难度: 1(简单),2(一般),3(困难)
        create: '' // _date	否	string	创建日期
      }
      this.page.page = 1
      this.getQuestionList()
    },
    // 搜索
    async search() {
      this.isSearch = true
      this.page.page = 1
      this.getQuestionList()
    },
    // 改变状态
    async changeStatus(row) {
      await questionStatus(row.id)
      this.$message.success('修改状态成功')
      if (row.status === 1) {
        const a = this.questionList.find(i => i.id === row.id)
        a.status = 0
      } else if (row.status === 0) {
        const a = this.questionList.find(i => i.id === row.id)
        a.status = 1
      }
    },
    addQuestion() {
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'add'
      this.$refs.add.isClear = true
    },
    editQuestion(row) {
      this.$refs.add.mode = 'edit'
      this.$refs.add.isShow = true
      this.$refs.add.isClear = true
      // console.log(row)
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
      this.$refs.add.form.city = this.$refs.add.form.city.split(',')
      this.$refs.add.form.multiple_select_answer = this.$refs.add.form.multiple_select_answer ? this.$refs.add.form.multiple_select_answer.split(',') : []
      this.$refs.add.form.select_options = row.select_options.length !== 0 ? row.select_options : [{
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
      // console.log(this.$refs.add.form)
    },
    async delQuestion(id) {
      await this.$confirm(`是否删除?`, '提示')
      await questionRemove(id)
      this.$message.success('删除成功')
      if (this.page.page > 1 && this.questionList.length === 1) {
        this.page.page--
      }
      this.getQuestionList()
    }
  }
}
</script>

<style lang="scss" scoped>
.question{
  padding:20px;
  background-color: #cbcbcb;
  .headform{
    ::v-deep .el-input__inner,::v-deep .el-date-editor{
      width: 165px;
    }
    .titleipt ::v-deep .el-input__inner{
      width:420px;
    }
    ::v-deep .el-form-item__label{
      font-weight: normal;
    }
  }
  .bodytable{
  // margin-top: 20px;
  .page{
    margin:20px 0;
    .el-pagination{
      display: flex;
      justify-content: center;
    }
  }
  .start{
    color:rgb(0, 255, 0);
  }
  .forbidden{
    color: red;
  }
}
}

</style>
