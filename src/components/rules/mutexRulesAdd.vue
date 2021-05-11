<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left:0px;">互斥规则</h2>
        <div class="mt20">
            <Form :model="rulesFrom" ref="addRulesAdd" :rules="ruleValidate" :label-width="100">
                <FormItem label="名称" prop="mutex_name">
                    <Input v-model.trim="rulesFrom.mutex_name" :maxlength="10" class="cellLength" />
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
                <FormItem label="数据类型" prop="date_type"  v-if="saveType=='add'">
                    <CheckboxGroup v-model="rulesFrom.date_type" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="数据类型" prop="date_type"  v-if="saveType!='add'">
                    <CheckboxGroup v-model="rulesFrom.date_type" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn1" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="互斥规则" prop="checkAllGroup">
                    <div class="search-con cellLength">
                        <div v-for="(mutex,index) in mutexRules" :key="index">
                            <Select v-model="mutex.mutexRelationOne" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in bracket" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="mutex.mutexValue" @on-change="createScript" style="width:200px;">
                                <Option v-for="item in checkBoxList" :value='item.databaseFieldName+","+item.title' :key="item.key">{{ item.title }}</Option>
                            </Select>
                            <Select v-model="mutex.mutexBracket" @on-change="createScript" style="width:100px;">
                                <Option v-for="item in relation" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Input v-model="mutex.mutexText" @on-change="createScript" style="width:200px;" />
                            <Select v-model="mutex.mutexConditionalOne" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in conditionalRelation" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="mutex.mutexRelationTwo" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in bracket" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="mutex.mutexConditionalTwo" @on-change="createScript" style="width:80px;">
                                <Option v-for="item in conditionalRelation" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Button icon="md-remove" @click="removeIndex(index)"></Button>
                        </div>

                        <Button type="primary" @click="addOneRules" style="margin-bottom:10px;margin-top:10px;">+ 添加字段</Button>
                    </div>
                </FormItem>
                <FormItem label="互斥脚本" prop="code_rule">
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
    name: "mutexRulesAdd",
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
                return callback(new Error("请填写互斥规则"));
            } else {
                callback();
            }
        };
        return {
            dataTypeList: commonJson.dataTypeList, //数据类型
            checkBoxList: columns.columnGouyao, //多选框集合
            gradeList: commonJson.gradeList, //级别
            hospitalList:[],//医院集合
            nopassReasonList: [], //审核不通过原因
            fatherId: "", //编辑信息id
            operationType: "", //操作类型
            saveType: "add", //页面类型
            mutexRules: [], //互斥规则
            editDateType: [], //保存编辑前的数据类型
            dataTypeName:"",//数据类型
            rulesFrom: {
                mutex_id: "",
                mutex_name: "",
                rule_type: 0,
                hosp_id: "",
                isAffirm:"1",
                date_type: [10],
                code_rule: "",
                display_rule:"",
                mutex_list: [],
                remark: ""
            },
            ruleValidate: {
                mutex_name: [
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
        //     this.rulesFrom.mutex_id = this.fatherId;
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
                name: "mutexRules.getUpdateRule",
                data: {
                    mutexId: mappedId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.rulesFrom.mutex_name = data.data.mutex_name;
                        self.rulesFrom.rule_type = data.data.rule_type;
                        self.rulesFrom.hosp_id = data.data.hospId+"";
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
                        self.rulesFrom.mutex_list = data.data.mutex_list;
                        self.rulesFrom.remark = data.data.remark;
                        self.rulesFrom.isAffirm=data.data.isAffirm+"";

                        self.editDateType = self.rulesFrom.date_type;
                        self.setColumn(self.rulesFrom.date_type);

                        //互斥规则
                        self.mutexRules = JSON.parse(self.rulesFrom.mutex_list);
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
        setColumn(data) {
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
            var index=this.mutexRules.length;
            if(index>0&&(this.mutexRules[index-1].mutexConditionalOne==""
                ||this.mutexRules[index-1].mutexConditionalOne==" "
                ||this.mutexRules[index-1].mutexConditionalOne==undefined)){
                    this.mutexRules[index-1].mutexConditionalOne="and";
            }
            //互斥规则
            let mutexRulesSon = {
                mutexRelationOne: "",
                mutexValue: "",
                mutexBracket: "",
                mutexText: "",
                mutexConditionalOne: "",
                mutexConditionalTwo: "",
                mutexRelationTwo: ""
            };
            this.mutexRules.push(mutexRulesSon);
        },
        //删除字段
        removeIndex(index) {
            var rlength=this.mutexRules.length
            if (rlength == 1) {
                this.$Message.error("至少要保留一条规则信息");
            } else {
                this.mutexRules.splice(index, 1);
                if (index==rlength-1) {
                    this.mutexRules[rlength-2].mutexConditionalOne="";
                }
                this.createScript();
            }
        },
        //生成脚本
        createScript() {
            this.rulesFrom.code_rule = "";
            this.rulesFrom.display_rule = "";
            this.mutexRules.forEach(a => {
                this.rulesFrom.code_rule +=
                    a.mutexRelationOne +
                    a.mutexValue.split(",")[0] +
                    a.mutexBracket +
                    // a.mutexText +
                    a.mutexText.replace(/\(/g,"#{[").replace(/\)/g,"]}#") +
                    " " +
                    a.mutexConditionalOne +
                    " " +
                    a.mutexRelationTwo +
                    " " +
                    a.mutexConditionalTwo;
            });
            this.mutexRules.forEach(a => {
                this.rulesFrom.display_rule +=
                    a.mutexRelationOne +
                    a.mutexValue.split(",")[1] +
                    a.mutexBracket +
                    a.mutexText +
                    " " +
                    a.mutexConditionalOne +
                    " " +
                    a.mutexRelationTwo +
                    " " +
                    a.mutexConditionalTwo;
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
            this.rulesFrom.mutex_list = [];
            this.mutexRules.forEach(a => {
                let checkOut = {
                    mutexRelationOne: a.mutexRelationOne,
                    mutexValue: a.mutexValue,
                    mutexBracket: a.mutexBracket,
                    mutexText: a.mutexText,
                    mutexConditionalOne: a.mutexConditionalOne,
                    mutexConditionalTwo: a.mutexConditionalTwo,
                    mutexRelationTwo: a.mutexRelationTwo
                };
                this.rulesFrom.mutex_list.push(checkOut);
            });
            this.$refs["addRulesAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name:
                            self.saveType == "add"
                                ? "mutexRules.addRule"
                                : "mutexRules.editRule",
                        data: {
                            // data: self.rulesFrom
                            mutexId: self.fatherId,
                            mutex_name: self.rulesFrom.mutex_name,
                            rule_type: self.rulesFrom.rule_type,
                            hospId: self.rulesFrom.hosp_id,
                            date_type: self.rulesFrom.date_type.join(","),
                            code_rule: self.rulesFrom.code_rule,
                            display_rule:self.rulesFrom.display_rule,
                            isAffirm:self.rulesFrom.isAffirm,
                            mutex_list: JSON.stringify(
                                self.rulesFrom.mutex_list
                            ),
                            remark: self.rulesFrom.remark,
                            state: 1,
                            create_user: Vue.getUser().userName,
                            change_user: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$router.push("/rules/mutex");
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
            this.rulesFrom.nopassReason = "";
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
                name: "mutexRules.editRule",
                data: {
                    mutexId: self.fatherId,
                    mutex_name: self.rulesFrom.mutex_name,
                    rule_type: self.rulesFrom.rule_type,
                    hospId: self.rulesFrom.hosp_id,
                    date_type: self.rulesFrom.date_type.join(","),
                    code_rule: self.rulesFrom.code_rule,
                    mutex_list: self.rulesFrom.mutex_list,
                    remark: self.rulesFrom.remark,
                    state: state,
                    nopassReason: self.rulesFrom.nopassReason,
                    check_user: Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$router.push("/rules/mutex");
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
