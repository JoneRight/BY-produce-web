<template>
    <div class="bg-white m20">
        <h2 class="common-title">新增医院</h2>
        <div class="p20">
            <Form :label-width="100" ref="addForm" :model="addForm" :rules="addValidate">
                <FormItem label="医院名称" prop="hospName">
                    <Input v-model="addForm.hospName" style="width: 400px;" ></Input>
                </FormItem>
                <FormItem label="所在省市" prop="address">
                    <Cascader :data="addressList" trigger="hover" v-model="addForm.address" change-on-select style="width: 400px;"></Cascader>
                </FormItem>
                <FormItem label="联系人" prop="applyUser">
                    <Input v-model="addForm.applyUser"  style="width: 400px;"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="telephone">
                    <Input v-model="addForm.telephone"  style="width: 400px;"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="addForm.email"  style="width: 400px;"></Input>
                </FormItem>
                <FormItem label="医院等级" prop="hospGrade">
                    <RadioGroup v-model="addForm.hospGrade">
                        <Radio v-for="item,index in gradeList" :label="item.hospGrade" :key="index" v-if="item.hospGrade>0">{{item.hospGradeName}}</Radio>
                        <Radio v-for="item,index in gradeList" :label="item.hospGrade" :key="index" v-if="item.hospGrade==0">其他</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="医院性质" prop="hospAttached">
                    <RadioGroup v-model="addForm.hospAttached">
                        <Radio v-for="item,index in attachedList" :label="item.hospAttached" :key="index" v-if="item.hospAttached>0">{{item.hospAttachedName}}</Radio>
                        <Radio v-for="item,index in attachedList" :label="item.hospAttached" :key="index" v-if="item.hospAttached==0">其他</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="医院类别" prop="hospType">
                    <RadioGroup v-model="addForm.hospType">
                        <Radio v-for="item,index in typeList" :label="item.hospType" :key="index" v-if="item.hospType>0">{{item.hospTypeName}}</Radio>
                        <Radio v-for="item,index in typeList" :label="item.hospType" :key="index" v-if="item.hospType==0">其他</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="注册人科室">
                    <Input v-model="addForm.registerSection"  style="width: 400px;"></Input>
                </FormItem>
                <FormItem label="注册人职务">
                    <Input v-model="addForm.registerPosition"  style="width: 400px;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="addOk">保存</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>

<script>
import Vue from "vue";
export default {
    name: 'hospitalAdd',
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
            addForm:{
                hospAttached:null
            },
            addressList:[],
            gradeList:[],
            attachedList:[],
            typeList:[],
            addValidate: {
                reason: [
                    { required: true, message: '废弃原因不能为空', trigger: 'change'}
                ],
                hospName:[
                    {required: true, message: '医院名称不能为空', trigger: 'blur'}
                ],
                address:[
                    {required: true,type:'array', message: '所在省市不能为空', trigger: 'change'}
                ],
                applyUser:[
                    {required: true, message: '联系人不能为空', trigger: 'blur'}
                ],
                telephone:[
                    {required: true, message: '联系方式不能为空', trigger: 'blur'},
                    { validator: validatePhone, trigger: 'blur'}
                ],
                email:[
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
                ],
                hospGrade:[
                    {required: true, type: 'number', message: '请选择医院等级', trigger: 'change'}
                ],
                hospAttached:[
                    {required: true, type: 'number', message: '请选择医院性质', trigger: 'change'}
                ],
                hospType:[
                    {required: true, type: 'number', message: '请选择医院类别', trigger: 'change'}
                ]
            },
        }
    },
    mounted: function() {
        this.getAddressList();
        this.getGradeList();
        this.getAttachedList();
        this.getTypeList();
    },
    methods: {
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
        getGradeList(){
            var self=this;
            Vue.ajax.send({
                name: 'grade.list',
                data: {
                    pageIndex:1,
                    pageSize:999
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.gradeList=data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getAttachedList(){
            var self=this;
            Vue.ajax.send({
                name: 'attached.list',
                data: {
                    pageIndex:1,
                    pageSize:999
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.attachedList=data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getTypeList(){
            var self=this;
            Vue.ajax.send({
                name: 'type.list',
                data: {
                      pageIndex: 1,
                      pageSize: 999
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.typeList=data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        addOk(){
            this.$refs["addForm"].validate(valid => {
            if (valid) {
                this.addForm.province=this.addForm.address[0];
                this.addForm.city=this.addForm.address[1];
              var self = this;
              Vue.ajax.send({
                name: "hospital.add",
                data: self.addForm,
                success: function(data) {
                  if (!!data && data.code == "0") {
                    self.$Message.success("新增医院提交成功！");
                    self.$router.push("/report/hospital");
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
        }
        
    }
};
</script>