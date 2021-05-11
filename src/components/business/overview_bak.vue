<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">清洗总览</h2>
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
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.status" style="width: 120px;" clearable>
                        <Option value="1">待清洗</Option>
                        <Option value="2">正在清洗</Option>
                        <Option value="3">清洗完成</Option>
                        <Option value="4">待入库</Option>
                        <Option value="5">已入库</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'BusinessOverviewList'" :columnConfig='dataCol' :columnDatas='dateList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in dataCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessOverviewOper'" v-if="item['fileStated']==3||item['fileStated']==5" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                            <Button v-authorize="'BusinessOverviewIn'" v-if="item['fileStated']==3" icon="md-checkmark" size="small" title="入库" type="success" @click="deleteInfor(index)"></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                          <Checkbox size='small' :key="index" :value="item['fileNo']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='dataType'">
                            {{item[colData.name]==10?"购药":item[colData.name]==20?"门急诊":item[colData.name]==30?"病案":"医嘱"}}
                        </span>
                        <span v-else-if="colData.name=='fileStated'">
                            {{item['fileStated']==1?"待清洗":item['fileStated']==2?"正在清洗":item['fileStated']==3?"清洗完成":item['fileStated']==4?"待入库":"已入库"}}
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dateList!=null && dateList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox v-authorize="'BusinessOverviewList'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button v-authorize="'BusinessOverviewOper'" v-if="oldStatus=='3'" type="primary" @click="batchOperation()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

        <Modal v-model="model1" title="重新清洗" width=420 @on-ok="cleanYes">
            您确定要将该信息重新清洗吗？
        </Modal>
        <Modal v-model="model2" title="入库" width=420 @on-ok="putIn">
            您确定要将该信息入库吗？
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";
//公用json串，不需要访问后台
import commonJson from "@/assets/data/business/common.json";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
export default {
    name: "overview",
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
            dataTypeList: commonJson.dataTypeList, //数据类型
            addressList: [], //省市
            hospitalList: [], //医院
            dateList: [], //列表
            oldStatus: "1",
            model1: false, //提示框显示状态(重新清洗)
            model2: false, //提示框显示状态(入库)
            selectList: [], //选中的信息
            searchForm: {
                address: [],
                hospital: "",
                dataType: null,
                yearMonth: "",
                status: ""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
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
                    text: "医院编号",
                    name: "hospitalNum",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "医院名称",
                    name: "hospitalName",
                    align: "center",
                    width: 200,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "省",
                    name: "province",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "市",
                    name: "city",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "数据类型",
                    name: "dataType",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                    // ,
                    // render: params => {
                    //     if (params.dataType == 10) {
                    //         return "购药";
                    //     } else if (params.dataType == 20) {
                    //         return "门急诊";
                    //     } else if (params.dataType == 30) {
                    //         return "病案";
                    //     } else {
                    //         return "医嘱";
                    //     }
                    // }
                },
                {
                    text: "数据年月",
                    name: "yearMonth",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "文件记录总数",
                    name: "totalCount",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "完成数",
                    name: "finishCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "剔除数",
                    name: "rejectCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "校验数",
                    name: "checkCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "映射数",
                    name: "mappingCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "质疑数",
                    name: "queryCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "互斥数",
                    name: "mutexCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "单位换算数",
                    name: "unitsCount",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "文件状态",
                    name: "fileStated",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true
                    // ,
                    // render: params => {
                    //     if (params.fileStated == 1) {
                    //         return "待清洗";
                    //     } else if (params.fileStated == 2) {
                    //         return "正在清洗";
                    //     } else if (params.fileStated == 3) {
                    //         return "清洗完成";
                    //     } else if (params.fileStated == 4) {
                    //         return "待入库";
                    //     } else if (params.fileStated == 5) {
                    //         return "已入库";
                    //     }
                    // }
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 100
                }
            ]
        };
    },
    mounted() {
        this.getHospitalList(""); //获取医院数据
        this.getAddressList(); //获取省市数据
        this.capyCol = [].concat(this.dataCol);
    },
    activated(){
        this.getDateList(); //获取列表数据
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
        //获取列表
        getDateList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "overview.list",
                data: {
                    pageIndex: pageIndex ||self.pageConfig.pageNum, //页码
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
                    status: self.searchForm.status,
                    yearMonth: self.searchForm.yearMonth //数据时间
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dateList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        // self.pageConfig.pageNum = data.data.currentPageIndex;

                        self.oldStatus = self.searchForm.status;
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
            this.getDateList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDateList();
        },
        //批量入库
        batchPutIn() {
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
                    selectIdList.push(element.fileNo);
                });
                this.putInYes(selectIdList);
            }
        },
        //入库
        putIn() {
            let selectIdList = [this.commonId];
            this.putInYes(selectIdList);
        },
        putInYes(selectIdList) {
            var self = this;
            Vue.ajax.send({
                name: "overview.putIn",
                data: {
                    fileNo: selectIdList,
                    currentType: self.currentType,
                    hospId: self.hospId,
                    yearMonth: self.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("选中的信息已入库。");
                        self.getDateList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //重新清洗确认操作
        cleanYes() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "overview.updateState",
                data: {
                    fileNo: selectIdList,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("选中的信息已重新进入清洗流程。");
                        self.getDateList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //批量重洗
        batchOperation() {
            var self = this;
            Vue.ajax.send({
                name: "overview.updateState",
                data: {
                    // fileNo: selectIdList,
                    fileNo: this.selectList,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success(
                            "选中的信息已重新进入清洗流程。"
                        );
                        self.getDateList(); //刷新列表
                        self.selectList = []; //清空选中的数据
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
        chongxi(index) {
            this.model1 = true;
            this.commonId = this.showDatas[index].fileNo; //当前行id
            this.currentType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
        },
        deleteInfor(index) {
            this.model2 = true;
            this.commonId = this.showDatas[index].fileNo; //当前行id
            this.currentType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
        },
        //单选
        clickMe(index) {
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(
                this.showDatas[index].fileNo
            );
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.showDatas[index].fileNo);
            }
        },
        //全选、非全选
        allClickMe(value) {
            if(value==1){
                this.selectList=this.showDatas.map(a=>a['fileNo']);
            }
            else{
                this.selectList=[];
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