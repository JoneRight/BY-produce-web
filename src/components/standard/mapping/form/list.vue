<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">剂型</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		        <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="剂型名称" :label-width="80">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入剂型名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedFormAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedFormList'" :columnConfig='formCol' :columnDatas='formList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in formCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{formCol.find(m=>m.name==col.name).render?formCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedFormAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='dosagesInfo = Object.assign({},item);dosagesOk(2);'></Button>
                  <Button v-authorize="'MappedFormAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;dosagesInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedFormEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;dosagesInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  <Button v-authorize="'MappedFormIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedFormState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedFormDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="formList.length>0">            
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
                
                <Form :model="dosagesForm" ref="dosagesFormAdd"  :rules="ruleValidate" :label-width="100">
                    <FormItem label="父级剂型" prop="form">
                        <Select  v-model="dosagesForm.superiorForm" @on-change='getDataLevel'>
                            <OptionGroup label="0级剂型">
                                <Option  value="-" key="-">{{ "-"}}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级剂型">
                                <Option v-for="item in formLevelList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="剂型名称编码" prop="form">
                        <Input v-model.trim="dosagesForm.form" :maxlength="10"  />
                    </FormItem>
                    <FormItem label="剂型名称_中" prop="formNameChinese">
                        <Input v-model.trim="dosagesForm.formNameChinese" :maxlength="60"  />
                    </FormItem>
                    <FormItem label="剂型名称_英">
                        <Input v-model.trim="dosagesForm.formNameEnglish" :maxlength="60"  />
                    </FormItem>
                    <FormItem label="剂型别名_中">
                        <Input v-model.trim="dosagesForm.formAb" :maxlength="6"  />
                    </FormItem>
                    <FormItem label="剂型别名_英">
                        <Input v-model.trim="dosagesForm.formEnglishAb" :maxlength="20"  />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="dosagesForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="dosagesForm.remark" :maxlength="150"  :autosize="{minRows: 4,maxRows: 8}"  type="textarea" />
                    </FormItem>
                </Form>
            </Modal> 

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editDosagesInfo" :loading="loading" :mask-closable="false">
            <Form ref="dosagesForm" :model="dosagesInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="dosagesInfo.form"/>
                    <FormItem label="父级剂型" prop="form">
                        <Select  v-model="dosagesInfo.superiorForm" @on-change='getDataLevel'>
                            <OptionGroup label="0级剂型">
                                <Option  value="-" key="-">{{ "-"}}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级剂型">
                                <Option v-for="item in formLevelList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="剂型名称_中" prop="formNameChinese">
                        <Input v-model.trim="dosagesInfo.formNameChinese" :maxlength="60"  />
                    </FormItem>
                    <FormItem label="剂型名称_英">
                        <Input v-model.trim="dosagesInfo.formNameEnglish" :maxlength="60"  />
                    </FormItem>
                    <FormItem label="剂型别名_中">
                        <Input v-model.trim="dosagesInfo.formAb" :maxlength="6"  />
                    </FormItem>
                    <FormItem label="剂型别名_英">
                        <Input v-model.trim="dosagesInfo.formEnglishAb" :maxlength="20"  />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="dosagesInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="dosagesInfo.remark" :maxlength="150"  type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>  
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="dosagesOk(3)">
            <Form :model="dosagesInfo" :label-width="90">
                <input type="hidden" v-model="dosagesInfo.form"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="dosagesInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="dosagesInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "dosages",
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
      dosagesForm: {
        form: "",
        superiorForm: "",
        dataLevel: "",
        formNameChinese: "",
        formNameEnglish: "",
        formAb: "",
        formEnglishAb: "",
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
      formList: [],
      formLevelList: [],
      dosagesInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      commonId: "", //存放id
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        form: [
          { required: true, message: "剂型编码不能为空", trigger: "blur" }
        ],
        formNameChinese: [
          { required: true, message: "剂型名称不能为空", trigger: "blur" }
        ]
      },
      formCol: [
        {
          text: "剂型名称编码",
          name: "form",
          sortable: true,
          moveable: true,
          width: 140
        },
        {
          text: "剂型名称_中",
          name: "formNameChinese",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "剂型名称_英",
          name: "formNameEnglish",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "剂型别名_中",
          name: "formAb",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "剂型别名_英",
          name: "formEnglishAb",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "父级剂型编码",
          name: "superiorForm",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "父级剂型",
          name: "superiorFormName",
          sortable: true,
          moveable: true,
          width: 130
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
          width: 300
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
    this.getFormList();
    this.getFormListByDataLevel();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该剂型下存在子级，请先删除子级剂型!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.formNameChinese + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "form.del",
              data: {
                form: item.form,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("剂型信息删除成功");
                  self.getFormList();
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
            ? "确定要启用“" + item.formNameChinese + "”？"
            : "确定要停用“" + item.formNameChinese + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "form.review",
            data: {
              form: item.form,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("剂型信息启用成功")
                  : self.$Message.info("剂型信息停用成功");
                self.getFormList();
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
        content: "确定要发布“" + item.formNameChinese + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "form.review",
            data: {
              form: item.form,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("剂型信息发布成功");
                self.getFormList();
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
          reasonTypeId: "A32",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.dosagesInfo.checkNoReason =
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
    getFormListByDataLevel() {
      var self = this;
      Vue.ajax.send({
        name: "form.list",
        data: {
          pageIndex: 1,
          pageSize: 999,
          dataLevel: 1
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.formLevelList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getFormList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "form.list",
        data: {
          formNameChinese: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.formList = data.data.dataList;
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
      this.getFormList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getFormList();
    },
    getDataLevel(value) {
      if (value == "-") {
        this.dosagesForm.dataLevel = 1;
        this.dosagesInfo.dataLevel = 1;
      } else if (value != "" && value != null) {
        var item = this.formLevelList.filter(x => x.form == value);
        this.dosagesForm.dataLevel = item[0].dataLevel + 1;

        this.dosagesInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    addModal() {
      this.$refs["dosagesFormAdd"].resetFields();
      this.dosagesForm.superiorForm = "";
      this.dosagesForm.formNameEnglish = "";
      this.dosagesForm.formAb = "";
      this.dosagesForm.formEnglishAb = "";
      this.dosagesForm.remark = "";
      this.addModel = true;
    },
    addOk() {
      this.$refs["dosagesFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "form.add",
            data: {
              form: self.dosagesForm.form,
              superiorForm: self.dosagesForm.superiorForm,
              dataLevel: self.dosagesForm.dataLevel,
              formNameChinese: self.dosagesForm.formNameChinese,
              formNameEnglish: self.dosagesForm.formNameEnglish,
              formAb: self.dosagesForm.formAb,
              formEnglishAb: self.dosagesForm.formEnglishAb,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.dosagesForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增剂型提交成功！");

                self.getFormList();

                self.getFormListByDataLevel();
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
    dosagesOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "form.review",
        data: {
          form: self.dosagesInfo.form,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.dosagesInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.dosagesInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("剂型通过信息提交成功！")
              : self.$Message.success("剂型不通过信息提交成功！");
            self.getFormList();
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
    editDosagesInfo() {
      this.$refs["dosagesForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "form.edit",
            data: {
              form: self.dosagesInfo.form,
              superiorForm: self.dosagesInfo.superiorForm,
              dataLevel: self.dosagesInfo.dataLevel,
              formNameChinese: self.dosagesInfo.formNameChinese,
              formNameEnglish: self.dosagesInfo.formNameEnglish,
              formAb: self.dosagesInfo.formAb,
              formEnglishAb: self.dosagesInfo.formEnglishAb,
              changeUser: Vue.getUser().userName,
              checkUser: self.dosagesInfo.checkUser,
              statusId: 1,
              remark: self.dosagesInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("剂型信息" + self.editTitle + "成功！");
                self.getFormList();

                self.getFormListByDataLevel();
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