<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">盐酸根</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="盐酸根名称" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入盐酸根名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryDrugSaltAcidAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryDrugSaltAcidQuery'" :columnConfig='drugSaltAcidCol' :columnDatas='drugSaltAcidList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in drugSaltAcidCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{drugSaltAcidCol.find(m=>m.name==col.name).render?drugSaltAcidCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                           <Button v-authorize="'DictionaryDrugSaltAcidReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='drugSaltAcidInfo = Object.assign({},item);drugSaltAcidOk(2);'></Button>
                            <Button v-authorize="'DictionaryDrugSaltAcidReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassModel = true; drugSaltAcidInfo = Object.assign({},item);getAuditList();'></Button>
                            <Button v-authorize="'DictionaryDrugSaltAcidIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='pubConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryDrugSaltAcidState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" 
                                    :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" 
                                    :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryDrugSaltAcidEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green"  @click='$refs["drugSaltAcidForm"].resetFields();editModel = true; drugSaltAcidInfo = Object.assign({},item);'></Button>
                            <Button v-authorize="'DictionaryDrugSaltAcidDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteConfirm(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="drugSaltAcidList.length>0">            
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
                
                <Form :model="drugSaltAcidForm" ref="drugSaltAcidFormAdd"  :rules="ruleValidate" :label-width="90">
                    <FormItem label="编号" prop="saltAcidCode">
                        <Input v-model.trim="drugSaltAcidForm.saltAcidCode" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="盐酸根名称" prop="saltAcidName">
                        <Input v-model.trim="drugSaltAcidForm.saltAcidName" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="drugSaltAcidForm.remark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>

                </Form>
            </Modal>

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editSaltAcidInfo" :loading="loading" >
            <Form ref="drugSaltAcidForm" :model="drugSaltAcidInfo" :rules="ruleValidate" :label-width="90">
                    <input type="hidden" v-model="drugSaltAcidInfo.saltAcidCode"/>
                    <FormItem label="盐酸根名称" prop="saltAcidName">
                        <Input v-model.trim="drugSaltAcidInfo.saltAcidName" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="drugSaltAcidInfo.remark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
            </Form> 
        </Modal>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugSaltAcidOk(3)">
            <Form :model="drugSaltAcidInfo" :label-width="90">
                <input type="hidden" v-model="drugSaltAcidInfo.saltAcidCode"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugSaltAcidInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugSaltAcidInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "drugSaltAcid",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugSaltAcidForm: {
        saltAcidCode: "",
        saltAcidName: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      drugSaltAcidInfo: {},
      drugSaltAcidList: [],
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
        saltAcidCode: [
          { required: true, message: "盐酸根Id不能为空", trigger: "blur" }
        ],
        saltAcidName: [
          { required: true, message: "盐酸根名称不能为空", trigger: "blur" }
        ]
      },
      drugSaltAcidCol: [
        {
          text: "盐酸根Id",
          name: "saltAcidCode",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "盐酸根名称",
          name: "saltAcidName",
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
    this.getDrugSaltAcidList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A21",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugSaltAcidInfo.checkNoReason =
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
    getDrugSaltAcidList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugSaltAcid.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          saltAcidName: self.searchForm.keywords,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugSaltAcidList = data.data.dataList;
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
      this.getDrugSaltAcidList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugSaltAcidList();
    },
    addModal() {
      this.$refs["drugSaltAcidFormAdd"].resetFields();
      this.addModel = true;
    },
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.saltAcidName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugSaltAcid.del",
            data: {
              saltAcidCode: item.saltAcidCode,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("盐酸根信息删除成功");
                self.getDrugSaltAcidList();
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
            ? "确定要启用“" + item.saltAcidName + "”？"
            : "确定要停用“" + item.saltAcidName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugSaltAcid.review",
            data: {
              saltAcidCode: item.saltAcidCode,
              changeUser: item.changeUser,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("盐酸根信息启用成功")
                  : self.$Message.info("盐酸根信息停用成功");
                self.getDrugSaltAcidList();
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
        content: "确定要发布“" + item.saltAcidName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugSaltAcid.review",
            data: {
              saltAcidCode: item.saltAcidCode,
              changeUser: Vue.getUser().userName,
              statusId: "4"
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("盐酸根信息发布成功");
                self.getDrugSaltAcidList();
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
      this.$refs["drugSaltAcidFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugSaltAcid.add",
            data: {
              saltAcidCode: self.drugSaltAcidForm.saltAcidCode,
              saltAcidName: self.drugSaltAcidForm.saltAcidName,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.drugSaltAcidForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["drugSaltAcidFormAdd"].resetFields();
                self.$Message.success("新增盐酸根提交成功！");

                self.drugSaltAcidForm.remark = "";
                self.getDrugSaltAcidList();
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
    editSaltAcidInfo() {
      this.$refs["drugSaltAcidForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugSaltAcid.edit",
            data: {
              saltAcidCode: self.drugSaltAcidInfo.saltAcidCode,
              saltAcidName: self.drugSaltAcidInfo.saltAcidName,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.drugSaltAcidInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("盐酸根编辑成功！");
                self.getDrugSaltAcidList();
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
    drugSaltAcidOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugSaltAcid.review",
        data: {
          saltAcidCode: self.drugSaltAcidInfo.saltAcidCode,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.drugSaltAcidInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.drugSaltAcidInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("盐酸根通过信息提交成功！")
              : self.$Message.success("盐酸根不通过信息提交成功！");
            self.getDrugSaltAcidList();
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
    // add() {
    //     this.$router.push({
    //          path: "/standard/dictionary/drugSaltAcid/add"
    //     });
    // },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (
          this.currentSort.column == "dataLevel" ||
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