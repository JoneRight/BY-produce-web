<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">药品ATC分类</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    
                    <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <!-- <FormItem label="数据等级" :label-width="70">
                        <Select v-model="searchForm.dataLevel" filterable clearable style="width: 160px;">
                            <Option v-for="item in searchLevelList" :key="item.value" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem> -->
                    <FormItem label="ATC名称" :label-width="70">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入ATC名称" style="width: 220px;" />
                    </FormItem>
                    <FormItem label="ATC英文名称" :label-width="90">
                        <Input v-model="searchForm.atcNameEnglish" type="text" placeholder="请输入ATC英文名称" style="width: 200px;" />
                    </FormItem>
                    <FormItem label="ATC编码" :label-width="70">
                        <Input v-model="searchForm.atcCode" type="text" placeholder="请输入ATC编码" style="width: 200px;" />
                    </FormItem>
                    
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryDrugTypeAtcAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryDrugTypeAtcQuery'" :columnConfig='resourceCol' :columnDatas='drugAtcList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>

                        <td>
                            <Button v-authorize="'DictionaryDrugTypeAtcOperation'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeAtcOperation'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='publishOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 0" icon="md-play" size="small" title="启用" type="primary" 
                                    class="btn-red" @click='startOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 4" icon="md-remove" size="small" title="停用" type="error" 
                                    class="btn-red" @click='stopOk(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeAtcEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeAtcDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="drugAtcList.length>0">            
                        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                        <Button type="text" class="fr" @click="showModal=true">
                            <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                            <span style="font-size:13px;"> 设置显示列</span>
                        </Button>
                    </div>
                </div>
            </div>
            

            <!-- 新增弹框 -->
            <Modal v-model="addModel" title="新增" class-name="vertical-center-modal" @on-ok="addOk()" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="drugAtcForm" ref="drugAtcFormAdd" :rules="ruleValidate" :label-width="100">
                    <FormItem label="父级级别"  prop="superiorLevel">
                        <Select v-model="drugAtcForm.superiorLevel" @on-change='confirmSuperior' filterable ref="drugAtcSelect">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                        </Select>
                    </FormItem>
                       <FormItem id="addLev1" label="父级ATC"  prop="superiorAtc" style="display :none">
                        <Select v-model="drugAtcForm.superiorAtc" filterable ref="drugAtcSelect">
                            <OptionGroup label="一级编码">
                                <Option v-for="(item, index) in drugAtcAllList" :value="item.atcL1" :key="item.atcL1+index">{{ item.atcL1 + '&nbsp;&nbsp;&nbsp;' + item.atcNameL1 }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem> 
                      <FormItem id="addLev2" label="父级ATC"  prop="superiorAtc" style="display :none">
                        <Select v-model="drugAtcForm.superiorAtc"  filterable ref="drugAtcSelect">
                            <OptionGroup label="二级编码">
                                <Option v-for="(item, index) in drugAtcAllList" :value="item.atcL2" :key="item.atcL2+index">{{ item.atcL2 + '&nbsp;&nbsp;&nbsp;' + item.atcNameL2 }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem> 
                      <FormItem id="addLev3" label="父级ATC"  prop="superiorAtc" style="display :none">
                        <Select v-model="drugAtcForm.superiorAtc"  filterable ref="drugAtcSelect">
                            <OptionGroup label="三级编码">
                                <Option v-for="(item, index) in drugAtcAllList" :value="item.atcL3" :key="item.atcL3+index">{{ item.atcL3 + '&nbsp;&nbsp;&nbsp;' + item.atcNameL3 }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>      
                    <FormItem id="addLev4" label="父级ATC"  prop="superiorAtc" style="display :none">
                        <Select v-model="drugAtcForm.superiorAtc" @on-change='getDataLevel' filterable ref="drugAtcSelect">
                            <OptionGroup label="四级编码">
                                <Option v-for="(item, index) in drugAtcAllList" :value="item.atcL4" :key="item.atcL4+index">{{ item.atcL4 + '&nbsp;&nbsp;&nbsp;' + item.atcNameL4 }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem> 
                    <FormItem label="ATC编码" prop="atc">
                        <Input  v-model.trim="drugAtcForm.atc" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="ATC名称" prop="atcName">
                        <Input v-model.trim="drugAtcForm.atcName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="ATC英文名称" prop="atcNameEnglish">
                       <Input v-model.trim="drugAtcForm.atcNameEnglish" :maxlength="60"/>
                    </FormItem>
                    <!-- <FormItem label="数据等级" prop="dataLevel">
                        <Input :value="drugAtcForm.dataLevel" readonly disabled/>
                    </FormItem> -->
                    <FormItem label="备注" >
                        <Input v-model.trim="drugAtcForm.remark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
                </Form>
            </Modal> 
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editDrugAtcInfo" :loading="loading">
            <Form ref="drugAtcForm" :model="drugAtcInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="drugAtcInfo.atc"/>
                    <FormItem label="父级ATC" prop="superiorAtc">
                        <Select  v-model="drugAtcInfo.superiorAtc"  @on-change='getDataLevel' filterable>
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugAtcAllList" :value="item.atcL4" :key="item.atcL4">{{ item.atcL4 + '&nbsp;&nbsp;&nbsp;' + item.atcNameL4 }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="ATC编码" prop="atc">
                        <Input  v-model.trim="drugAtcInfo.atc" :maxlength="12"/>
                    </FormItem>
                    <FormItem label="ATC名称" prop="atcName">
                        <Input  v-model.trim="drugAtcInfo.atcName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="ATC英文名称" prop="atcNameEnglish">
                       <Input  v-model.trim="drugAtcInfo.atcNameEnglish" :maxlength="60"/>
                    </FormItem>
                    <!-- <FormItem label="数据等级">
                        <Input :value="getEditDataLevelText" disabled/>
                    </FormItem> -->
                    <FormItem label="备注">
                        <Input v-model.trim="drugAtcInfo.remark" :maxlength="150" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugAtcOk(3)">
            <Form :model="drugAtcInfo" :label-width="90">
                <input type="hidden" v-model="drugAtcInfo.atc"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugAtcInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugAtcInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
import atcLevel from "@/assets/data/atcLevel.json";
export default {
  name: "drugAtc",
  components: { EmptyRow, CustomTable },
  data() {
    const validateCode = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]/;
      if (!reg.test(value)) {
        callback(new Error("编码由数字、字母组成"));
      } else {
        callback();
      }
    };
    return {
      searchForm:{
          keywords: "",
          statusId: 1,
          atcNameEnglish:""
      },
      editOldAtc:"", // 编辑时的atc老编码
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugAtcForm: {
        atc: "",
        atcName: "",
        atcNameEnglish: "",
        superiorAtc: "",
        superiorLevel:"",
        dataLevel: 5,
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
      drugAtcList: [],
      drugAtcAllList: [],
      checkNoReasonList: [],
      drugAtcInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      noPassModel: false, //弹框状态(不通过)
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
      ruleValidate: {
        atc: [{ required: true, message: "ATC编码不能为空", trigger: "blur" }],
        atcName: [
          { required: true, message: "ATC名称不能为空", trigger: "blur" }
        ],
        superiorAtc: [
          { required: true, message: "请选择父级ATC编码", trigger: "blur" }
        ]
      },
      resourceCol: [
        {
          text: "五级编码",
          name: "atc",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "五级名称",
          name: "atcName",
          sortable: true,
          moveable: true,
          width: 240
        },
        {
          text: "五级英文名称",
          name: "atcNameEnglish",
          sortable: true,
          moveable: true,
          width: 300
        },
       {
          text: "四级编码",
          name: "atcL4",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "四级名称",
          name: "atcNameL4",
          sortable: true,
          moveable: true,
          width: 240
        },
        {
          text: "四级英文名称",
          name: "atcNameEnglishL4",
          sortable: true,
          moveable: true,
          width: 300
        },
        {
          text: "三级编码",
          name: "atcL3",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "三级名称",
          name: "atcNameL3",
          sortable: true,
          moveable: true,
          width: 240
        },
        {
          text: "三级英文名称",
          name: "atcNameEnglishL3",
          sortable: true,
          moveable: true,
          width: 300
        },
        {
          text: "二级编码",
          name: "atcL2",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "二级名称",
          name: "atcNameL2",
          sortable: true,
          moveable: true,
          width: 240
        },
        {
          text: "二级英文名称",
          name: "atcNameEnglishL2",
          sortable: true,
          moveable: true,
          width: 300
        },
        {
          text: "一级编码",
          name: "atcL1",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "一级名称",
          name: "atcNameL1",
          sortable: true,
          moveable: true,
          width: 240
        },
        {
          text: "一级英文名称",
          name: "atcNameEnglishL1",
          sortable: true,
          moveable: true,
          width: 300
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 100,
          render: (params) => {
            if(params.statusId==0){
                return '停用';
            }else if(params.statusId==1){
                return '待审批';
            }else if(params.statusId==2){
                return '通过';
            }else if(params.statusId==3){
                return '不通过';
            }else if(params.statusId==4){
                return '发布';
            }
                return ''
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
          width: 200
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
          width: 200
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
          width: 200
        }
      ]
    };
  },
  mounted: function() {
    this.getDrugAtcList();
    // this.getAllDrugAtcList();
  },
  computed:{
    getAddDataLevelText(){
      if(atcLevel.someProperty("value",this.drugAtcForm.dataLevel)){
        return atcLevel.findProperty("value",this.drugAtcForm.dataLevel).label;
      }
      return "";
    },
    getEditDataLevelText(){
      if(atcLevel.someProperty("value",this.drugAtcInfo.dataLevel)){
        return atcLevel.findProperty("value",this.drugAtcInfo.dataLevel).label;
      }
      return "";
    },
    searchLevelList(){
      return atcLevel.filter(a=>a.value<6 && a.value>0)
    }
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A19",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugAtcInfo.checkNoReason =
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
    confirmSuperior(value){
     var addLev1 = document.getElementById("addLev1")
     var addLev2 = document.getElementById("addLev2")
     var addLev3 =document.getElementById("addLev3")
     var addLev4 =document.getElementById("addLev4")

      if(value==1){
        addLev1.style.display="block";
        addLev2.style.display="none";
        addLev3.style.display="none";
        addLev4.style.display="none";

      }
      else  if(value==2){
        addLev1.style.display="none";
        addLev2.style.display="block";
        addLev3.style.display="none";
        addLev4.style.display="none";

      }
      else  if(value==3){
        addLev1.style.display="none";
        addLev2.style.display="none";
        addLev3.style.display="block";
        addLev4.style.display="none";

      }
      else  if(value==4){
        addLev1.style.display="none";
        addLev2.style.display="none";
        addLev3.style.display="none";
        addLev4.style.display="block";

      }            

    },
    // 根据条件查询第五级的atc
    getDrugAtcList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugAtc.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          atcName: self.searchForm.keywords,
          atcNameEnglish:self.searchForm.atcNameEnglish,
          atc: self.searchForm.atcCode,
          // dataLevel: self.searchForm.dataLevel,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugAtcList = data.data.dataList;
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
    getAllDrugAtcList() {
      // 实际查询的是四级别所有
      var self = this;
      Vue.ajax.send({
        name: "drugAtcL4.list",
        data: {
          pageIndex: 1,
          pageSize: 9999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugAtcAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getDataLevel(value) {
      // console.log(value);
      if (value != "" && value != null) {
        var item = this.drugAtcAllList.filter(x => x.atcL4 == value);
        // this.drugAtcForm.dataLevel = item[0].dataLevel + 1;
        // this.drugAtcInfo.dataLevel = item[0].dataLevel + 1;
        // console.log(item);
        // 新增修改时带出来父级前缀
        this.drugAtcForm.atc = item[0].atcL4;
        this.drugAtcInfo.atc = item[0].atcL4;
      }
      
    },
    getDataGroup(level){
      return (this.drugAtcAllList || []).filter(a=>a.dataLevel==level);
    },
    changePage(currentPage) {
      this.pageConfig.pageNum = currentPage;
      this.getDrugAtcList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugAtcList();
    },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (this.currentSort.column == "dataLevel" || this.currentSort.column == "statusId") {
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
    },
    addModal() {
      //获取所有的Atc数据
      this.$refs["drugAtcFormAdd"].resetFields();
      this.$refs.drugAtcSelect.setQuery(null);

      this.getAllDrugAtcList();
      this.addModel = true;
     
    },
    passOk(item) {
      this.drugAtcInfo = Object.assign({}, item);
      this.drugAtcOk(2);
    },
    noPassOk(item) {
      this.noPassModel = true;
      this.drugAtcInfo = Object.assign({}, item);
      this.getAuditList();
    },
    publishOk(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.atcName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugAtc.review",
            data: {
              atc: self.drugAtcInfo.atc,
              atcName: self.drugAtcInfo.atcName,
              atcNameEnglish: self.drugAtcInfo.atcNameEnglish,
              dataLevel: self.drugAtcInfo.dataLevel,
              superiorAtc: self.drugAtcInfo.superiorAtc,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品ATC信息发布成功");
                self.getDrugAtcList();
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
    startOk(item) {
      this.$Modal.confirm({
        title: "启用确认",
        content: "确定要启用“" + item.atcName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugAtc.review",
            data: {
              atc: item.atc,
              atcName: item.atcName,
              atcNameEnglish: item.atcNameEnglish,
              dataLevel: item.dataLevel,
              superiorAtc: item.superiorAtc,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品atc信息启用成功");

                self.getDrugAtcList();
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
    stopOk(item) {
      this.$Modal.confirm({
        title: "停用确认",
        content: "确定要停用“" + item.atcName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugAtc.review",
            data: {
              atc: item.atc,
              atcName: item.atcName,
              atcNameEnglish: item.atcNameEnglish,
              dataLevel: item.dataLevel,
              superiorAtc: item.superiorAtc,
              statusId: "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品atc信息停用成功");

                self.getDrugAtcList();
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
    editItem(item) {
      this.$refs["drugAtcForm"].resetFields();
      this.editOldAtc = item.atc;
      this.getAllDrugAtcList();
      this.editModel = true;
      this.drugAtcInfo = Object.assign({}, item);
      this.editTitle = "编辑";
      this.okText = "确定";
      this.cancelText = "取消";
    },
    deleteItem(item) {
      if (item.isHaveSubAtc == 1) {
        //如果存在子级则不能删除
            this.$Modal.warning({
                title: "提示",
                content: "该ATC下存在子级，请先删除子级ATC!"
            });
      }else {
        //如果没有子级则可以删除
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.atcName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "drugAtc.del",
              data: {
                atc: item.atc,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("药品ATC信息删除成功");
                  self.getDrugAtcList();
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
    addOk() {
      this.$refs["drugAtcFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugAtc.add",
            data: {
              atc: self.drugAtcForm.atc,
              atcName: self.drugAtcForm.atcName,
              atcNameEnglish: self.drugAtcForm.atcNameEnglish,
              dataLevel:Number(self.drugAtcForm.superiorLevel)+1,
              superiorAtc: self.drugAtcForm.superiorAtc,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.drugAtcForm.remark
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["drugAtcFormAdd"].resetFields();
                self.$Message.success("新增药品ATC提交成功！");
                self.getDrugAtcList();

                self.getAllDrugAtcList();
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
    drugAtcOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugAtc.review",
        data: {
          atc: self.drugAtcInfo.atc,
          atcName: self.drugAtcInfo.atcName,
          atcNameEnglish: self.drugAtcInfo.atcNameEnglish,
          dataLevel: self.drugAtcInfo.dataLevel,
          superiorAtc: self.drugAtcInfo.superiorAtc,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? '' : self.drugAtcInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? '' : self.drugAtcInfo.checkNoReasonMemo
        },
        success: function(data) {
          
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("药品ATC通过信息提交成功！")
              : self.$Message.success("药品ATC不通过信息提交成功！");
            self.getDrugAtcList();
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
    editDrugAtcInfo() {
      this.$refs["drugAtcForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugAtc.edit",
            data: {
              atc: self.drugAtcInfo.atc,
              atcName: self.drugAtcInfo.atcName,
              atcNameEnglish: self.drugAtcInfo.atcNameEnglish,
              dataLevel: self.drugAtcInfo.dataLevel,
              superiorAtc: self.drugAtcInfo.superiorAtc,
              changeUser: Vue.getUser().userName,
              checkUser: self.drugAtcInfo.checkUser,
              statusId: 1,
              remark: self.drugAtcInfo.remark,
              editOldAtc:self.editOldAtc
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$refs["drugAtcForm"].resetFields();
                self.$Message.success(
                  "药品ATC信息" + self.editTitle + "提交成功！"
                );
                self.getDrugAtcList();
                
                self.getAllDrugAtcList();
              } else {
  data.message=
                  "药品ATC信息" + self.editTitle + "出错，可能的原因：编号与其他ATC编号重复！";
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
            },
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
    getDataLevelText(level){
      if(level && level.length>0){
        return "ATC"+level;
      }
      return "";
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