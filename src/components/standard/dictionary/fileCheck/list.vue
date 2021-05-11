<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">文件初检问题</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="文件初检问题" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入文件初检问题" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'resourceadd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            <!-- <div class="bg-white p20">
                <Button type="primary"  @click="addModal">新增</Button>
        	    <Table border :height="tableH" :columns="fileCheckCol" :data="fileCheckList" style="margin-top: 10px;"></Table>
                <div class="mt15 text-center">        	
        	        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                </div>
            </div> -->
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable  :columnConfig='resourceCol' :columnDatas='cityAggRelaitonList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-if="showColumns.indexOf('cgrId')>-1">{{item['cgrId']}}</td>
                        <td class="ellipsis" v-if="showColumns.indexOf('cityName')>-1">{{item['cityName']}}</td>
                        <td class="ellipsis" v-if="showColumns.indexOf('cityGroupName')>-1">{{item['cityGroupName']}}</td>
                 
                        <td>
                            <Button v-authorize="'resourceedit'" icon="md-create" size="small" title="编辑" type="warning" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'resourcedelete'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="cityAggRelaitonList.length>0">            
                        <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                        <Button type="text" class="fr" @click="showModal=true">
                            <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                            <span style="font-size:13px;"> 设置显示列</span>
                        </Button>
                    </div>
                </div>
            </div>
            

            <!-- 新增弹框 -->
            <Modal v-model="addModel" title="新增" class-name="vertical-center-modal" @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="fileCheckForm" ref="fileCheckFormAdd" :rules="ruleValidate" :label-width="110">
                    <FormItem label="上级初检问题" prop="superiorBlankout">
                        <Select v-model="fileCheckForm.superiorBlankout" @on-change="getDataLevel">
                            <OptionGroup label="0级编码">
                                <Option v-for="item in fileCheckAllList" v-if="item.dataLevel == 0" :value="item.blankout" :key="item.blankout">{{ item.blankoutName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级编码">
                                <Option v-for="item in fileCheckAllList" v-if="item.dataLevel == 1" :value="item.blankout" :key="item.blankout">{{ '&nbsp;&nbsp;&nbsp;' + item.blankoutName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="文件初检问题编号" prop="blankout">
                        <Input v-model.trim="fileCheckForm.blankout"  :maxlength="15"/>
                    </FormItem>
                    <FormItem label="文件初检问题" prop="blankoutName">
                        <Input v-model.trim="fileCheckForm.blankoutName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="数据等级">
                        <Input v-model="fileCheckForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    
                    <FormItem label="数据类型" prop="dataType">
                        <Select v-model="fileCheckForm.dataType" >
				            <Option :value="10">购药数据</Option>
                            <Option :value="20">门急诊数据</Option>
                            <Option :value="30">病案数据</Option>
                            <Option :value="40">医嘱数据</Option>
				        </Select>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="fileCheckForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
                </Form>
            </Modal> 
            <!-- 编辑弹框 -->
        <Modal v-model="editModel" :title="editTitle" class-name="vertical-center-modal" @on-ok="editFileCheckInfo" :loading="loading" >
            <Form ref="fileCheckForm" :model="fileCheckInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="fileCheckInfo.blankout"/>
                    <FormItem label="上级初检问题" prop="superiorBlankout">
                        <Select v-model="fileCheckInfo.superiorBlankout" @on-change="getDataLevel">
                            <OptionGroup label="0级编码">
                                <Option  v-for="item in fileCheckAllList" v-if="item.dataLevel==0" :value="item.blankout" :key="item.blankout">{{ item.blankoutName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级编码">
                                <Option  v-for="item in fileCheckAllList" v-if="item.dataLevel==1" :value="item.blankout" :key="item.blankout">{{ '&nbsp;&nbsp;&nbsp;' + item.blankoutName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                 
                    <FormItem label="文件初检问题" prop="blankoutName">
                        <Input v-model.trim="fileCheckInfo.blankoutName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="数据等级">
                        <Input v-model="fileCheckInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    
                    <FormItem label="数据类型" prop="dataType">
                        <Select v-model="fileCheckInfo.dataType" >
				            <Option :value="10">购药数据</Option>
                            <Option :value="20">门急诊数据</Option>
                            <Option :value="30">病案数据</Option>
                            <Option :value="40">医嘱数据</Option>
				        </Select>
                    </FormItem>
                    
                    <FormItem label="备注">
                        <Input v-model.trim="fileCheckInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form> 
        </Modal>
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="fileCheckOk(3)">
            <Form :model="fileCheckInfo" :label-width="90">
                <input type="hidden" v-model="fileCheckInfo.blankout"/>                
                <FormItem label="请选择不通过原因">
                    <Select v-model="fileCheckInfo.checkNoReason" class="cellLength" filterable>
                    <Option v-for="item in nopassReasonList" :value="item.unauditreasonName" :key="item.unauditreasonId">{{ item.unauditreasonName }}</Option>
                </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="fileCheckInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
    name: 'fileCheck',
    components: { EmptyRow, CustomTable },
    data(){
        const validateNo = (rule, value, callback) => {
            var reg=/^[0-9]/;
            if (!reg.test(value)) {
                callback(new Error('请输入数字'));
            } else {                
                callback();
            }
        };
    	return{
            tableH: 0,
    		searchForm:{
    			keywords:''
            },
             fileCheckForm: {
                blankout: '',
                blankoutName: '',
                dataLevel: 0,
                superiorBlankout: '',
                dataType: '',
                statusId: '',
                createUser: '',
                createTime: '',
                changeUser: '',
                changeTime: '',
                checkUser: '',
                checkTime: '',
                remark: ''
            },
            loadingAdd: true,
            loading: true,
            fileCheckList: [],
            fileCheckAllList: [],
            nopassReasonList: [],
            levelList: [],
            fileCheckInfo: {},
            noFileCheck: {},
            editTitle: '',
            okText: '',
            cancelText: '',
            editModel: false, //弹框状态(编辑)
            addModel: false, //弹框状态(新增)
            noPassModel: false, //弹框状态(不通过)
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
                blankout: [
                    { required: true, message: '文件初检问题编号不能为空', trigger: 'blur'}
                ],
                blankoutName: [
                    { required: true, message: '文件初检问题不能为空', trigger: 'blur'}
                ],
                // dataLevel: [
                //     { required: true, message: '请选择数据等级', trigger: 'blur'}
                // ],
                dataType: [
                    { required: true, message: '请选择数据类型', trigger: 'blur', type: 'number'}
                ],
                // superiorBlankout: [
                //     { required: true, message: '请选择上级文件初检问题', trigger: 'blur'}
                // ]
            },
            resourceCol: [
                {
                    text: "编号",
                    name: "cgrId",
                    filterable: false,
                    removeable: false,
                    width: 150
                },
                {
                    text: "城市",
                    name: "cityName",
                    filterable: false,
                    removeable: false,
                    width: 400
                },
                {
                    text: "城市群",
                    name: "cityGroupName",
                    filterable: false,
                    removeable: false,
                    width: 400
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 200
                }
            ],
    		fileCheckCol: [
                    {
                        title: '编号',
                        key: 'blankout',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '文件初检问题',
                        key: 'blankoutName',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '数据等级',
                        key: 'dataLevel',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '上级原因编号',
                        key: 'superiorBlankout',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '数据类型',
                        key: 'dataType',
                        align: 'center',
                        width: 100,
                        render: (h, params) => { 
                            if(params.row.dataType==10){
                                return h('span',{},'购药数据');
                            }else if(params.row.dataType==20){
                                return h('span',{},'门急诊数据');
                            }else if(params.row.dataType==30){
                                return h('span',{},'病案数据');
                            }else if(params.row.dataType==40){
                                return h('span',{},'医嘱数据');
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'statusId',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if(params.row.statusId==0){
                                return h('span',{},'停用');
                            }else if(params.row.statusId==1){
                                return h('span',{},'待审批');
                            }else if(params.row.statusId==2){
                                return h('span',{},'通过');
                            }else if(params.row.statusId==3){
                                return h('span',{},'不通过');
                            }else if(params.row.statusId==4){
                                return h('span',{},'发布');
                            }
                        }
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '修改人',
                        key: 'changeUser',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '修改时间',
                        key: 'changeTime',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '审核人',
                        key: 'checkUser',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '审核时间',
                        key: 'checkTime',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '审核不通过原因',
                        key: 'checkNoReason',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: "审核不通过备注",
                        key: "checkNoReasonMemo",
                        align: 'center',
                        width: 150
                    },
                    {
                        title: "备注",
                        key: "remark",
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 180,
                        fixed: "right",
                        render: (h, params) => {
                            return h('div', [
                                
                                h('Button', {
                                    props: {
                                        icon:'md-checkmark-circle',
                                    },
                                    class: "btn-green",
                                    attrs: {
                                        title: '通过'
                                    },
                                    style: {
                                        display:  params.row.statusId == 1
                                                ? "inline-block"
                                                : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.fileCheckInfo = Object.assign({},params.row);
                                            this.fileCheckOk(2);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-close-circle',
                                    },
                                    class:'btn-red',
                                    attrs: {
                                        title: '不通过'
                                    },
                                    style: {
                                        display:  params.row.statusId == 1
                                                ? "inline-block"
                                                : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.noPassModel = true;
                                            this.fileCheckInfo = Object.assign({},params.row);
                                            this.getAuditList();
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-create'
                                    },
                                    class:'btn-green',
                                    attrs: {
                                        title: '编辑'
                                    },
                                    on: {
                                        click: () => {
                                            this.$refs['fileCheckForm'].resetFields();
                                            this.editTitle = "编辑";
                                            this.okText = "确定";
                                            this.cancelText = "取消";
                                            this.editModel = true;
                                            this.fileCheckInfo = Object.assign({},params.row);
                                            
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-paper-plane',
                                    },
                                    class:'btn-orange',
                                    attrs: {
                                        title: '发布'
                                    },
                                    style: {
                                        display:  params.row.statusId == 2
                                                ? "inline-block"
                                                : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '发布确认',
                                                content: '确定要发布“'+params.row.blankout+'”？',
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'fileCheck.review',
                                                    data:{
                                                         blankout: params.row.blankout,
                                                         blankoutName: params.row.blankoutName,
                                                         dataLevel: params.row.dataLevel,
                                                         dataType: params.row.dataType,
                                                         superiorBlankout: params.row.superiorBlankout,
                                                         statusId: '4',
                                                         changeUser: Vue.getUser().userName,
                                                         remark: params.row.remark
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            self.$Message.info('文件初检问题信息发布成功');
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
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: params.row.statusId == 0 
                                                        ? 'md-play'
                                                        : 'md-remove',
                                    },
                                    class: params.row.statusId == 0 
                                                        ? 'btn-deep-blue' 
                                                        : 'btn-red',
                                    attrs: {
                                        title: params.row.statusId == 0 
                                                        ? '启用' 
                                                        : '停用',
                                    },
                                    style: {
                                        display:  params.row.statusId == 0 || params.row.statusId == 4
                                                ? "inline-block"
                                                : "none"
                                    },
                                    on: {
                                        click: () => {
                                             this.$Modal.confirm({
                                                title: params.row.statusId == 0 
                                                        ? '启用确认' 
                                                        : '停用确认',
                                                content: params.row.statusId == 0 
                                                        ? '确定要启用“'+params.row.blankoutName+'”？'
                                                        : '确定要停用“'+params.row.blankoutName+'”？',
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'fileCheck.review',
                                                    data:{
                                                        blankout: params.row.blankout,
                                                        blankoutName: params.row.blankoutName,
                                                        dataLevel: params.row.dataLevel,
                                                        dataType: params.row.dataType,
                                                        superiorBlankout: params.row.superiorBlankout,
                                                        statusId: params.row.statusId == 0 
                                                                 ? '4' 
                                                                 : '0',
                                                        changeUser: Vue.getUser().userName,
                                                        remark: params.row.remark
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            params.row.statusId == 0 
                                                                ? self.$Message.info('文件初检问题信息启用成功') 
                                                                : self.$Message.info('文件初检问题信息停用成功');
                                                                self.getFileCheckList();
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
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-close',
                                    },
                                    class: 'btn-red',
                                    attrs: {
                                        title: '删除'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除确认',
                                                content: '确定要删除“'+params.row.blankoutName+'”？',
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'fileCheck.del',
                                                    data:{
                                                        blankout: params.row.blankout,
                                                        changeUser: Vue.getUser().userName
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            self.$Message.info('文件初检问题信息删除成功');
                                                            self.fileCheckList.splice(params.index,1);
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
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ]
        }
    },
    mounted: function() {
        this.getFileCheckList();
        //获取所有的文件初检数据
        this.getAllFileCheckList();
    },
    methods: {
        //获取审核不通过原因
        getAuditList() {
            var self = this;
            Vue.ajax.send({
                name: "common.auditNOList",
                data: {
                    pageIndex: 1, //页码
                    pageSize: 99999 //每页条数
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.nopassReasonList = data.data.dataList;
                        self.fileCheckInfo.checkNoReason=self.nopassReasonList[0].unauditreasonName;

                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        getAllFileCheckList(value){
            var self = this;
            Vue.ajax.send({
                name: 'fileCheck.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.fileCheckAllList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getFileCheckList(pageIndex){
            var self = this;
            Vue.ajax.send({
                name: 'fileCheck.list',
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageIndex,
                    pageSize: self.pageConfig.pageSize,
                    blankoutName: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.fileCheckList = data.data.dataList;
                        self.pageConfig.totalItemCount = data.data.totalItemCount;
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
            this.pageConfig.pageIndex = currentPage;
            this.getFileCheckList();
        },
        changeSize(num){
            this.pageConfig.pageSize = num;
            this.getFileCheckList();
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
        getDataLevel(value) {
             var item = this.fileCheckAllList.filter(x=> x.blankout==value);
             this.fileCheckForm.dataLevel = item[0].dataLevel+1;
        },
        addModal() {
            this.$refs['fileCheckFormAdd'].resetFields();
            this.fileCheckForm.remark = "";
            this.addModel = true;
        },
        addOk() {
            this.$refs['fileCheckFormAdd'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'fileCheck.add',
                        data: {
                            blankout: self.fileCheckForm.blankout,
                            blankoutName: self.fileCheckForm.blankoutName,
                            dataLevel: self.fileCheckForm.dataLevel,
                            dataType: self.fileCheckForm.dataType,
                            superiorBlankout: self.fileCheckForm.superiorBlankout,
                            createUser: Vue.getUser().userName,
                            remark: self.fileCheckForm.remark,
                            statusId: '0'
                        },
                        success: function(data) {
                            setTimeout(() => {
                                    self.loadingAdd = false;
                                    self.$nextTick(() => {
                                        self.loadingAdd = true;
                                    });
                                }, 0);
                            if (!!data && data.code=='0') {
                                self.addModel = false;
                                self.$refs['fileCheckFormAdd'].resetFields();
                                self.$Message.success('新增文件初检问题提交成功！');
                                self.getFileCheckList();
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }else{
                    setTimeout(() => {
                        this.loadingAdd = false;
                        this.$nextTick(() => {
                            this.loadingAdd = true;
                        });
                    }, 0);
                }
            })  
        },
        fileCheckOk(value){
            var self=this;
                    Vue.ajax.send({
                        name: 'fileCheck.review',
                        data: {
                            blankout: self.fileCheckInfo.blankout,
                            blankoutName: self.fileCheckInfo.blankoutName,
                            dataLevel: self.fileCheckInfo.dataLevel,
                            dataType: self.fileCheckInfo.dataType,
                            superiorBlankout: self.fileCheckInfo.superiorBlankout,
                            changeUser: Vue.getUser().userName,
                            checkUser: Vue.getUser().userName,
                            statusId: value,
                            checkNoReason: self.fileCheckInfo.checkNoReason,
                            checkNoReasonMemo: self.fileCheckInfo.checkNoReasonMemo
                        },
                        success: function(data) {
                            setTimeout(() => {
                                self.loading = false;
                                self.$nextTick(() => {
                                    self.loading = true;
                                });
                            }, 0);
                            if (!!data && data.code=='0') {
                                self.editModel = false;
                                value == 2 
                                ? self.$Message.success('初检问题通过信息提交成功！') 
                                : self.$Message.success('初检问题不通过信息提交成功！');
                                self.getFileCheckList();
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
        },
        editFileCheckInfo() {
            this.$refs['fileCheckForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'fileCheck.edit',
                        data: {
                            blankout: self.fileCheckInfo.blankout,
                            blankoutName: self.fileCheckInfo.blankoutName,
                            dataLevel: self.fileCheckInfo.dataLevel,
                            dataType: self.fileCheckInfo.dataType,
                            superiorBlankout: self.fileCheckInfo.superiorBlankout,
                            changeUser: Vue.getUser().userName,
                            checkUser: self.fileCheckInfo.checkUser,
                            statusId: 1,
                            remark: self.fileCheckInfo.remark
                        },
                        success: function(data) {
                            setTimeout(() => {
                                self.loading = false;
                                self.$nextTick(() => {
                                    self.loading = true;
                                });
                            }, 0);
                            if (!!data && data.code=='0') {
                                self.editModel = false;
                                self.$Message.success('初检问题' + self.editTitle+ '成功！');
                                self.getFileCheckList();
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
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
