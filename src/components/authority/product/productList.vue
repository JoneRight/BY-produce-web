<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">{{userDetail.userName}} 产品列表</h2>
        <div class="search-con">

            <Button  v-authorize="'ProductManageUserProductAdd'" type="primary" @click="add">新增</Button>
            <Button type="info" to="/authority/product/userProlist">返回列表</Button>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <!-- <Table border :columns="productCol" :data="productList" style="margin-top: 10px;"></Table> -->
            <CustomTable :columnConfig='productCol' :columnDatas='productList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in productCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button  v-authorize="'ProductManageUserProductEdit'" icon="md-create" size="small" title="编辑" type="primary" @click='inforEdit(index)'></Button>
                            <Button  v-authorize="'ProductManageUserProductDelete'" icon="md-close" size="small" title="删除" type="error" @click="inforDelete(index)"></Button>
                        </span>
                        <span v-else>
                            {{productCol.find(m=>m.name==colData.name).render?productCol.find(m=>m.name==colData.name).render(item):item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="productList.length==0" />
            <!-- <div class="mt15 text-center mb25">        	
        	    <Page :total="pageConfig.totalItemCount" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
            </div> -->
        </div>

    </div>
</template>
<script>
import Vue from "vue";
import EmptyRow from "../../common/EmptyRow";
import CustomTable from "../../common/GridTable";
export default {
    name: "userDetail",
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
            userId: "",
            userDetail: {},
            // pageConfig: {
            //     pageNum: 1,
            //     pageSize: 10,
            //     totalItemCount: 1
            // },
            productList: [],
            productCol: [
                {
                    text: "用户产品编号",
                    name: "userProductId",
                    sortable: true,
                    moveable: true,
                    width: 140
                },
                {
                    text: "用户产品名称",
                    name: "userProductName",
                    sortable: true,
                    moveable: true,
                    width: 140
                },
                {
                    text: "产品名称",
                    name: "productName",
                    sortable: true,
                    moveable: true,
                    width: 140
                },
                {
                    text: "产品描述",
                    name: "productDesc",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "数据类型",
                    name: "productType",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: params => {
                        if (params.productType == 10) {
                            return "购药数据";
                        } else if (params.productType == 20) {
                            return "门急诊数据";
                        } else if (params.productType == 30) {
                            return "病案数据";
                        } else if (params.productType == 40) {
                            return "医嘱数据";
                        }
                    }
                },
                {
                    text: "有效期",
                    name: "dataSpan",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "创建时间",
                    name: "createTime",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "创建人",
                    name: "createUser",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "修改时间",
                    name: "updateTime",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "修改人",
                    name: "updateUser",
                    sortable: true,
                    moveable: true,
                    width: 100
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
                    //                 icon:'md-create'
                    //             },
                    //             class:'btn-green',
                    //             attrs: {
                    //                 title: '编辑'
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$router.push({
                    //                         path: "/authority/product/editUserProduct",
                    //                         query: {
                    //                             userProductId: params.row.userProductId,
                    //                             productId: params.row.productId,
                    //                             userName: this.userDetail.userName,
                    //                         }
                    //                     });
                    //                 }

                    //             }
                    //         }),
                    //         // h('Button', {
                    //         //     props: {
                    //         //         icon:'md-card',
                    //         //     },
                    //         //     class: 'btn-red',
                    //         //     attrs: {
                    //         //         title: '提醒购买'
                    //         //     },
                    //         //     on: {
                    //         //         click: () => {
                    //         //             this.$Modal.confirm({
                    //         //                 title: '提醒购买确认',
                    //         //                 content: '确定要提醒用户购买吗？',
                    //         //                 onOk: () => {
                    //         //                     // var self=this;
                    //         //                     // Vue.ajax.send({
                    //         //                     // name: '',
                    //         //                     // data:{
                    //         //                     // },
                    //         //                     // success: function(data) {

                    //         //                     //     if (!!data && data.code=='0') {
                    //         //                     //         self.$Message.info('提醒成功成功');
                    //         //                     //     } else {
                    //         //                     //         self.$Modal.error({
                    //         //                     //                 title: '',
                    //         //                     //                 content: data.message
                    //         //                     //             });
                    //         //                     //         }
                    //         //                     //     }
                    //         //                     // });
                    //         //                     this.$Message.info('提醒购买成功');
                    //         //                 }
                    //         //             });
                    //         //         }
                    //         //     }
                    //         // }),
                    //         h('Button', {
                    //             props: {
                    //                 icon:'md-close',
                    //             },
                    //             class: 'btn-red',
                    //             attrs: {
                    //                 title: '删除'
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$Modal.confirm({
                    //                         title: '删除确认',
                    //                         content: '确定要删除“'+params.row.productName+'”？',
                    //                         onOk: () => {
                    //                             var self=this;
                    //                             Vue.ajax.send({
                    //                             name: 'user.deleteUserProduct',
                    //                             data:{
                    //                                 userId: params.row.userId,
                    //                                 userProductId: params.row.userProductId,
                    //                                 createUser: Vue.getUser().userName
                    //                             },
                    //                             success: function(data) {
                    //                                 if (!!data && data.code=='0') {
                    //                                     self.$Message.info('用户产品信息删除成功');
                    //                                     self.productList.splice(params.index,1);
                    //                                 } else {
                    //                                     self.$Modal.error({
                    //                                         title: '',
                    //                                         content: data.message
                    //                                     });
                    //                                 }
                    //                             }
                    //                         });

                    //                         }
                    //                     });
                    //                 }
                    //             }
                    //         })
                    //     ]);
                    // }
                }
            ]
        };
    },
    mounted() {
        this.userId = this.$route.query.Id;
        this.getUserInfo();
        this.capyCol = [].concat(this.productCol);
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
                        self.productList =
                            data.data.productList == null
                                ? []
                                : data.data.productList;
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        // 给用户分配产品
        add() {
            this.$router.push({
                path: "/authority/product/addUserProduct",
                query: {
                    userId: this.userDetail.userId,
                    userName: this.userDetail.userName
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
                this.productCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.productCol.push(m);
                        }
                    });
                });
                this.productCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            this.$router.push({
                path: "/authority/product/editUserProduct",
                query: {
                    userProductId: this.showDatas[index].userProductId,
                    productId: this.showDatas[index].productId,
                    userName: this.userDetail.userName
                }
            });
        },
        inforDelete(index) {
            this.$Modal.confirm({
                title: "删除确认",
                content: "确定要删除“" + this.showDatas[index].userProductName + "”？",
                onOk: () => {
                    var self = this;
                    Vue.ajax.send({
                        name: "user.deleteUserProduct",
                        data: {
                            userId: this.showDatas[index].userId,
                            userProductId: this.showDatas[index].userProductId,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.info("用户产品信息删除成功");
                                self.showDatas.splice(index, 1);
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
