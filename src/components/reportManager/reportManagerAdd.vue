<template>
    <div class="bg-white m20" v-if="isPrepare">
        <h2 class="common-title">数据准备</h2>
        <div class="p20 reportManagerAdd">
          <Steps direction="vertical">
            <Step title="抽取数据" status="process">
                <Form :model="report" ref="step0form" :rules="sourceValidate" :label-width="120">
                    <FormItem label="数据源类型" prop="sourceType" class="">
                        <Select v-model="report.sourceType" class="cellLength" span="11" style="width: 400px;">
                            <Option v-for="item in sourceList" :key="item.sourceType" :value="item.sourceType">{{item.sourceTypeName}}</Option>
                            
                        </Select>
                    </FormItem>
                </Form> 
                <Form :model="report" style="margin-top:-40px;" ref="step1form" :rules="ruleValidate" :label-width="120">   
                    <FormItem label="样本医院" prop="groupId">
                        <Select v-model="report.groupId" class="cellLength" style="width: 400px;">
                            <Option v-for="item in sampleList" :key="item.groupId" :value="item.groupId">{{item.groupName}}</Option>
                        </Select>
                    </FormItem>
                    
                    <FormItem label="时间" class="start-month-label" >
                        <FormItem label="" prop="startMonth" style="display:inline-block">
                            <DatePicker format="yyyyMM" v-model="report.startMonth" type="month" placeholder="请选择开始月份" style="width: 185px;" v-bind:editable="false"></DatePicker>
                        </FormItem>
                        <span class="pl10 pr10">-</span>
                        <FormItem label="" prop="endMonth" style="display:inline-block">
                            <DatePicker format="yyyyMM" v-model="report.endMonth" type="month" placeholder="请选择结束月份" style="width: 185px;" v-bind:editable="false"></DatePicker>
                        </FormItem>
                     </FormItem>
                     <div>
                        <Button type="primary"  @click="step1Action" class="mr20" :disabled="step.step1.loading">抽取数据</Button>
                         
                        <template v-if="step.step1.timer!=null">
                           <Icon type="ios-alert" color="red"  size="20" title="抽取数据错误" v-if="step.step1.jobStatus=='FAIL'"/>
                          <Icon type="ios-checkmark-circle" color="green"  size="20" title="抽取数据成功" v-else-if="step.step1.jobStatus=='SUCCESS'"/> 
                          <Icon type="ios-loading demo-spin-icon-load" color="green"  size="20" title="正在抽取数据" v-else/>
                        </template>
                        
                    </div> 
                </Form>            
            </Step>
            <Step title="生成立方体" status="process">
               <Form :model="report" ref="step2form" :rules="ruleValidate" :label-width="0">
                 <FormItem>
                    <Button type="primary" :disabled="step.step2.loading"  @click="step2Action" class="mr20">
                      <span>生成立方体</span>
                    </Button>
                    <template v-if="step.step2.timer!=null">
                      <Icon type="ios-alert" color="red"  size="20" title="构建立方体错误" v-if="step.step2.jobStatus=='ERROR'"/>
                      <Icon type="ios-checkmark-circle" color="green"  size="20" title="构建立方体成功" v-else-if="step.step2.jobStatus=='FINISHED'"/> 
                      <Icon type="ios-loading demo-spin-icon-load" color="green"  size="20" title="正在构建立方体" v-else/>
                    </template>
                    
                    <Button type="info" @click="getCube" style="background:#c2ecff;color:#0090d2;border-color:#c2ecff">查看立方体</Button>
                </FormItem>
            </Form>
            </Step>
            <Step title="数据填充" status="process">
             <Form :model="dataFillList" ref="step3form" :label-width="0">
                <FormItem>
                  <Row > 
                     <Col span="4">
                           <Upload :before-upload="analyseDataFill" action="" accept="text/csv,.csv,text/csv-schema,application/vnd.ms-excel" :format="['csv','xls','xlsx']" :max-size="10240">
                              <Button icon="ios-cloud-upload-outline">导入填充数据</Button>
                          </Upload>
                     </Col>
                     <Col span="5"><span style="color:#565656">请先下载右侧csv模板</span></Col>
                     <Col class="fr" span="2"><Button type="info" class="fr"  @click="addHeader()">+ 新增</Button></Col>
                     <Col class="fr" span="2"><Button type="info" class="fr" @click="downloadTemplate()">下载模板</Button></Col>
                   </Row>
                </FormItem> 
                    <FormItem>
                        <Row class-name="form-head">
                           <Col span="6">目标医院</Col>
                           <Col span="5">目标月份</Col>
                           <Col span="6">填充医院</Col>
                           <Col span="5">填充月份</Col>
                           <Col span="2">操作</Col>
                        </Row>
                    </FormItem>                  
                    <FormItem
                      v-for="(item, index) in dataFillList.items"
                      :key="index"
                      label="">
                      <Row class-name="form-body">
                          <Col span="6">
                          <FormItem :prop="'items.' + index + '.targetHospId'" :rules="{required: true,type: 'number', message: '目标医院不能为空', trigger: 'blur'}">
                              <Select v-model="item.targetHospId" class="cellLength">
                                <Option v-for="temp in hospitalList" :key="temp.hospitalId" :value="temp.hospitalId">{{temp.hospitalName}}</Option>
                               </Select>
                          </FormItem>
                          </Col>
                          <Col span="5">
                          <FormItem :prop="'items.' + index + '.targetMonth'" :rules="{required: true,type: 'date', message: '目标月份不能为空', trigger: 'blur'}">
                              <DatePicker format="yyyyMM" v-model="item.targetMonth" type="month" placeholder="请选择目标月份" v-bind:editable="false"></DatePicker>
                          </FormItem>
                          </Col>
                          <Col span="6">
                          <FormItem :prop="'items.' + index + '.fillHospId'" :rules="{required: true,type: 'number', message: '填充医院不能为空', trigger: 'blur'}">
                              <Select v-model="item.fillHospId" class="cellLength">
                                <Option v-for="temp in hospitalList" :key="temp.hospitalId" :value="temp.hospitalId">{{temp.hospitalName}}</Option>
                               </Select>
                          </FormItem>
                          </Col>
                          <Col span="5">
                          <FormItem :prop="'items.' + index + '.fillMonth'" :rules="{required: true,type: 'date', message: '填充月份不能为空', trigger: 'blur'}">
                               <DatePicker format="yyyyMM" v-model="item.fillMonth" type="month" placeholder="请选择填充月份" v-bind:editable="false"></DatePicker>
                          </FormItem>
                          </Col>
                          <Col span="2">
                              <Button type="info"  @click="dataFillList.items.splice(index, 1);" style="background:#ff3d23;border-color:#ff3d23;">
                                <Icon type="md-close" size="16" title="删除"/>
                              </Button>
                          </Col>
                      </Row>
                    </FormItem>
                
                <FormItem>
                    <Button type="info" :disabled="step.step3.loading"  class="mr15"  @click="step3Action">
                      <span >更新立方体</span>
                    </Button>
                    <template v-if="step.step3.timer!=null">
                        <Icon type="ios-alert" color="red"  size="20" title="填充数据错误" v-if="step.step3.jobStatus=='FAIL'"/>
                        <Icon type="ios-alert" color="red"  size="20" title="构建立方体错误" v-else-if="step.step3.jobStatus=='ERROR'"/>
                        <Icon type="ios-checkmark-circle" color="green"  size="20" title="更新立方体成功" v-else-if="step.step3.jobStatus=='FINISHED'"/> 
                        <Icon type="ios-loading demo-spin-icon-load" color="green"  size="20" title="正在更新立方体" v-else/>
                    </template>

                    <Button type="primary" @click="goToNext">下一步</Button>
                </FormItem> 
            </Form>
            </Step>
        </Steps>
        </div>
    </div>
    <div class="bg-white p20 m20" v-else>
        <h2 class="common-title">生成报告</h2>
        <div class="p20">
          <Form  :model="report" ref="reportForm" :rules="reportValidate" :label-width="150">
                 <FormItem label="选择报告类型" prop="reportType" class="">
                    <Select v-model="report.reportType" class="cellLength" span="11" style="width: 400px;">
                        <Option value="1">分析报告-全国版</Option>
                        <Option value="2">分析报告-省份版</Option>
                        <Option value="3">统计报告-全国版</Option>
                        <Option value="4">统计报告-省份版</Option>
                        <Option value="5">统计报告-医院版</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择报告模板" prop="template">
                    <Select v-model="report.template" class="cellLength" style="width: 400px;">
                        <Option v-for="(item,ind) in templateList" :key="ind" :value="item">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="报告名称" prop="reportName">
                    <Input type="text" v-model="report.reportName" style="width: 400px;"></Input>
                    <span class="tip-content">[某省] [某医院] [某年] 可替换成具体的省份名称、医院名称、年份。</span>
                </FormItem>
                <FormItem label="报告年份" prop="year">
                    <DatePicker v-model="report.year" format="yyyy" type="year" class="cellLength" style="width: 400px;" v-bind:editable="false"></DatePicker>
                </FormItem>
               
                <Form :model="hospitalFillList" v-if="report.reportType==5" ref="hospitalform" :label-width="0">
                    <FormItem>
                      <Row > 
                        <Col span="4">
                              <Upload :before-upload="analyseHospital" action="" accept="text/csv,.csv,text/csv-schema,application/vnd.ms-excel" :format="['csv','xls','xlsx']" :max-size="10240">
                                  <Button icon="ios-cloud-upload-outline">导入医院数据</Button>
                              </Upload>
                        </Col>
                        <Col span="5"><span style="color:#565656">请先下载右侧csv模板</span></Col>
                        <Col   span="3"><a href="../../static/file/hospFillTemplate.csv" class="btn fr" style="color:#2d8cf0;">下载模板</a></Col>
                      </Row>
                    </FormItem> 
                    <FormItem>
                    <FormItem>
                        <Row>
                           <Col span="8" class-name="form-head">医院</Col>
                           <Col span="4" class-name="form-head">操作</Col>
                        </Row>
                    </FormItem>                  
                    <FormItem
                      v-for="(item, index) in hospitalFillList.items"
                      :key="index"
                      label="" style="margin-bottom:0;">
                      <Row >
                          <Col span="8" class-name="form-body">
                          <FormItem :prop="'items.' + index + '.hospitalId'" :rules="{required: true,type: 'number', message: '医院不能为空', trigger: 'blur'}">
                              <Select v-model="item.hospitalId" class="cellLength">
                                <Option v-for="temp in hospitalList" :key="temp.hospitalId" :value="temp.hospitalId">{{temp.hospitalName}}</Option>
                               </Select>
                          </FormItem>
                          </Col>
                          <Col span="4" class-name="form-body">
                              <Button type="text" style="color:#ff0000" @click="hospitalFillList.items.splice(index, 1);">删除</Button>
                          </Col>
                      </Row>
                    </FormItem>
                    </FormItem> 
                </Form>
                 <div>
                    <FormItem> 
                      <Button type="primary" :loading="step.step5.loading" :disabled="step.step5.loading" @click="step5Action">
                            <span>生成报告</span>
                      </Button>
                      <Icon type="ios-loading demo-spin-icon-load" color="green"  size="20" title="正在生成报告" v-show="step.step5.loading"/>
                      <Button type="primary" @click="isPrepare=true" :disabled="step.step5.loading">上一步</Button>
                    </FormItem> 
                </div>
            </Form>
        </div>
    </div>
