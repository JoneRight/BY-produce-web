<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">清洗监控</h2>
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
                <FormItem v-if="false" label="状态" :label-width="40">
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
                            <Button v-authorize="'fileuploadcancel'"  v-if="item['overallStatus']==2||item['overallStatus']==3||item['overallStatus']==4||item['overallStatus']==6||item['overallStatus']==7||item['overallStatus']==9"class='btn-red' icon="md-trash" size="small" title="废弃" type="error" @click='confirmCancel(item)'></Button>
                            <Button v-authorize="'BusinessOverviewOper'" v-if="item['overallStatus']==6||item['overallStatus']==7||item['overallStatus']==9||item['overallStatus']==12" icon="md-refresh" size="small" title="重新清洗" type="primary" @click='chongxi(index)'></Button>
                            <Button v-authorize="'BusinessOverviewIn'" v-if="item['overallStatus']==7" icon="md-checkmark" size="small" title="入业务库" type="success" @click="deleteInfor(index)"></Button>
                            <Button v-authorize="'BusinessOverviewIn'" v-if="item['overallStatus']==9" icon="md-checkmark-circle-outline" size="small" title="入产品库" type="success" @click="chanpin(index)"></Button>
                        </span>
                        <div :title="item[colData.name] == '1' ? '部分表头未映射': '通过'" v-else-if="colData.name=='fileHeader'" style="margin-left: 25px;" :class="['progress-status', item[colData.name] == '1' ? 'status-error': 'status-success']"></div>
                        <div :title="item[colData.name] == '1' ? '初检未通过': '通过'" v-else-if="colData.name=='fileCheck'" style="margin-left: 25px;" :class="['progress-status', item[colData.name] == '1' ? 'status-error': 'status-success']"></div>
                        <div :title="item[colData.name] == '1' ? '文件重复': '通过'" v-else-if="colData.name=='fileRepeat'" style="margin-left: 25px;" :class="['progress-status', item[colData.name] == '1' ? 'status-error': 'status-success']"></div>
                        <div :title="item['rejectUnverifyCount'] > 0 ? '剔除总共'+item[colData.name]+'条，未确认'+item['rejectUnverifyCount']+'条':item['fileStated'] == -1 ?'未开始': '已完成'" v-else-if="colData.name=='rejectCount'">
                            <div :class="['progress-status',item['rejectUnverifyCount'] > 0 ? 'status-warn':item['fileStated'] == -1 ?'status-default': 'status-success']"></div>
                            <span style="">{{item['rejectUnverifyCount']}}/{{item[colData.name]}}</span>
                        </div>
                        <div :title="parseInt(item[colData.name]) > 0 ? '校验未处理'+item[colData.name]+'条':item['fileStated'] == -1 ?'未开始': '已完成'" v-else-if="colData.name=='checkCount'">
                            <div :class="['progress-status',parseInt(item[colData.name]) > 0 ? 'status-error':item['fileStated'] == -1 ?'status-default': 'status-success']"></div>
                            <span style="">{{item[colData.name]}}</span>
                        </div>
                        <div :title="parseInt(item[colData.name]) > 0 ? '映射未处理'+item[colData.name]+'条':item['fileStated'] == -1 ?'未开始': '已完成'" v-else-if="colData.name=='mappingCount'">
                            <div :class="['progress-status',parseInt(item[colData.name]) > 0 ? 'status-error':item['fileStated'] == -1 ?'status-default': 'status-success']"></div>
                            <span style="">{{item[colData.name]}}</span>
                        </div>
                        <div :title="item['queryUnverifyCount'] > 0 ? '质疑总共'+item[colData.name]+'条，未确认'+item['queryUnverifyCount']+'条':item['fileStated'] == -1 ?'未开始': '已完成'" v-else-if="colData.name=='queryCount'">
                            <div :class="['progress-status',item['queryUnverifyCount'] > 0 ? 'status-warn':item['fileStated'] == -1 ?'status-default': 'status-success']"></div>
                            <span style="">{{item['queryUnverifyCount']}}/{{item[colData.name]}}</span>
                        </div>
                        <div :title="item['mutexUnverifyCount'] > 0 ? '互斥总共'+item[colData.name]+'条，未确认'+item['mutexUnverifyCount']+'条':item['fileStated'] == -1 ?'未开始': '已完成'" v-else-if="colData.name=='mutexCount'">
                            <div :class="['progress-status',item['mutexUnverifyCount'] > 0 ? 'status-warn':item['fileStated'] == -1 ?'status-default': 'status-success']"></div>
                            <span style="">{{item['mutexUnverifyCount']}}/{{item[colData.name]}}</span>
                        </div>
                        <div :title="parseInt(item[colData.name]) > 0 ? '单位换算未处理'+item[colData.name]+'条':item['fileStated'] == -1 ?'未开始': '已完成'" v-else-if="colData.name=='unitsCount'">
                            <div :class="['progress-status',parseInt(item[colData.name]) > 0 ? 'status-error':item['fileStated'] == -1 ?'status-default': 'status-success']"></div>
                            <span style="">{{item[colData.name]}}</span>
                        </div>
                        <div :title="(item['overallStatus'] <5 ? '未开始':item['overallStatus'] == 5 ?'正在清洗': item['overallStatus'] == 6 ?'待处理': '清洗完成')+'：总共'+item['totalCount']+'条，完成'+item[colData.name]+'条'" v-else-if="colData.name=='finishCount'">
                            <div :class="['progress-status',item['overallStatus'] <5 ? 'status-default':item['overallStatus'] == 5 ?'status-warn': item['overallStatus'] == 6 ?'status-error': 'status-success']"></div>
                            <span style="">{{item[colData.name]}}/{{item['totalCount']}}</span>
                        </div>
                        <span v-else>
                            {{dataCol.find(m=>m.name==colData.name).render?dataCol.find(m=>m.name==colData.name).render(item):item[colData.name]}}
                        </span>
                    </td>
                </tr>
            </CustomTable>
            <EmptyRow v-if="!showDatas || showDatas.length==0" />
            <div style="" class="page-footer">
                <div class="mt15 text-center" v-if="dateList!=null && dateList.length>0">
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize" />
                    <Checkbox v-authorize="'BusinessOverviewList'" v-if="false" size='small' label='全选' class="fl" value="1" falseValue='0' :checked="selectList.length==showDatas.length" @change="allClickMe"></Checkbox>
                    <Button v-authorize="'BusinessOverviewOper'" v-if="false" type="primary" @click="batchOperation()" :disabled="selectList.length==0" class="inputCheck" style="left: 270px;margin-top: -10px;">重洗</Button>
                    <Button type="text" class="fr" @click="showModal=true" style="margin-top: -8px;">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>
        <Modal title="废弃" class-name="vertical-center-modal" v-model="discard" @on-ok="discardOk"  :loading="loading">
            <Form ref="discardForm" :model="discardForm" :rules="discardValidate"  :label-width="80">
                <input type="hidden" v-model="discardForm.fileNo"></input>
                <FormItem label="医院">
                    <Label>{{discardInfo.hospitalName}}</Label>
                </FormItem>
                <FormItem label="数据类型">
                    <Label>{{discardInfo.dataTypeStr}}</Label>
                </FormItem>
                <FormItem label="上报日期">
                    <Label>{{new Date(discardInfo.uploadDate).format ('YYYY-MM-DD HH:mm:ss')}}</Label>
                </FormItem>
                <FormItem label="废弃原因" prop="cancelReason">
                    <Select v-model="discardForm.cancelReason" filterable clearable>
                        <Option v-for="item in reasonList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                 <FormItem label="详情">
                    <Input v-model="discardForm.remark" :maxlength="500" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                </FormItem>
            </Form>
        </Modal>

        <Modal v-model="model1" title="重新清洗" width=420 @on-ok="cleanYes">
            您确定要将该信息重新清洗吗？
        </Modal>
        <Modal v-model="model2" title="入业务库" width=420 @on-ok="putIn">
            您确定要将该信息入业务库吗？
        </Modal>
        <Modal v-model="model3" title="入产品库" width=420 @on-ok="putInProduct">
            您确定要将该信息入产品库吗？
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
            model2: false, //提示框显示状态(入业务库)
            model3: false,//提示框显示状态(入产品库)
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
            loading:true,
            reasonList:[],
            discard:false,
            discardInfo:{},
            discardIndex:'',
            discardForm:{
                fileNo:'',
                cancelReason:'',
                remark:'',
            },
            discardValidate: {
                cancelReason: [
                    { required: true, message: '废弃原因不能为空', trigger: 'change'}
                ]
            },
            dataCol: [
                {
                    text: "文件编号",
                    name: "fileNo",
                    align: "center",
                    width: 100,
                    sortable: true,
                },
                {
                    text: "省",
                    name: "province",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "市",
                    name: "city",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "医院编号",
                    name: "hospitalNum",
                    align: "center",
                    width: 90,
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
                    text: "数据类型",
                    name: "dataType",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true,
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
                    text: "数据年月",
                    name: "yearMonth",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "上报文件",
                    name: "sourceFileName",
                    align: "center",
                    width: 200,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "文件路徑",
                    name: "sourceFilePath",
                    align: "center",
                    width: 400,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "上报类型",
                    name: "uploadType",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true,
                    render: (params) => {
                        if(params.uploadType==1){
                            return "医院上报";
                        }else if(params.uploadType==2){
                            return "代上报";
                        }else if(params.uploadType==3){
                            return "邮件上报";
                        }
                        return ""
                    }
                },
                {
                    text: "上报时间",
                    name: "uploadDate",
                    align: "center",
                    width: 150,
                    sortable: true,
                    moveable: true,
                    // render: (params) => {
                    //     return new Date(params.uploadDate).format ('YYYY-MM-DD HH:mm:ss');
                    // }
                },
                {
                    text: "最后清洗时间",
                    name: "lastupdateTime",
                    align: "center",
                    width: 150,
                    sortable: true,
                    moveable: true,
                    // render: (params) => {
                    //     return new Date(params.lastupdateTime).format ('YYYY-MM-DD HH:mm:ss');
                    // }
                },
                {
                    text: "上报人",
                    name: "uploadUser",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "文件初检",
                    name: "fileCheck",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },   
                {
                    text: "文件表头",
                    name: "fileHeader",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                
                {
                    text: "文件查重",
                    name: "fileRepeat",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "数据剔除",
                    name: "rejectCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "数据校验",
                    name: "checkCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "数据映射",
                    name: "mappingCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "数据质疑",
                    name: "queryCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "数据互斥",
                    name: "mutexCount",
                    align: "center",
                    width: 100,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "单位换算",
                    name: "unitsCount",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "总金额",
                    name: "totalAmount",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "完成",
                    name: "finishCount",
                    align: "center",
                    width: 150,
                    sortable: true,
                    moveable: true
                },
                {
                    text: "进度",
                    name: "overallStatus",
                    align: "center",
                    width: 120,
                    sortable: true,
                    moveable: true,
                    render: params => {
                        if (params.overallStatus == 1) {
                            return "待初检";
                        } else if (params.overallStatus == 2) {
                            return "转表头";
                        } else if (params.overallStatus == 3) {
                            return "转初检";
                        } else if (params.overallStatus == 4) {
                            return "转查重";
                        } else if (params.overallStatus == 5) {
                            return "正在清洗";
                        } else if (params.overallStatus == 6) {
                            return "待处理";
                        } else if (params.overallStatus == 7) {
                            return "清洗完成";
                        } else if (params.overallStatus == 8) {
                            return "待入业务库";
                        } else if (params.overallStatus == 9) {
                            return "已入业务库";
                        } else if (params.overallStatus == 10) {
                            return "重新清洗";
                        } else if (params.overallStatus == 11) {
                            return "待入产品库";
                        } else if (params.overallStatus == 12) {
                            return "已入产品库";
                        }
                    }
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 150,
                    
                }
            ]
        };
    },
    mounted() {
        this.getHospitalList(""); //获取医院数据
        this.getAddressList(); //获取省市数据
        this.capyCol = [].concat(this.dataCol);
        this.getDateList(); //获取列表数据
        
    },
    activated(){
        //this.getDateList(); //获取列表数据
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
                        self.dateList.map(x=>{
                            if(x.uploadDate){
                                x.uploadDate= new Date(x.uploadDate).format ('YYYY-MM-DD HH:mm:ss')
                            }
                            if(x.lastupdateTime){
                                 x.lastupdateTime= new Date(x.lastupdateTime).format ('YYYY-MM-DD HH:mm:ss')
                            }
                            
                            if(x.sourceFilePath){
                                x.sourceFilePath=Vue.config.filePathPrefix+"upload\\"+x.sourceFilePath.replaceAll('/','\\')
                            }
                            return x;
                        });
                        // self.dateList = ;
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
        //入业务库
        putIn() {
            let selectIdList = [this.commonId];
            this.putInYes(selectIdList);
        },
        //入产品库
        putInProduct() {
            let selectIdList = [this.commonId];
            var self = this;
            Vue.ajax.send({
                name: "overview.putInProduct",
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
        chanpin(index) {
            alert(111);
            this.model3 = true;
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
        },
        getReasonList(){
            var self=this;
            Vue.ajax.send({
                name: 'report.reasonList',
                data: {dataType:self.discardInfo.dataType},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.reasonList=data.data;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        discardOk(){
            this.$refs['discardForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'report.discard',
                        data: {
                            fileNo:self.discardForm.fileNo,
                            cancelReason:self.discardForm.cancelReason,
                            hospitalId:self.discardInfo.hospId,
                            cancelUser:Vue.getUser().userName,
                            remark:self.discardForm.remark,
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.discard=false;
                                self.getDateList();
                                self.$Message.success('废弃提交成功！');
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                                self.loading = false;
                                self.$nextTick(() => {
                                    self.loading = true;
                                });
                            }
                        }
                    });
                }else{
                    this.loading = false;
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                }
            })   
        },
        confirmCancel:function(item){
            this.discard=true;
            this.$refs['discardForm'].resetFields();
            this.discardForm.remarks='';
            this.discardForm.fileNo=item.fileNo;
            this.discardInfo=item;
            if(this.discardInfo.dataType==10){
                this.discardInfo.dataTypeStr='购药';
            }else if(this.discardInfo.dataType==20){
                this.discardInfo.dataTypeStr='门急诊';
            }else if(this.discardInfo.dataType==30){
                this.discardInfo.dataTypeStr='病案';
            }else if(this.discardInfo.dataType==40){
                this.discardInfo.dataTypeStr='医嘱';
            }
            this.getReasonList();
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
    min-width: 100px;
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
.progress-status{
    float:left;
    margin-top: 2px;
    margin-right:5px;
    width:25px;
    height:15px;
}
.status-success{
    background-color:#19be6b;
}
.status-default{
    background-color:#aeaeae;
}
.status-error{
    background-color:#ed4014;
}
.status-warn{
    background-color:#ddc80c;
}
</style>