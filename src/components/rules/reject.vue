<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">剔除规则</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="级别" :label-width="40">
                    <Select v-model="searchForm.grade" style="width: 120px;" clearable>
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
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
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.state" style="width: 120px;" clearable>
                        <Option v-for="item in ruleStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="规则" :label-width="40">
                    <Input v-model="searchForm.keyword" type="text" placeholder="请输入检索的关键词..." style="width: 260px;" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="changePage(1)">检索</Button>
                </FormItem>
                <Button v-authorize="'RulesRejectAdd'" type="primary" @click="addData()" style="float:right">+ 新增</Button>
            </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'RulesRejectList'" :columnConfig='dataCol' :columnDatas='dataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in dataCol" :key="colIndex" class="ellipsis">
                        <!-- {{item[colData.name]}} -->
                        <span v-if="colData.name=='op'">
                            <Button v-authorize="'RulesRejectAudit'" v-if="item['state']==1" icon="md-checkmark-circle" size="small" title="通过" type="success" @click='ruleTongguo(index)'></Button>
                            <Button v-authorize="'RulesRejectAudit'" v-if="item['state']==1" icon="md-close-circle" size="small" title="驳回" type="error" @click='ruleBohui(index)'></Button>
                            <Button v-authorize="'RulesRejectDisable'" v-if="item['state']==2" icon="md-remove" size="small" title="停用" type="error" @click='ruleTingyong(index)'></Button>
                            <Button v-authorize="'RulesRejectEnable'" v-if="item['state']==0" icon="md-play" size="small" title="启用" type="success" @click='ruleQiyong(index)'></Button>
                            <Button v-authorize="'RulesRejectEdit'" icon="md-create" size="small" title="编辑" type="primary" @click='ruleBianji(index)'></Button>
                            <Button v-authorize="'RulesRejectDel'" icon="md-close" size="small" title="删除" type="error" @click="ruleShanchu(index)"></Button>
                        </span>
                        <CheckboxGroup v-else-if="colData.name=='sel'" v-model="selectList" style="height:100%;">
                            <Checkbox size='small' :key="index" :value="JSON.stringify(item['checkOutId'])" @change="clickMe(index)"></Checkbox>
                        </CheckboxGroup>
                        <span v-else-if="colData.name=='rule_type'">
                            {{item[colData.name]==0?"通用":"非通用"}}
                        </span>
                        <span v-else-if="colData.name=='isAffirm'">
                            {{item[colData.name]==0?"是":"否"}}
                        </span>
                        <span v-else-if="colData.name=='date_type'">
                            <span v-for="(busDataType,busIndex) in item[colData.name].split(',')">
                                <span v-if="busIndex==item[colData.name].split(',').length-1">{{busDataType==10?"购药":busDataType==20?"门急诊":busDataType==30?"病案":"医嘱"}}</span>
                                <span v-else>{{busDataType==10?"购药":busDataType==20?"门急诊":busDataType==30?"病案":"医嘱"}}，</span>
                            </span>
                        </span>
                        <span v-else-if="colData.name=='state'">
                            {{item[colData.name]==0?"停用":item[colData.name]==1?"待审核":item[colData.name]==2?"通过":"驳回"}}
                        </span>
                        <!-- <pre v-else>{{item[colData.name]}}</pre> -->
                        <pre v-else style="margin:2px;font-family:微软雅黑;">{{item[colData.name]}}</pre>
                        
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dataList!=null && dataList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <template v-if="oldStatus=='1'">
                        <Button v-authorize="'RulesRejectAudit'" type="primary" @click="yesAuditBatch()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">通过</Button>
                        <Button v-authorize="'RulesRejectAudit'" type="primary" @click="NoAuditBatch()" :disabled="selectList.length==0" class="inputCheck" style="left: 335px;margin-top: -10px;">驳回</Button>
                    </template>
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

        <Modal v-model="delRule" title="删除" width=420 @on-ok="delRuleYes">
            您确定要删除该规则吗？
        </Modal>
        <Modal v-model="qiYong" title="启用" width=420 @on-ok="updateState(2)">
            您确定要启用该规则吗？
        </Modal>
        <Modal v-model="tongGuo" title="通过" width=420 @on-ok="auditSingle(2)">
            您确定要通过该规则吗？
        </Modal>
        <Modal v-model="buTongGuo" title="不通过" width=500 @on-ok="auditSingle(3)">
            <Form>
                <FormItem label="不通过原因" :label-width="80">
                    <Select v-model="searchForm.nopassReason" class="cellLength" filterable>
                        <Option v-for="item in nopassReasonList" :value="item.label" :key="item.label">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" :label-width="80">
                    <Input v-model="searchForm.nopassRemark" type="textarea" class="cellLength" :rows="3" :maxlength="100" />
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="tingYong" title="停用" width=420 @on-ok="updateState(0)">
            您确定要停用该规则吗？
        </Modal>
        <Modal v-model="tongGuoBatch" title="批量审核通过" width=420 @on-ok="auditBatch(2)">
            您确定要批量审核通过选中的规则吗？
        </Modal>
        <Modal v-model="buTongGuoBatch" title="批量审核驳回" width=420 @on-ok="auditBatch(3)">
            请选择不通过原因：
            <Select v-model="searchForm.nopassReason" class="cellLength" filterable>
                <Option v-for="item in nopassReasonList" :value="item.label" :key="item.label">{{ item.label }}</Option>
            </Select>
        </Modal>

    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
