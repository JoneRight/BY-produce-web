<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">部门管理</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="系统" :label-width="40">
                    <Select v-model="searchForm.searchSystemId" filterable clearable remote :remote-method="changeDept" style="width: 160px;">
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="80" label="部门名称">
                    <Input v-model="searchForm.keywords" type="text" placeholder="请输入部门名称" style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem> 
                <FormItem  class="fr">
                    <Button v-authorize="'AuthDeptManagerAdd'" type="primary" @click="addDept">新增</Button>
                </FormItem>
                
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'AuthDeptManagerList'" :columnConfig='deptCol' :columnDatas='deptList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in deptCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'AuthDeptManagerEdit'" icon="md-create" size="small" title="编辑" type="success" @click='inforEdit(index)'></Button>
                            <Button v-authorize="'AuthDeptManagerDel'" icon="md-close" size="small" title="删除" type="error" @click="inforDelete(index)"></Button>
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="deptList.length>0">
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
            <Form :model="deptForm" ref="deptFormAdd" :rules="ruleValidate" :label-width="90">
                <FormItem label="系统名称" prop="deptSystemId">
                    <Select v-model="deptForm.deptSystemId" @on-change='getAllDeptList'>
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="父级部门" prop="deptParentId">
                    <Select v-model="deptForm.deptParentId">
                        <OptionGroup label="0级部门">
                            <Option :value="0" :key="0">-</Option>
                        </OptionGroup>
                        <OptionGroup label="一级部门">
                            <Option v-for="item in deptAllList" v-if="item.deptParentId == 0" :value="item.deptId" :key="item.deptId">{{ '&nbsp;&nbsp;' + item.deptName }}</Option>
                        </OptionGroup>
                        <OptionGroup label="二级部门">
                            <Option disabled="true" v-for="item in deptAllList" v-if="item.deptParentId != 0" :value="item.deptId" :key="item.deptId">{{ '&nbsp;&nbsp;' + item.deptName }}</Option>
                        </OptionGroup>
                    </Select>
                </FormItem>
                <FormItem label="部门编号" prop="deptNo">
                    <Input v-model.trim="deptForm.deptNo" :maxlength="45" />
                </FormItem>
                <FormItem label="部门名称" prop="deptName">
                    <Input v-model.trim="deptForm.deptName" :maxlength="30" />
                </FormItem>
            </Form>
        </Modal>

        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="deptOk" :loading="loading" :mask-closable="false">
            <Form ref="deptForm" :model="deptInfo" :rules="ruleValidate" :label-width="90">
                <input type="hidden" v-model="deptInfo.deptId" />
                <input type="hidden" v-model="deptInfo.deptSystemId" v-show="deptInfo.type == 1" />
                <FormItem label="系统名称" prop="deptSystemId">
                    <Select :disabled="true" v-model="deptInfo.deptSystemId" @on-change='getAllDeptList'>
                        <Option v-for="item in systemList" :value="item.systemId" :key="item.systemId">{{ item.systemName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="父级部门" prop="deptParentId">
                    <Select v-model="deptInfo.deptParentId">
                        <OptionGroup label="0级部门">
                            <Option :value="0" :key="0">-</Option>
                        </OptionGroup>
                        <OptionGroup label="一级部门">
                            <Option v-for="item in deptAllList" v-if="item.deptParentId == 0" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </OptionGroup>
                        <OptionGroup label="二级部门">
                            <Option disabled="true" v-for="item in deptAllList" v-if="item.deptParentId != 0" :value="item.deptId" :key="item.deptId">{{ '&nbsp;&nbsp;&nbsp;' + item.deptName }}</Option>
                        </OptionGroup>
                    </Select>
                </FormItem>
                <FormItem label="部门编号" prop="deptNo">
                    <Input v-model.trim="deptInfo.deptNo" :maxlength="45" />
                </FormItem>
                <FormItem label="部门名称" prop="deptName">
                    <Input v-model.trim="deptInfo.deptName" :maxlength="30" />
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
    name: "dept",
    components: { EmptyRow, CustomTable },
    data() {
        const validateNo = (rule, value, callback) => {
            var reg = /^[0-9]/;
            if (!reg.test(value)) {
                callback(new Error("请输入数字"));
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
                keywords: "",
                searchSystemId: ""
            },
            deptForm: {
                deptId: "",
                deptNo: "",
                deptName: "",
                deptParentId: "",
                deptParentName: "",
                deptSystemId: ""
            },
            isShow: false,
            loadingAdd: true,
            loading: true,
            systemList: [],
            deptList: [],
            deptAllList: [],
            deptInfo: {},
            tmpDept: {},
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
                deptSystemId: [
                    {
                        required: true,
                        message: "请选择系统",
                        trigger: "blur",
                        type: "number"
                    }
                ],
                deptParentId: [
                    {
                        required: true,
                        message: "请选择父级部门",
                        trigger: "blur",
                        type: "number"
                    }
                ],
                deptNo: [
                    {
                        required: true,
                        message: "部门编号不能为空",
                        trigger: "blur"
                    },
                    { validator: validateNo, trigger: "blur" }
                ],
                deptName: [
                    {
                        required: true,
                        message: "部门名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            deptCol: [
                // {
                //     title: '部门编号',
                //     key: 'deptNo',
                //     align: 'center',
                //     minWidth: 80,
                //     maxWidth: 120
                // },
                // {
                //     title: '部门名称',
                //     key: 'deptName',
                //     align: 'center',
                //     minWidth: 80,
                //     maxWidth: 150
                // },
                // {
                //     title: '父级部门',
                //     key: 'deptParentName',
                //     align: 'center',
                //     minWidth: 80,
                //     maxWidth: 150
                // },
                // {
                //     title: '所属系统',
                //     key: 'deptSystemName',
                //     align: 'center',
                //     minWidth: 100,
                //     maxWidth: 150
                // },
                // {
                //     title: '创建时间',
                //     key: 'deptCreateTime',
                //     align: 'center',
                //     minWidth: 150,
                //     maxWidth: 200
                // },
                // {
                //     title: '创建人',
                //     key: 'deptCreateUser',
                //     align: 'center',
                //     minWidth: 100,
                //     maxWidth: 120
                // },
                // {
                //     title: '修改时间',
                //     key: 'deptUpdateTime',
                //     align: 'center',
                //     minWidth: 150,
                //     maxWidth: 200
                // },
                // {
                //     title: '修改人',
                //     key: 'deptUpdateUser',
                //     align: 'center',
                //     minWidth: 100,
                //     maxWidth: 120
                // },
                {
                    text: "部门编号",
                    name: "deptNo",
                    sortable: true,
                    moveable: true,
                    width: 130
                },
                {
                    text: "部门名称",
                    name: "deptName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "父级部门",
                    name: "deptParentName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "所属系统",
                    name: "deptSystemName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "创建时间",
                    name: "deptCreateTime",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "创建人",
                    name: "deptCreateUser",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "修改时间",
                    name: "deptUpdateTime",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "修改人",
                    name: "deptUpdateUser",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "操作",
                    name: "op",
                    width: 110,
                    filterable: false,
                    removeable: false
                }
            ]
        };
    },
    mounted: function() {
        this.getSystemList();
        this.getDeptList();
        this.capyCol = [].concat(this.deptCol);
        // this.tableH = document.getElementById("pageMain").offsetHeight - 190;
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
        getAllDeptList(value) {
            var self = this;
            Vue.ajax.send({
                name: "dept.list",
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    systemId: value
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        var list = data.data.dataList;
                        for (let i = 0; i < list.length; i++) {
                            var item = list[i];
                            if (
                                self.tmpDept != null &&
                                item.deptId == self.tmpDept.deptId
                            ) {
                                list.splice(i, 1);
                                i--;
                            }
                        }
                        self.deptAllList = list;
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        getDeptList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "dept.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize,
                    systemId: self.searchForm.searchSystemId,
                    keyWord: self.searchForm.keywords
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.deptList = data.data.dataList;
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
        changeDept(query) {
            if (query == "" || query == null) {
                this.searchForm.searchSystemId = "";
            }
        },
        getDeptInfo(value) {
            var self = this;
            Vue.ajax.send({
                name: "dept.get",
                data: {
                    deptId: value
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.deptInfo = data.data;
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
            this.getDeptList();
        },
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDeptList();
        },
        addDept() {
            this.$refs["deptFormAdd"].resetFields();
            this.addModel = true;
        },
        addOk() {
            this.$refs["deptFormAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "dept.add",
                        data: {
                            deptNo: self.deptForm.deptNo,
                            deptName: self.deptForm.deptName,
                            deptParentId: self.deptForm.deptParentId,
                            deptSystemId: self.deptForm.deptSystemId,
                            deptCreateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == "0") {
                                self.addModel = false;
                                self.$Message.success("新增部门提交成功！");
                                //刷新页面
                                self.getDeptList(1);

                                self.getAllDeptList();
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
        deptOk() {
            this.$refs["deptForm"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "dept.edit",
                        data: {
                            deptId: self.deptInfo.deptId,
                            deptNo: self.deptInfo.deptNo,
                            deptName: self.deptInfo.deptName,
                            deptParentId: self.deptInfo.deptParentId,
                            deptSystemId: self.deptInfo.deptSystemId,
                            updateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == "0") {
                                self.editModel = false;
                                self.$Message.success("编辑部门提交成功！");
                                //刷新页面
                                self.getDeptList();
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
                if (this.currentSort.column == "deptNo") {
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
                this.deptCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op") {
                            this.deptCol.push(m);
                        }
                    });
                });
                this.deptCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        inforEdit(index) {
            this.$refs["deptForm"].resetFields();
            this.editModel = true;
            this.tmpDept = this.showDatas[index];
            this.getAllDeptList(this.showDatas[index].systemId);
            this.getDeptInfo(this.showDatas[index].deptId);
        },
        inforDelete(index) {
            this.$Modal.confirm({
                title: "删除确认",
                content:
                    this.showDatas[index].deptParentId == 0
                        ? "确定要删除部门“" +
                          this.showDatas[index].deptName +
                          "”？" +
                          "<br/ >" +
                          "该部门下的子部门也会被删除，请慎重！"
                        : "确定要删除“" +
                          this.showDatas[index].deptName +
                          "”？",
                onOk: () => {
                    var self = this;
                    Vue.ajax.send({
                        name: "dept.del",
                        data: {
                            deptId: this.showDatas[index].deptId,
                            updateUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.info("部门信息删除成功");
                                self.getDeptList();
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
