<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">数据校验</h2>
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
                    <Select v-model="searchForm.dataType" style="width: 120px;">
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
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
            </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'BusinessDataCheckList'" v-if="currentType==20" optionType="business" :columnConfig='menjizhenCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in menjizhenCol" :key="colIndex" :class="item['rules'].indexOf('['+menjizhenCol[colIndex].title+']')>-1?'error-data':''">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessDataCheckList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessDataCheckSave'" icon="md-card" size="small" title="保存" type="success" @click="saveEdit(index)"></Button>
                            <Button v-authorize="'BusinessDataCheckOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <input v-else-if="colData.isInput" :value="item[colData.name]" @change="inInput($event,index,item,colData.name)" style="width:100%"/>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessDataCheckList'" v-else-if="currentType==30" optionType="business" :columnConfig='binganCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in binganCol" :key="colIndex" :class="item['rules'].indexOf('['+binganCol[colIndex].title+']')>-1?'error-data':''">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessDataCheckList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessDataCheckSave'" icon="md-card" size="small" title="保存" type="success" @click="saveEdit(index)"></Button>
                            <Button v-authorize="'BusinessDataCheckOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <input v-else-if="colData.isInput" :value="item[colData.name]" @change="inInput($event,index,item,colData.name)" style="width:100%"/>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessDataCheckList'" v-else-if="currentType==40" optionType="business" :columnConfig='yizhuCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in yizhuCol" :key="colIndex" :class="item['rules'].indexOf('['+yizhuCol[colIndex].title+']')>-1?'error-data':''">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessDataCheckList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessDataCheckSave'" icon="md-card" size="small" title="保存" type="success" @click="saveEdit(index)"></Button>
                            <Button v-authorize="'BusinessDataCheckOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <input v-else-if="colData.isInput" :value="item[colData.name]" @change="inInput($event,index,item,colData.name)" style="width:100%"/>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessDataCheckList'" v-else optionType="business" :columnConfig='gouyaoCol' :columnDatas='dataCheckList' :showModal="showModal" @onSort="sortColumn" @onTableMove="tableMove" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in gouyaoCol" :key="colIndex" :class="item['rules'].indexOf('['+gouyaoCol[colIndex].title+']')>-1?'error-data':''">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessDataCheckList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessDataCheckSave'" icon="md-card" size="small" title="保存" type="success" @click="saveEdit(index)"></Button>
                            <Button v-authorize="'BusinessDataCheckOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <input v-else-if="colData.isInput" :value="item[colData.name]" @change="inInput($event,index,item,colData.name)" style="width:100%"/>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer search-con">
                <div class="mt15 text-center" v-if="dataCheckList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox v-authorize="'BusinessDataCheckList'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button v-authorize="'BusinessDataCheckOper'" type="primary" @click="batchOperation1()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
                    <!-- <Button type="primary" @click="batchAffirm()" :disabled="selectList.length==0" class="inputCheck" style="left: 380px;margin-top: -10px;">批量确认</Button> -->
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>

            </div>
        </div>

        <Modal v-model="model1" title="重新清洗" width=420 @on-ok="cleanYes1">
            请选择重洗清洗开始的位置：</br>
            <RadioGroup v-model="disabledGroup">
                <Radio label="reject">数据剔除</Radio>
                <Radio label="check">数据校验</Radio>
                <Radio label="mapping">数据映射</Radio>
            </RadioGroup>
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
                <CheckboxGroup v-model="checkAllGroup" v-for="item in checkBoxList" :key="item.name" @on-change="checkAllGroupChange" style="width:175px;display:inline-block">
                    <Checkbox :label="item.name">{{item.text}}</Checkbox>
                </CheckboxGroup>
            </div>
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
//数据列
import columns from "@/assets/data/business/cloumnCommon.json";
import "../../assets/css/business/dataerror.css"; //错误列样式
export default {
    name: "dataCheck",
    components: { EmptyRow, CustomTable, CheckboxGroup, Checkbox },
    data() {
        return {
            showModal: false,
            ckeckVal: false,
            showDatas: [],
            currentSort: {
                column: "",
                asc: true
            },
            param: [],
            tableH: 0,
            dataTypeList: commonJson.dataTypeList, //数据类型
            isUpdateTypeList: commonJson.isUpdateTypeList, //修改状态
            hospitalList: [], //医院
            addressList: [], //省市
            dataCheckList: [], //列表
            selectList: [], //选中的信息
            model1: false, //提示框显示状态(重新清洗)
            model2: false, //提示框显示状态(设置列)
            model3: false, //提示框显示状态(确认)
            commonId: "", //存放id
            hosId: "", //医院id
            yearMonth: "", //数据年月
            currentType: "", //当前显示的数据的类型
            Operation: [], //操作列,
            checkBoxList: [], //可选列
            indeterminate: false, //全选状态(非全选)
            checkAll: false, //全选状态（非全选）
            checkAllGroup: [], //选中的多选框
            commonCol: [], //公共字段
            gouyaoCol: [], //购药数据列
            menjizhenCol: [], //门急诊数据列
            binganCol: [], //病案数据列
            yizhuCol: [], //医嘱数据列
            updateList: [], //修改列
            disabledGroup: "reject", //重洗位置
            chongxiType: "", //重洗类型
            pp: [],
            searchForm: {
                address: [],
                hospital: "",
                dataType: 10,
                // isUpdateType: "",
                beginDate: "",
                endDate: ""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            showCol: [], //显示列
            allCol: [] //该数据类型的全部列
        };
    },
    mounted() {
        let self = this;
        //操作列
        this.Operation1 = [
            {
                type: "selection",
                fixed: "left",
                name: "select"
            },
            {
                text: "操作",
                width: 140,
                align: "center",
                fixed: "right",
                name: "action",
                render: (h, params) => {
                    return h("div", [
                        h("Button", {
                            props: {
                                icon: "md-card"
                            },
                            class: "btn-green",
                            attrs: {
                                title: "保存"
                            },
                            on: {
                                click: () => {
                                    this.saveEdit(params.row);
                                }
                            }
                        }),
                        // h("Button", {
                        //     props: {
                        //         icon: "md-checkmark"
                        //     },
                        //     class: "btn-blue",
                        //     attrs: {
                        //         title: "确认"
                        //     },
                        //     style: {
                        //         display:
                        //             params.row.status == 1
                        //                 ? "inline-block"
                        //                 : "none"
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.model3 = true;
                        //             this.commonId = params.row.recordId; //当前行id
                        //             this.currentType = params.row.dataType;
                        //             this.hospId = params.row.hospId;
                        //             this.yearMonth = params.row.yearMonth;
                        //         }
                        //     }
                        // }),
                        // h(
                        //     "Button",
                        //     {
                        //         props: {
                        //             type: "text",
                        //             size: "small",
                        //             ghost: true
                        //         },
                        //         style: {
                        //             color: "#2d8cf0"
                        //         },
                        //         on: {
                        //             click: () => {
                        //                 // this.$router.push(
                        //                 //     "/business/updateFile"
                        //                 // );
                        //                 alert(1);
                        //             }
                        //         }
                        //     },
                        //     "查看源文件"
                        // ),
                        h("Button", {
                            props: {
                                icon: "md-refresh"
                            },
                            class: "btn-deep-blue",
                            attrs: {
                                title: "重新清洗"
                            },
                            on: {
                                click: () => {
                                    this.model1 = true;
                                    this.commonId = params.row.recordId; //当前行id
                                    this.currentType = params.row.dataType;
                                    this.hospId = params.row.hospId;
                                    this.yearMonth = params.row.yearMonth;
                                    this.chongxiType = "";
                                }
                            }
                        })
                    ]);
                }
            }
        ];
        this.Operation = {
            text: "操作",
            name: "op",
            filterable: false,
            removeable: false,
            width: 100
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
        columns.columnGouyao.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                title:item.databaseFieldName,
                width: item.width,
                sortable: true,
                moveable: true,
                isInput: true
            };
            this.gouyaoCol.push(column);
        });
        this.gouyaoCol.push(this.Operation);
        //门急诊列
        this.menjizhenCol = [].concat(this.commonCol);
        columns.columnMenjizhen.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                title:item.databaseFieldName,
                width: item.width,
                sortable: true,
                moveable: true,
                isInput: true
            };
            this.menjizhenCol.push(column);
        });
        this.menjizhenCol.push(this.Operation);
        //病案列
        this.binganCol = [].concat(this.commonCol);
        columns.columnBingan.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                title:item.databaseFieldName,
                width: item.width,
                sortable: true,
                moveable: true,
                isInput: true
            };
            this.binganCol.push(column);
        });
        this.binganCol.push(this.Operation);
        //医嘱列
        this.yizhuCol = [].concat(this.commonCol);
        columns.columnYizhu.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                title:item.databaseFieldName,
                width: item.width,
                sortable: true,
                moveable: true,
                isInput: true
            };
            this.yizhuCol.push(column);
        });
        this.yizhuCol.push(this.Operation);

        this.getHospitalList(""); //获取医院数据
        this.getAddressList(); //获取省市数据
        this.getDataCheckList(); //获取列表数据
    },
    activated(){
        if (this.$route.params.id != undefined && this.$route.params.id != "") {
            this.searchForm.dataType=Number(this.$route.params.id);
        }

        //this.getDataCheckList(); //获取列表数据
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
        getDataCheckList(pageIndex) {
            var self = this;
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
                        ? "checkOutpatient.getList"
                        : self.searchForm.dataType == 30
                            ? "checkMedical.getList"
                            : self.searchForm.dataType == 40
                                ? "checkDoctor.getList"
                                : "checkDrug.getList",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    provinceId:
                        self.searchForm.address.length == 1
                            ? self.searchForm.address[0]
                            : null, //省
                    cityId:
                        self.searchForm.address.length == 2
                            ? self.searchForm.address[1]
                            : null, //市
                    beginDate: self.searchForm.beginDate, //开始时间
                    endDate: self.searchForm.endDate, //结束时间
                    yearMonth: self.searchForm.yearMonth.replace("-",""), //数据类型
                    hospitalId: self.searchForm.hospital, //医院
                    dataType: self.searchForm.dataType //数据类型
                    // keywords: self.searchForm.keywords, //自定义
                    // isUpdate: self.searchForm.isUpdateType //修改状态
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        data.data.dataList.forEach(m => {
                            // console.log("m::", m.cellClassName);
                            // JSON.parse(m.cellClassName);
                            var firstCopy = JSON.parse(
                                JSON.stringify(m.cellClassName)
                            );
                            // console.log("m:asdas:", firstCopy);
                            m.cellClassName = firstCopy;
                        });
                        self.dataCheckList = data.data.dataList;
                        // console.log(self.dataCheckList);
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
            this.getDataCheckList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDataCheckList();
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
                        id: self.selectList,
                        viewType: commonJson.dataCheck,
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
                            self.getDataCheckList(); //刷新列表
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
                        // id: selectIdList,
                        id: self.selectList,
                        viewType: commonJson.dataCheck,
                        stateType: commonJson.affirm,
                        dataType: this.currentType,
                        hospId: this.hospId,
                        yearMonth: this.yearMonth
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success(
                                "选中的信息已确认为错误信息。"
                            );
                            self.getDataCheckList(); //刷新列表
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
                    viewType: commonJson.dataCheck,
                    stateType: commonJson.toclean,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth,
                    radioType: this.disabledGroup
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该信息已重新进入清洗流程。");
                        self.getDataCheckList(); //刷新列表
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
                    viewType: commonJson.dataCheck,
                    stateType: commonJson.affirm,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该信息已确认为错误信息。");
                        self.getDataCheckList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //列编辑判断必填字段
        requiredCol(info) {
            this.saveEdit(info);

            var self = this;
            //获取必填字段
            let result = true; //必填状态
            Vue.ajax.send({
                name: "dataCheck.getRequired",
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
            // console.log("event", this.dataCheckList[index]);
            var self = this;
            Vue.ajax.send({
                name: "dataCheck.saveEdit",
                data: {
                    drug: self.showDatas[index],
                    pat: self.showDatas[index],
                    med: self.showDatas[index],
                    doc: self.showDatas[index],
                    updateList: self.updateList.distinct(),
                    viewType: self.currentType
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
                    // console.log(a, b);
                    if (a == b.title) {
                        this.showCol.push(b);
                    }
                });
            });
            //添加固定显示列
            this.showCol.push.apply(this.showCol, this.Operation);
            // console.log("asdaaa", this.showCol);
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
        tableMove(width) {
            // console.log("with",width)
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
        clickMe(index) {
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
            if (this.updateList.indexOf(valueName) < 0) {
                this.updateList.push(valueName);
            }
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
</style>