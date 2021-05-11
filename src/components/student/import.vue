<template>
  <div class="pt30">
    <form id="importForm">
      <div class="right-type">       
        <div class="detail-group">
          <label><span class="error">*</span>上传附件：</label>
          <div class="file-con fileUpload">
            <input type="file" id="template" v-on:change="tirggerFile($event)" accept="application/xls" />
            <input type="text" class="form-control" v-model="templateName" name="templateName"  placeholder="文件格式仅支持（ *.xls ）且每次导入数据不能超过100条！"/>
            <input type="hidden" v-model="template" />
            <a href="javascript:;">选择文件</a>
          </div>
        </div>
        
        <div class="detail-btn text-center">
          <a href="javascript:;" class="btn btn-add btn-lg" v-on:click="importStudent">提交</a>
          <a href="javascript:;" class="btn btn-gray btn-lg" v-on:click="$parent.close">取消</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      clazzList: [],
      template:"",
			templateName:""
      
    }
  },
  mounted: function() {
    $('#importForm').validate({
      rules: {
        templateName: {
          required: true,
        }
      },
      messages: {
        templateName: {
          required: "请选择文件",
        }
      }
    });
    
  },
  methods: {
    /* 获取附件实体和文件名 */
    tirggerFile: function(event) {
      var fileBody = event.target.files;
      this.templateName = fileBody[0].name;
      this.template = fileBody[0];
    },
    /* 导入学生 */
    importStudent: function() {
      if ($("#importForm").valid()) {
        var self = this;
        var obj = {};
        if (self.template) {
          obj.template = self.template;
          var name = obj.template.name;
          var suffix = name.substring(name.length-3,name.length);
          if(suffix!='xls'){
            Vue.showErrorPopup("文件格式不正确，您选择的文件是：“"+name+"”，请重新选择！");
            return;
          }
        }

        var loadingPop = Vue.showLoadingPopup("正在导入……");
        Vue.ajax.send({
          name: 'student.import',
          formData: true,
          data: obj,
          timeout : 5000,
          success: function(data) {
            //关闭等待窗口
            loadingPop.close();
            if ((data && data.isSuccess)||(data.result==null)) {
              Vue.showAlertPopup("导入成功！");
              //刷新学员列表页面
              self.$router.push("/student");
            } else {
              if(!isNaN(data.msg)){
                Vue.showErrorPopup("导入失败！每次导入的数据不能超过"+data.msg+"条。");
              }else{
                var existStudentNo="";
                if(data.result.existStudentNoList){
                  existStudentNo="已存在的学号：";
                  data.result.existStudentNoList.forEach(function(student, index) {
                    existStudentNo+=student.studentNo+"，";
                  });
                  existStudentNo=existStudentNo.substring(-1,existStudentNo.length-1)+"；";
                }
                var existEMail="";
                if(data.result.existStudentE_MailList){
                  existEMail="已存在的邮箱：";
                  data.result.existStudentE_MailList.forEach(function(student, index) {
                    existEMail+=student.email+"，";
                  });
                  existEMail=existEMail.substring(-1,existEMail.length-1)+"；";
                }
                var notExistClassName="";
                if(data.result.notExistClassNameStudentList.length>0){
                  notExistClassName = "不存在的班级：";
                  data.result.notExistClassNameStudentList.forEach(function(student, index) {
                    notExistClassName+=student.className+"，";
                  });
                  notExistClassName=notExistClassName.substring(-1,notExistClassName.length-1)+"；";
                }
                Vue.showErrorPopup("导入失败！"+data.msg+"   "+existStudentNo+existEMail+notExistClassName+"请检查！");
              }
            }
          }
        });
      }
    }
  }
}
</script>
<style scoped>
.pt30{
  padding-top: 30px;
}
.file-info{
  width: 420px;
  margin-left: 100px;
  color: #999
}
</style>