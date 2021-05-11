<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">产品续费</h2>
        <div class="search-con">

            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="用户产品名称" :label-width="100">
                    <Input v-model="searchForm.keywords" type="text" placeholder="请输入用户产品名称" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
            </Form>
        </div>
        <!-- <div class="bg-white p20">
        	    <Table border :columns="renewCol" :data="renewList" style="margin-top: 10px;"></Table>
                <EmptyRow v-if="renewList.length==0"/> 
                <div class="mt15 text-center" v-if="renewList.length>0">        	
        	        <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                </div>
            </div> -->

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable :columnConfig='renewCol' :columnDatas='renewList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in renewCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'ProductManageProductRenewCall'" icon="ios-call" size="small" title="回访" type="primary" @click='inforEdit(index)'></Button>
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

        <Modal v-model="model1" title="回访" width=420 @on-ok="BackRenew">
            回访记录：</br>
            <Input v-model="backInfor" type="textarea" :rows="4"></Input>
        </Modal>
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../common/EmptyRow";
import CustomTable from "../../common/GridTable";
export default {
    name: "renewList",
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
            renewList: [],
            model1:false,
            backInfor:"",
            inforIndex:"",
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            renewCol: [
                {
                    text: "续费编号",
                    name: "renewId",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "用户名",
                    name: "userName",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "用户产品名称",
                    name: "userProductName",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "联系方式",
                    name: "mobile",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "续费内容",
                    name: "renewContent",
                    sortable: true,
                    moveable: true,
                    width: 250
                },
                {
                    text: "创建时间",
                    name: "createTime",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "回访人",
                    name: "backUser",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "回访时间",
                    name: "backTime",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "回访记录",
                    name: "backMeno",
                    sortable: true,
                    moveable: true,
                    width: 160
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
                    //                 icon:'ios-call'
                    //             },
                    //             class:'btn-blue',
                    //             attrs: {
                    //                 title: '回访'
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$Modal.confirm({
                    //                         title: '回访确认',
                    //                         content: '确认回访此条续费记录吗？',
                    //                         onOk: () => {
                    //                             this.callRenew(
                    //                                 params.row.renewId
                    //                             );
                    //                         }
                    //                     });
                    //                 }

                    //             }
                    //         }),
                    //     ])
                    // }
                }
            ]
        };
    },
    mounted: function() {
        this.getRenewList();
        this.capyCol = [].concat(this.renewCol);
    },
    methods: {
        getRenewList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "product.renew.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    keyWord: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.renewList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
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
            this.getRenewList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getRenewList();
        },

        // 回访 续费记录
        callRenew(id) {
            var self = this;
            Vue.ajax.send({
                name: "product.renew.call",
                data: {
                    renewId: id,
                    backMeno:this.backInfor,
                    userName:Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("操作成功");
                        self.backInfor="";
                        self.getRenewList();
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
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
                this.renewCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.renewCol.push(m);
                        }
                    });
                });
                this.renewCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            // this.$Modal.confirm({
            //     title: "回访确认",
            //     content: "确认回访此条续费记录吗？",
            //     onOk: () => {
            //         this.callRenew(this.showDatas[index].renewId);
            //     }
            // });
            this.model1=true;
            this.inforIndex=index;
        },
        BackRenew(){
            this.callRenew(this.showDatas[this.inforIndex].renewId);
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
