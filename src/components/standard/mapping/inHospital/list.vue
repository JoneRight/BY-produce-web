<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">入院情况</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		        <FormItem label="状态" :label-width="60">
                    <!-- <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option value="0">停用</Option>
                        <Option value="1">待审批</Option>
                        <Option value="2">通过</Option>
                        <Option value="3">不通过</Option>
                        <Option value="4">发布/启用</Option>
                    </Select> -->
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="入院情况名称" :label-width="100">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入入院情况名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedInHospAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            
            <CustomTable v-authorize="'MappedInHospList'" :columnConfig='inHospCol' :columnDatas='inHospList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in inHospCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{inHospCol.find(m=>m.name==col.name).render?inHospCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                   <td>
                   <Button v-authorize="'MappedInHospAudit'" v-if="item.statusId==1" class="btn-green" icon="md-checkmark-circle" size="small" title="通过" type="success" @click='inHospInfo = Object.assign({},item);inHospOk(2);'></Button>
                   <Button v-authorize="'MappedInHospAudit'" v-if="item.statusId==1" class="btn-red" icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;inHospInfo = Object.assign({},item);getAuditList();'></Button>
                   <Button v-authorize="'MappedInHospEdit'" class="btn-green" icon="md-create" size="small" title="编辑" type="success" @click='$refs["inHospForm"].resetFields();editModel = true;inHospInfo = Object.assign({},item); editTitle = "编辑"; okText = "确定";cancelText = "取消";'></Button>
                   <Button v-authorize="'MappedInHospIssus'" v-if="item.statusId==2" class="btn-orange" icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                   <Button v-authorize="'MappedInHospState'" v-if="item.statusId==0 || item.statusId==4" class="btn-orange" :icon="item.statusId == 0  ? 'md-play': 'md-remove'" size="small" :title="item.statusId == 0?'启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                   <Button v-authorize="'MappedInHospDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class="btn-red" icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                   </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
               
            </CustomTable>
             <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="inHospList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

        <!-- 新增弹框 -->
        <Modal v-model="addModel" title="新增" class-name="vertical-center-modal"  @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="inHospForm" ref="inHospFormAdd" :rules="ruleValidate" :label-width="110">
                    <FormItem label="入院情况编号" prop="admissionOf">
                        <Input v-model.trim="inHospForm.admissionOf" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="入院情况名称" prop="admissionOfName">
                        <Input v-model.trim="inHospForm.admissionOfName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="inHospForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" />
                    </FormItem>
                </Form>
            </Modal> 
            <!-- 编辑弹框 -->
            <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editInHospInfo" :loading="loading" :mask-closable="false">
                <Form ref="inHospForm" :model="inHospInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="inHospInfo.admissionOf"/>
                    <FormItem label="入院情况名称" prop="admissionOfName">
                        <Input v-model.trim="inHospInfo.admissionOfName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="inHospInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
                </Form>
           </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="inHospOk(3)">
            <Form :model="inHospInfo" :label-width="90">
                <input type="hidden" v-model="inHospInfo.admissionOf"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="inHospInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="inHospInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "inHosp",
  components: { EmptyRow, CustomTable },
  data() {
    const validateNumber = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      tableH: 0,
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      inHospForm: {
        admissionOf: "",
        admissionOfName: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      loadingAdd: true,
      loading: true,
      inHospList: [],
      inHospInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        admissionOf: [
          { required: true, message: "入院情况编号不能为空", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        admissionOfName: [
          { required: true, message: "入院情况不能为空", trigger: "blur" }
        ]
      },
      inHospCol: [
        {
          text: "入院情况",
          name: "admissionOf",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "入院情况名称",
          name: "admissionOfName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "状态",
          name: "statusId",
          width: 150,
          sortable: true,
          moveable: true,
          render: params => {
            if (params.statusId == 0) {
              return "停用";
            } else if (params.statusId == 1) {
              return "待审批";
            } else if (params.statusId == 2) {
              return "通过";
            } else if (params.statusId == 3) {
              return "不通过";
            } else if (params.statusId == 4) {
              return "发布";
            }
            return "";
          }
        },
        {
          text: "创建人",
          name: "createUser",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "创建时间",
          name: "createTime",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "修改人",
          name: "changeUser",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "修改时间",
          name: "changeTime",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "审核人",
          name: "checkUser",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "审核时间",
          name: "checkTime",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "审核不通过原因",
          name: "checkNoReason",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "审核不通过备注",
          name: "checkNoReasonMemo",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "备注",
          name: "remark",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "操作",
          name: "op",
          width: 180,
          filterable: false,
          removeable: false
        }
      ]
    };
  },
  mounted: function() {
    this.getInHospList();
  },
  methods: {
    openConfirm(item) {
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.admissionOfName + "”？"
            : "确定要停用“" + item.admissionOfName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "inHosp.review",
            data: {
              admissionOf: item.admissionOf,
              admissionOfName: item.admissionOfName,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("入院情况信息启用成功")
                  : self.$Message.info("入院情况信息停用成功");
                self.getInHospList();
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
    pubConfirm(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.admissionOfName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "inHosp.review",
            data: {
              admissionOf: item.admissionOf,
              admissionOfName: item.admissionOfName,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("入院情况信息发布成功");
                self.getInHospList();
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
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.admissionOfName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "inHosp.del",
            data: {
              admissionOf: item.admissionOf,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("入院情况信息删除成功");
                self.getInHospList();
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
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A14",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.inHospInfo.checkNoReason =
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
    getInHospList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "inHosp.list",
        data: {
          admissionOfName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.inHospList = data.data.dataList;
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
      this.getInHospList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getInHospList();
    },
    addModal() {
      this.$refs["inHospFormAdd"].resetFields();
      this.inHospForm.remark = "";
      this.addModel = true;
    },
    addOk() {
      this.$refs["inHospFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "inHosp.add",
            data: {
              admissionOf: self.inHospForm.admissionOf,
              admissionOfName: self.inHospForm.admissionOfName,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.inHospForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["inHospFormAdd"].resetFields();
                self.$Message.success("新增入院情况提交成功！");
                //刷新页面
                self.getInHospList();
              } else {
                setTimeout(() => {
                  self.loadingAdd = false;
                  self.$nextTick(() => {
                    self.loadingAdd = true;
                  });
                }, 0);
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        } else {
          setTimeout(() => {
            this.loadingAdd = false;
            this.$nextTick(() => {
              this.loadingAdd = true;
            });
          }, 0);
        }
      });
    },
    inHospOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "inHosp.review",
        data: {
          admissionOf: self.inHospInfo.admissionOf,
          admissionOfName: self.inHospInfo.admissionOfName,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.inHospInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? "" : self.inHospInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("入院情况通过信息提交成功！")
              : self.$Message.success("入院情况不通过信息提交成功！");
            //刷新页面
            self.getInHospList();
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
    },
    editInHospInfo() {
      this.$refs["inHospForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "inHosp.edit",
            data: {
              admissionOf: self.inHospInfo.admissionOf,
              admissionOfName: self.inHospInfo.admissionOfName,
              changeUser: Vue.getUser().userName,
              checkUser: self.inHospInfo.checkUser,
              statusId: 1,
              remark: self.inHospInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success(
                  "入院情况信息" + self.editTitle + "成功！"
                );
                //刷新页面
                self.getInHospList();
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
        } else {
          setTimeout(() => {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          }, 0);
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
        if (
          this.currentSort.column == "admissionOf" ||
          this.currentSort.column == "statusId"
        ) {
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
    }
  }
};
</script>
<style scoped>
.ivu-tooltip-inner {
  white-space: normal;
}
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