<template>
    <div class="bg-white p20">
        <h2 class="common-title">初检规则</h2>
        <div class="mt20">

            <Form :model="rulesFrom" ref="addRulesAdd" :rules="ruleValidate" :label-width="80">
                <FormItem label="级别">
                    <Select v-model="rulesFrom.grade" class="cellLength">
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院" prop="hospital" v-if="rulesFrom.grade=='1'">
                    <Select v-model="rulesFrom.hospital" class="cellLength" filterable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型">
                    <CheckboxGroup v-model="rulesFrom.dataType" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="初检类型">
                    <RadioGroup v-model="rulesFrom.initialType">
                        <Radio label="0" style="width:143px;">数据完整性校验</Radio>
                        <Radio label="1">表头映射</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="校验字段" v-if="rulesFrom.initialType=='0'">
                    <CheckboxGroup v-model="rulesFrom.checkAllGroup" v-for="item in checkBoxList" :key="item.key" style="width:155px;display:inline-block">
                        <Checkbox :label="item.key">{{item.title}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="表头映射" v-if="rulesFrom.initialType=='1'" style="margin-top: -20px;">
                    <Button type="text" style="color:#2d8cf0;" @click="addHeader()">+ 新增</Button>
                    <Table border :columns="headerCol" :data="headerList"></Table>
                </FormItem>
                <FormItem>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="save" v-if="saveType=='add'">保存</Button>
                    <Button type="primary" @click="save" v-if="saveType=='update'">保存</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<style>
.cellLength {
    width: 90%;
}
</style>

<script>
import Vue from "vue";
import commonJson from "@/assets/data/business/common.json";
import columns from "@/assets/data/business/cloumnCommon.json";
export default {
    name: "initialSurveyAdd",
    data() {
        return {
            dataTypeList: commonJson.dataTypeList, //数据类型
            checkBoxList: columns.columnGouyao, //多选框集合
            gradeList: commonJson.gradeList, //级别
            fatherId: "", //编辑信息id
            saveType: "add", //页面类型
            rulesFrom: {
                id: "",
                grade: "0",
                hospital: "",
                dataType: [1],
                initialType: "0",
                checkAllGroup: []
            },
            ruleValidate: {
                hospital: [
                    { required: true, message: "请选择医院", trigger: "blur" }
                ]
                // checkAllGroup: [
                //     {required: true,message: "请选择asad医院",trigger: "blur" }
                // ]
            },
            headerCol: [
                {
                    title: "标准字段",
                    key: "base_column_id",
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "Select",
                            {
                                props: {
                                    value: this.backHeaderList[params.index]
                                        .base_column_id,
                                    // style: "width:100%;height:33px;"
                                },
                                on: {
                                    input: event => {
                                        this.backHeaderList[
                                            params.index
                                        ].base_column_id = event;
                                    }
                                }
                            },
                            this.checkBoxList.map(function(type) {
                                return h(
                                    "Option",
                                    {
                                        props: { value: type.key }
                                    },
                                    type.title
                                );
                            })
                        );
                    }
                },
                {
                    title: "非标准字段",
                    key: "no_column_name",
                    align: "center",
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                value: this.backHeaderList[params.index]
                                    .no_column_name,
                                // style: "width:100%;height:25px;border:0;",
                                maxlength: 30
                            },
                            on: {
                                input: event => {
                                    this.backHeaderList[
                                        params.index
                                    ].no_column_name = event;
                                }
                            }
                        });
                    }
                },
                {
                    title: "英文字段",
                    key: "en_column_name",
                    align: "center",
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                value: this.backHeaderList[params.index]
                                    .en_column_name,
                                // style: "width:100%;height:25px;border:0",
                                maxlength: 30
                            },
                            on: {
                                input: event => {
                                    this.backHeaderList[
                                        params.index
                                    ].en_column_name = event;
                                }
                            }
                        });
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
                                        size: "small"
                                    },
                                    style: {
                                        color: "red"
                                    },
                                    on: {
                                        click: () => {
                                            if (
                                                this.backHeaderList.length <= 1
                                            ) {
                                                this.$Message.error(
                                                    "表头映射至少要包含一条数据。"
                                                );
                                            } else {
                                                this.backHeaderList.splice(
                                                    params.index,
                                                    1
                                                );
                                                this.headerList.splice(
                                                    params.index,
                                                    1
                                                );
                                            }
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            backHeaderList: [
                {
                    base_column_id: "",
                    no_column_name: "",
                    en_column_name: ""
                }
            ], //返回表头映射数据
            headerList: [
                {
                    base_column_id: "",
                    no_column_name: "",
                    en_column_name: ""
                }
            ]
        };
    },
    mounted() {
        this.fatherId = this.$route.query.mappedId;
        if (typeof this.fatherId === "undefined") {
        } else {
            this.saveType = "update"; //修改页面类型
            this.rulesFrom.id = this.fatherId;
            this.getUpdataRule(this.fatherId);
            // this.getHospitalList(); //获取医院数据
        }

        this.getHospitalList(); //获取医院数据
    },
    methods: {
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
        //获取编辑信息
        getUpdataRule(mappedId) {
            var self = this;
            Vue.ajax.send({
                name: "initialSurvey.getUpdateRule",
                data: {
                    ruleId: mappedId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.rulesFrom.grade = data.data.grade;
                        self.rulesFrom.hospital = data.data.hospital;
                        self.rulesFrom.dataType = data.data.dataType;
                        self.rulesFrom.initialType = data.data.initialType;
                        self.rulesFrom.checkAllGroup = data.data.checkAllGroup;
                        self.headerList = data.data.headerList;
                        self.backHeaderList = data.data.headerList;

                        if (self.rulesFrom.initialType == "0") {
                            self.setColumn(self.rulesFrom.dataType, "update");
                        }
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //设置显示的字段
        setColumn(data, type) {
            if (type != "update") {
                this.rulesFrom.checkAllGroup = [];
            }
            this.checkBoxList = [];
            let dataBack = data.concat([]);
            //购药数据列
            if (dataBack[0] == 1) {
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnGouyao
                );
            } else if (dataBack[0] == 2) {
                //门急诊数据列
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnMenjizhen
                );
            } else if (dataBack[0] == 3) {
                //病案数据列
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnBingan
                );
            } else if (dataBack[0] == 4) {
                //医嘱数据列
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnYizhu
                );
            }
            dataBack.splice(0, 1);
            if (dataBack.length > 0) {
                if (dataBack.indexOf(1) > -1) {
                    //购药数据列
                    let checkList = [];
                    this.checkBoxList.forEach(a => {
                        columns.columnGouyao.forEach(b => {
                            if (a.key == b.key) {
                                checkList.push(a);
                            }
                        });
                    });
                    this.checkBoxList = checkList;
                }
                if (dataBack.indexOf(2) > -1) {
                    //门急诊数据列
                    let checkList = [];
                    this.checkBoxList.forEach(a => {
                        columns.columnMenjizhen.forEach(b => {
                            if (a.key == b.key) {
                                checkList.push(a);
                            }
                        });
                    });
                    this.checkBoxList = checkList;
                }
                if (dataBack.indexOf(3) > -1) {
                    //病案数据列
                    let checkList = [];
                    this.checkBoxList.forEach(a => {
                        columns.columnBingan.forEach(b => {
                            if (a.key == b.key) {
                                checkList.push(a);
                            }
                        });
                    });
                    this.checkBoxList = checkList;
                }
                if (dataBack.indexOf(4) > -1) {
                    //医嘱数据列
                    let checkList = [];
                    this.checkBoxList.forEach(a => {
                        columns.columnYizhu.forEach(b => {
                            if (a.key == b.key) {
                                checkList.push(a);
                            }
                        });
                    });
                    this.checkBoxList = checkList;
                }
            }
        },
        //添加列
        addHeader() {
            this.headerList.push(this.headerList[0]);
            for (
                let index = this.backHeaderList.length;
                index < this.headerList.length;
                index++
            ) {
                let addHeaderList = {
                    id: index,
                    base_column_id: "",
                    no_column_name: "",
                    en_column_name: ""
                };
                this.backHeaderList.push(addHeaderList);
            }
        },
        //取消
        cancel() {
            this.$router.back();
        },
        //保存
        save() {
            if (this.rulesFrom.grade == "0") {
                this.saveSecond();
            } else {
                // this.$refs["addRulesAdd"].validate(valid => {
                //     if (valid) {
                //         this.saveSecond();
                //     }
                // });
                if (this.rulesFrom.hospital == "") {
                    this.$Message.error("请选择医院");
                } else {
                    this.saveSecond();
                }
            }
        },
        saveSecond() {
            let state = true;
            if (this.rulesFrom.initialType == "0") {
                if (this.rulesFrom.checkAllGroup.length < 1) {
                    this.$Message.error("请选择校验字段。");
                    state = false;
                }
                this.backHeaderList = [];
            } else {
                this.backHeaderList.forEach(a => {
                    if (
                        a.base_column_id == "" ||
                        a.en_column_name == "" ||
                        a.no_column_name == ""
                    ) {
                        this.$Message.error("表头映射数据内容不能为空");
                        state = false;
                    }
                });
                this.rulesFrom.checkAllGroup = [];
            }
            if (state) {
                var self = this;
                Vue.ajax.send({
                    // name: "initialSurvey.addRule",
                    name:
                        self.saveType == "add"
                            ? "initialSurvey.addRule"
                            : "initialSurvey.editRule",
                    data: {
                        fromData: self.rulesFrom,
                        headerData: self.backHeaderList
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$router.push("/rules/initialSurvey");
                            self.$Message.success("操作成功");
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
    }
};
</script>
        