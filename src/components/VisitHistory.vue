<template>
    <div class="tags-con">
        <div ref="scrollCon" class="tags-outer-scroll-con">
          <div class="close-all-tag-con">
            <Dropdown transfer  @on-click="closeAll" v-if="tagList!=null && tagList.length>0">
              <Button size="small" type="primary" style="height: 28px;">
                <img src='../assets/img/sort-down.png'/>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="closeAll">关闭所有</DropdownItem>
                <DropdownItem name="closeOthers">关闭其他</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <template v-if="showDirection">
            <transition name='fade'>
            <a style="position:absolute;left:0px;margin-top:10px;" href="javascript:;" @click="scrollLeft">
              <img src='../assets/img/gengduo.png'/>
            </a>
            </transition>
            <transition name='fade'>
            <a style="position:absolute;right:60px;margin-top:10px;z-index:99;" href="javascript:;" @click="scrollRight">
              <img src='../assets/img/gengduoyou.png'/>
            </a>
            </transition>
          </template>
          <div class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}"  @mouseover="showBar" @mouseout="hideBar">
              <ul class="category-head" id="scrollBodyContainer" ref="scrollBodyContainer" >
                    <li v-for="(item,index) in tagList" :key="item.path+index" :ref="'scrollChild_'+item.path">
                        <Tag type="dot" v-if="item.default" style="width:95%;padding-right:4px;" @click.native="handleClick(item)" :fade="false" :title="item.path" :color="item.active?'blue':'default'"><span style="margin-right:10px;">{{item.name.length>10?item.name.substr(0,10)+"..":item.name}}</span></Tag>
                        <Tag type="dot" v-else style="width:95%;" @click.native="handleClick(item)" :fade="false" closable @on-close="handleClose(item)" :title="item.path" :color="item.active?'blue':'default'"><span style="margin-right:-8px;">{{item.name.length>10?item.name.substr(0,10)+"..":item.name}}</span></Tag>
                    </li>
                </ul>
                <!-- <Tag type="dot" v-for="(item,index) in tagList" @click.native="handleClick(item)" :key="item.path+index" :fade="false" closable @on-close="handleClose(item)" :color="item.active?'blue':'default'">{{item.path}}</Tag> -->
          </div>
          
          <!-- <img src='../assets/img/gengduoyou.png'/> -->
        </div>
      </div>
