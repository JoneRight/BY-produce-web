<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">基础规则</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="数据类型" :label-width="60">
                    <Select v-model="searchForm.dataType" style="width: 120px;">
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="30">
                    <Input v-model="searchForm.keyword" type="text" placeholder="请输入检索的关键词..." style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="getDataList()">检索</Button>
                </FormItem>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'RulesBasiceList'" :columnConfig='dataCol' :columnDatas='dataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in dataCol" :key="colIndex" class="ellipsis">
                        <!-- {{item[colData.name]}} -->
                        <span v-if="colData.name=='date_type'">
                            {{item[colData.name]==10?"购药":item[colData.name]==20?"门急诊":item[colData.name]==30?"病案":"医嘱"}}
                        </span>
                        <span v-else-if="colData.name=='is_full_check'">
                            <Select style="width:200px" v-model="item[colData.name]" @on-change="getEditIndex(index)">
                                <Option :value="0">否</Option>
                                <Option :value="1">是</Option>
                            </Select>
                        </span>
                        <span v-else-if="colData.name=='is_mapping'">
                            <Select style="width:200px" v-model="item[colData.name]" @on-change="getEditIndex(index)">
                                <Option :value="0">否</Option>
                                <Option :value="1">是</Option>
                            </Select>
                        </span>
                        <span v-else-if="colData.name=='check_type'">
                            <Select style="width:200px" v-model="item[colData.name]" @on-change="getEditIndex(index)">
                                <Option value="no">无</Option>
                                <Option value="isTime">时间型</Option>
                                <Option value="isDate">日期型</Option>
                                <Option value="isPositive">正整数</Option>
                                <Option value="isInteger">整数型</Option>
                                <Option value="isDouble">浮点型</Option>
                            </Select>
                        </span>
                        <span v-else>
                            {{item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dataList!=null && dataList.length>0">
                    <Button v-authorize="'RulesBasiceSave'" type="primary" @click="save()" style="left: 220px;margin-top: -10px;">保存</Button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
//公用json串，不需要访问后台
import commonJson from "@/assets/data/business/common.json";
export default {
    name: "basice",
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
            param: [],
            tableH: 0,
            dataTypeList: commonJson.dataTypeList, //数据类型
            dataList: [], //原始数据列表
            backDataList: [], //修改后数据列表
            updataList: [], //存放修改的行标识
            //搜索栏
            searchForm: {
                dataType: 10
            },
            dataCol: [
                {
                    text: "数据类型",
                    name: "date_type",
                    sortable: true,
                    moveable: true,
                    width: 200,
                    render: params => {
                        if (params.date_type == 10) {
                            return "购药";
                        } else if (params.date_type == 20) {
                            return "门急诊";
                        } else if (params.date_type == 30) {
                            return "病案";
                        } else if (params.date_type == 40) {
                            return "医嘱";
                        }
                    }
                },
                {
                    text: "字段英文名称",
                    name: "columns_name",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                {
                    text: "字段中文名称",
                    name: "columns_name_cn",
                    sortable: true,
                    moveable: true,
                    width: 300
                },
                // {
                //     title: "字段显示顺序",
                //     key: "column_index",
                //     align: "center"
                // },
                {
                    text: "是否要求上报字段",
                    name: "is_full_check",
                    filterable: false,
                    removeable: false,
                    width: 300
                    // render: (h, params) => {
                    //     return h(
                    //         "Select",
                    //         {
                    //             props: {
                    //                 value: this.backDataList[params.index]
                    //                     .is_full_check
                    //             },
                    //             on: {
                    //                 input: event => {
                    //                     this.backDataList[
                    //                         params.index
                    //                     ].is_full_check = event;
                    //                     if (
                    //                         this.dataList[params.index]
                    //                             .is_full_check != event
                    //                     ) {
                    //                         // let index=this.updataList.indexOf(params.index);
                    //                         // if (index<0) {
                    //                         this.updataList.push(params.index);
                    //                         // }
                    //                     } else {
                    //                         let index = this.updataList.indexOf(
                    //                             params.index
                    //                         );
                    //                         if (index > -1) {
                    //                             this.updataList.splice(
                    //                                 index,
                    //                                 1
                    //                             );
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         },
                    //         [
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: 0
                    //                     }
                    //                 },
                    //                 "否"
                    //             ),
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: 1
                    //                     }
                    //                 },
                    //                 "是"
                    //             )
                    //         ]
                    //     );
                    // }
                },
                {
                    text: "是否需要映射字段",
                    name: "is_mapping",
                    filterable: false,
                    removeable: false,
                    width: 295
                    // render: (h, params) => {
                    //     return h(
                    //         "Select",
                    //         {
                    //             props: {
                    //                 value: this.backDataList[params.index]
                    //                     .is_mapping
                    //             },
                    //             on: {
                    //                 input: event => {
                    //                     this.backDataList[
                    //                         params.index
                    //                     ].is_mapping = event;
                    //                     if (
                    //                         this.dataList[params.index]
                    //                             .is_mapping != event
                    //                     ) {
                    //                         // let index=this.updataList.indexOf(params.index);
                    //                         // if (index<0) {
                    //                         this.updataList.push(params.index);
                    //                         // }
                    //                     } else {
                    //                         let index = this.updataList.indexOf(
                    //                             params.index
                    //                         );
                    //                         if (index > -1) {
                    //                             this.updataList.splice(
                    //                                 index,
                    //                                 1
                    //                             );
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         },
                    //         [
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: 0
                    //                     }
                    //                 },
                    //                 "否"
                    //             ),
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: 1
                    //                     }
                    //                 },
                    //                 "是"
                    //             )
                    //         ]
                    //     );
                    // }
                },
                {
                    text: "校验类型",
                    name: "check_type",
                    filterable: false,
                    removeable: false,
                    width: 290
                    // render: (h, params) => {
                    //     return h(
                    //         "Select",
                    //         {
                    //             props: {
                    //                 value: this.backDataList[params.index]
                    //                     .check_type
                    //             },
                    //             on: {
                    //                 input: event => {
                    //                     this.backDataList[
                    //                         params.index
                    //                     ].check_type = event;
                    //                     if (
                    //                         this.dataList[params.index]
                    //                             .check_type != event
                    //                     ) {
                    //                         // let index=this.updataList.indexOf(params.index);
                    //                         // if (index<0) {
                    //                         this.updataList.push(params.index);
                    //                         // }
                    //                     } else {
                    //                         let index = this.updataList.indexOf(
                    //                             params.index
                    //                         );
                    //                         if (index > -1) {
                    //                             this.updataList.splice(
                    //                                 index,
                    //                                 1
                    //                             );
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         },
                    //         [
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: "no"
                    //                     }
                    //                 },
                    //                 "无"
                    //             ),
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: "isTime"
                    //                     }
                    //                 },
                    //                 "时间型"
                    //             ),
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: "isDate"
                    //                     }
                    //                 },
                    //                 "日期型"
                    //             ),
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: "isPositive"
                    //                     }
                    //                 },
                    //                 "正整数"
                    //             ),
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: "isInteger"
                    //                     }
                    //                 },
                    //                 "整数型"
                    //             ),
                    //             h(
                    //                 "Option",
                    //                 {
                    //                     props: {
                    //                         value: "isDouble"
                    //                     }
                    //                 },
                    //                 "浮点型"
                    //             )
                    //         ]
                    //     );
                    // }
                }
            ]
        };
    },
    mounted() {
        this.getDataList(); //获取列表数据
        this.capyCol = [].concat(this.dataCol);
        // this.tableH = document.getElementById("pageMain").offsetHeight - 190;
    },
    activated(){
        this.getDataList(); //获取列表数据
    },
    methods: {
        //获取列表
        getDataList() {
            var self = this;
            Vue.ajax.send({
                name: "basice.list",
                data: {
                    pageIndex: 1, //页码
                    pageSize: 99999, //每页条数
                    date_type: self.searchForm.dataType, //数据类型
                    keyword: self.searchForm.keyword
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataList = data.data.dataList;
                        self.backDataList = self.dataList.assign();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        // //保存批量选中的信息
        // getSelectList(arr) {
        //     //批量选中的信息
        //     this.selectList = arr;
        // },
        // //上移
        // upMove(){
        //     console.log("上移")
        // },
        // //下移
        // downMove(){
        //     console.log("下移")
        // },
        selectIndex(index) {
            this.updataList.push(index);
        },
        //保存
        save() {
            let backUpdataList = [];
            this.updataList.distinct().forEach(a => {
                backUpdataList.push(this.showDatas[a]);
            });

            if (backUpdataList.length > 0) {
                var self = this;
                Vue.ajax.send({
                    name: "basice.updataBasic",
                    data: {
                        dataColumnList: backUpdataList
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success("保存成功");
                        } else {
                            self.$Modal.error({
                                title: "失败",
                                content: data.message
                            });
                        }
                    }
                });
            } else {
                this.$Message.success("保存成功");
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
            this.showColumns = showColumns;

            if (this.showColumns.length > 0) {
                this.dataCol = [];
                // 组装showCol
                this.capyCol.forEach(m => {
                    this.showColumns.forEach(n => {
                        if (m.name == n) {
                            this.dataCol.push(m);
                        }
                    });
                });
            }
        },
        getEditIndex(index){
            this.updataList.push(index);
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