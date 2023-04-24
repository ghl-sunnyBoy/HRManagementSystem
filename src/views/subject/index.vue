<template>
  <div class="subject">
    <!-- 顶部搜索卡片 -->
    <el-card class="top">
      <el-form ref="form" inline>
        <el-form-item label="学科编号">
          <el-input v-model="form.rid" />
        </el-form-item>
        <el-form-item label="学科名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option v-for="item in state" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetEvent">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addEvent">+新增学科</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="exportExcel">简单表头导出</el-button>
          <el-button type="success" @click="$router.push('/subject/import')">Excel导入</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表卡片 -->
    <el-card>
      <el-table :data="list" style="width: 100%" :cell-style="cellStyle">
        <el-table-column align="center" label="序号" width="80px">
          <template #default="{ $index }">
            {{ (page.page - 1) * page.limit + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="rid" align="center" label="学科编号" />
        <el-table-column prop="name" align="center" label="学科名称" />
        <el-table-column prop="short_name" align="center" label="学科简称" />
        <el-table-column prop="username" align="center" label="创建者" />
        <el-table-column prop="create_time" align="center" label="创建日期" />
        <el-table-column prop="status" align="center" label="状态" :formatter="formatterState" />
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="editEvent(row)">编辑</el-button>
            <el-button type="text" @click="stateEvent(row)">{{ row.status ? '禁用' : '启用' }}</el-button>
            <el-button type="text" @click="delEvent(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="page">
        <el-pagination
          :current-page.sync="page.page"
          :page-sizes="[1, 2, 5, 10, 20, 50]"
          :page-size.sync="page.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
    </el-card>
    <!-- 新增弹框组件 -->
    <Add ref="add" :init-list="initList" @getData="getData" @getAllData="getAllData" />
  </div>
</template>

<script>
import { subjectList, subjectRemove, subjectStatus } from '@/api/subject'
import Add from './components/Add.vue'
import jsCookie from 'js-cookie'
import { export_json_to_excel } from '@/vendor/Export2Excel'
export default {
  components: {
    Add
  },
  data() {
    return {
      state: [
        {
          value: 1,
          label: '启用'
        }, {
          value: 0,
          label: '禁用'
        }
      ],
      flag: true,
      list: [], // 当前页码学科数据
      initList: [], // 所有学科数据
      page: {
        page: 1, // 当前页数
        limit: +jsCookie.get('subject_size') || 5 // 每页显示条目个数
      },
      total: 0,
      form: {
        rid: '', //	否	string	学科编号
        name: '', //	否	string	学科名称
        username: '', //	否	string	创建者用户名
        status: '', //	否	string	状态 0(禁用) 1(启用)
        page: '', //	否	string	页码 默认为1
        limit: '' //	否	string	页容量 默认为10
      }
    }
  },
  created() {
    this.getData()
    this.getAllData()
  },
  methods: {
    // 获取学科列表
    async getData() {
      if (this.flag) {
        // 正常获取数据
        const res = await subjectList(this.page)
        this.list = res.data.items
        this.total = res.data.pagination.total
        // console.log('页容量', res)
      } else {
        // 获取搜索数据
        const res = await subjectList({ ...this.form, ...this.page })
        this.list = res.data.items
        this.total = res.data.pagination.total
        // console.log('搜索', res)
      }
    },
    // 获取所有学科
    async getAllData() {
      const res2 = await subjectList({ page: 1, limit: 9999 })
      this.initList = res2.data.items
    },
    // 状态数据转换
    formatterState(row, column, cellValue, index) {
      return cellValue ? '启用' : '禁用'
    },
    // 点击新增学科
    addEvent() {
      this.$refs.add.isShow = true
      // 修改mode
      this.$refs.add.mode = 'add'
      // this.resetEvent()
    },
    // 点击编辑按钮
    editEvent(row) {
      this.$refs.add.isShow = true
      // 修改mode
      this.$refs.add.mode = 'edit'
      // 数据回显
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
    },
    // 删除事件
    async delEvent(row) {
      // this.$confirm(`您确定删除 "${row.name}" 该学科吗？`, '提示', {
      //   confirmButtonText: '确定删除',
      //   cancelButtonText: '点错了',
      //   iconClass: 'el-icon-warning colorYellow'
      // })
      //   .then(() => {
      //     subjectRemove(row)
      //     this.$message.success('删除学科成功')
      //     if (this.page.page > 1 && this.list.length === 1) {
      //       this.page.page--
      //     }
      //     this.getData()
      //   }).catch(() => {
      //     this.$message('取消删除')
      //   })

      try {
        await this.$confirm(`您确定删除 "${row.name}" 该学科吗？`, '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '点错了',
          iconClass: 'el-icon-warning colorYellow'
        })
        await subjectRemove(row)
        this.$message.success('删除学科成功')
        if (this.page.page > 1 && this.list.length === 1) {
          this.page.page--
        }
        this.getData()
        this.getAllData()
      } catch (err) {
        this.$message('取消删除')
      }
    },
    // 切换状态事件
    async stateEvent(row) {
      await subjectStatus({
        id: row.id,
        status: row.status ? 0 : 1
      })
      this.$message.success('学科状态修改成功')
      this.getData()
    },
    // 搜索事件
    async search() {
      if (this.form.rid === '' && this.form.name === '' && this.form.username === '' && this.form.status === '') return
      this.flag = false
      this.page.page = 1
      this.getData()
    },
    // 重置搜索表单
    resetEvent() {
      this.form = {
        rid: '',
        name: '',
        username: '',
        status: '',
        page: '',
        limit: ''
      }
      this.flag = true
      this.page.page = 1
      this.getData()
    },
    // 页容量改变事件
    sizeChange(size) {
      this.getData()
      // 将页容量存到浏览器(页容量持久化)
      jsCookie.set('subject_size', this.page.limit)
      // console.log('当前页容量', size)
    },
    // 页码改变事件
    currentChange(page) {
      this.getData()
      // console.log('当前页码', page)
    },
    // 点击简单表头导出
    exportExcel() {
      const newArr = this.initList.map(item => {
        return [
          item.rid,
          item.name,
          item.short_name,
          item.remark,
          item.username
        ]
      })
      export_json_to_excel({
        filename: '学科列表',
        header: ['学科编号', '学科名称', '学科简称', '备注', '创建者'],
        data: newArr
      })
    },
    // 单元格样式设置
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.status === 0 && columnIndex === 6) {
        return 'color: #f00'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.subject {
  padding: 20px;

  .page {
    margin-top: 20px;
    text-align: center;
  }

  .top {
    .el-input {
      width: 150px;
    }
  }
}
</style>
