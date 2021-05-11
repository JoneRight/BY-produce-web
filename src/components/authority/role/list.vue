<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">角色管理</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="系统" :label-width="40">
                    <Select v-model="searchForm.systemId" filterable clearable remote :remote-method="changeInput" style="width: 160px;">
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="80" label="角色名称">
                    <Input v-model="searchForm.keywords" type="text" placeholder="请输入角色名称" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'AuthRoleManageAdd'" type="primary" @click="addRole">新增</Button>
                </FormItem>
                
            </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'AuthRoleManageList'"  :columnConfig='roleCol' :columnDatas='roleList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in roleCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'AuthRoleManageDetail'" icon="md-eye" size="small" title="详情" type="primary" @click='inforDetails(index)'></Button>
                            <Button v-authorize="'AuthRoleManageEdit'" icon="md-create" size="small" title="编辑" type="success" @click='inforEdit(index)'></Button>
                            <Button v-authorize="'AuthRoleManageDel'" icon="md-settings" size="small" title="分配权限" type="primary" @click='inforAuth(index)'></Button>
                            <Button v-authorize="'AuthRoleManageAssignAtuh'" icon="md-close" size="small" title="删除" type="error" @click="inforDelete(index)"></Button>
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="roleList.length>0">
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

            <Form :model="roleForm" ref="roleFormAdd" :rules="ruleValidate" :label-width="90">
                <FormItem label="所属系统" prop="roleSystemId">
                    <Select v-model="roleForm.roleSystemId">
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色名称" prop="roleName">
                    <Input v-model.trim="roleForm.roleName" :maxlength="30" />
                </FormItem>
                <FormItem label="角色简介" prop="roleRemark">
                    <Input v-model.trim="roleForm.roleRemark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                </FormItem>
            </Form>
        </Modal>

        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="roleOk" :loading="loading" :mask-closable="false">
            <Form ref="roleFormEdit" :model="roleInfo" :rules="ruleValidate" :label-width="90">
                <input type="hidden" v-model="roleInfo.roleId" />

                <FormItem label="所属系统" prop="roleSystemId" type="number">
                    <Select :disabled="true" v-model="roleInfo.roleSystemId">
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色名称" prop="roleName">
                    <Input v-model.trim="roleInfo.roleName" :maxlength="30" />
                </FormItem>
                <FormItem label="角色简介" prop="roleRemark">
                    <Input v-model.trim="roleInfo.roleRemark" :maxlength="150" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../common/EmptyRow";
