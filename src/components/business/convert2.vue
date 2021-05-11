<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">单位换算</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="省市" :label-width="40">
                    <Cascader :data="addressList" @on-change='getHosp' trigger="hover" v-model="searchForm.address" change-on-select></Cascader>
                </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospital" style="width: 120px;" filterable clearable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" :label-width="60">
                    <Select v-model="searchForm.dataType" style="width: 80px;">
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据年月" :label-width="60">
                    <DatePicker type="month" v-model="searchForm.yearMonth" @on-change="searchForm.yearMonth=$event" :editable="false" style="width: 120px;"></DatePicker>
                </FormItem>
                <FormItem label="时间" :label-width="40">
                    <DatePicker type="date" v-model="searchForm.beginDate" @on-change="searchForm.beginDate=$event" style="width: 120px;"></DatePicker> —
                    <DatePicker type="date" v-model="searchForm.endDate" @on-change="searchForm.endDate=$event" style="width: 120px;"></DatePicker>
                </FormItem>

                <FormItem  label="标准通用名" :label-width="100">
                    <Input v-model="searchForm.name" type="text" placeholder="请输入标准通用名" style="width: 120px;" clearable/>
                </FormItem>

                <FormItem   label="标准库厂家" :label-width="100">
                    <Input v-model="searchForm.company" type="text" placeholder="请输入标准库厂家" style="width: 120px;" clearable/>
                </FormItem>

                <FormItem   label="包装单位" :label-width="60">
                    <Input v-model="searchForm.packingUnit" type="text" placeholder="请输入包装单位" style="width: 120px;" clearable/>
                </FormItem>

                <FormItem label="金额一致" :label-width="100">
                    <Select v-model="searchForm.isEqualAmount" style="width: 80px;" filterable clearable>
                        <Option v-for="item in isEqualAmountStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否多个单价" :label-width="100">
                    <Select v-model="searchForm.isMorePrice" style="width: 80px;" filterable clearable>
                        <Option v-for="item in isMorePriceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否正确数据" :label-width="100">
                    <Select v-model="searchForm.isRightData" style="width: 80px;" filterable clearable>
                        <Option v-for="item in isRightDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
            </Form>
        </div>
        <div class="bg-white mt15" style="height:90%;">
            <CustomTable v-authorize="'BusinessConvertList'" v-if="currentType==20" optionType="business" :columnConfig='menjizhenCol' :columnDatas='convertList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index" @click="triggerWhenClickRow(index,$event)" :class="selectList.indexOf(showDatas[index].recordId)>-1 ? 'selected-row':''">
                    <td v-for="(colData,colIndex) in menjizhenCol" :key="colIndex" class="ellipsis" :class="item['rules'] != null && item['rules'].indexOf('['+menjizhenCol[colIndex].title+']')>-1?'error-data':''">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessConvertList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="ios-ionic-outline" size="small" title="计算单价" type="primary" @click="jisuan(index,0)"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="md-calculator" size="small" title="计算数量" type="primary" @click="jisuan(index,1)"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="md-bulb" size="small" title="计算金额" type="primary" @click="calcAmount(index)"></Button>
                            <Button v-authorize="'BusinessConvertYes'" icon="ios-redo" size="small" title="确认" type="success" @click="IsYes(index)"></Button>
                            <Button v-authorize="'BusinessConvertSave'" icon="md-card" size="small" title="保存" type="success" @click="saveEdit(index)"></Button>
                            <Button v-authorize="'BusinessConvertAdd'" icon="md-add" size="small" title="创建规则" type="primary" @click='addRule(index)'></Button>
                            <Button v-authorize="'BusinessConvertOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">门急诊</span>
                        <input v-else-if="colData.isInput" :value="item[colData.name]" @change="inInput($event,index,item,colData.name)" />
                        <span v-else-if="colData.name=='baozhuangSpec'">{{item['rules'].split("##")[1]}}</span>
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                    </td>
                </tr>
            </CustomTable>


            <CustomTable v-authorize="'BusinessConvertList'" v-else-if="currentType==40" optionType="business" :columnConfig='yizhuCol' :columnDatas='convertList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index" @click="triggerWhenClickRow(index,$event)" :class="selectList.indexOf(showDatas[index].recordId)>-1 ? 'selected-row':''">
                    <td v-for="(colData,colIndex) in yizhuCol" :key="colIndex" class="ellipsis" :class="item['rules'] != null && item['rules'].indexOf('['+yizhuCol[colIndex].title+']')>-1?'error-data':''">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessConvertList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="ios-ionic-outline" size="small" title="计算单价" type="primary" @click="jisuan(index,0)"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="md-calculator" size="small" title="计算数量" type="primary" @click="jisuan(index,1)"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="md-bulb" size="small" title="计算金额" type="primary" @click="calcAmount(index)"></Button>
                            <Button v-authorize="'BusinessConvertYes'" icon="ios-redo" size="small" title="确认" type="success" @click="IsYes(index)"></Button>
                            <Button v-authorize="'BusinessConvertSave'" icon="md-card" size="small" title="保存" type="success" @click="saveEdit(index)"></Button>
                            <Button v-authorize="'BusinessConvertAdd'" icon="md-add" size="small" title="创建规则" type="primary" @click='addRule(index)'></Button>
                            <Button v-authorize="'BusinessConvertOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">医嘱</span>
                        <input v-else-if="colData.isInput" :value="item[colData.name]" @change="inInput($event,index,item,colData.name)" />
                        <span v-else-if="colData.name=='baozhuangSpec'">{{item['rules'].split("##")[1]}}</span>
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                    </td>
                </tr>
            </CustomTable>

            <CustomTable v-authorize="'BusinessConvertList'" optionType="business" v-else :columnConfig='gouyaoCol' :columnDatas='convertList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index" @click="triggerWhenClickRow(index,$event)" :class="selectList.indexOf(showDatas[index].recordId)>-1 ? 'selected-row':''">
                    <td v-for="(colData,colIndex) in gouyaoCol" :key="colIndex" class="ellipsis" :class=" item['rules'] !=null && item['rules'].indexOf('['+gouyaoCol[colIndex].title+']')>-1?'error-data':''">
                        <!-- {{colData.name}}{{gouyaoCol.length}} -->
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessConvertList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="ios-ionic-outline" size="small" title="计算单价" type="primary" @click="jisuan(index,0)"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="md-calculator" size="small" title="计算数量" type="primary" @click="jisuan(index,1)"></Button>
                            <Button v-authorize="'BusinessConvertCount'" icon="md-bulb" size="small" title="计算金额" type="primary" @click="calcAmount(index)"></Button>
                            
                            <Button v-authorize="'BusinessConvertYes'" icon="ios-redo" size="small" title="确认" type="success" @click="IsYes(index)"></Button>
                            <Button v-authorize="'BusinessConvertSave'" icon="md-card" size="small" title="保存" type="success" @click="saveEdit(index)"></Button>
                            <Button v-authorize="'BusinessConvertAdd'" icon="md-add" size="small" title="创建规则" type="warning" @click='addRule(index)'></Button>
                            <Button v-authorize="'BusinessConvertOper'" icon="md-refresh" size="small" title="重新清洗" type="error" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index,$event)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">购药</span>
                        <input v-else-if="colData.isInput" :value="item[colData.name]" @change="inInput($event,index,item,colData.name)" />
                        <span v-else-if="colData.name=='baozhuangSpec'">{{item['rules'].split("##")[1]}}</span>
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                    </td>
                </tr>
            </CustomTable>

            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="convertList!=null && convertList.length>0 && searchForm.isRightData == 0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" style="margin-left:500px"/>
                    <Checkbox v-authorize="'BusinessConvertList'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button v-authorize="'BusinessConvertOper'" type="error" @click="batchOperation()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
                    <Button v-authorize="'BusinessConvertSave'" type="success" @click="batchSave()" :disabled="selectList.length==0" class="inputCheck" style="left: 330px;margin-top: -10px;">保存</Button>
                    <Button v-authorize="'BusinessConvertCount'" type="primary" @click="batchJisuan(0)" :disabled="selectList.length==0" class="inputCheck" style="left: 390px;margin-top: -10px;">计算单价</Button>
                    <Button v-authorize="'BusinessConvertCount'" type="primary" @click="batchJisuan(1)" :disabled="selectList.length==0" class="inputCheck" style="left: 475px;margin-top: -10px;">计算数量</Button>
                    
                    <Button v-authorize="'BusinessConvertCount'" type="primary" @click="batchCalcAmount()" :disabled="selectList.length==0" class="inputCheck" style="left: 560px;margin-top: -10px;">计算金额</Button>
                    <Button v-authorize="'BusinessConvertCount'" type="primary" @click="customCalculation()" :disabled="selectList.length==0" class="inputCheck" style="left: 645px;margin-top: -10px;">自定义计算</Button>
                    <Button v-authorize="'BusinessConvertCount'" type="primary" @click="batchChangeDrugs()" :disabled="selectList.length==0" class="inputCheck" style="left: 740px;margin-top: -10px;">修改药品</Button>
                    <!-- <Button v-authorize="'BusinessConvertCount'" type="primary" @click="batchJisuanAll()" :disabled="selectList.length==0" class="inputCheck" style="left: 825px;margin-top: -10px;">混合计算</Button> -->
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>

            </div>

        </div>

        <Modal v-model="model1" title="重新清洗" width=420 @on-ok="cleanYes1">
            请选择重洗清洗开始的位置：</br>
            <RadioGroup v-model="disabledGroup" style="margin-top:5px;">
                <Radio label="reject">数据剔除</Radio>
                <Radio label="check">数据校验</Radio>
                <Radio label="mapping">数据映射</Radio>
                <Radio label="query">数据质疑</Radio>
                </br>
                <Radio label="mutex">数据互斥</Radio>
                <Radio label="units">单位换算</Radio>
            </RadioGroup>
        </Modal>
        <Modal v-model="model5" :title="titleName" width=420 @on-ok="jisuan1">
            请选择计算类型：</br>
            <RadioGroup v-model="jisaunGroup" style="margin-top:5px;">
                <Radio label="0">转单制剂{{textOne}}</Radio></br>
                <Radio label="1">转整包装{{textTwo}}</Radio>
            </RadioGroup>
        </Modal>
        <Modal v-model="model6" :title="titleName" width=420 @on-ok="batchJisuan1">
            请选择计算类型：</br>
            <RadioGroup v-model="jisaunGroup" style="margin-top:5px;">
                <Radio label="0">转单制剂{{textOne}}</Radio></br>
                <Radio label="1">转整包装{{textTwo}}</Radio>
            </RadioGroup>
        </Modal>
        <Modal v-model="model7" :title="titleName" width=420 @on-ok="batchJisuanAll1">
            请选择计算类型：</br>
            <RadioGroup v-model="jisaunGroup" style="margin-top:5px;">
                <Radio label="0">转单制剂{{textOne}}</Radio></br>
                <Radio label="1">转整包装{{textTwo}}</Radio>
            </RadioGroup>
        </Modal>

        <!-- 自定义运算弹框 -->
        <Modal v-model="modelCustom" :title="customCalcTitle" class-name="vertical-center-modal"  @on-ok="fireCustomCalc" :mask-closable="false">
                <Form :model="customCalcModelForm" ref="customCalcModelFormAdd" :rules="customCalcFormRuleValidate" :label-width="100">
                    <FormItem label="计算字段" prop="optColumn">
                        <RadioGroup v-model="customCalcModelForm.optColumn">
                            <Radio label="1"> 价格 &nbsp;&nbsp;</Radio>
                            <Radio label="2"> 数量 &nbsp;&nbsp;</Radio>
                            <Radio label="3"> 金额 &nbsp;&nbsp;</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="运算符" prop="operator">
                        <RadioGroup v-model="customCalcModelForm.operator">
                            <Radio label="1"> X （乘法）</Radio>
                            <Radio label="2"> / （除法）</Radio>
                            <Radio label="3"> + （加法）</Radio>
                            <Radio label="4"> - （减法）</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="数值" prop="optValue">
                        <Input v-model.trim="customCalcModelForm.optValue" :maxlength="15" />
                    </FormItem>
                    <FormItem label="是否反向勾选" prop="optValue">
                        <input type="checkbox" id="vue" value="Vue.js" v-model="customCalcModelForm.reverseCalculation">是
                    </FormItem>
                </Form>
        </Modal>
    
        <!-- 修改药品 -->
        <Modal v-model="modelChangeDrug" :title="changeDrugModelTitle" class-name="vertical-center-modal"  @on-ok="closeChangeDrugModal" :mask-closable="false" width="1600" >
            <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;" >
                <div class="search-con">
                    <Form :model="drugSearchForm" ref="formInline" inline>
                        <!-- <FormItem label="状态" :label-width="40">
                            <Select v-model="drugSearchForm.statusId" filterable clearable style="width: 100px;">
                                <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem> -->
                        <FormItem label="药品编码" :label-width="80">
                            <Input v-model="drugSearchForm.drugCode" clearable type="text" placeholder="请输入药品编码" style="width: 140px;" />
                        </FormItem>
                        <FormItem label="通用名" :label-width="70">
                            <Input v-model="drugSearchForm.drugGenericName" clearable type="text" placeholder="请输入通用名" style="width: 180px;" />
                        </FormItem>
                        <FormItem label="厂商" :label-width="60">
                            <Input v-model="drugSearchForm.companyName" clearable type="text" placeholder="请输入厂商" style="width: 220px;" />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="changeDrugPage(1)">检索</Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="bg-white mt15" style="height:60%;">      
                    <CustomTable :columnConfig='drugsCol' :columnDatas='drugsList' :showModal="showModal" @onOutput="showDrugData" @onOk="showModal=false" @onCancel="showModal=false">
                        <tr v-for="(item,index) in drugShowDatas" :key="index">
                            <td class="ellipsis" v-for="(col) in drugsCol.filter(m=>m.name!='op')" :key='col.name' >
                                {{drugsCol.find(m=>m.name==col.name).render?drugsCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                            
                            <Button v-authorize="'MappedDrugsAudit'" v-show="item.statusId == 4 " class='btn-red' icon="md-lock" title="绑定" type="success" @click='saveChangeDrug(item)'></Button>
                            </td>
                        </tr>
                        <!-- <EmptyRow style="position:absolute;left:20px;" v-if="!drugShowDatas || drugShowDatas.length==0"/> -->
                    </CustomTable>
                </div>
                <div class="bg-white mt15" style="height:35%;">      
                    <Table :columns="selectedRecordsColumn" :data="selectedRecordsData"></Table>
                </div>
            </div>
        </Modal>

        <Modal v-model="model3" title="确认" width=420 @on-ok="affirmYes">
            您确定要将该信息确认为错误信息吗？
        </Modal>
        <Modal v-model="model2" title="设置显示列" width=600 @on-ok="columnYes">
            <div style="padding-bottom:6px;margin-bottom:6px;">
                <b>勾选显示的列选项：</b>
                <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <div style="height:255px;overflow-y:auto;">
                <!-- 动态生成多选框 -->
                <CheckboxGroup v-model="checkAllGroup" v-for="item in checkBoxList" :key="item.key" @on-change="checkAllGroupChange" style="width:175px;display:inline-block">
                    <Checkbox :label="item.key">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </div>
        </Modal>
        <Modal v-model="model4" title="创建规则" width=550 :loading="loading" @on-ok="rulesYes">
            <Form :model="convertFormAdd" ref="convertAdd" :rules="ruleValidate" :label-width="80">
                <FormItem label="名称" prop="unitConvertName">
                    <Input v-model="convertFormAdd.unitConvertName" class="cellLength" />
                </FormItem>
                <!-- <FormItem label="换算规则" prop="specConvert">
                    <Select v-model="convertFormAdd.specConvert" class="cellLength">
                        <Option v-for="item in convertTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="归属">
                    <!-- <Select v-model="convertFormAdd.drug" class="cellLength" filterable>
                        <Option v-for="item in drugList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select> -->
                    <RadioGroup v-model="convertFormAdd.specConvert">
                        <Radio label="0">该医院</Radio>
                        <Radio label="1">该药品</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="convertFormAdd.remark" type="textarea" :rows="3" :maxlength="2000" class="cellLength" />
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
import commonJson from "@/assets/data/business/common.json";
//数据列，缺失的数据列可以从cloumnUnit.json里面找
import columns from "@/assets/data/business/cloumnUnit2.json";
import "../../assets/css/business/dataerror.css"; //错误列样式
//公用json串，不需要访问后台
import reviewStateJson from "@/assets/data/dicBase/reviewState.json";
import { girdDataSort } from '@/utils/strUtil.js'

export default {
    name: "convert",
    components: { EmptyRow, CustomTable, CheckboxGroup, Checkbox },
    data() {
        return {
            resourceList: [],
            showModal: false,
            showDatas: [],
            capShowDatas:[],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            },
            customCalcModelForm:{
                operator : 1,
                optColumn : 1,
                optValue: 1,
                reverseCalculation: false
            },
            param: [],
            commonCol: [], //公共字段
            gouyaoCol: [], //购药数据列
            menjizhenCol: [], //门急诊数据列
            binganCol: [], //病案数据列
            yizhuCol: [], //医嘱数据列
            tableH: 0,
            dataTypeList: [].concat(commonJson.dataTypeList), //数据类型
            isUpdateTypeList: commonJson.isUpdateTypeList, //修改状态
            hospitalList: [], //医院
            isMorePriceList: [{label:"是",value:1},{label:"否",value:0}],
            isRightDataList: [{label:"是",value:1},{label:"否",value:0}],
            isEqualAmountStatusList: [{label:"一致",value:1},{label:"不一致",value:0}],
            addressList: [], //省市
            convertList: [], //列表
            selectList: [], //选中的信息
            model1: false, //提示框显示状态(重新清洗)
            model2: false, //提示框显示状态(设置列)
            model3: false, //提示框显示状态(确认)
            model4: false, //提示框显示状态(创建规则)
            model5:false,
            model6:false,
            model7:false,
            modelCustom:false,
            textOne:"",
            textTwo:"",
            loading: true,
            titleName:"",
            customCalcTitle:"自定义计算",
            commonId: "", //存放id
            hosId: "", //医院id
            yearMonth: "", //数据年月
            convertTypeList: [
                {
                    value: "1",
                    label: "单只单片"
                },
                {
                    value: "2",
                    label: "整包装"
                }
            ],
            currentType: "", //当前显示的数据的类型
            Operation: {}, //操作列,
            checkBoxList: [], //可选列
            indeterminate: false, //全选状态(非全选)
            checkAll: false, //全选状态（非全选）
            checkAllGroup: [], //选中的多选框
            jisaunGroup:"0",
            customOperatorGroup:"",
            updateIndex:"",
            updateType:"", // 计算类型，乘还是除
            gouyaoCol: [], //购药数据列
            menjizhenCol: [], //门急诊数据列
            binganCol: [], //病案数据列
            yizhuCol: [], //医嘱数据列
            updateList: [], //修改列
            backList:[],
            disabledGroup: "reject", //重洗位置
            chongxiType: "", //重洗类型
            searchForm: {
                address: [],
                hospital: "",
                dataType: 10,
                beginDate: "",
                endDate: "",
                name:"",
                company:"",
                isEqualAmount:0,
                isMorePrice:0,
                isRightData:0,
                packingUnit:""
                // isUpdateType: "",
                // date: "",
                // keyword: ""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            convertFormAdd: {
                unitConvertName: "",
                specConvert: "0",
                drug: "",
                hospId: "",
                dataType: "",
                remark: ""
            },
            ruleValidate: {
                unitConvertName: [
                    { required: true, message: "名称不能为空", trigger: "blur" }
                ]
            },
            showCol: [], //显示列
            allCol: [], //该数据类型的全部列,
            customCalcFormRuleValidate: {
                operator: [
                    { required: true, message: "运算符不能为空", trigger: "blur" }
                ],
                optValue: [
                    { required: true, message: "数值不能为空", trigger: "blur" }
                ],
                optColumn: [
                    { required: true, message: "计算字段不能为空", trigger: "blur" }
                ]
            },
            // 药品相关查询框
            modelChangeDrug:false,
            drugsCol: [
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                // {
                //     text: "药品分类",
                //     name: "drugClassyName",
                //     sortable: true,
                //     moveable: true,
                //     width: 150
                // },
                // {
                //     text: "药品所属范围",
                //     name: "ownRangeName",
                //     sortable: true,
                //     moveable: true,
                //     width: 150
                // },
                {
                    text: "药品通用名",
                    name: "drugGenericName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "剂型",
                    name: "formName",
                    sortable: true,
                    moveable: true,
                    width: 120
                },
                // {
                //     text: "盐酸根",
                //     name: "saltAcidName",
                //     sortable: true,
                //     moveable: true,
                //     width: 150
                // },
                {
                    text: "产品名称",
                    name: "drugProductName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "规格",
                    name: "drugSpecName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "包装规格",
                    name: "packageSpecName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "药品商品名",
                    name: "drugTradeName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "生产企业",
                    name: "companyName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                // {
                //     text: "给药途径",
                //     name: "pathDrugName",
                //     sortable: true,
                //     moveable: true,
                //     width: 150
                // },
                {
                    text: "单价（元）",
                    name: "unitPrice",
                    sortable: true,
                    moveable: true,
                    width: 130
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 180
                }
            ],
            drugsList:[],
            reviewStateList: reviewStateJson.reviewStateList, //数据类型
            drugSearchForm:{
                drugCode:"",
                drugGenericName:"",
                companyName:""
            },
            drugShowDatas: [],
            drugShowColumns: [],
            drugPageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            selectedRecordsColumn :[
                // {
                //     "title": "记录ID",
                //     "key": "recordId",
                //     "width": 80
                // },
                // {
                //     "title": "数据类型",
                //     "key": "data_Type",
                //     "align": "center",
                //     "width": 90
                // },
                {
                    "title": "省份",
                    "key": "province",
                    "align": "center",
                    "width": 80
                },
                {
                    "title": "城市",
                    "key": "city",
                    "align": "center",
                    "width": 80
                },
                {
                    "title": "医院编号",
                    "key": "hospitalNum",
                    "align": "center",
                    "width": 100
                },
                {
                    "title": "医院名称",
                    "key": "hospitalName",
                    "align": "center",
                    "width": 200
                },
                {
                    "title": "数据年月",
                    "key": "fileDate",
                    "align": "center",
                    "width": 100
                },
                {
                    "title": "药品编码",
                    "key": "drug",
                    "align": "center",
                    "width": 140
                },
                {
                    "title": "通用名",
                    "key": "drugGenericName",
                    "align": "center",
                    "width": 160
                },
                {
                    "title": "商品名",
                    "key": "drugTradeName",
                    "align": "center",
                    "width": 100
                },
                {
                    "title": "规格",
                    "key": "drugSpec",
                    "align": "center",
                    "width": 120
                },
                {
                    "title": "药品剂型",
                    "key": "drugFormulation",
                    "align": "center",
                    "width": 120
                },
                {
                    "title": "生产企业",
                    "key": "drugManufacturers",
                    "align": "center",
                    "width": 200
                }
            ],
            selectedRecordsData:[],
            changeDrugModelTitle:"修改药品"
        };
    },
    mounted() {
        this.dataTypeList.splice(2,1);
        let self = this;
       
        this.Operation = {
            text: "操作",
            name: "op",
            filterable: false,
            removeable: false,
            width: 300
        };
        this.SelectOp = {
            text: "#",
            name: "sel",
            width: 40,
            filterable: false,
            removeable: false
        };
        //公共列
        this.commonCol.push(this.SelectOp);
        columns.columncommon.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                width: item.width,
                sortable: true,
                moveable: true,
                render: params => {
                    if(item.key=="data_Type"){
                        if (params.dataType == 10) {
                            return "购药";
                        } else if (params.dataType == 20) {
                            return "门急诊";
                        } else if (params.dataType == 30) {
                            return "病案";
                        } else {
                            return "医嘱";
                        }
                    }else{
                        return params[item.key]
                    }
                }
            };
            this.commonCol.push(column);
        });

        //购药列
        this.gouyaoCol = [].concat(this.commonCol);
        let morePrice = {
                text: "是否多个单价",
                name: "morePrice",
                width: 100,
                sortable: true,
                moveable: true
                
            };
        
        // let editGouyaoInput="[price][purchaseVolume][purchaseAmount]";
        let editGouyaoInput="[price][purchaseVolume][purchaseAmount]";
        columns.columnGouyao.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                width: item.width,
                // title:item.databaseFieldName,
                sortable: true,
                moveable: true,
                title:item.databaseFieldName,
                isInput:editGouyaoInput.indexOf("["+item.key+"]")>-1,
                ...(['与医院单价比','与省份单价比','与标准单价比','标准销售单价','标准制剂单价','单价','上报单价','购进量','上报购进量','购药总额'].indexOf(item.title)!=-1? {dataType: 'number'}: null)
            };
            this.gouyaoCol.push(column);
        });
        this.gouyaoCol.push(morePrice);
        this.gouyaoCol.push(this.Operation);
        
        //门急诊列
        this.menjizhenCol = [].concat(this.commonCol);
        // let editMenjizhenInput="[price][quantity][amount]";
        let editMenjizhenInput="[price][quantity][amount]";
        columns.columnMenjizhen.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                width: item.width,
                // title:item.databaseFieldName,
                sortable: true,
                moveable: true,
                title:item.databaseFieldName,
                isInput:editMenjizhenInput.indexOf("["+item.key+"]")>-1,
                ...(['与医院单价比','与省份单价比','与标准单价比','标准销售单价','标准制剂单价','单价','上报单价','购进量','上报购进量','购药总额'].indexOf(item.title)!=-1? {dataType: 'number'}: null)
            };
            this.menjizhenCol.push(column);
        });
        this.menjizhenCol.push(this.Operation);
        //医嘱列
        this.yizhuCol = [].concat(this.commonCol);
        // let editYizhuInput="[price][putdrugQuantity][amount]";
        let editYizhuInput="[price][putdrugQuantity][amount]";
        columns.columnYizhu.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                width: item.width,
                // title:item.databaseFieldName,
                sortable: true,
                moveable: true,
                title:item.databaseFieldName,
                isInput:editYizhuInput.indexOf("["+item.key+"]")>-1,
                ...(['与医院单价比','与省份单价比','与标准单价比','标准销售单价','标准制剂单价','单价','上报单价','购进量','上报购进量','购药总额'].indexOf(item.title)!=-1? {dataType: 'number'}: null)
            };
            this.yizhuCol.push(column);
        });
        this.yizhuCol.push(this.Operation);

        this.getHospitalList(""); //获取医院数据
        this.getAddressList(); //获取省市数据
    },
    activated(){
        if (this.$route.params.id != undefined && this.$route.params.id != "") {
            this.searchForm.dataType=Number(this.$route.params.id);
        }
        
        this.getConvertList(); //获取列表数据
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
        //根据省市获取医院
        getHosp(value) {
            this.getHospitalList(value);
        },
        //获取列表数据
        getConvertList(pageIndex) {
            
            var self = this;
           
            if(self.searchForm.isRightData == "1" && (self.searchForm.hospital == null || self.searchForm.hospital.length <1
            || self.searchForm.yearMonth == null || self.searchForm.yearMonth.length <1)){

                self.$Modal.error({
                            title: "请完善条件",
                            content: "查询正确单位换算必须选择医院和数据年月！"
                        });
                        return;
            }
            if (self.currentType != self.searchForm.dataType) {
                if (this.searchForm.dataType == 10) {
                    this.capyCol = [].concat(this.gouyaoCol);
                } else if (this.searchForm.dataType == 20) {
                    this.capyCol = [].concat(this.menjizhenCol);
                } else if (this.searchForm.dataType == 30) {
                    this.capyCol = [].concat(this.binganCol);
                } else {
                    this.capyCol = [].concat(this.yizhuCol);
                }
            }
            
            Vue.ajax.send({
                name:
                    self.searchForm.dataType == 20
                        ? "convertOutpatient.getList"
                        : self.searchForm.dataType == 30
                            ? "convertMedical.getList"
                            : self.searchForm.dataType == 40
                                ? "convertDoctor.getList"
                                : "convertDrug.getList",
                data: {
                    pageIndex:pageIndex ||  self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    provinceId:
                        self.searchForm.address.length > 0
                            ? self.searchForm.address[0]
                            : null, //省
                    cityId:
                        self.searchForm.address.length == 2
                            ? self.searchForm.address[1]
                            : null, //市
                    beginDate: self.searchForm.beginDate, //开始时间
                    endDate: self.searchForm.endDate, //结束时间
                    hospitalId: self.searchForm.hospital, //医院
                    yearMonth: self.searchForm.yearMonth.replace("-",""), //数据类型
                    dataType: self.searchForm.dataType, //数据类型
                    name:self.searchForm.name,
                    company:self.searchForm.company,
                    amountEqual:self.searchForm.isEqualAmount,
                    morePrice:self.searchForm.isMorePrice,
                    rightData:self.searchForm.isRightData,
                    packingUnit:self.searchForm.packingUnit
                    // date: self.searchForm.date, //时间
                    // keywords: self.searchForm.keywords, //自定义
                    // isUpdate: self.searchForm.isUpdateType //修改状态
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.convertList = data.data.dataList;
                        //判断当前数据状态和上次数据状态
                        if (self.currentType != self.searchForm.dataType) {
                            self.checkAllGroup = []; //清空多选默认选中列数组
                            self.indeterminate = false; //全选状态(非全选)
                            self.checkAll = false; //全选状态（非全选）
                            self.currentType = self.searchForm.dataType; //保存当前显示数据类型
                        }
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        // self.pageConfig.pageNum = data.data.currentPageIndex;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取省市
        getAddressList() {
            var self = this;
            Vue.ajax.send({
                name: "business.adressList",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.addressList = data.data;
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
        getHospitalList(value) {
            var self = this;
            Vue.ajax.send({
                name: "business.hospitalList",
                data: {
                    provinceId: value.length > 0 ? value[0] : null, //省
                    cityId: value.length == 2 ? value[1] : null //市
                },
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
            this.getConvertList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getConvertList();
        },
        //保存批量选中的信息
        getSelectList(arr) {
            //批量选中的信息
            this.selectList = arr;
        },
        batchOperation1() {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量重新清洗的数据！</h5>"
                });
            } else {
                this.chongxiType = "piliang";
                this.model1 = true;
            }
        },
        //批量重洗
        batchOperation() {
            var self = this;
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量重新清洗的数据！</h5>"
                });
            } else {
                let selectIdList = []; //选中数据的id标识
                //遍历选中的数据获取选中数据的id数组
                this.selectList.forEach(element => {
                    selectIdList.push(element.recordId);
                });
                Vue.ajax.send({
                    name: "errorInfor.updateState",
                    data: {
                        // id: selectIdList,
                        id: this.selectList,
                        viewType: commonJson.convert,
                        stateType: commonJson.toclean,
                        dataType: this.currentType,
                        hospId: this.hospId,
                        yearMonth: this.yearMonth,
                        radioType: this.disabledGroup
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success(
                                "选中的信息已重新进入清洗流程。"
                            );
                            self.getConvertList(); //刷新列表
                            self.selectList = ""; //清空选中的数据
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
        //批量确认
        batchAffirm() {
            var self = this;
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量确认的数据！</h5>"
                });
            } else {
                let selectIdList = []; //选中数据的id标识
                this.selectList.forEach(element => {
                    selectIdList.push(element.recordId);
                });
                Vue.ajax.send({
                    name: "errorInfor.updateState",
                    data: {
                        id: selectIdList,
                        viewType: commonJson.convert,
                        stateType: commonJson.affirm,
                        dataType: this.currentType,
                        hospId: this.hospId,
                        yearMonth: this.yearMonth
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Modal.success({
                                title: "成功",
                                closable: true,
                                content: "选中的信息已确认为错误信息。"
                            });
                            self.getConvertList(); //刷新列表
                            self.selectList = ""; //清空选中的数据
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
        cleanYes1() {
            if (this.chongxiType == "piliang") {
                this.batchOperation();
            } else {
                this.cleanYes();
            }
        },
        //重新清洗确认操作
        cleanYes() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "errorInfor.updateState",
                data: {
                    id: selectIdList,
                    viewType: commonJson.convert,
                    stateType: commonJson.toclean,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth,
                    radioType: this.disabledGroup
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该信息已重新进入清洗流程。");
                        self.getConvertList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //确认操作
        affirmYes() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "errorInfor.updateState",
                data: {
                    id: selectIdList,
                    viewType: commonJson.convert,
                    stateType: commonJson.affirm,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Modal.success({
                            title: "成功",
                            closable: true,
                            content: "<h5>该信息已确认为错误信息。</h5>"
                        });
                        self.getConvertList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //创建规则
        rulesYes() {
            this.$refs["convertAdd"].validate(valid => {
                if (valid) {
                    var self = this;
                    if(self.convertFormAdd.specConvert==0){
                        self.convertFormAdd.drug=null;
                    }
                    Vue.ajax.send({
                        name: "convertManage.addConvertRules",
                        data: {
                            unitConvertName:
                                self.convertFormAdd.unitConvertName,
                            hospId: self.convertFormAdd.hospId,
                            dataType: self.convertFormAdd.dataType,
                            drug: self.convertFormAdd.drug,
                            specConvert: self.convertFormAdd.specConvert,
                            remark: self.convertFormAdd.remark
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.model4 = false;
                                self.$Message.success("规则创建成功。");
                                self.convertFormAdd.unitConvertName = "";
                                self.convertFormAdd.remark = "";
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
        //列编辑判断必填字段
        requiredCol(info) {
            var self = this;
            //获取必填字段
            let result = true; //必填状态
            Vue.ajax.send({
                name: "convertManage.getRequired",
                data: {
                    hospitalNum: info.hospitalNum, //医院编码
                    dataType: self.currentType //数据类型
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        data.data.forEach(item => {
                            if (info[item] && info[item] !== "") {
                            } else {
                                result = false;
                            }
                        });
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                    //判断必填字段
                    if (result) {
                        self.saveEdit(info);
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: "数据完整性不足，有必填字段为空"
                        });
                    }
                }
            });
        },
        //保存列编辑
        saveEdit(index) {
            var self = this;
            if(index!=-1)
                this.backList=[self.showDatas[index]];


            Vue.ajax.send({
                name: "convertManage.saveEdit",
                data: {
                    drug: self.backList,
                    pat: self.backList,
                    med: self.backList,
                    doc: self.backList,
                    updateList: this.updateList.distinct(),
                    viewType: this.currentType
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("保存成功。");
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //自定义显示列
        cloumnSet() {
            //设置显示的可选列
            this.checkBoxList = this.allCol;
            //显示列设置模态框
            this.model2 = true;
        },
        //设置列确认操作
        columnYes() {
            this.showCol = [];
            //取出选中的列放到显示列中
            this.checkAllGroup.forEach(a => {
                this.allCol.forEach(b => {
                    if (a == b.key) {
                        this.showCol.push(b);
                    }
                });
            });
            //添加固定显示列
            this.showCol.push.apply(this.showCol, this.Operation);
        },
        //判断全选的状态
        checkAllGroupChange(data) {
            if (data.length === this.allCol.length && this.currentType == 1) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (
                data.length === this.allCol.length &&
                this.currentType == 2
            ) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (
                data.length === this.allCol.length &&
                this.currentType == 3
            ) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (
                data.length === this.allCol.length &&
                this.currentType == 4
            ) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        //全选/非全选
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                this.checkAllGroup = []; //重置多选框数组内容
                this.allCol.forEach(a => this.checkAllGroup.push(a.key));
            } else {
                this.checkAllGroup = [];
            }
        },
        sortColumn: function(column, asc) {
            this.currentSort.column = column;
            this.currentSort.asc = asc;
        },
        showData: function(datas, showColumns) {
            this.showDatas = datas;
            this.capShowDatas=this.objDeepCopy(datas);
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
                    let columnConfig = this.gouyaoCol
                    if (this.currentType == 20) {
                        columnConfig = this.menjizhenCol
                    } else if (this.currentType == 40) {
                        columnConfig = this.yizhuCol
                    }
                    girdDataSort(this.showDatas, this.currentSort, columnConfig)
                }
            }
            this.showColumns = showColumns.distinct();
            if (this.showColumns.length > 0) {
                if (this.currentType == 10) {
                    this.gouyaoCol = [];
                    this.capyCol.forEach(m => {
                        this.showColumns.forEach(n => {
                            if (m.name == n) {
                                this.gouyaoCol.push(m);
                            }
                        });
                    });
                } else if (this.currentType == 20) {
                    this.menjizhenCol = [];
                    this.capyCol.forEach(m => {
                        this.showColumns.forEach(n => {
                            if (m.name == n) {
                                this.menjizhenCol.push(m);
                            }
                        });
                    });
                } else if (this.currentType == 30) {
                    this.binganCol = [];
                    this.capyCol.forEach(m => {
                        this.showColumns.forEach(n => {
                            if (m.name == n) {
                                this.binganCol.push(m);
                            }
                        });
                    });
                } else {
                    this.yizhuCol = [];
                    this.capyCol.forEach(m => {
                        this.showColumns.forEach(n => {
                            if (m.name == n) {
                                this.yizhuCol.push(m);
                            }
                        });
                    });
                }
            }
        },
        //单选
        clickMe(index,event) {
            // console.log(index);
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(
                this.showDatas[index].recordId
            );
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.showDatas[index].recordId);
            }
        },
        //全选、非全选
        allClickMe(value) {
            if (value == 1) {
                this.selectList = this.showDatas.map(a => a["recordId"]);
            } else {
                this.selectList = [];
            }
        },
        //重洗弹窗
        chongxi(index) {
            this.model1 = true;
            this.commonId = this.showDatas[index].recordId; //当前行id
            this.currentType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
            this.chongxiType = "";
        },
        //编辑单元格
        inInput(info, index, item, valueName) {
            //保存编辑的数据
            item[valueName] = info.target.value;
            this.showDatas[index] = item;
            //保存修改列
            console.log(valueName)
            if (this.updateList.indexOf(valueName) < 0) {
                this.updateList.push(valueName);
            }
        },
        addRule(index) {
            this.model4 = true;
            this.commonId = this.showDatas[index].recordId; //当前行id
            this.convertFormAdd.unitConvertName =
                this.showDatas[index].hospitalName + new Date().getTime();
            this.convertFormAdd.hospId = this.showDatas[index].hospId;
            this.convertFormAdd.dataType = this.showDatas[index].dataType;
            this.convertFormAdd.drug = this.showDatas[index].mdurg;
        },
        IsYes(index){
            this.commonId = this.showDatas[index].recordId; //当前行id
            this.currentType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
            this.chongxiType = "";
            this.disabledGroup="finish";
            this.IsQueren();
        },
        IsQueren(){
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "errorInfor.updateState",
                data: {
                    id: selectIdList,
                    viewType: commonJson.convert,
                    stateType: 'affirm',
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth,
                    radioType: this.disabledGroup
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该信息已确认。");
                        self.getConvertList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        // 数值计算
        jisuan(index,type){
            this.model5=true;
            this.updateType=type;
            this.updateIndex=index;
            if (type==0) {
                this.titleName="计算单价";
                // if (this.currentType==10||this.currentType==40) {
                    this.textOne="（单价/包装规格）";
                    this.textTwo="（单价*包装规格）";
                // }else if (this.currentType==20) {
                //     this.textOne="（单价*包装规格）";
                //     this.textTwo="（单价/包装规格）";
                // }
            } else {
                this.titleName="计算数量";
                // if (this.currentType==10||this.currentType==40) {
                    this.textOne="（数量*包装规格）";
                    this.textTwo="（数量/包装规格）";
                // }else if (this.currentType==20) {
                //     this.textOne="（数量/包装规格）";
                //     this.textTwo="（数量*包装规格）";
                // }
            }
        },
        jisuan1(index){
            this.updateList=[];
            var datetype=this.showDatas[this.updateIndex].dataType;
            var rulesValue = this.showDatas[this.updateIndex].rules;
            var mu=this.rulesValue.split("##")[1];
            if (datetype==10) {
                if (this.jisaunGroup=='0') {
                    if (this.updateType==0) {
                        let prePrice = this.capShowDatas[this.updateIndex].price;
                        let afterPrice = this.mathDivide(prePrice,mu);
                        this.showDatas[this.updateIndex].price= afterPrice;
                    } else {
                        this.showDatas[this.updateIndex].purchaseVolume= this.mathMultiply(this.capShowDatas[this.updateIndex].purchaseVolume , mu);
                    }
                }else{
                    if (this.updateType==0) {
                        this.showDatas[this.updateIndex].price=this.mathMultiply(this.capShowDatas[this.updateIndex].price,mu);
                    } else {
                        this.showDatas[this.updateIndex].purchaseVolume=this.mathDivide(this.capShowDatas[this.updateIndex].purchaseVolume,mu);
                    }
                }
                this.updateList.push("price");
                this.updateList.push("purchaseVolume");
            }else if (datetype==20) {
                if (this.jisaunGroup=='0') {
                    if (this.updateType==0) {
                        this.showDatas[this.updateIndex].price=this.mathDivide(this.capShowDatas[this.updateIndex].price,mu);
                    } else {
                        this.showDatas[this.updateIndex].quantity=this.mathMultiply(this.capShowDatas[this.updateIndex].quantity,mu);
                    }
                }else{
                    if (this.updateType==0) {
                        this.showDatas[this.updateIndex].price=this.mathMultiply(this.capShowDatas[this.updateIndex].price,mu);
                    } else {
                        this.showDatas[this.updateIndex].quantity=this.mathDivide(this.capShowDatas[this.updateIndex].quantity,mu);
                    }
                }
                this.updateList.push("price");
                this.updateList.push("quantity");
            }else if (datetype==40) {
                if (this.jisaunGroup=='0') {
                    if (this.updateType==0) {
                        this.showDatas[this.updateIndex].price=this.mathDivide(this.capShowDatas[this.updateIndex].price,mu);
                    } else {
                        this.showDatas[this.updateIndex].putdrugQuantity=this.mathMultiply(this.capShowDatas[this.updateIndex].putdrugQuantity,mu);
                    }
                }else{
                    if (this.updateType==0) {
                        this.showDatas[this.updateIndex].price=this.mathMultiply(this.capShowDatas[this.updateIndex].price,mu);
                    } else {
                        this.showDatas[this.updateIndex].putdrugQuantity=this.mathDivide(this.capShowDatas[this.updateIndex].putdrugQuantity,mu);
                    }
                }
                this.updateList.push("price");
                this.updateList.push("putdrugQuantity");
            }
            
        },
        // 计算金额，将其乘积
        calcAmount(index){           
            this.updateIndex=index;
            this.updateList=[];
            var datetype=this.showDatas[this.updateIndex].dataType;
            var rulesValue = this.showDatas[this.updateIndex].rules;
            if (datetype==10) {
                let prePrice = this.capShowDatas[this.updateIndex].price;
                let preQuantity = this.capShowDatas[this.updateIndex].purchaseVolume;
                let calculatedAmount = this.mathMultiply(prePrice , preQuantity);
                this.showDatas[this.updateIndex].purchaseAmount= calculatedAmount;
                this.updateList.push("price");
                this.updateList.push("purchaseVolume");
                this.updateList.push("purchaseAmount");
            }else if (datetype==20) {
                let prePrice = this.capShowDatas[this.updateIndex].price;
                let preQuantity = this.capShowDatas[this.updateIndex].quantity;
                let calculatedAmount = this.mathMultiply(prePrice , preQuantity);
                this.showDatas[this.updateIndex].amount= calculatedAmount;
                this.updateList.push("price");
                this.updateList.push("quantity");
                this.updateList.push("amount");
            }else if (datetype==40) {
                let prePrice = this.capShowDatas[this.updateIndex].price;
                let preQuantity = this.capShowDatas[this.updateIndex].putdrugQuantity;
                let calculatedAmount = this.mathMultiply(prePrice , preQuantity);
                this.showDatas[this.updateIndex].amount= calculatedAmount;
                this.updateList.push("price");
                this.updateList.push("putdrugQuantity");
                this.updateList.push("amount");
            }
        },
        // 自定义计算
        customCalculation(index){
            this.modelCustom=true;
            this.updateIndex=index;
        },
        // 真正执行自定义计算，批量
        fireCustomCalc(){
            
            this.updateList=[];
            var dType=this.showDatas[0].dataType;
            // 表单输入的内容
            console.log(this.customCalcModelForm);
            let operator = this.customCalcModelForm.operator;
            let operColumn = this.customCalcModelForm.optColumn;
            let operValue = this.customCalcModelForm.optValue;
            let reverseCalculation = this.customCalcModelForm.reverseCalculation;
            
            
           if (dType==10) {
                this.updateList.push("price");
                this.updateList.push("purchaseVolume");
                this.updateList.push("purchaseAmount");

                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            if(operColumn == 1){
                                if(operator == 1){
                                    this.showDatas[i].price = this.mathMultiply(this.showDatas[i].price,operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].purchaseVolume = this.mathDivide(this.showDatas[i].purchaseVolume,operValue);
                                    }
                                }else if(operator == 2){
                                    this.showDatas[i].price = this.mathDivide(this.showDatas[i].price , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].purchaseVolume = this.mathMultiply(this.showDatas[i].purchaseVolume,operValue);
                                    }
                                }else if(operator == 3){
                                    this.showDatas[i].price = this.mathPlus(this.showDatas[i].price ,operValue);
                                }else{
                                    this.showDatas[i].price = this.mathMinus(this.showDatas[i].price,operValue);
                                }
                            }
                            if(operColumn == 2){
                                if(operator == 1){
                                    this.showDatas[i].purchaseVolume = this.mathMultiply(this.showDatas[i].purchaseVolume , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].price = this.mathDivide(this.showDatas[i].price,operValue);
                                    }
                                }else if(operator == 2){
                                    this.showDatas[i].purchaseVolume = this.mathDivide(this.showDatas[i].purchaseVolume , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].price = this.mathMultiply(this.showDatas[i].price,operValue);
                                    }
                                }else if(operator == 3){
                                    this.showDatas[i].purchaseVolume = this.mathPlus(this.showDatas[i].purchaseVolume ,operValue);
                                }else{
                                    this.showDatas[i].purchaseVolume = this.mathMinus(this.showDatas[i].purchaseVolume ,operValue);
                                }
                            }
                            if(operColumn == 3){
                                if(operator == 1){
                                    this.showDatas[i].purchaseAmount = this.mathMultiply(this.showDatas[i].purchaseAmount , operValue);
                                }else if(operator == 2){
                                    this.showDatas[i].purchaseAmount = this.mathDivide(this.showDatas[i].purchaseAmount , operValue);
                                }else if(operator == 3){
                                    this.showDatas[i].purchaseAmount = this.mathPlus(this.showDatas[i].purchaseAmount , operValue);
                                }else{
                                    this.showDatas[i].purchaseAmount = this.mathMinus(this.showDatas[i].purchaseAmount , operValue);
                                }
                            }
                        }
                    }
                });
            }else if (dType==20) {
                this.updateList.push("price");
                this.updateList.push("quantity");
                this.updateList.push("amount");

                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            
                            if(operColumn == 1){
                                if(operator == 1){
                                    this.showDatas[i].price = this.mathMultiply(this.showDatas[i].price , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].quantity = this.mathDivide(this.showDatas[i].quantity,operValue);
                                    }
                                }else if(operator == 2){
                                    this.showDatas[i].price = this.mathDivide(this.showDatas[i].price , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].quantity = this.mathMultiply(this.showDatas[i].quantity,operValue);
                                    }
                                }else if(operator == 3){
                                    this.showDatas[i].price = this.mathPlus(this.showDatas[i].price , operValue);
                                }else{
                                    this.showDatas[i].price = this.mathMinus(this.showDatas[i].price , operValue);
                                }
                            }
                            if(operColumn == 2){
                                if(operator == 1){
                                    this.showDatas[i].quantity = this.mathMultiply(this.showDatas[i].quantity , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].price = this.mathDivide(this.showDatas[i].price,operValue);
                                    }
                                }else if(operator == 2){
                                    this.showDatas[i].quantity = this.mathDivide(this.showDatas[i].quantity , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].price = this.mathMultiply(this.showDatas[i].price,operValue);
                                    }
                                }else if(operator == 3){
                                    this.showDatas[i].quantity = this.mathPlus(this.showDatas[i].quantity , operValue);
                                }else{
                                    this.showDatas[i].quantity = this.mathMinus(this.showDatas[i].quantity , operValue);
                                }
                            }
                            if(operColumn == 3){
                                if(operator == 1){
                                    this.showDatas[i].amount = this.mathMultiply(this.showDatas[i].amount , operValue);
                                }else if(operator == 2){
                                    this.showDatas[i].amount = this.mathDivide(this.showDatas[i].amount , operValue);
                                }else if(operator == 3){
                                    this.showDatas[i].amount = this.mathPlus(this.showDatas[i].amount , operValue);
                                }else{
                                    this.showDatas[i].amount = this.mathMinus(this.showDatas[i].amount , operValue);
                                }
                            }
    
                        }
                    }
                });
            }else if (dType==40) {
                this.updateList.push("price");
                this.updateList.push("putdrugQuantity");
                this.updateList.push("amount");

                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            
                            if(operColumn == 1){
                                if(operator == 1){
                                    this.showDatas[i].price = this.mathMultiply(this.showDatas[i].price , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].putdrugQuantity = this.mathDivide(this.showDatas[i].putdrugQuantity,operValue);
                                    }
                                }else if(operator == 2){
                                    this.showDatas[i].price = this.mathDivide(this.showDatas[i].price , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].putdrugQuantity = this.mathMultiply(this.showDatas[i].putdrugQuantity,operValue);
                                    }
                                }else if(operator == 3){
                                    this.showDatas[i].price = this.mathPlus(this.showDatas[i].price , operValue);
                                }else{
                                    this.showDatas[i].price = this.mathMinus(this.showDatas[i].price , operValue);
                                }
                            }
                            if(operColumn == 2){
                                if(operator == 1){
                                    this.showDatas[i].putdrugQuantity = this.mathMultiply(this.showDatas[i].putdrugQuantity , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].price = this.mathDivide(this.showDatas[i].price,operValue);
                                    }
                                }else if(operator == 2){
                                    this.showDatas[i].putdrugQuantity = this.mathDivide(this.showDatas[i].putdrugQuantity , operValue);
                                    if(reverseCalculation){
                                        this.showDatas[i].price = this.mathMultiply(this.showDatas[i].price,operValue);
                                    }
                                }else if(operator == 3){
                                    this.showDatas[i].putdrugQuantity = this.mathPlus(this.showDatas[i].putdrugQuantity , operValue);
                                }else{
                                    this.showDatas[i].putdrugQuantity = this.mathMinus(this.showDatas[i].putdrugQuantity , operValue);
                                }
                            }
                            if(operColumn == 3){
                                if(operator == 1){
                                    this.showDatas[i].amount = this.mathMultiply(this.showDatas[i].amount , operValue);
                                }else if(operator == 2){
                                    this.showDatas[i].amount = this.mathDivide(this.showDatas[i].amount , operValue);
                                }else if(operator == 3){
                                    this.showDatas[i].amount = this.mathPlus(this.showDatas[i].amount , operValue);
                                }else{
                                    this.showDatas[i].amount = this.mathMinus(this.showDatas[i].amount , operValue);
                                }
                            }

                        }
                    }
                });
            }         

        },
        // 修改药品
        batchChangeDrugs(){
            // 带入选中行
            this.selectedRecordsData = [];
            this.selectList.forEach(code => {
                for (let i = 0; i < this.showDatas.length; i++) {
                    if (this.showDatas[i].recordId==code) {
                        this.selectedRecordsData.push(this.showDatas[i]);
                    }
                };
            });
            let lastSelectedRow = this.selectedRecordsData[this.selectedRecordsData.length - 1];
             // 带入值  
            this.drugSearchForm.drugGenericName = lastSelectedRow.mapDrugGenName;
            this.drugSearchForm.companyName = lastSelectedRow.mapDrugManu;

            var dTypeStr = "";
            if (this.currentType == 10) {
                dTypeStr =  "购药";
            } else if (this.currentType == 20) {
                dTypeStr =  "门急诊";
            } else if (this.currentType == 30) {
                dTypeStr =  "病案";
            } else {
                dTypeStr =  "医嘱";
            }
            this.changeDrugModelTitle = '修改药品【' + dTypeStr + '】';
            this.modelChangeDrug = true;
            this.changeDrugPage(1);
        },
        batchJisuan(type){
            this.model6=true;
            this.updateType=type;
            if (type==0) {
                this.titleName="计算单价";
                // if (this.currentType==10||this.currentType==40) {
                    this.textOne="（单价/包装规格）";
                    this.textTwo="（单价*包装规格）";
                // }else if (this.currentType==20) {
                //     this.textOne="（单价*包装规格）";
                //     this.textTwo="（单价/包装规格）";
                // }
            } else {
                this.titleName="计算数量";
                // if (this.currentType==10||this.currentType==40) {
                    this.textOne="（数量*包装规格）";
                    this.textTwo="（数量/包装规格）";
                // }else if (this.currentType==20) {
                //     this.textOne="（数量/包装规格）";
                //     this.textTwo="（数量*包装规格）";
                // }
            }
        },
        
        //计算单价数量
        batchJisuanAll(){
            this.model7=true;
             this.titleName="混合计算";
                // if (this.currentType==10||this.currentType==40) {
            this.textOne="（单价/包装规格）&&（数量*包装规格）";
            this.textTwo="（单价*包装规格）&&（数量/包装规格）";
            
        },
        //计算单价数量
        batchJisuanAll1(){
            {
            
            this.updateList=[];
            var datetype=this.showDatas[0].dataType;
            if (datetype==10) {
                this.updateList.push("price");
                this.updateList.push("purchaseVolume");
                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            // if (this.showDatas[i].cellClassName!="update") {
                                var mu=this.showDatas[i].rules.split("##")[1];
                                if (this.jisaunGroup=='0') {
                                    this.showDatas[i].price=this.mathDivide(this.capShowDatas[i].price,mu);
                                    this.showDatas[i].purchaseVolume=this.mathMultiply(this.capShowDatas[i].purchaseVolume,mu);
                                }else{
                                    this.showDatas[i].price=this.mathMultiply(this.capShowDatas[i].price,mu);
                                    this.showDatas[i].purchaseVolume=this.mathDivide(this.capShowDatas[i].purchaseVolume,mu);
                                    
                                }
                        }
                    }
                });
            }else if (datetype==20) {
                this.updateList.push("price");
                this.updateList.push("quantity");
                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                                var mu=this.showDatas[i].rules.split("##")[1];
                                if (this.jisaunGroup=='0') {
                                    this.showDatas[i].price=this.mathDivide(this.capShowDatas[i].price,mu);
                                    this.showDatas[i].quantity=this.mathMultiply(this.capShowDatas[i].quantity,mu);
                                }else{
                                    this.showDatas[i].price=this.mathMultiply(this.capShowDatas[i].price,mu);
                                    this.showDatas[i].quantity=this.mathDivide(this.capShowDatas[i].quantity,mu);
                                }
                        }
                    }
                });
            }else if (datetype==40) {
                this.updateList.push("price");
                this.updateList.push("putdrugQuantity");
                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                                var mu=this.showDatas[i].rules.split("##")[1];
                                if (this.jisaunGroup=='0') {
                                    this.showDatas[i].price=this.mathDivide(this.capShowDatas[i].price,mu);
                                    this.showDatas[i].putdrugQuantity=this.mathMultiply(this.capShowDatas[i].putdrugQuantity,mu);
                                }else{
                                    this.showDatas[i].price=this.mathMultiply(this.capShowDatas[i].price,mu);
                                    this.showDatas[i].putdrugQuantity=this.mathDivide(this.capShowDatas[i].putdrugQuantity,mu);
                                }
                        }
                    }
                });
            }
        }
        },
        batchCalcAmount(){       
            this.updateList=[];
            var datetype=this.showDatas[0].dataType;
            if (datetype==10) {
                this.updateList.push("price");
                this.updateList.push("purchaseVolume");
                this.updateList.push("purchaseAmount");

                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            this.showDatas[i].purchaseAmount= this.mathMultiply(this.capShowDatas[i].price , this.capShowDatas[i].purchaseVolume);
                        }
                    };
                });
            }else if (datetype==20) {

                this.updateList.push("price");
                this.updateList.push("quantity");
                this.updateList.push("amount");

                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            this.showDatas[i].amount= this.mathMultiply(this.capShowDatas[i].price , this.capShowDatas[i].quantity);
                        }
                    }
                });
            }else if (datetype==40) {
                this.updateList.push("price");
                this.updateList.push("putdrugQuantity");
                this.updateList.push("amount");

                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        this.showDatas[i].amount= this.mathMultiply(this.capShowDatas[i].price , this.capShowDatas[i].putdrugQuantity);
                    }
                });
            }            

        },
        batchJisuan1(){
            alert(this.updateType);
            this.updateList=[];
            var datetype=this.showDatas[0].dataType;
            if (datetype==10) {
                this.updateList.push("price");
                this.updateList.push("purchaseVolume");
                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            // if (this.showDatas[i].cellClassName!="update") {
                                var mu=this.showDatas[i].rules.split("##")[1];
                                if (this.jisaunGroup=='0') {
                                    if (this.updateType==0) {
                                        this.showDatas[i].price=this.mathDivide(this.capShowDatas[i].price,mu);
                                    } else {
                                        this.showDatas[i].purchaseVolume=this.mathMultiply(this.capShowDatas[i].purchaseVolume,mu);
                                    }
                                }else{
                                    if (this.updateType==0) {
                                        this.showDatas[i].price=this.mathMultiply(this.capShowDatas[i].price,mu);
                                    } else {
                                        this.showDatas[i].purchaseVolume=this.mathDivide(this.capShowDatas[i].purchaseVolume,mu);
                                    }
                                }
                                // this.showDatas[i].price=this.capShowDatas[i].price*mu;
                                // this.showDatas[i].purchaseVolume=this.capShowDatas[i].purchaseVolume/mu;
                                // this.showDatas[i].cellClassName="update";
                            // }
                        }
                    }
                });
            }else if (datetype==20) {
                // this.showDatas[index].price=this.capShowDatas[index].price*mu;
                // this.showDatas[index].quantity=this.capShowDatas[index].quantity/mu;
                this.updateList.push("price");
                this.updateList.push("quantity");
                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            // if (this.showDatas[i].cellClassName!="update") {
                                var mu=this.showDatas[i].rules.split("##")[1];
                                if (this.jisaunGroup=='0') {
                                    if (this.updateType==0) {
                                        this.showDatas[i].price=this.mathDivide(this.capShowDatas[i].price,mu);
                                    } else {
                                        this.showDatas[i].quantity=this.mathMultiply(this.capShowDatas[i].quantity,mu);
                                    }
                                }else{
                                    if (this.updateType==0) {
                                        this.showDatas[i].price=this.mathMultiply(this.capShowDatas[i].price,mu);
                                    } else {
                                        this.showDatas[i].quantity=this.mathDivide(this.capShowDatas[i].quantity,mu);
                                    }
                                }
                                // this.showDatas[i].price=this.capShowDatas[i].price*mu;
                                // this.showDatas[i].quantity=this.capShowDatas[i].quantity/mu;
                            //     this.showDatas[i].cellClassName="update";
                            // }
                        }
                    }
                });
            }else if (datetype==40) {
                this.updateList.push("price");
                this.updateList.push("putdrugQuantity");
                // this.showDatas[index].price=this.capShowDatas[index].price/mu;
                // this.showDatas[index].putdrugQuantity=this.capShowDatas[index].putdrugQuantity*mu;
                this.selectList.forEach(code => {
                    for (let i = 0; i < this.showDatas.length; i++) {
                        if (this.showDatas[i].recordId==code) {
                            // if (this.showDatas[i].cellClassName!="update") {
                                var mu=this.showDatas[i].rules.split("##")[1];
                                if (this.jisaunGroup=='0') {
                                    if (this.updateType==0) {
                                        this.showDatas[i].price=this.mathDivide(this.capShowDatas[i].price,mu);
                                    } else {
                                        this.showDatas[i].putdrugQuantity=this.mathMultiply(this.capShowDatas[i].putdrugQuantity,mu);
                                    }
                                }else{
                                    if (this.updateType==0) {
                                        this.showDatas[i].price=this.mathMultiply(this.capShowDatas[i].price,mu);
                                    } else {
                                        this.showDatas[i].putdrugQuantity=this.mathDivide(this.capShowDatas[i].putdrugQuantity,mu);
                                    }
                                }
                                // this.showDatas[i].price=this.capShowDatas[i].price/mu;
                                // this.showDatas[i].putdrugQuantity=this.capShowDatas[i].putdrugQuantity*mu;
                            //     this.showDatas[i].cellClassName="update";
                            // }
                        }
                    }
                });
            }
        },
        batchSave(){
            this.backList=[];
            this.selectList.forEach(code => {
                for (let i = 0; i < this.showDatas.length; i++) {
                    if (this.showDatas[i].recordId==code) {
                        // this.saveEdit(i);
                        this.backList.push(this.showDatas[i]);
                    }
                }
            });
            this.saveEdit(-1);
        },
        objDeepCopy(source) {
            var sourceCopy = source instanceof Array ? [] : {};
            for (var item in source) {
                sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
            }
            return sourceCopy;
        },
        // 点击行时触发,视同点击了clickbox
        triggerWhenClickRow(rowIndex,event){
            this.clickMe(rowIndex);
        },
        // 四则运算操作符
        mathPlus(var1,var2){
            return Number(var1) + Number(var2);
        },
        mathMinus(var1,var2){
            return Number(var1) - Number(var2);
        },
        mathMultiply(var1,var2){
            return Number(var1) * Number(var2);
        },
        mathDivide(var1,var2){
            return Number(var1) / Number(var2);
        },
        getDrugsList() {
            var self = this;
            Vue.ajax.send({
                name: "drugs.viewDruglist",
                data: {
                    pageIndex: 1 || self.drugPageConfig.pageNum,
                    pageSize: self.drugPageConfig.pageSize,
                    
                    drug: self.drugSearchForm.drugCode,
                    drugGenericName: self.drugSearchForm.drugGenericName,
                    companyName: self.drugSearchForm.companyName,
                    statusId: 4
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.drugsList = data.data.dataList;
                        self.drugPageConfig.totalItemCount = data.data.totalItemCount;
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        showDrugData: function(datas, showColumns) {
            this.drugShowDatas = datas;
        },
        changeDrugPage(currentPage) {
            this.drugPageConfig.pageNum = currentPage;
            this.getDrugsList();
        },
        closeChangeDrugModal(){
            this.modalChangeDrug = false;
        },
        // 选中了一行标准库药品，将带入的记录drug更改
        saveChangeDrug(item) {
            let standardDrug = item.drug;
            // console.log(standardDrug);
            let changedColumnList = [standardDrug];
            let selectedRows = this.selectedRecordsData;
            // console.log(changedColumnList);
            var self = this;
            Vue.ajax.send({
                name: "convertManage.saveEditDrug",
                data: {
                    drug: selectedRows,
                    pat: selectedRows,
                    doc: selectedRows,
                    updateValList : changedColumnList,
                    viewType: this.currentType
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("保存成功。");
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

.selected-row{
    background-color: #133965;
    color: #ffffff;
}
</style>