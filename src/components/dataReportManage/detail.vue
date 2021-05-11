<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" v-show="type==''">新增数据报告</h2>
        <h2 class="common-title" v-show="type!=''">数据报告详情</h2>
        <h2 class="common-title" v-show="type==3">数据报告新增</h2>
        <div class="mt20">
            <Form :label-width="80" :model="rscForm" ref="rscForm" :rules="rscValidate">
                <FormItem label="标题" prop="title">
                    <Label v-show="type==1">{{rscForm.title}}</Label>
                    <Input v-show="type==''|| type==2  || type==3" v-model="rscForm.title" style="width: 50%" />
                </FormItem>
                <FormItem label="报告类型" prop="reportTypeId">
                    <Label v-show="type==1">{{rscForm.reportTypeName}}</Label>
                    <Select v-show="type==''|| type==2" v-model="rscForm.reportTypeId" class="cellLength" style="width: 50%">
                        <Option v-for="item in reportTypeList" :key="item.id" :value="item.id">{{item.reportTypeName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="摘要">
                    <Label v-show="type==1" v-html="rscForm.summary"></Label>
                    <Input v-show="type==''|| type==2" v-model="rscForm.summary" style="width: 50%" type="textarea" :autosize="{minRows: 2,maxRows: 4}" />
                </FormItem>
                <FormItem label="内容">
                    <Label v-show="type==1" v-html="rscForm.content"></Label>
                    <tinymce id="tinymce" :plugins="plugins" :toolbar1="toolbar1" v-show="type==''|| type==2  || type==3" v-model="rscForm.content"  :other_options="lanCN"></tinymce>
                </FormItem>
                <FormItem label="发布时间" v-show="type==1">
                    <Label>{{rscForm.createTimeStr}}</Label>
                </FormItem>
                <FormItem label="阅读量" v-show="type==1">
                    <Label>{{rscForm.readCount}}</Label>
                </FormItem>
                <FormItem label="下载量" v-show="type==1">
                    <Label>{{rscForm.downloadCount}}</Label>
                </FormItem>
                
                <FormItem label="附件" class="ivu-form-item-required">
                    <Label v-show="type==1">{{file.name}}</Label>
                    <Upload v-show="type==''|| type==2" action="" :before-upload='handleUpload' accept="application/pdf" :format="['pdf']" >
                        <Input readonly v-model="file.name" style="width: 200px" />
                        <Button type="success">选择附件</Button>
                    </Upload>
                </FormItem>
                <FormItem label="附件排版" prop="layout">
                    <Label v-show="type==1">{{rscForm.layoutStr}}</Label>
                    <RadioGroup  v-show="type==''|| type==2" v-model="rscForm.layout">
                        <Radio label="1">横版</Radio>
                        <Radio label="2">竖版</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <Button type="primary" v-show="type!=1" @click="saveRec">保存</Button>
                    <Button type="info" to="/dataReportManage/dataReportManage" v-show="type==1">返回列表</Button>
                    <Button v-authorize="'ReportManageDataReportEdit'" type="primary" @click="type=2" v-show="type==1">编辑</Button>
                    <Button v-show="type!=1" @click="cancel">取消</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>

<script>
import Vue from "vue";
import tinymce from 'vue-tinymce-editor'
Vue.component('tinymce', tinymce)
export default {
    name: 'rscPublish',
    data(){
    	return{   
            rscForm:{
                title:'',
                reportTypeId:'',
                summary:'',
                content:'',
                filePath:''
            },
            file:{},
            reportTypeList:[], // 报告类型列表
            Id:'',
            type:'', // 1查看 2 编辑 ''新增
            rscValidate:{
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur'}
                ],
                reportTypeId: [
                    { required: true, message: '报告类型不能为空', trigger: 'change',type:"number"}
                ],
                layout: [
                    { required: true, message: '报告排版不能为空', trigger: 'blur'}
                ]
            },
            lanCN: {
                language_url: '../../static/tinymce/js/zh_CN.js',
                height: 400,
                content_style:'p{font-size:12px; }'
            },
            toolbar1:' fontselect fontsizeselect | bold italic strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link image | ',
            plugins:['autolink lists link image charmap anchor pagebreak', 'searchreplace wordcount code', 'insertdatetime media nonbreaking save table contextmenu directionality','template paste textcolor colorpicker textpattern toc emoticons hr codesample'],
            images_upload_handler: function(blobInfo, success, failure) {
                console.log('11111')
            }
        }
    },
    mounted: function() {
        if(this.$route.query.Id!=undefined && this.$route.query.Id!=''){
            this.Id=this.$route.query.Id;
        }
        if(this.$route.query.type!=undefined && this.$route.query.type!=''){
           this.type=this.$route.query.type; 
        }
        // 不是新增时，查询数据报告详细
        if(this.type!=''){
            this.getRscDetail();
        }
        // 获取报告类型列表
        this.getReportTypeList();
    },
    methods: {
        handleUpload(file){
            this.file=file;
            return false;
        },
         // 获取报告类型列表
        getReportTypeList(){
            var self=this;
            Vue.ajax.send({
                name: 'reportType.list',
                data:{
                    pageIndex:1,
                    pageSize:99999
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.reportTypeList=data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        // 获取数据报告详细
        getRscDetail(){
            var self=this;
            Vue.ajax.send({
                name: 'dataReport.detail',
                data:{
                    id:self.Id,
                    addReadCount:false
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.rscForm=data.data;
                        self.file.name=data.data.fileName;
                        self.rscForm.filePath = data.data.filePath;
                        // 回显报告排版 RadioGroup 需要将数值型 转换成字符串 才能回显
                        self.rscForm.layout=data.data.layout+'';
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        cancel(){
            if(this.type==''){
                this.$router.push("/dataReportManage/dataReportManage");
            }else{
                this.type=1;
                this.$router.push("/dataReportManage/dataReportManage");
            }
        },
        // 新增数据报告
        saveRec(){
            var self=this;
            console.log(self.file.name);
            this.$refs['rscForm'].validate((valid) => {
                if (valid) {
                    if(!self.rscForm.reportTypeId){
                        self.$Modal.error({
                            title: '',
                            content: '请选择报告类型'
                        });
                    }else if(!self.file.name){
                        self.$Modal.error({
                            title: '',
                            content: '请选择要上传的PDF文件'
                        });
                    }else{
                        var name='dataReport.add';
                        var obj={
                            reportTypeId:self.rscForm.reportTypeId,
                            title:self.rscForm.title,
                            summary:self.rscForm.summary,
                            content: self.rscForm.content,
                            file: self.file,
                            layout:self.rscForm.layout,
                            createUser:Vue.getUser().userName
                        };
                        // 编辑数据报告 
                        if(self.type=="2"){
                            var name='dataReport.edit';
                            var obj={
                                id:self.Id,
                                reportTypeId:self.rscForm.reportTypeId,
                                title:self.rscForm.title,
                                summary:self.rscForm.summary,
                                content: self.rscForm.content,
                                file: self.file,
                                fileName:self.file.name,  // 原有的文件名称，如果有新上传的文件，后台会覆盖此值
                                filePath:self.rscForm.filePath, // 原有的文件路径，如果有新上传的文件，后台会覆盖此值
                                layout:self.rscForm.layout,
                                changeUser:Vue.getUser().userName
                            };
                        };
                        Vue.ajax.send({
                            name: name,
                            formData: true,
                            data: obj,
                            success: function(data) {
                                if (!!data && data.code=='0') {
                                    if(self.type==''){
                                        self.$Message.success('新增数据报告成功！');
                                        self.$router.push("/dataReportManage/dataReportManage");
                                    }else{
                                        self.$router.push("/dataReportManage/dataReportManage");
                                        self.$Message.success('编辑数据报告成功！');
                                        self.type=1;
                                    }
                                    
                                } else {
                                    self.$Modal.error({
                                        title: '',
                                        content: data.message
                                    });
                                }
                            },
                            error:function(err){
                                console.log(err)
                                self.$Modal.error({
                                        title: '网络异常，请重试',
                                        content: err
                                    });
                            }
                        });
                    }
                    
                }
            })
        }
        
    }
};
</script>
<style>
.mce-flow-layout-item.mce-last{
    display: none
}
.mce-content-body *{
    font-size: 12px;
}
.mce-btn button{
    font-size: 12px;
}
.mce-ico{
    font-size: 14px;
    font-weight: 100;
}
</style>