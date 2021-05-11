<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title">编辑产品</h2>
        <div class="mt20">
            <Form :label-width="150" :model="Product" ref="ProductForm" :rules="ruleValidate">
                <FormItem label="数据包名称" prop="packageName">
                    <Input v-model="Product.packageName" style="width:500px" placeholder="请填写数据包名称" disabled/>
                </FormItem>
                <FormItem label="产品名称" prop="productName">
                    <Input v-model="Product.productName" style="width:500px" placeholder="请填写产品名称"/>
                </FormItem>
                <FormItem label="备注" prop="productDesc">
                    <Input type="textarea" :rows='3' v-model="Product.productDesc" style="width: 500px" :maxlength="200"></Input>
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
                    <Button type="primary"  @click="editUserProduct">保存</Button>
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
            
            return {
                // 用户产品ID 路由传值
                userProductId:this.$route.query.userProductId,
                // 产品ID
                productId:this.$route.query.productId,
                productList:[],
                // 维度 维度值 下拉列表数据
                dimAndValueSelectList:[],
                // 维度值校验 是否显示错误提示
                productDimensionError: false,
                // 度量校验 是否显示错误提示
                checkedMeasureError: false,
                // 所有度量 数据
                allMeasureData: [],
                // 产品实体
                Product: {},
                // 用户产品实体
                UserProduct: {},
                // 新增产品参数 所选度量列表
                checkedMeasureData: [],
                // 维度值下拉列表 键入时触发异步查询，加载效果是否启用
                dimValSelectLoading:false,
                // 表单校验
                ruleValidate: {
                    productName: [
                        { required: true, message: '产品名称不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted () {
            // 获取产品
            this.getProductInfo();

            this.getUserProDetail();
        },
        methods: {
           
            // 获取产品信息，回显
            getProductInfo(){
                var self = this;
                Vue.ajax.send({
                    name: 'product.child.all',
                    data: {
                        productId: self.productId,
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.Product = data.data;
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

            // 获取用户产品 回显
            getUserProDetail() {
                var self = this;
                Vue.ajax.send({
                    name: 'product.child.info',
                    data: {
                        productId: self.productId,
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.UserProduct = data.data;
                            // 绑定用户产品 度量 选中
                            var userProductMeasureIds = [];
                            data.data.measureList.forEach(measure =>{
                                userProductMeasureIds.push(measure.id);
                            });
                            self.checkedMeasureData = userProductMeasureIds;
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
                        name: 'product.dimVals',
                        data: {
                            baseSql: baseSql,
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
                this.$router.push("/authority/product/plist");
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

            // 编辑用户产品
            editUserProduct() {
                var self=this;
                var isSelectedDimValsFlag = self.isSelectedDimVals();

                self.$refs['ProductForm'].validate((valid) => {
                    console.log(valid);
                    console.log(isSelectedDimValsFlag);
                    console.log(self.checkedMeasureData.length);
                    // 校验通过 并且选择了维度和度量
                    if (valid && isSelectedDimValsFlag && self.checkedMeasureData.length > 0) {
                        Vue.ajax.send({
                            name: 'product.child.edit',
                            data: {
                                productId: self.Product.productId,
                                userProductName:self.Product.productName,
                                note:self.Product.productDesc,
                                dimAndValueSelectList:self.dimAndValueSelectList, // 维度-维度值
                                measures: self.checkedMeasureData.distinct(),  //  度量
                                createUser: Vue.getUser().userName,
                            },
                            success: function(data) {
                                if (!!data && data.code=='0') {
                                    self.$router.push("/authority/product/plist");
                                    self.$Message.success('编辑产品信息提交成功！');
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