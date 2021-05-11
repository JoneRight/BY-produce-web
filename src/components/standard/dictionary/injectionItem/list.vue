<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">注射剂配伍禁忌项</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                  <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="配伍药品" :label-width="70">
                        <Select v-model="searchForm.compatibilityDrug"  filterable clearable  remote :remote-method="getGenericList"> 
                            <Option  v-for="item in genericList" :value="item.drugGenericCode" :key="item.drugGenericCode">{{ item.drugGenericName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="被配伍药品" :label-width="90">
                        <Select v-model="searchForm.sCompatibilityDrug"  filterable clearable  remote :remote-method="getGenericListSComp"> 
                            <Option  v-for="item in genericScompList" :value="item.drugGenericCode" :key="item.drugGenericCode">{{ item.drugGenericName }}</Option>
                        </Select>
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryinjectionItemAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryinjectionItemQuery'" :columnConfig='resourceCol' :columnDatas='injectionList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>

                        <td>
                            <!-- @click='editItem(item)  -->
                            <Button v-authorize="'DictionaryinjectionItemReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'DictionaryinjectionItemReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button>
                            <Button v-authorize="'DictionaryinjectionItemIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='publishOk(item)'></Button>
                            <Button v-authorize="'DictionaryinjectionItemState'" v-show="item.statusId == 0" icon="md-play" size="small" title="启用" type="primary" 
                                    class="btn-red" @click='startOk(item)'></Button>
                            <Button v-authorize="'DictionaryinjectionItemState'" v-show="item.statusId == 4" icon="md-remove" size="small" title="停用" type="error" 
                                    class="btn-red" @click='stopOk(item)'></Button>
                            <Button v-authorize="'DictionaryinjectionItemEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'>
                            </Button>
                            <Button v-authorize="'DictionaryinjectionItemDeleteByKey'" icon="md-close" size="small" title="删除" type="error"
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="injectionList.length>0">            
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
                
                <Form :model="injectionForm" ref="injectionFormAdd"  :rules="ruleValidate" :label-width="100">
                    <FormItem label="配伍药品" prop="compatibilityDrug">
                        <Select v-model="injectionForm.compatibilityDrug"  filterable  remote :remote-method="getGenericList"> 
                            <Option  v-for="item in genericList" :value="item.drugGenericCode" :key="item.drugGenericCode">{{ item.drugGenericName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="被配伍药品" prop="sCompatibilityDrug">
                        <Select v-model="injectionForm.sCompatibilityDrug"  filterable  remote :remote-method="getGenericListSComp"> 
                            <Option  v-for="item in genericScompList" :value="item.drugGenericCode" :key="item.drugGenericCode">{{ item.drugGenericName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否可配伍" prop="isCanCompatibility">
                        <Select v-model="injectionForm.isCanCompatibility" >
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="配伍效果" prop="compatibilityEffect">
                        <Input v-model.trim="injectionForm.compatibilityEffect" :maxlength="150" />
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="injectionForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" />
                    </FormItem>
                </Form>
            </Modal> 

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editInjectionInfo"  :loading="loading">
            <Form ref="injectionForm" :model="injectionInfo" :rules="ruleValidate" :label-width="100">
                    <input v-model="injectionInfo.injectionItemId"  type="hidden"/>
                    <FormItem label="配伍药品" prop="compatibilityDrug">
                        <Select v-model="compatibilityDrugEdit"  filterable @on-change="injectionInfo.compatibilityDrug = compatibilityDrugEdit" remote :remote-method="getGenericList" > 
                            <Option  v-for="item in genericList" :value="item.drugGenericCode" :key="item.drugGenericCode">{{ item.drugGenericName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="被配伍药品" prop="sCompatibilityDrug">
                        <Select v-model="sCompatibilityDrugEdit"  filterable @on-change="injectionInfo.sCompatibilityDrug = sCompatibilityDrugEdit" remote :remote-method="getGenericListSComp" > 
                            <Option  v-for="item in genericScompList" :value="item.drugGenericCode" :key="item.drugGenericCode">{{ item.drugGenericName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="配伍效果" prop="compatibilityEffect">
                        <Input  v-model.trim="injectionInfo.compatibilityEffect" :maxlength="150" />
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="injectionInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="injectionOk(3)">
            <Form :model="injectionInfo" :label-width="90">
                <input type="hidden" v-model="injectionInfo.injectionItemId"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="injectionInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="injectionInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "injection",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm:{
        compatibilityDrug: "",
        sCompatibilityDrug: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      injectionForm: {
        compatibilityDrug: "",
        sCompatibilityDrug: "",
        isCanCompatibility: "",
        compatibilityEffect: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      compatibilityDrugEdit:"",
      sCompatibilityDrugEdit:"",
      loadingAdd: true,
      loading: true,
      injectionList: [],
      genericList: [],
      genericScompList: [],
      checkNoReasonList: [],
      injectionInfo: {},
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
        compatibilityDrug: [
            { required: true, message: "请选择配伍药品", trigger: "blur" }
        ],
        sCompatibilityDrug: [
            { required: true, message: "请选择被配伍药品", trigger: "blur" }
        ],
        isCanCompatibility: [
            { required: true, message: "请选择是否可配伍", trigger: "blur", type: "number" }
        ],
        compatibilityEffect: [
            { required: true, message: "配伍效果不能为空", trigger: "blur" }
        ]
      },
      resourceCol: [
        // {
        //   text: "编号",
        //   name: "injectionItemId",
        //   sortable: true,
        //   moveable: true,
        //   width: 150
        // },
        {
          text: "配伍药品",
          name: "compatibilityDrugName",
          sortable: true,
          moveable: true,
          width: 300
        },
        {
          text: "被配伍药品",
          name: "sCompatibilityDrugName",
          sortable: true,
          moveable: true,
          width: 300
        },
        {
          text: "是否可配伍",
          name: "isCanCompatibility",
          sortable: true,
          moveable: true,
          width: 150,
          render: (params) => {
            if(params.isCanCompatibility==0){
                return '否';
            }else if(params.isCanCompatibility==1){
                return '是';
            }
                return ''
            }
        },
        {
          text: "配伍效果",
          name: "compatibilityEffect",
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
          width: 200
        }
      ]
    };
  },
  mounted: function() {
      this.getInjectionList();
      this.getGenericList('');
      this.getGenericListSComp('');
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A27",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.injectionInfo.checkNoReason =
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
    getGenericList(query) {
                //获取通用名
                var self = this;
                Vue.ajax.send({
                    name: "drugs.genericList",
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
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
                        self.genericList.forEach(item => {
                          if(item.drugGenericCode === self.injectionInfo.compatibilityDrug){
                            self.compatibilityDrugEdit = item.drugGenericCode;
                            self.injectionInfo.compatibilityDrug = self.compatibilityDrugEdit;
                          }
                        });
                    }
        });
    },
    getGenericListSComp(query) {
                //获取通用名
                var self = this;
                Vue.ajax.send({
                    name: "drugs.genericList",
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        drugGenericName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.genericScompList = data.data;
                            
                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                        self.genericScompList.forEach(item => {
                          if(item.drugGenericCode === self.injectionInfo.sCompatibilityDrug){
                            self.sCompatibilityDrugEdit = item.drugGenericCode;
                            self.injectionInfo.sCompatibilityDrug = self.sCompatibilityDrugEdit;
                          }
                        });
                    }
        });
    },
    getInjectionList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "injection.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          compatibilityDrug: self.searchForm.compatibilityDrug,
          sCompatibilityDrug: self.searchForm.sCompatibilityDrug,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.injectionList = data.data.dataList;
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
      this.getInjectionList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getInjectionList();
    },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (this.currentSort.column == "injectionItemId" || this.currentSort.column == "statusId" 
          || this.currentSort.column == "isCanCompatibility") {
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
        this.$refs["injectionFormAdd"].resetFields();
        this.injectionForm.remark = "";
        this.addModel = true;
        // //获取配伍药品
        // this.getGenericList('');
        // //获取被配伍药品
        // this.getGenericListSComp('');
    },
    passOk(item) {
      //审核通过
      this.injectionInfo = Object.assign({}, item);
      this.injectionOk(2);
    },
    noPassOk(item) {
      //审核不通过
      this.noPassModel = true;
      this.injectionInfo = Object.assign({}, item);
      this.getAuditList();
    },
    publishOk(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.compatibilityDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "injection.review",
            data: {
              injectionItemId: item.injectionItemId,
              compatibilityDrug: item.compatibilityDrug,
              sCompatibilityDrug: item.sCompatibilityDrug,
              compatibilityEffect: item.compatibilityEffect,
              isCanCompatibility: item.isCanCompatibility,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("注射配伍禁忌事项信息发布成功");
                self.getInjectionList();
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
      //启用
      this.$Modal.confirm({
        title: "启用确认",
        content: "确定要启用“" + item.compatibilityDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "injection.review",
            data: {
              injectionItemId: item.injectionItemId,
              compatibilityDrug: item.compatibilityDrug,
              sCompatibilityDrug: item.sCompatibilityDrug,
              compatibilityEffect: item.compatibilityEffect,
              isCanCompatibility: item.isCanCompatibility,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("注射配伍禁忌事项信息启用成功");
                self.getInjectionList();
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
      //停用
      this.$Modal.confirm({
        title: "停用确认",
        content:  "确定要停用“" + item.compatibilityDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "injection.review",
            data: {
              injectionItemId: item.injectionItemId,
              compatibilityDrug: item.compatibilityDrug,
              sCompatibilityDrug: item.sCompatibilityDrug,
              compatibilityEffect: item.compatibilityEffect,
              isCanCompatibility: item.isCanCompatibility,
              statusId: "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("注射配伍禁忌事项信息停用成功");
                self.getInjectionList();
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
      Vue.set(this,"injectionInfo",Object.assign({}, item));
      this.$refs["injectionForm"].resetFields();
      // //获取配伍药品
      this.getGenericList(item.compatibilityDrugName);
      //根据被配伍药品名称，获取被配伍药品数据
      this.getGenericListSComp(item.sCompatibilityDrugName);

      this.editTitle = "编辑";
      this.okText = "确定";
      this.cancelText = "取消";
      this.editModel = true;
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.compatibilityDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "injection.del",
            data: {
              injectionItemId: item.injectionItemId,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("注射配伍禁忌事项信息删除成功");
                self.getInjectionList();
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
      this.$refs["injectionFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "injection.add",
            data: {
              compatibilityDrug: self.injectionForm.compatibilityDrug,
              sCompatibilityDrug: self.injectionForm.sCompatibilityDrug,
              compatibilityEffect: self.injectionForm.compatibilityEffect,
              isCanCompatibility: self.injectionForm.isCanCompatibility,
              statusId: 1,
              remark: self.injectionForm.remark,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["injectionFormAdd"].resetFields();
                self.$Message.success("新增注射配伍禁忌项提交成功！");
                self.getInjectionList();
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
    injectionOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "injection.review",
        data: {
          injectionItemId: self.injectionInfo.injectionItemId,
          compatibilityDrug: self.injectionInfo.compatibilityDrug,
          sCompatibilityDrug: self.injectionInfo.sCompatibilityDrug,
          compatibilityEffect: self.injectionInfo.compatibilityEffect,
          isCanCompatibility: self.injectionInfo.isCanCompatibility,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? '' : self.injectionInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? '' : self.injectionInfo.checkNoReasonMemo
        },
        success: function(data) {
          
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("注射配伍禁忌项通过信息提交成功！")
              : self.$Message.success("注射配伍禁忌项不通过信息提交成功！");
            self.getInjectionList();
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
    editInjectionInfo() {
      this.$refs["injectionForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "injection.edit",
            data: {
              injectionItemId: self.injectionInfo.injectionItemId,
              compatibilityDrug: self.compatibilityDrugEdit,
              sCompatibilityDrug: self.sCompatibilityDrugEdit,
              compatibilityEffect: self.injectionInfo.compatibilityEffect,
              isCanCompatibility: self.injectionInfo.isCanCompatibility,
              changeUser: Vue.getUser().userName,
              checkUser: self.injectionInfo.checkUser,
              statusId: 1,
              remark: self.injectionInfo.remark
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$refs["injectionForm"].resetFields();
                self.$Message.success(
                  "注射配伍禁忌项" + self.editTitle + "成功！"
                );
                

                self.getInjectionList();
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