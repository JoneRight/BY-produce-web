<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">用户产品</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem :label-width="70" label="用户名称">
                    <Input v-model="searchForm.keywords" type="text" placeholder="请输入用户名称" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="getUserList(1)">检索</Button>
                </FormItem>
            </Form>
        </div>
        <!-- <div class="bg-white p20"> -->
        <!-- <Button type="primary"  @click="add">新增</Button> -->
        <!-- <Table border :columns="userCol" :data="userList" style="margin-top: 10px;"></Table>
                <EmptyRow v-if="userList.length==0"/> 
                <div class="mt15 text-center" v-if="userList.length>0">        	
        	        <Page :total="pageConfig.totalItemCount" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                </div>
            </div> -->

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable :columnConfig='userCol' :columnDatas='userList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in userCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'ProductManageUserProductAdd'" icon="ios-add" size="small" title="新增" type="primary" @click='inforEdit(index)'></Button>
                            <Button v-authorize="'ProductManageUserProductList'" icon="ios-git-network" size="small" title="产品列表" type="success" @click="inforDelete(index)"></Button>
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="showDatas.length>0">
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../common/EmptyRow";
import CustomTable from "../../common/GridTable";
export default {
    name: "user",
    components: { EmptyRow, CustomTable },
    data() {
        return {
            showModal: false,
            showDatas: [],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            },
            searchForm: {
                keywords: ""
            },
            userForm: {
                systemId: "",
                systemName: "",
                userId: "",
                loginName: "",
                userName: "",
                blocSystem: "",
                roleName: "",
                product: "",
                company: ""
            },
            roles: "",
            isShow: false,
            loadingAdd: true,
            loading: true,
            userList: [],
            systemList: [],
            roleList: [],
            roleIdList: [],
            updateRoleList: [],
            userInfo: {},
            editModel: false, //弹框状态(编辑)
            addModel: false, //弹框状态(新增)
            authRoleModel: false, //分配角色弹框
            indeterminate: false, //全选状态(默认是非全选)
            checkAll: false, //全选状态（默认是非全选）
            checkAllGroup: [], //选中的多选框
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            userCol: [
                {
                    text: "登录账号",
                    name: "loginName",
                    sortable: true,
                    moveable: true,
                    width: 500
                },
                {
                    text: "用户名",
                    name: "userName",
                    sortable: true,
                    moveable: true,
                    width: 500
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 150
                    // fixed: "right",
                    // render: (h, params) => {
                    //     return h('div', [
                    //         h('Button', {
                    //             props: {
                    //                 icon:'ios-add'
                    //             },
                    //             class:'btn-deep-blue',
                    //             attrs: {
                    //                 title: '新增'
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$router.push({
                    //                         path: "/authority/product/addUserProduct",
                    //                         query: {
                    //                             userId: params.row.userId,
                    //                             userName: params.row.userName,
                    //                         }
                    //                     });
                    //                 }
                    //             }
                    //         }),
                    //         h('Button', {
                    //             props: {
                    //                 icon:'ios-git-network'
                    //             },
                    //             class:'btn-green',
                    //             attrs: {
                    //                 title: '产品列表'
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$router.push({
                    //                         path: "/authority/product/productList",
                    //                         query: {
                    //                             //query传值不会因为刷新页面导致数据丢失
                    //                             // data: params.row,
                    //                             Id: params.row.userId
                    //                         }
                    //                     });
                    //                 }
                    //             }
                    //         }),
                    //         // h('Button', {
                    //         //     props: {
                    //         //         icon:'md-close',
                    //         //     },
                    //         //     class: 'btn-red',
                    //         //     attrs: {
                    //         //         title: '删除'
                    //         //     },
                    //         //     on: {
                    //         //         click: () => {
                    //         //             this.$Modal.confirm({
                    //         //                 title: '删除确认',
                    //         //                 content: '确定要删除“'+params.row.userName+'”？',
                    //         //                 onOk: () => {
                    //         //                     var self=this;
                    //         //                     Vue.ajax.send({
                    //         //                     name: 'user.del',
                    //         //                     data:{
                    //         //                         userId: params.row.userId,
                    //         //                         updateUser: Vue.getUser().userName
                    //         //                     },
                    //         //                     success: function(data) {
                    //         //                         if (!!data && data.code=='0') {
                    //         //                             self.$Message.info('用户信息删除成功');
                    //         //                             self.userList.splice(params.index,1);
                    //         //                         } else {
                    //         //                             self.$Modal.error({
                    //         //                                 title: '',
                    //         //                                 content: data.message
                    //         //                             });
                    //         //                         }
                    //         //                     }
                    //         //                 });

                    //         //                 }
                    //         //             });
                    //         //         }
                    //         //     }
                    //         // })
                    //     ]);
                    // }
                }
            ]
        };
    },
    mounted: function() {
        this.getUserList();
        this.capyCol = [].concat(this.userCol);
    },
    methods: {
        getUserList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "product.user.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    systemId: self.searchForm.systemId,
                    roleId: self.searchForm.roleId,
                    keyWord: self.searchForm.keywords,
                    systemId: 21 // 数据分析系统ID
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.userList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        //mock数据
                        // self.userList = data.data[0].dataList;
                        // self.pageConfig.totalItemCount = data.data[0].totalItemCount;
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        changePage(currentPage) {
            this.pageConfig.pageNum = currentPage;
            this.getUserList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getUserList();
        },
        add() {
            this.$router.push({
                path: "/authority/product/add",
                query: {
                    //query传值不会因为刷新页面导致数据丢失
                    type: 3
                }
            });
        },
        sortColumn: function(column, asc) {
            this.currentSort.column = column;
            this.currentSort.asc = asc;
        },
        showData: function(datas, showColumns) {
            this.showDatas = datas;
            var self = this;
            if (this.currentSort.column != "") {
                if (this.currentSort.column == "readCount") {
                    this.showDatas.sort(
                        (a, b) =>
                            this.currentSort.asc
                                ? a[this.currentSort.column] -
                                  b[this.currentSort.column]
                                : b[this.currentSort.column] -
                                  a[this.currentSort.column]
                    );
                } else {
                    this.showDatas.sort(
                        (a, b) =>
                            this.currentSort.asc
                                ? (
                                      a[this.currentSort.column] || ""
                                  ).localeCompare(b[this.currentSort.column])
                                : (
                                      b[this.currentSort.column] || ""
                                  ).localeCompare(a[this.currentSort.column])
                    );
                }
            }
            this.showColumns = showColumns;

            if (this.showColumns.length > 0) {
                this.userCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.userCol.push(m);
                        }
                    });
                });
                this.userCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            this.$router.push({
                path: "/authority/product/addUserProduct",
                query: {
                    userId: this.showDatas[index].userId,
                    userName: this.showDatas[index].userName
                }
            });
        },
        inforDelete(index) {
            this.$router.push({
                path: "/authority/product/productList",
                query: {
                    //query传值不会因为刷新页面导致数据丢失
                    // data: params.row,
                    Id: this.showDatas[index].userId
                }
            });
        }
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
