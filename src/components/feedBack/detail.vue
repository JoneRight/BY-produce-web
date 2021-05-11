<template>
    <div class="bg-white m20 p20 ">
        <h2 class="common-title">问题处理</h2>
        <div>
            <h2 class="feedback-title">反馈详情</h2>
            <table class="common-table" style="width:800px">
                <tbody>
                    <tr>
                        <td style="background-color:#f5f5f5">主题</td>
                        <td colspan="7">
                            <div><Label >{{feedBack.title}}</Label></div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f5f5f5">数据类型</td>
                        <td colspan="3">
                            <div><Label v-if="feedBack.dataType == 10">{{ '购药数据' }}</Label></div>
                            <div><Label v-if="feedBack.dataType == 20">{{ '门急诊数据' }}</Label></div>
                            <div><Label v-if="feedBack.dataType == 30">{{ '病案数据' }}</Label></div>
                            <div><Label v-if="feedBack.dataType == 40">{{ '医嘱数据' }}</Label></div>
                        </td>
                        <td style="background-color:#f5f5f5">数据年月</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.yearMonth}}</Label></div>                            
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f5f5f5">反馈问题阶段</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.issuePhases}}</Label></div>
                        </td>
                        <td style="background-color:#f5f5f5">问题类型</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.issueType}}</Label></div>                            
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f5f5f5">反馈人</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.feedbackUserName}}</Label></div>
                        </td>
                        <td style="background-color:#f5f5f5">紧急程度</td>
                        <td colspan="3">
                            <div><Label v-if="feedBack.emergencyLevel == 0" style="color:#ffb400">{{'一般'}}</Label></div>
                            <div><Label v-if="feedBack.emergencyLevel == 1" style="color:#ff6c00">{{'急'}}</Label></div>  
                            <div><Label v-if="feedBack.emergencyLevel == 2" style="color:red">{{'紧急'}}</Label></div>                              
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f5f5f5">反馈时间</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.feedbackTime}}</Label></div>
                        </td>
                        <td style="background-color:#f5f5f5">要求答复时间</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.requestReplyTime}}</Label></div>                            
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f5f5f5">医院所在省</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.provinceName}}</Label></div>
                        </td>
                        <td style="background-color:#f5f5f5">医院所在市</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.cityName}}</Label></div>                            
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f5f5f5">医院名称</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.hospName}}</Label></div>
                        </td>
                        <td style="background-color:#f5f5f5">医院编码</td>
                        <td colspan="3">
                            <div><Label >{{feedBack.hospNo}}</Label></div>                            
                        </td>
                    </tr>
                    <tr>
                        <td height="100" style="background-color:#f5f5f5">问题描述</td>
                        <td colspan="7" height="100">
                            <div><Label >{{feedBack.issueDesc}}</Label></div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2 class="feedback-title">文件处理</h2>    
            <Form :label-width="10" :model="feedHandle" ref="feedbackHandleForm" :rules="ruleValidate">
                <FormItem  prop="issueDesc">
                    <!-- 如果是详情页面 -->
                    <Steps :current="curStep" v-show="type == 1" direction="vertical">
                    <Step status="finish" v-for="item in feedHandleList" :title="item.dealUserName" :content="item.issueDesc" :key="item.feedbackDisposeId"> </Step>
                    </Steps>
                    <!-- 如果是处理页面 -->
                    <Steps :current="curStep"  v-show="type == 2"  direction="vertical">
                        <Step v-for="item in feedHandleList" :title="item.dealUserName "  :content="item.issueDesc" 
                            :key="item.feedbackDisposeId" :status="item.state == 0 ? 'process' :'finish'">
                            <div v-if="item.state == 0">
                                <Input  v-model="feedHandle.issueDesc" placeholder="请输入处理结果..." 
                                     style="width:600px" type="textarea" :maxlength="300"  :autosize="{minRows: 4,maxRows: 8}"/>
                            </div>
                        </Step>
                    </Steps>
                </FormItem>
                
                <FormItem label=" " :label-width="50"  v-show="type == 2" prop="deptId">
		            <Select  v-model="feedHandle.deptId"  placeholder="选择下一个流转部门" style="width:200px"  @on-change='getDeptUserList'>
				        <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId" >{{ item.deptName }}</Option>
				    </Select>
                </FormItem>
                <FormItem label=" " :label-width="50" v-show="type == 2" prop="userId">
                     <Select  v-model="feedHandle.userId" placeholder="选择负责人" style="width:200px">
				        <Option v-for="item in userList" :value="item.userId" :key="item.userId" >{{ item.userName }}</Option>
				    </Select>
		        </FormItem>
                <FormItem :label-width="50" v-show="type == 2">
                    <Button type="info" @click="nextOK" >流转到下一阶段</Button>
                    <Button type="info" style="background-color:#0079e9;border-color:#0079e9"  @click="submitFeedback" >结束反馈</Button>
                </FormItem>
                <FormItem :label-width="50" v-show="type == 1">
                    <Button type="info" to="/feedBack/list" >返回列表</Button>
                </FormItem>
            </Form>
        </div>
                
    </div>
