<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title">分配部门</h2>
        <div class="mt20">
            <Form :label-width="100" :model="userDept" ref="userDeptForm">
                <FormItem label="登录账号">
                    <Label >{{userDept.loginName}}</Label>
                </FormItem>
                <FormItem label="用户名称">
                    <Label >{{userDept.userName}}</Label>
                </FormItem>
                <FormItem label="分配部门">
                    <table class="common-table" style="width:800px;">
                        <tbody>
                            <tr style="background-color:#ebebeb;">
                                <td style="width:200px;" >系统</td>
                                <td style="width:600px;">部门</td>
                            </tr>
                            <template v-for="(item, index) in systemList">
                                <tr>
                                    <td style="width:200px;">
                                        <div :key="item.systemId"  class="mr15">{{item.systemName}}</div>
                                    </td>
                                    <td style="width:600px; ">
                                        <RadioGroup v-model="item.deptId">
                                            <Radio v-for="(item, index) in item.deptList" :key="item.deptId" :label="item.deptId" >{{ item.deptName }} </Radio>
                                        </RadioGroup>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="ivu-form-item-error-tip" v-show="treeError">请选择部门</div>
			    </FormItem>
                <FormItem>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="saveUserDept()">保存</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'userDept',
        data () {
            return {
                userId: '',
                deptList: [],
                deptIdList: [],
                systemList: [],
                deptIds: [],
                treeError: false,
                deptName: '',
                indeterminate: false, //全选状态(默认是非全选)
                checkAll: false, //全选状态（默认是非全选）
                checkAllGroup: [], //选中的多选框
                userDept: {
                    loginName: '',
                    userName: ''
                },
            }
        },
        mounted () {
                if (this.$route.query.Id != '') {
                    this.userId = this.$route.query.Id;
                    //获取用户信息
                    this.getUserInfo();
                }
            
        },
        methods: {
            getUserInfo() {
                var self = this;
                Vue.ajax.send({
                    name: 'user.ownDept',
                    data: {
                        userId: self.userId
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.userDept = data.data;
                            //获取系统列表下所有的部门
                            self.getSystemList();
                            
                        } else {
                            this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                      }
                    }
                });
            },
            getSystemList(){
                var self = this;
                Vue.ajax.send({
                    name: 'system.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 99999,
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            //接口数据
                            self.systemList = data.data.dataList.map(item=>{
                                var sys=self.userDept.sysList.findProperty("systemId",item.systemId)
                                if(sys){
                                    item.deptId=sys.deptId;
                                }
                                return item;
                            });
                            
                        }else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            cancel() {
                this.$router.push("/authority/user/list");
            },
            saveUserDept() {
                this.deptIds = [];
                var tmpArr = [];
                this.systemList.forEach(item=>{
                    if (item.deptId) {
                        tmpArr.push(item.deptId);
                    }
                })
                this.deptIds = tmpArr;
                if (this.deptIds.length > 0) {
                    var self = this;
                    Vue.ajax.send({
                    name: 'user.updateDept',
                    data: {
                        userId: self.userId,
                        deptIds: self.deptIds,
                        updateUser: Vue.getUser().userName
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.$router.push("/authority/user/list");
                            self.$Message.success('用户部门分配成功！');
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                        
                       }
                   });
                }else {
                    this.treeError = true;
                }
                
            }
        }
    }
</script>

