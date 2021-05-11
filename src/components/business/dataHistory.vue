<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">数据总检</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="数据类型" :label-width="60">
                    <Select v-model="searchForm.dataType" style="width: 120px;">
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="数据年月" :label-width="60">
                    <DatePicker type="month" v-model="searchForm.yearMonth" @on-change="searchForm.yearMonth=$event" :editable="false" style="width: 120px;"></DatePicker>
                </FormItem> -->
                 <FormItem label="数据年月" :label-width="60">
                    <DatePicker type="month" format="yyyyMM" v-model="searchForm.beginMonth" style="width: 120px;"></DatePicker> —
                    <DatePicker type="month" format="yyyyMM" v-model="searchForm.endMonth"  style="width: 120px;"></DatePicker>
                </FormItem>
                <FormItem label="省市" :label-width="40">
                    <Cascader :data="addressList" trigger="hover" v-model="searchForm.address" change-on-select></Cascader>
                </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospital" style="width: 120px;" filterable clearable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="searchForm.dataType != 30" label="ATC分类" :label-width="60">
                    <Select v-model="searchForm.drugAtc" style="width: 120px;" remote :remote-method="getDrugAtcList" filterable clearable>
                        <Option v-for="item in drugAtcList" :value="item.atc" :key="item.atc">{{ item.atc+"("+item.atcName+")" }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="searchForm.dataType != 30" label="药品系统码" :label-width="80">
                    <Input v-model="searchForm.drug" type="text" placeholder="请输入药品系统码" style="width: 120px;" clearable/>
                </FormItem>
                <FormItem v-if="searchForm.dataType != 30" label="通用名" :label-width="60">
                        <Input v-model="searchForm.drugGenericName" type="text" placeholder="请输入通用名" style="width: 120px;" clearable/>
                </FormItem>
                <FormItem v-if="searchForm.dataType != 30" label="商品名" :label-width="60">
                    <Input v-model="searchForm.drugTradeName" type="text" placeholder="请输入商品名" style="width: 120px;" clearable/>
                </FormItem>
                <FormItem v-if="searchForm.dataType != 30" label="生产企业" :label-width="60">
                    <Input v-model="searchForm.drugCompanyName" type="text" placeholder="请输入生产企业" style="width: 160px;" clearable/>
                </FormItem>
                <FormItem v-if="searchForm.dataType == 20 || searchForm.dataType == 30" label="疾病" :label-width="60">
                    <Input v-model="searchForm.diseaseTypeName" type="text" placeholder="请输入疾病" style="width: 160px;" clearable/>
                </FormItem>
                <FormItem v-if="searchForm.dataType == 30" label="手术" :label-width="60">
                    <Input v-model="searchForm.operation" type="text" placeholder="请输入手术" style="width: 160px;" clearable />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
            </Form>
        </div>
        <div class="bg-white mt14" style="height:100%;">
            <Loading v-if="isSearching"/>
            <CustomTable v-authorize="'BusinessDataHistoryList'" v-if="currentType==20" optionType="business" :columnConfig='menjizhenCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false"> 
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in menjizhenCol" :key="colIndex">
                        <CheckboxGroup v-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            门急诊
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessDataCheckList'" v-else-if="currentType==30" optionType="business" :columnConfig='binganCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in binganCol" :key="colIndex" >
                        <CheckboxGroup v-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            病案
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessDataCheckList'" v-else-if="currentType==40" optionType="business" :columnConfig='yizhuCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in yizhuCol" :key="colIndex">
                        <CheckboxGroup v-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            医嘱
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessDataCheckList'" v-else optionType="business" :columnConfig='gouyaoCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in gouyaoCol" :key="colIndex">
                        <CheckboxGroup v-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            购药
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer search-con">
                <div class="mt15 text-center" v-if="dataCheckList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
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
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
import Loading from "@/components/common/loading";
import commonJson from "@/assets/data/business/common.json";
//数据列
import columns from "@/assets/data/business/cloumnHistory.json";
import "../../assets/css/business/dataerror.css"; //错误列样式
export default {
  name: "dataCheck",
  components: { EmptyRow, CustomTable, CheckboxGroup, Checkbox, Loading },
  data() {
    return {
      showModal: false,
      ckeckVal: false,
      showDatas: [],
      currentSort: {
        column: "",
        asc: true
      },
      isSearching: false,
      param: [],
      tableH: 0,
      dataTypeList: commonJson.dataTypeList, //数据类型
      isUpdateTypeList: commonJson.isUpdateTypeList, //修改状态
      hospitalList: [], //医院
      drugAtcList: [], //atc
      addressList: [], //省市
      dataCheckList: [], //列表
      selectList: [], //选中的信息
      model1: false, //提示框显示状态(重新清洗)
      model2: false, //提示框显示状态(设置列)
      model3: false, //提示框显示状态(确认)
      commonId: "", //存放id
      hosId: "", //医院id
      yearMonth: "", //数据年月
      currentType: "", //当前显示的数据的类型
      Operation: [], //操作列,
      checkBoxList: [], //可选列
      indeterminate: false, //全选状态(非全选)
      checkAll: false, //全选状态（非全选）
      checkAllGroup: [], //选中的多选框
      commonCol: [], //公共字段
      gouyaoCol: [], //购药数据列
      menjizhenCol: [], //门急诊数据列
      binganCol: [], //病案数据列
      yizhuCol: [], //医嘱数据列
      updateList: [], //修改列
      disabledGroup: "reject", //重洗位置
      chongxiType: "", //重洗类型
      pp: [],
      searchForm: {
        address: [],
        hospital: "",
        dataType: 10,
        drugAtc: "",
        drug: "",
        beginMonth: "201801",
        endMonth: "201801",
        // isUpdateType: "",
        beginDate: "",
        endDate: ""
      },
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      showCol: [], //显示列
      allCol: [] //该数据类型的全部列
    };
  },
  mounted() {
    let self = this;
    var date=new Date;
    var year=date.getFullYear(); 
    var month=date.getMonth()+1;
    this.searchForm.beginMonth = date;
    this.searchForm.endMonth = date;
    //操作列
    this.SelectOp = {
      text: "#",
      name: "sel",
      width: 40,
      filterable: false,
      removeable: false
    };

    //公共列
    // this.commonCol.push(this.SelectOp);
    columns.columncommon.forEach(item => {
      let column = {
        text: item.title,
        name: item.key,
        width: item.width,
        sortable: true,
        moveable: true,
        standard: item.standard,
        render: params => {
          if (item.key == "data_Type") {
            if (params.dataType == 10) {
              return "购药";
            } else if (params.dataType == 20) {
              return "门急诊";
            } else if (params.dataType == 30) {
              return "病案";
            } else {
              return "医嘱";
            }
          } else {
            return params[item.key];
          }
        }
      };
      this.commonCol.push(column);
    });
    //购药列
    this.gouyaoCol = [].concat(this.commonCol);
    columns.columnGouyao.forEach(item => {
      let column = {
        text: item.title,
        name: item.key,
        title: item.databaseFieldName,
        width: item.width,
        sortable: true,
        moveable: true,
        isInput: true,
        standard: item.standard
      };
      this.gouyaoCol.push(column);
    });
    //门急诊列
    this.menjizhenCol = [].concat(this.commonCol);
    columns.columnMenjizhen.forEach(item => {
      let column = {
        text: item.title,
        name: item.key,
        title: item.databaseFieldName,
        width: item.width,
        sortable: true,
        moveable: true,
        isInput: true,
        standard: item.standard
      };
      this.menjizhenCol.push(column);
    });
    //病案列
    this.binganCol = [].concat(this.commonCol);
    columns.columnBingan.forEach(item => {
      let column = {
        text: item.title,
        name: item.key,
        title: item.databaseFieldName,
        width: item.width,
        sortable: true,
        moveable: true,
        isInput: true,
        standard: item.standard
      };
      this.binganCol.push(column);
    });
    //医嘱列
    this.yizhuCol = [].concat(this.commonCol);
    columns.columnYizhu.forEach(item => {
      let column = {
        text: item.title,
        name: item.key,
        title: item.databaseFieldName,
        width: item.width,
        sortable: true,
        moveable: true,
        isInput: true,
        standard: item.standard
      };
      this.yizhuCol.push(column);
    });

    this.getHospitalList(""); //获取医院数据
    this.getDrugAtcList(""); //获取ATC编码
    this.getAddressList(); //获取省市
    this.getDataCheckList(); //获取列表数据
  },
  activated() {
    if (this.$route.params.id != undefined && this.$route.params.id != "") {
      this.searchForm.dataType = Number(this.$route.params.id);
    }

    //this.getDataCheckList(); //获取列表数据
  },
  watch: {
    showDatas: {
      handler(newValue, oldValue) {
        if (newValue.length != oldValue.length) {
          this.selectList = [];
        }
      },
      deep: true
    }
  },
  methods: {
    //根据省市获取医院
    getHosp(value) {
      this.getHospitalList(value);
    },
    //获取省市
    getAddressList() {
      var self = this;
      Vue.ajax.send({
        name: "business.adressList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.addressList = data.data;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    //获取列表数据
    getDataCheckList(pageIndex) {
      var self = this;
      self.isSearching = true;
      if (self.currentType != self.searchForm.dataType) {
        if (this.searchForm.dataType == 10) {
          this.capyCol = [].concat(this.gouyaoCol);
        } else if (this.searchForm.dataType == 20) {
          this.capyCol = [].concat(this.menjizhenCol);
        } else if (this.searchForm.dataType == 30) {
          this.capyCol = [].concat(this.binganCol);
        } else {
          this.capyCol = [].concat(this.yizhuCol);
        }
      }
      //判断当前数据状态和上次数据状态
      if (self.currentType != self.searchForm.dataType) {
        self.checkAllGroup = []; //清空多选默认选中列数组
        self.indeterminate = false; //全选状态(非全选)
        self.checkAll = false; //全选状态（非全选）
        self.currentType = self.searchForm.dataType; //保存当前显示数据类型
      }
      self.dataCheckList = [];
      var beginMonth="";
      if(self.searchForm.beginMonth){
        beginMonth=self.searchForm.beginMonth.getFullYear()+("0"+(self.searchForm.beginMonth.getMonth()+1)).split('').reverse().slice(0,2).reverse().join('')
      }
      var endMonth="";
      if(self.searchForm.endMonth){
        endMonth=self.searchForm.endMonth.getFullYear()+("0"+(self.searchForm.endMonth.getMonth()+1)).split('').reverse().slice(0,2).reverse().join('')
      }
      Vue.ajax.send({
        name: "history.list",
        data: {
          pageIndex: pageIndex || self.pageConfig.pageNum, //页码
          pageSize: self.pageConfig.pageSize, //每页条数
          provinceId:
            self.searchForm.address.length == 1
              ? self.searchForm.address[0]
              : null, //省
          cityId:
            self.searchForm.address.length == 2
              ? self.searchForm.address[1]
              : null, //市
          beginDate: beginMonth, //开始时间
          endDate: endMonth, //结束时间
          //   yearMonth: self.searchForm.yearMonth.replace("-", ""), //数据类型
          hospId: self.searchForm.hospital, //医院
          dataType: self.searchForm.dataType, //数据类型
          drugAtc: self.searchForm.drugAtc,
          drug: self.searchForm.drug,
          drugGenericName: self.searchForm.drugGenericName,
          drugTradeName: self.searchForm.drugTradeName,
          drugCompanyName: self.searchForm.drugCompanyName,
          diseaseTypeName: self.searchForm.diseaseTypeName,
          operation: self.searchForm.operation
          // keywords: self.searchForm.keywords, //自定义
          // isUpdate: self.searchForm.isUpdateType //修改状态
        },
        success: function(data) {
          // return;
          if (!!data && data.code == "0") {
            // console.error("aaaaaaaaaaaaaaaaaaaaaaaaa",data.data.dataList);
            self.dataCheckList = data.data.dataList;
            // console.log(self.dataCheckList);
            self.pageConfig.totalItemCount = data.data.totalItemCount;
            // self.pageConfig.pageNum = data.data.currentPageIndex;
          } else {
            self.$Modal.error({
              title: "失败",
              content: data.message
            });
          }
          self.isSearching = false;
        }
      });
    },
    //获ATC编码
    getDrugAtcList(search) {
      var self = this;
      Vue.ajax.send({
        name: "drugAtc.list",
        data: {
          pageIndex: 1,
          pageSize: 20,
          searchWord: search
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugAtcList = data.data.dataList;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
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
    //切页
    changePage(currentPage) {
      this.pageConfig.pageNum = currentPage;
      this.getDataCheckList();
    },
    //显示条数
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDataCheckList();
    },
   
    tableMove(width) {
      // console.log("with",width)
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
      this.showColumns = showColumns.distinct();
      if (this.showColumns.length > 0) {
        if (this.currentType == 10) {
          this.gouyaoCol = [];
          this.capyCol.forEach(m => {
            this.showColumns.forEach(n => {
              if (m.name == n) {
                this.gouyaoCol.push(m);
              }
            });
          });
        } else if (this.currentType == 20) {
          this.menjizhenCol = [];
          this.capyCol.forEach(m => {
            this.showColumns.forEach(n => {
              if (m.name == n) {
                this.menjizhenCol.push(m);
              }
            });
          });
        } else if (this.currentType == 30) {
          this.binganCol = [];
          this.capyCol.forEach(m => {
            this.showColumns.forEach(n => {
              if (m.name == n) {
                this.binganCol.push(m);
              }
            });
          });
        } else {
          this.yizhuCol = [];
          this.capyCol.forEach(m => {
            this.showColumns.forEach(n => {
              if (m.name == n) {
                this.yizhuCol.push(m);
              }
            });
          });
        }
      }
    },
    //单选
    clickMe(index) {
      //判断数据id是否存在
      var dataIndex = this.selectList.indexOf(this.showDatas[index].recordId);
      //存在就删除，不存在就添加
      if (dataIndex > -1) {
        this.selectList.splice(dataIndex, 1);
      } else {
        this.selectList.push(this.showDatas[index].recordId);
      }
    },
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
  width: 43px;
  left: 220px;
  top: 8px;
}
.page-footer button {
  position: absolute;
  right: 40px;
  top: 10px;
}
.page-footer .text-center {
  position: relative;
  display: block;
  width: 100%;
}
.page-footer .inputCheck {
  position: absolute;
  left: 220px;
  top: 10px;
}
</style>