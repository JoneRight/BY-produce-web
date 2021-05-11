<template>
    <div class="bg-white p20">
        <h2 class="common-title">映射规则</h2>
        <div class="mt20">
            <Form ref="rule" :model="rule" :rules="ruleValidate" :label-width="80">
                <FormItem label="级别" style="margin-top:-30px;">
                    <!-- <Select v-model="rule.map_type" @on-change='updataIsHosp' class="itemWidth">
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select> -->
                    <span>{{rule.map_type==0?"通用":"非通用"}}</span>
                </FormItem>
                <FormItem label="医院" v-if="rule.map_type==1">
                    <!-- <Select v-model="rule.hosp_id" class="itemWidth" filterable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select> -->
                    <span>{{rule.hosp_name}}</span>
                </FormItem>
                <FormItem label="映射字段">
                    <!-- <div class="itemWidth">
                        <RadioGroup v-model="rule.radioSelect">
                            <span v-for="item in radio" :key="item.label">
                                <Radio :label="item.lable" style="width:90px;">{{item.title}}</Radio>
                            </span>
                        </RadioGroup>
                    </div> -->
                    <span>{{rule.mapSortName}}</span>
                </FormItem>
                <FormItem label="映射数据">
                    <!-- <Input v-model="rule.m_name" class="itemWidth" @keyup.enter.native="search(rule.m_name)" :maxlength="500" />
                    <Input style="display:none;" />
                    <Button @click="search(rule.m_name)">检索</Button> -->
                    <span>{{rule.m_name}}</span>
                </FormItem>
                <FormItem label="标准数据">
                    <!-- <Input v-model="rule.m_name" class="itemWidth" @keyup.enter.native="search(rule.m_name)" :maxlength="500" />
                    <Input style="display:none;" />
                    <Button @click="search(rule.m_name)">检索</Button> -->
                    <span>{{rule.b_name}}</span>
                </FormItem>
                <FormItem style="margin-left:-60px;">
                    <Input v-model="rule.search_name" style="width:400px;" @keyup.enter.native="search(rule.search_name)" :maxlength="500" />
                    <Input style="display:none;" />
                    <Button @click="search(rule.search_name)">检索</Button>
                </FormItem>
                <FormItem label="不通过原因" v-if="saveType=='audit'">
                    <Select v-model="rule.nopassReason" class="itemWidth" filterable>
                        <Option v-for="item in nopassReasonList" :value="item.unauditreasonName" :key="item.unauditreasonId">{{ item.unauditreasonName }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="saveType=='audit'">
                    <Button type="primary" @click="auditYes">通过</Button>
                    <Button type="error" @click="auditNo">驳回</Button>
                </FormItem>
            </Form>
        </div>
        <div class="mt5">
            <Table border :columns="dataCol" :data="dataList" style="margin-top: 10px;"></Table>
        </div>
        <div class="mt20 text-center mb5">
            <Page :total="mapPageConfig.totalItemCount" @on-change='changePageMap' transfer show-sizer @on-page-size-change="changeSizeMap" />
        </div>
    </div>
</template>

<style>
.itemWidth {
    width: 400px;
}
</style>

<script>
import Vue from "vue";
import commonJson from "@/assets/data/business/common.json";
import radio from "@/assets/data/rules/radio.json";
import columns from "@/assets/data/rules/column.json";

export default {
    data() {
        const config = require("./config");
        return {
            gradeList: commonJson.gradeList,
            hospitalList: [], //医院
            nopassReasonList: [], //审核不通过原因
            radio: radio.radioList,
            isHosp: false, //医院字段显示状态
            Operation: {}, //操作列,
            ruleId: "", //绑定的标准数据id,
            fatherId: "", //父页面id
            config: config, //路由配置文件
            editInfor: {}, //父数据
            saveType: "", //保存类型
            keyword: "",
            rule: {
                id: "",
                map_type: "0",
                hosp_id: "",
                hosp_name: "",
                m_name: "",
                b_id: "",
                b_name: "",
                mapSort: "",
                mapSortName: "",
                nopassReason: "",
                search_name: "" //检索条件
            },
            ruleValidate: {
                hosp_id: [
                    { required: true, message: "请选择医院", trigger: "blur" }
                ],
                m_name: [
                    {
                        required: true,
                        message: "请输入映射数据",
                        trigger: "blur"
                    }
                ]
            },
            mapPageConfig: {
                pageNum: 1,
                pageSize: 10,
                totalItemCount: 1
            },
            dataCol: [],
            dataList: []
        };
    },
    mounted() {
        this.saveType = this.$route.query.operationType; //修改页面类型

        //编辑信息
        this.rule.id = this.$route.query.mId;
        this.ruleId = this.$route.query.bId;
        this.rule.map_type = parseInt(this.$route.query.mapType);
        this.rule.hosp_id = this.$route.query.hospId + "";
        this.rule.hosp_name = this.$route.query.hospName;
        this.rule.m_name = this.$route.query.mName;
        this.rule.b_id = this.$route.query.bId;
        this.rule.b_name = this.$route.query.standardName;
        this.rule.mapSort = this.$route.query.mapSort;
        this.rule.mapSortName = this.$route.query.mapSortName;
        this.rule.search_name=this.rule.b_name;

        //查询标准数据
        this.search(this.rule.b_name);
        // this.getUpdataRule(this.fatherId);
        if (this.$route.query.operationType == "audit") {
            this.getauditList();
        }

        this.getHospitalList(); //获取医院数据
        this.Operation = {
            title: "操作",
            width: 150,
            align: "center",
            key: "action",
            render: (h, params) => {
                return h("div", [
                    h(
                        "Button",
                        {
                            props: {
                                type: "primary",
                                size: "small"
                            },
                            style: {
                                display:
                                    params.row.standardId == this.ruleId.replace(/\#/g,"")
                                        ? "none"
                                        : "inline-block"
                            },
                            on: {
                                click: () => {
                                    this.skipAddRule(
                                        params.row.standardId,
                                        params.index
                                    );
                                }
                            }
                        },
                        "创建映射规则"
                    ),
                    h(
                        "Button",
                        {
                            props: {
                                type: "error",
                                size: "small"
                            },
                            style: {
                                display:
                                    params.row.standardId == this.ruleId.replace(/\#/g,"")
                                        ? "inline-block"
                                        : "none"
                            },
                            on: {
                                click: () => {
                                    // this.delRule();
                                    this.ruleId = "";
                                }
                            }
                        },
                        "删除映射规则"
                    )
                ]);
            }
        };
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
                            title: "失败",
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
        // //获取编辑信息
        // getUpdataRule(mappedId) {
        //     var self = this;
        //     Vue.ajax.send({
        //         name: "ruleDataMapped.getUpdata",
        //         data: {
        //             ruleId: mappedId
        //         },
        //         success: function(data) {
        //             if (!!data && data.code == "0") {
        //                 self.rule.map_type = data.data.map_type;
        //                 self.rule.hosp_id = data.data.hosp_id;
        //                 self.rule.radioSelect = data.data.radioSelect;
        //                 self.rule.m_name = data.data.m_name;
        //                 self.ruleId = data.data.rule_id;

        //                 self.search(self.rule.m_name);
        //             } else {
        //                 self.$Modal.error({
        //                     title: "失败",
        //                     content: data.message
        //                 });
        //             }
        //         }
        //     });
        // },
        //检索
        search(keyword) {
            this.keyword = keyword;
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.standardQuery",
                data: {
                    pageIndex: self.mapPageConfig.pageNum, //页码
                    pageSize: self.mapPageConfig.pageSize, //每页条数
                    mapType: self.rule.mapSort,
                    bId: self.ruleId,
                    keyword: keyword
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.getColumn(self.rule.mapSort);
                        self.dataList = data.data.dataList;
                        self.mapPageConfig.pageNum = data.data.currentPageIndex;
                        if (
                            self.rule.mapSort == "drug" ||
                            self.rule.mapSort == "diagnostic"
                        ) {
                            self.mapPageConfig.totalItemCount =
                                5 * self.mapPageConfig.pageSize;
                        } else {
                            self.mapPageConfig.totalItemCount =
                                data.data.totalItemCount;
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
        //切页(标准)
        changePageMap(currentPage) {
            this.mapPageConfig.pageNum = currentPage;
            this.search(this.keyword);
        },
        //显示条数（标准）
        changeSizeMap(num) {
            this.mapPageConfig.pageSize = num;
            this.search(this.keyword);
        },
        //医院显示状态
        updataIsHosp(value) {
            if (value == "0") {
                this.isHosp = false;
            } else {
                this.isHosp = true;
            }
        },
        //创建规则
        skipAddRule(id, index) {
            // if (this.ruleId == "") {
                this.rule.b_id = id;
                this.ruleId = id;
                if (this.saveType == "update") {
                    this.editRule();
                } else {
                    // this.dataList.splice(index, 1, params);
                }
            // } else {
            //     this.$Modal.error({
            //         title: "失败",
            //         content: "每条规则只能绑定一条标准数据。"
            //     });
            // }
        },
        addRule(mapId) {
            var self = this;
            this.$refs["rule"].validate(valid => {
                if (valid) {
                    Vue.ajax.send({
                        name: "ruleDataMappedAddRule",
                        data: {
                            fromData: self.rule,
                            ruleId: mapId
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.success("新增映射关系成功。");
                                self.$router.push({
                                    path: "/rules/dataMapped"
                                });
                            } else {
                                self.$Modal.error({
                                    title: "失败",
                                    content: data.message
                                });
                            }
                        }
                    });
                } else {
                    this.$Message.error("请完善信息!");
                }
            });
        },
        editRule() {
            var self = this;
            Vue.ajax.send({
                name: "ruleDataMappedEditRule",
                data: {
                    mIdList: [self.rule.id],
                    mapType: self.rule.rule_type,
                    hospId: self.rule.hosp_id,
                    mapData: self.rule.m_name,
                    state: 1,
                    baseId: self.rule.b_id
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("编辑映射关系成功。");
                        self.$router.push({
                            path: "/rules/dataMapped/"+self.rule.mapSort,
                        });
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
            //     } else {
            //         this.$Message.error("请完善信息!");
            //     }
            // });
        },
        //审核通过
        auditYes() {
            this.audit(2);
            this.rule.nopassReason = "";
        },
        //审核不通过
        auditNo() {
            if (
                this.rule.nopassReason == null ||
                this.rule.nopassReason == ""
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
                name: "ruleDataMappedEditRule",
                data: {
                    mId: self.rule.id,
                    mapType: self.rule.map_type,
                    hospId: self.rule.hosp_id,
                    mapData: self.rule.m_name,
                    state: state,
                    baseId: self.rule.b_id,
                    nopassReason: self.rule.nopassReason
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$router.push({
                            path: "/rules/dataMapped"
                        });
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
        //删除规则
        delRule() {
            alert(1);
        },
        //根据单选显示不同的列
        getColumn(name) {
            var real1 = "";
            var real2 = "";
            var real3 = "";
            this.dataCol.splice(0, this.dataCol.length);
            var type = this.rule.mapSort;
            if (type == "sex") {
                //性别
                real1 = "/map/sex/add";
                real2 = "/map/sex/editByKey";
                real3 = "/map/sex/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_SEX);
            } else if (type == "age") {
                //年龄
                real1 = "/map/age/add";
                real2 = "/map/age/editByKey";
                real3 = "/map/age/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_AGE);
            } else if (type == "section") {
                //科室
                real1 = "/map/section/add";
                real2 = "/map/section/editByKey";
                real3 = "/map/section/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_SECTION);
            } else if (type == "payment_method") {
                //付费方式
                real1 = "/map/payway/add";
                real2 = "/map/payway/editByKey";
                real3 = "/map/payway/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_PAYWAY);
            } else if (type == "doctor_title") {
                //职称
                real1 = "/map/doctorTitle/add";
                real2 = "/map/doctorTitle/editByKey";
                real3 = "/map/doctorTitle/editByKey";
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_DOCTORTITLE
                );
            } else if (type == "dosage") {
                //剂量
                real1 = "/map/dosage/add";
                real2 = "/map/dosage/editByKey";
                real3 = "/map/dosage/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_DOSE);
            } else if (type == "diagnostic") {
                //诊断
                real1 = "/map/diagnosis/add";
                real2 = "/map/diagnosis/editByKey";
                real3 = "/map/diagnosis/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_DIAGNOSIS);
            } else if (type == "path_drug") {
                //给药途径
                real1 = "/map/pathDrug/add";
                real2 = "/map/pathDrug/editByKey";
                real3 = "/map/pathDrug/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_PATHDRUG);
            } else if (type == "usage") {
                //用法
                real1 = "/map/usage/add";
                real2 = "/map/usage/editByKey";
                real3 = "/map/usage/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_USAGE);
            } else if (type == "wound") {
                //切口
                real1 = "/map/wound/add";
                real2 = "/map/wound/editByKey";
                real3 = "/map/wound/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_WOUND);
            } else if (type == "healing") {
                //愈合
                real1 = "/map/healing/add";
                real2 = "/map/healing/editByKey";
                real3 = "/map/healing/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_HEALING);
            } else if (type == "admission_of") {
                //入院情况
                real1 = "/map/admission/add";
                real2 = "/map/admission/editByKey";
                real3 = "/map/admission/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_ADMISSION);
            } else if (type == "doctor_advice_type") {
                //医嘱
                real1 = "/map/advice/add";
                real2 = "/map/advice/editByKey";
                real3 = "/map/advice/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_ADVICE);
            } else if (type == "drug_formulation") {
                //剂型
                real1 = "/map/drugForm/add";
                real2 = "/map/drugForm/editByKey";
                real3 = "/map/drugForm/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_DRUGFORM);
            } else if (type == "drug_manufacturers") {
                //厂家
                real1 = "/map/manufacturer/add";
                real2 = "/map/manufacturer/editByKey";
                real3 = "/map/manufacturer/editByKey";
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_MANUFACTURER
                );
            } else if (type == "operation") {
                //手术编码
                real1 = "/map/operation/add";
                real2 = "/map/operation/editByKey";
                real3 = "/map/operation/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_OPERATION);
            } else if (type == "drug_generic_name") {
                //通用名
                real1 = "/map/genericName/add";
                real2 = "/map/genericName/editByKey";
                real3 = "/map/genericName/editByKey";
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_GENERICNAME
                );
            } else if (type == "treatment_card") {
                //就诊号
                real1 = "/map/treatmentCard/add";
                real2 = "/map/treatmentCard/editByKey";
                real3 = "/map/treatmentCard/editByKey";
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_TREATMENT_CARD
                );
            } else if (type == "treatment_result_infect") {
                //治疗结果
                real1 = "/map/treatResult/add";
                real2 = "/map/treatResult/editByKey";
                real3 = "/map/treatResult/editByKey";
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_TREATRESULT
                );
            } else if (type == "drug_trade_name") {
                //商品名称
                real1 = "/map/tradeName/add";
                real2 = "/map/tradeName/editByKey";
                real3 = "/map/tradeName/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_TRADENAME);
            } else if (type == "medical_record") {
                //病案号
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_MEDICAL_RECORD
                );
            } else if (type == "drug_wholesale") {
                //批发企业
                real1 = "/map/wholeSale/add";
                real2 = "/map/wholeSale/editByKey";
                real3 = "/map/wholeSale/editByKey";
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_SALEENTERPRISE
                );
            } else if (type == "drug_spec") {
                //规格（药品）
                real1 = "/map/drugSpec/add";
                real2 = "/map/drugSpec/editByKey";
                real3 = "/map/drugSpec/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_DRUGSPEC);
            } else if (type == "packing_quantity") {
                //包装（规格）
                real1 = "/map/packageSpec/add";
                real2 = "/map/packageSpec/editByKey";
                real3 = "/map/packageSpec/editByKey";
                this.dataCol.push.apply(
                    this.dataCol,
                    columns.T_MAP_PACKAGESPEC
                );
            } else if (type == "doctorId") {
                //工号（医生）
                real1 = "/map/doctorId/add";
                real2 = "/map/doctorId/editByKey";
                real3 = "/map/doctorId/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_DOCTOR_ID);
            } else if (type == "drug") {
                //药品
                real1 = "/map/mapdrug/add";
                real2 = "/map/mapdrug/editByKey";
                real3 = "/map/mapdrug/editByKey";
                this.dataCol.push.apply(this.dataCol, columns.T_MAP_DRUG);
            } else {
                this.dataCol = [];
            }

            if (this.dataCol.length > 0) {
                //添加操作列
                this.dataCol.push(this.Operation);
            }

            this.config.default.urls.ruleDataMappedAddRule.real = real1;
            this.config.default.urls.ruleDataMappedEditRule.real = real2;
            this.config.default.urls.standardList.real = real3;
        }
    }
};
</script>

