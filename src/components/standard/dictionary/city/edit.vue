<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" >编辑城市</h2>
        <div class="mt20" style="width:700px">
                <Form ref="cityForm" :model="cityModel"  :rules="ruleValidate" :label-width="100">
                    <input  type="hidden" v-model="cityModel.city"/>
                    <FormItem label="城市名称" prop="cityName">
                        <Input v-model.trim="cityModel.cityName" :maxlength="30"/>
                    </FormItem>
                    <FormItem label="国家" prop="country">
                        <Select v-model.trim="cityModel.country">
                            <Option v-for="item in countryList" :value="item.country" :key="item.country">{{ item.countryName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="省份" prop="province">
                        <Select v-model.trim="cityModel.province">
                            <Option v-for="item in provinceList" :value="item.province" :key="item.province">{{ item.provinceName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="行政区域" prop="administrative">
                        <Select v-model.trim="cityModel.administrative">
                            <Option v-for="item in administrativeList" :value="item.administrative" :key="item.administrative">{{ item.administrativeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="经济区域" prop="economicRegion">
                        <Select v-model.trim="cityModel.economicRegion">
                            <Option v-for="item in economicList" :value="item.economicRegion" :key="item.economicRegion">{{ item.economicRegionName }}</Option>
                        </Select>
                    </FormItem>
                    
                    <FormItem label="邮政编码" prop="postcode">
                        <Input v-model.trim="cityModel.postcode" :maxlength="20"/>
                    </FormItem>
                    <FormItem label="城市级别" prop="cityLevel">
                        <Select v-model="cityModel.cityLevel">
                            <Option v-for="item in cityLevelList" :value="item.cityLevel" :key="item.cityLevel">{{ item.cityLevelName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="城市类别" prop="cityType">
                        <Select v-model.trim="cityModel.cityType">
                            <Option v-for="item in cityTypeList" :value="item.cityType" :key="item.cityType">{{ item.cityTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <!-- 需要换成下拉选择 -->
                    <FormItem label="是否省会" prop="isCapital">
                        <Select v-model="cityModel.isCapital">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <!-- 需要换成下拉选择 -->
                    <FormItem label="是否直辖市" prop="isMunicipalities">
                        <Select v-model="cityModel.isMunicipalities">
                            <Option :value="0" :key="0">否</Option>
                            <Option :value="1" :key="1">是</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="城市编码" prop="cityCode">
                        <Input v-model.trim="cityModel.cityCode" :maxlength="20"/>
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
        name: "cityAdd",
        data () {
            const validatePostcode = (rule, value, callback) => {
            var reg=/^[0-9\-]/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的邮政编码'));
            } else {                
                callback();
            }
        };
            return {
                type: '',
                cityId: '',
                cityModel: {},
                provinceList: [],
                addressList: [],
                administrativeList: [],
                economicList: [],
                countryList: [],
                cityTypeList: [],
                cityLevelList: [],
                ruleValidate: {
                    cityName: [
                        { required: true, message: '城市名称不能为空', trigger: 'blur'}
                    ],
                    province: [
                        { required: true, message: '省份不能为空', trigger: 'blur', type:'number' }
                    ],
                    administrative: [
                        { required: true, message: '行政区域不能为空', trigger: 'blur', type:'number'  }
                    ],
                    economicRegion: [
                        { required: true, message: '经济区域不能为空', trigger: 'blur', type:'number'  }
                    ],
                    country: [
                        { required: true, message: '国家不能为空', trigger: 'blur', type:'number'  }
                    ],
                    cityLevel: [
                        { required: true, message: '城市级别不能为空', trigger: 'blur', type:'number'  }
                    ],
                    cityType: [
                        { required: true, message: '城市类别不能为空', trigger: 'blur', type:'number'  }
                    ],
                    isCapital: [
                        { required: true, message: '请选择是否是省会', trigger: 'blur', type:'number'  }
                    ],
                    isMunicipalities: [
                        { required: true, message: '请选择是否是直辖市', trigger: 'blur', type:'number'  }
                    ],
                    cityCode: [
                        { required: true, message: '城市代码不能为空', trigger: 'blur' }
                    ],
                    // postCode: [
                    //     {validator: validatePostcode, trigger: 'blur'}
                    // ]
                }
            }
        },
        mounted () {
            //获取省份
            this.getCountryList();
            this.getProvinceList();
            this.getAdministrativeList();
            this.getEcoRegionList();
            this.getCityLevelList();
            this.getCityTypeList();
            //获取城市信息
            this.cityId = this.$route.query.id;
            this.getCityInfo();
        },
        methods: {
            getCityInfo() {
                var self=this;
                Vue.ajax.send({
                name: 'city.get',
                data: {
                    city: self.cityId,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.cityModel = data.data;

                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
            },
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
           getAdministrativeList(){
                var self=this;
                Vue.ajax.send({
                name: 'city.administrativeList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.administrativeList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
           getEcoRegionList(){
                var self=this;
                Vue.ajax.send({
                name: 'city.ecoRegionList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.economicList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
           getCityLevelList(){
                var self=this;
                Vue.ajax.send({
                name: 'city.levelList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.cityLevelList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
           getCityTypeList() {
               var self=this;
                Vue.ajax.send({
                name: 'city.typeList',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.cityTypeList = data.data.dataList;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
             });
           },
            cancel () {
                this.$router.push("/standard/dictionary/city/list");
            },
            save() {
                this.$refs['cityForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: "city.edit",
                        data: {
                            city: self.type == 1 ? self.cityId  : self.cityModel.city,
                            cityName: self.cityModel.cityName,
                            country: self.cityModel.country,
                            province: self.cityModel.province,
                            administrative: self.cityModel.administrative,
                            economicRegion: self.cityModel.economicRegion,
                            postcode: self.cityModel.postcode,
                            cityLevel: self.cityModel.cityLevel,
                            cityType: self.cityModel.cityType,
                            isCapital: self.cityModel.isCapital,
                            isMunicipalities: self.cityModel.isMunicipalities,
                            cityCode: self.cityModel.cityCode
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.$router.push("/standard/dictionary/city/list");
                                
                                self.$Message.success('编辑城市提交成功！');
                                
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }
              })  
            }
        }
    }
</script>