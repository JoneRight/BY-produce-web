<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left:0px;">查重规则</h2>
        <div class="mt20">
            <Form :model="rulesFrom" ref="addRulesAdd" :rules="ruleValidate" :label-width="100">
                <FormItem label="名称" prop="check_repeat_name">
                    <Input v-model.trim="rulesFrom.check_repeat_name" :maxlength="10" class="cellLength" />
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
                <FormItem label="数据类型" prop="date_type" v-if="saveType=='add'">
                    <CheckboxGroup v-model="rulesFrom.date_type" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="查重字段" prop="checkAllGroup" v-if="saveType=='add'">
                    <CheckboxGroup v-model="rulesFrom.checkAllGroup" v-for="item in checkBoxList" :key="item.key" style="width:155px;display:inline-block">
                        <Checkbox :label="item.databaseFieldName">{{item.title}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="数据类型" prop="date_type" v-if="saveType!='add'">
                    <!-- <CheckboxGroup v-model="rulesFrom.date_type" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn1" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup> -->
                    <span>{{dataTypeName}}</span>
                </FormItem>
                <FormItem label="查重字段" prop="checkAllGroup" v-if="saveType!='add'">
                    <!-- <CheckboxGroup v-model="rulesFrom.checkAllGroup" v-for="item in checkBoxList" :key="item.key" @on-change="setColumn1" style="width:155px;display:inline-block">
                        <Checkbox :label="item.databaseFieldName">{{item.title}}</Checkbox>
                    </CheckboxGroup> -->
                    <span>{{columnsName}}</span>
                </FormItem>
                <FormItem label="重复率阈值" prop="repeat_rate">
                    <Input v-model.trim="rulesFrom.repeat_rate" :maxlength="3" class="cellLength" />
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
    name: "duplicateCheckAdd",
    data() {
        const validateData = (rule, value, callback) => {
            if (value.length < 1) {
                return callback(new Error("请选择数据类型"));
            } else {
                callback();
            }
        };
        const validateCheck = (rule, value, callback) => {
            if (value.length < 1) {
                return callback(new Error("请选择校验字段"));
            } else {
                callback();
            }
        };
        return {
            dataTypeList: commonJson.dataTypeList, //数据类型
            checkBoxList: columns.columnGouyao, //多选框集合
            gradeList: commonJson.gradeList, //级别
            nopassReasonList: [], //审核不通过原因
            oldSymbolList: [], //特殊字符
            hospitalList:[],//医院数组
            fatherId: "", //编辑信息id
            operationType: "", //操作类型
            saveType: "add", //页面类型
            editCheckAllGroup: [], //保存编辑前的数据列
            editDateType: [], //保存编辑前的数据类型
            dataTypeName:"",//数据类型
            columnsName:"",//字段名称
            rulesFrom: {
                special_symbol_id: "",
                check_repeat_name: "",
                rule_type: 0,
                hosp_id: "",
                date_type: [10],
                checkAllGroup: [],
                repeat_rate: "",
                remark: "",
                nopassReason: ""
            },
            ruleValidate: {
                check_repeat_name: [
                    { required: true, message: "名称不能为空", trigger: "blur" }
                ],
                hosp_id: [
                    { required: true, message: "请选择医院", trigger: "blur" }
                ],
                repeat_rate: [
                    {
                        required: true,
                        message: "重复率阈值不能为空",
                        trigger: "blur"
                    },
                    {
                        pattern: /^(?:0|[1-9][0-9]?|100)$/,
                        message:
                            "请输入0-100区间内的重复率阈值",
                        trigger: "blur"
                    }
                    // {type: 'number',pattern:/^(\d{1,2}(\.\d{1,2})?|100)$/, message:'请输入0-100区间内的重复率阈值，且小数点后不能超过两位', trigger:'blur'}
                ],
                date_type: [{ validator: validateData, trigger: "blur" }],
                checkAllGroup: [{ validator: validateCheck, trigger: "blur" }]
            }
        };
    },
    mounted() {
        this.getHospitalList(); //获取医院数据

        // this.fatherId = this.$route.query.mappedId;
        // if (typeof this.fatherId === "undefined") {
        // } else {
        //     this.saveType = "update"; //修改页面类型
        //     this.rulesFrom.special_symbol_id = this.fatherId;
        //     this.getUpdataRule(this.fatherId);
        //     // this.getHospitalList(); //获取医院数据
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
            // this.getauditList();
        }
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
                name: "duplicateCheck.getUpdateRule",
                data: {
                    checkRepeatId: mappedId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.rulesFrom.check_repeat_name =
                            data.data.check_repeat_name;
                        self.rulesFrom.rule_type = data.data.rule_type;
                        self.rulesFrom.hosp_id = data.data.hospId + "";
                        self.rulesFrom.date_type = data.data.date_type
                            .split(",")
                            .map(Number);

                        self.dataTypeName="";
                        self.columnsName="";
                        if (self.rulesFrom.date_type.indexOf(10)>-1) {
                            self.dataTypeName+="购药，";
                            for (let index = 0; index < columns.columnGouyao.length; index++) {
                                if (data.data.columns_name.indexOf("["+columns.columnGouyao[index].databaseFieldName+"]")>-1) {
                                    self.columnsName+=columns.columnGouyao[index].title+"，";
                                }
                            }
                        }else if (self.rulesFrom.date_type.indexOf(20)>-1) {
                            self.dataTypeName+="门急诊，";
                            for (let index = 0; index < columns.columnMenjizhen.length; index++) {
                                if (data.data.columns_name.indexOf(columns.columnMenjizhen[index].databaseFieldName)>-1) {
                                    self.columnsName+=columns.columnMenjizhen[index].title+"，";
                                }
                            }
                        }else if (self.rulesFrom.date_type.indexOf(30)>-1) {
                            self.dataTypeName+="病案，";
                            for (let index = 0; index < columns.columnBingan.length; index++) {
                                if (data.data.columns_name.indexOf(columns.columnBingan[index].databaseFieldName)>-1) {
                                    self.columnsName+=columns.columnBingan[index].title+"，";
                                }
                            }
                        }else if (self.rulesFrom.date_type.indexOf(40)>-1) {
                            self.dataTypeName+="医嘱，";
                            for (let index = 0; index < columns.columnYizhu.length; index++) {
                                if (data.data.columns_name.indexOf(columns.columnYizhu[index].databaseFieldName)>-1) {
                                    self.columnsName+=columns.columnYizhu[index].title+"，";
                                }
                            }
                        }
                        self.dataTypeName=self.dataTypeName.substring(0,self.dataTypeName.length-1);
                        self.columnsName=self.columnsName.substring(0,self.columnsName.length-1);


                        self.rulesFrom.checkAllGroup = data.data.columns_name.split(
                            ","
                        );
                        self.rulesFrom.repeat_rate = data.data.repeat_rate + "";
                        self.rulesFrom.remark = data.data.remark;

                        self.editDateType = self.rulesFrom.date_type;
                        self.editCheckAllGroup = self.rulesFrom.checkAllGroup;
                        self.setColumn(self.rulesFrom.date_type, "update");
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
            this.rulesFrom.checkAllGroup = JSON.parse(
                JSON.stringify(this.editCheckAllGroup)
            );
            this.rulesFrom.date_type = JSON.parse(
                JSON.stringify(this.editDateType)
            );
        },
        //设置显示的字段
        setColumn(data, type) {
            if (type != "update") {
                this.rulesFrom.checkAllGroup = [];
            }
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
        //取消
        cancel() {
            this.$router.back();
        },
        //保存
        save() {
            this.$refs["addRulesAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name:
                            self.saveType == "add"
                                ? "duplicateCheck.addRule"
                                : "duplicateCheck.editRule",
                        data: {
                            // data: self.rulesFrom
                            checkRepeatId: self.fatherId,
                            rule_type: self.rulesFrom.rule_type,
                            hospId: self.rulesFrom.hosp_id,
                            date_type: self.rulesFrom.date_type.join(","),
                            check_repeat_name: self.rulesFrom.check_repeat_name,
                            checkRepeatList: self.rulesFrom.checkAllGroup,
                            columns_name:self.rulesFrom.checkAllGroup.join(",").replace(/\[/g,"").replace(/\]/g,""),
                            repeat_rate: self.rulesFrom.repeat_rate,
                            state: 1,
                            remark: self.rulesFrom.remark,
                            create_user: Vue.getUser().userName,
                            change_user: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$router.push("/rules/duplicateCheck");
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
                name: "duplicateCheck.editRule",
                data: {
                    checkRepeatId: self.fatherId,
                    check_repeat_name: self.rulesFrom.check_repeat_name,
                    rule_type: self.rulesFrom.rule_type,
                    hospId: self.rulesFrom.hosp_id,
                    date_type: self.rulesFrom.date_type.join(","),
                    checkRepeatList: self.rulesFrom.checkAllGroup,
                    repeat_rate: self.rulesFrom.repeat_rate,
                    state: state,
                    remark: self.rulesFrom.remark,
                    nopassReason: self.rulesFrom.nopassReason,
                    check_user: Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$router.push("/rules/duplicateCheck");
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