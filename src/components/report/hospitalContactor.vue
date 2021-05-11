<template>
    <div class="bg-white m20" style="min-height:500px;">
        <h2 class="common-title">联络员管理</h2>
        <div class="p20">
            <Button type="primary" @click="addBtn" v-show="dataType.length<4">新增联络员</Button>
             
            <Row> 
                <Col span="8" v-for="item,index in contactorList" :key="index" style="border-right:#ccc 1px solid;padding:20px;height:330px;">
                    <Form :label-width="100" ref="contactorList" :model="item" :rules="addValidate">
                        <FormItem label="联络员姓名" prop="uploadName">
                            <Input v-if="!item.isEdit" v-model="item.uploadName" :maxlength='30'></Input>
                            <span v-else>{{item.uploadName}}</span>
                        </FormItem>
                        <FormItem label="所属科室" prop="uploadSection">
                         <Select v-if="!item.isEdit" v-model="item.uploadSection" placeholder="选择科室" style="width: 330px;" clearable >
                        <Option value="药学部">药学部</Option>
                        <Option value="信息科">信息科</Option>
                        <Option value="病案室">病案室</Option>
                        <Option value="院长办公室">院长办公室</Option>
                        <Option value="医务处">医务处</Option>
                        <Option value="质控中心">质控中心</Option>
                        <Option value="其他科室">其他科室</Option>
                    </Select>
                     <span v-else>{{item.uploadSection}}</span>

                        </FormItem>
                        <FormItem label="联系方式" prop="uploadWay">
                            <Input v-if="!item.isEdit" v-model="item.uploadWay" :maxlength='16'></Input>
                            <span v-else>{{item.uploadWay}}</span>
                        </FormItem>
                        <FormItem label="联系邮箱" prop="uploadEmail">
                            <Input v-if="!item.isEdit" v-model="item.uploadEmail" :maxlength='30'></Input>
                            <span v-else>{{item.uploadEmail}}</span>
                        </FormItem>
                        <FormItem label="负责数据类型" prop="dataType" >
                            <CheckboxGroup v-model="item.dataType"  @on-change="changeDataType">
                                <Checkbox v-for="value,index in dataTypeList" :label="value.label" :key="index" :disabled='item.isEdit'>{{value.name}}</Checkbox>
                            </CheckboxGroup>
                        </FormItem>                
                        <FormItem>
                            <Button v-if='item.isEdit' type="primary" @click="item.isEdit=false">编辑</Button>
                            <Button v-if='item.isEdit' type="error" @click="deleteContract(item)">删除</Button>
                            <Button v-else type="primary" @click="saveContact(item,index)">保存</Button>
                        </FormItem>
                        </Form>
                </Col>
            </Row>
        </div>        
    </div>
</template>

<script>
import Vue from "vue";
import schema from'async-validator'
export default {
    name: 'hospitalContactor',
    data(){
        //手机号验证
      const validatePhone = (rule, value, callback) => {
            var reg=/^0?1[3|4|5|8][0-9]\d{8}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {                
                callback();
            }
        };
    	return{
            Id:this.$route.query.Id,
            dataType:[],
            contactorList:[],
            isEdit:[],
            index:0,
            dataTypeList:[{
                label:10,
                name:'购药'
            },{
                label:20,
                name:'门急诊'
            },{
                label:30,
                name:'病案'
            },{
                label:40,
                name:'医嘱'
            }],
            addValidate: {

                uploadName:[
                    {required: true, message: '联络员姓名不能为空', trigger: 'blur'}
                ],
                uploadSection:[
                    {required: true, message: '科室不能为空', trigger: 'blur'}
                ],
                uploadWay:[
                    {required: true, message: '联系方式不能为空', trigger: 'blur'},
                    { validator: validatePhone, trigger: 'blur'}
                ],
                uploadEmail:[
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
                ],
                dataType:[
                    {required: true, type:'array', message: '请选择负责数据类型', trigger: 'change'}
                ]
            },
        }
    },
    mounted: function() {
        this.getContactorList();
    },
    computed:{
         
    },
    methods: {
        changeDataType:function(data){
            var arr=[];
            this.contactorList.map((item)=>{
                arr=arr.concat(item.dataType || [])
            })
            console.log(arr,data);
            var temp={};
            var self=this;
            arr.forEach((item,index)=>{
                if(temp[item]){
                    if(data.length>0){
                        data.splice(data.length-1,1);
                        self.$Modal.error({
                            title: self.dataTypeList.findProperty("label",item).name+"已经被选择",
                            content: ""
                        });
                        return
                    }
                }
                else{
                    temp[item]=item;
                }
            })
        },
        getContactorList(){            
            var self=this;
            self.dataType=[];
            Vue.ajax.send({
                name: 'hospital.contactorList',
                data: {hospitalId:self.Id},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        let oldArr=data.data;
                        let newArr=new Array();
                        oldArr.forEach(item=>{
                            var find=newArr.filter(m=>{
                                return m.uploadName==item.uploadName && m.uploadWay==item.uploadWay && m.uploadEmail==item.uploadEmail&&m.uploadSection==item.uploadSection;
                            });
                            var others=newArr.filter(m=>{
                                return !(m.uploadName==item.uploadName && m.uploadWay==item.uploadWay && m.uploadEmail==item.uploadEmail&&m.uploadSection==item.uploadSection);
                            });
                            if(find.length>0){
                                find[0].dataType.push(item.dataType);
                                find[0].dataTypeOld.push(item.dataType);
                                newArr=find.concat(others);
                            }
                            else{
                                newArr.push({"uploadName":item.uploadName,"uploadWay":item.uploadWay,"uploadEmail":item.uploadEmail,"uploadSection":item.uploadSection,"isEdit":true,"dataType":[item.dataType],dataTypeOld:[item.dataType]});
                            }
                        })
                        self.contactorList=newArr.sortProperty("uploadName");  
                        for (var i = 0; i <self.contactorList.length; i++) {
                            self.dataType=self.dataType.concat(self.contactorList[i].dataType);
                        }
                        console.log(self.contactorList,self.dataType)
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },        
        saveContact(item,index){
            var self = this;
            self.$refs["contactorList"][index].validate(valid=>{
                if(valid){
                    Vue.ajax.send({
                        name: "hospital.contactorEdit",
                        data: {
                            hospId:self.Id,
                            uploadName:item.uploadName,
                            uploadEmail:item.uploadEmail,
                            uploadWay:item.uploadWay,
                            uploadSection:item.uploadSection,
                            dataType:item.dataType,
                            oldDataType:item.dataTypeOld || [],
                            updateUser:Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                if(!!item.dataTypeOld){
                                    self.$Message.success("修改联络员成功！");
                                }
                                else{
                                    self.$Message.success("新增联络员成功！");
                                }
                                self.getContactorList();
                            } else {
                                self.$Modal.error({
                                    title: "",
                                    content: data.message
                                });
                            }
                        }
                    });
                }
            });
        },
        addBtn(){
            if(this.contactorList.length>=4){
                return
            }
            this.contactorList.push({"isEdit":false});
        },
        deleteContract(item){
            console.log(item)
            var self=this
            this.$Modal.confirm({
                    title: '删除确认',
                    content: '确定要删除“'+item.uploadName+'”？',
                    onOk: () => {
                        var self=this;
                        Vue.ajax.send({
                        name: 'hospital.contactorDel',
                        data:{
                            hospId:self.Id,
                            dataType:item.dataTypeOld,
                            updateUser:Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.$Message.info('删除成功');
                                self.getContactorList();
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
};
</script>