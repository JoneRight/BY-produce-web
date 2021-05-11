<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">文件表头</h2>
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
                <FormItem label="是否已创建规则" :label-width="100">
                    <Select v-model="searchForm.isAddRule" style="width:120px" clearable>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
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
            <CustomTable v-authorize="'BusinessHeaderList'" :columnConfig='initialCol' :columnDatas='initialList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
               <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in initialCol" :key="colIndex" class="ellipsis">
                        <!-- {{item[colData.name]}} -->
                        <span v-if="colData.name=='op'">
                            <Button icon="md-eye" size="small" title="错误详情" type="success" @click='errorDe(item)'></Button>
                            <Button v-authorize="'BusinessHeaderAdd'" icon="md-add" size="small" title="创建规则" type="primary" @click='ruleAdd(index)'></Button>
                            <Button v-authorize="'BusinessHeaderOper'" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                            <Button v-authorize="'BusinessHeaderDel'" icon="md-trash" size="small" title="废弃" type="error" @click="deleteInfor(index)"></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['id']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='dataType'">
                            {{item[colData.name]==10?"购药":item[colData.name]==20?"门急诊":item[colData.name]==30?"病案":"医嘱"}}
                        </span>
                        <span v-else-if="colData.name=='isAddRule'">
                            {{item[colData.name]==0?"否":"是"}}
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="initialList!=null && initialList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox v-authorize="'BusinessHeaderList'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="selectAll"></Checkbox>
                    <Button v-authorize="'BusinessHeaderOper'" type="primary" @click="batchOperation()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
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
                    <Select v-model="modalForm.discard" style="width: 260px;" filterable clearable>
                        <Option v-for="item in discardList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                 <FormItem label="备注" :label-width="80">
                      <Input v-model="modalForm.remark" :maxlength="500" type="textarea" style="width: 260px;" :autosize="{minRows: 4,maxRows: 8}" />
                    <!-- <Input v-model="modalForm.remark" :maxlength="500"  type="text" style="width: 260px;" /> -->
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
        <Modal v-model="errorModel" :title="errorTitle" width=500 @on-ok="errorModel=false">
            <!-- <ul v-for="(message,index) in errorMessage" :key="index">{{message}}</ul> -->
            {{errorMessage}}
        </Modal>

    </div>
</template>

