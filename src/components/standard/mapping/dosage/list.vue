<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">剂量</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		       	<FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>       
		        <FormItem label="剂量名称_中" :label-width="100">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入剂量名称_中" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedDosageAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedDosageList'" :columnConfig='dosageCol' :columnDatas='dosageList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in dosageCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{dosageCol.find(m=>m.name==col.name).render?dosageCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedDosageAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='dosageInfo = Object.assign({},item);dosageOk(2);'></Button>
                  <Button v-authorize="'MappedDosageAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;dosageInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedDosageEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;dosageInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  
                  <Button v-authorize="'MappedDosageIssus'" v-if='item.statusId == 2'  icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedDosageState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedDosageDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="dosageList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>
        
        

        <!-- 新增弹框 -->
            <Modal v-model="addModel" title="新增" class-name="vertical-center-modal" @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="dosageForm" ref="dosageFormAdd"  :rules="ruleValidate" :label-width="100">
                    <FormItem label="父级剂量" >
                        <Select v-model="dosageForm.superiorDosage" @on-change="getDataLevel">
                            <OptionGroup label="0级剂量">
                                <Option v-for="item in dosageAllList" v-if="item.dataLevel==0"  :value="item.dosage" :key="item.dosage">{{ item.dosageNameChina }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级剂量">
                                <Option v-for="item in dosageAllList" v-if="item.dataLevel==1"  :value="item.dosage" :key="item.dosage">{{ '&nbsp;&nbsp;' +  item.dosageNameChina }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="剂量名称编号" prop="dosage">
                        <Input v-model.trim="dosageForm.dosage" :maxlength="20" />
                    </FormItem>
                    <FormItem label="剂量名称_中" prop="dosageNameChina">
                        <Input v-model.trim="dosageForm.dosageNameChina" :maxlength="60" />
                    </FormItem>
                    <FormItem label="剂量名称_英" prop="dosageNameEnglish">
                        <Input v-model.trim="dosageForm.dosageNameEnglish" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="dosageForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    
                    <FormItem label="备注" >
                        <Input v-model.trim="dosageForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
                </Form>
            </Modal> 
            <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editDosageInfo" :loading="loading">
            <Form ref="dosageForm" :model="dosageInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="dosageInfo.dosage"/>
                    <FormItem label="父级剂量" >
                        <Select v-model="dosageInfo.superiorDosage" @on-change="getDataLevel">
                            <OptionGroup label="0级剂量">
                                <Option v-for="item in dosageAllList" v-if="item.dataLevel==0"  :value="item.dosage" :key="item.dosage">{{ item.dosageNameChina }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级剂量">
                                <Option v-for="item in dosageAllList" v-if="item.dataLevel==1"  :value="item.dosage" :key="item.dosage">{{ '&nbsp;&nbsp;' +  item.dosageNameChina }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="剂量名称_中" prop="dosageNameChina">
                        <Input v-model.trim="dosageInfo.dosageNameChina" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="剂量名称_英" prop="dosageNameEnglish">
                        <Input v-model.trim="dosageInfo.dosageNameEnglish" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="dosageInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="dosageInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>  
        </Modal>   
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="dosageOk(3)">
            <Form :model="dosageInfo" :label-width="90">
                <input type="hidden" v-model="dosageInfo.dosage"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="dosageInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="dosageInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "dosage",
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
      dosageForm: {
        dosageNameChina: "",
        dosage: "",
        dosageNameEnglish: "",
        dataLevel: "",
        superiorDosage: "",
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
      dosageList: [],
      dosageAllList: [],
      dosageInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        dosage: [
          { required: true, message: "剂量名称编号不能为空", trigger: "blur" }
        ],
        dosageNameChina: [
          { required: true, message: "剂量名称_中不能为空", trigger: "blur" }
        ],
        dosageNameEnglish: [
          { required: true, message: "剂量名称_英不能为空", trigger: "blur" }
        ],
        dataLevel: [
          {
            required: true,
            message: "剂量等级不能为空",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      dosageCol: [
        {
          text: "编号",
          name: "dosage",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "剂量名称_中",
          name: "dosageNameChina",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "剂量名称_英",
          name: "dosageNameEnglish",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "剂量等级",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "父级剂量编码",
          name: "superiorDosage",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "父级剂量",
          name: "superiorDosageName",
          sortable: true,
          moveable: true,
          width: 150
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
          }
        },
        {
          text: "创建人",
          name: "createUser",
          sortable: true,
          moveable: true,
          width: 130
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
          width: 150
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
          width: 130
        },
        {
          text: "审核时间",
          name: "checkTime",
          sortable: true,
          moveable: true,
          width: 130
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
          width: 130
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
    this.getDosageList();
    this.getAllDosageList();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该剂量下存在子级，请先删除子级剂量!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.dosageNameChina + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "dosage.del",
              data: {
                dosage: item.dosage,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("剂量删除成功");
                  self.getDosageList();
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
            ? "确定要启用“" + item.dosageNameChina + "”？"
            : "确定要停用“" + item.dosageNameChina + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "dosage.review",
            data: {
              dosage: item.dosage,
              dosageNameChina: item.dosageNameChina,
              dosageNameEnglish: item.dosageNameEnglish,
              dataLevel: item.dataLevel,
              superiorDosage: item.superiorDosage,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("剂量信息启用成功")
                  : self.$Message.info("剂量信息停用成功");
                self.getDosageList();
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
        content: "确定要发布“" + item.dosageNameChina + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "dosage.review",
            data: {
              dosage: item.dosage,
              dosageNameChina: item.dosageNameChina,
              dosageNameEnglish: item.dosageNameEnglish,
              dataLevel: item.dataLevel,
              superiorDosage: item.superiorDosage,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("剂量信息发布成功");
                self.getDosageList();
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
          reasonTypeId: "A16",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.dosageInfo.checkNoReason =
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
    getAllDosageList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "dosage.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.dosageAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getDosageList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "dosage.list",
        data: {
          dosageNameChina: self.searchForm.keywords,
          dosageNameEnglish: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.dosageList = data.data.dataList;
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
      this.getDosageList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDosageList();
    },
    addModal() {
      this.$refs["dosageFormAdd"].resetFields();
      this.dosageForm.remark = "";
      this.dosageForm.superiorDosage = "";
      this.dosageForm.dataLevel = "";
      this.addModel = true;
    },
    getDataLevel(value) {
      if (value != "" && value != null) {
        var item = this.dosageAllList.filter(x => x.dosage == value);
        this.dosageForm.dataLevel = item[0].dataLevel + 1;

        this.dosageInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    addOk() {
      this.$refs["dosageFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "dosage.add",
            data: {
              dosage: self.dosageForm.dosage,
              dosageNameChina: self.dosageForm.dosageNameChina,
              dosageNameEnglish: self.dosageForm.dosageNameEnglish,
              dataLevel: self.dosageForm.dataLevel,
              superiorDosage: self.dosageForm.superiorDosage,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.dosageForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增剂量提交成功！");

                self.getDosageList();

                self.getAllDosageList();
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
    dosageOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "dosage.review",
        data: {
          dosage: self.dosageInfo.dosage,
          dosageNameChina: self.dosageInfo.dosageNameChina,
          dosageNameEnglish: self.dosageInfo.dosageNameEnglish,
          dataLevel: self.dosageInfo.dataLevel,
          superiorDosage: self.dosageInfo.superiorDosage,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.dosageInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? "" : self.dosageInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("剂量通过信息提交成功！")
              : self.$Message.success("剂量不通过信息提交成功！");
            self.getDosageList();
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
    editDosageInfo() {
      this.$refs["dosageForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "dosage.edit",
            data: {
              dosage: self.dosageInfo.dosage,
              dosageNameChina: self.dosageInfo.dosageNameChina,
              dosageNameEnglish: self.dosageInfo.dosageNameEnglish,
              dataLevel: self.dosageInfo.dataLevel,
              superiorDosage: self.dosageInfo.superiorDosage,
              changeUser: Vue.getUser().userName,
              checkUser: self.dosageInfo.checkUser,
              statusId: 1,
              remark: self.dosageInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("剂量信息" + self.editTitle + "成功！");
                self.getDosageList();

                self.getAllDosageList();
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