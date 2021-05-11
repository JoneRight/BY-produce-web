<template>
     <!-- 修改密码 -->
    <div class="popover">
      <div class="popover-main">
        <a href="javascript:;" class="popover-close" @click="hide"></a>
        <div class="title">修改密码</div>
        <div class="change-form">
          <div class="change-group">
            <input type="password" placeholder="请输入原密码" v-model="oldPwd" name="oldPwd" maxlength="16">
            <span>{{oldPwdError}}</span>
          </div>
          <div class="change-group">
            <input type="password" placeholder="请输入新密码" v-model="newPwd" name="newPwd" maxlength="16">
            <span>{{newPwdError}}</span>
          </div>
          <div class="change-group">
            <input type="password" placeholder="请确认新密码" v-model="submitPwd" name="submitPwd" maxlength="16">
            <span>{{submitPwdError}}</span>
          </div>
          <div class="change-btn">
            <button class="btn" @click="changePwd">确认</button>
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
        oldPwd:'',
        oldPwdError:"",
        newPwd:'',
        newPwdError:"",
        submitPwd:'',
        submitPwdError:''
      }
    },
    methods:{
        validate:function(){
            if(Vue.isNull(this.oldPwd)){
                this.oldPwdError="请输入原密码";
                return false;
            }
            else{
                this.oldPwdError="";
            }
            if(Vue.isNull(this.newPwd)){
                this.newPwdError="请输入新密码";
                return false;
            }
            else if(this.newPwd.length<6){
                this.newPwdError="新密码不能少于6位";
                return false;
            }
            else{
                this.newPwdError="";
            }
            if(Vue.isNull(this.submitPwd)){
                this.submitPwdError="请输入确认密码";
                return false;
            }
            else{
                this.submitPwdError="";
            }
            if(this.newPwd!=this.submitPwd){
                this.submitPwdError="确认密码不正确";
                return false;
            }
            else{
                this.submitPwdError="";
            }
            return true;
        },
        changePwd:function(){
            if(this.validate()){
                this.$emit("commit",this.oldPwd,this.newPwd);
            }
        },
        hide:function(){
            this.$emit("hide");
        }
    }
}
</script>
<style scoped>
/* 弹窗 */

.popover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    overflow-x: hidden;
    outline: 0;
    background: rgba(0, 0, 0, .5);
}

.popover-main {
    position: absolute;
    width: 470px;
    background: #fff;
    border-radius: 10px;
    padding: 40px;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.popover-main .title {
    text-align: center;
    font-size: 26px;
    color: #00a0e9;
    line-height: 30px;
    margin-bottom: 40px;
}

.popover-main .popover-close,
.popover-min .popover-close {
    float: right;
    margin: -25px -25px 0 0;
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url(../assets/img/close.png) no-repeat;
}

.popover-main .btn,
.popover-min .btn {
    width: 100%;
    height: 46px;
    line-height: 46px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background: #00a0e9;
    border-radius: 23px;
    outline: none;
}

.popover-min {
    position: absolute;
    width: 360px;
    background: #fff;
    border-radius: 10px;
    padding: 40px;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
}

.popover-min .icon {
    margin-bottom: 20px;
}
.change-group{
  margin-bottom: 5px; 
  position: relative;
  width: 100%;
}
.change-group span{
  color: #e60012;
  display: block;
  height: 24px;
  line-height: 24px;
  padding-left: 10px;
}
.change-group input{
  width: 100%;
  line-height: 24px;
  height: 32px;
  border: none;
  border-bottom: #d1d1d1 1px solid;
  padding: 0 10px;
  color: #666;
}
.change-btn{
  margin-top: 40px;
}
a:active,
a:hover,
input {
    outline: none;
}
.btn {
    border-radius: 8px;
    height: 34px;
    line-height: 34px;
    padding: 0 13px;
    color: #fff;
    border: none;
    display: inline-block;
    outline: none;
}
</style>


