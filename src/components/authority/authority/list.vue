<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">权限管理</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem :label-width="70" label="权限名称">
                    <Input v-model="searchForm.keywords" type="text" placeholder="请输入权限名称" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'AuthAuthorityManageAdd'" type="primary" @click="addAuth" >新增</Button>
                </FormItem>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'AuthAuthorityManageList'"  :columnConfig='authCol' :columnDatas='authList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in authCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'AuthAuthorityManageEdit'"  icon="md-create" size="small" title="编辑" type="success" @click='inforEdit(index)'></Button>
                            <Button v-authorize="'AuthAuthorityManageDel'"  icon="md-close" size="small" title="删除" type="error" @click="inforDelete(index)"></Button>
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="authList.length>0">
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

            <Form :model="authForm" ref="authFormAdd" :rules="ruleValidate" :label-width="90">
                <FormItem label="所属系统" prop="systemId">
                    <Select v-model="authForm.systemId" @on-change='getMenuList'>
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="菜单名称" prop="menuId" type="number">
                    <Select v-model="authForm.menuId" filterable>
                        <Option v-for="item in menuList" :value="item.menuId" :key="item.menuId">{{ item.menuName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="权限编号" prop="authNo">
                    <Input v-model.trim="authForm.authNo" :maxlength="45" />
                </FormItem>
                <FormItem label="权限名称" prop="authName">
                    <Input v-model.trim="authForm.authName" :maxlength="15" />
                </FormItem>
            </Form>
        </Modal>

        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="authOk" :loading="loading" :mask-closable="false">
            <Form ref="authFormEdit" :model="authInfo" :rules="ruleValidate" :label-width="90">
                <input type="hidden" v-model="authInfo.authId" />
                <FormItem label="所属系统" prop="systemId">
                    <Select :disabled="true" v-model="authInfo.systemId" @on-change='getMenuList'>
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="菜单名称" prop="menuId" type="number">
                    <Select v-model="authInfo.menuId" filterable>
                        <Option v-for="item in menuList" :value="item.menuId" :key="item.menuId">{{ item.menuName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="权限编号" prop="authNo">
                    <Input v-model.trim="authInfo.authNo" :maxlength="45" />
                </FormItem>
                <FormItem label="权限名称" prop="authName">
                    <Input v-model.trim="authInfo.authName" :maxlength="15" />
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
    name: "auth",
    components: { EmptyRow, CustomTable },
    data() {
        const validateAuthNo = (rule, value, callback) => {
            var reg = /^[0-9a-zA-Z]/;
            if (!reg.test(value)) {
                callback(new Error("请输入数字或英文"));
            } else {
                callback();
            }
        };
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
            authForm: {
                systemName: "",
                menuName: "",
                authId: "",
                authNo: "",
                authName: "",
                systemId: "",
                authMenuId: "",
                menuId: ""
            },
            loadingAdd: true,
            loading: true,
            authList: [],
            systemList: [],
            menuList: [],
            authInfo: {},
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
                        message: "请选择所属系统",
                        trigger: "blur",
                        type: "number"
                    }
                ],
                menuId: [
                    {
                        required: true,
                        message: "请选择菜单名称",
                        trigger: "blur",
                        type: "number"
                    }
                ],
                authName: [
                    {
                        required: true,
                        message: "权限名称不能为空",
                        trigger: "blur"
                    }
                ],
                authNo: [
                    {
                        required: true,
                        message: "权限编号不能为空",
                        trigger: "blur"
                    },
                    { validator: validateAuthNo, trigger: "blur" }
                ]
            },
            authCol: [
                {
                    text: "权限编号",
                    name: "authNo",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "权限名称",
                    name: "authName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "所属菜单",
                    name: "menuName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 110
                }
            ]
        };
    },
    mounted: function() {
        this.getAuthList();
        //获取系统列表
        this.getSystemList();
        this.capyCol = [].concat(this.authCol);
    },
    methods: {
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
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        getAuthList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "auth.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    authName: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.authList = data.data.dataList;
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
        getAuthInfo(value) {
            var self = this;
            Vue.ajax.send({
                name: "auth.list",
                data: {
                    pageIndex: 1,
                    pageSize: 99999
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        var list = data.data.dataList;
                        list.forEach(item => {
                            if (value == item.authId) {
                                self.authInfo = item;
                            }
                        });
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        getMenuList(value) {
            var self = this;
            Vue.ajax.send({
                name: "menu.list",
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    systemId: value
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.menuList = data.data.dataList;
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
            this.getAuthList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getAuthList();
        },
        addAuth() {
            this.$refs["authFormAdd"].resetFields();
            this.addModel = true;
        },
        addOk() {
            this.$refs["authFormAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "auth.add",
                        data: {
                            authNo: self.authForm.authNo,
                            authName: self.authForm.authName,
                            authMenuId: self.authForm.menuId,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == "0") {
                                self.addModel = false;
                                self.$refs["authFormAdd"].resetFields();
                                self.$Message.success("新增权限提交成功！");
                                self.getAuthList();
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
        authOk() {
            this.$refs["authFormEdit"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "auth.edit",
                        data: {
                            authId: self.authInfo.authId,
                            authNo: self.authInfo.authNo,
                            authName: self.authInfo.authName,
                            authMenuId: self.authInfo.menuId,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == "0") {
                                self.editModel = false;
                                self.$Message.success("编辑权限提交成功！");
                                self.getAuthList();
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
                // if (this.currentSort.column == "readCount") {
                //     this.showDatas.sort(
                //         (a, b) =>
                //             this.currentSort.asc
                //                 ? a[this.currentSort.column] -
                //                   b[this.currentSort.column]
                //                 : b[this.currentSort.column] -
                //                   a[this.currentSort.column]
                //     );
                // } else {
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
                // }
            }
            this.showColumns = showColumns;

            if (this.showColumns.length > 0) {
                this.authCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.authCol.push(m);
                        }
                    });
                });
                this.authCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            this.$refs["authFormEdit"].resetFields();
            this.editModel = true;
            this.getAuthInfo(this.showDatas[index].authId);
            this.getMenuList(this.showDatas[index].systemId);
        },
        inforDelete(index) {
            this.$Modal.confirm({
                title: "删除确认",
                content: "确定要删除“" + this.showDatas[index].authName + "”？",
                onOk: () => {
                    var self = this;
                    Vue.ajax.send({
                        name: "auth.del",
                        data: {
                            authId: this.showDatas[index].authId,
                            updateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.info("权限信息删除成功");
                                self.getAuthList();
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
