<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">数据包管理</h2>
        <div class="search-con">

            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="数据类型" :label-width="80">
                    <Select v-model="searchForm.dataType" filterable clearable style="width: 180px;">
                        <Option value="10">购药数据</Option>
                        <Option value="20">门急诊数据</Option>
                        <Option value="30">病案数据</Option>
                        <Option value="40">医嘱数据</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品名称" :label-width="80">
                    <Input v-model="searchForm.keywords" type="text" placeholder="请输入产品名称" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <Button v-authorize="'ProductManageProductManageAdd'" type="primary" @click="add" style="float:right">新增</Button>
            </Form>
        </div>
        <!-- <div class="bg-white p20"> -->
        <!-- <router-link class="ivu-btn ivu-btn-primary" to="add">新增</router-link>  -->
        <!-- <Table border :columns="productCol" :data="productList" style="margin-top: 10px;"></Table>
                <EmptyRow v-if="productList.length==0"/> 
                <div class="mt15 text-center" v-if="productList.length>0">        	
        	        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                </div>
            </div> -->

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable :columnConfig='productCol' :columnDatas='productList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in productCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'ProductManageProductManageEdit'" icon="md-create" size="small" title="编辑" type="primary" @click='inforEdit(index)'></Button>
                            <Button v-authorize="'ProductManageProductManageStop'" v-if="item['produdctStatus']==0" icon="md-play" size="small" title="启用" type="primary" @click='inforDelete(index)'></Button>
                            <Button v-authorize="'ProductManageProductManageStart'" v-if="item['produdctStatus']!=0" icon="md-remove" size="small" title="停用" type="error" @click="inforDelete(index)"></Button>
                        </span>
                        <span v-else>
                            {{productCol.find(m=>m.name==colData.name).render?productCol.find(m=>m.name==colData.name).render(item):item[colData.name]}}
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
    name: "product",
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
            productForm: {
                systemId: "",
                systemName: "",
                productId: "",
                productNo: "",
                productName: "",
                productDesc: "",
                productOrder: "",
                productSystemId: ""
            },
            isShow: false,
            loadingAdd: true,
            loading: true,
            systemList: [],
            productList: [],
            productInfo: {},
            editModel: false, //弹框状态(编辑)
            addModel: false, //弹框状态(新增)
            model1: false, //弹框显示状态(删除)
            commonId: "", //存放id
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            ruleValidate: {
                productOrder: [
                    { required: true, message: "序号不能为空", trigger: "blur" }
                ],
                productNo: [
                    {
                        required: true,
                        message: "产品编号不能为空",
                        trigger: "blur"
                    }
                ],
                productName: [
                    {
                        required: true,
                        message: "产品名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            productCol: [
                {
                    text: "数据包编号",
                    name: "productId",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "数据包名称",
                    name: "productName",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "数据包描述",
                    name: "productDesc",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "数据包类型",
                    name: "productType",
                    sortable: true,
                    moveable: true,
                    width: 150,
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
                    text: "数据开始日期",
                    name: "productBeginDate",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "数据结束日期",
                    name: "productEndDate",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "数据包状态",
                    name: "produdctStatusStr",
                    sortable: true,
                    moveable: true,
                    width: 150
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
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 130
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
                    //                         path: "/authority/product/edit",
                    //                         query: {
                    //                             Id: params.row.productId
                    //                         }
                    //                     });
                    //                 }

                    //             }
                    //         }),
                    //         h('Button', {
                    //             props: {
                    //                 icon: params.row.produdctStatus == 0
                    //                                 ? 'md-play'
                    //                                 : 'md-remove',
                    //             },
                    //             class: params.row.produdctStatus == 0
                    //                                 ? 'btn-deep-blue'
                    //                                 : 'btn-red',
                    //             attrs: {
                    //                 title: params.row.produdctStatus == 0
                    //                                 ? '启用'
                    //                                 : '停用',
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                      this.$Modal.confirm({
                    //                         title: params.row.produdctStatus == 0
                    //                                 ? '启用确认'
                    //                                 : '停用确认',
                    //                         content: params.row.produdctStatus == 0
                    //                                 ? '确定要启用“'+params.row.productName+'”？'
                    //                                 : '确定要停用“'+params.row.productName+'”？',
                    //                         onOk: () => {
                    //                             var self=this;
                    //                             Vue.ajax.send({
                    //                             name: 'product.editProStatus',
                    //                             data:{
                    //                                 productId: params.row.productId,
                    //                                 produdctStatus: params.row.produdctStatus == 0
                    //                                          ? '1'
                    //                                          : '0',
                    //                                 updateUser: Vue.getUser().userName
                    //                             },
                    //                             success: function(data) {
                    //                                 if (!!data && data.code=='0') {
                    //                                     //刷新列表
                    //                                     self.getProductList();

                    //                                     params.row.statusId == 0
                    //                                         ? self.$Message.info('产品信息启用成功')
                    //                                         : self.$Message.info('产品信息停用成功');
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
                    //         //                 content: '确定要删除“'+params.row.productName+'”？',
                    //         //                 onOk: () => {
                    //         //                     var self=this;
                    //         //                     Vue.ajax.send({
                    //         //                     name: 'product.del',
                    //         //                     data:{
                    //         //                         productId: params.row.productId,
                    //         //                         updateUser: Vue.getUser().userName
                    //         //                     },
                    //         //                     success: function(data) {
                    //         //                         if (!!data && data.code=='0') {
                    //         //                             self.$Message.info('产品信息删除成功');
                    //         //                             self.productList.splice(params.index,1);
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
    activated: function() {
        this.getProductList();
        this.capyCol = [].concat(this.productCol);
    },
    methods: {
        getProductList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "product.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    productType: self.searchForm.dataType,
                    keyWord: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.productList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        //mock数据
                        // self.productList = data.data[0].dataList;
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
            this.getProductList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getProductList();
        },
        add() {
            this.$router.push({
                path: "/authority/product/addProduct"
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
                path: "/authority/product/edit",
                query: {
                    Id: this.showDatas[index].productId
                }
            });
        },
        inforDelete(index) {
            this.$Modal.confirm({
                title:
                    this.showDatas[index].produdctStatus == 0
                        ? "启用确认"
                        : "停用确认",
                content:
                    this.showDatas[index].produdctStatus == 0
                        ? "确定要启用“" +
                          this.showDatas[index].productName +
                          "”？"
                        : "确定要停用“" +
                          this.showDatas[index].productName +
                          "”？",
                onOk: () => {
                    var self = this;
                    Vue.ajax.send({
                        name: "product.editProStatus",
                        data: {
                            productId: this.showDatas[index].productId,
                            produdctStatus:
                                this.showDatas[index].produdctStatus == 0
                                    ? "1"
                                    : "0",
                            updateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                //刷新列表
                                self.getProductList();

                                this.showDatas[index].statusId == 0
                                    ? self.$Message.info("产品信息启用成功")
                                    : self.$Message.info("产品信息停用成功");
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
