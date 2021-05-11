<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">数据质疑原因</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInlineaddModal" inline>
                    <FormItem label="质疑原因" :label-width="80">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入质疑原因" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'resourceadd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable  :columnConfig='resourceCol' :columnDatas='cityAggRelaitonList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                        <td class="ellipsis" v-if="showColumns.indexOf('cgrId')>-1">{{item['cgrId']}}</td>
                        <td class="ellipsis" v-if="showColumns.indexOf('cityName')>-1">{{item['cityName']}}</td>
                        <td class="ellipsis" v-if="showColumns.indexOf('cityGroupName')>-1">{{item['cityGroupName']}}</td>
                 
                        <td>
                            <Button v-authorize="'resourceedit'" icon="md-create" size="small" title="编辑" type="success" 
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
            <Modal v-model="addModel" title="新增" class-name="vertical-center-modal"  @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="queryForm" ref="queryFormAdd"  :rules="ruleValidate" :label-width="100">
                    <FormItem label="质疑原因编号" prop="code">
                        <Input v-model.trim="queryForm.code" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="质疑原因" prop="content">
                        <Input v-model.trim="queryForm.content"  :maxlength="30"/>
                    </FormItem>
                    <FormItem label="是否自动确认" >
                        <Select v-model="queryForm.isAutoConfirm">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="queryForm.remark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                    
                    
                </Form>
            </Modal> 

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="queryOk" :loading="loading" :mask-closable="false">
            <Form ref="queryForm" :model="queryInfo" :rules="ruleValidate" :label-width="100">
                    <input type="hidden" v-model="queryInfo.code"/>
                    <FormItem label="质疑原因" prop="content">
                        <Input v-model.trim="queryInfo.content" :maxlength="30"/>
                    </FormItem>
                    <FormItem label="是否自动确认">
                        <Select v-model="queryInfo.isAutoConfirm">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="queryInfo.remark" :maxlength="150" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
    name: 'query',
    components: { EmptyRow, CustomTable },
    data(){
    	return{
            tableH: 0,
    		searchForm:{
    			keywords:''
            },
            queryForm: {
                code: '',
                content: '',
                remark: '',
                isAutoConfirm: ''
            },
            loadingAdd: true,
            loading: true,
            queryList: [],
            queryInfo: {},
            addModel: false, //弹框状态(新增)
            editModel: false, //弹框状态(编辑)
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
                code: [
                    { required: true, message: '质疑原因编号不能为空', trigger: 'blur'}
                ],
                content: [
                    { required: true, message: '质疑原因不能为空', trigger: 'blur'}
                ]
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
    		queryCol: [
                    {
                        title: '编号',
                        key: 'code',
                        align: 'center'
                    },
                    {
                        title: '质疑原因',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: "备注",
                        key: "remark",
                        align: 'center'
                    },
                    {
                        title: '是否自动确认',
                        key: 'isAutoConfirm',
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.isAutoConfirm==0){
                                return h('span',{},'否');
                            }else if(params.row.isAutoConfirm==1){
                                return h('span',{},'是');
                            }
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 120,
                        fixed: "right",
                        render: (h, params) => {
                            return h('div', [
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
                                            this.$refs['queryForm'].resetFields();
                                            this.editModel = true;
                                            this.queryInfo = Object.assign({},params.row);
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
                                                content: '确定要删除“'+params.row.content+'”？',
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'query.del',
                                                    data:{
                                                        code:params.row.code
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            self.$Message.info('质疑原因信息删除成功');
                                                            self.queryList.splice(params.index,1);
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
        this.getQueryList();
    },
    methods: {
        getQueryList(pageIndex){
            var self = this;
            Vue.ajax.send({
                name: 'query.list',
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    content: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.queryList = data.data.dataList;
                        self.pageConfig.totalItemCount = data.data.totalItemCount;

                        //mock数据
                        // self.queryList = data.data[0].dataList;
                        // self.pageConfig.totalItemCount = data.data[0].totalItemCount;
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
            this.pageConfig.pageNum = currentPage;
            this.getQueryList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getQueryList();
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
        addModal() {
            this.$refs['queryFormAdd'].resetFields();
            this.queryForm.remark = "";
            this.queryForm.isAutoConfirm = "";
            this.addModel = true;
        },
        addOk() {
            this.$refs['queryFormAdd'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'query.add',
                        data: {
                            code: self.queryForm.code,
                            content: self.queryForm.content,
                            isAutoConfirm: self.queryForm.isAutoConfirm,
                            remark: self.queryForm.remark
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
                                self.$refs['queryFormAdd'].resetFields();
                                self.$Message.success('新增质疑原因提交成功！');
                                self.getQueryList();
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
        queryOk(){
            
            this.$refs['queryForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'query.edit',
                        data: {
                            code: self.queryInfo.code,
                            content: self.queryInfo.content,
                            isAutoConfirm: self.queryInfo.isAutoConfirm,
                            remark: self.queryInfo.remark
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
                                self.$Message.success('编辑质疑原因提交成功！');
                                self.getQueryList();
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