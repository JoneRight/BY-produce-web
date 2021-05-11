<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title">新增数据包</h2>
        <div class="mt20">
            <Form :label-width="100" :model="Product" ref="ProductForm" :rules="ruleValidate">
                
                <FormItem label="数据类型" prop="productType">
		            <Select  v-model="Product.productType" placeholder="请选择数据类型" style="width:400px">
				        <Option :value="10">购药</Option>
                        <Option :value="20">门急诊</Option>
                        <Option :value="30">病案</Option>
                        <Option :value="40">医嘱</Option>
				    </Select>
		        </FormItem>
                <FormItem label="数据包名称" prop="productName">
                    <Input v-model="Product.productName"   style="width:400px"/>
                </FormItem>
                <FormItem label="数据包描述">
                    <Input v-model="Product.productDesc" style="width:400px"/>
                </FormItem>
                <!-- 原来是sql，现在是立方体名称 -->
                <FormItem label="立方体名称" prop="productJiontSql">
                    <Select  v-model="productJiontSql" placeholder="请选择立方体" style="width:400px" @on-change="handleCubeSelectChange">
				        <Option v-for="item in cubeSelectData" :value="item.name" :key="item.name">{{item.descriptor}}</Option>
				    </Select>
                </FormItem>
                <FormItem label="数据跨度" prop="productBeginDate">
		            <DatePicker placeholder="请选择开始日期" format="yyyy年MM月dd日"  v-model="Product.productBeginDate"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
                    <span class="pl10 pr10">至</span>
                    <DatePicker placeholder="请选择结束日期" format="yyyy年MM月dd日" v-model="Product.productEndDate"  type="date"   style="width: 180px;" :editable="false"></DatePicker>
		        </FormItem>
                <FormItem label="选择数据维度">
                    <div class="ivu-transfer">
                        <div class="ivu-transfer-list" style="width: 250px; height: 400px;">
                            <div class="ivu-transfer-list-header">
                                <span class="ivu-transfer-list-header-title">选择维度</span>
                            </div> 
                            <div class="ivu-transfer-list-body ivu-transfer-list-body-with-footer">
                                <div class="ivu-transfer-list-content pl10">
                                    <Tree ref="allDimensionTree" :data="allDimensionTreeData" show-checkbox @on-check-change="allDimensionTreeChange"></Tree>
                                </div>
                                
                            </div>
                        </div>
                        <div class="ivu-transfer-operation">
                            <button type="button" :disabled="removeDimensionButtonDisabled" class="ivu-btn ivu-btn-primary ivu-btn-small" @click="removeProductDimensionTreeNodes">
                                <span><i class="ivu-icon ivu-icon-ios-arrow-back"></i><span>移除</span></span>
                            </button> 
                            <button type="button" :disabled="addDimensionButtonDisabled" class="ivu-btn ivu-btn-primary ivu-btn-small" @click="addProductDimensionTreeNodes">
                                <span><span>添加</span> <i class="ivu-icon ivu-icon-ios-arrow-forward"></i></span>
                            </button>
                        </div>
                        <div class="ivu-transfer-list" style="width: 250px; height: 400px;">
                            <div class="ivu-transfer-list-header">
                                <span class="ivu-transfer-list-header-title">已选择维度</span>
                            </div>
                            <div class="ivu-transfer-list-body ivu-transfer-list-body-with-footer">                              
                                <div class="ivu-transfer-list-content pl10">
                                    <Tree ref="productDimensionTree" :data="productDimensionTreeData" show-checkbox @on-check-change="productDimensionTreeChange"></Tree>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="ivu-form-item-error-tip" v-show="productDimensionTreeError">请选择维度</div>
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
                    <Button type="primary"  @click="saveProInfo">保存</Button>
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
                // 添加维度 按钮 是否禁用
                addDimensionButtonDisabled: true,
                // 移除维度 按钮 是否禁用
                removeDimensionButtonDisabled: true,
                // 维度校验 是否显示错误提示
                productDimensionTreeError: false,
                // 度量校验 是否显示错误提示
                checkedMeasureError: false,
                // 全局维度树 数据
                allDimensionTreeData: [],
                // 全局总维度
                allDimension: [],
                // 产品维度树 数据
                productDimensionTreeData: [],
                // 所有度量 数据
                allMeasureData: [],
                // 立方体下拉列表数据
                cubeSelectData:[],
                // 产品实体
                Product: {},
                // 产品实体
                productJiontSql:"",
                // 新增产品参数 所选维度列表
                dimensionsList: [],
                // 新增产品参数 所选度量列表
                checkedMeasureData: [],
                // 表单校验
                ruleValidate: {
                    
                    productType: [
                        { required: true, message: '请选择数据类型', trigger: 'blur', type: 'number'}
                    ],
                    productName: [
                        { required: true, message: '数据包名称不能为空', trigger: 'blur'}
                    ],
                    productJiontSql: [
                         { required: true, message: '请选择立方体名称', trigger: 'blur'}
                    ],
                    productBeginDate: [
                        { required: true, message: '请选择开始日期', trigger: 'change', pattern: /.+/ }
                    ]
                }
            }
        },
        mounted () {
            // 获取所有立方体列表 
            this.getCubeList ();
            //获取所有维度数据
            this.getDimensionList();
            //获取所有度量
            // this.getMeasureList();
            
            
        },

        watch: {
            productJiontSql: function() {
                this.Product.productJiontSql = this.productJiontSql;
                this.getMeasureList(this.productJiontSql);
                this.getProductCubeDesc (this.productJiontSql);
            }
        },
        methods: {

            // 获取所有立方体列表 
            getCubeList () {
                var self = this;
                Vue.ajax.send({
                    name: 'product.cubeList',
                    data: {
                        cubeName:'',
                        projectName:'cnrud_product',
                        offset:0,
                        limit:9999,
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            // 绑定到立方体下拉列表 数据中
                            self.cubeSelectData=data.data.cubeOutputs;  
                            if(!!self.cubeSelectData && self.cubeSelectData.length > 0){
                                self.productJiontSql = self.cubeSelectData[0].name;
                            } 
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },

            // 获取所有维度 
            getDimensionList () {
                var self = this;
                Vue.ajax.send({
                    name: 'product.dimensionList',
                    data: {},
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            // 将维度数据 绑定到全局维度树 数据中
                            // self.allDimensionTreeData=data.data;  
                            self.allDimension=data.data;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },

             // 获取立方体详细信息
            getProductCubeDesc (cubeName) {
                
                var self = this;
                Vue.ajax.send({
                    name: 'product.cubeDesc',
                    data: {
                        cubeName:cubeName
                    },
                    success: function(data) {
                        if (!!data && data.code == '0' && !!data.data) {
                            // 将维度数据 绑定到全局维度树 数据中
                            // temp1.map(item => item.table+"."+item.name);
                            // temp2.map(item => item.expression+"("+item.value+")");
                            var cubeDim = data.data.cubeDimensionOutputs.map(item => item.table+"."+item.name);
                            // var cubeMea = data.data.cubeMeasureOutputs.map(item => item.expression+"("+item.value+")"); 

                            
                            var allDim = [];
                            self.allDimension.forEach(item => {
                                var Dims ={
                                    children:[],
                                    id:item.id,
                                    title:item.title
                                }
                                
                                item.children.forEach(child => {
                                    if(cubeDim.includes(child.cubeColumn)){
                                        Dims.children.push(Object.assign({},child));
                                    }
                                });
                                if(Dims.children.length > 0){
                                    allDim.push(Dims);
                                }
                            });
                            
                            self.allDimensionTreeData = allDim;
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },

            // 获取所有度量
            getMeasureList(cubeName) {
                var self = this;
                    Vue.ajax.send({
                        name: 'product.measureList',
                        data: {
                            cubeName:cubeName,
                        },
                        success: function(data) {
                            if (!!data && data.code == '0') {
                                // 绑定到 所有度量的 checkBox数据中
                                self.allMeasureData = data.data; 
                            } else {
                                this.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
            },

            // 全局维度树 节点change事件 是否禁用添加维度按钮
            allDimensionTreeChange(list){
                if(list.length>0){
                    this.addDimensionButtonDisabled=false;
                }else{
                    this.addDimensionButtonDisabled=true;
                }
            },

            // 所选产品维度树 节点change事件 是否禁用移除维度按钮
            productDimensionTreeChange(list){
                if(list.length>0){
                    this.removeDimensionButtonDisabled=false;
                }else{
                    this.removeDimensionButtonDisabled=true;
                }                
            },

            // 添加所选的维度 到产品维度树中
            addProductDimensionTreeNodes(){
                var self=this;
                //将productDimensionTreeData数组清空
                self.productDimensionTreeData=[];
                // 获取全局维度树的选中及半选节点
                var checkedAndIndeterminateNodes= this.$refs.allDimensionTree.getCheckedAndIndeterminateNodes();
                // 筛选出 选中的带有完整结构的节点
                var rootTrees = checkedAndIndeterminateNodes.filter(node =>{
                    return (node.children);
                });
                // 遍历 组装数据到productDimensionTreeData
                rootTrees.forEach(root =>{
                    // 树根 即维度类别
                    var dimensionClassify = {id:root.id,title:root.title,children:[]};
                    // 遍历 维度孩子节点
                    root.children.forEach(dimensionChildren =>{
                        // 如果维度是 选中 或者是半选中，添加到维度类别
                        if(dimensionChildren.checked || dimensionChildren.indeterminate){
                            // 维度
                            var dimension = {id:dimensionChildren.id,title:dimensionChildren.title,children:[]};
                            // 将维度添加到维度类别中
                            dimensionClassify.children.push(dimension);
                        }
                    });
                    // 将维度类别添加到productDimensionTreeData中
                    self.productDimensionTreeData.push(dimensionClassify);
                });
                // 禁用 移除产品维度树按钮
                this.removeDimensionButtonDisabled=true;
            },

            //  移除产品维度树中 所选的维度
            removeProductDimensionTreeNodes(){
                //移除选中的节点
                var tmpData = this.productDimensionTreeData;
                for (var i = 0; i < tmpData.length; i++) {
                    //拿到某个维度分类节点
                    var item = tmpData[i];
                    if (item.checked == true) {
                        //如果维度分类节点选中了
                        tmpData.splice(i,1);
                        i--
                    }else {
                        //如果维度分类没有被选中
                        //如果维度分类下有维度
                        if (item.children && item.children.length > 0) {
                            //得到维度数组
                            var arr2 = item.children;
                            for (var j = 0; j < arr2.length; j++) {
                                //得到某个维度
                                var item2 = arr2[j];
                                if (item2.checked == true) {
                                    //如果维度节点选中了
                                    arr2.splice(j,1);
                                    j--;
                                }
                            }
                            // 去掉  维度类别的 半选中状态
                            item.indeterminate=false;
                        }
                    }
                }
                // 将移除后的数据 绑定到产品维度树 数据中
                this.productDimensionTreeData = tmpData;
                // 禁用 移除产品维度树按钮
                this.removeDimensionButtonDisabled=true;
            },
            
           // 获取所选 维度
           handlerCheckedDimensionList(){
                var self=this;
                // 清空
                self.dimensionsList = [];
                // 遍历 封装 维度列表 维度值列表 
                self.productDimensionTreeData.forEach(dimensionClassify=>{
                    // 如果类别中有维度
                    if (dimensionClassify.children && dimensionClassify.children.length > 0) {
                        //维度数组
                        var dimensions = dimensionClassify.children;
                        // 遍历维度数组
                        dimensions.forEach(dimension=>{
                            // 将维度ID 添加到维度列表中
                            self.dimensionsList.push(dimension.id);
                           
                        })
                    }
                });
           },
            
            // 按钮点击事件 取消新增操作，返回产品列表
            handleClickCancelButton() {
                this.$router.push("/authority/product/list");
            },
            
            // 立方体下拉列表变动触发，根据立方体名称获取度量
            handleCubeSelectChange(cubeName){
                this.getMeasureList(cubeName);
            },

            // 产品管理 新增产品
            saveProInfo() {
                var self=this;
                
                // 获取所选 的维度列表
                self.handlerCheckedDimensionList();

                self.$refs['ProductForm'].validate((valid) => {
                    console.log(valid);
                    console.log(self.productDimensionTreeData.length);
                    console.log(self.checkedMeasureData.length);
                    // 校验通过 并且选择了维度和度量
                    if (valid && self.productDimensionTreeData.length > 0 && self.checkedMeasureData.length > 0) {
                        
                        Vue.ajax.send({
                            name: 'product.add',
                            data: {
                                productType: self.Product.productType,
                                productName: self.Product.productName,
                                productDesc: self.Product.productDesc,
                                productJiontSql: self.Product.productJiontSql,  // 原来是sql，现在是立方体名称
                                productBeginDate: self.Product.productBeginDate.format('YYYY-MM-DD'),
                                productEndDate: self.Product.productEndDate.format('YYYY-MM-DD'),
                                dimensions: self.dimensionsList.distinct(),  // 维度
                                measures: self.checkedMeasureData.distinct(),  //  度量
                                createUser: Vue.getUser().userName,
                            },
                            success: function(data) {
                                if (!!data && data.code=='0') {
                                    self.$router.push("/authority/product/list");
                                    self.$Message.success('新增数据包信息提交成功！');
                                } else {
                                    self.$Modal.error({
                                        title: '',
                                        content: data.message
                                    });
                                }
                            }
                        });
                    // 校验不通过 或 没选维度 没选度量
                    }else {
                        // 维度校验
                        if (self.productDimensionTreeData.length == 0 ) {
                                self.productDimensionTreeError = true;
                        }else {
                            self.productDimensionTreeError = false;
                        }
                        // 度量校验
                        if (self.checkedMeasureData.length == 0 ) {
                                self.checkedMeasureError = true;
                        }else {
                            self.checkedMeasureError = false;
                        }
                    }
               })
            }
        }
    }
</script>