</template>
<script>
import Vue from "vue";
import menuDic from "@/assets/data/menus.json";
// import menuDic from "@/assets/data/menu.json";
export default {
  props: {
    maxSize: 5
  },
  data() {
    return {
      tagList: null,
      tagBodyLeft:12,
      menus:{},
      showDirection:false,
      timeOutHandler:null
    };
  },
  mounted: function() {
      this.getMenus();
    if (this.tagList == null) {
      this.getTagList(this.$route);
    }
  },
  watch: {
    $route(to, from) {
      this.getTagList(to);
    }
  },
  computed: {},
  methods: {
      getMenus:function(){
          this.menus={};
          var self=this;
          (Vue.getUser().menuList || []).forEach(menu=>{
            if(menuDic.someProperty("menuCode",menu.menuCode)){
              self.menus[menuDic.findProperty("menuCode",menu.menuCode).menuUrl]=menu.menuName;
            }
            if(menu.subMenuList){
               menu.subMenuList.forEach(subMenu=>{
                 if(menuDic.someProperty("menuCode",subMenu.menuCode)){
                    self.menus[menuDic.findProperty("menuCode",subMenu.menuCode).menuUrl]=subMenu.menuName;
                 }
                 if(subMenu.subMenuList){
                   subMenu.subMenuList.forEach(thirdMenu=>{
                    if(menuDic.someProperty("menuCode",thirdMenu.menuCode)){
                        self.menus[menuDic.findProperty("menuCode",thirdMenu.menuCode).menuUrl]=thirdMenu.menuName;
                    }
                  })
                 }
               })
            }
          })
      },
      // getMenus:function(){
      //     this.menus={};
          
      //     menuDic.forEach(menu=>{
      //         if(menu.menuUrl){
      //           var allMenusInfos=Vue.getUser().menuList;
      //           var menuName="";
      //           allMenusInfos.forEach(firstMenu=>{
      //             if(firstMenu.menuCode==menu.menuCode){
      //               menuName=firstMenu.menuName;
      //               return;
      //             }
      //             if(firstMenu.subMenuList.length>0){
      //               firstMenu.subMenuList.forEach(secondMenu=>{
      //                 if(secondMenu.menuCode==menu.menuCode){
      //                   menuName=secondMenu.menuName;
      //                   return;
      //                 }
      //                 if(secondMenu.subMenuList.length>0){
      //                   secondMenu.subMenuList.forEach(thirdMenu=>{
      //                     if(thirdMenu.menuCode==menu.menuCode){
      //                       menuName=thirdMenu.menuName;
      //                       return;
      //                     }
      //                   });
      //                 }
      //               });
      //             }
      //           })
      //           if(menuName!=""){
      //             this.menus[menu.menuUrl]=menuName;
      //           }
      //         }
      //     })
      // },
    getTagList: function(to) {
      var oldList = this.$store.getters.getHistory;
      if (!to) {
        this.tagList = oldList;
      } else {
        var currentPath = to.meta.baseUrl || to.path;
        if(!this.menus[currentPath]){
          this.tagList = oldList
          return
        }
        if (!oldList.some(m => m.path == currentPath)) {
                var newObj = {
                    path: currentPath,
                    fullPath:to.fullPath,
                    name: this.menus[currentPath],
                    active: true,
                    default:currentPath=="/homePage/list"
                };
                oldList.push(newObj);
        }
        this.tagList = oldList.map(m => {
          if (m.path == currentPath) {
            m.active = true;
          } else {
            m.active = false;
          }
          return m;
        });
        this.$store.commit("updateHistory", this.tagList);
      }
      this.scroll()
      
    },
    showBar:function(){
        this.showDirection=true;
    },
    hideBar:function(){
      var self=this;
      clearTimeout(self.timeOutHandler)
        self.timeOutHandler=self.$setTimeout(function(){
          self.showDirection=false;
        },3000)
    },
    scroll:function(){
        var self=this;
        var item=self.tagList.find(m=>{
            return m.active==true
        });
        if(item){
          Vue.nextTick(function(){
            var index=self.tagList.indexOf(item);
            var newLeft=0;
            for(var i=0;i<index;i++){
              var t="scrollChild_"+self.tagList[i].path;
              newLeft+=parseInt(self.$refs[t][0].offsetWidth)
            }
            self.$refs.scrollBodyContainer.scrollLeft=newLeft
          })
            
            // Vue.nextTick(function(){
            //   var newLeft=index*150;
            //   var delta=300;
            //   self.$refs.scrollBodyContainer.scrollLeft=newLeft-delta;
            // })
        }
        self.showDirection=true;
        clearTimeout(self.timeOutHandler)
        self.timeOutHandler=self.$setTimeout(function(){
          self.showDirection=false;
        },3000)
        // if(self.$refs.scrollBodyContainer.scrollWidth>self.$refs.scrollBodyContainer.clientWidth){
        //   self.showDirection=true;
        // }
        // else{
        //   self.showDirection=false;
        // }
        
    },
    scrollLeft:function(){
        var self=this;
        this.showDirection=true;
        self.$refs.scrollBodyContainer.scrollLeft-=150;
    },
    scrollRight:function(){
        var self=this;
        this.showDirection=true;
        self.$refs.scrollBodyContainer.scrollLeft+=150;
    },
    handleClose: function(current) {
      if (current.active) {
        var newPath=""
        var item=this.tagList.find(m=>{return m.path==current.path});
        var index=this.tagList.indexOf(item);
        if(index<this.tagList.length-1){
            this.tagList[index+1].active=true;
            newPath=this.tagList[index+1].fullPath;
        }
        else{
            if( this.tagList[this.tagList.length - 2]){
                this.tagList[this.tagList.length - 2].active = true;
                newPath=this.tagList[this.tagList.length - 2].fullPath;
            }
        }
        this.tagList = this.tagList.filter(m => m.path != current.path);
        this.$store.commit("updateHistory", this.tagList);
        if(newPath!=""){
            this.$router.push(newPath);
        }
      } else {
        this.tagList = this.tagList.filter(m => m.path != current.path);
        this.$store.commit("updateHistory", this.tagList);
      }
      this.scroll()
    },
    handleClick: function(current) {
      this.tagList = this.tagList.map(m => {
        if (m.path == current.path) {
          m.active = true;
        } else {
          m.active = false;
        }
        return m;
      });
      this.$router.push(current.fullPath);
    },
    closeAll:function(name){
      if(name=="closeAll"){
        this.tagList = this.tagList.filter(m => m.default==true);
        if(this.tagList.length>0){
          this.$router.push(this.tagList[0].fullPath);
        }
      }
      if(name=="closeOthers"){
          this.tagList = this.tagList.filter(m => m.active==true || m.default==true);
      }
      this.$store.commit("updateHistory", this.tagList);
      this.scroll()
    },
  }
};
</script>
<style scoped>
/* .fade-enter-active{
  transition: opacity .5s
}
.fade-leave-active {
  transition: opacity 12s
}
.fade-enter, .fade-leave-to{
  opacity: 0;
} */
.category-head{
    height:55px;
    width:100%;
    /* display: inline; */
    white-space: nowrap;
    overflow-x:auto;
    float:left;
    overflow-y:hidden;
}
.category-head .ivu-tag .ivu-icon-ios-close{
    float:right !important;
    margin-top:8px !important;
    margin-left:0px !important;
}
.category-head li{
    /* width:150px; */
    /* overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    padding-right:0px;
    padding-left:0px;
    display:inline-block;/*既可以水平排列，又可以设置宽高和边距*/
}
</style>
