<template>
  <div class="wrap">
    <div class="search_wrap">
      <h2>{{ $route.meta.title }}</h2>
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="60px">
        <el-form-item label="会员" prop="username">
          <el-input
            v-model.trim="queryParams.username"
            placeholder="请输入会员"
            clearable
            size="mini"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="linkman">
          <el-input
            v-model.trim="queryParams.linkman"
            placeholder="请输入姓名"
            clearable
            size="mini"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="linkmanPhone">
          <el-input
            v-model.trim="queryParams.linkmanPhone"
            placeholder="请输入车牌"
            clearable
            size="mini"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车牌" prop="license">
          <el-input
            v-model.trim="queryParams.license"
            placeholder="请输入车牌"
            clearable
            size="mini"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="预约ID" prop="orderId">
          <el-input
            v-model.trim="queryParams.orderId"
            placeholder="请输入预约ID"
            clearable
            size="mini"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input
            v-model.trim="queryParams.company"
            placeholder="请输入公司"
            clearable
            size="mini"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width: 240px" v-model="queryParams.status" placeholder="请选择状态" size="mini">
            <el-option
              v-for="(item, index) in stateList"
              :key="index"
              :label="item"
              :value="index-1+''"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="queryParams.date"
            style="width: 100%"
            size="mini"
            type="daterange"
            :editable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left:20px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="section">
        <Table :list-loading="loading" :table-data="lists" :headerStyle="{background:'#73B0ED', color: '#fff'}" :pagination="pagination" @pagingLoadInfo="getList">
          <el-table-column label="预约ID" prop="orderId" width="180px" :show-overflow-tooltip="true" />
          <el-table-column label="会员" prop="username" width="80px" :show-overflow-tooltip="true" />
          <el-table-column label="会员账号" width="110px" prop="account" :show-overflow-tooltip="true" />
          <el-table-column label="公司" prop="company" :show-overflow-tooltip="true" />
          <el-table-column label="车主姓名" width="80px" prop="linkman" :show-overflow-tooltip="true" />
          <el-table-column label="车主手机" width="110px" prop="linkmanPhone" :show-overflow-tooltip="true" />
          <el-table-column label="车主车牌" width="100px" prop="license" :show-overflow-tooltip="true" />
          <el-table-column label="预约进场时间" width="160px" prop="entryTime" :show-overflow-tooltip="true" />
          <el-table-column label="预约离场时间" width="160px" prop="leaveTime" :show-overflow-tooltip="true" />
          <el-table-column label="实际进场时间" width="160px" prop="inTime" :show-overflow-tooltip="true" />
          <el-table-column label="实际离场时间" width="160px" prop="outTime" :show-overflow-tooltip="true" />
          <el-table-column label="状态" width="70px" prop="status">
            <template slot-scope="scope">
              <span>{{ stateList[+scope.row.status + 1] }}</span>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '@/components/Table/index'
import Dialog from '@/views/components/dialog'
import { forceInputNumber } from '@/utils/index'
import { bookingList } from '@/api'

export default {
  name: 'Member',
  components: { Table, Dialog },
  data() {
    return {
      loading: true,
      stateList: ['历史', '预约', '入场'],
      // 查询参数
      queryParams: {
        username: undefined,
        license: undefined,
        orderId: undefined,
        company: undefined,
        status: undefined,
        linkman: undefined,
        linkmanPhone: undefined,
        date: [new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString().replace(/\//g, '-'), new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).toLocaleDateString().replace(/\//g, '-')]
      },
      lists: [],
      // 分页
      pagination: {
        total: 0,
        pageSize: 10,
        page: 1
      }
    };
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
      const params = Object.assign({}, this.queryParams, { pageSize, page })
      bookingList(params).then(res => {
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
    }
  }
};
</script>