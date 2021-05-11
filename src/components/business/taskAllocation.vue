<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">分配任务</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="映射类型" :label-width="60">
                    <Select v-model="searchForm.mappingType" style="width: 120px;" filterable>
                        <Option v-for="item in mappingTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" :label-width="60">
		            <Select v-model="searchForm.dataType" style="width: 120px;" clearable>
				        <Option value="10">购药</Option>
                        <Option value="20">门急诊</Option>
                        <Option value="30">病案</Option>
                        <Option value="40">医嘱</Option>
				    </Select>
		        </FormItem>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospitalName" style="width: 120px;" filterable clearable>
                        <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据年月" :label-width="60">
                    <DatePicker type="month" v-model="searchForm.yearMonth" @on-change="searchForm.yearMonth=$event" :editable="false" style="width: 120px;"></DatePicker>
                </FormItem>
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.status" style="width: 120px;" filterable clearable>
                        <Option value="0">未分配</Option>
                        <Option value="1">已分配</Option>
                    </Select>
                </FormItem>
                <FormItem label="人员名称" :label-width="60">
                   <Input v-model="searchForm.personName" type="text" placeholder="请输入人员名称" style="width: 120px;" />

                    <!-- <Select v-model="searchForm.drugTradeName" filterable  clearable remote :remote-method="getTradeList" style="width: 100px;" @on-clear="clearTrade" allow-create @on-create="handleCreate"> 
                        <Option v-for="item in tradeList" :value="item.drugTradeName" :key="item.drugTradeName">{{ item.drugTradeName }}</Option>
                    </Select> -->
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <Button v-authorize="'BusinessTaskAllAdd'" type="primary" style="float: right;" @click="task()">分配任务</Button>
            </Form>
        </div>
        
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'BusinessTaskAllList'" v-if="mapType=='drug'" optionType="business" :columnConfig='drugCol' :columnDatas='dateList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index" @click="triggerWhenClickRow(index,$event)" :class="selectList.indexOf(showDatas[index].recordId)>-1 ? 'selected-row':''">
                    <td v-for="(colData,colIndex) in drugCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='noMappingType'">{{mapTypeText}}</span>
                        <span v-else-if="colData.name=='status'">{{item[colData.name]=="0"?"待分配":"已分配"}}</span>
                        <span v-else-if="colData.render">{{colData.render(item)}}</span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['id']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else>{{item[colData.name]}}</span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessTaskAllList'" v-else-if="mapType=='diagnostic'" optionType="business" :columnConfig='diseaseCol' :columnDatas='dateList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index" @click="triggerWhenClickRow(index,$event)" :class="selectList.indexOf(showDatas[index].recordId)>-1 ? 'selected-row':''">
                    <td v-for="(colData,colIndex) in diseaseCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='noMappingType'">{{mapTypeText}}</span>
                        <span v-else-if="colData.name=='status'">{{item[colData.name]=="0"?"待分配":"已分配"}}</span>
                        <span v-else-if="colData.render">{{colData.render(item)}}</span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['id']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else>{{item[colData.name]}}</span>
                    </td>
                </tr>
            </CustomTable>
            <CustomTable v-authorize="'BusinessTaskAllList'" v-else optionType="business" :columnConfig='dataCol' :columnDatas='dateList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index" @click="triggerWhenClickRow(index,$event)" :class="selectList.indexOf(showDatas[index].recordId)>-1 ? 'selected-row':''">
                    <td v-for="(colData,colIndex) in dataCol" :key="colIndex" class="ellipsis">

                        <span v-if="colData.name=='noMappingType'">{{mapTypeText}}</span>
                        <span v-else-if="colData.name=='status'">{{item[colData.name]=="0"?"待分配":"已分配"}}</span>
                        <span v-else-if="colData.render">{{colData.render(item)}}</span>
                                <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="item['id']" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>

                        <span v-else>{{item[colData.name]}}</span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dateList!=null && dateList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox style="width:60px;" v-authorize="'BusinessTaskAllAdd'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button type="primary" class="fl" @click="deleteTask" :disabled="selectList.length==0" v-authorize="'BusinessTaskAllAdd'">删除分配</Button> 
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
export default {
    name: "allocation",
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
            capyCol: [],
            selectList: [],
            tableH: 0,
            dateList: [], //列表
            mapType: "", //映射类型
            newMapType: "", //新的映射类型
            mapTypeText: "", //映射类型
            searchForm: {
                mappingType: "",
                yearMonth: "",
                status: "",
                dataType:"10",
                hospitalName:""
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            hospitalList:[],
            dataCol: [],
            drugCol: [],
            diseaseCol: [],
            drugDataCol: [
                {
                    text: "#",
                    name: "sel",
                    width: 40,
                    filterable: false,
                    removeable: false
                },
                {
                    text: "药品通用名",
                    name: "drugGenericName",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "药品商品名",
                    name: "drugTradeName",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "药品规格",
                    name: "drugSpec",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "包装规格",
                    name: "packingQuantity",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "剂型",
                    name: "drugFormulation",
                    sortable: true,
                    moveable: true,
                    width: 80
                },
                {
                    text: "药品生产企业",
                    name: "drugManufacturers",
                    sortable: true,
                    moveable: true,
                    width: 200
                }
            ],
            diseaseDataCol: [
                {
                    text: "诊断编码",
                    name: "diseaseType",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "诊断",
                    name: "diseaseTypeName",
                    sortable: true,
                    moveable: true,
                    width: 300
                }
            ],
            checkCol:
            {
                    text: "#",
                    name: "sel",
                    width: 40,
                    filterable: false,
                    removeable: false
            },
            noMappingDataCol: 
            {
                text: "未映射数据",
                name: "noMapping",
                sortable: true,
                moveable: true,
                width: 400
            },
            baseDataCol: [
                {
                    text: '医院',
                    name: 'hospName',
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: '数据类型',
                    name: 'dataType',
                    width: 100,
                    sortable: true,
                    moveable: true,
                    render: (params) => {
                        if(params.dataType==10){
                            return "购药";
                        }else if(params.dataType==20){
                            return "门急诊";
                        }else if(params.dataType==30){
                            return "病案";
                        }else if(params.dataType==40){
                            return "医嘱";
                        }
                    }
                },
                {
                    text: "映射类型",
                    name: "noMappingType",
                    sortable: true,
                    moveable: true,
                    width: 110,
                    render: params => {
                        return this.mapTypeText;
                    }
                },
                {
                    text: "数据年月",
                    name: "yearMonth",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "状态",
                    name: "status",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    render: params => {
                        if (params.status == "0") {
                            return "待分配";
                        } else {
                            return "已分配";
                        }
                    }
                },
                {
                    text: "人员",
                    name: "userName",
                    sortable: true,
                    moveable: true,
                    width: 140
                }
            ],
            mappingTypeList: [],
            baseMappingTypeList: [
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
                    label: "手术编码"
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
            ] //映射类型
        };
    },
    mounted() {
        // this.getSelectList(); //筛选条件
        // this.getDateList(); //获取列表数据
        this.dataCol = [].concat(this.checkCol);
        this.dataCol.concat(this.noMappingDataCol);
        this.dataCol.push.apply(this.dataCol, this.baseDataCol);
        this.drugCol = [].concat(this.drugDataCol);
        this.drugCol.push.apply(this.drugCol, this.baseDataCol);
        this.diseaseCol = [].concat(this.diseaseDataCol);
        this.diseaseCol.push.apply(this.diseaseCol, this.baseDataCol);
    },
    activated(){
        // this.getSelectList(); //筛选条件
        if (this.searchForm.mappingType=="") {
            this.getSelectList(); //筛选条件
        }else{
            this.getDateList();
        }
        this.getHospitalList(""); //获取医院数据
    },
    methods: {
        //获取医院
        getHospitalList(value) {
            var self = this;
            Vue.ajax.send({
                name: "common.hospitalList",
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
        getSelectList() {
            var self = this;
            Vue.ajax.send({
                name: "allocation.select",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.mappingTypeList = [];
                        data.data.forEach(m => {
                            self.baseMappingTypeList.forEach(n => {
                                if (m == n.value) {
                                    self.mappingTypeList.push(n);
                                }
                            });
                        });
                        self.searchForm.mappingType =
                            self.mappingTypeList[0].value;

                        //查询列表数据
                        self.getDateList();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取列表
        getDateList(pageIndex) {
            var self = this;
            //判断映射类型是否修改
            // if (self.newMapType != self.searchForm.mappingType) {
            //     self.pageConfig.pageNum = 1;
            // }
            Vue.ajax.send({
                name: "allocation.list",
                data: {
                    pageIndex: pageIndex||self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    mappingType: self.searchForm.mappingType,
                    status: self.searchForm.status,
                    yearMonth: self.searchForm.yearMonth, //数据时间
                    dataType:self.searchForm.dataType,
                    hospId:self.searchForm.hospitalName,
                    userName:self.searchForm.personName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.selectList=[];
                        self.dateList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
//                         self.pageConfig.pageNum = data.data.currentPageIndex;

                        self.mapType = self.searchForm.mappingType;
                        self.mappingTypeList.forEach(m => {
                            if (self.mapType == m.value) {
                                self.mapTypeText = m.label;
                                self.newMapType = m.value;
                                return;
                            }
                        });
                        //判断是否是药品
                        if (self.searchForm.mappingType == "drug") {
                            self.capyCol = [].concat(self.drugCol);
                        } else if (
                            self.searchForm.mappingType == "diagnostic"
                        ) {
                            self.capyCol = [].concat(self.diseaseCol);
                        } else {
                            self.capyCol = [].concat(self.dataCol);
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
        //分配任务
        task() {
            var hospName="";
            var self=this;

            if(this.searchForm.hospitalName){
                this.hospitalList.forEach(item=>{
                    if(item.value==self.searchForm.hospitalName){
                        hospName=item.label
                    }
                })
            }
            this.$router.push({
                path: "/business/taskAllocationAdd",
                query: {
                    mapType: this.mapType,
                    mapTypeText: this.mapTypeText,
                    dataType:this.searchForm.dataType,
                    yearMonth:this.searchForm.yearMonth,
                    hospId:this.searchForm.hospitalName,
                    mappingId:this.selectList,
                    hospName:hospName
                }
            });
        },
        //单选
        clickMe(index) {
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(this.dateList[index].id);
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.dateList[index].id);
            }
        },
         //全选、非全选
        allClickMe(value) {
            if (value == 1) {
                this.selectList = this.showDatas.map(a => a["id"]);
            } else {
                this.selectList = [];
            }
        },
        deleteTask(){
            console.log(this.selectList)
            var self = this;
            Vue.ajax.send({
                name: "allocation.delete",
                data: {mappingId:this.selectList},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.selectList = [];
                        self.$Message.success("删除成功");

                        //查询列表数据
                        self.getDateList();
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
       // 点击行时触发,视同点击了clickbox
        triggerWhenClickRow(rowIndex,event){
            this.clickMe(rowIndex);
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

            if (this.showColumns!=null) {
                if (this.mapType == "drug") {
                    this.drugCol=[];
                    this.capyCol.forEach(m=>{
                        this.showColumns.forEach(n=>{
                            if (m.name==n) {
                                this.drugCol.push(m);
                            }
                        })
                    })
                } else if (this.mapType == "diagnostic") {
                    this.diseaseCol=[];
                    this.capyCol.forEach(m=>{
                        this.showColumns.forEach(n=>{
                            if (m.name==n) {
                                this.diseaseCol.push(m);
                            }
                        })
                    })
                } else {
                    this.dataCol=[];
                    this.capyCol.forEach(m=>{
                        this.showColumns.forEach(n=>{
                            if (m.name==n) {
                                this.dataCol.push(m);
                            }
                        })
                    })
                }
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
  left: 220px;
  top: 8px;
}
.page-footer button.fl {
  position: absolute;
  left: 280px;
  top: 3px;
}
.page-footer button.fr {
  position: absolute;
  right: 40px;
  top: 3px;
}
.page-footer button {
    position: absolute;
    right: 40px;
    top: 3px;
}
.page-footer .text-center {
    position: relative;
    display: block;
    width: 100%;
}
</style>