import CustomTable from "../../common/GridTable";
import config from "../../../config";
export default {
    name: "role",
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
                roleName: "",
                systemId: "",
                keywords: ""
            },
            roleForm: {
                systemName: "",
                roleId: "",
                roleName: "",
                blocSystem: "",
                roleRemark: "",
                roleSystemId: "",
                roleCreateUser: "",
                roleUpdateUser: ""
            },
            loadingAdd: true,
            loading: true,
            roleList: [],
            systemList: [],
            roleInfo: {},
            editModel: false, //弹框状态(编辑)
            addModel: false, //弹框状态(新增)
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            ruleValidate: {
                roleName: [
                    {
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur"
                    }
                ],
                roleSystemId: [
                    {
                        required: true,
                        message: "请选择所属系统",
                        trigger: "blur",
                        type: "number"
                    }
                ]
            },
            roleCol: [
                {
                    text: "角色名称",
                    name: "roleName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "所属系统",
                    name: "roleSystemName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "角色简介",
                    name: "roleRemark",
                    sortable: true,
                    moveable: true,
                    width: 400
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 180
                    // fixed: "right",
                    // render: (h, params) => {
                    //     return h('div', [
                    //         h('Button', {
                    //             props: {
                    //                 icon:'md-eye',
                    //             },
                    //             class:'btn-blue',
                    //             attrs: {
                    //                 title: '详情'
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$router.push({
                    //                         path: "/authority/role/detail",
                    //                         query: {
                    //                             //query传值不会因为刷新页面导致数据丢失
                    //                             // data: params.row
                    //                             Id: params.row.roleId,
                    //                             sysId: params.row.roleSystemId
                    //                         }
                    //                     });
                    //                 }

                    //             }
                    //         }),
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
                    //                     this.$refs['roleFormEdit'].resetFields();
                    //                     this.editModel = true;
                    //                     this.roleInfo = Object.assign({},params.row);
                    //                 }
                    //             }
                    //         }),
                    //         h('Button', {
                    //             props: {
                    //                 icon:'md-settings',
                    //             },
                    //             class: 'btn-green',
                    //             attrs: {
                    //                 title: '分配权限'
                    //             },
                    //             on: {
                    //                 click: () => {
                    //                     this.$router.push({
                    //                         path: "/authority/role/roleAuth",
                    //                         query: {
                    //                             //query传值不会因为刷新页面导致数据丢失
                    //                             Id: params.row.roleId,
                    //                             sysId: params.row.roleSystemId
                    //                         }
                    //                     });
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
                    //                     this.$Modal.confirm({
                    //                         title: '删除确认',
                    //                         content: '确定要删除“'+params.row.roleName+'”？',
                    //                         onOk: () => {
                    //                             var self=this;
                    //                             Vue.ajax.send({
                    //                             name: 'role.del',
                    //                             data:{
                    //                                 roleId: params.row.roleId,
                    //                                 updateUser: Vue.getUser().userName
                    //                             },
                    //                             success: function(data) {
                    //                                 if (!!data && data.code=='0') {
                    //                                     self.$Message.info('角色信息删除成功');
                    //                                     self.roleList.splice(params.index,1);
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
    mounted: function() {
        this.getRoleList();
        this.getSystemList();
        this.capyCol = [].concat(this.roleCol);
        // this.tableH = document.getElementById("pageMain").offsetHeight - 190;
    },
    methods: {
        getRoleList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "role.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    systemId: self.searchForm.systemId,
                    keyWord: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.roleList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;

                        //mock数据
                        // self.roleList = data.data[0].dataList;
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
        getSystemList() {
            var self = this;
            Vue.ajax.send({
                name: "system.list",
                data: {
                    pageIndex: 1,
                    pageSize: 99999
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.systemList = data.data.dataList;
                        //mock数据
                        // self.systemList = data.data[0].dataList;
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
            this.getRoleList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getRoleList();
        },
        changeInput(query) {
            if (query == "" || query == null) {
                this.searchForm.systemId = "";
            }
        },
        addRole() {
            this.roleForm.roleRemark = "";
            this.$refs["roleFormAdd"].resetFields();
            this.addModel = true;
        },
        addOk() {
            this.$refs["roleFormAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "role.add",
                        data: {
                            roleName: self.roleForm.roleName,
                            roleRemark: self.roleForm.roleRemark,
                            roleSystemId: self.roleForm.roleSystemId,
                            roleCreateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.addModel = false;
                                self.$refs["roleFormAdd"].resetFields();
                                self.$Message.success("新增角色提交成功！");
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
        roleOk() {
            this.$refs["roleFormEdit"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "role.edit",
                        data: {
                            roleId: self.roleInfo.roleId,
                            roleName: self.roleInfo.roleName,
                            roleRemark: self.roleInfo.roleRemark,
                            roleSystemId: self.roleInfo.roleSystemId,
                            updateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.editModel = false;
                                self.$Message.success("编辑角色提交成功！");
                                self.getRoleList();
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
                this.roleCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.roleCol.push(m);
                        }
                    });
                });
                this.roleCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            this.$refs["roleFormEdit"].resetFields();
            this.editModel = true;
            this.roleInfo = Object.assign({}, this.showDatas[index]);
        },
        inforDelete(index) {
            this.$Modal.confirm({
                title: "删除确认",
                content: "确定要删除“" + this.showDatas[index].roleName + "”？",
                onOk: () => {
                    var self = this;
                    Vue.ajax.send({
                        name: "role.del",
                        data: {
                            roleId: this.showDatas[index].roleId,
                            updateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.info("角色信息删除成功");
                                self.getRoleList();
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
        },
        inforDetails(index) {
            this.$router.push({
                path: "/authority/role/detail",
                query: {
                    //query传值不会因为刷新页面导致数据丢失
                    // data: params.row
                    Id: this.showDatas[index].roleId,
                    sysId: this.showDatas[index].roleSystemId
                }
            });
        },
        inforAuth(index) {
            this.$router.push({
                path: "/authority/role/roleAuth",
                query: {
                    //query传值不会因为刷新页面导致数据丢失
                    Id: this.showDatas[index].roleId,
                    sysId: this.showDatas[index].roleSystemId
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