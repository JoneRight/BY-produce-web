<template>
    <div class="bg-white m20 p20">
        <h2 class="common-title" style="margin-left: 7px;">医院设置</h2>
        <Row :gutter="64">
            <Col span="10" v-if="false" style="border-right:#d9d9d9 1px solid;">
                <h2 class="hosp-title">医院设置</h2>
                <Form :label-width="80" ref="addForm" :model="addForm" :rules="addValidate">
                    <FormItem label="医院名称" prop="hospName">
                        <Input v-model="addForm.hospName" style="max-width: 400px;"></Input>
                    </FormItem>
                    <FormItem label="所在省市" prop="address">
                        <Cascader :data="addressList" trigger="hover" v-model="addForm.address" change-on-select style="max-width: 400px;"></Cascader>
                    </FormItem>
                    <FormItem label="联系人" prop="applyUser">
                        <Input v-model="addForm.applyUser"  style="max-width: 400px;"></Input>
                    </FormItem>
                    <FormItem label="联系方式" prop="telephone">
                        <Input v-model="addForm.telephone" style="max-width: 400px;"></Input>
                    </FormItem>
                    <FormItem label="邮箱" prop="email">
                        <Input v-model="addForm.email" style="max-width: 400px;"></Input>
                    </FormItem>
                    <FormItem label="医院等级" prop="hospGrade">
                        <RadioGroup v-model="addForm.hospGrade">
                            <Radio v-for="item,index in gradeList" :label="item.hospGrade" :key="index" v-if="item.hospGrade>0">{{item.hospGradeName}}</Radio>
                            <Radio v-for="item,index in gradeList" :label="item.hospGrade" :key="index" v-if="item.hospGrade==0">其他</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="医院性质" prop="hospAttached">
                        <RadioGroup v-model="addForm.hospAttached">
                            <Radio v-for="item,index in attachedList" :label="item.hospAttached" :key="index" v-if="item.hospAttached>0">{{item.hospAttachedName}}</Radio>
                            <Radio v-for="item,index in attachedList" :label="item.hospAttached" :key="index" v-if="item.hospAttached==0">其他</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="医院类别" prop="hospType">
                        <RadioGroup v-model="addForm.hospType">
                            <Radio v-for="item,index in typeList" :label="item.hospType" :key="index" v-if="item.hospType>0">{{item.hospTypeName}}</Radio>
                            <Radio v-for="item,index in typeList" :label="item.hospType" :key="index" v-if="item.hospType==0">其他</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="注册人科室">
                        <Input v-model="addForm.registerSection" style="max-width: 400px;"></Input>
                    </FormItem>
                    <FormItem label="注册人职务">
                        <Input v-model="addForm.registerPosition" style="max-width: 400px;"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="addOk">保存</Button>
                    </FormItem>
                </Form>
            </Col>
            <Col span="14">
                <h2 class="hosp-title">医院设置</h2>
                <Form :label-width="100" ref="addForm" :model="addForm" :rules="addValidate">
                    <FormItem label="上报时间" prop="uploadDate">
                       <Select v-model="addForm.uploadDate"  style="width:280px" placeholder="请选择时间">
                            <Option value=""></Option>
                            <Option v-for="item in 30" :key="item" :value="item.toString()">{{item}}</Option>
                        </Select>
                    <Label>号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Label>
                    <div class="intro">说明：每月几号上报</div>
                    </FormItem>
                    <!-- <FormItem label="定点催报" prop="pointToRush">
                        <Select v-model="addForm.pointToRush"  style="width:280px" placeholder="请选择时间">
                            <Option  value=""></Option>
                            <Option v-for="item in 30" :key="item" :value="item.toString()">{{item}}</Option>
                        </Select>
                    <Label>号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Label>
                    <div class="intro">说明：每月几号开始催报</div>
                    </FormItem>
                    <FormItem label="催报频次" prop="rushToNumber">
                        <Select v-model="addForm.rushToNumber"  style="width:280px" placeholder="请选择时间">
                            <Option  value=""></Option>
                            <Option v-for="item in 30" :key="item" :value="item.toString()">{{item}}</Option>
                        </Select>
                        <Label>日/次</Label>
                        <div class="intro">说明：多少天催报一次</div>
                    </FormItem>
                    <FormItem label="催报时间" prop="pushtoDate">
                        <DatePicker type="month" format="yyyyMM" placeholder="请选择时间" :editable='false' v-model="addForm.pushtoDate" style="width: 280px;"></DatePicker>
                        <Label>年月&nbsp;&nbsp;</Label>
                        <div class="intro">说明：催报时间开始年月</div>
                    </FormItem> -->
                    <FormItem label="系统维护" prop="isopenrush">
                        <i-switch v-model="addForm.isopenrush">
                        </i-switch>

                        <div class="intro">&nbsp;&nbsp;说明：医院HIS系统维护，开启后将不再显示该院的催报信息</div>
                    </FormItem>
                    <FormItem label="系统维护原因" prop="stopReason" v-if="addForm.isopenrush">
                        <Input type="textarea" :rows='5' v-model="addForm.stopReason" style="max-width: 280px;" :maxlength="100"></Input>
                    </FormItem>
                    
                    <FormItem>
                        <Button type="primary" @click="addOk">保存</Button>
                        <Button type="default" to="/report/hospital">返回列表</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>        
    </div>
