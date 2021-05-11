<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">换算规则</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospital" style="width: 120px;" filterable clearable>
                        <Option v-for="item in queryhospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" :label-width="60">
                    <Select v-model="searchForm.dataType" style="width: 120px;" clearable>
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.state" style="width: 120px;" clearable>
                        <Option v-for="item in ruleStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <Button v-authorize="'RulesConvertAdd'" type="primary" @click="addData()" style="float:right">+ 新增</Button>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'RulesConvertList'" :columnConfig='dataCol' :columnDatas='dataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in dataCol" :key="colIndex" class="ellipsis">
                        <!-- {{item[colData.name]}} -->
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'RulesConvertAudit'" v-if="item['state']==1" icon="md-checkmark-circle" size="small" title="通过" type="success" @click='ruleTongguo(index)'></Button>
                            <Button v-authorize="'RulesConvertAudit'" v-if="item['state']==1" icon="md-close-circle" size="small" title="驳回" type="error" @click='ruleBohui(index)'></Button>
                            <Button v-authorize="'RulesConvertDisable'" v-if="item['state']==2" icon="md-remove" size="small" title="停用" type="error" @click='ruleTingyong(index)'></Button>
                            <Button v-authorize="'RulesConvertEnable'" v-if="item['state']==0" icon="md-play" size="small" title="启用" type="success" @click='ruleQiyong(index)'></Button>
                            <Button v-authorize="'RulesConvertEdit'" icon="md-create" size="small" title="编辑" type="primary" @click='ruleBianji(index)'></Button>
                            <Button v-authorize="'RulesConvertDel'" icon="md-close" size="small" title="删除" type="error" @click="ruleShanchu(index)"></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="JSON.stringify(item['unitConvertId'])" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='date_type'">
                            {{item[colData.name]==10?"购药":item[colData.name]==20?"门急诊":item[colData.name]==30?"病案":"医嘱"}}
                        </span>
                        <span v-else-if="colData.name=='state'">
                            {{item[colData.name]==0?"停用":item[colData.name]==1?"待审核":item[colData.name]==2?"通过":"驳回"}}
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dataList!=null && dataList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <template v-if="oldStatus=='1'">
                        <Button v-authorize="'RulesConvertAudit'" type="primary" @click="yesAuditBatch()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">通过</Button>
                        <Button v-authorize="'RulesConvertAudit'" type="primary" @click="NoAuditBatch()" :disabled="selectList.length==0" class="inputCheck" style="left: 335px;margin-top: -10px;">驳回</Button>
                    </template>
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

        <Modal v-model="addRule" title="新增" width=550 @on-ok="addRuleYes" :loading="loading">
            <Form :model="convertFormAdd" ref="convertAdd" :rules="ruleValidate" :label-width="80">
                <FormItem label="名称" prop="unit_convert_name">
                    <Input v-model.trim="convertFormAdd.unit_convert_name" class="cellLength" :maxlength="100" />
                </FormItem>
                <FormItem label="医院" prop="hosp_id">
                    <Select v-model="convertFormAdd.hosp_id" class="cellLength" remote :remote-method="searchHospList" @on-change="selectionChange" filterable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" prop="date_type">
                    <Select v-model="convertFormAdd.date_type" class="cellLength">
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="换算规则" prop="spec_convert">
                    <Select v-model="convertFormAdd.spec_convert" class="cellLength">
                        <Option v-for="item in convertList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="药品">
                    <Select v-model="convertFormAdd.drug" class="cellLength" filterable>
                        <Option v-for="item in drugList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model.trim="convertFormAdd.remark" type="textarea" :rows="3" :maxlength="2000" class="cellLength" />
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="editRule" title="编辑" width=550 :loading="loading">
            <Form :model="convertFormEdit" ref="convertEdit" :rules="ruleValidate" :label-width="80">
                <FormItem label="名称" prop="unit_convert_name">
                    <Input v-model.trim="convertFormEdit.unit_convert_name" class="cellLength" :maxlength="100" />
                </FormItem>
                <FormItem label="医院" prop="hosp_id">
                     <!-- <Select v-model="convertFormEdit.hosp_id" class="cellLength" @on-change="selectionChange" filterable clearable> -->
                    <Select v-model="convertFormEdit.hosp_id" :loading="searchHospitalLoading" :label="currentHospitalName" class="cellLength" remote :remote-method="searchHospList" @on-change="selectionChange" filterable>
                        <Option v-for="item in queryhospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" prop="date_type">
                    <Select v-model="convertFormEdit.date_type" class="cellLength">
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="换算规则" prop="spec_convert">
                    <Select v-model="convertFormEdit.spec_convert" class="cellLength">
                        <Option v-for="item in convertList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="药品">
                    <Select v-model="convertFormEdit.drug" class="cellLength" filterable>
                        <Option v-for="item in drugList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model.trim="convertFormEdit.remark" type="textarea" :rows="3" :maxlength="2000" class="cellLength" />
                </FormItem>
                <FormItem label="不通过原因" v-if="saveType=='audit'">
                    <Select v-model="convertFormEdit.nopassReason" class="cellLength" filterable>
                        <Option v-for="item in nopassReasonList" :value="item.label" :key="item.label">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer" v-if="saveType!='audit'">
                <Button type="primary" @click="editRuleYes">保存</Button>
            </div>
            <div slot="footer" v-if="saveType=='audit'">
                <Button type="text" @click="NoPass">不通过</Button>
                <Button type="primary" @click="YesPass">通过</Button>
            </div>
        </Modal>

        <Modal v-model="delRule" title="删除" width=420 @on-ok="delRuleYes">
            您确定要删除该规则吗？
        </Modal>
        <Modal v-model="qiYong" title="启用" width=420 @on-ok="updateState(2)">
            您确定要启用该规则吗？
        </Modal>
        <Modal v-model="tongGuo" title="通过" width=420 @on-ok="auditSingle(2)">
            您确定要通过该规则吗？
        </Modal>
        <Modal v-model="buTongGuo" title="不通过" width=420 @on-ok="auditSingle(3)">
             <Form>
                <FormItem label="不通过原因" :label-width="80">
                    <Select v-model="searchForm.nopassReason" class="cellLength" filterable>
                        <Option v-for="item in nopassReasonList" :value="item.label" :key="item.label">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" :label-width="80">
                    <Input v-model="searchForm.nopassRemark" type="textarea" class="cellLength" :rows="3" :maxlength="100" />
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="tingYong" title="停用" width=420 @on-ok="updateState(0)">
            您确定要停用该规则吗？
        </Modal>
        <Modal v-model="tongGuoBatch" title="批量审核通过" width=420 @on-ok="auditBatch(2)">
            您确定要批量审核通过选中的规则吗？
        </Modal>
        <Modal v-model="buTongGuoBatch" title="批量审核驳回" width=420 @on-ok="auditBatch(3)">
            请选择不通过原因：
            <Select v-model="searchForm.nopassReason" class="nopassLength" filterable>
                <Option v-for="item in nopassReasonList" :value="item.label" :key="item.label">{{ item.label }}</Option>
            </Select>
        </Modal>

    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
