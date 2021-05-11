<template>
    <div class="m20"  style="height:calc(100% - 40px)" id="pageMain">
        <h2 class="common-title">数据映射</h2>
        <div style="height:calc(100% - 40px)">
            <Split v-model="split2" mode="vertical">
                <div slot="top" class="demo-split-pane">
                    <!-- <h3>映射列表</h3> -->
                    <div class="search-con">
                        <Form :model="searchForm" ref="formInline" inline>
                            <FormItem label="映射类型" :label-width="60">
                                <Select ref="mapSelect" v-model="searchForm.mapType" style="width: 120px;">
                                    <Option v-for="item in mapTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="医院" :label-width="40">
                                <Select v-model="searchForm.hospital" style="width: 120px;" filterable clearable>
                                    <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="数据类型" :label-width="60">
                                <Select v-model="searchForm.dataType" style="width: 110px;" clearable>
                                    <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="医院原始" :label-width="60">
                                 <Input  v-model="searchForm.hospRawText" type="text" placeholder="请输入医院原始文本" style="width: 300px;" clearable/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="getDataMappedList()">检索</Button>
                            </FormItem>
                            <Button v-authorize="'BusinessDataMappedSend'" type="primary" @click="sendMessageYes" :disabled="selectList.length==0" class="inputCheck" style="float: right;margin-left: 5px;">发通知</Button>
                        </Form>
                    </div>
                    <div class="mt5">
                        <Table border :height="tableH" @on-selection-change='getSelectList' @on-row-click="rowClick" :columns="showCol" :data="dataMappedList" style="margin-top: 10px;"></Table>
                    </div>
                    <div class="mt5 text-center mb5">
                        <Page :total="pageConfig.totalItemCount" @on-change='changePage' show-total transfer show-sizer :page-size-opts="[10,20,30,40,50,100,200,1000]" @on-page-size-change="changeSize" />
                    </div>
                </div>
                <div slot="bottom" class="demo-split-pane">
                    <div v-if="isNoTabs">
                        <!-- <h3>创建映射关系</h3> -->
                        <div class="search-con pt10 mt5">
                            <Form :model="mapForm" ref="formInline" inline>
                                <FormItem label="通用名" :label-width="60" v-if="showMultiQuery">
                                    <Input v-model="mapForm.secondKeyword" type="text" placeholder="请输入检索的通用名..." style="width: 260px;" />
                                </FormItem>
                                <FormItem :label="showMultiQuery?'生产企业':'关键字'" :label-width="60">
                                    <Input v-model="mapForm.keyword" type="text" :placeholder="showMultiQuery?'请输入检索的生产企业...':'请输入检索的关键字...'" style="width: 260px;" />
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="getStandardList(mapForm.keyword)">检索</Button>
                                </FormItem>
                                <FormItem v-if="isSubmitting">
                                    <Button type="primary" @click="nextOperation()">下一步</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div class="mt5">
                            <OTable v-if="showOTable" border :height="tableHTab" @on-selection-change='getSelectListMap' :columns="standardCol" :data="standardList" style="margin-top: 10px;"/>
                        </div>
                        <div class="mt5 text-center mb5">
                            <Page :total="mapPageConfig.totalItemCount" @on-change='changePageMap' show-total transfer show-sizer :page-size-opts="[10,20,30,40,50,100,200,1000]" @on-page-size-change="changeSizeMap" />
                        </div>
                    </div>


                    <!-- 诊断  疾病 -->
                    <div v-if="isTabsDiseaseType">
                        <!-- <h3>创建映射关系</h3> -->
                        <div class="search-con pt10 mt5">
                            <Form :model="mapForm" ref="formInline" inline>
                                
                                 <FormItem :label="'关键字'" :label-width="60">
                                    <Input v-model="standardSearchInputContent.noMapContent" type="text" :placeholder="'请输入检索的疾病...'" style="width: 260px;" />
                                </FormItem>
                                <FormItem :label="'上报内容'" :label-width="60">
                                    <Input v-model="standardSearchInputContent.hospUploadContent"   type="text" :placeholder="''" style="width: 260px;" />
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="getStandardList(standardSearchInputContent.noMapContent)">检索</Button>
                                </FormItem>
                                
                            </Form>
                        </div>
                        <div class="search-con pt10 mt5">
                            <Form :model="mapForm" ref="formInline" inline>
                                
                                <FormItem :label="'标准编码'" :label-width="60">
                                    <Input v-model="standardSearchInputContent.standardCode"    type="text" :placeholder="''" style="width: 260px;" />
                                </FormItem>
                                <FormItem :label="'标准名称'" :label-width="60">
                                    <Input v-model="standardSearchInputContent.standardName"    type="text" :placeholder="''" style="width: 260px;" />
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="addRules('1')">映射医院</Button>
                                </FormItem><FormItem>
                                    <Button type="primary" @click="addRules('0')">映射通用</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div class="search-con pt10 mt5">
                            <Form :model="mapForm" ref="formInline" inline>
                                <FormItem :label="'字典上报名称'" :label-width="60">
                                    <Input  v-model="keyWordName" type="text" :placeholder="''" style="width: 260px;" />
                                </FormItem>
                                <FormItem :label="'字典标准编码'" :label-width="60">
                                    <Input  v-model="keyWordCode"  type="text" :placeholder="''" style="width: 260px;" />
                                </FormItem>
                                <FormItem :label="'字典标准名称'" :label-width="60">
                                    <Input  v-model="keyWordStandardName" type="text" :placeholder="''" style="width: 260px;" />
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="addKeyWord('1')">添加字典</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div class="mt5">
                            <Table border :height="tableHTab" @on-selection-change='getSelectListMap' :columns="standardCol" :data="standardList" style="margin-top: 10px;"></Table>
                        </div>
                        <div class="mt5 text-center mb5">
                            <Page :total="mapPageConfig.totalItemCount" @on-change='changePageMap' show-total transfer show-sizer :page-size-opts="[10,20,30,40,50,100,200,1000]" @on-page-size-change="changeSizeMap" />
                        </div>
                    </div>
                    <!--切口愈合-->
                    <Tabs type="card" :value="tabsNameWound" @on-click="tabsColWound" v-if="isTabsWound" :animated="false">
                        <TabPane label="切口" name="wound">
                            <div class="search-con pt10 mt15">
                                <Form :model="mapForm" ref="formInline" inline>
                                    <FormItem label="切口" :label-width="60">
                                        <Input v-model="mapForm.keyword" type="text" placeholder="请输入检索的关键词..." style="width: 260px;" />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary" @click="getStandardList(mapForm.keyword)">检索</Button>
                                    </FormItem>
                                </Form>
                            </div>
                            <div class="mt5">
                                <Table border :height="tableHTab" @on-selection-change='getSelectListMap' :columns="standardCol" :data="standardList" style="margin-top: 10px;"></Table>
                            </div>
                            <div class="mt5 text-center mb5">
                                <Page :total="mapPageConfig.totalItemCount" @on-change='changePageMap' show-total transfer show-sizer @on-page-size-change="changeSizeMap" />
                            </div>
                        </TabPane>
                        <TabPane label="愈合" name="healing">
                            <div class="search-con pt10 mt15">
                                <Form :model="mapForm" ref="formInline" inline>
                                    <FormItem label="愈合" :label-width="60">
                                        <Input v-model="mapForm.keyword" type="text" placeholder="请输入检索的关键词..." style="width: 260px;" />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary" @click="getStandardList(mapForm.keyword)">检索</Button>
                                    </FormItem>
                                </Form>
                            </div>
                            <div class="mt5">
                                <Table border :height="tableHTab" @on-selection-change='getSelectListMap' :columns="standardCol" :data="standardList" style="margin-top: 10px;"></Table>
                            </div>
                            <div class="mt5 text-center mb5">
                                <Page :total="mapPageConfig.totalItemCount" @on-change='changePageMap' show-total transfer show-sizer @on-page-size-change="changeSizeMap" />
                            </div>
                        </TabPane>
                        <Button type="primary" style="z-index:9999;right: 100px;" class="btn btn-block" @click="addRules('1')">
                            <b>医院</b><br/>
                            <b>规则</b>
                        </Button>
                        <Button type="primary" style="z-index:9999;right: 40px;" class="btn btn-block" @click="addRules('0')">
                            <b>通用</b><br/>
                            <b>规则</b>
                        </Button>
                    </Tabs>

                    <!--给药途径用法-->
                    <Tabs type="card" :value="tabsNameUsage" @on-click="tabsColUsage" v-if="isTabsUsage" :animated="false">
                        <TabPane label="给药途径" name="path_drug">
                            <div class="search-con pt10 mt15">
                                <Form :model="mapForm" ref="formInline" inline>
                                    <FormItem label="给药途径" :label-width="60">
                                        <Input v-model="mapForm.keyword" type="text" placeholder="请输入检索的关键词..." style="width: 260px;" />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary" @click="getStandardList(mapForm.keyword)">检索</Button>
                                    </FormItem>
                                </Form>
                            </div>
                            <div class="mt5">
                                <Table border :height="tableHTab" @on-selection-change='getSelectListMap' :columns="standardCol" :data="standardList" style="margin-top: 10px;"></Table>
                            </div>
                            <div class="mt5 text-center mb5">
                                <Page :total="mapPageConfig.totalItemCount" @on-change='changePageMap' show-total transfer show-sizer @on-page-size-change="changeSizeMap" />
                            </div>
                        </TabPane>
                        <TabPane label="用法" name="usage">
                            <div class="search-con pt10 mt15">
                                <Form :model="mapForm" ref="formInline" inline>
                                    <FormItem label="用法" :label-width="60">
                                        <Input v-model="mapForm.keyword" type="text" placeholder="请输入检索的关键词..." style="width: 260px;" />
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary" @click="getStandardList(mapForm.keyword)">检索</Button>
                                    </FormItem>
                                </Form>
                            </div>
                            <div class="mt5">
                                <Table border :height="tableHTab" @on-selection-change='getSelectListMap' :columns="standardCol" :data="standardList" style="margin-top: 10px;"></Table>
                            </div>
                            <div class="mt5 text-center mb5">
                                <Page :total="mapPageConfig.totalItemCount" @on-change='changePageMap' show-total transfer show-sizer @on-page-size-change="changeSizeMap" />
                            </div>
                        </TabPane>
                        <Button type="primary" style="z-index:9999;right: 100px;" class="btn btn-block" @click="addRules('1')">
                            <b>医院</b><br/>
                            <b>规则</b>
                        </Button>
                        <Button type="primary" style="z-index:9999;right: 40px;" class="btn btn-block" @click="addRules('0')">
                            <b>通用</b><br/>
                            <b>规则</b>
                        </Button>
                    </Tabs>
                </div>
            </Split>
        </div>
        <Modal v-model="model1" title="药品映射" width=550 @on-ok="drugMapped">
            映射类型：
            <RadioGroup v-model="drugRadio" style="margin-bottom:5px;">
                <Radio label="0">整条数据映射</Radio>
                <Radio label="1">单字段映射</Radio>
            </RadioGroup>
            <!-- </br> -->
            <span v-if="drugRadio=='1'" style="margin-top: 10px;">
                <!-- 请选择一对多字段映射：</br> -->
                <h5 v-if="isCheckGroupGen" class="spanDrug">{{CheckGroupGenName}}：</h5>
                <CheckboxGroup v-if="isCheckGroupGen" v-model="RadioGroupGen" class="checkDrug" @on-change="drugGen">
                    <Checkbox label="drugGenericName">通用名</Checkbox>
                    <Checkbox label="drugTradeName">商品名</Checkbox>
                    <Checkbox label="spec">药品规格</Checkbox>
                    <Checkbox label="packageSpec">包装规格</Checkbox>
                    <Checkbox label="formNameChinese">药品剂型</Checkbox>
                    <Checkbox label="companyName">生产企业</Checkbox>
                </CheckboxGroup>

                <h5 v-if="isCheckGroupTrade" class="spanDrug">{{CheckGroupTradeName}}：</h5>
                <CheckboxGroup v-if="isCheckGroupTrade" v-model="RadioGroupTrade" class="checkDrug" @on-change="drugTrade">
                    <Checkbox label="drugGenericName">通用名</Checkbox>
                    <Checkbox label="drugTradeName">商品名</Checkbox>
                    <Checkbox label="spec">药品规格</Checkbox>
                    <Checkbox label="packageSpec">包装规格</Checkbox>
                    <Checkbox label="formNameChinese">药品剂型</Checkbox>
                    <Checkbox label="companyName">生产企业</Checkbox>
                </CheckboxGroup>
                
                <h5 v-if="isCheckGroupSpec" class="spanDrug">{{CheckGroupSpecName}}：</h5>
                <CheckboxGroup v-if="isCheckGroupSpec" v-model="RadioGroupSpec" class="checkDrug" @on-change="drugSpec">
                    <Checkbox label="drugGenericName">通用名</Checkbox>
                    <Checkbox label="drugTradeName">商品名</Checkbox>
                    <Checkbox label="spec">药品规格</Checkbox>
                    <Checkbox label="packageSpec">包装规格</Checkbox>
                    <Checkbox label="formNameChinese">药品剂型</Checkbox>
                    <Checkbox label="companyName">生产企业</Checkbox>
                </CheckboxGroup>
                
                <h5 v-if="isCheckGroupPack" class="spanDrug">{{CheckGroupPackName}}：</h5>
                <CheckboxGroup v-if="isCheckGroupPack" v-model="RadioGroupPack" class="checkDrug" @on-change="drugPack">
                    <Checkbox label="drugGenericName">通用名</Checkbox>
                    <Checkbox label="drugTradeName">商品名</Checkbox>
                    <Checkbox label="spec">药品规格</Checkbox>
                    <Checkbox label="packageSpec">包装规格</Checkbox>
                    <Checkbox label="formNameChinese">药品剂型</Checkbox>
                    <Checkbox label="companyName">生产企业</Checkbox>
                </CheckboxGroup>

                <h5 v-if="isCheckGroupForm" class="spanDrug">{{CheckGroupFormName}}：</h5>
                <CheckboxGroup v-if="isCheckGroupForm" v-model="RadioGroupForm" class="checkDrug" @on-change="drugForm">
                    <Checkbox label="drugGenericName">通用名</Checkbox>
                    <Checkbox label="drugTradeName">商品名</Checkbox>
                    <Checkbox label="spec">药品规格</Checkbox>
                    <Checkbox label="packageSpec">包装规格</Checkbox>
                    <Checkbox label="formNameChinese">药品剂型</Checkbox>
                    <Checkbox label="companyName">生产企业</Checkbox>
                </CheckboxGroup>
                
                <h5 v-if="isCheckGroupCom" class="spanDrug">{{CheckGroupComName}}：</h5>
                <CheckboxGroup v-if="isCheckGroupCom" v-model="RadioGroupCom" class="checkDrug" @on-change="drugCom">
                    <Checkbox label="drugGenericName">通用名</Checkbox>
                    <Checkbox label="drugTradeName">商品名</Checkbox>
                    <Checkbox label="spec">药品规格</Checkbox>
                    <Checkbox label="packageSpec">包装规格</Checkbox>
                    <Checkbox label="formNameChinese">药品剂型</Checkbox>
                    <Checkbox label="companyName">生产企业</Checkbox>
                </CheckboxGroup>
            </span>
        </Modal>
        <Modal v-model="model2" title="质疑" width=420 @on-ok="queryAdd">
            <!-- 请选择质疑原因：
            <Select v-model="queryReason" class="cellLength" filterable style="margin-top: 8px;">
                <Option v-for="(item,index) in queryReasonList" :value='item.label+"#"+item.value' :key="index">{{ item.label }}</Option>
            </Select> -->
            <Form>
                <FormItem label="质疑原因" :label-width="80">
                    <Select v-model="queryReason" class="cellLength" filterable>
                         <Option v-for="(item,index) in queryReasonList" :value='item.label+"#"+item.value' :key="index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" :label-width="80">
                    <Input v-model="nopassRemark" type="textarea" class="cellLength" :rows="3" :maxlength="100" />
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="delRule" title="删除" width=420 @on-ok="delRuleYes">
            您确定要删除该数据吗？
        </Modal>
    </div>
