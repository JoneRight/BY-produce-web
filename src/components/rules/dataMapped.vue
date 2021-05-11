<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">映射规则</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="级别" :label-width="40">
                    <Select v-model="searchForm.grade" style="width: 120px;" clearable>
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospital" style="width: 120px;" filterable clearable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="校验字段" :label-width="60">
                    <Select v-model="searchForm.columns" style="width: 120px;">
                        <Option v-for="item in columnsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="searchForm.columns  == 'section' || searchForm.columns  == 'drug'|| searchForm.columns  == 'diagnostic'" label="原始名称" :label-width="60">
                    <Input v-model="searchForm.mapData" type="text" style="width: 100px;" />
                </FormItem>
                <FormItem v-if="searchForm.columns  == 'section' || searchForm.columns  == 'drug'|| searchForm.columns  == 'diagnostic'" label="标准名称" :label-width="60">
                    <Input v-model="searchForm.standardData" type="text" style="width: 100px;" />
                </FormItem>
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.state" style="width: 100px;" clearable>
                        <Option v-for="item in ruleStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="数据类型" :label-width="60">
                    <Select v-model="searchForm.dataType" style="width: 120px;">
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>  -->
                <!-- <FormItem label="映射数据" :label-width="60">
                    <Input v-model="searchForm.mapData" type="text" style="width: 120px;" />
                </FormItem> -->
                <!-- <FormItem label="标准数据" :label-width="60">
                    <Input v-model="searchForm.standardData" type="text" style="width: 120px;" />
                </FormItem> -->
                <!--<FormItem label="创建人" :label-width="60">
                    <Input v-model="searchForm.createUser" type="text" style="width: 100px;" />
                </FormItem>
                <FormItem label="审核人" :label-width="60">
                    <Input v-model="searchForm.checkUser" type="text" style="width: 100px;" />
                </FormItem>
                 <FormItem label="创建时间" :label-width="60">
                    <DatePicker v-model="searchForm.addBeginDate" @on-change="searchForm.addBeginDate=$event" type="date" style="width: 100px"></DatePicker> —
                    <DatePicker v-model="searchForm.addEndDate" @on-change="searchForm.addEndDate=$event" type="date" style="width: 100px"></DatePicker>
                </FormItem>
                
                <FormItem label="修改时间" :label-width="70">
                    <DatePicker v-model="searchForm.editBeginDate" @on-change="searchForm.editBeginDate=$event" type="date" style="width: 120px"></DatePicker> —
                    <DatePicker v-model="searchForm.editEndDate" @on-change="searchForm.editEndDate=$event" type="date" style="width: 120px"></DatePicker>
                </FormItem>
                <FormItem label="审核时间" :label-width="60">
                    <DatePicker v-model="searchForm.auditBeginDate" @on-change="searchForm.auditBeginDate=$event" type="date" style="width: 100px"></DatePicker> —
                    <DatePicker v-model="searchForm.auditEndDate" @on-change="searchForm.auditEndDate=$event" type="date" style="width: 100px"></DatePicker>
                </FormItem> -->
                <FormItem>
                    <Button type="primary" @click="changePage(1)" >检索</Button>
                </FormItem>
                <a v-authorize="'RulesMappedExcel'" href="../../static/file/dataMapping.csv" class="btn fr" style="color:#2d8cf0;margin-top:10px;float: right">下载模板</a>
                <Button v-authorize="'RulesMappedExcel'" type="primary" @click="importButton()" style="float: right;margin-right:10px;">导入EXCEL</Button>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'RulesMappedList'" optionType='business' :columnConfig='dataCol' :columnDatas='dataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in dataCol" :key="colIndex" class="ellipsis">
                        <!-- {{item[colData.name]}} -->
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'RulesMappedAudit'" v-if="item['state']==1" icon="md-checkmark-circle" size="small" title="通过" type="success" @click='ruleTongguo(index)'></Button>
                            <Button v-authorize="'RulesMappedAudit'" v-if="item['state']==1" icon="md-close-circle" size="small" title="驳回" type="error" @click='ruleBohui(index)'></Button>
                            <Button v-authorize="'RulesMappedDisable'" v-if="item['state']==2" icon="md-remove" size="small" title="停用" type="error" @click='ruleTingyong(index)'></Button>
                            <Button v-authorize="'RulesMappedEnable'" v-if="item['state']==0" icon="md-play" size="small" title="启用" type="success" @click='ruleQiyong(index)'></Button>
                            <Button v-authorize="'RulesMappedEdit'" icon="md-create" size="small" title="编辑" type="primary" @click='ruleBianji(index)'></Button>
                            <Button v-authorize="'RulesMappedDel'" icon="md-close" size="small" title="删除" type="error" @click="ruleShanchu(index)"></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="JSON.stringify(item['mId'])" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='mapType'">
                            {{item[colData.name]==0?"通用":"非通用"}}
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
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000,2000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <template v-if="oldStatus=='1'">
                        <Button v-authorize="'RulesMappedAudit'" type="primary" @click="yesAuditBatch()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">通过</Button>
                        <Button v-authorize="'RulesMappedAudit'" type="primary" @click="NoAuditBatch()" :disabled="selectList.length==0" class="inputCheck" style="left: 335px;margin-top: -10px;">驳回</Button>
                    </template>
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

        <Modal v-model="delRule" title="删除" width=420 @on-ok="delRuleYes">
            您确定要删除该规则吗？
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
        <Modal v-model="buTongGuo" title="不通过" width=500 @on-ok="auditSingle(3)">
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
            <Select v-model="searchForm.nopassReason" class="cellLength" filterable>
                <Option v-for="item in nopassReasonList" :value="item.label" :key="item.label">{{ item.label }}</Option>
            </Select>
        </Modal>
        <Modal v-model="importModel" title="导入EXCEL" width=550 @on-ok="yesExcel" :loading="loading">
            <Form :model="importExcelForm" ref="addExcel" inline :rules="excelRuleValidate">
                <FormItem label="映射类型：" :label-width="90" prop="disabledGroup">
                    <RadioGroup v-model="importExcelForm.disabledGroup" @on-change="radioUpdate">
                        <Radio label="drug_trade_name">商品名称</Radio>
                        <Radio label="packing">包装规格</Radio>
                        <Radio label="drug_generic_name">通用名</Radio>
                        <Radio label="drug_formulation">剂型</Radio>
                        <Radio label="drug_manufacturers">厂家</Radio>
                        <Radio label="drug">药品</Radio>
                        <br/>
                        <Radio label="drug_spec">药品规格</Radio>
                        <Radio label="admission_of">入院情况</Radio>
                        <Radio label="treatment_card">就诊号</Radio>
                        <Radio label="doctor_advice_type">医嘱</Radio>
                        <Radio label="dosage">剂量</Radio>
                        <Radio label="age">年龄</Radio>
                        <br/>
                        <Radio label="drug_wholesale">批发企业</Radio>
                        <Radio label="treatment_result_infect">治疗结果</Radio>
                        <Radio label="medical_record">病案号</Radio>
                        <Radio label="diagnostic">诊断</Radio>
                        <Radio label="section">科室</Radio>
                        <Radio label="sex">性别</Radio>
                        <br/>
                        <Radio label="payment_method">付费方式</Radio>
                        <Radio label="path_drug">给药途径</Radio>
                        <Radio label="usage" style="width: 54px">用法</Radio>
                        <Radio label="wound">切口</Radio>
                        <Radio label="healing">愈合</Radio>
                        <Radio label="operation">手术</Radio>
                        <br/>
                        <Radio label="doctor_id">医生工号</Radio>
                        <Radio label="doctor_title">职称</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="选择文件：" :label-width="90" prop="ExcelFile">
                    <Upload :before-upload="importExcel" action="" accept="text/csv,.csv,text/csv-schema,application/vnd.ms-excel" :format="['csv','xls','xlsx']" :max-size="10240" style="width:450px;float:left;margin-left:5px;">
                        <Input readonly v-model="excelName" style="width: 200px" />
                        <Button style="background-color:#00a0e9;color:#ffffff">导入excel</Button>
                        <br/>
                        <span v-if="ifSpan" style="color:red">请上传文件</span>
                    </Upload>
                </FormItem>
                <br/>
                <FormItem v-if="isexeclMessage" label="" :label-width="90" style="color:red;margin-top:-30px;">
                    <span>提示：{{execlMessage}}</span>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
