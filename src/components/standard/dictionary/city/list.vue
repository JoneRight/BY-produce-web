<template>
    <div class="m15"  style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">城市</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="城市名称" :label-width="80">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入城市名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="add()" v-authorize="'DictionaryCityAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>

            <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'DictionaryCityQuery'" :columnConfig='resourceCol' :columnDatas='cityList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                   <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                      <Button v-authorize="'DictionaryCityEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                      class="btn-green" @click='$router.push("/standard/dictionary/city/edit?id="+item.city)'></Button>
                      <Button v-authorize="'DictionaryCityDeleteByKey'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='deleteCityInfo(item)'></Button>
                    </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="cityList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
                
            </div>
           
        </div>
            
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../../common/EmptyRow";
import CustomTable from "../../../common/GridTable";
export default {
  name: "city",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      tableH: 0,
      searchForm: {
        name: "",
        province: "",
        administrative: "",
        keywords: ""
      },
      cityList: [],
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
      resourceCol: [
        {
          text: "城市",
          name: "city",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "城市名称",
          name: "cityName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "省份",
          name: "provinceName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "行政区域",
          name: "administrativeName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "经济区域",
          name: "economicRegionName",
          sortable: true,
          moveable: true,
          width: 200
        },
        {
          text: "国家",
          name: "countryName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "邮编",
          name: "postcode",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "城市级别",
          name: "cityLevelName",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "城市类别",
          name: "cityTypeName",
          sortable: true,
          moveable: true,
          width: 120
        },
        {
          text: "是否省会",
          name: "isCapital",
          sortable: true,
          moveable: true,
          width: 120,
          render: (params) => {
            if(params.isCapital==0){
                return '否';
            }else if(params.isCapital==1){
                return '是';
            }
                return ''
            }
        },
        {
          text: "是否直辖市",
          name: "isMunicipalities",
          sortable: true,
          moveable: true,
          width: 130,
          render: (params) => {
            if(params.isMunicipalities==0){
                return '否';
            }else if(params.isMunicipalities==1){
                return '是';
            }
                return ''
            }
        },
        {
          text: "城市编码",
          name: "cityCode",
          sortable: true,
          moveable: true,
          width: 110
        },
        {
          text: "操作",
          name: "op",
          filterable: false,
          removeable: false,
          width: 100
        }
      ]
    };
  },
  activated: function() {
    this.getCityList();
  },
  methods: {
    getCityList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "city.list",
        data: {
          cityName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.cityList = data.data.dataList;
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
      this.getCityList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getCityList();
    },
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      this.showDatas = datas;
      var self = this;
      if (this.currentSort.column != "") {
        if (this.currentSort.column == "isCapital" || this.currentSort.column == "isMunicipalities") {
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
    add() {
      this.$router.push({
        path: "/standard/dictionary/city/add"
      });
    },
    deleteCityInfo(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.city + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "city.del",
            data: {
              city: item.city
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("城市信息删除成功");
                self.getCityList();
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