//公用json串，不需要访问后台
import commonJson from "@/assets/data/business/common.json";
import "../../assets/css/business/dataerror.css";
export default {
    name: "convertRules",
    components: { EmptyRow, CustomTable, CheckboxGroup, Checkbox },
    data() {
        return {
            resourceList: [],
            showModal: false,
            showDatas: [],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            },
            param: [],
            oldStatus: "",
            tableH: 0,
            dataTypeList: [].concat(commonJson.dataTypeList), //数据类型
            ruleStateList: commonJson.ruleStateList, //数据类型
            selectList: [],
            hospitalList: [], //医院
            queryhospitalList: [], //医院
            nopassReasonList: [], //不通过原因
            drugList: [], //药品
            dataList: [], //列表
            nopassReasonList: [], //审核不通过原因
            saveType: "",
            delRule: false, //提示框显示状态（删除）
            qiYong: false, //提示框显示状态（启用）
            tongGuo: false, //提示框显示状态（通过）
            buTongGuo: false, //提示框显示状态（不通过）
            tingYong: false, //提示框显示状态（停用）
            addRule: false, //新增弹窗
            editRule: false, //编辑弹窗
            buTongGuoBatch: false,
            tongGuoBatch: false,
            loading: true,
            searchHospitalLoading:false,
            currentHospitalName:"",
            editComId:0,
            commonId: "", //存放id
            convertList: [
                {
                    value: "1",
                    label: "单只单片"
                },
                {
                    value: "2",
                    label: "整包装"
                }
            ],
            //搜索栏
            searchForm: {
                hospital: "",
                dataType: "",
                keyword: "",
                state:1,
                nopassReason: "",
                nopassRemark: ""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            convertFormAdd: {
                unit_convert_id: "",
                unit_convert_name: "",
                // rule_type: "0",
                hosp_id: "",
                date_type: "",
                drug: "",
                // spec_convert: "",
                remark: ""
            },
            convertFormEdit: {
                unit_convert_id: "",
                unit_convert_name: "",
                // rule_type: "0",
                hosp_id: "",
                date_type: "",
                drug: "",
                // spec_convert: "",
                remark: "",
                nopassReason: ""
            },
            ruleValidate: {
                unit_convert_name: [
                    { required: true, message: "名称不能为空", trigger: "blur" }
                ],
                hosp_id: [
                    { required: true, message: "请选择医院", trigger: "blur" }
                ],
                date_type: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择数据类型",
                        trigger: "blur"
                    }
                ]
                // spec_convert: [
                //     {
                //         required: true,
                //         message: "请选择换算规则",
                //         trigger: "blur"
                //     }
                // ]
            },
            dataCol: [
                {
                    text: "#",
                    name: "sel",
                    width: 40,
                    filterable: false,
                    removeable: false
                },
                {
                    text: "名称",
                    name: "unit_convert_name",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "医院",
                    name: "hosp_name",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "数据类型",
                    name: "date_type",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: params => {
                        let texts = "";
                        params.date_type.split(",").forEach(m => {
                            if (m == 10) {
                                texts += "购药";
                            } else if (m == 20) {
                                texts += "门急诊";
                            } else if (m == 30) {
                                texts += "病案";
                            } else if (m == 40) {
                                texts += "医嘱";
                            }
                            texts += "，";
                        });
                        texts = texts.substring(0, texts.length - 1);
                        return texts;
                    }
                },
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "药品通用名",
                    name: "drug_generic_name",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                // {
                //     title: "换算规则",
                //     key: "spec_convert",
                //     align: "center",
                //     width: 150
                // },
                {
                    text: "状态",
                    name: "state",
                    sortable: true,
                    moveable: true,
                    width: 80,
                    render: params => {
                        if (params.state == 0) {
                            return "停用";
                        } else if (params.state == 1) {
                            return "待审核";
                        } else if (params.state == 2) {
                            return "通过";
                        } else if (params.state == 3) {
                            return "不通过";
                        }
                    }
                },
                {
                    text: "创建人",
                    name: "create_user",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "创建时间",
                    name: "create_time",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "修改人",
                    name: "change_user",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "修改时间",
                    name: "change_time",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "审核人",
                    name: "check_user",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "审核时间",
                    name: "check_time",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "备注",
                    name: "remark",
                    align: "center",
                    width: 150
                },
                {
                    text: "驳回原因",
                    name: "noPass",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "驳回原因备注",
                    name: "noPassRemarks",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 170
                }
            ]
        };
    },
    mounted() {
        this.dataTypeList.splice(2,1);
        // this.getDataList(); //获取列表数据
        // this.getHospitalList(); //获取医院数据
        this.getauditList(); //获取审核不通过原因
        this.getDrugList(); //获取药品
        this.getQueryHospitalList();
        this.capyCol = [].concat(this.dataCol);
    },
    activated(){
        this.getDataList(); //获取列表数据
    },
    watch: {
        showDatas: {
            handler(newValue, oldValue) {
                if (newValue.length != oldValue.length) {
                    this.selectList = [];
                }
            },
            deep: true
        }
    },
    methods: {
        //获取列表
        getDataList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "convertRules.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    hospId: self.searchForm.hospital, //医院
                    state:self.searchForm.state,
                    date_type: self.searchForm.dataType, //数据类型
                    keyword: self.searchForm.keyword //规则
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        // self.pageConfig.pageNum = data.data.currentPageIndex;
                    
                        self.oldStatus=self.searchForm.state
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
                name: "common.getPortionHosp",
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
        //获取医院
        getQueryHospitalList() {
            var self = this;
            Vue.ajax.send({
                name: "common.hospitalList",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.queryhospitalList = data.data;
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        //检索医院
        searchHospList(query) {
                var self = this;
                self.searchHospitalLoading=true;
                Vue.ajax.send({
                    name: "common.getPortionHosp",
                    data: {
                        hospId:self.editComId,
                        hospName: query
                    },
                    success: function(data) {
                        self.searchHospitalLoading=false;
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
        selectionChange(value){
            console.log("selectionChange",value)
            this.editComId=value;
            // this.searchHospList("");
        },
        //获取审核不通过原因
        getauditList() {
            var self = this;
            Vue.ajax.send({
                name: "common.getDictionary",
                data: {
                    optionType:"ruleconvert"
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.nopassReasonList = data.data;
                        self.searchForm.nopassReason=self.nopassReasonList[0].label;
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        //切页
        changePage(currentPage) {
            this.pageConfig.pageNum = currentPage;
            this.getDataList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDataList();
        },
        //新增
        addData() {
            this.addRule = true;
            this.convertFormAdd= {
                unit_convert_id: "",
                unit_convert_name: "",
                // rule_type: "0",
                hosp_id: "",
                date_type: "",
                drug: "",
                // spec_convert: "",
                remark: ""
            },
            this.searchHospList(null,"");
        },
        //编辑
        editData(mappedId) {
            this.editRule = true;
            var self = this;
            Vue.ajax.send({
                name: "convertRules.getUpdateRule",
                data: {
                    unitConvertId: mappedId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        // self.convertFormEdit = data.data;
                        self.convertFormEdit.unit_convert_id =
                            data.data.unit_convert_id;
                        self.convertFormEdit.unit_convert_name =
                            data.data.unit_convert_name;
                        self.convertFormEdit.hosp_id = data.data.hospId + "";
                        self.convertFormEdit.date_type = Number(
                            data.data.date_type
                        );
                        self.convertFormEdit.drug = data.data.drug;
                        self.convertFormEdit.remark = data.data.remark;
                        self.currentHospitalName=data.data.hosp_name
                        self.editComId=self.convertFormEdit.hosp_id;
                        self.searchHospList("");
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取药品
        getDrugList(hospId) {
            var self = this;
            Vue.ajax.send({
                name: "convertRules.getDrug",
                data: {
                    hosp_id: hospId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.drugList = data.data;
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        //修改状态
        updateState(state) {
            var self = this;
            Vue.ajax.send({
                name: "convertRules.updataState",
                data: {
                    unitConvertId: self.commonId,
                    state: state
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.getDataList();
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
        //新增确认操作
        addRuleYes() {
            this.$refs["convertAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "convertRules.addRule",
                        data: {
                            unit_convert_name:
                                self.convertFormAdd.unit_convert_name,
                            hospId: self.convertFormAdd.hosp_id,
                            date_type: self.convertFormAdd.date_type,
                            drug: self.convertFormAdd.drug,
                            create_user: Vue.getUser().userName,
                            remark: self.convertFormAdd.remark,
                            state: 1
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.getDataList();
                                self.addRule = false;
                                self.$refs["convertAdd"].resetFields(); //清空输入项
                                self.convertFormAdd.remark = "";
                                self.$Message.success("新增成功");
                            } else {
                                self.$Modal.error({
                                    title: "失败",
                                    content: data.message
                                });
                                setTimeout(() => {
                                    self.loading = false;
                                    self.$nextTick(() => {
                                        self.loading = true;
                                    });
                                }, 0);
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
        //编辑确认操作
        editRuleYes() {
            this.$refs["convertEdit"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "convertRules.editRule",
                        data: {
                            unitConvertId: self.commonId,
                            unit_convert_name:
                                self.convertFormEdit.unit_convert_name,
                            hospId: self.convertFormEdit.hosp_id,
                            date_type: self.convertFormEdit.date_type,
                            drug: self.convertFormEdit.drug,
                            remark: self.convertFormEdit.remark,
                            state: 1,
                            change_user: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.getDataList();
                                self.editRule = false;
                                self.$Message.success("修改成功");
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
        //审核通过
        YesPass() {
            this.auditPass(2);
            this.convertFormEdit.nopassReason = "";
        },
        //审核不通过
        NoPass() {
            if (
                this.convertFormEdit.nopassReason == null ||
                this.convertFormEdit.nopassReason == ""
            ) {
                this.$Message.error("请选择审核不通过原因");
            } else {
                this.auditPass(3);
            }
        },
        auditPass(state) {
            this.$refs["convertEdit"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "convertRules.editRule",
                        data: {
                            unitConvertId: self.commonId,
                            unit_convert_name:
                                self.convertFormEdit.unit_convert_name,
                            hospId: self.convertFormEdit.hosp_id,
                            date_type: self.convertFormEdit.date_type,
                            drug: self.convertFormEdit.drug,
                            remark: self.convertFormEdit.remark,
                            nopassReason: self.convertFormEdit.nopassReason,
                            state: state,
                            check_user: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.getDataList();
                                self.editRule = false;
                                self.$Message.success("审核成功");
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
        //删除规则确认操作
        delRuleYes() {
            var self = this;
            Vue.ajax.send({
                name: "convertRules.delRule",
                data: {
                    unitConvertId: self.commonId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        // self.$Modal.success({
                        //     title: "成功",
                        //     closable: true,
                        //     content: "<h5>删除规则成功。</h5>"
                        // });
                        self.$Message.success("删除规则成功。");
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
        },
        //保存批量选中的信息
        getSelectList(arr) {
            //批量选中的信息
            this.selectList = arr;
        },
        //审核
        auditSingle(state) {
            let idsList = [this.commonId];
            this.updateAudit(idsList, state);
        },
        yesAuditBatch() {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量审核的数据！</h5>"
                });
            } else {
                this.tongGuoBatch = true;
            }
        },
        NoAuditBatch() {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量审核的数据！</h5>"
                });
            } else {
                this.buTongGuoBatch = true;
            }
        },
        auditBatch(state) {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量审核的数据！</h5>"
                });
            } else {
                let idsList = []; //选中数据的id标识
                //遍历选中的数据获取选中数据的id数组
                this.selectList.forEach(element => {
                    idsList.push(element.unitConvertId);
                });
                this.updateAudit(this.selectList, state);
            }
        },
        updateAudit(idsList, state) {
            var self = this;
            Vue.ajax.send({
                name: "convertRules.updateAudit",
                data: {
                    idsList: idsList,
                    state: state,
                    nopassReason:self.searchForm.nopassReason,
                    nopassRemark: self.searchForm.nopassRemark
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("审核成功。");
                        //清除信息
                        self.getDataList();
                        self.selectList=[];
                        self.searchForm.nopassReason=self.nopassReasonList[0].label;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
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
                if (this.currentSort.column == "readCount") {
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
                this.dataCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op" && n != "sel") {
                            this.dataCol.push(m);
                        }
                    });
                });
                this.dataCol.unshift(this.capyCol[0]);
                this.dataCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        //单选
        clickMe(index) {
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(
                this.dataList[index].unitConvertId
            );
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
                // this.param.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.dataList[index].unitConvertId);
            }
        },
        //全选、非全选
        allClickMe(value){
            if(value==1){
                this.selectList=this.showDatas.map(a=>JSON.stringify(a['unitConvertId']));
            }
            else{
                this.selectList=[];
            }
        },
        ruleTongguo(index) {
            this.commonId = this.showDatas[index].unitConvertId;
            this.auditSingle(2);
        },
        ruleBohui(index) {
            this.buTongGuo = true;
            this.commonId = this.showDatas[index].unitConvertId;
        },
        ruleTingyong(index) {
            this.tingYong = true;
            this.commonId = this.showDatas[index].unitConvertId;
        },
        ruleQiyong(index) {
            this.qiYong = true;
            this.commonId = this.showDatas[index].unitConvertId;
        },
        ruleBianji(index) {
            this.editData(this.showDatas[index].unitConvertId);
            this.commonId = this.showDatas[index].unitConvertId;
        },
        ruleShanchu(index) {
            this.delRule = true;
            this.commonId = this.showDatas[index].unitConvertId; //当前行id
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
    width: 43px;
    left: 220px;
    top: 8px;
}
.page-footer button {
    position: absolute;
    right: 40px;
    top: 10px;
}
.page-footer .text-center {
    position: relative;
    display: block;
    width: 100%;
}
.page-footer .inputCheck {
    position: absolute;
    left: 220px;
    top: 10px;
}
.cellLength {
    width: 90%;
}
.nopassLength {
    width: 90%;
    margin-top: 10px;
}
</style>