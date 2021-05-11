<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">重新清洗</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="医院" :label-width="40">
                    <Select v-model="searchForm.hospital" style="width: 120px;" filterable clearable>
                        <Option v-for="item in queryhospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据类型" :label-width="60">
                    <Select v-model="searchForm.dataType" style="width: 120px;" clearable>
                        <Option v-for="item in dataTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="getDataList()">检索</Button>
                </FormItem>
                <Button v-authorize="'BusinessRedoAdd'" type="primary" @click="addData()" style="float:right">新增</Button>
            </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'BusinessRedoList'" :columnConfig='dataCol' :columnDatas='dataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in dataCol" :key="colIndex" class="ellipsis">
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'BusinessRedoOper'" icon="md-refresh" size="small" title="再次重新清洗" type="primary" @click='chongxi(index)'></Button>
                            <Button v-authorize="'BusinessRedoDel'" v-if="item['status']==2" icon="md-close" size="small" title="删除" type="error" @click="deleteInfor(index)"></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                          <Checkbox size='small' :key="index" :value="JSON.stringify(item['id'])" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='dataType'">
                            {{item[colData.name]==10?"购药":item[colData.name]==20?"门急诊":item[colData.name]==30?"病案":"医嘱"}}
                        </span>
                        <span v-else-if="colData.name=='taskType'">
                            {{item[colData.name]==0?"自动生成":"自定义SQL"}}
                        </span>
                        <span v-else-if="colData.name=='status'">
                            {{item[colData.name]==1?"待执行":item[colData.nam]==2?"执行":"完成"}}
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
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox v-authorize="'BusinessRedoList'" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button v-authorize="'BusinessRedoOper'" type="primary" @click="batchOperation()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>

            </div>

        </div>

        <Modal v-model="model1" title="重新清洗" width=420 @on-ok="cleanYes">
            您确定要重新清洗吗？
        </Modal>
        <Modal v-model="model2" title="删除" width=420 @on-ok="deleteYes">
            您确定要删除该规则吗？
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
import commonJson from "@/assets/data/business/common.json";

export default {
    name: "headerMapping",
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
            searchForm: {
                hospital: "",
                dataType: "",
                state:"",
            },
            param: [],
            tableH: 0,
            model1: false, //删除
            model2: false, //删除
            dataTypeList: commonJson.dataTypeList, //数据类型
            queryhospitalList:[],
            commonId: "", //id
            dataList: [], //列表
            selectList: [], //选中的信息
            hosId: "", //医院id
            yearMonth: "", //数据年月
            currentType: "", //当前显示的数据的类型
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
                    text: "数据类型",
                    name: "dataType",
                    width: 100,
                    sortable: true,
                    moveable: true,
                    render: (params) => {
                        if (params.dataType==10) {
                            return "购药";
                        }else if (params.dataType==20) {
                            return "门急诊";
                        }else if (params.dataType==30) {
                            return "病案";
                        }else{
                            return "医嘱";
                        }
                    }
                },
                {
                    text: "数据年月",
                    name: "yearMonth",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "医院",
                    name: "hospName",
                    width: 200,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "构建任务",
                    name: "taskContent",
                    width: 490,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "任务类型",
                    name: "taskType",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: (params) => {
                        if (params.taskType==0) {
                            return "自动生成"
                        } else {
                            return "自定义SQL"
                        }
                    }
                },
                {
                    text: "提交人",
                    name: "createUser",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "提交时间",
                    name: "createTime",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "状态",
                    name: "status",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: (params) => {
                        if (params.status==1) {
                            return "待执行"
                        }else if (params.status==2) {
                            return "执行"
                        }else{
                            return "完成"
                        }
                    }
                },
                {
                    text: "执行时间",
                    name: "startTime",
                    sortable: true,
                    moveable: true,
                    width: 100
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
        this.getDataList(); //获取列表数据
        this.capyCol = [].concat(this.dataCol);
        this.getQueryHospitalList();
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
        //获取列表
        getDataList() {
            var self = this;
            Vue.ajax.send({
                name: "redoManager.list",
                data: {
                    hospitalId:self.searchForm.hospital,
                    dataType:self.searchForm.dataType,
                    pageIndex: self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize //每页条数
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataList = data.data.dataList;
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
        //获取医院
        getQueryHospitalList() {
            var self = this;
            Vue.ajax.send({
                name: "common.hospitalList",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.queryhospitalList = data.data;
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
            this.getDataList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDataList();
        },
        //保存批量选中的信息
        getSelectList(arr) {
            //批量选中的信息
            this.selectList = arr;
        },
        //新增
        addData() {
            // this.addRule = true;
            this.$router.push({
                path: "/business/redoAdd"
            });
        },
        //批量重洗
        batchOperation() {
            var self = this;
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要再次重新清洗的数据！</h5>"
                });
            } else {
                let selectIdList = []; //选中数据的id标识
                //遍历选中的数据获取选中数据的id数组
                this.selectList.forEach(element => {
                    selectIdList.push(element.id);
                });
                Vue.ajax.send({
                    name: "redoManager.updateState",
                    data: {
                        // id: selectIdList,
                        id: self.selectList,
                        dataType: this.currentType,
                        hospId: this.hospId,
                        yearMonth: this.yearMonth
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$Message.success("已进入再次重洗清洗等待状态");
                            self.getDataList(); //刷新列表
                            // self.selectList = ""; //清空选中的数据
                            self.param="";
                            self.selectList=[];
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
        //重洗
        cleanYes() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "redoManager.updateState",
                data: {
                    id: selectIdList,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("已进入再次重洗清洗等待状态");
                        self.getDataList(); //刷新列表
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //删除
        deleteYes() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "redoManager.deleteRedo",
                data: {
                    id: selectIdList,
                    dataType: this.currentType,
                    hospId: this.hospId,
                    yearMonth: this.yearMonth
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("删除成功");
                        self.getDataList(); //刷新列表
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
        //单选
        clickMe(index) {
            //判断数据id是否存在
            var dataIndex = this.selectList.indexOf(this.showDatas[index].id+"");
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.showDatas[index].id);
            }
        },
        //全选、非全选
        allClickMe(value){
            if(value==1){
                this.selectList=this.showDatas.map(a=>JSON.stringify(a['id']));
            }
            else{
                this.selectList=[];
            }
        },
        chongxi(index) {
            this.model1 = true;
            this.commonId = this.showDatas[index].id; //当前行id
            this.currentType = this.showDatas[index].dataType;
            this.hospId = this.showDatas[index].hospId;
            this.yearMonth = this.showDatas[index].yearMonth;
            this.chongxiType = "";
        },
        deleteInfor(index) {
            this.model2 = true;
            this.commonId = this.showDatas[index].id; //当前行id
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