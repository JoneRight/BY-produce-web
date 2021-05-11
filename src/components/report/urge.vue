<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <div class="fr"></div>
        <h2 class="common-title">催报列表</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		        <!-- <FormItem label="医院" :label-width="60">
                <Input v-model="searchForm.hospitalName" type="text" style="width: 260px;" placeholder="请输入医院"/>
            </FormItem> -->
            <FormItem label="省市" :label-width="40">                 
                <Cascader :data="addressList" @on-change='getHosp' trigger="hover" v-model="searchForm.address" change-on-select style="width: 200px;margin-top:2px;"></Cascader>
            </FormItem>
            <FormItem label="医院" :label-width="40">
                <Select v-model="searchForm.hospitalName" style="width: 200px;" filterable clearable>
                    <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
		        <FormItem label="催报类型" :label-width="60">
		            <Select v-model="searchForm.dataType" style="width: 120px;" clearable>
                        <Option value="10">购药</Option>
                        <Option value="20">门急诊</Option>
                        <Option value="30">病案</Option>
                        <Option value="40">医嘱</Option>
                    </Select>
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="serchList()">检索</Button>
		        </FormItem>
            <FormItem  class="fr">
                    <Button type="text" size="large" to="/report/urgeHistory" style="color:#57a3f3" v-authorize="'fileurgehistory'">查看催报历史记录</Button>
		        </FormItem>
		    </Form>
        </div>
        
          <div class="bg-white mt15" style="height:100%;">
              <CustomTable v-authorize="'fileurgelist'" :columnConfig='urgeCol' :columnDatas='urgeList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr   v-for="(item,index) in showDatas" :key="index">
                      <td v-authorize="'fileurgebatch'">
                        <CheckboxGroup v-model="selecList" style="height:100%;">
                          <Checkbox size='small' :key="JSON.stringify(item)" :value="JSON.stringify(item)"></Checkbox>
                        </CheckboxGroup>
                      </td>
                      <td class="ellipsis" v-for="(col) in urgeCol.filter(m=>m.name!='op' && m.name!='multi')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">
                        {{urgeCol.find(m=>m.name==col.name).render?urgeCol.find(m=>m.name==col.name).render(item):item[col.name]}}
                        </td>
                        
                      <td>
                          <Button v-authorize="'hospitalsampledetail'" class='btn-red' icon="md-volume-up" size="small" :title="item.urgeCount>0?'再次催报':'催报'" type="primary" @click='urge(item.yearMonth,item.dataType,item.hospitalId)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!urgeList || urgeList.length==0"/> 
              </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="urgeList.length>0">    
                   
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                    <Checkbox size='small' label='全选' class="fl" value="1" falseValue='0' @change="selectAll" style="width:60px;"></Checkbox>
                    <Button type="primary" class="fl" @click="urgeMore" :disabled="selecList.length==0" v-authorize="'fileurgebatch'">批量催报</Button>        
                </div>
            </div>
          </div>
        
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
export default {
  name: "duplicateCheck",
  components:{EmptyRow,CustomTable,CheckboxGroup,Checkbox},
  data() {
    return {
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
          column: "",
          asc: true
      }, 	
      selecList: [],
      hospitalList:[],
      searchForm: {
        address: [],
        hospitalName: "",
        dataType: ""
      },
      pageConfig: {
        pageIndex: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      urgeList: [],
      addressList: [],
      urgeCol: (Vue.authorize('fileurgebatch')?[{
          text: "多选",
          width: 60,
          filterable:false,
          sortable:false,
          removeable:false,
          name: "multi"
        }]:[]).concat([
        {
          text: "医院",
          name: "hospitalName",
          sortable: true,
          moveable: true,
          width:350
        },
       {
        text: '医院编号',
        sortable: true,
        moveable: true,
        width: 200,
        name: 'hospitalNo'
      },
        {
          text: "省份",
          name: "provinceName",
          sortable: true,
          moveable: true,
          width:200
        },
        {
          text: "城市",
          name: "cityName",
          sortable: true,
          moveable: true,
          width:200
        },
         {
          text: "催报数据年月",
          name: "yearMonth",
          sortable: true,
          moveable: true,
          width:200
        },
        {
          text: "催报类型",
          name: "dataType",
          sortable: true,
          moveable: true,
          width:150,
          render: (params) => {
            if (params.dataType == 10) {
              return "购药";
            } else if (params.dataType == 20) {
              return "门急诊";
            } else if (params.dataType == 30) {
              return "病案";
            } else if (params.dataType == 40) {
              return "医嘱";
            }
          }
        },
        {
          text: "逾期日期",
          name: "urgeDate",
          sortable: true,
          moveable: true,
          width:150
        },
        {
          text: "上报人",
          name: "uploadUserName",
          sortable: true,
          moveable: true,
          width:220
        },
        {
          text: "催报次数",
          name: "urgeCount",
          sortable: true,
          moveable: true,
          width:200
        },
        {
          text: "操作",
          width: 150,
          name: "op",
          filterable: false,
          removeable: false,
        }
      ])
    };
  },
  activated: function() {
    this.getUrgeList();
    this.getAddressList();
    this.getHospitalList(""); //获取医院数据
  },
  methods: {
    getHosp(value) {
        this.getHospitalList(value);
    },
    //获取医院
    getHospitalList(value) {
        var self = this;
        Vue.ajax.send({
            name: "business.hospitalList",
            data: {
                provinceId: value.length > 0 ? value[0] : null, //省
                cityId: value.length == 2 ? value[1] : null //市
            },
            success: function(data) {
                if (!!data && data.code == "0") {
                    self.hospitalList = data.data;
                } else {
                    self.$Modal.error({
                        title: "",
                        content: data.message
                    });
                }
            }
        });
    },
    handleRowChange(selection) {
      this.selecList = selection;
    },
    getUrgeList() {
      var self = this;
      Vue.ajax.send({
        name: "urge.list",
        data: {
          hospitalId: self.searchForm.hospitalName,
          provinceId:
            self.searchForm.address.length == 1
              ? parseInt(self.searchForm.address[0])
              : null,
          cityId:
            self.searchForm.address.length == 2
              ? parseInt(self.searchForm.address[1])
              : null,
          dataType: self.searchForm.dataType,
          pageIndex: self.pageConfig.pageIndex,
          pageSize: self.pageConfig.pageSize
        },
        success: function(data) {
          if (!!data && data.code == "0") {
              self.urgeList = data.data.dataList || [];
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
    getAddressList() {
      var self = this;
      Vue.ajax.send({
        name: "business.adressList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.addressList = data.data;
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
      this.pageConfig.pageIndex = currentPage;
      this.getUrgeList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getUrgeList();
    },
    serchList() {
      this.pageConfig.totalItemCount = 1;
      this.pageConfig.pageIndex = 1;
      this.getUrgeList();
    },
    selectAll:function(value){
      if(value==1){
        this.selecList=this.showDatas.map(a=>JSON.stringify(a));
      }
      else{
         this.selecList=[];
      }
    },
    urge(yearMonth, dataType, hospitalId) {
      var dataTypeStr = "";
      if (dataType == 10) {
        dataTypeStr = "购药";
      } else if (dataType == 20) {
        dataTypeStr = "门急诊";
      } else if (dataType == 30) {
        dataTypeStr = "病案";
      } else if (dataType == 40) {
        dataTypeStr = "医嘱";
      }
      var self = this;
      Vue.ajax.send({
        name: "urge.urge",
        data: {
          title: "关于" + yearMonth + "月份" + dataTypeStr + "数据的催报通知",
          content: yearMonth + "月份" + dataTypeStr + "数据已逾期，请尽快上报!",
          hospId: hospitalId,
          dataType: dataType,
          yearMonth: yearMonth+"",
          createUser: Vue.getUser().userName
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.getUrgeList();
            //  self.urgeList.findProperty('hospitalId',hospitalId).urgeCount++;
            self.$Message.success("催报成功！");
          } else {
            self.$Modal.error({
                   title: data.message,
                   content: ""
              });
          }
        }
      });
    },
    urgeMore() {
      for (var i = 0; i < this.selecList.length; i++) {
        var item=JSON.parse(this.selecList[i])
        this.urge(
          item.yearMonth,
          item.dataType,
          item.hospitalId
        );
      }
      this.selecList = [];
    },
    sortColumn: function(column, asc) {
        this.currentSort.column = column;
        this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
        this.showDatas = datas;
        var self = this;
        if (this.currentSort.column != "") {
            if (this.currentSort.column == "readCount") {
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
.page-footer .fl {
  position: absolute;
  left: 220px;
  top: 8px;
}
.page-footer button.fl {
  position: absolute;
  left: 280px;
  top: 3px;
}
.page-footer button.fr {
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
