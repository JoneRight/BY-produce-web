<template>
    <div class="bg-white m20">
        <h2 class="common-title">新增代上报</h2>
        <div class="p20" v-authorize="'fileuploadinsteadadd'">
            <div class="report-message">温馨提示：<br/>
                1.要求医院上报数据的标准命名为“业务类型代码-医院编码-数据年月”（例如：GY-1100001-201809）<br/>
                2.支持后缀为{{fileTypes.join(',')}}格式的文件<br/>
                3.支持上传最大的文件大小为800M.
                <Button type="primary" size="large" style="float:right;margin-top:-50px;margin-right:30px;" to="/report/replace">返回列表</Button>
            </div>
            <div class="report-rate">
                <div class="step1" v-show="step==1">
                    <div class="text-center">
                        <img src="../../assets/img/file_type.png"><br>       
                        <Upload multiple action="" :before-upload='handleUpload' class="mt50" :accept="fileTypes.join(',')">
                            <Button type="success" size="large" :disabled="loading" style="width:200px;margin-right:50px;">选择上报文件</Button>　　
                            <Button v-show="file.length>0" type="info" :disabled="loading" size="large" @click="file.length=0" style="width:200px;">重新选择上报文件</Button>
                        </Upload>
                        <div style="width:50%;margin:0 auto;font-size: 16px;line-height: 36px;" class="text-left" v-if="file.length>0">选中的文件: <br><span v-for="item in file">{{ item.name }} 大小：{{(item.size/1048576).toFixed(2)}}MB<br></span></div>
                        <Button class="mt50" type="primary" size="large" :disabled="loading" @click="addOk" v-show="file.length>0">开始上传文件</Button>
                    </div>
                </div>
                <div :class="['step2', {'mt50':currentIndex>0}]" v-show="step==2" v-for="(currentProcess,currentIndex) in processes">
                    <div><Progress :percent="currentProcess.percent" status="active" hide-info  :status="currentProcess.statusProgress"></Progress></div>
                    <div>{{currentProcess.fileName}}</div>
                    <div class="mt25 pl20">
                        <Steps :current="currentProcess.curIndex" :status="currentProcess.status">
                            <Step title="开始"></Step>
                            <Step title="上传文件"></Step>
                            <Step title="杀毒解压"></Step>
                            <Step title="校验文件内容"></Step>
                            <Step title="上报结果"></Step>
                        </Steps>
                    </div>
                    <div class="result error" v-show="currentProcess.status=='error' && currentProcess.percent==100">
                        {{currentProcess.reportResult}} <br><br>
                        <Button size="large" @click="reset">重新上传</Button>
                    </div>
                    <div class="result success" v-show="currentProcess.status=='process' && currentProcess.percent==100">
                        <img src="../../assets/img/success.png" alt="" ><br><br>
                        {{currentProcess.reportResult}} <br><br>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import Vue from "vue";
