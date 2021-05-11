<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">数据互斥</h2>
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
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.status" style="width: 120px;" clearable>
                        <Option value="1">待确认</Option>
                        <Option value="2">已确认</Option>
                    </Select>
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
            <CustomTable v-authorize="'BusinessMutexList'" v-if="currentType==20" optionType="business" :columnConfig='menjizhenCol' :columnDatas='mutexDataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in menjizhenCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessMutexList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessMutexOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessMutexList'" v-else-if="currentType==30" optionType="business" :columnConfig='binganCol' :columnDatas='mutexDataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in binganCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessMutexList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessMutexOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessMutexList'" v-else-if="currentType==40" optionType="business" :columnConfig='yizhuCol' :columnDatas='mutexDataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in yizhuCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessMutexList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessMutexOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessMutexList'" optionType="business" v-else :columnConfig='gouyaoCol' :columnDatas='mutexDataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in gouyaoCol" :key="colIndex" class="ellipsis">
                        <!-- {{colData.name}}{{gouyaoCol.length}} -->
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessMutexList'" style="display: none;"></Button>
                            <Button v-authorize="'BusinessMutexYes'" v-if="item['status']=='1'" icon="md-checkmark" size="small" title="确认" type="success" @click="queren(index)"></Button>
                            <Button v-authorize="'BusinessMutexOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['recordId']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='data_Type'">
                            {{item['dataType']==10?"购药":item['dataType']==20?"门急诊":item['dataType']==30?"病案":"医嘱"}}
                        </span>
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="mutexDataList!=null && mutexDataList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox v-authorize="'BusinessMutexList'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button v-authorize="'BusinessMutexOper'" type="primary" @click="batchOperation()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
                    <Button v-authorize="'BusinessMutexYes'" type="primary" @click="batchAffirm()" :disabled="selectList.length==0" class="inputCheck" style="left: 335px;margin-top: -10px;">确认</Button>
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
        <Modal v-model="model2" title="确认" width=420 @on-ok="affirmYes">
            您确定要将该信息确认为错误信息吗？
        </Modal>
        <Modal v-model="model3" title="设置显示列" width=600 @on-ok="columnYes">
            <div style="padding-bottom:6px;margin-bottom:6px;">
                <b>勾选显示的列选项：</b>
                <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <div style="height:255px;overflow-y:auto;">
                <CheckboxGroup v-model="checkAllGroup" v-for="item in checkBoxList" :key="item.key" @on-change="checkAllGroupChange" style="width:175px;display:inline-block">
                    <Checkbox :label="item.key">{{item.title}}</Checkbox>
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
    name: "mutex",
    components: { EmptyRow, CustomTable, CheckboxGroup, Checkbox },
    data() {
        return {
            resourceList: [],
            showModal: false,
            searchForm: {
                date: [],
                title: ""
            },
            showDatas: [],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            },
            param: [],
            commonCol: [], //公共字段
            gouyaoCol: [], //购药数据列
            menjizhenCol: [], //门急诊数据列
            binganCol: [], //病案数据列
            yizhuCol: [], //医嘱数据列
            tableH: 0,
            dataTypeList: commonJson.dataTypeList, //数据类型
            hospitalList: [], //医院
            addressList: [], //省市
            mutexList: [], //质疑规则
            mutexDataList: [], //列表
            selectList: [], //选中的信息
            model1: false, //提示框显示状态(重新清洗)
            model2: false, //提示框显示状态(确认)
            model3: false, //提示框显示状态(设置列)
            commonId: "", //存放id
            hosId: "", //医院id
            yearMonth: "", //数据年月
            currentType: "", //当前显示的数据的类型
            Operation: {}, //操作列,
            checkBoxList: [], //可选列
            indeterminate: false, //全选状态(非全选)
            checkAll: false, //全选状态（非全选）
            checkAllGroup: [], //选中的多选框
            disabledGroup: "reject", //重洗位置
            chongxiType: "", //重洗类型
            searchForm: {
                address: [],
                hospital: "",
                dataType: 10,
                beginDate: "",
                endDate: "",
                status:"1"
                // keyword: "",
                // mutex: ""
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
        //操作列
        this.Operation1 = [
            {
                type: "selection",
                width: 50,
                align: "center",
                fixed: "left",
                key: ""
            },
            {
                title: "操作",
                width: 110,
                align: "center",
                fixed: "right",
                key: "action",
                render: (h, params) => {
                    return h("div", [
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
                        //             this.model2 = true;
                        //             this.commonId = params.row.recordId; //当前行id
                        //             this.currentType = params.row.dataType;
                        //             this.hospId = params.row.hospId;
                        //             this.yearMonth = params.row.yearMonth;
                        //         }
                        //     }
                        // }),
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
        let colReject = {
            text: "互斥规则",
            name: "rules",
            width: 200,
            sortable: true,
            moveable: true
        };
        this.commonCol.push(colReject);
        //购药列
        this.gouyaoCol = [].concat(this.commonCol);
        columns.columnGouyao.forEach(item => {
            let column = {
                text: item.title,
                name: item.key,
                width: item.width,
                sortable: true,
                moveable: true
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
                width: item.width,
                sortable: true,
                moveable: true
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
                width: item.width,
                sortable: true,
                moveable: true
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
                width: item.width,
                sortable: true,
                moveable: true
            };
            this.yizhuCol.push(column);
        });
        this.yizhuCol.push(this.Operation);

        this.getHospitalList(""); //获取医院数据
        this.getAddressList(); //获取省市数据
        // this.getMutexList(); //获取质疑规则
        this.getMutexDataList(); //获取列表数据
        // this.tableH = document.getElementById("pageMain").offsetHeight - 190;
    },
    activated(){
        if (this.$route.params.id != undefined && this.$route.params.id != "") {
            this.searchForm.dataType=Number(this.$route.params.id);
        }
        
        //this.getMutexDataList(); //获取列表数据
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
        getMutexDataList(pageIndex) {
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
                        ? "mutexOutpatient.getList"
                        : self.searchForm.dataType == 30
                            ? "mutexMedical.getList"
                            : self.searchForm.dataType == 40
                                ? "mutexDoctor.getList"
                                : "mutexDrug.getList",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum, //页码
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
                    status:self.searchForm.status,
                    yearMonth: self.searchForm.yearMonth.replace("-",""), //数据类型
                    hospitalId: self.searchForm.hospital, //医院
                    dataType: self.searchForm.dataType //数据类型
                    // date: self.searchForm.date, //时间
                    // keywords: self.searchForm.keywords, //自定义
                    // mutex: self.searchForm.mutex //自定义
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.mutexDataList = data.data.dataList;
                        //判断当前数据状态和上次数据状态
                        if (self.currentType != self.searchForm.dataType) {
                            self.checkAllGroup = []; //清空多选默认选中列数组
                            self.indeterminate = false; //全选状态(非全选)
                            self.checkAll = false; //全选状态（非全选）
                            self.currentType = self.searchForm.dataType; //保存当前显示数据类型
                        }
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        self.pageConfig.pageNum = data.data.currentPageIndex;
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
        //获取质疑规则
        getMutexList() {
            var self = this;
            Vue.ajax.send({
                name: "mutexManage.mutexList",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.mutexList = data.data;
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
            this.getMutexDataList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getMutexDataList();
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
                        viewType: commonJson.mutex,
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
                            self.getMutexDataList(); //刷新列表
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
                        id: this.selectList,
                        viewType: commonJson.mutex,
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
                            self.getMutexDataList(); //刷新列表
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
                    viewType: commonJson.mutex,
                    stateType: commonJson.toclean,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth,
                    radioType: this.disabledGroup
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该信息已重新进入清洗流程。");
                        self.getMutexDataList(); //刷新列表
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
                    viewType: commonJson.mutex,
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
                        self.getMutexDataList(); //刷新列表
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
            this.model3 = true;
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
        queren(index) {
            this.model2 = true;
            this.commonId = this.showDatas[index].recordId; //当前行id
            this.currentType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
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