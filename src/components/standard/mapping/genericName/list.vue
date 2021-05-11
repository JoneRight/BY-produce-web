<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
        <h2 class="common-title">通用名</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="通用名" :label-width="90">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入通用名" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedGenericNameAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>

         <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedGenericNameList'" :columnConfig='genericCol' :columnDatas='genericList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in genericCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{genericCol.find(m=>m.name==col.name).render?genericCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedGenericNameAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='genericInfo = Object.assign({},item);genericOk(2);'></Button>
                  <Button v-authorize="'MappedGenericNameAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;genericInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedGenericNameEdit'" class='btn-green' icon="md-create" 
                        size="small" title="编辑" type="success" @click='editModel = true;genericInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  
                  <Button v-authorize="'MappedGenericNameIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedGenericNameState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedGenericNameDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="genericList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

        <!-- 新增弹框 -->
        <Modal v-model="addModel" title="新增" class-name="vertical-center-modal" @on-ok="addOk" :loading="loadingAdd"  :mask-closable="false">
                
                <Form :model="genericForm" ref="genericFormAdd" :rules="ruleValidate" :label-width="80">
                    
                    <FormItem label="通用名名称" prop="drugGenericName">
                        <Input v-model.trim="genericForm.drugGenericName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="通用名别名">
                        <Input v-model.trim="genericForm.drugGenericNameAb" :maxlength="60" />
                    </FormItem>
                    <FormItem label="通用名英文名称">
                        <Input v-model.trim="genericForm.drugGenericNameEn" :maxlength="300" />
                    </FormItem>
                    <FormItem label="ATC"  prop="atc">
                        <Select v-model="genericForm.atc" filterable ref="addSelect1">
                            <!-- <OptionGroup label="0级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==0"  :value="item.atc" :key="item.atc">{{ item.atcName }}</Option>
                            </OptionGroup> -->
                            <!-- <OptionGroup label="一级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==1"  :value="item.atc" :key="item.atc">{{ '&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==2"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==3"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==4"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="五级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==5"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup> -->
                             <OptionGroup label="五级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==5"  :value="item.atc" :key="item.atc">{{ item.atc + '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="SDCC" prop="sdcc">
                        <Select  v-model="genericForm.sdcc" filterable ref="addSelect2">
                            <!-- <OptionGroup label="一级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==1"  :value="item.sdcc" :key="item.sdcc">{{ item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==2"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==3"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==4"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup> -->
                            <OptionGroup label="五级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==5"  :value="item.sdcc" :key="item.sdcc">{{ item.sdcc + '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            
                        </Select>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="genericForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" 
              @on-ok="editGenericInfo" :loading="loading"  :mask-closable="false">
            <Form ref="genericForm" :model="genericInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="genericForm.drugGenericCode"/>
                    <FormItem label="通用名" prop="drugGenericName">
                        <Input v-model.trim="genericInfo.drugGenericName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="通用名别名">
                        <Input v-model.trim="genericInfo.drugGenericNameAb" :maxlength="60" />
                    </FormItem>
                    <FormItem label="通用名英文名称">
                        <Input v-model.trim="genericInfo.drugGenericNameEn" :maxlength="300" />
                    </FormItem>
                    <FormItem label="ATC"  prop="atc">
                        <Select v-model="genericInfo.atc" filterable>
                            <!-- <OptionGroup label="0级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==0"  :value="item.atc" :key="item.atc">{{ item.atcName }}</Option>
                            </OptionGroup> -->
                            <!-- <OptionGroup label="一级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==1"  :value="item.atc" :key="item.atc">{{ '&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==2"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==3"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==4"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup> -->
                             <OptionGroup label="五级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==5"  :value="item.atc" :key="item.atc">{{ item.atc + '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="SDCC" prop="sdcc">
                        <Select  v-model="genericInfo.sdcc" filterable>
                            <!-- <OptionGroup label="一级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==1"  :value="item.sdcc" :key="item.sdcc">{{ item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==2"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==3"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==4"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup> -->
                            <OptionGroup label="五级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==5"  :value="item.sdcc" :key="item.sdcc">{{ item.sdcc + '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="genericInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="genericOk(3)">
            <Form :model="genericInfo" :label-width="90">
                <input type="hidden" v-model="genericInfo.drugGenericCode"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="genericInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="genericInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "generic",
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
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      drugAtcAllList: [],
      drugSdccAllList: [],
      searchForm:{
          keywords: "",
          statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      genericForm: {
        drugGenericCode: "",
        drugGenericName: "",
        atc: "",
        sdcc: "",
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
      genericList: [],
      genericInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        drugGenericName: [
          { required: true, message: "通用名不能为空", trigger: "blur" }
        ],
        atc: [
          { required: true, message: "atc不能为空", trigger: "blur" }
        ],
        sdcc: [
          { required: true, message: "sdcc不能为空", trigger: "blur" }
        ]
      },
      genericCol: [
        {
          text: "编号",
          name: "drugGenericCode",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "通用名名称",
          name: "drugGenericName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "通用名别名",
          name: "drugGenericNameAb",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "通用名英文名称",
          name: "drugGenericNameEn",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "ATC编码",
          name: "atc",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "ATC名称",
          name: "atcName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "SDCC编码",
          name: "sdcc",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "SDCC名称",
          name: "sdccName",
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
            }else {
                return '';
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
          text: "审核不通过备注",
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
  mounted: function() {
    this.getGenericList();
    this.getAllDrugAtcList();
    this.getAllDrugSdccList();
  },
  methods: {
      //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A33",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
              self.checkNoReasonList = data.data.dataList;
              self.genericInfo.checkNoReason = self.checkNoReasonList[0].dictionaryName;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getAllDrugAtcList() {
      var self = this;
      Vue.ajax.send({
        name: "drugAtc.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
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
    getAllDrugSdccList() {
      var self = this;
      Vue.ajax.send({
        name: "drugSdcc.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
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
    getGenericList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "generic.list",
        data: {
          drugGenericName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.genericList = data.data.dataList;
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
      this.getGenericList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getGenericList();
    },
    addModal() {
      this.$refs["genericFormAdd"].resetFields();
      this.genericForm.remark = "";
      this.genericForm.drugGenericNameAb = "";
      this.genericForm.drugGenericNameEn = "";
      this.addModel = true;
      this.$refs.addSelect1.setQuery(null);
      this.$refs.addSelect2.setQuery(null);
    },
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.drugGenericName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "generic.del",
            data: {
              drugGenericCode: item.drugGenericCode,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("通用名信息删除成功");
                self.getGenericList();
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
            ? "确定要启用“" + item.drugGenericName + "”？"
            : "确定要停用“" + item.drugGenericName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "generic.review",
            data: {
              drugGenericCode: item.drugGenericCode,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("通用名信息启用成功")
                  : self.$Message.info("通用名信息停用成功");
                self.getGenericList();
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
        content: "确定要发布“" + item.drugGenericName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "generic.review",
            data: {
              drugGenericCode: item.drugGenericCode,
              statusId: 4,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("通用名信息发布成功");
                self.getGenericList();
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
      this.$refs["genericFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "generic.add",
            data: {
              drugGenericName: self.genericForm.drugGenericName,
              drugGenericNameAb: self.genericForm.drugGenericNameAb,
              drugGenericNameEn: self.genericForm.drugGenericNameEn,
              atc: self.genericForm.atc,
              sdcc: self.genericForm.sdcc,
              statusId: 1,
              remark: self.genericForm.remark,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["genericFormAdd"].resetFields();
                self.genericForm.remark = "";
                self.$Message.success("新增通用名提交成功！");
                self.getGenericList();
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
    genericOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "generic.review",
        data: {
          drugGenericCode: self.genericInfo.drugGenericCode,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? '' : self.genericInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? '' : self.genericInfo.checkNoReasonMemo
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

            value == 2
              ? self.$Message.success("通用名通过信息提交成功！")
              : self.$Message.success("通用名不通过信息提交成功！");
            //刷新页面
            self.getGenericList();
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    editGenericInfo() {
      this.$refs["genericForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "generic.edit",
            data: {
                drugGenericCode: self.genericInfo.drugGenericCode,
                drugGenericName: self.genericInfo.drugGenericName,
                drugGenericNameAb: self.genericInfo.drugGenericNameAb,
                drugGenericNameEn: self.genericInfo.drugGenericNameEn,
                atc: self.genericInfo.atc,
                sdcc: self.genericInfo.sdcc,
                statusId: 1,
                remark: self.genericInfo.remark,
                changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("通用名信息编辑成功！");
                self.getGenericList();
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