</template>
 

<script>
import Vue from "vue";
import excel from "../../utils/excel.js";
export default {
  name: "reportManagerAdd",
  data() {
    return {
      step: {
        step1: { // 第一步 抽取数据
          loading: false,
          jobId:"",
          jobStatus: "",
          timer:null
        },
        step2: { // 第二步 立方体创建
          loading: false,
          jobId:"",
          jobStatus: "",
          timer:null
        },
        step3: { // 第三步 数据填充 更新立方体
          loading: false,
          jobId:"",
          jobStatus: "",
          timer:null
        },
        step4: { // 无对应
          loading: false,
          jobId:"",
          jobStatus: "",
          timer:null
        },
        step5: { // 生成报告
          loading: false,
          jobId:"",
          jobStatus: "",
          timer:null
        }
      },
      sourceList:[],
      currentStep: 1,
      isPrepare: true,  // 创建报告页面初始，true显示数据准备页面，false直接显示创建报告页面
      templateList: [], // 模板
      sampleList: [], // 样本
      hospitalList: [], // 医院
      provinceList: [], // 省份列表
      report: {
        sourceType: "",
        groupId: null,
        template: "",
        startMonth: "",
        endMonth: "",
        year: "",
        reportType: "",
        reportDataType: "",
        reportName: ""
      },
      // 报告类型 联动 报告名称后缀，数组下标对应类型，值对应名称后缀
      nameSuffix:["","[某年]","[某省][某年]","[某年]","[某省][某年]","[某医院][某年]"],
      dataFillList: {  // 第三步数据填充中  目标医院 填充医院 数据对象 列表
        items: []
      },
      hospitalFillList: { // 生成报告页面，选择的报告数据类型为医院时，导入的医院列表
        items: []
      },
      reportType: 1,
      sourceValidate: {
        sourceType: [
          { required: true, message: "请选择数据源类型", trigger: "blur",type: "number" }
        ]
      },
      ruleValidate: {
        groupId: [
          {
            required: true,
            message: "请选择样本医院",
            trigger: "blur",
            type: "number"
          }
        ],
        template: [{ required: true, message: "请选择模板", trigger: "blur" }],
        startMonth: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "blur"
          }
        ],
        endMonth: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "blur"
          }
        ]
      },
      reportValidate: {
        reportType: [
          {
            required: true,
            message: "请选择报告类型",
            trigger: "blur"
          }
        ],
        template: [{ required: true, message: "请选择模板", trigger: "blur" }],
        year: [
          {
            type: "date",
            required: true,
            message: "请选择报告年份",
            trigger: "blur"
          }
        ],
        reportName: [
          { required: true, message: "请输入报告名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getDataSourceList();
    this.getSampleList();
    this.getHospitalList();
    this.getProvinceList();
    //this.getTemplateList();
  },
  watch: {
    'report.template': {
      handler: function(newVal, oldVal) {
        // 报告文件名称 是模板名称 加替换字符后缀
        this.report.reportName = newVal+this.nameSuffix[this.report.reportType];
      },
      deep: true
    },
    'report.reportType': {
      handler: function(newVal, oldVal) {
        // 报告文件名称 是模板名称 加替换字符后缀
        this.report.reportName = this.report.template+this.nameSuffix[this.report.reportType];
      },
      deep: true
    }
  },
  computed: {
    // 创建报告 或填充数据 时参数计算
    addReportParam: function() {
      var self = this;
      var val =self.report.reportType;
      var myReportType;
      var myReportDataType;
      //分析-全国
      if (val == 1) {
        myReportType = 1;
        myReportDataType = 1;
      } else if (val == 2) {
        //分析-省份
        myReportType = 1;
        myReportDataType = 2;
      } else if (val == 3) {
        //统计-全国
        myReportType = 2;
        myReportDataType = 1;
      } else if (val == 4) {
        //统计-省份
        myReportType = 2;
        myReportDataType = 2;
      } else if (val == 5) {
        //统计-医院
        myReportType = 2;
        myReportDataType = 3;
      }
      // 填充数据时  目标医院填充医院列表参数
      var myHospFillList = self.dataFillList.items.map(item => {
        return {
          targetHospId: item.targetHospId,
          targetHospName: self.hospitalList.filter(
            a => a.hospitalId == item.targetHospId
          )[0].hospitalName,
          targetMonth: item.targetMonth.format("YYYYMM"),
          fillHospId: item.fillHospId,
          fillHospName: self.hospitalList.filter(
            a => a.hospitalId == item.fillHospId
          )[0].hospitalName,
          fillMonth: item.fillMonth.format("YYYYMM")
        };
      });
      // 创建报告 导入的医院列表参数
      var hospIdsList = self.hospitalFillList.items.map(item => {
        return {id:item.hospitalId};
      });
    
      return {
        sourceType:self.report.sourceType,
        reportType: myReportType,
        reportDataType: myReportDataType,
        reportName: self.report.reportName,
        templateName: self.report.template,
        startStopMonth: self.report.startMonth.format("YYYYMM") + "-" + self.report.endMonth.format("YYYYMM"),
        reportYear: self.report.year.format("YYYY"),
        createUser: Vue.getUser().userName,
        hospGroupIds: self.report.groupId ? [self.report.groupId] : [],
        hospFillList: myHospFillList,
        hospIdsList: hospIdsList
      };
    }
  },
  methods: {
    // 数据填充 添加目标医院填充医院 行
    addHeader(data) {
      var maxIndex = this.dataFillList.items.length;
      if (data) {
        data.index = maxIndex + 1;
        this.dataFillList.items.push(data);
      } else {
        this.dataFillList.items.push({
          index: maxIndex + 1,
          targetHospId: "",
          targetMonth: "",
          fillHospId: "",
          fillMonth: ""
        });
      }
    },

    // 下载模块
    downloadTemplate(){
      window.location.href="../../static/file/dataFillTemplate.csv";
    },

    // 数据准备中 三步的按钮是否被禁止
    isDisableStepAction(isDisable){
      this.step.step1.loading = isDisable;
      this.step.step2.loading = isDisable;
      this.step.step3.loading = isDisable;
    },
    // 第一步 抽取数据 Button
    step1Action: function() {
      var self = this;
      Promise.all([
        self.validateForm("step0form"),  // 数据源校验
        self.validateForm("step1form")   // 样本医院  开始时间 结束时间校验
      ])
        .then(function(data) {
          self.reloadDataSource(self.step.step1);
        })
        .catch(function(data) {});
    },
    // 抽取数据 操作
    reloadDataSource: function(curStep) {
      var self = this;
      // 执行数据准备中 三步中的任何一步，其三步的按钮都被禁止
      self.isDisableStepAction(true);
      // 当前步骤按钮的任务状态清空；
      curStep.jobStatus="";
      // 按样本医院组ID 获取此组下所有医院ID
      Vue.ajax.send({
        name:"hospital.group.detail",
        data:{
          groupId:self.report.groupId
        },
        success: function(data) {
          // 成功 获取到数据
          if (!!data && data.code == "0") {
            // 调用 抽取数据
            Vue.ajax.send({
              name: "reportManager.loadDataSource",
              data: {
                datasourceId:self.report.sourceType,
                hospIds:data.data.hospitalIds,  // 查询到的样本医院组下的所有医院ID
                startMonth:self.report.startMonth.format("YYYYMM"),
                endMonth:self.report.endMonth.format("YYYYMM")
              },
              success: function(d) {
                // 成功 返回数据
                if (!!d && d.code == "0") {
                  curStep.jobId=d.data.jobId;
                  // 定时获取任务状态
                  curStep.timer=self.$setInterval(function(){self.getLoadDataStutus(curStep)},2000);
                  console.log(curStep.jobId);
                // 抽取数据请求成功 没有返回数据
                }else{
                  // 执行数据准备中 其三步的按钮都被开启
                  self.isDisableStepAction(false);
                  self.$Modal.error({
                      title: "抽取异常",
                      closable: true,
                      content: "<h5>抽取数据发生异常！</h5>"
                  });
                }
              },
              // 抽取数据失败 异常
              error:function(){
                // 执行数据准备中，其三步的按钮都被开启
                self.isDisableStepAction(false);
                self.$Modal.error({
                    title: "错误",
                    closable: true,
                    content: "<h5>抽取数据请求发生错误！</h5>"
                });
              }
            });
          // 获取样本医院成功 没有到数据
          }else{
            // 执行数据准备中，其三步的按钮都被开启
            self.isDisableStepAction(false);
            self.$Modal.error({
                title: "样本异常",
                closable: true,
                content: "<h5>所选样本医院没有包含任何医院信息！</h5>"
            });
          }
        },
        // 获取样本医院失败 异常
        error:function(){
          curStep.loading = false;
          self.$Modal.error({
              title: "错误",
              closable: true,
              content: "<h5>获取样本医院信息请求发生错误！</h5>"
          });
        }
      })
      
    },
    // 获取数据源类型列表
    getDataSourceList:function(){
      var self = this;
      Vue.ajax.send({
        name: "reportManager.sourceList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.sourceList = data.data || [];
          }else{
            console.log("获取数据源类型列表success："+data.message);
          }
        },
        error:function(data){
          console.log("获取数据源类型列表error："+data.message);
        }
      });
    },
    // 获取 抽取数据任务 执行状态
    getLoadDataStutus:function(curStep){
      var self = this;
      Vue.ajax.send({
        name: "reportManager.getSourceDataStatus",
        data: {
          jobId:curStep.jobId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            if(data.data.status=="SUCCESS" || data.data.status=="FAIL"){
              clearInterval(curStep.timer);
              curStep.jobStatus=data.data.status;
              // 执行数据准备中，其三步的按钮都被开启
              self.isDisableStepAction(false);
              // 如果有错误，弹出错误提示
              if(data.data.status=="FAIL"){
                self.$Modal.error({
                    title: "抽取数据任务失败",
                    closable: true,
                    content: data.data.message
                });
              }
            }
          }else{
            console.log("抽取数据任务状态定时获取success："+data.message);
          }
        },
        error:function(data){
          console.log("抽取数据任务状态定时获取error："+data.message);
        }
      });
    },
   
    // 构建立方体 按钮事件 
    step2Action: function() {
      var self = this;
      Promise.all([
          self.validateForm("step0form"), // 数据源校验
          self.validateForm("step1form")  // 样本医院  开始时间 结束时间校验
        ])
          .then(function(data) {
          self.createOrUpdateCube(self.step.step2);
        })
        .catch(function(data) {});
    },
    // 更新立方体
    step3Action: function() {
      var self = this;
      self.step.step3.jobStatus="";
      if (self.dataFillList.items.length > 0) {
        Promise.all([
          self.validateForm("step0form"), // 数据源校验
          self.validateForm("step1form"),   // 样本医院  开始时间 结束时间校验
          self.validateForm("step3form")  // 填充目标医院 填充医院校验
        ])
          .then(function(data) {
            self.fillDataSourceThenUpdateCub(self.step.step3);
          })
          .catch(function(data) {
            console.log(data);
          });
      } else {
        Promise.all([self.validateForm("step0form")])
          .then(function(data) {
            self.createOrUpdateCube(self.step.step3);
          })
          .catch(function(data) {
            console.log(data);
          });
      }
    },
    // 构建 或 更新 立方体
    createOrUpdateCube: function(curStep) {
      var self = this;
      // 执行数据准备中 三步中的任何一步，其三步的按钮都被禁止
      self.isDisableStepAction(true);
      // 当前步骤按钮的任务状态清空；
      curStep.jobStatus=""
      //TODO 根据数据源类型获取立方体名称 self.report.sourceType
      Vue.ajax.send({
        name: "reportManager.createCube",
        data: {
          cubeName:self.sourceList.findProperty("sourceType",self.report.sourceType).cubeName || "",
          buildType:'BUILD',
          startTime:Date.parse(new Date()),
          endTime:Date.parse(new Date())
        },
        success: function(data) {
          //self.step.step2.loading = false;
          if (!!data && data.code == "0") {
            curStep.jobId=data.data.jobId;
            curStep.timer=self.$setInterval(function(){self.getCubeBuildOrUpdateStatus(curStep)},2000);
            console.log(curStep.jobId);
          }else{
            // 执行数据准备中，其三步的按钮都被开启
            self.isDisableStepAction(false);
            self.$Modal.error({
                title: "操作立方体异常",
                closable: true,
                content: data.message
            });
          }
        },
        error: function(data) {
          // 执行数据准备中，其三步的按钮都被开启
          self.isDisableStepAction(false);
          self.$Modal.error({
              title: "操作立方体失败",
              closable: true,
              content: data
          });
        }
      });
    },
    // 获取立方体任务状态 信息
    getCubeBuildOrUpdateStatus:function(curStep){
      var self = this;
      Vue.ajax.send({
        name: "reportManager.getCubeBuildStatus",
        data: {
          jobId:curStep.jobId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            if(data.data.jobStatus=="FINISHED" || data.data.jobStatus=="STOPPED" || data.data.jobStatus=="ERROR" || data.data.jobStatus=="DISCARDED"){
              clearInterval(curStep.timer);
              curStep.jobStatus=data.data.jobStatus;
              // 执行数据准备中，其三步的按钮都被开启
              self.isDisableStepAction(false);
              // 如果有错误，弹出错误提示
              if(data.data.status=="ERROR"){
                self.$Modal.error({
                    title: "立方体任务失败",
                    closable: true,
                    content: data.data
                });
              }
            }
          }else{
            console.log("立方体任务状态定时获取success："+data.message);
          }
        },
        error: function(data) {
          console.log("立方体任务状态定时获取error："+data.message);
        }
      });
    },
    // 查看立方体
    getCube: function() {
      var self = this;
      self.$Modal.success({
          title: "查看立方体",
          closable: true,
          content: "<h5>请前往 <a href='http://172.16.2.104:7070/kylin/models' target='_blank'>http://172.16.2.104:7070/kylin/models <a> 查看</h5>"
      });
    },
    // 填充数据，填充目标医院 填充医院
    fillDataSourceThenUpdateCub: function(curStep){
      var self = this;
      // 执行数据准备中 三步中的任何一步，其三步的按钮都被禁止
      self.isDisableStepAction(true);
      // 当前步骤按钮的任务状态清空；
      curStep.jobStatus="";
      Vue.ajax.send({
        name: "reportManager.fillDataSource",
        data: self.addReportParam,
        success: function(data) {
          //self.step.step3.loading = false;
          if (!!data && data.code == "0") {
            curStep.jobId=data.data.jobId;
            curStep.timer=self.$setInterval(self.getFillDataSourceStatus,2000);
            console.log(curStep.jobId);
          }else{
            // 执行数据准备中，其三步的按钮都被开启
            self.isDisableStepAction(false);
            self.$Modal.error({
                title: "填充数据异常",
                closable: true,
                content: data
            });
          }
        },
        error: function(data) {
          // 执行数据准备中，其三步的按钮都被开启
          self.isDisableStepAction(false);
          self.$Modal.error({
              title: "填充数据失败",
              closable: true,
              content: data
          });
        }
      });
    },
    // 获取 填充任务  状态信息
    getFillDataSourceStatus:function(){
      var self = this;
      Vue.ajax.send({
        name: "reportManager.getSourceDataStatus",
        data: {
          jobId:self.step.step3.jobId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            if(data.data.status=="SUCCESS" || data.data.status=="FAIL"){
              clearInterval(self.step.step3.timer);
              self.step.step3.jobStatus=data.data.status;
              //self.step.step3.loading = false;
              if(data.data.status=="SUCCESS"){
                // 更新立方体
                self.createOrUpdateCube(self.step.step3);
              }else{
                // 如果有错误，弹出错误提示
                self.$Modal.error({
                    title: "填充数据任务失败",
                    closable: true,
                    content: data.data.message
                });
                // 执行数据准备中，其三步的按钮都被开启
                self.isDisableStepAction(false);
                console.log("填充数据任务状态定时获取success："+data.message);
              }
            }
          }else{
             console.log("填充数据任务状态定时获取success："+data.message);
          }
        },
        error: function(data) {
           console.log("填充数据任务状态定时获取error："+data.message);
        }
      });
    },
    // 创建报告  Button 
     step5Action: function() {
      var self = this;
      self
        .validateForm("reportForm")  // 报告类型 校验
        .then(function(data) {
          self.createReport();
        })
        .catch(function(data) {
          console.log(data);
        });
    },
    // 创建报告 操作
    createReport: function() {
      var self = this;
      console.log("self.addReportParam", self.addReportParam);
      self.step.step5.loading = true;
      // 如果是报告数据类型是医院，则必须导入医院信息
      if (self.report.reportType==5 && self.hospitalFillList.items.length < 1) {
        self.step.step5.loading = false;
        self.$Modal.error({
            title: "错误",
            closable: true,
            content: "<h5>请导入医院模板信息！</h5>"
        });
      }else{
        Vue.ajax.send({
          name: "reportManager.isCreateReport",
          data: self.addReportParam,
          success: function(data) {
            if (!!data && data.code == "0") {
              // 满足创建条件
              if(data.data.isAdd){
                self.createReportSend();
              }else{
                self.step.step5.loading = false;
                self.$Modal.error({
                  title: "禁止创建",
                  closable: true,
                  content: data.data.errorMsg
              });
              }
            }else{
              self.step.step5.loading = false;
              self.$Modal.error({
                  title: "报告验证异常",
                  closable: true,
                  content: data.message
              });
            }
          },
          error: function(data) {
            self.step.step5.loading = false;
            self.$Modal.error({
                title: "报告验证失败",
                closable: true,
                content: data.message
            });
          }
      });
      }
    },
    // 创建报告请求
    createReportSend(){
      var self = this;
      Vue.ajax.send({
          name: "reportManager.createReport",
          data: self.addReportParam,
          success: function(data) {
            self.step.step5.loading = false;
            if (!!data && data.code == "0") {
              // 调用后台任务生成PDF,如果成功会跳转页面
              self.createPDF();
            }else{
              self.$Modal.error({
                title: "创建报告异常",
                closable: true,
                content: data.message
            });
            }
          },
          error: function(data) {
            self.step.step5.loading = false;
            self.$Modal.error({
                title: "创建报告失败",
                closable: true,
                content: data.message
            });
          }
      });
    },
    // 后台生成PDF任务，成功 跳转页面
    createPDF: function(){
      var self = this;
      Vue.ajax.send({
        name: "reportManager.createPDF",
        data: self.addReportParam,
        success: function(data) {
          if (!!data && data.code == "0") {
            console.log("后台生成PDF任务");
            // 页面跳转
            self.$router.push({
                path: "/reportManager/reportManager"
            });
          } else {
            self.$Modal.error({
              title: "后台生成PDF任务异常",
              closable: true,
              content: data.message
            }); 
          }
        },
        error: function(data) {
          self.$Modal.error({
              title: "后台生成PDF任务调用失败",
              closable: true,
              content: data.message
          });
        }
      });
    },
    getSampleList() {
      var self = this;
      Vue.ajax.send({
        name: "sample.list",
        data: { 
          pageIndex: 1, 
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.sampleList = data.data.dataList;
            console.log("sampleList", self.sampleList);
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getHospitalList() {
      var self = this;
      Vue.ajax.send({
        name: "hospital.old.list",
        data: {
          pageIndex: 1,
          pageSize: 9999999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.hospitalList = data.data.dataList;
            console.log(self.hospitalList);
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getTemplateList(cb) {
      var self = this;
      Vue.ajax.send({
        name: "reportManager.template.list",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.templateList = data.data;
            console.log("templateList", self.templateList);
            if (cb) {
              cb();
            }
          } else {
          }
        }
      });
    },
    getProvinceList() {
      var self = this;
      Vue.ajax.send({
        name: "city.provinceList",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.provinceList = data.data.dataList;
          } else {
          }
        }
      });
    },
    goToNext() {
      var self = this;
      console.log("xaiyibu ");
      self
        .validateForm("step0form")
        .then(function(data) {
          self.getTemplateList(() => {
            self.isPrepare = false;
          });
        })
        .catch(function(data) {
          console.log(data);
        });
    },
    validateForm: function(formId) {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.$refs[formId].validate(valid => {
          if (valid) {
            resolve(formId);
          } else {
            reject(formId + " validate error");
          }
        });
      });
    },
    analyseDataFill: function(file) {
      var self = this;
      excel.ReadCSV(file).then(
        function(data) {
          console.log(data);
          self.checkDataFill(data);
        },
        function(err) {}
      );
      return false;
    },

    checkDataFill: function(list) {
      var self = this;
      if (list.length > 1) {
        for (var i = 1; i < list.length; i++) {
          var data = list[i];
          if (data.length != 4) {
            continue;
          }
          var targetHospitals = self.hospitalList.filter(
            item => item.hospitalNo == data[0].value
          );
          if (targetHospitals.length == 0) {
            continue;
          }
          if (data[1].value.length != 6 || !self.isNumber(data[1].value)) {
            continue;
          }
          var sourceHospitals = self.hospitalList.filter(
            item => item.hospitalNo == data[2].value
          );
          if (sourceHospitals.length == 0) {
            continue;
          }
          if (data[3].value.length != 6 || !self.isNumber(data[3].value)) {
            continue;
          }
          var newObj = {
            targetHospId: targetHospitals[0].hospitalId,
            targetMonth: data[1].value,
            fillHospId: sourceHospitals[0].hospitalId,
            fillMonth: data[3].value
          };
          console.log(newObj);
          self.addHeader(newObj);
        }
      }
    },
    
    analyseHospital: function(file) {
      var self = this;
      excel.ReadCSV(file).then(
        function(data) {
          self.checkHospital(data);
        },
        function(err) {}
      );
      return false;
    },
    checkHospital: function(list) {
      var self = this;
      if (list.length > 1) {
        for (var i = 1; i < list.length; i++) {
          var data = list[i];

          var hosp = self.hospitalList.filter(
            item => item.hospitalNo == data[0].value
          );
          if (hosp.length == 0) {
            continue;
          }
          var newObj = {
            hospitalId: hosp[0].hospitalId
          };
          self.hospitalFillList.items.push(newObj);
          console.log(self.hospitalFillList);
        }
        console.log("over");
      }
    },
    isNumber: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }
};
</script>
<style scoped>
>>> .start-month-label.ivu-form-item .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}
.ivu-form {
  padding: 20px 0 20px 50px;
}
.form-head {
  background: #ebebeb;
  color: #464574;
  text-align: center;
  border-left: 1px solid #dcdee2;
  border-top: 1px solid #dcdee2;
}
.form-head div {
  font-weight: bold;
  border-right: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
}
.form-body {
  text-align: center;
  border-left: 1px solid #dcdee2;
  border-top: 1px solid #dcdee2;
  margin-bottom:0;
}
.form-body > div {
  border-right: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
  padding: 3px 0;
}
.time-vertical {
  list-style-type: none;
}
.time-vertical li.time-element {
  /* float:left; */
  width: 100%;
  position: relative;
  min-height: 100px;
}
.time-vertical li.time-element b.time-line {
  background: linear-gradient(to bottom, #ebebeb, green);
  background: -webkit-linear-gradient(to bottom, #2c3b4e, #4a688a, #2c3b4e);
  background: -o-linear-gradient(to bottom, #2c3b4e, #4a688a, #2c3b4e);
  background: -moz-linear-gradient(to bottom, #2c3b4e, #4a688a, #2c3b4e);
  background: -mos-linear-gradient(to bottom, #2c3b4e, #4a688a, #2c3b4e);
}

.time-vertical li.time-element:not(:last-child) b.time-line {
  height: calc(100% - 1px);
  width: 2px;
  left: 10px;
  top: 21px;
  float: left;
  position: absolute;
}
.grow {
  height: calc(0% - 1px);
  transition: height 2s;
  -moz-transition: height 2s;
  -webkit-transition: height 2s;
  -o-transition: height 2s;
}

.time-vertical li.time-element .time-title {
  color: black;
  margin-left: 5px;
}
.time-vertical li.time-element .time-body {
  height: 100%;
  width: 100%;
}

.time-vertical li.time-element span.time-step {
  width: 30px;
  height: 30px;
  padding: 0.21em 0.66em;
  background-color: #ebebeb;
  z-index: 992;
  border-radius: 4em;
  border: 1px solid grey;
}
.cellLength {
  width: 90%;
}
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 30px;
        position: relative;
        border: 1px solid #eee;
    }
.tip-content{
  padding-left: 12px;
  font-size: 6px;
  color: #b8b8b8;
}
</style>
