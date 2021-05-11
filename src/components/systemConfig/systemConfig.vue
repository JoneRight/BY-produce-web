<template>
    <div class="m20">
        <h2 class="common-title">系统配置</h2>
        <div class="mt20" v-authorize="'systemsetting'">
            <Form :label-width="150" :model="systemConfig" ref="systemConfigForm" :rules="ruleValidate">
                
                <FormItem label="覆盖上报时间" prop="coverHour" >
                    <Input v-model="systemConfig.coverHour"  style="width:400px"/><Label>小 时</Label>
                    <div class="intro">说明：上报成功后，可在此时间内重新上报</div>
                </FormItem>
                <FormItem label="催报频次" prop="urgeCycle">
		              <Input v-model="systemConfig.urgeCycle"  style="width:400px"/><Label>天/次</Label>
                  <div class="intro">说明：未及时上报数据时，系统每隔几天会自动催报</div>
		            </FormItem>
                <FormItem label="催报月数" prop="urgeMonth" >
                    <Select v-model="systemConfig.urgeMonth"  style="width:400px">
                        <Option v-for="item in 12" :key="item" :value="item.toString()">{{item}}</Option>
                    </Select>
                    <Label>个 月</Label>
                     <div class="intro">说明：从现在向前开始计算，催报几个月内未提交的数据</div>
                </FormItem>
                <FormItem label="空白数据比例设置" prop="emptyRate">
		              <Input v-model="systemConfig.emptyRate"  style="width:400px"/><Label>%</Label>
                  <div class="intro">说明：空白数据比例设置</div>
		            </FormItem>
                <FormItem label="医院注册收取验证码" prop="smsHospRegister">
		              <i-switch v-model="systemConfig.smsHospRegister" true-value='1' false-value='0'/>
                  <div class="intro">说明：医院注册收取验证码的短信设置</div>
		            </FormItem>
                <FormItem label="医院接受审核后账号" prop="smsUserLogin">
		              <i-switch v-model="systemConfig.smsUserLogin" true-value='1' false-value='0'/>
                  <div class="intro">说明：办公室审核完医院接受账号和密码的短信设置</div>
		            </FormItem>
                <FormItem label="办公室催报" prop="smsUrge">
		              <i-switch v-model="systemConfig.smsUrge" true-value='1' false-value='0'/>
                  <div class="intro">说明：办公室催报的短信设置</div>
		            </FormItem>
                <FormItem label="给医院发消息通知" prop="smsMessage">
		              <i-switch v-model="systemConfig.smsMessage" true-value='1' false-value='0'/>
                  <div class="intro">说明：给医院发消息通知的短信设置</div>
		            </FormItem>
                <FormItem label="BI登录验证码" prop="smsBiLogin">
		              <i-switch v-model="systemConfig.smsBiLogin" true-value='1' false-value='0'/>
                  <div class="intro">说明：BI登录验证码的短信设置</div>
		            </FormItem>
                <FormItem label="会员系统登录验证码" prop="smsReportLogin">
		              <i-switch v-model="systemConfig.smsReportLogin" true-value='1' false-value='0'/>
                  <div class="intro">说明：会员系统登录验证码的短信设置</div>
		            </FormItem>
                <FormItem label="上报系统登录验证码" prop="smsUploadLogin">
		              <i-switch v-model="systemConfig.smsUploadLogin" true-value='1' false-value='0'/>
                  <div class="intro">说明：上报系统登录验证码的短信设置</div>
		            </FormItem>
                <!-- <FormItem label="上报问题反馈" prop="smsUploadFeedBack">
		              <i-switch v-model="systemConfig.smsUploadFeedBack" true-value='1' false-value='0'/>
                  <div class="intro">说明：上报问题反馈的短信设置</div>
		            </FormItem>
                <FormItem label="数据作废反馈" prop="smsDataCancelFeedBack">
		              <i-switch v-model="systemConfig.smsDataCancelFeedBack" true-value='1' false-value='0'/>
                  <div class="intro">说明：数据作废反馈的短信设置</div>
		            </FormItem> -->
                <FormItem>
                    <Button type="primary" @click="saveProInfo()">提交</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>
