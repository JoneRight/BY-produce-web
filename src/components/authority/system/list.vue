<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">系统管理</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="系统名称" :label-width="70">
                    <Input v-model="searchForm.keywords" type="text" placeholder="请输入系统名称" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'AuthSystemManageAdd'" type="primary"  @click="addSystem" style="float:right">新增</Button>
                </FormItem>
                
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'AuthSystemManageList'" :columnConfig='systemCol' :columnDatas='systemList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in systemCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'AuthSystemManageEdit'" icon="md-create" size="small" title="编辑" type="success" @click='inforEdit(index)'></Button>
                            <Button v-authorize="'AuthSystemManageDel'" icon="md-close" size="small" title="删除" type="error" @click="inforDelete(index)"></Button>
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

        <!-- 新增弹框 -->
        <Modal v-model="addModel" title="新增" class-name="vertical-center-modal" @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">

            <Form :model="systemForm" ref="systemFormAdd" :rules="ruleValidate" :label-width="90">
                <FormItem label="系统编号" prop="systemId">
                    <Input v-model.trim="systemForm.systemId" />
                </FormItem>
                <FormItem label="系统名称" prop="systemName">
                    <Input v-model.trim="systemForm.systemName" :maxlength="30" />
                </FormItem>
            </Form>
        </Modal>

        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="systemOk" :loading="loading" :mask-closable="false">
            <Form ref="systemForm" :model="systemInfo" :rules="ruleValidate" :label-width="90">
                <input type="hidden" v-model="systemInfo.systemId" />
                <FormItem label="系统名称" prop="systemName">
                    <Input v-model.trim="systemInfo.systemName" :maxlength="30" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../common/EmptyRow";
import CustomTable from "../../common/GridTable";
export default {
    name: "system",
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
                keywords: ""
            },
            systemForm: {
                systemId: "",
                systemName: "",
                systemModule: "",
                createUser: "",
                updateUser: "",
                subMenu: "",
                module: ""
            },
            loadingAdd: true,
            loading: true,
            systemList: [],
            systemInfo: {},
            editModel: false, //弹框状态(编辑)
            addModel: false, //弹框状态(新增)
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            ruleValidate: {
                systemId: [
                    {
                        required: true,
                        message: "系统编号不能为空",
                        trigger: "blur"
                    }
                ],
                systemName: [
                    {
                        required: true,
                        message: "系统名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            systemCol: [
                {
                    text: "系统编号",
                    name: "systemId",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "系统名称",
                    name: "systemName",
                    sortable: true,
                    moveable: true,
                    width: 500
                },
                {
                    text: "操作",
                    name: "op",
                    width: 110,
                    filterable: false,
                    removeable: false
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
                    //                     this.$refs['systemForm'].resetFields();
                    //                     this.editModel = true;
                    //                     this.systemInfo = Object.assign({},params.row);
                    //                 }
                    //             }
                    //         }),
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
                    //                     if (params.row.isHaveUser == 1) {
                    //                         //说明系统下有关联用户
                    //                         this.$Modal.confirm({
                    //                         title: '提示',
                    //                         content: '该系统下存在关联用户，不可以进行删除！',
                    //                         });
                    //                     }else {
                    //                         //否则说明没有，可以进行删除
                    //                         this.$Modal.confirm({
                    //                         title: '删除确认',
                    //                         content: '确定要删除“'+params.row.systemName+'”？',
                    //                         onOk: () => {
                    //                             var self=this;
                    //                             Vue.ajax.send({
                    //                             name: 'system.del',
                    //                             data:{
                    //                                 systemId: params.row.systemId,
                    //                                 updateUser: Vue.getUser().userName
                    //                             },
                    //                             success: function(data) {
                    //                                 if (!!data && data.code=='0') {
                    //                                     self.$Message.info('系统信息删除成功');
                    //                                     self.systemList.splice(params.index,1);
                    //                                 } else {
                    //                                     self.$Modal.error({
                    //                                         title: '',
                    //                                         content: data.message
                    //                                     });
                    //                                 }
                    //                             }
                    //                         });

                    //                             }
                    //                         });
                    //                     }

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
        this.getSystemList();
        this.capyCol = [].concat(this.systemCol);
        // this.tableH = document.getElementById("pageMain").offsetHeight - 190;
    },
    methods: {
        getSystemList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "system.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    keyWord: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.systemList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        //mock数据
                        // self.systemList = data.data[0].dataList;
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
            this.getSystemList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getSystemList();
        },
        addSystem() {
            this.$refs["systemFormAdd"].resetFields();
            this.addModel = true;
        },
        addOk() {
            this.$refs["systemFormAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "system.add",
                        data: {
                            systemId: self.systemForm.systemId,
                            systemName: self.systemForm.systemName,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.addModel = false;
                                self.$refs["systemFormAdd"].resetFields();
                                self.$Message.success("新增系统提交成功！");
                                self.changePage(1);
                            } else {
                                setTimeout(() => {
                                    self.loadingAdd = false;
                                    self.$nextTick(() => {
                                        self.loadingAdd = true;
                                    });
                                }, 0);
                                self.$Modal.error({
                                    title: "",
                                    content: data.message
                                });
                            }
                        }
                    });
                } else {
                    setTimeout(() => {
                        this.loadingAdd = false;
                        this.$nextTick(() => {
                            this.loadingAdd = true;
                        });
                    }, 0);
                }
            });
        },
        systemOk() {
            this.$refs["systemForm"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "system.edit",
                        data: {
                            systemId: self.systemInfo.systemId,
                            systemName: self.systemInfo.systemName,
                            updateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == "0") {
                                self.editModel = false;
                                self.$Message.success("编辑系统提交成功！");
                                self.getSystemList();
                            } else {
                                setTimeout(() => {
                                    self.loading = false;
                                    self.$nextTick(() => {
                                        self.loading = true;
                                    });
                                }, 0);
                                self.$Modal.error({
                                    title: "",
                                    content: data.message
                                });
                            }
                        }
                    });
                } else {
                    setTimeout(() => {
                        this.loading = false;
                        this.$nextTick(() => {
                            this.loading = true;
                        });
                    }, 0);
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
                this.systemCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.systemCol.push(m);
                        }
                    });
                });
                this.systemCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            this.$refs["systemForm"].resetFields();
            this.editModel = true;
            this.systemInfo = Object.assign({}, this.showDatas[index]);
        },
        inforDelete(index) {
            if (this.showDatas[index].isHaveUser == 1) {
                //说明系统下有关联用户
                this.$Modal.confirm({
                    title: "提示",
                    content: "该系统下存在关联用户，不可以进行删除！"
                });
            } else {
                //否则说明没有，可以进行删除
                this.$Modal.confirm({
                    title: "删除确认",
                    content: "确定要删除“" + this.showDatas[index].systemName + "”？",
                    onOk: () => {
                        var self = this;
                        Vue.ajax.send({
                            name: "system.del",
                            data: {
                                systemId: this.showDatas[index].systemId,
                                updateUser: Vue.getUser().userName
                            },
                            success: function(data) {
                                if (!!data && data.code == "0") {
                                    self.$Message.info("系统信息删除成功");
                                    self.getSystemList();
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
