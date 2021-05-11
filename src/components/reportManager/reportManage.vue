<template>
     <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">统计分析</h2>
        <div class="search-con">
            <Form :model="searchForm" ref="formInline" inline>
                <FormItem label="类型" :label-width="60">
                    <Select v-model="searchForm.rankType" style="width: 120px;">
                        <Option value="">全部</Option>
                        <Option value="1">全国版</Option>
                        <Option value="2">省厅版</Option>
                        <Option value="3">医院版</Option>
                    </Select>
                </FormItem>
                <FormItem label="报告类型" :label-width="80">
                    <Select v-model="searchForm.reportType" style="width: 120px;">
                        <Option value="">全部</Option>
                        <Option value="1">分析报告</Option>
                        <Option value="2">统计报告</Option>
                        <!-- <Option value="3">数据检索</Option>
                        <Option value="4">数据报告</Option>
                        <Option value="5">智能分析</Option> -->
                    </Select>
                </FormItem>
                 <FormItem label="医院编码" :label-width="60">
                 <Input v-model="searchForm.hospCode" type="text" placeholder="请输入医院编码" style="width: 110px;" />
                </FormItem>
                <FormItem label="年份" :label-width="60">
                    <DatePicker v-model="searchForm.yearDate" type="year" style="width: 120px" v-bind:editable="false"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="serchList()">检索</Button>
                </FormItem>
                <FormItem  class="fr">
                    <Button type="primary" class="fl" style="margin-right: 10px;" @click="batchUpload()">上传</Button>  
                    <Button v-authorize="'ReportManageStatisticalAnalysisAdd'" type="primary" class="fl" @click="addReport()">创建报告</Button> 
		        </FormItem>
            </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable  :columnConfig='dataCol' :columnDatas='dataList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
            <tr v-for="(item,index) in showDatas" :key="index">
                     <td>
                    <CheckboxGroup v-model="selectList" style="height:100%;">
                        <Checkbox size='small' :key="JSON.stringify(item)" :value="JSON.stringify(item)" label="" ></Checkbox>
                    </CheckboxGroup> 
                     </td>
                    <td class="ellipsis" v-for="(col) in dataCol.filter(m=>m.name!='op' && m.name!='multi')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{dataCol.find(m=>m.name==col.name).render?dataCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                    
                    <td>
                        <Button v-authorize="'ReportManageStatisticalAnalysisShow'" v-if="item.reportFilePath" class='btn-blue' icon="md-eye" size="small" title="预览" type="primary" @click='showLocal(item.reportId)'></Button>
                        <Button v-authorize="'ReportManageStatisticalAnalysisPublish'" v-if="isPublish(item.stated)" class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="success" @click='publish(item.reportId)'></Button>
                        <Button v-authorize="'ReportManageStatisticalAnalysisStop'" v-if="isDisable(item.stated)" class='btn-red' type="warning" icon="md-remove" size="small" title="停用"  @click='disable(item.reportId)'></Button>
                        <Button v-authorize="'ReportManageStatisticalAnalysisDelete'" class='btn-red' icon="md-close" size="small" type="error" title="废弃"  @click='deleteConfirm(item)'></Button>
                    </td>
                </tr>
                
            </CustomTable>
            <EmptyRow v-if="!dataList || dataList.length==0"/>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="dataList.length>0">    
                   
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                    <Checkbox size='small' label='全选' class="fl" value="1" falseValue='0' @change="selectAll" style="width:60px;"></Checkbox>
                    
                    <Button v-authorize="'ReportManageStatisticalAnalysisBatchPublish'" :disabled="selectList.length==0" type="primary" class="fl b1" @click="batchPublish()">发布</Button>  
                    <Button v-authorize="'ReportManageStatisticalAnalysisBatchStop'" :disabled="selectList.length==0" type="primary" class="fl b2" @click="batchDisable()">停用</Button>  
                    <Button v-authorize="'ReportManageStatisticalAnalysisBatchDelete'" :disabled="selectList.length==0" type="primary" class="fl b3" @click="batchDelete()">废弃</Button> 
                    <Button :disabled="selectList.length==0" type="primary" class="fl b4" @click="batchDownload()">下载</Button>          
                </div>
            </div>
          </div>
          <Modal v-model="model1" title="下载" width=440 @on-ok="fileDoenload">
            <Form :model="importExcelForm" ref="addExcel" inline>
                <FormItem label="请选择文件类型：" :label-width="110">
                    <RadioGroup v-model="importExcelForm.FileType" style="width:500px;display:inline-block">
                        <Radio label="word">word</Radio>
                        <Radio label="pdf">pdf</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="model2" title="上传" width=540 @on-ok="fileUpload" loading>
            <Upload multiple action="" :before-upload='handleUpload' :accept="fileTypes.join(',')">
                <Button type="success" size="large" :disabled="loading" style="width:200px;margin-right:50px;">选择上报文件</Button>　　
                <Button v-show="file.length>0" type="info" :disabled="loading" size="large" @click="file.length=0" style="width:200px;">重新选择上报文件</Button>
            </Upload>
            <!-- <div style="width:50%;margin:0 auto;font-size: 16px;line-height: 36px;" class="text-left" v-if="file.length>0">选中的文件: <br><span v-for="item in file">{{ item.name }} 大小：{{(item.size/1048576).toFixed(2)}}MB<br></span></div> -->
            <!-- <Button class="mt50" type="primary" size="large" :disabled="loading" @click="addOk" v-show="file.length>0">开始上传文件</Button> -->
            <table v-show="file.length>0" class="common-table mt20" style="display:inline-table;">
                <tr style="background:#ebebeb;height:30px;">
                    <td>序号</td>
                    <td style="text-align:left;">文件名</td>
                    <td>文件大小</td>
                    <td>操作</td>
                </tr>
                <tr v-for="(item,index) in file" :key="'file_'+item.name">
                    <td>{{index+1}}</td>
                    <td style="text-align:left;">{{item.name}}</td>
                    <td>{{item.size/1024>1024?(item.size/1024/1024).toFixed(2)+"MB":(item.size/1024).toFixed(2)+"KB"}}</td>
                    <td> 
                        <Button  title="删除" size="small"  type="error" class="btn-red" @click='deleteSelectFile(item)'>
                            <Icon type="md-close"></Icon>
                        </Button> 
                    </td>
                </tr>
            </table>
        </Modal>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from '../common/EmptyRow';
