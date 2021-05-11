<template> 
    <div class="bg-white m20" style="height:1000px">
        <h2 class="common-title">仪表盘</h2>
        <div class="middle-column-home" v-authorize="'homepagelist'">
            <div v-for="item,index in warnList" :key="item.warnTypeId" class="codelist">
                <div class="leftText" :style="'background-color: '+colors[index]+';'" :class="{'hosp':item.warnTypeId==1,'business':item.warnTypeId==2,'rule':item.warnTypeId==3, 'dic':item.warnTypeId==4, 
                    'map':item.warnTypeId==5, 'other':item.warnTypeId==6}">
                    <div class="textVer">{{ item.warnTypeName }}</div>
                     
                </div>
            <div class="rightText">
              <router-link v-for="item in item.children" class="item-top" :key="item.warnTypeId" :to="item.pageUrl">
                <div class="boxLeft" :style="'background-color: '+(item.warnCount > 0 ? colors[index]:notcolor)+';'" :class="{'hosp':item.parentId==1,'business':item.parentId==2,'rule':item.parentId==3, 'dic':item.parentId==4, 
                'map':item.parentId==5, 'other':item.parentId==6}"> 
                    <p style="font-size:xx-small;"> {{ item.warnTypeName }} </p>
                </div>
                <div class="boxRight" :style="'color: '+(item.warnCount > 0 ? colors[index]:notcolor)+';'" :class="{'hosp':item.parentId==1,'business':item.parentId==2,'rule':item.parentId==3, 'dic':item.parentId==4, 
                'map':item.parentId==5, 'other':item.parentId==6}">
                    <strong> {{ item.warnCount }} </strong>
                </div>
              </router-link>
            </div>
            </div>
        </div>
    </div>

</template>

<script>
import Vue from "vue";
import config from "../../config";
export default {
  name: "warnPerson",

  data() {
    return {
      warnForm: {},
      warnList: [],
      warn: {},
      colors: [
        "#51a295",
        "#ae85a7",
        "#00a0e9",
        "#bd8a52",
        "#7fa06a",
        "#af6e75",
        "#bd8a52",
        "#7fa06a",
        "#af6e75"
      ],
      notcolor: "#ccc",
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
        totalItemCount: 1
      }
    };
  },
  activated: function() {
    this.getWarnList();
  },
  methods: {
    getWarnList() {
      var self = this;
      Vue.ajax.send({
        name: "warn.list",
        data: {
          pageIndex: 1,
          pageSize: 99999,
          warnUser: Vue.getUser().userId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.warnList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.middle-column-home {
  width: 100%;
  margin-right: 0;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
}

.codelist {
  overflow: hidden;
  border: 1px solid #eaeaea;
  margin-bottom: 20px;
  border-radius: 5px;
  width: 100%;
  position: relative;
}

.codelist a.item-top {
  flex-direction: column;
  flex-wrap: wrap;
  width: 130px;
  margin: 16px 8px 16px 0;
  text-align: left;
  height: 50px;
  color: #bbb;
  background-color: #fff;
  border-radius: 3px;
  border: 1px solid #eaeaea;
}
.codelist a {
  width: 72px;
  margin: 0 5px 8px 5px;
  float: left;
  text-align: center;
  color: #999;
  font-size: 12px;
  height: 65px;
  overflow: hidden;
  text-decoration: none;
}
a {
  color: #64854c;
  text-decoration: none;
  -o-transition-duration: 0.2s;
  -o-transition-property: opacity;
  -webkit-transition-duration: 0.2s;
  -webkit-transition-property: opacity;
}

.middle-column-home .codelist .leftText {
  width: 30px;
  float: left;
  margin-right: 20px;
  padding: 10px 5px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}

.middle-column-home .codelist .rightText {
  float: right;
  min-height: 110px;
  width: calc(100% - 50px);
}

.middle-column-home .codelist .leftText .textVer {
  margin: 0 auto;
  width: 20px;
  text-align: center;
  color: #fff;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}

.codelist a.item-top .boxLeft {
  float: left;
  width: 60px;
  text-align: center;
  padding: 0px 5px;
  line-height: 50px;
}

.codelist a.item-top .boxRight {
  width: 80px;
  height: 50px;
  margin-left: 50px;
  text-align: center;
}

div p {
  border: 0;
  font-size: 12px;
  line-height: 1;
  display: inline-block;
}
p {
  height: auto;
  color: #fff;
  text-align: center;
}

.codelist a.item-top strong {
  text-align: center;
  line-height: 50px;
}
</style>