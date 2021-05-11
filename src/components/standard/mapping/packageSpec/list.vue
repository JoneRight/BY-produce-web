<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">包装规格</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="包装规格名称" :label-width="120">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入包装规格名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedPackageSpecAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
                
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedPackageSpecList'" :columnConfig='packageSpecCol' :columnDatas='packageSpecList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in packageSpecCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{packageSpecCol.find(m=>m.name==col.name).render?packageSpecCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedPackageSpecAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='packageSpecInfo = Object.assign({},item); packageSpecOk(2);'></Button>
                  <Button v-authorize="'MappedPackageSpecAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;packageSpecInfo = Object.assign({},item); getAuditList();'></Button>
                  <Button v-authorize="'MappedPackageSpecEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true; packageSpecInfo = Object.assign({},item); editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  
                  <Button v-authorize="'MappedPackageSpecIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedPackageSpecState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedPackageSpecDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 

            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="packageSpecList.length>0">            
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
                
                <Form :model="packageSpecForm" ref="packageSpecFormAdd" :rules="ruleValidate" :label-width="80">
                    
                    <FormItem label="包装规格名称" prop="packageSpecName">
                        <Input v-model.trim="packageSpecForm.packageSpecName"  />
                    </FormItem>
                    <FormItem label="包装材料"  prop="materialId">
                        <Select  v-model="packageSpecForm.materialId" filterable clearable  @on-change="getUnitList">
                            <Option v-for="item in packageMaterialList" :value="item.materialId" :key="item.materialId">{{ item.materialName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="最小制剂单位"  prop="minPreparationUnit">
                        <Select   v-model="packageSpecForm.minPreparationUnit" filterable clearable>
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="最小销售单位"  prop="minSaleUnit">
                        <Select  v-model="packageSpecForm.minSaleUnit" filterable clearable >
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input v-model.trim="packageSpecForm.remark" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" 
        @on-ok="editPackageSpecInfo" :loading="loading">
            <Form ref="packageSpecForm" :model="packageSpecInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="packageSpecInfo.packageSpec"/>
                    <FormItem label="包装规格名称" prop="packageSpecName">
                        <Input v-model.trim="packageSpecInfo.packageSpecName"/>
                    </FormItem>
                    <FormItem label="包装材料"  >
                        <Select  v-model="packageSpecInfo.materialId" filterable clearable  @on-change="getUnitList">
                            <Option v-for="item in packageMaterialList" :value="item.materialId" :key="item.materialId">{{ item.materialName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="最小制剂单位"  >
                        <Select   v-model="packageSpecInfo.minPreparationUnit" filterable clearable >
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="最小销售单位"  >
                        <Select  v-model="packageSpecInfo.minSaleUnit" filterable clearable >
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="packageSpecInfo.remark" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal>     

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="packageSpecOk(3)">
            <Form :model="packageSpecInfo" :label-width="90">
                <input type="hidden" v-model="packageSpecInfo.packageSpec"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="packageSpecInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="packageSpecInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "packageSpecCol",
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
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      packageSpecForm: {
        packageSpec: "",
        packageSpecName: "",
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
      packageSpecList: [],
      packageMaterialList: [],
      unitList: [],
      packageSpecInfo: {},
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      checkNoReasonList: [],
      noPassModel: false,
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        packageSpecName: [
          { required: true, message: "药品规格名称不能为空", trigger: "blur" }
        ]
      },
      packageSpecCol: [
        {
          text: "包装规格编码",
          name: "packageSpec",
          sortable: true,
          moveable: true,
          width: 160
        },
        {
          text: "包装规格名称",
          name: "packageSpecName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "最小制剂单位",
          name: "minPreparationUnitName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "最小销售单位",
          name: "minSaleUnitName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "包装材料",
          name: "materialName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 150,
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
    this.getPackageMaterialList();
    this.getUnitList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A38",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.packageSpecInfo.checkNoReason =
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
    getPackageMaterialList() {
      //包装材料
      var self = this;
      Vue.ajax.send({
        name: "drugPackageMaterial.list",
        data: {
          pageIndex: 1,
          pageSize: 999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.packageMaterialList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getUnitList() {
      //最小制剂单位是片，粒等
      //最小销售单位是盒，瓶等
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
    getSpecList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "packageSpec.list",
        data: {
          packageSpecName: self.searchForm.keywords,
          pageIndex: self.pageConfig.pageNum || pageIndex,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.packageSpecList = data.data.dataList;
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
      this.$refs["packageSpecFormAdd"].resetFields();
      this.packageSpecForm.remark = "";
      this.addModel = true;
    },
    pubConfirm(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.packageSpecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "packageSpec.review",
            data: {
              packageSpec: item.packageSpec,
              statusId: 4
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("包装规格信息发布成功");
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
            ? "确定要启用“" + item.packageSpecName + "”？"
            : "确定要停用“" + item.packageSpecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "packageSpec.review",
            data: {
              packageSpec: item.packageSpec,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("包装规格信息启用成功")
                  : self.$Message.info("包装规格信息停用成功");
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
        content: "确定要删除“" + item.packageSpecName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "packageSpec.del",
            data: {
              packageSpec: item.packageSpec
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("包装规格信息删除成功");
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
      this.$refs["packageSpecFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "packageSpec.add",
            data: {
              packageSpecName: self.packageSpecForm.packageSpecName,
              minPreparationUnit: self.packageSpecForm.minPreparationUnit,
              minSaleUnit: self.packageSpecForm.minSaleUnit,
              materialId: self.packageSpecForm.materialId,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.packageSpecForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;

                self.$Message.success("新增包装规格提交成功！");
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
    editPackageSpecInfo() {
      this.$refs["packageSpecForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "packageSpec.edit",
            data: {
              packageSpec: self.packageSpecInfo.packageSpec,
              packageSpecName: self.packageSpecInfo.packageSpecName,
              minPreparationUnit: self.packageSpecInfo.minPreparationUnit,
              minSaleUnit: self.packageSpecInfo.minSaleUnit,
              materialId: self.packageSpecInfo.materialId,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.packageSpecInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("规格信息编辑成功！");
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
    packageSpecOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "packageSpec.review",
        data: {
          packageSpec: self.packageSpecInfo.packageSpec,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.packageSpecInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.packageSpecInfo.checkNoReasonMemo
        },
        success: function(data) {
          setTimeout(() => {
            self.loading = false;
            self.$nextTick(() => {
              self.loading = true;
            });
          }, 0);
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("包装规格通过信息提交成功！")
              : self.$Message.success("包装规格不通过信息提交成功！");
            //刷新页面
            self.getSpecList();
          } else {
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
        if (
          this.currentSort.column == "minPreparationUnit" ||
          this.currentSort.column == "minSaleUnit" ||
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

