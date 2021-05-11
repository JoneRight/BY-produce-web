<template>
	<div>
        <CustomTable key='hospitalNewCol'  :columnConfig='hospitalNewCol' :columnDatas='hospitalNew' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in hospitalNewCol.filter(m=>m.name!='op' && m.name!='state' )" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{item[col.name]}}</td>
                  <td class="ellipsis" key='state' v-if="showColumns.indexOf('state')>-1">{{item['state']==0?'未审核':'驳回'}}</td>
                   
                  <td>
                      <Button v-authorize="'hospitalcheck'" icon="md-create" :disabled="item.state!=0" size="small" title="审核" class="btn-orange" type="primary" @click='beginCheck(item)'></Button>
                      <Button v-authorize="'hospitalcheckdelete'" :disabled="item.state==0" icon="md-close" size="small"   title="删除" type="error" class="btn-red" @click='deleteConfirm(item)'></Button>
                    </td>
                </tr>
        </CustomTable>
 
        <EmptyRow v-if="!hospitalNew || hospitalNew.length==0"/>
            
        <Modal title="新入网医院审核" class-name="vertical-center-modal" v-model="review" :loading="loading">
            <Form ref="reviewForm" :model="reviewForm"  :label-width="80" :rules="reviewValidate">
                <FormItem label="医院">
                    <h3>{{reviewInfo.hospitalName}}</h3>
                </FormItem>
                <FormItem label="医院省市">
                    <span>{{reviewInfo.provinceName}}-{{reviewInfo.cityName}}</span>
                </FormItem> 
                <FormItem label="医院负责人">
                    <span>{{reviewInfo.chargeUser}}</span>
                </FormItem>  
                <FormItem label="注册日期">
                    <span>{{reviewInfo.createTime}}</span>
                </FormItem>              
                <FormItem label="选择角色" prop="roleId">
                    <Select v-model="reviewForm.roleId">
                        <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{item.roleName}}</Option>
                    </Select>
                </FormItem>    
                 <FormItem label="不通过原因" prop="rejectReason">
                    <Input type="text" v-model.trim='reviewForm.rejectReason' :maxlength="100" placeholder="请输入不通过原因"></Input>
                </FormItem>  
            </Form>            
            <div slot="footer">
                <Button type="error"  @click="reviewNot">不通过</Button>
                <Button type="primary"  @click="reviewOk">通过</Button>
            </div>
        </Modal>
                 <!-- <div class="bg-white mt15" style="height:100%;">
              <Table border ref="dataTable"  :columns="hospitalNewColForCsv" :data="newDatas">
              </Table>
              <div style="" class="page-footer">      
                 <div class="mt15 text-center" v-if="hospitalList.length>0">       
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                     <Button type="primary"    class="fr page-footer-button"  size="large" @click="exportData"><Icon type="ios-download-outline"></Icon>导出</Button>
                   
                </div>
              </div>
            </div> -->
	</div>
