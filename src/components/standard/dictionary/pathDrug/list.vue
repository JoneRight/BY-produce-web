<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">给药途径</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                  <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                  <FormItem label="数据等级" :label-width="70">
                        <Select v-model="searchForm.dataLevel" filterable clearable style="width: 160px;">
                            <Option :value="0">0</Option>
                            <Option :value="1">1</Option>
                            <Option :value="2">2</Option>
                        </Select>
                    </FormItem>
                    
                    <FormItem label="给药途径名称" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入给药途径名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionarypathDrugAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionarypathDrugQuery'" :columnConfig='resourceCol' :columnDatas='pathDrugList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>

                        <td>
                            <Button v-authorize="'DictionarypathDrugReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'DictionarypathDrugReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button>
                            <Button v-authorize="'DictionarypathDrugIssus'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='publishOk(item)'></Button>
                            <Button v-authorize="'DictionarypathDrugState'" v-show="item.statusId == 0" icon="md-play" size="small" title="启用" type="primary" 
                                    class="btn-red" @click='startOk(item)'></Button>
                            <Button v-authorize="'DictionarypathDrugState'" v-show="item.statusId == 4" icon="md-remove" size="small" title="停用" type="error" 
                                    class="btn-red" @click='stopOk(item)'></Button>
                            <Button v-authorize="'DictionarypathDrugEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionarypathDrugDeleteByKey'" icon="md-close" size="small" title="删除" type="error" class="btn-red" 
                                    v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3"  @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="pathDrugList.length>0">            
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
                
                <Form :model="pathDrugForm" ref="pathDrugFormAdd"  :rules="ruleValidate" :label-width="130">
                    <FormItem label="父级给药途径" prop="superPathDrug">
                        <Select v-model="pathDrugForm.superPathDrug" @on-change='getDataLevel'>
                            <OptionGroup label="0级编码">
                                <Option  v-for="item in pathDrugAllList" v-if="item.dataLevel==0" :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级编码">
                                <Option  v-for="item in pathDrugAllList" v-if="item.dataLevel==1" :value="item.pathDrug" :key="item.pathDrug">{{ '&nbsp;&nbsp;&nbsp;' + item.pathDrugName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径编码" prop="pathDrug">
                        <Input v-model.trim="pathDrugForm.pathDrug" :maxlength="10"/>
                    </FormItem>
                    <FormItem label="给药途径名称" prop="pathDrugName">
                        <Input v-model.trim="pathDrugForm.pathDrugName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="给药途径英文名称" prop="englishAb">
                        <Input v-model.trim="pathDrugForm.englishAb" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="数据等级">
                        <Input v-model="pathDrugForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="pathDrugForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
                </Form>
            </Modal> 

             <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal"  @on-ok="editPathDrugnfo" :loading="loading">
            <Form ref="pathDrugForm" :model="pathDrugInfo" :rules="ruleValidate" :label-width="130">
                    <input type="hidden" v-model="pathDrugInfo.pathDrug"/>
                    <FormItem label="父级给药途径" prop="superPathDrug">
                        <Select v-model="pathDrugInfo.superPathDrug" @on-change='getDataLevel'>
                            <OptionGroup label="0级编码">
                                <Option  v-for="item in pathDrugAllList" v-if="item.dataLevel==0" :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级编码">
                                <Option  v-for="item in pathDrugAllList" v-if="item.dataLevel==1" :value="item.pathDrug" :key="item.pathDrug">{{ '&nbsp;&nbsp;&nbsp;' + item.pathDrugName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径名称" prop="pathDrugName">
                        <Input v-model.trim="pathDrugInfo.pathDrugName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="给药途径英文名称" prop="englishAb">
                        <Input v-model.trim="pathDrugInfo.englishAb" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级">
                        <Input v-model="pathDrugInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="pathDrugInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal> 
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="pathDrugOk(3)">
            <Form :model="pathDrugInfo" :label-width="90">
                <input type="hidden" v-model="pathDrugInfo.pathDrug"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="pathDrugInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="pathDrugInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "pathDrug",
  components: { EmptyRow, CustomTable },
  data() {
    const validateEngPath = (rule, value, callback) => {
      var reg = /^[a-zA-Z]/;
      if (!reg.test(value)) {
        callback(new Error("请输入字母"));
      } else {
        callback();
      }
    };
    return {
      tableH: 0,
      searchForm:{
          keywords: "",
          statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      pathDrugForm: {
        pathDrug: "",
        pathDrugName: "",
        englishAb: "",
        dataLevel: "",
        superPathDrug: "",
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
      pathDrugList: [],
      pathDrugAllList: [],
      checkNoReasonList: [],
      pathDrugInfo: {
        dataLevel: ""
      },
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
        pathDrugName: [
          { required: true, message: "给药途径名称不能为空", trigger: "blur" }
        ],
        pathDrug: [
          { required: true, message: "给药途径编码不能为空", trigger: "blur" }
        ],
        superPathDrug: [
          { required: true, message: "请选择父级给药途径", trigger: "blur" }
        ]
      },
      resourceCol: [
        {
          text: "给药途径编码",
          name: "pathDrug",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "给药途径名称",
          name: "pathDrugName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "给药途径英文名称",
          name: "englishAb",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "数据等级",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "父级给药途径编码",
          name: "superPathDrug",
          sortable: true,
          moveable: true,
          width: 160
        },
        {
          text: "父级给药途径",
          name: "superPathDrugName",
          sortable: true,
          moveable: true,
          width: 150
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
                return '';
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
    this.getPathDrugList();
    this.getAllPathDrugList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A12",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.pathDrugInfo.checkNoReason =
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
    getPathDrugList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "pathDrug.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          pathDrugName: self.searchForm.keywords,
          dataLevel: self.searchForm.dataLevel,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.pathDrugList = data.data.dataList;
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
      this.getPathDrugList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getPathDrugList();
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
    getDataLevel(value) {
      if (value != "" && value != null) {
          var item = this.pathDrugAllList.filter(x => x.pathDrug == value);
          this.pathDrugForm.dataLevel = item[0].dataLevel + 1;

          this.pathDrugInfo.dataLevel = item[0].dataLevel + 1;
      }
      
    },
    getAllPathDrugList() {
      var self = this;
      Vue.ajax.send({
        name: "pathDrug.list",
        data: {
          pageIndex: 1,
          pageSize: 999999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.pathDrugAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    addModal() {
      this.$refs["pathDrugFormAdd"].resetFields();
      this.pathDrugForm.remark = "";
      this.pathDrugForm.englishAb = "";
      this.addModel = true;
    },
    passOk(item) {
      this.pathDrugInfo = Object.assign({}, item);
      this.pathDrugOk(2);
    },
    noPassOk(item) {
      this.noPassModel = true;
      this.pathDrugInfo = Object.assign({}, item);
      this.getAuditList();
    },
    publishOk(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "pathDrug.review",
            data: {
              pathDrug: item.pathDrug,
              pathDrugName: item.pathDrugName,
              englishAb: item.englishAb,
              dataLevel: item.dataLevel,
              superPathDrug: item.superPathDrug,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("给药途径信息发布成功");
                self.getPathDrugList();
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
        content: "确定要启用“" + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "pathDrug.review",
            data: {
              pathDrug: item.pathDrug,
              pathDrugName: item.pathDrugName,
              englishAb: item.englishAb,
              dataLevel: item.dataLevel,
              superPathDrug: item.superPathDrug,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("给药途径信息启用成功");
                self.getPathDrugList();
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
        content: "确定要停用“" + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "pathDrug.review",
            data: {
              pathDrug: item.pathDrug,
              pathDrugName: item.pathDrugName,
              englishAb: item.englishAb,
              dataLevel: item.dataLevel,
              superPathDrug: item.superPathDrug,
              statusId: "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("给药途径信息停用成功");
                self.getPathDrugList();
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
      this.$refs["pathDrugForm"].resetFields();
      this.editModel = true;
      this.pathDrugInfo = Object.assign({}, item);
      this.editTitle = "编辑";
      this.okText = "确定";
      this.cancelText = "取消";
    },
    deleteItem(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
            this.$Modal.warning({
                title: "提示",
                content: "该给药途径下存在子级，请先删除子级给药途径!"
            });
      }else {
        this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "pathDrug.del",
            data: {
              pathDrug: item.pathDrug,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("给药途径信息删除成功");
                self.getPathDrugList();
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
      this.$refs["pathDrugFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "pathDrug.add",
            data: {
              pathDrug: self.pathDrugForm.pathDrug,
              pathDrugName: self.pathDrugForm.pathDrugName,
              englishAb: self.pathDrugForm.englishAb,
              dataLevel: self.pathDrugForm.dataLevel,
              superPathDrug: self.pathDrugForm.superPathDrug,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.pathDrugForm.remark
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["pathDrugFormAdd"].resetFields();
                self.$Message.success("新增给药途径提交成功！");
                self.getPathDrugList();

                self.getAllPathDrugList();
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
    pathDrugOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "pathDrug.review",
        data: {
          pathDrug: self.pathDrugInfo.pathDrug,
          pathDrugName: self.pathDrugInfo.pathDrugName,
          englishAb: self.pathDrugInfo.englishAb,
          dataLevel: self.pathDrugInfo.dataLevel,
          superPathDrug: self.pathDrugInfo.superPathDrug,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? '' : self.pathDrugInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? '' : self.pathDrugInfo.checkNoReasonMemo
        },
        success: function(data) {
          
          if (!!data && data.code == "0") {
            self.editModel = false;
            self.$Message.success("给药途径信息审核成功！");
            self.getPathDrugList();
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
    editPathDrugnfo() {
      this.$refs["pathDrugForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "pathDrug.edit",
            data: {
              pathDrug: self.pathDrugInfo.pathDrug,
              pathDrugName: self.pathDrugInfo.pathDrugName,
              englishAb: self.pathDrugInfo.englishAb,
              dataLevel: self.pathDrugInfo.dataLevel,
              superPathDrug: self.pathDrugInfo.superPathDrug,
              changeUser: Vue.getUser().userName,
              checkUser: self.pathDrugInfo.checkUser,
              statusId: 1,
              remark: self.pathDrugInfo.remark
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("给药途径信息审核成功！");
                self.getPathDrugList();

                self.getAllPathDrugList();
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