<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">药品SDCC分类</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    
                    <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <!-- <FormItem label="数据等级" :label-width="70">
                        <Select v-model="searchForm.dataLevel" filterable clearable style="width: 160px;">
                            <Option :value="0">0</Option>
                            <Option :value="1">1</Option>
                            <Option :value="2">2</Option>
                            <Option :value="3">3</Option>
                            <Option :value="4">4</Option>
                            <Option :value="5">5</Option>
                        </Select>
                    </FormItem> -->
                    <FormItem label="SDCC名称" :label-width="80">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入SDCC名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryDrugTypeSdccAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryDrugTypeSdccQuery'" :columnConfig='resourceCol' :columnDatas='drugSdccList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                       <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                        <td>
                            <Button v-authorize="'DictionaryDrugTypeSdccOperation'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeSdccOperation'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeSdccIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='publishOk(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeSdccState'" v-show="item.statusId == 0" icon="md-play" size="small" title="启用" type="primary" 
                                    class="btn-red" @click='startOk(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeSdccState'" v-show="item.statusId == 4" icon="md-remove" size="small" title="停用" type="error" 
                                    class="btn-red" @click='stopOk(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeSdccEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionaryDrugTypeSdccDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="drugSdccList.length>0">            
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
                
                <Form :model="drugSdccForm" ref="drugSdccFormAdd" :rules="ruleValidate" :label-width="110">
                    <FormItem label="父级SDCC" prop="superiorSdcc">
                        <Select  v-model="drugSdccForm.superiorSdcc" @on-change='getDataLevel' filterable ref="addSelect1">
                            <!-- <OptionGroup label="一级编码">
                                <Option v-for="item in getDrugSdccLevel(0)" :value="item.sdcc" :key="item.sdcc">{{ item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in getDrugSdccLevel(1)" :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in getDrugSdccLevel(2)" :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup> -->
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugSdccAllList" :value="item.sdccL4" :key="item.sdccL4">{{ item.sdccL4 + '&nbsp;&nbsp;&nbsp;' + item.sdccNameL4 }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="SDCC编码" prop="sdcc">
                        <Input  v-model.trim="drugSdccForm.sdcc" :maxlength="9" />
                    </FormItem>
                    <FormItem label="SDCC名称" prop="sdccName">
                        <Input  v-model.trim="drugSdccForm.sdccName" :maxlength="60" />
                    </FormItem>
                    <!-- <FormItem label="数据等级">
                        <Input  v-model.trim="drugSdccForm.dataLevel" :disabled="true"/>
                    </FormItem> -->
                    <FormItem label="备注" >
                        <Input  v-model.trim="drugSdccForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
                </Form>
            </Modal> 
            <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editDrugSdccInfo" :loading="loading" >
            <Form ref="drugSdccForm" :model="drugSdccInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="drugSdccInfo.sdcc"/>
                    <FormItem label="父级SDCC" prop="superiorSdcc">
                        <Select  v-model="drugSdccInfo.superiorSdcc" @on-change='getDataLevel' filterable>
                            <!-- <OptionGroup label="一级编码">
                                <Option v-for="item in getDrugSdccLevel(0)" :value="item.sdcc" :key="item.sdcc">{{ item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in getDrugSdccLevel(1)" :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in getDrugSdccLevel(2)" :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup> -->
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugSdccAllList" :value="item.sdccL4" :key="item.sdccL4">{{ item.sdccL4 + '&nbsp;&nbsp;&nbsp;' + item.sdccNameL4 }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="SDCC编码" prop="atc">
                        <Input  v-model.trim="drugSdccInfo.sdcc" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="SDCC名称" prop="sdccName">
                        <Input  v-model.trim="drugSdccInfo.sdccName" :maxlength="60"/>
                    </FormItem>
                    <!-- <FormItem label="数据等级">
                        <Input  v-model.trim="drugSdccInfo.dataLevel" :disabled="true"/>
                    </FormItem> -->
                    <FormItem label="备注">
                        <Input  v-model.trim="drugSdccInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="drugSdccOk(3)">
            <Form :model="drugSdccInfo" :label-width="90">
                <input type="hidden" v-model="drugSdccInfo.sdcc"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="drugSdccInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="drugSdccInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "drugSdcc",
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
          statusId: 1
      },
      editOldSdcc:"", // 编辑时的sdcc老编码
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      drugSdccForm: {
        sdcc: "",
        sdccName: "",
        superiorSdcc: "",
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
      drugSdccList: [],
      drugSdccAllList: [],
      checkNoReasonList: [],
      drugSdccInfo: {},
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
        sdccName: [
          { required: true, message: "SDCC名称不能为空", trigger: "blur" }
        ],
        dataLevel: [
          { required: true, message: "请选择数据等级", trigger: "blur" }
        ],
        sdcc: [
          { required: true, message: "SDCC编码不能为空", trigger: "blur" }
        ],
        superiorSdcc: [
          { required: true, message: "请选择父级SDCC编码", trigger: "blur" }
        ]
      },
      resourceCol: [
        {
          text: "五级编码",
          name: "sdcc",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "五级名称",
          name: "sdccName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "四级编码",
          name: "sdccL4",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "四级名称",
          name: "sdccNameL4",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "三级编码",
          name: "sdccL3",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "三级名称",
          name: "sdccNameL3",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "二级编码",
          name: "sdccL2",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "二级名称",
          name: "sdccNameL2",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "一级编码",
          name: "sdccL1",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "一级名称",
          name: "sdccNameL1",
          sortable: true,
          moveable: true,
          width: 200
        },
        // {
        //   text: "数据等级",
        //   name: "dataLevel",
        //   sortable: true,
        //   moveable: true,
        //   width: 100
        // },
        // {
        //   text: "父级sdcc编码",
        //   name: "superiorSdcc",
        //   sortable: true,
        //   moveable: true,
        //   width: 100
        // },
        // {
        //   text: "父级sdcc",
        //   name: "superiorSdccName",
        //   sortable: true,
        //   moveable: true,
        //   width: 200
        // },
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
    this.getDrugSdccList();
    // this.getAllDrugSdccList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A22",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.drugSdccInfo.checkNoReason =
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
    // 根据条件查询第五级的atc
    getDrugSdccList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugSdcc.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          sdccName: self.searchForm.keywords,
          // dataLevel: self.searchForm.dataLevel,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugSdccList = data.data.dataList;
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
    getDataLevel(value) {
      if (value != "" && value != null) {
          var item = this.drugSdccAllList.filter(x => x.sdccL4 == value);
          // this.drugSdccForm.dataLevel = item[0].dataLevel + 1;

          // this.drugSdccInfo.dataLevel = item[0].dataLevel + 1;
          this.drugSdccForm.sdcc = item[0].sdccL4;
          this.drugSdccInfo.sdcc = item[0].sdccL4;
      }
     
    },
    getDrugSdccLevel(level){
      return this.drugSdccAllList.filter(a=>a.dataLevel==level)
    },
    getAllDrugSdccList() {
       // 实际查询的是四级别所有
      var self = this;
      Vue.ajax.send({
        name: "drugSdccL4.list",
        data: {
          pageIndex: 1,
          pageSize: 9999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugSdccAllList = data.data.dataList;
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
      this.getDrugSdccList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugSdccList();
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
      this.getAllDrugSdccList();
      this.addModel = true;
      this.$refs["drugSdccFormAdd"].resetFields();
      this.$refs.addSelect1.setQuery(null);
    },
    passOk(item) {
      this.drugSdccInfo = Object.assign({}, item);
      this.drugSdccOk(2);
    },
    noPassOk(item) {
      this.noPassModel = true;
      this.drugSdccInfo = Object.assign({}, item);
      this.getAuditList();
    },
    publishOk(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.sdccName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugSdcc.review",
            data: {
              sdcc: item.sdcc,
              sdccName: item.sdccName,
              sdccNameEnglish: item.sdccNameEnglish,
              dataLevel: item.dataLevel,
              superiorSdcc: item.superiorSdcc,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品SDCC信息发布成功");
                self.getDrugSdccList();
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
        content: "确定要启用“" + item.sdccName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugSdcc.review",
            data: {
              sdcc: item.sdcc,
              sdccName: item.sdccName,
              sdccNameEnglish: item.sdccNameEnglish,
              dataLevel: item.dataLevel,
              superiorSdcc: item.superiorSdcc,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品SDCC信息启用成功");
                self.getDrugSdccList();
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
        content: "确定要停用“" + item.sdccName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "drugSdcc.review",
            data: {
              sdcc: item.sdcc,
              sdccName: item.sdccName,
              sdccNameEnglish: item.sdccNameEnglish,
              dataLevel: item.dataLevel,
              superiorSdcc: item.superiorSdcc,
              statusId: 0,
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("药品SDCC信息停用成功");
                self.getDrugSdccList();
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
      this.$refs["drugSdccForm"].resetFields();
      this.editOldSdcc = item.sdcc;
      this.getAllDrugSdccList();
      this.editModel = true;
      this.drugSdccInfo = Object.assign({}, item);
      this.editTitle = "编辑";
      this.okText = "确定";
      this.cancelText = "取消";
    },
    deleteItem(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
            this.$Modal.warning({
                title: "提示",
                content: "该SDCC下存在子级，请先删除子级SDCC!"
            });
      }else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.sdccName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "drugSdcc.del",
              data: {
                sdcc: item.sdcc,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("药品SDCC信息删除成功");
                  self.getDrugSdccList();
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
      this.$refs["drugSdccFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugSdcc.add",
            data: {
              sdcc: self.drugSdccForm.sdcc,
              sdccName: self.drugSdccForm.sdccName,
              sdccNameEnglish: self.drugSdccForm.sdccNameEnglish,
              dataLevel: self.drugSdccForm.dataLevel,
              superiorSdcc: self.drugSdccForm.superiorSdcc,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.drugSdccForm.remark
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["drugSdccFormAdd"].resetFields();
                self.$Message.success("新增药品SDCC提交成功！");
                self.getDrugSdccList();

                self.getAllDrugSdccList();
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
    drugSdccOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "drugSdcc.review",
        data: {
          sdcc: self.drugSdccInfo.sdcc,
          sdccName: self.drugSdccInfo.sdccName,
          sdccNameEnglish: self.drugSdccInfo.sdccNameEnglish,
          dataLevel: self.drugSdccInfo.dataLevel,
          superiorSdcc: self.drugSdccInfo.superiorSdcc,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? '' : self.drugSdccInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? '' : self.drugSdccInfo.checkNoReasonMemo
        },
        success: function(data) {
          
          if (!!data && data.code == "0") {
            self.noPassModel = false;
            value == 2
              ? self.$Message.success("药品SDCC通过信息提交成功！")
              : self.$Message.success("药品SDCC不通过信息提交成功！");
            self.getDrugSdccList();
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
    editDrugSdccInfo() {
      this.$refs["drugSdccForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugSdcc.edit",
            data: {
              sdcc: self.drugSdccInfo.sdcc,
              sdccName: self.drugSdccInfo.sdccName,
              sdccNameEnglish: self.drugSdccInfo.sdccNameEnglish,
              dataLevel: self.drugSdccInfo.dataLevel,
              superiorSdcc: self.drugSdccInfo.superiorSdcc,
              changeUser: Vue.getUser().userName,
              checkUser: self.drugSdccInfo.checkUser,
              statusId: 1,
              remark: self.drugSdccInfo.remark,
              editOldSdcc:self.editOldSdcc
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("药品SDCC信息审核成功！");
                self.getDrugSdccList();

                self.getAllDrugSdccList();
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