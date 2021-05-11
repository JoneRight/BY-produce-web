<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">药品</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="药品分类" :label-width="70" >
                    <Select v-model="searchForm.drugClassy" filterable clearable style="width: 100px;">
                        <Option v-for="item in drugClassyList" :value="item.drugClassy" :key="item.drugClassy">{{ item.drugClassyName }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="药品编码" :label-width="60">
                 <Input v-model="searchForm.drugCode" type="text" placeholder="请输入药品编码" style="width: 110px;" />

                    <!-- <Select v-model="searchForm.drugGenericCode" filterable clearable remote :remote-method="getGenericList" style="width: 100px;" @on-clear="clearGeneric" allow-create @on-create="handleCreate">
                        <Option  v-for="item in genericList" :value="item.drugGenericName" :key="item.drugGenericCode" >{{ item.drugGenericName }} </Option>
                    </Select> -->
                </FormItem>
                <FormItem label="通用名" :label-width="60">
                 <Input v-model="searchForm.drugGenericCode" type="text" placeholder="请输入通用名" style="width: 110px;" />

                    <!-- <Select v-model="searchForm.drugGenericCode" filterable clearable remote :remote-method="getGenericList" style="width: 100px;" @on-clear="clearGeneric" allow-create @on-create="handleCreate">
                        <Option  v-for="item in genericList" :value="item.drugGenericName" :key="item.drugGenericCode" >{{ item.drugGenericName }} </Option>
                    </Select> -->
                </FormItem>
                <FormItem label="规格" :label-width="40">
                    <Input v-model="searchForm.drugSpecCode" type="text" placeholder="请输入规格" style="width: 120px;" />

                    <!-- <Select v-model="searchForm.drugSpecCode" filterable clearable remote :remote-method="getSpecList" style="width: 120px;" @on-clear="clearSpec" allow-create @on-create="handleCreateSpecList">
                        <Option v-for="item in specList" :value="item.drugSpecName" :key="item.drugSpecName">{{ item.drugSpecName }}</Option>
                    </Select> -->
                </FormItem>
                <FormItem label="剂型" :label-width="60">
                   <Input v-model="searchForm.formName" type="text" placeholder="剂型" style="width: 120px;" />
                </FormItem>
                <FormItem label="商品名" :label-width="60">
                   <Input v-model="searchForm.drugTradeName" type="text" placeholder="请输入商品名" style="width: 120px;" />

                    <!-- <Select v-model="searchForm.drugTradeName" filterable  clearable remote :remote-method="getTradeList" style="width: 100px;" @on-clear="clearTrade" allow-create @on-create="handleCreate"> 
                        <Option v-for="item in tradeList" :value="item.drugTradeName" :key="item.drugTradeName">{{ item.drugTradeName }}</Option>
                    </Select> -->
                </FormItem>
                <FormItem label="生产企业" :label-width="70">
                     <Input v-model="searchForm.company" type="text" placeholder="请输入生产企业" style="width: 120px;" />
                    <!-- <Select v-model="searchForm.company" filterable clearable remote :remote-method="getMedicalList" style="width: 120px;" @on-clear="clearCompany" allow-create @on-create="handleCreateProductName"> 
                        <Option v-for="item in medicalCompanyList" :value="item.companyName" :key="item.companyName">{{ item.companyName }}</Option>
                    </Select> -->
                </FormItem>
                <FormItem label="产品名" :label-width="60">
                   <Input v-model="searchForm.productName" type="text" placeholder="产品名" style="width: 120px;" />
                </FormItem>
                <FormItem label="ATC" :label-width="60">
                   <Input v-model="searchForm.atc" type="text" placeholder="ATC编码" style="width: 120px;" />
                </FormItem>
                <FormItem label="ATC名称" :label-width="60">
                   <Input v-model="searchForm.atcName" type="text" placeholder="ATC名称" style="width: 120px;" />
                </FormItem>
                <FormItem label="ATC英文" :label-width="60">
                   <Input v-model="searchForm.atcNameEnglish" type="text" placeholder="ATC英文" style="width: 120px;" />
                </FormItem>
                <FormItem label="添加人" :label-width="60">
                   <Input v-model="searchForm.createUser" type="text" placeholder="" style="width: 120px;" />
                </FormItem>
                <FormItem label="修改人" :label-width="60">
                   <Input v-model="searchForm.changeUser" type="text" placeholder="" style="width: 120px;" />
                </FormItem>
                <FormItem label="审核人" :label-width="60">
                   <Input v-model="searchForm.checkUser" type="text" placeholder="" style="width: 120px;" />
                </FormItem>
                <FormItem label="创建时间" :label-width="80">
		                <DatePicker placeholder="请选择开始日期"   v-model="searchForm.createTime"  type="datetimerange"   style="width: 300px;" :editable="false"></DatePicker>
		             </FormItem>
                 <FormItem label="修改时间" :label-width="80">
		                <DatePicker placeholder="请选择开始日期"   v-model="searchForm.changeTime"  type="datetimerange"   style="width: 300px;" :editable="false"></DatePicker>
		             </FormItem>
                 <FormItem label="审核时间" :label-width="80">
		                <DatePicker placeholder="请选择开始日期"   v-model="searchForm.checkTime"  type="datetimerange"   style="width: 300px;" :editable="false"></DatePicker>
		             </FormItem>
		        <!-- 
               
                <FormItem label="包装规格" :label-width="70">
                    <Select v-model="searchForm.packageSpec" filterable clearable style="width: 120px;">
                        <Option v-for="item in packageSpecList" :value="item.packageSpec" :key="item.packageSpec">{{ item.packageSpecName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="剂型" :label-width="40">
                    <Select v-model="searchForm.form" filterable clearable style="width: 120px;">
                        <Option v-for="item in formList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                    </Select>
                </FormItem> -->
                <!--  -->
		        <FormItem>
		            <Button type="primary" @click="changePage(1)" :disabled="searchDisabled">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedDrugsAdd'" type="primary" to="/standard/mapping/drugs/add" >新增</Button>
		        </FormItem>
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            
            <CustomTable style="height:80%" v-authorize="'MappedDrugsList'" :columnConfig='drugsCol' :columnDatas='drugsList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in drugsCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{drugsCol.find(m=>m.name==col.name).render?drugsCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedDrugsAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='drugInfo = Object.assign({},item);drugOk(2);'></Button>
                  <Button v-authorize="'MappedDrugsAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true; drugInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedDrugsEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" 
                        @click='$router.push("/standard/mapping/drugs/edit?Id="+item.drugKey)'></Button>
                  <Button v-authorize="'MappedDrugsIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedDrugsState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" 
                        :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <!-- <Button v-authorize="'MappedDrugsAudit'" v-if='item.statusId == 1' class='btn-blue' icon = "md-basketball" size="small" title="复制" type="success" @click='noPassModel = true; drugInfo = Object.assign({},item);getAuditList();'></Button> -->
                  <Button v-authorize="'MappedDrugsDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
            </CustomTable>
            <div style="" class="page-footer" style="height:10%">            
                 <div class="mt15 text-center" v-if="drugsList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugOk(3)">
            <Form :model="drugInfo" :label-width="90">
                <input type="hidden" v-model="drugInfo.doctorAdviceType"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugInfo.checkNoReason" class="cellLength" filterable>
                    <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "drugs",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        // drugTradeName:"",
        keywords: "",
        statusId: 1
      },
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugsList: [],
      drugClassyList: [],
      genericList: [],
      tradeList: [],
      specList: [],
      packageSpecList: [],
      medicalCompanyList: [],
      checkNoReasonList: [],
      noPassModel: false,
      searchDisabled: false,
      formList: [],
      drugInfo: {},
      addModel: false, //弹框状态(新增)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      drugsCol: [
        {
          text: "药品编码",
          name: "drug",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "药品分类",
          name: "drugClassyName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "药品所属范围",
          name: "ownRangeName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "药品通用名",
          name: "drugGenericName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "剂型",
          name: "formName",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "盐酸根",
          name: "saltAcidName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "产品名称",
          name: "drugProductName",
          sortable: true,
          moveable: true,
          width: 150
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
          text: "药品商品名",
          name: "drugTradeName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "生产企业",
          name: "companyName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "ATC",
          name: "atc",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "ATC名称",
          name: "atcName",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "ATC英文",
          name: "atcNameEnglish",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "给药途径",
          name: "pathDrugName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "单价（元）",
          name: "unitPrice",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "药物的限定日剂量（DDD）",
          name: "dailyDdd",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "图片信息（药盒、标签）",
          name: "pictureMessage",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "说明书的文字和图片",
          name: "textAndPictures",
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
          width: 150
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
  activated: function() {
    this.getDrugsList();
    //获取药品分类
    this.getDrugClassyList();
    this.getTradeList("");
    this.getGenericList("");
    this.getSpecList("");
    this.getMedicalList("");
    // this.getPackageSpecList('');
    // this.getFormList();
  },
  methods: {
    clearGeneric(){
        this.searchForm.generic=null;
      
    } ,
    clearSpec(){this.searchForm.specName=null;},

    clearCompany(){
  this.searchForm.medicalName = null;

},
  clearTrade(){
  this.searchForm.spareName = null;
},
     handleCreate (val) {
                this.tradeList.push({
                    value: val,
                    label: val
                });
            },
     handleCreateProductName(val){
            this.medicalCompanyList.push({
                    value: val,
                    label: val
                });
            },
          handleCreateSpecList(val){
                      this.specList.push({
                    value: val,
                    label: val
                });
          },

    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A02",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugInfo.checkNoReason =
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
    getDrugClassyList() {
      //获取药品分类
      var self = this;
      Vue.ajax.send({
        name: "drugClassy.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugClassyList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getTradeList(query) {
      //商品名
      var self = this;
      this.searchForm.spareName  = query
      Vue.ajax.send({
        name: "drugs.tradeNameList",
        data: {
          pageIndex: 1,
          pageSize: 50,
          drugTradeName: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.tradeList = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getGenericList(query) {
      var self = this;
      this.searchForm.generic = query;
      Vue.ajax.send({
        name: "drugs.genericList",
        data: {
          pageIndex: 1,
          pageSize: 99,
          drugGenericName: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.genericList = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getSpecList(query) {
      //规格
      var self = this;
      this.searchForm.specName = query;
      Vue.ajax.send({
        name: "drugs.specList",
        data: {
          pageIndex: 1,
          pageSize: 50,
          drugSpecName: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.specList = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getMedicalList(query) {
      //生产企业
      var self = this;
      this.searchForm.medicalName  = query
      Vue.ajax.send({
        name: "drugs.companyList",
        data: {
          pageIndex: 1,
          pageSize: 50,
          companyName: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.medicalCompanyList = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    // getPackageSpecList(query) {
    //     //包装规格
    //     var self = this;
    //     Vue.ajax.send({
    //         name: "drugs.packageSpecList",
    //         data: {
    //             pageIndex: 1,
    //             pageSize: 50,
    //             packageSpecName: query.length > 1 ? query.substring(0,1): query
    //         },
    //         success: function(data) {
    //             if (!!data && data.code == "0") {
    //                 self.packageSpecList = data.data;

    //             } else {
    //                 this.$Modal.error({
    //                     title: "",
    //                     content: data.message
    //                 });
    //             }
    //         }
    //     });
    // },
    getFormList() {
      var self = this;
      Vue.ajax.send({
        name: "form.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
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
    getDrugsList(pageIndex) {
      var self = this;
      console.log(self.searchForm);
      self.searchDisabled = true;
      let tradeName = this.searchForm.drugTradeName || this.searchForm.spareName;
      let mediaName = self.searchForm.company || this.searchForm.medicalName;
      let specaName = self.searchForm.drugSpecCode || this.searchForm.specName;
      let genericName = self.searchForm.drugGenericCode|| this.searchForm.generic;
      var createTimeStart,createTimeEnd,changeTimeStart,changeTimeEnd,checkTimeStart,checkTimeEnd;
      if(self.searchForm.createTime){
          createTimeStart = self.searchForm.createTime[0];
          createTimeEnd = self.searchForm.createTime[1];
      };
      if(self.searchForm.changeTime){
          changeTimeStart = self.searchForm.changeTime[0];
          changeTimeEnd = self.searchForm.changeTime[1];
      };
      if(self.searchForm.checkTime){
          checkTimeStart = self.searchForm.checkTime[0];
          checkTimeEnd = self.searchForm.checkTime[1];
      }; 

      Vue.ajax.send({
        name: "drugs.viewDruglist",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          drugClassy: self.searchForm.drugClassy,
          drug: self.searchForm.drugCode,
          drugGenericName: genericName,
          drugSpecName: specaName,
          companyName:mediaName,
          drugTradeName: tradeName,
          statusId: self.searchForm.statusId,
          productName : self.searchForm.productName,
          atc: self.searchForm.atc,
          atcName : self.searchForm.atcName,
          atcNameEnglish : self.searchForm.atcNameEnglish,
          createUser : self.searchForm.createUser,
          changeUser : self.searchForm.changeUser,
          checkUser : self.searchForm.checkUser,
          createTimeStart : createTimeStart,
          createTimeEnd : createTimeEnd,
          changeTimeStart : changeTimeStart,
          changeTimeEnd : changeTimeEnd,
          checkTimeStart : checkTimeStart,
          checkTimeEnd : checkTimeEnd
        },
        success: function(data) {
          self.searchDisabled = false;
          if (!!data && data.code == "0") {
            self.drugsList = data.data.dataList;
            self.pageConfig.totalItemCount = data.data.totalItemCount;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
       tradeName = "";
       mediaName = "";
       specaName = "";
       genericName = "";},
    changePage(currentPage) {
      this.pageConfig.pageNum = currentPage;
      this.getDrugsList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugsList();
    },
    add() {
      this.$router.push({
        path: "/standard/mapping/drugs/add"
      });
    },
    drugOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugs.review",
        data: {
          drugKey: self.drugInfo.drugKey,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.drugInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? "" : self.drugInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("药品通过信息提交成功！")
              : self.$Message.success("药品不通过信息提交成功！");
            self.getDrugsList();
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
    pubConfirm(item) {
      //发布
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.drugGenericName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugs.review",
            data: {
              drugKey: item.drugKey,
              changeUser: Vue.getUser().userName,
              statusId: "4",
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品信息发布成功");
                self.getDrugsList();
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
      //启用停用
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.drugGenericName + "”？"
            : "确定要停用“" + item.drugGenericName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugs.review",
            data: {
              drugKey: item.drugKey,
              changeUser: item.changeUser,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("药品信息启用成功")
                  : self.$Message.info("药品信息停用成功");
                self.getDrugsList();
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
        content: "确定要删除“" + item.drugGenericName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugs.del",
            data: {
              drugKey: item.drugKey,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品信息删除成功");
                self.getDrugsList();
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
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (
          this.currentSort.column == "unitPrice" ||
          this.currentSort.column == "ownRange" ||
          this.currentSort.column == "dailyDdd" ||
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