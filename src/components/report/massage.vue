<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">消息通知</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline >
                <FormItem label="标题" :label-width="40">
                    <Input v-model="searchForm.title" style="width: 280px;" placeholder="请输入标题"/>
                </FormItem>
		        <FormItem label="通知日期" :label-width="80">
                    <DatePicker type="daterange" placeholder="请选择日期" :start-date="new Date(new Date().getTime() - 30*24*60*60*1000)" v-model="searchForm.date" style="width: 200px" @on-change="searchForm.date=$event"></DatePicker>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="serchList">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button type="primary" @click="messageAdd" v-authorize="'messageadd'">+ 新增消息通知</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            
             <CustomTable v-authorize="'messagelist'" :columnConfig='messageCol' :columnDatas='messageList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in messageCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{item[col.name]}}</td>
                   
                  <td>
                      <Button v-authorize="'messagedetail'" icon="md-eye" size="small" title="详情" type="primary" @click='detailShow=true;detailInfo=item;'></Button>
                      <Button v-authorize="'messagedelete'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='messageDelete(item)'></Button>
                    </td>
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
        <Modal title="新增消息通知" class-name="vertical-center-modal" v-model="addShow" @on-ok="addOk"  :loading="loading">
            <Form ref="addForm" :model="addForm" :rules="addValidate" :label-width="60">
                <FormItem label="标题" prop="title">
                    <Input v-model="addForm.title" :maxlength='30'></Input>
                </FormItem>
                <FormItem label="内容" prop="content">
                    <Input v-model="addForm.content" type="textarea" :autosize="{minRows: 4,maxRows: 8}"  :maxlength='166'></Input>
                </FormItem>
                <FormItem label="接收方" prop="receiveType">
                    <RadioGroup v-model="addForm.receiveType">
                        <Radio label="0">所有医院</Radio>
                        <Radio label="1">样本医院</Radio>
                        <Radio label="2">单个医院</Radio>
                    </RadioGroup>
                    <CheckboxGroup v-model="addForm.samples" v-show="addForm.receiveType==1">
                        <Checkbox v-for="item in sampleList" :label="item.groupId" :key="item.groupId">{{item.groupName}}</Checkbox>
                    </CheckboxGroup>
                    <Select v-model="addForm.receiveUser" filterable  v-show="addForm.receiveType==2">
                        <Option v-for="item in hospitalList" :value="item.hospitalId" :key="item.hospitalId">{{ item.hospitalName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="方式">
                    <CheckboxGroup v-model="addForm.pushMethods">
                        <Checkbox label="2">短信</Checkbox>
                        <Checkbox label="1">邮件</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="时间" prop="pushTime" class="push-fr">
                    <RadioGroup v-model="addForm.pushType">
                        <Radio label="0">立即发送</Radio>
                        <Radio label="1">定时发送</Radio>
                    </RadioGroup>
                    <DatePicker type="datetime" :options="datetimeOption" v-model="addForm.pushTime" v-if="addForm.pushType=='1'"  @on-change="addForm.pushTime=$event"></DatePicker>
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
    name: 'message',
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
            sampleList:[],
            hospitalList:[],
            addForm:{
                title:'',
                content:'',
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
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur'}
                ],
                content: [
                    { required: true, message: '内容不能为空', trigger: 'blur'}
                ],
                receiveType:[
                    { validator: validateReceiveTypeCheck, trigger: 'blur' }
                ],
                pushTime:[
                    { validator: validateSendTimeCheck, trigger: 'blur' }
                ]
            },
    		messageCol: [

                    {
                        text: '医院编号',
                        name: 'hospNo',
                        sortable: true,
                        moveable: true,
                        width:200
                    },
                    {
                        text: '消息通知标题',
                        name: 'title',
                        sortable: true,
                        moveable: true,
                        width:400
                    },
                    {
                        text: '消息通知内容',
                        name: 'content',
                        sortable: true,
                        moveable: true,
                        width:630
                    },
                    {
                        text: '通知日期',
                        name: 'pushTime',
                        sortable: true,
                        moveable: true,
                        width:200
                    },
                    {
                        text: '通知医院',
                        name: 'hospitalName',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                    {
                        text: '操作',
                        width:150,
                        filterable: false,
                        removeable: false,
                        name: 'op'
                    }
                ]                
    	}
    },
    activated: function() {
        this.getMessageList();
        this.getSampleList();
        this.getHospitalList()
    },
    methods: {
        getMessageList(){
            var self=this;
            Vue.ajax.send({
                name: 'message.list',
                data:{
                    title:self.searchForm.title,
                    uploadDate:self.searchForm.date,
                    receiverId:Vue.getUser().userId,
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
        getSampleList(){
            var self=this;
            Vue.ajax.send({
                name: 'sample.list',
                data: {
                    pageIndex:1,
                    pageSize:999
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.sampleList=data.data.dataList;
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
            this.pageConfig.totalItemCount=1; 
            this.pageConfig.pageIndex=1;
            this.getMessageList();
             
            
        },
        changePage(currentPage){
            this.pageConfig.pageIndex=currentPage;
            this.getMessageList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getMessageList();
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
                            self.getMessageList();
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
        messageAdd(){
            this.addShow=true;
            this.addForm.receiveType='0';
            this.addForm.samples=[];
            this.addForm.pushMethods=[];
            this.addForm.pushType='0';
            this.addForm.pushTime='';
            this.addForm.receiveUser=null;
            this.$refs['addForm'].resetFields();
        },
        addOk(){
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
            console.log(111);
                    var self=this;
                    var receiveUsers=[];
                    if(self.addForm.receiveType==2){                        
                        receiveUsers.push(self.addForm.receiveUser)
                    }else if(self.addForm.receiveType==1){
                        receiveUsers=self.addForm.samples
                    }
                    Vue.ajax.send({
                        name: 'message.add',
                        data: {
                            title:self.addForm.title,
                            content:self.addForm.content,
                            receiveType:self.addForm.receiveType,
                            receiveUsers:receiveUsers,
                            pushTime:self.addForm.pushType==0?'':self.addForm.pushTime.format('YYYY-MM-DD HH:mm:ss'),
                            pushMethods:self.addForm.pushMethods,
                            pushUser:Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addShow=false;
                                self.getMessageList();
                                self.$Message.success('新增消息提交成功！');
                            } else {
                                self.addShow=false;
                                self.$Modal.error({
                                    title: '',
                                    content: "请求过程中出现问题，请重试"
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