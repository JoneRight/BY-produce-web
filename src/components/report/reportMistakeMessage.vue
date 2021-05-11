<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">上报错误统计</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <!-- <FormItem label="医院" :label-width="60">
                    <Input v-model="searchForm.hospitalName" type="text" style="width: 260px;" placeholder="请输入医院"/>
                </FormItem> -->
		        <FormItem label="省市" :label-width="40">		        	
		            <Cascader :data="addressList" @on-change='getHosp' trigger="hover" v-model="searchForm.address" change-on-select style="width: 120px"></Cascader>
		        </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospitalName" style="width: 120px;" filterable clearable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院编号" :label-width="60">
		            <Input v-model="searchForm.hospNo" style="width: 120px;" placeholder="请输入医院编号" ></Input>
		        </FormItem>
		        <FormItem label="数据类型" :label-width="60">
		            <Select v-model="searchForm.dataType" style="width: 120px;" clearable>
				        <Option value="10">购药</Option>
                        <Option value="20">门急诊</Option>
                        <Option value="30">病案</Option>
                        <Option value="40">医嘱</Option>
				    </Select>
		        </FormItem>
                <FormItem label="数据年月" :label-width="60">
                    <DatePicker type="month" placeholder="请选择年月" :editable="false" v-model="searchForm.yearMonth" @on-change="searchForm.yearMonth=$event" style="width: 120px;"></DatePicker>
                </FormItem>
		        <FormItem>
		            <Button type="primary"  @click="serchList()">检索</Button>
		        </FormItem>
		    </Form>
        </div>
         
         <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'reportMistake'" :columnConfig='reportCol' :columnDatas='reportList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item) in showDatas" :key="item.__index">
                  <td class="ellipsis" v-for="(col) in reportCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{reportCol.find(m=>m.name==col.name).render?reportCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
            </CustomTable>
            
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="reportList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>
         <div class="bg-white mt15" style="height:100%;">
              <Table border ref="dataTable"  :columns="reportColNew" :data="newDatas">
              </Table>
              <div style="" class="page-footer">      
                 <div class="mt15 text-center" v-if="hospitalList.length>0">       
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                     <Button type="primary"    class="fr page-footer-button"  size="large" @click="exportData"><Icon type="ios-download-outline"></Icon>导出</Button>
                   
                </div>
              </div>
            </div>
    </div>
    
</template>

