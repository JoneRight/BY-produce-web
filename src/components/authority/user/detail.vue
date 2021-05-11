<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title">用户详情</h2>
        <div class="mt20">
            <Form :label-width="80" :model="userDetail" ref="userDetailForm">
                <FormItem label="登录账号" >
                    <Label >{{userDetail.loginName}}</Label>
                </FormItem>
                <FormItem label="用户名" >
                    <Label >{{userDetail.userName}}</Label>
                </FormItem>
                
                 <FormItem label="性别" >
                    <Label  v-if="userDetail.gender == 0">{{ "男" }}</Label>
                    <Label  v-if="userDetail.gender == 1">{{ "女" }}</Label>
                </FormItem>
                <FormItem label="职位">
                    <Label >{{ userDetail.position }}</Label>
                </FormItem>
                <FormItem label="住址">
                    <Label >{{ userDetail.address }}</Label>
                </FormItem>
                <FormItem label="邮箱">
                    <Label >{{ userDetail.email }}</Label>
                </FormItem>
                <FormItem label="专业">
                    <Label >{{ userDetail.specialty }}</Label>
                </FormItem>
                <FormItem label="职称">
                    <Label >{{ userDetail.title }}</Label>
                </FormItem>
                <FormItem label="手机">
                    <Label >{{ userDetail.mobile }}</Label>
                </FormItem>
                <FormItem label="传真">
                    <Label >{{ userDetail.fax }}</Label>
                </FormItem>
                <FormItem label="办公电话">
                    <Label >{{ userDetail.officPhone }}</Label>
                </FormItem>
                <FormItem label="所属部门">
                    <Label >{{ userDetail.deptName }}</Label>
                </FormItem>
                <FormItem label="所属系统" >
                    <Label >{{userDetail.systems}}</Label>
                </FormItem>
                <FormItem label="拥有角色" >
                    <Label >{{userDetail.roles}}</Label>
                </FormItem>
                <FormItem>
                    <Button type="primary" to="/authority/user/list">返回列表</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'userDetail',
        data () {
            return {
                userDetail: {
                    systems: '',
                    products: '',
                    deptName: '',
                    role: ''
                },
                productForm: {
                    systemId: '',
                    systemName: '',
                    productId: '',
                    productNo: '',
                    productName: '',
                    productParentId: '',
                    productOrder: '',
                    productSystemId: '',
                },
                pageConfig: {
                    pageNum: 1,
                    pageSize: 10,
                    totalItemCount: 1
                },
                productList: [],
                productCol: [
                    {
                        title: '产品编号',
                        key: 'productId',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '产品名称',
                        key: 'productName',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '产品描述',
                        key: 'productDesc',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '数据类型',
                        key: 'productType',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '数据跨度',
                        key: 'dataSpan',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '创建人',
                        key: 'createUser',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '修改时间',
                        key: 'updateTime',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '修改人',
                        key: 'updateUser',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#00a0e9"
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path: "/authority/product/add",
                                                query: {
                                                    //编辑用户产品信息
                                                    type: "4",
                                                    Id: params.row.userId
                                                }
                                            });
                                        }
                                        
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "red"
                                    },
                                    on: {
                                        click: () => {
                                            
                                        }
                                    }
                                }, '提醒购买'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "red"
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '删除确认',
                                                content: '确定要删除“'+params.row.productName+'”？',
                                                onOk: () => {
                                                    var self=this;
                                                    Vue.ajax.send({
                                                    name: 'user.deleteUserProduct',
                                                    data:{
                                                        userId: params.row.userId,
                                                        userProductId: params.row.userProductId,
                                                        createUser: Vue.getUser().userName
                                                    },
                                                    success: function(data) {
                                                        if (!!data && data.code=='0') {
                                                            self.$Message.info('用户产品信息删除成功');
                                                            self.productList.splice(params.index,1);
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
                                }, '删除')
                            ]);
                        }
                    }
                ]
            }
        },
        mounted () {
            //获取本条数据
            this.userId = this.$route.query.Id;
            this.getUserInfo();
            // this.getproductList();
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
                            self.userDetail = data.data;
                            self.productList = data.data.productList;
                            console.log('12323',self.productList);
                        } else {
                            this.$Modal.error({
                            title: "",
                            content: data.message
                    });
                    }
                }
                });
            },
            // getProductList(){
            //     var self = this;
            //     Vue.ajax.send({
            //         name: 'user.userProductList',
            //         data: {
            //             pageIndex: self.pageConfig.pageNum,
            //             pageSize: self.pageConfig.pageSize,
            //             userId: self.userId
            //         },
            //         success: function(data) {
            //             if (!!data && data.code == '0') {
            //                 //接口数据
            //                 self.productList = data.data.dataList;
            //                 self.pageConfig.totalItemCount = data.data.totalItemCount; 
            //             } else {
            //                 this.$Modal.error({
            //                     title: '',
            //                     content: data.message
            //                 });
            //             }
            //         }
            //     });
            // },
            // changePage(currentPage){
            //     this.pageConfig.pageNum = currentPage;
            //     this.getproductList();
            // },
            // changeSize(num){
            //     this.pageConfig.pageSize = num;
            //     this.getproductList();
            // },
            add () {
                this.$router.push({
                path: "/authority/product/add",
                query: {
                    //给用户分配产品
                    type: "3"
                }                                
                });
            }
        }
    }
</script>