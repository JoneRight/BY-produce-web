<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <div class="fr"></div>
        <h2 class="common-title">催报历史记录</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		        <FormItem label="医院名称" :label-width="60">
                    <Input v-model="searchForm.hospitalName" type="text" style="width: 260px;" placeholder="请输入医院名称"/>
                </FormItem>
                <FormItem label="省市" :label-width="40">                 
                    <Cascader :data="addressList" trigger="hover" v-model="searchForm.address" change-on-select style="width: 200px"></Cascader>
                </FormItem>
		        <FormItem label="催报类型" :label-width="60">
		            <Select v-model="searchForm.dataType" style="width: 120px;">
                        <Option value="">全部</Option>
                        <Option value="10">购药</Option>
                        <Option value="20">门急诊</Option>
                        <Option value="30">病案</Option>
                        <Option value="40">医嘱</Option>
                    </Select>
		        </FormItem>
                <FormItem label="催报日期" :label-width="60">
                    <DatePicker type="daterange" :start-date="new Date(new Date().getTime() - 30*24*60*60*1000)" v-model="searchForm.urgeDate" style="width: 200px" @on-change="searchForm.urgeDate=$event"></DatePicker>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="serchList()">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button type="text" size="large" to="/report/urge" style="color:#57a3f3">返回催报列表</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable :columnConfig='urgeCol' :columnDatas='urgeList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in urgeCol" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{urgeCol.find(m=>m.name==col.name).render?urgeCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                    
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!urgeList || urgeList.length==0"/> 
            </CustomTable>
            
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="urgeList.length>0">            
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
    name: 'urgeHistory',
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
                urgeDate:[]
            },
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount:1,
            },
    		urgeList:[],
            addressList:[],
    		urgeCol: [
                    {
                        text: '医院名称',
                        name: 'hospitalName',
                        width:300
                    },
                    {
                        text: '省份',
                        name: 'provinceName',
                        width:150
                    },
                    {
                        text: '城市',
                        name: 'cityName',
                        width:150
                    },
                    {
                        text: '上报人',
                        knameey: 'uploadUserName',
                        width:300
                    },
                    {
                        text: '催报类型',
                        name: 'dataType',
                        width:300,
                        render: (params) => {
                            if(params.dataType==10){
                                return "购药";
                            }else if(params.dataType==20){
                                return "门急诊";
                            }else if(params.dataType==30){
                                return  "病案";
                            }else if(params.dataType==40){
                                return "医嘱";
                            }
                        }
                    },
                    {
                        text: '催报日期',
                        name: 'urgeTime',
                        width:300
                    }
                ]
    	}
    },
    mounted: function() {
        this.getUrgeHistory();
        this.getAddressList();
    },
    methods: {
        serchList(){
            this.pageConfig.totalItemCount=1;
            this.pageConfig.pageIndex=1;
            this.getUrgeHistory();
        },
        getUrgeHistory(){
            var self=this;
            Vue.ajax.send({
                name: 'urge.history',
                data:{
                    hospitalName:self.searchForm.hospitalName,
                    provinceId:self.searchForm.address.length==1?parseInt(self.searchForm.address[0]):null,
                    cityId:self.searchForm.address.length==2?parseInt(self.searchForm.address[1]):null,
                    dataType:self.searchForm.dataType,
                    urgeDate:self.searchForm.urgeDate,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.urgeList=data.data.dataList || [];
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
        getAddressList(){
            var self=this;
            Vue.ajax.send({
                name: 'common.adressList',
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
            this.getUrgeHistory();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getUrgeHistory();
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