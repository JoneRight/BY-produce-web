<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">文件查重</h2>
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
                    <Select v-model="searchForm.dataType" style="width: 120px;" clearable>
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
            <CustomTable v-authorize="'BusinessDuplicateList'" :columnConfig='duplicateCol' :columnDatas='duplicateList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in duplicateCol" :key="colIndex" class="ellipsis">
                        <!-- {{item[colData.name]}} -->
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessDuplicateYes'" icon="ios-redo" size="small" title="跳过" type="success" @click='tiaoguo(index)'></Button>
                            <Button v-authorize="'BusinessDuplicateOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                            <Button v-authorize="'BusinessDuplicateDel'" icon="md-trash" size="small" title="废弃" type="error" @click="deleteInfor(index)"></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                          <Checkbox size='small' :key="index" :value="item['id']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='dataType'">
                            {{item[colData.name]==10?"购药":item[colData.name]==20?"门急诊":item[colData.name]==30?"病案":"医嘱"}}
                        </span>
                        <span v-else-if="colData.name=='repeatType'">
                            {{item[colData.name]==0?"文件内重复":"文件间重复"}}
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="duplicateList!=null && duplicateList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox v-authorize="'BusinessDuplicateList'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button v-authorize="'BusinessDuplicateOper'" type="primary" @click="batchOperation()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>

            </div>

        </div>

        <Modal v-model="visable" title="废弃" width=420 @on-ok="discardYes">
            <!-- 您确定要废弃该文件吗？ -->
            <Form :model="modalForm" ref="formInline" inline>
                <FormItem label="废弃原因" :label-width="80">
                    <Select v-model="modalForm.discard" style="width: 260px;">
                        <Option v-for="item in discardList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="model1" title="重新清洗" width=420 @on-ok="cleanYes1">
            请选择重洗清洗开始的位置：</br>
            <RadioGroup v-model="disabledGroup">
                <Radio label="initial">文件初检</Radio>
                <Radio label="repeat">文件查重</Radio>
            </RadioGroup>
        </Modal>
        <Modal v-model="model2" title="跳过" width=420 @on-ok="skipYes">
            您确定要将该文件跳过查重过程吗？
        </Modal>
    </div>
</template>

<style>
</style>