<script>
import Vue from "vue";
export default {
  name: "systemConfig",
  data() {
    const validateNo = (rule, value, callback) => {
      var reg = /^[0-9]/;
      if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      systemConfig: {
        coverHour: "",
        urgeCycle: "",
        urgeMonth: "",
        emptyRate:"",
        smsHospRegister:'0',
        smsUserLogin:'0',
        smsUrge:'0',
        smsMessage:'0',
        smsBiLogin:'0',
        smsUploadFeedBack:'0',
        smsDataCancelFeedBack:'0'
      },
      listStyle: {
        width: "250px",
        height: "400px"
      },
      ruleValidate: {
        urgeMonth: [
          {
            required: true,
            message: "请选择要催报几月前的数据",
            trigger: "blur"
          }
        ],
        urgeCycle: [
          { required: true, message: "催报频次不能为空", trigger: "blur" },
          { validator: validateNo, trigger: "blur" }
        ],
        coverHour: [
          { required: true, message: "覆盖上报时间不能为空", trigger: "blur" },
          { validator: validateNo, trigger: "blur" }
        ],
        emptyRate:[
          { required: true, message: "空白数据比例不能为空", trigger: "blur" },
          { max: 100, message: "空白数据比例不能超过100", trigger: "blur" },
          { min: 0, message: "空白数据比例不能小于零", trigger: "blur" },
          { validator: validateNo, trigger: "blur" }
        ]
      }
    };
  },
  mounted: function() {
    this.getSettings();
  },
  methods: {
    getSettings() {
      var self = this;
      Vue.ajax.send({
        name: "systemConfig.getSettings",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            var list = data.data;
            // self.systemConfig = data.data;
            list.forEach(item => {
              if (item.key == "SETTING_REPEATUPLOAD") {
                self.systemConfig.coverHour = item.value;
              } else if (item.key == "SETTING_REPEATNOTICE") {
                self.systemConfig.urgeCycle = item.value;
              } else if (item.key == "SETTING_NOTICEMONTH") {
                self.systemConfig.urgeMonth = item.value;
              }
              else if (item.key == "SETTING_EMPTY_RATE") {
                self.systemConfig.emptyRate = item.value;
              }
              else if (item.key == "SETTING_SMS_HOSPREGISTER") {
                self.systemConfig.smsHospRegister = item.value;
              }
              else if (item.key == "SETTING_SMS_USERGETLOGIN") {
                self.systemConfig.smsUserLogin = item.value;
              }
              else if (item.key == "SETTING_SMS_URGE") {
                self.systemConfig.smsUrge = item.value;
              }
              else if (item.key == "SETTING_SMS_HOSPMESSAGE") {
                self.systemConfig.smsMessage = item.value;
              }
              else if (item.key == "SETTING_SMS_BILOGIN") {
                self.systemConfig.smsBiLogin = item.value;
              }
              else if (item.key == "SETTING_SMS_REPORTLOGIN") {
                self.systemConfig.smsReportLogin = item.value;
              }
              else if (item.key == "SETTING_SMS_UPLOADLOGIN") {
                self.systemConfig.smsUploadLogin = item.value;
              }
              else if (item.key == "SETTING_SMS_UPLOADFEEDBACK") {
                self.systemConfig.smsUploadFeedBack = item.value;
              }
              else if (item.key == "SETTING_SMS_DATACANCELFEEDBACK") {
                self.systemConfig.smsDataCancelFeedBack = item.value;
              }
            });
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    saveProInfo() {
      this.$refs["systemConfigForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "systemConfig.updateSettings",
            data: {
              value: {
                SETTING_REPEATUPLOAD: self.systemConfig.coverHour,
                SETTING_REPEATNOTICE: self.systemConfig.urgeCycle,
                SETTING_NOTICEMONTH: self.systemConfig.urgeMonth,
                SETTING_EMPTY_RATE:self.systemConfig.emptyRate,
                SETTING_SMS_HOSPREGISTER:self.systemConfig.smsHospRegister,
                SETTING_SMS_USERGETLOGIN:self.systemConfig.smsUserLogin,
                SETTING_SMS_URGE:self.systemConfig.smsUrge,
                SETTING_SMS_HOSPMESSAGE:self.systemConfig.smsMessage,
                SETTING_SMS_BILOGIN:self.systemConfig.smsBiLogin,
                SETTING_SMS_REPORTLOGIN:self.systemConfig.smsReportLogin,
                SETTING_SMS_UPLOADLOGIN:self.systemConfig.smsUploadLogin,
                SETTING_SMS_UPLOADFEEDBACK:self.systemConfig.smsUploadFeedBack,
                SETTING_SMS_DATACANCELFEEDBACK:self.systemConfig.smsDataCancelFeedBack
              },
              updateUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Modal.success({
                                title: "提交成功",
                                closable: true
                            });
                self.getSettings();
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
<style scoped>
.intro{
    display: inline-block;
    color: #9c9c9c;
    margin-left: 10px;
}
</style>