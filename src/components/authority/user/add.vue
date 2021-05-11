<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title" v-show="type==1">编辑用户信息</h2>
        <h2 class="common-title" v-show="type==''|| type==2">新增用户信息</h2>
        <div class="mt20" style="width:700px">
                <Form  ref="userForm" :model="userFormAdd" :rules="ruleValidate" :label-width="120">
                    <Input type="hidden" v-model="userFormAdd.userId" v-show="type==1"/>
                    <FormItem label="登录账号" prop="loginName">
                        <Input v-model.trim="userFormAdd.loginName" v-show="type==''|| type==2"  :maxlength="50"  />
                        <Label v-show="type==1">{{ userFormAdd.loginName }}</Label>
                    </FormItem>
                    <FormItem label="用户名" prop="userName">
                        <Input v-model.trim="userFormAdd.userName" :maxlength="50"  />
                    </FormItem>
                    <FormItem  v-show="type==''|| type==2" label="登录密码" prop="loginPassword">
                        <Input v-model.trim="userFormAdd.loginPassword" :maxlength="32"  />
                    </FormItem>
                    <FormItem label="用户类型" prop="userType">
                        <Select v-model="userFormAdd.userType">
                             <Option v-for="item in userTypeList" :value="item.userType" :key="item.userType">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="性别" prop="gender">
                        <Select v-model="userFormAdd.gender">
                            <Option :value="0" :key="0">男</Option>
                            <Option :value="1" :key="1">女</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="职位">
                        <Input v-model.trim="userFormAdd.position" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="住址">
                        <Input v-model.trim="userFormAdd.address" :maxlength="30"  />
                    </FormItem>
                    <FormItem label="邮箱" prop="email">
                        <Input v-model.trim="userFormAdd.email" :maxlength="100" />
                    </FormItem>
                    <FormItem label="专业">
                        <Input v-model.trim="userFormAdd.specialty" :maxlength="30"    />
                    </FormItem>
                    <FormItem label="职称">
                        <Input v-model.trim="userFormAdd.title" :maxlength="30"    />
                    </FormItem>
                    <FormItem label="办公电话">
                        <Input v-model.trim="userFormAdd.officPhone" :maxlength="30"    />
                    </FormItem>
                    <FormItem label="手机" prop="mobile">
                        <Input v-model.trim="userFormAdd.mobile" :maxlength="11" />
                    </FormItem>
                    <FormItem label="传真" >
                        <Input v-model.trim="userFormAdd.fax" :maxlength="30"    />
                    </FormItem>
                    <FormItem>
                        <Button @click="cancel">取消</Button>
                        <Button type="primary" v-show="type==''|| type==2" @click="addUserInfo()">保存</Button>
                        <Button type="primary" v-show="type==1" @click="editUserInfo()">保存</Button>
                    </FormItem>
                </Form>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import config from '../../../config';
export default {
  name: "userAdd",
  data() {
      //邮箱验证
      const validateEmail = (rule, value, callback) => {
            var reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的邮箱'));
            } else {                
                callback();
            }
        };
      //手机号验证
      const validatePhone = (rule, value, callback) => {
            var reg=/^0?1[3|4|5|8][0-9]\d{8}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {                
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            var reg=/^[0-9a-zA-Z\_]{6,18}$/;
            if (!reg.test(value)) {
                callback(new Error('密码由6-18位的数字、字母、下划线组成'));
            } else {                
                callback();
            }
        };
        return {
            userFormAdd: {
                loginName: "",
                userName: "",
                createUser: Vue.getUser().userName,
                position: "",
                title: "",
                address: "",
                specialty: "",
                officPhone: "",
                fax: "",
                userType: ""
            },
            userId: "",
            type: '',
            deptList: [],
            systemList: [],
            userTypeList: [],
            ruleValidate: {
                loginName: [
                    { required: true, message: "用户账号不能为空", trigger: "blur" }
                ],
                userName: [
                    { required: true, message: "用户名不能为空", trigger: "blur" }
                ],
                userType: [
                    { required: true, message: "用户类型不能为空", trigger: "blur"}
                ],
                loginPassword: [
                    { required: true, message: "登录密码不能为空", trigger: "blur" },
                    { validator: validatePass, trigger: 'blur'}
                ],
                gender: [
                    { required: true, message: "请选择性别", trigger: "blur", type:'number'}
                ],
                email: [
                    { required: true, message: "邮箱不能为空", trigger: "blur" },
                    { validator: validateEmail, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: "手机号不能为空", trigger: "blur" },
                    { validator: validatePhone, trigger: 'blur'}
                ]
            }
        }
  },
  mounted() {      
        if (this.$route.query.type != undefined && this.$route.query.type != "") {
            this.type = this.$route.query.type;
            if (this.$route.query.type == 1) {
                this.userId = this.$route.query.Id;
                //如果是编辑，获取用户信息
                this.getUserInfo();
            }
            
            //获取系统列表
            this.getSystemList();
            //获取用户类型
            this.getUserTypeList();
            
        }
  },
  methods: {
      getSystemList() {
            var self = this;
            Vue.ajax.send({
                name: 'system.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //接口数据
                        self.systemList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
        getUserTypeList() {
            var self = this;
            Vue.ajax.send({
                name: 'user.userTypeList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //接口数据
                        self.userTypeList = data.data;

                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
    getdeptList(value) { 
      var self = this;
      Vue.ajax.send({
        name: "dept.list",
        data: {
          pageIndex: 1,
          pageSize: 99999,
          systemId: value
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            //接口数据
            self.deptList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getUserInfo() {
      var self = this;
      Vue.ajax.send({
        name: "user.detail",
        data: {
          userId: self.userId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
             self.userFormAdd = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    cancel() {
      this.$router.push("/authority/user/list");
    },
    editUserInfo() {
      this.userFormAdd.loginPassword = "111111";
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: 'user.edit',
            data: {
                userId: self.userId,
                userName: self.userFormAdd.userName,
                loginName: self.userFormAdd.loginName,
                userType: self.userFormAdd.userType,
                gender: self.userFormAdd.gender,
                position: self.userFormAdd.position,
                age: self.userFormAdd.age,
                address: self.userFormAdd.address,
                deptId: self.userFormAdd.deptId,
                email: self.userFormAdd.email,
                specialty: self.userFormAdd.specialty,
                title: self.userFormAdd.title,
                officPhone: self.userFormAdd.officPhone,
                mobile: self.userFormAdd.mobile,
                fax: self.userFormAdd.fax,
                systemId: config.systemId,
                updateUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$router.push("/authority/user/list");
                self.$Message.success("编辑用户信息提交成功！");
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
  },
    addUserInfo() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: 'user.add',
            data: {
                userName: self.userFormAdd.userName,
                loginName: self.userFormAdd.loginName,
                loginPassword: self.userFormAdd.loginPassword,
                userType: self.userFormAdd.userType,
                gender: self.userFormAdd.gender,
                position: self.userFormAdd.position,
                age: self.userFormAdd.age,
                address: self.userFormAdd.address,
                email: self.userFormAdd.email,
                specialty: self.userFormAdd.specialty,
                title: self.userFormAdd.title,
                officPhone: self.userFormAdd.officPhone,
                mobile: self.userFormAdd.mobile,
                fax: self.userFormAdd.fax,
                systemId: config.systemId,
                createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$router.push("/authority/user/list");
                self.$Message.success("新增用户信息提交成功！");
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    }
  }
};
</script>