<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">计量单位</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="计量单位名称" :label-width="100">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入计量单位名称" style="width: 260px;" />
                    </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button type="primary" @click="addModal" v-authorize="'DictionaryunitAdd'">+ 新增</Button>
		            </FormItem>
                </Form>
            </div>
            <div class="bg-white mt15" style="height:100%;">
                <CustomTable v-authorize="'DictionaryunitQuery'" :columnConfig='resourceCol' :columnDatas='unitList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                    <tr v-for="(item,index) in showDatas" :key="index">
                         <td class="ellipsis" v-for="(col) in resourceCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{resourceCol.find(m=>m.name==col.name).render?resourceCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                 
                        <td>
                            <Button v-authorize="'DictionaryunitEditByKey'" icon="md-create" size="small" title="编辑" type="success" 
                                    class="btn-green" @click='editItem(item)'></Button>
                            <Button v-authorize="'DictionaryunitDeleteByKey'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='deleteItem(item)'></Button>
                        </td>
                    </tr>
                    <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>
                </CustomTable>
                <div style="" class="page-footer">            
                    <div class="mt15 text-center" v-if="unitList.length>0">            
                        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                        <Button type="text" class="fr" @click="showModal=true">
                            <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                            <span style="font-size:13px;"> 设置显示列</span>
                        </Button>
                    </div>
                </div>
            </div>
            

            <!-- 新增弹框 -->
            <Modal v-model="addModel" title="新增" class-name="vertical-center-modal" @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="unitForm" ref="unitFormAdd"  :rules="ruleValidate" :label-width="110">
                    <FormItem label="计量单位编号" prop="unit">
                        <Input v-model.trim="unitForm.unit" :maxlength="9"/>
                    </FormItem>
                    <FormItem label="计量单位名称" prop="unitName">
                        <Input v-model.trim="unitForm.unitName" :maxlength="6" />
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="unitForm.remark"  :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea"  />
                    </FormItem>
                </Form>
            </Modal> 

            <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="unitOk" :loading="loading" :mask-closable="false">
            <Form ref="unitForm" :model="unitInfo" :rules="ruleValidate" :label-width="110">
                    <input type="hidden" v-model="unitInfo.unit"/>
                    <FormItem label="计量单位名称" prop="unitName">
                        <Input v-model.trim="unitInfo.unitName" :maxlength="6" />
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="unitInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
    name: 'unit',
    components: { EmptyRow, CustomTable },
    data(){
        const validateNumber= (rule, value, callback) => {
                var reg=/^[0-9]*$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入数字'));
                } else {                
                    callback();
                }
        };
    	return {
            tableH: 0,
    		searchForm:{
    			keywords:''
            },
            unitForm: {
                unit: '',
                unitName: '',
                remark: ''
            },
            loadingAdd: true,
            loading: true,
            unitList:[],
            unitInfo: {},
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
                unit: [
                    { required: true, message: '计量单位编号不能为空', trigger: 'blur'},
                    { validator: validateNumber }
                ],
                unitName: [
                    { required: true, message: '计量单位不能为空', trigger: 'blur'}
                ]
            },
            resourceCol: [
                {
                    text: "编号",
                    name: "unit",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "剂量单位名称",
                    name: "unitName",
                    sortable: true,
                    moveable: true,
                    width: 400
                },
                {
                    text: "备注",
                    name: "remark",
                    sortable: true,
                    moveable: true,
                    width: 400
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 200
                }
            ]
        }
    },
    mounted: function() {
        this.getUnitList();
    },
    methods: {
        getUnitList(pageIndex){
            var self = this;
            Vue.ajax.send({
                name: 'unit.list',
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    unitName: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.unitList = data.data.dataList;
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
            this.getUnitList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getUnitList();
        },
        sortColumn: function(column, asc) {
            this.currentSort.column = column;
            this.currentSort.asc = asc;
        },
        showData: function(datas, showColumns) {
            this.showDatas = datas;
            // var self = this;
            if (this.currentSort.column != "") {
                if (this.currentSort.column == "unit") {
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
            this.$refs['unitFormAdd'].resetFields();
            this.unitForm.remark = "";
            this.addModel = true;
        },
        editItem(item) {
             this.$refs['unitForm'].resetFields();
             this.editModel = true;
             this.unitInfo = Object.assign({},item);
        },
        deleteItem(item) {
            this.$Modal.confirm({
                 title: '删除确认',
                 content: '确定要删除“'+item.unitName+'”？',
                 onOk: () => {
                       var self=this;
                        Vue.ajax.send({
                        name: 'unit.del',
                        data:{
                            unit: item.unit
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.$Message.info('计量单位删除成功');
                                self.getUnitList();
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
        addOk() { 
            this.$refs['unitFormAdd'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'unit.add',
                        data: {
                            unit: self.unitForm.unit,
                            unitName: self.unitForm.unitName,
                            remark: self.unitForm.remark
                        },
                        success: function(data) {
                            
                            if (!!data && data.code=='0') {
                                self.addModel = false;
                                self.$refs['unitFormAdd'].resetFields();
                                self.$Message.success('新增计量单位提交成功！');
                                self.getUnitList();
                            } else {
                                setTimeout(() => {
                                    self.loadingAdd = false;
                                    self.$nextTick(() => {
                                        self.loadingAdd = true;
                                    });
                                }, 0);
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
        unitOk(){
            this.$refs['unitForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'unit.edit',
                        data: {
                            unit: self.unitInfo.unit,
                            unitName: self.unitInfo.unitName,
                            remark: self.unitInfo.remark
                        },
                        success: function(data) {
                            
                            if (!!data && data.code=='0') {
                                self.editModel = false;
                                self.$Message.success('编辑计量单位提交成功！');
                                self.getUnitList();
                            } else {
                                setTimeout(() => {
                                    self.loading = false;
                                    self.$nextTick(() => {
                                        self.loading = true;
                                    });
                                }, 0);
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