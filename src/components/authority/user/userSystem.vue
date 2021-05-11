<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title">分配系统和角色</h2>
        <div class="mt20">
            <Form :label-width="100" :model="userSystem" ref="userSystemForm">
                <FormItem label="登录账号">
                    <Label >{{userSystem.loginName}}</Label>
                </FormItem>
                <FormItem label="用户名称">
                    <Label >{{userSystem.userName}}</Label>
                </FormItem>
                <FormItem label="分配系统和角色">
                    <table class="common-table" style="width:800px;">
                        <tbody>
                            <tr style="background-color:#ebebeb;">
                                <td style="width:200px;" >系统</td>
                                <td style="width:600px;">角色</td>
                            </tr>
                            <template v-for="(item, index) in systemList">
                                <tr>
                                    <td style="width:200px;">
                                    <div :key="item.systemId"  class="mr15">{{item.systemName}}</div>
                                    </td>
                                    <td style="width:600px; ">
                                        <template v-for="(item, index) in item.roleList">
                                             <div class="checkbox-con">
                                                 <input type="checkbox" :value="item.roleId" v-model="systemRole.roleIds">
                                                 <label></label>
                                            </div>
                                            <span class="mr15" :key="item.roleId">{{item.roleName}}</span>
                                        </template>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="ivu-form-item-error-tip" v-show="treeError">请选择角色</div>
			    </FormItem>
                <FormItem>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="saveUserSystem()">保存</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'userSystem',
        data () {
            return {
                userId: '',
                systemList: [],
                systemIdList: [],
                roleList: [],
                systemRole: {
                    roleIds: [],
                },
                treeError: false,
                systemId: '',
                systemName: '',
                systems: '',
                indeterminate: false, //全选状态(默认是非全选)
                checkAll: false, //全选状态（默认是非全选）
                checkAllGroup: [], //选中的多选框
                userSystem: {
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
                    name: "user.detail",
                    data: {
                        userId: self.userId
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.userSystem = data.data;
                            self.systems = self.userSystem.systems;
                            var roles=[];
                            if (data.data.sysList != null && data.data.sysList.length > 0) {
                                data.data.sysList.forEach(sys=>{
                                    roles=roles.concat(sys.roleList.map(r=>r.roleId))
                                })
                                self.systemRole.roleIds = roles;
                            }
                            //获取系统列表
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
                            self.systemList = data.data.dataList;
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
            saveUserSystem() {
                
                if (this.systemRole.roleIds.length > 0) {
                    var self = this;
                    var systemIds=[];
                    self.systemList.forEach(s=>{
                        if(s.roleList.some(r=>{
                            return self.systemRole.roleIds.indexOf(r.roleId)>-1;
                        }) && systemIds.indexOf(s.systemId)<0){
                            systemIds.push(s.systemId);
                        }
                    })
                    Vue.ajax.send({
                    name: 'user.updateSystem',
                    data: {
                        userId: self.userId,
                        systemIds: systemIds,
                        roleIds: self.systemRole.roleIds,
                        updateUser: Vue.getUser().userName
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.$router.push("/authority/user/list");
                            self.$Message.success('用户角色分配成功！');
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


<style scoped>
/* 复选框样式 */
.checkbox-con{
    position: relative;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
}
.checkbox-con input[type="checkbox"]{ 
    opacity: 0;     
    width: 18px;
    height: 18px;
    position: absolute; 
    top: 0; 
    left: 0;
    z-index: 10;
    margin: 0;
} 
.checkbox-con input[type="checkbox"] + label{
    display: inline-block;      
    width: 18px;
    height: 18px;
    background: #fff;
    border: 1px solid #bccae2;
    position: absolute; 
    top: 0px;
    left: 0px;
    z-index: 1;
} 
.checkbox-con input[type="checkbox"]:checked + label:after{ 
    content: '√';
    font-size: 18px;
    font-weight: bold;
    color: #205aa4;
    /* background:#fa6260 url('../../images/icon/select.png') center no-repeat; 
    background-size:0.85rem;*/
    display: block;   
    width: 18px;
    height: 18px;
    padding: 0;
    line-height: 16px;
    text-align: center;
    position: absolute;
    z-index: 20;
}
.mr15{
    margin-right: 15px;
}


</style>