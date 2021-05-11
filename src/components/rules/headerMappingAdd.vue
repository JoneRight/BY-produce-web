<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left:0px;">表头映射</h2>
        <div class="mt20">

            <Form :model="rulesFrom" ref="addRulesAdd" :rules="ruleValidate" :label-width="80">
                <FormItem label="级别">
                    <Select v-model="rulesFrom.rule_type" class="cellLength">
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院" prop="hospital" v-if="rulesFrom.rule_type==1">
                    <Select v-model="rulesFrom.hospital" class="cellLength" filterable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" prop="dataType" v-if="saveType=='add'">
                    <CheckboxGroup v-model="rulesFrom.dataType" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="数据类型" prop="dataType" v-if="saveType!='add'">
                    <!-- <CheckboxGroup v-model="rulesFrom.dataType" v-for="item in dataTypeList" :key="item.value" @on-change="setColumn1" style="width:155px;display:inline-block">
                        <Checkbox :label="item.value">{{item.label}}</Checkbox>
                    </CheckboxGroup> -->
                    {{dataTypeName}}
                </FormItem>
                <FormItem label="表头映射">
                    <Button v-if="saveType=='add'" type="text" style="color:#2d8cf0;" @click="addHeader()">+ 新增</Button>
                    <span style="color:red;font-weight:600;margin-left:30%">注：合并列请用“+”拼接映射！例：A+B+C</span>
                    <Table border :columns="headerCol" :data="headerList"></Table>
                </FormItem>
                <FormItem label="不通过原因" v-if="saveType=='audit'">
                    <Select v-model="rulesFrom.nopassReason" class="cellLength" filterable>
                        <Option v-for="item in nopassReasonList" :value="item.unauditreasonName" :key="item.unauditreasonId">{{ item.unauditreasonName }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="saveType!='audit'">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="save" v-if="saveType=='add'">保存</Button>
                    <Button type="primary" @click="save" v-if="saveType=='update'">保存</Button>
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
    name: "headerMappingAdd",
    data() {
        const validateData = (rule, value, callback) => {
            if (value.length < 1) {
                return callback(new Error("请选择数据类型"));
            } else {
                callback();
            }
        };
        return {
            dataTypeList: [], //数据类型
            checkBoxList: [], //多选框集合
            hospitalList:[],//医院集合
            gradeList: commonJson.gradeList, //级别
            nopassReasonList: [], //审核不通过原因
            fatherId: "", //编辑信息id
            operationType: "", //操作类型
            saveType: "add", //页面类型
            editDateType: [], //保存编辑前的数据类型
            dataTypeName:"",//数据类型
            pitchHead:[],//选中的列名
            rulesFrom: {
                id: "",
                rule_type: 1,
                hospital: "",
                dataType: [10],
                nopassReason: ""
            },
            ruleValidate: {
                hospital: [
                    { required: true, message: "请选择医院", trigger: "blur" }
                ],
                dataType: [{ validator: validateData, trigger: "blur" }]
            },
            passName: {
                title: "过滤",
                databaseFieldName: "pass_name"
            },
            headerCol: [
                {
                    title: "标准字段",
                    key: "base_head_name",
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "Select",
                            {
                                props: {
                                    value: this.backHeaderList[params.index]
                                        .base_head_name,
                                        transfer:true
                                    // style: "width:100%;height:33px;"
                                },
                                on: {
                                    input: event => {
                                        this.backHeaderList[
                                            params.index
                                        ].base_head_name = event;
                                        // 显示数据类型
                                        this.updateDate();


                                        // if (event=="pass_name") {
                                        //     this.dataTypeList=[].concat(commonJson.dataTypeList);
                                        // }else{
                                        //     var jsondata=JSON.stringify(this.dataTypeList);
                                        //     //判断是否包含该字段
                                        //     if (JSON.stringify(columns.columnGouyao).indexOf(event)>-1) {
                                        //         if (jsondata.indexOf(10)<0) {
                                        //             this.dataTypeList.push(commonJson.dataTypeList[0]);
                                        //         }
                                        //     }else{
                                        //         var ind=0;
                                        //         this.dataTypeList.forEach(m=>{
                                        //             if (m.value==10) {
                                        //                 this.dataTypeList.splice(ind,1);
                                        //             }
                                        //             ind++;
                                        //         });
                                        //     }
                                        //     if (JSON.stringify(columns.columnMenjizhen).indexOf(event)>-1) {
                                        //         if (jsondata.indexOf(20)<0) {
                                        //             this.dataTypeList.push(commonJson.dataTypeList[0]);
                                        //         }
                                        //     }else{
                                        //         var ind=0;
                                        //         this.dataTypeList.forEach(m=>{
                                        //             if (m.value==20) {
                                        //                 this.dataTypeList.splice(ind,1);
                                        //             }
                                        //             ind++;
                                        //         });
                                        //     }
                                        //     if (JSON.stringify(columns.columnBingan).indexOf(event)>-1) {
                                        //         if (jsondata.indexOf(30)<0) {
                                        //             this.dataTypeList.push(commonJson.dataTypeList[0]);
                                        //         }
                                        //     }else{
                                        //         var ind=0;
                                        //         this.dataTypeList.forEach(m=>{
                                        //             if (m.value==30) {
                                        //                 this.dataTypeList.splice(ind,1);
                                        //             }
                                        //             ind++;
                                        //         });
                                        //     }
                                        //     if (JSON.stringify(columns.columnYizhu).indexOf(event)>-1) {
                                        //         if (jsondata.indexOf(40)<0) {
                                        //             this.dataTypeList.push(commonJson.dataTypeList[0]);
                                        //         }
                                        //     }else{
                                        //         var ind=0;
                                        //         this.dataTypeList.forEach(m=>{
                                        //             if (m.value==40) {
                                        //                 this.dataTypeList.splice(ind,1);
                                        //             }
                                        //             ind++;
                                        //         });
                                        //     }
                                        // }


                                    }
                                }
                            },
                            this.checkBoxList.map(function(type) {
                                return h(
                                    "Option",
                                    {
                                        props: { value: type.databaseFieldName }
                                    },
                                    type.title
                                );
                            })
                        );
                    }
                },
                {
                    title: "非标准字段",
                    key: "head_name",
                    align: "center",
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                value: this.backHeaderList[params.index]
                                    .head_name,
                                // style: "width:100%;height:25px;border:0;",
                                maxlength: 50
                            },
                            on: {
                                input: event => {
                                    this.backHeaderList[
                                        params.index
                                    ].head_name = event;
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
                                    .base_head_name,
                                // style: "width:100%;height:25px;border:0",
                                readonly: true
                            }
                            // on: {
                            //     input: event => {
                            //         this.backHeaderList[
                            //             params.index
                            //         ].en_column_name = event;
                            //     }
                            // }
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
                                                if (this.saveType == "add") {
                                                    this.backHeaderList.splice(
                                                        params.index,
                                                        1
                                                    );
                                                    this.headerList.splice(
                                                        params.index,
                                                        1
                                                    );
                                                } else {
                                                    this.headerList.splice(
                                                        params.index,
                                                        1
                                                    );
                                                }
                                                
                                                //显示数据类型
                                                this.updateDate();
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
                    base_head_name: "",
                    head_name: "",
                    en_column_name: ""
                }
            ], //返回表头映射数据
            headerList: [
                {
                    base_head_name: "",
                    // head_name: "",
                    en_column_name: ""
                }
            ]
        };
    },
    mounted() {
        this.getHospitalList(); //获取医院数据
        //数据类型
        this.dataTypeList=this.dataTypeList.concat(commonJson.dataTypeList);
        
        //添加过滤选项到数组首位
        this.checkBoxList=this.checkBoxList.concat(columns.columnGouyao);
        if (this.checkBoxList.length>0&&this.checkBoxList[0].title!= "过滤") {
            this.checkBoxList.unshift(this.passName);
        }
        this.fatherId = this.$route.query.mappedId;
        this.operationType = this.$route.query.operationType;
        // if (typeof this.fatherId === "undefined") {
        // } else {
        //     this.saveType = "update"; //修改页面类型
        //     this.rulesFrom.id = this.fatherId;
        //     this.getUpdataRule(this.fatherId);
        // }


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
                name: "headerMapping.getUpdateRule",
                data: {
                    headMappedId: mappedId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.rulesFrom.rule_type = data.data.rule_type;
                        self.rulesFrom.hospital = data.data.hospId + "";
                        self.rulesFrom.dataType = data.data.date_type
                            .split(",")
                            .map(Number);
                        // self.headerList = data.data.headerList;

                        self.dataTypeName="";
                        if (self.rulesFrom.dataType.indexOf(10)>-1) {
                            self.dataTypeName+="购药，"
                        }
                        if (self.rulesFrom.dataType.indexOf(20)>-1) {
                            self.dataTypeName+="门急诊，"
                        }
                        if (self.rulesFrom.dataType.indexOf(30)>-1) {
                            self.dataTypeName+="病案，"
                        }
                        if (self.rulesFrom.dataType.indexOf(40)>-1) {
                            self.dataTypeName+="医嘱，"
                        }
                        self.dataTypeName=self.dataTypeName.substring(0,self.dataTypeName.length-1);

                        self.headerList = [
                            {
                                base_head_name: data.data.base_head_name,
                                head_name: data.data.head_name,
                                en_column_name: data.data.base_head_name
                            }
                        ];

                        self.backHeaderList = self.headerList.assign();

                        self.editDateType = self.rulesFrom.dataType;
                        self.setColumn(self.rulesFrom.dataType, "update");
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
            this.rulesFrom.dataType = JSON.parse(
                JSON.stringify(this.editDateType)
            );
        },
        //设置显示下拉内容
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
            //添加过滤选项到数组首位
            this.checkBoxList.unshift(this.passName);
        },
        //添加列
        addHeader() {
            if (this.saveType == "add") {
                this.headerList.push(this.headerList[0]);
            } else {
                let addHeaderList = {
                    base_head_name: "",
                    head_name: "",
                    en_column_name: ""
                };
                this.headerList.push(addHeaderList);
            }
            for (
                let index = this.backHeaderList.length;
                index < this.headerList.length;
                index++
            ) {
                let addHeaderList = {
                    base_head_name: "",
                    head_name: "",
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
            if (this.rulesFrom.rule_type == 0) {
                this.saveSecond();
            } else {
                this.$refs["addRulesAdd"].validate(valid => {
                    if (valid) {
                        this.saveSecond();
                    }
                });
            }
        },
        saveSecond() {
            let state = true;
            this.backHeaderList.forEach(a => {
                if (
                    a.base_head_name == "" ||
                    // a.en_column_name == "" ||
                    a.head_name == ""
                ) {
                    this.$Message.error("表头映射数据内容不能为空");
                    state = false;
                }
            });
            if (state) {
                var self = this;
                Vue.ajax.send({
                    name:
                        self.saveType == "add"
                            ? "headerMapping.addRule"
                            : "headerMapping.editRule",
                    data: {
                        // fromData: self.rulesFrom,
                        headMappedId: self.fatherId,
                        rule_type: self.rulesFrom.rule_type,
                        date_type: self.rulesFrom.dataType.join(","),
                        hospId: self.rulesFrom.hospital,
                        state: 1,
                        headerData: self.backHeaderList,
                        create_user: Vue.getUser().userName,
                        change_user: Vue.getUser().userName
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$router.push("/rules/headerMapping");
                            // self.$Message.success("操作成功");
                            let mess=data.message.substring(0,data.message.length-2).split("##");
                            console.log(111)
                            for (let i = 0; i < mess.length; i++) {
                                if (mess[i].substring(mess[i].length-1,mess[i].length)=='0') {
                                    self.$Message.success(mess[i].substring(0,mess[i].length-1));
                                }else{
                                    self.$Message.error(mess[i].substring(0,mess[i].length-1));
                                }
                            }
                        } else {
                            self.$Modal.error({
                            title: "失败",
                                content: data.message
                            });
                        }
                    }
                });
            }
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
                name: "headerMapping.editRule",
                data: {
                    headMappedId: self.fatherId,
                    rule_type: self.rulesFrom.rule_type,
                    date_type: self.rulesFrom.dataType.join(","),
                    hospId: self.rulesFrom.hospital,
                    nopassReason: self.rulesFrom.nopassReason,
                    state: state,
                    headerData: self.backHeaderList,
                    check_user: Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$router.push("/rules/headerMapping");
                        self.$Message.success("操作成功。");
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //判断显示状态
        updateDate(){
            this.pitchHead=[];//初始化
            this.backHeaderList.forEach(m=>{
                this.pitchHead.push(m.base_head_name);
            })

            if (this.pitchHead.length==1&&this.pitchHead[0]=="pass_name") {
                this.dataTypeList=[].concat(commonJson.dataTypeList);
            }else{
                var gouyao=true;
                var menjizhen=true;
                var bingan=true;
                var yizhu=true;
                this.pitchHead.forEach(m=>{
                    //判断是否包含该字段
                    if (m!="pass_name"){
                        if (JSON.stringify(columns.columnGouyao).indexOf(m)<0) {
                            gouyao=false;
                        }
                        if (JSON.stringify(columns.columnMenjizhen).indexOf(m)<0) {
                            menjizhen=false;
                        }
                        if (JSON.stringify(columns.columnBingan).indexOf(m)<0) {
                            bingan=false;
                        }
                        if (JSON.stringify(columns.columnYizhu).indexOf(m)<0) {
                            yizhu=false;
                        }
                    }
                })
                //数据类型
                this.dataTypeList=[];
                if (gouyao) {
                    this.dataTypeList.push(commonJson.dataTypeList[0]);
                }
                if (menjizhen) {
                    this.dataTypeList.push(commonJson.dataTypeList[1]);
                }
                if (bingan) {
                    this.dataTypeList.push(commonJson.dataTypeList[2]);
                }
                if (yizhu) {
                    this.dataTypeList.push(commonJson.dataTypeList[3]);
                }
            }
        }
    }
};
</script>
        