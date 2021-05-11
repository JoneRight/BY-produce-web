<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">代上报列表</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <!-- <FormItem label="医院" :label-width="60">
                    <Input v-model="searchForm.hospitalName" type="text" style="width: 200px;" placeholder="请输入医院"/>
                </FormItem> -->
                <FormItem label="省市" :label-width="40">                 
                    <Cascader :data="addressList" @on-change='getHosp' trigger="hover" v-model="searchForm.address" change-on-select style="width: 160px"></Cascader>
                </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospitalName" style="width: 200px;" filterable clearable>
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
                <FormItem label="上报日期" :label-width="60">
                    <DatePicker type="daterange" :start-date="new Date(new Date().getTime() - 30*24*60*60*1000)" v-model="searchForm.reportDate" style="width: 200px" @on-change="searchForm.reportDate=$event"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="serchList('searchForm')">检索</Button>
                </FormItem>
                <FormItem  class="fr">
                    <Button type="primary" to="/report/replaceRate" v-authorize="'fileuploadinsteadadd'">+ 新增代上报</Button>
		        </FormItem>
            </Form>
        </div>
         <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'fileuploadinsteadlist'" :columnConfig='replaceCol' :columnDatas='replaceList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in replaceCol" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{replaceCol.find(m=>m.name==col.name).render?replaceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                   
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
            </CustomTable>
            
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="replaceList.length>0">            
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
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
export default {
    name: 'replace',
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
    		searchForm:{
                hospitalName:'',
                address:[],
                dataType:null,
                reportDate:[]
            },
            addressList:[],
            replaceList: [],
            hospitalList:[],
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount:1,
            },
    		replaceCol: [
                {
                    text: '序号',
                    width: 180,
                    sortable: true,
                    moveable: true,
                    name: '_rowNum'
                },
                {
                    text: '文件编号',
                    width: 180,
                    sortable: true,
                    moveable: true,
                    name: 'fileNo'
                },
                {
                    text: '文件名称',
                    name: 'sourceFileName',
                    sortable: true,
                    moveable: true,
                    width:200,
                },
                {
                        text: '省份',
                        name: 'provinceName',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        text: '城市',
                        name: 'cityName',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                {
                    text: '医院',
                    sortable: true,
                    moveable: true,
                    width: 200,
                    name: 'hospName'
                },
                {
                    text: '医院编号',
                    sortable: true,
                    moveable: true,
                    width: 200,
                    name: 'hospNo'
                },
                {
                    text: '文件路径',
                    sortable: true,
                    moveable: true,
                    width: 200,
                    name: 'path'
                },
                {
                    text: '数据类型',
                    name: 'dataType',
                    sortable: true,
                    moveable: true,
                    width: 100,
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
                            return "";
                        }
                },
                {
                    text: '数据年月',
                    name: 'yearMonth',
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: 'center'
                },
                {
                    text: '上传日期',
                    name: 'uploadDate',
                    sortable: true,
                    moveable: true,
                    width: 160,
                    align: 'center',
                    render:(params) => {
                            if(params.uploadDate && params.uploadDate.lastIndexOf(".")>-1){
                                return params.uploadDate.substring(0,params.uploadDate.lastIndexOf("."));
                            }
                            return "";
                        }
                },
                {
                    text: '上传状态',
                    name: 'detail',
                    width: 400,
                    sortable: true,
                    moveable: true,
                },
            ]
    	}
    },
    activated: function() {
        this.getReplaceList();
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
        getReplaceList(){
            var self=this;
            Vue.ajax.send({
                name: 'replace.list',
                data:{
                    hospitalId:self.searchForm.hospitalName,
                    provinceId:self.searchForm.address.length==1?self.searchForm.address[0]:null,
                    cityId:self.searchForm.address.length==2?self.searchForm.address[1]:null,
                    dataType:self.searchForm.dataType,
                    uploadDate:self.searchForm.reportDate,
                    hospNo:self.searchForm.hospNo,
                    uploadType:2,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.replaceList=data.data.dataList || [];
                                                self.pageConfig.totalItemCount=data.data.totalItemCount;

                         self.replaceList.map(x=>{
                            if(x.path){
                                x.path=Vue.config.filePathPrefix+"upload\\"+x.path.replaceAll('/','\\')
                            }
                            return x;
                        });
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
            this.getReplaceList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getReplaceList();
        },
        serchList (name) {
            console.log(this.searchForm.reportDate);
            this.pageConfig.totalItemCount=1;
            this.pageConfig.pageIndex=1;
            this.getReplaceList();
            
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