import excel from "../../utils/excel.js";
//公用json串，不需要访问后台
import commonJson from "@/assets/data/business/common.json";
import expandRow from "./dataMappedExpand.vue";
import "../../assets/css/business/dataerror.css";
export default {
    name: "dataMapped",
    components: { EmptyRow, CustomTable, CheckboxGroup, Checkbox },
    data() {
        const config = require("./config");
        const validateData = (rule, value, callback) => {
            if (this.excelInfor < 1) {
                callback(" ");
                this.ifSpan = true;
            } else {
                callback();
                this.ifSpan = false;
            }
        };
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
            dataTypeList: commonJson.dataTypeList, //数据类型
            ruleStateList: commonJson.ruleStateList, //数据类型
            gradeList: commonJson.gradeList, //级别
            selectList: [],
            hospitalList: [], //医院
            nopassReasonList: [], //不通过原因
            columnsList: [], //校验字段
            dataList: [], //列表
            execlMessage: "",
            execlMessageType: "",
            isexeclMessage: false,
            excelName:"",
            excelCap:"",
            // sendMessageModel: false, //提示框显示状态(发通知)
            delRule: false, //提示框显示状态（删除）
            qiYong: false, //提示框显示状态（启用）
            tongGuo: false, //提示框显示状态（通过）
            buTongGuo: false, //提示框显示状态（不通过）
            tingYong: false, //提示框显示状态（停用）
            importModel: false, //导入excel
            buTongGuoBatch: false,
            tongGuoBatch: false,
            updateBaseId: "",
            commonId: "", //存放id
            index: "", //行标识（用于删除单行数据）
            expandData: [], //expand数据
            excelInfor: [], //导入excel的数据内容
            loading: true,
            ifSpan: false,
            config: config, //路由配置文件
            errorStatus: "1",
            //搜索栏
            searchForm: {
                grade: "",
                hospital: "",
                standardId:"",
                // dataType: 1,
                mapData: "",
                standardData: "",
                mapData:"",
                columns: "",
                state: 1,
                createUser:"",
                checkUser:"",
                addBeginDate: "",
                addEndDate: "",
                editBeginDate: "",
                editEndDate: "",
                auditBeginDate: "",
                auditEndDate: "",
                nopassReason: "",
                nopassRemark: ""
            },
            columns: "", //存储校验字段
            //发通知
            sendMessageForm: {
                title: "",
                content: ""
            },
            importExcelForm: {
                disabledGroup: "drug_trade_name"
            },
            searchDisabled : false,
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            ruleValidate: {
                title: [
                    {
                        required: true,
                        message: "通知标题不能为空",
                        trigger: "blur"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "通知内容不能为空",
                        trigger: "blur"
                    }
                ]
            },
            excelRuleValidate: {
                disabledGroup: [
                    {
                        required: true,
                        message: "请选择映射类型",
                        trigger: "blur"
                    }
                ],
                ExcelFile: [{ validator: validateData, trigger: "blur" }]
            },
            dataCol: [
                //列
                // {
                //     type: "expand",
                //     width: -1,
                //     render: (h, params) => {
                //         return h(expandRow, {
                //             props: {
                //                 data: this.expandData
                //             }
                //         });
                //     }
                // },
                {
                    text: "#",
                    name: "sel",
                    width: 40,
                    filterable: false,
                    removeable: false
                },
                {
                    text: "级别",
                    name: "mapType",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: params => {
                        if (params.mapType == 0) {
                            return "通用";
                        } else {
                            return "非通用";
                        }
                    }
                },
                {
                    text: "医院",
                    name: "hospName",
                    sortable: true,
                    moveable: true,
                    width: 250
                },
                {
                    text:"标准单价",
                    name:"unitPrice",
                    sortable: true,
                    moveable: true,
                    width: 200,
                    standard:true
                },
               {
                    text:"标准制剂单价",
                    name:"mapPresPrice",
                    sortable: true,
                    moveable: true,
                    width: 200,
                    standard:true
                },
                {
                    text:"原始单价",
                    name:"bakPrice",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    standard:true
        },
                {
                    text: "映射数据",
                    name: "mName",
                    sortable: true,
                    moveable: true,
                    width: 250
                },
                {
                    text: "标准数据",
                    name: "standardName",
                    sortable: true,
                    moveable: true,
                    width: 250
                },
                {
                    text: "标准编码",
                    name: "bId",
                    sortable: true,
                    moveable: true,
                    width: 250
                },
                {
                    text: "状态",
                    name: "state",
                    sortable: true,
                    moveable: true,
                    width: 100,
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
                    name: "createUser",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "创建时间",
                    name: "createTime",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "修改人",
                    name: "changeUser",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "修改时间",
                    name: "changeTime",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "审核人",
                    name: "checkUser",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "审核时间",
                    name: "checkTime",
                    sortable: true,
                    moveable: true,
                    width: 160
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
            ],
            extraCol1:[
                {
                    text: "映射数据-通用名",
                    name: "mGenName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "标准数据-通用名",
                    name: "genName",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    standard:true

                },
                {
                    text: "映射数据-商品名",
                    name: "mTraName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                 {
                    text: "标准数据-商品名",
                    name: "traName",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    standard:true
                },
                {
                    text: "映射数据-规格",
                    name: "mSpecName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                  {
                    text: "标准数据-统一规格",
                    name: "specOffice",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    standard:true
                },
                {
                    text: "映射数据-包装规格",
                    name: "mPackName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "标准数据-包装规格",
                    name: "packName1",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    standard:true
                },
                {
                    text: "映射数据-剂型",
                    name: "mFormName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "标准数据-剂型",
                    name: "formName",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    standard:true
                },
                {
                    text: "映射数据-生产企业",
                    name: "mComName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "标准数据-生产企业",
                    name: "comName",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    standard:true
                },
            ],
            extraCol2:[
       

                {
                    text: "标准数据-规格",
                    name: "specName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },

  

            ]
        };
    },
    mounted() {
        // this.getDataList(); //获取列表数据
        this.capyCol = [].concat(this.dataCol);

        this.columnsList = [
            {
                value: "drug",
                label: "药品"
            },
            {
                value: "drug_manufacturers",
                label: "生产企业"
            },
            {
                value: "drug_generic_name",
                label: "通用名"
            },
            {
                value: "drug_trade_name",
                label: "商品名"
            },
            {
                value: "drug_spec",
                label: "药品规格"
            },
            {
                value: "packing_quantity",
                label: "包装规格"
            },
            {
                value: "drug_formulation",
                label: "剂型"
            },
            {
                value: "payment_method",
                label: "付费方式"
            },
            {
                value: "admission_of",
                label: "入院情况"
            },
            {
                value: "wound",
                label: "切口"
            },
            {
                value: "dosage",
                label: "剂量"
            },
            {
                value: "doctor_advice_type",
                label: "医嘱"
            },
            // {
            //     value: "treatment_card",
            //     label: "就诊号"
            // },
            // {
            //     value: "doctor_id",
            //     label: "工号"
            // },
            {
                value: "age",
                label: "年龄"
            },
            {
                value: "sex",
                label: "性别"
            },
            {
                value: "healing",
                label: "愈合"
            },
            {
                value: "operation",
                label: "手术"
            },
            {
                value: "drug_wholesale",
                label: "批发企业"
            },
            {
                value: "treatment_result_infect",
                label: "治疗结果"
            },
            {
                value: "usage",
                label: "用法"
            },
            // {
            //     value: "medical_record",
            //     label: "病案号"
            // },
            {
                value: "section",
                label: "科室"
            },
            {
                value: "path_drug",
                label: "给药途径"
            },
            {
                value: "doctor_title",
                label: "职称"
            },
            {
                value: "diagnostic",
                label: "诊断"
            }
        ];

        this.getHospitalList(); //获取医院数据
    },
    activated(){
        // 传参进入页面
        if (this.$route.params.id != undefined && this.$route.params.id != "") {
            this.searchForm.columns=this.$route.params.id;
        }
        // 无传参
        // else{
        //     if (this.columnsList.length > 0) {
        //         //默认选中第一个
        //         this.columns = this.columnsList[0].value;
        //         this.searchForm.columns = this.columnsList[0].value;
        //     }
        // }
        //this.getDataList(); //获取列表数据
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
        changeShowColumn(show){
            if(show){
                if(!this.dataCol.someProperty("name",this.extraCol1[0].name)){
                    this.dataCol.splice(3,0,...this.extraCol1);
                }
                if(!this.dataCol.someProperty("name",this.extraCol2[0].name)){
                    this.dataCol.splice(11,0,...this.extraCol2);
                }
            }
            else{
                this.dataCol=this.dataCol.filter(item=>{
                    return !this.extraCol1.someProperty("name",item.name) && !this.extraCol2.someProperty("name",item.name);
                })
            }
            this.capyCol=[].concat(this.dataCol)
            console.log("this.dataCol",show,this.dataCol)
        },
        //获取列表
        getDataList(pageIndex) {            
            //根据不同字段访问不同接口
            this.getListReal(this.searchForm.columns);

            var self = this;
            self.searchDisabled = true;
            Vue.ajax.send({
                name: "ruleDataMapped",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    mapType: self.searchForm.grade, //级别
                    hospId: self.searchForm.hospital, //医院
                    // dataType: self.searchForm.dataType, //数据类型
                    mapData: self.searchForm.mapData, //映射数据
                    standardData: self.searchForm.standardData, //标准数据
                    mapData:self.searchForm.mapData,
                    standardId:self.searchForm.standardId,
                    state: self.searchForm.state, //状态
                    startCreateTime: self.searchForm.addBeginDate, //新建开始时间
                    endCreateTime: self.searchForm.addEndDate, //新建结束时间
                    startChangeTime: self.searchForm.editBeginDate, //编辑开始时间
                    endChangeTime: self.searchForm.editEndDate, //编辑结束时间
                    startCheckTime: self.searchForm.auditBeginDate, //审核开始时间
                    endCheckTime: self.searchForm.auditEndDate //审核结束时间
                },
                success: function(data) {
                    // debugger;
                    self.searchDisabled = false;
                    self.changeShowColumn(self.searchForm.columns=="drug");
                    if (!!data && data.code == "0") {                        
                        self.dataList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        self.pageConfig.pageNum = data.data.currentPageIndex;
                        self.columns = self.searchForm.columns;
                        self.errorStatus = self.searchForm.state;
                        self.oldStatus = self.searchForm.state;

                        self.getauditList(self.columns);
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        getListReal(type) {
            var real1 = "";
            var real2 = "";
            var real3 = "";
            var real4 = "";
            if (type == "sex") {
                //性别
                real1 = "/map/sex/query";
                real2 = "/map/sex/editByKey";
                real3 = "/map/sex/deleteByKey";
                real4 = "/map/sex/editByKey";
            } else if (type == "age") {
                //年龄
                real1 = "/map/age/query";
                real2 = "/map/age/editByKey";
                real3 = "/map/age/deleteByKey";
                real4 = "/map/age/editByKey";
            } else if (type == "section") {
                //科室
                real1 = "/map/section/query";
                real2 = "/map/section/editByKey";
                real3 = "/map/section/deleteByKey";
                real4 = "/map/section/editByKey";
            } else if (type == "payment_method") {
                //付费方式
                real1 = "/map/payway/query";
                real2 = "/map/payway/editByKey";
                real3 = "/map/payway/deleteByKey";
                real4 = "/map/payway/editByKey";
            } else if (type == "doctor_title") {
                //职称
                real1 = "/map/doctorTitle/query";
                real2 = "/map/doctorTitle/editByKey";
                real3 = "/map/doctorTitle/deleteByKey";
                real4 = "/map/doctorTitle/editByKey";
            } else if (type == "dosage") {
                //剂量
                real1 = "/map/dosage/query";
                real2 = "/map/dosage/editByKey";
                real3 = "/map/dosage/deleteByKey";
                real4 = "/map/dosage/editByKey";
            } else if (type == "diagnostic") {
                //诊断
                real1 = "/map/diagnosis/query";
                real2 = "/map/diagnosis/editByKey";
                real3 = "/map/diagnosis/deleteByKey";
                real4 = "/map/diagnosis/editByKey";
            } else if (type == "path_drug") {
                //给药途径
                real1 = "/map/pathDrug/query";
                real2 = "/map/pathDrug/editByKey";
                real3 = "/map/pathDrug/deleteByKey";
                real4 = "/map/pathDrug/editByKey";
            } else if (type == "usage") {
                //用法
                real1 = "/map/usage/query";
                real2 = "/map/usage/editByKey";
                real3 = "/map/usage/deleteByKey";
                real4 = "/map/usage/editByKey";
            } else if (type == "wound") {
                //切口
                real1 = "/map/wound/query";
                real2 = "/map/wound/editByKey";
                real3 = "/map/wound/deleteByKey";
                real4 = "/map/wound/editByKey";
            } else if (type == "healing") {
                //愈合
                real1 = "/map/healing/query";
                real2 = "/map/healing/editByKey";
                real3 = "/map/healing/deleteByKey";
                real4 = "/map/healing/editByKey";
            } else if (type == "admission_of") {
                //入院情况
                real1 = "/map/admission/query";
                real2 = "/map/admission/editByKey";
                real3 = "/map/admission/deleteByKey";
                real4 = "/map/admission/editByKey";
            } else if (type == "doctor_advice_type") {
                //医嘱
                real1 = "/map/advice/query";
                real2 = "/map/advice/editByKey";
                real3 = "/map/advice/deleteByKey";
                real4 = "/map/advice/editByKey";
            } else if (type == "drug_formulation") {
                //剂型
                real1 = "/map/drugForm/query";
                real2 = "/map/drugForm/editByKey";
                real3 = "/map/drugForm/deleteByKey";
                real4 = "/map/drugForm/editByKey";
            } else if (type == "drug_manufacturers") {
                //厂家
                real1 = "/map/manufacturer/query";
                real2 = "/map/manufacturer/editByKey";
                real3 = "/map/manufacturer/deleteByKey";
                real4 = "/map/manufacturer/editByKey";
            } else if (type == "operation") {
                //手术
                real1 = "/map/operation/query";
                real2 = "/map/operation/editByKey";
                real3 = "/map/operation/deleteByKey";
                real4 = "/map/operation/editByKey";
            } else if (type == "drug_generic_name") {
                //通用名
                real1 = "/map/genericName/query";
                real2 = "/map/genericName/editByKey";
                real3 = "/map/genericName/deleteByKey";
                real4 = "/map/genericName/editByKey";
            } else if (type == "treatment_card") {
                //就诊号
                real1 = "/map/treatmentCard/query";
                real2 = "/map/treatmentCard/editByKey";
                real3 = "/map/treatmentCard/deleteByKey";
                real4 = "/map/treatmentCard/editByKey";
            } else if (type == "treatment_result_infect") {
                //治疗结果
                real1 = "/map/treatResult/query";
                real2 = "/map/treatResult/editByKey";
                real3 = "/map/treatResult/deleteByKey";
                real4 = "/map/treatResult/editByKey";
            } else if (type == "drug_trade_name") {
                //商品名称
                real1 = "/map/tradeName/query";
                real2 = "/map/tradeName/editByKey";
                real3 = "/map/tradeName/deleteByKey";
                real4 = "/map/tradeName/editByKey";
            } else if (type == "drug_wholesale") {
                //批发企业
                real1 = "/map/wholeSale/query";
                real2 = "/map/wholeSale/editByKey";
                real3 = "/map/wholeSale/deleteByKey";
                real4 = "/map/wholeSale/editByKey";
            } else if (type == "drug_spec") {
                //规格（药品）
                real1 = "/map/drugSpec/query";
                real2 = "/map/drugSpec/editByKey";
                real3 = "/map/drugSpec/deleteByKey";
                real4 = "/map/drugSpec/editByKey";
            } else if (type == "packing_quantity") {
                //包装（规格）
                real1 = "/map/packageSpec/query";
                real2 = "/map/packageSpec/editByKey";
                real3 = "/map/packageSpec/deleteByKey";
                real4 = "/map/packageSpec/editByKey";
            } else if (type == "doctor_id") {
                //工号（医生）
                real1 = "/map/doctorId/query";
                real2 = "/map/doctorId/editByKey";
                real3 = "/map/doctorId/deleteByKey";
                real4 = "/map/doctorId/editByKey";
            } else if (type == "drug") {
                //药品
                real1 = "/map/mapdrug/query";
                real2 = "/map/mapdrug/editByKey";
                real3 = "/map/mapdrug/deleteByKey";
                real4 = "/map/mapdrug/editByKey";
            } else if (type == "medical_record") {
                //病案号
                real1 = "/map/medicalRecord/query";
                real2 = "/map/medicalRecord/editByKey";
                real3 = "/map/medicalRecord/deleteByKey";
                real4 = "/map/medicalRecord/editByKey";
            }
            //动态设置的访问地址
            this.config.default.urls.ruleDataMapped.real = real1;
            this.config.default.urls.updataState.real = real2;
            this.config.default.urls.delDataMapped.real = real3;
        },
        //获取审核不通过原因
        getauditList(type) {
            var self = this;
            Vue.ajax.send({
                name: "common.getDictionary",
                data: {
                    optionType: "map" + type
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.nopassReasonList = data.data;
                        self.searchForm.nopassReason =
                            self.nopassReasonList[0].label;
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
        //切页
        changePage(currentPage) {
            this.pageConfig.pageNum = currentPage;
            this.getDataList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            //this.getDataList();
        },
        //新增弹窗
        addData() {
            this.$router.push({
                path: "/rules/dataMappedAdd"
            });
        },
        //编辑弹窗
        editData(params) {
            this.$router.push({
                path: "/rules/dataMappedAdd",
                query: {
                    operationType: "update",
                    mId: params.mId,
                    mapType: params.mapType,
                    hospId: params.hospId,
                    hospName: params.hospName,
                    mName: params.mName,
                    bId: params.bId,
                    standardName: params.standardName,
                    mapSort: params.mapSort,
                    mapSortName: params.mapSortName
                }
            });
        },
        //审核
        auditData(params) {
            this.$router.push({
                path: "/rules/dataMappedAdd",
                query: {
                    operationType: "audit",
                    mId: params.mId,
                    mapType: params.mapType,
                    hospId: params.hospId,
                    hospName: params.hospName,
                    mName: params.mName,
                    bId: params.bId,
                    standardName: params.standardName,
                    mapSort: params.mapSort,
                    mapSortName: params.mapSortName
                }
            });
        },
        //修改状态
        updateState(state) {
            this.getListReal(this.columns);
            var self = this;
            Vue.ajax.send({
                name: "updataState",
                data: {
                    // mId: self.commonId,
                    mIdList: [self.commonId],
                    operation: "0", //操作类型
                    state: state,
                    baseId: self.updateBaseId,
                    updateType: 1 //0:修改，1：审核
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
        //删除规则确认操作
        delRuleYes() {
            // this.getListReal(this.columns);
            var self = this;
            Vue.ajax.send({
                name: "delDataMapped",
                data: {
                    mId: self.commonId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
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
        //详情
        detailsData(rowData, index) {
            //原数据expend的状态，true为显示，false为隐藏
            if (rowData._expanded == true) {
                rowData._expanded = false;
            } else {
                rowData._expanded = true;
            }
            //修改expend状态后与原来的数据进行替换
            this.dataList.splice(index, 1, rowData);

            var self = this;
            Vue.ajax.send({
                name: "map/expandData/get",
                data: {
                    baseId: rowData.bId,
                    mapType: rowData.mapSort
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.expandData = data.data;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: success.message
                        });
                    }
                }
            });
        },
        importButton() {
            this.importModel = true;
            this.excelName="";
            this.excelCap=null;
            this.$refs.addExcel.resetFields()
            this.radioUpdate(this.importExcelForm.disabledGroup,false);
        },
        //导入excel
        importExcel(file) {
            if(file==null){
                return false
            }
            this.excelCap=file;
            this.excelName=file.name;
            var self = this;
            self.excelInfor = [];
            excel.ReadCSV(file).then(
                function(data) {
                    let errorMessage="";
                    if (self.execlMessageType=="drug") {
                        for (let n = 1; n < data.length; n++) {
                            if (data[n][2].value.split('#').length<6) {
                                errorMessage+="第"+n+"行、";
                            }
                        }
                    }else if (self.execlMessageType=="pathDrug" || self.execlMessageType=="wound") {
                        for (let n = 1; n < data.length; n++) {
                            if (data[n][2].value.split('#').length<2) {
                                errorMessage+="第"+n+"行、";
                            }
                        }
                    }
                    if (errorMessage.length>1) {
                        self.$Modal.warning({
                            title: "标准id格式不正确",
                            content: "上传文件中 <b>"+errorMessage.substring(0,errorMessage.length-1)+"</b> 标准id格式不正确。请修改后重新上传。"
                        });
                        self.excelName="";
                        return;
                    }
                    self.excelInfor = data;
                },
                function(err) {}
            );
            return false;
        },
        radioUpdate(value,readFile) {
            if (
                value == "drug_generic_name" ||
                value == "drug_trade_name" ||
                value == "packing" ||
                value == "drug_formulation" ||
                value == "drug_manufacturers" ||
                value == "drug_spec"
            ) {
                this.isexeclMessage = true;
                this.execlMessageType="drug";
                this.execlMessage = '药品六项标准id示例：通用名#商品名#药品规格#包装规格#剂型#厂家（例：01#02####），六项标准id以"#"拼接顺序不可更改，没有则不写。';
            } else if (value == "path_drug" || value == "usage") {
                this.isexeclMessage = true;
                this.execlMessageType="pathDrug";
                this.execlMessage = '给药途径用法标准id示例：给药途径#用法（例：01#02），两项标准id以"#"拼接顺序不可更改，没有则不写。';
            } else if (value == "wound" || value == "healing") {
                this.isexeclMessage = true;
                this.execlMessageType="wound";
                this.execlMessage = '切口愈合标准id示例：切口#愈合（例：#01），两项标准id以"#"拼接顺序不可更改，没有则不写。';
            } else {
                this.isexeclMessage = false;
                this.execlMessage = "";
                this.execlMessageType="";
            }
            if(readFile!==false){
                this.importExcel(this.excelCap);
            }
        },
        //导入确认操作
        yesExcel() {
            this.$refs["addExcel"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "ruleDataMapped.importExcel",
                        data: {
                            mapType: self.importExcelForm.disabledGroup,
                            excelList: self.excelInfor
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.importModel = false;
                                self.$Modal.success({
                                    title: "成功",
                                    content: data.data
                                });
                                self.excelInfor = [];
                                self.ifSpan = false;
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
                // this.selectList.forEach(element => {
                //     idsList.push(element.mId + "#" + element.hospId);
                // });
                if (
                    this.columns == "doctor_id" ||
                    this.columns == "treatment_card" ||
                    this.columns == "medical_record"
                ) {
                    this.selectList.forEach(element => {
                        idsList.push(element.mId + "#" + element.hospId);
                    });
                } else {
                    this.selectList.forEach(element => {
                        idsList.push(element.mId);
                    });
                }

                this.updateAudit(this.selectList, state);
            }
        },
        updateAudit(idsList, state) {
            //设置访问地址
            this.getListReal(this.columns);
            var self = this;
            Vue.ajax.send({
                name: "updataState",
                data: {
                    mIdList: idsList,
                    operation: "1", //操作类型
                    state: state,
                    nopassReason: self.searchForm.nopassReason,
                    nopassRemark: self.searchForm.nopassRemark
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("操作成功。");
                        //清除信息
                        self.getDataList();
                        self.selectList = [];
                        self.searchForm.nopassReason =
                            self.nopassReasonList[0].label;
                        self.searchForm.nopassRemark = "";
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
                console.log(this.dataCol)
            }
        },
        //单选
        clickMe(index) {
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(
                this.showDatas[index].mId + ""
            );
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.showDatas[index].mId);
            }
        },
        //全选、非全选
        allClickMe(value) {
            if (value == 1) {
                this.selectList = this.showDatas.map(a =>
                    JSON.stringify(a["mId"])
                );
            } else {
                this.selectList = [];
            }
        },
        ruleTongguo(index) {
            this.commonId = this.showDatas[index].mId;
            this.auditSingle(2);
        },
        ruleBohui(index) {
            this.buTongGuo = true;
            this.commonId = this.showDatas[index].mId;
        },
        ruleTingyong(index) {
            this.tingYong = true;
            this.commonId = this.showDatas[index].mId;
            this.updateBaseId = this.showDatas[index].bId;
        },
        ruleQiyong(index) {
            this.qiYong = true;
            this.commonId = this.showDatas[index].mId;
            this.updateBaseId = this.showDatas[index].bId;
        },
        ruleBianji(index) {
            this.editData(this.showDatas[index]);
        },
        ruleShanchu(index) {
            this.delRule = true;
            this.commonId = this.showDatas[index].mId; //当前行id
            this.index = index; //行标识
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
.minItemWidth {
    width: 55px;
}
.ivu-form-item-content .ivu-upload .ivu-form-item-error-tip {
    margin-top: 35px;
    margin-left: 6px;
}
.cellLength {
    width: 90%;
    margin-top: 10px;
}
</style>