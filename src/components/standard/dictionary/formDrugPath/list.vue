<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">剂型给药途径</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="状态" :label-width="40">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="剂型" :label-width="40">
                        <Select v-model="searchForm.form" filterable clearable style="width: 160px;">
                            <Option v-for="item in formList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径" :label-width="70">
                        <Select v-model="searchForm.pathDrug" filterable clearable style="width: 160px;">
                            <Option  v-for="item in pathDrugList"  :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                        </Select>
                    </FormItem>
                    

                    <!-- <FormItem label="剂型给药途径名称" :label-width="160">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入剂型给药途径名称" style="width: 220px;" />
                    </FormItem> -->
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryFormDrugPathAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryFormDrugPathQuery'" :columnConfig='formDrugPathCol' :columnDatas='formDrugPathList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in formDrugPathCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{formDrugPathCol.find(m=>m.name==col.name).render?formDrugPathCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                           <Button v-authorize="'DictionaryFormDrugPathReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='formDrugPathInfo = Object.assign({},item);formDrugPathOk(2);'></Button>
                            <Button v-authorize="'DictionaryFormDrugPathReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassModel = true; formDrugPathInfo = Object.assign({},item);getAuditList();'></Button>
                            <Button v-authorize="'DictionaryFormDrugPathIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='pubConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryFormDrugPathState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" 
                                    :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" 
                                    :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryFormDrugPathEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green"  @click='$refs["formDrugPathForm"].resetFields(); editModel = true; formDrugPathInfo = Object.assign({},item);'></Button>
                            <Button v-authorize="'DictionaryFormDrugPathDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" @click='deleteConfirm(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="formDrugPathList.length>0">            
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
                
                <Form :model="formDrugPathForm" ref="formDrugPathFormAdd"  :rules="ruleValidate" :label-width="90">
                    <FormItem label="剂型" prop="form">
                        <Select v-model="formDrugPathForm.form" filterable >
                            <OptionGroup  label="二级剂型">
                                <Option v-for="item in formList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径" prop="pathDrug">
                        <Select v-model="formDrugPathForm.pathDrug" filterable>
                            <OptionGroup  label="二级给药途径">
                                <Option  v-for="item in pathDrugList"  :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                            </OptionGroup >
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="formDrugPathForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                    </FormItem>

                </Form>
            </Modal>

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editFormDrugPathInfo" :loading="loading" >
            <Form ref="formDrugPathForm" :model="formDrugPathInfo" :rules="ruleValidate" :label-width="90">
                    <input type="hidden" v-model="formDrugPathInfo.formDrugpathId"/>
                    <FormItem label="剂型" prop="form">
                        <Select v-model="formDrugPathInfo.form" filterable >
                            <OptionGroup  label="二级剂型">
                                <Option v-for="item in formList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径" prop="pathDrug">
                        <Select v-model="formDrugPathInfo.pathDrug" filterable>
                            <OptionGroup  label="二级给药途径">
                                <Option  v-for="item in pathDrugList"  :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                            </OptionGroup >
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="formDrugPathInfo.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                    </FormItem>
            </Form> 
        </Modal>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="formDrugPathOk(3)">
            <Form :model="formDrugPathInfo" :label-width="90">
                <input type="hidden" v-model="formDrugPathInfo.formDrugpathId"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="formDrugPathInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="formDrugPathInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "formDrugPath",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        keywords: "",
        statusId: 1
      },
      formString: "",
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      formDrugPathForm: {
        formDrugpathId: "",
        form: "",
        formNameChinese: "",
        pathDrug: "",
        pathDrugName: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      formDrugPathInfo: {},
      formDrugPathList: [],
      pathDrugList: [],
      formList: [],
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
        form: [{ required: true, message: "请选择剂型", trigger: "blur" }],
        pathDrug: [
          { required: true, message: "请选择给药途径", trigger: "blur" }
        ]
      },
      formDrugPathCol: [
        {
          text: "剂型给药途径Id",
          name: "formDrugpathId",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "剂型",
          name: "formName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "给药途径",
          name: "pathDrugName",
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
    this.getFormDrugPathList();
    this.getPathDrugList();
    this.getFormList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A26",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.formDrugPathInfo.checkNoReason =
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
    getFormList() {
      var self = this;
      Vue.ajax.send({
        name: "form.list",
        data: {
          pageIndex: 1,
          pageSize: 99999,
          dataLevel: 2
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.formList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getPathDrugList() {
      var self = this;
      Vue.ajax.send({
        name: "pathDrug.list",
        data: {
          pageIndex: 1,
          pageSize: 99999,
          dataLevel: 2
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.pathDrugList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getFormDrugPathList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "formDrugPath.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          form: self.searchForm.form,
          pathDrug: self.searchForm.pathDrug,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.formDrugPathList = data.data.dataList;
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
      this.getFormDrugPathList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getFormDrugPathList();
    },
    addModal() {
      this.$refs["formDrugPathFormAdd"].resetFields();
      this.formDrugPathForm.remark = "";
      this.addModel = true;
    },
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content:
          "确定要删除“" + item.formName + "," + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "formDrugPath.del",
            data: {
              formDrugpathId: item.formDrugpathId,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.success("剂型给药途径信息删除成功");
                self.getFormDrugPathList();
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
            ? "确定要启用“" + item.formName + "," + item.pathDrugName + "”？"
            : "确定要停用“" + item.formName + "," + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "formDrugPath.review",
            data: {
              formDrugpathId: item.formDrugpathId,
              changeUser: item.changeUser,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.success("剂型给药途径信息启用成功")
                  : self.$Message.success("剂型给药途径信息停用成功");
                self.getFormDrugPathList();
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
        content:
          "确定要发布“" + item.formName + "," + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "formDrugPath.review",
            data: {
              formDrugpathId: item.formDrugpathId,
              changeUser: Vue.getUser().userName,
              statusId: "4"
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.success("剂型给药途径信息发布成功");
                self.getFormDrugPathList();
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
      this.$refs["formDrugPathFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "formDrugPath.add",
            data: {
              formDrugpathId: self.formDrugPathForm.formDrugpathId,
              form: self.formDrugPathForm.form,
              pathDrug: self.formDrugPathForm.pathDrug,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.formDrugPathForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["formDrugPathFormAdd"].resetFields();
                self.$Message.success("新增剂型给药途径提交成功！");

                self.getFormDrugPathList();
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
    editFormDrugPathInfo() {
      this.$refs["formDrugPathForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "formDrugPath.edit",
            data: {
              formDrugpathId: self.formDrugPathInfo.formDrugpathId,
              form: self.formDrugPathInfo.form,
              pathDrug: self.formDrugPathInfo.pathDrug,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.formDrugPathInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("剂型给药途径编辑成功！");
                self.getFormDrugPathList();
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
    formDrugPathOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "formDrugPath.review",
        data: {
          formDrugpathId: self.formDrugPathInfo.formDrugpathId,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.formDrugPathInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.formDrugPathInfo.checkNoReasonMemo
        },
        success: function(data) {
          setTimeout(() => {
            self.loading = false;
            self.$nextTick(() => {
              self.loading = true;
            });
          }, 0);
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("剂型给药途径通过信息提交成功！")
              : self.$Message.success("剂型给药途径不通过信息提交成功！");
            self.getFormDrugPathList();
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
          this.currentSort.column == "statusId" ||
          this.currentSort.column == "formDrugpathId"
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