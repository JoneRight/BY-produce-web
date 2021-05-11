<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">系统原因类型</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="系统原因类型" :label-width="100">
                        <Input v-model="searchForm.reasonTypeName" type="text" placeholder="请输入系统原因类型" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryReasonTypeAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryReasonTypeQuery'" :columnConfig='resourceCol' :columnDatas='reasonTypeList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                            <Button v-authorize="'DictionaryReasonTypeEditByKey'" icon="md-create" size="small" title="编辑" type="success"  
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionaryReasonTypeDeleteByKey'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="reasonTypeList.length>0">            
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
                
                <Form :model="reasonTypeForm" ref="reasonTypeFormAdd" :rules="ruleValidate" :label-width="100">
                    <FormItem label="系统原因类型编号" prop="reasonTypeId">
                        <Input v-model.trim="reasonTypeForm.reasonTypeId" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="系统原因类型名称" prop="reasonTypeName">
                        <Input v-model.trim="reasonTypeForm.reasonTypeName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="是否数据分层" prop="isHierar">
                        <Select v-model="reasonTypeForm.isHierar">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="reasonTypeOk" :loading="loading" :mask-closable="false">
            <Form ref="reasonTypeForm" :model="reasonTypeInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="reasonTypeInfo.reasonTypeId"/>
                    <FormItem label="系统原因类型名称" prop="reasonTypeName">
                        <Input v-model.trim="reasonTypeInfo.reasonTypeName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="是否数据分层" prop="isHierar">
                        <Select v-model="reasonTypeInfo.isHierar">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
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
  name: "reasonType",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      tableH: 0,
      searchForm: {
        reasonTypeName: "",
        reasonTypeId: ""
      },
      reasonTypeForm: {
        reasonTypeId: "",
        reasonTypeName: "",
        isHierar: ""
      },
      loadingAdd: true,
      loading: true,
      reasonTypeList: [],
      reasonTypeList: [],
      reasonTypeInfo: {},
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
        reasonTypeId: [
          {
            required: true,
            message: "系统原因类型编号不能为空",
            trigger: "blur"
          }
        ],
        reasonTypeName: [
          { required: true, message: "系统原因类型不能为空", trigger: "blur" }
        ]
      },
      resourceCol: [
        {
          text: "编号",
          name: "reasonTypeId",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "系统原因类型名称",
          name: "reasonTypeName",
          sortable: true,
          moveable: true,
          width: 400
        },
        {
          text: "是否数据分层",
          name: "isHierar",
          sortable: true,
          moveable: true,
          width: 200,
          render: (params) => {
            if(params.isHierar==0){
                return '否';
            }else if(params.isHierar==1){
                return '是';
            }
                return ''
            }
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
    this.getReasonTypeList();
  },
  methods: {
    getReasonTypeList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "reasonType.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          reasonTypeName: self.searchForm.reasonTypeName
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.reasonTypeList = data.data.dataList;
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
      this.getReasonTypeList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getReasonTypeList();
    },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (this.currentSort.column == "isHierar") {
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
      this.$refs["reasonTypeFormAdd"].resetFields();
      this.reasonTypeForm.remark = "";
      this.addModel = true;
      // this.reasonTypeForm.reasonTypeId = "A";
      // this.reasonTypeForm.reasonTypeName = "标准审核不通过原因";
    },
    editItem(item) {
       this.$refs["reasonTypeForm"].resetFields();
       this.editModel = true;
       this.reasonTypeInfo = Object.assign({}, item);
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.reasonTypeName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "reasonType.del",
            data: {
              reasonTypeId: item.reasonTypeId
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("系统原因类型信息删除成功");
                self.getReasonTypeList();
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
      this.$refs["reasonTypeFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "reasonType.add",
            data: {
              reasonTypeName: self.reasonTypeForm.reasonTypeName,
              reasonTypeId: self.reasonTypeForm.reasonTypeId,
              isHierar: self.reasonTypeForm.isHierar
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增系统原因类型信息提交成功！");
                self.getReasonTypeList();
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
    reasonTypeOk() {
      this.$refs["reasonTypeForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "reasonType.edit",
            data: {
              reasonTypeName: self.reasonTypeInfo.reasonTypeName,
              reasonTypeId: self.reasonTypeInfo.reasonTypeId,
              isHierar: self.reasonTypeInfo.isHierar
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
                self.$Message.success("编辑系统原因类型信息提交成功！");
                self.getReasonTypeList();
              } else {
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