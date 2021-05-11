<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">药品商品名</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                  <!-- <FormItem label="状态" :label-width="60"> -->
<!--                         <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                            <Option value="0">停用</Option>
                            <Option value="1">待审批</Option>
                            <Option value="2">通过</Option>
                            <Option value="3">不通过</Option>
                            <Option value="4">发布/启用</Option>
                        </Select> -->
                    <!-- </FormItem> -->
                    <FormItem label="药品企业" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入药品名称" style="width: 260px;" />
                    </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryDrugTradeQuery'" :columnConfig='resourceCol' :columnDatas='drugTradeList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                        <td>
<!--                             <Button v-authorize="'resourceedit'" v-show="item.statusId == 1" icon="md-checkmark-circle" size="small" title="通过" type="success" 
                                    class="btn-green" @click='passOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 1" icon="md-close-circle" size="small" title="不通过" type="error" 
                                    class="btn-red" @click='noPassOk(item)'></Button> -->
                            <!-- <Button v-authorize="'resourceedit'" v-show="item.statusId == 2" icon="md-paper-plane" size="small" title="发布" type="warning" 
                                    class="btn-red" @click='publishOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 0" icon="md-play" size="small" title="启用" type="primary" 
                                    class="btn-red" @click='startOk(item)'></Button>
                            <Button v-authorize="'resourceedit'" v-show="item.statusId == 4" icon="md-remove" size="small" title="停用" type="error" 
                                    class="btn-red" @click='stopOk(item)'></Button> -->
                            <Button v-authorize="'DictionaryDrugTradeEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
<!--                             <Button v-authorize="'resourcedelete'" icon="md-close" size="small" title="删除" type="error" 
                                    class="btn-red" @click='deleteItem(item)'></Button> -->
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="drugTradeList.length>0">            
                        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                        <Button type="text" class="fr" @click="showModal=true">
                            <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                            <span style="font-size:13px;"> 设置显示列</span>
                        </Button>
                    </div>
                </div>
            </div>
            

            <!-- 新增弹框 -->
