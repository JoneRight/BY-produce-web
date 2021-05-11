<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title">新增产品</h2>
        <div class="mt20">
            <Form :label-width="100" :model="Product" ref="ProductForm" :rules="ruleValidate">
                 
                <FormItem label="数据包名称" prop="packageId">
                    <Select  v-model="Product.packageId"  style="width:500px" @on-change="getPackageInfo" placeholder="请选择产品">
                        <Option v-for="item in productList" :value="item.productId" :key="item.productId">{{ item.productName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品名称" prop="productName">
                    <Input v-model="Product.productName" style="width:500px" placeholder="请填写产品名称"/>
                </FormItem>
                <FormItem label="备注" prop="note">
                    <Input type="textarea" :rows='3' v-model="Product.note" style="width: 500px" :maxlength="200"></Input>
                </FormItem>
                <!-- 产品维度 维度值 -->
                <FormItem v-for="(dimAndValueSelect,index) in dimAndValueSelectList" :label="dimAndValueSelect.dimensionName"  :key="dimAndValueSelect.dimensionId">
                    <Select v-model="dimAndValueSelect.dimensionValueIdList" 
                            filterable 
                            multiple 
                            :disabled="dimAndValueSelect.selectAll"
                            remote :remote-method="dimValSelectKeyQuery"
                             style="width:500px" >
                        <Option v-for="item in dimAndValueSelect.dimensionValueList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                    <Checkbox label="全选" v-model="dimAndValueSelect.selectAll" @on-change="changeSelectAll($event,dimAndValueSelect)">
                        <span>全选</span>
                    </Checkbox>
                    <div class="ivu-form-item-error-tip" v-show="productDimensionError">请选择维度值</div>
                </FormItem>
                <FormItem label="请选择度量" v-show="dimValSelectLoading">
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
            return {
                 
                // 产品实体
                Product: {},
                productList:[],
                // 维度 维度值 下拉列表数据
                dimAndValueSelectList:[],
                // 所有度量 数据
                allMeasureData: [],
                // 维度值下拉列表 键入时触发异步查询，加载效果是否启用
                dimValSelectLoading:false,
                // 新增产品参数 所选度量列表
                checkedMeasureData: [],
                // 维度值校验 是否显示错误提示
                productDimensionError: false,
                // 度量校验 是否显示错误提示
                checkedMeasureError: false,
                // 表单校验
                ruleValidate: {
                    packageId: [
                        { required: true, message: '数据包不能为空', trigger: 'blur', type: 'number'}
                    ],
                    productName: [
                        { required: true, message: '产品名称不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted () {
            // 获数据包列表
            this.getProductList();
        },

        watch: {
             
        },
        methods: {
            // 获取所有数据包列表
            getProductList() {
                var self = this;
                Vue.ajax.send({
                name: 'product.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        //绑定产品列表数据
                        self.productList = data.data.dataList;
                        self.Product.packageId='';
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
                });
            },
            // 获取某个数据包信息，回显
            getPackageInfo(){
                var self = this;
                
                Vue.ajax.send({
                    name: 'product.info',
                    data: {
                        productId: self.Product.packageId
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            //回显此产品的维度 维度值下拉列表
                            self.dimAndValueSelectList = data.data.dimAndValueSelectList;
                            //回显度量
                            self.allMeasureData = data.data.measureList;

                            self.dimValSelectLoading=true
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
                self.productDimensionError = false;
                self.checkedMeasureError = false;
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
           changeSelectAll:function(e,item){
                console.log(e,item)
                if(e){
                    item.dimensionValueIdList=null
                }
            },
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
            //新增用户产品
            addUserProduct() {
                console.log(this.dimAndValueSelectList)
                var self=this;
                var isSelectedDimValsFlag = self.isSelectedDimVals();

                self.$refs['ProductForm'].validate((valid) => {
                    console.log(valid);
                    console.log(isSelectedDimValsFlag);
                    console.log(self.checkedMeasureData.length);
                    // 校验通过 并且选择了维度和度量
                    if (valid && isSelectedDimValsFlag && self.checkedMeasureData.length > 0) {
                        Vue.ajax.send({
                            name: 'product.child.add',
                            data: {
                                packageId:self.Product.packageId,
                                userProductName:self.Product.productName,
                                note:self.Product.note,
                                dimAndValueSelectList:self.dimAndValueSelectList, // 维度-维度值
                                measures: self.checkedMeasureData.distinct(),  //  度量
                                createUser: Vue.getUser().userName,
                            },
                            success: function(data) {
                                if (!!data && data.code=='0') {
                                    self.$router.push("/authority/product/plist");
                                    self.$Message.success('新增产品信息提交成功！');
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
        }
    }
</script>