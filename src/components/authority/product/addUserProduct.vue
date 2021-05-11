<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title">新增产品</h2>
        <div class="mt20">
            <Form :label-width="150" :model="Product" ref="ProductForm" :rules="ruleValidate">
            
                <FormItem label="用户名称" >
                    <Input :value="userName" style="width:500px" readonly/>
                </FormItem>
                <FormItem label="产品" prop="productId">
                    <Select  v-model="Product.productId"  style="width:500px" @on-change="getProductInfo" placeholder="请选择产品">
                        <Option v-for="item in productList" :value="item.productId" :key="item.productId">{{ item.productName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="用户产品名称" prop="userProductName">
                    <Input v-model="Product.userProductName" style="width:500px" placeholder="请填写用户产品名称"/>
                </FormItem>
                <FormItem label="总数量" prop="totalCount">
                    <InputNumber v-model="Product.totalCount" style="width:500px" :min="1" :max="999999999"/>
                </FormItem>
                <FormItem label="有效期">
                    <FormItem prop="productBeginDate" style="display:inline-block">
                        <DatePicker placeholder="请选择开始日期" format="yyyy年MM月dd日" v-model="Product.productBeginDate"  type="date"   style="width: 230px;" :editable="false"></DatePicker>
                    </FormItem>
                    <span class="pl10 pr10">至</span>
                    <FormItem prop="productEndDate" style="display:inline-block">
                        <DatePicker placeholder="请选择结束日期" format="yyyy年MM月dd日" v-model="Product.productEndDate"  type="date"   style="width: 230px;" :editable="false"></DatePicker>
                    </FormItem>
                </FormItem>
                <!-- 产品维度 维度值 -->
                <FormItem v-for="(dimAndValueSelect,index) in dimAndValueSelectList" :label="dimAndValueSelect.dimensionName"  :key="dimAndValueSelect.dimensionId">
                    <Select v-model="dimAndValueSelect.dimensionValueIdList" 
                            filterable 
                            multiple 
                            :disabled="dimAndValueSelect.selectAll"
                            remote :remote-method="dimValSelectKeyQuery"
                            :loading="dimValSelectLoading" style="width:500px" >
                        <Option v-for="item in dimAndValueSelect.dimensionValueList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                    <Checkbox label="全选" v-model="dimAndValueSelect.selectAll" @on-change="changeSelectAll($event,dimAndValueSelect)">
                        <span>全选</span>
                    </Checkbox>
                 <div class="ivu-form-item-error-tip" v-show="productDimensionError">请选择维度值</div>
                </FormItem>
                <FormItem label="请选择度量">
                    <CheckboxGroup v-model="checkedMeasureData">
                        <Checkbox v-for="item in allMeasureData" :label="item.id"  :key="item.id">
                            <span>{{item.title}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                     <div class="ivu-form-item-error-tip" v-show="checkedMeasureError">请选择度量</div>
                </FormItem>
                <FormItem>
                    <Button @click="handleClickCancelButton">取消</Button>
                    <Button type="primary"  @click="addUserProduct">保存</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'addProduct',
        data () {
            const validateEndDate = (rule, value, callback) => {
                if(this.Product.productBeginDate && this.Product.productEndDate){
                    if(new Date(this.Product.productEndDate)<new Date(this.Product.productBeginDate)){
                        callback(new Error('结束日期不能小于开始日期'));
                        return;
                    }
                }
                callback();
            }
            return {
                // 用户ID 路由传值
                userId:this.$route.query.userId,
                // 用户名称 路由传值
                userName:this.$route.query.userName,
                // 产品列表 页面加载时获取
                productList:'',
                // 维度 维度值 下拉列表数据
                dimAndValueSelectList:[],
                // 维度值校验 是否显示错误提示
                productDimensionError: false,
                // 度量校验 是否显示错误提示
                checkedMeasureError: false,
                // 所有度量 数据
                allMeasureData: [],
                // 产品实体
                Product: {totalCount:1,productId:""},
                // 新增产品参数 所选度量列表
                checkedMeasureData: [],
                // 维度值下拉列表 键入时触发异步查询，加载效果是否启用
                dimValSelectLoading:false,
                // 表单校验
                ruleValidate: {
                    
                    productId: [
                        { required: true, message: '产品不能为空', trigger: 'blur', type: 'number'}
                    ],
                    userProductName: [
                        { required: true, message: '用户产品名称不能为空', trigger: 'blur'}
                    ],
                    totalCount: [
                        { required: true, message: '总数量不能为空', trigger: 'blur', type: 'number'}
                    ],
                    productBeginDate: [
                        { required: true, message: '请选择开始日期', trigger: 'change', pattern: /.+/ }
                    ],
                    productEndDate:[
                        { required: true, message: '请选择结束日期', trigger: 'change', pattern: /.+/ },
                        { validator: validateEndDate, trigger: 'blur' }
                    ]
                }
            }
        },
        mounted () {
            // 获取产品列表
            this.getProductList();
        },
        methods: {
            // 获取所有产品列表
            getProductList() {
                var self = this;
                Vue.ajax.send({
                name: 'product.child.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //绑定产品列表数据
                        self.productList = data.data.dataList;
                        self.Product.productId='';
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
                });
            },

            // 获取产品信息，回显
            getProductInfo(){
                var self = this;
                Vue.ajax.send({
                    name: 'product.child.self.user',
                    data: {
                        productId: self.Product.productId
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            //回显此产品的维度 维度值下拉列表
                            self.dimAndValueSelectList = data.data.dimAndValueSelectList;
                            //回显度量
                            self.allMeasureData = data.data.measureList;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
           
           // 维度值下拉列表键入搜索值异步搜索 query键入的搜索值  index 对应维度下标
           dimValSelectKeyQuery(query,index){
               var self = this;
               console.log(query,index);
               console.log(self.dimAndValueSelectList[index]);
               var baseSql = self.dimAndValueSelectList[index].dimensionValueSql.replace('%%','%'+query+'%');
               console.log(baseSql);
               //self.dimValSelectLoading = true;
               if(baseSql){
                   Vue.ajax.send({
                        name: 'product.dimVals.self',
                        data: {
                            baseSql: baseSql,
                            productId:self.Product.productId,
                            dimensionId:self.dimAndValueSelectList[index].dimensionId
                        },
                        success: function(data) {
                            if (!!data && data.code == '0') {
                                self.dimAndValueSelectList[index].dimensionValueList = data.data;
                            } else {
                                this.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                            //self.dimValSelectLoading = false;
                        }
                    });
               }
           },
            
            // 按钮点击事件 取消新增操作，返回用户产品列表
            handleClickCancelButton() {
                this.$router.push("/authority/product/userProList");
            },

            // 校验是否选择维度值
            isSelectedDimVals(){
                var self=this;
                var isSelected = false;
                self.dimAndValueSelectList.forEach(dimAndValueSelect=>{
                    if(dimAndValueSelect.dimensionValueIdList && dimAndValueSelect.dimensionValueIdList.length>0){
                        isSelected = true;
                    }
                    if(!!dimAndValueSelect.selectAll && dimAndValueSelect.selectAll==true){
                        isSelected=true;
                    }
                    console.log(dimAndValueSelect.dimensionValueIdList);
                });
                return isSelected;
            },

            //新增用户产品
            addUserProduct() {
                console.log(this.dimAndValueSelectList)
                //return
                var self=this;
                var isSelectedDimValsFlag = self.isSelectedDimVals();

                self.$refs['ProductForm'].validate((valid) => {
                    console.log(valid);
                    console.log(isSelectedDimValsFlag);
                    console.log(self.checkedMeasureData.length);
                    // 校验通过 并且选择了维度和度量
                    if (valid && isSelectedDimValsFlag && self.checkedMeasureData.length > 0) {
                        Vue.ajax.send({
                            name: 'user.addUserProduct',
                            data: {
                                userId: self.userId,
                                productId:  self.Product.productId,
                                userProductName:self.Product.userProductName,
                                totalCount:self.Product.totalCount,
                                productBeginDate: self.Product.productBeginDate.format('YYYY-MM-DD'),
                                productEndDate: self.Product.productEndDate.format('YYYY-MM-DD'),
                                dimAndValueSelectList:self.dimAndValueSelectList, // 维度-维度值
                                measures: self.checkedMeasureData.distinct(),  //  度量
                                createUser: Vue.getUser().userName,
                            },
                            success: function(data) {
                                if (!!data && data.code=='0') {
                                    self.$router.push("/authority/product/userProlist");
                                    self.$Message.success('新增用户产品信息提交成功！');
                                } else {
                                    self.$Modal.error({
                                        title: '',
                                        content: data.message
                                    });
                                }
                            }
                        });
                    // 校验不通过 或 没选维度值 没选度量
                    }else {
                        // 维度值校验
                        if (!isSelectedDimValsFlag) {
                                self.productDimensionError = true;
                        }else {
                            self.productDimensionError = false;
                        }
                        // 度量校验
                        if (self.checkedMeasureData.length == 0 ) {
                                self.checkedMeasureError = true;
                        }else {
                            self.checkedMeasureError = false;
                        }
                    }
               })
            },
            changeSelectAll:function(e,item){
                console.log(e,item)
                if(e){
                    item.dimensionValueIdList=null
                }
            }
        }
    }
</script>