<!--             <Modal v-model="addModel" title="新增" class-name="vertical-center-modal"  @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="drugTradeForm" ref="drugTradeFormAdd"  :rules="ruleValidate" :label-width="80">
                    <FormItem label="药品编号" prop="drugcompanyId">
                        <Input v-model.trim="drugTradeForm.drugcompanyId" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="企业编号" prop="drugTradeName">
                        <Input v-model.trim="drugTradeForm.drugTradeName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="drugTradeForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
            </Modal>  -->
             <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editBlocInfo" :loading="loading"  :mask-closable="false">
            <Form ref="drugTradeForm" :model="drugTradeInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="drugTradeInfo.drugcompanyId"/>
                    <FormItem label="数据跨度" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" format="yyyy年MM月"  v-model="drugTradeInfo.startYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                        <span class="pl10 pr10">至</span>
                        <DatePicker placeholder="请选择结束年月" format="yyyy年MM月"   v-model="drugTradeInfo.stopYearmonth"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="drugTradeInfo.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
            </Form> 
        </Modal>
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../../common/EmptyRow";
import CustomTable from "../../../common/GridTable";
export default {
  name: "drugTrade",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      tableH: 0,
      searchForm: {
        keywords: ""
      },
      drugTradeForm: {
        startYearmonth: "",
        stopYearmonth: "",
        drugcompanyId: "",
        remark: ""
      },
      loadingAdd: true,
      loading: true,
      drugTradeList: [],
      drugTradeInfo: {},
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
          startYearmonth: [
                  {
                    required: true,
                    message: "开始时间不能为空",
                    trigger: "change",
                    pattern: /.+/ 
                  }
                ],
                stopYearmonth: [
                  {
                    required: true,
                    message: "结束时间不能为空",
                    trigger: "change",
                    pattern: /.+/ 
                  }
                ]
      },
      resourceCol: [
        {
          text: "药品编号",
          name: "drug",
          sortable: true,
          moveable: true,
          width: 180
        },
        {
          text: "药品名称",
          name: "drugName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "药品商品名编号",
          name: "drugTradeCode",
          sortable: true,
          moveable: true,
          width: 180
        },
        { 
          text: "药品旧商品名名称",
          name: "drugTradeNameOld",
          sortable: true,
          moveable: true,
          width: 200},
        {
          text: "药品新商品名编号",
          name: "drugTradeCodeNew",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "药品商品名称",
          name: "drugTradeName",
          sortable: true,
          moveable: true,
          width: 230
        },

        {
          text: '开始时间',
          name: "startYearmonth",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: '结束时间',
          name: "stopYearmonth",
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
        // {
        //   text: "审核人",
        //   name: "checkUser",
        //   sortable: true,
        //   moveable: true,
        //   width: 200
        // },
        // {
        //   text: "审核时间",
        //   name: "checkTime",
        //   sortable: true,
        //   moveable: true,
        //   width: 200
        // },
        // {
        //   text: "审核不通过原因",
        //   name: "checkNoReason",
        //   sortable: true,
        //   moveable: true,
        //   width: 200
        // },
        // {
        //   text: "审核不通过备注",
        //   name: "checkNoReasonMemo",
        //   sortable: true,
        //   moveable: true,
        //   width: 200
        // },
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
    this.getDrugTradeList();
  },
  methods: {
    getDrugTradeList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "drugTrade.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          drugName: self.searchForm.keywords,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugTradeList = data.data.dataList;
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
      this.getDrugTradeList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDrugTradeList();
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
    },
    // addModal() {
    //   this.$refs["drugTradeFormAdd"].resetFields();
    //   this.drugTradeForm.drugTradeName = "";
    //   this.drugTradeForm.drugcompanyId = "";
    //   this.drugTradeForm.remark = "";
    //   this.addModel = true;
    // },
    editItem(item) {
      this.editModel = true;
      this.drugTradeInfo = Object.assign({}, item);
    },
    // deleteItem(item) {
    //   this.$Modal.confirm({
    //     title: "删除确认",
    //     content: "确定要删除“" + item.drugcompanyId + "”？",
    //     onOk: () => {
    //       var self = this;
    //       Vue.ajax.send({
    //         name: "drugTrade.del",
    //         data: {
    //           drugcompanyId: item.drugcompanyId,
    //           changeUser: Vue.getUser().userName
    //         },
    //         success: function(data) {
    //           if (!!data && data.code == "0") {
    //             self.$Message.info("药品企业集团信息删除成功");
    //             self.getDrugTradeList();
    //           } else {
    //             self.$Modal.error({
    //               title: "",
    //               content: data.message
    //             });
    //           }
    //         }
    //       });
    //     }
    //   });
    // },
    // addOk() {
    //   this.$refs["drugTradeFormAdd"].validate(valid => {
    //     if (valid) {
    //       var self = this;
    //       Vue.ajax.send({
    //         name: "drugTrade.add",
    //         data: {
    //           drugcompanyId: self.drugTradeForm.drugcompanyId,
    //           drugTradeName: self.drugTradeForm.drugTradeName,
    //           statusId: 1,
    //           remark: self.drugTradeForm.remark,
    //           createUser: Vue.getUser().userName
    //         },
    //         success: function(data) {
    //           if (!!data && data.code == "0") {
    //             self.addModel = false;
    //             self.$refs["drugTradeFormAdd"].resetFields();
    //             self.$Message.success("新增药品企业名称提交成功！");
    //             self.getDrugTradeList();
    //           } else if(data.code == "2"){
    //               self.$Message.error("批发厂家编号已存在，请重新输入！");
    //           } else {
    //               setTimeout(() => {
    //                 self.loadingAdd = false;
    //                 self.$nextTick(() => {
    //                 self.loadingAdd = true;
    //               });
    //             }, 0);
    //             self.$Modal.error({
    //               title: "",
    //               content: data.message
    //             });
    //           }
    //         }
    //       });
    //     } else {
    //       setTimeout(() => {
    //         this.loadingAdd = false;
    //         this.$nextTick(() => {
    //           this.loadingAdd = true;
    //         });
    //       }, 0);
    //     }
    //   });
    // },
    editBlocInfo() {
      this.$refs["drugTradeForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugTrade.edit",
            data: {
              drugcompanyId: self.drugTradeInfo.drugcompanyId,
              startYearmonth: self.drugTradeInfo.startYearmonth.format('YYYY-MM'),
              stopYearmonth: self.drugTradeInfo.stopYearmonth.format('YYYY-MM'),
              remark: self.drugTradeInfo.remark,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("编辑药品商品名提交成功！");

                self.getDrugTradeList();
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