</template>

<script>
import Vue from "vue";
export default {
    name: 'hospitalAdd',
    data(){
         
       const validateNo = (rule, value, callback) => {
            var reg = /^[0-9]/;
            if (!reg.test(value)) {
                callback(new Error("请输入数字"));
            } else {
                callback();
            }
       };
        return{   
            addForm:{
                uploadDate:null,
                pushtoDate:null,
                isopenrush:false,
                pointToRush:null,
                rushToNumber:null
            },
            hospId:null,
            urgeForm:{},
            addValidate: {
                uploadDate:[
                    { required: true,message: "上报时间不能为空", trigger: "blur" },
                    { validator: validateNo, trigger: "blur" }
                ],
                pointToRush:[
                    { required: true,message: "定点催报不能为空", trigger: "blur" },
                    { validator: validateNo, trigger: "blur" }
                ],
                rushToNumber:[
                    { required: true,message: "催报频次不能为空", trigger: "blur" },
                    { validator: validateNo, trigger: "blur" }
                ],
                pushtoDate:[
                    { type: 'date',required: true,message: "催报时间不能为空", trigger: "blur" }
                ],
                stopReason:[
                    { required: true,message: "系统维护原因不能为空", trigger: "blur" },
                ]
            }
        }
    },
    mounted: function() {
        this.hospId=this.$route.query.Id
        this.getHospSetting();
    },
    methods: {
        getHospSetting:function(){
            var self=this;
            Vue.ajax.send({
                name:"hospital.basicInfo",
                data:{
                    hospId:this.hospId
                },
                success:function(data){
                    console.log(data)
                    if(!!data && data.code==0){
                        self.addForm={
                            hospId:self.hospId,
                            uploadDate:data.data.uploadDate?data.data.uploadDate.toString():null,
                            // pushtoDate:data.data.pushtoDate?new Date(parseInt(data.data.pushtoDate).toString().substring(0,4),(parseInt(data.data.pushtoDate)-1).toString().substring(4),"1"):null,
                            isopenrush:(data.data.isopenrush==null || data.data.isopenrush==0)?false:true,
                            // pointToRush:data.data.pointToRush?data.data.pointToRush.toString():null,
                            // rushToNumber:data.data.rushToNumber?data.data.rushToNumber.toString():null,
                            stopReason:data.data.stopReason
                        };
                        console.log("self.addForm",self.addForm,new Date())
                    }
                    else{
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                    
                }
            })
        },
        addOk(){
            var self=this;
            this.$refs["addForm"].validate(valid => {
            if (valid) {
                var postForm={
                    hospId:parseInt(self.hospId),
                    uploadDate:parseInt(self.addForm.uploadDate),
                    // pushtoDate:parseInt(self.addForm.pushtoDate.format("YYYYMM")),
                    isopenrush:(self.addForm.isopenrush==null || self.addForm.isopenrush==false)?0:1,
                    // pointToRush:parseInt(self.addForm.pointToRush),
                    // rushToNumber:parseInt(self.addForm.rushToNumber),
                    stopReason:self.addForm.stopReason
                }
                Vue.ajax.send({
                    name: "hospital.setting.edit",
                    data: postForm,
                    success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$Message.success("医院修改成功！");
                        self.getHospSetting();
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
.hosp-title{
    font-size: 16px;
    color: #00a0e9;
    padding-left: 20px;
    margin-bottom: 30px;
    background: url(../../assets/img/arrow.png) left center no-repeat;
}
.intro{
    display: inline-block;
    color: #9c9c9c;
    margin-left: 10px;
}
</style>