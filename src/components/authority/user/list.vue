<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" id="pageMain">
        <h2 class="common-title">用户管理</h2>
            <div class="search-con">
                <Form :model="searchForm" ref="formInline" inline>
                    <FormItem label="系统" :label-width="40" style="width: 200px;">
		                <Select v-model="searchForm.systemId" placeholder="请选择系统" filterable clearable remote :remote-method="changeSystem" @on-change='getRoleList()'>
                            <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                        </Select>
		            </FormItem>
                    <FormItem label="角色" :label-width="50">
                        <Select v-model="searchForm.roleId" placeholder="请选择角色" filterable clearable remote :remote-method="changeRole" style="width: 200px;">
                            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                        </Select>
		            </FormItem>
                    <FormItem :label-width="70" label="登录账号">
                        <Input v-model="searchForm.loginName" type="text" placeholder="请输入登录账号" style="width: 200px;" />
                    </FormItem>
                    <FormItem :label-width="60" label="用户名">
                        <Input v-model="searchForm.keywords" type="text" placeholder="请输入用户名" style="width: 200px;" />
                    </FormItem>
                    <FormItem label="用户类型" :label-width="120" style="width: 200px;">
		                <Select v-model="searchForm.userType" placeholder="请选择类型" filterable clearable>
                            <Option v-for="item in userTypeList" :value="item.userType" :key="item.userType">{{ item.title }}</Option>
                        </Select>
		            </FormItem>
		            <FormItem>
		                <Button type="primary" @click="changePage(1)">检索</Button>
		            </FormItem>
                    <FormItem  class="fr">
                        <Button v-authorize="'AuthUserManageAdd'" type="primary"  @click="add" style="float:right">新增</Button>
                    </FormItem>
                    
                </Form>
            </div>
            <div class="bg-white mt15" style="height:100%;">
        	    <Table v-authorize="'AuthUserManageList'" border :height="tableH"  :columns="userCol" :data="userList" style="margin-top: 10px;"></Table>
                <div style="" class="page-footer">
                    <div class="mt15 text-center">  	
                        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    </div>
                </div>
            </div>

            
    </div>
</template>


