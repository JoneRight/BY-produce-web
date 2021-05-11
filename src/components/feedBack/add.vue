<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title">新增反馈</h2>
        <div class="mt20">
            <Form :label-width="110" :model="feedBack" ref="feedBackForm" :rules="ruleValidate">
                <FormItem label="主题" prop="title">
                    <Input v-model.trim="feedBack.title" :maxlength="100"  style="width:400px"/>
                </FormItem>
                <FormItem label="数据类型" prop="dataType">
		            <Select  v-model="feedBack.dataType" style="width:400px">
				        <Option :value="10">购药数据</Option>
                        <Option :value="20">门急诊数据</Option>
                        <Option :value="30">病案数据</Option>
                        <Option :value="40">医嘱数据</Option>
				    </Select>
		        </FormItem>
                <FormItem label="数据年月" prop="yearMonth">
                    <DatePicker type="month" format="yyyyMM" :options="options2" v-model="feedBack.yearMonth" style="width: 400px"></DatePicker>
                </FormItem>
                <FormItem label="反馈问题阶段" prop="issuePhases">
                    <Select  v-model="feedBack.issuePhases" filterable clearable style="width:400px">
				        <Option v-for="item in proStageList" :value="item.problemStageId" :key="item.problemStageId" >{{ item.problemStageName }}</Option>
				    </Select>
                </FormItem>
                <FormItem label="问题类型" prop="issueType">
		            <Select  v-model="feedBack.issueType" filterable clearable style="width:400px">
				        <Option v-for="item in proTypeList" :value="item.problemTypeId" :key="item.problemTypeId" >{{ item.problemTypeName }}</Option>
				    </Select>
		        </FormItem>
                <FormItem label="紧急程度" prop="emergencyLevel">
		            <Select  v-model="feedBack.emergencyLevel"  style="width:400px">
				        <Option :value="0">一般</Option>
                        <Option :value="1">急</Option>
                        <Option :value="2">紧急</Option>
				    </Select>
		        </FormItem>
                <FormItem label="要求答复时间" prop="requestReplyTime">
                    <DatePicker type="date" format="yyyy年MM月dd日" :options="options3"  v-model="feedBack.requestReplyTime"  style="width: 400px"></DatePicker>
                </FormItem>
                <FormItem label="医院名称" prop="hospId">
                    <Select v-model="feedBack.hospId" filterable clearable style="width: 400px">
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="问题描述">
                    <Input v-model="feedBack.issueDesc" :maxlength="1300"
                     style="width:400px" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                </FormItem>
                <FormItem label=" " prop="deptId">
		            <Select  v-model="feedBack.deptId" filterable placeholder="选择下一个流转部门" style="width:200px"  @on-change='getDeptUserList'>
				        <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId" >{{ item.deptName }}</Option>
				    </Select>
                </FormItem>
                <FormItem label=" " prop="userId">
                     <Select  v-model="feedBack.userId" filterable placeholder="选择负责人" style="width:200px">
				        <Option v-for="item in userList" :value="item.userId" :key="item.userId" >{{ item.userName }}</Option>
				    </Select>
		        </FormItem>
                <FormItem>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="addOk" >确定</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>
<script>
import Vue from "vue";
export default {
    name: 'feedbackAdd',
        data () {
            return {
                options2: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
                options3: {
                    disabledDate (date) {
                        let dateTmp = Date.now() ;
                        return date && date.valueOf() < dateTmp - 86400000;
                    }
                },
                addressList: [],
                hospitalList: [],
                proStageList: [],
                proTypeList: [],
                userList: [],
                deptList: [],
                feedBack: {
                    yearMonth: '',
                    state: '0',
                    hospId:"",
                    issueDesc:"",
                    feedbackUserName: Vue.getUser().userName
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '请输入主题名称', trigger: 'blur'}
                    ],
                    dataType: [
                        { required: true, message: '请选择数据类型', trigger: 'blur', type: 'number'}
                    ],
                    yearMonth: [
                        { required: true, message: '请选择年月', trigger: 'change', type:'date'}
                    ],
                    issuePhases: [
                        { required: true, message: '请输入问题反馈阶段', trigger: 'blur', type:'number'}
                    ],
                    issueType: [
                        { required: true, message: '请选择问题类型', trigger: 'blur', type:'number'}
                    ],
                    emergencyLevel: [
                        { required: true, message: '请选择紧急程度', trigger: 'blur', type:'number' }
                    ],
                    hospId: [
                        { required: true, message: '请选择医院', trigger: 'blur' }  
                    ],
                    deptId: [
                        { required: true, message: '请选择流转部门', trigger: 'blur',type:"number"}
                    ],
                    userId: [
                        { required: true, message: '请选择负责人', trigger: 'blur',type:"number"}
                    ]
                },
            }
        },
        mounted () {
            // //获取本条数据
            this.getProStageList();
            this.getProTypeList();
            this.getHospitalList();
            this.getDeptList();
            this.feedBack.issueDesc = this.$route.query.message;
            this.feedBack.hospId = this.$route.query.hospId;
            
        },
        methods: {
            dateFormat(val) {
		        let year = val.getFullYear().toString();
		        let month = val.getMonth() >= 9
		        ? (val.getMonth() + 1).toString()
		        : "0" + (val.getMonth() + 1);
		        return year + month;
            },
            getProStageList(){
                var self=this;
                Vue.ajax.send({
                    name: 'feedBack.proStage',
                    data: {
                        pageIndex: 1,
                        pageSize: 99999
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.proStageList=data.data.dataList;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getProTypeList(){
                var self=this;
                Vue.ajax.send({
                    name: 'feedBack.proType',
                    data: {
                        pageIndex: 1,
                        pageSize: 99999
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.proTypeList=data.data.dataList;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getHospitalList(){
                var self=this;
                Vue.ajax.send({
                    name: 'common.hospitalList',
                    data: {},
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.hospitalList = data.data;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getDeptList(){
                var self = this;
                Vue.ajax.send({
                    name: 'dept.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 99999,
                        systemId: '20'
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            //接口数据
                            self.deptList = data.data.dataList;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getDeptUserList(value) {

                var self = this;
                Vue.ajax.send({
                    name: 'deptUser.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 99999,
                        systemId: '20',
                        deptId: value
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            //接口数据
                            var arr = [];
                            arr = data.data.dataList;
                            var userIdTmp = Vue.getUser().userId;
                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];
                                //去掉当前用户，反馈不能自己指给自己
                                if (item.userId == userIdTmp) {
                                    arr.splice(i, 1);
                                }
                            }
                            self.userList = arr;

                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            cancel () {
                this.$router.push("/feedBack/list");
            },
            addOk () {
                
                this.$refs["feedBackForm"].validate(valid => {
                     if (valid) {
                        var self = this;
                        Vue.ajax.send({
                        name: "feedBack.add",
                        data: {
                            title: self.feedBack.title,
                            dataType: self.feedBack.dataType,
                            yearMonth: self.dateFormat(self.feedBack.yearMonth),
                            issuePhases: self.feedBack.issuePhases,
                            issueType: self.feedBack.issueType,
                            emergencyLevel: self.feedBack.emergencyLevel,
                            requestReplyTime: self.feedBack.requestReplyTime,
                            hospId: self.feedBack.hospId,
                            issueDesc: self.feedBack.issueDesc,
                            feedbackUser: Vue.getUser().userId,
                            handleuserid: self.feedBack.userId,
                            feedbackUserName: Vue.getUser().userName,
                            state: '0',
                            remark: self.feedBack.remark
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$router.push("/feedBack/list");
                                self.$Message.success("新增反馈信息提交成功！");
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
}    
</script>