<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title">编辑药品</h2>
        <div class="mt20" >
                <Form  ref="drugsForm" :model="drugsAdd" :rules="ruleValidate" :label-width="80">
                    <!-- 第一级 -->
                    <FormItem  label="药品分类" prop="drugClassy" >
                        <Input :disabled="true" class="selectWidth" v-model.trim="drugsAdd.drugClassyName" :maxlength="150" />
                        <div class="ivu-form-item-error-tip" v-show="checkedDrugClassy">请选择药品分类</div>
                        <div class="intro" ><Button type="primary" @click="addDrugClassy" >添加</Button></div>
                    </FormItem>
                    <!-- 第二级 -->
                    <FormItem  label="通用名" prop="drugGenericCode" >
                        <Input  :disabled="true" class="selectWidth" v-model.trim="drugsAdd.drugGenericName"/>
                        <div class="ivu-form-item-error-tip" v-show="checkedGeneric">请选择通用名</div>
                        <div class="intro" ><Button type="primary" @click="addGeneric"  >添加</Button></div>
                    </FormItem>
                    <!-- 第三级 -->
                    <FormItem label="药品剂型" prop="formName" >
                        <Input  :disabled="true" class="selectWidth" v-model.trim="drugsAdd.formName"/>
                        <div  class="intro" ><Button type="primary" @click="addForm">添加</Button><Button type="primary" @click="editForm">编辑</Button></div>
                    </FormItem>
                    <FormItem  label="盐酸根" prop="saltAcidCode">
                        <Input  :disabled="true" class="selectWidth" v-model.trim="drugsAdd.saltAcidName"/>
                        <!-- <Select  class="selectWidth" v-model="drugsAdd.saltAcidCode" placeholder="请选择盐酸根，如无，请选择-" filterable  >
                            <Option  v-for="item in drugSaltAcidList" :value="item.saltAcidCode" :key="item.saltAcidCode">{{ item.saltAcidName }}</Option>
                        </Select> -->
                    </FormItem>
    
                    <!-- 第4级 -->
                    <FormItem  label="药品规格" prop="drugSpecCode" >
                        <Select class="selectWidth" filterable
                            remote :remote-method="getSpecList" v-model="drugsAdd.drugSpecCode"  >
                            <Option class="selectOptionWidth" title  v-for="item in specList" :value="item.drugSpecCode" :key="item.drugSpecCode">{{ item.drugSpecName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedSpec">请选择药品规格</div>
                        <div class="intro" ><Button type="primary"  @click="addSpec"  >添加</Button></div>
                    </FormItem>
                    <!-- 第五级 -->
                    <FormItem  label="包装规格" prop="packageSpec" >
                        <Select  class="selectWidth"  filterable
                            remote :remote-method="getPackageSpecList" v-model="drugsAdd.packageSpec"  >
                            <Option  v-for="item in packageSpecList" :value="item.packageSpec" :key="item.packageSpec">{{ item.packageSpecName + ',' + item.minPreparationUnitName + ',' + item.minSaleUnitName + ',' + item.materialName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedPackageSpec">请选择包装规格</div>
                        <div class="intro" ><Button type="primary"  @click="addPackageSpec"  >添加</Button></div>
                        
                    </FormItem>
                    
                    <!-- 第六级 -->
                    <FormItem  label="产品名称" prop="drugProductCode">
                        <!-- <Input :disabled="false"  class="selectWidth" v-model.trim="drugsAdd.drugProductName"  /> -->
                        <Select  class="selectWidth" v-model="drugsAdd.drugProductCode"
                            remote :remote-method="getDrugProductList"  placeholder="请选择产品名称，如无，请选择-" filterable  >
                            <Option  v-for="item in drugProductList" :value="item.drugProductCode" :key="item.drugProductCode">{{ item.drugProductName }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="商品名" prop="drugTradeCode"  >
                        <Select  class="selectWidth"  filterable 
                            remote :remote-method="getTradeList" placeholder="请选择商品名，如无，请选择-" v-model="drugsAdd.drugTradeCode" >
                            <Option v-for="item in tradeList" :value="item.drugTradeCode" :key="item.drugTradeCode">{{ item.drugTradeName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedTradeName">请选择商品名</div>
                        <div class="intro" ><Button type="primary" @click="addTrade" >添加</Button></div>
                    </FormItem>
                    <FormItem label="生产企业" prop="company"  >
                        <Select  class="selectWidth" filterable
                            remote :remote-method="getMedicalList" v-model="drugsAdd.company"  >
                            <Option v-for="item in medicalCompanyList" :value="item.company" :key="item.company">{{ item.companyName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedCompany">请选择生产企业</div>
                        <div class="intro" ><Button type="primary"  @click='addMedicalCompany' >添加</Button></div>
                    </FormItem>
                    <FormItem label="药品编码" prop="drug">
                        <Input :disabled="true" class="selectWidth" placeholder="请输入药品编码，例：DM000008888" v-model.trim="drugsAdd.drug" :maxlength="9" />
                    </FormItem>
                    <!-- 剩余的 -->
                     <FormItem label="给药途径" >
                        <Select  class="selectWidth"  v-model="drugsAdd.pathDrug" filterable>
                            <Option v-for="item in pathDrugList" :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
                        </Select>
                        <div class="intro" ><Button type="primary"  @click="addDrugFormPath"  >添加</Button></div>
                    </FormItem>
                    <FormItem label="单价" prop="unitPrice">
                        <Input  class="selectWidth"  v-model="drugsAdd.unitPrice" :maxlength="18" />
                        <span class="intro" >单位：元</span>
                    </FormItem>
                    <FormItem label="药物的限定日剂量（DDD）" >
                        <Input  class="selectWidth"  v-model.trim="drugsAdd.dailyDdd" :maxlength="9" />
                    </FormItem>
                    <FormItem label="图片信息（药盒、标签）" >
                        <Input  class="selectWidth"  v-model.trim="drugsAdd.pictureMessage" type="textarea" :rows="2"  :maxlength="30" />
                    </FormItem>
                    <FormItem label="说明书的文字和图片" >
                        <Input class="selectWidth"  v-model.trim="drugsAdd.textAndPictures" type="textarea" :rows="2"  :maxlength="30" />
                    </FormItem>
                          
                    <FormItem label="备注">
                        <Input class="selectWidth" v-model="drugsAdd.remark" type="textarea" :rows="4" />
                    </FormItem>
                    <FormItem>
                        <Button @click="cancel">取消</Button>
                        <Button type="primary" @click="saveEditInfo">保存</Button>
                    </FormItem>
                </Form>
        </div>

        <!-- 1药品分类弹框 -->
        <Modal v-model="addDrugClassyModel" title="新增药品分类" class-name="vertical-center-modal" 
                :loading="loadingDrugClassy"  @on-ok="addClassyOk" >
            <Form :model="drugClassyForm" ref="addClassyForm" :rules="ruleDrugClassyValidate" :label-width="70">
                <FormItem label="药品分类编码" prop="drugClassyAdd">
                    <Input  v-model.trim="drugClassyForm.drugClassyAdd" :maxlength="15" />
                </FormItem>  
                <FormItem label="药品分类名称" prop="drugClassyName">
                    <Input  v-model.trim="drugClassyForm.drugClassyName" :maxlength="15" />
                </FormItem> 
                <FormItem label="药品所属范围">
                    <Select  v-model="drugClassyForm.ownRange" filterable >
                        <Option v-for="item in ownRangeList" :value="item.drugOwnRange" :key="item.drugOwnRange">{{ item.drugOwnRangeName }}</Option>
                    </Select>
                </FormItem>  
            </Form>
        </Modal>
        <!-- 2药品通用名弹框 -->
        <Modal v-model="addGenericModel" title="新增通用名" class-name="vertical-center-modal" 
                :loading="loadingGeneric"   @on-ok="addGenericOk" >
                
                <Form :model="genericForm" ref="addGenericForm" :rules="ruleGenericValidate" :label-width="80">
                    <FormItem label="通用名编码" prop="drugGenericCode">
                        <Input v-model.trim="genericForm.drugGenericCode" :maxlength="12" />
                    </FormItem>
                    <FormItem label="通用名名称" prop="drugGenericName">
                        <Input v-model.trim="genericForm.drugGenericName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="通用名别名">
                        <Input v-model.trim="genericForm.drugGenericNameAb" :maxlength="60" />
                    </FormItem>
                    <FormItem label="通用名英文名称">
                        <Input v-model.trim="genericForm.drugGenericNameEn" :maxlength="300" />
                    </FormItem>
                    <FormItem label="ATC"  prop="atc">
                        <Select v-model="genericForm.atc" >
                            <!-- <OptionGroup label="0级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==0"  :value="item.atc" :key="item.atc">{{ item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==1"  :value="item.atc" :key="item.atc">{{ '&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==2"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==3"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugAtcAllList" v-if="item.dataLevel==4"  :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup> -->
                            <OptionGroup label="五级编码">
                                <Option v-for="item in drugAtcAllList" :value="item.atc" :key="item.atc">{{ '&nbsp;&nbsp;&nbsp;' + item.atcName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="SDCC" prop="sdcc">
                        <Select  v-model="genericForm.sdcc" >
                            <OptionGroup label="一级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==0"  :value="item.sdcc" :key="item.sdcc">{{ item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="二级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==1"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="三级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==2"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="四级编码">
                                <Option v-for="item in drugSdccAllList" v-if="item.dataLevel==3"  :value="item.sdcc" :key="item.sdcc">{{ '&nbsp;&nbsp;&nbsp;' + item.sdccName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                </Form>
        </Modal>
        <Modal v-model="editFormModel" title ="修改剂型" class-name="vertical-center-modal"  :loading="loadingForm" @on-ok="editFormOk" >
                     <Form :model="forms" ref="editForm"  :rules="ruleFormValidate" :label-width="100">
                   <FormItem label="药品剂型" prop="form" >
                        <div>
                            <Cascader id="editedForm" style="width:350px;" class="selectWidth" :data="formTreeList" :label-width="100" trigger="hover" v-model="drugsAdd.form" change-on-select></Cascader>
                            <div class="ivu-form-item-error-tip"  v-show="checkedForm">请选择剂型</div>
                        </div>
                   </FormItem>
                     </Form>
        </Modal>
        <!-- 3药品剂型弹框-->
        <Modal v-model="addFormModel" title="新增剂型" class-name="vertical-center-modal" 
                :loading="loadingForm"  @on-ok="addFormOk" >
                
                <Form :model="forms" ref="addForm"  :rules="ruleFormValidate" :label-width="100">
                    <FormItem label="父级剂型" prop="form">
                        <Select  v-model="forms.superiorForm" @on-change='getDataLevel'>
                            <OptionGroup label="0级剂型">
                                <Option  value="-" key="-">{{ "-"}}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级剂型">
                                <Option v-for="item in formLevelList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="剂型名称编码" prop="form">
                        <Input v-model.trim="forms.form" :maxlength="10"  />
                    </FormItem>
                    <FormItem label="剂型名称_中" prop="formNameChinese">
                        <Input v-model.trim="forms.formNameChinese" :maxlength="60"  />
                    </FormItem>
                    <FormItem label="剂型名称_英">
                        <Input v-model.trim="forms.formNameEnglish" :maxlength="60"  />
                    </FormItem>
                    <FormItem label="剂型别名_中">
                        <Input v-model.trim="forms.formAb" :maxlength="6"  />
                    </FormItem>
                    <FormItem label="剂型别名_英">
                        <Input v-model.trim="forms.formEnglishAb" :maxlength="20"  />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="forms.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="forms.remark" :maxlength="150"  :autosize="{minRows: 4,maxRows: 8}"  type="textarea" />
                    </FormItem>
                </Form>
            </Modal>
            <!-- 4药品规格弹框-->
        <Modal v-model="addSpecModel" title="新增药品规格" class-name="vertical-center-modal"  
                :loading="loadingSpec"  @on-ok="addSpeckOk" >
                
                <Form :model="specForm" ref="addSpecForm" :rules="ruleSpecValidate" :label-width="80">
                    <FormItem label="药品规格编码" prop="drugSpecCode">
                        <Input v-model.trim="specForm.drugSpecCode" :maxlength="50" />
                    </FormItem>
                    <FormItem label="药品规格名称" prop="drugSpecName">
                        <Input v-model.trim="specForm.drugSpecName" :maxlength="150" />
                    </FormItem>
                    <FormItem label="药品统一规格">
                        <Select  v-model="specForm.drugUnifiedspecCode"  filterable  remote :remote-method="getDrugUnifiedSpecList"  >
                            <Option v-for="item in unifiedSpecList" :value="item.drugUnifiedspecCode" :key="item.drugUnifiedspecCode">{{ item.drugUnifiedspecName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
        </Modal>
        <!-- 5药品包装规格弹框-->
        <Modal v-model="addPackageModel" title="新增药品包装规格" class-name="vertical-center-modal" 
                :loading="loadingPackageSpec"  @on-ok="addPackageSpecOk" >
                
                <Form :model="packageSpecForm" ref="addPackageSpecForm" :rules="rulePackageValidate" :label-width="80">
                    <FormItem label="包装规格编码" prop="packageSpec">
                        <Input v-model.trim="packageSpecForm.packageSpec"  />
                    </FormItem>
                    <FormItem label="包装规格名称" prop="packageSpecName">
                        <Input v-model.trim="packageSpecForm.packageSpecName"  />
                    </FormItem>
                    <FormItem label="包装材料"  >
                        <Select  v-model="packageSpecForm.materialId" filterable  @on-change="getUnitList">
                            <Option v-for="item in packageMaterialList" :value="item.materialId" :key="item.materialId">{{ item.materialName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="最小制剂单位"  >
                        <Select   v-model="packageSpecForm.minPreparationUnit" filterable >
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="最小销售单位"  >
                        <Select  v-model="packageSpecForm.minSaleUnit" filterable  >
                            <Option v-for="item in unitList" :value="item.unit" :key="item.unit">{{ item.unitName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
        </Modal>
        <!-- 6药品商品名弹框-->
        <Modal v-model="addTradeModel" title="新增商品名" class-name="vertical-center-modal" 
                :loading="loadingTrade" @on-ok="addTradeNameOk" >
                
                <Form :model="tradeForm" ref="addTradeForm" :rules="ruleTradeValidate" :label-width="80">
                    <!-- <FormItem label="商品名编码" prop="drugTradeCode">
                        <Input v-model.trim="tradeForm.drugTradeCode" :maxlength="12" />
                    </FormItem> -->
                    <FormItem label="商品名" prop="drugTradeName">
                        <Input v-model.trim="tradeForm.drugTradeName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="商品名英文名称">
                        <Input v-model.trim="tradeForm.drugTradeNameEn" :maxlength="150" />
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="tradeForm.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 7、生产企业 -->
        <Modal v-model="addMedicalCompanyModel" title="新增生产企业" class-name="vertical-center-modal" 
                :loading="loadingMedical" @on-ok="addMedicalCompanyOk">
                
                <Form :model="medicalForm" ref="addMedicalForm"  :rules="ruleMedicalValidate" :label-width="90">
                    <FormItem label="生产企业编码" prop="company" :maxlength="20">
                        <Input v-model.trim="medicalForm.company" />
                    </FormItem>
                    <FormItem label="生产企业名称" prop="companyName">
                        <Input v-model.trim="medicalForm.companyName" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="中文简称">
                        <Input v-model.trim="medicalForm.chineseShort" :maxlength="60"/>
                    </FormItem>
                    <FormItem label="企业法人">
                        <Input v-model.trim="medicalForm.enterpriseLegal" :maxlength="16"/>
                    </FormItem>
                    <FormItem label="组织机构代码">
                        <Input v-model.trim="medicalForm.organ" :maxlength="16"/>
                    </FormItem>
                    <FormItem label="企业类型" prop="companyType">
                        <Select v-model="medicalForm.companyType" filterable>
                            <Option v-for="item in companyTypeList" :value="item.companyType" :key="item.companyType">{{ item.companyTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="集团编码">
                        <Select v-model="medicalForm.blocId" filterable>
                            <Option v-for="item in blocList" :value="item.blocId" :key="item.blocId">{{ item.blocName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在省" prop="province">
                        <Select v-model="medicalForm.province" filterable @on-change='getCityList'>
                            <Option v-for="item in provinceList" :value="item.province" :key="item.province">{{ item.provinceName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在市" prop="city">
                        <Select v-model="medicalForm.city" filterable>
                            <Option v-for="item in cityList" :value="item.city" :key="item.city">{{ item.cityName }}</Option>
                        </Select>
                    </FormItem>

                </Form>
            </Modal>
        <!-- 8、药品剂型_给药途径 -->
        <Modal v-model="addDrugFormPathModel" title="新增" class-name="vertical-center-modal" @on-ok="addDrugFormPathOk" 
                :loading="loadingFormPath">
                
                <Form :model="drugFormPathForm" ref="addDrugFormPathForm"  :rules="ruleDrugFormPathValidate" :label-width="80">
        
                    <FormItem label="剂型" prop="form">
                        <Select v-model="drugFormPathForm.form" filterable >
                            <Option v-for="item in formList" :value="item.form" :key="item.form">{{ item.formNameChinese }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="给药途径" prop="pathDrug">
                        <Select v-model="drugFormPathForm.pathDrug" filterable >
                             <Option  v-for="item in pathDrugTmpList"  :value="item.pathDrug" :key="item.pathDrug">{{  item.pathDrugName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="drugFormPathForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                    </FormItem>

                </Form>
            </Modal>

        <!-- 药品有效期弹框-->
        <Modal v-model="addValidityModel" title="新增药品有效期" class-name="vertical-center-modal" 
                :loading="loadingDrugValidity" @on-ok="addDrugValidityOk">
                
                <Form :model="drugValidityForm" ref="addDrugValidityForm"  :rules="ruleValidityValidate" :label-width="90">
                    <!-- <FormItem label="编码" prop="drugValidityId">
                        <Input v-model.trim="drugValidityForm.drugValidityId" :maxlength="9"/>
                    </FormItem>-->
                    <FormItem label="药品编码" prop="drug">
                        <Input :disabled="true" v-model.trim="drugValidityForm.drug" :maxlength="20"/>
                    </FormItem> 
                    <FormItem label="药品本位码" prop="sdcc18">
                        <Input v-model.trim="drugValidityForm.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准文码">
                        <Input v-model.trim="drugValidityForm.approveNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准日期">
                        <DatePicker placeholder="请选择批准日期" format="yyyy年MM月dd日"  v-model="drugValidityForm.approveDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="有效期截止日">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugValidityForm.invalidDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="原批准文码" >
                        <Input v-model.trim="drugValidityForm.approveNumberOld" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="开始年月" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" type="month" format="yyyyMM"  v-model="drugValidityForm.startYearmonth" style="width: 398px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束年月" prop="stopYearmonth">
                        <DatePicker placeholder="请选择结束年月" type="month" format="yyyyMM"  v-model="drugValidityForm.stopYearmonth" style="width: 398px"></DatePicker>
                    </FormItem>
                    


                </Form>
            </Modal>

            <!-- 进口药品-->
            <Modal v-model="addImportModel" title="新增进口药品" class-name="vertical-center-modal" 
                    :loading="loadingDrugImport" @on-ok="addDrugImportOk" >
                <Form :model="drugImportForm" ref="addDrugImportForm"  :rules="ruleImportValidate" :label-width="90">
                    <!-- <FormItem label="编码" prop="recordId">
                        <Input number v-model.trim="drugImportForm.recordId" :maxlength="9"/>
                    </FormItem> -->
                    <FormItem label="药品编码" prop="drug">
                        <Input :disabled="true" v-model.trim="drugImportForm.drug" :maxlength="20"/>
                    </FormItem> 
                    <FormItem label="药品本位码" prop="sdcc18">
                        <Input v-model.trim="drugImportForm.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="开始年月" prop="startYearmonth">
                        <DatePicker placeholder="请选择开始年月" type="month" format="yyyyMM"  v-model="drugImportForm.startYearmonth" style="width: 398px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束年月" prop="stopYearmonth">
                        <DatePicker placeholder="请选择结束年月" type="month" format="yyyyMM"  v-model="drugImportForm.stopYearmonth" style="width: 398px"></DatePicker>
                    </FormItem>
                    <FormItem label="注册证码" prop="registerNumber">
                        <Input v-model.trim="drugImportForm.registerNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="分包装批准文码">
                        <Input v-model.trim="drugImportForm.subpackApproval" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="发证日期" prop="certificationDate">
                        <DatePicker placeholder="请选择发证日期" format="yyyy年MM月dd日"  v-model="drugImportForm.certificationDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="有效期截止日" prop="invalidDate">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugImportForm.invalidDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="分包装企业">
                        <Select v-model="drugImportForm.poinpackcompanyId" filterable >
                            <Option v-for="item in poinpackList" :value="item.poinpackcompanyId" :key="item.poinpackcompanyId">{{ item.poinpackcompanyName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分包装批准文码日期">
                         <DatePicker placeholder="请选择分包装批准文码日期" format="yyyy年MM月dd日"  v-model="drugImportForm.subpackApprovalDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="分包装文码有效日期">
                        <DatePicker placeholder="请选择分包装文码有效日期" format="yyyy年MM月dd日"  v-model="drugImportForm.subpackExpirationDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
                </Form>
            </Modal>



    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'drugs',
        data () {
            const validateNumber= (rule, value, callback) => {
                var reg=/^[0-9]*$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入数字'));
                } else {                
                    callback();
                }
            };
            const validatePrice = (rule, value, callback) => {
                var reg = /^\d*\.{0,1}\d{0,4}$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的单价'));
                } else {                
                    callback();
                }
            };
            return {
                drugKey: '',
                dataLevelTmp: "",
                drugJoinCodeTmp: '',
                checkedSuperDrug: false,
                checkedDrugClassy: false,
                checkedGeneric: false,
                checkedForm: false,
                checkedSpec: false,
                checkedPackageSpec: false,
                checkedTradeName: false,
                checkedCompany: false,
                //是否进口药品
                checkedDrugValidity: false,
                checkedDrugImport: false,
                //是否otc药品
                checkedOtcStartMonth: false,
                checkedOtcStopMonth: false,
                //是否妊娠禁用药
                checkedLactatingStartMonth: false,
                checkedLactatingStopMonth: false,
                //是否医保用药
                checkedRuralStartMonth: false,
                checkedRuralStopMonth: false,
                //是否麻醉药物
                checkedNarcotizeStartMonth: false,
                checkedNarcotizeStopMonth: false,
                //是否毒性药物
                checkedVirulenceStartMonth: false,
                checkedVirulenceStopMonth: false,
                //是否放射性药物
                checkedRadioStartMonth: false,
                checkedRadioStopMonth: false,
                //是否基本药物
                checkedEssentialStartMonth: false,
                checkedEssentialStopMonth: false,
                //是否国家集处方药
                checkedNationalStartMonth: false,
                checkedNationalStopMonth: false,
                //是否特殊药品
                checkedSpecialStartMonth: false,
                checkedSpecialStopMonth: false,
                //是否肾病患者慎用药
                checkedRenalStartMonth: false,
                checkedRenalStopMonth: false,
                //是否社区用药
                checkedCommunityStartMonth: false,
                checkedCommunityStopMonth: false,
                //是否肝功能不全慎用药
                checkedDysfuncStartMonth: false,
                checkedDysfuncStopMonth: false,
                //是否精神用药
                checkedSpiritStartMonth: false,
                checkedSpiritStopMonth: false,



                addDrugClassyModel: false,
                addGenericModel: false,
                addFormModel: false,
                editFormModel:false,
                addSpecModel: false,
                addPackageModel: false,
                addTradeModel: false,
                addMedicalCompanyModel: false,
                addValidityModel: false,
                addImportModel: false,
                addDrugFormPathModel: false,

                loadingDrugClassy: true,
                loadingGeneric: true,
                loadingForm: true,
                loadingSpec: true,
                loadingPackageSpec: true,
                loadingTrade: true,
                loadingMedical: true,
                loadingFormPath: true,
                loadingCompany: true,
                loadingDrugImport: true,
                loadingDrugValidity: true,
                //父级药品远程搜索
                loadingSuperDurgSearch: false,

                drugClassyForm: {},
                genericForm: {},
                forms: {},
                specForm: {
                    drugUnifiedspecCode: '',
                },
                packageSpecForm: {},
                tradeForm: {},
                medicalForm: {
                    city: ''
                },
                drugFormPathForm: {},
                drugValidityForm: {},
                drugImportForm: {},
                
                drugList: [],
                drugClassyList: [],
                ownRangeList: [],
                genericList: [],
                drugAtcAllList: [],
                drugSdccAllList: [],
                drugSaltAcidList: [],
                drugImportList: [],
                drugValidityList: [],
                formList: [],
                formLevelList: [],
                drugProductList: [],
                specList: [],
                unifiedSpecList: [],
                packageSpecList: [],
                formTreeList: [],
                packageMaterialList: [],
                unitList: [],
                tradeList: [],
                medicalCompanyList: [],
                blocList: [],
                companyTypeList: [],
                addressList: [],
                provinceList: [],
                cityList: [],
                pathDrugList: [],
                pathDrugTmpList: [],
                otcClassyList: [],
                riskGradeList: [],
                poinpackList: [],
                drugsAdd: {
                    drug: '',
                    drugClassy: '',
                    drugClassyName: '',
                    drugSpecCode: '',
                    drugSpecName: '',
                    drugProductName: '',
                    forms: [],
                    pathDrug:'',
                    unitPrice:"",
                    isEditForm:0,
                    formName: ''
                    // isOtc: '0',
                    // isLactatingCaution: '0',
                    // isRural: '0',
                    // isNarcotize: '0',
                    // isVirulence: '0',
                    // isRadioactivity: '0',
                    // isEssential: '0',
                    // isNationalFormulary: '0',
                    // isSpecial: '0',
                    // isRenalDiseaseCare: '0',
                    // isCommunity: '0',
                    // isDysfunctionCare: '0',
                    // isSpiritDrug: '0',
                    // isImport: '0'
                },
                disabledClassy: true,
                disabledGeneric: true,
                disabledSalt: true,
                disabledForm: true,
                disabledSpec: true,
                disabledPackageSpec: true,
                disabledMaterial: true,
                disabledMinPreUnit: true,
                disabledMinSaleUnit: true,
                disabledTrade: true,
                disabledMedical: true,
                ruleValidate: {
                    drug: [
                        { required: true, message: '药品编码不能为空', trigger: 'blur' }
                    ],
                    drugClassy: [
                        { required: true, message: '药品分类不能为空', trigger: 'blur'}
                    ],
                    drugGenericCode: [
                        { required: true, message: '药品通用名不能为空', trigger: 'blur' }
                    ],
                    drugSpecCode: [
                        { required: true, message: '药品规格不能为空', trigger: 'blur' }
                    ],
                    formName: [
                        { required: true, message: '药品剂型不能为空', trigger: 'blur'  }
                    ],
                    saltAcidCode: [
                        { required: true, message: '盐酸根不能为空', trigger: 'blur'  }
                    ],
                    drugProductCode: [
                        { required: true, message: '产品名称不能为空', trigger: 'blur'  }
                    ],
                    packageSpec: [
                        { required: true, message: '包装规格不能为空', trigger: 'blur'}
                    ],
                    drugTradeCode: [
                        { required: true, message: '商品名不能为空', trigger: 'blur'}
                    ],
                    company: [
                        { required: true, message: '生产企业不能为空', trigger: 'blur'}
                    ],
                    unitPrice: [
                        { required: true, message: '单价不能为空', trigger: 'blur'},
                        { validator: validatePrice }
                    ]
                    
                },
                //新增类别时候的验证
                ruleDrugClassyValidate: {
                    drugClassyAdd: [
                        { required: true, message: '药品分类编码不能为空', trigger: 'blur' },
                        { validator: validateNumber }
                    ],
                    drugClassyName: [
                        { required: true, message: '药品类别名称不能为空', trigger: 'blur'}
                    ]
                },
                //新增通用名时候的验证
                ruleGenericValidate: {
                    drugGenericCode: [
                        { required: true, message: "通用名编码不能为空", trigger: "blur" }
                    ],
                    drugGenericName: [
                        { required: true, message: "通用名不能为空", trigger: "blur" }
                    ],
                    atc: [
                        { required: true, message: "atc不能为空", trigger: "blur"}
                    ],
                    sdcc: [
                        { required: true, message: "sdcc不能为空", trigger: "blur"  }
                    ]
                },
                //新增剂型时候的验证
                ruleFormValidate: {
                    form: [
                        { required: true, message: '剂型编码不能为空', trigger: 'blur'}
                    ],
                    formNameChinese: [
                        { required: true, message: '剂型名称不能为空', trigger: 'blur'}
                    ]
                },
                //新增规格时候的验证
                ruleSpecValidate: {
                    drugSpecName: [
                        { required: true, message: "药品规格名称不能为空", trigger: "blur" }
                    ],
                    drugSpecCode: [
                        { required: true, message: "药品规格编码不能为空", trigger: "blur" }
                    ]
                },
                //新增包装规格时候的验证
                rulePackageValidate: {
                    packageSpec:[
                        { required: true, message: "药品规格编码不能为空", trigger: "blur" }
                    ],
                    packageSpecName: [
                        { required: true, message: "药品规格名称不能为空", trigger: "blur" }
                    ]
                },
                //新增商品名时候的验证
                ruleTradeValidate: {
                    drugTradeCode: [
                        { required: true, message: '商品名编码不能为空', trigger: 'blur' }
                    ],
                    drugTradeName: [
                        { required: true, message: '商品名不能为空', trigger: 'blur'}
                    ]
                },
                //新增生产企业时候的验证
                ruleMedicalValidate: {
                    company: [
                        { required: true, message: '生产企业编码不能为空', trigger: 'blur' }
                    ],
                    companyName: [
                        { required: true, message: '生产企业名称不能为空', trigger: 'blur' }
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
                //新增药品剂型_给药途径的验证
                ruleDrugFormPathValidate: {
                    form: [
                        { required: true, message: '剂型不能为空', trigger: 'blur' }
                    ],
                    pathDrug: [
                        { required: true, message: '给药途径不能为空', trigger: 'blur'}
                    ]
                },
                //药品有效期的验证
                ruleValidityValidate: {
                    drug: [
                        { required: true, message: "药品不能为空", trigger: "blur" }
                    ],
                    sdcc18: [
                        { required: true, message: "药品本位码不能为空", trigger: "blur" }
                    ],
                    startYearmonth: [
                        { required: true, message: "请选择开始年月", trigger: "change", type:'date'}
                    ],
                    stopYearmonth: [
                        { required: true, message: "请选择结束年月", trigger: 'change', type:'date' }
                    ]

                },
                //进口药品新增时候的验证
                ruleImportValidate: {
                    drug: [
                        { required: true, message: "药品不能为空", trigger: "blur" }
                    ],
                    sdcc18: [
                        { required: true, message: "药品本位码不能为空", trigger: "blur" }
                    ],
                    startYearmonth: [
                        { required: true, message: "请选择开始年月", trigger: "change", type:'date'}
                    ],
                    stopYearmonth: [
                        { required: true, message: "请选择结束年月", trigger: 'change', type:'date' }
                    ],
                    registerNumber: [
                        { required: true, message: "注册证码不能为空", trigger: "blur" }
                    ],
                    certificationDate: [
                        { required: true, message: "请选择发证日期", trigger: 'change', pattern: /.+/}
                    ],
                    invalidDate: [
                        { required: true, message: "请选择有效期截止日", trigger: 'change', pattern: /.+/ }
                    ],
                }

            }
        },
        mounted () {
            //药品主键
            if (this.$route.query.Id != undefined && this.$route.query.Id != "") {
                this.drugKey = this.$route.query.Id;
            }
            // //1.获取otc分类
            // this.getOtcClassyList();
            // //2.获取妊娠等级
            // this.getRiskPregnancyList();
            //获取该药品信息
            this.getDrugListByKey();

            
        },
        methods: {
            dateFormat(val) {
		        let year = val.getFullYear().toString();
		        let month = val.getMonth() >= 9
		        ? (val.getMonth() + 1).toString()
		        : "0" + (val.getMonth() + 1);
		        return year + month;
            },
            getDrugListByKey() {
                //根据等级获取药品
                var self = this;
                self.$refs['drugsForm'].resetFields(); 
                Vue.ajax.send({
                    name: "drugs.get",
                    data: {
                        drugKey: self.drugKey
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            var tmp = data.data;
                            console.log("tmp",tmp)
                            if (tmp != null) {
                                //将code和name转换成数组
                                // let codes = tmp.vcode.split(",");
                                // let names = tmp.vname.split(",");

                                // self.drugsAdd.drugClassy = codes[0];
                                // self.drugsAdd.drugClassyName = names[0];
                                // //通用名
                                // self.drugsAdd.drugGenericCode = codes[1];
                                // self.drugsAdd.drugGenericName = names[1];
                                // //剂型
                                // self.drugsAdd.form = codes[2];
                                // self.drugsAdd.formNameChinese = names[2];
                                // //盐酸根
                                // self.drugsAdd.saltAcidCode = codes[3];
                                // self.drugsAdd.saltAcidName = names[3];
                                // //产品名称
                                // self.drugsAdd.drugProductCode = codes[4];
                                // self.drugsAdd.drugProductName = names[4];
                                // //规格
                                // self.drugsAdd.drugSpecCode = codes[5];
                                // self.drugsAdd.drugSpecName = names[5];
                                // //包装规格
                                // self.drugsAdd.packageSpec = codes[6];
                                // self.drugsAdd.packageSpecName = names[6];
                                // //生产企业
                                // self.drugsAdd.company = codes[7];
                                // self.drugsAdd.companyName = names[7];
                                // //商品名
                                // self.drugsAdd.drugTradeCode = codes[8];
                                // self.drugsAdd.drugTradeName = names[8];
                                //获取值
                                self.drugsAdd = tmp;
                                self.drugsAdd.unitPrice=self.drugsAdd.unitPrice+""


                                // //获取药品产品名称
                                if (self.drugsAdd.drugProductName != null || self.drugsAdd.drugProductName != '') {
                                    self.getDrugProductList(self.drugsAdd.drugProductName);
                                } else {
                                    self.getDrugProductList('');
                                }
                                
                                // //获取盐酸根列表
                                self.getDrugSaltAcidList(self.drugsAdd.saltAcidName);
                                // //获取药品规格列表
                                if (self.drugsAdd.drugSpecName != null || self.drugsAdd.drugSpecName != '') {
                                    self.getSpecList(self.drugsAdd.drugSpecName);
                                }else {
                                    self.getSpecList('');
                                }
                                
                                // //获取药品包装规格列表
                                if (self.drugsAdd.packageSpecName != null || self.drugsAdd.packageSpecName != '') {
                                    self.getPackageSpecList(self.drugsAdd.packageSpecName);
                                }else {
                                    self.getPackageSpecList('');
                                }
                                
                                // //获取药品商品名
                                if (self.drugsAdd.drugTradeName != null || self.drugsAdd.drugTradeName != '') {
                                    self.getTradeList(self.drugsAdd.drugTradeName);
                                }else {
                                    self.getTradeList('');
                                }
                                
                                // //获取生产企业
                                if (self.drugsAdd.companyName != null || self.drugsAdd.companyName != '') {
                                    self.getMedicalList(self.drugsAdd.companyName);
                                }else {
                                    self.getMedicalList('');
                                }
                                
                                // //获取药品剂型_给药途径
                                self.getFormDrugPathList();
                            }

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            //获取进口药品，
            getDrugImportList(value){
                var self = this;
                Vue.ajax.send({
                    name: 'drugsImport.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 10,
                        drug: self.drugsAdd.drug
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.drugImportList = data.data.dataList;

                            if (value == 1) {
                                if (self.drugImportList.length > 0) {
                                    //如果数组大于0，则说明该药品是进口药品
                                    self.drugsAdd.isImport = '1';
                                }else {
                                    //否则说明是非进口药品
                                    self.drugsAdd.isImport = '0';
                                }
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
            //获取药品有效期
            getDrugValidityList(){
                var self = this;
                Vue.ajax.send({
                    name: 'drugValidity.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 10,
                        drug: self.drugsAdd.drug
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.drugValidityList = data.data.dataList;

                            
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getDrugClassyList(value) {
                //获取药品分类
                var self = this;
                Vue.ajax.send({
                    name: "drugClassy.list",
                    data: {
                        pageIndex: 1,
                        pageSize: 99999,
                        drugClassy: value
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.drugClassyList = data.data.dataList;

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getDrugOwnRangeList() {
                //获取药品所属范围
                var self = this;
                Vue.ajax.send({
                    name: "drugOwnRange.list",
                    data: {
                        pageIndex: 1,
                        pageSize: 99999,
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.ownRangeList = data.data.dataList;

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getGenericList(query) {
                //获取通用名
                var self = this;
                Vue.ajax.send({
                    name: "drugs.genericList",
                    data: {
                        pageIndex: 1,
                        pageSize: 99,
                        drugGenericName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.genericList = data.data;

                            if(self.genericList.length > 0) {
                                // self.disabledGeneric = false;

                                //获取剂型列表
                                self.getFormList();
                            }else {
                                // self.disabledGeneric = true;
                            }

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getAllDrugAtcList() {
                var self = this;
                Vue.ajax.send({
                    name: "drugAtc.list",
                    data: {
                        pageIndex: 1,
                        pageSize: 99999
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.drugAtcAllList = data.data.dataList;
                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getAllDrugSdccList() {
                var self = this;
                Vue.ajax.send({
                    name: "drugSdcc.list",
                    data: {
                        pageIndex: 1,
                        pageSize: 99999
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.drugSdccAllList = data.data.dataList;
                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getDrugSaltAcidList(){
                //盐酸根
                var self = this;
                Vue.ajax.send({
                    name: 'drugSaltAcid.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 999,
                        saltAcidName: self.drugsAdd.saltAcidName
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.drugSaltAcidList = data.data.dataList;

                            if(self.drugSaltAcidList.length > 0) {
                                self.disabledSalt = false;
                            }else {
                                self.disabledSalt = true;
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
            getFormList(){
                //剂型
                //获取第二等级的剂型，用于药品剂型_给药途径关系表的添加
                var self = this;
                    Vue.ajax.send({
                    name: 'form.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 999,
                        dataLevel: 2
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.formList = data.data.dataList;

                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getPathDrugList() {

                var self = this;
                    Vue.ajax.send({
                        name: "pathDrug.list",
                        data: {
                            pageIndex: 1,
                            pageSize: 999,
                            dataLevel: 1
                        },
                        success: function(data) {

                        if (!!data && data.code == "0") {
                            self.pathDrugTmpList = data.data.dataList;

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getFormListByDataLevel () {
                var self = this;
                    Vue.ajax.send({
                        name: 'form.list',
                        data: {
                            pageIndex: 1,
                            pageSize: 999,
                            dataLevel: 1
                        },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.formLevelList = data.data.dataList;

                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getDataLevel(value) {
                var item = this.formLevelList.filter(x=> x.form==value);
                if (value == '-') {
                    this.forms.dataLevel = 1;
                }else {
                    this.forms.dataLevel = item[0].dataLevel+1;
                }
            },
            getDrugProductList(query){
                //获取药品产品名称列表
                //获取药品产品名称列表
                var self = this;
                Vue.ajax.send({
                    name: "drugs.drugProductList",
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        drugProductName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.drugProductList = data.data;

                            // if(self.drugProductList.length > 0) {
                            //     self.disabledProduct = false;

                            // }else {
                            //     self.disabledProduct = true;
                            // }

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getSpecList(query) {
                //规格
                var self = this;
                Vue.ajax.send({
                    name: "drugs.specList",
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        drugSpecName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.specList = data.data;

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getDrugUnifiedSpecList(query) {
                //药品统一规格
                var self = this;
                Vue.ajax.send({
                    name: "drugs.unifiedSpecSearchList",
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        drugUnifiedspecName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.unifiedSpecList = data.data;
                            
                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getPackageSpecList(query) {
                //包装规格
                var self = this;
                Vue.ajax.send({
                    name: "drugs.packageSpecList",
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        packageSpecName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.packageSpecList = data.data;

                            

                        } else {
                            this.$Modal.error({
                                title: "",
                                content: data.message
                            });
                        }
                    }
                });
            },
            getPackageMaterialList() {
                //包装材料
                var self = this;
                Vue.ajax.send({
                    name: 'drugPackageMaterial.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 999
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.packageMaterialList = data.data.dataList;

                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
     getFromTreeList() {
      //剂型
      var self = this;
      Vue.ajax.send({
        name: "form.treeList",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.formTreeList = data.data;
            console.log(1111111);
            console.log(self.formTreeList);
            // if(self.formTreeList.length > 0) {
            //     self.disabledForm = false;

            // }else {
            //     self.disabledForm = true;
            // }
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
            getUnitList(){
                //最小制剂单位是片，粒等
                //最小销售单位是盒，瓶等
                var self = this;
                Vue.ajax.send({
                    name: 'unit.list',
                    data: {
                        pageIndex: 1,
                        pageSize: 999
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.unitList = data.data.dataList;

                            if (self.unitList.length > 0) {
                                self.disabledTrade = false;
                                self.disabledMedical = false;
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
            getTradeList(query){
                //商品名
                var self = this;
                Vue.ajax.send({
                    name: 'drugs.tradeNameList',
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        drugTradeName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.tradeList = data.data;

                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getMedicalList(query) {
                //生产企业
                var self = this;
                Vue.ajax.send({
                    name: 'drugs.companyList',
                    data: {
                        pageIndex: 1,
                        pageSize: 50,
                        companyName: query
                    },
                    success: function(data) {
                        if (!!data && data.code == '0') {
                            self.medicalCompanyList = data.data;
                            
                        } else {
                            this.$Modal.error({
                                title: '',
                                content: data.message
                            });
                        }
                    }
                });
            },
            getFormDrugPathList() {
                //调用药品剂型_给药途径接口
                var self = this;
                Vue.ajax.send({
                    name: "formDrugPath.list",
                    data: {
                        pageIndex: 1,
                        pageSize: 99999,
                        form: self.drugsAdd.form,
                        pathDrug: '',
                        statusId: 4
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.pathDrugList = data.data.dataList;
                        } else {
                            this.$Modal.error({
                                title: "",
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
           getPoinpackList() {
                //分包装企业
                var self = this;
                Vue.ajax.send({
                    name: "poinpack.list",
                    data: {
                        pageIndex: 1,
                        pageSize: 9999
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.poinpackList = data.data.dataList;
                        } else {
                            this.$Modal.error({
                                title: "",
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
           getCityList(){
                //省份改变以后，清除上一次的城市
                var self=this;
                self.medicalForm.city = '';
                Vue.ajax.send({
                name: 'city.list',
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    province: self.medicalForm.province,
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
            addDrugClassy () {
                //1、药品分类弹框
                this.addDrugClassyModel = true;
                //获取药品所属范围
                this.getDrugOwnRangeList();
            },
            addGeneric() {
                //2、通用名弹框
                this.addGenericModel = true;
                //获取atc数据
                this.getAllDrugAtcList();
                //获取sdcc数据
                this.getAllDrugSdccList();
            },
            addForm () {
                //3、药品剂型弹框
                this.addFormModel = true;
                //获取父级剂型，供添加剂型的时候使用
                this.getFormListByDataLevel();
            },
            editForm(){
                this.editFormModel = true;
                this.getFromTreeList();

            },
            editFormOk(){
                 this.editFormModel = false;
                 this.formTreeList.forEach(item=>{
                      item.children.forEach(child=>{

                     if(this.drugsAdd.form == child.__value){
                         this.drugsAdd.formName = child.__label.split("/")[1];
                         this.drugsAdd.form = child.__value.split(",")[1];
                         this.drugsAdd.isEditForm =1;

                     }
                      })

                 })

  },
            addSpec () {
                //4、药品规格弹框
                this.addSpecModel = true;
                //获取药品统一规格
                this.getDrugUnifiedSpecList('');
            },
            addPackageSpec () {
                //5、药品包装规格
                this.addPackageModel = true;
                //获取包装材料
                this.getPackageMaterialList();
                //获取计量单位
                this.getUnitList();
            },
            addTrade () {
                //6、药品商品名
                this.addTradeModel = true;
            },
            addMedicalCompany () {
                //7、生产企业
                this.addMedicalCompanyModel = true;
                //获取生产企业集团
                this.getCompanyBlocList();
                //获取省市
                // this.getAddressList();
                this.getProvinceList();
                //获取企业类型
                this.getCompanyTypeList();
            },
            addDrugFormPath () {
                alert(222)
                //8、添加药品剂型_给药途径
                this.addDrugFormPathModel = true;
                //获取剂型
                this.getFormList();
                //获取给药途径
                this.getPathDrugList();

            },
            // 保存弹框相关的方法
            addClassyOk () {
                //保存药品分类
                this.$refs["addClassyForm"].validate(valid => {
                    if (valid) {
                        var self = this;
                        Vue.ajax.send({
                            name: "drugClassy.add",
                            data: {
                                drugClassy: self.drugClassyForm.drugClassy,
                                drugClassyName: self.drugClassyForm.drugClassyName,
                                ownRange: self.drugClassyForm.ownRange, 
                                createUser: Vue.getUser().userName
                            },
                            success: function(data) {
                                if (!!data && data.code == "0") {
                                    self.addDrugClassyModel = false;
                                    self.$refs["addClassyForm"].resetFields();

                                    self.$Message.success("新增药品类别提交成功！");
                                    //刷新药品类别列表
                                    self.getDrugClassyList();
                                } else {
                                    setTimeout(() => {
                                        self.loadingDrugClassy = false;
                                        self.$nextTick(() => {
                                            self.loadingDrugClassy = true;
                                        });
                                    }, 0);
                                    self.$Modal.error({
                                        title: "",
                                        content: data.message
                                    });
                                }
                            }
                        });
                    } else {
                        setTimeout(() => {
                            this.loadingDrugClassy = false;
                            this.$nextTick(() => {
                                this.loadingDrugClassy = true;
                            });
                        }, 0);
                    }
                });
            },
            addGenericOk () {
                //保存通用名
                this.$refs["addGenericForm"].validate(valid => {
                    if (valid) {
                        var self = this;
                        Vue.ajax.send({
                            name: "generic.add",
                            data: {
                                drugGenericCode: self.genericForm.drugGenericCode,
                                drugGenericName: self.genericForm.drugGenericName,
                                drugGenericNameAb: self.genericForm.drugGenericNameAb,
                                drugGenericNameEn: self.genericForm.drugGenericNameEn,
                                atc: self.genericForm.atc,
                                sdcc: self.genericForm.sdcc,
                                statusId: 4,
                                createUser: Vue.getUser().userName
                            },
                            success: function(data) {
                                if (!!data && data.code == "0") {
                                    self.addGenericModel = false;
                                    self.$refs["addGenericForm"].resetFields();
                                    self.$Message.success("新增通用名提交成功！");
                                    //刷新通用名列表
                                    self.getGenericList();
                                } else {
                                    setTimeout(() => {
                                        self.loadingGeneric = false;
                                        self.$nextTick(() => {
                                            self.loadingGeneric = true;
                                        });
                                    }, 0);
                                    self.$Modal.error({
                                        title: "",
                                        content: data.message
                                    });
                                }
                            }
                            });
                        } else {
                            setTimeout(() => {
                                this.loadingGeneric = false;
                                this.$nextTick(() => {
                                    this.loadingGeneric = true;
                                });
                            }, 0);
                        }
                });
            },
            addFormOk () {
                //保存剂型
                this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'form.add',
                        data: {
                            form: self.forms.form,
                            superiorForm: self.forms.superiorForm,
                            dataLevel: self.forms.dataLevel,
                            formNameChinese: self.forms.formNameChinese,
                            formNameEnglish: self.forms.formNameEnglish,
                            formAb: self.forms.formAb,
                            formEnglishAb: self.forms.formEnglishAb,
                            statusId: 4,
                            createUser: Vue.getUser().userName,
                            remark: self.forms.remark
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addFormModel = false;
                                self.$refs['addForm'].resetFields();
                                self.$Message.success('新增剂型提交成功！');

                                self.forms.formNameEnglish = "";
                                self.forms.formAb = "";
                                self.forms.formEnglishAb = "";
                                //刷新剂型列表
                                self.getFormList();
                            } else {
                                setTimeout(() => {
                                    self.loadingForm = false;
                                    self.$nextTick(() => {
                                        self.loadingForm = true;
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
                        this.loadingForm = false;
                        this.$nextTick(() => {
                            this.loadingForm = true;
                        });
                    }, 0);
                }
            });
            },
            addSpeckOk () {
                //保存规格
                this.$refs["addSpecForm"].validate(valid => {
                    if (valid) {
                        var self = this;
                        Vue.ajax.send({
                            name: "spec.add",
                            data: {
                                drugSpecCode: self.specForm.drugSpecCode,
                                drugSpecName: self.specForm.drugSpecName,
                                drugUnifiedspecName: self.specForm.drugUnifiedspecName,
                                specNumber: self.specForm.specNumber,
                                specUnit: self.specForm.specUnit,
                                capacityNumber: self.specForm.capacityNumber,
                                capacityUnit: self.specForm.capacityUnit,
                                statusId: 4,
                                createUser: Vue.getUser().userName
                            },
                            success: function(data) {
                                if (!!data && data.code == "0") {
                                    self.addSpecModel = false;
                                    self.$refs["addSpecForm"].resetFields();

                                    self.$Message.success("新增药品规格提交成功！");
                                    //刷新药品规格列表
                                    self.getSpecList('');
                                    
                                } else {
                                    setTimeout(() => {
                                        self.loadingSpec = false;
                                        self.$nextTick(() => {
                                            self.loadingSpec = true;
                                        });
                                    }, 0);
                                    self.$Modal.error({
                                        title: "",
                                        content: data.message
                                    });
                                }
                            }
                        });
                    } else {
                        setTimeout(() => {
                            this.loadingSpec = false;
                            this.$nextTick(() => {
                                this.loadingSpec = true;
                            });
                        }, 0);
                    }
                });
            },
            addPackageSpecOk () {
                //保存包装规格
                this.$refs["addPackageSpecForm"].validate(valid => {
                    if (valid) {
                        var self = this;
                        Vue.ajax.send({
                            name: "packageSpec.add",
                            data: {
                                packageSpec: self.packageSpecForm.packageSpec,
                                packageSpecName: self.packageSpecForm.packageSpecName,
                                minPreparationUnit: self.packageSpecForm.minPreparationUnit,
                                minSaleUnit: self.packageSpecForm.minSaleUnit,
                                materialId: self.packageSpecForm.materialId,
                                statusId: 4,
                                createUser: Vue.getUser().userName
                            },
                            success: function(data) {
                                if (!!data && data.code == "0") {
                                    self.addPackageModel = false;
                                    self.$refs["addPackageSpecForm"].resetFields();

                                    self.$Message.success("新增包装规格提交成功！");
                                    //刷新包装规格列表
                                    self.getPackageSpecList('');
                                } else {
                                    setTimeout(() => {
                                        self.loadingPackageSpec = false;
                                        self.$nextTick(() => {
                                            self.loadingPackageSpec = true;
                                        });
                                    }, 0);
                                    self.$Modal.error({
                                        title: "",
                                        content: data.message
                                    });
                                }
                            }
                        });
                    } else {
                        setTimeout(() => {
                            this.loadingPackageSpec = false;
                            this.$nextTick(() => {
                                this.loadingPackageSpec = true;
                            });
                        }, 0);
                    }
                });
            },
            addTradeNameOk () {
                //保存商品名
                this.$refs['addTradeForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'trade.add',
                        data: {
                            // drugTradeCode: self.tradeForm.drugTradeCode,
                            drugTradeName: self.tradeForm.drugTradeName,
                            drugTradeNameEn: self.tradeForm.drugTradeNameEn,
                            remark: self.tradeForm.remark,
                            statusId: 4,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addTradeModel = false;
                                self.$refs['addTradeForm'].resetFields();
                                
                                self.$Message.success('新增商品名提交成功！');
                                //刷新商品名列表
                                self.getTradeList();
                            } else {
                                setTimeout(() => {
                                    self.loadingTrade = false;
                                    self.$nextTick(() => {
                                        self.loadingTrade = true;
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
                            this.loadingTrade = false;
                            this.$nextTick(() => {
                                this.loadingTrade = true;
                            });
                        }, 0);
                    }
                }) 
            },
            addMedicalCompanyOk () {
                this.$refs['addMedicalForm'].validate((valid) => {
                if (valid) {
                    var self=this;
                    Vue.ajax.send({
                        name: 'medical.add',
                        data: {
                            company: self.medicalForm.company,
                            companyName: self.medicalForm.companyName,
                            originalCompanyName: self.medicalForm.originalCompanyName,
                            organ: self.medicalForm.organ,
                            chineseShort: self.medicalForm.chineseShort,
                            enterpriseLegal: self.medicalForm.enterpriseLegal,
                            blocId: self.medicalForm.blocId,
                            isMembers: self.medicalForm.isMembers,
                            memberGrade: self.medicalForm.memberGrade,
                            isBindingPurview: self.medicalForm.isBindingPurview,
                            nation: self.medicalForm.country,
                            province: self.medicalForm.province,
                            city: self.medicalForm.city,
                            companyType: self.medicalForm.companyType,
                            companyAddress: self.medicalForm.companyAddress,
                            postcode: self.medicalForm.postcode,
                            contact: self.medicalForm.contact,
                            telephone: self.medicalForm.telephone,
                            email: self.medicalForm.email,
                            fax: self.medicalForm.fax,
                            statusId: 4,
                            createUser:  Vue.getUser().userName,
                            remark: self.medicalForm.remark
                        },
                        success: function(data) {
                            setTimeout(() => {
                                    self.loadingMedical = false;
                                    self.$nextTick(() => {
                                        self.loadingMedical = true;
                                    });
                                }, 0);
                            if (!!data && data.code=='0') {
                                self.addMedicalCompanyModel = false;
                                self.$refs['addMedicalForm'].resetFields();
                                self.$Message.success('新增生产企业提交成功！');
                                
                                self.medicalForm.address = "";
                                self.medicalForm.enterpriseLegal = "";
                                self.medicalForm.chineseShort = "";
                                self.medicalForm.organ = "";
                                self.medicalForm.blocId = "";

                                self.getMedicalList();
                                
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
                            this.loadingMedical = false;
                            this.$nextTick(() => {
                                this.loadingMedical = true;
                            });
                        }, 0);
                    }
                })
            },
            addDrugFormPathOk() {
                //添加药品剂型_给药途径
                this.$refs['addDrugFormPathForm'].validate((valid) => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: 'formDrugPath.add',
                        data: {
                            form: self.drugFormPathForm.form,
                            pathDrug: self.drugFormPathForm.pathDrug,
                            statusId: 4,
                            createUser: Vue.getUser().userName,
                            remark: self.drugFormPathForm.remark
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == '0') {
                                self.addDrugFormPathModel = false;
                                self.$refs['addDrugFormPathForm'].resetFields();
                                self.$Message.success('新增药品剂型_给药途径提交成功！');

                                
                                self.formDrugPathForm.remark = "";
                                self.getFormDrugPathList();

                            } else {
                                setTimeout(() => {
                                    self.loadingFormPath = false;
                                    self.$nextTick(() => {
                                        self.loadingFormPath = true;
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
                        this.loadingFormPath = false;
                        this.$nextTick(() => {
                            this.loadingFormPath = true;
                        });
                    }, 0);
                }
            })
            },
            addDrugValidityOk() {
                //如果不是进口药品，添加到药品有效期表中
                this.$refs['addDrugValidityForm'].validate((valid) => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: 'drugValidity.add',
                        data: {
                            drug: self.drugValidityForm.drug,
                            sdcc18: self.drugValidityForm.sdcc18,
                            approveNumber: self.drugValidityForm.approveNumber,
                             approveNumber: self.drugValidityForm.approveNumber,
                            startYearmonth: self.drugValidityForm.startYearmonth == ""? "" : self.dateFormat(self.drugValidityForm.startYearmonth),
                            stopYearmonth: self.drugValidityForm.stopYearmonth == "" ? "" : self.dateFormat(self.drugValidityForm.stopYearmonth),
                            approveDate: self.drugValidityForm.approveDate == "" ? "" : self.drugValidityForm.approveDate,
                            invalidDate: self.drugValidityForm.invalidDate == "" ? "" : self.drugValidityForm.invalidDate,
                            approveNumberOld: self.drugValidityForm.approveNumberOld,
                            statusId: 4,
                            createUser: Vue.getUser().userName,
                            remark: self.drugValidityForm.remark
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == '0') {
                                self.addValidityModel = false;
                                self.$refs['addDrugValidityForm'].resetFields();
                                self.$Message.success('新增药品有效期提交成功！');

                                
                                self.drugValidityForm.remark = "";
                            } else {
                                setTimeout(() => {
                                    self.loadingDrugValidity = false;
                                    self.$nextTick(() => {
                                        self.loadingDrugValidity = true;
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
                        this.loadingDrugValidity = false;
                        this.$nextTick(() => {
                            this.loadingDrugValidity = true;
                        });
                    }, 0);
                }
                })
            },
            addDrugImportOk () {
                //如果是进口药品，添加到进口药品表中
                this.$refs['addDrugImportForm'].validate((valid) => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: 'drugsImport.add',
                        data: {
                            drug: self.drugImportForm.drug,
                            sdcc18: self.drugImportForm.sdcc18,
                            startYearmonth: self.drugImportForm.startYearmonth == "" ? "" : self.dateFormat(self.drugImportForm.startYearmonth),
                            stopYearmonth:  self.drugImportForm.stopYearmonth == "" ? "" : self.dateFormat(self.drugImportForm.stopYearmonth),
                            registerNumber: self.drugImportForm.registerNumber,
                            subpackApproval: self.drugImportForm.subpackApproval,
                            certificationDate: self.drugImportForm.certificationDate == "" ? "" : self.drugImportForm.certificationDate,
                            invalidDate: self.drugImportForm.invalidDate == "" ? "" : self.drugImportForm.invalidDate,
                            poinpackcompanyId: self.drugImportForm.poinpackcompanyId,
                            subpackApprovalDate: self.drugImportForm.subpackApprovalDate == "" ? "" : self.drugImportForm.subpackApprovalDate,
                            subpackExpirationDate: self.drugImportForm.subpackExpirationDate == "" ? "" : self.drugImportForm.subpackExpirationDate,
                            statusId: 4,
                            createUser: Vue.getUser().userName,
                            remark: self.drugImportForm.remark
                        },
                        success: function(data) {
                            
                            if (!!data && data.code == '0') {
                                self.addImportModel = false;
                                self.$refs['addDrugImportForm'].resetFields();
                                self.$Message.success('新增进口药品提交成功！');
                                self.drugImportForm.remark = "";
                            } else {
                                setTimeout(() => {
                                    self.loadingDrugImport = false;
                                    self.$nextTick(() => {
                                        self.loadingDrugImport = true;
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
                        this.loadingDrugImport = false;
                        this.$nextTick(() => {
                            this.loadingDrugImport = true;
                        });
                    }, 0);
                }
                })
            },
            saveAddFirstInfo() {
                //保存第一级
                if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null)  {
                    this.checkedSuperDrug = false;
                    this.checkedDrugClassy = false;
                    var self=this;
                    Vue.ajax.send({
                        name: 'drugs.add',
                        data: {
                            //第一级的时候drug码就是药品分类的主键
                            drug: self.drugsAdd.drugClassy,
                            superiorDrug: '-',
                            dataLevel: '1',
                            //第一级的时候药品组合码就是药品分类的主键
                            drugJoinCode: self.drugsAdd.drugClassy,
                            remark: self.drugsAdd.remark,
                            createUser: Vue.getUser().userName,
                            
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addDrugClassyModel = false;
                                self.$refs['addTradeForm'].resetFields();
                                self.$router.push("/standard/mapping/drugs/list");
                                self.$Message.success('新增药品分类提交成功！');
                                
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }else {
                //    非空的提示信息
                     if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null) {
                         this.checkedDrugClassy = false;
                     }else {
                         this.checkedDrugClassy = true;
                     }
                     if (this.drugJoinCodeTmp != '' && this.drugJoinCodeTmp != null) {
                         this.checkedSuperDrug = false;;
                     }else {
                         this.checkedSuperDrug = true;
                     }
                     
                        
                    
                }
                // }) 
            },
            saveAddSecondInfo () {
                //保存第二级，通用名
                if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null &&
                    this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null) {
                    var self=this;
                    //清楚错误信息
                    self.checkedDrugClassy = false;
                    self.checkedGeneric = false;
                    Vue.ajax.send({
                        name: 'drugs.add',
                        data: {
                            //第二级的时候drug码就是通用名
                            drug: self.drugsAdd.drugGenericCode,
                            //父级药品编码
                            superiorDrug: self.drugsAdd.drugClassy,
                            dataLevel: '2',
                            //第二级的时候药品组合码就是药品分类+通用名
                            drugJoinCode: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode,
                            remark: self.drugsAdd.remark,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addTradeModel = false;
                                self.$refs['addTradeForm'].resetFields();
                                self.$router.push("/standard/mapping/drugs/list");
                                self.$Message.success('新增药品通用名提交成功！');
                                
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }else {
                    if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null) {
                        this.checkedDrugClassy = false;
                    }else {
                        this.checkedDrugClassy = true;
                    }
                    if (this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null) {
                        this.checkedGeneric = false;
                    }else {
                        this.checkedGeneric = true;
                    }
                    
                }
            },
            saveAddThreeInfo () {
                
                this.drugsAdd.form = this.drugsAdd.forms.length==2?this.drugsAdd.forms[1]:null;
                
                //保存第三级，剂型
                if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null &&
                    this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null &&
                    this.drugsAdd.form != '' && this.drugsAdd.form != null) {
                    
                    var self=this;
                    //隐藏为空的提示消息
                    self.checkedSuperDrug = false;
                    self.checkedDrugClassy = false;
                    self.checkedGeneric = false;

                    Vue.ajax.send({
                        name: 'drugs.add',
                        data: {
                            //第三级的时候drug码就是通用名
                            drug: self.drugsAdd.form,
                            //父级编码，就是药品分类+药品通用名
                            superiorDrug: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode,
                            dataLevel: '3',
                            //第三级的时候药品组合码就是药品分类+通用名+剂型
                            drugJoinCode: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode+self.drugsAdd.form,
                            //盐酸根
                            saltAcidCode: self.drugsAdd.saltAcidCode,
                            //产品名称
                            drugProductName: self.drugsAdd.drugProductName,
                            remark: self.drugsAdd.remark,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addTradeModel = false;
                                self.$refs['addTradeForm'].resetFields();
                                self.$router.push("/standard/mapping/drugs/list");
                                self.$Message.success('新增药品剂型提交成功！');
                                
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }else {
                    if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null) {
                        this.checkedDrugClassy = false;
                    }else {
                        this.checkedDrugClassy = true;
                    }
                    //通用名提示信息
                    if (this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null) {
                        this.checkedGeneric = false;
                    }else {
                        this.checkedGeneric = true;
                    }
                    //剂型
                    if (this.drugsAdd.form != '' && this.drugsAdd.form != null) {
                        this.checkedForm = false;
                    }else {
                        this.checkedForm = true;
                    }
                }
            },
            saveAddFourInfo () {
                //保存第四级，药品规格
                if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null &&
                    this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null &&
                    this.drugsAdd.form != '' && this.drugsAdd.form != null && 
                    this.drugsAdd.saltAcidCode != '' && this.drugsAdd.saltAcidCode != null &&
                    this.drugsAdd.drugSpecCode != '' && this.drugsAdd.drugSpecCode != null) {
                    var self=this;
                    //隐藏为空的提示消息
                    self.checkedSuperDrug = false;
                    self.checkedDrugClassy = false;
                    self.checkedGeneric = false;
                    self.checkedSpec = false;

                    Vue.ajax.send({
                        name: 'drugs.add',
                        data: {
                            //第四级的时候drug码就是药品规格
                            drug: self.drugsAdd.drugSpecCode,
                            //父级编码，就是药品分类+药品通用名+剂型
                            superiorDrug: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode+self.drugsAdd.form,
                            dataLevel: '4',
                            //第四级的时候药品组合码就是药品分类+通用名+剂型+药品规格
                            drugJoinCode: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode+self.drugsAdd.form+self.drugsAdd.drugSpecCode,
                            //盐酸根
                            saltAcidCode: self.drugsAdd.saltAcidCode,
                            drugProductName: self.drugsAdd.drugProductName,
                            remark: self.drugsAdd.remark,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addTradeModel = false;
                                self.$refs['addTradeForm'].resetFields();
                                self.$router.push("/standard/mapping/drugs/list");
                                self.$Message.success('新增药品规格提交成功！');
                                
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }else {
                    if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null) {
                        this.checkedDrugClassy = false;
                    }else {
                        this.checkedDrugClassy = true;
                    }
                    //通用名提示信息
                    if (this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null) {
                        this.checkedGeneric = false;
                    }else {
                        this.checkedGeneric = true;
                    }
                    //剂型
                    if (this.drugsAdd.form != '' && this.drugsAdd.form != null) {
                        this.checkedForm = false;
                    }else {
                        this.checkedForm = true;
                    }
                    //规格
                    if (this.drugsAdd.drugSpecCode != '' && this.drugsAdd.drugSpecCode != null) {
                        this.checkedSpec = false;
                    }else {
                        this.checkedSpec = true;
                    }
                }
            },
            saveAddFiveInfo () {
                //保存第五级，药品包装规格
                if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null &&
                    this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null &&
                    this.drugsAdd.form != '' && this.drugsAdd.form != null && 
                    this.drugsAdd.saltAcidCode != '' && this.drugsAdd.saltAcidCode != null &&
                    this.drugsAdd.drugSpecCode != '' && this.drugsAdd.drugSpecCode != null &&
                    this.drugsAdd.packageSpec != '' && this.drugsAdd.packageSpec != null) {
                    var self=this;
                    //隐藏为空的提示消息
                    self.checkedSuperDrug = false;
                    self.checkedDrugClassy = false;
                    self.checkedGeneric = false;
                    self.checkedSpec = false;
                    self.checkedPackageSpec = false;


                    Vue.ajax.send({
                        name: 'drugs.add',
                        data: {
                            //第五级的时候drug码就是药品包装规格
                            drug: self.drugsAdd.packageSpec,
                            //父级编码，就是药品分类+药品通用名+剂型+药品规格
                            superiorDrug:self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode+self.drugsAdd.form+self.drugsAdd.drugSpecCode,
                            dataLevel: '5',
                            //第五级的时候药品组合码就是药品分类+通用名+剂型+药品规格+包装规格
                            drugJoinCode: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode
                                         +self.drugsAdd.form+self.drugsAdd.drugSpecCode+self.drugsAdd.packageSpec,
                            //盐酸根
                            saltAcidCode: self.drugsAdd.saltAcidCode,
                            drugProductName: self.drugsAdd.drugProductName,
                            remark: self.drugsAdd.remark,
                            createUser: Vue.getUser().userName
                        },
                        success: function(data) {
                            if (!!data && data.code=='0') {
                                self.addTradeModel = false;
                                self.$refs['addTradeForm'].resetFields();
                                self.$router.push("/standard/mapping/drugs/list");
                                self.$Message.success('新增药品包装规格提交成功！');
                                
                            } else {
                                self.$Modal.error({
                                    title: '',
                                    content: data.message
                                });
                            }
                        }
                    });
                }else {
                    if (this.drugsAdd.drugClassy != '' && this.drugsAdd.drugClassy != null) {
                        this.checkedDrugClassy = false;
                    }else {
                        this.checkedDrugClassy = true;
                    }
                    //通用名提示信息
                    if (this.drugsAdd.drugGenericCode != '' && this.drugsAdd.drugGenericCode != null) {
                        this.checkedGeneric = false;
                    }else {
                        this.checkedGeneric = true;
                    }
                    //剂型
                    if (this.drugsAdd.form != '' && this.drugsAdd.form != null) {
                        this.checkedForm = false;
                    }else {
                        this.checkedForm = true;
                    }
                    //规格
                    if (this.drugsAdd.drugSpecCode != '' && this.drugsAdd.drugSpecCode != null) {
                        this.checkedSpec = false;
                    }else {
                        this.checkedSpec = true;
                    }
                    //包装规格
                    if (this.drugsAdd.packageSpec != '' && this.drugsAdd.packageSpec != null) {
                        this.checkedPackageSpec = false;
                    }else {
                        this.checkedPackageSpec = true;
                    }
                }
            },
            saveEditInfo () {
                this.$refs['drugsForm'].validate((valid) => {
                    if (valid) {
                        var self = this;
                        Vue.ajax.send({
                            name: 'drugs.edit',
                            data: {
                                drugKey: self.drugKey,
                                isEditForm: self.drugsAdd.isEditForm,
                                superiorDrug: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode
                                            +self.drugsAdd.form+self.drugsAdd.drugSpecCode+self.drugsAdd.packageSpec,
                                superiorFormDrug: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode,
                                form:self.drugsAdd.form,
                                //这个到时候会调接口自动生成DM编码
                                drug: self.drugsAdd.drug,
                                //第6级的时候药品组合码就是药品分类+通用名+剂型+药品规格+包装规格+DM码
                                drugJoinCode: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode
                                            +self.drugsAdd.form+self.drugsAdd.drugSpecCode
                                            +self.drugsAdd.packageSpec+self.drugsAdd.drug,
                                //规格父级编码
                                specSuperiorDrug: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode
                                            +self.drugsAdd.form,
                                //规格组合码
                                drugSpecJoinCode: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode
                                            +self.drugsAdd.form+self.drugsAdd.drugSpecCode,
                                //包装规格父级编码
                                packageSpecSuperiorDrug: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode
                                            +self.drugsAdd.form+self.drugsAdd.drugSpecCode,
                                //包装规格组合码
                                drugPackageSpecJoinCode: self.drugsAdd.drugClassy+self.drugsAdd.drugGenericCode
                                            +self.drugsAdd.form+self.drugsAdd.drugSpecCode
                                            +self.drugsAdd.packageSpec,
                                //规格
                                drugSpecCode: self.drugsAdd.drugSpecCode,
                                //包装规格
                                packageSpec: self.drugsAdd.packageSpec,
                                //商品名
                                drugTradeCode: self.drugsAdd.drugTradeCode,
                                //盐酸根
                                saltAcidCode: self.drugsAdd.saltAcidCode,
                                //产品名称
                                drugProductCode: self.drugsAdd.drugProductCode,
                                //生产企业
                                company: self.drugsAdd.company,
                                pathDrug: self.drugsAdd.pathDrug,
                                unitPrice: self.drugsAdd.unitPrice,
                                dailyDdd: self.drugsAdd.dailyDdd,
                                pictureMessage: self.drugsAdd.pictureMessage,
                                textAndPictures: self.drugsAdd.textAndPictures,
                                statusId: 1,
                                remark: self.drugsAdd.remark,
                                changeUser: Vue.getUser().userName
                            },
                            success: function(data) {
                                if (!!data && data.code == "0") {
                                    self.$router.push("/standard/mapping/drugs/list");
                                    self.$Message.success("编辑药品信息提交成功！");
                                } else {
                                    self.$Modal.error({
                                        title: "",
                                        content: data.message
                                    });
                                }
                            }
                        });
                    }

                    
                })
            },
            cancel () {
                this.$router.push("/standard/mapping/drugs/list");
            }
        }
    }
</script>



<style scoped>
.intro{
    display: inline-block;
    color: #9c9c9c;
    margin-left: 10px;
}

.selectWidth {
    width: 700px;
}

.selectOptionWidth {
    width: 700px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>