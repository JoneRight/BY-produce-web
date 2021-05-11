<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">医生职称</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		       <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="医生职称名称" :label-width="100">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入医生职称名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedDoctorTitleAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
         <div class="bg-white mt15" style="height:100%;">
            
            <CustomTable v-authorize="'MappedDoctorTitleList'" :columnConfig='doctorTitleCol' :columnDatas='doctorTitleList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in doctorTitleCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{doctorTitleCol.find(m=>m.name==col.name).render?doctorTitleCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedDoctorTitleAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='doctorTitleInfo = Object.assign({},item);doctorTitleOk(2);'></Button>
                  <Button v-authorize="'MappedDoctorTitleAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;doctorTitleInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedDoctorTitleEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;doctorTitleInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  <Button v-authorize="'MappedDoctorTitleIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedDoctorTitleState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedDoctorTitleDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="doctorTitleList.length>0">            
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
                
                <Form :model="doctorTitleForm" ref="doctorTitleFormAdd" :rules="ruleValidate" :label-width="100">
                    <FormItem label="父级医生职称">
                        <Select v-model="doctorTitleForm.superDoctorTitle" @on-change="getDataLevel">
                            <OptionGroup label="0级医生职称">
                                <Option v-for="item in doctorTitleAllList" v-if="item.dataLevel==0"  :value="item.doctorTitle" :key="item.doctorTitle">{{ item.doctorTitleName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级医生职称">
                                <Option v-for="item in doctorTitleAllList" v-if="item.dataLevel==1"  :value="item.doctorTitle" :key="item.doctorTitle">{{ '&nbsp;&nbsp;' +  item.doctorTitleName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级医生职称">
                                <Option v-for="item in doctorTitleAllList" v-if="item.dataLevel==2"  :value="item.doctorTitle" :key="item.doctorTitle">{{ '&nbsp;&nbsp;&nbsp;' +  item.doctorTitleName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="医生职称编号" prop="doctorTitle">
                        <Input v-model.trim="doctorTitleForm.doctorTitle" :maxlength="10"/>
                    </FormItem>
                    <FormItem label="医生职称名称" prop="doctorTitleName">
                        <Input v-model.trim="doctorTitleForm.doctorTitleName" :maxlength="15" />
                    </FormItem>
                   <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="doctorTitleForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="doctorTitleForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"   />
                    </FormItem>
                </Form>
        </Modal>

        <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editDoctorTitleInfo" :loading="loading">
            <Form ref="doctorTitleForm" :model="doctorTitleInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="doctorTitleInfo.doctorTitleId"/>
                    <FormItem label="父级医生职称">
                        <Select v-model="doctorTitleInfo.superDoctorTitle" @on-change="getDataLevel">
                            <OptionGroup label="0级医生职称">
                                <Option v-for="item in doctorTitleAllList" v-if="item.dataLevel==0"  :value="item.doctorTitle" :key="item.doctorTitle">{{ item.doctorTitleName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级医生职称">
                                <Option v-for="item in doctorTitleAllList" v-if="item.dataLevel==1"  :value="item.doctorTitle" :key="item.doctorTitle">{{ '&nbsp;&nbsp;' +  item.doctorTitleName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级医生职称">
                                <Option v-for="item in doctorTitleAllList" v-if="item.dataLevel==2"  :value="item.doctorTitle" :key="item.doctorTitle">{{ '&nbsp;&nbsp;&nbsp;' +  item.doctorTitleName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="医生职称名称" prop="doctorTitleName">
                        <Input v-model.trim="doctorTitleInfo.doctorTitleName" :maxlength="15"/>
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="doctorTitleInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    
                    <FormItem label="备注">
                        <Input v-model.trim="doctorTitleInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>    
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="doctorTitleOk(3)">
            <Form :model="doctorTitleInfo" :label-width="90">
                <input type="hidden" v-model="doctorTitleInfo.doctorTitle"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="doctorTitleInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="doctorTitleInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "doctorTitle",
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
      tableH: 0,
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      doctorTitleForm: {
        doctorTitleName: "",
        doctorTitle: "",
        dataLevel: "",
        superDoctorTitle: "",
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
      doctorTitleList: [],
      doctorTitleAllList: [],
      doctorTitleInfo: {},
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
        doctorTitle: [
          { required: true, message: "医生职称编号不能为空", trigger: "blur" }
        ],
        doctorTitleName: [
          { required: true, message: "医生职称名称不能为空", trigger: "blur" }
        ],
        dataLevel: [
          {
            required: true,
            message: "请选择数据等级",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      doctorTitleCol: [
        {
          text: "医生职称编号",
          name: "doctorTitle",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "医生职称名称",
          name: "doctorTitleName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "数据等级",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "父级医生职称编码",
          name: "superDoctorTitle",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "父级医生职称",
          name: "superDoctorTitleName",
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
    this.getDoctorTitleList();
    this.getAllDoctorTitleList();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该医生职称下存在子级，请先删除子级医生职称!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.doctorTitleName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "doctorTitle.del",
              data: {
                doctorTitle: item.doctorTitle,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("医生职称信息删除成功");
                  self.getDoctorTitleList();
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
            ? "确定要启用“" + item.doctorTitleName + "”？"
            : "确定要停用“" + item.doctorTitleName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "doctorTitle.review",
            data: {
              doctorTitle: item.doctorTitle,
              doctorTitleName: item.doctorTitleName,
              dataLevel: item.dataLevel,
              superDoctorTitle: item.superDoctorTitle,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("医生职称信息启用成功")
                  : self.$Message.info("医生职称信息停用成功");
                self.getDoctorTitleList();
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
        content: "确定要发布“" + item.doctorTitleName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "doctorTitle.review",
            data: {
              doctorTitle: item.doctorTitle,
              doctorTitleName: item.doctorTitleName,
              dataLevel: item.dataLevel,
              superDoctorTitle: item.superDoctorTitle,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("医生职称信息发布成功");
                self.getDoctorTitleList();
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
          reasonTypeId: "A05",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.doctorTitleInfo.checkNoReason =
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
    getAllDoctorTitleList() {
      var self = this;
      Vue.ajax.send({
        name: "doctorTitle.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.doctorTitleAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getDoctorTitleList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "doctorTitle.list",
        data: {
          doctorTitleName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.doctorTitleList = data.data.dataList;
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
      this.getDoctorTitleList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDoctorTitleList();
    },
    addModal() {
      this.$refs["doctorTitleFormAdd"].resetFields();
      this.doctorTitleForm.remark = "";
      this.doctorTitleForm.dataLevel = "";
      this.doctorTitleForm.superDoctorTitle = "";
      this.addModel = true;
    },
    getDataLevel(value) {
      if (value != "" && value != null) {
        var item = this.doctorTitleAllList.filter(x => x.doctorTitle == value);
        this.doctorTitleForm.dataLevel = item[0].dataLevel + 1;

        this.doctorTitleInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    addOk() {
      this.$refs["doctorTitleFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "doctorTitle.add",
            data: {
              doctorTitle: self.doctorTitleForm.doctorTitle,
              doctorTitleName: self.doctorTitleForm.doctorTitleName,
              dataLevel: self.doctorTitleForm.dataLevel,
              superDoctorTitle: self.doctorTitleForm.superDoctorTitle,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.doctorTitleForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增医生职称提交成功！");

                self.getDoctorTitleList();

                self.getAllDoctorTitleList();
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
    doctorTitleOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "doctorTitle.review",
        data: {
          doctorTitle: self.doctorTitleInfo.doctorTitle,
          doctorTitleName: self.doctorTitleInfo.doctorTitleName,
          dataLevel: self.doctorTitleInfo.dataLevel,
          superDoctorTitle: self.doctorTitleInfo.superDoctorTitle,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.doctorTitleInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.doctorTitleInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("医生职称通过信息提交成功！")
              : self.$Message.success("医生职称不通过信息提交成功！");
            self.getDoctorTitleList();
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
    editDoctorTitleInfo() {
      this.$refs["doctorTitleForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "doctorTitle.edit",
            data: {
              doctorTitle: self.doctorTitleInfo.doctorTitle,
              doctorTitleName: self.doctorTitleInfo.doctorTitleName,
              dataLevel: self.doctorTitleInfo.dataLevel,
              superDoctorTitle: self.doctorTitleInfo.superDoctorTitle,
              changeUser: Vue.getUser().userName,
              checkUser: self.doctorTitleInfo.checkUser,
              statusId: 1,
              remark: self.doctorTitleInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success(
                  "医生职称信息" + self.editTitle + "成功！"
                );
                self.getDoctorTitleList();

                self.getAllDoctorTitleList();
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