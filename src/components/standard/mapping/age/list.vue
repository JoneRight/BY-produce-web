<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">年龄</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		       <FormItem label="年龄范围" :label-width="80">
                    <Select v-model="searchForm.ageRangeId" filterable clearable  style="width: 160px;">
                        <Option v-for="item in rangeList" :value="item.ageRangeId" :key="item.ageRangeId">{{ item.ageRangeName }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="年龄区间" :label-width="70">
                    <Select v-model="searchForm.growPeriodId" filterable clearable  style="width: 160px;">
                        <Option v-for="item in growList" :value="item.growPeriodId" :key="item.growPeriodId">{{ item.growPeriodName }}</Option>
				    </Select>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedAgeAdd'" type="primary"  @click="addModel = true">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedAgeList'" :columnConfig='ageCol' :columnDatas='ageList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in ageCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{ageCol.find(m=>m.name==col.name).render?ageCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedAgeAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='ageInfo = Object.assign({},item);ageOk(2);'></Button>
                  <Button v-authorize="'MappedAgeAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;ageInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedAgeEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;ageInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  
                  <Button v-authorize="'MappedAgeIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedAgeState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedAgeDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>    
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="ageList.length>0">            
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
                
                <Form :model="ageForm" ref="ageFormAdd" :rules="ruleValidate" :label-width="80">
                    <FormItem label="年龄编号" prop="age">
                        <Input v-model.trim="ageForm.age" :maxlength="9" />
                    </FormItem>
                    <FormItem label="年龄名称" prop="ageName">
                        <Input v-model.trim="ageForm.ageName"  :maxlength="15"/>
                    </FormItem>
                    <FormItem label="年龄范围" prop="ageRangeId">
                        <Select v-model="ageForm.ageRangeId" filterable >
                            <Option v-for="item in rangeList" :value="item.ageRangeId" :key="item.ageRangeId">{{ item.ageRangeName }}</Option>
				        </Select>
                    </FormItem>
                    <FormItem label="年龄区间" prop="growPeriodId">
                        <Select v-model="ageForm.growPeriodId" filterable >
                            <Option v-for="item in growList" :value="item.growPeriodId" :key="item.growPeriodId">{{ item.growPeriodName }}</Option>
				        </Select>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="ageForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel"  :title="editTitle" class-name="vertical-center-modal" @on-ok="editAgeInfo" :loading="loading">
                <Form ref="ageFormEdit" :model="ageInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="ageInfo.age"/>
                    <FormItem label="年龄名称" prop="ageName">
                        <Input v-model.trim="ageInfo.ageName" :maxlength="15" />
                    </FormItem>
                    <FormItem label="年龄范围" prop="ageRangeId">
                        <Select v-model="ageInfo.ageRangeId" filterable >
                            <Option v-for="item in rangeList" :value="item.ageRangeId" :key="item.ageRangeId">{{ item.ageRangeName }}</Option>
				        </Select>
                    </FormItem>
                    <FormItem label="年龄期间" prop="growPeriodId">
                        <Select v-model="ageInfo.growPeriodId" filterable >
                            <Option v-for="item in growList" :value="item.growPeriodId" :key="item.growPeriodId">{{ item.growPeriodName }}</Option>
				        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="ageInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
                </Form>
        </Modal>   
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="ageOk(3)">
            <Form :model="ageInfo" :label-width="90">
                <input type="hidden" v-model="ageInfo.age"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="ageInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="ageInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "age",
  components: { EmptyRow, CustomTable },
  data() {
    const validateAge = (rule, value, callback) => {
      var reg = /^[0-9]/;
      if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      tableH: 0,
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      ageForm: {
        age: "",
        ageName: "",
        ageRangeName: "",
        growPeriodName: "",
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
      ageList: [],
      rangeList: [],
      growList: [],
      ageInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        age: [{ required: true, message: "年龄编号不能为空", trigger: "blur" }],
        ageName: [
          { required: true, message: "年龄名称不能为空", trigger: "blur" }
          // { validator: validateAge, trigger: 'blur'}
        ],
        ageRangeId: [
          { required: true, message: "年龄范围不能为空", trigger: "blur" }
        ],
        growPeriodId: [
          { required: true, message: "年龄区间不能为空", trigger: "blur" }
        ]
      },
      ageCol: [
        {
          text: "年龄编号",
          name: "age",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "年龄名称",
          name: "ageName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "年龄范围",
          name: "ageRangeName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "年龄区间",
          name: "growPeriodName",
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
          filterable: false,
          removeable: false,
          name: "op",
          width: 180
        }
      ]
    };
  },
  mounted: function() {
    this.getAgeList();
    this.getAgeRangeList();
    this.getAgeGrowPeriodList();
  },
  methods: {
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.ageName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "age.del",
            data: {
              age: item.age,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("年龄信息删除成功");
                self.getAgeList();
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
            ? "确定要启用“" + item.ageName + "”？"
            : "确定要停用“" + item.ageName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "age.review",
            data: {
              age: item.age,
              ageName: item.ageName,
              ageRangeName: item.ageRangeName,
              growPeriodName: item.growPeriodName,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("年龄信息启用成功")
                  : self.$Message.info("年龄信息停用成功");
                self.getAgeList();
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
        content: "确定要发布“" + item.ageName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "age.review",
            data: {
              age: item.age,
              ageName: item.ageName,
              ageRangeName: item.ageRangeName,
              growPeriodName: item.growPeriodName,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("年龄信息发布成功");
                self.getAgeList();
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
          reasonTypeId: "A08",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.ageInfo.checkNoReason =
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
    getAgeList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "age.list",
        data: {
          ageRangeId: self.searchForm.ageRangeId,
          growPeriodId: self.searchForm.growPeriodId,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.ageList = data.data.dataList;
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
    getAgeRangeList() {
      var self = this;
      Vue.ajax.send({
        name: "age.rangeList",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.rangeList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getAgeGrowPeriodList() {
      var self = this;
      Vue.ajax.send({
        name: "age.growList",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.growList = data.data.dataList;
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
      this.getAgeList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getAgeList();
    },
    addOk() {
      this.$refs["ageFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "age.add",
            data: {
              age: self.ageForm.age,
              ageName: self.ageForm.ageName,
              ageRangeId: self.ageForm.ageRangeId,
              growPeriodId: self.ageForm.growPeriodId,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.ageForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["ageFormAdd"].resetFields();
                self.$Message.success("新增年龄提交成功！");

                self.ageForm.ageName = "";
                self.ageForm.growingPeriod = "";
                self.ageForm.remark = "";
                self.getAgeList();
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
    ageOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "age.review",
        data: {
          age: self.ageInfo.age,
          ageName: self.ageInfo.ageName,
          ageRangeId: self.ageInfo.ageRangeId,
          growPeriodId: self.ageInfo.growPeriodId,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.ageInfo.checkNoReason,
          checkNoReasonMemo: value == 2 ? "" : self.ageInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("年龄通过信息提交成功！")
              : self.$Message.success("年龄不通过信息提交成功！");

            self.getAgeList();
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
    editAgeInfo() {
      this.$refs["ageFormEdit"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "age.edit",
            data: {
              age: self.ageInfo.age,
              ageName: self.ageInfo.ageName,
              ageRangeId: self.ageInfo.ageRangeId,
              growPeriodId: self.ageInfo.growPeriodId,
              changeUser: Vue.getUser().userName,
              checkUser: self.ageInfo.checkUser,
              statusId: 1,
              remark: self.ageInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("年龄信息" + self.editTitle + "成功！");
                self.getAgeList();
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
        if (this.currentSort.column == "statusId") {
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