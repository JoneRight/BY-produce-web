<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">治疗结果</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="治疗结果名称" :label-width="100">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入治疗结果名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedCureResultAdd'" type="primary"  @click="addModel = true">新增</Button>
		        </FormItem>
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedCureResultList'" :columnConfig='cureCol' :columnDatas='cureList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in cureCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{cureCol.find(m=>m.name==col.name).render?cureCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedCureResultAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='cureInfo = Object.assign({},item);cureOk(2);'></Button>
                  <Button v-authorize="'MappedCureResultAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;cureInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedCureResultEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;cureInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  
                  <Button v-authorize="'MappedCureResultIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedCureResultState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedCureResultDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
  

            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="cureList.length>0">            
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
                
                <Form :model="cureForm" ref="cureFormAdd" :rules="ruleValidate" :label-width="110">
                     <FormItem label="治疗结果编码" prop="treatmentResult">
                        <Input v-model.trim="cureForm.treatmentResult" :maxlength="9" />
                    </FormItem>
                    <FormItem label="治疗结果名称" prop="treatmentResultName">
                        <Input v-model.trim="cureForm.treatmentResultName" :maxlength="15" />
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="cureForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel"  :title="editTitle" class-name="vertical-center-modal" @on-ok="editCureInfo" :loading="loading">
            <Form ref="cureForm" :model="cureInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="cureInfo.treatmentResult"/>
                    <FormItem label="治疗结果名称" prop="treatmentResultName">
                        <Input v-model.trim="cureInfo.treatmentResultName" :maxlength="15"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="cureInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>      
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="cureOk(3)">
            <Form :model="cureInfo" :label-width="90">
                <input type="hidden" v-model="cureInfo.treatmentResult"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="cureInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="cureInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "cure",
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
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      cureForm: {
        treatmentResult: "",
        treatmentResultName: "",
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
      cureList: [],
      cureInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      commonId: "", //存放id
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        treatmentResult: [
          { required: true, message: "治疗结果编码不能为空", trigger: "blur" },
          { validator: validateNumber }
        ],
        treatmentResultName: [
          { required: true, message: "治疗结果名称不能为空", trigger: "blur" }
        ]
      },
      cureCol: [
        {
          text: "治疗结果编码",
          name: "treatmentResult",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "治疗结果名称",
          name: "treatmentResultName",
          sortable: true,
          moveable: true,
          width: 160
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 90,
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
          }
        },
        {
          text: "创建人",
          name: "createUser",
          sortable: true,
          moveable: true,
          width: 100
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
          width: 150,
          filterable: false,
          removeable: false
        }
      ]
    };
  },
  mounted: function() {
    this.getCureList();
  },
  methods: {
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.treatmentResultName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "cure.del",
            data: {
              treatmentResult: item.treatmentResult,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("治疗结果信息删除成功");
                self.getCureList();
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
    openConfirm(item) {
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.treatmentResultName + "”？"
            : "确定要停用“" + item.treatmentResultName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "cure.review",
            data: {
              treatmentResult: item.treatmentResult,
              treatmentResultName: item.treatmentResultName,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("治疗结果信息启用成功")
                  : self.$Message.info("治疗结果信息停用成功");
                self.getCureList();
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
        content: "确定要发布“" + item.treatmentResultName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "cure.review",
            data: {
              treatmentResult: item.treatmentResult,
              treatmentResultName: item.treatmentResultName,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("治疗结果信息发布成功");
                self.getCureList();
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
          reasonTypeId: "A13",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.cureInfo.checkNoReason =
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
    getCureList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "cure.list",
        data: {
          treatmentResultName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.cureList = data.data.dataList;
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
      this.getCureList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getCureList();
    },
    addOk() {
      this.$refs["cureFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "cure.add",
            data: {
              treatmentResult: self.cureForm.treatmentResult,
              treatmentResultName: self.cureForm.treatmentResultName,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.cureForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["cureFormAdd"].resetFields();
                self.$Message.success("新增治疗结果提交成功！");

                self.cureForm.remark = "";
                self.getCureList();
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
    cureOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "cure.review",
        data: {
          treatmentResult: self.cureInfo.treatmentResult,
          treatmentResultName: self.cureInfo.treatmentResultName,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.cureInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? "" : self.cureInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;
            value == 2
              ? self.$Message.success("治疗结果通过信息提交成功！")
              : self.$Message.success("治疗结果不通过信息提交成功！");
            self.getCureList();
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
    editCureInfo() {
      this.$refs["cureForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "cure.edit",
            data: {
              treatmentResult: self.cureInfo.treatmentResult,
              treatmentResultName: self.cureInfo.treatmentResultName,
              changeUser: Vue.getUser().userName,
              checkUser: self.cureInfo.checkUser,
              statusId: 1,
              remark: self.cureInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success(
                  "治疗结果信息" + self.editTitle + "成功！"
                );
                self.getCureList();
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
          this.currentSort.column == "treatmentResult" ||
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