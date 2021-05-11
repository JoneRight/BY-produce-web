<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" v-show="type==1">编辑批发企业</h2>
        <h2 class="common-title" v-show="type==''|| type==2">新增批发企业</h2>
        <div class="mt20" style="width:700px">
            <Form ref="wholeSaleForm" :model="wholeSale" :rules="ruleValidate" :label-width="90">
                    <FormItem label="批发企业编码"  v-show="type==1">
                        <Label > {{ wholeSale.salecompanyId }} </Label>
                    </FormItem>
                    <FormItem v-show="type==1" label="是否更新版本" >
                        <RadioGroup  v-model="version">
                            <Radio label="是"></Radio>
                            <Radio label="否"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="批发企业名称" prop="salecompanyName">
                        <Input v-model.trim="wholeSale.salecompanyName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="中文简称">
                        <Input v-model.trim="wholeSale.salecompanyShortname" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="企业法人">
                        <Input v-model.trim="wholeSale.salecompanyLegal" :maxlength="16"/>
                    </FormItem>
                    <FormItem label="组织机构代码">
                        <Input v-model.trim="wholeSale.organ" :maxlength="30"/>
                    </FormItem>
                    <FormItem label="企业类型" prop="companyType">
                        <Select v-model="wholeSale.companyType" filterable>
                            <Option v-for="item in companyTypeList" :value="item.companyType" :key="item.companyType">{{ item.companyTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="企业地址">
                        <Input v-model.trim="wholeSale.salecompanyAddress" :maxlength="160"/>
                    </FormItem>
                    <FormItem label="联系人">
                        <Input v-model.trim="wholeSale.contact" :maxlength="20" />
                    </FormItem>
                    <FormItem label="国家">
                         <Select v-model="wholeSale.nation" filterable>
                            <Option v-for="item in countryList" :value="item.country" :key="item.country">{{ item.countryName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在省" prop="province">
                        <Select v-model="wholeSale.province" filterable @on-change="getCityList">
                            <Option v-for="item in provinceList" :value="item.province" :key="item.province">{{ item.provinceName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在市" prop="city">
                        <Select v-model="wholeSale.city" filterable>
                            <Option v-for="item in cityList" :value="item.city" :key="item.city">{{ item.cityName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="电话">
                        <Input number v-model.trim="wholeSale.telephone" :maxlength="11" />
                    </FormItem>
                    <FormItem label="传真">
                        <Input v-model.trim="wholeSale.fax" :maxlength="30" />
                    </FormItem>
                    <FormItem label="邮编">
                        <Input v-model.trim="wholeSale.postcode" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input v-model.trim="wholeSale.email" :maxlength="30" />
                    </FormItem>
                     <FormItem label="集团编码">
                        <Select v-model="wholeSale.wholesaleBlocId" filterable>
                            <Option v-for="item in wholesaleBlocList" :value="item.wholesaleBlocId" :key="item.wholesaleBlocId">{{ item.wholesaleBlocName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="wholeSale.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
                    <FormItem>
                        <Button @click="cancel">取消</Button>
                        <Button type="primary" @click="save" :disabled="submitDisabled">保存</Button>
                    </FormItem>
                </Form>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    name: 'wholesaleAdd',
        data () {
            return {
                salecompanyId: '',
                type: '',
                provinceId: '',
                provinceList: [],
                countryList: [],
                cityList: [],
                companyTypeList: [],
                wholesaleBlocList: [],
                wholeSale: { 
                    city: ''
                },
                version: '否',
                ruleValidate: {
                    salecompanyName: [
                        { required: true, message: '批发企业名称不能为空', trigger: 'blur' }
                    ],
                    companyType: [
                        { required: true, message: '企业类型不能为空', trigger: 'blur',type:'number' }
                    ],
                    province: [
                        { required: true, message: '所在省不能为空', trigger: 'blur',type:'number' }
                    ],
                    city: [
                        { required: true, message: '所在市不能为空', trigger: 'blur',type:'number' }
                    ]
                },
                submitDisabled:false
            }
        },
        mounted: function() {
            if (this.$route.query.type != undefined && this.$route.query.type != "") {
                this.type = this.$route.query.type;
            }
            this.salecompanyId = this.$route.query.Id;
            //获取批发企业信息
            if (this.type == 1) {
                this.getWholesaleCompanyInfo();
            }
            //获取国家
            this.getCountryList();
            //获取省份
            this.getProvinceList();
            //获取企业类型
            this.getCompanyTypeList();
            //获取企业集团
            this.getWholesaleCompanyBlocList();
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
                //清空上一次选择的城市
                if (value != '' && value != null) {
                    self.wholeSale.city = "";
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
           getWholesaleCompanyInfo() {
               var self=this;
                Vue.ajax.send({
                name: 'wholesaleCompany.get',
                data: {
                    salecompanyId: self.salecompanyId
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.wholeSale = data.data;
                        
                        
                        //编辑页面获取城市
                        self.provinceId = self.wholeSale.province;
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
           getWholesaleCompanyBlocList(){
                var self=this;
                Vue.ajax.send({
                name: 'wholesaleCompany.blocList',
                data: {

                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.wholesaleBlocList = data.data.dataList;
                        
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
                this.$refs['wholeSaleForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    self.submitDisabled = true;
                    Vue.ajax.send({
                        name: self.type == 1 ? 'wholesaleCompany.edit' : 'wholesaleCompany.add',
                        data: {
                            salecompanyId: self.type == 1 ? self.wholeSale.salecompanyId : '',
                            version: self.version,
                            salecompanyName: self.wholeSale.salecompanyName,
                            salecompanyShortname: self.wholeSale.salecompanyShortname,
                            salecompanyLegal: self.wholeSale.salecompanyLegal,
                            wholesaleBlocId: self.wholeSale.wholesaleBlocId,
                            organ: self.wholeSale.organ,
                            nation: self.wholeSale.nation,
                            province: self.wholeSale.province,
                            city: self.wholeSale.city,
                            companyType: self.wholeSale.companyType,
                            salecompanyAddress: self.wholeSale.salecompanyAddress,
                            postcode: self.wholeSale.postcode,
                            contact: self.wholeSale.contact,
                            telephone: self.wholeSale.telephone,
                            email: self.wholeSale.email,
                            fax: self.wholeSale.fax,
                            statusId: 1,
                            createUser: self.type == 1 
                                        ? self.wholeSale.createUser 
                                        : Vue.getUser().userName,
                            changeUser: self.type == 1 
                                        ? Vue.getUser().userName 
                                        : self.wholeSale.changeUser,
                            remark: self.wholeSale.remark
                        },
                        success: function(data) {
                            setTimeout(() => {
                                    self.loadingAdd = false;
                                    self.$nextTick(() => {
                                        self.loadingAdd = true;
                                    });
                                }, 0);
                            if (!!data && data.code=='0') {
                                self.$refs['wholeSaleForm'].resetFields();

                                self.type == 1 
                                ? self.$Message.success('编辑批发企业提交成功！') 
                                : self.$Message.success('新增批发企业提交成功！');
                                
                                self.$router.push("/standard/mapping/saleEnterprise/list");
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
                this.$router.push("/standard/mapping/saleEnterprise/list");
            }

        }
}    
</script>