<template>
  <div class="user-box">
    <!-- top -->
    <el-card class="card">
      <el-form :inline="true" :model="form" class="form">
        <el-form-item label="用户名称">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="form.role_id">
            <el-option label="管理员" value="2" />
            <el-option label="老师" value="3" />
            <el-option label="学生" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="clear">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addEvent">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- userInfo -->
    <el-card class="userInfo">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="序号" width="50">
          <template v-slot="{$index}">
            <div>
              {{ (form.page-1)*form.limit+$index+1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="角色">
          <template #default="{row}">
            <div>
              {{ {'2':'管理员','3':'老师','4':'学生'}[row.role_id] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="状态">
          <template #default="{row}">
            <div>
              {{ {'1':'启用','0':'禁用'}[row.status] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="option" label="操作" width="180">
          <template #default="{row}">
            <el-button type="text" size="small" @click="editEvent(row)">编辑</el-button>
            <el-button v-if="row.status==1" type="text" size="small" @click="statusEvent(row)">禁用 </el-button>
            <el-button v-else type="text" size="small" @click="statusEvent(row)">  启用  </el-button>
            <el-button type="text" size="small" @click="deleteEvent(row)"> 删除  </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- 页码and分页 -->
    <el-card>
      <template>
        <div class="pagination">

          <el-pagination
            :current-page.sync="form.page"
            :page-sizes="[1,2,5,,8,10,11,14,15,50]"
            :page-size.sync="form.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="changeSize"
            @current-change="getUserList"
          />
        </div>
      </template>

    </el-card>
    <AddUser ref="add" :list="list" @getUserList="getUserList" />
  </div>
</template>

<script>
import { userList, userRemove, userStatus } from '@/api/user'

import AddUser from './components/AddUser.vue'
import Cookies from 'js-cookie'
export default {
  components: {
    AddUser
  },
  data() {
    return {

      form: {
        username: '', //	否	string	昵称
        email: '', //	否	string	邮箱
        role_id: '', //	否	string	角色数字 2管理员、3老师、 4学生
        page: 1, //	否	string	页码 默认为1
        limit: +Cookies.get('pageSize') || 10 //	否	string	页尺寸 默认为10
      },
      list: [],

      total: 99
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const res = await userList(this.form)
      this.list = res.data.items
      this.total = res.data.pagination.total
      // console.log(res)
    },
    async search() {
      const res = await userList(this.form)
      console.log('res', res)
      this.list = res.data.items
    },
    clear() {
      this.form = {
        ...this.form,
        username: '', //	否	string	昵称
        email: '', //	否	string	邮箱
        role_id: '' //	否	string	角色数字 2管理员、3老师、 4学生
      }
      this.getUserList()
    },
    // 新增用户
    addEvent() {
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'add'
    },
    // 编辑用户
    editEvent(row) {
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'edit'
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
    },
    // 删除用户
    async deleteEvent(row) {
      await this.$confirm('确定删除该用户？', '提示')
      await userRemove(row)
      this.$message.success('删除成功')
      if (this.form.page > 1 && this.list.length <= 1) {
        this.form.page--
      }
      this.getUserList()
    },
    // 禁用用户
    async statusEvent(row) {
      await userStatus(row)
      this.$message.success('设置状态成功')
      this.getUserList()
    },
    async	changeSize() {
      await Cookies.set('pageSize', this.form.limit)
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-box{
  background-color: #cbcbcb;
  padding: 20px 20px 300px 20px;

  .card,.userInfo,.pagination{

    background-color: #fff;
  }

.pagination{
  .el-pagination{
    text-align: center !important;
  }
}
}
</style>
