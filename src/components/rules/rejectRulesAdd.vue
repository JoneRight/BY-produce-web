<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left:0px;">剔除规则</h2>
        <div class="mt20">
            <Form :model="rulesFrom" ref="addRulesAdd" :rules="ruleValidate" :label-width="100">
                <FormItem label="名称" prop="check_out_name">
                    <Input v-model.trim="rulesFrom.check_out_name" :maxlength="10" class="cellLength" />
                </FormItem>
                <FormItem label="级别">
                    <Select v-model="rulesFrom.rule_type" class="cellLength">
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院" prop="hosp_id" v-if="rulesFrom.rule_type=='1'">
                    <Select v-model="rulesFrom.hosp_id" class="cellLength" filterable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否自动确认">
                    <Select v-model="rulesFrom.isAffirm" class="cellLength">
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" prop="date_type" v-if="saveType=='add'">
                    <CheckboxGroup v-model="rulesFrom.date_type" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="数据类型" prop="date_type" v-if="saveType!='add'">
                    <!-- <CheckboxGroup v-model="rulesFrom.date_type" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn1" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup> -->
                    <span>{{dataTypeName}}</span>
                </FormItem>
                <FormItem label="剔除规则" prop="checkAllGroup">
                    <div class="search-con cellLength">
                        <div v-for="(reject,index) in rejectRules" :key="index">
                            <Select v-model="reject.rejectRelationOne" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in bracket" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="reject.rejectValue" @on-change="createScript" style="width:200px;" labelInValue:true>
                                <Option v-for="item in checkBoxList" :value='item.databaseFieldName+","+item.title' :key="item.key">{{ item.title }}</Option>
                            </Select>
                            <Select v-model="reject.rejectBracket" @on-change="createScript" style="width:100px;">
                                <Option v-for="item in relation" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Input v-model="reject.rejectText" @on-change="createScript" style="width:200px;" />
                            <Select v-model="reject.rejectConditionalOne" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in conditionalRelation" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="reject.rejectRelationTwo" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in bracket" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="reject.rejectConditionalTwo" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in conditionalRelation" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Button icon="md-remove" @click="removeIndex(index)"></Button>
                        </div>

                        <Button type="primary" @click="addOneRules" style="margin-bottom:10px;margin-top:10px;">+ 添加字段</Button>
                    </div>
                </FormItem>
                <FormItem label="剔除脚本" prop="code_rule">
                    <Input v-model="rulesFrom.display_rule" type="textarea" :rows="2" :maxlength="2000" class="cellLength" readonly/>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="rulesFrom.remark" type="textarea" :rows="4" :maxlength="2000" class="cellLength" />
                </FormItem>
                <FormItem v-if="saveType!='audit'">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="save">保存</Button>
                </FormItem>
                <FormItem label="不通过原因" v-if="saveType=='audit'">
                    <Select v-model="rulesFrom.nopassReason" class="cellLength" filterable>
                        <Option v-for="item in nopassReasonList" :value="item.unauditreasonName" :key="item.unauditreasonId">{{ item.unauditreasonName }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="saveType=='audit'">
                    <!-- <Button @click="cancel">取消</Button> -->
                    <Button type="primary" @click="auditYes">通过</Button>
                    <Button type="error" @click="auditNo">驳回</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import commonJson from "@/assets/data/business/common.json";
import columns from "@/assets/data/business/cloumnCommon.json";
import "../../assets/css/business/dataerror.css";
export default {
    name: "rejectRulesAdd",
    data() {
        const validateData = (rule, value, callback) => {
            if (value.length < 1) {
                return callback(new Error("请选择数据类型"));
            } else {
                callback();
            }
        };
        const validateCheck = (rule, value, callback) => {
            let text = this.rulesFrom.code_rule.replace(/(^\s*)|(\s*$)/g, "");
            if (text == "") {
                return callback(new Error("请填写剔除规则"));
            } else {
                callback();
            }
        };
        return {
            dataTypeList: commonJson.dataTypeList, //数据类型
            checkBoxList: columns.columnGouyao, //多选框集合
            gradeList: commonJson.gradeList, //级别
            nopassReasonList: [], //审核不通过原因
            hospitalList:[],
            fatherId: "", //编辑信息id
            saveType: "add", //页面类型
            operationType: "", //操作类型
            rejectRules: [], //剔除规则
            editDateType: [], //保存编辑前的数据类型
            dataTypeName:"",//数据类型
            rulesFrom: {
                check_out_id: "",
                check_out_name: "",
                rule_type: 0,
                hosp_id: "",
                date_type: [10],
                isAffirm:"1",
                // checkAllGroup: [],
                code_rule: "",
                display_rule:"",
                check_out_list: [],
                remark: "",
                nopassReason: ""
            },
            ruleValidate: {
                check_out_name: [
                    { required: true, message: "名称不能为空", trigger: "blur" }
                ],
                hosp_id: [
                    { required: true, message: "请选择医院", trigger: "blur" }
                ],
                date_type: [{ validator: validateData, trigger: "blur" }],
                checkAllGroup: [{ validator: validateCheck, trigger: "blur" }]
            },
            relation: [
                {
                    value: "==",
                    label: "等于"
                },
                {
                    value: "!=",
                    label: "不等于"
                },
                {
                    value: ">=",
                    label: "大于等于"
                },
                {
                    value: "<=",
                    label: "小于等于"
                },
                {
                    value: ">",
                    label: "大于"
                },
                {
                    value: "<",
                    label: "小于"
                },
                {
                    value: "⊆",
                    label: "包含于"
                },
                {
                    value: "⊇",
                    label: "包含"
                },
                {
                    value: "!⊆",
                    label: "不包含于"
                },
                {
                    value: "!⊇",
                    label: "不包含"
                }
            ],
            conditionalRelation: [
                {
                    value: " ",
                    label: " "
                },
                {
                    value: "and",
                    label: "and"
                },
                {
                    value: "or",
                    label: "or"
                }
            ],
            bracket: [
                {
                    value: " ",
                    label: " "
                },
                {
                    value: "(",
                    label: "("
                },
                {
                    value: ")",
                    label: ")"
                }
            ]
        };
    },
    mounted() {
        this.getHospitalList(); //获取医院数据

        // this.fatherId = this.$route.query.mappedId;
        // if (typeof this.fatherId === "undefined") {
        // } else {
        //     this.saveType = "update"; //修改页面类型
        //     this.rulesFrom.check_out_id = this.fatherId;
        //     this.getUpdataRule(this.fatherId);
        // }

        this.fatherId = this.$route.query.mappedId;
        this.operationType = this.$route.query.operationType;
        if (this.operationType == "update") {
            this.saveType = this.operationType; //修改页面类型
            this.rulesFrom.id = this.fatherId;
            this.getUpdataRule(this.fatherId);
        } else if (this.operationType == "audit") {
            this.saveType = this.operationType; //修改页面类型
            this.rulesFrom.id = this.fatherId;
            this.getUpdataRule(this.fatherId);
            this.getauditList();
        }

        this.addOneRules();
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
        //获取审核不通过原因
        getauditList() {
            var self = this;
            Vue.ajax.send({
                name: "common.auditNOList",
                data: {
                    pageIndex: 1, //页码
                    pageSize: 99999 //每页条数
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.nopassReasonList = data.data.dataList;
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
                name: "rejectRules.getUpdateRule",
                data: {
                    checkOutId: mappedId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.rulesFrom.check_out_name =
                            data.data.check_out_name;
                        self.rulesFrom.rule_type = data.data.rule_type;
                        self.rulesFrom.hosp_id = data.data.hospId + "";
                        self.rulesFrom.date_type = data.data.date_type
                            .split(",")
                            .map(Number);

                        self.dataTypeName="";
                        if (self.rulesFrom.date_type.indexOf(10)>-1) {
                            self.dataTypeName+="购药，";
                        }
                        if (self.rulesFrom.date_type.indexOf(20)>-1) {
                            self.dataTypeName+="门急诊，";
                        }
                        if (self.rulesFrom.date_type.indexOf(30)>-1) {
                            self.dataTypeName+="病案，";
                        }
                        if (self.rulesFrom.date_type.indexOf(40)>-1) {
                            self.dataTypeName+="医嘱，";
                        }
                        self.dataTypeName=self.dataTypeName.substring(0,self.dataTypeName.length-1);

                        // var reg = new RegExp('"', "g");
                        // self.rulesFrom.display_rule = data.data.display_rule.replace(reg, "");
                        self.rulesFrom.display_rule = data.data.display_rule;
                        self.rulesFrom.code_rule = data.data.code_rule;
                        self.rulesFrom.check_out_list =
                            data.data.check_out_list;
                        self.rulesFrom.remark = data.data.remark;
                        self.rulesFrom.isAffirm=data.data.isAffirm+"";

                        self.editDateType = self.rulesFrom.date_type;
                        self.setColumn(self.rulesFrom.date_type, "update");

                        //剔除规则
                        self.rejectRules = JSON.parse(
                            self.rulesFrom.check_out_list
                        );
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //编辑、审核时禁止修改数据列和数据类型
        setColumn1() {
            this.rulesFrom.date_type = JSON.parse(
                JSON.stringify(this.editDateType)
            );
        },
        //设置显示的字段
        setColumn(data, type) {
            // if (type != "update") {
            //     this.rulesFrom.checkAllGroup = [];
            // }
            this.checkBoxList = [];
            let dataBack = data.concat([]);
            //购药数据列
            if (dataBack[0] == 10) {
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnGouyao
                );
            } else if (dataBack[0] == 20) {
                //门急诊数据列
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnMenjizhen
                );
            } else if (dataBack[0] == 30) {
                //病案数据列
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnBingan
                );
            } else if (dataBack[0] == 40) {
                //医嘱数据列
                this.checkBoxList.push.apply(
                    this.checkBoxList,
                    columns.columnYizhu
                );
            }
            dataBack.splice(0, 1);
            if (dataBack.length > 0) {
                if (dataBack.indexOf(10) > -1) {
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
                if (dataBack.indexOf(20) > -1) {
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
                if (dataBack.indexOf(30) > -1) {
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
                if (dataBack.indexOf(40) > -1) {
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
        //添加字段
        addOneRules() {
            var index=this.rejectRules.length;
            if(index>0&&(this.rejectRules[index-1].rejectConditionalOne==""
                ||this.rejectRules[index-1].rejectConditionalOne==" "
                ||this.rejectRules[index-1].rejectConditionalOne==undefined)){
                    this.rejectRules[index-1].rejectConditionalOne="and";
            }
            //剔除规则
            let rejectRulesSon = {
                rejectRelationOne: "",
                rejectValue: "",
                rejectBracket: "",
                rejectText: "",
                rejectConditionalOne: "",
                rejectConditionalTwo: "",
                rejectRelationTwo: ""
            };
            this.rejectRules.push(rejectRulesSon);
        },
        //删除字段
        removeIndex(index) {
            var rlength=this.rejectRules.length
            if (rlength == 1) {
                this.$Message.error("至少要保留一条规则信息");
            } else {
                this.rejectRules.splice(index, 1);
                if (index==rlength-1) {
                    this.rejectRules[rlength-2].rejectConditionalOne="";
                }
                this.createScript();
            }
        },
        //生成脚本
        createScript() {
            this.rulesFrom.code_rule = "";
            this.rulesFrom.display_rule = "";
            this.rejectRules.forEach(a => {
                this.rulesFrom.code_rule +=
                    a.rejectRelationOne +
                    a.rejectValue.split(",")[0] +
                    a.rejectBracket +
                    // a.rejectText +
                    a.rejectText.replace(/\(/g,"#{[").replace(/\)/g,"]}#") +
                    " " +
                    a.rejectConditionalOne +
                    " " +
                    a.rejectRelationTwo +
                    " " +
                    a.rejectConditionalTwo;
                this.rulesFrom.display_rule +=
                    a.rejectRelationOne +
                    a.rejectValue.split(",")[1] +
                    a.rejectBracket +
                    a.rejectText +
                    " " +
                    a.rejectConditionalOne +
                    " " +
                    a.rejectRelationTwo +
                    " " +
                    a.rejectConditionalTwo;
            });
            this.rulesFrom.code_rule = this.rulesFrom.code_rule
                .split("undefined")
                .join("");
            this.rulesFrom.display_rule = this.rulesFrom.display_rule
                .split("undefined")
                .join("");
        },
        //取消
        cancel() {
            this.$router.back();
        },
        //保存
        save() {
            this.rulesFrom.check_out_list = [];
            this.rejectRules.forEach(a => {
                let checkOut = {
                    rejectRelationOne: a.rejectRelationOne,
                    rejectValue: a.rejectValue,
                    rejectBracket: a.rejectBracket,
                    rejectText: a.rejectText,
                    rejectConditionalOne: a.rejectConditionalOne,
                    rejectConditionalTwo: a.rejectConditionalTwo,
                    rejectRelationTwo: a.rejectRelationTwo
                };
                this.rulesFrom.check_out_list.push(checkOut);
            });
            this.$refs["addRulesAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name:
                            self.saveType == "add"
                                ? "rejectRules.addRule"
                                : "rejectRules.editRule",
                        data: {
                            // data: self.rulesFrom
                            checkOutId: self.fatherId,
                            rule_type: self.rulesFrom.rule_type,
                            hospId: self.rulesFrom.hosp_id,
                            date_type: self.rulesFrom.date_type.join(","),
                            check_out_name: self.rulesFrom.check_out_name,
                            check_out_list: JSON.stringify(
                                self.rulesFrom.check_out_list
                            ),
                            code_rule: self.rulesFrom.code_rule,
                            display_rule:self.rulesFrom.display_rule,
                            isAffirm:self.rulesFrom.isAffirm,
                            remark: self.rulesFrom.remark,
                            state: 1,
                            create_user: Vue.getUser().userName,
                            change_user: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$router.push("/rules/reject");
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
            });
        },
        //审核通过
        auditYes() {
            this.audit(2);
        },
        //审核不通过
        auditNo() {
            if (
                this.rulesFrom.nopassReason == null ||
                this.rulesFrom.nopassReason == ""
            ) {
                this.$Message.error("请选择审核不通过原因");
            } else {
                this.audit(3);
            }
        },
        //审核
        audit(state) {
            var self = this;
            Vue.ajax.send({
                name: "rejectRules.editRule",
                data: {
                    checkOutId: self.fatherId,
                    rule_type: self.rulesFrom.rule_type,
                    hospId: self.rulesFrom.hosp_id,
                    date_type: self.rulesFrom.date_type.join(","),
                    check_out_name: self.rulesFrom.check_out_name,
                    check_out_list: self.rulesFrom.check_out_list,
                    code_rule: self.rulesFrom.code_rule,
                    display_rule:self.rulesFrom.display_rule,
                    remark: self.rulesFrom.remark,
                    state: state,
                    nopassReason: self.rulesFrom.nopassReason,
                    check_user: Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$router.push("/rules/reject");
                        self.$Message.success("操作成功。");
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
