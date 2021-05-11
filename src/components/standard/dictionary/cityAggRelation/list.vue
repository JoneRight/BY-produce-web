<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">城市群对应城市</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="城市名称" :label-width="80">
                        <Select v-model="searchForm.city" filterable clearable  style="width: 160px;">
                            <Option v-for="item in cityList" :value="item.city" :key="item.city">{{ item.cityName }}</Option>
				        </Select>
                    </FormItem>
                    <FormItem label="城市群名称" :label-width="90">
                        <Select v-model="searchForm.cityGroup" filterable clearable   style="width: 160px;">
                            <Option v-for="item in cityGroupList" :value="item.cityGroup" :key="item.cityGroup">{{ item.cityGroupName }}</Option>
				        </Select>
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryCityGroupRelationAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryCityGroupRelationQuery'" :columnConfig='resourceCol' :columnDatas='cityAggRelaitonList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                            <Button v-authorize="'DictionaryCityGroupRelationEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionaryCityGroupRelationDeleteByKey'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="cityAggRelaitonList.length>0">            
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
                
                <Form :model="cityAggRelaitonForm" ref="cityAggRelaitonFormAdd"  :rules="ruleValidate" :label-width="80">
                    <FormItem label="城市群" prop="cityGroup">
                        <Select v-model="cityAggRelaitonForm.cityGroup">
                            <Option v-for="item in cityGroupList" :value="item.cityGroup" :key="item.cityGroup">{{ item.cityGroupName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem  label="城市" prop="city">
                        <Select v-model="cityAggRelaitonForm.city" filterable>
                            <Option v-for="item in cityList" :value="item.city" :key="item.city">{{ item.cityName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="cityAggRelationOk"  :loading="loading" :mask-closable="false">
            <Form ref="cityAggRelaitonForm" :model="cityAggRelationInfo" :rules="ruleValidate" :label-width="80">
                    
                    <input type="hidden" v-model="cityAggRelationInfo.cgrId"/>
                    <FormItem label="城市群" prop="cityGroup">
                        <Select v-model="cityAggRelationInfo.cityGroup">
                            <Option v-for="item in cityGroupList" :value="item.cityGroup" :key="item.cityGroup">{{ item.cityGroupName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem  label="城市" prop="city">
                        <Select v-model="cityAggRelationInfo.city" filterable>
                            <Option v-for="item in cityList" :value="item.city" :key="item.city">{{ item.cityName }}</Option>
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
  name: "cityAggRelation",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      tableH: 0,
      searchForm: {
        keywords: ""
      },
      cityAggRelaitonForm: {
        cgrId: "",
        city: "",
        cityName: "",
        cityGroup: ""
      },
      loading: true,
      loadingAdd: true,
      cityAggRelaitonList: [],
      cityList: [],
      cityGroupList: [],
      cityAggRelationInfo: {},
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
        cgrId: [
          {
            required: true,
            message: "城市群编号不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        cityGroup: [
          {
            required: true,
            message: "城市群不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        city: [
          {
            required: true,
            message: "请选择城市",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      resourceCol: [
        {
          text: "编号",
          name: "cgrId",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "城市群",
          name: "cityGroupName",
          sortable: true,
          moveable: true,
          width: 400
        },
        {
          text: "城市",
          name: "cityName",
          sortable: true,
          moveable: true,
          width: 400
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
    this.getCityList();
    this.getCityGroupList();
    this.getCityAggRelaitonList();
  },
  methods: {
    getCityList() {
      var self = this;
      Vue.ajax.send({
        name: "city.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.cityList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getCityGroupList() {
      var self = this;
      Vue.ajax.send({
        name: "cityGroup.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.cityGroupList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getCityAggRelaitonList() {
      var self = this;
      Vue.ajax.send({
        name: "cityAggRelation.list",
        data: {
          city: self.searchForm.city,
          cityGroup: self.searchForm.cityGroup,
          pageIndex: self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.cityAggRelaitonList = data.data.dataList;
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
      this.getCityAggRelaitonList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getCityAggRelaitonList();
    },
    sortColumn: function(column, asc) {
       this.currentSort.column = column;
       this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (this.currentSort.column == "cgrId") {
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
      this.$refs["cityAggRelaitonFormAdd"].resetFields();
      this.addModel = true;
    },
    editItem(item) {
      this.$refs["cityAggRelaitonForm"].resetFields();
      this.editModel = true;
      this.cityAggRelationInfo = Object.assign({}, item);
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.cityGroupName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "cityAggRelation.del",
            data: {
              cgrId: item.cgrId
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("城市群对应城市信息删除成功");
                self.getCityAggRelaitonList();
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
      this.$refs["cityAggRelaitonFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "cityAggRelation.add",
            data: {
              cgrId: self.cityAggRelaitonForm.cgrId,
              city: self.cityAggRelaitonForm.city,
              cityGroup: self.cityAggRelaitonForm.cityGroup
            },
            success: function(data) {
              
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$Message.success("新增城市群对应城市提交成功！");
                self.getCityAggRelaitonList();
              } else {
                setTimeout(() => {
                self.loadingAdd = false;
                self.$nextTick(() => {
                  self.loadingAdd = true;
                });
              }, 0);
                self.$Modal.error({
                  title: "错误提示",
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
    cityAggRelationOk() {
      this.$refs["cityAggRelaitonForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "cityAggRelation.edit",
            data: {
              cgrId: self.cityAggRelationInfo.cgrId,
              city: self.cityAggRelationInfo.city,
              cityGroup: self.cityAggRelationInfo.cityGroup
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
                self.$Message.success("编辑城市群对应城市提交成功！");
                self.getCityAggRelaitonList();
              } else {
                self.$Modal.error({
                  title: "错误提示",
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