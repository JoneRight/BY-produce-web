<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">审核不通过原因</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="标准类型名称" :label-width="100">
                        <Select v-model="searchForm.unaudittypeId" filterable clearable style="width: 200px;">
                            <Option v-for="item in baseTypeList" :value="item.unaudittypeId" :key="item.unaudittypeId">{{ item.unaudittypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审核不通过原因" :label-width="120">
                        <Input v-model="searchForm.unauditreasonName" type="text" placeholder="请输入审核不通过原因" style="width: 260px;" />
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
        	    <Table border :height="tableH" :columns="mapRejectedCol" :data="mapRejectedList" style="margin-top: 10px;"></Table>
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
                
                <Form :model="mapRejectedForm" ref="mapRejectedFormAdd" :rules="ruleValidate" :label-width="150">
                    <FormItem label="映射审核不通过原因" prop="unauditreasonName">
                        <Input v-model.trim="mapRejectedForm.unauditreasonName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="标准类型名称"  prop="unaudittypeId" type="text">
                        <Select v-model="mapRejectedForm.unaudittypeId">
                            <Option v-for="item in baseTypeList" :value="item.unaudittypeId" :key="item.unaudittypeId">{{ item.unaudittypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="mapRejectedForm.remark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
            </Modal>
            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="mapRejectedOk" :loading="loading" :mask-closable="false">
            <Form ref="mapRejectedForm" :model="mapRejectedInfo" :rules="ruleValidate" :label-width="150">
                    <input type="hidden" v-model="mapRejectedInfo.unauditreasonId"/>
                    <FormItem label="映射审核不通过原因" prop="unauditreasonName">
                        <Input v-model.trim="mapRejectedInfo.unauditreasonName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="标准类型名称" prop="unaudittypeId" type="text">
                        <Select v-model="mapRejectedInfo.unaudittypeId">
                            <Option v-for="item in baseTypeList" :value="item.unaudittypeId" :key="item.unaudittypeId">{{ item.unaudittypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="mapRejectedInfo.remark" :maxlength="150" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
    name: 'mapRejected',
    components: { EmptyRow, CustomTable },
    data(){
    	return{
            tableH: 0,
    		searchForm:{
                unauditreasonName:'',
                unaudittypeId: ''
            },
            mapRejectedForm: {
                unauditreasonId: '',
                unauditreasonName: '',
                unaudittypeId: '',
                unaudittypeName: '',
                remark: ''
            },
            loadingAdd: true,
            loading: true,
            mapRejectedList: [],
            baseTypeList: [],
            mapRejectedInfo: {},
            editModel: false, //弹框状态(编辑)
            addModel: false, //弹框状态(新增)
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
                unauditreasonName: [
                    { required: true, message: '审核不通过原因不能为空', trigger: 'blur'}
                ],
                unaudittypeId: [
                    { required: true, message: '标准类型名称不能为空', trigger: 'blur'}
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
    		mapRejectedCol: [
                    {
                        title: '编号',
                        key: 'unauditreasonId',
                        align: 'center'
                    },
                    {
                        title: '审核不通过原因',
                        key: 'unauditreasonName',
                        align: 'center'
                    },
                    {
                        title: '标准类型名称',
                        key: 'unaudittypeName',
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: "remark",
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 110,
                        fixed: "right",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon:'md-create',
                                    },
                                    class:'btn-green',
                                    attrs: {
                                        title: '编辑'
                                    },
                                    on: {
                                        click: () => {
                                            this.$refs['mapRejectedForm'].resetFields();
                                            this.editModel = true;
                                            this.mapRejectedInfo = Object.assign({},params.row);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-close',
                                    },
                                    class:'btn-red',
                                    attrs: {
                                        title: '删除'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除确认',
                                                content: '确定要删除“'+params.row.unauditreasonName+'”？',
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'mapRejected.del',
                                                    data:{
                                                        unauditreasonId: params.row.unauditreasonId
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            self.$Message.info('映射审核不通过信息删除成功');
                                                            self.mapRejectedList.splice(params.index,1);
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
        this.getMapRejectedList();
        this.getBaseTypeList();
    },
    methods: {
        getMapRejectedList(pageIndex){
            var self = this;
            Vue.ajax.send({
                name: 'mapRejected.list',
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    unauditreasonName: self.searchForm.unauditreasonName,
                    unaudittypeId: self.searchForm.unaudittypeId
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.mapRejectedList = data.data.dataList;
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
        getBaseTypeList(){
            var self = this;
            Vue.ajax.send({
                name: 'mapRejected.baseTypeList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.baseTypeList = data.data.dataList;
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
            this.pageConfig.pageNum = currentPage;
            this.getMapRejectedList();
        },
         changeSize(num){
            this.pageConfig.pageSize = num;
            this.getMapRejectedList();
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
            this.$refs['mapRejectedFormAdd'].resetFields();
            this.mapRejectedForm.remark = "";
            this.addModel = true;
        },
        addOk() {
            this.$refs['mapRejectedFormAdd'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'mapRejected.add',
                        data: {
                            // unauditreasonId: self.mapRejectedForm.unauditreasonId,
                            unauditreasonName: self.mapRejectedForm.unauditreasonName,
                            unaudittypeId: self.mapRejectedForm.unaudittypeId,
                            remark: self.mapRejectedForm.remark
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
                                self.$refs['mapRejectedFormAdd'].resetFields();
                                self.$Message.success('新增映射审核不通过原因提交成功！');
                                self.getMapRejectedList();
                            } else {
                                self.addModel = false;
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
        mapRejectedOk(){
            console.log(this.mapRejectedInfo.mapRejected);
            this.$refs['mapRejectedForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'mapRejected.edit',
                        data: {
                            unauditreasonId: self.mapRejectedInfo.unauditreasonId,
                            unauditreasonName: self.mapRejectedInfo.unauditreasonName,
                            unaudittypeId: self.mapRejectedInfo.unaudittypeId,
                            remark: self.mapRejectedInfo.remark
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
                                self.$Message.success('编辑映射审核不通过原因提交成功！');
                                self.getMapRejectedList();
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