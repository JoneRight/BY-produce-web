<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">生产企业历史版本</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option value="0">停用</Option>
                        <Option value="1">待审批</Option>
                        <Option value="2">通过</Option>
                        <Option value="3">不通过</Option>
                        <Option value="4">发布/启用</Option>
                    </Select>
                </FormItem>
		        <FormItem>
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入生产企业版本名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable  :columnConfig='medicalCol' :columnDatas='medicalList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in medicalCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{medicalCol.find(m=>m.name==col.name).render?medicalCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='medicalInfo = Object.assign({},item);medicalOk(2);'></Button>
                  <Button v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;medicalInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editItem(item)'></Button>
                  <Button v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
<!--                   <Button class='btn-deep-blue' icon="ios-rewind" size="small" title="查看历史版本" type="primary" @click='version(item)'></Button> -->
<!--                   <Button class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button> -->
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="medicalList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>
        
        <!-- 新增弹框 -->
        <Modal v-model="addModel" title="新增" class-name="vertical-center-modal"  @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                <Form :model="medicalVersionForm" ref="medicalVersionFormAdd"  :rules="ruleValidate" :label-width="80">
                    <FormItem label="生产企业名称" prop="companyName">
                        <Input v-model.trim="medicalVersionForm.companyName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据跨度" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" format="yyyy年MM月"  v-model="medicalVersionForm.startYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                        <span class="pl10 pr10">至</span>
                        <DatePicker placeholder="请选择结束年月" format="yyyy年MM月"   v-model="medicalVersionForm.stopYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="medicalVersionForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
            </Modal> 
             <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editBlocInfo" :loading="loading"  :mask-closable="false">
            <Form ref="medicalVersionForm" :model="medicalInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="medicalInfo.companyVersion"/>
                    <FormItem label="生产企业名称" prop="companyName">
                        <Input v-model.trim="medicalInfo.companyName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据跨度" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" format="yyyy年MM月" v-model="medicalInfo.startYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                        <span class="pl10 pr10">至</span>
                        <DatePicker placeholder="请选择结束年月" format="yyyy年MM月" v-model="medicalInfo.stopYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="medicalInfo.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
            </Form> 
        </Modal>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="medicalOk(3)">
            <Form :model="medicalInfo" :label-width="90">
                <input type="hidden" v-model="medicalInfo.companyVersion"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="medicalInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.unauditreasonId">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="medicalInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                </FormItem>
            </Form>
        </Modal> 
        
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../../common/EmptyRow";
import CustomTable from "../../../common/GridTable";
export default {
  name: "medical",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      company: "",
      showModal: false,
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      loadingAdd: true,
      loading: true,
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      tableH: 0,
      searchForm: {
        address: [],
        keywords: ""
      },
      addressList: [],
      medicalList: [],
      medicalInfo: {},
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      medicalVersionForm: {
        companyName: "",
        startYearmonth: "",
        stopYearmonth: "",
        remark: ""
      },
      ruleValidate: {
        companyName: [
          {
            required: true,
            message: "生产企业名称不能为空",
            trigger: "blur"
          }
        ],
        startYearmonth: [
          {
            required: true,
            message: "开始时间不能为空",
            trigger: "change",
            pattern: /.+/
          }
        ],
        stopYearmonth: [
          {
            required: true,
            message: "结束时间不能为空",
            trigger: "change",
            pattern: /.+/
          }
        ]
      },
      medicalCol: [
        {
          text: "生产企业编码",
          name: "company",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "生产企业名称",
          name: "companyName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "开始时间",
          name: "startYearmonth",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "结束时间",
          name: "stopYearmonth",
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
          width: 100
        },
        {
          text: "操作",
          name: "op",
          filterable: false,
          removeable: false,
          width: 200
        }
      ]
    };
  },
  mounted: function() {
    this.company = this.$route.query.Id;
    this.getAddressList();
    this.getMedicalList();
  },
  methods: {
    // deleteConfirm(item){
    //     this.$Modal.confirm({
    //                                         title: '删除确认',
    //                                         content: '确定要删除“'+item.companyName+'”？',
    //                                         onOk: () => {
    //                                             var self=this;
    //                                             Vue.ajax.send({
    //                                             name: 'medical.del',
    //                                             data:{
    //                                                 company: item.company,
    //                                                 changeUser: Vue.getUser().userName,
    //                                             },
    //                                             success: function(data) {
    //                                                 if (!!data && data.code=='0') {
    //                                                     self.$Message.info('生产企业信息删除成功');
    //                                                     self.getMedicalList();

    //                                                 } else {
    //                                                     self.$Modal.error({
    //                                                         title: '',
    //                                                         content: data.message
    //                                                     });
    //                                                 }
    //                                             }
    //                                         });

    //                                         }
    //                                     });
    // },
    openConfirm(item) {
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.companyName + "”？"
            : "确定要停用“" + item.companyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "operation.review",
            data: {
              company: item.company,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("生产企业信息启用成功")
                  : self.$Message.info("生产企业信息停用成功");
                self.getMedicalList();
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
        content: "确定要发布“" + item.companyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "medical.review",
            data: {
              company: item.company,
              statusId: 4
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("生产企业信息发布成功");
                self.getMedicalList();
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
          reasonTypeId: "A35",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.medicalInfo.checkNoReason =
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
    getAddressList() {
      var self = this;
      Vue.ajax.send({
        name: "common.adressList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.addressList = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getMedicalList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "medicalVersion.list",
        data: {
          company: self.company,
          companyName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.medicalList = data.data.dataList;
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
      this.getMedicalList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getMedicalList();
    },
    medicalOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "medical.review",
        data: {
          companyVersion: self.medicalInfo.companyVersion,
          statusId: value,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          checkNoReason: self.medicalInfo.checkNoReason,
          checkNoReasonMemo: self.medicalInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            value == 2 ? (self.editModel = false) : (self.noPassModel = false);

            value == 2
              ? self.$Message.success("生产企业通过信息提交成功！")
              : self.$Message.success("生产企业不通过信息提交成功！");

            self.getMedicalList();
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
    addModal() {
      this.$refs["medicalVersionFormAdd"].resetFields();
      this.medicalVersionForm.companyName = "";
      this.medicalVersionForm.startYearmonth = "";
      this.medicalVersionForm.stopYearmonth = "";
      this.medicalVersionForm.remark = "";
      this.addModel = true;
    },
    addOk() {
      this.$refs["medicalVersionFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "medicalVersion.add",
            data: {
              company: self.company,
              companyName: self.medicalVersionForm.companyName,
              startYearmonth: self.medicalVersionForm.startYearmonth.format(
                "YYYY-MM"
              ),
              stopYearmonth: self.medicalVersionForm.stopYearmonth.format(
                "YYYY-MM"
              ),
              statusId: 1,
              remark: self.medicalVersionForm.remark,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["wholesaleBlocFormAdd"].resetFields();
                self.$Message.success("新增企业名称提交成功！");
                self.getMedicalList();
              } else if (data.code == "2") {
                self.$Message.error("企业名称已存在，请重新输入！");
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
    editItem(item) {
      this.editModel = true;
      this.medicalInfo = Object.assign({}, item);
    },
    editBlocInfo() {
      this.$refs["medicalVersionForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "medicalVersion.edit",
            data: {
              companyVersion: self.medicalInfo.companyVersion,
              companyName: self.medicalInfo.companyName,
              startYearmonth: self.medicalInfo.startYearmonth.format("YYYY-MM"),
              stopYearmonth: self.medicalInfo.stopYearmonth.format("YYYY-MM"),
              remark: self.medicalInfo.remark,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("编辑企业名称提交成功！");
                self.getMedicalList();
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
        if (this.currentSort.column == "telephone") {
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