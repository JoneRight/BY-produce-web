<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">药品统一规格</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="药品统一规格名称" :label-width="130">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入药品统一规格名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryUnifiedSpecAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryUnifiedSpecQuery'" :columnConfig='drugUnifiedSpecCol' :columnDatas='drugUnifiedSpecList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in drugUnifiedSpecCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{drugUnifiedSpecCol.find(m=>m.name==col.name).render?drugUnifiedSpecCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                           <Button v-authorize="'DictionaryUnifiedSpecReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='drugUnifiedSpecInfo = Object.assign({},item);drugUnifiedSpecOk(2);'></Button>
                            <Button v-authorize="'DictionaryUnifiedSpecReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassModel = true; drugUnifiedSpecInfo = Object.assign({},item);getAuditList();'></Button>
                            <Button v-authorize="'DictionaryUnifiedSpecIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='pubConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryUnifiedSpecState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" 
                                    :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" 
                                    :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryUnifiedSpecEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green"  @click='$refs["drugUnifiedSpecForm"].resetFields();editModel = true; drugUnifiedSpecInfo = Object.assign({},item);'></Button>
                            <Button v-authorize="'DictionaryUnifiedSpecDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteConfirm(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="drugUnifiedSpecList.length>0">            
                        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                        <Button type="text" class="fr" @click="showModal=true">
                            <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                            <span style="font-size:13px;"> 设置显示列</span>
                        </Button>
                    </div>
                </div>
            </div>



            <!-- 新增弹框 -->
            <Modal v-model="addModel" title="新增" class-name="vertical-center-modal" @on-ok="addOk" :loading="loadingAdd">
                
                <Form :model="drugUnifiedSpecForm" ref="drugUnifiedSpecFormAdd"  :rules="ruleValidate" :label-width="90">
                    
                    <FormItem label="药品统一规格名称" prop="drugUnifiedspecName">
                        <Input v-model.trim="drugUnifiedSpecForm.drugUnifiedspecName" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="规格数量">
                        <Input v-model.trim="drugUnifiedSpecForm.specNumber" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="规格单位" >
                        <Select v-model="drugUnifiedSpecForm.specUnit">
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="容量数量" >
                        <Input v-model.trim="drugUnifiedSpecForm.capacityNumber" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="容量单位" >
                        <Select v-model="drugUnifiedSpecForm.capacityUnit">
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="drugUnifiedSpecForm.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
                </Form>
            </Modal>

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editDrugUnifiedSpecInfo" :loading="loading" >
            <Form ref="drugUnifiedSpecForm" :model="drugUnifiedSpecInfo" :rules="ruleValidate" :label-width="90">
                <input type="hidden" v-model="drugUnifiedSpecInfo.drugUnifiedspecCode"/>
                <FormItem label="药品统一规格名称" prop="drugUnifiedspecName">
                    <Input v-model.trim="drugUnifiedSpecInfo.drugUnifiedspecName" :maxlength="20"/>
                </FormItem>
                <FormItem label="规格数量">
                        <Input v-model.trim="drugUnifiedSpecInfo.specNumber" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="规格单位" >
                        <Select v-model="drugUnifiedSpecInfo.specUnit">
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="容量数量" >
                        <Input v-model.trim="drugUnifiedSpecInfo.capacityNumber" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="容量单位" >
                        <Select v-model="drugUnifiedSpecInfo.capacityUnit">
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                <FormItem label="备注">
                    <Input v-model.trim="drugUnifiedSpecInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                </FormItem>
            </Form> 
        </Modal>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugUnifiedSpecOk(3)">
            <Form :model="drugUnifiedSpecInfo" :label-width="90">
                <input type="hidden" v-model="drugUnifiedSpecInfo.drugUnifiedspecCode"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugUnifiedSpecInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugUnifiedSpecInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "drugUnifiedSpec",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugUnifiedSpecForm: {
        drugUnifiedspecCode: "",
        drugUnifiedspecName: "",
        specNumber: "",
        specUnit: "",
        capacityNumber: "",
        capacityUnit: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      drugUnifiedSpecInfo: {},
      drugUnifiedSpecList: [],
      unitList: [],
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
      loadingAdd: true,
      loading: true,
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      noPassModel: false, //弹框状态(不通过)
      checkNoReasonList: [],
      ruleValidate: {
        drugUnifiedspecName: [
          {
            required: true,
            message: "药品统一规格名称不能为空",
            trigger: "blur"
          }
        ]
      },
      drugUnifiedSpecCol: [
        {
          text: "药品统一规格编码",
          name: "drugUnifiedspecCode",
          sortable: true,
          moveable: true,
          width: 160
        },
        {
          text: "药品统一规格名称",
          name: "drugUnifiedspecName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "规格数量",
          name: "specNumber",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "规格单位",
          name: "specUnitName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "容量数量",
          name: "capacityNumber",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "容量单位",
          name: "capacityUnitName",
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
            return "";
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
          width: 180
        }
      ]
    };
  },
  mounted: function() {
    this.getDrugUnifiedSpecList();
    //获取计量单位
    this.getUnitList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A24",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugUnifiedSpecInfo.checkNoReason =
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
    getUnitList() {
      var self = this;
      Vue.ajax.send({
        name: "unit.list",
        data: {
          pageIndex: 1,
          pageSize: 999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.unitList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getDrugUnifiedSpecList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugUnifiedSpec.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          drugUnifiedspecName: self.searchForm.keywords,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugUnifiedSpecList = data.data.dataList;
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
      this.getDrugUnifiedSpecList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugUnifiedSpecList();
    },
    addModal() {
      this.$refs["drugUnifiedSpecFormAdd"].resetFields();
      this.addModel = true;
    },
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.drugUnifiedspecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugUnifiedSpec.del",
            data: {
              drugUnifiedspecCode: item.drugUnifiedspecCode,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品统一规格信息删除成功");
                self.getDrugUnifiedSpecList();
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
            ? "确定要启用“" + item.drugUnifiedspecName + "”？"
            : "确定要停用“" + item.drugUnifiedspecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugUnifiedSpec.review",
            data: {
              drugUnifiedspecCode: item.drugUnifiedspecCode,
              changeUser: item.changeUser,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("药品统一规格信息启用成功")
                  : self.$Message.info("药品统一规格信息停用成功");
                self.getDrugUnifiedSpecList();
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
        content: "确定要发布“" + item.drugUnifiedspecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugUnifiedSpec.review",
            data: {
              drugUnifiedspecCode: item.drugUnifiedspecCode,
              changeUser: Vue.getUser().userName,
              statusId: "4"
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品统一规格信息发布成功");
                self.getDrugUnifiedSpecList();
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
    addOk() {
      this.$refs["drugUnifiedSpecFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugUnifiedSpec.add",
            data: {
              drugUnifiedspecName: self.drugUnifiedSpecForm.drugUnifiedspecName,
              specNumber: self.drugUnifiedSpecForm.specNumber,
              specUnit: self.drugUnifiedSpecForm.specUnit,
              capacityNumber: self.drugUnifiedSpecForm.capacityNumber,
              capacityUnit: self.drugUnifiedSpecForm.capacityUnit,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.drugUnifiedSpecForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["drugUnifiedSpecFormAdd"].resetFields();
                self.$Message.success("新增药品统一规格提交成功！");

                self.drugUnifiedSpecForm.remark = "";
                self.getDrugUnifiedSpecList();
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
    editDrugUnifiedSpecInfo() {
      this.$refs["drugUnifiedSpecForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugUnifiedSpec.edit",
            data: {
              drugUnifiedspecCode: self.drugUnifiedSpecInfo.drugUnifiedspecCode,
              drugUnifiedspecName: self.drugUnifiedSpecInfo.drugUnifiedspecName,
              specNumber: self.drugUnifiedSpecInfo.specNumber,
              specUnit: self.drugUnifiedSpecInfo.specUnit,
              capacityNumber: self.drugUnifiedSpecInfo.capacityNumber,
              capacityUnit: self.drugUnifiedSpecInfo.capacityUnit,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.drugUnifiedSpecInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("药品统一规格编辑成功！");
                self.getDrugUnifiedSpecList();
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
    drugUnifiedSpecOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugUnifiedSpec.review",
        data: {
          drugUnifiedspecCode: self.drugUnifiedSpecInfo.drugUnifiedspecCode,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason:
            value == 2 ? "" : self.drugUnifiedSpecInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.drugUnifiedSpecInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("药品统一规格通过信息提交成功！")
              : self.$Message.success("药品统一规格不通过信息提交成功！");
            self.getDrugUnifiedSpecList();
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