<template>
	<div class="m15" style="height:100%;overflow-y:hidden;margin-top:0;">
        <!-- <div class="fr" style="margin-top:-52px;position:relative;z-index:100;"><Button type="primary" to="/report/hospitalAdd">+ 新增医院</Button></div> -->
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <!-- <FormItem label="医院" :label-width="60">
                    <Input v-model="searchForm.hospitalName" type="text" style="width: 260px;" placeholder="请输入医院" />
                </FormItem> -->
                <FormItem label="省市" :label-width="40">                 
                    <Cascader :data="addressList" @on-change='getHosp' trigger="hover" v-model="searchForm.address" change-on-select></Cascader>
                </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospitalName" style="width: 150px;" filterable clearable>
                        <Option v-for="item in hospitalListSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
               <FormItem label="医院编号" :label-width="60">
		            <Input v-model="searchForm.hospNo" style="width: 120px;" placeholder="请输入医院编号" ></Input>
		        </FormItem>
                 <FormItem label="医院负责人" :label-width="80">
		            <Input v-model="searchForm.checkUser" style="width: 120px;" placeholder="请输入医院负责人" ></Input>
		        </FormItem>
                <FormItem>
                    <Button type="primary" @click="serchList('searchForm')">检索</Button>
                </FormItem>
            </Form>
        </div>
        <div class="bg-white mt15" style="height:calc(100% - 40px);">
            <CustomTable key='hospitalCol'  :columnConfig='hospitalCol' :columnDatas='hospitalList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in hospitalCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{item[col.name]}}</td>
                   
                  <td>
                      <Button v-authorize="'hospitaldetail'" icon="md-eye" size="small" title="查看" type="primary" @click='$router.push("/report/hospitalPublish?Id="+item.hospitalId)'></Button>
                      <Button v-authorize="'hospitalreset'" icon="md-lock" size="small"   title="重置密码" type="error" class="btn-red" @click='confirmReset(item)'></Button>
                      <Button v-authorize="'hospitalcontact'" icon="md-people" size="small"   title="联络员管理" type="success" class="btn-green" @click='$router.push("/report/hospitalContactor?Id="+item.hospitalId)'></Button>
                      <Button v-authorize="'hospitalsetting'" icon="md-settings" size="small" title="设置" type="warning" @click='$router.push("/report/hospitalSet?Id="+item.hospitalId)'></Button>
                    </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
                 <div class="bg-white mt15" style="height:100%;">
              <Table border ref="dataTable"  :columns="hospitalColNew" :data="newDatas">
              </Table>
                 </div>
              <div style="" class="page-footer">      
                 <div class="mt15 text-center" v-if="hospitalList.length>0">       
                     <Button type="primary"    class="fr page-footer-button"  size="large" @click="exportData"><Icon type="ios-download-outline"></Icon>导出</Button>
                </div>
              </div>
            </div>  
            <div class="page-footer" style="position:fixed;">            
                 <div class="mt15 text-center" v-if="hospitalList.length>0">            
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
import EmptyRow from '../../common/EmptyRow';
import CustomTable from "../../common/GridTable";
export default {
    name: 'hospList',
    components:{EmptyRow,CustomTable},
    data(){
    	return{
            showModal: false,
            showDatas: [],
            showColumns: [],
            newDatas:[],
            currentSort: {
                column: "",
                asc: true
            }, 
    		searchForm:{
    			address:[],
    			hospitalName:''
    		},
    		addressList:[],
            hospitalList:[],
            hospitalListSelect:[],
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount:1,
            },
            hospitalColNew: [
                    {
                        title: '医院编码',
                        key: 'loginName',
                        sortable: true,
                        moveable: true,
                        width:150,
                    },
                    {
                        title: '医院',
                        key: 'hospitalName',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                    {
                        title: '医院等级',
                        key: 'hospGradeName',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                     {
                        title: '医院性质',
                        key: 'hospTypeName',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                     {
                        title: '医院床位数',
                        key: 'hospBedOpen',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                    {
                        title: '门急诊量',
                        key: 'dailyEmergency',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                    {
                        title: '省份',
                        key: 'provinceName',
                        sortable: true,
                        moveable: true,
                        width:150
                    },
                    {
                        title: '城市',
                        key: 'cityName',
                        sortable: true,
                        moveable: true,
                        width:150
                    },
                    {
                        title: '医院负责人',
                        key: 'checkUser',
                        sortable: true,
                        moveable: true,
                        width:150
                    },
                    {
                        title: '联系方式',
                        key: 'telphone',
                        sortable: true,
                        moveable: true,
                        width:150,
                    },
                    {
                        title: '电子邮箱',
                        key: 'email',
                        sortable: true,
                        moveable: true,
                        width:180,
                    },
                    {
                        title: '注册日期',
                        key: 'createTime',
                        sortable: true,
                        moveable: true,
                        width:150,
                    }
                ], 
                hospitalCol: [
                    {
                        text: '医院编码',
                        name: 'loginName',
                        sortable: true,
                        moveable: true,
                        width:150,
                    },
                    {
                        text: '医院',
                        name: 'hospitalName',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                    {
                        text: '医院等级',
                        name: 'hospGradeName',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                     {
                        text: '医院性质',
                        name: 'hospTypeName',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                     {
                        text: '医院床位数',
                        name: 'hospBedOpen',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                    {
                        text: '门急诊量',
                        name: 'dailyEmergency',
                        sortable: true,
                        moveable: true,
                        width:300
                    },
                    {
                        text: '省份',
                        name: 'provinceName',
                        sortable: true,
                        moveable: true,
                        width:150
                    },
                    {
                        text: '城市',
                        name: 'cityName',
                        sortable: true,
                        moveable: true,
                        width:150
                    },
                    {
                        text: '医院负责人',
                        name: 'checkUser',
                        sortable: true,
                        moveable: true,
                        width:150
                    },
                    {
                        text: '联系方式',
                        name: 'telphone',
                        sortable: true,
                        moveable: true,
                        width:150,
                    },
                    {
                        text: '电子邮箱',
                        name: 'email',
                        sortable: true,
                        moveable: true,
                        width:180,
                    },
                    {
                        text: '注册日期',
                        name: 'createTime',
                        sortable: true,
                        moveable: true,
                        width:150,
                    },
                    {
                        text: '操作',
                        width:200,
                        filterable: false,
                        removeable: false,
                        name: 'op',
                    }
                ], 
                excelColNew:[
                       {
                        title: '医院编码',
                        key: 'loginName',
                        width:150,
                    },
                    {
                        title: '医院',
                        key: 'hospitalName',
                        width:300
                    },
                    {
                        title: '医院等级',
                        key: 'hospGradeName',
                        width:300
                    },
                     {
                        title: '医院性质',
                        key: 'hospTypeName',
                        width:300
                    },
                     {
                        title: '医院床位数',
                        key: 'hospBedOpen',
                        width:300
                    },
                    {
                        title: '门急诊量',
                        key: 'dailyEmergency',
                        width:300
                    },
                    {
                        title: '省份',
                        key: 'provinceName',
                        width:150
                    },
                    {
                        title: '城市',
                        key: 'cityName',
                        width:150
                    },
                    {
                        title: '医院负责人',
                        key: 'checkUser',
                        width:150
                    },
                    {
                        title: '联系方式',
                        key: 'telphone',
                        width:150
                    },
                    {
                        title: '电子邮箱',
                        key: 'email',
                        width:180,
                    },
                    {
                        title: '注册日期',
                        key: 'createTime',
                        width:150
                    }
                ],
                excelCol1:{}
    	}
    },
    activated: function() {
        this.getHospitalList();
        this.getAddressList();
        this.getHospitalListSelect(""); //获取医院数据
        this.excelCol1=this.excelColNew.attrToObject('title','key');

    },
    methods: {
        getHosp(value) {
            this.getHospitalListSelect(value);
        },
        //获取医院
        getHospitalListSelect(value) {
            var self = this;
            Vue.ajax.send({
                name: "business.hospitalList",
                data: {
                    provinceId: value.length > 0 ? value[0] : null, //省
                    cityId: value.length == 2 ? value[1] : null //市
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.hospitalListSelect = data.data;
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
    	getHospitalList(){
            var self=this;
            Vue.ajax.send({
                name: 'hospital.list',
                data:{
                    hospitalId:self.searchForm.hospitalName,
                    provinceId:self.searchForm.address.length==1?self.searchForm.address[0]:null,
                    cityId:self.searchForm.address.length==2?self.searchForm.address[1]:null,
                    hospNo:self.searchForm.hospNo,
                    checkUser:self.searchForm.checkUser,
                    pageIndex:self.pageConfig.pageIndex,
                    pageSize:self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.hospitalList=data.data.dataList;

                        self.pageConfig.totalItemCount=data.data.totalItemCount;
                        self.newDatas = data.data.dataList;
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
        changePage(currentPage){
            this.pageConfig.pageIndex=currentPage;
            this.getHospitalList();
        },
        changeSize(num){
            this.pageConfig.pageSize=num;
            this.getHospitalList();
        },
        confirmReset(item){
            this.$Modal.confirm({
                title: '重置密码确认',
                content: '确定要重置“'+item.hospitalName+'”的密码？',
                onOk: () => {
                    var self=this;
                    Vue.ajax.send({
                    name: 'hospital.resetPWD',
                    data:{hospitalId:item.hospitalId,applyUser:Vue.getUser().userName},
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.$Message.info('重置密码成功');
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
        serchList (name) {
            console.log(this.searchForm);
            this.pageConfig.pageIndex=1
            this.pageConfig.totalItemCount=1;
            if(this.searchForm.address.length>0 || this.searchForm.hospitalName!='' || this.searchForm.dataType!='' || (this.searchForm.reportDate[0]!=''|| this.searchForm.reportDate[1]!='')){
                this.getHospitalList();
            }else{
                this.$Modal.error({
                    title: '消息提示',
                    content: '请先填写检索条件'
                });
            }
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
             let i =0; 
             for(let data of this.newDatas){
               this.newDatas[i].hospGradeName =  data.hospGradeName.replace(/,/,'').replace(/,/,'');
               i++;
             }
            this.$refs.dataTable.exportCsv({
            filename: '医院管理列表',
            columns: this.excelColNew,
            data: this.newDatas
        });
    }
    }
};
</script>
<style scoped>
.ivu-tabs{
    overflow: visible;
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