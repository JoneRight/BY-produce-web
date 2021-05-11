<template>
    <div class="bg-white m15">
        <loadingUpload v-if="isloading" class="ivu-modal-mask" style="width:100%;height:100%;z-index: 9999;background-color: rgba(20,20,20,.2);text-align:center;line-hight:100%" />
        <h2 class="common-title">新增代上报</h2>
        <div class="bg-white m15" v-authorize="'fileuploadinsteadadd'">
            <div class="report-message" >温馨提示：<br/>
                1.要求医院上报数据的标准命名为“业务类型代码-医院编码-数据年月”（例如：GY-1100001-201809）<br/>
                2.支持后缀为{{fileTypes.join(',')}}格式的文件<br/>
                3.每次上传最大的文件大小为800M,每次最多选择100个文件.
                <Button type="primary" v-show="step==1" size="large" style="float:right;margin-top:-50px;margin-right:30px;" to="/report/replace">返回列表</Button>
                <Button type="primary" v-show="step==2" size="large" style="float:right;margin-top:-50px;margin-right:30px;" @click="reset">重新代上报</Button>
            </div>
            <div class="report-rate step1" v-show="step==1">
                    <div class="text-center">
                        <img src="../../assets/img/file_type.png"><br>      
                        <div style="text-align:center;" class="mt20"> 
                            <Upload multiple action="" :before-upload='handleUpload'  :style="selectFiles.length?'width:50%;text-align:right;float:left;':''" :accept="fileTypes.join(',')">
                                <Button type="success" size="large" :disabled="loading" style="width:200px;margin-right:50px;">选择上报文件</Button>
                            </Upload>
                            <Button type="info" v-show="selectFiles.length>0" :disabled="loading || selectFiles.length==0" size="large" @click="startUpload" style="float:left;width:200px; ">开始上传文件</Button>
                        </div>
                        <table v-show="step==1 && selectFiles.length>0" class="common-table mt20" style="display:inline-table;">
                            <tr style="background:#ebebeb;height:30px;">
                                <td>序号</td>
                                <td style="text-align:left;">文件名</td>
                                <td>文件大小</td>
                                <td>操作</td>
                            </tr>
                            <tr v-for="(item,index) in selectFiles" :key="'file_'+item.name">
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
                        
                        
                    </div>
            </div>
            <div  v-show="step==2" class="step2">
                <div style="padding:0 150px;">
                    <div>
                        <ProgressBar :label="totalPercent.percent+'%'" :active="totalPercent.percent<100" :status="totalPercent.status" :progress='totalPercent.percent' ></ProgressBar>
                    </div>
                    <div v-if="timeLimit!=null" style="position:relative;right:-100px;float:right;margin-top:-20px;" class="msg-blue">（{{freeSeconds}}）</div>
                </div>
                <table  class="common-table mt30" style="display:inline-table;">
                        <tr style="background:#ebebeb;height:30px;">
                            <td>序号</td>
                            <td style="text-align:left;">文件名</td>
                            <td style="text-align:left;">文件编号</td>
                            <td>文件大小</td>
                            <td>上传进度</td>
                            <td>上传结果</td>
                        </tr>
                        <tr v-for="(item,index) in uploadFiles" :key="'file_'+item.name">
                            <td>{{index+1}}</td>
                            <td style="text-align:left;">{{item.name}}</td>
                            <td style="text-align:left;">{{item.code}}</td>
                            <td>{{item.size/1024>1024?(item.size/1024/1024).toFixed(2)+"MB":(item.size/1024).toFixed(2)+"KB"}}</td>
                            <td> 
                                 <div class="fl"><ProgressBar type="block" :maxLength="item.totalStep" :statuses="getPerStepStatus(item)"></ProgressBar></div>
                                 <div class="fr fr-text" >{{getStepInfo(item)}}</div>
                            </td>
                            <td :class="[{'msg-success':item.complete && item.errorStep<0},{'msg-error':item.complete && item.errorStep>-1}]">{{item.message}}</td>
                        </tr>
                    </table>
            </div>
            </div>
        
    </div>
