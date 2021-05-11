<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">菜单管理</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="系统" :label-width="40">
                    <Select v-model="searchForm.systemId" filterable clearable @on-change="changeInput" style="width: 160px;">
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="菜单" :label-width="70">
                    <Input v-model="searchForm.title" type="text" placeholder="请输入菜单" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'AuthMenuManageAdd'" type="primary" @click="addMenu" style="float:right">新增</Button>
                </FormItem>
                
            </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'AuthMenuManageList'" :columnConfig='menuCol' :columnDatas='menuList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in menuCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'AuthMenuManageEdit'" icon="md-create" size="small" title="编辑" type="success" @click='inforEdit(index)'></Button>
                            <Button v-authorize="'AuthMenuManageDel'" icon="md-close" size="small" title="删除" type="error" @click="inforDelete(index)"></Button>
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="menuList.length>0">
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

            <Form ref="menuFormAdd" :model="menuForm" :rules="ruleValidate" :label-width="90">
                <FormItem label="系统名称" prop="menuSystemId">
                    <Select v-model="menuForm.menuSystemId" @on-change='getAllMenuList'>
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="父级菜单" prop="menuParentId">
                    <Select v-model="menuForm.menuParentId">
                        <OptionGroup label="0级菜单">
                            <Option :value="0" :key="0">-</Option>
                        </OptionGroup>
                        <OptionGroup label="一级菜单">
                            <Option v-for="item in menuList2" v-if="item.menuParentId == 0" :value="item.menuId" :key="item.menuId">{{ item.menuName }}</Option>
                        </OptionGroup>
                        <OptionGroup label="二级菜单">
                            <Option disabled="true" v-for="item in menuList2" v-if="item.menuParentId != 0" :value="item.menuId" :key="item.menuId">{{ item.menuName }}</Option>
                        </OptionGroup>
                    </Select>
                </FormItem>
                <FormItem label="序号" prop="menuOrder">
                    <Input number v-model.trim="menuForm.menuOrder" placeholder="请输入数字" :maxlength="45" />
                </FormItem>
                <FormItem label="菜单编号" prop="menuNo">
                    <Input v-model.trim="menuForm.menuNo" :maxlength="45" />
                </FormItem>
                <FormItem label="菜单名称" prop="menuName">
                    <Input v-model.trim="menuForm.menuName" :maxlength="15" />
                </FormItem>
            </Form>
        </Modal>

        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="menuOk" :loading="loading" :mask-closable="false">
            <Form ref="menuForm" :model="menuInfo" :rules="ruleValidate" :label-width="90">
                <input type="hidden" v-model="menuInfo.menuId" />
                <FormItem label="系统名称" prop="menuSystemId">
                    <Select :disabled="true" v-model="menuInfo.menuSystemId">
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="父级菜单" prop="menuParentId">
                    <Select v-model="menuInfo.menuParentId">
                        <OptionGroup label="0级菜单">
                            <Option :value="0" :key="0">-</Option>
                        </OptionGroup>
                        <OptionGroup label="一级菜单">
                            <Option v-for="item in menuList2" v-if="item.menuParentId == 0" :value="item.menuId" :key="item.menuId">{{ item.menuName }}</Option>
                        </OptionGroup>
                        <OptionGroup label="二级菜单">
                            <Option disabled="true" v-for="item in menuList2" v-if="item.menuParentId != 0" :value="item.menuId" :key="item.menuId">{{ item.menuName }}</Option>
                        </OptionGroup>
                    </Select>
                </FormItem>
                <FormItem label="序号" prop="menuOrder">
                    <Input number v-model.trim="menuInfo.menuOrder" placeholder="请输入数字" :maxlength="45" />
                </FormItem>
                <FormItem label="菜单编号" prop="menuNo">
                    <Input v-model.trim="menuInfo.menuNo"  :maxlength="45" />
                </FormItem>
                <FormItem label="菜单名称" prop="menuName">
                    <Input v-model.trim="menuInfo.menuName" :maxlength="15" />
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
    name: "menuCla",
    components: { EmptyRow, CustomTable },
    data() {
        const validateNumber= (rule, value, callback) => {
                var reg=/^[0-9]*$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入数字'));
                } else {                
                    callback();
                }
        };
        const validateLetters= (rule, value, callback) => {
                var reg=/^[a-zA-Z]+$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入字母'));
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
                systemId: "",
                title: ""
            },
            menuForm: {
                systemId: "",
                systemName: "",
                menuId: "",
                menuNo: "",
                menuName: "",
                menuSubName: "",
                menuSubName3: "",
                menuParentId: "",
                menuOrder: "",
                menuSystemId: ""
            },
            loadingAdd: true,
            loading: true,
            systemList: [],
            menuList: [],
            menuList2: [],
            menuFirst: [],
            menuSecond: [],
            menuInfo: {},
            editModel: false, //弹框状态(编辑)
            addModel: false, //弹框状态(新增)
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            ruleValidate: {
                menuSystemId: [
                    {
                        required: true,
                        message: "请选择系统名称",
                        trigger: "blur",
                        type: "number"
                    }
                ],
                menuParentId: [
                    {
                        required: true,
                        message: "请选择父级菜单",
                        trigger: "blur",
                        type: "number"
                    }
                ],
                menuOrder: [
                    {
                        required: true,
                        message: "请输入数字",
                        trigger: "blur",
                        type: "number"
                    }
                ],
                menuNo: [
                    {
                        required: true,
                        message: "菜单编号不能为空",
                        trigger: "blur"
                    }
                ],
                menuName: [
                    {
                        required: true,
                        message: "菜单名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            menuCol: [
                {
                    text: "序号",
                    name: "menuOrder",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "菜单编号",
                    name: "menuNo",
                    sortable: true,
                    moveable: true,
                    width: 100
                },

                {
                    text: "菜单",
                    name: "menuName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "父级菜单",
                    name: "menuParentName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "菜单所属系统",
                    name: "menuSystemName",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "操作",
                    align: "center",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 110
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

                    //                     this.$refs['menuForm'].resetFields();
                    //                     this.editModel = true;
                    //                     this.getAllMenuList(params.row);
                    //                     // this.menuInfo = params.row;
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
                    //                         content: params.row.isHaveAuth == 1
                    //                                 ? '该菜单下有权限，请先删除相关权限！'
                    //                                 : params.row.menuParentId == 0 ? '确定要删除菜单“'+params.row.menuName+'”？' + '<br/ >' + "该菜单下的子菜单也会被删除，请慎重！"  :'确定要删除“'+params.row.menuName+'”？',
                    //                         onOk: () => {
                    //                             if (params.row.isHaveAuth == 0) {
                    //                                 var self=this;
                    //                                 Vue.ajax.send({
                    //                                 name: 'menu.del',
                    //                                 data:{
                    //                                     menuId: params.row.menuId,
                    //                                     updateUser: Vue.getUser().userName
                    //                                 },
                    //                                 success: function(data) {
                    //                                     if (!!data && data.code=='0') {
                    //                                         self.$Message.info('菜单信息删除成功');
                    //                                             self.getMenuList();
                    //                                     } else {
                    //                                         self.$Modal.error({
                    //                                             title: '',
                    //                                             content: data.message
                    //                                             });
                    //                                         }
                    //                                     }
                    //                                 });
                    //                             }

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
        this.getSystemList();
        this.getMenuList();
        this.capyCol = [].concat(this.menuCol);
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
        changeInput(query) {
            if (query == "" || query == null) {
                this.searchForm.systemId = "";
            }
        },
        getMenuList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "menu.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    systemId: self.searchForm.systemId,
                    title: self.searchForm.title
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        var list = data.data.dataList;
                        self.menuList = list;
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
        getAllMenuList(value) {
            this.menuList2 = [];
            var self = this;
            Vue.ajax.send({
                name: "menu.list",
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    systemId: value.menuSystemId || self.menuForm.menuSystemId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        var list = data.data.dataList;
                        for (let i = 0; i < list.length; i++) {
                            var item = list[i];
                            if (item.menuId == value.menuId) {
                                self.menuInfo = item;
                                list.splice(i, 1);
                                i--;
                            }
                        }
                        self.menuList2 = list;
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
            this.getMenuList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getMenuList();
        },
        addMenu() {
            this.$refs["menuFormAdd"].resetFields();
            this.addModel = true;
            this.menuForm.menuSystemId = "";
        },
        addOk() {
            this.$refs["menuFormAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "menu.add",
                        data: {
                            menuSystemId: self.menuForm.menuSystemId,
                            menuName: self.menuForm.menuName,
                            menuNo: self.menuForm.menuNo,
                            menuParentId: self.menuForm.menuParentId,
                            menuOrder: self.menuForm.menuOrder,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == "0") {
                                self.addModel = false;
                                self.$Message.success("新增菜单提交成功！");
                                self.getMenuList(1);

                                self.getAllMenuList();
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
        menuOk() {
            this.$refs["menuForm"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "menu.edit",
                        data: {
                            menuId: self.menuInfo.menuId,
                            menuSystemId: self.menuInfo.menuSystemId,
                            menuName: self.menuInfo.menuName,
                            menuNo: self.menuInfo.menuNo,
                            menuParentId: self.menuInfo.menuParentId,
                            menuOrder: self.menuInfo.menuOrder,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == "0") {
                                self.editModel = false;
                                self.$Message.success("编辑菜单提交成功！");
                                self.getMenuList();
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
                if (this.currentSort.column == "menuOrder" || this.currentSort.sortColumn == "menuId") {
                    this.showDatas.sort(
                        (a, b) =>
                        this.currentSort.asc
                        ? a[this.currentSort.column] - b[this.currentSort.column]
                        : b[this.currentSort.column] - a[this.currentSort.column]
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
                this.menuCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.menuCol.push(m);
                        }
                    });
                });
                this.menuCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            this.$refs["menuForm"].resetFields();
            this.editModel = true;
            this.getAllMenuList(this.showDatas[index]);
        },
        inforDelete(index) {
            this.$Modal.confirm({
                title: "删除确认",
                content:
                    this.showDatas[index].isHaveAuth == 1
                        ? "该菜单下有权限，请先删除相关权限！"
                        : this.showDatas[index].menuParentId == 0
                            ? "确定要删除菜单“" +
                              this.showDatas[index].menuName +
                              "”？" +
                              "<br/ >" +
                              "该菜单下的子菜单也会被删除，请慎重！"
                            : "确定要删除“" + this.showDatas[index].menuName + "”？",
                onOk: () => {
                    if (this.showDatas[index].isHaveAuth == 0) {
                        var self = this;
                        Vue.ajax.send({
                            name: "menu.del",
                            data: {
                                menuId: this.showDatas[index].menuId,
                                updateUser: Vue.getUser().userName
                            },
                            success: function(data) {
                                if (!!data && data.code == "0") {
                                    self.$Message.info("菜单信息删除成功");
                                    self.getMenuList();
                                } else {
                                    self.$Modal.error({
                                        title: "",
                                        content: data.message
                                    });
                                }
                            }
                        });
                    }
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