</template>
<script>
import Vue from "vue";
import config from '../rules/config';
export default {
    name: 'feedbackHandle',
        data () {
            
            return {
                type: '',
                feedBack: {
                },
                curStep: 0,
                curFeedDisposeId: '',
                curUser: Vue.getUser().userName,
                deptList: [],
                userList: [],
                feedHandleList: [],
                feedDisposeList: [],
                ruleValidate: {
                    issueDesc: [
                        { required: true, message: '请输入处理结果', trigger: 'blur'}
                    ],
                    deptId: [
                        { required: true, message: '请选择流转部门', trigger: 'blur',type:"number"}
                    ],
                    userId: [
                        { required: true, message: '请选择负责人', trigger: 'blur',type:"number"}
                    ]
                },
                feedbackId: '',
                feedHandle: {
                    feedbackUser: '',
                    feedbackUserName: '',
                    issueDesc: '',
                    deptId:"",
                    userId:""
                }
            }
        },
        mounted () {
            // //获取本条数据
            if (this.$route.query.Id != "") {
                this.feedbackId = this.$route.query.Id;
                this.type = this.$route.query.type;

                this.getFeedBackInfo();
                this.getFeedbackHandleInfo();
                if( this.type == 2) {
                    this.getDeptList();
                }
                
            }
            
        },
        methods: {
            getFeedbackHandleInfo() {
                var self=this;
                Vue.ajax.send({
                    name: 'feedBack.handleGet',
                    data: {
                        feedbackId: self.feedbackId
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            // self.feedHandle = data.data;
                            self.feedHandleList = data.data.disposeList;
                            // if (self.type == 2) {
                            //     self.feedHandleList.push({
                            //         feedbackUserName: self.feedBack.handleUser,
                            //         issueDesc: "",
                            //         feedbackDisposeId: 0,
                            //         handleuserid: self.feedBack.handleuserid,
                            //         handleUser: self.feedBack.handleUser,
                            //         status: "edit"
                            //   });
                            // }
                            self.feedHandleList.forEach(item=>{
                                if (item.state == 0) {
                                    self.curFeedDisposeId = item.feedbackDisposeId;
                                    self.curFeedbackUser = item.feedbackUser;
                                }
                            });
                            
                            //当前到第几个人了
                            self.curStep = self.feedHandleList.length;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getFeedBackInfo(){
                var self=this;
                Vue.ajax.send({
                    name: 'feedBack.get',
                    data: {
                        feedbackId: self.feedbackId
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            self.feedBack = data.data;

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
                            // self.userList = data.data.dataList;
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
            nextOK() {  
                if (this.feedHandle.deptId == 0) {
                    this.feedHandle.deptId = "";
                    this.feedHandle.userId = "";
                }else {
                    this.feedHandle.deptId = this.feedHandle.deptId;
                    this.feedHandle.userId = this.feedHandle.userId;
                }
                
             this.$refs["feedbackHandleForm"].validate(valid => {
                if (valid) {
                    
                this.feedHandle = this.feedHandle || [];
                        var self = this;
                        Vue.ajax.send({
                        name: "feedBack.handle",
                        data: {
                            feedbackDisposeId: self.curFeedDisposeId,
                            issueDesc: self.feedHandle.issueDesc,
                            feedbackId: self.feedbackId,
                            dealUser:Vue.getUser().userId,
                            dealUserName:Vue.getUser().userName,
                            state: '0',
                            feedbackUser: self.feedHandle.userId
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$router.push("/feedBack/list");
                                self.$Message.success("反馈信息处理成功！");
                            } else {
                                    self.$Modal.error({
                                        title: "",
                                        content: data.message
                                    });
                                }
                            }
                        }); 
                  }
              })
            },
            submitFeedback () {
                this.feedHandle.deptId = 0;
                this.feedHandle.userId = Vue.getUser().userId;
                this.$refs["feedbackHandleForm"].validate(valid => {
                     if (valid) {
                        var self = this;
                        Vue.ajax.send({
                        name: "feedBack.handle",
                        data: {
                            feedbackDisposeId: self.curFeedDisposeId,
                            issueDesc: self.feedHandle.issueDesc,
                            feedbackId: self.feedbackId,
                            state: '1',
                            feedbackUser: Vue.getUser().userId
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$router.push("/feedBack/list");
                                self.$Message.success("反馈信息处理成功！");
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

<style scoped>
.feedback-title {
    font-size: 16px;
    color: #00a0e9;
    padding-left: 20px;
    margin-bottom: 30px;
    background: url(../../assets/img/arrow.png) left center no-repeat;
}
.position {
    position: absolute;
    top: 100%;
    left: 0;
    margin-left: 50px;
    line-height: 1;
    padding-top: 6px;
    color: #ed4014;
}
.ivu-form-item-error-tip  {
    position: absolute;
    top: 100%;
    left: 0;
    line-height: 1;
    padding-top: 6px;
    color: #ed4014;
}

</style>