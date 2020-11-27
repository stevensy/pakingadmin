<template>
  <div class="wrap">
    <div class="search_wrap">
      <h2>{{ $route.meta.title }}</h2>
      <el-form :model="queryParams" ref="queryForm" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="会员姓名" prop="username">
              <el-input
                v-model.trim="queryParams.username"
                placeholder="请输入会员姓名"
                clearable
                size="mini"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机" prop="phone">
              <el-input
                v-model.trim="queryParams.phone"
                placeholder="请输入会员手机"
                clearable
                size="mini"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司名称" prop="company">
              <el-input
                v-model.trim="queryParams.company"
                placeholder="请输入公司名称"
                clearable
                size="mini"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="30px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row class="mb20">
        <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >添加会员</el-button>
      </el-row>
      <div class="section">
        <Table :list-loading="loading" :table-data="lists" :pagination="pagination" @pagingLoadInfo="getList">
          <el-table-column label="会员ID" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="会员姓名" prop="username" :show-overflow-tooltip="true" />
          <el-table-column label="会员账号" width="120px" prop="account" :show-overflow-tooltip="true" />
          <el-table-column label="手机" width="120px" prop="phone" :show-overflow-tooltip="true" />
          <el-table-column label="部门" prop="department" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.department ? scope.row.department : '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="职业" prop="position" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.position ? scope.row.position : '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="微信头像" prop="headimgurl" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-image style="width: 50px;" v-if="scope.row.headimgurl" :src="scope.row.headimgurl" fit="contain" />
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="微信昵称" prop="nickname" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.nickname ? scope.row.nickname : '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="公司名称" prop="company" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.company ? scope.row.company : '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :icon="+scope.row.status ? 'el-icon-lock' : 'el-icon-unlock'"
                @click="handleUpdateState(scope.row)"
              >{{ +scope.row.status ? '停用' : '启用'}}</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                style="color: #ff4949"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template> 
          </el-table-column>
        </Table>
      </div>
      <!-- 添加或修改参数配置对话框 -->
      <Dialog :dialog-visible.sync="dialogLayout" :isAdd="isAdd" title="会员" :rules="rules" dialogWidth="780px" :checkCallBack="checkCallBack" @success="handleData">
        <el-form ref="dialog" :model="dialog" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="会员姓名" prop="username">
                <el-input v-model.trim="dialog.username" size="mini" maxlength="50" placeholder="请输入会员姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="会员账号" prop="account">
                <el-input
                  v-model.trim="dialog.account"
                  placeholder="请输入会员账号"
                  clearable
                  size="mini"
                  maxlength="20"
                  :disabled="!isAdd"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门" prop="department">
                <el-input v-model.trim="dialog.department" size="mini" maxlength="50" placeholder="请输入部门" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="手机" prop="phone">
                <el-input v-model.trim="dialog.phone" size="mini" maxlength="11" placeholder="请输入手机" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职位" prop="position">
                <el-input v-model.trim="dialog.position" size="mini" maxlength="50" placeholder="请输入职位" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司名称" prop="company">
                <el-input v-model.trim="dialog.company" size="mini" maxlength="50" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
               <el-form-item label="密码" prop="password">
                <el-input v-model.trim="dialog.password" size="mini" maxlength="10" placeholder="请输入密码" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Table from '@/components/Table/index'
import Dialog from '@/views/components/dialog'
import md5 from 'js-md5';
import { getListUser, addUser, editUser, delUser } from '@/api'
export default {
  name: 'Index',
  components: { Table, Dialog },
  data() {
    return {
      loading: false,
      // 查询参数
      queryParams: {
        permission: '0', 
        username: undefined,
        account: undefined,
        company: undefined
      },
      // 列表
      lists: [],
      // 分页
      pagination: {
        total: 0,
        pageSize: 10,
        page: 1
      },
      // 是否显示弹出层
      dialogLayout: false,
      // 弹出层显示数据
      dialog: {
        username: undefined,
        account: undefined,
        department: undefined,
        position: undefined,
        company: undefined,
        password: '123456',
        permisson: '0'
      },
      // 是否是新增
      isAdd: true,
      rules: {
        username: [{ required: true, message: '请输入会员名称', trigger: 'blur' }],
        account: [{ required: true, message: '请输入会员账号', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|4|5|8][0-9]\d{8}$/,  message: '请正确输入手机号', trigger: 'blur' }
        ],
        // department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
        // position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
        // company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList(obj) {
      this.loading = true;

      if (obj && Object.prototype.hasOwnProperty.call(page, 'pageSize')) {
        this.pagination.pageSize = obj.pageSize
        this.pagination.page = 1
      }
      if (page && Object.prototype.hasOwnProperty.call(page, 'page')) {
        this.pagination.page = obj.page
      }
      let { pageSize, page } = this.pagination
      const params = Object.assign({}, this.queryParams, { account: this.userInfo && this.userInfo.account, type: '0', pageSize, page })
      getListUser(params).then(res => {
        if (res.status) {
          this.lists = res.list
          this.pagination.total = res.pagination.total
          this.loading = false
        }
      })
    },
     /** 搜索按钮操作 */
    handleQuery() {
      this.pagination.page = 1;
      this.pagination.pageSize = 10
      this.getList();
    },
    handleNum(str, v) {
      this.dialog[str] = forceInputNumber(v)
    },
    /** 重置按钮操作 */
    handleReset() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.isAdd = true
      this.dialogLayout = true
      this.dialog = {
        username: undefined,
        account: undefined,
        department: undefined,
        position: undefined,
        company: undefined,
        password: '123456',
        permisson: '0'
      }
      this.resetForm("dialog")
    },
    handleUpdate({ id, username, account, position, department, company, phone }) {
      this.isAdd = false
      this.dialogLayout = true
      this.resetForm("dialog")
      this.$nextTick(() => {
        this.dialog = Object.assign({}, JSON.parse(JSON.stringify({ id, username, account, phone, position, department, company, password: undefined })))
      })
    },
    handleUpdateState({ account, status }) {
      if (!+status) {
        editUser({ account, status: +status ? '0' : '1' }).then(res => {
          if (res.status) {
            this.msgSuccess('启用成功!')
            this.getList()
          }
        })
      } else {
        this.$confirm('您确定停用该会员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          editUser({ account, status: +status ? '0' : '1' }).then(res => {
            if (res.status) {
              this.msgSuccess('停用成功!')
              this.getList()
            }
          })
        })
      }
    },
    handleDelete({ account: deleteAccount }) {
      this.$confirm('删除后不可恢复，您确定删除该会员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({ account: this.userInfo && this.userInfo.account, deleteAccount }).then(res => {
          if (res.status) {
            this.msgSuccess('删除成功!')
            this.getList()
          }
        })
      })
    },
    checkCallBack() {
      let params = this.dialog, API = this.isAdd ? addUser : editUser
      if (this.dialog.password) {
        params = Object.assign({}, this.dialog, { password: md5(this.dialog.password) })
      }
      return API(params).then(res => {
        return !res || ~res.status ? true : false 
      })
    },
    handleData() {
      this.msgSuccess(this.isAdd ? "新增成功！" : "修改成功!")
      this.getList()
    }
  }
};
</script>