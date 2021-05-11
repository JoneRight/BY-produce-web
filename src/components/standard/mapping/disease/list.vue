<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">疾病</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		       <FormItem label="数据等级" :label-width="70">
                    <Select v-model="searchForm.dataLevel" filterable clearable style="width: 100px;">
                        <Option value="0">0</Option>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                    </Select>
                </FormItem>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.diseaseStatus" filterable clearable style="width: 100px;">
                        <Option value="0">停用</Option>
                        <Option value="1">待审批</Option>
                        <Option value="2">通过</Option>
                        <Option value="3">不通过</Option>
                        <Option value="4">发布/启用</Option>
                    </Select>
                </FormItem>
            	<FormItem label="疾病编码" :label-width="70">
		            <Input v-model="searchForm.diseaseType" type="text" placeholder="请输入疾病编码" style="width: 160px;" />
		        </FormItem>
		        <FormItem label="疾病名称" :label-width="70">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入疾病名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedDiseaseAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedDiseaseList'" :columnConfig='diseaseCol' :columnDatas='diseaseList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in diseaseCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{diseaseCol.find(m=>m.name==col.name).render?diseaseCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedDiseaseAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='diseaseInfo = Object.assign({},item);diseaseOk(2);'></Button>
                  <Button v-authorize="'MappedDiseaseAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;diseaseInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedDiseaseEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" 
                            @click='editItem(item)'></Button>
                  
                  <Button v-authorize="'MappedDiseaseIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedDiseaseState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedDiseaseDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="diseaseList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div> 
        
        
        

        <!-- 新增弹框 -->
        <Modal v-model="addModel" title="新增" class-name="vertical-center-modal"  @on-ok="addOk" :loading="loadingAdd" >
                
                <Form :model="diseaseForm" ref="diseaseFormAdd" :rules="ruleValidate" :label-width="80">
                    <FormItem label="父级疾病">
                        <Select v-model="diseaseForm.superiorDiseaseType" filterable clearable
                         remote :remote-method="searchDiseaseList" :loading="loadingSearch" @on-change="getDataLevel">
                            <OptionGroup label="0级疾病" >
                                <Option  value="-" key="-"> - </Option>
                            </OptionGroup>
                            <OptionGroup label="一级疾病"  >
                                <Option  v-for="item in diseaseFirstList" :value="item.diseaseType" :key="item.diseaseType">{{ item.diseaseTypeName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级疾病"  >
                                <Option  v-for="item in diseaseSecondList" :value="item.diseaseType" :key="item.diseaseType">{{ '&nbsp;&nbsp;&nbsp;' + item.diseaseTypeName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="疾病名称编号" prop="diseaseType">
                        <Input v-model.trim="diseaseForm.diseaseType" :maxlength="20" />
                    </FormItem>
                    <FormItem label="疾病名称" prop="diseaseTypeName">
                        <Input v-model.trim="diseaseForm.diseaseTypeName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="疾病别名">
                        <Input v-model.trim="diseaseForm.diseaseTypeNameAb" :maxlength="150"/>
                    </FormItem>
                    <FormItem label="疾病名称字母简写">
                        <Input v-model.trim="diseaseForm.diseaseTypeNameShort" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="数据等级">
                        <Input v-model.trim="diseaseForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注" :label-width="80">
                        <Input v-model.trim="diseaseForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"   />
                    </FormItem>
                </Form>
            </Modal>

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editDiseaseInfo" :loading="loading">
            <Form ref="diseaseForm" :model="diseaseInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="diseaseInfo.diseaseType"  />
                    <FormItem label="父级疾病">
                        <Select v-model="superiorDiseaseTypeEdit" filterable clearable
                         remote :remote-method="searchDiseaseList" :loading="loadingEditSearch"  @on-change="getDataLevel" >
                            <OptionGroup label="0级疾病" >
                                <Option  value="-" key="-"> - </Option>
                            </OptionGroup>
                            <OptionGroup label="一级疾病"  >
                                <Option  v-for="item in diseaseFirstList" :value="item.diseaseType" :key="item.diseaseType">{{ item.diseaseTypeName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级疾病"  >
                                <Option  v-for="item in diseaseSecondList" :value="item.diseaseType" :key="item.diseaseType">{{ '&nbsp;&nbsp;&nbsp;' + item.diseaseTypeName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="疾病名称" prop="diseaseTypeName">
                        <Input v-model.trim="diseaseInfo.diseaseTypeName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="疾病别名">
                        <Input v-model.trim="diseaseInfo.diseaseTypeNameAb" :maxlength="150" />
                    </FormItem>
                    <FormItem label="疾病名称字母简写">
                        <Input v-model.trim="diseaseInfo.diseaseTypeNameShort" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="diseaseInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="diseaseInfo.remark" :maxlength="60"  type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="diseaseOk(3)">
            <Form :model="diseaseInfo" :label-width="90">
                <input type="hidden" v-model="diseaseInfo.diseaseType"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="diseaseInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="diseaseInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "disease",
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
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      superiorDiseaseTypeEdit: "",
      dataLevel: "",
      diseaseForm: {
        diseaseType: "",
        diseaseTypeName: "",
        diseaseTypeNameAb: "",
        diseaseTypeNameShort: "",
        dataLevel: "",
        superiorDiseaseType: "",
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
      loadingSearch: false,
      loadingEditSearch: false,
      loadingSelectAdd: false,
      diseaseList: [],
      diseaseAllList: [],
      diseaseFirstList: [],
      diseaseSecondList: [],
      diseaseInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        diseaseTypeName: [
          { required: true, message: "疾病名称不能为空", trigger: "blur" }
        ],
        diseaseType: [
          { required: true, message: "数据名称编号不能为空", trigger: "blur" }
        ],
        dataLevel: [
          {
            required: true,
            message: "数据等级不能为空",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      diseaseCol: [
        {
          text: "疾病编号",
          name: "diseaseType",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "疾病名称",
          name: "diseaseTypeName",
          sortable: true,
          moveable: true,
          width: 300
        },
        {
          text: "疾病名称别名",
          name: "diseaseTypeNameAb",

          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "疾病名称字母简写",
          name: "diseaseTypeNameShort",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "数据级别",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "父级疾病编码",
          name: "superiorDiseaseType",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "父级疾病",
          name: "superiorDiseaseTypeName",
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
          width: 180,
          filterable: false,
          removeable: false
        }
      ]
    };
  },
  mounted: function() {
    this.getDiseaseList();
    this.getAllDiseaseList();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该疾病下存在子级，请先删除子级疾病!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.diseaseTypeName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "disease.del",
              data: {
                diseaseType: item.diseaseType,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("疾病信息删除成功");
                  self.getDiseaseList();
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
            ? "确定要启用“" + item.diseaseTypeName + "”？"
            : "确定要停用“" + item.diseaseTypeName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "disease.review",
            data: {
              diseaseType: item.diseaseType,
              diseaseTypeName: item.diseaseTypeName,
              diseaseTypeNameAb: item.diseaseNameAb,
              diseaseTypeNameShort: item.diseaseTypeNameShort,
              dataLevel: item.dataLevel,
              superiorDiseaseType: item.superiorDiseaseType,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("疾病信息启用成功")
                  : self.$Message.info("疾病信息停用成功");
                self.getDiseaseList();
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
        content: "确定要发布“" + item.diseaseTypeName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "disease.review",
            data: {
              diseaseType: item.diseaseType,
              diseaseTypeName: item.diseaseTypeName,
              diseaseTypeNameAb: item.diseaseNameAb,
              diseaseTypeNameShort: item.diseaseTypeNameShort,
              dataLevel: item.dataLevel,
              superiorDiseaseType: self.diseaseForm.superiorDiseaseType,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("疾病信息发布成功");
                self.getDiseaseList();
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
          reasonTypeId: "A03",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.diseaseInfo.checkNoReason =
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
    getDiseaseList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "disease.list",
        data: {
          dataLevel: self.searchForm.dataLevel,
          diseaseTypeName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.diseaseStatus,
          diseaseType: self.searchForm.diseaseType
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.diseaseList = data.data.dataList;
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
      this.getDiseaseList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDiseaseList();
    },
    getDataLevel(value) {
      this.diseaseInfo.superiorDiseaseType = this.superiorDiseaseTypeEdit;
      if (value == "-") {
        this.diseaseForm.dataLevel = 1;
        this.diseaseInfo.dataLevel = 1;
      } else if (value != "" && value != null) {
        this.getAllDiseaseList(value);
        var item = this.diseaseAllList.filter(x => x.diseaseType == value);
        this.diseaseForm.dataLevel = item[0].dataLevel + 1;
        this.diseaseInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    getAllDiseaseList(value) {
      var self = this;
      Vue.ajax.send({
        name: "disease.list",
        data: {
          pageIndex: 1,
          pageSize: 99,
          diseaseTypeName: value
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.diseaseAllList = data.data.dataList;

            self.diseaseFirstList = self.diseaseAllList.filterProperty(
              "dataLevel",
              1
            );
            self.diseaseSecondList = self.diseaseAllList.filterProperty(
              "dataLevel",
              2
            );
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    searchDiseaseList(query) {
      if (!!query && query.length > 0) {
        query = query.trim();
      }
      var self = this;
      Vue.ajax.send({
        name: "disease.keyWordList",
        data: {
          pageIndex: 1,
          pageSize: 99,
          diseaseTypeName: query,
          diseaseType: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.diseaseAllList = data.data.dataList;
            self.diseaseFirstList = self.diseaseAllList.filterProperty(
              "dataLevel",
              1
            );
            self.diseaseSecondList = self.diseaseAllList.filterProperty(
              "dataLevel",
              2
            );
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
          self.diseaseAllList.forEach(item => {
            if (item.diseaseType === self.diseaseInfo.superiorDiseaseType) {
              self.superiorDiseaseTypeEdit = item.diseaseType;
              self.diseaseInfo.superiorDiseaseType =
                self.superiorDiseaseTypeEdit;
            }
          });
        }
      });
    },
    searchDiseaseListForEdit(query) {
      var self = this;
      Vue.ajax.send({
        name: "disease.keyWordList",
        data: {
          pageIndex: 1,
          pageSize: 99,
          diseaseType: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.diseaseAllList = data.data.dataList;

            self.diseaseFirstList = self.diseaseAllList.filter(
              item => item.dataLevel == 1
            );
            self.diseaseSecondList = self.diseaseAllList.filter(
              item => item.dataLevel == 2
            );

            self.superiorDiseaseTypeEdit = self.diseaseInfo.superiorDiseaseType;
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
      this.$refs["diseaseFormAdd"].resetFields();
      this.diseaseForm.remark = "";
      this.diseaseForm.diseaseNameAb = "";
      this.diseaseForm.nameShort = "";
      this.diseaseForm.superiorDiseaseType = "";
      this.diseaseForm.diseaseTypeNameAb = "";
      this.diseaseForm.diseaseTypeNameShort = "";
      this.diseaseForm.dataLevel = "";
      this.diseaseAllList = [];
      this.addModel = true;
    },
    editItem(item) {
      Vue.set(this, "diseaseInfo", Object.assign({}, item));
      this.$refs["diseaseForm"].resetFields();

      this.diseaseInfo = Object.assign({}, item);
      this.searchDiseaseListForEdit(item.superiorDiseaseType);
      this.editTitle = "编辑";
      this.okText = "确定";
      this.cancelText = "取消";
      this.editModel = true;
    },
    addOk() {
      this.$refs["diseaseFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "disease.add",
            data: {
              diseaseType: self.diseaseForm.diseaseType,
              diseaseTypeName: self.diseaseForm.diseaseTypeName,
              diseaseTypeNameAb: self.diseaseForm.diseaseNameAb,
              diseaseTypeNameShort: self.diseaseForm.diseaseTypeNameShort,
              dataLevel: self.diseaseForm.dataLevel,
              superiorDiseaseType: self.diseaseForm.superiorDiseaseType,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.diseaseForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增疾病提交成功！");

                //刷新页面
                self.getDiseaseList();

                self.getAllDiseaseList();
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
    diseaseOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "disease.review",
        data: {
          diseaseType: self.diseaseInfo.diseaseType,
          diseaseTypeName: self.diseaseInfo.diseaseTypeName,
          diseaseTypeNameAb: self.diseaseInfo.diseaseTypeNameAb,
          diseaseTypeNameShort: self.diseaseInfo.diseaseTypeNameShort,
          dataLevel: self.diseaseInfo.dataLevel,
          superiorDiseaseType: self.diseaseInfo.superiorDiseaseType,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.diseaseInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.diseaseInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("疾病通过信息提交成功！")
              : self.$Message.success("疾病不通过信息提交成功！");
            //刷新页面
            self.getDiseaseList();
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
    editDiseaseInfo() {
      this.$refs["diseaseForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "disease.edit",
            data: {
              diseaseType: self.diseaseInfo.diseaseType,
              diseaseTypeName: self.diseaseInfo.diseaseTypeName,
              diseaseTypeNameAb: self.diseaseInfo.diseaseTypeNameAb,
              diseaseTypeNameShort: self.diseaseInfo.diseaseTypeNameShort,
              dataLevel: self.diseaseInfo.dataLevel,
              superiorDiseaseType: self.superiorDiseaseTypeEdit,
              changeUser: Vue.getUser().userName,
              checkUser: self.diseaseInfo.checkUser,
              statusId: 1,
              remark: self.diseaseInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("疾病信息" + self.editTitle + "成功！");
                //刷新页面
                self.getDiseaseList();

                self.getAllDiseaseList();
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
