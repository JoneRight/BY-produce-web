<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" v-show="type==1">编辑生产企业</h2>
        <h2 class="common-title" v-show="type==''|| type==2 || type == 3 || type == 4">新增生产企业</h2>
        <div class="mt20" style="width:700px">
                <Form  ref="medicalForm" :model="medical" :rules="ruleValidate" :label-width="100">
                    <FormItem label="生产企业编码" v-show="type==1" :maxlength="20">
                        <!-- <Input v-show="type==''|| type==2  || type == 3 || type == 4" v-model.trim="medical.company" /> -->
                        <Label > {{ medical.company }} </Label>
                    </FormItem>
                    <FormItem v-show="type==1" label="是否更新版本" >
                        <RadioGroup  v-model="version">
                            <Radio label="是"></Radio>
                            <Radio label="否"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="生产企业名称" prop="companyName">
                        <Input v-model.trim="medical.companyName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="中文简称">
                        <Input v-model.trim="medical.chineseShort" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="企业法人">
                        <Input v-model.trim="medical.enterpriseLegal" :maxlength="16"/>
                    </FormItem>
                    <FormItem label="组织机构代码">
                        <Input v-model.trim="medical.organ" :maxlength="16"/>
                    </FormItem>
                    <FormItem label="企业类型" prop="companyType">
                        <Select v-model="medical.companyType" filterable>
                            <Option v-for="item in companyTypeList" :value="item.companyType" :key="item.companyType">{{ item.companyTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="集团编码" prop="blocId">
                        <Select v-model="medical.blocId" filterable>
                            <Option v-for="item in blocList" :value="item.blocId" :key="item.blocId">{{ item.blocName }}</Option>
                        </Select>
                    </FormItem>
<!--                     <FormItem label="是否会员">
                         <Select v-model="medical.isMembers">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="会员等级">
                        <Input v-model.trim="medical.memberGrade" />
                    </FormItem>
                    <FormItem label="是否绑定权限">
                        <Select v-model="medical.isBindingPurview">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem> -->
                    <FormItem label="国家">
                         <Select v-model="medical.nation" filterable>
                            <Option v-for="item in countryList" :value="item.country" :key="item.country">{{ item.countryName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在省" prop="province">
                        <Select v-model="medical.province" filterable @on-change="getCityList">
                            <Option v-for="item in provinceList" :value="item.province" :key="item.province">{{ item.provinceName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在市" prop="city">
                        <Select v-model="medical.city" filterable>
                            <Option v-for="item in cityList" :value="item.city" :key="item.city">{{ item.cityName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="地址">
                        <Input v-model.trim="medical.companyAddress" :maxlength="160"/>
                    </FormItem>
                    <FormItem label="邮编">
                        <Input v-model.trim="medical.postcode" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="联系方式">
                        <Input v-model.trim="medical.contact" :maxlength="20" />
                    </FormItem>
                    <FormItem label="手机码">
                        <Input number v-model.trim="medical.telephone" :maxlength="11" />
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input v-model.trim="medical.email" :maxlength="30" />
                    </FormItem>
                    <FormItem label="传真">
                        <Input v-model.trim="medical.fax" :maxlength="30" />
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="medical.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
import Vue from "vue";
    export default {
        name: 'medicalInfo',
        data () {
            return {
                company: '',
                type: '',
                provinceId: '',
                provinceList: [],
                countryList: [],
                cityList: [],
                companyTypeList: [],
                blocList: [],
                medical: { 
                    city: ''
                },
                version: '否',
                ruleValidate: {
                    companyName: [
                        { required: true, message: '生产企业名称不能为空', trigger: 'blur' }
                    ],
                    companyType: [
                        { required: true, message: '企业类型不能为空', trigger: 'blur',type:'number' }
                    ],
                    blocId: [
                        { required: true, message: '集团编码不能为空', trigger: 'blur' }
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
            this.company = this.$route.query.Id;
            //获取生产企业信息
            if (this.type == 1) {
                this.getMedicalInfo();
            }
            //获取国家
            this.getCountryList();
            //获取省份
            this.getProvinceList();
            //获取城市
            // this.getCityList();
            //获取企业类型
            this.getCompanyTypeList();
            //获取企业集团
            this.getCompanyBlocList();
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
                //清空上次选择的城市
                
                if (value != '' && value != null) {
                    self.medical.city = "";
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
           getCompanyTypeList(){
                var self=this;
                Vue.ajax.send({
                name: 'medical.companyTypeList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.companyTypeList = data.data.dataList;
                        
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
           getCompanyBlocList(){
                var self=this;
                Vue.ajax.send({
                name: 'companyBloc.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.blocList = data.data.dataList;
                        
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
            getMedicalInfo () {
                var self = this;
                    Vue.ajax.send({
                    name: "medical.get",
                    data: {
                        company: self.company
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.medical = data.data;

                            self.provinceId = self.medical.province;
                            //获取城市
                            self.getCityList();
                        } else {
                            self.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            save () {
                this.$refs['medicalForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: self.type == 1 ? 'medical.edit' : 'medical.add',
                        data: {
                            company: self.type == 1 ? self.medical.company : '',
                            version: self.version,
                            companyName: self.medical.companyName,
                            originalCompanyName: self.medical.originalCompanyName,
                            chineseShort: self.medical.chineseShort,
                            enterpriseLegal: self.medical.enterpriseLegal,
                            blocId: self.medical.blocId,
                            isMembers: self.medical.isMembers,
                            memberGrade: self.medical.memberGrade,
                            isBindingPurview: self.medical.isBindingPurview,
                            nation: self.medical.country,
                            province: self.medical.province,
                            city: self.medical.city,
                            companyType: self.medical.companyType,
                            companyAddress: self.medical.companyAddress,
                            postcode: self.medical.postcode,
                            contact: self.medical.contact,
                            telephone: self.medical.telephone,
                            email: self.medical.email,
                            fax: self.medical.fax,
                            statusId: 1,
                            createUser: self.type == 1 
                                        ? self.medical.createUser 
                                        : Vue.getUser().userName,
                            changeUser: self.type == 1 
                                        ? Vue.getUser().userName 
                                        : self.medical.changeUser,
                            remark: self.medical.remark
                        },
                        success: function(data) {
                            setTimeout(() => {
                                    self.loadingAdd = false;
                                    self.$nextTick(() => {
                                        self.loadingAdd = true;
                                    });
                                }, 0);
                            if (!!data && data.code=='0') {
                                self.$refs['medicalForm'].resetFields();
                                self.type == 1? self.$Message.success('编辑生产企业提交成功！') : self.$Message.success('新增生产企业提交成功！');
                                
                                
                                if (self.type == 3) {
                                    //返回药品新增页面
                                    self.$router.push("/standard/mapping/drugs/add");
                                }else if (self.type == 4) {
                                    //返回药品编辑页面
                                    self.$router.push("/standard/mapping/drugs/edit");
                                }else {
                                    //否则返回生产企业页面
                                    self.$router.push("/standard/mapping/medicalCompany/list");
                                }
                            } else {
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
                if (this.type == 3) {
                    //返回药品新增页面
                    this.$router.push("/standard/mapping/drugs/add");
                }else if (this.type == 4) {
                    //返回药品编辑页面
                    this.$router.push("/standard/mapping/drugs/edit");
                }else {
                    //否则返回生产企业页面
                    this.$router.push("/standard/mapping/medicalCompany/list");
                }
                
            }
        }
    }
</script>