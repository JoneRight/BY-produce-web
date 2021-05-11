<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left: 7px;">新增样本</h2>
        <div class="mt20">
            
                
                <Tabs value="name1">
                    <TabPane label="选择医院" name="name1">
                        <Form :model="sampleAdd1" ref="sampleAdd1" :rules="sampleAddValidate" :label-width="80" style="height: calc(100% - 40px); overflow: auto">
                            <FormItem label="样本名称" prop="groupName">
                                <Input v-model="sampleAdd1.groupName" :maxlength='16' style="width:500px;"></Input>
                            </FormItem>
                            <FormItem label="已选择医院" v-show="sampleAdd1.hospitalList.length>0">
                                <Tag v-for="item,index in sampleAdd1.hospitalList" :key="item.hospitalId+''+index">{{item.title}}</Tag>
                            </FormItem>  
                            <FormItem label="选择医院"> 
                                <Icon v-show="loading" type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                    
                                <Tree v-show="!loading" ref="tree" :data="hospitalTree" show-checkbox @on-check-change="treeChange" empty-text='数据加载中..' :render="renderHospitalTree"></Tree>
                                <div class="ivu-form-item-error-tip" v-show="treeError1">请至少选择一家医院</div>
                            </FormItem>
                            <FormItem label="样本备注" prop="remark">
                                <Input v-model="sampleAdd1.remark" :maxlength='100' style="width:500px;"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="default" to="/report/sample">取消</Button>
                                <Button type="primary" @click="addSample(1)" :disabled="saving">保存</Button>
                            </FormItem>
                            
                        </Form>
                    </TabPane>
                    <TabPane label="导入医院" name="name2">
                        <Form :model="sampleAdd2" ref="sampleAdd2" :rules="sampleAddValidate" :label-width="80" style="height: calc(100% - 40px); overflow: auto">
                            <FormItem label="样本名称" prop="groupName">
                                <Input v-model="sampleAdd2.groupName" :maxlength='16' style="width:500px;"></Input>
                                <a href="../../static/file/sampleTemplate.csv" download="样本导入模板.csv" class="btn" style="color:#2d8cf0;">下载模板</a>
                            </FormItem>
                            <FormItem label="已选择医院" v-show="sampleAdd2.hospitalList.length>0">
                                <Tag v-for="item,index in sampleAdd2.hospitalList" :key="item.hospitalId+''+index">{{item.title}}</Tag>
                            </FormItem>
                            <FormItem>
                                <Upload :before-upload="analyseSample" action="" accept="text/csv,.csv" :format="['csv']" :max-size="10240">
                                    <Button icon="ios-cloud-upload-outline">选择文件并导入</Button>
                                </Upload>
                            </FormItem>
                            <FormItem label="样本备注" prop="remark">
                                <Input v-model="sampleAdd2.remark" :maxlength='100' style="width:500px;"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="default" to="/report/sample">取消</Button>
                                <Button type="primary" @click="addSample(2)" :disabled="saving">保存</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
                
           
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
            sampleAdd1:{
            	groupId:'',
            	groupName:'',
                remark:'',
            	hospitalIds:[],
                hospitalList:[]
            },
            sampleAdd2:{
            	groupId:'',
            	groupName:'',
                remark:'',
            	hospitalIds:[],
                hospitalList:[]
            },
            hospitalTreeBasic:[],
            saving:false,
            Id:null,
            loading:true,
            hospitalTree:[],
            treeError1:false,
            treeError2:false,
            sampleAddValidate:{
            	groupName: [
                    { required: true, message: '样本名称不能为空', trigger: 'blur'}
                ]
            }
        }
    },
    mounted: function() {
         
            this.Id=this.$route.query.Id;
        
            // this.getSampleDetail();
        this.getHospitalTree();
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
                    if (!!data && data.code=='0') {
                        self.sampleAdd=data.data;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },

        renderHospitalTree(h,{root,node,data}){
            return h('span',{style:{display:'inline-block',width:'100%',"font-weight":"bold"}},[h('span',
            data.showText ?"  (" +data.showText + ")   " + data.title : data.title)]);
        },
        addSample(index){
            var self=this;
            this.$refs['sampleAdd'+index].validate((valid) => {
                if (valid) {
                    if(self["sampleAdd"+index].hospitalIds.length>0){
                        self["treeError"+index]=false;
                        self.saving=true;
                        Vue.ajax.send({
                            name: "sample.add",
                            data: {
                                groupId:self["sampleAdd"+index].groupId,
                                groupName:self["sampleAdd"+index].groupName,
                                addUser:Vue.getUser().userName,
                                hospitalIds:self["sampleAdd"+index].hospitalIds,
                                remark:self["sampleAdd"+index].remark
                            },
                            success: function(data) {
                                if (!!data && data.code=='0') {
                                    self.$Message.success('新增样本分组成功！');
                                    self.$router.push("/report/sample")
                                    
                                } else {
                                    self.$Modal.error({
                                        title: '',
                                        content: data.message
                                    });
                                }
                                self.saving=false;
                            },
                            error:function(err){
                                self.$Modal.error({
                                        title: '请求错误',
                                        content: err
                                    });
                                self.saving=false;
                            }
                        });
                    }
                    else{
                        self["treeError"+index]=true;
                    }
                    
                }
            })
        },
        getHospitalTree(){
        	var self=this;
            Vue.ajax.send({
                name: 'sample.hospital.all',
                data: {
                    hospitalName:'',
                    provinceId:null,
                    cityId:null,
                    pageIndex:1,
                    pageSize:999999999
                },
                success: function(data) {
                    self.loading=false;
                    if (!!data && data.code=='0') {         
                    	self.hospitalTreeBasic=data.data;        
                        self.hospitalTree=self.getNewTree(self.hospitalTreeBasic);
                    } else { 
                        self.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                },
                error:function(){
                    self.loading=false;
                }
            });
        },
        getNewTree(oldArr){
            let newArr=new Array();
            console.log(oldArr);

        	oldArr.forEach(item=>{
        		if(newArr.someProperty("title",item.provinceName)){
        			var province=newArr.findProperty("title",item.provinceName);
        			if(province["children"].someProperty("title",item.cityName)){
        				province["children"].findProperty("title",item.cityName)["children"].push({"hospitalId":item.hospitalId,"title":item.hospitalName,"showText":item.hospGradeName,"checked":item.checked?item.checked:false});
        			}
        			else{
        				province["children"].push({"title":item.cityName,children:[{"hospitalId":item.hospitalId,"title":item.hospitalName,"showText":item.hospGradeName,"checked":item.checked?item.checked:false}]});
        			}
        		}
        		else{
        			newArr.push({"title":item.provinceName,"children":[{"title":item.cityName,children:[{"hospitalId":item.hospitalId,"title":item.hospitalName,"checked":item.checked?item.checked:false}]}]});
        		}
        	})
            // console.log(newArr);
        	return newArr;
        },
        treeChange(member){
            this.sampleAdd1.hospitalIds=this.$refs["tree"].getCheckedNodes().filter(m=>m.hospitalId).map(m=>m.hospitalId)
            this.sampleAdd1.hospitalList=this.$refs["tree"].getCheckedNodes().filter(m=>m.hospitalId).map(m=>{return{hospitalId:m.hospitalId,title:m.title}});
        	if(this.sampleAdd1.hospitalIds.length==0){
        		this.treeError1=true;
        	}else{
        		this.treeError1=false;
        	}
        },
        analyseSample: function(file) {
            var self = this;
            excel.ReadCSV(file).then(
                function(data) {
                self.checkSample(data);
                },
                function(err) {}
            );
            return false;
        },
        checkSample: function(list) {
            var self = this;
            if (list.length > 1) {
                for (var i = 1; i < list.length; i++) {
                var data = list[i];

                var hosp = self.hospitalTreeBasic.filter(
                    item => item.hospitalNo == data[0].value
                );
                if (hosp.length == 0) {
                    break;
                }
                var newObj = {
                    hospitalId: hosp[0].hospitalId,
                    title:hosp[0].hospitalName
                };
                self.sampleAdd2.hospitalList.push(newObj);
                self.sampleAdd2.hospitalIds.push(hosp[0].hospitalId);
                }
            }
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