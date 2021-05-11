<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">文件上报管理</h2>
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
		        <FormItem label="上报日期" :label-width="60">
		            <DatePicker type="daterange" placeholder="请选择日期" :start-date="new Date(new Date().getTime() - 30*24*60*60*1000)" v-model="searchForm.reportDate" style="width: 200px" @on-change="searchForm.reportDate=$event"></DatePicker>
		        </FormItem>
		        <FormItem label="进度" :label-width="40">
		            <Input v-model="searchForm.processStr" style="width: 120px;" placeholder="请输入进度" ></Input>
		        </FormItem>
		        <FormItem>
		            <Button type="primary"  @click="serchList()">检索</Button>
		        </FormItem>
		    </Form>
        </div>
         
         <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'fileuploadlist'" :columnConfig='reportCol' :columnDatas='reportList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item) in showDatas" :key="item.__index">
                  <td class="ellipsis" v-for="(col) in reportCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{reportCol.find(m=>m.name==col.name).render?reportCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                   <Button v-authorize="'fileuploadcancel'" class='btn-red' icon="md-trash" size="small" title="废弃" type="error" @click='confirmCancel(item)'></Button>
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

        <Modal title="废弃" class-name="vertical-center-modal" v-model="discard" @on-ok="discardOk"  @on-cancel="discardOkCancel"  :loading="loading">
            <Form ref="discardForm" :model="discardForm" :rules="discardValidate"  :label-width="80">
                <input type="hidden" v-model="discardForm.fileNo"></input>
                <FormItem label="医院">
                    <Label>{{discardInfo.hospName}}</Label>
                </FormItem>
                <FormItem label="数据类型">
                    <Label>{{discardInfo.dataTypeStr}}</Label>
                </FormItem>
                <FormItem label="上报日期">
                    <Label>{{discardInfo.uploadDate}}</Label>
                </FormItem>
                <FormItem label="废弃原因" prop="cancelReason">
                    <Select v-model="discardForm.cancelReason" filterable clearable>
                        <Option v-for="item in reasonList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="详情">
                    <Input v-model="discardForm.remark" :maxlength="500" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                </FormItem>
            </Form>
        </Modal>
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
    name: 'reportManage',
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
            discardValidate: {
                cancelReason: [
                    { required: true, message: '废弃原因不能为空', trigger: 'change'}
                ]
            },
    		reportCol: [   
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
                        text: '医院编码',
                        name: 'hospNo',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },         
                    {
                        text: '医院',
                        name: 'hospName',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
     
                   
                    {
                        text: '数据年月',
                        name: 'yearMonth',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        text: '数据类型',
                        name: 'dataType',
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
                        text: '上报类型',
                        name: 'uploadType',
                        width: 100,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.uploadType==1){
                                return "医院上报";
                            }else if(params.uploadType==2){
                                return "代上报";
                            }else if(params.uploadType==3){
                                return "邮件上报";
                            }
                            return ""
                        }
                    },
                    {
                        text: '上传日期',
                        name: 'uploadDate',
                        sortable: true,
                        moveable: true,
                        width:150,
                    },
                    {
                        text: '上报人',
                        name: 'reportor',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                    {
                        text: '文件名称',
                        name: 'sourceFileName',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                    {
                        text: '文件路径',
                        name: 'path',
                        sortable: true,
                        moveable: true,
                        width:400,
                    },
                    {
                        text: '文件大小',
                        name: 'fileSize',
                        sortable: true,
                        moveable: true,
                        width: 100,
                        render: (params) => {
                            if(params.fileSize/1024>1024){
                                return (params.fileSize/1024/1024).toFixed(2)+"MB";
                            }
                            else{
                                return (params.fileSize/1024).toFixed(2)+"KB";
                            }
                        }
                    },
                   {
                    text: "核心监测点标识",
                    name: "coreHospMark",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: "center",
                    render: (params) => {
                            if(params.coreHospMark == 1){
                                return "是";
                            }
                            else{
                                return "否";
                            }
                        }
                },
                    {
                        text: '进度',
                        name: 'processStr',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        text: '最后清洗时间',
                        name: 'lastCleanTimeStr',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },
                    {
                        text:'废弃原因',
                        name:'cancelReason',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },
                    {
                        text:'前置标记',
                        name:'signMessage',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },
                    
                   {
                        text:'详情',
                        name:'remark',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },
                    {
                        text: '操作',
                        width:80,
                        name: 'op',
                        filterable: false,
                        removeable: false,
                    }
                ],
                 excelColNew: [
                    {
                        title: '医院',
                        key: 'hospName',
                        width:200
                    },
                      {
                        title: '医院编码',
                        key: 'hospNo',
                        width:200,
                    },
                    {
                        title: '省份',
                        key: 'provinceName',
                        width:100
                    },
                    {
                        title: '城市',
                        key: 'cityName',
                        width:100
                    },
                    {
                        title: '数据年月',
                        key: 'yearMonth',
                        width:100
                    },
                    {
                        title: '数据类型',
                        key: 'dataType',
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
                        }
                    },
                    {
                        title: '上报类型',
                        key: 'uploadType',
                        width: 100,
                        render: (params) => {
                            if(params.uploadType==1){
                                return "医院上报";
                            }else if(params.uploadType==2){
                                return "代上报";
                            }else if(params.uploadType==3){
                                return "邮件上报";
                            }
                            return ""
                        }
                    },
                    {
                        title: '上传日期',
                        key: 'uploadDate',
                        width:150
                    },
                    {
                        title: '上报人',
                        key: 'reportor',
                        width:200
                    },
                    {
                        title: '文件名称',
                        key: 'sourceFileName',
                        width:200
                    },
                    {
                        title: '文件路径',
                        key: 'path',
                        width:400
                    },
                    {
                        title: '文件大小',
                        key: 'fileSize',
                        width: 100,
                        render: (params) => {
                            if(params.fileSize/1024>1024){
                                return (params.fileSize/1024/1024).toFixed(2)+"MB";
                            }
                            else{
                                return (params.fileSize/1024).toFixed(2)+"KB";
                            }
                        }
                    },
                     {
                    title: "核心监测点标识",
                    key: "coreHospMark",
                    width:100,
                    render: (params) => {
                      if(params.coreHospMark == 1){
                           return "是";
                            }
                            else{
                                return "否";
                            }
                        }
                     },
                    {
                        title: '进度',
                        key: 'processStr',
                        width:100
                    },
                    {
                        title: '最后清洗时间',
                        key: 'lastCleanTimeStr',
                        width:150
                    },
                    {
                        title:'废弃原因',
                        key:'cancelReason',
                        width:150
                    },
                    {
                        title:'详情',
                        key:'remark',
                        width:150
                    }
                ],

                reportColNew: [
                    {
                        title: '医院',
                        key: 'hospName',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                                {
                        text: '医院编码',
                        name: 'hospNo',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
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
                        title: '上报类型',
                        key: 'uploadType',
                        width: 100,
                        sortable: true,
                        moveable: true,
                        render: (params) => {
                            if(params.uploadType==1){
                                return "医院上报";
                            }else if(params.uploadType==2){
                                return "代上报";
                            }else if(params.uploadType==3){
                                return "邮件上报";
                            }
                            return ""
                        }
                    },
                    {
                        title: '上传日期',
                        key: 'uploadDate',
                        sortable: true,
                        moveable: true,
                        width:150,
                    },
                    {
                        title: '上报人',
                        key: 'reportor',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                    {
                        title: '文件名称',
                        key: 'sourceFileName',
                        sortable: true,
                        moveable: true,
                        width:200,
                    },
                    {
                        title: '文件路径',
                        key: 'path',
                        sortable: true,
                        moveable: true,
                        width:400,
                    },
                    
                    {
                        title: '文件大小',
                        key: 'fileSize',
                        sortable: true,
                        moveable: true,
                        width: 100,
                        render: (params) => {
                            if(params.fileSize/1024>1024){
                                return (params.fileSize/1024/1024).toFixed(2)+"MB";
                            }
                            else{
                                return (params.fileSize/1024).toFixed(2)+"KB";
                            }
                        }
                    },
                {
                    title: "核心监测点标识",
                    key: "coreHospMark",
                    width:100,
                    render: (params) => {
                      if(params.coreHospMark == 1){
                           return "是";
                            }
                            else{
                                return "否";
                            }
                        }
                     },
                    {
                        title: '进度',
                        key: 'processStr',
                        sortable: true,
                        moveable: true,
                        width:100,
                        align: 'center'
                    },
                    {
                        title: '最后清洗时间',
                        key: 'lastCleanTimeStr',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
                    },
                    {
                        title:'废弃原因',
                        key:'cancelReason',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'    
                                        },
                                                   {
                        title:'详情',
                        key:'remark',
                        sortable: true,
                        moveable: true,
                        width:150,
                        align: 'center'
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
                name: 'report.list',
                data:{
                    hospitalId:self.searchForm.hospitalName,
                    provinceId:self.searchForm.address.length==1?self.searchForm.address[0]:null,
                    cityId:self.searchForm.address.length==2?self.searchForm.address[1]:null,
                    dataType:self.searchForm.dataType,
                    uploadDate:self.searchForm.reportDate,
                    yearMonth: self.searchForm.yearMonth,
                    process: self.searchForm.processStr,
                    currentUserId:Vue.getUser().userId,
                    hospNo:self.searchForm.hospNo,
                    state:100,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.reportList=data.data.dataList || [];
                        self.newDatas = data.data.dataList;
                        self.pageConfig.totalItemCount=data.data.totalItemCount;
                         self.reportList.map(x=>{
                            if(x.path){
                                x.path=Vue.config.filePathPrefix+"upload\\"+x.path.replaceAll('/','\\')
                            }
                            return x;
                        })


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
        getReasonList(){
            var self=this;
            Vue.ajax.send({
                name: 'report.reasonList',
                data: {dataType:self.discardInfo.dataType},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.reasonList=data.data;
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
        discardOk(){
            this.$refs['discardForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'report.discard',
                        data: {
                            fileNo:self.discardForm.fileNo,
                            cancelReason:self.discardForm.cancelReason,
                            hospitalId:self.discardInfo.hospitalId,
                            cancelUser:Vue.getUser().userName,
                            remark:self.discardForm.remark
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.discard=false;
                                self.getReportList();
                                self.$Message.success('废弃提交成功！');
                                self.discardForm={
                                        fileNo:'',
                                        cancelReason:'',
                                        remark:''
                                    }
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                                self.loading = false;
                                self.$nextTick(() => {
                                    self.loading = true;
                                });
                            }
                        }
                    });
                }else{
                    this.loading = false;
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                }
            })   
        },
        discardOkCancel:function(){

                        this.discardForm={
                                        fileNo:'',
                                        cancelReason:'',
                                        remark:''
                                    }
        },
        confirmCancel:function(item){
            this.discard=true;
            this.$refs['discardForm'].resetFields();
            this.discardForm.remarks='';
            this.discardForm.fileNo=item.fileNo;
            this.discardInfo=item;
            if(this.discardInfo.dataType==10){
                this.discardInfo.dataTypeStr='购药';
            }else if(this.discardInfo.dataType==20){
                this.discardInfo.dataTypeStr='门急诊';
            }else if(this.discardInfo.dataType==30){
                this.discardInfo.dataTypeStr='病案';
            }else if(this.discardInfo.dataType==40){
                this.discardInfo.dataTypeStr='医嘱';
            }
            this.getReasonList();
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