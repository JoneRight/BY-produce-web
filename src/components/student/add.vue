<template>
  <div>
    <form id="addForm">
      <div class="right-type">

        <div class="detail-group">
          <label>
            <span class="error">*</span>学员姓名：</label>
          <input v-model.trim="student.realName" name="realName" class="form-control" type="text" maxlength="20" />
        </div>

        <div class="detail-group">
          <label>
            <span class="error">*</span>学员学号：</label>
          <input v-model.trim="student.studentNo" name="studentNo" class="form-control" type="text" maxlength="20" />
        </div>

        <div class="detail-group">
          <label>
            <span class="error">*</span>登&nbsp;&nbsp;录&nbsp;&nbsp;名：</label>
          <input v-model.trim="student.loginName" name="loginName" class="form-control" type="text" maxlength="20" />
        </div>

        <div class="detail-group">
          <label>登录密码：</label>
          <input v-model="student.loginPass" id="loginPwd" name="loginPass" class="form-control"  placeholder="默认密码：123456" type="text" maxlength="20" />
        </div>

        <div class="detail-group">
          <label>性　　别：</label>
          <div class="radio-con"><input v-model="student.gender" value="1" type="radio" checked="checked" />
            <label></label>
          </div>
          <span class="mr20">男</span>
          <div class="radio-con"><input v-model="student.gender" value="2" type="radio" />
            <label></label>
          </div>
          <span>女</span>
        </div>

        <div class="detail-group">
          <label>手&nbsp;&nbsp;机&nbsp;&nbsp;号：</label>
          <input id="phone" name="phone" v-model="student.phone" class="form-control" type="text" maxlength="20" />
        </div>

        <div class="detail-group">
          <label>
            <span class="error">*</span>电子邮箱：</label>
          <input v-model="student.email" name="email" class="form-control" type="text" maxlength="50" />
        </div>

        <div class="detail-group">
          <label>所属班级：</label>
          <div class="form-group">
            <select v-model="student.classId" class="form-control">
              <option value="0">请选择班级</option>
              <option v-for="option in clazzList" :key="option.classId" :value="option.classId">
                {{ option.className }}
              </option>
            </select>
          </div>
        </div>

        <div class="detail-group">
          <label>备　　注：</label>
          <textarea v-model="student.remark" rows="2" id="remark" name="remark" class="form-control" maxlength="100"></textarea>
        </div>

        <div class="detail-btn text-center">
          <a href="javascript:;" class="btn btn-add btn-lg" v-on:click="addStudent">提交</a>
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
      student: {
        loginName: '',
        loginPass: '',
        realName: '',
        studentNo: '',
        gender: 1,
        phone: '',
        email: '',
        classId: 0,
        remark: ''
      }
    }
  },
  mounted: function() {
    var self = this;
    this.loadClazzList();
    //用户名唯一性验证
    $.validator.addMethod("isExistLoginName", function(value, element) {
      var success;
      Vue.ajax.send({
        name: 'student.isexistloginname',
        data: {
          loginName: self.student.loginName
        },
        async: false,
        success: function(data) {
          success = data.result;
        }
      });
      return success;
    }, "用户名重复");
    //学号唯一性验证
    $.validator.addMethod("isExistStudentNo", function(value, element) {
      var success;
      Vue.ajax.send({
        name: 'student.isExistStudentNo',
        data: {
          studentNo: self.student.studentNo
        },
        async: false,
        success: function(data) {
          success = data.result;
        }
      });
      return success;
    }, "学号重复");
    //邮箱唯一性验证
    $.validator.addMethod("isExistEmail", function(value, element) {
      var success;

      Vue.ajax.send({
        name: 'student.isExistEmail',
        data: {
          email: self.student.email
        },
        async: false,
        success: function(data) {
          success = data.result;
        }
      });
      return success;
    }, "邮箱重复");
    $('#addForm').validate({
      errorElement: "div",
      rules: {
        loginName: {
          required: true,
          isChinese: true,
          minlength: 6,
          maxlength: 20,
          isExistLoginName: true
        },
        loginPass: {
          //required: true,
          minlength: 6,
          maxlength: 20
        },
        realName: {
          required: true,
          maxlength: 20
        },
        studentNo: {
          required: true,
          isChinese: true,
          maxlength: 20,
          isExistStudentNo: true,
        },
        phone: {
          maxlength: 20,
          isMobile: true
        },
        email: {
          required: true,
          checkEmail: true,
          maxlength: 50,
          isExistEmail: true,
        },
        remark: {
          maxlength: 100
        }
      },
      messages: {
        loginName: {
          required: "请输入登录名",
          minlength: "登录名长度最小为6个字符",
          maxlength: "登录名长度最大为20个字符",
          isChinese: "登录名不能包含中文及敏感字符",
          isExistLoginName: "该登录名已存在，请更换一个"
        },
        loginPass: {
          //required: "请输入密码",
          minlength: "密码长度最小为6个字符",
          maxlength: "密码长度最大为20个字符"
        },
        realName: {
          required: "请输入学员名称",
          maxlength: "最大长度为20个字符"
        },
        studentNo: {
          required: "请输入学员学号",
          isChinese: "学号不能包含中文及敏感字符",
          maxlength: "最大长度为20个字符",
          isExistStudentNo: "该学号已存在，请更换一个"
        },
        phone: {
          maxlength: "手机号长度最大为20位",
          isMobile: "请输入正确的手机号"
        },
        email: {
          required: "请输入电子邮箱",
          maxlength: "邮箱长度最大为50个字符",
          checkEmail: "请输入正确的邮箱",
          isExistEmail: "该邮箱已存在，请更换一个"
        },
        remark: {
          maxlength: "最大长度为100个字符"
        }
      }
    });
  },
  methods: {
    /* 加载班级列表 */
    loadClazzList: function() {
      var self = this;
      Vue.ajax.send({
        name: 'student.clazzlist',
        data: {
          pageNum: -1,
          pageSie: 1
        },
        success: function(data) {
          if (data != undefined && data != "" && data.code == 200 &&
            data.result && data.result.dataList) {
            self.clazzList = data.result.dataList;
          }
        }
      });
    },
    /* 新增学生 */
    addStudent: function() {
      if ($("#addForm").valid()) {
        var self = this;
        if (self.student.loginPass == "" || self.student.loginPass == null || self.student.loginPass == undefined) {
           self.student.loginPass = "123456";
        }
        Vue.ajax.send({
          name: 'student.add',
          data: self.student,
          success: function(data) {
            if (!!data && data.isSuccess) {
              self.$parent.primary();
              Vue.showAlertPopup("添加成功");
            } else {
              Vue.showErrorPopup("添加失败");
            }
          }
        });
      }
    }
  }
}
</script>
