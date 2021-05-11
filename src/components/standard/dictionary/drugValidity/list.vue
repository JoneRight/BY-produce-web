<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">药品有效期</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="药品名称" :label-width="90">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入药品名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryDrugValidityAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryDrugValidityQuery'" :columnConfig='drugValidityCol' :columnDatas='drugValidityList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in drugValidityCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{drugValidityCol.find(m=>m.name==col.name).render?drugValidityCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                           <Button v-authorize="'DictionaryDrugValidityReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='drugValidityInfo = Object.assign({},item);drugValidityOk(2);'></Button>
                            <Button v-authorize="'DictionaryDrugValidityReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassModel = true; drugValidityInfo = Object.assign({},item);getAuditList();'></Button>
                            <Button v-authorize="'DictionaryDrugValidityIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='pubConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryDrugValidityState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" 
                                    :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" 
                                    :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryDrugValidityEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green"  @click='$refs["drugValidityForm"].resetFields();editModel = true; drugValidityInfo = Object.assign({},item);'></Button>
                            <Button v-authorize="'DictionaryDrugValidityDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteConfirm(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="drugValidityList.length>0">            
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
                
                <Form :model="drugValidityForm" ref="drugValidityFormAdd"  :rules="ruleValidate" :label-width="110">
                    <FormItem label="药品编码" prop="drug">
                        <Input v-model.trim="drugValidityForm.drug" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="药品本位码" prop="sdcc18">
                        <Input v-model.trim="drugValidityForm.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准文码">
                        <Input v-model.trim="drugValidityForm.approveNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准日期">
                        <DatePicker placeholder="请选择批准日期" format="yyyy年MM月dd日"  v-model="drugValidityForm.approveDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="有效期截止日">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugValidityForm.invalidDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="原批准文码" >
                        <Input v-model.trim="drugValidityForm.approveNumberOld" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="开始年月" >
                        <DatePicker placeholder="请选择开始年月" type="month" format="yyyyMM"  v-model="drugValidityForm.startYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束年月" >
                        <DatePicker placeholder="请选择结束年月" type="month" format="yyyyMM"  v-model="drugValidityForm.stopYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>
                    


                </Form>
            </Modal>

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editDrugValidityInfo" :loading="loading" >
            <Form ref="drugValidityForm" :model="drugValidityInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="drugValidityInfo.drugValidityId"/>
                    <FormItem label="药品编码" prop="drug">
                        <Input :disabled="true" v-model.trim="drugValidityInfo.drug" :maxlength="15"/>
                    </FormItem>
                    <FormItem label="药品本位码" prop="sdcc18">
                        <Input v-model.trim="drugValidityInfo.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准文码">
                        <Input v-model.trim="drugValidityInfo.approveNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准日期">
                        <DatePicker placeholder="请选择批准日期" format="yyyy年MM月dd日"  v-model="drugValidityInfo.approveDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="有效期截止日">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugValidityInfo.invalidDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="原批准文码" >
                        <Input v-model.trim="drugValidityInfo.approveNumberOld" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="开始年月" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" type="month" format="yyyyMM"  v-model="drugValidityInfo.startYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束年月" prop="stopYearmonth">
                        <DatePicker placeholder="请选择结束年月" type="month" format="yyyyMM"  v-model="drugValidityInfo.stopYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>

            </Form> 
        </Modal>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugValidityOk(3)">
            <Form :model="drugValidityInfo" :label-width="90">
                <input type="hidden" v-model="drugValidityInfo.drugValidityId"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugValidityInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugValidityInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "drugValidity",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugValidityForm: {
        drugValidityId: "",
        drug: "",
        sdcc18: "",
        invalidDate: "",
        approveNumber: "",
        approveDate: "",
        approveNumberOld: "",
        startYearmonth: "",
        stopYearmonth: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      drugValidityInfo: {
        startYearmonth: "",
        stopYearmonth: ""
      },
      drugValidityList: [],
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
        sdcc18: [
          { required: true, message: "药品本位码不能为空", trigger: "blur" }
        ],
        drug: [{ required: true, message: "药品编码不能为空", trigger: "blur" }]
      },
      drugValidityCol: [
        // {
        //     text: '编码',
        //     name: 'drugValidityId',
        //     sortable: true,
        //     moveable: true,
        //     width: 130
        // },
        {
          text: "药品编码",
          name: "drug",
          sortable: true,
          moveable: true,
          width: 130
          // fixed: "left"
        },
        {
          text: "药品名称",
          name: "drugName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "药品本位码",
          name: "sdcc18",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "批准文码",
          name: "approveNumber",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "批准日期",
          name: "approveDate",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "有效期截止日",
          name: "invalidDate",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "原_批准文码",
          name: "approveNumberOld",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "企业名称",
          name: "companyName",
          sortable: true,
          moveable: true,
          width: 180
        },
        // {
        //   text: "药品通用名",
        //   name: "drugName",
        //   sortable: true,
        //   moveable: true,
        //   width: 150
        // },
        {
          text: "药品商品名",
          name: "drugTradeName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "剂型",
          name: "formNameChinese",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "规格",
          name: "drugSpecName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "包装规格",
          name: "packageSpecName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "开始年月",
          name: "startYearmonth",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "结束年月",
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
    this.getDrugValidityList();
  },
  methods: {
    dateFormat(val) {
      let year = val.getFullYear().toString();
      let month =
        val.getMonth() >= 9
          ? (val.getMonth() + 1).toString()
          : "0" + (val.getMonth() + 1);
      return year + month;
    },
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A25",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugValidityInfo.checkNoReason =
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
    getDrugValidityList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugValidity.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId,
          drugName: self.searchForm.keywords
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugValidityList = data.data.dataList;
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
      this.getDrugValidityList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugValidityList();
    },
    addModal() {
      this.$refs["drugValidityFormAdd"].resetFields();
      this.addModel = true;
    },
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.drug + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugValidity.del",
            data: {
              drugValidityId: item.drugValidityId,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品有效期删除成功");
                self.getDrugValidityList();
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
            ? "确定要启用“" + item.drug + "”？"
            : "确定要停用“" + item.drug + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugValidity.review",
            data: {
              drugValidityId: item.drugValidityId,
              changeUser: item.changeUser,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("药品有效期启用成功")
                  : self.$Message.info("药品有效期停用成功");

                self.drugValidityInfo = {};
                self.getDrugValidityList();
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
        content: "确定要发布“" + item.drugValidityId + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugValidity.review",
            data: {
              drugValidityId: item.drugValidityId,
              changeUser: Vue.getUser().userName,
              statusId: "4"
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品有效期发布成功");

                self.drugValidityInfo = {};
                self.getDrugValidityList();
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
      this.$refs["drugValidityFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugValidity.add",
            data: {
              drug: self.drugValidityForm.drug,
              sdcc18: self.drugValidityForm.sdcc18,
              approveNumber: self.drugValidityForm.approveNumber,
              startYearmonth:
                self.drugValidityForm.startYearmonth == ""
                  ? ""
                  : self.dateFormat(self.drugValidityForm.startYearmonth),
              stopYearmonth:
                self.drugValidityForm.stopYearmonth == ""
                  ? ""
                  : self.dateFormat(self.drugValidityForm.stopYearmonth),
              approveDate:
                self.drugValidityForm.approveDate == ""
                  ? ""
                  : self.drugValidityForm.approveDate,
              invalidDate:
                self.drugValidityForm.invalidDate == ""
                  ? ""
                  : self.drugValidityForm.invalidDate,
              approveNumberOld: self.drugValidityForm.approveNumberOld,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.drugValidityForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["drugValidityFormAdd"].resetFields();
                self.$Message.success("新增药品有效期提交成功！");

                self.drugValidityForm.remark = "";
                self.getDrugValidityList();
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
    editDrugValidityInfo() {
      this.$refs["drugValidityForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugValidity.edit",
            data: {
              drugValidityId: self.drugValidityInfo.drugValidityId,
              drug: self.drugValidityInfo.drug,
              sdcc18: self.drugValidityInfo.sdcc18,
              approveNumber: self.drugValidityInfo.approveNumber,
              startYearmonth:
                self.drugValidityInfo.startYearmonth == "" ||
                self.drugValidityInfo.startYearmonth == null
                  ? ""
                  : self.dateFormat(self.drugValidityInfo.startYearmonth),
              stopYearmonth:
                self.drugValidityInfo.stopYearmonth == "" ||
                self.drugValidityInfo.stopYearmonth == null
                  ? ""
                  : self.dateFormat(self.drugValidityInfo.stopYearmonth),
              approveDate:
                self.drugValidityInfo.approveDate == "" ||
                self.drugValidityInfo.approveDate == null
                  ? ""
                  : self.drugValidityInfo.approveDate,
              invalidDate:
                self.drugValidityInfo.invalidDate == "" ||
                self.drugValidityInfo.invalidDate == null
                  ? ""
                  : self.drugValidityInfo.invalidDate,
              approveNumberOld: self.drugValidityInfo.approveNumberOld,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.drugValidityInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("药品有效期编辑成功！");

                self.drugValidityInfo = {};

                self.getDrugValidityList();
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
    drugValidityOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugValidity.review",
        data: {
          drugValidityId: self.drugValidityInfo.drugValidityId,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.drugValidityInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.drugValidityInfo.checkNoReasonMemo
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
              ? self.$Message.success("药品有效期通过信息提交成功！")
              : self.$Message.success("药品有效期不通过信息提交成功！");
            self.getDrugValidityList();
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    // add() {
    //     this.$router.push({
    //          path: "/standard/dictionary/drugValidity/add"
    //     });
    // },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (
          this.currentSort.column == "drugValidityId" ||
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