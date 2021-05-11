<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title">分配权限</h2>
        <div class="mt20">
            <Form :label-width="90" :model="roleAuth" ref="roleAuthForm">
                <FormItem label="所属系统">
                    <Label >{{roleAuth.roleSystemName}}</Label>
                </FormItem>
                <FormItem label="角色名称">
                    <Label >{{roleAuth.roleName}}</Label>
                </FormItem>
                <FormItem label="选择权限">
                    <Checkbox label="全选"  v-model="checkedAll"  @on-change="changeSelectAll">
                        <span>全选</span>
                    </Checkbox>
                    <table class="common-table" style="width:800px;">
                        <tbody>
                            <tr style="background-color:#ebebeb;">
                                <td style="width:200px;" >菜单</td>
                                <td style="width:600px;">权限</td>
                            </tr>
                            <template v-for="(item, index) in authList">
                                <tr>
                                    <td style="width:200px;">
                                        <div :key="item.menuId"  class="mr15">{{item.menuName}}</div>
                                    </td>
                                    <td style="width:600px; ">
                                        <template v-for="(item, index) in item.authIdsList">
                                             <div class="checkbox-con">
                                                 <input type="checkbox" @change="getInputChange"  :value="item.authId" v-model="role.authIds">
                                                 <label></label>
                                            </div>
                                            <span class="mr15" :key="item.authId">{{item.authName}}</span>
                                        </template>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="ivu-form-item-error-tip" v-show="treeError">请选择权限</div>
			    </FormItem>
                <FormItem>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="saveRoleAuth()">保存</Button>
                </FormItem>    
            </Form>
        </div>     
    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'roleAssignAuth',
        data () {
            return {
                roleAuth: {
                    authId: '',
                    roleId: '',
                    systemName: '',
                    roleName: ''
                },
                role: {
                    authIds: []
                },
                checkedAll: false,
                systemId: '',
                systemList: [],
                authList: [],
                allAuthList: [],
                treeError:false
            }
        },
        mounted () {
            // //获取角色信息
            if (this.$route.query.Id != null) {
                this.roleAuth.roleId = this.$route.query.Id;
                this.systemId = this.$route.query.sysId;
                this.getRoleInfo();
                //获取所有菜单
                this.getAllAuth();
            }
        },
        methods: {
           
            getRoleInfo(){
                var self = this;
                Vue.ajax.send({
                    name: 'role.detail',
                    data: {
                        roleId: self.roleAuth.roleId,
                        systemId: self.systemId
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.roleAuth = data.data;
                    } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getAllAuth(){
                var self=this;
                Vue.ajax.send({
                name: 'role.queryAuthBySystemId',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    roleId: self.roleAuth.roleId,
                    systemId: self.systemId
                },
                success: function(data) {
                    if (!!data && data.code=='0') {         
                        let oldArr = data.data.dataList;
                        var tmpArr = [];
                        oldArr.forEach(item => {
                           var sub = oldArr.filter(tmp=>tmp.menuId == item.menuId);
                           sub.forEach(m=>{
                               if (!tmpArr.someProperty("menuId",m.menuId)) {
                                   if (m.menuId == item.menuId) {
                                        tmpArr.push({
                                            menuId: m.menuId,
                                            menuName: m.menuName,
                                            authIdsList: sub
                                        })
                                    }
                               }
                           })
                        });
                        self.authList = tmpArr;
                        //所有的权限
                        self.allAuthList = oldArr;
                        //获取角色已有权限列表
                        self.getRoleAuthTree();

                    } else { 
                            this.$Modal.error({
                            title: '',
                            content: data.message
                            });
                        }
                    }
                });
            },
            getRoleAuthTree() {
                var self=this;
                Vue.ajax.send({
                name: 'role.queryAuthByRole',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    roleId: self.roleAuth.roleId
                },
                success: function(data) {
                    if (!!data && data.code=='0') {         
                        var list = data.data;
                        var roles = [];
                        if (list != null && list.length > 0) {
                            list.forEach(auth=>{
                                roles.push(auth.authId);
                            })
                            self.role.authIds = roles;
                        }

                        if (self.role.authIds.length == self.allAuthList.length) {
                            self.checkedAll = true;
                        }else {
                            self.checkedAll = false;
                        }

                    } else { 
                            this.$Modal.error({
                            title: '',
                            content: data.message
                            });
                        }
                    }
                });
            },
            changeSelectAll(value) {
                //判断是否是全选
                var self = this;
                if (value == true) {
                    //先清空数组
                    self.role.authIds = [];
                    //再重新添加到数组中
                    var roles = [];
                    self.authList.forEach(item => {
                        var list = item.authIdsList;
                        if (list != null && list.length > 0) {
                            list.forEach(auth=>{
                                roles.push(auth.authId);
                            })
                            self.role.authIds = roles;
                        }
                    })
                }else {
                    self.role.authIds = [];
                }
                
                
            },
            getInputChange () {
                //选择                
                if (this.role.authIds.length == this.allAuthList.length) {
                    this.checkedAll = true;
                }else {
                    this.checkedAll = false;
                }
            },
            cancel() {
                this.$router.push("/authority/role/list");
            },
            saveRoleAuth() {
                if (this.role.authIds.length > 0) {
                    var self=this;
                        Vue.ajax.send({
                            name: 'roleAuth.add',
                            data: {
                                roleId: self.roleAuth.roleId,
                                authIds: self.role.authIds,
                                updateUser: Vue.getUser().userName,
                            },
                            success: function(data) {
                                if (!!data && data.code=='0') {
                                    self.$router.push("/authority/role/list");
                                    self.$Message.success('分配权限信息提交成功！');
                                } else {
                                    self.$Modal.error({
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