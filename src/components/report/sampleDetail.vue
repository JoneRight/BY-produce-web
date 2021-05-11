<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left: 7px;">样本详情</h2>
        <div class="mt20">
            <Spin size="large" fix v-if="loading"></Spin>
                        <Form v-else :model="sampleAdd" ref="sampleAdd" :rules="sampleAddValidate" :label-width="80" style="height: calc(100% - 40px); overflow: auto">
                            <FormItem label="样本名称" prop="groupName">
                                <Input v-model="sampleAdd.groupName" :maxlength='16' style="width:500px;" disabled></Input>
                            </FormItem>
                            <FormItem label="已选择医院" v-show="sampleAdd.hospitalDetails.length>0">
                                <Tag v-for="item,index in sampleAdd.hospitalDetails" :key="item.hospitalId+''+index">{{item.hospitalName}}</Tag>
                            </FormItem>  
                             
                            <FormItem>
                                <Button type="default" to="/report/sample">返回列表</Button>
                            </FormItem>
                        </Form>
                        
                        <!-- <Icon v-show="loading" type="ios-loading" size=18 class="demo-spin-icon-load"></Icon> -->
        </div>        
    </div>
</template>

<script>
import Vue from "vue";
import excel from "../../utils/excel.js";
export default {
    name: 'sampleAdd',
    data(){
    	return{   
            sampleAdd:{
            	groupId:'',
            	groupName:'',
            	hospitalIds:[],
                hospitalDetails:[]
            },
            hospitalTreeBasic:[],
            saving:false,
            Id:null,
            loading:true,
            hospitalTree:[],
            treeError:false,
            sampleAddValidate:{
            	groupName: [
                    { required: true, message: '样本名称不能为空', trigger: 'blur'}
                ]
            }
        }
    },
    mounted: function() {
        this.Id=this.$route.params.id;
        this.getSampleDetail();
    },
    methods: {
        getSampleDetail(){
            var self=this;
            Vue.ajax.send({
                name: 'sample.detail',
                data:{
                    groupId:self.Id,
                },
                success: function(data) {
                    self.loading=false;
                    if (!!data && data.code=='0') {
                        self.sampleAdd=data.data
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                },
                error:function(){
                    self.loading=false;
                }
            });
        }
    }
};
</script>
<style scoped>
 .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        float:left;
        color:#2d8cf0;
        border: 1px solid #eee;
    }
</style>