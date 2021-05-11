<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">药品辅助信息</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="类型" :label-width="60">
                    <Select v-model="searchForm.drugType" style="width: 120px;">
                        <Option v-for="item in drugTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="是否" :label-width="40">
                    <Select v-model="searchForm.isYes" style="width: 120px;" clearable>
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="通用名" :label-width="60">
                    <Input v-model="searchForm.genName" type="text" placeholder="请输入通用名" style="width: 200px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="getDateList()">检索</Button>
                </FormItem>
                <Button type="primary" @click="addData()" style="float:right">导入</Button>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'BusinessTaskAllList'" optionType="business" :columnConfig='drugDataCol' :columnDatas='dateList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in drugDataCol" :key="colIndex" class="ellipsis">
                        <span>{{item[colData.name]}}</span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dateList!=null && dateList.length>0">
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                </div>

            </div>
        </div>

        <Modal v-model="model1"  title="导入" width=540 @on-cancel="cancle1" :mask-closable="false">
            <Form :model="importExcelForm" ref="addExcel" inline :rules="excelRuleValidate">
                <FormItem label="请选择类型：" :label-width="90">
                    <RadioGroup v-model="importExcelForm.ExcelType" style="width:500px;display:inline-block">
                        <span v-for="item in drugTypeList" :key="item.value">
                            <Radio :label="item.value">{{item.label}}</Radio>
                        </span>
                    </RadioGroup>
                </FormItem>
                <FormItem label="请选择文件：" :label-width="90" prop="ExcelFile">
                    <Upload :before-upload="importExcel" action="" accept="text/csv,.csv,text/csv-schema,application/vnd.ms-excel" :format="['csv','xls','xlsx']" :max-size="10240" style="width:400px;float:left;margin-left:5px;">
                        <Input readonly v-model="importExcelForm.excelName" style="width: 200px" />
                        <Button style="background-color:#00a0e9;color:#ffffff">导入excel</Button>
                        <br/>
                        <span v-if="ifSpan" style="color:red">请上传文件</span>
                    </Upload>
                    <Button style="float: right;margin-top: -40px;" type="primary" @click="exportData()">导出模板</Button>
                </FormItem>

            </Form>
           
            <div slot="footer">
                <Button type="text" size="large"     @click="cancle1">取消</Button>
                <Button type="primary" size="large"     @click="cleanYes1">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../../../common/EmptyRow";