</template>

<style>
.btn-block {
    position: fixed;
    bottom: 50px;
}
.checkDrug{
    /* float: right;
    margin-top: -20px;
    width: 455px; */
    margin-left: 30px;
}
.spanDrug{
    margin-top: 5px;
}
.demo-split{
    /* height: 600px; */
    /* border: 1px solid #dcdee2; */
    height: 0;
    padding-bottom: 5%;
    margin: 0 auto;
}
.demo-split-pane{
    padding: 10px;
}
</style>

<script>
import Vue from "vue";
import commonJson from "@/assets/data/business/common.json";
import configColumns from './config';
import OTable from '@/components/common/OTable.vue';
export default {
    name: "dataMapped",
    components: {OTable},
    data() {
        return {
            showOTable:true,
            tableH: 0,
            tableHTab: 0,
            split2: 0.5,
            divHeight:600,
            // 动态过滤列使用 TODO
            filterDrugGenericName:[{label:'对乙酰氨基酚',value:1},
                            {label:'haha2',value:2}],
            filterDrugProductName:[],
            filterDrugSpec:[],
            filterDrugUniSpec:[],
            filterDrugForm:[],
            filterDrugCompany:[],
            dataTypeList: commonJson.dataTypeList, //数据类型
            showDrugSearchParams: false,
            hospitalList: [], //医院
            dataMappedList: [], //错误列表
            standardList: [], //标准列表
            selectList: [], //选中的信息
            selectListMap: [], //选中的信息
            queryReasonList:[],//质疑原因
            queryReason:"",//质疑原因
            nopassRemark:"",
            appendId:"",
            queryMId:"",//质疑数据id
            queryDataType:"",//质疑数据类型
            commonId: "", //存放id
            index:"",//操作行标识
            hosId: "", //医院id
            yearMonth: "", //数据年月
            keyword: "", //检索信息
            Operation: {}, //操作列,
            diseaseTypeOperation:{},
            checkBoxList: [], //可选列
            checkAllGroup: [], //选中的多选框
            mapTypeList: [],
            isSubmitting: false, //下一步按钮显示状态
            isNoTabs: true, //列表页是否显示
            isTabsDrug: false, //tabs标签页是否显示（药品六项）
            isTabsWound: false, //tabs标签页是否显示（切口愈合）
            isTabsUsage: false, //tabs标签页是否显示（给药途径用法）
            isTabsDiseaseType:false,
            model1: false, //弹窗（药品六项）
            model2:false,
            delRule:false,
            drugRadio:"1",
            isCheckGroupGen: false, //通用名显示状态
            CheckGroupGenName:"",
            RadioGroupGen: [], //药品六项字段(通用名)
            isCheckGroupTrade: false, //商品名显示状态
            CheckGroupTradeName:"",
            RadioGroupTrade: [], //药品六项字段（商品名）
            isCheckGroupSpec: false, //药品规格显示状态
            CheckGroupSpecName:"",
            RadioGroupSpec: [], //药品六项字段（药品规格）
            isCheckGroupCom: false, //厂家显示状态
            CheckGroupComName:"",
            RadioGroupCom: [], //药品六项字段（厂家）
            isCheckGroupForm: false, //剂型显示状态
            CheckGroupFormName:"",
            RadioGroupForm: [], //药品六项字段（剂型）
            isCheckGroupPack: false, //包装规格显示状态
            CheckGroupPackName:"",
            RadioGroupPack: [], //药品六项字段（包装规格）
            drugParams:{},//保存创建规则的标准数据（药品映射使用）
            addMapType:"",//映射类型（药品映射使用）
            tabsNameDrug: "", //tabs默认选中（药品六项）
            tabsNameWound: "", //tabs默认选中（切口愈合）
            tabsNameUsage: "", //tabs默认选中（给药途径用法）
            tabsCheckedName: "", //tabs选中的标签
            baseIdList: ["", "", "", "", "", ""], //标准数据id集合(药品六项)
            baseIdTwoList: ["", ""], //标准数据id集合（切口愈合、给药途径用法）
            uniteId: "", //联合id
            drugInforIdList: "", //药品六项编码
            drug:"",//药品编码
            inforType: "", //错误数据类型
            order: "0",
            selectErrorList: [], //错误信息
            sendMessage:"",
            showMultiQuery:false,
            keyWordCode:"",
            keyWordName:"",
            keyWordStandardName:"",
            standardSearchInputContent:{
                noMapContent: "",
                standardCode: "",
                standardName:"",
                hospUploadContent:""
            },
            baseMapTypeList:[
                {
                    value: "drug",
                    label: "药品"
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
                {
                    value: "treatment_card",
                    label: "就诊号"
                },
                {
                    value: "doctor_id",
                    label: "工号"
                },
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
                {
                    value: "medical_record",
                    label: "病案号"
                },
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
            ],
            searchForm: {
                dataType: "",
                mapType: "",
                hospital:"",
                hospRawText:""
            },
            mapForm: {
                keyword: ""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 10,
                totalItemCount: 1
            },
            mapPageConfig: {
                pageNum: 1,
                pageSize: 10,
                totalItemCount: 0
            },
            showCol: [], //错误数据显示列
            mapCol: [], //映射列
            standardCol: [] //标准数据显示列
        };
    },
       activated(){
        if (this.$route.params.id != undefined && this.$route.params.id != "") {
            this.searchForm.dataType=Number(this.$route.params.id);
        }

        this.getDataMappedList();
    },
    mounted() {
        //错误数据显示列
        this.baseCol = [
            {
                title: "",
                type: "selection",
                width: 50,
                //align: "center",
                fixed: "left"
            },
            {
                title: "医院",
                // width: 150,
                //align: "center",
                key: "hospName"
            },
            {
                title: "数据年月",
                // width: 85,
                //align: "center",
                key: "yearMonth"
            },
            // {
            //     title: "状态",
            //     width: 75,
            //     //align: "center",
            //     key: "status"
            // }
        ];
        //操作列
        this.Operation = {
            title: "操作",
            width: 120,
            //align: "center",
            fixed: "right",
            key: "action",
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
                                color: "#2d8cf0"
                            },
                            on: {
                                click: () => {
                                    if (params.row.standardId==null) {
                                        this.uniteId=params.row.diseaseTypeNameAb;
                                    }else{
                                        // this.uniteId =this.uniteId + params.row.standardId;
                                        this.uniteId =params.row.standardId;
                                    }

                                    if (this.selectList.length < 1) {
                                        this.$Message.error(
                                            "请选择需要映射的错误数据。"
                                        );
                                    } else {
                                        var isSave = true;
                                        if (this.inforType == "drug") {
                                            ////判断药品六项是否都非空
                                            // if (
                                            //     this.selectList[0].drugGenericName != null &&this.selectList[0].drugGenericName.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].drugTradeName != null &&this.selectList[0].drugTradeName.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].spec !=null &&this.selectList[0].spec.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].formNameChinese != null &&this.selectList[0].formNameChinese.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].packageSpec != null &&this.selectList[0].packageSpec.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].companyName != null &&this.selectList[0].companyName.replace(/(^s*)|(s*$)/g,"").length > 0
                                            // ) {
                                            //     //隐藏弹窗
                                            //     this.model1 = false;
                                            //     //用“#”拼接
                                            //     this.drugInforIdList =
                                            //         params.row.drugGenericCode +"#####" + "_" +
                                            //         "#" + params.row.drugTradeCode +"####" + "_" +
                                            //         "##" + params.row.drugSpecCode + "###" + "_" +
                                            //         "###" + params.row.packageSpecCode + "##" + "_" +
                                            //         "####" +  params.row.form + "#" + "_" +
                                            //         "#####" + params.row.manufacturer;
                                            // } else {
                                                isSave = false;
                                                this.model1 = true; //显示弹窗
                                                this.addMapType="0";//通用
                                                this.drugParams=params.row;
                                                if (this.selectList[0] .drugGenericName == null ||this.selectList[0].drugGenericName.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupGen = false;
                                                else
                                                    this.CheckGroupGenName=this.selectList[0].drugGenericName;
                                                if (this.selectList[0].drugTradeName ==null ||this.selectList[0].drugTradeName.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupTrade = false;
                                                else
                                                    this.CheckGroupTradeName=this.selectList[0].drugTradeName;
                                                if (this.selectList[0].spec ==null ||this.selectList[0].spec.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupSpec = false;
                                                else
                                                    this.CheckGroupSpecName=this.selectList[0].spec;
                                                if (this.selectList[0].packageSpec == null ||this.selectList[0].packageSpec.replace(/(^s*)|(s*$)/g,"").length == 0)
                                                    this.isCheckGroupPack = false;
                                                else
                                                    this.CheckGroupPackName=this.selectList[0].packageSpec;
                                                if (this.selectList[0].formNameChinese ==null ||this.selectList[0].formNameChinese.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupForm = false;
                                                else
                                                    this.CheckGroupFormName=this.selectList[0].formNameChinese;
                                                if (this.selectList[0].companyName == null ||this.selectList[0].companyName.replace( /(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupCom = false;
                                                else
                                                    this.CheckGroupComName=this.selectList[0].companyName;
                                            // }
                                        }
                                        if (isSave) {
                                            this.addRules("0");
                                        }
                                    }
                                }
                            }
                        },
                        "通用"
                    ),
                    h(
                        "Button",
                        {
                            props: {
                                type: "text",
                                size: "small"
                            },
                            style: {
                                color: "#2d8cf0"
                            },
                            on: {
                                click: () => {
                                    if (params.row.standardId==null) {
                                        this.uniteId=params.row.diseaseTypeNameAb;
                                    }else{
                                        // this.uniteId =this.uniteId + params.row.standardId;
                                        this.uniteId =params.row.standardId;
                                    }

                                    if (this.selectList.length < 1) {
                                        this.$Message.error(
                                            "请选择需要映射的错误数据。"
                                        );
                                    } else {
                                        var isSave = true;
                                        if (this.inforType == "drug") {
                                            // //判断药品六项是否都非空
                                            // if (
                                            //     this.selectList[0].drugGenericName != null &&this.selectList[0].drugGenericName.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].drugTradeName != null &&this.selectList[0].drugTradeName.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].spec !=null &&this.selectList[0].spec.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].formNameChinese != null &&this.selectList[0].formNameChinese.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].packageSpec != null &&this.selectList[0].packageSpec.replace(/(^s*)|(s*$)/g,"").length > 0 &&
                                            //     this.selectList[0].companyName != null &&this.selectList[0].companyName.replace(/(^s*)|(s*$)/g,"").length > 0
                                            // ) {
                                            //     //隐藏弹窗
                                            //     this.model1 = false;
                                            //     //用“#”拼接
                                            //     this.drugInforIdList =
                                            //         params.row.drugGenericCode +"#####" + "_" +
                                            //         "#" + params.row.drugTradeCode +"####" + "_" +
                                            //         "##" + params.row.drugSpecCode + "###" + "_" +
                                            //         "###" + params.row.packageSpecCode + "##" + "_" +
                                            //         "####" +  params.row.form + "#" + "_" +
                                            //         "#####" + params.row.manufacturer;
                                            // } else {
                                                isSave = false;
                                                this.model1 = true; //显示弹窗
                                                this.addMapType="1";//非通用
                                                this.drugParams=params.row;
                                                if (this.selectList[0] .drugGenericName == null ||this.selectList[0].drugGenericName.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupGen = false;
                                                else
                                                    this.CheckGroupGenName=this.selectList[0].drugGenericName;
                                                if (this.selectList[0].drugTradeName ==null ||this.selectList[0].drugTradeName.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupTrade = false;
                                                else
                                                    this.CheckGroupTradeName=this.selectList[0].drugTradeName;
                                                if (this.selectList[0].spec ==null ||this.selectList[0].spec.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupSpec = false;
                                                else
                                                    this.CheckGroupSpecName=this.selectList[0].spec;
                                                if (this.selectList[0].packageSpec == null ||this.selectList[0].packageSpec.replace(/(^s*)|(s*$)/g,"").length == 0)
                                                    this.isCheckGroupPack = false;
                                                else
                                                    this.CheckGroupPackName=this.selectList[0].packageSpec;
                                                if (this.selectList[0].formNameChinese ==null ||this.selectList[0].formNameChinese.replace(/(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupForm = false;
                                                else
                                                    this.CheckGroupFormName=this.selectList[0].formNameChinese;
                                                if (this.selectList[0].companyName == null ||this.selectList[0].companyName.replace( /(^s*)|(s*$)/g,"").length == 0) 
                                                    this.isCheckGroupCom = false;
                                                else
                                                    this.CheckGroupComName=this.selectList[0].companyName;
                                            // }
                                        }
                                        if (isSave) {
                                            this.addRules("1");
                                        }
                                    }
                                }
                            }
                        },
                        "医院"
                    )
                ]);
            }
        };
        //疾病列
        this.diseaseTypeOperation = {
            title: "操作",
            width: 60,
            //align: "center",
            fixed: "right",
            key: "action",
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
                                color: "#2d8cf0"
                            },
                            on: {
                                click: () => {
                                    console.log(params);
                                    this.appendId = params.row.diseaseType
                                   this.appendStandard(params.row.diseaseType,params.row.diseaseTypeName);
                                }
                            }
                        },
                        "追加"
                    )
                ]);
                  
 
            }
        };
        //多选列
        this.select = {
            title: " ",
            type: "radio",
            width: 50,
            //align: "center",
            fixed: "left",
            render: (h, params) => {
                let id = params.row.standardId;
                let defaultS = false;
                if (id === this.commonId) {
                    defaultS = true;
                }
                return h("div", [
                    h("radio", {
                        props: {
                            value: defaultS
                        },
                        on: {
                            "on-change": e => {
                                this.commonId = id;
                                //药品六项（通用名、商品名、药品规格、包装规格、剂型、厂家：顺序固定不能修改）
                                if (this.tabsNameDrug == "drug_generic_name") {
                                    //通用名
                                    this.baseIdList[0] = id;
                                } else if (
                                    this.tabsNameDrug == "drug_trade_name"
                                ) {
                                    //商品名
                                    this.baseIdList[1] = id;
                                } else if (this.tabsNameDrug == "drug_spec") {
                                    //药品规格
                                    this.baseIdList[2] = id;
                                } else if (
                                    this.tabsNameDrug == "packing_quantity"
                                ) {
                                    //包装（规格）
                                    this.baseIdList[3] = id;
                                } else if (
                                    this.tabsNameDrug == "drug_formulation"
                                ) {
                                    //剂型
                                    this.baseIdList[4] = id;
                                } else if (
                                    this.tabsNameDrug == "drug_manufacturers"
                                ) {
                                    //生产企业
                                    this.baseIdList[5] = id;
                                }
                                //切口愈合（顺序不可改）
                                if (this.tabsNameWound == "wound") {
                                    //切口
                                    this.baseIdTwoList[0] = id;
                                } else if (this.tabsNameWound == "healing") {
                                    //愈合
                                    this.baseIdTwoList[1] = id;
                                }
                                //给药途径用法(顺序不可改)
                                if (this.tabsNameUsage == "path_drug") {
                                    //给药途径
                                    this.baseIdTwoList[0] = id;
                                } else if (this.tabsNameUsage == "usage") {
                                    //用法
                                    this.baseIdTwoList[1] = id;
                                }
                            }
                        }
                    })
                ]);
            }
        };
        //药品映射单选列
        this.mapSelect=[
            { title: "", type: "selection", width: 50, fixed: "left" },
            // 20210402 屏蔽单选，改多选
            // { title: " ", type: "radio", width: 50, fixed: "left",
            //     render: (h, params) => {
            //         let id = params.index;
            //         let defaultS = false;
            //         if (id === this.index) { defaultS = true; }
            //         return h("div", [ h("radio", { props: { value: defaultS }, on: { "on-change": e => { this.index = id; } } }) ]);
            //     }
            // },
            {
                title: "医院",
                width: 150,
                //align: "center",
                key: "hospName"
            },
            {
                title: "数据年月",
                width: 85,
                //align: "center",
                key: "yearMonth"
            }
        ];
        //药品操作列
        this.DrugOperation = {
            title: "操作",
            width: 110,
            //align: "center",
            fixed: "right",
            key: "action",
            render: (h, params) => {
                return h("div", [
                    h(
                        "Button",
                        {
                            props: {
                                icon: "md-help-circle"
                            },
                            class: "btn-red",
                            attrs: {
                                title: "质疑"
                            },
                            on: {
                                click: () => {
                                    //质疑该条数据
                                    this.queryMId=params.row.mId;
                                    this.queryDataType=params.row.dataType;
                                    this.model2=true;
                                }
                            }
                        }
                    ),h(
                        "Button",
                        {
                            props: {
                                icon: "md-close"
                            },
                            class: "btn-red",
                            attrs: {
                                title: "删除"
                            },
                            on: {
                                click: () => {
                                    //删除该条数据
                                    this.commonId=params.row.mId;
                                    this.delRule=true;
                                }
                            }
                        }
                    )
                ]);
            }
        };
        
        //删除操作列
        this.deleteOPeration={
            title: "操作",
            width: 70,
            //align: "center",
            fixed: "right",
            key: "action",
            render: (h, params) => {
                return h("div", [
                    h(
                        "Button",
                        {
                            props: {
                                icon: "md-close"
                            },
                            class: "btn-red",
                            attrs: {
                                title: "删除"
                            },
                            on: {
                                click: () => {
                                    //删除该条数据
                                    this.commonId=params.row.mId;
                                    this.delRule=true;
                                }
                            }
                        }
                    )
                ]);
            }
        }
        //初始化
        // this.tableH = window.innerHeight - 310;
        // this.tableHTab = window.innerHeight - 322;
        this.tableH = document.getElementById("pageMain").offsetHeight/2 - 120;
        this.tableHTab = document.getElementById("pageMain").offsetHeight*0.7;
        // this.searchForm.mapType = this.mapTypeList[0].value;
        // this.getDataMappedList(); //获取列表数据
        this.getSelectListMapSel(); //筛选条件
        this.getQueryReasonList();//获取质疑数据
        this.getHospitalList(""); //获取医院数据
    },
    methods: {
        //获取医院
        getHospitalList(value) {
            var self = this;
            Vue.ajax.send({
                name: "business.hospitalList",
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
        getSelectListMapSel() {
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.select",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.mapTypeList = [];
                        data.data.forEach(m => {
                            self.baseMapTypeList.forEach(n => {
                                if (m == n.value) {
                                    self.mapTypeList.push(n);
                                }
                            });
                        });
                        self.searchForm.mapType =
                            self.mapTypeList[0].value;
                        self.showMultiQuery=self.searchForm.mapType=="drug"
                        //查询列表数据
                        self.getDataMappedList();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //切口愈合
        tabsColWound(name) {
            // this.setColumn(name);
            this.tabsNameWound = name;
            this.mapCol = [];
            if (name == "wound") {
                //切口
                var clo = {
                    title: "切口",
                    //align: "center",
                    key: "wound"
                };
                this.mapCol.push(clo);
            } else if (name == "healing") {
                //愈合
                var clo = {
                    title: "愈合",
                    //align: "center",
                    key: "healing"
                };
                this.mapCol.push(clo);
            }
            this.getStandardList("");
        },
        //给药途径用法
        tabsColUsage(name) {
            // this.setColumn(name);
            this.tabsNameUsage = name;
            this.mapCol = [];
            if (name == "path_drug") {
                //给药途径
                var clo = {
                    title: "给药途径",
                    //align: "center",
                    key: "pathDrug"
                };
                this.mapCol.push(clo);
            } else if (name == "usage") {
                //用法
                var clo = {
                    title: "用法",
                    //align: "center",
                    key: "usage"
                };
                this.mapCol.push(clo);
            }
            this.getStandardList("");
        },
        //获取错误列表数据
        getDataMappedList() {
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.errorQuery",
                data: {
                    pageIndex: self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    mapType: self.searchForm.mapType, //映射类型
                    hospital: self.searchForm.hospital, //映射类型
                    dataType: self.searchForm.dataType, //数据类型
                    hospRawText:self.searchForm.hospRawText,
                    showErrorColumn: true
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataMappedList = data.data.dataList;
                        
                        if(self.dataMappedList){
                            self.dataMappedList.forEach(item=>{
                                Object.keys(item).forEach(key=>{
                                    
                                    if(item.mappingRules && configColumns.json[key] && item.mappingRules.indexOf(configColumns.json[key])>-1){
                                        item.cellClassName={[key]:'demo-table-info-cell-age'}
                                    }
                                })
                            })
                        }
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        self.pageConfig.pageNum = data.data.currentPageIndex;
                                                
                        
                        //设置显示列
                        self.setColumn(self.searchForm.mapType);

                        //保存错误类型
                        self.inforType = self.searchForm.mapType;
                        self.showMultiQuery=self.inforType=="drug"
                        //清空id
                        self.commonId = "";
                        self.index="";
                        //重置选择错误信息
                        self.selectErrorList = [];
                        self.selectList=[];

                        self.sendMessage="";
                        //重置标准id集合
                        self.baseIdList = ["", "", "", "", "", ""];
                        self.baseIdTwoList = ["", ""];
                        self.mapForm.keyword="";
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        getQueryReasonList(){
            var self = this;
            Vue.ajax.send({
                name: "common.getDictionary",
                data: {
                    optionType:"busquery"
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.queryReasonList=data.data;
                        self.queryReason=self.queryReasonList[0].label+"#"+self.queryReasonList[0].value;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取标准列表数据
        getStandardList(keyword) {
            //重置药品六项显示状态
            this.isCheckGroupGen = true;
            this.isCheckGroupTrade = true;
            this.isCheckGroupSpec = true;
            this.isCheckGroupForm = true;
            this.isCheckGroupPack = true;
            this.isCheckGroupCom = true;

            let maptype = "";
            //标准数据显示列
            this.standardCol = [];
            this.standardCol.push.apply(this.standardCol, this.mapCol);
            if (this.isSubmitting) {
                //切口愈合联合、用法给药途径联合
                this.standardCol.push(this.select);
                maptype = this.searchForm.mapType;
            } else if (this.isTabsDrug) {
                //药品六项
                this.standardCol.push(this.select);
                maptype = this.tabsNameDrug;
            } else if (this.isTabsWound) {
                //切口、愈合
                this.standardCol.push(this.select);
                maptype = this.tabsNameWound;
            } else if (this.isTabsUsage) {
                //给药途径、用法
                this.standardCol.push(this.select);
                maptype = this.tabsNameUsage;
            } else if (this.isTabsDiseaseType) {
                
                this.standardCol.push(this.diseaseTypeOperation);
                maptype = this.searchForm.mapType;
            }else {
                this.standardCol.push(this.Operation);
                maptype = this.searchForm.mapType;
            }
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.standardQuery",
                data: {
                    pageIndex: self.mapPageConfig.pageNum, //页码
                    pageSize: self.mapPageConfig.pageSize, //每页条数
                    mapType: maptype, //映射类型
                    keyword: keyword, //错误信息
                    secondKeyword: self.showMultiQuery?self.mapForm.secondKeyword:"",
                    order: self.order
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.standardList = data.data.dataList;
                        self.addColumnFilter();
                        if (maptype=="drug"||maptype=="diagnostic") {
                            self.mapPageConfig.totalItemCount=5*self.mapPageConfig.pageSize;
                        }else{
                            self.mapPageConfig.totalItemCount =
                                data.data.totalItemCount;
                        }
                        self.mapPageConfig.pageNum = data.data.currentPageIndex;
                        self.keyword = keyword;

                        // TODO 渲染过滤器
                        // 设置显示列之前设置列的过滤器使用的数组
                        // if(maptype=="drug"){
                        //     self.filterDrugGenericName = [];
                        //     let tempDrugGenericNameArr = [];
                        //     self.standardList.forEach(
                        //         oneRow =>{
                        //             if(oneRow.drugGenericName){
                        //                 filterDrugGenericName.push({label:oneRow.drugGenericName,value:oneRow.drugGenericName});
                        //             }
                        //         }
                        //     );
                        //     console.log(tempDrugGenericNameArr);
                        //     // console.log(self.uniqueArr(tempDrugGenericNameArr,(a,b) => a.value == b.value));
                        //     self.filterDrugGenericName = tempDrugGenericNameArr;
                        //     self.setColumn('drug');
                        // }
                        

                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        uniqueArr(arr,fn){
            arr.reduce((acc,v)=>{
                if(!acc.some(x=>fn(v,x))) acc.push(v);
                return acc;
            },[]);
        },
        //追加标准数据到input
        appendStandard(key,value){
            // if(this.standardSearchInputContent.standardCode != null && this.standardSearchInputContent.standardCode .length > 1 && this.standardSearchInputContent.standardCode.indexOf(key,value)<0){
            //     this.standardSearchInputContent.standardCode+="|"+key;
            //     this.standardSearchInputContent.standardName+="|"+value;
            // }
            if(this.standardSearchInputContent.standardCode == null){
                this.standardSearchInputContent.standardCode = "";
            }
            if(this.standardSearchInputContent.standardName == null){
                this.standardSearchInputContent.standardName = "";
            }
            this.standardSearchInputContent.standardCode+="|"+key;
                this.standardSearchInputContent.standardName+="|"+value;
             
            
        },
        addKeyWord(){
            if(  this.keyWordCode.trim().length === 0 || this.keyWordName.trim().split(" ").join("").length === 0){
                self.$Modal.error({
                                title: "失败",
                                content: "请输入数据"
                            });
                return;
            }
            var self = this;
            Vue.ajax.send({
                    name: "dataMapped.addKeyWord",
                    data: {

                        codeSeries: self.keyWordCode.trim(), //错误数据
                        nameSeries: self.keyWordStandardName.trim(), //标准id
                        keyWord:self.keyWordName.trim(),
                        mapType: self.selectList[0].mapType, //映射类型
                        dataType: self.selectList[0].dataType //数据类型
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success("添加字段成功");
                            
                        } else {
                            // var errormessage=data.message=="0"?"停用":data.message=="1"?"待审核":data.message=="2"?"通过":"驳回"
                            self.$Modal.error({
                                title: "失败",
                                content: data.message
                            });
                        }
                    }
                });
        },
        //创建规则
        addRules(addType) {
            let idList = "";
            let nameList="";
            if (this.isTabsDrug) {
                idList = this.baseIdList.join("#"); //以#拼接成字符串
            } else if (this.isTabsWound || this.isTabsUsage) {
                idList = this.baseIdTwoList.join("#");
            }else if(this.isTabsDiseaseType){
                idList = this.standardSearchInputContent.standardCode;
                nameList = this.standardSearchInputContent.standardName;
            } else {
                idList = this.uniteId;
            }
            var self = this;
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择要创建映射的错误数据！</h5>"
                });
            } else {
                Vue.ajax.send({
                    name: "dataMapped.addRules",
                    data: {
                        errorList: self.selectErrorList, //错误数据
                        mapId: idList, //标准id
                        mapName:nameList,//疾病映射需要记录标准疾病名称
                        drugInforIdList: self.drugInforIdList, //药品六项编码（只有药品映射是才使用）
                        drug:self.drug,//药品编码（只有药品整天映射时使用）
                        mapType: self.selectList[0].mapType, //映射类型
                        dataType: self.selectList[0].dataType, //数据类型
                        addType: addType //规则类型
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success("创建规则成功。");
                            //刷新错误列表
                            self.getDataMappedList();
                            //清空标准列表
                            self.standardList = [];
                            //清空错误信息
                            self.selectErrorList = [];

                            self.sendMessage="";
                            //清空id
                            self.commonId = "";
                            //重置标准id集合
                            self.baseIdList = ["", "", "", "", "", ""];
                            self.baseIdTwoList = ["", ""];
                            //重置药品多选框
                            self.RadioGroupGen=[];
                            self.RadioGroupTrade=[];
                            self.RadioGroupSpec=[];
                            self.RadioGroupPack=[];
                            self.RadioGroupForm=[];
                            self.RadioGroupCom=[];
                        } else {
                            // var errormessage=data.message=="0"?"停用":data.message=="1"?"待审核":data.message=="2"?"通过":"驳回"
                            self.$Modal.error({
                                title: "失败",
                                content: data.message
                            });
                        }
                    }
                });
            }
        },
        //质疑
        queryAdd(){
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.question",
                data: {
                    id: [self.queryMId],
                    cancelReason:self.queryReason,
                    nopassRemark:self.nopassRemark,
                    dataType: self.queryDataType,
                    hospId: self.hospId,
                    yearMonth: self.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该条信息已质疑。");
                        self.getDataMappedList(); //刷新列表
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
            let delIds=[this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.delete",
                data: {
                    mappingId: delIds
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("删除成功。");
                        //清除信息
                        self.getDataMappedList();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //保存选中的字段（药品使用）
        drugGen(arr){
            this.RadioGroupGen=arr;
        },
        drugTrade(arr){
            this.RadioGroupTrade=arr;
        },
        drugSpec(arr){
            this.RadioGroupSpec=arr;
        },
        drugPack(arr){
            this.RadioGroupPack=arr;
        },
        drugForm(arr){
            this.RadioGroupForm=arr;
        },
        drugCom(arr){
            this.RadioGroupCom=arr;
        },
        //创建规则（药品缺少映射字段时使用）
        drugMapped(){
            //判断药品映射是整条信息映射还是单字段映射
            if (this.drugRadio=="0") {
                this.drug=this.drugParams.drug;
            }else{
                this.drug="";
                var drugInforList=["","","","","",""];
                //通用名
                drugInforList[0]=this.assemblyDrug(this.RadioGroupGen);
                //商品名
                drugInforList[1]=this.assemblyDrug(this.RadioGroupTrade);
                //药品规格
                drugInforList[2]=this.assemblyDrug(this.RadioGroupSpec);
                //包装规格
                drugInforList[3]=this.assemblyDrug(this.RadioGroupPack);
                //剂型
                drugInforList[4]=this.assemblyDrug(this.RadioGroupForm);
                //厂家
                drugInforList[5]=this.assemblyDrug(this.RadioGroupCom);
                this.drugInforIdList=drugInforList.join("_");
            }

            //创建
            this.addRules(this.addMapType);
        },
        //组装标准id（药品使用）
        assemblyDrug(drugDroup){
            var backInfor="";
            //通用名
            if (drugDroup.indexOf("drugGenericName") > -1) {
                backInfor=this.drugParams.drugGenericCode+"#";
            }else{
                backInfor="#";
            }
            //商品名
            if (drugDroup.indexOf("drugTradeName") > -1) {
                backInfor+=this.drugParams.drugTradeCode+"#";
            }else{
                backInfor+="#";
            }
            //药品规格
            if (drugDroup.indexOf("spec") > -1) {
                backInfor+=this.drugParams.drugSpecCode+"#";
            }else{
                backInfor+="#";
            }
            //包装规格
            if (drugDroup.indexOf("packageSpec") > -1) {
                backInfor+=this.drugParams.packageSpecCode+"#";
            }else{
                backInfor+="#";
            }
            //剂型
            if (drugDroup.indexOf("formNameChinese") > -1) {
                backInfor+=this.drugParams.form+"#";
            }else{
                backInfor+="#";
            }
            //厂家
            if (drugDroup.indexOf("companyName") > -1) {
                backInfor+=this.drugParams.manufacturer;
            }
            return backInfor;
        },
        //切页(错误)
        changePage(currentPage) {
            this.pageConfig.pageNum = currentPage;
            this.getDataMappedList();
        },
        //显示条数（错误）
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDataMappedList();
        },
        //切页(标准)
        changePageMap(currentPage) {
            this.mapPageConfig.pageNum = currentPage;
            this.getStandardList(this.keyword);
        },
        //显示条数（标准）
        changeSizeMap(num) {
            this.mapPageConfig.pageSize = num;
            this.getStandardList(this.keyword);
        },
        //下一步
        nextOperation() {
            if (this.selectListMap.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择要映射的标准数据。</h5>"
                });
            } else if (this.selectListMap.length > 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>只能与一条标准数据创建映射。</h5>"
                });
            } else {
                this.isSubmitting = false;
                this.uniteId = this.selectListMap[0].standardId + ",";
                this.order = "1";
                if (this.selectList[0].mapType == "wound_healing") {
                    //切口愈合
                    this.setColumn("wound_healing");
                    this.getStandardList(this.selectList[0].healing);
                } else if (this.selectList[0].mapType == "usage_path_drug") {
                    //给药途径用法
                    this.setColumn("usage_path_drug");
                    this.getStandardList(this.selectList[0].pathDrug);
                }
            }
        },
        //点击行事件
        rowClick(params,index){
            if (this.dataMappedList[index]._disabled==false&&this.model2==false) {
                if (this.inforType=="drug") {
                    this.selectList=[];
                    this.selectList.push(params);
                    this.showMultiQuery=true;
                }else{
                    this.showMultiQuery=false;
                    if (this.dataMappedList[index]._checked) {
                        // var selectIndex=JSON.stringify(this.selectList).indexOf(JSON.stringify(params));
                        // if (selectIndex>-1) {
                        //     this.selectList.splice(selectIndex-1,1);
                        // }
                        for (let m = 0; m < this.selectList.length; m++) {
                            if (this.selectList[m].hospId==params.hospId&&this.selectList[m].value1==params.value1) {
                                this.selectList.splice(m,1);
                            }
                        }

                        this.dataMappedList[index]._checked=false;
                    }else{
                        this.dataMappedList[index]._checked=true;
                        params._checked=true;
                        this.selectList.push(params);
                    }
                }
                this.getSelectList(this.selectList);   
                this.index=index;
            }
        },
        //发通知
        sendMessageYes(){
            if (this.selectList.length>0) {
                let hospId=this.selectList[0].hospId;
                this.$router.push({
                    path: "/feedBack/add",
                    query: {
                        message:this.sendMessage,
                        hospId:hospId
                    }
                });
            }


            // let sendMessage="";
            // let hospId="";
            // this.$router.push({
            //     path: "/feedBack/add",
            //     query: {
            //         message:sendMessage,
            //         hospId:hospId
            //     }
            // });
        },
        //标准信息
        getSelectListMap(arr) {
            this.selectListMap = arr;
            console.log( "++++++++"+arr);
        },
        //保存批量选中的信息
        getSelectList(arr) {
            //批量选中的信息
            this.selectList = arr;
           console.log("-------"+arr);
            var value = "";
            this.selectErrorList=[];
            this.sendMessage="";
            if (this.selectList.length > 0) {
                if (this.selectList[0].mapType == "payment_method") {
                    //付费方式
                    value = this.selectList[0].paymentMethod;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.paymentMethod+","+element.mId
                        );
                        this.sendMessage+='付费方式：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "admission_of") {
                    //入院情况
                    value = this.selectList[0].admissionOf;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.admissionOf+","+element.mId
                        );
                        this.sendMessage+='入院情况：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "wound") {
                    //切口
                    value = this.selectList[0].wound;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.wound+","+element.mId
                        );
                        this.sendMessage+='切口：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "wound_healing") {
                    //切口愈合
                    value = this.selectList[0].wound;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.wound +
                                element.healing+","+element.mId
                        );
                    });
                } else if (this.selectList[0].mapType == "drug_formulation") {
                    //剂型
                    value = this.selectList[0].drugFormulation;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.drugFormulation+","+element.mId
                        );
                        this.sendMessage+='剂型：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "dosage") {
                    //剂量
                    value = this.selectList[0].dosage;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.dosage+","+element.mId
                        );
                        this.sendMessage+='剂量：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "packing_quantity") {
                    //包装（规格）
                    value = this.selectList[0].packingQuantity;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.packingQuantity+","+element.mId
                        );
                        this.sendMessage+='包装规格：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "doctor_advice_type") {
                    //医嘱
                    value = this.selectList[0].doctorAdviceType;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.doctorAdviceType+","+element.mId
                        );
                        this.sendMessage+='医嘱：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "drug_manufacturers") {
                    //生产企业
                    value = this.selectList[0].drugManufacturers;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.drugManufacturers+","+element.mId
                        );
                        this.sendMessage+='生产企业：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "drug_trade_name") {
                    //商品名
                    value = this.selectList[0].drugTradeName;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.drugTradeName+","+element.mId
                        );
                        this.sendMessage+='商品名：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "treatment_card") {
                    //就诊号
                    value = this.selectList[0].treatmentCard;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.treatmentCard+","+element.mId
                        );
                        this.sendMessage+='就诊号：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "doctor_id") {
                    //工号（医生）
                    value = this.selectList[0].doctorId;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.doctorId+","+element.mId
                        );
                        this.sendMessage+='工号：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "age") {
                    //年龄
                    value = this.selectList[0].age;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.age+","+element.mId
                        );
                        this.sendMessage+='年龄：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "sex") {
                    //性别
                    value = this.selectList[0].sex;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.sex+","+element.mId
                        );
                        this.sendMessage+='性别：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "healing") {
                    //愈合
                    value = this.selectList[0].healing;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.healing+","+element.mId
                        );
                        this.sendMessage+='愈合：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "operation") {
                    //手术
                    value = this.selectList[0].operation;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.operation+","+element.mId
                        );
                        this.sendMessage+='手术：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "drug_wholesale") {
                    //批发企业
                    value = this.selectList[0].drugWholesale;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.drugWholesale+","+element.mId
                        );
                        this.sendMessage+='批发企业：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (
                    this.selectList[0].mapType == "treatment_result_infect"
                ) {
                    //治疗结果
                    value = this.selectList[0].treatmentResultInfect;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.treatmentResultInfect+","+element.mId
                        );
                        this.sendMessage+='治疗结果：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "usage") {
                    //用法
                    value = this.selectList[0].usage;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.usage+","+element.mId
                        );
                        this.sendMessage+='用法：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "usage_path_drug") {
                    //给药途径用法
                    value = this.selectList[0].usage;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.usage +
                                element.pathDrug+","+element.mId
                        );
                    });
                } else if (this.selectList[0].mapType == "medical_record") {
                    //病案号
                    value = this.selectList[0].medicareCard;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.medicareCard+","+element.mId
                        );
                        this.sendMessage+='病案号：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "section") {
                    //科室
                    value = this.selectList[0].section;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.section+","+element.mId
                        );
                        this.sendMessage+='科室：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "path_drug") {
                    //给药途径
                    value = this.selectList[0].pathDrug;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.pathDrug+","+element.mId
                        );
                        this.sendMessage+='给药途径：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "doctor_title") {
                    //职称
                    value = this.selectList[0].doctorTitle;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.doctorTitle+","+element.mId
                        );
                        this.sendMessage+='职称：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "drug_spec") {
                    //药品规格
                    value = this.selectList[0].drugSpec;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.drugSpec+","+element.mId
                        );
                        this.sendMessage+='药品规格：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "diagnostic") {
                    //诊断
                    value = this.selectList[0].diseaseTypeNameNoMap;
                    this.standardSearchInputContent.noMapContent = value;
                    this.keyWordCode=this.standardSearchInputContent.standardCode = this.selectList[0].diseaseTypeMatchedCode;
                    this.keyWordName=this.selectList[0].hospDiseaseTypeName;
                    this.keyWordStandardName = this.standardSearchInputContent.standardName = this.selectList[0].diseaseTypeMatchedName;
                    this.standardSearchInputContent.hospUploadContent = this.selectList[0].hospDiseaseTypeName;
                    
                    // this.mapForm.keyword = value;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.hospDiseaseTypeName +
                                "," +
                                element.mId
                        );
                        this.sendMessage+='诊断：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "drug_generic_name") {
                    //通用名
                    value = this.selectList[0].drugGenericName;
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "," +
                                element.hospId +
                                "," +
                                element.hospDiseaseTypeName+","+element.mId
                        );
                        this.sendMessage+='通用名：“'+element.usage+'”不存在，请添加。'+"\r\n";
                    });
                } else if (this.selectList[0].mapType == "drug") {
                    //药品
                    // value = this.selectList[0].drugGenericName+" "+
                    //         this.selectList[0].drugTradeName+" "+
                    //         this.selectList[0].spec+" "+
                    //         this.selectList[0].formNameChinese+" "+
                    //         this.selectList[0].companyName+" "+
                    //         this.selectList[0].packageSpec;
                    if (this.selectList[0].drugGenericName != null) {
                        value += this.selectList[0].drugGenericName;
                    }
                    if (this.selectList[0].drugTradeName != null) {
                        value += this.selectList[0].drugTradeName;
                    }
                    if (this.selectList[0].spec != null) {
                        value += this.selectList[0].spec;
                    }
                    if (this.selectList[0].formNameChinese != null) {
                        value += this.selectList[0].formNameChinese;
                    }
                    if (this.selectList[0].companyName != null) {
                        value += this.selectList[0].companyName;
                    }
                    if (this.selectList[0].packageSpec != null) {
                        value += this.selectList[0].packageSpec;
                    }
                    this.selectList.forEach(element => {
                        this.selectErrorList.push(
                            element.yearMonth +
                                "&&&" +
                                element.hospId +
                                "&&&" +
                                element.drugGenericName +
                                "##" +
                                element.drugTradeName +
                                "##" +
                                element.spec +
                                "##" +
                                element.packageSpec +
                                "##" +
                                element.formNameChinese +
                                "##" +
                                element.companyName+"&&&"+element.mId
                        );
                        this.sendMessage+='通用名：“'+element.drugGenericName+'”，商品名：“'
                                +element.drugTradeName+'”，药品规格：“'+element.spec+'”，包装规格：“'
                                +element.packageSpec+'”，剂型：“'+element.formNameChinese+'”，厂家：“'
                                +element.companyName+'”所对应的标准药品不存在，请添加。'+"\r\n";
                    });
                }

                // this.getStandardList(value);
                if (this.mapForm.keyword==null||this.mapForm.keyword.trim()=="") {
                    this.getStandardList(value);
                }else{
                    this.getStandardList(this.mapForm.keyword);
                }
            } else {
                this.standardList = [];
                this.standardCol = [];
            }
        },
        //设置显示列
        setColumn(mapType) {
            //清空错误列表数据和列名
            this.showCol = [];
            this.mapCol = [];
            //清空标准数据和列名
            this.standardList = [];
            this.standardCol = [];

            // this.showCol.push.apply(this.showCol, this.baseCol);
            if (mapType == "drug") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //药品
                var clo = [
                    {
                        title: "通用名",
                        //align: "center",
                        // width: 120,
                        key: "drugGenericName",
                        sortable: true,
                        // filters:[
                        //     {label:'对乙酰氨基酚',value:1},
                        //     {label:'haha2',value:2}
                        // ],
                        // filters:this.filterDrugGenericName,
                        // filterMultiple:true,
                        // filterMethod(value,row){
                        //     if(row.drugGenericName){
                        //         return value.indexOf(row.drugGenericName) != -1;
                        //     }else{
                        //         return false;
                        //     }
                        // }
                    },
                    {
                        title: "产品名",
                        //align: "center",
                        // width: 120,
                        key: "drugProductName",
                        sortable: true
                    },                    
                    {
                        title: "商品名",
                        //align: "center",
                        // width: 100,
                        key: "drugTradeName",
                        sortable: true
                    },
                    {
                        title: "药品规格",
                        //align: "center",
                        // width: 120,
                        key: "spec",
                        sortable: true
                    },
                    {
                        title: "剂型",
                        //align: "center",
                        // width: 80,
                        key: "formNameChinese",
                        sortable: true
                    },
                    {
                        title: "包装规格",
                        //align: "center",
                        // width: 105,
                        key: "packageSpec",
                        sortable: true
                    },
                    {
                        title: "生产企业",
                        //align: "center",
                        // width: 140,
                        key: "companyName",
                        sortable: true
                    },                   
                    {
                        title: "单价",
                        //align: "center",
                        // width: 80,
                        key: "unitPrice",
                        sortable: true
                    }
                ];
                // 区别于col1，这个给上面上报的用
                var clo2 = [
                    {
                        title: "通用名",
                        //align: "center",
                        // width: 120,
                        key: "drugGenericName",
                        sortable: true,
                    },                
                    {
                        title: "商品名",
                        //align: "center",
                        // width: 100,
                        key: "drugTradeName",
                        sortable: true
                    },
                    {
                        title: "药品规格",
                        //align: "center",
                        // width: 120,
                        key: "spec",
                        sortable: true
                    },
                    {
                        title: "剂型",
                        //align: "center",
                        // width: 80,
                        key: "formNameChinese",
                        sortable: true
                    },
                    {
                        title: "包装规格",
                        //align: "center",
                        // width: 105,
                        key: "packageSpec",
                        sortable: true
                    },
                    {
                        title: "生产企业",
                        //align: "center",
                        // width: 140,
                        key: "companyName",
                        sortable: true
                    },                   
                    {
                        title: "单价",
                        //align: "center",
                        // width: 80,
                        key: "unitPrice",
                        sortable: true
                    }
                ];
                var mapC=[
                    {
                        title: "企业曾用名",
                        width: 120,
                        key: "companyNameOld"
                    },
                    {
                        title: "企业集团",
                        width: 100,
                        key: "blocName"
                    }
                ];
                this.showCol.push.apply(this.showCol, clo2);
                // this.showCol.splice(0,1,this.mapSelect);
                this.showCol.push(this.DrugOperation);
                this.mapCol.push.apply(this.mapCol, clo);
                this.mapCol.splice(3,0,{
                        title: "统一规格",
                        width: 85,
                        key: "specOffice"
                    })
                this.mapCol.splice(4,0,{
                        title: "分包装企业",
                        width: 85,
                        key: "poinpackcompanyName"
                })
                this.mapCol.push.apply(this.mapCol,mapC)
            } else if (mapType == "payment_method") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //付费方式
                var clo = {
                    title: "付费方式",
                    //align: "center",
                    key: "paymentMethod"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "admission_of") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //入院情况
                var clo = {
                    title: "入院情况",
                    //align: "center",
                    key: "admissionOf"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "wound") {
                //隐藏
                this.isTabsDrug = false;
                this.isNoTabs = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isTabsWound = true;
                //默认选中tabs
                this.tabsNameWound = "wound";

                //切口
                var clo = {
                    title: "切口",
                    //align: "center",
                    key: "wound"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "wound_healing") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //切口愈合
                var clo = [
                    {
                        title: "切口",
                        //align: "center",
                        // width: 85,
                        key: "wound"
                    },
                    {
                        title: "愈合",
                        //align: "center",
                        // width: 85,
                        key: "healing"
                    }
                ];
                this.showCol.push.apply(this.showCol, clo);
                if (this.order == "1") {
                    this.mapCol.push(clo[1]);
                    this.isSubmitting = false;
                } else {
                    this.mapCol.push(clo[0]);
                    this.isSubmitting = true;
                }
            } else if (mapType == "drug_formulation") {
                //显示tabs标签页
                this.isTabsDrug = true;
                //默认选中tabs
                this.tabsNameDrug = "drug_formulation";
                //隐藏
                this.isNoTabs = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;

                //剂型
                var clo = {
                    title: "剂型",
                    //align: "center",
                    key: "drugFormulation"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "dosage") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                //显示
                this.isNoTabs = true;

                //剂量
                var clo = {
                    title: "剂量",
                    //align: "center",
                    key: "dosage"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "packing_quantity") {
                //显示tabs标签页
                this.isTabsDrug = true;
                //默认选中tabs
                this.tabsNameDrug = "packing_quantity";
                //隐藏
                this.isNoTabs = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //包装（规格）
                var clo = {
                    title: "包装规格",
                    //align: "center",
                    key: "packingQuantity"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "doctor_advice_type") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                //显示
                this.isNoTabs = true;

                //医嘱
                var clo = {
                    title: "医嘱",
                    //align: "center",
                    key: "doctorAdviceType"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "drug_manufacturers") {
                //显示tabs标签页
                this.isTabsDrug = true;
                //默认选中tabs
                this.tabsNameDrug = "drug_manufacturers";
                //隐藏
                this.isNoTabs = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //生产企业
                var clo = {
                    title: "生产企业",
                    //align: "center",
                    key: "drugManufacturers"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "drug_trade_name") {
                //显示tabs标签页
                this.isTabsDrug = true;
                //默认选中tabs
                this.tabsNameDrug = "drug_trade_name";
                //隐藏
                this.isNoTabs = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //商品名
                var clo = {
                    title: "商品名",
                    //align: "center",
                    key: "drugTradeName"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "treatment_card") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //就诊号
                var clo = {
                    title: "就诊号",
                    //align: "center",
                    key: "treatmentCard"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "doctor_id") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //工号（医生）
                var clo = {
                    title: "工号（医生）",
                    //align: "center",
                    key: "doctorId"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "age") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //年龄
                var clo = {
                    title: "年龄",
                    //align: "center",
                    key: "age"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "sex") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //性别
                var clo = {
                    title: "性别",
                    //align: "center",
                    key: "sex"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "healing") {
                //隐藏
                this.isTabsDrug = false;
                this.isNoTabs = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isTabsWound = true;
                //默认选中tabs
                this.tabsNameWound = "healing";

                //愈合
                var clo = {
                    title: "愈合",
                    //align: "center",
                    key: "healing"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "operation") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //手术
                var clo = {
                    title: "手术",
                    //align: "center",
                    key: "operation"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "drug_wholesale") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //批发企业
                var clo = {
                    title: "批发企业",
                    //align: "center",
                    key: "drugWholesale"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "treatment_result_infect") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //治疗结果
                var clo = {
                    title: "治疗结果",
                    //align: "center",
                    key: "treatmentResultInfect"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "usage") {
                //隐藏
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isNoTabs = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isTabsUsage = true;
                //默认选中tabs
                this.tabsNameUsage = "usage";

                //用法
                var clo = {
                    title: "用法",
                    //align: "center",
                    key: "usage"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "usage_path_drug") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //给药途径用法
                var clo = [
                    {
                        title: "用法",
                        //align: "center",
                        // width: 85,
                        key: "usage"
                    },
                    {
                        title: "给药途径",
                        //align: "center",
                        // width: 85,
                        key: "pathDrug"
                    }
                ];
                this.showCol.push.apply(this.showCol, clo);
                if (this.order == "1") {
                    this.mapCol.push(clo[1]);
                    this.isSubmitting = false;
                } else {
                    this.mapCol.push(clo[0]);
                    this.isSubmitting = true;
                }
            } else if (mapType == "medical_record") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //病案号
                var clo = {
                    title: "病案号",
                    //align: "center",
                    key: "medicareCard"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "section") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //科室
                var clo = {
                    title: "科室",
                    //align: "center",
                    key: "section"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "path_drug") {
                //隐藏
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isNoTabs = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isTabsUsage = true;
                //默认选中tabs
                this.tabsNameUsage = "path_drug";

                //给药途径
                var clo = {
                    title: "给药途径",
                    //align: "center",
                    key: "pathDrug"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "doctor_title") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;
                //显示
                this.isNoTabs = true;

                //职称
                var clo = {
                    title: "职称",
                    //align: "center",
                    key: "doctorTitle"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "drug_spec") {
                //显示tabs标签页
                this.isTabsDrug = true;
                //默认选中tabs
                this.tabsNameDrug = "drug_spec";
                //隐藏
                this.isNoTabs = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isTabsDiseaseType = false;

                //药品规格
                var clo = {
                    title: "药品规格",
                    //align: "center",
                    key: "drugSpec"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            } else if (mapType == "diagnostic") {
                //隐藏tabs标签页
                this.isTabsDrug = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;
                this.isNoTabs = false;
                //显示
                
                this.isTabsDiseaseType = true;
                

                //诊断
                var clo = [{
                    title: "医院诊断编码",
                    //align: "center",
                    // width: 85,
                    key: "hospDiseaseType"
                },{
                    title: "医院诊断名称",
                    //align: "center",
                    key: "hospDiseaseTypeName"
                },{
                    title: "未匹配诊断",
                    //align: "center",
                    key: "diseaseTypeNameNoMap"
                },{
                    title: "已匹配标准编码",
                    //align: "center",
                    key: "diseaseTypeMatchedCode"
                },{
                    title: "已匹配标准名称",
                    //align: "center",
                    key: "diseaseTypeMatchedName"
                }];
                //标准诊断
                var clo1 = [{
                    title: "诊断编码",
                    //align: "center",
                    // width: 85,
                    key: "diseaseType"
                },{
                    title: "诊断名称",
                    //align: "center",
                    key: "diseaseTypeName"
                }];
                this.showCol.push.apply(this.showCol, clo);
                this.mapCol.push.apply(this.mapCol, clo1);
                // this.mapCol.push(this.DiseaseOperationAppend);
                // this.standardCol.push(this.DiseaseOperationAppend);
            } else if (mapType == "drug_generic_name") {
                //显示tabs标签页
                this.isTabsDrug = true;
                //默认选中tabs
                this.tabsNameDrug = "drug_generic_name";
                //隐藏
                this.isNoTabs = false;
                this.isTabsWound = false;
                this.isTabsUsage = false;

                //通用名
                var clo = {
                    title: "通用名",
                    //align: "center",
                    key: "drugGenericName"
                };
                this.showCol.push(clo);
                this.mapCol.push(clo);
            }
            if (mapType=="drug") {
                this.showCol.push.apply(this.showCol, this.mapSelect);
            }else{
                this.showCol.push.apply(this.showCol, this.baseCol);
                this.showCol.push(this.deleteOPeration);
            }
        },
        // renderDrugSearchParams(value) {
        //     var self = this;
        //     if(value == 'drug'){
        //         self.showDrugSearchParams = true;
        //     }else{
        //         self.showDrugSearchParams = false;
        //     }
        // },
        addColumnFilter() {
            let self = this
            this.showOTable = false
            this.$nextTick(function(){ self.showOTable = true; })
            let arg = this.standardList || [];
            let cols = this.standardCol.map(item => {
                if (item.key == 'action') { return item; }
                let vals = [];
                item.filters = arg.reduce((rs, o) => {
                    let newItem = null;
                    if (item.render){
                        newItem = item.render(o);
                    } else if(o[item.key]) {
                        newItem = {label: o[item.key], value: o[item.key]};
                    };
                    if (newItem && vals.indexOf(newItem.value) == -1) {
                        rs.push(newItem);
                        vals.push(newItem.value);
                    }
                    return rs;
                }, []).distinct();
                item.filterValues = [...item.filters];
                let fn = function(value, row) { return row[this.key].indexOf(value) > -1; }
                item.filterMethod = fn.bind({key: item.key})
                return { ...item };
            });
            console.log(JSON.stringify(cols, null, 4))
            this.standardCol = cols;
        }
    }
};
</script>
<style scoped>
    .ivu-table .demo-table-info-cell-age {
        background-color: #d0e6ff;
    }
    .selected-row{
        background-color: #133965;
        color: #ffffff;
    }
</style>
