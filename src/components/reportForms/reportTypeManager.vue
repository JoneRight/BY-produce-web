<template>
    <div class="m20" style="height:calc(100% - 40px)" id="pageMain">
        <h2 class="common-title">报表管理</h2>
        <div class="bg-white p20">
            <Button type="primary" @click="addData()">新增</Button>
            <Button type="primary" @click="goBack()" style="float:right;margin-right:20px;">返回</Button>
            </Button>
            <Table border :height="tableH" :columns="showCol" :data="dataList" style="margin-top: 10px;"></Table>
        </div>
        <Modal v-model="model1" title="创建类型" width=550 :loading="loading" @on-ok="addYes">
            <Form :model="convertFormAdd" ref="convertAdd" :rules="ruleValidate" :label-width="100">
                <FormItem label="报表类型" prop="reportType">
                    <Input v-model="convertFormAdd.reportType" class="cellLength" />
                </FormItem>
                <FormItem label="报表类型名称" prop="reportName">
                    <Input v-model="convertFormAdd.reportName" class="cellLength" />
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="model2" title="编辑类型" width=550 :loading="loading" @on-ok="editYes">
            <Form :model="convertFormAdd" ref="convertEdit" :rules="ruleValidate" :label-width="100">
                <FormItem label="报表类型" prop="reportType">
                    <Input v-model="convertFormAdd.reportType" class="cellLength" readonly/>
                </FormItem>
                <FormItem label="报表类型名称" prop="reportName">
                    <Input v-model="convertFormAdd.reportName" class="cellLength" />
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="model3" title="删除类型" width=550 :loading="loading" @on-ok="deleteYes">
            您确定要将该报表类型删除吗？
        </Modal>

    </div>
</template>

<style>
.cellLength {
    width: 90%;
}
</style>

<script>
import Vue from "vue";
export default {
    data() {
        return {
            tableH: 0,
            dataList: [], //列表
            showCol: [], //显示列
            model1: false,
            model2: false,
            model3: false,
            loading: true,
            commonId: "",
            convertFormAdd: {
                reportType: "",
                reportName: ""
            },
            convertFormEdit: {
                reportId: "",
                reportType: "",
                reportName: ""
            },
            ruleValidate: {
                reportType: [
                    {
                        required: true,
                        message: "报表类型不能为空",
                        trigger: "blur"
                    }
                ],
                reportName: [
                    {
                        required: true,
                        message: "报表类型名称不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    mounted() {
        this.tableH = document.getElementById("pageMain").offsetHeight - 90;
        this.showCol = [
            {
                title: "报表类型",
                key: "check_repeat_name",
                align: "center"
            },
            {
                title: "报表类型名称",
                key: "hosp_name",
                align: "center"
            },
            {
                title: "操作",
                key: "hosp_name",
                align: "center",
                render: (h, params) => {
                    return h("div", [
                        h("Button", {
                            props: {
                                icon: "md-create"
                            },
                            class: "btn-green",
                            attrs: {
                                title: "编辑"
                            },
                            on: {
                                click: () => {
                                    // this.saveEdit(params.row);
                                    this.model2 = true;
                                    this.convertFormEdit.reportId =
                                        params.row.reportId;
                                    this.convertFormEdit.reportType =
                                        params.row.reportType;
                                    this.convertFormEdit.reportName =
                                        params.row.reportName;
                                }
                            }
                        }),
                        h("Button", {
                            props: {
                                icon: "md-close"
                            },
                            class: "btn-red",
                            attrs: {
                                title: "删除"
                            },
                            on: {
                                click: () => {
                                    this.model3 = true;
                                    this.commonId = params.row.reportId; //当前行id
                                }
                            }
                        })
                    ]);
                }
            }
        ];

        this.getDataList(); //获取列表数据
    },
    methods: {
        //获取列表数据
        getDataList() {
            var self = this;
            Vue.ajax.send({
                name: "reportType.list",
                data: {
                    pageIndex: 1, //页码
                    pageSize: 99999 //每页条数
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataList = data.data.dataList;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //返回
        goBack() {
            this.$router.push({
                path: "/reportForms/reportFormsManager"
            });
        },
        //新增
        addData() {
            this.model1 = true;
        },
        addYes() {
            this.$refs["convertAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "/reportForms/add",
                        data: {
                            reportType: self.convertFormAdd.reportType,
                            reportName: self.convertFormEdit.reportName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.success("创建类型成功");
                                self.getDataList();
                            } else {
                                self.$Modal.error({
                                    title: "失败",
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
        //编辑
        editYes() {
            this.$refs["convertEdit"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "/reportForms/edit",
                        data: {
                            reportId: self.convertFormEdit.reportId,
                            reportType: self.convertFormEdit.reportType,
                            reportName: self.convertFormEdit.reportName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.success("修改类型成功");
                                self.getDataList();
                            } else {
                                self.$Modal.error({
                                    title: "失败",
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
        //删除
        deleteYes() {
            var self = this;
            Vue.ajax.send({
                name: "/reportForms/delete",
                data: {
                    reportId: self.commonId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("删除类型成功");
                        self.getDataList();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        }
    }
};
</script>
