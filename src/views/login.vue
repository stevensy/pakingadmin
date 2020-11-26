<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="account">
        <el-input v-model="loginForm.account" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 忘记密码 -->
    <Dialog :dialog-visible.sync="dialogLayout" title="找加密码" :isChange="false" :rules="rules" dialogWidth="620px" @success="handleData">
      <el-form ref="dialog" :model="dialog" :rules="rules" label-width="100px">
        <el-form-item label="手机" prop="phone">
          <el-input v-model.trim="dialog.phone" size="mini" maxlength="100" placeholder="请输入管理员手机号">
            <el-button type="text" slot="suffix">获取验证码</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="短信验证码" prop="mscode">
          <el-input v-model.trim="dialog.mscode" size="mini" maxlength="50" placeholder="请输入短信验证码" />
        </el-form-item>
        <el-form-item label="新的密码" prop="password">
          <el-input v-model.trim="dialog.password" size="mini" maxlength="100" placeholder="请输入新的密码" />
        </el-form-item>
        <el-form-item label="再次输入密码" prop="comfirm">
          <el-input v-model.trim="dialog.appSecret" size="mini" maxlength="100" placeholder="请再次输入密码" />
        </el-form-item>
      </el-form>
    </Dialog>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import Dialog from '@/views/components/dialog'
import { getCodeImg } from "@/api/login";
import md5 from 'js-md5';
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  components: { Dialog },
  data() {
    return {
      loginForm: {
        account: undefined,
        password: undefined,
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ]
      },
      loading: false,
      redirect: undefined,
      dialogLayout: false,
      dialog: {
        phone: undefined,
        mscode: undefined,
        password: undefined,
        comfirm: undefined
      },
      rules: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // if (this.loginForm.rememberMe) {
          //   Cookies.set("username", this.loginForm.username, { expires: 30 });
          //   Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
          //   Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          // } else {
          //   Cookies.remove("username");
          //   Cookies.remove("password");
          //   Cookies.remove('rememberMe');
          // }
          let { account, password } = this.loginForm
          this.$store
            .dispatch("Login", { account, password: md5(password), loginType: /^1[3|4|5|8][0-9]\d{4,8}$/.test(account) ? 'phone' : 'account' })
            .then(res => {
              this.$router.push({ path: +res.data.permission === 2 ? this.redirect : '/order' || "/" });
            })
            .catch(() => {
              this.loading = false;
              // this.getCode();
            });
        }
      });
    },
    getpwd() {
      console.log(22)
      this.dialogLayout = true
      this.resetForm('dialog')
    },
    handleData() {

    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
