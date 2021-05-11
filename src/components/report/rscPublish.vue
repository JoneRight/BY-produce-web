<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left: 7px;" v-show="type==''">新增资源</h2>
        <h2 class="common-title" style="margin-left: 7px;" v-show="type!=''">资源详情</h2>
        <div class="mt20">
            <Form :label-width="80" :model="rscForm" ref="rscForm" :rules="rscValidate">
                <FormItem label="标题" prop="title">
                    <Label v-show="type==1">{{rscForm.title}}</Label>
                    <Input v-show="type==''|| type==2" v-model="rscForm.title" style="width: 50%" :maxlength="40"></Input>
                </FormItem>
                <FormItem label="简介" prop="introduction">
                    <Label v-show="type==1">{{rscForm.introduction}}</Label>
                    <Input type="textarea" v-show="type==''|| type==2" :rows='3' v-model="rscForm.introduction" style="width: 50%" :maxlength="200"></Input>
                </FormItem>
                <FormItem label="内容">
                    <Label v-show="type==1" v-html="rscForm.content"></Label>
                    <tinymce @editorInit="editorInit" id="tinymce" :plugins="plugins" :toolbar1="toolbar1" v-show="type==''|| type==2" v-model="rscForm.content"  :other_options="lanCN"></tinymce>
                </FormItem>
                <FormItem label="发布时间" v-show="type==1">
                    <Label>{{rscForm.createTime}}</Label>
                </FormItem>
                <FormItem label="下载量" v-show="type==1">
                    <Label>{{rscForm.readCount}}</Label>
                </FormItem>
                <FormItem label="附件" v-show="type==1">
                    <Label v-if="rscForm.attachments&&rscForm.attachments.length>0">{{rscForm.attachments[0].attachmentName}}</Label>
                    <Label v-else>无</Label>
                </FormItem>
                <FormItem label="附件" v-show="type!=1">
                    <Upload action="" :before-upload='handleUpload'>
                        <Input readonly v-model="file.name" style="width: 200px" :placeholder="(rscForm.attachments&&rscForm.attachments.length>0)?rscForm.attachments[0].attachmentName:''"></Input>
                        <Button type="success">选择附件</Button><Button type="error" class="ml20" v-on:click.stop="clearAttach" v-if="(rscForm.attachments&&rscForm.attachments.length>0) || file.name!=undefined ">删除附件</Button>
                    </Upload>
                </FormItem>
                <FormItem>
                    <Button type="default" to="/report/resource">返回列表</Button>
                    <Button type="primary" :disabled="saving" v-show="type!=1" @click="saveRec">保存</Button>
                    <Button type="primary" @click="type=2" v-show="type==1" v-authorize="'resourceedit'">编辑</Button>
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
                introduction:'',
                content:'',
                fileName:''
            },
            Id:'',
            type:'',
            file:[],
            rscValidate:{
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur'}
                ],
                introduction:[
                    { required: true, message: '简介不能为空', trigger: 'blur'}
                ],
            },
            lanCN: {
                language_url: '../../static/tinymce/js/zh_CN.js',
                height: 400,
                content_style:'p{font-size:12px; }',
                // 隐藏显示的各个组件，极简化
                menubar:false,
                branding:false,
                toolbar:false,
                statusbar:false
            },
            saving:false,
            toolbar1:'',
            plugins:[],
            // toolbar1:' fontselect fontsizeselect | bold italic strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link image | ',
            // plugins:['autolink lists link image charmap anchor pagebreak', 'searchreplace wordcount code', 'insertdatetime media nonbreaking save table contextmenu directionality','template paste textcolor colorpicker textpattern toc emoticons hr codesample'],
            images_upload_handler: function(blobInfo, success, failure) {
                // console.log('11111')
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
    },
    methods: {
        editorInit:function(){
            if(this.type!=''){
                this.getRscDetail();
            }
        },
        getRscDetail(){
            var self=this;
            Vue.ajax.send({
                name: 'resource.detail',
                data:{
                    resourceId:self.Id,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.rscForm=data.data;
                        self.attachments=self.rscForm.attachments;
                        console.log(self.rscForm)
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
                this.$router.push("/report/resource");
            }else{
                this.type=1;
                this.$refs.rscForm.resetFields();
            }
        },
        handleUpload(file){
            this.file=file;
            this.rscForm.attachments=[];
            return false;
        },
        clearAttach:function(){
            this.rscForm.attachments=[];
            this.file=[];
        },
        saveRec(){
            var self=this;
            this.$refs['rscForm'].validate((valid) => {
                if (valid) {
                    this.saving=true;
                    var name='resource.add';
                    var obj={
                            title:self.rscForm.title,
                            introduction:self.rscForm.introduction,
                            content: self.rscForm.content,
                            file: self.file,
                            createUser:Vue.getUser().userName
                        }
                    if(self.type=="2"){
                         
                        name='resource.edit';
                        obj={
                            resourceId:self.Id,
                            title:self.rscForm.title,
                            introduction:self.rscForm.introduction,
                            content: self.rscForm.content,
                            file: self.file,
                            updateUser:Vue.getUser().userName
                        }
                        if(self.rscForm.attachments && self.rscForm.attachments.length>0){
                            obj["attachmentList[0].attachmentId"]=self.rscForm.attachments[0].attachmentId
                        }
                    }
                    console.log(obj,self.file==null,"111111111111")
                    Vue.ajax.send({
                        name: name,
                        formData: true,
                        data: obj,
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                if(self.type==''){
                                    self.$Message.success(
                                        {
                                            content:'新增资源提交成功！',
                                            duration:1,
                                            onClose:function(){self.$router.push("/report/resource");}
                                        }
                                        );
                                }else{
                                    self.$Message.success('资源编辑成功！');
                                    self.type=1;
                                    self.getRscDetail();
                                }
                                
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                            self.saving=false;
                        },
                        error:function(err){
                            console.error(err)
                            self.$Modal.error({
                                    title: '请求错误',
                                    content: err
                                });
                            self.saving=false;
                        }
                    });
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