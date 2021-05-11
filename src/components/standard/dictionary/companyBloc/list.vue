<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">生产企业集团</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                  <FormItem label="状态" :label-width="60">
                      <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                          <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="生产企业集团" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入生产企业集团名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryCompanyBlocAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryCompanyBlocQuery'" :columnConfig='resourceCol' :columnDatas='companyBlocList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                        <td>
                            <Button v-authorize="'DictionaryCompanyBlocReview'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'DictionaryCompanyBlocReview'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button>
                            <!-- <Button v-authorize="'resourceedit'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='publishOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 0" icon="md-play" size="small" title="启用" type="primary" 
                                    class="btn-red" @click='startOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 4" icon="md-remove" size="small" title="停用" type="error" 
                                    class="btn-red" @click='stopOk(item)'></Button> -->
                            <Button v-authorize="'DictionaryCompanyBlocEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionaryCompanyBlocDeleteByKey'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="companyBlocList.length>0">            
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
                
                <Form :model="companyBlocForm" ref="companyBlocFormAdd"  :rules="ruleValidate" :label-width="80">
                    <!-- <FormItem label="生产企业集团编号" prop="blocId">
                        <Input v-model.trim="companyBlocForm.blocId" :maxlength="20"/>
                    </FormItem> -->
                    <FormItem label="生产企业集团" prop="blocName">
                        <Input v-model.trim="companyBlocForm.blocName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="companyBlocForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
            </Modal> 
             <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editBlocInfo" :loading="loading"  :mask-closable="false">
            <Form ref="companyBlocForm" :model="companyBlocInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="companyBlocInfo.blocId"/>
                    <FormItem label="生产企业集团" prop="blocName">
                        <Input v-model.trim="companyBlocInfo.blocName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="companyBlocInfo.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
            </Form> 
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="companyBlocOk(3)">
            <Form :model="companyBlocInfo" :label-width="90">
                <input type="hidden" v-model="companyBlocInfo.blocId"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="companyBlocInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="companyBlocInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "companyBloc",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      searchForm: {
        keywords: "",
        statusId: 1
      },
      companyBlocForm: {
        blocName: "",
        blocId: "",
        remark: ""
      },
      reviewStateList: reviewStateJson.dictStateList, //数据类型
      loadingAdd: true,
      loading: true,
      companyBlocList: [],
      companyBlocInfo: {},
      editModel: false, //弹框状态(编辑)
      addModel: false, //弹框状态(新增)
      checkNoReasonList: [],
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
        blocName: [
          {
            required: true,
            message: "生产企业集团名称不能为空",
            trigger: "blur"
          }
        ]
      },
      resourceCol: [
        {
          text: "生产企业集团编号",
          name: "blocId",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "生产企业集团",
          name: "blocName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 90,
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
    this.getCompanyBlocList();
  },
  methods: {
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A18",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.companyBlocInfo.checkNoReason =
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
    getCompanyBlocList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "companyBloc.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          blocName: self.searchForm.keywords,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.companyBlocList = data.data.dataList;
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
      this.getCompanyBlocList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getCompanyBlocList();
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
    },
    addModal() {
      this.$refs["companyBlocFormAdd"].resetFields();
      this.companyBlocForm.blocName = "";
      this.companyBlocForm.blocId = "";
      this.companyBlocForm.remark = "";
      this.addModel = true;
    },
    passOk(item) {
      this.companyBlocInfo = Object.assign({}, item);
      this.companyBlocOk(2);
    },
    noPassOk(item) {
      this.noPassModel = true;
      this.companyBlocInfo = Object.assign({}, item);
      this.getAuditList();
    },
    editItem(item) {
      this.editModel = true;
      this.companyBlocInfo = Object.assign({}, item);
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.blocName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "companyBloc.del",
            data: {
              blocId: item.blocId,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("生产企业集团集团信息删除成功");
                self.getCompanyBlocList();
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
      this.$refs["companyBlocFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "companyBloc.add",
            data: {
              blocName: self.companyBlocForm.blocName,
              statusId: 1,
              remark: self.companyBlocForm.remark,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;

                self.$Message.success("新增生产企业集团提交成功！");

                self.getCompanyBlocList();
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
    companyBlocOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "companyBloc.review",
        data: {
          blocId: self.companyBlocInfo.blocId,
          statusId: value,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          checkNoReason: value == 2 ? "" : self.companyBlocInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.companyBlocInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            value == 2 ? (self.editModel = false) : (self.noPassModel = false);

            value == 2
              ? self.$Message.success("生产企业集团通过信息提交成功！")
              : self.$Message.success("生产企业集团不通过信息提交成功！");

            self.getCompanyBlocList();
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
    editBlocInfo() {
      this.$refs["companyBlocForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "companyBloc.edit",
            data: {
              blocId: self.companyBlocInfo.blocId,
              blocName: self.companyBlocInfo.blocName,
              statusId: 1,
              remark: self.companyBlocInfo.remark,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("编辑生产企业集团提交成功！");

                self.getCompanyBlocList();
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