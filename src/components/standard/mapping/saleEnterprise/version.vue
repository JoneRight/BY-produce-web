<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">批发企业历史版本</h2>
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
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入批发企业版本名称" style="width: 260px;" />
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
            <CustomTable  :columnConfig='wholesaleVersionCol' :columnDatas='wholesaleVersionList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in wholesaleVersionCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{wholesaleVersionCol.find(m=>m.name==col.name).render?wholesaleVersionCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='wholesaleInfo = Object.assign({},item);medicalOk(2);'></Button>
                  <Button v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;wholesaleInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editItem(item)'></Button>
                  <Button v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="wholesaleVersionList.length>0">            
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
                <Form :model="wholesaleVersionForm" ref="wholesaleVersionFormAdd"  :rules="ruleValidate" :label-width="80">
                    <FormItem label="批发企业名称" prop="salecompanyName">
                        <Input v-model.trim="wholesaleVersionForm.salecompanyName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据跨度" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" format="yyyy年MM月"  v-model="wholesaleVersionForm.startYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                        <span class="pl10 pr10">至</span>
                        <DatePicker placeholder="请选择结束年月" format="yyyy年MM月"   v-model="wholesaleVersionForm.stopYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="wholesaleVersionForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
            </Modal> 
             <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editBlocInfo" :loading="loading"  :mask-closable="false">
            <Form ref="wholesaleVersionForm" :model="wholesaleInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="wholesaleInfo.salecompanyKey"/>
                    <FormItem label="批发企业名称" prop="salecompanyName">
                        <Input v-model.trim="wholesaleInfo.salecompanyName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据跨度" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" format="yyyy年MM月" v-model="wholesaleInfo.startYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                        <span class="pl10 pr10">至</span>
                        <DatePicker placeholder="请选择结束年月" format="yyyy年MM月" v-model="wholesaleInfo.stopYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="wholesaleInfo.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
            </Form> 
        </Modal>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="medicalOk(3)">
            <Form :model="wholesaleInfo" :label-width="90">
                <input type="hidden" v-model="wholesaleInfo.companyVersion"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="wholesaleInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.unauditreasonId">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="wholesaleInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
      salecompanyId: "",
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
      wholesaleVersionList: [],
      wholesaleInfo: {},
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      wholesaleVersionForm: {
        salecompanyName: "",
        startYearmonth: "",
        stopYearmonth: "",
        remark: ""
      },
      ruleValidate: {
        salecompanyName: [
          {
            required: true,
            message: "批发企业名称不能为空",
            trigger: "blur"
          }
        ],
        startYearmonth: [
          {
            required: false,
            message: "开始时间不能为空",
            trigger: "change",
            pattern: /.+/
          }
        ],
        stopYearmonth: [
          {
            required: false,
            message: "结束时间不能为空",
            trigger: "change",
            pattern: /.+/
          }
        ]
      },
      wholesaleVersionCol: [
        {
          text: "批发企业编码",
          name: "salecompanyId",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "批发企业名称",
          name: "salecompanyName",
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
    this.salecompanyId = this.$route.query.Id;
    this.getAddressList();
    this.getWholesaleVersionList();
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
    //                                                     self.$Message.info('批发企业信息删除成功');
    //                                                     self.getWholesaleVersionList();

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
            ? "确定要启用“" + item.salecompanyName + "”？"
            : "确定要停用“" + item.salecompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "operation.review",
            data: {
              salecompanyId: item.salecompanyId,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("批发企业版本信息启用成功")
                  : self.$Message.info("批发企业版本信息停用成功");
                self.getWholesaleVersionList();
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
        content: "确定要发布“" + item.salecompanyName + "”？",
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
                self.$Message.info("批发企业版本信息发布成功");
                self.getWholesaleVersionList();
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
          reasonTypeId: "A41",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.wholesaleInfo.checkNoReason =
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
    getWholesaleVersionList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "wholesaleVersion.list",
        data: {
          salecompanyId: self.salecompanyId,
          salecompanyName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.wholesaleVersionList = data.data.dataList;
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
      this.getWholesaleVersionList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getWholesaleVersionList();
    },
    medicalOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "wholesaleVersion.review",
        data: {
          salecompanyKey: self.wholesaleInfo.salecompanyKey,
          statusId: value,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          checkNoReason: self.wholesaleInfo.checkNoReason,
          checkNoReasonMemo: self.wholesaleInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            value == 2 ? (self.editModel = false) : (self.noPassModel = false);

            value == 2
              ? self.$Message.success("批发企业版本通过信息提交成功！")
              : self.$Message.success("批发企业版本不通过信息提交成功！");

            self.getWholesaleVersionList();
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
      this.$refs["wholesaleVersionFormAdd"].resetFields();
      this.wholesaleVersionForm.salecompanyName = "";
      this.wholesaleVersionForm.startYearmonth = "";
      this.wholesaleVersionForm.stopYearmonth = "";
      this.wholesaleVersionForm.remark = "";
      this.addModel = true;
    },
    addOk() {
      this.$refs["wholesaleVersionFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "wholesaleVersion.add",
            data: {
              salecompanyId: self.salecompanyId,
              salecompanyName: self.wholesaleVersionForm.salecompanyName,
              startYearmonth: self.wholesaleVersionForm.startYearmonth.format(
                "YYYY-MM"
              ),
              stopYearmonth: self.wholesaleVersionForm.stopYearmonth.format(
                "YYYY-MM"
              ),
              statusId: 1,
              remark: self.wholesaleVersionForm.remark,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["wholesaleVersionFormAdd"].resetFields();
                self.$Message.success("新增企业名称提交成功！");
                self.getWholesaleVersionList();
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
      this.wholesaleInfo = Object.assign({}, item);
    },
    editBlocInfo() {
      this.$refs["wholesaleVersionForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "wholesaleVersion.edit",
            data: {
              salecompanyKey: self.wholesaleInfo.salecompanyKey,
              salecompanyName: self.wholesaleInfo.salecompanyName,
              startYearmonth: self.wholesaleInfo.startYearmonth.format(
                "YYYY-MM"
              ),
              stopYearmonth: self.wholesaleInfo.stopYearmonth.format("YYYY-MM"),
              remark: self.wholesaleInfo.remark,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("编辑企业名称提交成功！");
                self.getWholesaleVersionList();
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