<script>
import Vue from "vue";
import commonJson from "@/assets/data/business/common.json";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
export default {
    name: "duplicateCheck",
    components:{EmptyRow,CustomTable,CheckboxGroup,Checkbox},
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
            tableH: 0,
            searchForm: {
                address: [],
                hospital: "",
                dataType: 10,
                yearMonth:"",
                // repeatType: "",
                beginDate: "",
                endDate: ""
                // keywords: ""
            },
            modalForm: {
                discard: ""
            },
            duplicateList: [], //列表数据
            hospitalList: [], //医院
            addressList: [], //省市
            dataTypeList: commonJson.dataTypeList, //数据类型
            discardList: [], //废弃原因
            selectList: [], //选中的信息
            visable: false, //提示框显示状态(废弃)
            model1: false, //提示框显示状态(重新清洗)
            model2: false, //提示框显示状态(跳过)
            commonId: "", //存放id
            dataType: "", //存放数据类型
            hosId: "", //医院id
            yearMonth: "", //数据年月
            disabledGroup: "initial", //重洗位置
            chongxiType: "", //重洗类型
            pageConfig: {
                pageIndex: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            duplicateCol: [
                {
                    text: "#",
                    name: "sel",
                    width: 40,
                    filterable: false,
                    removeable: false
                },
                {
                    text: "医院编号",
                    name: "hospitalNum",
                    sortable: true,
                    moveable: true,
                    width: 100
                    // width: 100
                },
                {
                    text: "医院",
                    name: "hospitalName",
                    sortable: true,
                    moveable: true,
                    width: 200
                    // width: 200
                },
                {
                    text: "省份",
                    name: "province",
                    sortable: true,
                    moveable: true,
                    width: 120
                    // width: 120
                },
                {
                    text: "城市",
                    name: "city",
                    sortable: true,
                    moveable: true,
                    width: 120
                    // width: 120
                },
                {
                    text: "数据类型",
                    name: "dataType",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: params => {
                        if (params.dataType == 10) {
                            return "购药";
                        } else if (params.dataType == 20) {
                            return "门急诊";
                        } else if (params.dataType == 30) {
                            return "病案";
                        } else {
                            return "医嘱";
                        }
                    }
                },
                {
                    text: "所属文件",
                    name: "fileName",
                    sortable: true,
                    moveable: true,
                    width: 300
                    // width: 240
                },
                {
                    text: "数据年月",
                    name: "fileDate",
                    sortable: true,
                    moveable: true,
                    width: 100
                    // width: 120
                },
                {
                    text: "重复年月",
                    name: "repeatYearMonth",
                    sortable: true,
                    moveable: true,
                    width: 100
                    // width: 240
                },
                {
                    text: "重复率",
                    name: "repeatRate",
                    sortable: true,
                    moveable: true,
                    width: 100
                    // width: 80
                },
                {
                    text: "重复类型",
                    name: "repeatType",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: params => {
                        if (params.repeatType == 0) {
                            return "文件内重复";
                        } else {
                            return "文件间重复";
                        }
                    }
                },
                {
                    text: "时间",
                    name: "dateTime",
                    sortable: true,
                    moveable: true,
                    width: 100
                    // width: 120
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 135
                }
            ]
        };
    },
    mounted: function() {
        this.getHospitalList(""); //获取医院数据
        this.getAddressList(); //获取省市数据
        this.capyCol = [].concat(this.duplicateCol);
        this.getDuplicateList(); //获取列表数据
    },
    activated(){
        if (this.$route.params.id != undefined && this.$route.params.id != "") {
            this.searchForm.dataType=Number(this.$route.params.id);
        }
        
        //this.getDuplicateList(); //获取列表数据
    },
    watch:{
        showDatas:{
            handler(newValue,oldValue){
                if (newValue.length != oldValue.length) {
                    this.selectList=[];
                }
            },
            deep:true
        }
    },
    methods: {
        //根据省市获取医院
        getHosp(value) {
            this.getHospitalList(value);
        },
        //获取列表数据
        getDuplicateList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "duplicate.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageIndex, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    provinceId:
                        self.searchForm.address.length > 0
                            ? self.searchForm.address[0]
                            : null, //省
                    cityId:
                        self.searchForm.address.length == 2
                            ? self.searchForm.address[1]
                            : null, //市
                    hospitalId: self.searchForm.hospital, //医院
                    dataType: self.searchForm.dataType, //数据类型
                    yearMonth: self.searchForm.yearMonth.replace("-",""), //数据类型
                    // state: self.searchForm.repeatType, //重复类型
                    beginDate: self.searchForm.beginDate, //开始时间
                    endDate: self.searchForm.endDate //结束时间
                    // keywords: self.searchForm.keywords //自定义
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.duplicateList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        // self.pageConfig.pageIndex = data.data.currentPageIndex;
                        self.dataType = self.searchForm.dataType;
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
        //获取废弃原因
        getDiscardList() {
            var self = this;
            Vue.ajax.send({
                name: "duplicate.discardList",
                data: { dataType: this.dataType },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.discardList = data.data;
                        self.modalForm.discard = data.data[0]; //默认选中第一条
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
            this.pageConfig.pageIndex = currentPage;
            this.getDuplicateList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDuplicateList();
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
                    selectIdList.push(element.id);
                });
                Vue.ajax.send({
                    name: "errorInfor.updateState",
                    data: {
                        // id: selectIdList,
                        id:this.selectList,
                        viewType: commonJson.duplicateCheck,
                        stateType: commonJson.toclean,
                        dataType: this.dataType,
                        hospId: this.hospId,
                        yearMonth: this.yearMonth,
                        radioType: this.disabledGroup
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success(
                                "选中的文件已重新进入清洗流程。"
                            );
                            self.getDuplicateList(); //刷新列表
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
        //废弃确认操作
        discardYes() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "errorInfor.updateState",
                data: {
                    id: selectIdList,
                    cancelReason: self.modalForm.discard,
                    viewType: commonJson.duplicateCheck,
                    stateType: commonJson.discard,
                    dataType: this.dataType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该文件已废弃。");
                        self.getDuplicateList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
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
                    viewType: commonJson.duplicateCheck,
                    stateType: commonJson.toclean,
                    dataType: this.dataType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth,
                    radioType: this.disabledGroup
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该文件已重新进入清洗流程。");
                        self.getDuplicateList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //批量跳过
        batchSkip() {
            var self = this;
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量跳过的数据！</h5>"
                });
            } else {
                let selectIdList = []; //选中数据的id标识
                this.selectList.forEach(element => {
                    selectIdList.push(element.id);
                });
                Vue.ajax.send({
                    name: "errorInfor.updateState",
                    data: {
                        id: selectIdList,
                        viewType: commonJson.duplicateCheck,
                        stateType: commonJson.skip,
                        dataType: this.dataType,
                        hospId: this.hospId,
                        yearMonth: this.yearMonth
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success("选中的信息已跳过该过程。");
                            self.getDuplicateList(); //刷新列表
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
        //跳过操作
        skipYes() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "errorInfor.updateState",
                data: {
                    id: selectIdList,
                    viewType: commonJson.duplicateCheck,
                    stateType: commonJson.skip,
                    dataType: this.dataType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该信息已跳过该过程。");
                        self.getDuplicateList(); //刷新列表
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
                this.duplicateCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op" && n != "sel") {
                            this.duplicateCol.push(m);
                        }
                    });
                });
                this.duplicateCol.unshift(this.capyCol[0]);
                this.duplicateCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        //单选
        clickMe(index) {
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(
                this.showDatas[index].id
            );
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
                // this.param.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.showDatas[index].id);
            }
        },
        //全选、非全选
        allClickMe(value){
            if(value==1){
                this.selectList=this.showDatas.map(a=>a['id']);
            }
            else{
                this.selectList=[];
            }
        },
        tiaoguo(index) {
            this.model2 = true;
            this.commonId = this.showDatas[index].id; //当前行id
            this.dataType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
        },
        chongxi(index) {
            this.model1 = true;
            this.commonId = this.showDatas[index].id; //当前行id
            this.dataType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
            this.chongxiType = "";
        },
        deleteInfor(index) {
            this.visable = true;
            this.commonId = this.showDatas[index].id; //当前行id
            this.dataType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
            this.getDiscardList(); //获取废弃原因
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
  width:43px;
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