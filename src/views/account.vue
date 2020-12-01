<template>
  <div class="wrap">
    <div class="search_wrap">
      <h2>管理员{{ $route.meta.title }}</h2>
      <el-row class="mb20" v-if="+auth === 2">
        <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >添加管理员</el-button>
      </el-row>
      <div class="section">
        <Table :list-loading="loading" :table-data="lists" :pagination="+auth===2 ? pagination : false" @pagingLoadInfo="getList">
          <el-table-column label="用户账号" prop="account" :show-overflow-tooltip="true" />
          <el-table-column label="姓名" prop="username" :show-overflow-tooltip="true" />
          <el-table-column label="手机" prop="phone" :show-overflow-tooltip="true" />
          <el-table-column label="公司" prop="company" :show-overflow-tooltip="true" />
          <el-table-column label="部门" prop="department" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="密码" prop="password" :show-overflow-tooltip="true" /> -->
          <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.remark ? scope.row.remark : '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :icon="+scope.row.status ? 'el-icon-lock' : 'el-icon-unlock'"
                :disabled="userInfo && userInfo.account === scope.row.account && +scope.row.status === 1"
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
                :style="userInfo && userInfo.account === scope.row.account ? '' : 'color: #ff4949'"
                icon="el-icon-delete"
                :disabled="userInfo && userInfo.account ===scope.row.account"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template> 
          </el-table-column>
        </Table>
      </div>
      <!-- 添加或修改参数配置对话框 -->
      <Dialog :dialog-visible.sync="dialogLayout" :isAdd="isAdd" title="管理员" :rules="rules" dialogWidth="620px" :resetBtnText="!isAdd ? ['确定'] : []"  :checkCallBack="checkCallBack" @success="handleData">
        <el-form ref="dialog" :model="dialog" :rules="rules" label-width="70px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号" prop="account">
                <el-input v-model.trim="dialog.account" :disabled="!isAdd" size="mini" maxlength="20" placeholder="请输入账号" />
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model.trim="dialog.phone" size="mini" maxlength="11" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model.trim="dialog.username" size="mini" maxlength="50" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司" prop="company">
                <el-input v-model.trim="dialog.company" size="mini" maxlength="50" placeholder="请输入公司" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="department">
                <el-input v-model.trim="dialog.department" size="mini" maxlength="300" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职位" prop="position">
                <el-input v-model.trim="dialog.position" size="mini" maxlength="50" placeholder="请输入职位" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input v-model.trim="dialog.password" size="mini" maxlength="50" placeholder="请输入密码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model.trim="dialog.remark" type="textarea" :autosize="{ minRows: 4 }" size="mini" maxlength="300" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="启用状态" prop="status" label-width="90px">
                <el-switch
                  v-model="dialog.status"
                  :disabled="dialog.account === userInfo && userInfo.account && +status === 1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="0">
                </el-switch>
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
import { forceInputNumber } from '@/utils/index'
import { getListUser, addUser, editUser, delUser } from '@/api'
export default {
  name: 'Account',
  components: { Table, Dialog },
  data() {
    return {
      loading: true,
      // 列表
      lists: [],
      // 分页
      pagination: {
        total: 0,
        pageSize: 30,
        page: 1
      },
      // 是否显示弹出层
      dialogLayout: false,
      // 弹出层显示数据
      dialog: {
        account: undefined,
        phone: undefined,
        username: undefined,
        company: undefined,
        department: undefined,
        position: undefined,
        password: '123456',
        remark: undefined,
        status: '1',
        permission: '1'
      },
      // 是否是新增
      isAdd: true,
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|4|5|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'auth'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList(obj) {
      this.loading = true;
      if (obj && Object.prototype.hasOwnProperty.call(obj, 'pageSize')) {
        this.pagination.pageSize = obj.pageSize
        this.pagination.page = 1
      }
      if (obj && Object.prototype.hasOwnProperty.call(obj, 'page')) {
        this.pagination.page = obj.page
      }
      let { pageSize, page } = this.pagination
      let params = Object.assign({}, { permission: '1', account: this.userInfo && this.userInfo.account, type: '1' })
      if (+this.auth === 2) {
        params = Object.assign({}, params, { pageSize, page })
      }
      getListUser(params).then(res => {
        this.loading = false
        if (res.status) {
          this.lists = res.list || []
          if (+this.auth === 2) {
            this.pagination.total = res.pagination.total
          }
        }
      })
    },
     /** 搜索按钮操作 */
    handleQuery() {
      this.pagination.page = 1;
      this.pagination.pageSize = 30
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
      this.resetForm("dialog")
      this.isAdd = true
      this.dialogLayout = true
    },
    handleUpdate(item) {
      this.resetForm("dialog")
      this.dialog = Object.assign({}, JSON.parse(JSON.stringify(item)))
      this.dialog.password = undefined
      this.isAdd = false
      this.dialogLayout = true
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
        this.$confirm('您确定停用该管理员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          editUser({ account, status: +status ? '0' : '1' }).then(res => {
            if (res.status) {
              this.msgSuccess('冻结成功!')
              this.getList()
            }
          })
        })
      }
    },
    handleDelete({ account: deleteAccount }) {
      this.$confirm('删除后不可恢复，您确定删除该管理员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({ account: this.userInfo.account, deleteAccount }).then(res => {
          if (res.status) {
            this.msgSuccess('删除成功!')
            this.getList()
          }
        })
      })
    },
    checkCallBack() {
      let params = Object.assign({}, this.dialog, { password: this.dialog.password &&  md5(this.dialog.password)}), API = this.isAdd ? addUser : editUser
      return API(params).then(res => {
        return !res || ~res.status ? true : false 
      })
    },
    handleData() {
      this.msgSuccess(this.isAdd ? "新增成功！" : "修改成功! ")
      this.getList()
    }
  }
};
</script>