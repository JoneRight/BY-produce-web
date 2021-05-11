<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">业务权限</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="用户名" :label-width="60">
                    <Input v-model="searchForm.userName" placeholder="请输入用户名" type="text" style="width: 200px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'AuthBusinessManageList'" :columnConfig='userCol' :columnDatas='userList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in userCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'AuthBusinessManageEdit'" icon="md-create" size="small" title="分配省份" type="success" @click='inforEdit(index)'></Button>
                            <!-- <Button icon="md-close" size="small" title="删除" type="error" @click="inforDelete(index)"></Button> -->
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
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
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
    name: "busmanager",
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
            tableH: 0,
            searchForm: {
                userName: ""
            },
            roles: "",
            userList: [],
            roleList: [],
            roleIdList: [],
            userInfo: {},
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
                    width: 150
                },
                {
                    text: "用户名",
                    name: "userName",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "所属部门",
                    name: "deptName",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "所属系统",
                    name: "systems",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "负责省份",
                    name: "address",
                    sortable: true,
                    moveable: true,
                    width: 400
                },
                {
                    text: "操作",
                    name: "op",
                    width: 100,
                    filterable: false,
                    removeable: false
                    // render: (h, params) => {
                    //     return h("div", [
                    //         h("Button", {
                    //             props: {
                    //                 icon: "md-create"
                    //             },
                    //             class: "btn-green",
                    //             attrs: {
                    //                 title: "分配省份"
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$router.push({
                    //                         path: "/authority/busmanager/edit",
                    //                         query: {
                    //                             Id: params.row.userId
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
    mounted: function() {
        // this.tableH = document.getElementById("pageMain").offsetHeight - 160;
        this.getUserList();
        this.capyCol = [].concat(this.userCol);
    },
    methods: {
        getUserList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "busmanager.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    userName: self.searchForm.userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.userList = data.data.dataList;
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
            this.getUserList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getUserList();
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
                path: "/authority/busmanager/edit",
                query: {
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
