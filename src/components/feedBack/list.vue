<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">问题反馈</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="数据类型" :label-width="70">
		                <Select v-model="searchForm.dataType" filterable clearable style="width: 120px;">
				            <Option value="10">购药数据</Option>
                            <Option value="20">门急诊数据</Option>
                            <Option value="30">病案数据</Option>
                            <Option value="40">医嘱数据</Option>
				        </Select>
		            </FormItem>
                    <FormItem label="问题阶段" :label-width="70">
		                <Select v-model="searchForm.problemStageId" filterable clearable style="width: 150px;">
				            <Option v-for="item in proStageList" :value="item.problemStageId" :key="item.problemStageId" >{{ item.problemStageName }}</Option>
				        </Select>
		            </FormItem>
                    <FormItem label="问题类型" :label-width="70">
		                <Select v-model="searchForm.problemTypeId" filterable clearable style="width: 150px;">
                            <Option v-for="item in proTypeList" :value="item.problemTypeId" :key="item.problemTypeId" >{{ item.problemTypeName }}</Option>
				        </Select>
		            </FormItem>
                    <FormItem label="紧急程度" :label-width="70">
		                <Select v-model="searchForm.emergencyLevel" filterable clearable style="width: 90px;">
				            <Option :value="0">一般</Option>
                            <Option :value="1">急</Option>
                            <Option :value="2">紧急</Option>
				        </Select>
		            </FormItem>
                    <FormItem label="处理状态" :label-width="70">
		                <Select v-model="searchForm.state" filterable clearable style="width: 90px;">
				                    <!-- <Option :value="0">待处理</Option>
                            <Option :value="1">已处理</Option>
                            <Option :value="2">撤销</Option> -->
                            <Option v-for="item in feedStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				            </Select>
		            </FormItem>
                    <FormItem>
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入主题名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
                    
		            </FormItem>
                 
                    <FormItem  class="fr">
                        <Button type="primary" to="/feedBack/add" v-authorize="'FeedBackManageAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            
            
            <div class="bg-white mt15" style="height:100%;">
              <Table border ref="dataTable"  :columns="feedBackColnew" :data="newDatas">
              </Table>
             
            <div style="" class="page-footer">      
                 <div class="mt15 text-center" v-if="feedBackList.length>0">       
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                     <Button type="primary"    class="fr page-footer-button"  size="large" @click="exportData"><Icon type="ios-download-outline"></Icon>导出</Button>
                   
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
//公用json串，不需要访问后台
import feedStateJson from "@/assets/data/dicBase/reviewState.json";