</template>

<script>
import Vue from "vue";
import ProgressBar from '../common/ProgressBar'
import loadingUpload from '../common/loadingUpload'
export default {
    name: 'replaceRate',
    components:{ProgressBar,loadingUpload},
    data(){
    	return{
            isloading:false,
            step:1,
            loading:false,
            selectFiles:[],
            uploadFiles:[],
            constTime:30*60*1000,//30分钟内上报不结束强制停止
            // totalPercent:{percent:0,status:'default'},
            fileTypes:[".csv",".dbf",".txt",".xls",".xlsx",".rar",".mdb",".accdb",".zip"],
            statusIntervalHandler:null,
            timeLimit:null,
            timeLimitMilliseconds:null,
            timeLimitMillisecondsFree:null,
            cancelToken:null
    	}
    },
    mounted: function() {
        this.loading=false;
        this.isloading=false;
        this.timeLimitMilliseconds=this.constTime;
        this.timeLimitMillisecondsFree=this.constTime;
        var self=this
        /* this.$setInterval(function(){
             if(self.totalPercent.percent=100){
               self.isloading=false;
         }
         },1000)*/
        // this.$setInterval(function(){
        //     self.totalPercent.percent+=10;
        //     if(self.totalPercent.percent>30){
        //         self.totalPercent.status="warn"
        //     }
        //     if(self.totalPercent.percent>60){
        //         self.totalPercent.status="error"
        //     }
        //     if(self.totalPercent.percent>80){
        //         self.totalPercent.status="success"
        //     }
        // },1000)
    },
    computed:{
        totalPercent:function(){
            var self=this;
            var current={percent:0,status:'default',totalStep:0,runStep:0,}
            if(self.uploadFiles.length>0){
                self.uploadFiles.forEach(item=>{
                    current.totalStep+=item.totalStep;
                    current.runStep+=(item.complete?item.totalStep:item.currentStep);
                });
                current.percent=parseInt(100*current.runStep/current.totalStep);
                if(current.percent==100){
                    current.status=self.uploadFiles.some(a=>a.errorStep>-1)?"error":"success";
                }
                else{
                    current.status=self.uploadFiles.some(a=>a.errorStep>-1)?"warn":"default";
                }
            }
            return current;
        },
        freeSeconds:function(){
            var seconds=this.timeLimitMillisecondsFree/1000;
            return parseInt(seconds/60)+":"+(seconds%60+"").addLeftPadding('0',2);
        }
    },
    methods: {
        beginUpload(){
            var file={};
            for (var i =0; i < this.selectFiles.length; i++) {
                file['file['+i+"]"]=this.selectFiles[i];
            }
            file['uploadUserId']=Vue.getUser().userId;
            var self = this;
            self.startTimeoutHandler(); 
            Vue.ajax.send({
                name: 'replace.uploadFile',
                formData: true,
                data: file,
                success: function(data) {
                    self.loading=false;
                    if (data.code=='0') {
                        if(self.timeLimit==null){
                            return;
                        }
                        var res=data.data.rlt,fileCode=[];
                        if(data.data.errorFiles){
                            Object.keys(data.data.errorFiles).forEach(key=>{
                                var cur=self.uploadFiles.find(a=>a.name==key);
                                if(cur){
                                    cur.errorStep=1;
                                    cur.currentStep=1;
                                    cur.complete=true;
                                    cur.message=data.data.errorFiles[key];
                                } 
                            });
                        }
                        for(var i=0;i<res.length;i++){
                            var cur=self.uploadFiles.find(a=>a.name==res[i].fileName);
                            if(cur){
                                cur.currentStep=1;
                                cur.code=res[i].serverResult.fileCode;
                                fileCode.push(res[i].serverResult.fileCode)
                            }
                        }
                        
                        self.startStatusHandler();
                        self.stepUpdate();
                      
                    } else {
                        self.$Modal.error({
                            title: '上报错误',
                            content: "<div style='word-break:break-all;'>"+(data.message || "上传过程中遇到问题，请重试")+"</div>",
                            scrollable:true
                        });
                    }
                },
                error:function(){
                    self.loading=false;
                },
                cancel:function(c){
                    self.cancelToken=c;
                }
            });      
        },
        stopStatusHandler(){
            var self = this;
            if(self.statusIntervalHandler!=null){
                clearInterval(self.statusIntervalHandler);
                self.statusIntervalHandler=null;
            }
        },
        startStatusHandler(){
            var self = this;
            self.stopStatusHandler();
            self.statusIntervalHandler = self.$setInterval(function(){self.stepUpdate()},2000);
        },
        startTimeoutHandler(){
            var self = this;
            self.stopTimeoutHandler();
            self.timeLimit=self.$setInterval(function(){
                if(!self.uploadFiles.every(m=>m.complete==true)){
                        self.timeLimitMillisecondsFree-=1000;
                        if(self.timeLimitMillisecondsFree<=0){
                            self.uploadFiles.filter(m=>m.complete==false).forEach(m=>{
                                m.errorStep=m.currentStep;
                                m.message="页面请求超时（30分钟）";
                                m.complete=true;
                            });
                            self.stopStatusHandler();
                            self.stopTimeoutHandler();
                            self.isloading=false;
                        }
                }
                else{
                    if(self.totalPercent.percent=100){
                         self.isloading=false;
                    }
                }
            },1000);
        },
        stopTimeoutHandler(){
            var self = this;
            if(self.timeLimit!=null){
                clearInterval(self.timeLimit);
                self.timeLimit=null;
                self.timeLimitMilliseconds=self.constTime;
                self.timeLimitMillisecondsFree=self.constTime;
                if(self.cancelToken){
                    self.cancelToken();
                    self.cancelToken=null;
                }
            }
        },
        stepUpdate(){
            var self = this;
            var fileCodes=self.uploadFiles.filter(m=>m.complete==false).map(m=>m.code);
            if(fileCodes.length==0){
                self.stopStatusHandler();
                return false;
            }
            Vue.ajax.send({
                name: "replace.uploadSpeed",
                data: {fileNos:fileCodes},
                success: function(data) {
                if (!!data && data.code=='0') {
                    data.data.forEach(cData=>{
                        var fileCode=cData.serverResult.fileCode;
                        var step=self.uploadFiles.find(m=>m.code==fileCode);
                        if(step){
                            if(cData.serverResult.code=='UPLOAD_SUCCESS'){
                                step.currentStep=1;
                            }else if(cData.serverResult.code=='UPLOAD_ERROR'){
                                step.currentStep=1;
                                step.errorStep=1;
                                step.complete=true;
                                step.message=cData.serverResult.message;
                            }else if(cData.serverResult.code.indexOf('COMPRESS')>=0 && cData.serverResult.code.indexOf('SUCCESS')>=0){
                                step.currentStep=2;
                            }else if(cData.serverResult.code=='ZIP_ERROR'||cData.serverResult.code=='RAR_ERROR' || (cData.serverResult.code.indexOf('COMPRESS')>=0 && cData.serverResult.code.indexOf('ERROR')>=0)){
                                step.currentStep=2;
                                step.errorStep=2;
                                step.complete=true;
                                step.message=cData.serverResult.message;
                            }else if(cData.serverResult.code=='FILE_SUCCESS'){
                                step.currentStep=4;
                                step.complete=true;
                                step.message="上报成功！";
                            }else if(cData.serverResult.code.indexOf('_ERROR')>=0 || cData.serverResult.code.indexOf('ERROR_')>=0){
                                step.currentStep=3;
                                step.errorStep=3;
                                step.complete=true;
                                step.message=cData.serverResult.message;
                            }else{
                                step.currentStep=3;
                            }
                            
                        }
                    });
                      
                }else{
                    self.stopStatusHandler();
                    self.stopTimeoutHandler();
                    self.uploadFiles.forEach(item=>{
                        item.complete=true;
                        item.errorStep=item.currentStep;
                        item.message='未识别的问题';
                    });
                    self.isloading=false;
                }
                }
            });
        },
        handleUpload(file){
            if(this.selectFiles.length>99){
                this.$Modal.error({
                    title: '每次上报最多支持100个文件'
                });
                return false;
            }
            if(file.size/1048576>800){
                this.$Modal.error({
                    title: file.name+'文件过大'
                });
                return false;
            }
            if((this.selectFiles.map(m=>m.size).reduce(function(a,b){return a+b;},0)+file.size)/1048576>800){
                this.$Modal.error({
                    title: file.name+'文件过大'
                });
                return false;
            }
            var hasName=false;
            for(var i=0;i<this.selectFiles.length;i++){            　　
            　　if(this.selectFiles[i].name==file.name){
            　　　　hasName=true
            　　};
            };
            if(!hasName){
                this.selectFiles.push(file);
            }
            return false;
        },
        deleteSelectFile:function(item){
            this.selectFiles=this.selectFiles.filter(m=>m.name!=item.name);
        },
        startUpload(){
            for (var i = 0; i < this.selectFiles.length; i++) {
                if(this.selectFiles[i].name.endsWith(".rar")){
                    this.$Modal.error({
                        title: '错误提示',
                        content: "不支持上传RAR文件，请转换成zip重新上传"
                    });
                    return false;
                }
                if(this.selectFiles[i].size>838860800){
                    self.$Modal.error({
                        title: '错误提示',
                        content: '支持上传最大的文件大小为800M，请重新选择'
                    });
                    return false;
                }
            }
            this.loading=true;
            this.isloading=true;
            this.uploadFiles=this.selectFiles.map(item=>{
                var temp={
                    code:"",
                    name:item.name,
                    size:item.size,
                    totalStep:4,
                    currentStep:0,
                    complete:false,
                    message:"",
                    errorStep:-1
                }
                return temp;
            })
            this.step=2;
            this.beginUpload();  
                    
        },
        getPerStepStatus:function(step){
            var arr=[];
            for(var i=1;i<=step.totalStep;i++){
                if(step.complete && step.errorStep==-1){
                    arr.push({status:"success"})
                }
                else{
                    if(step.currentStep>i){
                        arr.push({status:"default"})
                    }
                    else if(step.currentStep==i && step.errorStep!=step.currentStep){
                        arr.push({status:"default"})
                    }
                    else if(step.currentStep==i && step.errorStep==step.currentStep){
                        arr.push({status:"error"})
                    }
                    else if(step.currentStep<i){
                        arr.push({status:"disabled"})
                    }
                    else{
                        arr.push({status:"error"})
                    }
                }
            }
            return arr;
        },
        reset(){
            this.step=1;
            this.loading=false;
            this.isloading=false;
            this.selectFiles=[];
            this.uploadFiles=[];
            this.stopTimeoutHandler();
            this.stopStatusHandler();
            if(this.cancelToken){
                this.cancelToken();
                this.cancelToken=null;
            }
        },
        getStepInfo(step){
            if(step.currentStep==1){
                return "上传文件";
            }
            if(step.currentStep==2){
                return "杀毒解压";
            }
            if(step.currentStep==3){
                return "校验文件内容";
            }
            if(step.currentStep==4){
                return "上报结果";
            }
            return "准备上传";
        }
    }
};
</script>
<style scoped>
.report-message{
    background: #ededed;
    line-height: 36px;
    padding-left: 10px;
    margin: 15px 0;
    border-left: 15px #ccc solid;
}
.report-rate{
    border: #ededed 1px dashed;
    padding: 50px 0;
}
.result{
    font-size: 16px;
    text-align: center;
    margin-top: 100px;
}
.msg-error{
    color: #ed4014;
}
.msg-success{
    color: #19be6b;
}
.msg-blue{
    color: #2d8cf0;
}
.fr-text{
    color:#d4d2ce;
}
.step2{
    padding:20px 0px;
}


.customLoading{
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.8);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  i{
    color: rgb(32, 160, 255);
    font-size: 30px;
  }
}
</style>