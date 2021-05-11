<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">分包装企业</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                  <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分包装企业" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入分包装企业名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="add" v-authorize="'DictionaryPoinpackCompanyAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryPoinpackCompanyQuery'" :columnConfig='resourceCol' :columnDatas='poinpackList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                        <td>
                            <Button v-authorize="'DictionaryPoinpackCompanyReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'DictionaryPoinpackCompanyReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button>
                            <Button v-authorize="'DictionaryPoinpackCompanyIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='publishOk(item)'></Button>
                            <Button v-authorize="'DictionaryPoinpackCompanyState'" v-show="item.statusId == 0" icon="md-play" size="small" title="启用" type="primary" 
                                    class="btn-red" @click='startOk(item)'></Button>
                            <Button v-authorize="'DictionaryPoinpackCompanyState'" v-show="item.statusId == 4" icon="md-remove" size="small" title="停用" type="error" 
                                    class="btn-red" @click='stopOk(item)'></Button>
                            <Button v-authorize="'DictionaryPoinpackCompanyEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editGo(item)'></Button>
                            <Button v-authorize="'DictionaryPoinpackCompanyDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="poinpackList.length>0">            
                        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                        <Button type="text" class="fr" @click="showModal=true">
                            <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                            <span style="font-size:13px;"> 设置显示列</span>
                        </Button>
                    </div>
                </div>
            </div>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="poinpackOk(3)">
            <Form :model="poinpackInfo" :label-width="90">
                <input type="hidden" v-model="poinpackInfo.poinpackcompanyId"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="poinpackInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="poinpackInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                </FormItem>
            </Form>
        </Modal> 
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../../common/EmptyRow";
import CustomTable from "../../../common/GridTable";
//公用json串，不需要访问后台
import reviewStateJson from "@/assets/data/dicBase/reviewState.json";