<script>
import Vue from "vue";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
export default {
    name: 'reportMistakeMessage',
    
    components:{EmptyRow,CustomTable},
    data(){
    	return{     
            showModal: false,
            showDatas: [],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            },       
            discard:false,
    		searchForm:{
                hospitalName:'',
    			address:[],
                yearMonth: "",
    			dataType:null,
    			reportDate:[]
    		},
            loading:true,
            reasonList:[],
            discardInfo:[],
            discardIndex:'',
            discardForm:{
                fileNo:'',
                cancelReason:'',
                remark:''
            },
    		addressList:[],
            reportList: [],
            hospitalList:[],
            newDatas:[],
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount:1,
            },

    		reportCol: [   
                {
                        text: '省份',
                        name: 'provinceName',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },
                    {
                        text: '城市',
                        name: 'cityName',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },           
                    {
                        text: '医院',
                        name: 'hospName',
                        sortable: true,
                        moveable: true,
                        width:300,
                    },
                    {
                        text: '医院编码',
                        name: 'hospNo',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                    
                    {
                        text: '数据年月',
                        name: 'yearMonth',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },
                    {
                        text: '数据类型',
                        name: 'dataType',
                        width: 150,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.dataType==10){
                                return "购药";
                            }else if(params.dataType==20){
                                return "门急诊";
                            }else if(params.dataType==30){
                                return "病案";
                            }else if(params.dataType==40){
                                return "医嘱";
                            }
                        }
                    },
                    {
                        text: '错误类型',
                        name: 'fileNo',
                        width: 200,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.fileNo==null){
                                return "未上报";
                            }else{
                                return "上报错误";
                            }
                        }
                    },
          {
                        text: '错误信息',
                        name: 'detail',
                        width: 200,
                        sortable: true,
                        moveable: true
          }
                   
                ],
                 excelColNew: [
                     {
                        title: '省份',
                        key: 'provinceName',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '城市',
                        key: 'cityName',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '医院编码',
                        key: 'hospNo',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                      {
                        title: '医院',
                        key: 'hospName',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },                    
                    {
                        title: '数据年月',
                        key: 'yearMonth',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '数据类型',
                        key: 'dataType',
                        width: 100,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.dataType==10){
                                return "购药";
                            }else if(params.dataType==20){
                                return "门急诊";
                            }else if(params.dataType==30){
                                return "病案";
                            }else if(params.dataType==40){
                                return "医嘱";
                            }
                        }
                    },
                    {
                        title: '错误类型',
                        key: 'fileNo',
                        width: 100,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.fileNo==null){
                                return "未上报";
                            }else{
                                return "上报错误";
                            }
                        }
                    }
                ],

                reportColNew: [
                     {
                        title: '省份',
                        key: 'provinceName',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '城市',
                        key: 'cityName',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                             {
                        title: '医院编码',
                        key: 'hospNo',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                                       {
                        title: '医院',
                        key: 'hospName',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
           
                   
                    {
                        title: '数据年月',
                        key: 'yearMonth',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '数据类型',
                        key: 'dataType',
                        width: 100,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.dataType==10){
                                return "购药";
                            }else if(params.dataType==20){
                                return "门急诊";
                            }else if(params.dataType==30){
                                return "病案";
                            }else if(params.dataType==40){
                                return "医嘱";
                            }
                        }
                    },
                    {
                        title: '错误类型',
                        key: 'fileNo',
                        width: 100,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.fileNo==null){
                                return "未上报";
                            }else{
                                return "上报错误";
                            }
                        }
                    }
                ],
                      excelCol1:{}
    	}
    },
    activated:function(){
        this.getReportList();
         this.getAddressList();
        this.getHospitalList(""); //获取医院数据
        this.excelCol1=this.excelColNew.attrToObject('title','key');

    },
    methods: { 
        getHosp(value) {
            this.getHospitalList(value);
        },
        //获取医院
        getHospitalList(value) {
            var self = this;
            Vue.ajax.send({
                name: "common.hospitalList",
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
        getReportList(){
            var self=this;
            Vue.ajax.send({
                name: 'report.mistake',
                data:{
                    hospitalId:self.searchForm.hospitalName,
                    provinceId:self.searchForm.address.length==1?self.searchForm.address[0]:null,
                    cityId:self.searchForm.address.length==2?self.searchForm.address[1]:null,
                    dataType:self.searchForm.dataType,
                    yearMonth: self.searchForm.yearMonth,
                    hospNo:self.searchForm.hospNo,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.reportList=data.data.dataList || [];
                        self.newDatas = data.data.dataList;
                        self.pageConfig.totalItemCount=data.data.totalItemCount;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getAddressList(){
            var self=this;
            Vue.ajax.send({
                name: 'business.adressList',
                data: {},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.addressList=data.data;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        changePage(currentPage){
            this.pageConfig.pageIndex=currentPage;
            this.getReportList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getReportList();
        },
        serchList () {
            this.pageConfig.totalItemCount=1;
            this.pageConfig.pageIndex=1;
            if(this.searchForm.address.length>0 || this.searchForm.hospitalName!='' || this.searchForm.dataType!='' || (this.searchForm.reportDate[0]!=''|| this.searchForm.reportDate[1]!='')){
                this.getReportList();
            }else{
                this.$Modal.error({
                    title: '消息提示',
                    content: '请先填写检索条件'
                });
            }
            
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
        },
        exportData(){
            this.$refs.dataTable.exportCsv({
            filename: '上报情况列表',
            columns: this.excelColNew,
            data: this.newDatas
        });
    }
    }

};
</script>
<style scoped>
.ivu-tooltip-inner{
    white-space: normal;
}
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