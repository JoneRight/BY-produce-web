<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">手术</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="手术名称" :label-width="70">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入手术名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedOperationAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedOperationList'" :columnConfig='operationCol' :columnDatas='operationList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in operationCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{operationCol.find(m=>m.name==col.name).render?operationCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedOperationAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='operationInfo = Object.assign({},item);operationOk(2);'></Button>
                  <Button v-authorize="'MappedOperationAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;operationInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedOperationEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;operationInfo = Object.assign({},item);'></Button>
                  
                  <Button v-authorize="'MappedOperationIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedOperationState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedOperationDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="operationList.length>0">            
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
                
                <Form :model="operationForm" ref="operationFormAdd" :rules="ruleValidate" :label-width="100">
                    <FormItem label="父级手术" >
                        <Select v-model="operationForm.superiorOperation" >
                            <OptionGroup label="0级手术名称">
                                <Option value="-">-</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="手术名称编号" prop="operation">
                        <Input v-model.trim="operationForm.operation" :maxlength="20" />
                    </FormItem>
                    <FormItem label="手术名称" prop="operationName">
                        <Input v-model.trim="operationForm.operationName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="手术别名">
                        <Input v-model.trim="operationForm.operationAb" :maxlength="60" />
                    </FormItem>
                    <FormItem label="手术关键字">
                        <Select v-model="operationForm.keywordIdList" filterable multiple clearable>
                            <Option v-for="item in keywordsList" :value="item.keywordId" :key="item.keywordId">{{ item.keyword }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否手术名称" prop="isOperationName">
                        <Select v-model="operationForm.isOperationName">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="operationForm.remark"  :maxlength="60"  :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal"  
        @on-ok="editOperationInfo" :loading="loading" >
            <Form ref="operationForm" :model="operationInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="operationInfo.operation"/>
                    <FormItem label="父级手术" >
                        <Select v-model="operationInfo.superiorOperation" >
                            <OptionGroup label="0级手术名称">
                                <Option  value="-" key="-">{{ "-"}}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="手术名称" prop="operationName">
                        <Input v-model.trim="operationInfo.operationName"  :maxlength="60" />
                    </FormItem>
                    <FormItem label="手术别名">
                        <Input v-model.trim="operationInfo.operationAb" :maxlength="60" />
                    </FormItem>
                    <FormItem label="手术关键字">
                        <Select v-model="operationInfo.keywordIdList" filterable multiple clearable>
                            <Option v-for="item in keywordsList" :value="item.keywordId" :key="item.keywordId">{{ item.keyword }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否手术名称" prop="isOperationName">
                        <Select v-model="operationInfo.isOperationName">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="operationInfo.remark"  :maxlength="60"  type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal>       
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="operationOk(3)">
            <Form :model="operationInfo" :label-width="90">
                <input type="hidden" v-model="operationInfo.operation"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="operationInfo.checkNoReason" class="cellLength" filterable>
                    <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="operationInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "operation",
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
      operationForm: {
        operationName: "",
        operation: "",
        operationAb: "",
        superiorOperation: "",
        keywordIdList: [],
        remark: "",
        isOperationName: "",
        ssm: "",
        zm: "",
        djs: ""
      },
      loadingAdd: true,
      loading: true,
      operationList: [],
      keywordsList: [],
      operationInfo: {},
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
        operation: [
          { required: true, message: "手术编号不能为空", trigger: "blur" }
        ],
        operationName: [
          { required: true, message: "手术名称不能为空", trigger: "blur" }
        ],
        isOperationName: [
          {
            required: true,
            message: "请选择是否手术名称",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      operationCol: [
        {
          text: "手术编号",
          name: "operation",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "手术名称",
          name: "operationName",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "手术别名",
          name: "operationAb",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "父级手术编码",
          name: "superiorOperation",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "数据等级",
          name: "dataLevel",
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
          text: "SSM",
          name: "ssm",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "ZM",
          name: "zm",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "DJS",
          name: "djs",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "关键字ID",
          name: "keywords",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "关键字名称",
          name: "keywordsName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "是否手术名称",
          name: "isOperationName",
          sortable: true,
          moveable: true,
          width: 150,
          render: params => {
            if (params.isOperationName == 0) {
              return "否";
            } else if (params.isOperationName == 1) {
              return "是";
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
    this.getOperationList();
    this.getKeywordsList();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该手术下存在子级，请先删除子级手术!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.operationName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "operation.del",
              data: {
                operation: item.operation
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("手术信息删除成功");
                  self.getOperationList();
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
      }
    },
    openConfirm(item) {
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.operationName + "”？"
            : "确定要停用“" + item.operationName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "operation.review",
            data: {
              operation: item.operation,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("手术信息启用成功")
                  : self.$Message.info("手术信息停用成功");
                self.getOperationList();
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
        content: "确定要发布“" + item.operationName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "operation.review",
            data: {
              operation: item.operation,
              statusId: 4,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("手术信息发布成功");
                self.getOperationList();
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
          reasonTypeId: "A37",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.operationInfo.checkNoReason =
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
    getKeywordsList() {
      var self = this;
      Vue.ajax.send({
        name: "operation.keywordList",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.keywordsList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getOperationList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "operation.list",
        data: {
          operationName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.operationList = data.data.dataList;
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
      this.getOperationList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getOperationList();
    },
    addModal() {
      this.$refs["operationFormAdd"].resetFields();
      this.operationForm.operationName = "";
      this.operationForm.operationAb = "";
      this.operationForm.isOperationName = "";
      this.operationForm.keywordIdList = "";
      this.operationForm.remark = "";
      this.operationForm.superiorOperation = "";
      this.addModel = true;
    },
    addOk() {
      this.$refs["operationFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "operation.add",
            data: {
              operation: self.operationForm.operation,
              operationName: self.operationForm.operationName,
              operationAb: self.operationForm.operationAb,
              keywords: self.operationForm.keywordIdList,
              superiorOperation: "-",
              isOperationName: self.operationForm.isOperationName,
              dataLevel: 1,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.operationForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["operationFormAdd"].resetFields();
                self.$Message.success("新增手术名称提交成功！");

                self.getOperationList();
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
    operationOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "operation.review",
        data: {
          operation: self.operationInfo.operation,
          statusId: value,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          checkNoReason: value == 2 ? "" : self.operationInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.operationInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            value == 2 ? (self.editModel = false) : (self.noPassModel = false);

            value == 2
              ? self.$Message.success("手术通过信息提交成功！")
              : self.$Message.success("手术不通过信息提交成功！");

            self.getOperationList();
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
    editOperationInfo() {
      this.$refs["operationForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "operation.edit",
            data: {
              operation: self.operationInfo.operation,
              operationName: self.operationInfo.operationName,
              operationAb: self.operationInfo.operationAb,
              keywords: self.operationInfo.keywordIdList,
              superiorOperation: self.operationInfo.superiorOperation,
              isOperationName: self.operationInfo.isOperationName,
              dataLevel: 1,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.operationInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("手术信息编辑成功！");

                self.getOperationList();
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
          this.currentSort.column == "dataLevel" ||
          this.currentSort.column == "statusId" ||
          this.currentSort.column == "isOperationName"
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