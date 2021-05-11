<template>
  <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
    <div class="main-header">    
      <VisitHistory/>
       
      <div class="header-avator-con">
        <div class="headImg"><img src="../assets/img/headImg.jpg" alt=""></div>
            <Dropdown transfer trigger="click">
              <a href="javascript:void(0)">
                <span class="main-user-name">{{ userName }}</span>
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="changepwd"><a href="javascript:;" @click="showchangepwd">修改密码</a></DropdownItem>
                 <DropdownItem name="loginout"><a href="javascript:;" @click="logOut">退出登录</a></DropdownItem>
                </DropdownMenu>
            </Dropdown>
      </div>
      <ul class="small-menu fr">
        <!-- <li><router-link to=""><i class="icon icon-message"></i></router-link></li> -->
        <!-- <li><router-link to=""><i class="icon icon-notice"></i></router-link></li> -->
        <li><router-link to="/systemConfig/systemConfig" v-authorize="'systemsetting'"><i class="icon icon-setting"></i></router-link></li>
      </ul>
    </div>
   <pwd-change v-show="changeShow" @hide="hidechangepwd" @commit="changePwd"/>
  </div>
</template>

<script>
  import Vue from "vue";
  import changer from './ChangePwd'
  import VisitHistory from './VisitHistory'
  export default {
    props: {
        shrink: {
            type: Boolean,
            default: false
        }
    },
    components:{'pwd-change':changer,VisitHistory},
    name:"Header",
    data() {
      return {
        loginUser: {
          userTypeInfo: "",
          userName: "",
          userType: -1,
        },
        changeShow:false,
        noticeList: [],
        isNoticeShow: false, //是否展示通知
      }
    },
    computed: {
      userName: function() {
        return Vue.store.state.user.userName || Vue.getUser().userName;
      },
      isRetrunBack: function() {
        if (this.$route.path.split('/').length > 2) {
          return true;
        } else {
          return false;
        }
      }
    },
    mounted() {
      document.addEventListener('click', this.handleBodyClick)
    },
    created() {
      var user = Vue.getUser();
      this.loginUser.userTypeInfo = user.realName;
      this.loginUser.userName = user.realName;
      this.loginUser.userType = user.userType;

      // Vue.setTimer(this.loadNoticeList,this,null,5000,"header","notice",true);
    },
    beforeDestroy(){
      // Vue.clearTimer("header");
    },
    methods: {
      menubar: function() {
        Vue.toggleLeftMenu();
      },
      handleBodyClick() {
        this.isNoticeShow = false;
      },
      handleClickUserDropdown(name) {
          var self = this;
          console.log("Vue.config",Vue.config)
          if (Vue.config.onlyVue) {
            self.$store.commit("logout", Vue.vm);
            self.$router.push({
              name: "login"
            });
            location.reload();
          } else {
            this.$router.push("/login");
      }
    },
      logOut: function() {
        var _this = this;
        Vue.ajax.send({
          name: "user.loginOut"
        });
        Vue.cleanUp();
        _this.$store.commit('updateHistory', []);
        _this.$router.push("/login");
      },
      showchangepwd:function(){
        this.changeShow=true
      },
      hidechangepwd:function(){
        this.changeShow=false
      },
      changePwd:function(oldVal,newVal){
        console.log("确认",oldVal,newVal)
        var self=this;
        Vue.ajax.send({
                name: 'user.changePwd',
                data: {
                  oldPassword:oldVal,
                  newPassword:newVal,
                  userId:Vue.getUser().userId,
                  updateUser:Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                      self.$Modal.success({
                        title:"密码修改成功，请重新登录！",
                        onOk:()=>{
                          self.logOut();
                        }
                      });
                      
                    } else { 
                      self.$Modal.error({
                            title: data.message,
                            content:""
                        });
                    }
                }
            });
      },
      /**
       * 加载通知
       */
      loadNoticeList() {
        var self = this;
        Vue.ajax.send({
          name: "user.noticelist",
          data: {},
          success: function(data) {
            console.error('aaaaaaaaaaaaaaaaaaaaaaaa',data);
            if (!!data && data.isSuccess) {
              self.noticeList = data.result;
            }
          }
        });
      },
      /**
       * 加载通知
       */
      readNotice(notice) {
        var self = this;
        Vue.ajax.send({
          name: "user.readnotice",
          data: {
            ids:[notice.notice_user_id]
          },
          success(){
            self.noticeList.removeObject(notice);
          }
        });
      },
      /**
       * 通知的页面跳转
       */
      goTo(notice){
        this.readNotice(notice);
        this.$router.push({path:notice.link})
      }
    }
  };
</script>

<style scoped>
  
</style>