export default {
  name: "poinpack",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      tableH: 0,
      searchForm:{
          keywords: "",
          statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      poinpackForm: {
        poinpackcompanyName: "",
        poinpackcompanyId: "",
        remark: ""
      },
      loadingAdd: true,
      loading: true,
      poinpackList: [],
      poinpackInfo: {},
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      ruleValidate: {
        poinpackcompanyId: [
          {
            required: true,
            message: "分包装企业编号不能为空",
            trigger: "blur"
          }
        ],
        poinpackcompanyName: [
          {
            required: true,
            message: "分包装企业名称不能为空",
            trigger: "blur"
          }
        ]
      },
      resourceCol: [
        {
          text: "分包装企业编号",
          name: "poinpackcompanyId",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "分包装企业",
          name: "poinpackcompanyName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "分包装企业中文简称",
          name: "poinpackcompanyShortname",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "分包装企业法人",
          name: "poinpackcompanyLegal",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "分包装企业注册地址",
          name: "poinpackcompanyAddress",
          sortable: true,
          moveable: true,
          width: 250
        },
        {
          text: "联系人",
          name: "contact",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "所在省",
          name: "provinceName",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "所在市",
          name: "cityName",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "电话",
          name: "telephone",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "传真",
          name: "fax",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "邮编",
          name: "postcode",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "邮箱",
          name: "email",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 100,
          render: (params) => {
            if(params.statusId==0){
                return '停用';
            }else if(params.statusId==1){
                return '待审批';
            }else if(params.statusId==2){
                return '通过';
            }else if(params.statusId==3){
                return '不通过';
            }else if(params.statusId==4){
                return '发布';
            }
                return ''
            }
        },
        {
          text: "创建人",
          name: "createUser",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "创建时间",
          name: "createTime",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "修改人",
          name: "changeUser",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "修改时间",
          name: "changeTime",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "审核人",
          name: "checkUser",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "审核时间",
          name: "checkTime",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "审核不通过原因",
          name: "checkNoReason",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "审核不通过备注",
          name: "checkNoReasonMemo",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "备注",
          name: "remark",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "操作",
          name: "op",
          filterable: false,
          removeable: false,
          width: 200
        }
      ]
    };
  },
  activated: function() {
    this.getPoinpackList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A29",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.poinpackInfo.checkNoReason =
              self.checkNoReasonList[0].dictionaryName;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getPoinpackList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "poinpack.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          poinpackcompanyName: self.searchForm.keywords,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.poinpackList = data.data.dataList;
            self.pageConfig.totalItemCount = data.data.totalItemCount;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    changePage(currentPage) {
      this.pageConfig.pageNum = currentPage;
      this.getPoinpackList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getPoinpackList();
    },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (this.currentSort.column == "statusId") {
          this.showDatas.sort(
            (a, b) =>
              this.currentSort.asc
                ? a[this.currentSort.column] - b[this.currentSort.column]
                : b[this.currentSort.column] - a[this.currentSort.column]
          );
        } else {
          this.showDatas.sort(
            (a, b) =>
              this.currentSort.asc
                ? (a[this.currentSort.column] || "").localeCompare(
                    b[this.currentSort.column]
                  )
                : (b[this.currentSort.column] || "").localeCompare(
                    a[this.currentSort.column]
                  )
          );
        }
      }
      this.showColumns = showColumns;
    },
    add() {
      this.$router.push({
        path: "/standard/dictionary/poinpackCompany/add",
        query: {
                type: 2
                }                
        });                         
    },
    passOk(item) {
      this.poinpackInfo = Object.assign({}, item);
      this.poinpackOk(2);
    },
    noPassOk(item) {
      this.noPassModel = true;
      this.poinpackInfo = Object.assign({}, item);
      this.getAuditList();
    },
    publishOk(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.poinpackcompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "poinpack.review",
            data: {
              poinpackcompanyId: item.poinpackcompanyId,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("分包装企业信息发布成功");
                self.getPoinpackList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    },
    startOk(item) {
      this.$Modal.confirm({
        title: "启用确认",
        content: "确定要启用“" + item.poinpackcompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "poinpack.review",
            data: {
              poinpackcompanyId: item.poinpackcompanyId,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("分包装企业信息启用成功");
                self.getPoinpackList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    },
    stopOk(item) {
      this.$Modal.confirm({
        title: "停用确认",
        content: "确定要停用“" + item.poinpackcompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "poinpack.review",
            data: {
              poinpackcompanyId: item.poinpackcompanyId,
              statusId: "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("分包装企业信息停用成功");
                self.getPoinpackList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    },
    editGo(item){
      this.$router.push({
        path: "/standard/dictionary/poinpackCompany/add",
        query: {
          //query传值不会因为刷新页面导致数据丢失
          Id: item.poinpackcompanyId,
          type: 1
        }
      });
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.poinpackcompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "poinpack.del",
            data: {
              poinpackcompanyId: item.poinpackcompanyId,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("分包装企业信息删除成功");
                self.getPoinpackList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    },
    poinpackOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "poinpack.review",
        data: {
          poinpackcompanyId: self.poinpackInfo.poinpackcompanyId,
          statusId: value,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          checkNoReason: value == 2 ? '' : self.poinpackInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? '' : self.poinpackInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            value == 2 ? (self.editModel = false) : (self.noPassModel = false);

            value == 2
              ? self.$Message.success("分包装企业通过信息提交成功！")
              : self.$Message.success("分包装企业不通过信息提交成功！");

            self.getPoinpackList();
          } else {
            setTimeout(() => {
              self.loading = false;
              self.$nextTick(() => {
                self.loading = true;
              });
            }, 0);
            self.$Modal.error({
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
table {
  width: 100%;
  overflow-y: auto;
}
table td {
  max-width: 300px;
}

.page-footer button {
  position: absolute;
  right: 40px;
  top: 3px;
}
.page-footer .text-center {
  position: relative;
  display: block;
  width: 100%;
}
</style>