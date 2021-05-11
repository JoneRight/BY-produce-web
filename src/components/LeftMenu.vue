<template>
  <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
          <div class="ivu-shrinkable-menu">
            <div slot="top" class="logo-con">
                <img v-show="!shrink"  src="../assets/img/logo.png" key="max-logo" />
                <img v-show="shrink" src="../assets/img/login_min.png" key="min-logo" />
            </div>
            <Menu ref="sideMenu"  width="auto" accordion theme="dark" v-show="!shrink">
               <template v-for="item in menuList"> 
                 <MenuItem v-if="item.subMenuList.length<1" :name="(item.subMenuList[0] || item).menuName" :to="item.menuUrl">
                     <img class="menu-icon" :src="require('../assets/img/menu/'+item.menuIcon)" :key="'menu_'+item.menuId" :onerror="'this.src='+require('../assets/img/menu/chanpin.png')"/>
                     <span class="layout-text" :key="item.path_path">{{item.menuName}}</span>
                 </MenuItem>          
                 <Submenu v-if="item.subMenuList.length >= 1" :name="item.menuName">
                     <template slot="title">
                         <img class="menu-icon" :src="require('../assets/img/menu/'+item.menuIcon)" :key="'menu_'+item.menuId" :onerror="'this.src='+require('../assets/img/menu/chanpin.png')"/>
                         <span class="layout-text">{{item.menuName}}</span>
                     </template>
                     <template v-for="child in item.subMenuList">
                         <MenuItem :name="child.menuName" :key="child.menuName"  :to="child.menuUrl" v-if="child.subMenuList.length<=1" >
                             <Icon :size="20" :type="child.menuIcon"></Icon>
                             <span class="layout-text" :key="child.name_span">{{ child.menuName }}</span>
                         </MenuItem>                         
                         <Dropdown transfer placement="right-start" v-else style="display:block">
                            <MenuItem :name="child.menuName" :key="child.menuName" >
                               <Icon :size="20" :type="child.menuIcon"></Icon>
                               <span class="layout-text" :key="child.name_span">{{ child.menuName }}</span>
                           </MenuItem>
                            <DropdownMenu style="width: 200px;" slot="list">
                                <template v-for="(value, i) in child.subMenuList">
                                    <DropdownItem :name="value.menuUrl" :key="i">
                                      <Button size="small" :to="value.menuUrl" type="text" long>{{ value.menuName }}</Button>
                                    </DropdownItem>
                                </template>
                            </DropdownMenu>
                        </Dropdown>
                     </template>
                  </Submenu>
                </template>              
              </Menu>
              <div v-show="shrink" class="sideMenu-min">
                <template v-for="(item, index) in menuList">
                    <div style="text-align: center;" :key="index">
                        <Dropdown transfer v-if="item.subMenuList.length>0" placement="right-start" :key="index">
                            <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                                <img class="menu-icon" :src="require('../assets/img/menu/'+item.menuIcon)" :key="'menu_'+item.menuId" :onerror="'this.src='+require('../assets/img/menu/chanpin.png')"/>
                            </Button>
                            <DropdownMenu style="width: 200px;" slot="list">
                                <template v-for="(child, i) in item.subMenuList">
                                    <DropdownItem :name="child.menuUrl" :key="i">
                                      <Button size="small" :to="child.menuUrl" type="text" long>{{ child.menuName }}</Button>
                                    </DropdownItem>
                                </template>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown transfer v-else placement="right-start" :key="index">
                              <Button @click="changeMenu(item.menuName)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                                  <img class="menu-icon" :src="require('../assets/img/menu/'+item.menuIcon)" :key="'menu_'+item.menuId" :onerror="'this.src='+require('../assets/img/menu/chanpin.png')"/>
                              </Button>
                              <DropdownMenu style="width: 200px;" slot="list">
                                  <DropdownItem :name="item.menuName" :key="'d' + index"><span style="padding-left:10px;"><Button size="small" :to="item.menuUrl" type="text" long>{{ item.menuName }}</Button></span></DropdownItem>
                          </DropdownMenu>
                      </Dropdown>
                  </div>
                </template>
              </div>
            </div>
        </div>
</template>

