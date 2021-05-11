<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">规格</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="规格名称" :label-width="90">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入规格名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedSpecAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedSpecList'" :columnConfig='specCol' :columnDatas='specList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in specCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{specCol.find(m=>m.name==col.name).render?specCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedSpecAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='specInfo = Object.assign({},item);specOk(2);'></Button>
                  <Button v-authorize="'MappedSpecAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;specInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedSpecEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editItem(item)'></Button>
                  
                  <Button v-authorize="'MappedSpecIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedSpecState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedSpecDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 

            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="specList.length>0">            
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
                
                <Form :model="specForm" ref="specFormAdd" :rules="ruleValidate" :label-width="80">
                    
                    <FormItem label="药品规格名称" prop="drugSpecName">
                        <Input v-model.trim="specForm.drugSpecName" :maxlength="150" />
                    </FormItem>
                    <FormItem label="药品统一规格">
                        <Select  v-model="specForm.drugUnifiedspecCode" filterable  remote :remote-method="getDrugUnifiedSpecList" >
                            <Option v-for="item in unifiedSpecList" :value="item.drugUnifiedspecCode" :key="item.drugUnifiedspecCode">{{ item.drugUnifiedspecName }}</Option>
                        </Select>
                    </FormItem>
                    <!-- <FormItem label="药品统一规格">
                        <Input v-model.trim="specForm.drugUnifiedspecName" :maxlength="150" />
                    </FormItem>
                    <FormItem label="规格数量" >
                        <Input v-model.trim="specForm.specNumber" :maxlength="9" />
                    </FormItem>
                    <FormItem label="规格单位" >
                        <Input v-model.trim="specForm.specUnit" :maxlength="50" />
                    </FormItem>
                    <FormItem label="容量数量" >
                        <Input v-model.trim="specForm.capacityNumber" :maxlength="9" />
                    </FormItem>
                    <FormItem label="容量单位" >
                        <Input v-model.trim="specForm.capacityUnit" :maxlength="50" />
                    </FormItem> -->
                    <FormItem label="备注" >
                        <Input v-model.trim="specForm.remark" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" 
                @on-ok="editSpecInfo" :loading="loading">
            <Form ref="specForm" :model="specInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="specInfo.drugSpecCode"/>
                    <FormItem label="药品规格名称" prop="drugSpecName">
                        <Input v-model.trim="specInfo.drugSpecName" :maxlength="150" />
                    </FormItem>
                    <FormItem label="药品统一规格">
                        <Select  v-model="specInfo.drugUnifiedspecCode" filterable  remote :remote-method="getDrugUnifiedSpecList" >
                            <Option v-for="item in unifiedSpecList" :value="item.drugUnifiedspecCode" :key="item.drugUnifiedspecCode">{{ item.drugUnifiedspecName }}</Option>
                        </Select>
                    </FormItem>
                    <!-- <FormItem label="规格数量" >
                        <Input v-model.trim="specInfo.specNumber" :maxlength="9" />
                    </FormItem>
                    <FormItem label="规格单位" >
                        <Input v-model.trim="specInfo.specUnit" :maxlength="50" />
                    </FormItem>
                    <FormItem label="容量数量" >
                        <Input v-model.trim="specInfo.capacityNumber" :maxlength="9" />
                    </FormItem>
                    <FormItem label="容量单位" >
                        <Input v-model.trim="specInfo.capacityUnit" :maxlength="50" />
                    </FormItem> -->
                    <FormItem label="备注">
                        <Input v-model.trim="specInfo.remark" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal>     

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="specOk(3)">
            <Form :model="specInfo" :label-width="90">
                <input type="hidden" v-model="specInfo.spec"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="specInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="specInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "spec",
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
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      searchForm:{
          keywords: "",
          statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      specForm: {
        drugSpecCode: "",
        drugSpecName: "",
        drugUnifiedspecName: "",
        drugUnifiedspecCode: "",
        specNumber: "",
        capacityNumber: "",
        capacityUnit: "",
        specUnit: "",
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
      specList: [],
      unifiedSpecList: [],
      specInfo: {},
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      nopassReasonList: [],
      noPassModel: false,
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        drugSpecName: [
            { required: true, message: "药品规格名称不能为空", trigger: "blur" }
        ]
      },
      specCol: [
        {
          text: "编码",
          name: "drugSpecCode",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "药品规格名称",
          name: "drugSpecName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "药品统一规格",
          name: "drugUnifiedspecName",
          sortable: true,
          moveable: true,
          width: 150
        },
        // {
        //   text: "规格数量",
        //   name: "specNumber",
        //   sortable: true,
        //   moveable: true,
        //   width: 150
        // },
        // {
        //   text: "规格单位",
        //   name: "specUnit",
        //   sortable: true,
        //   moveable: true,
        //   width: 150
        // },
        // {
        //   text: "容量数量",
        //   name: "capacityNumber",
        //   sortable: true,
        //   moveable: true,
        //   width: 150
        // },
        // {
        //   text: "容量单位",
        //   name: "capacityUnit",
        //   sortable: true,
        //   moveable: true,
        //   width: 150
        // },
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
                            }else {
                                return '';
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
          filterable: false,
          removeable: false,
          width: 180
        }
       
      ]
    };
  },
  mounted: function() {
    this.getSpecList();
    //获取统一规格
    this.getDrugUnifiedSpecList('');
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A42",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
              self.checkNoReasonList = data.data.dataList;
              self.specInfo.checkNoReason = self.checkNoReasonList[0].dictionaryName;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getDrugUnifiedSpecList(query) {
                //药品统一规格
                var self = this;
                Vue.ajax.send({
                    name: "drugs.unifiedSpecSearchList",
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        drugUnifiedspecName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.unifiedSpecList = data.data;
                            
                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
    getSpecList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "spec.list",
        data: {
          drugSpecName: self.searchForm.keywords,
          pageIndex: self.pageConfig.pageNum || pageIndex,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.specList = data.data.dataList;
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
      this.getSpecList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getSpecList();
    },
    addModal() {
        this.$refs["specFormAdd"].resetFields();
        this.specForm.remark = "";
        this.specForm.specNumber = "";
        this.specForm.specUnit = "";
        this.specForm.capacityNumber = "";
        this.specForm.capacityUnit = "";
        this.addModel = true;

    },
    pubConfirm(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.drugSpecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "spec.review",
            data: {
              drugSpecCode: item.drugSpecCode,
              statusId: 4,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品规格信息发布成功");
                self.getSpecList();
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
            ? "确定要启用“" + item.drugSpecName + "”？"
            : "确定要停用“" + item.drugSpecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "spec.review",
            data: {
              drugSpecCode: item.drugSpecCode,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("药品规格信息启用成功")
                  : self.$Message.info("药品规格信息停用成功");
                self.getSpecList();
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
        content: "确定要删除“" + item.drugSpecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "spec.del",
            data: {
              drugSpecCode: item.drugSpecCode,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品规格信息删除成功");
                self.getSpecList();
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
      this.$refs["specFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "spec.add",
            data: {
              drugSpecName: self.specForm.drugSpecName,
              drugUnifiedspecCode: self.specForm.drugUnifiedspecCode,
              specNumber: self.specForm.specNumber,
              specUnit: self.specForm.specUnit,
              capacityNumber: self.specForm.capacityNumber,
              capacityUnit: self.specForm.capacityUnit,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.specForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["specFormAdd"].resetFields();

                self.specForm.remark = "";
                self.$Message.success("新增药品规格提交成功！");
                //刷新列表
                self.getSpecList();
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
    specOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "spec.review",
        data: {
          drugSpecCode: self.specInfo.drugSpecCode,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? '' : self.specInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? '' : self.specInfo.checkNoReasonMemo
        },
        success: function(data) {
          
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("药品规格通过信息提交成功！")
              : self.$Message.success("药品规格不通过信息提交成功！");
            //刷新页面
            self.getSpecList();
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
    editItem(item) {
      this.$refs["specForm"].resetFields();
      this.editModel = true;
      this.specInfo = Object.assign({}, item);
      this.editTitle = "编辑";
      this.okText = "确定";
      this.cancelText = "取消";
    },
    editSpecInfo() {
      this.$refs["specForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "spec.edit",
            data: {
              drugSpecCode: self.specInfo.drugSpecCode,
              drugSpecName: self.specInfo.drugSpecName,
              drugUnifiedspecCode: self.specInfo.drugUnifiedspecCode,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.specInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("药品规格信息编辑成功！");

                self.getSpecList();
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
        if (this.currentSort.column == "specNumber" || this.currentSort.column == "capacityNumber" || this.currentSort.column == "statusId") {
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
