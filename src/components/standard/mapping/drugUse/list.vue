<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">用法</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="用法名称" :label-width="80">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入用法名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedDrugUseAdd'" type="primary"  @click="addModel = true">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedDrugUseList'" :columnConfig='drugUsageCol' :columnDatas='drugUsageList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in drugUsageCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{drugUsageCol.find(m=>m.name==col.name).render?drugUsageCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedDrugUseAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='drugUsageInfo = Object.assign({},item);drugUsageOk(2);'></Button>
                  <Button v-authorize="'MappedDrugUseAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;drugUsageInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedDrugUseEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;drugUsageInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  <Button v-authorize="'MappedDrugUseIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedDrugUseState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedDrugUseDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>   
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="drugUsageList.length>0">            
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
                
                <Form :model="drugUsageForm" ref="drugUsageFormAdd" :rules="ruleValidate" :label-width="80">
                    <FormItem label="用法编号" prop="usage">
                        <Input v-model.trim="drugUsageForm.usage" :maxlength="9" />
                    </FormItem>
                    <FormItem label="用法名称" prop="usageName">
                        <Input v-model.trim="drugUsageForm.usageName" :maxlength="30" />
                    </FormItem>
                    <FormItem label="用法别名">
                        <Input v-model.trim="drugUsageForm.usageAb" :maxlength="30" />
                    </FormItem>
                    <FormItem label="用法数量">
                        <Input v-model.trim="drugUsageForm.usageQuantity" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="计时数量">
                        <Input v-model.trim="drugUsageForm.timingQuantity" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="计时单位">
                        <Input v-model.trim="drugUsageForm.timingUnit" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="drugUsageForm.remark" :maxlength="60"  :autosize="{minRows: 4,maxRows: 8}"  type="textarea" />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editDrugUsageInfo" :loading="loading">
            <Form ref="drugUsageForm" :model="drugUsageInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="drugUsageInfo.usage"/>
                    <FormItem label="用法名称" prop="usageName">
                        <Input v-model.trim="drugUsageInfo.usageName" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="用法别名">
                        <Input v-model.trim="drugUsageInfo.usageAb" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="用法数量">
                        <Input v-model.trim="drugUsageInfo.usageQuantity" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="计时数量">
                        <Input v-model.trim="drugUsageInfo.timingQuantity" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="计时单位">
                        <Input v-model.trim="drugUsageInfo.timingUnit" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="drugUsageInfo.remark" :maxlength="60"  type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugUsageOk(3)">
            <Form :model="drugUsageInfo" :label-width="90">
                <input type="hidden" v-model="drugUsageInfo.usage"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugUsageInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugUsageInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "drugUsage",
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
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugUsageForm: {
        usage: "",
        usageName: "",
        usageAb: "",
        usageQuantity: "",
        timingQuantity: "",
        timingUnit: "",
        statusId: "",
        createUsager: "",
        createTime: "",
        changeUsager: "",
        changeTime: "",
        checkUsager: "",
        checkTime: "",
        remark: ""
      },
      loadingAdd: true,
      loading: true,
      drugUsageList: [],
      drugUsageInfo: {},
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
        usage: [
          { required: true, message: "用法编号不能为空", trigger: "blur" }
        ],
        drugUsage: [
          { required: true, message: "用法不能为空", trigger: "blur" }
        ],
        usageName: [
          { required: true, message: "用法名称不能为空", trigger: "blur" }
        ]
      },
      drugUsageCol: [
        {
          text: "用法",
          name: "usage",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "用法名称",
          name: "usageName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "用法别名",
          name: "usageAb",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "用法数量",
          name: "usageQuantity",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "计时数量",
          name: "timingQuantity",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "计时单位",
          name: "timingUnit",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 100,
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
          width: 180,
          filterable: false,
          removeable: false
        }
      ]
    };
  },
  mounted: function() {
    this.getDrugUsageList();
  },
  methods: {
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.usageName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugUsage.del",
            data: {
              usage: item.usage,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("用法信息删除成功");
                self.getDrugUsageList();
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
            ? "确定要启用“" + item.usageName + "”？"
            : "确定要停用“" + item.usageName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugUsage.review",
            data: {
              usage: item.usage,
              usageName: item.usageName,
              usageAb: item.usageAb,
              usageQuantity: item.usageQuantity,
              timingQuantity: item.timingQuantity,
              timingUnit: item.timingUnit,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("用法信息启用成功")
                  : self.$Message.info("用法信息停用成功");
                self.getDrugUsageList();
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
        content: "确定要发布“" + item.usageName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugUsage.review",
            data: {
              usage: item.usage,
              usageName: item.usageName,
              usageAb: item.usageAb,
              usageQuantity: item.usageQuantity,
              timingQuantity: item.timingQuantity,
              timingUnit: item.timingUnit,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品用法信息发布成功");
                self.getDrugUsageList();
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
          reasonTypeId: "A11",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugUsageInfo.checkNoReason =
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
    getDrugUsageList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugUsage.list",
        data: {
          usageName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugUsageList = data.data.dataList;
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
      this.getDrugUsageList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugUsageList();
    },
    searchList() {
      this.pageConfig.totalItemCount = 1;
      if (this.searchForm.keywords != "") {
        this.getDrugUsageList();
      } else {
        this.$Modal.error({
          title: "消息提示",
          content: "请先填写检索条件"
        });
      }
    },
    addOk() {
      this.$refs["drugUsageFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugUsage.add",
            data: {
              usage: self.drugUsageForm.usage,
              usageName: self.drugUsageForm.usageName,
              usageAb: self.drugUsageForm.usageAb,
              usageQuantity: self.drugUsageForm.usageQuantity,
              timingQuantity: self.drugUsageForm.timingQuantity,
              timingUnit: self.drugUsageForm.timingUnit,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.drugUsageForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["drugUsageFormAdd"].resetFields();
                self.$Message.success("新增药品用法提交成功！");

                self.drugUsageForm.UsageAb = "";
                self.drugUsageForm.UsageQuantity = "";
                self.drugUsageForm.timingQuantity = "";
                self.drugUsageForm.timingUnit = "";
                self.drugUsageForm.remark = "";
                self.getDrugUsageList();
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
    drugUsageOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugUsage.review",
        data: {
          usage: self.drugUsageInfo.usage,
          usageName: self.drugUsageInfo.usageName,
          usageAb: self.drugUsageInfo.usageAb,
          usageQuantity: self.drugUsageInfo.usageQuantity,
          timingQuantity: self.drugUsageInfo.timingQuantity,
          timingUnit: self.drugUsageInfo.timingUnit,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.drugUsageInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.drugUsageInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;
            self.$refs["drugUsageForm"].resetFields();

            value == 2
              ? self.$Message.success("药品用法通过信息提交成功！")
              : self.$Message.success("药品用法不通过信息提交成功！");
            self.getDrugUsageList();
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
    editDrugUsageInfo() {
      this.$refs["drugUsageForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugUsage.edit",
            data: {
              usage: self.drugUsageInfo.usage,
              usageName: self.drugUsageInfo.usageName,
              usageAb: self.drugUsageInfo.usageAb,
              usageQuantity: self.drugUsageInfo.usageQuantity,
              timingQuantity: self.drugUsageInfo.timingQuantity,
              timingUnit: self.drugUsageInfo.timingUnit,
              changeUser: Vue.getUser().userName,
              checkUser: self.drugUsageInfo.checkUser,
              statusId: 1,
              remark: self.drugUsageInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$refs["drugUsageForm"].resetFields();
                self.$Message.success(
                  "药品用法信息" + self.editTitle + "成功！"
                );
                self.getDrugUsageList();
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
          this.currentSort.column == "usage" ||
          this.currentSort.column == "usageQuantity" ||
          this.currentSort.column == "timingQuantity" ||
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

