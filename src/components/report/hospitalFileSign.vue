<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">文件问题标记</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline >
                <FormItem label="数据类型" :label-width="60">
		            <Select v-model="searchForm.dataType" style="width: 120px;" clearable>
				        <Option value="10">购药</Option>
                        <Option value="20">门急诊</Option>
                        <Option value="30">病案</Option>
                        <Option value="40">医嘱</Option>
				    </Select>
		        </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospitalName" style="width: 120px;" filterable clearable>
                        <Option v-for="item in hospitalList" :value="item.hospitalId" :key="item.hospitalId">{{ item.hospitalName }}</Option>
                    </Select>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="serchList">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button type="primary" @click="signAdd" v-authorize="'signadd'">新增标记</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            
             <CustomTable v-authorize="'fileSign'" :columnConfig='messageCol' :columnDatas='messageList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in messageCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{item[col.name]}}</td>
                   
                  <!-- <td>
                      <Button v-authorize="'messagedelete'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='messageDelete(item)'></Button>
                    </td> -->
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="messageList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
                
            </div>
        </div>
        <Modal title="新增文件标记" class-name="vertical-center-modal" v-model="addShow" @on-ok="addOk"  :loading="loading">
            <Form ref="addForm" :model="addForm" :rules="addValidate" :label-width="60">
                <FormItem label="选择医院" prop="title">
                    <Select v-model="addForm.hospitalName" style="width: 120px;" filterable clearable>
                        <Option v-for="item in hospitalList" :value="item.hospitalId" :key="item.hospitalId">{{ item.hospitalName }}</Option>
                    </Select>
                </FormItem>
                 <FormItem label="数据类型" :label-width="60">
		            <Select v-model="addForm.dataType" style="width: 120px;" clearable>
				        <Option value="10">购药</Option>
                        <Option value="20">门急诊</Option>
                        <Option value="30">病案</Option>
                        <Option value="40">医嘱</Option>
				    </Select>
		        </FormItem>
                <FormItem label="内容" prop="content">
                    <Input v-model="addForm.signMessage" type="textarea" :autosize="{minRows: 4,maxRows: 8}"  :maxlength='166'></Input>
                </FormItem>

            </Form>
        </Modal>
        <Modal title="消息详情" class-name="vertical-center-modal" v-model="detailShow" @on-ok="detailShow=false">
            <Form :label-width="60">
                <FormItem label="标题" style="margin-bottom:0px;">
                    <h3>{{detailInfo.title}}</h3>
                </FormItem>
                <FormItem label="内容">
                    <span>{{detailInfo.content}}</span>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
