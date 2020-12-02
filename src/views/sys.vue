<template>
  <div class="wrap">
    <div class="search_wrap">
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane label="公众号接口管理" name="0">
          <el-form :model="wxconfig" ref="wxconfig" :rules="wxrules" label-width="100px">
            <el-form-item label="appId" prop="appId">
              <el-input
                v-model.trim="wxconfig.appId"
                placeholder="请输入appId"
                clearable
                size="mini"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="appsecret" prop="appsecret">
              <el-input
                v-model.trim="wxconfig.appsecret"
                placeholder="请输入appsecret"
                clearable
                size="mini"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item style="margin-left:30px">
              <el-button type="primary" size="mini" @click="bindWX">绑定微信公众号</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane> -->
        <el-tab-pane label="手机短信接口管理" name="0">
          <h3 class="limitTip">仅限于阿里大于短信接口</h3>
          <el-form :model="smsconfig" ref="smsconfig" :rules="smsrules" label-width="100px">
            <el-form-item label="accessKeyId" prop="accessKeyId">
              <el-input
                v-model.trim="smsconfig.accessKeyId"
                placeholder="请输入accessKeyId"
                clearable
                size="mini"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="secretAccessKey" prop="secretAccessKey">
              <el-input
                v-model.trim="smsconfig.secretAccessKey"
                placeholder="请输入secretAccessKey"
                clearable
                size="mini"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item style="margin-left:30px">
              <el-button type="primary" size="mini" @click="changesms">短信接口修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="接口管理" name="1">
          <el-form :model="apiconfig" ref="apiconfig" :rules="apirules" label-width="150px">
            <el-form-item label="停车系统域名端口">
              {{ apiconfig.ip }}
            </el-form-item>
            <el-form-item label="新的系统域名端口" prop="newIp">
              <el-input
                v-model.trim="apiconfig.newIp"
                placeholder="请输入新的系统域名端口"
                clearable
                size="mini"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label-width="60px">
              <el-button type="primary" size="mini" @click="handleSubmit">提交</el-button>
            </el-form-item>  
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import Dialog from "./components/dialog";
import { getWxconfig, setWxconfig, getSmsconfig, setSmsconfig, getE7, setE7 } from '@/api'
export default {
  name: 'Sys',
  components: { Table, Dialog },
  data() {
    // var v4reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, 
    //     v6reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/gm,
    var validip = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新的系统域名端口'));
      } else {
        // console.log(v4reg.test(value), v6reg.test(value))
        // if (!v4reg.test(value) && !v6reg.test(value)) {
        //   callback(new Error('请输入正确的系统域名端口'));
        // }
        callback();
      }
    };
    return {
      activeName: '0',
      wxconfig: {
        id: undefined,
        appId: undefined,
        appsecret: undefined
      },
      wxrules: {
        appId: [{ required: true, message: '请输入appId', trigger: 'blur' }],
        appsecret: [{ required: true, message: 'appsecret', trigger: 'blur' }]
      },
      smsconfig: {
        accessKeyId: undefined,
        secretAccessKey: undefined
      },
      smsrules: {
        accessKeyId: [{ required: true, message: '请输入accessKeyId', trigger: 'blur' }],
        secretAccessKey: [{ required: true, message: '请输入secretAccessKey', trigger: 'blur' }]
      },
      apiconfig: {
        ip: undefined,
        newIp: undefined
      },
      apirules: {
        newIp: [{ required: true, validator: validip, trigger: 'blur' }]
      },
      loading: false,
      lists: [],
      // 分页
      pagination: {
        total: 0,
        pageSize: 10,
        page: 1
      },
    }
  },
  watch: {
    activeName(v) {
      // wxconfig
      let arr = [ 'smsconfig', 'apiconfig' ]
      if (this[arr[v]].id) return
      this.getList(v)
    }
  },
  mounted() {
    this.getList(0)
  },
  methods: {
    bindWX() {
      this.$refs.wxconfig.validate((valid) => {
        if(valid) {
          this.$confirm('您确定要绑定新的微信公众号吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let { id, appId, appsecret } = this.wxconfig
            setWxconfig({ id, appId, appsecret }).then(res => {
              if (res.status) {
                this.$message.success('绑定成功!')
              }
            })
          })
        }
      })
      
    },
    changesms() {
      this.$refs.smsconfig.validate((valid) => {
        if(valid) {
          this.$confirm('您确定要修改手机短信接口吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let { id, accessKeyId, secretAccessKey } = this.smsconfig
            setSmsconfig({ id, accessKeyId, secretAccessKey }).then(res => {
              if (res.status) {
                this.$message.success('绑定成功!')
              }
            })
          })
        }
      })
    },
    handleSubmit(){
      this.$refs.apiconfig.validate((valid) => {
        if(valid) {
          this.$confirm('您确定要修改停车系统域名端口吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let { id, newIp: ip } = this.apiconfig
            setE7({ id, ip }).then(res => {
              if (res.status) {
                this.$message.success('修改成功!')
              }
            })
          })
        }
      })
    },
    getList(v) {
      // getWxconfig, wxconfig
      let api = [ getSmsconfig, getE7 ], arr = [ 'smsconfig', 'apiconfig' ];
      api[v]().then(res => {
        if (res.status) {
          this[arr[v]] = res.data.length && res.data[0] || []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  font-size: 14px;
  line-height: 2;
}
</style>
