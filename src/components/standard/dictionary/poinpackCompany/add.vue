<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" v-show="type==1">编辑分包装企业</h2>
        <h2 class="common-title" v-show="type==''|| type==2">新增分包装企业</h2>
        <div class="mt20" style="width:700px">
            <Form ref="poinpackForm" :model="poinpack" :rules="ruleValidate" :label-width="80">
                    <FormItem label="企业编码" v-show="type==1" >
                        <Label > {{ poinpack.poinpackcompanyId }} </Label>
                    </FormItem>
                    <FormItem label="企业名称" prop="poinpackcompanyName">
                        <Input v-model.trim="poinpack.poinpackcompanyName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="中文简称">
                        <Input v-model.trim="poinpack.poinpackcompanyShortname" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="企业法人">
                        <Input v-model.trim="poinpack.poinpackcompanyLegal" :maxlength="16"/>
                    </FormItem>
                    <FormItem label="注册地址">
                        <Input v-model.trim="poinpack.poinpackcompanyAddress" :maxlength="30"/>
                    </FormItem>
                    <FormItem label="联系人">
                        <Input v-model.trim="poinpack.contact" :maxlength="16"/>
                    </FormItem>
                    <FormItem label="所在省" prop="province">
                        <Select v-model="poinpack.province" filterable @on-change='getCityList'>
                            <Option v-for="item in provinceList" :value="item.province" :key="item.province">{{ item.provinceName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在市" prop="city">
                        <Select v-model="poinpack.city" filterable>
                            <Option v-for="item in cityList" :value="item.city" :key="item.city">{{ item.cityName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="电话">
                        <Input v-model.trim="poinpack.telephone" :maxlength="20" />
                    </FormItem>
                    <FormItem label="传真">
                        <Input v-model.trim="poinpack.fax" :maxlength="30" />
                    </FormItem>
                    <FormItem label="邮编">
                        <Input v-model.trim="poinpack.postcode" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input v-model.trim="poinpack.email" :maxlength="30" />
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="poinpack.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
                    <FormItem>
                        <Button @click="cancel">取消</Button>
                        <Button type="primary" @click="save">保存</Button>
                    </FormItem>
                </Form>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    name: 'poinpackAdd',
        data () {
            return {
                type: '',
                provinceId: '',
                provinceList: [],
                countryList: [],
                cityList: [],
                poinpackBlocList: [],
                poinpack: {
                    poinpackcompanyId: '',
                    poinpackcompanyName: '',
                    city: ''
                },
                ruleValidate: {
                    poinpackcompanyName: [
                        { required: true, message: '分包装企业名称不能为空', trigger: 'blur' }
                    ],
                    province: [
                        { required: true, message: '所在省不能为空', trigger: 'blur',type:'number' }
                    ],
                    city: [
                        { required: true, message: '所在市不能为空', trigger: 'blur',type:'number' }
                    ]
                }
            }
        },
        mounted: function() {
            if (this.$route.query.type != undefined && this.$route.query.type != "") {
                this.type = this.$route.query.type;
            }
            this.poinpackcompanyId = this.$route.query.Id;
            //获取分包装企业信息
            if (this.type == 1) {
                this.getPoinpackCompanyInfo();
            }
            //获取省份
            this.getProvinceList();
            //获取城市
            // this.getCityList();
        },
        methods: {
            getCountryList(){
                var self=this;
                Vue.ajax.send({
                name: 'city.countryList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.countryList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
            getProvinceList(){
                var self=this;
                Vue.ajax.send({
                name: 'city.provinceList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.provinceList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
           getCityList(value){
                var self=this;
                //清空上一次的城市
                
                if (value != '' && value != null) {
                    self.poinpack.city = "";
                    self.provinceId = "";
                }
                Vue.ajax.send({
                name: 'city.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    province: value != "" && value != null ? value : self.provinceId,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.cityList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
           getPoinpackCompanyInfo() {
               var self=this;
                Vue.ajax.send({
                name: 'poinpack.get',
                data: {
                    poinpackcompanyId: self.poinpackcompanyId
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.poinpack = data.data;

                        self.provinceId = self.poinpack.province;
                        //获取城市
                        self.getCityList();
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
           save () {
                this.$refs['poinpackForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: self.type == 1 ? 'poinpack.edit' : 'poinpack.add',
                        data: {
                            poinpackcompanyId: self.type == 1 ? self.poinpack.poinpackcompanyId : '',
                            poinpackcompanyName: self.poinpack.poinpackcompanyName,
                            poinpackcompanyShortname: self.poinpack.poinpackcompanyShortname,
                            poinpackcompanyLegal: self.poinpack.poinpackcompanyLegal,
                            poinpackcompanyAddress: self.poinpack.poinpackcompanyAddress,
                            contact: self.poinpack.contact,
                            province: self.poinpack.province,
                            city: self.poinpack.city,
                            telephone: self.poinpack.telephone,
                            fax: self.poinpack.fax,
                            postcode: self.poinpack.postcode,
                            email: self.poinpack.email,
                            statusId: 1,
                            createUser: self.type == 1 
                                        ? self.poinpack.createUser 
                                        : Vue.getUser().userName,
                            changeUser: self.type == 1 
                                        ? Vue.getUser().userName 
                                        : self.poinpack.changeUser,
                            remark: self.poinpack.remark
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.$refs['poinpackForm'].resetFields();

                                self.type == 1 
                                ? self.$Message.success('编辑分包装企业提交成功！') 
                                : self.$Message.success('新增分包装企业提交成功！');
                                
                                self.$router.push("/standard/dictionary/poinpackCompany/list");
                            } else {
                                
                            setTimeout(() => {
                                    self.loadingAdd = false;
                                    self.$nextTick(() => {
                                        self.loadingAdd = true;
                                    });
                                }, 0);
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }else{
                    setTimeout(() => {
                        this.loadingAdd = false;
                        this.$nextTick(() => {
                            this.loadingAdd = true;
                        });
                    }, 0);
                }
            })
            },
            cancel () {
                this.$router.push("/standard/dictionary/poinpackCompany/list");
            }

        }
}    
</script>