export default {
    name: 'hospitalFileSign',
    components:{EmptyRow,CustomTable},
    data(){
        const validateReceiveTypeCheck = (rule, value, callback) => {
                if (this.addForm.receiveType=='1' && this.addForm.samples.length==0) {
                    return callback(new Error('请选择样本医院'));
                }
                if (this.addForm.receiveType=='2' && !this.addForm.receiveUser) {
                    return callback(new Error('请选择医院'));
                }
                return callback();
            };
        const validateSendTimeCheck = (rule, value, callback) => {
                if (this.addForm.pushType=='1' && !value) {
                    return callback(new Error('定时发送时间不能为空'));
                }
                return callback();
            };
    	return{   
            showModal: false,
            showDatas: [],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            }, 		
    		searchForm:{
                title:'',
                date:[]
            },
            messageList:[],	
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount:1,
            },
            addShow:false,
            detailShow:false,
            detailInfo:[],
            loading:true,
            // sampleList:[],
            hospitalList:[],
            addForm:{
                title:'',
                content:'',
               signMessage:'',
                receiveType:'0',
                samples:[],
                hospitalName:'',
                pushType:'0',
                pushTime:'',
                selectDate:'',
                pushMethods:[],
                receiveUser:null
            },
            datetimeOption: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            addValidate:{
                hospitalName: [
                    { required: true, message: '医院不能为空', trigger: 'blur'}
                ],
                signMessage: [
                    { required: true, message: '标记内容不能为空', trigger: 'blur'}
                ],
                dataType:[
                    {required: true, message: '标记内容不能为空', trigger: 'blur' }
                ]
            },
    		messageCol: [

                    {
                        text: '医院编号',
                        name: 'hospId',
                        sortable: true,
                        moveable: true,
                        width:200
                    },
                    {
                        text: '医院名称',
                        name: 'hospName',
                        sortable: true,
                        moveable: true,
                        width:400
                    },
                               {
                        text: '省份',
                        name: 'provinceName',
                        sortable: true,
                        moveable: true,
                        width:400
                    },
                    {
                         text: '城市',
                        name: 'cityName',
                        sortable: true,
                        moveable: true,
                        width:400
                    },
         
            {
                    text: '数据类型',
                    name: 'dataType',
                    width: 100,
                    sortable: true,
                    moveable: true,
                    render: (params) => {
                        if(params.dataType==10){
                           params.dataType= "购药";
                        }else if(params.dataType==20){
                           params.dataType= "门急诊";
                        }else if(params.dataType==30){
                            params.dataType= "病案";
                        }else if(params.dataType==40){
                            params.dataType= "医嘱";
                        }
                    }
                },
                    {
                        text: '标记信息',
                        name: 'signMessage',
                        sortable: true,
                        moveable: true,
                        width:200
                    },
                    {
                        text: '创建者',
                        name: 'createUser',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                                   {
                        text: '创建时间',
                        name: 'createTime',
                        sortable: true,
                        moveable: true,
                        width:300
                    }
                    //                {
                    //     text: '修改者',
                    //     name: 'updateUser',
                    //     sortable: true,
                    //     moveable: true,
                    //     width:300
                    // },             
                    //  {
                    //     text: '修改时间',
                    //     name: 'updateTime',
                    //     sortable: true,
                    //     moveable: true,
                    //     width:300
                    // }
                    // {
                    //     text: '操作',
                    //     width:150,
                    //     filterable: false,
                    //     removeable: false,
                    //     name: 'op'
                    // }
                ]                
    	}
    },
    activated: function() {
        this.getSignList();
        // this.getSampleList();
        this.getHospitalList()
    },
    methods: {
        getSignList(){
            var self=this;
            Vue.ajax.send({
                name: 'hospital.signQuery',
                data:{
                    datatype:self.searchForm.title,
                    hospId:self.searchForm.hospitalName,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.messageList=data.data.dataList || [];
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
        getHospitalList(){
            var self=this;
            Vue.ajax.send({
                name: 'sample.hospitalTree',
                data: {
                    hospitalName:'',
                    provinceId:null,
                    cityId:null,
                    pageIndex:1,
                    pageSize:999999999
                },
                success: function(data) {
                    if (!!data && data.code=='0') {    
                        self.hospitalList=data.data.dataList;        
                    } else { 
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        // getSampleList(){
        //     var self=this;
        //     Vue.ajax.send({
        //         name: 'sample.list',
        //         data: {
        //             pageIndex:1,
        //             pageSize:999
        //         },
        //         success: function(data) {
        //             if (!!data && data.code=='0') {
        //                 self.sampleList=data.data.dataList;
        //             } else {
        //                 this.$Modal.error({
        //                     title: '',
        //                     content: data.message
        //                 });
        //             }
        //         }
        //     });
        // },
        serchList () {
            this.pageConfig.totalItemCount=1; 
            this.pageConfig.pageIndex=1;
            this.getSignList();
                         
        },
        changePage(currentPage){
            this.pageConfig.pageIndex=currentPage;
            this.getSignList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getSignList();
        },
        messageDelete(item){
            this.$Modal.confirm({
                title: '删除确认',
                content: '确定要删除“'+item.title+'”？',
                onOk: () => {
                    var self=this;
                    Vue.ajax.send({
                    name: 'message.del',
                    data:{messageId:item.messageId},
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.$Message.info('消息通知删除成功');
                            self.getSignList();
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
        signAdd(){
            this.addForm.hospitalName='';
            this.addForm.dataType='';
            this.addForm.signMessage='';
            this.$refs['addForm'].resetFields();
                        this.addShow=true;

        },
        addOk(){
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'hospital.signAdd',
                        data: {
                            hospId:self.addForm.hospitalName,
                            signMessage:self.addForm.signMessage,
                            createUser:Vue.getUser().userName,
                            dataType: self.addForm.dataType
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addShow=false;
                                self.getSignList();
                                self.$Message.success('新增标记提交成功！');
                            } else {
                                self.addShow=false;
                                self.$Modal.error({
                                    title: '',
                                    content: "请求过程中出现问题，请注意数据类型和医院组合是唯一标识只能有一条标记"
                                });
                            }
                        }
                    });
                }else{
                    setTimeout(() => {
                        this.loading = false;
                        this.$nextTick(() => {
                            this.loading = true;
                        });
                    }, 0);
                }
            })   
        },
        sortColumn: function(column, asc) {
            this.currentSort.column = column;
            this.currentSort.asc = asc;
            },
        showData: function(datas, showColumns) {
            this.showDatas = datas;
            var self = this;
            if (this.currentSort.column != "") {
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