//公用json串，不需要访问后台
import commonJson from "@/assets/data/business/common.json";
import "../../assets/css/business/dataerror.css";
export default {
    name: "rejectRules",
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
            oldStatus: "",
            tableH: 0,
            dataTypeList: commonJson.dataTypeList, //数据类型
            ruleStateList: commonJson.ruleStateList, //数据类型
            gradeList: commonJson.gradeList, //级别
            hospitalList: [], //医院
            nopassReasonList: [], //不通过原因
            selectList: [],
            dataList: [], //列表
            delRule: false, //提示框显示状态（删除）
            qiYong: false, //提示框显示状态（启用）
            tongGuo: false, //提示框显示状态（通过）
            buTongGuo: false, //提示框显示状态（不通过）
            tingYong: false, //提示框显示状态（停用）
            buTongGuoBatch: false,
            tongGuoBatch: false,
            commonId: "", //存放id
            //搜索栏
            searchForm: {
                grade: "",
                hospital: "",
                dataType: "",
                keyword: "",
                state:1,
                nopassReason: "",
                nopassRemark: ""
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
                    text: "级别",
                    name: "rule_type",
                    sortable: true,
                    moveable: true,
                    width: 80,
                    render: params => {
                        if (params.rule_type == 0) {
                            return "通用";
                        } else {
                            return "非通用";
                        }
                    }
                },
                {
                    text: "名称",
                    name: "check_out_name",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "医院",
                    name: "hosp_name",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "数据类型",
                    name: "date_type",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    render: params => {
                        let texts = "";
                        params.date_type.split(",").forEach(m => {
                            if (m == 10) {
                                texts += "购药";
                            } else if (m == 20) {
                                texts += "门急诊";
                            } else if (m == 30) {
                                texts += "病案";
                            } else if (m == 40) {
                                texts += "医嘱";
                            }
                            texts += "，";
                        });
                        texts = texts.substring(0, texts.length - 1);
                        return texts;
                    }
                },
                {
                    text: "剔除规则",
                    name: "code_rule",
                    sortable: true,
                    moveable: true,
                    width: 200
                },
                {
                    text: "状态",
                    name: "state",
                    sortable: true,
                    moveable: true,
                    width: 80,
                    render: params => {
                        if (params.state == 0) {
                            return "停用";
                        } else if (params.state == 1) {
                            return "待审核";
                        } else if (params.state == 2) {
                            return "通过";
                        } else if (params.state == 3) {
                            return "不通过";
                        }
                    }
                },
                {
                    text: "是否自动确认",
                    name: "isAffirm",
                    sortable: true,
                    moveable: true,
                    width: 120,
                    render: params => {
                        if (params.isAffirm == 0) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                },
                {
                    text: "创建人",
                    name: "create_user",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "创建时间",
                    name: "create_time",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "修改人",
                    name: "change_user",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "修改时间",
                    name: "change_time",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "审核人",
                    name: "check_user",
                    sortable: true,
                    moveable: true,
                    width: 100
                },
                {
                    text: "审核时间",
                    name: "check_time",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "备注",
                    name: "remark",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "驳回原因",
                    name: "noPass",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "驳回原因备注",
                    name: "noPassRemarks",
                    sortable: true,
                    moveable: true,
                    width: 160
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 170
                }
            ]
        };
    },
    mounted() {
        // this.getDataList(); //获取列表数据
        this.getHospitalList(); //获取医院数据
        this.getauditList(); //获取审核不通过原因
        this.capyCol = [].concat(this.dataCol);
    },
    activated(){
        this.getDataList();
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
        //获取列表
        getDataList(pageIndex) {
            var self = this;
            Vue.ajax.send({
                name: "rejectRules.list",
                data: {
                    pageIndex: pageIndex || self.pageConfig.pageNum, //页码
                    pageSize: self.pageConfig.pageSize, //每页条数
                    rule_type: self.searchForm.grade, //级别
                    hospId: self.searchForm.hospital, //医院
                    state:self.searchForm.state,
                    date_type: self.searchForm.dataType, //数据类型
                    keyword: self.searchForm.keyword //规则
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                        // self.pageConfig.pageNum = data.data.currentPageIndex;
                    
                        self.oldStatus=self.searchForm.state
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取审核不通过原因
        getauditList() {
            var self = this;
            Vue.ajax.send({
                name: "common.getDictionary",
                data: {
                    optionType:"rulereject"
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.nopassReasonList = data.data;
                        self.searchForm.nopassReason =
                            self.nopassReasonList[0].label;
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
        getHospitalList() {
            var self = this;
            Vue.ajax.send({
                name: "common.hospitalList",
                data: {},
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
            this.getDataList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getDataList();
        },
        //新增
        addData() {
            // this.addRule = true;
            this.$router.push({
                path: "/rules/rejectRulesAdd",
                query: {
                    operationType: "add" //操作类型
                }
            });
        },
        //编辑
        editData(mappedId) {
            this.$router.push({
                path: "/rules/rejectRulesAdd",
                query: {
                    mappedId: mappedId, //编辑信息id
                    operationType: "update" //操作类型
                }
            });
        },
        //审核
        auditData(mappedId) {
            this.$router.push({
                path: "/rules/rejectRulesAdd",
                query: {
                    mappedId: mappedId, //编辑信息id
                    operationType: "audit" //操作类型
                }
            });
        },
        //修改状态
        updateState(state) {
            var self = this;
            Vue.ajax.send({
                name: "rejectRules.updataState",
                data: {
                    checkOutId: self.commonId,
                    state: state
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.getDataList();
                        self.$Message.success("操作成功。");
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //删除规则确认操作
        delRuleYes() {
            var self = this;
            Vue.ajax.send({
                name: "rejectRules.delRule",
                data: {
                    checkOutId: self.commonId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("删除规则成功。");
                        //清除信息
                        self.getDataList();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //保存批量选中的信息
        getSelectList(arr) {
            //批量选中的信息
            this.selectList = arr;
        },
        //审核
        auditSingle(state) {
            let idsList = [this.commonId];
            this.updateAudit(idsList, state);
        },
        yesAuditBatch() {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量审核的数据！</h5>"
                });
            } else {
                this.tongGuoBatch = true;
            }
        },
        NoAuditBatch() {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量审核的数据！</h5>"
                });
            } else {
                this.buTongGuoBatch = true;
            }
        },
        auditBatch(state) {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量审核的数据！</h5>"
                });
            } else {
                let idsList = []; //选中数据的id标识
                //遍历选中的数据获取选中数据的id数组
                this.selectList.forEach(element => {
                    idsList.push(element.checkOutId);
                });
                this.updateAudit(this.selectList, state);
            }
        },
        updateAudit(idsList, state) {
            var self = this;
            Vue.ajax.send({
                name: "rejectRules.updateAudit",
                data: {
                    idsList: idsList,
                    state: state,
                    nopassReason: self.searchForm.nopassReason,
                    nopassRemark: self.searchForm.nopassRemark
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("审核成功。");
                        //清除信息
                        self.getDataList();
                        self.selectList=[];
                        self.searchForm.nopassReason =
                            self.nopassReasonList[0].label;
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
            var dataIndex = this.selectList.indexOf(
                this.dataList[index].checkOutId+""
            );
            //存在就删除，不存在就添加
            if (dataIndex > -1) {
                this.selectList.splice(dataIndex, 1);
            } else {
                this.selectList.push(this.dataList[index].checkOutId);
            }
        },
        //全选、非全选
        allClickMe(value){
            if(value==1){
                this.selectList=this.showDatas.map(a=>JSON.stringify(a['checkOutId']));
            }
            else{
                this.selectList=[];
            }
        },
        ruleTongguo(index) {
            this.commonId = this.showDatas[index].checkOutId;
            this.auditSingle(2);
        },
        ruleBohui(index) {
            this.buTongGuo = true;
            this.commonId = this.showDatas[index].checkOutId;
        },
        ruleTingyong(index) {
            this.tingYong = true;
            this.commonId = this.showDatas[index].checkOutId;
        },
        ruleQiyong(index) {
            this.qiYong = true;
            this.commonId = this.showDatas[index].checkOutId;
        },
        ruleBianji(index) {
            this.editData(this.showDatas[index].checkOutId);
        },
        ruleShanchu(index) {
            this.delRule = true;
            this.commonId = this.showDatas[index].checkOutId; //当前行id
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
pre{
    font-size: 12px; 
    font-family: "微软雅黑";
}
</style>