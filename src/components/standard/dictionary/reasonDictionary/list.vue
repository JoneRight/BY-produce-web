<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">系统原因</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    
                    <FormItem label="状态" :label-width="60">
                        <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="系统原因类型" :label-width="100">
                        <Select v-model="searchForm.reasonTypeId" filterable clearable style="width: 200px;">
                            <Option v-for="item in reasonTypeList" :value="item.reasonTypeId" :key="item.reasonTypeId">{{ item.reasonTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="系统原因" :label-width="90">
                        <Input v-model="searchForm.dictionaryName" type="text" placeholder="请输入系统原因" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryReasonDictionaryAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>


            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryReasonDictionaryQuery'" :columnConfig='resourceCol' :columnDatas='reasonDictList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                        <td>
                            <Button v-authorize="'DictionaryReasonDictionaryReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'DictionaryReasonDictionaryReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button>
                            <Button v-authorize="'DictionaryReasonDictionaryEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionaryReasonDictionaryDeleteByKey'" icon="md-close" size="small" title="删除" type="error" class="btn-red"
                                    v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3"  @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                    
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="reasonDictList.length>0">            
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
                
                <Form :model="reasonDictForm" ref="reasonDictFormAdd" :rules="ruleValidate" :label-width="100">
                    <FormItem label="父级原因编码" prop="superDictionaryCode">
                        <Select v-model="reasonDictForm.superDictionaryCode" @on-change='getDataLevel'>
                            <OptionGroup label="0级编码">
                                <Option value="-">-</Option>
                            </OptionGroup>
                            <OptionGroup label="一级编码">
                                <Option  v-for="item in reasonDictAllList" v-if="item.dataLevel==1" :value="item.dictionaryCode" :key="item.dictionaryCode">{{ item.dictionaryName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="系统原因编码" >
                        <Input v-model.trim="reasonDictForm.dictionaryCode" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="系统原因" prop="dictionaryName">
                        <Input v-model.trim="reasonDictForm.dictionaryName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="数据等级">
                        <Input v-model="reasonDictForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="系统原因类型"  prop="reasonTypeId" type="text">
                        <Select v-model="reasonDictForm.reasonTypeId">
                            <Option v-for="item in reasonTypeList" :value="item.reasonTypeId" :key="item.reasonTypeId">{{ item.reasonTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="reasonDictForm.remark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
            </Modal>
            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editReasonDictInfo" :loading="loading" :mask-closable="false">
            <Form ref="reasonDictForm" :model="reasonDictInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="reasonDictInfo.dictionaryKey"/>
                    <FormItem label="父级原因编码" prop="superDictionaryCode">
                        <Select v-model="reasonDictInfo.superDictionaryCode" @on-change='getDataLevel'>
                            <OptionGroup label="0级编码">
                                <Option value="-">-</Option>
                            </OptionGroup>
                            <OptionGroup label="一级编码">
                                <Option  v-for="item in reasonDictAllList" v-if="item.dataLevel==1" :value="item.dictionaryCode" :key="item.dictionaryCode">{{ item.dictionaryName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="系统原因编码">
                        <Input v-model.trim="reasonDictInfo.dictionaryCode" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="系统原因" prop="dictionaryName">
                        <Input v-model.trim="reasonDictInfo.dictionaryName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级">
                        <Input v-model="reasonDictInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="系统原因类型" prop="reasonTypeId" type="text">
                        <Select v-model="reasonDictInfo.reasonTypeId">
                            <Option v-for="item in reasonTypeList" :value="item.reasonTypeId" :key="item.reasonTypeId">{{ item.reasonTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="reasonDictInfo.remark" :maxlength="150" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal> 

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="reasonDictOk(3)">
            <Form :model="reasonDictInfo" :label-width="90">
                <input type="hidden" v-model="reasonDictInfo.dictionaryKey"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="reasonDictInfo.checkNoReason" class="cellLength" filterable>
                    <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="reasonDictInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "reasonDict",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        dictionaryName: "",
        reasonTypeId: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.dictStateList, //数据类型
      reasonDictForm: {
        dictionaryKey: "",
        reasonTypeName: "",
        dictionaryName: "",
        reasonTypeId: "",
        dataLevel: "",
        remark: ""
      },
      loadingAdd: true,
      loading: true,
      reasonDictList: [],
      reasonTypeList: [],
      reasonDictAllList: [],
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      reasonDictInfo: {
        dataLevel: ""
      },
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
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
        dictionaryCode: [
          { required: true, message: "系统原因编码不能为空", trigger: "blur" }
        ],
        dictionaryName: [
          { required: true, message: "系统原因不能为空", trigger: "blur" }
        ],
        reasonTypeId: [
          { required: true, message: "系统原因类型不能为空", trigger: "blur" }
        ]
      },
      resourceCol: [
        {
          text: "编号",
          name: "dictionaryKey",
          sortable: true,
          moveable: true,
          width: 150
        },
        // {
        //     text: "系统原因编码",
        //     name: "dictionaryCode",
        //     sortable: true,
        //     moveable: true,
        //     width: 200
        // },
        {
          text: "系统原因",
          name: "dictionaryName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "系统原因类型名称",
          name: "reasonTypeName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "数据等级",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "父级系统原因编码",
          name: "superDictionaryCode",
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
          width: 200
        }
      ]
    };
  },
  mounted: function() {
    this.getAllReasonDictList();
    this.getReasonDictList();
    this.getReasonTypeList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A30",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.reasonDictInfo.checkNoReason =
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
    getReasonDictList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "reasonDict.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          dictionaryName: self.searchForm.dictionaryName,
          reasonTypeId: self.searchForm.reasonTypeId,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.reasonDictList = data.data.dataList;
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
    getAllReasonDictList() {
      var self = this;
      Vue.ajax.send({
        name: "reasonDict.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.reasonDictAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getReasonTypeList() {
      var self = this;
      Vue.ajax.send({
        name: "reasonType.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.reasonTypeList = data.data.dataList;
            self.reasonTypeList= self.reasonTypeList.filter(x=>x.reasonTypeId!="A01");
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
      this.getReasonDictList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getReasonDictList();
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
          this.currentSort.column == "dictionaryKey" ||
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
    },
    getDataLevel(value) {
      if (value == "-") {
        this.reasonDictForm.dataLevel = 1;
        this.reasonDictInfo.dataLevel = 1;
      } else {
        var item = this.reasonDictAllList.filter(
          x => x.dictionaryCode == value
        );
        this.reasonDictForm.dataLevel = item[0].dataLevel + 1;

        this.reasonDictInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    addModal() {
      this.$refs["reasonDictFormAdd"].resetFields();
      this.reasonDictForm.remark = "";
      this.reasonDictForm.superDictionaryCode = "";
      this.reasonDictForm.dataLevel = "";
      this.reasonDictForm.dictionaryCode = "";
      this.addModel = true;
    },
    editItem(item) {
      this.$refs["reasonDictForm"].resetFields();
      this.editModel = true;
      this.reasonDictInfo = Object.assign({}, item);
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.dictionaryName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "reasonDict.del",
            data: {
              dictionaryKey: item.dictionaryKey
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("系统原因不通过信息删除成功");
                self.getReasonDictList();
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
    passOk(item) {
      this.reasonDictInfo = Object.assign({}, item);
      this.reasonDictOk(2);
    },
    noPassOk(item) {
      this.noPassModel = true;
      this.reasonDictInfo = Object.assign({}, item);
      this.getAuditList();
    },
    addOk() {
      this.$refs["reasonDictFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "reasonDict.add",
            data: {
              dictionaryCode: self.reasonDictForm.dictionaryCode,
              dictionaryName: self.reasonDictForm.dictionaryName,
              reasonTypeId: self.reasonDictForm.reasonTypeId,
              superDictionaryCode: self.reasonDictForm.superDictionaryCode,
              dataLevel: self.reasonDictForm.dataLevel,
              remark: self.reasonDictForm.remark,
              statusId: "1",
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增系统原因信息提交成功！");

                self.getReasonDictList();
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
    reasonDictOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "reasonDict.review",
        data: {
          dictionaryKey: self.reasonDictInfo.dictionaryKey,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.reasonDictInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.reasonDictInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("系统原因通过信息提交成功！")
              : self.$Message.success("系统原因不通过信息提交成功！");

            self.getReasonDictList();
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
    editReasonDictInfo() {
      this.$refs["reasonDictForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "reasonDict.edit",
            data: {
              dictionaryKey: self.reasonDictInfo.dictionaryKey,
              dictionaryCode: self.reasonDictInfo.dictionaryCode,
              dictionaryName: self.reasonDictInfo.dictionaryName,
              superDictionaryCode: self.reasonDictInfo.superDictionaryCode,
              reasonTypeId: self.reasonDictInfo.reasonTypeId,
              dataLevel: self.reasonDictInfo.dataLevel,
              statusId: "1",
              remark: self.reasonDictInfo.remark,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("编辑系统原因信息提交成功！");

                self.getReasonDictList();
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