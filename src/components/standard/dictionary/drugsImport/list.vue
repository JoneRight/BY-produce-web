<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">进口药品信息</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="药品名称" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入药品名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryDrugImportAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryDrugImportQuery'" :columnConfig='drugImportCol' :columnDatas='drugImportList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in drugImportCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{drugImportCol.find(m=>m.name==col.name).render?drugImportCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                           <Button v-authorize="'DictionaryDrugImportReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='drugImportInfo = Object.assign({},item);drugImportOk(2);'></Button>
                            <Button v-authorize="'DictionaryDrugImportReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassModel = true; drugImportInfo = Object.assign({},item);getAuditList();'></Button>
                            <Button v-authorize="'DictionaryDrugImportIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='pubConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryDrugImportState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" 
                                    :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" 
                                    :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                            <Button v-authorize="'DictionaryDrugImportEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green"  @click='$refs["drugImportForm"].resetFields();editModel = true; drugImportInfo = Object.assign({},item);getPoinpackList("");'></Button>
                            <Button v-authorize="'DictionaryDrugImportDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="drugImportList.length>0">            
                        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                        <Button type="text" class="fr" @click="showModal=true">
                            <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                            <span style="font-size:13px;"> 设置显示列</span>
                        </Button>
                    </div>
                </div>
            </div>



            <!-- 新增弹框 -->
            <Modal v-model="addModel" title="新增" :styles="{top:'120px',marginBottom:'20px'}"  class-name="vertical-center-modal" @on-ok="addOk" :loading="loadingAdd">
                
                <Form :model="drugImportForm" ref="drugImportFormAdd"  :rules="ruleValidate" :label-width="110">
                    
                    <FormItem label="药品编码" prop="drug">
                        <Input v-model.trim="drugImportForm.drug" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="药品本位码" prop="sdcc18">
                        <Input v-model.trim="drugImportForm.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="开始年月" >
                        <DatePicker placeholder="请选择开始年月" type="month" format="yyyyMM"  v-model="drugImportForm.startYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束年月" >
                        <DatePicker placeholder="请选择结束年月" type="month" format="yyyyMM"  v-model="drugImportForm.stopYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>
                    <FormItem label="注册证号" prop="registerNumber">
                        <Input v-model.trim="drugImportForm.registerNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="分包装批准文号">
                        <Input v-model.trim="drugImportForm.subpackApproval" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="发证日期" prop="certificationDate">
                        <DatePicker placeholder="请选择发证日期" format="yyyy年MM月dd日"  v-model="drugImportForm.certificationDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="有效期截止日" prop="invalidDate">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugImportForm.invalidDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="分包装企业">
                        <Select v-model="drugImportInfo.poinpackcompanyId" filterable clearable remote  :remote-method="getPoinpackList">
                            <Option v-for="item in poinpackList" :value="item.poinpackcompanyId" :key="item.poinpackcompanyId">{{ item.poinpackcompanyName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分包装批准文号日期">
                         <DatePicker placeholder="请选择分包装批准文号日期" format="yyyy年MM月dd日"  v-model="drugImportForm.subpackApprovalDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="分包装文号有效日期">
                        <DatePicker placeholder="请选择分包装文号有效日期" format="yyyy年MM月dd日"  v-model="drugImportForm.subpackExpirationDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="drugImportForm.remark" :maxlength="400" :autosize="{minRows: 4,maxRows: 12}" type="textarea" />
                    </FormItem>

                </Form>
            </Modal>

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editDrugImportInfo" :loading="loading" >
            <Form ref="drugImportForm" :model="drugImportInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="drugImportInfo.recordId"/>
                    <FormItem label="药品编码" prop="drug">
                        <Input :disabled="true" v-model.trim="drugImportInfo.drug" :maxlength="15"/>
                    </FormItem>
                    <FormItem label="药品本位码">
                        <Input v-model.trim="drugImportInfo.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="开始年月" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" type="month" format="yyyyMM"  v-model="drugImportInfo.startYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束年月" prop="stopYearmonth">
                        <DatePicker placeholder="请选择结束年月" type="month" format="yyyyMM"  v-model="drugImportInfo.stopYearmonth" style="width: 380px"></DatePicker>
                    </FormItem>
                    <FormItem label="注册证号" prop="registerNumber">
                        <Input v-model.trim="drugImportInfo.registerNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="分包装批准文号">
                        <Input v-model.trim="drugImportInfo.subpackApproval" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="发证日期" prop="certificationDate">
                        <DatePicker placeholder="请选择发证日期" format="yyyy年MM月dd日"  v-model="drugImportInfo.certificationDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="有效期截止日" prop="invalidDate">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugImportInfo.invalidDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="分包装企业">
                        <Select   v-model="drugImportInfo.poinpackcompanyId" filterable clearable remote  :remote-method="getPoinpackList">
                            <Option v-for="item in poinpackList" :value="item.poinpackcompanyId" :key="item.poinpackcompanyId">{{ item.poinpackcompanyName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分包装批准文号日期">
                         <DatePicker placeholder="请选择分包装批准文号日期" format="yyyy年MM月dd日"  v-model="drugImportInfo.subpackApprovalDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="分包装文号有效日期">
                        <DatePicker placeholder="请选择分包装文号有效日期" format="yyyy年MM月dd日"  v-model="drugImportInfo.subpackExpirationDate" 
                                     type="date"   style="width: 380px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="drugImportInfo.remark" :maxlength="400" :autosize="{minRows: 4,maxRows: 12}" type="textarea" />
                    </FormItem>
            </Form> 
        </Modal>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugImportOk(3)">
            <Form :model="drugImportInfo" :label-width="90">
                <input type="hidden" v-model="drugImportInfo.recordId"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugImportInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugImportInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "drugsImport",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugImportForm: {
        recordId: "",
        drug: "",
        sdcc18: "",
        startYearmonth: "",
        stopYearmonth: "",
        registerNumber: "",
        subpackApproval: "",
        certificationDate: "",
        invalidDate: "",
        poinpackcompanyId: "",
        subpackApprovalDate: "",
        subpackExpirationDate: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      drugImportInfo: {},
      drugImportList: [],
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      showModal: false,
      showDatas: [],
      showColumns: [],
      poinpackList:[],
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
        drug: [{ required: true, message: "药品不能为空", trigger: "blur" }],
        sdcc18: [
          { required: true, message: "药品本位码不能为空", trigger: "blur" }
        ],
        registerNumber: [
          { required: true, message: "注册证码不能为空", trigger: "blur" }
        ],
        certificationDate: [
          {
            required: true,
            message: "请选择发证日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
        invalidDate: [
          {
            required: true,
            message: "请选择有效期截止日",
            trigger: "change",
            pattern: /.+/
          }
        ]
      },
      drugImportCol: [
        // {
        //     text: '编号',
        //     name: 'recordId',
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
        },
                {
          text: "注册证号",
          name: "registerNumber",
          sortable: true,
          moveable: true,
          width: 150
        },
              {
          text: "药品本位码",
          name: "sdcc18",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "药品通用名称",
          name: "drugName",
          sortable: true,
          moveable: true,
          width: 130
        },
          {
          text: "产品名称",
          name: "drugProductName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "药品商品名",
          name: "drugTradeName",
          sortable: true,
          moveable: true,
          width: 130
        },
              {
          text: "规格",
          name: "drugSpecName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "剂型",
          name: "formNameChinese",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "公司名称",
          name: "companyName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "厂家名称",
          name: "blocName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "分包装批准文号",
          name: "subpackApproval",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "分包装企业编码",
          name: "poinpackcompanyId",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "发证日期",
          name: "certificationDate",
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
          text: "有效期截止日",
          name: "invalidDate",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "分包装文号批准日期",
          name: "subpackApprovalDate",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "分包装文号有效期截止日",
          name: "subpackExpirationDate",
          sortable: true,
          moveable: true,
          width: 200
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
    this.getDrugImportList();
    this.getPoinpackList("");
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
          reasonTypeId: "A23",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugImportInfo.checkNoReason =
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
    getDrugImportList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugsImport.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId,
          drugName: self.searchForm.keywords
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugImportList = data.data.dataList;
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
    getPoinpackList(keywords) {
      //分包装企业
      var self = this;
      Vue.ajax.send({
        name: "poinpack.list",
        data: {
          pageIndex: 1,
          pageSize: 100,
          poinpackcompanyName: keywords,
          statusId: 4
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.poinpackList = data.data.dataList;
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
      this.getDrugImportList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugImportList();
    },
    addModal() {
      this.$refs["drugImportFormAdd"].resetFields();
      this.addModel = true;
      this.getPoinpackList("");
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.recordId + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugsImport.del",
            data: {
              recordId: item.recordId,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("进口药品信息删除成功");
                self.getDrugImportList();
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
            ? "确定要启用“" + item.recordId + "”？"
            : "确定要停用“" + item.recordId + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugsImport.review",
            data: {
              recordId: item.recordId,
              changeUser: item.changeUser,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("进口药品信息启用成功")
                  : self.$Message.info("进口药品信息停用成功");

                self.drugImportInfo = {};
                self.getDrugImportList();
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
        content: "确定要发布“" + item.recordId + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugsImport.review",
            data: {
              recordId: item.recordId,
              changeUser: Vue.getUser().userName,
              statusId: "4"
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("进口药品信息发布成功");

                self.drugImportInfo = {};
                self.getDrugImportList();
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
      this.$refs["drugImportFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugsImport.add",
            data: {
              drug: self.drugImportForm.drug,
              sdcc18: self.drugImportForm.sdcc18,
              startYearmonth:
                self.drugImportForm.startYearmonth == ""
                  ? ""
                  : self.dateFormat(self.drugImportForm.startYearmonth),
              stopYearmonth:
                self.drugImportForm.stopYearmonth == ""
                  ? ""
                  : self.dateFormat(self.drugImportForm.stopYearmonth),
              registerNumber: self.drugImportForm.registerNumber,
              subpackApproval: self.drugImportForm.subpackApproval,
              certificationDate:
                self.drugImportForm.certificationDate == ""
                  ? ""
                  : self.drugImportForm.certificationDate,
              invalidDate:
                self.drugImportForm.invalidDate == ""
                  ? ""
                  : self.drugImportForm.invalidDate,
              poinpackcompanyId: self.drugImportForm.poinpackcompanyId,
              subpackApprovalDate:
                self.drugImportForm.subpackApprovalDate == ""
                  ? ""
                  : self.drugImportForm.subpackApprovalDate,
              subpackExpirationDate:
                self.drugImportForm.subpackExpirationDate == ""
                  ? ""
                  : self.drugImportForm.subpackExpirationDate,
              statusId: 1,
              createUser: Vue.getUser().userName,
              remark: self.drugImportForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["drugImportFormAdd"].resetFields();
                self.$Message.success("新增进口药品提交成功！");
                self.drugImportForm.remark = "";

                self.getDrugImportList();
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
    editDrugImportInfo() {
      this.$refs["drugImportForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugsImport.edit",
            data: {
              recordId: self.drugImportInfo.recordId,
              drug: self.drugImportInfo.drug,
              sdcc18: self.drugImportInfo.sdcc18,
              startYearmonth:
                self.drugImportInfo.startYearmonth == "" ||
                self.drugImportInfo.startYearmonth == null
                  ? ""
                  : self.dateFormat(self.drugImportInfo.startYearmonth),
              stopYearmonth:
                self.drugImportInfo.stopYearmonth == "" ||
                self.drugImportInfo.stopYearmonth == null
                  ? ""
                  : self.dateFormat(self.drugImportInfo.stopYearmonth),
              registerNumber: self.drugImportInfo.registerNumber,
              subpackApproval: self.drugImportInfo.subpackApproval,
              certificationDate:
                self.drugImportInfo.certificationDate == "" ||
                self.drugImportInfo.certificationDate == null
                  ? ""
                  : self.drugImportInfo.certificationDate,
              invalidDate:
                self.drugImportInfo.invalidDate == "" ||
                self.drugImportInfo.invalidDate == null
                  ? ""
                  : self.drugImportInfo.invalidDate,
              poinpackcompanyId: self.drugImportInfo.poinpackcompanyId,
              subpackApprovalDate: self.drugImportInfo.subpackApprovalDate,
              subpackExpirationDate: self.drugImportInfo.subpackExpirationDate,
              statusId: 1,
              changeUser: Vue.getUser().userName,
              remark: self.drugImportInfo.remark
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
                self.$Message.success("进口药品编辑成功！");

                self.drugImportInfo = {};

                self.getDrugImportList();
              } else {
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
    drugImportOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugsImport.review",
        data: {
          recordId: self.drugImportInfo.recordId,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.drugImportInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.drugImportInfo.checkNoReasonMemo
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
              ? self.$Message.success("进口药品通过信息提交成功！")
              : self.$Message.success("进口药品不通过信息提交成功！");

            self.drugImportInfo = {};
            self.getDrugImportList();
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
    //          path: "/standard/dictionary/drugsImport/add"
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
          this.currentSort.column == "recordId" ||
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