<template>
  <div class="login-bg">
    <div class="login-main">
      <div class="login-left fl"><img src="../../assets/img/login_img.png" /></div>
      <div class="login-right fr">
        <div class="login-logo"><img src="../../assets/img/login_logo.png" /></div>
        <div class="login-form">
          <div class="login-group">
            <i class="icon-user"></i>
            <input type="text" placeholder="请输入用户名" v-on:keyup.enter="fLogin();" v-model="userName" tabindex="1" maxlength="100">
          </div>
          <div class="login-group">
            <i class="icon-pwd"></i>
            <input v-if="!isSubmitting" type="password" autocomplete="new-password" spellcheck="false"
            v-on:keyup.enter="fLogin();" v-model="passWord" placeholder="请输入密码" value="" maxlength="50"/>
            <input v-if="isSubmitting" type="text" v-model="hidPwd" />
          </div>
          <div class="login-error">{{errorMsg}}</div>
          <div class="opration">
            <label>
              <div class="checkbox-con"><input type="checkbox" v-model="memoryPwd" /><label></label></div>
              记住密码
            </label>
          </div>
          <div class="login-btn">
            <Button size="large" long style="border-radius:22px; background:#00a0e9;height:44px; color:#fff"  @click="fLogin" >登录</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      userName: "",
      passWord: "",
      errorMsg: "",
      memoryPwd: false,
      isSubmitting:false,
      hidPwd:"••••••"
    };
  },
  created() {
    var loginInfo = Vue.getData("loginRemember");
    if (!!loginInfo) {
      var stamp = loginInfo.stamp;
      //如果登录记录没有过期则使用记录功能
      if (new Date() - stamp < loginInfo.expires * 24 * 60 * 60 * 1000) {
        this.userName = loginInfo.userName;
        this.passWord = loginInfo.pwd;
        this.memoryPwd = true;
      }
    } else {
      setTimeout(function() {
        //这里仅仅是为了让未勾选记住密码时，输入框内没有任何内容
      }, 100);
    }
  },
  methods: {
    /**
     * 登录校验
     */
    check: function() {
      var userName = this.userName,
        passWord = this.passWord;
      if (userName == undefined || userName == "") {
        this.errorMsg = "请输入用户名！";
        return false;
      } else if (passWord == undefined || passWord == "") {
        this.errorMsg = "请输入密码";
        return false;
      }
      return true;
    },
    fLogin: function() {
      if (this.check()) {
        this.isSubmitting=true;
        Vue.ajax.send({
          name: "user.login",

          data: {
            loginName: this.userName,
            loginPassword: this.passWord,
            systemId:Vue.config.systemId
          },
          success: this.loginSuccessCallback
        });
      }
    },
    loginSuccessCallback: function(data) {
      console.log(data)
      if (!!data && data.code=='0') {
        Vue.store.commit("updateHistory",[])
        Vue.setData("loginuser", data.data);
        Vue.store.state.user = data.data;
        var memoryPwdData = null;
        //记住密码
        if (this.memoryPwd) {
          memoryPwdData = {
            userName: this.userName,
            pwd: this.passWord,
            expires: 7,
            stamp: +new Date()
          };
        }
        Vue.setData("loginRemember", memoryPwdData);      
        this.$router.push('/homePage/list');
      } else {
        this.isSubmitting=false;
        this.errorMsg="用户名或密码错误，请重新输入！"
      }
    }
  }
};
</script>

<style scoped>
.login-bg {
  background: url(../../assets/img/login_bg.jpg) no-repeat;
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-size: cover;
}
.login-main {
  position: absolute;
  background: #e0ebfc;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border-radius: 10px;
  border: #ccecfb 8px solid;
  width: 1000px;
  padding: 50px 45px;
}
.login-left{
  float: left;
}
.login-right{
  width: 380px;
}
.login-logo {
  text-align: center;
}
.login-form {
  margin-top: 30px;
  color: #383c41;
}
.login-group {
  margin: 20px 0;
  width: 100%;
  border-bottom: #b8b8b8 1px solid;
  height: 36px;
}
.login-group i{
  width: 24px;
  height: 24px;
  margin-right: 10px;
  display: inline-block;
}
.login-group i.icon-user {
  background: url(../../assets/img/login_user.png) no-repeat;
}
.login-group i.icon-pwd {
  background: url(../../assets/img/login_pwd.png) no-repeat;
}
.login-group input{
  width: 340px;
  display: inline-block;
  background: none;
  border: none;
  height: 24px;
  line-height: 24px;
  vertical-align: top;
  outline:none;
}
.login-group input::-webkit-input-placeholder {
  color: rgba(156, 156, 156, 0.95);
  font-size: 12px;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #e0ebfc inset;
  -webkit-text-fill-color: rgb(255, 255, 255);
}
.opration {
  padding-left: 12px;
  margin-bottom: 40px;
}
.login-form .checkbox-con {
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  margin-top: 1px;
  float: left;
}
.login-btn{
  line-height:4;
}
.login-form .checkbox-con input[type="checkbox"] {
  opacity: 0;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  margin: 0;
}

.login-form .checkbox-con input[type="checkbox"] + label {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: none;
  border: 1px solid #b8b8b8;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  border-radius: 0px;
}

.login-form .checkbox-con input[type="checkbox"]:checked + label:after {
  content: "√";
  font-size: 16px;
  font-weight: bold;
  color: #b8b8b8;
  display: block;
  width: 20px;
  height: 20px;
  padding: 0;
  line-height: 18px;
  text-align: center;
  position: absolute;
  z-index: 20;
  background: none;
}
.login-error {
  margin: -10px 0 10px 0;
  height: 24px;
  color: #e60012;
  padding-left: 30px;
}
@media(max-width: 1440px){
  .login-main{
    border: #ccecfb 6px solid;
    width: 760px;
    padding: 40px 35px;
  }
  .login-left{
    padding-top: 40px;
  }
  .login-left img{
    width: 348px;
  }
  .login-right{
    width: 285px;
  }
  .login-logo img{
    height: 60px;
  }
  .login-group input{
    width: 240px;
  }
  .opration{
    margin-bottom: 30px;
  }
}
</style>
