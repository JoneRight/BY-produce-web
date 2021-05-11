<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">临床给药途径</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <!-- <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option value="0">停用</Option>
                        <Option value="1">待审批</Option>
                        <Option value="2">通过</Option>
                        <Option value="3">不通过</Option>
                        <Option value="4">发布/启用</Option>
                    </Select> -->
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="给药途径名称" :label-width="100">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入给药途径名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedPathDrugPresAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedPathDrugPresList'" :columnConfig='pathDrugPreCol' :columnDatas='pathDrugPreList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in pathDrugPreCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{pathDrugPreCol.find(m=>m.name==col.name).render?pathDrugPreCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedPathDrugPresAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='pathDrugPreInfo = Object.assign({},item);pathDrugPreOk(2);'></Button>
                  <Button v-authorize="'MappedPathDrugPresAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;pathDrugPreInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedPathDrugPresEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;pathDrugPreInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  <Button v-authorize="'MappedPathDrugPresIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedPathDrugPresState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedPathDrugPresDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>

            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="pathDrugPreList.length>0">            
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
                
                <Form :model="pathDrugPreForm" ref="pathDrugPreFormAdd" :rules="ruleValidate" :label-width="110">
                     <FormItem label="父级给药途径">
                        <Select v-model="pathDrugPreForm.superPathDrug" @on-change="getDataLevel">
                            <OptionGroup label="0级给药途径">
                                <Option v-for="item in pathDrugPreAllList" v-if="item.dataLevel==0"  :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级给药途径">
                                <Option v-for="item in pathDrugPreAllList" v-if="item.dataLevel==1"  :value="item.pathDrug" :key="item.pathDrug">{{ '&nbsp;&nbsp;' +  item.pathDrugName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径编号" prop="pathDrug">
                        <Input v-model.trim="pathDrugPreForm.pathDrug" :maxlength="10" />
                    </FormItem>
                    <FormItem label="给药途径名称" prop="pathDrugName">
                        <Input v-model.trim="pathDrugPreForm.pathDrugName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="pathDrugPreForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="pathDrugPreForm.remark"  :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editPathDrugPreInfo" :loading="loading">
            <Form ref="pathDrugPreForm" :model="pathDrugPreInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="pathDrugPreInfo.pathDrug"/>
                    <FormItem label="父级给药途径">
                        <Select v-model="pathDrugPreInfo.superPathDrug" @on-change="getDataLevel">
                            <OptionGroup label="0级给药途径">
                                <Option v-for="item in pathDrugPreAllList" v-if="item.dataLevel==0"  :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级给药途径">
                                <Option v-for="item in pathDrugPreAllList" v-if="item.dataLevel==1"  :value="item.pathDrug" :key="item.pathDrug">{{ '&nbsp;&nbsp;' +  item.pathDrugName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径名称" prop="pathDrugName">
                        <Input v-model.trim="pathDrugPreInfo.pathDrugName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="pathDrugPreInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="pathDrugPreInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>         
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="pathDrugPreOk(3)">
            <Form :model="pathDrugPreInfo" :label-width="90">
                <input type="hidden" v-model="pathDrugPreInfo.pathDrug"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="pathDrugPreInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="pathDrugPreInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "pathDrugPre",
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
      tableH: 0,
      searchForm: {
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      pathDrugPreForm: {
        pathDrug: "",
        pathDrugName: "",
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
      pathDrugPreList: [],
      pathDrugPreAllList: [],
      pathDrugPreInfo: {},
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
        pathDrug: [
          {
            required: true,
            message: "临床给药途径编号不能为空",
            trigger: "blur"
          }
        ],
        pathDrugName: [
          {
            required: true,
            message: "临床给药途径名称不能为空",
            trigger: "blur"
          }
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
      pathDrugPreCol: [
        {
          text: "编号",
          name: "pathDrug",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "给药途径名称",
          name: "pathDrugName",
          sortable: true,
          moveable: true,
          width: 160
        },
        {
          text: "数据等级",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 150
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
          width: 160
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
          filterable: false,
          removeable: false,
          width: 180
        }
      ]
    };
  },
  mounted: function() {
    this.getPathDrugPreList();
    this.getAllPathDrugPreList();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该临床给药途径下存在子级，请先删除子级临床给药途径!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.pathDrugName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "pathDrugPre.del",
              data: {
                pathDrug: item.pathDrug,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("给药途径信息删除成功");
                  self.getPathDrugPreList();
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
            ? "确定要启用“" + item.pathDrugName + "”？"
            : "确定要停用“" + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "pathDrugPre.review",
            data: {
              pathDrug: item.pathDrug,
              pathDrugName: item.pathDrugName,
              dataLevel: item.dataLevel,
              superPathDrug: item.superPathDrug,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("临床给药途径信息启用成功")
                  : self.$Message.info("临床给药途径信息停用成功");
                self.getPathDrugPreList();
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
        content: "确定要发布“" + item.pathDrugName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "pathDrugPre.review",
            data: {
              pathDrug: item.pathDrug,
              pathDrugName: item.pathDrugName,
              dataLevel: item.dataLevel,
              superPathDrug: item.superPathDrug,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("临床给药途径信息发布成功");
                self.getPathDrugPreList();
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
          reasonTypeId: "A39",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.pathDrugPreInfo.checkNoReason =
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
    getAllPathDrugPreList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "pathDrugPre.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.pathDrugPreAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getPathDrugPreList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "pathDrugPre.list",
        data: {
          pathDrugName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.pathDrugPreList = data.data.dataList;
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
      this.getPathDrugPreList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getPathDrugPreList();
    },
    addModal() {
      this.$refs["pathDrugPreFormAdd"].resetFields();
      this.pathDrugPreForm.remark = "";
      this.pathDrugPreForm.superPathDrug = "";
      this.addModel = true;
    },
    getDataLevel(value) {
      if (value != "" && value != null) {
        var item = this.pathDrugPreAllList.filter(x => x.pathDrug == value);
        this.pathDrugPreForm.dataLevel = item[0].dataLevel + 1;

        this.pathDrugPreInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    addOk() {
      this.$refs["pathDrugPreFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "pathDrugPre.add",
            data: {
              pathDrug: self.pathDrugPreForm.pathDrug,
              pathDrugName: self.pathDrugPreForm.pathDrugName,
              dataLevel: self.pathDrugPreForm.dataLevel,
              superPathDrug: self.pathDrugPreForm.superPathDrug,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.pathDrugPreForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增临床给药途径提交成功！");

                //刷新页面
                self.getPathDrugPreList();

                self.getAllPathDrugPreList();
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
    pathDrugPreOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "pathDrugPre.review",
        data: {
          pathDrug: self.pathDrugPreInfo.pathDrug,
          pathDrugName: self.pathDrugPreInfo.pathDrugName,
          dataLevel: self.pathDrugPreInfo.dataLevel,
          superPathDrug: self.pathDrugPreInfo.superPathDrug,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.pathDrugPreInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.pathDrugPreInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("临床给药途径通过信息提交成功！")
              : self.$Message.success("临床给药途径不通过信息提交成功！");
            //刷新页面
            self.getPathDrugPreList();
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
    editPathDrugPreInfo() {
      this.$refs["pathDrugPreForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "pathDrugPre.edit",
            data: {
              pathDrug: self.pathDrugPreInfo.pathDrug,
              pathDrugName: self.pathDrugPreInfo.pathDrugName,
              dataLevel: self.pathDrugPreInfo.dataLevel,
              superPathDrug: self.pathDrugPreInfo.superPathDrug,
              changeUser: Vue.getUser().userName,
              checkUser: self.pathDrugPreInfo.checkUser,
              statusId: 1,
              remark: self.pathDrugPreInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success(
                  "临床给药途径信息" + self.editTitle + "成功！"
                );
                //刷新页面
                self.getPathDrugPreList();

                self.getAllPathDrugPreList();
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