<script>
import Vue from "vue";
//公用json串，不需要访问后台
import commonJson from "@/assets/data/business/common.json";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
export default {
    name: "initialCheck",
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
            tableH: 0,
            dataTypeList: commonJson.dataTypeList, //数据类型
            addressList: [], //省市
            hospitalList: [], //医院
            selectList: [], //选中的信息
            discardList: [], //废弃原因
            initialList: [], //列表
            visable: false, //提示框显示状态(废弃)
            model1: false, //提示框显示状态(重新清洗)
            errorModel: false,
            errorTitle: "",
            errorMessage: "",
            commonId: "", //存放id
            dataType: "", //存放数据类型
            hosId: "", //医院id
            yearMonth: "", //数据年月
            disabledGroup: "initial", //重洗位置
            chongxiType: "", //重洗类型
            searchForm: {
                address: [],
                hospital: "",
                dataType: 10,
                yearMonth:"",
                isAddRule:"",
                beginDate: "",
                endDate: ""
            },
            modalForm: {
                discard: "",
                remark: ""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            initialCol: [
                //列
                {
                    text: "#",
                    name: "sel",
                    width: 40,
                    filterable: false,
                    removeable: false
                },
                {
                    text: "文件编号",
                    name: "id",
                    sortable: true,
                    moveable: true,
                    width: 100
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
                    width: 100
                    // width: 120
                },
                {
                    text: "城市",
                    name: "city",
                    sortable: true,
                    moveable: true,
                    width: 100
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
                    width: 400
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
                    text: "未映射表头",
                    name: "unmatchHead",
                    sortable: true,
                    moveable: true,
                    width: 200
                    // width: 120
                },
                {
                    text: "已映射表头",
                    name: "matchedHead",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "是否已创建规则",
                    name: "isAddRule",
                    sortable: true,
                    moveable: true,
                    width: 140,
                    render: params => {
                        if (params.isAddRule == 0) {
                            return "否";
                        } else {
                            return "是";
                        }
                    }
                },
                {
                    text: "时间",
                    name: "dateTime",
                    sortable: true,
                    moveable: true,
                    width: 150
                    // width: 120
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 165
                }
            ]
        };
    },
    mounted() {
        this.getHospitalList(""); //获取医院数据
        this.getAddressList(); //获取省市数据
        this.getInitialList(); //获取列表数据
        this.capyCol = [].concat(this.initialCol);
    },
    activated(){
        if (this.$route.params.id != undefined && this.$route.params.id != "") {
            this.searchForm.dataType=Number(this.$route.params.id);
        }
        
        //this.getInitialList();
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
        //获取列表
        getInitialList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "initial.list",
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
                    hospitalId: self.searchForm.hospital, //医院
                    dataType: self.searchForm.dataType, //数据类型
                    yearMonth: self.searchForm.yearMonth.replace("-",""), //数据类型
                    viewType: "header", //页面
                    isAddRule:self.searchForm.isAddRule,
                    beginDate: self.searchForm.beginDate, //开始时间
                    endDate: self.searchForm.endDate //结束时间
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.initialList = data.data.dataList;
                        self.initialList.map(x=>{
                            if(x.fileName){
                                x.fileName=Vue.config.filePathPrefix+"error\\"+x.fileName.replaceAll('/','\\')
                            }
                            return x;
                        })
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        // self.pageConfig.pageNum = data.data.currentPageIndex;
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
            this.pageConfig.pageNum = currentPage;
            this.getInitialList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getInitialList();
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
                        id: this.selectList,
                        viewType: commonJson.initialSurvey,
                        stateType: commonJson.toclean,
                        dataType: this.dataType,
                        hospId: this.hospId,
                        yearMonth: this.yearMonth,
                        radioType: this.disabledGroup
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success(
                                "选中的文件已重新进入清洗流程"
                            );
                            self.getInitialList(); //刷新列表
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
                    viewType: commonJson.initialSurvey,
                    stateType: commonJson.discard,
                    dataType: this.dataType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth,
                    remark:self.modalForm.remark,
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该文件已废弃。");
                        self.getInitialList(); //刷新列表
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
                    viewType: commonJson.initialSurvey,
                    stateType: commonJson.toclean,
                    dataType: this.dataType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth,
                    radioType: this.disabledGroup
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("该文件已重新进入清洗流程。");
                        self.getInitialList(); //刷新列表
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
                this.initialCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n && n != "op" && n != "sel") {
                            this.initialCol.push(m);
                        }
                    });
                });
                this.initialCol.unshift(this.capyCol[0]);
                this.initialCol.push(this.capyCol[this.capyCol.length - 1]);
            }
        },
        //单选
        clickMe(index) {
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(this.initialList[index].id);
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.initialList[index].id);
            }
        },
        selectAll:function(value){
            if(value==1){
                this.selecList=this.showDatas.map(a=>a.id);
            }
            else{
                this.selecList=[];
            }
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
        },
        errorDe(params) {
            this.errorModel = true;
            this.errorTitle = params.lables;
            this.errorMessage = params.unmatchHead;
        },
        ruleAdd(index) {
            this.$router.push({
                path: "/business/headerRules",
                query: {
                    hospId: this.showDatas[index].hospId,
                    hospName: this.showDatas[index].hospitalName,
                    dataType: this.showDatas[index].dataType,
                    unmatchHead: this.showDatas[index].unmatchHead,
                    fileNo: this.showDatas[index].id
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
</style>