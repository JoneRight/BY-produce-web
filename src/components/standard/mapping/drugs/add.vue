<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title">新增药品</h2>
        <div class="mt20" >
                <Form  ref="drugsForm" :model="drugsAdd" :rules="ruleValidate" :label-width="80">
                    <FormItem label="数据等级" >
                        <Select  class="selectWidth"  v-model="dataLevelTmp"  @on-change="getDrugListByDatalevel">
                            <!--updated 2021-01-15 改为中文标签 -->
                            <Option :value="1">1药品分类</Option>
                            <Option :value="2">2通用名</Option>
                            <Option :value="3">3药品剂型</Option>
                            <Option :value="4">4药品规格</Option>
                            <Option :value="5">5包装规格</Option>
                            <Option :value="6">6产品名称商品名生产企业</Option>
                            <!-- <Option :value="1">1</Option>
                            <Option :value="2">2</Option>
                            <Option :value="3">3</Option>
                            <Option :value="4">4</Option>
                            <Option :value="5">5</Option>
                            <Option :value="6">6</Option> -->
                        </Select>
                    </FormItem>
                    <FormItem label="父级药品编码" >
                        <Select v-show="dataLevelTmp == 1" class="selectWidth"  v-model="drugJoinCodeTmp" @on-change="getDrugAndDrugClassy">
                            <Option :value="0" :key="0">-</Option>
                        </Select>
                        <Select v-show="dataLevelTmp != 1" class="selectWidth"   v-model="drugJoinCodeTmp" filterable clearable 
                            :loading="loadingSuperDurgSearch"  remote :remote-method="searchDrugList" @on-clear="searchDrugList($event)"  @on-change="getDrugAndDrugClassy">
                            <Option class="selectOptionWidth" v-for="item in drugList" :value="item.vcode" :key="item.vcode">{{ item.vname }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedSuperDrug">请选择父级药品编码</div>
                    </FormItem>
                    <!-- 第一级 -->
                    <FormItem v-show="dataLevelTmp == 1 || dataLevelTmp == 2 || dataLevelTmp == 3 ||
                            dataLevelTmp == 4 || dataLevelTmp == 5  || dataLevelTmp == 6" label="药品分类" prop="drugClassy" >
                        <Input v-show="dataLevelTmp > 1" :disabled="true" class="selectWidth" v-model.trim="drugsAdd.drugClassyName" :maxlength="150" />
                        <Select v-show="dataLevelTmp == 1" class="selectWidth"  :disabled="disabledClassy"  v-model="drugsAdd.drugClassy" filterable>
                            <Option v-for="item in drugClassyList" :value="item.drugClassy" :key="item.drugClassy">{{ item.drugClassyName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedDrugClassy">请选择药品分类</div>
                        <div class="intro" ><Button type="primary" @click="addDrugClassy" >添加</Button></div>
                    </FormItem>
                    <!-- 第二级 -->
                    <FormItem v-show="dataLevelTmp == 2 || dataLevelTmp == 3 ||
                            dataLevelTmp == 4 || dataLevelTmp == 5  || dataLevelTmp == 6" label="通用名" prop="drugGenericCode" >
                        <Input v-show="dataLevelTmp > 2" :disabled="true" class="selectWidth" v-model.trim="drugsAdd.drugGenericName"/>
                        <Select v-show="dataLevelTmp == 2"  class="selectWidth" :disabled="disabledGeneric"  filterable 
                                 remote :remote-method="getGenericList"  v-model="drugsAdd.drugGenericCode" >
                            <Option  v-for="item in genericList" :value="item.drugGenericCode" :key="item.drugGenericCode">{{ item.drugGenericName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedGeneric">请选择通用名</div>
                        <div class="intro" ><Button type="primary" @click="addGeneric"  >添加</Button></div>
                    </FormItem>
                    <!-- 第三级 -->
                    <FormItem v-show="dataLevelTmp == 3 ||
                            dataLevelTmp == 4 || dataLevelTmp == 5  || dataLevelTmp == 6" label="药品剂型" prop="form" >
                        <Input v-show="dataLevelTmp > 3" :disabled="true" class="selectWidth" v-model.trim="drugsAdd.formNameChinese"/>
                        <div v-show="dataLevelTmp == 3">
                            <Cascader style="float:left;" :disabled="disabledForm" class="selectWidth" :data="formTreeList" trigger="hover" v-model="drugsAdd.forms" change-on-select></Cascader>
                            <div class="ivu-form-item-error-tip" v-show="checkedForm">请选择剂型</div>
                            <div style="float:left;" class="intro" ><Button type="primary" style="margin-left: 5px;"  @click="addForm">添加</Button></div>
                        </div>
                        <div v-show="dataLevelTmp > 3" class="intro" ><Button type="primary" @click="addForm">添加</Button></div>
                    </FormItem>
                    <FormItem v-show="dataLevelTmp == 3 ||
                            dataLevelTmp == 4 || dataLevelTmp == 5  || dataLevelTmp == 6" label="盐酸根" prop="saltAcidCode">
                        <Input v-show="dataLevelTmp > 3" :disabled="true" class="selectWidth" v-model.trim="drugsAdd.saltAcidName"/>
                        <Select v-show="dataLevelTmp == 3" class="selectWidth" :disabled="disabledSalt"  v-model="drugsAdd.saltAcidCode" 
                            placeholder="请选择盐酸根，如无，请选择-"   filterable  >
                            <Option  v-for="item in drugSaltAcidList" :value="item.saltAcidCode" :key="item.saltAcidCode">{{ item.saltAcidName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedSaltAcid">请选盐酸根</div>
                    </FormItem>
                    <!-- 第4级 -->
                    <FormItem v-show="dataLevelTmp == 4 || dataLevelTmp == 5  || dataLevelTmp == 6"  label="药品规格" prop="drugSpecCode" >
                        <Input v-show="dataLevelTmp > 4" :disabled="true" class="selectWidth"  v-model.trim="drugsAdd.drugSpecName"/>
                        <Select v-show="dataLevelTmp == 4"  class="selectWidth" :disabled="disabledSpec" filterable
                            remote :remote-method="getSpecList" v-model="drugsAdd.drugSpecCode"  >
                            <Option class="selectOptionWidth"  v-for="item in specList" :value="item.drugSpecCode" :key="item.drugSpecCode">{{ item.drugSpecName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedSpec">请选择药品规格</div>
                        <div class="intro" ><Button type="primary"  @click="addSpec"  >添加</Button></div>
                    </FormItem>
                    <!-- 第五级 -->
                    <FormItem v-show="dataLevelTmp == 5  || dataLevelTmp == 6" label="包装规格" prop="packageSpec" >
                        <Input v-show="dataLevelTmp > 5" :disabled="true" class="selectWidth" v-model.trim="drugsAdd.packageSpecName"/>
                        <Select v-show="dataLevelTmp == 5" class="selectWidth" :disabled="disabledPackageSpec" filterable
                            remote :remote-method="getPackageSpecList" v-model="drugsAdd.packageSpec"  >
                            <Option  v-for="item in packageSpecList" :value="item.packageSpec" :key="item.packageSpec">{{ item.packageSpecName + ',' + item.minPreparationUnitName + ',' + item.minSaleUnitName + ',' + item.materialName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedPackageSpec">请选择包装规格</div>
                        <Label v-show="drugsAdd.packageSpec != null && drugsAdd.packageSpec != ''" > {{ drugsAdd.minPreparationUnit }} </Label>
                        <div class="intro" ><Button type="primary"  @click="addPackageSpec"  >添加</Button></div>
                        
                    </FormItem>
                    
                    <!-- 第六级 -->
                    <div v-show="dataLevelTmp == 6">
                       <FormItem v-if="dataLevelTmp > 6"   label="产品名称" prop="drugProductName">
                        <Input   :disabled="true" class="selectWidth" v-model.trim="drugsAdd.drugProductName" />
                     </FormItem>
                    <FormItem v-show="dataLevelTmp == 6" label="产品名称">
                        
                        <Select v-show="dataLevelTmp == 6" class="selectWidth" :disabled="disabledProduct"  
                            remote :remote-method="getDrugProductList"  placeholder="请选择产品名称，如无，请选择-"  v-model="drugsAdd.drugProductCode" filterable  >
                             <Option value="-" key="-">-</Option>
                            <Option  v-for="item in drugProductList" :value="item.drugProductCode" :key="item.drugProductCode">{{ item.drugProductName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedDrugProduct">请选产品名称</div>
                    </FormItem>
                    <FormItem label="商品名" prop="drugTradeCode"  >
                        <Select  class="selectWidth" :disabled="disabledTrade" filterable 
                            remote :remote-method="getTradeList" placeholder="请选择商品名，如无，请选择-" v-model="drugsAdd.drugTradeCode" >
                            <Option value="-" key="-">-</Option>
                            <Option v-for="item in tradeList" :value="item.drugTradeCode" :key="item.drugTradeCode">{{ item.drugTradeName }}</Option>
                        </Select>
                        <!-- <div class="ivu-form-item-error-tip" v-show="checkedTradeName">请选择商品名</div> -->
                        <div class="intro" ><Button type="primary" @click="addTrade" >添加</Button></div>
                    </FormItem>
                    <FormItem label="生产企业" prop="company"  >
                        <Select  class="selectWidth" :disabled="disabledMedical" filterable
                            remote :remote-method="getMedicalList" v-model="drugsAdd.company"  >
                            <Option v-for="item in medicalCompanyList" :value="item.company" :key="item.company">{{ item.companyName }}</Option>
                        </Select>
                        <div class="ivu-form-item-error-tip" v-show="checkedCompany">请选择生产企业</div>
                        <div class="intro" ><Button type="primary"  @click='addMedicalCompany' >添加</Button></div>
                    </FormItem>
                    <!-- <FormItem label="药品编码" prop="drug">
                        <Input  class="selectWidth" placeholder="请输入药品编码，例：DM000008888" v-model.trim="drugsAdd.drug" @on-change="getDrugValidityOrImportList" :maxlength="40" />
                    </FormItem> -->
                    <!-- 剩余的 -->
                    <FormItem label="给药途径" >
                        <Select  class="selectWidth"  v-model="drugsAdd.pathDrug" filterable >
                            <Option v-for="item in drugFormPathList" :value="item.pathDrug" :key="item.pathDrug">{{ item.pathDrugName }}</Option>
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
                  <FormItem label="有效期截止日" prop="invalidDate">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugsAdd.invalidDate" 
                                     type="date"   style="width: 698px;" ></DatePicker>
                    </FormItem>
                    <FormItem label="是否进口药品" :label-width="80">
                        <RadioGroup v-model="drugsAdd.isImport">
                            <span @click="getDrugValidityListByRadio"><Radio label="0">否</Radio></span>
                            <span @click="getDrugImportListByRadio"><Radio label="1">是</Radio></span>
                            <!-- <span ><Radio label="0">否</Radio></span>
                            <span ><Radio label="1">是</Radio></span> -->
                            <div class="intro" ><Button type="primary" @click="addValidityOrImport" >添加</Button></div>
                        </RadioGroup>
                        <div class="ivu-form-item-error-tip" v-show="checkedDrugValidity">请添加药品本位码的信息</div>
                        <div class="ivu-form-item-error-tip" v-show="checkedDrugImport">请添加进口药品的信息</div>
                    </FormItem>
                    </div>


                    <FormItem label="备注">
                        <Input class="selectWidth" v-model="drugsAdd.remark" type="textarea" :rows="4" />
                    </FormItem>
                    <FormItem>
                        <Button @click="cancel">取消</Button>
                        <Button v-show="dataLevelTmp == 1 || dataLevelTmp == ''" type="primary" :disabled="disabledAddLoading" @click="saveAddFirstInfo">保存</Button>
                        <Button v-show="dataLevelTmp == 2" type="primary" :disabled="disabledAddLoading" @click="saveAddSecondInfo">保存</Button>
                        <Button v-show="dataLevelTmp == 3" type="primary" :disabled="disabledAddLoading" @click="saveAddThreeInfo">保存</Button>
                        <Button v-show="dataLevelTmp == 4" type="primary" :disabled="disabledAddLoading" @click="saveAddFourInfo">保存</Button>
                        <Button v-show="dataLevelTmp == 5" type="primary" :disabled="disabledAddLoading" @click="saveAddFiveInfo">保存</Button>
                        <Button v-show="dataLevelTmp == 6" type="primary" :disabled="disabledAddLoading" @click="saveAddInfo">保存</Button>
                    </FormItem>
                </Form>
        </div>

        <!-- 1药品分类弹框 -->
        <Modal v-model="addDrugClassyNameModel" title="新增药品分类" class-name="vertical-center-modal" 
                :loading="loadingDrugClassy"  @on-ok="addClassyOk" >
            <Form :model="drugClassyNameForm" ref="addDrugClassyForm" :rules="ruleDrugClassyValidate" :label-width="70">
                <!-- <FormItem label="药品分类编码" prop="drugClassy">
                    <Input  v-model.trim="drugClassyNameForm.drugClassy" :maxlength="15" />
                </FormItem>   -->
                <FormItem label="药品分类名称" prop="drugClassyName">
                    <Input  v-model.trim="drugClassyNameForm.drugClassyName" :maxlength="15" />
                </FormItem> 
                <FormItem label="药品所属范围">
                    <Select  v-model="drugClassyNameForm.ownRange" filterable >
                        <Option v-for="item in ownRangeList" :value="item.drugOwnRange" :key="item.drugOwnRange">{{ item.drugOwnRangeName }}</Option>
                    </Select>
                </FormItem>  
            </Form>
        </Modal>
        <!-- 2药品通用名弹框 -->
        <Modal v-model="addGenericModel" title="新增通用名" class-name="vertical-center-modal" 
                :loading="loadingGeneric"   @on-ok="addGenericOk" >
                
                <Form :model="genericForm" ref="addGenericForm" :rules="ruleGenericValidate" :label-width="80">
                    <!-- <FormItem label="通用名编码" prop="drugGenericCode">
                        <Input v-model.trim="genericForm.drugGenericCode" :maxlength="12" />
                    </FormItem> -->
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
                    <!-- <FormItem label="药品规格编码" prop="drugSpecCode">
                        <Input v-model.trim="specForm.drugSpecCode" :maxlength="50" />
                    </FormItem> -->
                    <FormItem label="药品规格名称" prop="drugSpecName">
                        <Input v-model.trim="specForm.drugSpecName" :maxlength="150" />
                    </FormItem>
                    <FormItem label="药品统一规格">
                        <Select  v-model="specForm.drugUnifiedspecCode" filterable  remote :remote-method="getDrugUnifiedSpecList">
                            <Option v-for="item in unifiedSpecList" :value="item.drugUnifiedspecCode" :key="item.drugUnifiedspecCode">{{ item.drugUnifiedspecName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
        </Modal>
        <!-- 5药品包装规格弹框-->
        <Modal v-model="addPackageModel" title="新增药品包装规格" class-name="vertical-center-modal" 
                :loading="loadingPackageSpec"  @on-ok="addPackageSpecOk" >
                
                <Form :model="packageSpecForm" ref="addPackageSpecForm" :rules="rulePackageValidate" :label-width="80">
                    <!-- <FormItem label="包装规格编码" prop="packageSpec">
                        <Input v-model.trim="packageSpecForm.packageSpec"  />
                    </FormItem> -->
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
                    <!-- <FormItem label="生产企业编码" prop="company" :maxlength="20">
                        <Input v-model.trim="medicalForm.company" />
                    </FormItem> -->
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
                             <Option  v-for="item in pathDrugList"  :value="item.pathDrug" :key="item.pathDrug">{{  item.pathDrugName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model.trim="drugFormPathForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}" type="textarea" />
                    </FormItem>

                </Form>
            </Modal>

        <!-- 药品有效期弹框-->
        <Modal v-model="addValidityModel" title="新增药品有效期" class-name="vertical-center-modal" 
                 @on-ok="addDrugValidityOk">
                
                <Form :model="drugValidityForm" ref="addDrugValidityForm"  :rules="ruleValidityValidate" :label-width="90">
                    
                    <!-- <FormItem label="药品编码" prop="drug">
                        <Input :disabled="true" v-model.trim="drugValidityForm.drug" :maxlength="20"/>
                    </FormItem>  -->
                    <FormItem label="药品本位码" prop="sdcc18">
                        <Input v-model.trim="drugValidityForm.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准文号" prop="approveNumber">
                        <Input v-model.trim="drugValidityForm.approveNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="批准日期" prop="approveDate">
                        <DatePicker placeholder="请选择批准日期" format="yyyy年MM月dd日"  v-model="drugValidityForm.approveDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
  
                    <FormItem label="原批准文号" >
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
                     @on-ok="addDrugImportOk" >
                <Form :model="drugImportForm" ref="addDrugImportForm"  :rules="ruleImportValidate" :label-width="90">
                    
                    <!-- <FormItem label="药品编码" prop="drug">
                        <Input :disabled="true" v-model.trim="drugImportForm.drug" :maxlength="20"/>
                    </FormItem>  -->
                    <FormItem label="药品本位码" prop="sdcc18">
                        <Input v-model.trim="drugImportForm.sdcc18" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="开始年月" >
                        <DatePicker placeholder="请选择开始年月" type="month" format="yyyyMM"  v-model="drugImportForm.startYearmonth" style="width: 398px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束年月" >
                        <DatePicker placeholder="请选择结束年月" type="month" format="yyyyMM"  v-model="drugImportForm.stopYearmonth" style="width: 398px"></DatePicker>
                    </FormItem>
                    <FormItem label="注册证码" prop="registerNumber">
                        <Input v-model.trim="drugImportForm.registerNumber" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="分包装批准文号">
                        <Input v-model.trim="drugImportForm.subpackApproval" :maxlength="80"/>
                    </FormItem>
                    <FormItem label="发证日期" prop="certificationDate">
                        <DatePicker placeholder="请选择发证日期" format="yyyy年MM月dd日"  v-model="drugImportForm.certificationDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem>
                    <!-- <FormItem label="有效期截止日" prop="invalidDate">
                        <DatePicker placeholder="请选择有效期截止日" format="yyyy年MM月dd日"  v-model="drugImportForm.invalidDate" 
                                     type="date"   style="width: 398px;" ></DatePicker>
                    </FormItem> -->
                    <FormItem label="分包装企业">
                        <Select   v-model="drugImportForm.poinpackcompanyId" filterable >
                            <Option v-for="item in poinpackList" :value="item.poinpackcompanyId" :key="item.poinpackcompanyId">{{ item.poinpackcompanyName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分包装批准文号日期">
                         <DatePicker placeholder="请选择分包装批准文号日期" format="yyyy年MM月dd日"  v-model="drugImportForm.subpackApprovalDate" 
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
  name: "drugs",
  data() {
    const validateNumber = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    const validatePrice = (rule, value, callback) => {
      var reg = /^\d*\.{0,1}\d{0,4}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的单价"));
      } else {
        callback();
      }
    };
    return {
      dataLevelTmp: "",
      drugJoinCodeTmp: "",
      checkedSuperDrug: false,
      checkedDrugClassy: false,
      checkedGeneric: false,
      checkedForm: false,
      checkedSaltAcid: false,
      checkedDrugProduct: false,
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

      addDrugClassyNameModel: false,
      addGenericModel: false,
      addFormModel: false,
      addSpecModel: false,
      addPackageModel: false,
      addTradeModel: false,
      addMedicalCompanyModel: false,
      addDrugFormPathModel: false,
      addValidityModel: false,
      addImportModel: false,

      loadingDrugClassy: true,
      loadingGeneric: true,
      loadingForm: true,
      loadingSpec: true,
      loadingPackageSpec: true,
      loadingTrade: true,
      loadingMedical: true,
      loadingCompany: true,
      loadingFormPath: true,
      loadingDrugImport: true,
      loadingDrugValidity: true,
      //父级药品远程搜索
      loadingSuperDurgSearch: false,

      drugClassyNameForm: {},
      genericForm: {},
      forms: {},
      specForm: {
        drugUnifiedspecCode: ""
      },
      packageSpecForm: {},
      tradeForm: {},
      medicalForm: {
        city: ""
      },
      drugValidityForm: {},
      drugImportForm: {},
      drugFormPathForm: {},

      drugList: [],
      drugClassyList: [],
      ownRangeList: [],
      genericList: [],
      drugAtcAllList: [],
      drugSdccAllList: [],
      drugSaltAcidList: [],
      drugProductList: [],
      formList: [],
      formLevelList: [],
      formTreeList: [],
      pathDrugList: [],
      specList: [],
      unifiedSpecList: [],
      packageSpecList: [],
      packageMaterialList: [],
      unitList: [],
      tradeList: [],
      medicalCompanyList: [],
      blocList: [],
      companyTypeList: [],
      addressList: [],
      provinceList: [],
      cityList: [],
      drugFormPathList: [],
      otcClassyList: [],
      riskGradeList: [],
      poinpackList: [],
      drugImportList: [],
      drugValidityList: [],
      drugsAdd: {
        forms: [],
        isOtc: "0",
        isLactatingCaution: "0",
        isRural: "0",
        isNarcotize: "0",
        isVirulence: "0",
        isRadioactivity: "0",
        isEssential: "0",
        isNationalFormulary: "0",
        isSpecial: "0",
        isRenalDiseaseCare: "0",
        isCommunity: "0",
        isDysfunctionCare: "0",
        isSpiritDrug: "0",
        isImport: "0",
        unitPrice:"",
        invalidDate:"",
        drugClassy : "",
        drugClassyName : "",
        drugGenericCode : "",
        drugGenericName : "",
        form : "",
        formNameChinese : "",
        saltAcidCode : "",
        saltAcidCode : "",
        saltAcidName : "",
        drugProductName : "",
        drugSpecCode : "",
        drugSpecName : "",
        packageSpec : "",
        packageSpecName : "",
        drugTradeCode : "",
        drugTradeName : "",
        company : "",
        companyName : "",

      },
      disabledClassy: true,
      disabledGeneric: true,
      disabledSalt: true,
      disabledForm: true,
      disabledProduct: true,
      disabledSpec: true,
      disabledPackageSpec: true,
      disabledMaterial: true,
      disabledMinPreUnit: true,
      disabledMinSaleUnit: true,
      disabledTrade: true,
      disabledMedical: true,
      disabledAddLoading: false,
      ruleValidate: {
        drug: [
          { required: true, message: "药品编码不能为空", trigger: "blur" }
        ],
        drugClassy: [
          { required: true, message: "药品分类不能为空", trigger: "blur" }
        ],
        drugGenericCode: [
          { required: true, message: "药品通用名不能为空", trigger: "blur" }
        ],
        drugSpecCode: [
          { required: true, message: "药品规格不能为空", trigger: "blur" }
        ],
        form: [
          { required: true, message: "药品剂型不能为空", trigger: "blur" }
        ],
        saltAcidCode: [
          { required: true, message: "盐酸根不能为空", trigger: "blur" }
        ],
        drugProductCode: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        packageSpec: [
          { required: true, message: "包装规格不能为空", trigger: "blur" }
        ],
        drugTradeCode: [
          { required: true, message: "商品名不能为空", trigger: "blur" }
        ],
        company: [
          { required: true, message: "生产企业不能为空", trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: "单价不能为空", trigger: "blur" },
          { validator: validatePrice }
        ],
        invalidDate: [
          {
            required: true,
            message: "请选择有效期截至日",
            trigger: "blur",
            type: "date"
          }
        ],
      },
      //新增药品分类时候的验证
      ruleDrugClassyValidate: {
        drugClassy: [
          { required: true, message: "药品分类编码不能为空", trigger: "blur" },
          { validator: validateNumber }
        ],
        drugClassyName: [
          { required: true, message: "药品类别名称不能为空", trigger: "blur" }
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
        atc: [{ required: true, message: "atc不能为空", trigger: "blur" }],
        sdcc: [{ required: true, message: "sdcc不能为空", trigger: "blur" }]
      },
      //新增剂型时候的验证
      ruleFormValidate: {
        form: [
          { required: true, message: "剂型编码不能为空", trigger: "blur" }
        ],
        formNameChinese: [
          { required: true, message: "剂型名称不能为空", trigger: "blur" }
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
        packageSpec: [
          { required: true, message: "药品规格编码不能为空", trigger: "blur" }
        ],
        packageSpecName: [
          { required: true, message: "药品规格名称不能为空", trigger: "blur" }
        ]
      },
      //新增商品名时候的验证
      ruleTradeValidate: {
        drugTradeCode: [
          { required: true, message: "商品名编码不能为空", trigger: "blur" }
        ],
        drugTradeName: [
          { required: true, message: "商品名不能为空", trigger: "blur" }
        ]
      },
      //新增生产企业时候的验证
      ruleMedicalValidate: {
        company: [
          { required: true, message: "生产企业编码不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "生产企业名称不能为空", trigger: "blur" }
        ],
        companyType: [
          {
            required: true,
            message: "企业类型不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        province: [
          {
            required: true,
            message: "所在省不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        city: [
          {
            required: true,
            message: "所在市不能为空",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      //新增药品剂型_给药途径的验证
      ruleDrugFormPathValidate: {
        form: [{ required: true, message: "剂型不能为空", trigger: "blur" }],
        pathDrug: [
          { required: true, message: "给药途径不能为空", trigger: "blur" }
        ]
      },
      //药品有效期的验证(后需求改为需要把有效期从弹框中提取到新增主页面 此处不再验证有效期 2021/02/02)
      ruleValidityValidate: {
        // drug: [
        //     { required: true, message: "药品不能为空", trigger: "blur" }
        // ],
        sdcc18: [
          { required: true, message: "药品本位码不能为空", trigger: "blur" }
        ],
        approveNumber: [
          { required: true, message: "批准文号不能为空", trigger: "blur" }
        ],
        approveDate: [
          {
            required: true,
            message: "请选择批准日期",
            trigger: "change",
            type: "date"
          }
        ],
        startYearmonth: [
          {
            required: true,
            message: "请选择开始年月",
            trigger: "change",
            type: "date"
          }
        ],
        stopYearmonth: [
          {
            required: true,
            message: "请选择结束年月",
            trigger: "change",
            type: "date"
          }
        ]
      },
      //进口药品新增时候的验证（需求修改 将有效截止期提出从弹窗到主页面）
      ruleImportValidate: {
        // drug: [
        //     { required: true, message: "药品不能为空", trigger: "blur" }
        // ],
        sdcc18: [
          { required: true, message: "药品本位码不能为空", trigger: "blur" }
        ],
        registerNumber: [
          { required: true, message: "注册证码不能为空", trigger: "blur" }
        ],
        certificationDate: [
          {
            required: true,
            message: "请选择发证日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
        // invalidDate: [
        //   {
        //     required: true,
        //     message: "请选择有效期截止日",
        //     trigger: "change",
        //     pattern: /.+/
        //   }
        // ],
        startYearmonth: [
          {
            required: true,
            message: "请选择开始年月",
            trigger: "change",
            type: "date"
          }
        ],
        stopYearmonth: [
          {
            required: true,
            message: "请选择结束年月",
            trigger: "change",
            type: "date"
          }
        ]
      }
    };
  },
 
  mounted() {
    //1.获取otc分类
    // this.getOtcClassyList();
    // //2.获取妊娠等级
    // this.getRiskPregnancyList();
  },
  methods: {
    dateFormat(val) {
      let year = val.getFullYear().toString();
      let month =
        val.getMonth() >= 9
          ? (val.getMonth() + 1).toString()
          : "0" + (val.getMonth() + 1);
      return year + month;
    },
    getDrugListByDatalevel(query) {
      //根据等级获取药品
      var self = this;
      self.$refs["drugsForm"].resetFields();
      Vue.ajax.send({
        name: "drugs.byLevelList",
        data: {
          dataLevel: self.dataLevelTmp - 1
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugList = data.data;

            //清空上次选择的数据
            self.drugJoinCodeTmp = "";
            self.drugsAdd.drugClassy = "";
            self.drugsAdd.drugClassyName = "";
            self.drugsAdd.drugGenericCode = "";
            self.drugsAdd.drugGenericName = "";
            self.drugsAdd.form = "";
            self.drugsAdd.formNameChinese = "";
            self.drugsAdd.saltAcidCode = "";
            self.drugsAdd.saltAcidCode = "";
            self.drugsAdd.saltAcidName = "";
            self.drugsAdd.drugProductName = "";
            self.drugsAdd.drugSpecCode = "";
            self.drugsAdd.drugSpecName = "";
            self.drugsAdd.packageSpec = "";
            self.drugsAdd.packageSpecName = "";
            self.drugsAdd.drugTradeCode = "";
            self.drugsAdd.drugTradeName = "";
            self.drugsAdd.company = "";
            self.drugsAdd.companyName = "";

            //药品信息的显示与否
            self.showInfoByLevel();
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    searchDrugList(query) {
      //根据等级和搜索词获取药品
      var self = this;
      if (query == "" || query == null) {
        //如果搜索词为空则调用level接口
        self.getDrugListByDatalevel();
      } else {
        // self.$refs['drugsForm'].resetFields();
        //如果搜索词不为空，则调用这个接口
        Vue.ajax.send({
          name: "drugs.byLevelList",
          data: {
            pageIndex: 1,
            pageSize: 100,
            dataLevel: self.dataLevelTmp - 1,
            vname: query
          },
          success: function(data) {
            if (!!data && data.code == "0") {
              self.drugList = data.data;
              //药品信息的显示与否
              self.showInfoByLevel();
            } else {
              this.$Modal.error({
                title: "",
                content: data.message
              });
            }
          }
        });
      }
    },
    showInfoByLevel() {
      var self = this;
      if (self.dataLevelTmp == 1) {
        //如果等级为1，则药品分类
        self.disabledClassy = false;
        //获取药品分类表
        // self.getDrugClassyList();
      } else if (self.dataLevelTmp == 2) {
        //如果等级为2，则药品通用名是可用的，
        self.disabledGeneric = false;
        //药品分类不可用
        self.disabledClassy = true;
      } else if (self.dataLevelTmp == 3) {
        //如果等级为3，则药品剂型，盐酸根,产品名称是可用的
        self.disabledForm = false;
        self.disabledSalt = false;
        //药品分类，通用名不可用
        self.disabledClassy = true;
        self.disabledGeneric = true;

      } else if (self.dataLevelTmp == 4) {
        //如果等级为4，则药品规格是可用的，
        self.disabledSpec = false;
        //药品分类，通用名不可用,剂型，盐酸根，产品名称不可用
        self.disabledClassy = true;
        self.disabledGeneric = true;
        self.disabledForm = true;
        self.disabledSalt = true;
      } else if (self.dataLevelTmp == 5) {
        //如果等级为5，则药品包装规格是可用的，
        self.disabledPackageSpec = false;
        //药品分类，通用名不可用,剂型，盐酸根，产品名称，规格不可用
        self.disabledClassy = true;
        self.disabledGeneric = true;
        self.disabledForm = true;
        self.disabledSalt = true;
        self.disabledSpec = true;
      } else if (self.dataLevelTmp == 6) {
        //如果等级为6，则商品名，生产企业是可用的，
        self.disabledTrade = false;
        self.disabledMedical = false;
        self.disabledProduct = false;
        //药品分类，通用名不可用,剂型，盐酸根，产品名称，规格,包装规格不可用
        self.disabledClassy = true;
        self.disabledGeneric = true;
        self.disabledForm = true;
        self.disabledSalt = true;
        self.disabledSpec = true;
        self.disabledPackageSpec = true;
      }
    },
    getDrugAndDrugClassy() {

      //根据药品主键，筛选出该药品
      var self = this;
      var tmp;
      self.drugList.forEach(item => {
        if (item.vcode == self.drugJoinCodeTmp) {
          tmp = item;
        }
      });

      if (self.dataLevelTmp == 1) {
        //获取药品分类
        self.getDrugClassyList();
      } else if (self.dataLevelTmp == 2) {
        //如果是新建等级2的通用名,则显示药品分类相关的数据
        if (tmp != null && tmp != "") {
          self.drugsAdd.drugClassy = tmp.vcode.substring(0, 1);
          self.drugsAdd.drugClassyName = tmp.vname.substring(
            0,
            tmp.vname.length
          );

          //获取通用名列表
          self.getGenericList("");
        }
      } else {
        if (tmp != null && tmp != "") {
          //将code和name转换成数组
          let codes = tmp.vcode.split(",");
          let names = tmp.vname.split(",");
          //"中成药,穿心莲片,片剂,,,每片含穿心莲干浸膏0.105克,1丸/毫升"

          if (self.dataLevelTmp == 3) {
            //如果是新建等级3的剂型，盐酸根，产品名称，则显示药品分类和药品通用名相关的数据
            self.drugsAdd.drugClassy = codes[0];
            self.drugsAdd.drugClassyName = names[0];
            self.drugsAdd.drugGenericCode = codes[1];
            self.drugsAdd.drugGenericName = names[1];
            //获取剂型列表
            self.getFromTreeList();
            //获取盐酸根列表
            self.getDrugSaltAcidList();
            //获取产品名称列表
            self.getDrugProductList("");
          } else if (self.dataLevelTmp == 4) {
            //如果是新建等级为4的药品规格，则显示药品分类，药品通用名，药品剂型，盐酸根相关的数据
            self.drugsAdd.drugClassy = codes[0];
            self.drugsAdd.drugClassyName = names[0];
            self.drugsAdd.drugGenericCode = codes[1];
            self.drugsAdd.drugGenericName = names[1];
            self.drugsAdd.form = codes[2];
            self.drugsAdd.formNameChinese = names[2];
            self.drugsAdd.saltAcidCode = codes[3];
            self.drugsAdd.saltAcidName = names[3];
            //产品名称
            // self.drugsAdd.drugProductCode = codes[4];
            // self.drugsAdd.drugProductName = names[4];
            //获取药品规格列表
            self.getSpecList("");
            //获取产品名称列表
            // self.getDrugProductList('');
          } else if (self.dataLevelTmp == 5) {
            //如果是新建等级为5的药品包装规格，则显示药品分类，药品通用名，药品剂型，盐酸根相关，规格的数据
            self.drugsAdd.drugClassy = codes[0];
            self.drugsAdd.drugClassyName = names[0];
            self.drugsAdd.drugGenericCode = codes[1];
            self.drugsAdd.drugGenericName = names[1];
            self.drugsAdd.form = codes[2];
            self.drugsAdd.formNameChinese = names[2];
            self.drugsAdd.saltAcidCode = codes[3];
            self.drugsAdd.saltAcidName = names[3];
            //产品名称
            // self.drugsAdd.drugProductCode = codes[4];
            // self.drugsAdd.drugProductName = names[4];
            self.drugsAdd.drugSpecCode = codes[5];
            self.drugsAdd.drugSpecName = names[5];
            //获取药品包装规格列表
            self.getPackageSpecList("");
            //获取产品名称列表
            // self.getDrugProductList('');
          } else if (self.dataLevelTmp == 6) {
            //如果是新建等级为5的药品包装规格，则显示药品分类，药品通用名，药品剂型，盐酸根相关，规格的数据
            self.drugsAdd.drugClassy = codes[0];
            self.drugsAdd.drugClassyName = names[0];
            self.drugsAdd.drugGenericCode = codes[1];
            self.drugsAdd.drugGenericName = names[1];
            self.drugsAdd.form = codes[2];
            self.drugsAdd.formNameChinese = names[2];
            self.drugsAdd.saltAcidCode = codes[3];
            self.drugsAdd.saltAcidName = names[3];
            //产品名称
            // self.drugsAdd.drugProductCode = codes[4];
            // self.drugsAdd.drugProductName = names[4];
            self.drugsAdd.drugSpecCode = codes[5];
            self.drugsAdd.drugSpecName = names[5];
            self.drugsAdd.packageSpec = codes[6];
            self.drugsAdd.packageSpecName = names[6];
            //获取药品商品名
            self.getTradeList("");
            //获取生产企业
            self.getMedicalList("");
            //根据剂型，获取给药途径
            self.getFormDrugPathList();
            //获取产品名称列表
            // self.getDrugProductList('');
          }
        }
      }

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
          pageSize: 99999
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

            // if(self.genericList.length > 0) {
            //     // self.disabledGeneric = false;

            // }else {
            //     // self.disabledGeneric = true;
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
    getDrugSaltAcidList() {
      //盐酸根
      var self = this;
      Vue.ajax.send({
        name: "drugSaltAcid.list",
        data: {
          pageIndex: 1,
          pageSize: 999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugSaltAcidList = data.data.dataList;

            // if(self.drugSaltAcidList.length > 0) {
            //     self.disabledSalt = false;
            // }else {
            //     self.disabledSalt = true;
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
    getFormList() {
      //获取第二等级的剂型，用于药品剂型_给药途径关系表的添加
      var self = this;
      Vue.ajax.send({
        name: "form.list",
        data: {
          pageIndex: 1,
          pageSize: 999,
          dataLevel: 2
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.formList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getFormListByDataLevel() {
      var self = this;
      Vue.ajax.send({
        name: "form.list",
        data: {
          pageIndex: 1,
          pageSize: 999,
          dataLevel: 1
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.formLevelList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getDataLevel(value) {
      var item = this.formLevelList.filter(x => x.form == value);
      if (value == "-") {
        this.forms.dataLevel = 1;
      } else {
        this.forms.dataLevel = item[0].dataLevel + 1;
      }
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
    getDrugProductList(query) {
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

            // if(self.specList.length > 0) {
            //     self.disabledSpec = false;

            // }else {
            //     self.disabledSpec = true;
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
        name: "drugPackageMaterial.list",
        data: {
          pageIndex: 1,
          pageSize: 999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.packageMaterialList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getUnitList() {
      //最小制剂单位是片，粒等
      //最小销售单位是盒，瓶等
      var self = this;
      Vue.ajax.send({
        name: "unit.list",
        data: {
          pageIndex: 1,
          pageSize: 999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.unitList = data.data.dataList;

            // if (self.unitList.length > 0) {
            //     self.disabledTrade = false;
            //     self.disabledMedical = false;
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
    getTradeList(query) {
      //商品名
      var self = this;
      Vue.ajax.send({
        name: "drugs.tradeNameList",
        data: {
          pageIndex: 1,
          pageSize: 50,
          drugTradeName: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.tradeList = data.data;
          } else {
            this.$Modal.error({
              title: "",
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
        name: "drugs.companyList",
        data: {
          pageIndex: 1,
          pageSize: 50,
          companyName: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.medicalCompanyList = data.data;
          } else {
            this.$Modal.error({
              title: "",
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
          statusId: 4
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugFormPathList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getCompanyBlocList() {
      var self = this;
      Vue.ajax.send({
        name: "companyBloc.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.blocList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getCompanyTypeList() {
      var self = this;
      Vue.ajax.send({
        name: "medical.companyTypeList",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.companyTypeList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getProvinceList() {
      var self = this;
      Vue.ajax.send({
        name: "city.provinceList",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.provinceList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getCityList() {
      //省份改变以后，清除上一次的城市
      var self = this;
      self.medicalForm.city = "";
      Vue.ajax.send({
        name: "city.list",
        data: {
          pageIndex: 1,
          pageSize: 99999,
          province: self.medicalForm.province
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.cityList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    // getOtcClassyList() {
    //     //调用otc类别接口
    //     var self = this;
    //     Vue.ajax.send({
    //         name: "otcClassy.list",
    //         data: {
    //             pageIndex: 1,
    //             pageSize: 99999
    //         },
    //         success: function(data) {
    //             if (!!data && data.code == "0") {
    //                 self.otcClassyList = data.data.dataList;

    //             } else {
    //                 this.$Modal.error({
    //                     title: "",
    //                     content: data.message
    //                 });
    //             }
    //         }
    //     });
    // },
    // getRiskPregnancyList() {
    //     //调用妊娠等级接口
    //     var self = this;
    //     Vue.ajax.send({
    //         name: "riskPregnancyGrade.list",
    //         data: {
    //             pageIndex: 1,
    //             pageSize: 99999
    //         },
    //         success: function(data) {
    //             if (!!data && data.code == "0") {
    //                 self.riskGradeList = data.data.dataList;

    //             } else {
    //                 this.$Modal.error({
    //                     title: "",
    //                     content: data.message
    //                 });
    //             }
    //         }
    //     });
    // },
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
    //获取进口药品，
    getDrugImportList() {
      var self = this;
      Vue.ajax.send({
        name: "drugsImport.list",
        data: {
          pageIndex: 1,
          pageSize: 10,
          drug: self.drugsAdd.drug
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugImportList = data.data.dataList;

            self.checkedDrugValidity = false;
            if (self.drugImportList.length > 0) {
              self.checkedDrugImport = false;
            } else {
              self.checkedDrugImport = true;
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
    //获取药品有效期
    getDrugValidityList() {
      var self = this;
      Vue.ajax.send({
        name: "drugValidity.list",
        data: {
          pageIndex: 1,
          pageSize: 10,
          drug: self.drugsAdd.drug
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.drugValidityList = data.data.dataList;
            self.checkedDrugImport = false;
            //如果大于0，则说明是进口药品信息
            if (self.drugValidityList.length > 0) {
              self.checkedDrugValidity = false;
            } else {
              self.checkedDrugValidity = true;
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
    addDrugClassy() {
      //1、药品分类弹框
      this.addDrugClassyNameModel = true;
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
    addForm() {
      //3、药品剂型弹框
      this.addFormModel = true;
      //获取父级剂型
      this.getFormListByDataLevel();
    },
    addSpec() {
      //4、药品规格弹框
      this.addSpecModel = true;
      //获取统一规格
      this.getDrugUnifiedSpecList("");
    },
    addPackageSpec() {
      //5、药品包装规格
      this.addPackageModel = true;
      //获取包装材料
      this.getPackageMaterialList();
      //获取计量单位
      this.getUnitList();
    },
    addTrade() {
      //6、药品商品名
      this.addTradeModel = true;
    },
    addMedicalCompany() {
      //7、生产企业
      this.addMedicalCompanyModel = true;
      //获取生产企业集团
      this.getCompanyBlocList();
      //获取省
      this.getProvinceList();
      //获取企业类型
      this.getCompanyTypeList();
    },
    addDrugFormPath() {
      //8、添加药品剂型_给药途径
      this.addDrugFormPathModel = true;
      //获取剂型
      this.getFormList();
      //获取给药途径
      this.getPathDrugList();
    },
    addValidityOrImport() {
      // if (this.drugsAdd.drug == ''  || this.drugsAdd.drug == null) {
      //     //如果药品编码为空，则提示先填写药品编码
      //     this.$Modal.error({
      //                         title: "提示",
      //                         content: "请先填写药品编码"
      //                     });
      // }else {
      if (this.drugsAdd.isImport == "0") {
        //药品有效期弹框
        this.addValidityModel = true;

        if (
          this.drugValidityForm.sdcc18 != "" &&
          this.drugValidityForm.sdcc18 != null
        ) {
          this.checkedDrugValidity = false;
        } else {
          this.checkedDrugValidity = true;
        }

        // this.drugValidityForm.drug = this.drugsAdd.drug;
        // this.getDrugValidityList();
      } else {
        //进口药品
        this.addImportModel = true;

        if (
          this.drugImportForm.sdcc18 != "" &&
          this.drugImportForm.sdcc18 != null &&
          this.drugImportForm.registerNumber != "" &&
          this.drugImportForm.registerNumber != null &&
          this.drugImportForm.certificationDate != "" &&
          this.drugImportForm.certificationDate != null &&
          this.drugImportForm.invalidDate != "" &&
          this.drugImportForm.invalidDate != null
        ) {
          this.checkedDrugImport = false;
        } else {
          this.checkedDrugImport = true;
        }

        // this.drugImportForm.drug = this.drugsAdd.drug;
        // this.getDrugImportList();
        //获取分包装企业
        this.getPoinpackList();
      }
      // }
    },
    getDrugValidityListByRadio() {
      //药品有效期
      this.checkedDrugImport = false;
      if (
        this.drugValidityForm.sdcc18 != "" &&
        this.drugValidityForm.sdcc18 != null
      ) {
        this.checkedDrugValidity = false;
      } else {
        this.checkedDrugValidity = true;
      }
    },
    getDrugImportListByRadio() {
      this.checkedDrugValidity = false;
      if (
        this.drugImportForm.sdcc18 != "" &&
        this.drugImportForm.sdcc18 != null &&
        this.drugImportForm.registerNumber != "" &&
        this.drugImportForm.registerNumber != null &&
        this.drugImportForm.certificationDate != "" &&
        this.drugImportForm.certificationDate != null &&
        this.drugImportForm.invalidDate != "" &&
        this.drugImportForm.invalidDate != null
      ) {
        this.checkedDrugImport = false;
      } else {
        this.checkedDrugImport = true;
      }
    },
    // 保存弹框相关的方法
    addClassyOk() {
      //保存药品分类
      this.$refs["addDrugClassyForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "drugClassy.add",
            data: {
              // drugClassy: self.drugClassyNameForm.drugClassy,
              drugClassyName: self.drugClassyNameForm.drugClassyName,
              ownRange: self.drugClassyNameForm.ownRange,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addDrugClassyNameModel = false;
                self.$refs["addDrugClassyForm"].resetFields();

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
    addGenericOk() {
      //保存通用名
      this.$refs["addGenericForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "generic.add",
            data: {
              // drugGenericCode: self.genericForm.drugGenericCode,
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
    addFormOk() {
      //保存剂型
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "form.add",
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
              if (!!data && data.code == "0") {
                self.addFormModel = false;
                self.$refs["addForm"].resetFields();
                self.$Message.success("新增剂型提交成功！");

                self.forms.superiorForm = "";
                self.forms.formNameEnglish = "";
                self.forms.formAb = "";
                self.forms.formEnglishAb = "";
                //刷新剂型列表
                self.getFromTreeList();
              } else {
                setTimeout(() => {
                  self.loadingForm = false;
                  self.$nextTick(() => {
                    self.loadingForm = true;
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
            this.loadingForm = false;
            this.$nextTick(() => {
              this.loadingForm = true;
            });
          }, 0);
        }
      });
    },
    addSpeckOk() {
      //保存规格
      this.$refs["addSpecForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "spec.add",
            data: {
              // drugSpecCode: self.specForm.drugSpecCode,
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
                self.getSpecList("");
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
    addPackageSpecOk() {
      //保存包装规格
      this.$refs["addPackageSpecForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "packageSpec.add",
            data: {
              // packageSpec: self.packageSpecForm.packageSpec,
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
                self.getPackageSpecList("");
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
    addTradeNameOk() {
      //保存商品名
      this.$refs["addTradeForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "trade.add",
            data: {
              // drugTradeCode: self.tradeForm.drugTradeCode,
              drugTradeName: self.tradeForm.drugTradeName,
              drugTradeNameEn: self.tradeForm.drugTradeNameEn,
              remark: self.tradeForm.remark,
              statusId: 4,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addTradeModel = false;
                self.$refs["addTradeForm"].resetFields();

                self.$Message.success("新增商品名提交成功！");
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
                  title: "",
                  content: data.message
                });
              }
            }
          });
        } else {
          setTimeout(() => {
            this.loadingTrade = false;
            this.$nextTick(() => {
              this.loadingTrade = true;
            });
          }, 0);
        }
      });
    },
    addMedicalCompanyOk() {
      this.$refs["addMedicalForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "medical.add",
            data: {
              // company: self.medicalForm.company,
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
              createUser: Vue.getUser().userName,
              remark: self.medicalForm.remark
            },
            success: function(data) {
              setTimeout(() => {
                self.loadingMedical = false;
                self.$nextTick(() => {
                  self.loadingMedical = true;
                });
              }, 0);
              if (!!data && data.code == "0") {
                self.$Message.success("新增生产企业提交成功！");
                self.addMedicalCompanyModel = false;
                self.$refs["addMedicalForm"].resetFields();

                self.medicalForm.address = "";
                self.medicalForm.enterpriseLegal = "";
                self.medicalForm.chineseShort = "";
                self.medicalForm.organ = "";
                self.medicalForm.blocId = "";

                self.getMedicalList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        } else {
          setTimeout(() => {
            this.loadingMedical = false;
            this.$nextTick(() => {
              this.loadingMedical = true;
            });
          }, 0);
        }
      });
    },
    addDrugFormPathOk() {
      //添加药品剂型_给药途径
      this.$refs["addDrugFormPathForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "formDrugPath.add",
            data: {
              form: self.drugFormPathForm.form,
              pathDrug: self.drugFormPathForm.pathDrug,
              statusId: 4,
              createUser: Vue.getUser().userName,
              remark: self.drugFormPathForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addDrugFormPathModel = false;

                self.$refs["addDrugFormPathForm"].resetFields();
                self.$Message.success("新增药品剂型_给药途径提交成功！");

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
                  title: "",
                  content: data.message
                });
              }
            }
          });
        } else {
          setTimeout(() => {
            this.loadingFormPath = false;
            this.$nextTick(() => {
              this.loadingFormPath = true;
            });
          }, 0);
        }
      });
    },
    addDrugValidityOk() {
      //如果不是进口药品，添加到药品有效期表中
      this.$refs["addDrugValidityForm"].validate(valid => {
        
        if (valid) {
          var self = this;
          (self.drugValidityForm.startYearmonth =
            self.drugValidityForm.startYearmonth == ""
              ? ""
              : self.dateFormat(self.drugValidityForm.startYearmonth)),
            (self.drugValidityForm.stopYearmonth =
              self.drugValidityForm.stopYearmonth == ""
                ? ""
                : self.dateFormat(self.drugValidityForm.stopYearmonth)),
            (self.drugValidityForm.approveDate =
              self.drugValidityForm.approveDate == ""
                ? ""
                : self.drugValidityForm.approveDate),
            (self.drugValidityForm.invalidDate =
              self.drugValidityForm.invalidDate == ""
                ? ""
                : self.drugValidityForm.invalidDate),
            (self.drugsAdd.drugValidityForm = self.drugValidityForm);

          //隐藏药品有效期弹框，清除数据
          self.addValidityModel = false;
          self.checkedDrugValidity = false;
        } else {
          self.checkedDrugValidity = true;
        }
      });
    },
    addDrugImportOk() {
      //如果是进口药品，添加到进口药品表中
      this.$refs["addDrugImportForm"].validate(valid => {
        if (valid) {
          var self = this;
          (self.drugImportForm.startYearmonth = self.drugImportForm.startYearmonth==""?"":self.dateFormat(
            self.drugImportForm.startYearmonth
          )),
            (self.drugImportForm.stopYearmonth = self.drugImportForm.stopYearmonth==""?"":self.dateFormat(
              self.drugImportForm.stopYearmonth
            )),
            (self.drugImportForm.certificationDate =
              self.drugImportForm.certificationDate == ""
                ? ""
                : self.drugImportForm.certificationDate),
            (self.drugImportForm.subpackApprovalDate =
              self.drugImportForm.subpackApprovalDate == ""
                ? ""
                : self.drugImportForm.subpackApprovalDate),
            (self.drugImportForm.invalidDate =
              self.drugImportForm.invalidDate == ""
                ? ""
                : self.drugImportForm.invalidDate),
            (self.drugImportForm.subpackExpirationDate =
              self.drugImportForm.subpackExpirationDate == ""
                ? ""
                : self.drugImportForm.subpackExpirationDate),
            (self.drugsAdd.drugImportForm = self.drugImportForm);

          self.addImportModel = false;
          self.checkedDrugImport = false;
        } else {
          self.checkedDrugImport = true;
        }
      });
    },
    saveAddFirstInfo() {
      if (this.disabledAddLoading) {
        return;
      }
      this.disabledAddLoading = true;

      //保存第一级
      if (this.drugsAdd.drugClassy != "" && this.drugsAdd.drugClassy != null) {
        this.checkedSuperDrug = false;
        this.checkedDrugClassy = false;
        var self = this;
        Vue.ajax.send({
          name: "drugs.add",
          data: {
            //第一级的时候drug码就是药品分类的主键
            drug: self.drugsAdd.drugClassy,
            superiorDrug: "-",
            dataLevel: "1",
            //第一级的时候药品组合码就是药品分类的主键
            drugJoinCode: self.drugsAdd.drugClassy,
            remark: self.drugsAdd.remark,
            createUser: Vue.getUser().userName
          },
          success: function(data) {
            self.disabledAddLoading = false;
            if (!!data && data.code == "0") {
              self.addTradeModel = false;
              self.$refs["addTradeForm"].resetFields();
              self.$router.push("/standard/mapping/drugs/list");
              self.$Message.success("新增药品分类提交成功！");
            } else {
              self.$Modal.error({
                title: "",
                content: data.message
              });
            }
          }
        });
      } else {
        this.disabledAddLoading = false;
        //    非空的提示信息
        if (
          this.drugsAdd.drugClassy != "" &&
          this.drugsAdd.drugClassy != null
        ) {
          this.checkedDrugClassy = false;
        } else {
          this.checkedDrugClassy = true;
        }
        if (this.drugJoinCodeTmp != "" && this.drugJoinCodeTmp != null) {
          this.checkedSuperDrug = false;
        } else {
          this.checkedSuperDrug = true;
        }
      }
      // })
    },
    saveAddSecondInfo() {
      if (this.disabledAddLoading) {
        return;
      }
      this.disabledAddLoading = true;
      //保存第二级，通用名
      if (
        this.drugsAdd.drugClassy != "" &&
        this.drugsAdd.drugClassy != null &&
        this.drugsAdd.drugGenericCode != "" &&
        this.drugsAdd.drugGenericCode != null
      ) {
        var self = this;
        //清楚错误信息
        self.checkedDrugClassy = false;
        self.checkedGeneric = false;
        Vue.ajax.send({
          name: "drugs.add",
          data: {
            //第二级的时候drug码就是通用名
            drug: self.drugsAdd.drugGenericCode,
            //父级药品编码
            superiorDrug: self.drugsAdd.drugClassy,
            dataLevel: "2",
            //第二级的时候药品组合码就是药品分类+通用名
            drugJoinCode:
              self.drugsAdd.drugClassy + self.drugsAdd.drugGenericCode,
            remark: self.drugsAdd.remark,
            createUser: Vue.getUser().userName
          },
          success: function(data) {
            self.disabledAddLoading = false;
            if (!!data && data.code == "0") {
              self.addTradeModel = false;
              self.$refs["addTradeForm"].resetFields();
              self.$router.push("/standard/mapping/drugs/list");
              self.$Message.success("新增药品通用名提交成功！");
            } else {
              self.$Modal.error({
                title: "",
                content: data.message
              });
            }
          }
        });
      } else {
        this.disabledAddLoading = false;
        if (
          this.drugsAdd.drugClassy != "" &&
          this.drugsAdd.drugClassy != null
        ) {
          this.checkedDrugClassy = false;
        } else {
          this.checkedDrugClassy = true;
        }
        if (
          this.drugsAdd.drugGenericCode != "" &&
          this.drugsAdd.drugGenericCode != null
        ) {
          this.checkedGeneric = false;
        } else {
          this.checkedGeneric = true;
        }
      }
    },
    saveAddThreeInfo() {
      if (this.disabledAddLoading) {
        return;
      }
      this.disabledAddLoading = true;
      //获取剂型编码
      this.drugsAdd.form =
        this.drugsAdd.forms.length == 2 ? this.drugsAdd.forms[1] : null;
      //保存第三级，剂型
      if (
        this.drugsAdd.drugClassy != "" &&
        this.drugsAdd.drugClassy != null &&
        this.drugsAdd.drugGenericCode != "" &&
        this.drugsAdd.drugGenericCode != null &&
        this.drugsAdd.form != "" &&
        this.drugsAdd.form != null &&
        this.drugsAdd.saltAcidCode != "" &&
        this.drugsAdd.saltAcidCode != null
        //  &&
        // this.drugsAdd.drugProductCode != "" &&
        // this.drugsAdd.drugProductCode != null
      ) {
        var self = this;
        //隐藏为空的提示消息
        self.checkedSuperDrug = false;
        self.checkedDrugClassy = false;
        self.checkedGeneric = false;
        self.checkedForm = false;
        self.checkedSaltAcid = false;
        self.checkedDrugProduct = false;

        Vue.ajax.send({
          name: "drugs.add",
          data: {
            //第三级的时候drug码就是通用名
            drug: self.drugsAdd.form,
            //父级编码，就是药品分类+药品通用名
            superiorDrug:
              self.drugsAdd.drugClassy + self.drugsAdd.drugGenericCode,
            dataLevel: "3",
            //第三级的时候药品组合码就是药品分类+通用名+剂型
            drugJoinCode:
              self.drugsAdd.drugClassy +
              self.drugsAdd.drugGenericCode +
              self.drugsAdd.form,
            //盐酸根
            saltAcidCode: self.drugsAdd.saltAcidCode,
            //产品名称
            // drugProductCode: self.drugsAdd.drugProductCode,
            remark: self.drugsAdd.remark,
            createUser: Vue.getUser().userName
          },
          success: function(data) {
            self.disabledAddLoading = false;
            if (!!data && data.code == "0") {
              self.addFormModel = false;
              self.$refs["addTradeForm"].resetFields();
              self.$router.push("/standard/mapping/drugs/list");
              self.$Message.success("新增药品剂型提交成功！");
            } else {
              self.$Modal.error({
                title: "",
                content: data.message
              });
            }
          }
        });
      } else {
        this.disabledAddLoading = false;
        if (
          this.drugsAdd.drugClassy != "" &&
          this.drugsAdd.drugClassy != null
        ) {
          this.checkedDrugClassy = false;
        } else {
          this.checkedDrugClassy = true;
        }
        //通用名提示信息
        if (
          this.drugsAdd.drugGenericCode != "" &&
          this.drugsAdd.drugGenericCode != null
        ) {
          this.checkedGeneric = false;
        } else {
          this.checkedGeneric = true;
        }
        //剂型
        if (this.drugsAdd.form != "" && this.drugsAdd.form != null) {
          this.checkedForm = false;
        } else {
          this.checkedForm = true;
        }
        //盐酸根
        if (
          this.drugsAdd.saltAcidCode != "" &&
          this.drugsAdd.saltAcidCode != null
        ) {
          this.checkedSaltAcid = false;
        } else {
          this.checkedSaltAcid = true;
        }
        //产品名称
        // if (
        //   this.drugsAdd.drugProductCode != "" &&
        //   this.drugsAdd.drugProductCode != null
        // ) {
        //   this.checkedDrugProduct = false;
        // } else {
        //   this.checkedDrugProduct = true;
        // }
      }
    },
    saveAddFourInfo() {
      if (this.disabledAddLoading) {
        return;
      }
      this.disabledAddLoading = true;
      //保存第四级，药品规格
      if (
        this.drugsAdd.drugClassy != "" &&
        this.drugsAdd.drugClassy != null &&
        this.drugsAdd.drugGenericCode != "" &&
        this.drugsAdd.drugGenericCode != null &&
        this.drugsAdd.form != "" &&
        this.drugsAdd.form != null &&
        this.drugsAdd.saltAcidCode != "" &&
        this.drugsAdd.saltAcidCode != null &&
        // this.drugsAdd.drugProductCode != "" &&
        // this.drugsAdd.drugProductCode != null &&
        this.drugsAdd.drugSpecCode != "" &&
        this.drugsAdd.drugSpecCode != null
      ) {
        var self = this;
        //隐藏为空的提示消息
        self.checkedSuperDrug = false;
        self.checkedDrugClassy = false;
        self.checkedGeneric = false;
        self.checkedSpec = false;
        self.checkedForm = false;
        self.checkedDrugProduct = false;

        Vue.ajax.send({
          name: "drugs.add",
          data: {
            //第四级的时候drug码就是药品规格
            drug: self.drugsAdd.drugSpecCode,
            //父级编码，就是药品分类+药品通用名+剂型
            superiorDrug:
              self.drugsAdd.drugClassy +
              self.drugsAdd.drugGenericCode +
              self.drugsAdd.form,
            dataLevel: "4",
            //第四级的时候药品组合码就是药品分类+通用名+剂型+药品规格
            drugJoinCode:
              self.drugsAdd.drugClassy +
              self.drugsAdd.drugGenericCode +
              self.drugsAdd.form +
              self.drugsAdd.drugSpecCode,
            //盐酸根
            saltAcidCode: self.drugsAdd.saltAcidCode,
            // drugProductCode: self.drugsAdd.drugProductCode,
            remark: self.drugsAdd.remark,
            createUser: Vue.getUser().userName
          },
          success: function(data) {
            self.disabledAddLoading = false;
            if (!!data && data.code == "0") {
              self.addSpecModel = false;
              self.$refs["addTradeForm"].resetFields();
              self.$router.push("/standard/mapping/drugs/list");
              self.$Message.success("新增药品规格提交成功！");
            } else {
              self.$Modal.error({
                title: "",
                content: data.message
              });
            }
          }
        });
      } else {
        this.disabledAddLoading = false;
        if (
          this.drugsAdd.drugClassy != "" &&
          this.drugsAdd.drugClassy != null
        ) {
          this.checkedDrugClassy = false;
        } else {
          this.checkedDrugClassy = true;
        }
        //通用名提示信息
        if (
          this.drugsAdd.drugGenericCode != "" &&
          this.drugsAdd.drugGenericCode != null
        ) {
          this.checkedGeneric = false;
        } else {
          this.checkedGeneric = true;
        }
        //剂型
        if (this.drugsAdd.form != "" && this.drugsAdd.form != null) {
          this.checkedForm = false;
        } else {
          this.checkedForm = true;
        }
        //盐酸根
        if (
          this.drugsAdd.saltAcidCode != "" &&
          this.drugsAdd.saltAcidCode != null
        ) {
          this.checkedSaltAcid = false;
        } else {
          this.checkedSaltAcid = true;
        }
        //产品名称
        // if (
        //   this.drugsAdd.drugProductCode != "" &&
        //   this.drugsAdd.drugProductCode != null
        // ) {
        //   this.checkedDrugProduct = false;
        // } else {
        //   this.checkedDrugProduct = true;
        // }
        //规格
        if (
          this.drugsAdd.drugSpecCode != "" &&
          this.drugsAdd.drugSpecCode != null
        ) {
          this.checkedSpec = false;
        } else {
          this.checkedSpec = true;
        }
      }
    },
    saveAddFiveInfo() {
      if (this.disabledAddLoading) {
        return;
      }
      this.disabledAddLoading = true;
      //保存第五级，药品包装规格
      if (
        this.drugsAdd.drugClassy != "" &&
        this.drugsAdd.drugClassy != null &&
        this.drugsAdd.drugGenericCode != "" &&
        this.drugsAdd.drugGenericCode != null &&
        this.drugsAdd.form != "" &&
        this.drugsAdd.form != null &&
        this.drugsAdd.saltAcidCode != "" &&
        this.drugsAdd.saltAcidCode != null &&
        // this.drugsAdd.drugProductCode != "" &&
        // this.drugsAdd.drugProductCode != null &&
        this.drugsAdd.drugSpecCode != "" &&
        this.drugsAdd.drugSpecCode != null &&
        this.drugsAdd.packageSpec != "" &&
        this.drugsAdd.packageSpec != null
      ) {
        var self = this;
        //隐藏为空的提示消息
        self.checkedSuperDrug = false;
        self.checkedDrugClassy = false;
        self.checkedGeneric = false;
        self.checkedSpec = false;
        self.checkedPackageSpec = false;

        Vue.ajax.send({
          name: "drugs.add",
          data: {
            //第五级的时候drug码就是药品包装规格
            drug: self.drugsAdd.packageSpec,
            //父级编码，就是药品分类+药品通用名+剂型+药品规格
            superiorDrug:
              self.drugsAdd.drugClassy +
              self.drugsAdd.drugGenericCode +
              self.drugsAdd.form +
              self.drugsAdd.drugSpecCode,
            dataLevel: "5",
            //第五级的时候药品组合码就是药品分类+通用名+剂型+药品规格+包装规格
            drugJoinCode:
              self.drugsAdd.drugClassy +
              self.drugsAdd.drugGenericCode +
              self.drugsAdd.form +
              self.drugsAdd.drugSpecCode +
              self.drugsAdd.packageSpec,
            //盐酸根
            saltAcidCode: self.drugsAdd.saltAcidCode,
            // drugProductCode: self.drugsAdd.drugProductCode,
            remark: self.drugsAdd.remark,
            createUser: Vue.getUser().userName
          },
          success: function(data) {
            self.disabledAddLoading = false;
            if (!!data && data.code == "0") {
              self.addTradeModel = false;
              self.$refs["addTradeForm"].resetFields();
              self.$router.push("/standard/mapping/drugs/list");
              self.$Message.success("新增药品包装规格提交成功！");
            } else {
              self.$Modal.error({
                title: "",
                content: data.message
              });
            }
          }
        });
      } else {
        this.disabledAddLoading = false;
        if (
          this.drugsAdd.drugClassy != "" &&
          this.drugsAdd.drugClassy != null
        ) {
          this.checkedDrugClassy = false;
        } else {
          this.checkedDrugClassy = true;
        }
        //通用名提示信息
        if (
          this.drugsAdd.drugGenericCode != "" &&
          this.drugsAdd.drugGenericCode != null
        ) {
          this.checkedGeneric = false;
        } else {
          this.checkedGeneric = true;
        }
        //剂型
        if (this.drugsAdd.form != "" && this.drugsAdd.form != null) {
          this.checkedForm = false;
        } else {
          this.checkedForm = true;
        }
        //盐酸根
        if (
          this.drugsAdd.saltAcidCode != "" &&
          this.drugsAdd.saltAcidCode != null
        ) {
          this.checkedSaltAcid = false;
        } else {
          this.checkedSaltAcid = true;
        }
        //产品名称
        // if (
        //   this.drugsAdd.drugProductCode != "" &&
        //   this.drugsAdd.drugProductCode != null
        // ) {
        //   this.checkedDrugProduct = false;
        // } else {
        //   this.checkedDrugProduct = true;
        // }
        //规格
        if (
          this.drugsAdd.drugSpecCode != "" &&
          this.drugsAdd.drugSpecCode != null
        ) {
          this.checkedSpec = false;
        } else {
          this.checkedSpec = true;
        }
        //包装规格
        if (
          this.drugsAdd.packageSpec != "" &&
          this.drugsAdd.packageSpec != null
        ) {
          this.checkedPackageSpec = false;
        } else {
          this.checkedPackageSpec = true;
        }
      }
    },
    isOrNotDrugInfo() {
      //是否的相关判断
      if (this.drugsAdd.isImport == 0) {
        this.checkedDrugImport = false;
        if (
          this.drugValidityForm.sdcc18 != "" &&
          this.drugValidityForm.sdcc18 != null
        ) {
          this.checkedDrugValidity = false;
        } else {
          this.checkedDrugValidity = true;
        }
      } else {
        this.checkedDrugValidity = false;
        if (
          this.drugImportForm.sdcc18 != "" &&
          this.drugImportForm.sdcc18 != null
        ) {
          this.checkedDrugImport = false;
        } else {
          this.checkedDrugImport = true;
        }
      }
      //是否Otc药品
      if (this.drugsAdd.isOtc == "0") {
        this.checkedOtcStartMonth = false;
        this.checkedOtcStopMonth = false;
      } else {
        if (
          this.drugsAdd.startOtcYearmonth == "" ||
          this.drugsAdd.startOtcYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedOtcStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedOtcStopMonth = false;
        } else if (
          this.drugsAdd.stopOtcYearmonth == "" ||
          this.drugsAdd.stopOtcYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedOtcStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedOtcStartMonth = false;
        } else {
          this.checkedOtcStopMonth = false;
          this.checkedOtcStartMonth = false;
        }
      }
      //是否妊娠等级用药
      if (this.drugsAdd.isLactatingCaution == "0") {
        this.checkedLactatingStartMonth = false;
        this.checkedLactatingStopMonth = false;
      } else {
        if (
          this.drugsAdd.startLactatingYearmonth == "" ||
          this.drugsAdd.startLactatingYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedLactatingStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedLactatingStopMonth = false;
        } else if (
          this.drugsAdd.stopLactatingYearmonth == "" ||
          this.drugsAdd.stopLactatingYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedLactatingStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedLactatingStartMonth = false;
        } else {
          this.checkedLactatingStartMonth = false;
          this.checkedLactatingStopMonth = false;
        }
      }
      //是否医保用药
      if (this.drugsAdd.isRural == "0") {
        this.checkedRuralStartMonth = false;
        this.checkedRuralStopMonth = false;
      } else {
        if (
          this.drugsAdd.startRuralYearmonth == "" ||
          this.drugsAdd.startRuralYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedRuralStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedRuralStopMonth = false;
        } else if (
          this.drugsAdd.stopRuralYearmonth == "" ||
          this.drugsAdd.stopRuralYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedRuralStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedRuralStartMonth = false;
        } else {
          this.checkedRuralStartMonth = false;
          this.checkedRuralStopMonth = false;
        }
      }
      //是否麻醉药物
      if (this.drugsAdd.isNarcotize == "0") {
        this.checkedNarcotizeStartMonth = false;
        this.checkedNarcotizeStopMonth = false;
      } else {
        if (
          this.drugsAdd.startNarcotizeYearmonth == "" ||
          this.drugsAdd.startNarcotizeYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedNarcotizeStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedNarcotizeStopMonth = false;
        } else if (
          this.drugsAdd.stopNarcotizeYearmonth == "" ||
          this.drugsAdd.stopNarcotizeYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedNarcotizeStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedNarcotizeStartMonth = false;
        } else {
          this.checkedNarcotizeStartMonth = false;
          this.checkedNarcotizeStopMonth = false;
        }
      }

      //是否毒性药物
      if (this.drugsAdd.isVirulence == "0") {
        this.checkedVirulenceStartMonth = false;
        this.checkedVirulenceStopMonth = false;
      } else {
        if (
          this.drugsAdd.startVirulenceYearmonth == "" ||
          this.drugsAdd.startVirulenceYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedVirulenceStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedVirulenceStopMonth = false;
        } else if (
          this.drugsAdd.stopVirulenceYearmonth == "" ||
          this.drugsAdd.stopVirulenceYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedVirulenceStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedVirulenceStartMonth = false;
        } else {
          this.checkedVirulenceStartMonth = false;
          this.checkedVirulenceStopMonth = false;
        }
      }

      //是否放射性药物
      if (this.drugsAdd.isRadioactivity == "0") {
        this.checkedRadioStartMonth = false;
        this.checkedRadioStopMonth = false;
      } else {
        if (
          this.drugsAdd.startRadioactivityYearmonth == "" ||
          this.drugsAdd.startRadioactivityYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedRadioStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedRadioStopMonth = false;
        } else if (
          this.drugsAdd.stopVirulenceYearmonth == "" ||
          this.drugsAdd.stopVirulenceYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedRadioStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedRadioStartMonth = false;
        } else {
          this.checkedRadioStartMonth = false;
          this.checkedRadioStopMonth = false;
        }
      }
      //是否基本药物
      if (this.drugsAdd.isEssential == "0") {
        this.checkedEssentialStartMonth = false;
        this.checkedEssentialStopMonth = false;
      } else {
        if (
          this.drugsAdd.startEssentialYearmonth == "" ||
          this.drugsAdd.startEssentialYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedEssentialStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedEssentialStopMonth = false;
        } else if (
          this.drugsAdd.stopEssentialYearmonth == "" ||
          this.drugsAdd.stopEssentialYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedEssentialStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedEssentialStartMonth = false;
        } else {
          this.checkedEssentialStartMonth = false;
          this.checkedEssentialStopMonth = false;
        }
      }

      //是否国家集处方药物
      if (this.drugsAdd.isNationalFormulary == "0") {
        this.checkedNationalStartMonth = false;
        this.checkedNationalStopMonth = false;
      } else {
        if (
          this.drugsAdd.startNationalFormularyYearmonth == "" ||
          this.drugsAdd.startNationalFormularyYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedNationalStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedNationalStopMonth = false;
        } else if (
          this.drugsAdd.stopNationalFormularyYearmonth == "" ||
          this.drugsAdd.stopNationalFormularyYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedNationalStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedNationalStartMonth = false;
        } else {
          this.checkedNationalStartMonth = false;
          this.checkedNationalStopMonth = false;
        }
      }

      //是否特殊药物
      if (this.drugsAdd.isSpecial == "0") {
        this.checkedSpecialStartMonth = false;
        this.checkedSpecialStopMonth = false;
      } else {
        if (
          this.drugsAdd.startSpecialYearmonth == "" ||
          this.drugsAdd.startSpecialYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedSpecialStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedSpecialStopMonth = false;
        } else if (
          this.drugsAdd.stopSpecialYearmonth == "" ||
          this.drugsAdd.stopSpecialYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedSpecialStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedSpecialStartMonth = false;
        } else {
          this.checkedSpecialStartMonth = false;
          this.checkedSpecialStopMonth = false;
        }
      }

      //是否肾病患者慎用药
      if (this.drugsAdd.isRenalDiseaseCare == "0") {
        this.checkedRenalStartMonth = false;
        this.checkedRenalStopMonth = false;
      } else {
        if (
          this.drugsAdd.startRenalDiseaseCareYearmonth == "" ||
          this.drugsAdd.startRenalDiseaseCareYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedRenalStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedRenalStopMonth = false;
        } else if (
          this.drugsAdd.stopRenalDiseaseCareYearmonth == "" ||
          this.drugsAdd.stopRenalDiseaseCareYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedRenalStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedRenalStartMonth = false;
        } else {
          this.checkedRenalStartMonth = false;
          this.checkedRenalStopMonth = false;
        }
      }

      //是否社区用药
      if (this.drugsAdd.isCommunity == "0") {
        this.checkedCommunityStartMonth = false;
        this.checkedCommunityStopMonth = false;
      } else {
        if (
          this.drugsAdd.startCommunityYearmonth == "" ||
          this.drugsAdd.startCommunityYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedCommunityStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedCommunityStopMonth = false;
        } else if (
          this.drugsAdd.stopCommunityYearmonth == "" ||
          this.drugsAdd.stopCommunityYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedCommunityStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedCommunityStartMonth = false;
        } else {
          this.checkedCommunityStartMonth = false;
          this.checkedCommunityStopMonth = false;
        }
      }

      //是否肝功能不全慎用药
      if (this.drugsAdd.isDysfunctionCare == "0") {
        this.checkedDysfuncStartMonth = false;
        this.checkedDysfuncStopMonth = false;
      } else {
        if (
          this.drugsAdd.startDysfunctionCareYearmonth == "" ||
          this.drugsAdd.startDysfunctionCareYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedDysfuncStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedDysfuncStopMonth = false;
        } else if (
          this.drugsAdd.stopDysfunctionCareYearmonth == "" ||
          this.drugsAdd.stopDysfunctionCareYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedDysfuncStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedDysfuncStartMonth = false;
        } else {
          this.checkedDysfuncStartMonth = false;
          this.checkedDysfuncStopMonth = false;
        }
      }

      //是否精神药品
      if (this.drugsAdd.isSpiritDrug == "0") {
        this.checkedSpiritStartMonth = false;
        this.checkedSpiritStopMonth = false;
      } else {
        if (
          this.drugsAdd.startSpiritDrugYearmonth == "" ||
          this.drugsAdd.startSpiritDrugYearmonth == null
        ) {
          //如果开始日期为空，则显示提示信息
          this.checkedSpiritStartMonth = true;
          //隐藏结束日期的提示信息
          this.checkedSpiritStopMonth = false;
        } else if (
          this.drugsAdd.stopSpiritDrugYearmonth == "" ||
          this.drugsAdd.stopSpiritDrugYearmonth == null
        ) {
          //如果结束日期为空，则显示提示信息
          this.checkedSpiritStopMonth = true;
          //隐藏开始日期的提示信息
          this.checkedSpiritStartMonth = false;
        } else {
          this.checkedSpiritStartMonth = false;
          this.checkedSpiritStopMonth = false;
        }
      }
    },
    saveAddInfo() {
      if (this.disabledAddLoading) {
        return;
      }

      this.$refs["drugsForm"].validate(valid => {
        // if ((valid && this.drugsAdd.isImport == 0 && this.drugValidityList.length > 0)
        // || (valid && this.drugsAdd.isImport == 1 && this.drugImportList.length > 0)) {
        if (
          (valid && this.drugsAdd.drugValidityForm != null) ||
          (valid && this.drugsAdd.drugImportForm != null)
        ) {
          var self = this;
          self.disabledAddLoading = true;
          self.checkedDrugValidity = false;
          self.checkedDrugImport = false;
          if(self.drugsAdd.isImport==1){
            self.drugsAdd.drugImportForm.invalidDate = self.drugsAdd.invalidDate;
          }
          else if(self.drugsAdd.isImport==0){
            self.drugsAdd.drugValidityForm.invalidDate =self.drugsAdd.invalidDate;
          }
  
          Vue.ajax.send({
            name: "drugs.add",
            data: {
              //用于区分是进口药品(1)还是药品有效期(0)
              isImport: self.drugsAdd.isImport,
              dataLevel: "6",
              superiorDrug:
                self.drugsAdd.drugClassy +
                self.drugsAdd.drugGenericCode +
                self.drugsAdd.form +
                self.drugsAdd.drugSpecCode +
                self.drugsAdd.packageSpec,
              // //这个到时候会调接口自动生成DM编码
              // drug: self.drugsAdd.drug,
              // //第五级的时候药品组合码就是药品分类+通用名+剂型+药品规格+包装规格+DM码
              drugJoinCode:
                self.drugsAdd.drugClassy +
                self.drugsAdd.drugGenericCode +
                self.drugsAdd.form +
                self.drugsAdd.drugSpecCode +
                self.drugsAdd.packageSpec,
              drugTradeCode: self.drugsAdd.drugTradeCode,
              //药品有效期实体
              drugValidityForm: self.drugsAdd.drugValidityForm,
              //进口药品实体
              drugImportForm: self.drugsAdd.drugImportForm,
              //盐酸根
              saltAcidCode: self.drugsAdd.saltAcidCode,
              drugProductCode: self.drugsAdd.drugProductCode,
              company: self.drugsAdd.company,
              pathDrug: self.drugsAdd.pathDrug,
              unitPrice: self.drugsAdd.unitPrice,
              dailyDdd: self.drugsAdd.dailyDdd,
              pictureMessage: self.drugsAdd.pictureMessage,
              textAndPictures: self.drugsAdd.textAndPictures,
              statusId: 1,
              remark: self.drugsAdd.remark,
              createUser: Vue.getUser().userName
            },
            success: function(data) {
              self.disabledAddLoading = false;
              if (!!data && data.code == "0") {
                self.$router.push("/standard/mapping/drugs/list");
                self.$Message.success("新增药品信息提交成功！");
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        } else {
          if (this.drugsAdd.isImport == 0) {
            this.checkedDrugImport = false;
            if (this.drugsAdd.drugValidityForm && 
              this.drugsAdd.drugValidityForm.sdcc18 != "" &&
              this.drugsAdd.drugValidityForm.sdcc18 != null
            ) {
              this.checkedDrugValidity = false;
            } else {
              this.checkedDrugValidity = true;
            }
          } else {
            this.checkedDrugValidity = false;
            if (this.drugsAdd.drugImportForm && 
              this.drugsAdd.drugImportForm.sdcc18 != "" &&
              this.drugsAdd.drugImportForm.sdcc18 != null
            ) {
              this.checkedDrugImport = false;
            } else {
              this.checkedDrugImport = true;
            }
          }
          this.disabledAddLoading = false;
        }
      });
    },
    cancel() {
      this.$router.push("/standard/mapping/drugs/list");
    }
  }
};
</script>



<style scoped>
.intro {
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