import CustomTable from "../../../common/GridTable";
import excel from "../../../../utils/excel.js";
export default {
    name: "drugType",
    components: { EmptyRow, CustomTable },
    data() {
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
            dateList: [], //列表
            searchForm: {
                drugType: "OTCDRUG",
                genName: "",
                isYes: ""
            },
            importExcelForm: {
                ExcelType: "OTCDRUG",
                excelName: ""
            },
            capDrugType: "",
            model1: false,
            ifSpan: false,
            capDrugDataCol: [],
            excelInfor: [], //导入excel的数据内容
            backExcel:[],
            drugTypeList: [
                {
                    value: "OTCDRUG",
                    label: "OTC药品"
                },
                {
                    value: "RURAL",
                    label: "医保用药"
                },
                {
                    value: "NARCOTIZE",
                    label: "麻醉药物"
                },
                {
                    value: "VIRULENCE",
                    label: "毒性药物"
                },
                {
                    value: "RADIOACTIVITY",
                    label: "放射性药物"
                },
                {
                    value: "LACTATINGCAUTION",
                    label: "妊娠期妇女禁用药物"
                },
                {
                    value: "ESSENTIAL",
                    label: "基本药品"
                },
                {
                    value: "NATIONALFORMULARY",
                    label: "国家处方集药品"
                },
                {
                    value: "SPECIAL",
                    label: "特殊药品"
                },
                {
                    value: "RENALDISEASECARE",
                    label: "肾病患者慎用药"
                },
                {
                    value: "COMMUNITY",
                    label: "社区用药"
                },
                {
                    value: "DYSFUNCTIONCARE",
                    label: "肝功能不全慎用药"
                },
                {
                    value: "SPIRITDRUG",
                    label: "精神药品"
                }
            ],
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            excelRuleValidate: {
                ExcelFile: [{ validator: validateData, trigger: "blur" }]
            },
            drugDataCol: [],
            drugDataOneCol: [
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "药品通用名",
                    name: "genName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "是否",
                    name: "isYes",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "开始时间",
                    name: "beginDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "结束时间",
                    name: "endDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                }
            ],
            drugDataTwoCol: [
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "药品通用名",
                    name: "genName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "药品剂型",
                    name: "fromName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "是否",
                    name: "isYes",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "开始时间",
                    name: "beginDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "结束时间",
                    name: "endDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                }
            ],
            drugDataThreeCol: [
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "药品通用名",
                    name: "genName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "药品剂型",
                    name: "fromName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "药品规格",
                    name: "specName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "是否",
                    name: "isYes",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "开始时间",
                    name: "beginDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "结束时间",
                    name: "endDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                }
            ],
            drugDataFourCol: [
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "药品通用名",
                    name: "genName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "OTC类别",
                    name: "otc_CLASSY",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "OTC发布批",
                    name: "otc_PUBLISH_SLAP",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "是否",
                    name: "isYes",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "开始时间",
                    name: "beginDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "结束时间",
                    name: "endDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                }
            ],
            drugDataFiveCol: [
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "药品通用名",
                    name: "genName",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "对妊娠的危险性等级",
                    name: "risk_PREGNANCY_GRADE",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "是否",
                    name: "isYes",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "开始时间",
                    name: "beginDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "结束时间",
                    name: "endDate",
                    sortable: true,
                    moveable: true,
                    width: 200
                }
            ]
        };
    },
    mounted() {
        this.getDateList(); //筛选条件
        this.drugDataCol = [].concat(this.drugDataFourCol);
    },
    methods: {
        //获取列表
        getDateList() {
            var self = this;
            Vue.ajax.send({
                name: "drugType.list",
                data: {
                    pageIndex: self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    drugType: self.searchForm.drugType,
                    genName: self.searchForm.genName,
                    isYes: self.searchForm.isYes
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dateList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        self.pageConfig.pageNum = data.data.currentPageIndex;

                        if (self.searchForm.drugType == "RURAL") {
                            self.drugDataCol = [].concat(self.drugDataTwoCol);
                        } else if (self.searchForm.drugType == "ESSENTIAL") {
                            self.drugDataCol = [].concat(self.drugDataThreeCol);
                        } else if (self.searchForm.drugType == "OTCDRUG") {
                            self.drugDataCol = [].concat(self.drugDataFourCol);
                        } else if (self.searchForm.drugType == "LACTATINGCAUTION") {
                            self.drugDataCol = [].concat(self.drugDataFiveCol);
                        } else {
                            self.drugDataCol = [].concat(self.drugDataOneCol);
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
        addData() {
            this.model1 = true;
        },
        cancle1(){
            var self = this;
            self.model1=false;
            this.$refs["addExcel"].resetFields();
             
        },
        cleanYes1() {
            this.$refs["addExcel"].validate(valid => {
                if (valid&&this.isOk(this.excelInfor)) {
                    var self = this;
                    self.model1=false;
                    Vue.ajax.send({
                        name: "drugType.importExcel",
                        data: {
                            mapType: self.importExcelForm.ExcelType,
                            excelList: self.backExcel
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
                                self.importExcelForm.excelName="";
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
        isOk(data){
            var reg = /^[0-9]*$/;
            let errorMessage="";
            this.backExcel=[];
            try {
                if (this.importExcelForm.ExcelType=="OTCDRUG") {
                for (let n = 1; n < data.length; n++) {
                    // if (!reg.test(data[n][2].value||!reg.test(data[n][3].value))) {
                    //     errorMessage+="第"+n+"行、";
                    // }
                    if (data[n][2].value.trim().length>0&&!reg.test(data[n][2].value)) {
                        errorMessage+="第"+n+"行OTC类型、";
                    }
                    if (data[n][3].value.trim().length>0&&!reg.test(data[n][3].value)) {
                        errorMessage+="第"+n+"行OTC发布批、";
                    }
                    if (data[n][4].value=="是") {
                        this.backExcel.push(data[n])
                    }
                }
            }else if (this.importExcelForm.ExcelType=="LACTATINGCAUTION") {
                for (let n = 1; n < data.length; n++) {
                    if (!reg.test(data[n][2].value)) {
                        errorMessage+="第"+n+"行、";
                    }
                    if (data[n][3].value=="是") {
                        this.backExcel.push(data[n])
                    }
                }
            }else if (this.importExcelForm.ExcelType=="RURAL") {
                for (let n = 1; n < data.length; n++) {
                    if (data[n][3].value=="是") {
                        this.backExcel.push(data[n])
                    }
                }
            }else if (this.importExcelForm.ExcelType=="ESSENTIAL") {
                for (let n = 1; n < data.length; n++) {
                    if (data[n][4].value=="是") {
                        this.backExcel.push(data[n])
                    }
                }
            }else {
                for (let n = 1; n < data.length; n++) {
                    if (data[n][2].value=="是") {
                        this.backExcel.push(data[n])
                    }
                }
            }
            } catch (error) {
                 this.$Modal.warning({
                    title: "文件内容不正确",
                    content: "请根据模板填写正确的信息！"
                });
                this.importExcelForm.excelName="";
                return false;
            }
            
            if (errorMessage.length>1) {
                this.$Modal.warning({
                    title: "文件内容类型不正确",
                    content: "上传文件中 <b>"+errorMessage.substring(0,errorMessage.length-1)+"</b> 类型不正确。请修改为数字型后重新上传。"
                });
                this.importExcelForm.excelName="";
                return false;
            }
            return true;
        },
        //导入excel
        importExcel(file) {
            this.importExcelForm.excelName = file.name;
            var self = this;
            self.excelInfor = [];
            excel.ReadCSV(file).then(
                function(data) {
                    self.excelInfor = data;
                },
                function(err) {}
            );

            return false;
        },
        exportData1(){
            var self = this;
            Vue.ajax.send({
                name: "drugType.list",
                data: {
                    pageIndex:1, //页码
                    pageSize: 9999999, //每页条数
                    drugType: self.importExcelForm.ExcelType
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        let jsonData=data.data.dataList;
                        //列标题，逗号隔开，每一个逗号就是隔开一个单元格
                        let str = `姓名,电话,邮箱\n`;
                        //增加\t为了不让表格显示科学计数法或者其他格式
                        for(let i = 0 ; i < jsonData.length ; i++ ){
                            for(let item in jsonData[i]){
                                str+=`${jsonData[i][item] + '\t'},`;     
                            }
                            str+='\n';
                        }
      
                        var aaaa = "data:text/csv;charset=utf-8,\ufeff" + str;
                        var link = document.createElement("a");
                        link.setAttribute("href", aaaa);
                        var date = new Date();
                        // var filename = date.pattern("yyyy-MM-dd HH:mm:ss");
                        var filename="哈哈"
                        link.setAttribute("download", filename + ".csv");
                        link.click();
                        
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        exportData(){
            var self = this;
            Vue.ajax.send({
                name: "drugType.excellist",
                data: {
                    mapType: self.importExcelForm.ExcelType
                },
                success: function(data) {
                    var a=document.createElement("a");
                    a.href=Vue.config.apiPrefix+"/download?fileName="+data.fileName+"&filePath=drugtype\//"+data.fileName+"&token="+ Vue.getData("token");
                    a.click();
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