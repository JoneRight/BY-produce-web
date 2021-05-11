<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <div class="fr"></div>
        <h2 class="common-title">样本管理</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="样本名称" :label-width="60">
                    <Input v-model="searchForm.title" style="width: 280px;" placeholder="请输入样本名称"/>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="serchList">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button type="primary" to="/report/sample/add" v-authorize="'hospitalsampleadd'">+ 新增样本</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'hospitalsamplelist'" :columnConfig='sampleCol' :columnDatas='sampleList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in sampleCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{item[col.name]}}</td>
                   
                  <td>
                      <Button v-authorize="'hospitalsampledetail'" icon="md-eye" size="small" title="查看" type="primary" @click='$router.push("/report/sample/"+item.groupId);'></Button>
                      <Button v-authorize="'hospitalsampleedit'" icon="md-create" size="small" title="编辑" type="warning" class="btn-orange" @click='$router.push("/report/sample/edit/"+item.groupId)'></Button>
                      <Button v-authorize="'hospitalsampledelete'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='confirmDelete(item)'></Button>
                    </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="sampleList.length>0">            
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
    name: 'samplemanage',
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
    			title:''
    		},    	
            sampleList:[],    
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount:1,
            },	
    		sampleCol: [
                    {
                        text: '样本名称',
                        sortable: true,
                        moveable: true,
                        width:300,
                        name: 'groupName'
                    },
                    {
                        text: '样本备注',
                        sortable: true,
                        moveable: true,
                        width:200,
                        name: 'remark'
                    },
                    {
                        text:'添加人',
                        sortable: true,
                        moveable: true,
                        width:150,
                        name:'addUser'
                    },
                    {
                      text:'添加时间',
                       sortable: true,
                        moveable: true,
                        width:200,
                        name:'createTime'
                    
                    },
                    {
                        text: '操作',
                        width:250,
                        filterable: false,
                        removeable: false,
                        name: 'op',
                         
                    }
                ],
    	}
    },
    activated: function() {
        this.getSampleList();
    },
    methods: {
        getSampleList(){
            var self=this;
            Vue.ajax.send({
                name: 'sample.list',
                data: {
                    keyWord:this.searchForm.title,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.sampleList=data.data.dataList || [];
                        self.pageConfig.pageIndex=data.data.currentPageIndex;
                        self.pageConfig.totalItemCount=data.data.totalItemCount;
                    } else {
                        self.$Modal.error({
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
            this.getSampleList();           
        },
        changePage(currentPage){
            this.pageConfig.pageIndex=currentPage;
            this.getSampleList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getSampleList();
        },
        confirmDelete:function(item){
            this.$Modal.confirm({
                title: '删除确认',
                content: '确定要删除“'+item.groupName+'”？',
                onOk: () => {
                    this.deleteSample(item.groupId);
                }
            }); 
        },
        deleteSample(groupId){
            var self=this;
            Vue.ajax.send({
                name: 'sample.del',
                data:{groupId:groupId},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.$Message.info('样本分组删除成功');
                        self.pageConfig.pageIndex=1;
                        self.getSampleList();
                    } else {
                        self.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
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