</template>
<script>
import Vue from "vue";
import EmptyRow from '../../common/EmptyRow';
import CustomTable from "../../common/GridTable";
export default {
    name: 'hospNew',
    props: {
        hospitalNew: {
            type: Array,
            default: []
        },
    },
    components:{EmptyRow,CustomTable},
    data(){
        const validatePassCheck = (rule, value, callback) => {
            if ((value == '' || value==null) && this.ok==false) {
                callback(new Error('请输入不通过原因'));
            }else {
                callback();
            }
        };
        const validateRoleCheck = (rule, value, callback) => {
            if ((value == '' || value==null) && this.ok==true) {
                callback(new Error('角色不能为空'));
            }else {
                callback();
            }
        };
    	return{
            showModal: false,
            showDatas: [],
            newDatas:[],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            },
            ok:true,
            review:false,
            reviewInfo:[],
            reviewForm:{
                hospitalId:null,
                roleId:null,
                rejectReason:null
            },
            reviewIndex:null,
            loading:true,
            reviewValidate: {
                roleId:[
                    { validator: validateRoleCheck, trigger: 'change',type:"number" }
                ],
                rejectReason:[
                   { validator: validatePassCheck, trigger: 'blur' }
                ]
            },        
            
            roleList:[],
 hospitalNewColForCsv: [
                    {
                        title: '医院',
                        key: 'hospitalName',
                        width:250,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '省份',
                        key: 'provinceName',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '城市',
                        key: 'cityName',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '医院负责人',
                        key: 'chargeUser',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '科室',
                        key: 'registerSection',
                        width:150,
                    },
                    {
                        title: '联系方式',
                        key: 'telphone',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '电子邮箱',
                        key: 'email',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '注册日期',
                        key: 'createTime',
                        // sortable: true,
                        // moveable: true,
                        width:160
                    },
                                    {
                    title:'审核人',
                    key:'chargeUser',
                      width:150,

                },
                    {
                        title: '审核状态',
                        key: 'state',
                        // sortable: true,
                        // moveable: true,
                        width:250,
                        render:(params)=>{
                            if(params.state==0){
                                return '未审核';
                            }
                            return '驳回'
                        }
                    }
 ],

            hospitalNewCol: [
                    {
                        text: '医院',
                        name: 'hospitalName',
                        width:250,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        text: '省份',
                        name: 'provinceName',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        text: '城市',
                        name: 'cityName',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        text: '医院负责人',
                        name: 'chargeUser',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        text: '科室',
                        name: 'registerSection',
                        width:150,
                    },
                    {
                        text: '联系方式',
                        name: 'telphone',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        text: '电子邮箱',
                        name: 'email',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        text: '注册日期',
                        name: 'createTime',
                        // sortable: true,
                        // moveable: true,
                        width:160
                    },
                                    {
                    text:'审核人',
                    name:'chargeUser',
                      width:150,

                },
                    {
                        text: '审核状态',
                        name: 'state',
                        // sortable: true,
                        // moveable: true,
                        width:250,
                        render:(params)=>{
                            if(params.state==0){
                                return '未审核';
                            }
                            return '驳回'
                        }
                    },


                    {
                        text: '操作',
                        width:150,
                        name: 'op',
                        filterable: false,
                        removeable: false,
                    }
                ], 

                 excelColNew: [
                    {
                        title: '医院',
                        key: 'hospitalName',
                        width:250,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '省份',
                        key: 'provinceName',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '城市',
                        key: 'cityName',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '医院负责人',
                        key: 'chargeUser',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '科室',
                        key: 'registerSection',
                        width:150,
                    },
                    {
                        title: '联系方式',
                        key: 'telphone',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '电子邮箱',
                        key: 'email',
                        width:150,
                        // sortable: true,
                        // moveable: true,
                    },
                    {
                        title: '注册日期',
                        key: 'createTime',
                        // sortable: true,
                        // moveable: true,
                        width:160
                    },
                                    {
                    title:'审核人',
                    key:'chargeUser',
                      width:150,

                },
                    {
                        title: '审核状态',
                        key: 'state',
                        // sortable: true,
                        // moveable: true,
                        width:250,
                        render:(params)=>{
                            if(params.state==0){
                                return '未审核';
                            }
                            return '驳回'
                        }
                    }
 ],
                       excelCol1:{}

    	}
    },
    mounted: function() {
        this.getRoleList();
    },
    methods: {
    	getRoleList(){
             var self=this;
            Vue.ajax.send({
                name: 'role.queryRole',
                data: {pageIndex:1,pageSize:1000000,systemId:Vue.config.uploadSystemId},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.roleList=data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        beginCheck(item){
            this.$refs['reviewForm'].resetFields();
            this.reviewInfo=item;
            // this.reviewIndex=params.index;
            this.review=true;
        },
        deleteConfirm(item){
            this.$Modal.confirm({
                title: '医院删除确认',
                content: '确定要删除新入网医院“'+item.hospitalName+'”？',
                onOk: () => {
                    var self=this;
                    Vue.ajax.send({
                    name: 'hospital.reviewDel',
                    data:{
                        hospitalId:item.hospitalId,
                        systemId:Vue.config.systemId,
                        applyUser:item.chargeUser,
                        telephone:item.telphone,
                        email:item.email,
                        opetator:Vue.getUser().userName
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.hospitalNew=self.hospitalNew.filter(m=>m.hospitalId!=item.hospitalId);
                            self.$Message.info('医院删除成功!');
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
        reviewOk(){
            this.ok=true;
            this.$refs['reviewForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    return Vue.ajax.send({
                        name: 'hospital.review',
                        data:{
                            roleId:self.reviewForm.roleId,
                            hospitalId:self.reviewInfo.hospitalId,
                            systemId:Vue.config.uploadSystemId,
                            applyUser:self.reviewInfo.chargeUser,
                            telephone:self.reviewInfo.telphone,
                            email:self.reviewInfo.email,
                            opetator:Vue.getUser().userName
                        },
                        success: function(data) {
                            self.$emit('refreshHospitalNew');
                            if (!!data && data.code=='0') {
                                self.review=false;
                                self.hospitalNew=self.hospitalNew.filter(m=>m.hospitalId!=item.hospitalId);
                                self.$Modal.success({
                                    title: '审核完成',
                                    content: "用户名:"+data.data.loginName+(data.data.loginPassword?(",密码:"+data.data.loginPassword):"")
                                });

                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                    
                } else {
                    setTimeout(() => {
                        this.loading = false;
                        this.$nextTick(() => {
                            this.loading = true;
                        });
                    }, 0);
                }
            })
        },
        reviewNot(){
            this.ok=false;
            var self=this;
             this.$refs['reviewForm'].validate((valid) => {
                if (valid) {
                    Vue.ajax.send({
                        name: 'hospital.reviewNot',
                        data:{
                            hospitalId:self.reviewInfo.hospitalId,
                            systemId:Vue.config.systemId,
                            applyUser:self.reviewInfo.chargeUser,
                            telephone:self.reviewInfo.telphone,
                            email:self.reviewInfo.email,
                            opetator:Vue.getUser().userName,
                            rejectReason:self.reviewForm.rejectReason
                        },
                        success: function(data) {
                            self.$emit('refreshHospitalNew');
                            if (!!data && data.code=='0') {
                                self.review=false;
                                self.hospitalNew=self.hospitalNew.map(m=>{
                                    if(m.hospitalId==item.hospitalId){
                                        m.state=2;
                                    }
                                    return m;
                                });
                                self.$Message.success('审核驳回成功!');

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
}
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
