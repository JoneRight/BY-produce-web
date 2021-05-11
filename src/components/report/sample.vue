<template>
    <div class="bg-white p20 m20" style="height: calc(100% - 40px)">
        <h2 class="common-title">样本管理</h2>
        <Row :gutter="16" class="mt" style="height: calc(100% - 47px)">
	        <Col span="10" style="border-right:1px solid #e8eaec;height: 100%">
	            <h3 class="mb15 hosp-title">已有样本分组</h3>
                <div v-show="sampleList.length==0" style="color:#666">暂无样本分组，请在右侧新建</div>
	        	<Tag v-show="sampleList.length>0" v-for="item,index in sampleList" @click.native="showDetail(item)" :key="item.groupId" :name="item.groupName" closable @on-close="delTag(index)">{{item.groupName}}</Tag><br><br>
	    		<Button icon="ios-plus-empty" type="primary" @click="addBtn">新增样本分组</Button>
	        </Col>
	        <Col span="14" style="height:100%">
	            <h3 class="mb15 hosp-title" v-show="addShow">新增样本分组</h3>
                <h3 class="mb15 hosp-title" v-show="!addShow">样本分组详情</h3>
	            <Form :model="sampleAdd" ref="sampleAdd" :rules="sampleAddValidate" :label-width="80" style="height: calc(100% - 40px); overflow: auto">
			        <FormItem label="分组名称" prop="groupName">
			            <Input v-model="sampleAdd.groupName" :disabled="!editshow&&!addShow" :maxlength='16'></Input>
			        </FormItem>
                    <FormItem label="组内医院" v-show="!editshow&&!addShow">
                       <Tag v-for="item,index in sampleAdd.hospitalList" :key="item.hospitalId+''+index">{{item.title}}</Tag>
                    </FormItem>  
			        <FormItem label="选择医院" v-show="editshow||addShow">
			            <Tree ref="tree" :data="hospitalTree" show-checkbox @on-check-change="treeChange"></Tree>
			            <div class="ivu-form-item-error-tip" v-show="treeError">请至少选择一家医院</div>
			        </FormItem>
			        <FormItem>
                        <Button type="primary"  @click="detailEdit" v-show="!editshow&&!addShow">编辑</Button>
			            <Button type="primary" @click="addSample" v-show="addShow||editshow">保存</Button>
			        </FormItem>
			    </Form>
	        </Col>
	    </Row>
        
    </div>
</template>

