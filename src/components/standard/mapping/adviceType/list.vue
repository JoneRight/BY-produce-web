<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">医嘱类型</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		       <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="医嘱类型名称" :label-width="100">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入医嘱类型名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedAdviceTypeAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            
            <CustomTable v-authorize="'MappedAdviceTypeList'" :columnConfig='adviceTypeCol' :columnDatas='adviceTypeList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in adviceTypeCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{adviceTypeCol.find(m=>m.name==col.name).render?adviceTypeCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedAdviceTypeAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='adviceInfo = Object.assign({},item);adviceOk(2);'></Button>
                  <Button v-authorize="'MappedAdviceTypeAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true; adviceInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedAdviceTypeEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='$refs["adviceForm"].resetFields();editModel = true;adviceInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  <Button v-authorize="'MappedAdviceTypeIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedAdviceTypeState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedAdviceTypeDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3"  class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="adviceTypeList.length>0">            
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
                
                <Form :model="adviceForm" ref="adviceFormAdd"  :rules="ruleValidate" :label-width="80">
                    <FormItem label="父级医嘱" >
                        <Select v-model="adviceForm.superDoctorAdviceType" @on-change="getDataLevel">
                            <OptionGroup label="0级医嘱">
                                <Option v-for="item in adviceTypeAllList" v-if="item.dataLevel==0"  :value="item.doctorAdviceType" :key="item.doctorAdviceType">{{ item.doctorAdviceTypeName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级医嘱">
                                <Option v-for="item in adviceTypeAllList" v-if="item.dataLevel==1"  :value="item.doctorAdviceType" :key="item.doctorAdviceType">{{ '&nbsp;&nbsp;' +  item.doctorAdviceTypeName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="医嘱类型编号" prop="doctorAdviceType">
                        <Input v-model.trim="adviceForm.doctorAdviceType" :maxlength="20" />
                    </FormItem>
                    <FormItem label="医嘱类型名称" prop="doctorAdviceTypeName">
                        <Input v-model.trim="adviceForm.doctorAdviceTypeName" :maxlength="15" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="adviceForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    
                    <FormItem label="备注" >
                        <Input v-model.trim="adviceForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                    </FormItem>
                </Form>
            </Modal> 

        <!-- 编辑弹框 -->
        <Modal v-model="editModel"   :title="editTitle"   class-name="vertical-center-modal" @on-ok="editAdviceInfo" :loading="loading">
            <Form ref="adviceForm" :model="adviceInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="adviceInfo.doctorAdviceType"/>
                    <FormItem label="父级医嘱" >
                        <Select v-model="adviceInfo.superDoctorAdviceType" @on-change="getDataLevel">
                            <OptionGroup label="0级医嘱">
                                <Option v-for="item in adviceTypeAllList" v-if="item.dataLevel==0"  :value="item.doctorAdviceType" :key="item.doctorAdviceType">{{ item.doctorAdviceTypeName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级医嘱">
                                <Option v-for="item in adviceTypeAllList" v-if="item.dataLevel==1"  :value="item.doctorAdviceType" :key="item.doctorAdviceType">{{ '&nbsp;&nbsp;' + item.doctorAdviceTypeName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="医嘱类型名称" prop="doctorAdviceTypeName">
                        <Input v-model.trim="adviceInfo.doctorAdviceTypeName" :maxlength="15" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="adviceInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    
                    <FormItem label="备注">
                        <Input v-model.trim="adviceInfo.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                    </FormItem>
            </Form>
        </Modal>     
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="adviceOk(3)">
            <Form :model="adviceInfo" :label-width="90">
                <input type="hidden" v-model="adviceInfo.doctorAdviceType"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="adviceInfo.checkNoReason" class="cellLength" filterable>
                    <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="adviceInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "adviceType",
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
      adviceForm: {
        doctorAdviceType: "",
        doctorAdviceTypeName: "",
        dataLevel: "",
        superDoctorAdviceType: "",
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
      adviceTypeList: [],
      adviceTypeAllList: [],
      adviceInfo: {},
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
        doctorAdviceType: [
          { required: true, message: "医嘱类型编号不能为空", trigger: "blur" }
        ],
        doctorAdviceTypeName: [
          { required: true, message: "医嘱类型名称不能为空", trigger: "blur" }
        ],
        dataLevel: [
          {
            required: true,
            message: "数据等级不能为空",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      adviceTypeCol: [
        {
          text: "医嘱类型编号",
          name: "doctorAdviceType",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "医嘱类型名称",
          name: "doctorAdviceTypeName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "数据级别",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "父级医嘱",
          name: "superDoctorAdviceType",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "父级医嘱名称",
          name: "superDoctorAdviceTypeName",
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
            return "";
          }
        },
        {
          text: "创建人",
          name: "createUser",
          sortable: true,
          moveable: true,
          width: 150
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
    this.getAdviceTypeList();
    this.getAllAdviceTypeList();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该医嘱类型下存在子级，请先删除子级医嘱类型!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.doctorAdviceTypeName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "adviceType.del",
              data: {
                doctorAdviceType: item.doctorAdviceType,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("医嘱类型信息删除成功");
                  self.getAdviceTypeList();
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
            ? "确定要启用“" + item.doctorAdviceTypeName + "”？"
            : "确定要停用“" + item.doctorAdviceTypeName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "adviceType.review",
            data: {
              doctorAdviceType: item.doctorAdviceType,
              doctorAdviceTypeName: item.doctorAdviceTypeName,
              dataLevel: item.dataLevel,
              superDoctorAdviceType: item.superDoctorAdviceType,
              changeUser: item.changeUser,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("医嘱类型信息启用成功")
                  : self.$Message.info("医嘱类型信息停用成功");
                self.getAdviceTypeList();
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
        content: "确定要发布“" + item.doctorAdviceTypeName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "adviceType.review",
            data: {
              doctorAdviceType: item.doctorAdviceType,
              doctorAdviceTypeName: item.doctorAdviceTypeName,
              dataLevel: item.dataLevel,
              superDoctorAdviceType: item.superDoctorAdviceType,
              changeUser: Vue.getUser().userName,
              statusId: "4",
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("医嘱类型信息发布成功");
                self.getAdviceTypeList();
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
          reasonTypeId: "A15",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.adviceInfo.checkNoReason =
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
    getAllAdviceTypeList() {
      var self = this;
      Vue.ajax.send({
        name: "adviceType.list",
        data: {
          doctorAdviceTypeName: self.searchForm.keywords,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.adviceTypeAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getAdviceTypeList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "adviceType.list",
        data: {
          doctorAdviceTypeName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.adviceTypeList = data.data.dataList;
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
      this.getAdviceTypeList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getAdviceTypeList();
    },
    addModal() {
      this.$refs["adviceFormAdd"].resetFields();
      this.adviceForm.remark = "";
      this.adviceForm.superDoctorAdviceType = "";
      this.adviceForm.dataLevel = "";

      this.addModel = true;
    },
    getDataLevel(value) {
      if (value != "" && value != null) {
        var item = this.adviceTypeAllList.filter(
          x => x.doctorAdviceType == value
        );
        this.adviceForm.dataLevel = item[0].dataLevel + 1;

        this.adviceInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    addOk() {
      this.$refs["adviceFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "adviceType.add",
            data: {
              doctorAdviceType: self.adviceForm.doctorAdviceType,
              doctorAdviceTypeName: self.adviceForm.doctorAdviceTypeName,
              dataLevel: self.adviceForm.dataLevel,
              superDoctorAdviceType: self.adviceForm.superDoctorAdviceType,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.adviceForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;

                self.$Message.success("新增医嘱类型提交成功！");

                self.getAdviceTypeList();

                self.getAllAdviceTypeList();
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
    adviceOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "adviceType.review",
        data: {
          doctorAdviceType: self.adviceInfo.doctorAdviceType,
          doctorAdviceTypeName: self.adviceInfo.doctorAdviceTypeName,
          dataLevel: self.adviceInfo.dataLevel,
          superDoctorAdviceType: self.adviceInfo.superDoctorAdviceType,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.adviceInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? "" : self.adviceInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("医嘱类型通过信息提交成功！")
              : self.$Message.success("医嘱类型不通过信息提交成功！");
            self.getAdviceTypeList();
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
    editAdviceInfo() {
      this.$refs["adviceForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "adviceType.edit",
            data: {
              doctorAdviceType: self.adviceInfo.doctorAdviceType,
              doctorAdviceTypeName: self.adviceInfo.doctorAdviceTypeName,
              dataLevel: self.adviceInfo.dataLevel,
              superDoctorAdviceType: self.adviceInfo.superDoctorAdviceType,
              changeUser: Vue.getUser().userName,
              checkUser: self.adviceInfo.checkUser,
              statusId: 1,
              remark: self.adviceInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("医嘱类型" + self.editTitle + "成功！");
                self.getAdviceTypeList();

                self.getAllAdviceTypeList();
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

