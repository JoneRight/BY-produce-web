<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <div class="fr"><Button v-authorize="'ReportManageDataReportAdd'" type="primary" to="/dataReportManage/detail">+ 新增数据报告</Button></div>
        <h2 class="common-title">数据报告管理</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="标题" :label-width="40">
                    <Input v-model="searchForm.title" style="width: 280px;" />
                </FormItem>
		        <FormItem label="发布时间" :label-width="70">
                    <DatePicker type="daterange" :start-date="new Date(new Date().getTime() - 30*24*60*60*1000)" v-model="searchForm.date" style="width: 200px" :editable="false"></DatePicker>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="serchList">检索</Button>
		        </FormItem>
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
              <CustomTable :columnConfig='dataReportCol' :columnDatas='dataReportList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr   v-for="(item,index) in showDatas" :key="index">
                      
                      <td class="ellipsis" v-for="(col) in dataReportCol.filter(m=>m.name!='op' && m.name!='multi')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{dataReportCol.find(m=>m.name==col.name).render?dataReportCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                        
                      <td>
                        <Button v-authorize="'ReportManageDataReportShow'" icon="md-eye" size="small" title="查看" type="success" @click='$router.push("/dataReportManage/detail?Id="+item.reportId+"&&type=1")'></Button>
                        <Button v-authorize="'ReportManageDataReportEdit'" icon="md-create" size="small" title="编辑" type="primary" @click='$router.push("/dataReportManage/detail?Id="+item.reportId+"&&type=2")'></Button>
                        <Button v-if="item.isPublish!=1" v-authorize="'ReportManageDataReportPublish'" icon="md-paper-plane" size="small" title="发布" type="warning"  @click='getUserTree();getHospExampleList();clearPublishSelected();publishModalIsShow=true;reportId = item.reportId;'></Button>
                        <Button v-authorize="'ReportManageDataReportDelete'" icon="md-close" size="small" title="删除" type="error"  @click='deleteConfirm(item)'></Button>
                      </td>
                    </tr>
              </CustomTable>
            <EmptyRow v-if="!dataReportList || dataReportList.length==0"/>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="dataReportList.length>0">    
                   
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
          </div>

        <!-- 发布框 -->
        <Modal title="请选择发布对象" ok-text="发布" width="650" class-name="vertical-center-modal" v-model="publishModalIsShow" @on-ok="publishReport">
            <Form ref="formPublish" :label-width="80">
                <FormItem label="全国">
                    <Select v-model="countryIdList" filterable multiple style="width:500px" placeholder="请选择全国">
                        <Option v-for="item in countryList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="省厅">
                    <Select v-model="provinceCodeList" filterable multiple style="width:500px" placeholder="请选择省厅">
                        <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院">
                    <Select v-model="hsopIdList" filterable multiple style="width:500px" placeholder="请选择医院">
                        <Option v-for="item in hsopList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院样本">
                    <Select v-model="hsopExampleIdList" filterable multiple style="width:500px" placeholder="请选择医院样本">
                        <Option v-for="item in hsopExampleList" :value="item.groupId" :key="item.groupId">{{ item.groupName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="企业">
                    <Select v-model="companyIdList" filterable multiple style="width:500px" placeholder="请选择企业">
                        <Option v-for="item in companyList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
export default {
    name: 'duplicateCheck',
    components:{EmptyRow,CustomTable,CheckboxGroup,Checkbox},
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
    			date:[],
    			title:''
            }, 
            // 发布弹窗是否显示
            publishModalIsShow:false, 
            // 报告ID 发布弹窗时，赋值
            reportId:'',
            // 全国用户类型，弹窗调用getUserTree时赋值
            countryUserTypeId: '',
            // 省厅用户类型，弹窗调用getUserTree时赋值
            provinceUserTypeId:'',
            // 医院用户类型，弹窗调用getUserTree时赋值
            hospUserTypeId:'',
            // 企业用户类型，弹窗调用getUserTree时赋值
            companyUserTypeId:'',
             // 所有全国用户列表，弹窗调用getUserTree时赋值
            countryList:[],
             // 所有省份用户列表，弹窗调用getUserTree时赋值
            provinceList:[],
            // 所有医院用户列表	，弹窗调用getUserTree时赋值
            hsopList:[],
            // 所有企业用户列表	，弹窗调用getUserTree时赋值
            companyList:[],
            // 所有医院样本列表	，弹窗调用getHospExampleList时赋值
            hsopExampleList:[],

            // 所有所选全国ID列表
            countryIdList:[],
            // 所有所选省份ID列表
            provinceCodeList:[],
            // 所有所选医院ID列表	
            hsopIdList:[],
            // 所有所选医院样本ID列表	
            hsopExampleIdList:[],
            // 所有所选企业ID列表	
            companyIdList:[],


            // 数据报告列表
            dataReportList:[],    
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount:1,
            },	
    		dataReportCol: [
                    {
                        text: '标题',
                        name: 'title',
                        width: 400,
                        sortable: true,
                        moveable: true,
                    },
                    {
                        text: '概要',
                        name: 'summary',
                        sortable: true,
                        moveable: true,
                        width: 600
                    },
                    {
                        text: '阅读量',
                        name: 'readCount',
                        align: 'center',
                        sortable: true,
                        moveable: true,
                        width:100
                    },
                    {
                        text: '下载量',
                        name: 'downloadCount',
                        align: 'center',
                        sortable: true,
                        moveable: true,
                        width:100
                    },
                    {
                        text: '发布时间',
                        name: 'createTimeStr',
                        sortable: true,
                        moveable: true,
                        width:200,
                        align: 'center'
                    },
                    {
                        text: '操作',
                        width:200,
                        filterable: false,
                        removeable: false,
                        name: 'op',
                    }
                ],
    	}
    },
    activated: function() {
        this.getDataReportList();
    },
    methods: {
        deleteConfirm(item){
            this.$Modal.confirm({
                title: '删除确认',
                content: '确定要删除“'+item.title+'”？',
                onOk: () => {
                    var self=this;
                    Vue.ajax.send({
                    name: 'dataReport.del',
                    data:{
                            id:item.reportId,
                            changeUser:Vue.getUser().userName
                        },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.$Message.info('数据报告删除成功');
                            self.getDataReportList();
                        } else {
                            self.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
                    
                }
            });
        },
        // 清空发布弹窗中所有所选
        clearPublishSelected(){
            this.countryIdList=[];
            this.provinceCodeList=[];
            this.hsopIdList=[];
            this.hsopExampleIdList=[];
            this.companyIdList=[];
        },

        // 报告发布
        publishReport(){
            var self=this;
            if(!self.reportId){
               self.$Modal.error({
                    title: '',
                    content: '请选择要发布的报告！'
                }); 
            }else  if(self.countryIdList.length==0 && self.provinceCodeList.length==0 && self.hsopIdList.length==0 && self.hsopExampleIdList.length==0 && self.companyIdList.length==0){
               self.$Modal.error({
                    title: '',
                    content: '请选择发布对象！'
                }); 
            }else{
                // 发布操作
                Vue.ajax.send({
                    name: "dataReport.publish",
                    data: { 
                        reportId: self.reportId, 
                        countryUserTypeId: self.countryUserTypeId,
                        provinceUserTypeId:self.provinceUserTypeId,
                        hospUserTypeId:self.hospUserTypeId,
                        companyUserTypeId:self.companyUserTypeId,
                        countryIdList:self.countryIdList,
                        provinceCodeList:self.provinceCodeList,
                        hsopIdList:self.hsopIdList,
                        hsopExampleIdList:self.hsopExampleIdList,
                        companyIdList:self.companyIdList
                    },
                    success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success('发布数据报告成功！');
                        // 关闭弹窗
                        self.publishModalIsShow=false;
                        self.getDataReportList();
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                    }
                });
            }
        },

        // 获取医院样本
        getHospExampleList() {
            var self=this;
            Vue.ajax.send({
                name: "sample.list",
                data: { 
                    pageIndex: 1, 
                    pageSize: 99999
                },
                success: function(data) {
                if (!!data && data.code == "0") {
                    self.hsopExampleList = data.data.dataList;
                } else {
                    self.$Modal.error({
                        title: "",
                        content: data.message
                    });
                }
                }
            });
        },

        // 获取 发布对象  全国 省份 医院 企业
        getUserTree(){
            var self=this;
            Vue.ajax.send({
                name: 'userType.userTree',
                data:{},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.countryList=data.data[0].children;
                        self.countryUserTypeId=data.data[0].id;
                        self.provinceList=data.data[1].children;
                        self.provinceUserTypeId=data.data[1].id;
                        self.hsopList=data.data[2].children;
                        self.hospUserTypeId=data.data[2].id;
                        self.companyList=data.data[3].children;
                        self.companyUserTypeId=data.data[3].id;
                    } else {
                        self.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },

        getDataReportList(){
            var self=this;
            Vue.ajax.send({
                name: 'dataReport.list',
                data:{
                    title:self.searchForm.title,
                    createTime:self.searchForm.date,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.dataReportList=data.data.dataList;
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
        serchList () {
            this.pageConfig.pageIndex=1;
            this.getDataReportList();
        },
        changePage(currentPage){
            this.pageConfig.pageIndex=currentPage;
            this.getDataReportList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getMessageList();
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