export default {
  name: "feedBack",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      feedStateList: feedStateJson.feedBackStateList, //数据类型
      searchForm: {
        dataType: "",
        problemStageId: "",
        problemTypeId: "",
        emergencyLevel: "",
        state: 0,
        keywords: ""
      },
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      addModel: false,
      feedBackList: [],
      proStageList: [],
      proTypeList: [],
      newDatas:[],
      handleCol: [
        {
          title: "问题类型",
          key: "problemType",
          align: "center"
        },
        {
          title: "紧急程度",
          key: "urgent",
          align: "center"
        },
        {
          title: "反馈人",
          key: "feedName",
          align: "center"
        },
        {
          title: "要求答复时间",
          key: "replyTime",
          align: "center",
          width: 120
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  icon: "md-arrow-forward"
                },
                class: "btn-deep-blue",
                attrs: {
                  title: "处理"
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/feedBack/detail",
                      query: {
                        type: 2,
                        Id: item.productId
                      }
                    });
                  }
                }
              })
            ]);
          }
        }
      ],
      excelCol:[
        {
          title: "主题",
          key: "title",
          width: 130
        },
        {
          title: "反馈问题阶段",
          key: "issuePhases",
          width: 130
        },
        {
          title: "问题类型",
          key: "issueType",
          width: 130
        },
        {
          title: "数据类型",
          key: "dataType",
          width: 130,
          render: (params) => {
                            if(params.dataType==10){
                                return '购药数据';
                            }else if(params.dataType==20){
                                return '门急诊数据';
                            }else if(params.dataType==30){
                                return '病案数据';
                            }else if(params.dataType==40){
                                return '医嘱数据';
                            }
                            return ''
                        }
        },
        {
          title: "反馈人",
          key: "feedbackUserName",
          width: 130
        },
        {
          title: "反馈时间",
          key: "feedbackTime",
          width: 130
        },
        {
          title: "省",
          key: "provinceName",
          width: 130
        },
        {
          title: "市",
          key: "cityName",
          width: 130
        },
        {
          title: "医院编码",
          key: "hospNo",
          width: 130
        },
        {
          title: "医院名称",
          key: "hospName",
          width: 130
        },
        {
          title: "数据年月",
          key: "yearMonth",
          width: 130
        },
        {
          title: "问题描述",
          key: "issueDesc",
          width: 200
        },
        {
          title: "紧急程度",
          key: "emergencyLevel",
          width: 130,
          render: params => {
            if (params.emergencyLevel == 0) {
              return "一般";
            } else if (params.emergencyLevel == 1) {
              return "急";
            } else if (params.emergencyLevel == 2) {
              return "紧急";
            }else {
                return '';
            }
          },
        },
        {
          title: "处理状态",
          key: "state",
          width: 130,
          render: params => {
            if (params.state == 0) {
              return "待处理";
            } else if (params.state == 1) {
              return "已处理";
            } else if (params.state == 2) {
              return "撤销";
            }
          }
        }
         
      ],
      feedBackCol: [
        {
          text: "主题",
          name: "title",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "反馈问题阶段",
          name: "issuePhases",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "问题类型",
          name: "issueType",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "数据类型",
          name: "dataType",
          sortable: true,
          moveable: true,
          width: 130,
          render: (params) => {
                            if(params.dataType==10){
                                return '购药数据';
                            }else if(params.dataType==20){
                                return '门急诊数据';
                            }else if(params.dataType==30){
                                return '病案数据';
                            }else if(params.dataType==40){
                                return '医嘱数据';
                            }
                            return ''
                        }
        },
        {
          text: "反馈人",
          name: "feedbackUserName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "反馈时间",
          name: "feedbackTime",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "省",
          name: "provinceName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "市",
          name: "cityName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "医院编码",
          name: "hospNo",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "医院名称",
          name: "hospName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "数据年月",
          name: "yearMonth",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "问题描述",
          name: "issueDesc",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "紧急程度",
          name: "emergencyLevel",
          sortable: true,
          moveable: true,
          width: 130,
          render: params => {
            if (params.emergencyLevel == 0) {
              return "一般";
            } else if (params.emergencyLevel == 1) {
              return "急";
            } else if (params.emergencyLevel == 2) {
              return "紧急";
            }else {
                return '';
            }
          },
        },
        {
          text: "处理状态",
          name: "state",
          sortable: true,
          moveable: true,
          width: 130,
          render: params => {
            if (params.state == 0) {
              return "待处理";
            } else if (params.state == 1) {
              return "已处理";
            } else if (params.state == 2) {
              return "撤销";
            }
          }
        },
        {
          text: "操作",
          name: "op",
          filterable: false,
          removeable: false,
          width: 180
        }
      ],
      feedBackColnew: [
        {
          title: "主题",
          key: "title",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "反馈问题阶段",
          key: "issuePhases",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "问题类型",
          key: "issueType",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "数据类型",
          key: "dataType",
          sortable: true,
          moveable: true,
          width: 130,
          render: (h, params) => {
            var text="";
            if(params.row.dataType==10){
                text= '购药数据';
            }else if(params.row.dataType==20){
                text= '门急诊数据';
            }else if(params.row.dataType==30){
                text= '病案数据';
            }else if(params.row.dataType==40){
                text= '医嘱数据';
            }
            return  h('span', text)            
          }
          
        },
        {
          title: "反馈责任人",
          key: "feedbackUserName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "反馈时间",
          key: "feedbackTime",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "实际处理人人",
          key: "dealUserName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "省",
          key: "provinceName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "市",
          key: "cityName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "医院编码",
          key: "hospId",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "医院名称",
          key: "hospName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "数据年月",
          key: "yearMonth",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          title: "问题描述",
          key: "issueDesc",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          title: "问题处理",
          key: "issueResult",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          title: "紧急程度",
          key: "emergencyLevel",
          sortable: true,
          moveable: true,
          width: 130,
           render: (h, params) => {
            var text="";
             if (params.row.emergencyLevel == 0) {
               text= "一般";
            } else if (params.row.emergencyLevel == 1) {
               text= "急";
            } else if (params.row.emergencyLevel == 2) {
               text= "紧急";
            }
            
            return  h('span', text)            
          }
        },
        {
          title: "处理状态",
          key: "state",
          sortable: true,
          moveable: true,
          width: 130,
          render: (h, params) => {
            var text="";
             if (params.row.state == 0) {
              text= "待处理";
            } else if (params.row.state == 1) {
              text= "已处理";
            } else if (params.row.state == 2) {
              text= "撤销";
            }
            return  h('span', text)            
          }
        },
        {
          title: "操作",
          key: "op",
          filterable: false,
          removeable: false,
          width: 180,
           render: (h, params) => {
             var ren=[];
             if(params.row.state == 0 && params.row.handleuserid == params.row.userIdTmp && Vue.authorize("FeedBackManageDispose")){
                ren.push(h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                          click: () => {
                            
                            this.$router.push("/feedBack/detail?Id="+params.row.feedbackId+"&&type=2")
                          }
                      },

                  }, '处理'));
             }
             if(Vue.authorize("FeedBackManageDel")){
               ren.push(h('Button', {
                      props: {
                          type: 'error',
                          size: 'small'
                      },
                      on: {
                          click: () => {
                             this.deleteItem(params.row)
                          }
                      }
                  }, '删除'))
             }
              return h('div', ren);
          }
      }
        
      ],
      excelCol1:{}
    };
  },
  activated: function() {
    this.getFeedBackList();
    this.getProStageList();
    this.getProTypeList();
    this.excelCol1=this.excelCol.attrToObject('title','key');
  },
  methods: {
    getProStageList() {
      var self = this;
      Vue.ajax.send({
        name: "feedBack.proStage",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.proStageList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getProTypeList() {
      var self = this;
      Vue.ajax.send({
        name: "feedBack.proType",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.proTypeList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getFeedBackList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "feedBack.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          feedbackUser: Vue.getUser().userId,
          dataType: self.searchForm.dataType,
          issuePhases: self.searchForm.problemStageId,
          issueType: self.searchForm.problemTypeId,
          emergencyLevel: self.searchForm.emergencyLevel,
          state: self.searchForm.state,
          title: self.searchForm.keywords
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            //接口数据
            self.feedBackList = data.data.dataList;
            self.newDatas=data.data.dataList
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
      this.getFeedBackList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getFeedBackList();
    },
    add() {
      this.$router.push({
        path: "/standard/dictionary/city/add",
        query: {
          type: "2"
        }
      });
    },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        // if (this.currentSort.column == "paymentMethod") {
        // this.showDatas.sort(
        //     (a, b) =>
        //     this.currentSort.asc
        //         ? a[this.currentSort.column] - b[this.currentSort.column]
        //         : b[this.currentSort.column] - a[this.currentSort.column]
        // );
        // } else {
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
        // }
      }
      this.showColumns = showColumns;
    },
    revokeItem(item) {
      this.$Modal.confirm({
        title: "撤销确认",
        content: "确定要撤销“" + item.feedbackId + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "feedBack.revoke",
            data: {
              feedbackId: item.feedbackId,
              feedbackUser: Vue.getUser().userId
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("反馈信息撤销成功");
                self.getFeedBackList();
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
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.feedbackId + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "feedBack.del",
            data: {
              feedbackId: item.feedbackId,
              feedbackUser: Vue.getUser().userId
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("反馈信息删除成功");

                self.getFeedBackList();
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
    exportData(){
      this.$refs.dataTable.exportCsv({
            filename: '问题反馈列表',
            columns: this.excelCol,
            data: this.newDatas
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

.page-footer-button {
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