<script>
import Vue from "vue";
import allMenus from "@/assets/data/menus.json";
// import allMenus from "@/assets/data/menu.json";
export default {
  props: {
        shrink: {
            type: Boolean,
            default: false
        },
    },
  data() {
    return {
      // menuList:allMenus.menuList
      menuList:[]
    };
  },
  computed: {
    userName: function() {
      return Vue.store.state.user.realName || Vue.getUser().realName;
    }
  },
  created() {
    this.loaded = false;
    var user = Vue.getUser();
    console.log("user", user);
    this.userType = user.userType;
    //测试注释掉
    this.getUserMenus();
  },
  methods: {
    changeMenu (active) {
            this.$emit('on-change', active);
        },
    collepseMenu: function(menu) {
      var self = this;
      if (menu.children && menu.children.length > 0) {
        if (
          menu.children.filter(child => {
            return self.getMenuStatus(child) == "active";
          }).length > 0
        ) {
          return "display:block";
        } else {
          return "display:none";
        }
      }
      return "";
    },
    getMenuStatus: function(menu) {
      var self = this;
      var style = "";
      if (self.$route && self.$route.matched) {
        //父级菜单
        if (menu.children && menu.children.length > 0) {
          if (
            self.$route.matched.filter(item => menu.router.match(item.regex))
              .length > 0
          ) {
            style = "on";
          }
          menu.children.forEach(child => {
            if (
              self.$route.matched.filter(item => child.router.match(item.regex))
                .length > 0
            ) {
              style = "on";
              this.open = true;
            }
          });
        } else if (menu.children && menu.children.length == 0) {
          //无子级的菜单
          if (
            self.$route.matched.filter(item => menu.router.match(item.regex))
              .length > 0
          ) {
            style = "on";
          }
        } else {
          //子级菜单
          if (
            self.$route.matched.filter(item => menu.router.match(item.regex))
              .length > 0
          ) {
            style = "active";
          }
        }
      }
      return style;
    },
    getUserMenus: function() {
      var self = this;
      var userMainMenus = new Array(),
        userAuths = new Array();
      var menus=Vue.getUser().menuList || [];
      if(menus.length==0){
        this.logOut();
        return;
      }
      var rr=menus.filter(menu=>{
        return allMenus.some(a=>a.menuCode==menu.menuCode)
      }).map(menu=>{
        var current=allMenus.find(a=>a.menuCode==menu.menuCode)
        return {
            menuId:menu.menuId,
            menuName:menu.menuName,
            menuCode:menu.menuCode,
            menuUrl:current.menuUrl,
            menuIcon:current.menuIcon,
            parentId:menu.parentId,
            subMenuList:menu.subMenuList.filter(secondMenu=>{
              return allMenus.some(a=>a.menuCode==secondMenu.menuCode)
            }).map(secondMenu=>{
              var currentSecond=allMenus.find(a=>a.menuCode==secondMenu.menuCode)
              return{
                menuId:secondMenu.menuId,
                menuName:secondMenu.menuName,
                menuCode:secondMenu.menuCode,
                menuUrl:currentSecond.menuUrl,
                menuIcon:currentSecond.menuIcon,
                parentId:secondMenu.parentId,
                subMenuList:secondMenu.subMenuList.filter(thirdMenu=>{
                  return allMenus.some(a=>a.menuCode==thirdMenu.menuCode)
                }).map(thirdMenu=>{
                  var currentThird=allMenus.find(a=>a.menuCode==thirdMenu.menuCode)
                  return{
                      menuId:thirdMenu.menuId,
                      menuName:thirdMenu.menuName,
                      menuCode:thirdMenu.menuCode,
                      menuUrl:currentThird.menuUrl,
                      menuIcon:currentThird.menuIcon,
                      parentId:thirdMenu.parentId,
                      subMenuList:[]
                  }
                })
              }
            })
          }
      });
      self.menuList=rr;
      self.$parent.loaded = true;
    },
    logOut: function() {
      var _this = this;
      Vue.ajax.send({
        name: "user.loginOut",
        callback() {
          Vue.cleanUp();
          _this.$router.push("/login");
        }
      });
    }
  }
};
</script>

<style scoped>
.menu-icon{
  margin-bottom:-5px;
  margin-right:10px;
}
</style>