<script>
import Vue from "vue";
import expandRow from "./listExpand.vue";
export default {
    name: 'user',
    components: { expandRow },
    data(){
    	return{
            tableH: 0,
    		searchForm:{
                keywords:'',
                systemId: '',
                roleId: '',
                userType:'',
                loginName:''
            },
            roles: '',
            loading: true,
            userList: [],
            systemList: [],
            userTypeList: [],
            roleList: [],
            roleIdList: [],
            updateRoleList: [],
            deptList: [],
            userInfo: {},
            distriModel: false, //弹框状态(分配部门)
            // checkAll: false, //全选状态（默认是非全选）
            // checkAllGroup: [], //选中的多选框
            pageConfig: {
              pageNum: 1,
              pageSize: 20,
              totalItemCount: 1
            },
            ruleValidate: {
                // loginName: [
                //     { required: true, message: '登录账号不能为空', trigger: 'blur'}
                // ],
                // userName: [
                //     { required: true, message: '用户名不能为空', trigger: 'blur'}
                // ],
                // blocSystem: [
                //     { required: true, message: '请选择所属系统', trigger: 'blur'}
                // ],
                // role: [
                //     { required: true, message: '请选择角色', trigger: 'blur'}
                // ],
                // company: [
                //     { required: true, message: '所属单位不能为空', trigger: 'blur'}
                // ],
                deptId: [
                    { required: true, message: '请选择部门', trigger: 'blur'}
                ]
            },
    		userCol: [
                    {
                        type: 'expand',
                        width: -1,
                        hidden: true,
                        key: "expand",
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '登录账号',
                        key: 'loginName',
                        align: 'center',
                        minWidth: 220,
                        maxWidth: 250
                    },
                    {
                        title: '用户名',
                        key: 'userName',
                        align: 'left',
                        minWidth: 150,
                        maxWidth: 220
                    },
                    {
                        title: '所属部门',
                        key: 'deptName',
                        align: 'left',
                        minWidth: 130,
                        maxWidth: 150
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'left',
                        minWidth: 150,
                        maxWidth: 180
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'left',
                        minWidth: 120,
                        maxWidth: 220
                    },
                    {
                        title: '修改时间',
                        key: 'updateTime',
                        align: 'left',
                        minWidth: 150,
                        maxWidth: 180
                    },
                    {
                        title: '修改人',
                        key: 'updateUser',
                        align: 'left',
                        minWidth: 120,
                        maxWidth: 220
                    },
                    {
                        title: '操作',
                        align: 'left',
                        key: 'action',
                        width: 250,
                        fixed: "right",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon:'md-eye',
                                    },
                                    class:'btn-blue',
                                    attrs: {
                                        title: '详情'
                                    },
                                    style: {
                                        display:
                                            Vue.authorize("AuthUserManageDetail")
                                            ? "inline-block"
                                            : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path: "/authority/user/detail",
                                                query: {
                                                    Id: params.row.userId,
                                                    data: params.row
                                                }
                                            });
                                        }
                                        
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-create'
                                    },
                                    class:'btn-green',
                                    attrs: {
                                        title: '编辑'
                                    },
                                    style: {
                                        display:
                                            Vue.authorize("AuthUserManageEdit")
                                            ? "inline-block"
                                            : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path: "/authority/user/add",
                                                query: {
                                                    Id: params.row.userId,
                                                    type: 1
                                                }
                                            });
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-lock',
                                    },
                                    class: 'btn-red',
                                    attrs: {
                                        title: '重置密码'
                                    },
                                    style: {
                                        display:
                                            Vue.authorize("AuthUserManageResetPasswd")
                                            ? "inline-block"
                                            : "none"
                                    },
                                    on: {
                                        click: () => {
                                           this.$Modal.confirm({
                                                title: '重置密码确认',
                                                content: '确定要重置“'+params.row.userName+'”的密码？'
                                                          + '<br/ >' + "密码将重置为123456",
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'user.resetPwd',
                                                    data:{
                                                        userId: params.row.userId,
                                                        updateUser: Vue.getUser().userName
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            self.$Message.info('重置密码成功');
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
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-people',
                                    },
                                    class: 'btn-green',
                                    attrs: {
                                        title: '分配部门'
                                    },
                                    style: {
                                        display:
                                            Vue.authorize("AuthUserManageAssignDept")
                                            ? "inline-block"
                                            : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path: "/authority/user/userDept",
                                                query: {
                                                    Id: params.row.userId
                                                }
                                            });
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-settings',
                                    },
                                    class: 'btn-deep-blue',
                                    attrs: {
                                        title: '分配系统和角色'
                                    },
                                    style: {
                                        display:
                                            Vue.authorize("AuthUserManageAssignSysAndRole")
                                            ? "inline-block"
                                            : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path: "/authority/user/userSystem",
                                                query: {
                                                    Id: params.row.userId
                                                }
                                            });
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon:'md-close',
                                    },
                                    class: 'btn-red',
                                    attrs: {
                                        title: '删除'
                                    },
                                    style: {
                                        display:
                                            Vue.authorize("AuthUserManageDel")
                                            ? "inline-block"
                                            : "none"
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除确认',
                                                content: '确定要删除“'+params.row.userName+'”？',
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'user.del',
                                                    data:{
                                                        userId: params.row.userId,
                                                        updateUser: Vue.getUser().userName
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            self.$Message.info('用户信息删除成功');
                                                            self.getUserList();
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
                                })
                            ]);
                        }
                    }
                ]
        }
    },
    activated: function() {
        this.getSystemList();
        this.getRoleList();
        this.getUserList();
        //获取用户类型
        this.getUserTypeList();
        this.tableH = document.getElementById("pageMain").offsetHeight - 67;
    },
    methods: {
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
                        // self.pageConfig.totalItemCount = data.data.totalItemCount;
                        //mock数据
                        // self.systemList = data.data[0].dataList;
                        // self.pageConfig.totalItemCount = data.data[0].totalItemCount;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getDeptList(value) { 
            var self = this;
            Vue.ajax.send({
                name: "dept.list",
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    systemId: value
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.deptList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                        title: "",
                        content: data.message
                    });
                }
            }
        });
    },
        getRoleList(systemId){
            var self = this;
            Vue.ajax.send({
                name: 'role.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    systemId: systemId || self.searchForm.systemId
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //接口数据
                        self.roleList = data.data.dataList;
                        
                        if (self.roles != null && self.roles.length > 0) {
                            
                            var tmpList = self.roles.split(',');
                            self.roleList.forEach(item=>{
                                tmpList.filter(m=>m==item.roleName).forEach(item => self.checkAllGroup.push(item));
                            })
                            
                            if (self.checkAllGroup.length == self.roleList.length) {
                                self.checkAll = true;
                            }else {
                                self.checkAll = false;
                            }
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
        getUserRole(userId) {
            var self = this;
            Vue.ajax.send({
                name: 'user.getUserRole',
                data: {
                    userId: userId
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //接口数据
                        self.updateRoleList = data.data.dataList;

                        
                        // self.pageConfig.totalItemCount = data.data.totalItemCount;
                        //mock数据
                        // self.roleList = data.data[0].dataList;
                        // self.pageConfig.totalItemCount = data.data[0].totalItemCount;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getUserList(pageIndex){
            var self = this;
            Vue.ajax.send({
                name: 'user.list',
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    systemId: self.searchForm.systemId,
                    roleId: self.searchForm.roleId,
                    keyWord: self.searchForm.keywords,
                    loginName: self.searchForm.loginName,
                    userType:self.searchForm.userType
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //接口数据
                        self.userList = data.data.dataList;
                        self.pageConfig.totalItemCount = data.data.totalItemCount;
                        //mock数据
                        // self.userList = data.data[0].dataList;
                        // self.pageConfig.totalItemCount = data.data[0].totalItemCount;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        changePage(currentPage){
            this.pageConfig.pageNum = currentPage;
            this.getUserList();
        },
        changeSize(num){
            this.pageConfig.pageSize = num;
            this.getUserList();
        },
        changeSystem(query) {
            if (query == '' || query == null) {
                this.searchForm.systemId = "";
            }
        },
        changeRole(query) {
            if (query == '' || query == null) {
                this.searchForm.roleId = "";
            }
        },
        add() {
            this.$router.push({
                path: "/authority/user/add",
                query: {
                    type: 2
                }                                
            });
        },
        distriDeptOk () {
            var self = this;
            Vue.ajax.send({
                name: 'user.updateDpet',
                data: {
                    userId: self.userInfo.userId,
                    deptId: self.userInfo.deptId,
                    updateUser: Vue.getUser().userName
                },
                success: function(data) {
                            if (!!data && data.code=='0') {
                                self.distriModel = false;
                                self.$Message.success('用户部门分配成功！');
                                //刷新列表
                                self.getUserList();
                                //清空数组
                                self.deptList = [];
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
            });
            
        },
        getUserTypeList() {
            var self = this;
            Vue.ajax.send({
                name: 'user.userTypeList',
                data: {
                    pageIndex: 1,
                    pageSize: 9999
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //接口数据
                        self.userTypeList = data.data;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
    }
};
</script>
<style scoped>
table {
    width: 100%;
    overflow-y: auto;
}
table td {
    max-width: 300px;
}
.page-footer .fl {
    position: absolute;
    left: 220px;
    top: 8px;
}
.page-footer button.fl {
    position: absolute;
    left: 280px;
    top: 3px;
}
.page-footer button.fr {
    position: absolute;
    right: 40px;
    top: 3px;
}
.page-footer .text-center {
    position: relative;
    display: block;
    width: 100%;
}
</style>