export default {
    name: 'replaceRate',
    data(){
    	return{
            step:1,
            loading:false,
            reportResult:'',
            percent:0,
            curIndex:0,
            status:'process',
            file:[],
            fileTypes:[".csv",".dbf",".txt",".xls",".xlsx",".rar",".mdb",".accdb",".zip"],
            statusProgress:'normal',
            processes:[],
            processInterval:null,
            timeLimit:null,
            timeLimitMilliseconds:300000//5分钟内上报不结束强制停止
    	}
    },
    mounted: function() {
        this.loading=false;
    },
    methods: {
        update(){
            var file={};
            for (var i =0; i < this.file.length; i++) {
                file['file'+i]=this.file[i];
            }
            file['uploadUserId']=Vue.getUser().userId;
            var self = this;
            Vue.ajax.send({
                name: 'replace.uploadFile',
                formData: true,
                data: file,
                success: function(data) {
                    self.loading=false;
                    if (data.code=='0') {
                        var res=data.data.rlt,fileCode=[];
                        if(data.data.errorFiles){
                            var errStr="";
                                Object.keys(data.data.errorFiles).forEach(key=>{
                                    errStr+=key+":"+data.data.errorFiles[key]+"<br/>"
                                });
                            self.$Modal.error({
                                title: '上报错误',
                                content: "<div style='word-break:break-all;overflow-y:auto;max-height:200px;'>"+errStr+"上报文件不符合要求，已拒绝。可能原因：<br/> 1.文件格式不正确<br/> 2.文件对应医院不存在<br/> 3.上报文件已存在，不可覆盖<br/> 4.请求超时"+"</div>",
                                scrollable:true,
                                
                            });
                            if(res.length==0){
                                return;
                            }
                            
                        }
                        for(var i=0;i<res.length;i++){
                            fileCode.push(res[i].serverResult.fileCode)
                            self.processes.push({
                                fileName:res[i].fileName,
                                fileCode:res[i].serverResult.fileCode,
                                status:"process",
                                statusProgress:"normal",
                                percent:0,
                                curIndex:0,
                                reportResult:""
                            });
                        }
                        if(self.timeLimit!=null){
                            clearTimeout(self.timeLimit)
                        }
                        self.timeLimit=self.$setTimeout(function(){
                            if(!self.processes.every(m=>m.complete==true)){
                                self.processes.filter(m=>m.complete==undefined || m.complete==false).forEach(m=>{
                                    m.status='error';
                                    m.percent=100;
                                    m.statusProgress="wrong";
                                    m.reportResult="页面请求超时（5分钟）";
                                    m.complete=true;
                                });
                                clearInterval(self.processInterval);
                            }
                        },self.timeLimitMilliseconds);

                        self.step=2;
                        self.stepUpdate(fileCode);
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
                }
            });            
        },
        stepUpdate(fileCode){
            var self = this;
            self.processInterval = self.$setInterval(function(){
                Vue.ajax.send({
                  name: "replace.uploadSpeed",
                  data: {fileNos:fileCode},
                  success: function(data) {
                    if (!!data && data.code=='0') {
                        data.data.forEach(cData=>{
                            if(cData.serverResult.code=='UPLOAD_SUCCESS'){
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["percent"]=25;
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=0;
                            }else if(cData.serverResult.code=='UPLOAD_ERROR'){
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=2;
                            }else if(cData.serverResult.code=='UNCOMPRESS_SUCCESS'){
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["percent"]=50;
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=0;
                            }else if(cData.serverResult.code=='ZIP_ERROR'||cData.serverResult.code=='ZIP_ERROR'){
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=3;
                            }else if(cData.serverResult.code=='FILE_SUCCESS'){
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["percent"]=100;
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=0;
                            }else if(cData.serverResult.code.indexOf('_ERROR')>=0 || cData.serverResult.code.indexOf('ERROR_')>=0){
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=4;
                            }else{
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["percent"]=75;
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=0;
                            } 
                            console.log(cData.serverResult.code,JSON.stringify(self.processes));                                           
                            
                            if(self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].curIndex>0){
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].status='error';
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent=100;
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].statusProgress="wrong";
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].reportResult=cData.serverResult.message;
                                self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].complete=true;
                            }else{
                                console.log(self.percent);
                                if(self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent>=25&&self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent<50){
                                    self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=1;
                                }else if(self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent>=50&&self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent<75){
                                    self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=2;
                                }else if(self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent>=75&&self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent<100){                                
                                    self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=3;
                                }else if(self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].percent>=100){
                                    self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["curIndex"]=4;
                                    self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0]["reportResult"]='上报成功！';
                                    self.processes.filter(m=>m.fileCode==cData.serverResult.fileCode)[0].complete=true;
                                }   
                            }
                        });
                        if(self.processes.every(m=>m.complete==true)){
                                console.log("1",self.processes)
                                clearInterval(self.processInterval);
                                clearTimeout(self.timeLimit)
                            }
                    }else{
                        console.log(self.processes)
                        clearInterval(self.processInterval);
                        clearTimeout(self.timeLimit)
                        self.processes.forEach(item=>{
                            item.status='error';
                            item.percent=100;
                            item.statusProgress="wrong";
                            item.reportResult='系统错误，请稍后再试';
                        });
                    }
                  }
                });
                
            }, 2000);
        },
        handleUpload(file){
            if(file.size/1048576>800){
					this.$Modal.error({
                        title: '文件过大'
                    });
					return false;
				}
            if(this.file.length!=0){
                if((this.file.map(m=>m.size).reduce(function(a,b){return a+b;})+file.size)/1048576>800){
                    this.$Modal.error({
                        title: '文件过大'
                    });
					return false;
                }
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

            for (var i = 0; i < this.file.length; i++) {
                if(this.file[i].size>838860800){
                    self.$Modal.error({
                        title: '错误提示',
                        content: '支持上传最大的文件大小为800M，请重新选择'
                    });
                    return false;
                }
            }
            this.loading=true;
            this.processes=new Array();
            this.update();            
        },
        reset(){
            this.step=1;
            this.loading=false;
            this.processes=new Array();
            this.reportResult='';
            this.percent=0;
            this.curIndex=0;
            this.status='process';
            this.file=[];
            this.statusProgress='normal';
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
    padding: 50px;
}
.result{
    font-size: 16px;
    text-align: center;
    margin-top: 100px;
}
.result.error{
    color: #ff9900;
}
.result.success{
    color: #2d8cf0;
}
</style>