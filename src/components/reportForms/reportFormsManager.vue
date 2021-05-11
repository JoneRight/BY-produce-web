<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">报表管理</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="报表类型" :label-width="60">
                    <Select v-model="searchForm.reportType" @on-change="IsShow" style="width: 250px;">
                        <Option v-for="item in reportTypeList"  :value="item.value" :key="item.value">{{ item.key }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="labelText" :label-width="60">
                    <DatePicker type="month" v-model="searchForm.yearMonth" @on-change="searchForm.yearMonth=$event" style="width: 120px;" ></DatePicker>
                </FormItem>
                <FormItem v-if="IsTime" label="时间" :label-width="40">
                    <DatePicker type="date" v-model="searchForm.beginDate" @on-change="searchForm.beginDate=$event" style="width: 120px;" ></DatePicker> —
                    <DatePicker type="date" v-model="searchForm.endDate" @on-change="searchForm.endDate=$event" style="width: 120px;" ></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <!-- <FormItem style="float:right">
                    <Button type="primary" @click="ReportTypeManager()">报表类型管理</Button>
                </FormItem> -->
                <Button v-authorize="'ReportFormsManageExcel'" type="primary" style="float: right;" @click="exportData()">导出报表</Button>
            </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'ReportFormsManageList'" optionType="business" :columnConfig='showCol' :columnDatas='dataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in showCol" :key="colIndex" class="ellipsis">
                        <span>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dataList!=null && dataList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -30px;right: 40px;position: absolute;">
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
export default {
    name: "reportFormsManager",
    components: { EmptyRow, CustomTable },
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
            tableH: 0,
            reportTypeList: [], //报表类型
            dataList: [], //列表
            exportDataList: [], //导出信息
            fileReportType: "", //导出文件名称
            // fileBeginDate: "", //导出文件名称
            // fileEndDate: "", //导出文件名称
            fileYearMonth: "", //导出文件名称
            labelText: "数据年月",
            IsTime: true,
            searchForm: {
                reportType: "",
                yearMonth:"",
                beginDate:"",
                endDate:""
                // yearMonth:
                //     new Date().getFullYear() +
                //     "-" +
                //     (new Date().getMonth() + 1),
                // beginDate:
                //     new Date().getFullYear() +
                //     "-" +
                //     (new Date().getMonth() + 1) +
                //     "-1",
                // endDate:
                //     new Date().getFullYear() +
                //     "-" +
                //     (new Date().getMonth() + 1) +
                //     "-" +
                //     new Date(
                //         new Date().getFullYear(),
                //         new Date().getMonth() + 1,
                //         0
                //     ).getDate(),
                // ppp:
                //     new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            commonCol: [],
            capyCol: [],
            showCol: [] //显示列
        };
    },
    mounted() {
        this.getReportType(); //获取报表类型
        // this.getDataList(); //获取列表数据
    },
    methods: {
        //获取列表数据
        getDataList(pageIndex) {
            var self = this;
            self.capyCol = [];
            Vue.ajax.send({
                name: "reportForms.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    reportLogType: self.searchForm.reportType, //报表类型
                    yearMonth: self.searchForm.yearMonth, //数据年月
                    starDate: self.searchForm.beginDate, //开始时间
                    stopDate: self.searchForm.endDate //结束时间
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.showCol = [];
                        data.data.thHeaderList.forEach(item => {
                            let column = {
                                text: item.title,
                                name: item.key,
                                sortable: true,
                                moveable: true,
                                // width: item.title.length * 10 + 60
                                width:
                                    item.title == "省份"
                                        ? 150
                                        : (item.title == "医院名称" || item.title.indexOf("时间")>-1)
                                            ? 200
                                            : item.title.length * 10 + 65
                            };
                            self.showCol.push(column);
                        });
                        self.capyCol = [].concat(self.showCol);
                        
                        //self.IsShow(self.searchForm.reportType);

                        self.dataList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        // self.pageConfig.pageNum = data.data.currentPageIndex;

                        //保存查询数据的条件
                        self.fileReportType = self.searchForm.reportType;
                        self.fileYearMonth = self.searchForm.yearMonth;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取报表类型
        getReportType() {
            var self = this;
            Vue.ajax.send({
                name: "reportForms.getReportType",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.reportTypeList = data.data;
                        self.searchForm.reportType =
                            self.reportTypeList[0].value;
                        self.getDataList(); //获取列表数据

                        //self.IsShow(self.searchForm.reportType);
                        
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        IsShow(stype){

            if (stype=="type0") {
                this.labelText="数据年月";
                this.IsTime=true;
            }else if (stype=="type1") {
                this.labelText="数据年月";
                this.IsTime=true;
            }else if (stype=="type2") {
                this.labelText="数据年月";
                this.IsTime=true;
            }else if (stype=="type3") {
                this.labelText="数据年月";
                this.IsTime=true;
            }else if (stype=="type4") {
                this.labelText="数据年月";
                this.IsTime=true;
            }else if (stype=="type5") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type6") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type7") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type8") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type9") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type10") {
                this.labelText="数据年月";
                this.IsTime=true;
            }else if (stype=="type11") {
                this.labelText="数据年月";
                this.IsTime=true;
            }else if (stype=="type12") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type13") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type14") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type15") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type16") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type20") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type21") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type22") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type23") {
                this.labelText="工作年月";
                this.IsTime=true;
            }else if (stype=="type24") {
                this.labelText="工作年月";
                this.IsTime=true;
            }
        },
        //报表类型管理
        ReportTypeManager() {
            this.$router.push({
                path: "/reportForms/reportTypeManager"
            });
        },
        exportData(){
            var fileName = this.getLabel(this.fileReportType);
            if (this.fileYearMonth != "") {
                fileName += " " + this.formartDate(this.fileYearMonth);
            }
            var self = this;
            Vue.ajax.send({
                name: "reportForms.excel",
                data: {
                    pageIndex: 1, //页码
                    pageSize: self.pageConfig.totalItemCount, //每页条数
                    reportLogType: self.searchForm.reportType, //报表类型
                    yearMonth: self.searchForm.yearMonth, //数据年月
                    starDate: self.searchForm.beginDate, //开始时间
                    stopDate: self.searchForm.endDate, //结束时间
                    fileName: fileName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        var a=document.createElement("a");
                        a.href=Vue.config.apiPrefix+"/download?fileName="+data.message+"&filePath=report\//"+data.message;
                        a.click();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //导出
        exportData1() {
            var fileName = this.getLabel(this.fileReportType);
            if (this.fileYearMonth != "") {
                fileName += " " + this.formartDate(this.fileYearMonth);
            }
            //查询所有数据
            var self = this;
            Vue.ajax.send({
                name: "reportForms.list",
                data: {
                    pageIndex: 1, //页码
                    pageSize: 3000, //每页条数
                    reportLogType: self.fileReportType, //报表类型
                    yearMonth: self.fileYearMonth //时间
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        let jsonData=data.data.dataList;
                        //列标题，逗号隔开，每一个逗号就是隔开一个单元格
                        let titleName=[];
                        let str = '';
                        for (let i = 0; i < self.showCol.length; i++) {
                            str += self.showCol[i].text + ','
                            titleName.push(self.showCol[i].name);
                        }
                        str+='\n';
                        
                        //增加\t为了不让表格显示科学计数法或者其他格式
                        for(let i = 0 ; i < jsonData.length ; i++ ){
                            for (let ii = 0; ii < titleName.length; ii++) {
                                let tname=titleName[ii];
                                if (jsonData[i][tname]==null) 
                                    str += " ,";
                                else
                                    str += `${jsonData[i][tname] + '\t'},`;
                            }
                            str+='\n';
                        }
                        //encodeURIComponent解决中文乱码
                        // let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
                        // //通过创建a标签实现
                        // var link = document.createElement("a");
                        // link.href = uri;
                        // //对下载的文件命名
                        // link.download =  fileName + ".csv";
                        // document.body.appendChild(link);
                        // link.click();
                        // document.body.removeChild(link);

                        var aaaa = "data:text/csv;charset=utf-8,\ufeff" + str;
                        var link = document.createElement("a");
                        link.setAttribute("href", aaaa);
                        link.setAttribute("download", fileName + ".csv");
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

            if (this.showColumns != null && this.capyCol != null) {
                this.showCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n) {
                            this.showCol.push(m);
                        }
                    });
                });
            }
        },
        //根据value获取label
        getLabel(value) {
            var label = "";
            this.reportTypeList.forEach(m => {
                if (m.value == value) {
                    label = m.key;
                }
            });
            return label;
        },
        //时间戳转字符串
        formartDate(param) {
            let date = new Date(param);
            let Y = date.getFullYear() + "-";
            let M =
                date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1;
            return Y + M;
        },
        //切页
        changePage(currentPage) {
            this.pageConfig.pageNum = currentPage;
            this.getDataList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDataList();
        }
    }
};
</script>