<script>
import Vue from "vue";
export default {
    name: 'sample',
    data(){
    	return{
            sampleList:[],
            addShow:true,
            editshow:false,
            sampleAdd:{
            	groupId:'',
            	groupName:'',
            	hospitalIds:[],
                hospitalList:[]
            },
            index:'',
            hospitalTree:[],
            hospitalTreeBasic:[],
            treeError:false,
            sampleAddValidate:{
            	groupName: [
                    { required: true, message: '分组名称不能为空', trigger: 'blur'}
                ]
            }
    	}
    },
    mounted: function() {
        this.getSampleList();
        this.getHospitalTree();
    },
    methods: {
        getSampleList(){
            var self=this;
            Vue.ajax.send({
                name: 'sample.list',
                data: {},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.sampleList=data.data;
                    } else {
                        self.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getHospitalTree(){
        	var self=this;
            Vue.ajax.send({
                name: 'sample.hospitalTree',
                data: {
                    hospitalName:'',
                    provinceId:null,
                    cityId:null,
                    pageIndex:1,
                    pageSize:999999999
                },
                success: function(data) {
                    if (!!data && data.code=='0') {         
                    	self.hospitalTreeBasic=data.data.dataList;        
                        self.hospitalTree=self.getNewTree(self.hospitalTreeBasic);
                    } else { 
                        self.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getNewTree(oldArr){
        	let newArr=new Array();
        	oldArr.forEach(item=>{
        		if(newArr.someProperty("title",item.provinceName)){
        			var province=newArr.findProperty("title",item.provinceName);
        			if(province["children"].someProperty("title",item.cityName)){
        				province["children"].findProperty("title",item.cityName)["children"].push({"hospitalId":item.hospitalId,"title":item.hospitalName,"checked":item.checked?item.checked:false});
        			}
        			else{
        				province["children"].push({"title":item.cityName,children:[{"hospitalId":item.hospitalId,"title":item.hospitalName,"checked":item.checked?item.checked:false}]});
        			}
        		}
        		else{
        			newArr.push({"title":item.provinceName,"children":[{"title":item.cityName,children:[{"hospitalId":item.hospitalId,"title":item.hospitalName,"checked":item.checked?item.checked:false}]}]});
        		}
        	})
            console.log(newArr);
        	return newArr;
        },
        addBtn(){
        	this.addShow=true;
        	this.treeError=false;
        	this.$refs['sampleAdd'].resetFields();
            this.sampleAdd.groupId='';
            this.sampleAdd.groupName='';
            this.sampleAdd.hospitalList=[];
            this.sampleAdd.hospitalIds=[];
            this.hospitalTree=this.getNewTree(this.hospitalTreeBasic);
        },
        addSample(){
            var urlName='';
            if(this.sampleAdd.groupId==''){
                urlName='sample.add'
            }else{
                urlName='sample.edit'
            }
        	this.$refs['sampleAdd'].validate((valid) => {
                if (valid&&this.sampleAdd.hospitalIds.length>0) {
                	var self=this;
		            Vue.ajax.send({
		                name: urlName,
		                data: {
                            groupId:self.sampleAdd.groupId,
                            groupName:self.sampleAdd.groupName,
                            hospitalIds:self.sampleAdd.hospitalIds
                        },
		                success: function(data) {
		                    if (!!data && data.code=='0') {
		                    	if(self.sampleAdd.groupId==''){
			                        self.$Message.success('新增样本分组成功！');
			                        self.$refs['sampleAdd'].resetFields();
			                        self.getSampleList();
                                    self.hospitalTree=self.getNewTree(self.hospitalTreeBasic);
		                    	}else{
                                    self.$Message.success('修改样本分组成功！');
                                    self.$refs['sampleAdd'].resetFields();
		                    		self.getSampleList();
                                    self.editshow=false;
                                    self.hospitalTree=self.getNewTree(self.hospitalTreeBasic);
		                    	}
		                        
		                    } else {
		                        this.$Modal.error({
		                            title: '',
		                            content: data.message
		                        });
		                    }
		                }
		            });
                }else{
                	this.treeError=true;
                }
            })
        },
        delTag(i){
        	this.index=i;
        	this.$Modal.confirm({
                title: '样本分组删除',
                content: '确定要删除样本分组“'+this.sampleList[i].groupName+'”？',
                onOk: () => {
                    var self=this;
                    Vue.ajax.send({
                    name: 'sample.del',
                    data:{groupId:self.sampleList[i].groupId},
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.$Message.info('样本分组删除成功');
                            self.$refs['sampleAdd'].resetFields();
                            self.getSampleList();
                            self.addBtn()
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
        showDetail(item){
            this.$refs['sampleAdd'].resetFields();
            this.treeError=false;
            this.sampleAdd.groupId=item.groupId;
            this.sampleAdd.groupName=item.groupName;
            this.sampleAdd.hospitalList=[];
            this.sampleAdd.hospitalIds=[];
            for(var j=0; j<item.hospitalIds.length;j++){
                if(this.hospitalTreeBasic.findProperty('hospitalId',item.hospitalIds[j])){
                    this.sampleAdd.hospitalList.push({'hospitalId':item.hospitalIds[j],'title':this.hospitalTreeBasic.findProperty('hospitalId',item.hospitalIds[j]).hospitalName});
                    this.sampleAdd.hospitalIds.push(item.hospitalIds[j])
                }
            }
            this.hospitalTree=[];
            this.hospitalTree=this.getNewTree(this.hospitalTreeBasic);
            this.editshow=false;
            this.addShow=false;
        },
        detailEdit(){
        	this.editshow=true;
        	var newtree= this.hospitalTreeBasic.assign(); 
        	newtree.forEach(item=>{
        		if(this.sampleAdd.hospitalList.someProperty("hospitalId",item.hospitalId)){
        			item.checked=true;
        		}else{
        			item.checked=false;
        		}
        	})
        	this.hospitalTree=this.getNewTree(newtree);
        },
		treeChange(member){
            this.sampleAdd.hospitalIds=this.$refs["tree"].getCheckedNodes().filter(m=>m.hospitalId).map(m=>m.hospitalId)
            // console.log("treeChange",member,this.$refs["tree"].getCheckedNodes().filter(m=>m.hospitalId))
			// this.sampleAdd.hospitalList=member;
			// for (var i = 0; i < this.sampleAdd.hospitalList.length; i++) {
        	// 	if(this.sampleAdd.hospitalList[i].children&&this.sampleAdd.hospitalList[i].children.length>0){
        	// 		this.sampleAdd.hospitalList.splice(i, 1);
        	// 		i--;
        	// 	}
        	// }
            // console.log(this.sampleAdd.hospitalList);
            // for(var i=0; i<member.length;i++ ){
            //     if(this.sampleAdd.hospitalIds.indexOf(member[i].hospitalId)<0){
            //         this.sampleAdd.hospitalIds.push(member[i].hospitalId);
            //     }
            // }
        	if(this.sampleAdd.hospitalIds.length==0){
        		this.treeError=true;
        	}else{
        		this.treeError=false;
        	}
		}

    }
};
</script>
<style scoped>
.hosp-title{
    font-size: 16px;
    color: #00a0e9;
    padding-left: 20px;
    margin-bottom: 30px;
    background: url(../../assets/img/arrow.png) left center no-repeat;
}
</style>