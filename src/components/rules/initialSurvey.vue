<template>
    <div class="bg-white p20">
        <h2 class="common-title">初检规则</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="级别" :label-width="40">
                    <Select v-model="searchForm.grade" style="width: 120px;">
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospital" style="width: 120px;" filterable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" :label-width="60">
                    <Select v-model="searchForm.dataType" style="width: 120px;">
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="规则" :label-width="40">
                    <Input v-model="searchForm.keyword" type="text" placeholder="请输入检索的关键词..." style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="getDataList()">检索</Button>
                </FormItem>
            </Form>
        </div>
        <div class="mt5">
            <Button type="primary" @click="addData()">+ 新增</Button>
            <Table border :columns="dataCol" :data="dataList" style="margin-top: 10px;"></Table>
        </div>
        <div class="mt15 text-center mb25">
            <Page :total="pageConfig.totalItemCount" show-total @on-change='getDataList' />
        </div>

        <Modal v-model="delRule" title="删除" width=420 @on-ok="delRuleYes">
            您确定要删除该规则吗？
        </Modal>
        <Modal v-model="qiYong" title="启用" width=420 @on-ok="updateState(2)">
            您确定要启用该规则吗？
        </Modal>
        <Modal v-model="tongGuo" title="通过" width=420 @on-ok="updateState(2)">
            您确定要通过该规则吗？
        </Modal>
        <Modal v-model="buTongGuo" title="不通过" width=420 @on-ok="updateState(3)">
            您确定要不通过该规则吗？
        </Modal>
        <Modal v-model="tingYong" title="停用" width=420 @on-ok="updateState(0)">
            您确定要停用该规则吗？
        </Modal>

    </div>
</template>

<script>
import Vue from "vue";
//公用json串，不需要访问后台
import commonJson from "@/assets/data/business/common.json";
export default {
    name: "initialSurvey",
    data() {
        return {
            dataTypeList: commonJson.dataTypeList, //数据类型
            gradeList: commonJson.gradeList, //级别
            hospitalList: [], //医院
            dataList: [], //列表
            delRule: false, //提示框显示状态（删除）
            qiYong: false, //提示框显示状态（启用）
            tongGuo: false, //提示框显示状态（通过）
            buTongGuo: false, //提示框显示状态（不通过）
            tingYong: false, //提示框显示状态（停用）
            commonId: "", //存放id
            //搜索栏
            searchForm: {
                grade: "",
                hospital: "",
                dataType: "",
                keyword: ""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 10,
                totalItemCount: 1
            },
            dataCol: [
                {
                    title: "级别",
                    key: "rule_type",
                    align: "center"
                },
                {
                    title: "医院",
                    key: "hosp_name",
                    align: "center"
                },
                {
                    title: "数据类型",
                    key: "date_type",
                    align: "center"
                },
                {
                    title: "初检类型",
                    key: "initial_type",
                    align: "center"
                },
                {
                    title: "初检规则",
                    key: "initial_rule",
                    align: "center"
                },
                {
                    title: "状态",
                    key: "state",
                    align: "center",
                    render: (h, params) => {
                        let texts = "";
                        let css="";
                        if (params.row.state == 0) {
                            texts = "停用";
                        } else if (params.row.state == 1) {
                            texts = "待审核";
                        } else if (params.row.state == 2) {
                            texts = "通过";
                        } else if (params.row.state == 3) {
                            texts = "不通过";
                            css="red"
                        }
                        return h(
                            "div",
                            {
                                style:{
                                    color:css
                                }
                            },
                            texts
                        );
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small",
                                        ghost: true
                                    },
                                    style: {
                                        color: "#2d8cf0",
                                        display:(params.row.state==0)?"inline-block":"none",
                                    },
                                    on: {
                                        click: () => {
                                            this.qiYong=true;
                                            this.commonId=params.row.id;
                                        }
                                    }
                                },
                                "启用"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small",
                                        ghost: true
                                    },
                                    style: {
                                        color: "#2d8cf0",
                                        display:(params.row.state==1)?"inline-block":"none",
                                    },
                                    on: {
                                        click: () => {
                                            this.tongGuo=true;
                                            this.commonId=params.row.id;
                                        }
                                    }
                                },
                                "通过"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small",
                                        ghost: true
                                    },
                                    style: {
                                        color: "#2d8cf0",
                                        display:(params.row.state==1)?"inline-block":"none",
                                    },
                                    on: {
                                        click: () => {
                                            this.buTongGuo=true;
                                            this.commonId=params.row.id;
                                        }
                                    }
                                },
                                "不通过"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small",
                                        ghost: true
                                    },
                                    style: {
                                        color: "#2d8cf0",
                                        display:(params.row.state==2)?"inline-block":"none",
                                    },
                                    on: {
                                        click: () => {
                                            this.tingYong=true;
                                            this.commonId=params.row.id;
                                        }
                                    }
                                },
                                "停用"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small",
                                        ghost: true
                                    },
                                    style: {
                                        color: "#2d8cf0"
                                    },
                                    on: {
                                        click: () => {
                                            this.editData(params.row.id);
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small",
                                        ghost: true
                                    },
                                    style: {
                                        color: "red"
                                    },
                                    on: {
                                        click: () => {
                                            this.delRule = true;
                                            this.commonId = params.row.id; //当前行id
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ]
        };
    },
    mounted() {
        this.getDataList(); //获取列表数据
        this.getHospitalList(); //获取医院数据
    },
    methods: {
        //获取列表
        getDataList() {
            var self = this;
            Vue.ajax.send({
                name: "initialSurvey.list",
                data: {
                    pageNum: self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    grade: self.searchForm.grade, //级别
                    hospitalId: self.searchForm.hospital, //医院
                    dataType: self.searchForm.dataType, //数据类型
                    keywords: self.searchForm.keywords //规则
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataList = data.data[0].dataList;
                        self.pageConfig.totalItemCount =
                            data.data[0].totalItemCount;
                        self.pageConfig.pageNum = data.data[0].currentPageIndex;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取医院
        getHospitalList() {
            var self = this;
            Vue.ajax.send({
                name: "common.hospitalList",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.hospitalList = data.data;
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        //新增
        addData() {
            // this.addRule = true;
            this.$router.push({
                path: "/rules/initialSurveyAdd"
            });
        },
        //编辑
        editData(mappedId) {
            this.$router.push({
                path: "/rules/initialSurveyAdd",
                query: {
                    mappedId: mappedId //编辑信息id
                }
            });
        },
        //修改状态
        updateState(state){
            var self=this;
            Vue.ajax.send({
                name:"initialSurvey.updataState",
                data:{
                    commonId:self.commonId,
                    state:state
                },
                success:function(data){
                    if (!!data&&data.code=="0") {
                        self.getDataList();
                        self.$Message.success("操作成功。");
                    }else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            })
        },
        //删除规则确认操作
        delRuleYes() {
            var self = this;
            Vue.ajax.send({
                name: "initialSurvey.delRule",
                data: {
                    id: self.commonId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Modal.success({
                            title: "成功",
                            closable: true,
                            content: "<h5>删除规则成功。</h5>"
                        });
                        //清除信息
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