import CustomTable from "../common/GridTable";
import CheckboxGroup from "../common/CheckBoxGroup";
import Checkbox from "../common/CheckBox";
export default {
    name: "reportManage",
    components:{EmptyRow,CustomTable,CheckboxGroup,Checkbox},
    data() {
        return {
            showModal: false,
            showDatas: [],
            showColumns: [],
            currentSort: {
                column: "",
                asc: true
            },
            selectList: [], //选中的信息
            dataList: [], //列表
            tableH:document.body.offsetHeight-290,
            model1:false,
            model2:false,
            loading:false,
            file:[],
            fileTypes:[".pdf",".doc",".docx"],
            searchForm: {
                rankType: "",
                hospCode: "",
                reportType: "",
                yearDate: ""
            },
            importExcelForm:{
                FileType:"word"
            },
            pageConfig: {
                pageNum: 1,
                pageSize: 20,
                totalItemCount: 1
            },
            dataCol: [
                {
                    text:"多选",
                    name: "multi",
                    filterable:false,
                    sortable:false,
                    removeable:false,
                    width: 60,
                },
                {
                    text: "类型",
                    name: "reportDataTypeStr",
                    width: 90,
                    sortable: true,
                    moveable: true,
                    align: "center"
                },
                {
                    text: "报告类型",
                    name: "reportTypeStr",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: "center"
                },
                {
                    text: "年份",
                    name: "reportYear",
                    width: 90,
                    sortable: true,
                    moveable: true,
                    align: "center"
                },
                {
                    text: "省",
                    name: "provinceName",
                    sortable: true,
                    moveable: true,
                    width: 120,
                    align: "center"
                },
                {
                    text: "市",
                    name: "cityName",
                    sortable: true,
                    moveable: true,
                    width: 120,
                    align: "center"
                },
                {
                    text: "医院名称",
                    name: "hospName",
                    sortable: true,
                    moveable: true,
                    width: 200,
                    align: "center"
                },
                {
                    text: "报告名称",
                    name: "reportName",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    align: "center"
                },
                {
                    text: "状态",
                    name: "stateStr",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: "center",
                },
                {
                    text: "创建人",
                    name: "createUser",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: "center"
                },
                {
                    text: "创建时间 ",
                    name: "createTimeStr",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    align: "center"
                },
                {
                    text: "修改人",
                    name: "changeUser",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: "center"
                },
                {
                    text: "修改时间",
                    name: "changeTimeStr",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    align: "center"
                },
                {
                    text: "发布人",
                    name: "publishUser",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: "center"
                },
                {
                    text: "发布时间",
                    name: "publishTimeStr",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    align: "center"
                },
                {
                    text: "停用人",
                    name: "stopUser",
                    sortable: true,
                    moveable: true,
                    width: 100,
                    align: "center"
                },
                {
                    text: "停用时间",
                    name: "stopTimeStr",
                    sortable: true,
                    moveable: true,
                    width: 150,
                    align: "center"
                },
                {
                    text: "操作",
                    width: 200,
                    align: "center",
                    filterable: false,
                    removeable: false,
                    name: "op",
                }
            ]
        };
    },
    mounted: function() {
        this.getdataList();
        // 定时遍历列表，如果有未生成的，正在生成的记录，则进行刷新
        //var timer =this.$setInterval(this.updateDataList,2000);
    },
    methods: {
        deleteConfirm(item){
            this.$Modal.confirm({
                title: '删除确认',
                content: '确定要删除“'+item.reportName+'”？',
                onOk: () => {
                    this.delete(
                        item.reportId
                    );
                }
            }); 
        },
        // 是否能发布
        isPublish(stated){
            // 已生成 或者 已停用 可以发布
           return (stated == 2 || stated == 4);
        },
        // 是否停用
        isDisable(stated){
            // 已生成 已发布 可以停用
            return (stated == 2 || stated == 3);
        },

        // 如果 有 未生成 正在生成记录，更新列表（再次调用获取列表方法）
        updateDataList(){
            var self = this;
            // 过滤当前列表中 未生成 正在生成记录
            var tempList = self.dataList.filter(function(item){
                                // 未生成 正在生成
                                return (item.stated ==1 || item.stated ==5);
                            });
            // 如果 有 未生成 正在生成记录，更新列表（再次调用获取列表方法）
            if(tempList.length>0){
                self.getdataList();
            }
        },

        serchList() {
            this.pageConfig.totalItemCount = 1;
            this.pageConfig.pageIndex = 1;
            this.getdataList();
        },

        getdataList() {
            var self = this;
            Vue.ajax.send({
                name: "reportManager.list",
                data: {
                    reportDataType: self.searchForm.rankType,
                    reportType: self.searchForm.reportType,
                    hospCode:self.searchForm.hospCode,
                    reportYear: self.searchForm.yearDate.format("YYYY"),
                    pageIndex: self.pageConfig.pageNum,
                    pageSize: self.pageConfig.pageSize
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dataList = data.data.dataList;
                        self.pageConfig.totalItemCount =
                            data.data.totalItemCount;
                    } else {
                        this.$Modal.error({
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
            this.getdataList();
        },
        //显示条数
        changeSize(num) {
            this.pageConfig.pageSize = num;
            this.getdataList();
        },
        //保存批量选中的信息
        getSelectList(arr) {
            this.selectList = arr;
        },
        selectAll:function(value){
            if(value==1){
                this.selectList=this.showDatas.map(a=>JSON.stringify(a));
            }
            else{
                this.selectList=[];
            }
        },
        //批量发布
        batchPublish() {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量发布的报告！</h5>"
                });
            } else {
                let selectIdList = []; //选中数据的id标识
                // 是否满足批量操作的要求
                let isNext = true;
                //遍历选中的数据获取选中数据的id数组
                this.selectList.forEach(a => {
                    var element=JSON.parse(a);
                    selectIdList.push(element.reportId);
                    // 如果所选数据不满足发布要求，不允许执行批量操作
                    if(!this.isPublish(element.stated)){
                        isNext = false;
                    }
                });
                if(isNext){
                    this.publishReport(selectIdList);
                }else{
                    this.$Modal.error({
                        title: "批量操作错误",
                        closable: true,
                        content: "所选数据可能包含未生成、正在生成、生成失败、已发布的报告！"
                    })
                }
            }
        },
        //单条发布
        publish(id) {
            let idList = [id];
            this.publishReport(idList);
        },
        
        //发布操作
        publishReport(idList) {
            var self = this;
            Vue.ajax.send({
                name: "reportManager.publish",
                data: {
                    reportIds: idList,
                    changeUser:Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("操作成功。");
                        self.selectList = [];
                        self.getdataList();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        //批量停用
        batchDisable() {
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量停用的报告！</h5>"
                });
            } else {
                let selectIdList = []; //选中数据的id标识
                // 是否满足批量操作的要求
                let isNext = true;
                //遍历选中的数据获取选中数据的id数组
                this.selectList.forEach(a => {
                    var element=JSON.parse(a);
                    selectIdList.push(element.reportId);
                    // 如果所选数据不满足停用要求，不允许执行批量操作
                    if(!this.isDisable(element.stated)){
                        isNext = false;
                    }
                });
                if(isNext){
                    this.stopReport(selectIdList);
                }else{
                    this.$Modal.error({
                        title: "批量操作错误",
                        closable: true,
                        content: "所选数据可能包含未生成、正在生成、生成失败、已停用的报告！"
                    })
                }
            }
        },
        //单条停用
        disable(id) {
            let idList = [id];
            this.stopReport(idList);
        },
        //停用操作 批量或单条报告停用
        stopReport(idList) {
            var self = this;
            Vue.ajax.send({
                name: "reportManager.stopReport",
                data: {
                    reportIds: idList,
                    changeUser:Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("操作成功。");
                        self.selectList = [];
                        self.getdataList();
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        
        //创建报告
        addReport() {
            this.$router.push({
                path: "/reportManager/reportManagerAdd"
            });
        },
        //预览
        showLocal(reportId) {
             window.open("/static/pdf/web/viewer.html?file="+encodeURIComponent(Vue.config.apiPrefix+"/report/download?id="+reportId)); 
                     
            // var self = this;
            // console.log(Vue.config.authApiPrefix);
            // console.log(reportId);
            // Vue.ajax.send({
            //     name: "reportManager.show",
            //     data: {
            //         reportId: reportId
            //     },
            //     success: function(data) {
            //         if (!!data && data.code == "0") {
            //             // let url = "/static/file/demo.pdf";
            //             let url=data.data.reportFilePath;
                        
            //             if(!!url){
            //                 // window.open("/static/pdf/web/viewer.html?file=http://172.17.36.16:8840/resource/file/test_(6).pdf");
            //                 window.open("/static/pdf/web/viewer.html?file="+encodeURIComponent("http://172.17.36.16:8840/report/download?id="+reportId)); 
            //             }else{
            //                 self.$Modal.error({
            //                 title: "预览失败",
            //                 closable: true,
            //                 content: "获取文件路径失败"
            //             });
            //             }
            //         } else {
            //             self.$Modal.error({
            //                 title: "失败",
            //                 content: data.message
            //             });
            //         }
            //     }
            // });
        },
        batchDownload(){
            this.model1=true;
        },
        batchUpload(){
            this.loading=false;
            this.model2=true;
        },
        fileDoenload(){
            if (this.importExcelForm.FileType=="word") {
                for(var i = 0;i<this.selectList.length;i++){
                    let mes=JSON.parse(this.selectList[i]);
                    if (mes.reportFilePath!=null) {
                        this.downloadFile(Vue.config.apiPrefix+"/download?fileName="+mes.reportName+"&filePath="+mes.reportFilePath.substring(0,mes.reportFilePath.length-4)+".doc"+"&token="+ Vue.getData("token"));
                    }
                }
            }else{
                for(var i = 0;i<this.selectList.length;i++){
                    let mes=JSON.parse(this.selectList[i]);
                    if (mes.reportFilePath!=null) {
                        this.downloadFile(Vue.config.apiPrefix+"/download?fileName="+mes.reportName+"&filePath="+mes.reportFilePath+"&token="+ Vue.getData("token"));
                    }
                }
            }
            this.selectList=[];
        },
        downloadFile(url){
            const iframe = document.createElement("iframe");
            iframe.style.display = "none"; // 防止影响页面
            iframe.style.height = 0; // 防止影响页面
            iframe.src = url; 
            document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
            // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
            setTimeout(()=>{
                iframe.remove();
            }, 5 * 60 * 1000);
        },
        fileUpload(){
            let ermes="";
            var fileMes={};
            for (var i =0; i < this.file.length; i++) {
                fileMes['file'+(i==0?'':i)]=this.file[i];
                let ftype= this.file[i].name.substring(this.file[i].name.lastIndexOf(".") + 1,this.file[i].name.length);
                if (ftype!="doc"&&ftype!="docx"&&ftype!="pdf") {
                    ermes+="第"+(i+1)+"个文件格式不正确。"
                }
            }
            if (ermes.length>0) {
                this.$Modal.error({
                    title: '文件格式错误',
                    content: "<div style='word-break:break-all;'>"+ermes+"</div>",
                    scrollable:true
                });
                return;
            }
            if (this.file.length<1) {
                this.$Modal.error({
                    title: '文件上传',
                    content: "<div style='word-break:break-all;'>请选择上传的文件。</div>",
                    scrollable:true
                });
                return;
            }
            var self = this;
            self.loading=true;
            Vue.ajax.send({
                name: 'reportManager.uploadFile',
                formData: true,
                data: fileMes,
                success: function(data) {
                    self.loading=false;
                    self.model2=false;
                    if (data.code=='0') {
                        self.file=[];
                        self.$Message.success("上传成功。");
                    } else {
                        self.$Modal.error({
                            title: '上传错误',
                            content: "<div style='word-break:break-all;'>"+(data.message || "上传过程中遇到问题，请重试")+"</div>",
                            scrollable:true
                        });
                    }
                },
                error:function(){
                    self.loading=false;
                    self.model2=false;
                    self.$Modal.error({
                        title: '上传错误',
                        content: "<div style='word-break:break-all;'>上传过程中遇到问题，请重试</div>",
                        scrollable:true
                    });
                }
            });
        },
        handleUpload(file){
            if(this.file.length!=0){
                
                var hasName=false;
                for(var i=0;i<this.file.length;i++){            　　
                　　if(this.file[i].name==file.name){
                　　　　hasName=true
                　　};
                };
                if(!hasName){
                    this.file.push(file);
                }

            }else{
                this.file.push(file);
            }
            return false;
        },
        addOk(){
            
            this.loading=true;
            this.processes=new Array();
            this.update();            
        },
        deleteSelectFile:function(item){
            this.file=this.file.filter(m=>m.name!=item.name);
        },
        //批量废弃 直接就可废弃，不行判断是否满足批量要求
        batchDelete(){
            var self = this;
            if (this.selectList.length < 1) {
                this.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>请选择需要批量废弃的报告！</h5>"
                });
            } else {
                let selectIdList = []; //选中数据的id标识
                //遍历选中的数据获取选中数据的id数组
                this.selectList.forEach(a => {
                    var element=JSON.parse(a)
                    selectIdList.push(element.reportId);
                });
                
                this.deleteReport(selectIdList);
            }
        },
        //单条废弃
        delete(id){
            let idList = [id];
            this.deleteReport(idList);
        },
        //废弃操作 批量或单条报告废弃
        deleteReport(idList) {
            var self = this;
            Vue.ajax.send({
                name: "reportManager.deleteReport",
                data: {
                    reportIds: idList,
                    changeUser:Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("操作成功。");
                        self.selectList = [];
                        self.getdataList();
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
                        ? a[this.currentSort.column] - b[this.currentSort.column]
                        : b[this.currentSort.column] - a[this.currentSort.column]
                );
                } else {
                this.showDatas.sort(
                    (a, b) =>
                    this.currentSort.asc
                        ? (a[this.currentSort.column] || "").localeCompare(
                            b[this.currentSort.column]
                        )
                        : (b[this.currentSort.column] || "").localeCompare(
                            a[this.currentSort.column]
                        )
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
.page-footer .fl {
  position: absolute;
  left: 220px;
  top: 8px;
}
.page-footer button.fl {
  position: absolute;
  left: 265px;
  top: 3px;
}
.page-footer button.fl.b2 {
  left: 325px;
}
.page-footer button.fl.b3 {
  left: 385px;
}
.page-footer button.fl.b4 {
  left: 445px;
}
.page-footer button.fl.b5 {
  left: 505px;
}
.page-footer button.fr {
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