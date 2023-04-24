<template>
  <div class="enterprise">
    <el-card>
      <el-form label-width="100px" :inline="true">
        <el-form-item label="企业编号">
          <el-input v-model="form.eid" />
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="clear">清除</el-button>
        <el-button type="primary" @click="addEnterprise">新增企业</el-button>
        <el-button type="danger" @click="exportToExcel">简单表头导出</el-button>
        <el-button type="primary" @click="complexToExcel">复杂表头导出</el-button>
        <el-button type="success" @click="ImportExcel">Excel导入</el-button>
      </el-form>
    </el-card>
    <!-- 表格设置 -->
    <el-card>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="序号"
          width="60"
          align="center"
          type="index"
        >
          <template #default="scope">
            {{ (page.page -1) * page.limit + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="eid"
          label="企业编号"
          width="180"
          align="center"
        />
        <el-table-column
          prop="name"
          label="企业名称"
          align="center"
        />
        <el-table-column
          prop="username"
          label="创建者"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          :formatter="changeStatus"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="banBtn(scope)">{{ scope.row.status === 1?'禁用':'启用' }}</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  分页设置 -->
    <el-card>
      <div class="block">
        <el-pagination
          :current-page.sync="page.page"
          :page-sizes="[1,5,10,100, 200 ]"
          :page-size.sync="page.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <Add ref="add" :init-data="initData" @getData="getData" />
  </div>
</template>

<script>
import { enterpriseList, enterpriseRemove, enterpriseStatus } from '@/api/enterprise'
import Add from './components/Add.vue'
import { change } from '@/utils/index'
import emun from '@/api/enum'
import { export_json_to_excel } from '@/vendor/Export2Excel'
export default {
  components: { Add },
  data() {
    return {
      total: 0,
      newArr: [],
      initData: [],
      page: {
        page: 1,
        limit: 10
      },
      active: 'red',
      options: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '禁用'
        }
      ],

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
      tableData: []
    }
  },
  computed: {

  },
  created() {
    if (this.tableData.length === 0) {
      this.getData()
    }
  },
  methods: {
    async getData() {
      const res = await enterpriseList(this.page)
      const res2 = await enterpriseList({
        page: '1',
        limit: '9999'
      })
      this.tableData = res.data.items
      this.initData = res2.data.items
      this.total = res.data.pagination.total
      // excel导出数据
      this.newArr = this.tableData.map((item) => {
        return [
          item.eid,
          item.name,
          item.short_name,
          item.intro,
          item.remark,
          item.username,
          change(emun.status, item.status)
        ]
      })
    },
    // 清除按钮
    clear() {
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
      this.getData()
    },
    // 搜索按钮
    async search() {
      if (this.form.name === '' && this.form.eid === '' && this.form.username === '' && this.form.status === '') {
        return this.$message.error('请输入搜素内容')
      }
      const res = await enterpriseList(this.form)
      this.tableData = res.data.items
      // console.log(res)
    },
    // 添加弹框
    addEnterprise() {
      this.$refs.add.isShow = true
      this.$refs.add.title = '添加企业'
    },
    // 删除按钮
    async del(row) {
      await this.$confirm(`确定要删除《${row.name}》吗？`)
      await enterpriseRemove(row)
      this.$message.success('删除成功')
      if (this.page.page > 1 && this.tableData.length === 1) {
        this.page.page--
      }
      this.getData()
    },
    // 禁用按钮
    async banBtn(scope) {
      console.log(scope)
      if (scope.row.status === 1) {
        this.tableData[scope.$index].status = 0
      } else {
        this.tableData[scope.$index].status = 1
      }
      await enterpriseStatus(scope.row)
      this.$message.success('状态设置成功')
    },
    // 编辑按钮
    edit(row) {
      this.$refs.add.isShow = true
      this.$refs.add.title = '编辑企业'
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
    },
    // 简单表头导出
    exportToExcel() {
      export_json_to_excel({
        filename: '企业信息',
        header: ['企业编号', '企业名称', '企业简称', '企业简介', '备注', '创建者', '状态'],
        data: this.newArr
      })
    },
    // 复杂表头导出
    complexToExcel() {
      export_json_to_excel({
        filename: '复杂导出',
        multiHeader: [['企业信息', '', '', '', '', '', '', ''], ['企业必填信息', '', '', '', '', '', '', '备注']],
        header: ['企业编号', '企业名称', '企业简称', '企业简介', '备注', '创建者', '状态'],
        data: this.newArr,
        merges: ['A1:H1', 'A2:G2', 'H2:H3']
      })
    },
    // Excel导入
    ImportExcel() {
      this.$router.push('/enterprise/import')
    },
    // 页容量改变
    handleSizeChange() {
      this.getData()
    },
    // 翻页
    handleCurrentChange() {
      this.getData()
    },
    // 枚举数据类型转换
    changeStatus(row, column, cellValue, index) {
      return change(emun.status, cellValue)
    }
  }
}
</script>

<style scoped lang="scss">
.enterprise{
  padding: 20px;
}
.block{
  text-align: center;
}
.el-table-column{
  color: red;
}
.btn{

  padding-left: 30px;

}
</style>
