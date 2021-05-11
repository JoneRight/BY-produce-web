<template>
    <div id="hosp_id" class="bg-white m20">
         <div class="file-export text-right pl20 pr20 pt20">
                    <a @click="exportTabel" v-show="Id!=''&&!canEdit" id="exportTabel" class="ivu-btn ivu-btn-info">文件导出</a>
                </div>
        <h2 class="common-title">医院详情</h2>
        <Tabs ref="abcdef" :class="tabclass" class="m20 pdtop" style="z-index:99;" @on-click="changeTab" :value="curIndex">
            <TabPane label="医院基本信息" :disabled="Id=='' || (canEdit && curIndex!=0)">
                <table class="common-table">
                <tbody>
                    <tr>
                        <td colspan="7"><h3>A.医院基本信息</h3></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["hospName"]}}<span class="text-red">*</span></td>
                        <td colspan="6" :contenteditable="canEdit" v-html="basic.hospName" @blur="editing='hospName';basicNew.hospName=$event.target.innerHTML" ></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["dailyOutpartient"]}}<span class="text-red">*</span></td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.dailyOutpartient" @blur="editing='dailyOutpartient';basicNew.dailyOutpartient=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["dailyEmergency"]}}<span class="text-red">*</span></td>
                        <td :contenteditable="canEdit" v-html="basic.dailyEmergency" @blur="editing='dailyEmergency';basicNew.dailyEmergency=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["yearHospTrips"]}}<span class="text-red">*</span></td>
                        <td :contenteditable="canEdit" v-html="basic.yearHospTrips" @blur="editing='yearHospTrips';basicNew.yearHospTrips=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["hospBed"]}}<span class="text-red">*</span></td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.hospBed" @blur="editing='hospBed';basicNew.hospBed=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["hospBedOpen"]}}<span class="text-red">*</span></td>
                        <td :contenteditable="canEdit" v-html="basic.hospBedOpen" @blur="editing='hospBedOpen';basicNew.hospBedOpen=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["bedTurnoverRate"]}}<span class="text-red">*</span></td>
                        <td :contenteditable="canEdit" v-html="basic.bedTurnoverRate" @blur="editing='bedTurnoverRate';basicNew.bedTurnoverRate=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["hospTelephone"]}}<span class="text-red">*</span></td>
                        <td colspan="3" :contenteditable="canEdit" v-html="basic.hospTelephone" @blur="editing='hospTelephone';basicNew.hospTelephone=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["hospFax"]}}<span class="text-red">*</span></td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.hospFax" @blur="editing='hospFax';basicNew.hospFax=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["hospEmail"]}}<span class="text-red">*</span></td>
                        <td colspan="3" :contenteditable="canEdit" v-html="basic.hospEmail" @blur="editing='hospEmail';basicNew.hospEmail=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["hospWebsite"]}}<span class="text-red">*</span></td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.hospWebsite" @blur="editing='hospWebsite';basicNew.hospWebsite=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["address"]}}<span class="text-red">*</span></td>
                        <td colspan="4" :contenteditable="canEdit" v-html="basic.address" @blur="editing='address';basicNew.address=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["postcode"]}}<span class="text-red">*</span></td>
                        <td :contenteditable="canEdit" v-html="basic.postcode" @blur="editing='postcode';basicNew.postcode=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td  rowspan="4">{{infos["basicInfo"]["hospAttached"] || 医院隶属性质}}<span class="text-red">*</span></td>
                        <td><div class="radio-con"><input type="radio" name="attached" value="1" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>中央</td>
                        <td><div class="radio-con"><input type="radio" name="attached" value="2" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>省级</td>
                        <td  rowspan="2">{{infos["basicInfo"]["hospGrade"] || 医院等级}}<span class="text-red">*</span></td>
                        <td><div class="radio-con"><input type="radio" name="grade" value="1" v-model="basic.hospGrade" @change="editing='hospGrade';basicNew.hospGrade=basic.hospGrade" :disabled="!canEdit"><label></label></div>三甲</td>
                        <td><div class="radio-con"><input type="radio" name="grade" value="2" v-model="basic.hospGrade" @change="editing='hospGrade';basicNew.hospGrade=basic.hospGrade" :disabled="!canEdit"><label></label></div>三乙</td>
                        <td><div class="radio-con"><input type="radio" name="grade" value="4" v-model="basic.hospGrade" @change="editing='hospGrade';basicNew.hospGrade=basic.hospGrade" :disabled="!canEdit"><label></label></div>二甲</td>
                    </tr>
                    <tr>
                        <td><div class="radio-con"><input type="radio" name="attached" value="3" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>市级</td>
                        <td><div class="radio-con"><input type="radio" name="attached" value="4" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>县级</td>
                        
                        <td><div class="radio-con"><input type="radio" name="grade" value="5" v-model="basic.hospGrade" @change="editing='hospGrade';basicNew.hospGrade=basic.hospGrade" :disabled="!canEdit"><label></label></div>二乙</td>
                        <td><div class="radio-con"><input type="radio" name="grade" value="0" v-model="basic.hospGrade" @change="editing='hospGrade';basicNew.hospGrade=basic.hospGrade" :disabled="!canEdit"><label></label></div>其他：</td>
                        <td :contenteditable="canEdit" v-html="basic.hospGradeOther" @blur="editing='hospGradeOther';basicNew.hospGradeOther=$event.target.innerHTML" ></td>
                    </tr>
                    <tr>
                        <td><div class="radio-con"><input type="radio" name="attached" value="7" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>区级</td>
                        <td><div class="radio-con"><input type="radio" name="attached" value="5" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>部队</td>
                        <td rowspan="2">医院层级<span class="text-red">*</span></td>
                        <td rowspan="2"><div class="radio-con"><input type="radio" name="level" value="3" v-model="basic.hospLevel" @change="editing='hospLevel';basicNew.hospLevel=basic.hospLevel" :disabled="!canEdit"><label></label></div>三级</td>
                        <td rowspan="2"><div class="radio-con"><input type="radio" name="level" value="2" v-model="basic.hospLevel" @change="editing='hospLevel';basicNew.hospLevel=basic.hospLevel" :disabled="!canEdit"><label></label></div>二级</td>
                        <td rowspan="2"><div class="radio-con"><input type="radio" name="level" value="0" v-model="basic.hospLevel" @change="editing='hospLevel';basicNew.hospLevel=basic.hospLevel" :disabled="!canEdit"><label></label></div>其他：</td>
                    </tr>
                    <tr>
                        <td><div class="radio-con"><input type="radio" name="attached" value="8" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>行业</td>
                        <td><div class="radio-con"><input type="radio" name="attached" value="0" v-model="basic.hospAttached" @change="editing='hospAttached';basicNew.hospAttached=basic.hospAttached" :disabled="!canEdit"><label></label></div>其他</td>
                    </tr>
                    <tr>
                        <td  rowspan="3">{{infos["basicInfo"]["hospType"] || 医院类别}}<span class="text-red">*</span></td>
                        <td colspan="2"><div class="radio-con"><input type="radio" name="type" value="2" v-model="basic.hospType" @change="editing='hospType';basicNew.hospType=basic.hospType" :disabled="!canEdit"><label></label></div>综合医院</td>
                        <td>{{infos["basicInfo"]["emphasisSection"] || 重点科室}}</td>
                        <td colspan="3" :contenteditable="canEdit" v-html="basic.emphasisSection" @blur="editing='emphasisSection';basicNew.emphasisSection=$event.target.innerHTML" ></td>
                    </tr>
                    <tr>
                        <td colspan="2"><div class="radio-con"><input type="radio" name="type" value="1" v-model="basic.hospType" @change="editing='hospType';basicNew.hospType=basic.hospType" :disabled="!canEdit"><label></label></div>专科医院</td>
                        <td>{{infos["basicInfo"]["specialistSectionType"] || 专科类别}}</td>
                        <td colspan="3" :contenteditable="canEdit" v-html="basic.specialistSectionType" @blur="editing='specialistSectionType';basicNew.specialistSectionType=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td colspan="2"><div class="radio-con"><input type="radio" name="type" value="0" v-model="basic.hospType" @change="editing='hospType';basicNew.hospType=basic.hospType" :disabled="!canEdit"><label></label></div>其他</td>
                        <td>{{infos["basicInfo"]["emphasisSection"] || 重点科室}}</td>
                        <td colspan="3" :contenteditable="canEdit" v-html="basic.emphasisSection" @blur="editing='emphasisSection';basicNew.emphasisSection=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td  rowspan="5">{{infos["basicInfo"]["physicianTotalCount"] || 医师总人数}}</td>
                        <td colspan="3" rowspan="5" :contenteditable="canEdit" v-html="basic.physicianTotalCount" @blur="editing='physicianTotalCount';basicNew.physicianTotalCount=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["physicianLevel5Count"] || 主任医师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.physicianLevel5Count" @blur="editing='physicianLevel5Count';basicNew.physicianLevel5Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["physicianLevel4Count"] || 副主任医师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.physicianLevel4Count" @blur="editing='physicianLevel4Count';basicNew.physicianLevel4Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["physicianLevel3Count"] || 主治医师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.physicianLevel3Count" @blur="editing='physicianLevel3Count';basicNew.physicianLevel3Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["physicianLevel2Count"] || 住院医师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.physicianLevel2Count" @blur="editing='physicianLevel2Count';basicNew.physicianLevel2Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["physicianLevel1Count"] || 医士人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.physicianLevel1Count" @blur="editing='physicianLevel1Count';basicNew.physicianLevel1Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td  rowspan="5">{{infos["basicInfo"]["pharmacistTotalCount"] || 药师总人数}}</td>
                        <td colspan="3" rowspan="5" :contenteditable="canEdit" v-html="basic.pharmacistTotalCount" @blur="editing='pharmacistTotalCount';basicNew.pharmacistTotalCount=$event.target.innerHTML"></td>
                        <td>{{infos["basicInfo"]["pharmacistLevel5Count"] || 主任药师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.pharmacistLevel5Count" @blur="editing='pharmacistLevel5Count';basicNew.pharmacistLevel5Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["pharmacistLevel4Count"] || 副主任药师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.pharmacistLevel4Count" @blur="editing='pharmacistLevel4Count';basicNew.pharmacistLevel4Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["pharmacistLevel3Count"] || 主管药师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.pharmacistLevel3Count" @blur="editing='pharmacistLevel3Count';basicNew.pharmacistLevel3Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["pharmacistLevel2Count"] || 药师人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.pharmacistLevel2Count" @blur="editing='pharmacistLevel2Count';basicNew.pharmacistLevel2Count=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td>{{infos["basicInfo"]["pharmacistLevel1Count"] || 药士人数}}</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="basic.pharmacistLevel1Count" @blur="editing='pharmacistLevel1Count';basicNew.pharmacistLevel1Count=$event.target.innerHTML"></td>
                    </tr>
                </tbody>
            </table>
                <div class="table-btn">                    
                    <Button type="primary" v-show="!canEdit" @click="canEdit=!canEdit">信息编辑</Button>
                    <Button type="primary" v-show="canEdit&&Id!=''" @click="saveInfo">保存</Button>
                    <Button type="default" @click="$router.push('/report/hospital')">返回</Button>
                </div>
            </TabPane>
            <TabPane label="医院负责人信息" :disabled="Id=='' || (canEdit && curIndex!=1)">
                <table class="common-table">
                <tbody>
                    <tr>
                        <td colspan="7"><h3>B.医院负责人信息</h3></td>
                    </tr>
                    <template v-for="item,index in chargeList">
                        <tr>
                            <td rowspan="4" width='200'>{{item}}</td>
                            <td width='150'>姓名<span v-if="index==0" class="text-red">*</span></td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].name" @blur="editing='name';Vue.set(chargeNew[index],'name',$event.target.innerHTML)"></td>
                            <td width='150'>办公电话</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].officPhone" @blur="editing='officPhone';Vue.set(chargeNew[index],'officPhone',$event.target.innerHTML)"></td>
                        </tr>
                        <tr>
                            <td>性别</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].sex" @blur="editing='sex';Vue.set(chargeNew[index],'sex',$event.target.innerHTML)"></td>
                            <td>手机</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].mobile" @blur="editing='mobile';Vue.set(chargeNew[index],'mobile',$event.target.innerHTML)"></td>
                        </tr>
                        <tr>
                            <td>专业</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].specialty" @blur="editing='specialty';Vue.set(chargeNew[index],'specialty',$event.target.innerHTML)"></td>
                            <td>传真</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].fax" @blur="editing='fax';Vue.set(chargeNew[index],'fax',$event.target.innerHTML)"></td>
                        </tr>
                        <tr>
                            <td>职称</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].title" @blur="editing='title';Vue.set(chargeNew[index],'title',$event.target.innerHTML)"></td>
                            <td>邮箱</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="charge[index].email" @blur="editing='email';Vue.set(chargeNew[index],'email',$event.target.innerHTML)"></td>
                        </tr>
                    </template>                    
                </tbody>
                </table>
                <div class="table-btn">
                    <Button type="primary" v-show="!canEdit" @click="beginEdit">信息编辑</Button>
                    <Button type="primary" v-show="canEdit&&Id!=''" @click="saveInfo">保存</Button>
                    <Button type="default" @click="$router.push('/report/hospital')">返回</Button>
                </div>
            </TabPane>
            <TabPane label="上报数据负责人信息" :disabled="Id=='' || (canEdit && curIndex!=2)">
                <table class="common-table">
                <tbody>
                    <tr>
                        <td colspan="7"><h3>C.上报数据负责人信息</h3></td>
                    </tr>
                    <template v-for="item,index in uploadList">
                        <tr>
                            <td rowspan="5" width='200'>{{item}}</td>
                            <td width='150'>部门名称<span v-if="index==uploadList.length-1" class="text-red">*</span></td>
                            <td colspan="5" :contenteditable="canEdit" v-html="upload[index].department" @blur="editing='department';uploadNew[index].department=$event.target.innerHTML"></td>
                        </tr>
                        <tr>
                            <td>姓名<span v-if="index==uploadList.length-1" class="text-red">*</span></td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].name" @blur="editing='name';uploadNew[index].name=$event.target.innerHTML"></td>
                            <td width='150'>办公电话</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].officPhone" @blur="editing='officPhone';uploadNew[index].officPhone=$event.target.innerHTML"></td>
                        </tr>
                        <tr>
                            <td>性别</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].sex" @blur="editing='sex';uploadNew[index].sex=$event.target.innerHTML"></td>
                            <td>手机<span v-if="index==uploadList.length-1" class="text-red">*</span></td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].mobile" @blur="editing='mobile';uploadNew[index].mobile=$event.target.innerHTML"></td>
                        </tr>
                        <tr>
                            <td>专业</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].specialty" @blur="editing='specialty';uploadNew[index].specialty=$event.target.innerHTML"></td>
                            <td>传真</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].fax" @blur="editing='fax';uploadNew[index].fax=$event.target.innerHTML"></td>
                        </tr>
                        <tr>
                            <td>职称</td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].title" @blur="editing='title';uploadNew[index].title=$event.target.innerHTML"></td>
                            <td>邮箱<span v-if="index==uploadList.length-1" class="text-red">*</span></td>
                            <td colspan="2" :contenteditable="canEdit" v-html="upload[index].email" @blur="editing='email';uploadNew[index].email=$event.target.innerHTML"></td>
                        </tr>
                    </template>
                </tbody>
            </table>
                <div class="table-btn">
                    <Button type="primary" v-show="!canEdit" @click="beginEdit">信息编辑</Button>
                    <Button type="primary" v-show="canEdit&&Id!=''" @click="saveInfo">保存</Button>
                    <Button type="default" @click="$router.push('/report/hospital')">返回</Button>
                </div>
            </TabPane>
            <TabPane label="医院信息系统情况" :disabled="Id=='' || (canEdit && curIndex!=3)">
                <table class="common-table">
                <tbody>
                    <tr>
                        <td colspan="7"><h3>D.医院信息系统情况</h3></td>
                    </tr>
                    <tr>
                        <td>医院计算机<br/>操作系统</td>
                        <td colspan="6">
                            <template v-for="(item,index) in hospComputerSystemList">
                                <div class="checkbox-con" >
                                    <input type="checkbox" :value="item" v-model="systemNew.hospComputerSystem" :disabled="!canEdit">
                                    <label></label>
                                </div>
                                <span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="systemNew.hospComputerSystemOther" :disabled="!canEdit || systemNew.hospComputerSystem.indexOf('其他：')<0" :maxlength='30'>
                        </td>
                    </tr>
                    <tr>
                        <td>上网条件</td>
                        <td colspan="5">
                            <template v-for="(item,index) in internetConditionList">
                                  <div class="checkbox-con"><input type="checkbox" :value="item" v-model="systemNew.internetCondition" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="systemNew.internetConditionOther" :disabled="!canEdit || systemNew.internetCondition.indexOf('其他：')<0" :maxlength='30'>
                        </td>
                        <td>宽带大小：<input type="text" style="width:150px;" v-model="systemNew.bandwidthSize" :disabled="!canEdit" :maxlength='30'></td>
                    </tr>
                    <tr>
                        
                    </tr>
                    <tr>
                        <td>上网端口</td>
                        <td colspan="6">
                            <template v-for="(item,index) in internetPortList">
                                   <div class="checkbox-con"><input type="checkbox" :value="item" v-model="systemNew.internetPort" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="systemNew.internetPortOther" :disabled="!canEdit || systemNew.internetPort.indexOf('其他：')<0" :maxlength='30'>
                        </td>
                    </tr>
                    <tr>
                        <td>HIS/HIMS采用系统</td>
                        <td colspan="6">
                            <template v-for="(item,index) in hisSystemList">
                                  <div class="radio-con"><input type="radio" name="hisSystem" :value="item" v-model="systemNew.hisSystem" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="systemNew.hisSystemOther" :disabled="!canEdit || systemNew.hisSystem.indexOf('其他：')<0" :maxlength='30'>
                        </td>
                    </tr>
                    <tr>
                        <td  rowspan="2">使用HIS/HIMS系统</td>
                        <td>病房</td>
                        <td colspan="2">
                            <div class="radio-con"><input type="radio" name="isWardHis" value="0" v-model="systemNew.isWardHis" :disabled="!canEdit"><label></label></div><span class="mr15">是</span>
                            <div class="radio-con"><input type="radio" name="isWardHis" value="1" v-model="systemNew.isWardHis" :disabled="!canEdit"><label></label></div>否
                        </td>
                        <td>电子病案首页</td>
                        <td colspan="2">
                            <div class="radio-con"><input type="radio" name="isMedicalRecord" value="0" v-model="systemNew.isMedicalRecord" :disabled="!canEdit"><label></label></div><span class="mr15">是</span>
                            <div class="radio-con"><input type="radio" name="isMedicalRecord" value="1" v-model="systemNew.isMedicalRecord" :disabled="!canEdit"><label></label></div>否
                        </td>
                    </tr>
                    <tr>
                        <td>门诊</td>
                        <td colspan="2">
                            <div class="radio-con"><input type="radio" name="isOutpatientHis" value="0" v-model="systemNew.isOutpatientHis" :disabled="!canEdit"><label></label></div><span class="mr15">是</span>
                            <div class="radio-con"><input type="radio" name="isOutpatientHis" value="1" v-model="systemNew.isOutpatientHis" :disabled="!canEdit"><label></label></div>否
                        </td>
                        <td>门诊工作站</td>
                        <td colspan="2">
                            <div class="radio-con"><input type="radio" name="isOutPatient" value="0" v-model="systemNew.isOutPatient" :disabled="!canEdit"><label></label></div><span class="mr15">是</span>
                            <div class="radio-con"><input type="radio" name="isOutPatient" value="1" v-model="systemNew.isOutPatient" :disabled="!canEdit"><label></label></div>否
                        </td>
                    </tr>
                    <tr>
                        <td>医院HIS系统<br/>使用的数据库</td>
                        <td colspan="6">
                            <template v-for="(item,index) in hisSystemDatabaseList">
                                  <div class="checkbox-con"><input type="checkbox" :value="item" v-model="systemNew.hisSystemDatabase" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="systemNew.hisSystemDatabaseOther" :disabled="!canEdit || systemNew.hisSystemDatabase.indexOf('其他：')<0" :maxlength='30'>
                        </td>
                    </tr>
                </tbody>
            </table>
                <div class="table-btn">
                    <Button type="primary" v-show="!canEdit" @click="canEdit=!canEdit">信息编辑</Button>
                    <Button type="primary" v-show="canEdit&&Id!=''" @click="saveInfo">保存</Button>
                    <Button type="default" @click="$router.push('/report/hospital')">返回</Button>
                </div>
            </TabPane>
            <TabPane label="药品与医疗编码使用情况" :disabled="Id=='' || (canEdit && curIndex!=4)">
                <table class="common-table">
                <tbody>
                    <tr>
                        <td colspan="7"><h3>E.药品与医疗编码使用情况</h3></td>
                    </tr>
                    <tr>
                        <td>药品编码</td>
                        <td colspan="3">
                            <template v-for="(item,index) in drugCodeList">
                                <div class="checkbox-con"><input type="checkbox" :value="item" v-model="codeNew.drugCode" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="codeNew.drugCodeOther" :disabled="!canEdit || codeNew.drugCode.indexOf('其他：')<0"  :maxlength='30'>
                        </td>
                        <td>手术操作编码</td>
                        <td colspan="2">
                            <template v-for="(item,index) in operationCodeList">
                                <div class="checkbox-con"><input type="checkbox" :value="item" v-model="codeNew.operationCode" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="codeNew.operationCodeOther" :disabled="!canEdit || codeNew.operationCode.indexOf('其他：')<0"  :maxlength='30'>
                        </td>
                    </tr>
                    <tr>
                        <td>疾病代码</td>
                        <td colspan="3">
                            <template v-for="(item,index) in diseaseCodeList">
                                <div class="checkbox-con"><input type="checkbox" :value="item" v-model="codeNew.diseaseCode" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="codeNew.diseaseCodeOther" :disabled="!canEdit || codeNew.diseaseCode.indexOf('其他：')<0" :maxlength='30'>
                        </td>
                        <td>病理诊断代码</td>
                        <td colspan="2">
                            <template v-for="(item,index) in pathologyCodeList">
                                <div class="checkbox-con"><input type="checkbox" :value="item" v-model="codeNew.pathologyCode" :disabled="!canEdit"><label></label></div><span class="mr15">{{item}}</span>
                            </template>
                            <input type="text" style="width:150px;" v-model="codeNew.pathologyCodeOther" :disabled="!canEdit || codeNew.pathologyCode.indexOf('其他：')<0" :maxlength='30'>
                        </td>
                    </tr>
                </tbody>
            </table>
                <div class="table-btn">
                    <Button type="primary" v-show="!canEdit" @click="canEdit=!canEdit">信息编辑</Button>
                    <Button type="primary" v-show="canEdit&&Id!=''" @click="saveInfo">保存</Button>
                    <Button type="default" @click="$router.push('/report/hospital')">返回</Button>
                </div>
            </TabPane>
            <TabPane label="医院科室设置" :disabled="Id=='' || (canEdit && curIndex!=5)">
                <table class="common-table" >
                <tbody>
                    <tr>
                        <td colspan="7"><h3>F.医院科室设置（原卫生部颁布的《医疗机构诊疗科目名录》简称《医疗科室》）</h3></td>
                    </tr>
                    <tr>
                        <td>医院科室设置是否分级</td>
                        <td>
                            <div class="radio-con"><input type="radio" value="0" name="isSectionLevel" v-model="sectionNew.isSectionLevel" :disabled="!canEdit"><label></label></div><span class="mr15">是</span>
                            <div class="radio-con"><input type="radio" value="1" name="isSectionLevel" v-model="sectionNew.isSectionLevel" :disabled="!canEdit"><label></label></div>否
                        </td>
                        <td>医院科室设置分级</td>
                        <td colspan="2">
                            <div class="radio-con"><input type="radio" value="1" name="sectionLevel" v-model="sectionNew.sectionLevel" :disabled="!canEdit"><label></label></div><span class="mr15">一级</span>
                            <div class="radio-con"><input type="radio" value="2" name="sectionLevel" v-model="sectionNew.sectionLevel" :disabled="!canEdit"><label></label></div><span class="mr15">二级</span>
                            <div class="radio-con"><input type="radio" value="3" name="sectionLevel" v-model="sectionNew.sectionLevel" :disabled="!canEdit"><label></label></div><span class="mr15">三级</span>
                        </td>
                        <td>医院科室设置及分级是否按照《医疗科室》</td>
                        <td>
                            <div class="radio-con"><input type="radio" value="0" name="isSectionRequest" v-model="sectionNew.isSectionRequest" :disabled="!canEdit"><label></label></div><span class="mr15">是</span>
                            <div class="radio-con"><input type="radio" value="1" name="isSectionRequest" v-model="sectionNew.isSectionRequest" :disabled="!canEdit"><label></label></div>否
                        </td>
                    </tr>
                    <tr>
                        <td>a.《医疗科室》设置一级科室名称</td>
                        <td>b.本院科室设置与《医疗科室》是否一致</td>
                        <td>c.本院科室设置与《医疗科室》不一致，请列出</td>
                        <td>d.《医疗科室》设置二级科室名称</td>
                        <td width="150">e.本院科室名称与《医疗科室》是否一致</td>
                        <td>f.本院科室名称与《医疗科室》不一致，请列出</td>
                        <td>g.本院三级科室设置名称</td>
                    </tr>
                    <template v-for="item,index in sectionList">
                         <tr>
                             <td :rowspan="item.data.length>0?item.data.length: '1'">{{item.hosp}}</td>
                             <td :rowspan="item.data.length>0?item.data.length: '1'">
                                 <div class="radio-con"><input type="radio" :name="'choose'+index" :disabled="!canEdit" value="0" v-model="sectionNew.chooseSections[index].isSame" ><label></label></div><span class="mr15">是</span>
                                 <div class="radio-con"><input type="radio" :name="'choose'+index" :disabled="!canEdit" value="1" v-model="sectionNew.chooseSections[index].isSame" ><label></label></div>否
                             </td>
                             <td :rowspan="item.data.length>0?item.data.length: '1'" :contenteditable="canEdit" v-html="sectionNew.chooseSections[index].otherName" @blur="sectionNew.chooseSections[index].otherName=$event.target.innerHTML"></td>
                             <td v-if="item.data.length>0">{{item.data[0]}}</td>
                             <td v-else></td>
                             <td v-if="item.data.length>0">
                                  <div class="radio-con"><input type="radio" :name="'choose'+index+'0'" :disabled="!canEdit" value="0" v-model="sectionNew.chooseSections[index].childList[0].isSame" ><label></label></div><span class="mr15">是</span>
                                  <div class="radio-con"><input type="radio" :name="'choose'+index+'0'" :disabled="!canEdit" value="1" v-model="sectionNew.chooseSections[index].childList[0].isSame" ><label></label></div>否
                             </td>
                             <td v-else></td>
                             <td :contenteditable="canEdit"></td>
                             <td :contenteditable="canEdit"></td>
                         </tr>
                         <tr v-for="value,key in item.data" v-show="item.data.length>1&&key>0">
                              <td>{{value}}</td>
                              <td>
                                  <div class="radio-con"><input type="radio" :name="'choose'+index+'_'+key" :disabled="!canEdit" value="0" v-model="sectionNew.chooseSections[index].childList[key].isSame"><label></label></div><span class="mr15">是</span>
                                  <div class="radio-con"><input type="radio" :name="'choose'+index+'_'+key" :disabled="!canEdit" value="1" v-model="sectionNew.chooseSections[index].childList[key].isSame"><label></label></div>否
                              </td>
                              <td :contenteditable="canEdit" v-html="sectionNew.chooseSections[index].childList[key].otherName" @blur="sectionNew.chooseSections[index].childList[key].otherName=$event.target.innerHTML"></td>
                              <td :contenteditable="canEdit" v-html="sectionNew.chooseSections[index].childList[key].thirdName" @blur="sectionNew.chooseSections[index].childList[key].thirdName=$event.target.innerHTML"></td>
                         </tr>
                     </template>               
                    <tr>
                        <td colspan="7">h.本院设置的科室(医院自命名的科室名称如“病一区”、“南十二病区”、“Z05”等,请填写对应科室名称)</td>
                    </tr>
                    <tr>
                        <td colspan="2">医院自命名的科室名称</td>
                        <td colspan="3">对应具体《医疗科室》名称</td>
                        <td colspan="2">科室分级</td>
                    </tr>
                    <tr v-for="item,index in 15">
                       <td height="33" colspan="2" :contenteditable="canEdit" v-html="sectionNew.customSections[index].selfName" @blur="sectionNew.customSections[index].selfName=$event.target.innerHTML"></td>
                       <td colspan="3" :contenteditable="canEdit" v-html="sectionNew.customSections[index].sectionsName" @blur="sectionNew.customSections[index].sectionsName=$event.target.innerHTML"></td>
                       <td colspan="2" :contenteditable="canEdit" v-html="sectionNew.customSections[index].level" @blur="sectionNew.customSections[index].level=$event.target.innerHTML"></td>
                   </tr>                  
                    <tr>
                        <td colspan="2">填表人</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="sectionNew.hospFillPeople" @blur="sectionNew.hospFillPeople=$event.target.innerHTML"></td>
                        <td colspan="3" rowspan="5" valign="bottom" align="right">盖医院公章</td>
                    </tr>
                    <tr>
                        <td colspan="2">填表部门</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="sectionNew.fillDepartment" @blur="sectionNew.fillDepartment=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td colspan="2">联系电话</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="sectionNew.fillPeopleTelephone" @blur="sectionNew.fillPeopleTelephone=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td colspan="2">负责人签字</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="sectionNew.hospLeader" @blur="sectionNew.hospLeader=$event.target.innerHTML"></td>
                    </tr>
                    <tr>
                        <td colspan="2">填表日期</td>
                        <td colspan="2" :contenteditable="canEdit" v-html="sectionNew.hospFillDate" @blur="sectionNew.hospFillDate=$event.target.innerHTML"></td>
                    </tr>
                </tbody>
            </table>
                <div class="table-btn">
                    <Button type="primary" v-show="!canEdit" @click="canEdit=!canEdit">信息编辑</Button>
                    <Button type="primary" v-show="canEdit" @click="saveInfo">保存并提交审核</Button>
                    <Button type="default" @click="$router.push('/report/hospital')">返回</Button>
                </div>
            </TabPane>
        </Tabs>
        
    </div>
</template>

<script>
import Vue from "vue";
import infos from "@/assets/data/report/hospInfo";
export default {
    name: 'reportManage',
    data(){
    	return{           
            Id:'',
            Vue:Vue,
            tabclass:'pdtop0',
            curIndex:0,
            editing:"all",
            content:'',
            canEdit:false,
            currentValid:false,
            basic:{},
            basicNew:{},
            infos:infos,
            basicValidate:{
                dailyOutpartient: [
                    { required: true, message: '标题不能为空', trigger: 'blur'}
                ],
            },
            allowChange:true,
            charge:[{
                post:1,
            },{
                post:2
            },{
                post:3
            },{
                post:4
            },{
                post:5
            },{
                post:6
            },{
                post:7
            },{
                post:8
            }],
            chargeNew:[{
                post:1,
            },{
                post:2
            },{
                post:3
            },{
                post:4
            },{
                post:5
            },{
                post:6
            },{
                post:7
            },{
                post:8
            }],
            chargeList:['院长','医疗副院长','主管药学副院长','医务处主任','院办公室主任','信息科/中心主任','护理部主任','药剂科主任'],
            hospComputerSystemList:['Win9X/ME','WinNT','Vista','Win2003','UNIX','Linux','XP','Win2K/XP','Win10','Win8.1','Win8','Win7','Mac','其他：'],
            hisSystemDatabaseList:['ORACLE','SQLServer','MYSQL','DB2','VisualFoxpro','ACCESS','其他：'],
            hisSystemList:['军惠','北京众邦','杭州创业','上海金仕达','华东诚信','本院开发','其他：'],
            internetConditionList:['ADSL','拨号','光纤','DDN专线','共享','独享','其他：'],
            internetPortList:["80","8080","其他："],
            drugCodeList:['WHOATC','本院编码',"其他："],
            operationCodeList:['ICD9-CM',"其他："],
            diseaseCodeList:['ICD9','ICD10','其他：'],
            pathologyCodeList:['ICD9','ICD10','其他：'],
            upload:[{
                post:1,
            },{
                post:2
            },{
                post:3
            },{
                post:4
            },{
                post:5
            }],
            uploadNew:[{
                post:1,
            },{
                post:2
            },{
                post:3
            },{
                post:4
            },{
                post:5
            }],
            uploadList:['数据上报领导人','数据上报管理部门负责人','数据上报信息技术管理部门负责人','数据上报负责部门负责人','数据上报负责人'],
            system:{
                hospComputerSystem:[],
                internetCondition:[],
                internetPort:[],
                hisSystem:[],
                hisSystemDatabase:[]
            },
            systemNew:{
                hospComputerSystem:[],
                internetCondition:[],
                internetPort:[],
                hisSystem:[],
                hisSystemDatabase:[],
                bandwidthSize:""
            },
            code:{
                drugCode:[],
                operationCode:[],
                diseaseCode:[],
                pathologyCode:[]
            },     
            codeNew:{
                drugCode:[],
                operationCode:[],
                diseaseCode:[],
                pathologyCode:[]
            },         
            tabList:['医院基本信息','医院负责人信息','上报数据负责人信息','医院信息系统情况','药品与医疗编码使用情况','医院科室设置'],
            infoList:[],
            urlSave:['hospital.basicSave','hospital.chargeSave','hospital.uploadSave','hospital.systemSave','hospital.codeSave','hospital.sectionSave'],
            urlGet:['hospital.basicInfo','hospital.chargeInfo','hospital.uploadInfo','hospital.systemInfo','hospital.codeInfo','hospital.sectionInfo'],
            sectionList:[{
                hosp:'预防保健科',
                data:[]
            },{
                hosp:'全科医疗科',
                data:[]
            },{
                hosp:'内   科',
                data:['呼吸内科','消化内科','神经内科','心血管内科','血液内科','肾病学','内分泌','免疫学','变态反应','老年病','其  他','重症监护（内科）']
            },{
                hosp:'外   科',
                data:['普通外科','神经外科','骨  科','泌尿外科','胸外科','心脏大血管外科','烧伤科','整形外科','其  他','重症监护（外科）']
            },{
                hosp:'妇产科',
                data:['妇  科','产  科','计划生育','优生学','生殖健康与不孕症','其  他']
            },{
                hosp:'妇女保健科',
                data:['青春期保健','围产期保健','更年期保健','妇女心理卫生','妇女营养','其 他']
            },{
                hosp:'儿   科',
                data:['新生儿','小儿传染病','小儿消化','小儿呼吸','小儿心脏病','小儿肾病','小儿血液病','小儿神经病学','小儿内分泌','小儿遗传病','小儿免疫','其  他']
            },{
                hosp:'小儿外科',
                data:['小儿普通外科','小儿骨科','小儿泌尿外科','小儿胸心外科','小儿神经外科','其  他']
            },{
                hosp:'儿童保健科',
                data:['儿童生长发育','儿童营养','儿童心理卫生','儿童五官保健','儿童康复','其  他']
            },{
                hosp:'眼   科',
                data:[]
            },{
                hosp:'耳鼻喉咽科',
                data:['耳  科','鼻  科','咽喉科','其  他']
            },{
                hosp:'口腔科',
                data:['口腔内科','口腔颌面外科','正  畸','口腔修复','口腔预防保健','其  他']
            },{
                hosp:'皮肤科',
                data:['皮肤病','性传播疾病','其  他']
            },{
                hosp:'医疗美容科',
                data:[]
            },{
                hosp:'精神科',
                data:['精神病','精神卫生','药物依赖','精神康复','社区防治','临床心理','司法精神','其  他']
            },{
                hosp:'传染科',
                data:['肠道传染病','呼吸道传染病','肝  炎','虫媒传染病','动物源性传染','蠕虫病','其  他']
            },{
                hosp:'结核病科',
                data:[]
            },{
                hosp:'地方病科',
                data:[]
            },{
                hosp:'肿瘤科',
                data:[]
            },{
                hosp:'急诊医学科',
                data:['重症监护（急诊）']
            },{
                hosp:'康复医学科',
                data:[]
            },{
                hosp:'运动医学科',
                data:[]
            },{
                hosp:'职业病科',
                data:['职业中毒','尘  肺','放射病','物理因素损伤','职业健康监护','其  他']
            },{
                hosp:'临终关怀科',
                data:[]
            },{
                hosp:'特种医学与军事医学科',
                data:[]
            },{
                hosp:'疼痛科',
                data:[]
            },{
                hosp:'医学检验科',
                data:['临床体液、血液','临床微生物学','临床生化检验','临床免疫、血清','其  他']
            },{
                hosp:'病理科',
                data:[]
            },{
                hosp:'医学影像科',
                data:['X线诊断','CT诊断','磁共振成像诊断','核医学','超声诊断','心电诊断','脑电及脑血流图诊断','神经肌肉电图','介入放射学','放射治疗','其  他']
            },{
                hosp:'中医科',
                data:['内  科','外  科','妇产科','儿  科','皮肤科','眼  科','耳鼻喉咽科','口腔科','肿瘤科','骨伤科','肛肠科','老年病科','针灸科','推拿科','康复医学','急诊科','预防保健科','其  他']
            },{
                hosp:'民族医学',
                data:['维吾尔医学','藏医学','蒙医学','彝医学','傣医学','其  他']
            },{
                hosp:'中西医结合',
                data:[]
            },{
                hosp:'重症监护室（综合）',
                data:[]
            },{
                hosp:'管理科室',
                data:['感染（管理）科']
            },{
                hosp:'其  他',
                data:[]
            }],                      
            section:{
                chooseSections:[],
                customSections:[]
            },
            sectionNew:{
                chooseSections:[],
                customSections:[]
            }
    	}
    },
    created: function () {
        this.sectionAss();     
    },
    mounted() {        
        this.Id=this.$route.query.Id;
        this.getInfo();
    },
    watch:{
        basicNew:{
            handler:function(newValue,oldValue){
                console.log(JSON.stringify(newValue))
                if(Object.keys(oldValue).length==0){
                    return;
                }
                if(this.editing==null){
                    return;
                }
                var type="basicInfo";
                var validates=[
                    {
                        label:"hospName",
                        maxLength:50,
                        required:true
                    },
                    {
                        label:"dailyOutpartient",
                        maxLength:9,
                        required:true,
                        number:true
                    },
                    {
                        label:"dailyEmergency",
                        maxLength:9,
                        required:true,
                        number:true
                    },
                    {
                        label:"yearHospTrips",
                        maxLength:9,
                        required:true,
                        number:true
                    },
                    {
                        label:"hospBed",
                        maxLength:9,
                        required:true,
                        number:true
                    },
                    {
                        label:"hospBedOpen",
                        maxLength:9,
                        required:true,
                        number:true
                    },
                    {
                        label:"bedTurnoverRate",
                        maxLength:6,
                        required:true
                    },
                   {
                        label:"hospTelephone",
                        maxLength:30,
                        required:true
                    },
                    {
                        label:"hospFax",
                        maxLength:30,
                        required:true
                    },
                    {
                        label:"hospEmail",
                        maxLength:30,
                        required:true
                    },
                    {
                        label:"hospWebsite",
                        maxLength:30,
                        required:true
                    },
                    {
                        label:"address",
                        maxLength:30,
                        required:true
                    },
                    {
                        label:"postcode",
                        maxLength:6,
                        required:true
                    },
                    {
                        label:"hospAttached",
                        required:true,
                        number:true
                    },
                    {
                        type:"basicInfo",
                        label:"hospGrade",
                        required:true,
                        number:true
                    },
                    {
                        type:"basicInfo",
                        label:"hospLevel",
                        required:true,
                        number:true
                    },
                    {
                        label:"hospType",
                        required:true,
                        number:true
                    },
                    {
                        label:"emphasisSection",
                        maxLength:60,
                    },
                    {
                        label:"specialistSectionType",
                        maxLength:16,
                    },
                    {
                        label:"physicianTotalCount",
                        number:true
                    },
                    {
                        label:"physicianLevel5Count",
                        number:true
                    },
                    {
                        label:"physicianLevel4Count",
                        number:true
                    },
                    {
                        label:"physicianLevel3Count",
                        number:true
                    },
                    {
                        label:"physicianLevel2Count",
                        number:true
                    },
                    {
                        label:"physicianLevel1Count",
                        number:true
                    },
                    {
                        label:"pharmacistTotalCount",
                        number:true
                    },
                    {
                        label:"pharmacistLevel5Count",
                        number:true
                    },
                    {
                        label:"pharmacistLevel4Count",
                        number:true
                    },
                    {
                        label:"pharmacistLevel3Count",
                        number:true
                    },
                    {
                        label:"pharmacistLevel2Count",
                        number:true
                    },
                    {
                        label:"pharmacistLevel1Count",
                        number:true
                    },
                ]
                var self=this;
                var newArr=this.editing=="all"?validates:validates.filter(m=>{
                    return m.label==self.editing;
                })
                for(var i=0;i<newArr.length;i++){
                    var item=newArr[i];
                    // if(newValue[item.label]==oldValue[item.label]){
                    //     continue;
                    // }
                    if(item.required){
                        if(!this.validateRequired(newValue[item.label] || self.basic[item.label],infos[type][item.label])){
                            return;
                        }
                    }
                    if(item.maxLength){
                        if(!this.validateMaxLength(newValue[item.label] || self.basic[item.label],item.maxLength,infos[type][item.label])){
                            return;
                        }
                    }
                    if(item.number){
                        if(!this.validateNumber(newValue[item.label] || self.basic[item.label],infos[type][item.label])){
                            return;
                        }
                        if(newValue[item.label]===null || newValue[item.label]==="" || newValue[item.label]===undefined){
                            delete newValue[item.label]
                        }
                        else{
                            newValue[item.label]=parseInt(newValue[item.label] || self.basic[item.label])
                        }
                    }
                }
                if(this.editing=="all"){
                    var changed=false;
                    var keys=Object.keys(newValue);
                    for(var i=0;i<keys.length;i++){
                        var key=keys[i];
                        var value=newValue[key];
                        if(newValue[key]==""){
                            value=null;
                        }
                        if(self.basic[key]==value &&(key!="hospAttached" && key!="hospGrade" && key!="hospLevel" && key!="hospType")){
                            delete newValue[key]
                        }
                        if((value!=self.basic[key] && key!="testing") || (key=="hospAttached" || key=="hospGrade" || key=="hospLevel" || key=="hospType")){
                            changed=true;
                        }
                    }
                    if(!changed){
                       console.log("无变化",newValue)
                       this.showError("请先修改数据后再点击保存");
                       return
                   }
                }
                self.currentValid=true;
                this.saveCurrent();
                console.log(newValue)
            },
            deep:true
        },
        chargeNew:{
            handler:function(newValue,oldValue){
                if(newValue.length==0){
                    return;
                }
                if(this.editing==null){
                    return;
                }
                var self=this;
                var type="chargeInfo";
                //判断院长姓名
                if(!this.validateRequired((newValue.findProperty("post",1)["name"] || newValue.findProperty("post",1)["name"]=="")?newValue.findProperty("post",1)["name"]: self.charge.findProperty("post",1)["name"],self.chargeList[0]+infos[type]["name"])){
                            return;
                        }

                var type="chargeInfo";
                var validates=[
                    {
                        label:"name",
                        maxLength:30
                    },
                    {
                        label:"sex",
                        maxLength:6
                    },
                    {
                        label:"specialty",
                        maxLength:30
                    },
                    {
                        label:"title",
                        maxLength:30
                    },
                    {
                        label:"fax",
                        maxLength:30
                    },
                    {
                        label:"email",
                        maxLength:30
                    },
                    {
                        label:"mobile",
                        maxLength:30
                    },
                    {
                        label:"officPhone",
                        maxLength:30
                    }
                ]
                
                var newArr=this.editing=="all"?validates:validates.filter(m=>{
                    return m.label==self.editing;
                })
                for(var i=0;i<newArr.length;i++){
                    var item=newArr[i];
                    // if(newValue[item.label]==oldValue[item.label]){
                    //     continue;
                    // }
                    for(var j=0;j<newValue.length;j++){
                        var current=newValue[j];
                        if(item.required){
                            if(!this.validateRequired(current[item.label] || self.charge[j][item.label],self.chargeList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                        if(item.maxLength){
                            if(!this.validateMaxLength(current[item.label] || self.charge[j][item.label],item.maxLength,self.chargeList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                        if(item.number){
                            if(!this.validateNumber(current[item.label] || self.charge[j][item.label],self.chargeList[j]+infos[type][item.label])){
                                return;
                            }
                            if(current[item.label]===null || current[item.label]==="" || current[item.label]===undefined){
                                delete current[item.label]
                            }
                            else{
                                current[item.label]=parseInt(current[item.label] || self.charge[j][item.label])
                            }
                        }
                        if(current[item.label] && item.label=="email"){
                            if(!this.validateEmail(current[item.label] || self.charge[j][item.label],self.chargeList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                        if(current[item.label] && item.label=="mobile"){
                            if(!this.validateMobile(current[item.label] || self.charge[j][item.label],self.chargeList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                    }
                    
                }
                if(this.editing=="all"){
                    var changed=false;
                    for(var j=0;j<newValue.length;j++){
                        var current=newValue[j];
                        var keys=Object.keys(current);
                        for(var i=0;i<keys.length;i++){
                            var key=keys[i];
                            var value=current[key];
                            if(value==""){
                                value=null;
                            }
                            if(self.charge[j][key]==value && key!="post"){
                                delete current[key]
                            }
                            if(value!=self.charge[j][key]&& key!="testing"){
                                changed=true;
                            }
                        }
                    }
                   if(!changed){
                       console.log("无变化",newValue)
                       this.showError("请先修改数据后再点击保存");
                       return
                   }
                }
                Vue.nextTick(function(){
                    self.currentValid=true;
                })
                this.currentValid=true;
                this.saveCurrent();
                console.log(newValue)
            },
            deep:true
        },
        uploadNew:{
            handler:function(newValue,oldValue){
                console.log(JSON.stringify(newValue))
                if(newValue.length==0){
                    return;
                }
                if(this.editing==null){
                    return;
                }
                var self=this;
                var type="uploadChargeInfo";
                console.log('newValue.findProperty("post",5)["department"]',newValue.findProperty("post",5)["department"] || self.upload.findProperty("post",5)["department"])
                if(!this.validateRequired((newValue.findProperty("post",5)["department"] || newValue.findProperty("post",5)["department"]=="")?newValue.findProperty("post",5)["department"]:self.upload.findProperty("post",5)["department"],self.uploadList[4]+infos[type]["department"])){
                            return;
                }
                if(!this.validateRequired((newValue.findProperty("post",5)["name"] || newValue.findProperty("post",5)["name"]=="")?newValue.findProperty("post",5)["name"]:self.upload.findProperty("post",5)["name"],self.uploadList[4]+infos[type]["name"])){
                            return;
                }
                if(!this.validateRequired((newValue.findProperty("post",5)["mobile"] || newValue.findProperty("post",5)["mobile"]=="")?newValue.findProperty("post",5)["mobile"]:self.upload.findProperty("post",5)["mobile"],self.uploadList[4]+infos[type]["mobile"])){
                            return;
                }
                if(!this.validateRequired((newValue.findProperty("post",5)["email"] || newValue.findProperty("post",5)["email"]=="")?newValue.findProperty("post",5)["email"]:self.upload.findProperty("post",5)["email"],self.uploadList[4]+infos[type]["email"])){
                            return;
                }
                var validates=[
                    {
                        label:"department",
                        maxLength:30
                    },
                    {
                        label:"name",
                        maxLength:30
                    },
                    {
                        label:"officPhone",
                        maxLength:30
                    },
                    {
                        label:"sex",
                        maxLength:30
                    },
                    {
                        label:"mobile",
                        maxLength:30
                    },
                    {
                        label:"specialty",
                        maxLength:30
                    },
                    {
                        label:"fax",
                        maxLength:30
                    },
                    {
                        label:"title",
                        maxLength:30
                    },
                    {
                        label:"email",
                        maxLength:30
                    }
                ]
                
                var newArr=this.editing=="all"?validates:validates.filter(m=>{
                    return m.label==self.editing;
                })
                for(var i=0;i<newArr.length;i++){
                    var item=newArr[i];
                    // if(newValue[item.label]==oldValue[item.label]){
                    //     continue;
                    // }
                    for(var j=0;j<newValue.length;j++){
                        var current=newValue[j];
                        var tempValue=self.upload[j][item.label];
                        if(current[item.label]){
                            tempValue=current[item.label];
                        }
                        if(item.required){
                            if(!this.validateRequired(tempValue,self.uploadList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                        if(item.maxLength){
                            if(!this.validateMaxLength(tempValue,item.maxLength,self.uploadList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                        if(item.number){
                            if(!this.validateNumber(tempValue,self.uploadList[j]+infos[type][item.label])){
                                return;
                            }
                            if(current[item.label]===null || current[item.label]==="" || current[item.label]===undefined){
                                delete current[item.label]
                            }
                            else{
                                current[item.label]=parseInt(tempValue)
                            }
                        }
                        if(current[item.label] && item.label=="email"){
                            if(!this.validateEmail(tempValue,self.uploadList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                        if(current[item.label] && item.label=="mobile"){
                            if(!this.validateMobile(tempValue,self.uploadList[j]+infos[type][item.label])){
                                return;
                            }
                        }
                    }
                }
                if(this.editing=="all"){
                    var changed=false;
                    for(var j=0;j<newValue.length;j++){
                        var current=newValue[j];
                        var keys=Object.keys(current);
                        for(var i=0;i<keys.length;i++){
                            var key=keys[i];
                            var value=current[key];
                            if(value==""){
                                value=null;
                            }
                            if(self.upload[j][key]==value && key!="post" && key!="uploadChargeId"){
                                delete current[key]
                            }
                            if(value==null && (!self.upload[j][key] || self.upload[j][key]==null)){
                                delete current[key]
                            }
                            if(value!=self.upload[j][key]&& key!="testing"){
                                changed=true;
                            }
                        }
                    }
                   if(!changed){
                       console.log("无变化",newValue);
                       this.showError("请先修改数据再点击保存");
                       return
                   }
                }
                this.currentValid=true;
                this.saveCurrent();
                console.log(newValue)
            },
            deep:true
        },
        systemNew:{
            handler:function(newValue,oldValue){
               this.validateStep3()
            },
            deep:true
        }
    },
    
    methods: {
        saveCurrent:function(sysIn){
            if(this.editing=="all"){
                
            var self=this;
            var basicNew=[],chargeNew=[],uploadNew=[],systemNew=[],codeNew=[],sectionNew=[];
            var tempObj=Object.assign({},this.basicNew);
            delete tempObj['testing'];
            basicNew.push(tempObj);
            chargeNew= this.chargeNew.assign();
            uploadNew=this.uploadNew.assign();
            systemNew.push(Object.assign({},this.systemNew));
            delete systemNew['testing'];
            codeNew.push(Object.assign({},this.codeNew));
            sectionNew.push(Object.assign({},this.sectionNew));
           
            systemNew[0].hospComputerSystem=JSON.stringify(systemNew[0].hospComputerSystem);
            systemNew[0].internetCondition=JSON.stringify(systemNew[0].internetCondition);
            systemNew[0].internetPort=JSON.stringify(systemNew[0].internetPort);
            systemNew[0].hisSystem=JSON.stringify(systemNew[0].hisSystem);
            systemNew[0].hisSystemDatabase=JSON.stringify(systemNew[0].hisSystemDatabase);
            codeNew[0].drugCode=JSON.stringify(codeNew[0].drugCode);
            codeNew[0].operationCode=JSON.stringify(codeNew[0].operationCode);
            codeNew[0].diseaseCode=JSON.stringify(codeNew[0].diseaseCode);
            codeNew[0].pathologyCode=JSON.stringify(codeNew[0].pathologyCode);
            sectionNew[0].chooseSections=JSON.stringify(sectionNew[0].chooseSections);
            sectionNew[0].customSections=JSON.stringify(sectionNew[0].customSections);

            this.infoList=[JSON.stringify(basicNew),JSON.stringify(chargeNew),JSON.stringify(uploadNew),JSON.stringify(systemNew),JSON.stringify(codeNew),JSON.stringify(sectionNew)];  
            Vue.ajax.send({
                name: self.urlSave[self.curIndex],
                data: {
                    value:self.infoList[self.curIndex],
                    hospId:self.Id,
                    updateUser:Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        if(self.Id==''){
                            if(self.curIndex<5){
                               self.curIndex++; 
                            }else{
                                self.$Message.success('信息保存成功,并已提交审核！');
                                self.canEdit=false;
                                self.curIndex=0;
                                self.getInfo();
                                self.Id=data.data.Id;
                                console.log(self.Id);
                            }                            
                        }else{
                            self.$Message.success('信息保存成功！');
                            self.getInfo();
                            self.canEdit=false;
                        } 
                    } else {                      
                      self.$Message.error('信息保存失败，请重试！')
                    }
                    self.currentValid=false;
                }
            });
            }
        },
        sectionAss(){
            this.section.chooseSections=this.section.chooseSections || []
            if(this.section.chooseSections.length==0){
                for (var i = 0; i < this.sectionList.length; i++) {
                    this.section.chooseSections[i]={
                        post:i+1,
                        isSame:'',
                        otherName:'',
                        childList:[]
                    }
                    this.sectionNew.chooseSections[i]={
                        post:i+1,
                        isSame:'',
                        otherName:'',
                        childList:[]
                    }
                    for (var j = 0; j <this.sectionList[i].data.length ; j++) {
                        this.section.chooseSections[i].childList[j]={
                            isSame:'',
                            otherName:'',
                            thirdName:''
                        }
                        this.sectionNew.chooseSections[i].childList[j]={
                            isSame:'',
                            otherName:'',
                            thirdName:''
                        }
                    }
                }
            }
            this.section.customSections=this.section.customSections || []
            if(this.section.customSections.length==0){
                for (var n = 0; n < 15; n++) {
                    this.section.customSections[n]={
                        selfName:'',
                        sectionsName:'',
                        level:''
                    }
                    this.sectionNew.customSections[n]={
                        selfName:'',
                        sectionsName:'',
                        level:''
                    }
                }
                
            }
        },
        changeTab(index){
            this.tabclass = "pdtop" + index;
                if(this.Id!=''){
                        this.editing=null;
                        this.curIndex=index;
                        this.canEdit=false;
                        this.getInfo(); 
                        
                }else{
                    return false;
                }
        },
        validateRequired:function(val,message){
            if(val===null || val==="" || val===undefined){
                this.showError(message+"不能为空");
                return false;
            }
            return true;
        },
        validateMaxLength:function(val,length,message){
            if(val && val.length>length){
                   this.showError(message+"太长");
                    return false;
                }
            return true;
        },
        validateNumber:function(val,message){
            if(val && (val + "").indexOf("&nbsp") >= 0){
                this.showError(message+"不能包含空格");
                return false;
            }
            var regPos = /^\d+$/; // 非负整数
            if(val && !regPos.test(val)){
                this.showError(message+"必须为数字");
                return false;
            }
            return true;
        },
        validateMobile:function(val,message) {
            if(val && (val + "").indexOf("&nbsp") >= 0){
                this.showError(message+"不能包含空格");
                return false;
            }
            var reg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;//定义手机号正则表达式
            if (!(reg.test(val))) {
                this.showError("请输入正确的手机号");
                return false;
            }
            return true;
        },
        validateEmail:function(val,message){
            if(val && (val + "").indexOf("&nbsp") >= 0){
                this.showError(message+"不能包含空格");
                return false;
            }
            var regEmail=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(!(regEmail.test(val))){ 
                this.showError("请输入正确的邮箱");
                return false; 
            } 
            return true;
        },
        validate:function(info,e){
            // var info={
            //     label:"hospName",
            //     type:"basic",
            //     maxLength:20,
            //     required:true,
            //     number:true
            // }
            var value=e.target.innerHTML;
            var type=info.type+"Info";
            if(info.maxLength){
                if(value.length>info.maxLength){
                    e.target.focus();
                   return this.showError(infos[type][info.label]+"太长");
                }
            }
            if(info.required){
                if(value==null || value==""){
                    e.target.focus();
                    return this.showError(infos[type][info.label]+"不能为空");
                }
            }
            if(info.number){
                var regPos = / ^\d+$/; // 非负整数
                if(!regPos.test(val)){
                    e.target.focus();
                    return this.showError(infos[type][info.label]+"必须为数字");
                }
            }
            if(info.type=="basic"){
                this.basicNew[info.label]=value;
                
            }
            if(info.type=="basic"){
                this.basicNew[info.label]=value;
            }
            return true;
        },
        beginEdit(){
            this.canEdit=!this.canEdit;
        },
        showError:function(message){
            this.$Modal.error({
                title: "填写错误",
                content: message
            });
            return false;
        },
        validateStep3:function(){
            var validate=true;
            var newValue=this.systemNew
            if(newValue.length==0){
                    return false;
                }
                if(this.editing==null){
                    return false;
                }
                var self=this;
                var type="systemInfo";
                var validates=[
                    {
                        label:"hospComputerSystemOther",
                        alias:"hospComputerSystem",
                        maxLength:30
                    },
                    {
                        label:"internetConditionOther",
                        alias:"internetCondition",
                        maxLength:30
                    },
                    {
                        label:"internetPortOther",
                        alias:"internetPort",
                        maxLength:30
                    },
                    {
                        label:"bandwidthSize",
                        maxLength:30
                    },
                    {
                        label:"hisSystemOther",
                        alias:"hisSystem",
                        maxLength:30
                    },
                    {
                        label:"isWardHis",
                        number:true,
                    },
                    {
                        label:"isMedicalRecord",
                        number:true,
                    },
                    {
                        label:"isOutpatientHis",
                        number:true,
                    },
                    {
                        label:"isOutPatient",
                        number:true,
                    }
                    ,
                    {
                        label:"hisSystemDatabaseOther",
                        alias:"hisSystemDatabase",
                        maxLength:30
                    }
                ]
                var newValueCopy=JSON.parse(JSON.stringify(newValue));
                //校验
                Object.keys(newValueCopy).forEach(key=>{
                    if(validate){
                        for(var i=0;i<validates.length;i++){
                            var item=validates[i];
                            if(key==item.label){
                                if(item.maxLength){
                                    if(!self.validateMaxLength(newValueCopy[item.label],item.maxLength,infos[type][item.label] || infos[type][item.alias])){
                                    validate=false;
                                    return;
                                    }
                                }
                                if(item.number && validate){
                                    if(!self.validateNumber(newValueCopy[item.label],infos[type][item.label] || infos[type][item.alias])){
                                    validate=false;
                                    return;
                                    }
                                }
                            }
                        }
                    }
                });
            return validate;
        },
        validateStep4:function(){
            var validate=true;
            var newValue=this.codeNew
            if(newValue.length==0){
                    return false;
                }
                if(this.editing==null){
                    return false;
                }
                var self=this;
                var type="drugInfo";
                var validates=[
                    {
                        label:"drugCodeOther",
                        alias:"drugCode",
                        maxLength:30
                    },
                    {
                        label:"operationCodeOther",
                        alias:"operationCode",
                        maxLength:30
                    },
                    {
                        label:"diseaseCodeOther",
                        alias:"diseaseCode",
                        maxLength:30
                    },
                    {
                        label:"pathologyCodeOther",
                        alias:"pathologyCode",
                        maxLength:30
                    }
                ]
                var newValueCopy=JSON.parse(JSON.stringify(newValue));
                //校验
                Object.keys(newValueCopy).forEach(key=>{
                    if(validate){
                        for(var i=0;i<validates.length;i++){
                            var item=validates[i];
                            if(key==item.label){
                                if(item.maxLength){
                                    if(!self.validateMaxLength(newValueCopy[item.label],item.maxLength,infos[type][item.label] || infos[type][item.alias])){
                                    validate=false;
                                    return;
                                    }
                                }
                                if(item.number && validate){
                                    if(!self.validateNumber(newValueCopy[item.label],infos[type][item.label] || infos[type][item.alias])){
                                    validate=false;
                                    return;
                                    }
                                }
                            }
                        }
                    }
                });
            return validate;
        },
        saveInfo(){
            var self=this
            this.editing="all"
            this.currentValid=false;
            if(this.curIndex==0){
                this.basicNew.testing==null?Vue.set(this.basicNew,"testing","all"):Vue.set(this.basicNew,"testing",null);
            }
            if(this.curIndex==1){
                this.chargeNew=[].concat(this.chargeNew);
                // this.chargeNew.testing==null?Vue.set(this.chargeNew,"testing","all"):Vue.set(this.chargeNew,"testing",null);
            }
            if(this.curIndex==2){
                this.uploadNew=[].concat(this.uploadNew);
            }
            if(this.curIndex==3){
                this.systemNew.testing==null?Vue.set(this.systemNew,"testing","all"):Vue.set(this.systemNew,"testing",null);
                //去除重复值
                if(!this.validateStep3()){
                    return;
                }
                var newValueCopy=JSON.parse(JSON.stringify(this.systemNew));
                if(newValueCopy["isWardHis"]){
                                newValueCopy["isWardHis"]=parseInt(newValueCopy["isWardHis"]);
                            }
                            if(newValueCopy["isMedicalRecord"]){
                                newValueCopy["isMedicalRecord"]=parseInt(newValueCopy["isMedicalRecord"]);
                            }
                            if(newValueCopy["isOutpatientHis"]){
                                newValueCopy["isOutpatientHis"]=parseInt(newValueCopy["isOutpatientHis"]);
                            }
                            if(newValueCopy["isOutPatient"]){
                                newValueCopy["isOutPatient"]=parseInt(newValueCopy["isOutPatient"]);
                            }
                            
                                

                
                                if(!Vue.isNull(newValueCopy.hospComputerSystemOther)){
                                    newValueCopy.hospComputerSystem=newValueCopy.hospComputerSystem.map(m=>{
                                        if(m=="其他："){
                                            return m+newValueCopy.hospComputerSystemOther
                                        }
                                        else{
                                            return m;
                                        }
                                    })
                                }
                            
                            if(!Vue.isNull(newValueCopy.internetConditionOther)){
                                newValueCopy.internetCondition=newValueCopy.internetCondition.map(m=>{
                                    if(m=="其他："){
                                        return m+newValueCopy.internetConditionOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }

                            if(!Vue.isNull(newValueCopy.internetPortOther)){
                                newValueCopy.internetPort=newValueCopy.internetPort.map(m=>{
                                    if(m=="其他："){
                                        return m+newValueCopy.internetPortOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }

                            if(!Vue.isNull(newValueCopy.hisSystemOther)){
                                newValueCopy.hisSystem=newValueCopy.hisSystem.map(m=>{
                                    if(m=="其他："){
                                        return m+newValueCopy.hisSystemOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }

                            if(!Vue.isNull(newValueCopy.hisSystemDatabaseOther)){
                                newValueCopy.hisSystemDatabase=newValueCopy.hisSystemDatabase.map(m=>{
                                    if(m=="其他："){
                                        return m+newValueCopy.hisSystemDatabaseOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }


                            if(!Vue.isNull(self.system.hospComputerSystemOther)){
                                    self.system.hospComputerSystem=self.system.hospComputerSystem.map(m=>{
                                        if(m=="其他："){
                                            return m+self.system.hospComputerSystemOther
                                        }
                                        else{
                                            return m;
                                        }
                                    })
                                }
                            
                            if(!Vue.isNull(self.system.internetConditionOther)){
                                self.system.internetCondition=self.system.internetCondition.map(m=>{
                                    if(m=="其他："){
                                        return m+self.system.internetConditionOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }

                            if(!Vue.isNull(self.system.internetPortOther)){
                                self.system.internetPort=self.system.internetPort.map(m=>{
                                    if(m=="其他："){
                                        return m+self.system.internetPortOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }

                            if(!Vue.isNull(self.system.hisSystemOther)){
                                self.system.hisSystem=self.system.hisSystem.map(m=>{
                                    if(m=="其他："){
                                        return m+self.system.hisSystemOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }

                            if(!Vue.isNull(self.system.hisSystemDatabaseOther)){
                                self.system.hisSystemDatabase=self.system.hisSystemDatabase.map(m=>{
                                    if(m=="其他："){
                                        return m+self.system.hisSystemDatabaseOther
                                    }
                                    else{
                                        return m;
                                    }
                                })
                            }
                            var keyDelete=[];
                Object.keys(newValueCopy).forEach(key=>{
                    var current=newValueCopy[key];
                    if(current instanceof Array){
                        if(current.length==self.system[key].length 
                        && current.every(m=>{
                            return self.system[key].indexOf(m)>-1
                        })){
                            keyDelete.push(key); 
                        }
                    }
                    else{
                        if(current==null){
                            current=""
                        }
                        if(current.toString()=="" || current.toString()=="[]"){
                            current=null;
                        }
                        if(self.system[key]==""  || self.system[key]=="[]"){
                            self.system[key]=null;
                        }
                        if(current==self.system[key]){
                            keyDelete.push(key); 
                        }
                    }
                });
                keyDelete.forEach(key=>{
                    if(key!="infoSystemId"){
                        delete newValueCopy[key]
                    }
                })


                if(newValueCopy.hospComputerSystem){
                                newValueCopy.hospComputerSystem=JSON.stringify(newValueCopy.hospComputerSystem);
                            }
                            
                    if(newValueCopy.internetCondition){
                                                newValueCopy.internetCondition=JSON.stringify(newValueCopy.internetCondition);
                    }
                    if(newValueCopy.internetPort){
                                                newValueCopy.internetPort=JSON.stringify(newValueCopy.internetPort);
                    }
                    if(newValueCopy.hisSystem){
                                                newValueCopy.hisSystem=JSON.stringify(newValueCopy.hisSystem);
                    }
                    if(newValueCopy.hisSystemDatabase){
                                                newValueCopy.hisSystemDatabase=JSON.stringify(newValueCopy.hisSystemDatabase);
                    }


                var systemParam=[]
                systemParam.push(newValueCopy);
                delete newValueCopy['testing'];
                delete newValueCopy['hospComputerSystemOther'];
                delete newValueCopy['internetConditionOther'];
                delete newValueCopy['internetPortOther'];
                delete newValueCopy['hisSystemOther']; 
                delete newValueCopy['hisSystemDatabaseOther']; 
                if(Object.keys(newValueCopy).length==0 || (Object.keys(newValueCopy).length==1 && Object.keys(newValueCopy)[0]=="infoSystemId")){
                    this.showError("请先修改数据再点击保存");
                    return
                }
                

                Vue.ajax.send({
                    name: self.urlSave[self.curIndex],
                    data: {
                        value:JSON.stringify(systemParam),
                        hospId:self.Id,
                        updateUser:Vue.getUser().userName
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            if(self.Id==''){
                                    self.$Message.success('信息保存成功,并已提交审核！');
                                    self.canEdit=false;
                                    self.curIndex=0;
                                    self.getInfo();
                                    self.Id=data.data.Id;
                                    console.log(self.Id);                      
                            }else{
                                self.$Message.success('信息保存成功！');
                                // self.getInfo();
                                self.canEdit=false;
                            } 
                        } else {                      
                        self.$Message.error('信息保存失败，请重试！')
                        }
                        self.currentValid=false;
                    }
                });
            }
             if(this.curIndex==4){
                this.codeNew.testing==null?Vue.set(this.codeNew,"testing","all"):Vue.set(this.codeNew,"testing",null);
                //去除重复值
                if(!this.validateStep3()){
                    return;
                }
                var newValueCopy=JSON.parse(JSON.stringify(this.codeNew));
      
                if(!Vue.isNull(newValueCopy.drugCodeOther)){
                    newValueCopy.drugCode=newValueCopy.drugCode.map(m=>{
                        if(m=="其他："){
                            return m+newValueCopy.drugCodeOther
                        }
                        else{
                            return m;
                        }
                    })
                }
                
                if(!Vue.isNull(newValueCopy.operationCodeOther)){
                    newValueCopy.operationCode=newValueCopy.operationCode.map(m=>{
                        if(m=="其他："){
                            return m+newValueCopy.operationCodeOther
                        }
                        else{
                            return m;
                        }
                    })
                }

                if(!Vue.isNull(newValueCopy.diseaseCodeOther)){
                    newValueCopy.diseaseCode=newValueCopy.diseaseCode.map(m=>{
                        if(m=="其他："){
                            return m+newValueCopy.diseaseCodeOther
                        }
                        else{
                            return m;
                        }
                    })
                }

                if(!Vue.isNull(newValueCopy.pathologyCodeOther)){
                    newValueCopy.pathologyCode=newValueCopy.pathologyCode.map(m=>{
                        if(m=="其他："){
                            return m+newValueCopy.pathologyCodeOther
                        }
                        else{
                            return m;
                        }
                    })
                }
 
                var keyDelete=[];
                Object.keys(newValueCopy).forEach(key=>{
                    var current=newValueCopy[key];
                    if(current instanceof Array){
                        if(current.length==self.code[key].length 
                        && current.every(m=>{
                            return self.code[key].indexOf(m)>-1
                        })){
                            keyDelete.push(key); 
                        }
                    }
                    else{
                        if(current=="" || current=="[]"){
                            current=null;
                        }
                        if(self.code[key]==""  || self.code[key]=="[]"){
                            self.code[key]=null;
                        }
                        if(current==self.code[key]){
                            keyDelete.push(key); 
                        }
                    }
                });
                keyDelete.forEach(key=>{
                    if(key!="infoSystemId"){
                        delete newValueCopy[key]
                    }
                })


                    if(newValueCopy.drugCode){
                                newValueCopy.drugCode=JSON.stringify(newValueCopy.drugCode);
                     }
                            
                    if(newValueCopy.operationCode){
                                                newValueCopy.operationCode=JSON.stringify(newValueCopy.operationCode);
                    }
                    if(newValueCopy.diseaseCode){
                                                newValueCopy.diseaseCode=JSON.stringify(newValueCopy.diseaseCode);
                    }
                    if(newValueCopy.pathologyCode){
                                                newValueCopy.pathologyCode=JSON.stringify(newValueCopy.pathologyCode);
                    }

                var systemParam=[]
                systemParam.push(newValueCopy);
                delete newValueCopy['testing'];
                delete newValueCopy['drugCodeOther'];
                delete newValueCopy['operationCodeOther'];
                delete newValueCopy['diseaseCodeOther'];
                delete newValueCopy['pathologyCodeOther']; 
                if(Object.keys(newValueCopy).length==0 || (Object.keys(newValueCopy).length==1 && Object.keys(newValueCopy)[0]=="infoSystemId")){
                    this.showError("请先修改数据再点击保存");
                    return
                }
                

                Vue.ajax.send({
                    name: self.urlSave[self.curIndex],
                    data: {
                        value:JSON.stringify(systemParam),
                        hospId:self.Id,
                        updateUser:Vue.getUser().userName
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            if(self.Id==''){
                                    self.$Message.success('信息保存成功,并已提交审核！');
                                    self.canEdit=false;
                                    self.curIndex=0;
                                    self.getInfo();
                                    self.Id=data.data.Id;
                                    console.log(self.Id);                      
                            }else{
                                self.$Message.success('信息保存成功！');
                                // self.getInfo();
                                self.canEdit=false;
                            } 
                        } else {                      
                        self.$Message.error('信息保存失败，请重试！')
                        }
                        self.currentValid=false;
                    }
                });
            }
            if(this.curIndex==5){
                console.log(this.sectionNew,this.section)
                
                var obj=Object.assign({},this.sectionNew);
     console.log(this.sectionNew,this.section)
     console.log(obj)
                if(obj.isSectionLevel==self.section.isSectionLevel){
                    delete obj['isSectionLevel']
                }
                else{
                    if(!Vue.isNull(obj.isSectionLevel)){
                        obj.isSectionLevel=parseInt(obj.isSectionLevel);
                    }
                }

                if(obj.sectionLevel==self.section.sectionLevel){
                    delete obj['sectionLevel']
                }
                else{
                    if(!Vue.isNull(obj.sectionLevel)){
                        obj.sectionLevel=parseInt(obj.sectionLevel);
                    }
                }

                if(obj.isSectionRequest==self.section.isSectionRequest){
                    delete obj['isSectionRequest']
                }
                else{
                    if(!Vue.isNull(obj.isSectionRequest)){
                        obj.isSectionRequest=parseInt(obj.isSectionRequest);
                    }
                }

                if(JSON.stringify(obj.chooseSections)==JSON.stringify(self.section.chooseSections)){
                    delete obj['chooseSections']
                }
                else{
                        obj.chooseSections=JSON.stringify(obj.chooseSections);
                }

                if(JSON.stringify(obj.customSections)==JSON.stringify(self.section.customSections)){
                    delete obj['customSections']
                }
                else{
                    obj.customSections=JSON.stringify(obj.customSections);
                }

                if(obj.hospFillPeople==self.section.hospFillPeople){
                    delete obj['hospFillPeople']
                }
                if(obj.fillDepartment==self.section.fillDepartment){
                    delete obj['fillDepartment']
                }
                if(obj.fillPeopleTelephone==self.section.fillPeopleTelephone){
                    delete obj['fillPeopleTelephone']
                }
                if(obj.hospLeader==self.section.hospLeader){
                    delete obj['hospLeader']
                }
                if(obj.hospFillDate==self.section.hospFillDate){
                    delete obj['hospFillDate']
                }
                 
                console.log(obj)
                Vue.ajax.send({
                    name: self.urlSave[self.curIndex],
                    data: {
                        value:JSON.stringify([obj]),
                        hospId:self.Id,
                        updateUser:Vue.getUser().userName
                    },
                    success: function(data) {
                        if (!!data && data.code=='0') {
                            if(self.Id==''){
                                    self.$Message.success('信息保存成功！');
                                    self.canEdit=false;
                                    self.curIndex=0;
                                    self.getInfo();
                                    self.Id=data.data.Id;
                                    console.log(self.Id);                      
                            }else{
                                self.$Message.success('信息保存成功！');
                                // self.getInfo();
                                self.canEdit=false;
                            } 
                        } else {                      
                        self.$Message.error('信息保存失败，请重试！')
                        }
                        self.currentValid=false;
                    }
                });
            }
            
            return;


            var self=this
            console.log(this.sectionNew)
            var basicNew=[],chargeNew=[],uploadNew=[],systemNew=[],codeNew=[],sectionNew=[];
            var tempObj=Object.assign({},this.basicNew);
            delete tempObj['testing'];
            basicNew.push(tempObj);
            chargeNew= this.chargeNew.assign();
            uploadNew=this.uploadNew.assign();
            systemNew.push(Object.assign({},this.systemNew));
            codeNew.push(Object.assign({},this.codeNew));
            sectionNew.push(Object.assign({},this.sectionNew));
            // if(this.curIndex==1){
            //     for (var i = 0; i <chargeNew.length ; i++) {
            //         chargeNew[i].hospChargeId=this.charge.findProperty("post",chargeNew[i].post).hospChargeId;
            //     }
            // }
            // if(this.curIndex==2){
            //     for (var i = 0; i <uploadNew.length; i++) {
            //         uploadNew[i].uploadChargeId=this.upload.findProperty("post",uploadNew[i].post).uploadChargeId;
            //     }
            // }
            /*if(this.curIndex==5){
                for (var i = 0; i <sectionNew[0].chooseSections.length; i++) {
                    sectionNew[0].chooseSections[i].hospSectionId=this.section.chooseSections.findProperty("post",sectionNew[0].chooseSections[i].post).hospSectionId;
                }
            }*/
            systemNew[0].hospComputerSystem=JSON.stringify(systemNew[0].hospComputerSystem);
            systemNew[0].internetCondition=JSON.stringify(systemNew[0].internetCondition);
            systemNew[0].internetPort=JSON.stringify(systemNew[0].internetPort);
            systemNew[0].hisSystem=JSON.stringify(systemNew[0].hisSystem);
            systemNew[0].hisSystemDatabase=JSON.stringify(systemNew[0].hisSystemDatabase);
            codeNew[0].drugCode=JSON.stringify(codeNew[0].drugCode);
            codeNew[0].operationCode=JSON.stringify(codeNew[0].operationCode);
            codeNew[0].diseaseCode=JSON.stringify(codeNew[0].diseaseCode);
            codeNew[0].pathologyCode=JSON.stringify(codeNew[0].pathologyCode);
            sectionNew[0].chooseSections=JSON.stringify(sectionNew[0].chooseSections);
            sectionNew[0].customSections=JSON.stringify(sectionNew[0].customSections);

            this.infoList=[JSON.stringify(basicNew),JSON.stringify(chargeNew),JSON.stringify(uploadNew),JSON.stringify(systemNew),JSON.stringify(codeNew),JSON.stringify(sectionNew)];  
            Vue.ajax.send({
                name: self.urlSave[self.curIndex],
                data: {
                    value:self.infoList[self.curIndex],
                    hospId:self.Id,
                    updateUser:Vue.getUser().userName
                },
                success: function(data) {
                    if (!!data && data.code=='0') {
                        if(self.Id==''){
                            if(self.curIndex<5){
                               self.curIndex++; 
                            }else{
                                self.$Message.success('信息保存成功,并已提交审核！');
                                self.canEdit=false;
                                self.curIndex=0;
                                self.getInfo();
                                self.Id=data.data.Id;
                                console.log(self.Id);
                            }                            
                        }else{
                            self.$Message.success('信息保存成功！');
                            self.canEdit=false;
                        } 
                    } else {                      
                      self.$Message.error('信息保存失败，请重试！')
                    }
                }
            });
        },
        getInfo(){            
            var self=this;
            Vue.ajax.send({
                name: self.urlGet[self.curIndex],
                data: {hospId:self.Id},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.editing=null;
                        if(self.curIndex==0){
                           self.basicNew={};
                           self.basic=data.data[0]?data.data[0]:data.data;        
                        //    self.basicNew=JSON.parse(JSON.stringify(self.basic));                   
                        }else if(self.curIndex==1){
                            self.chargeNew=[];
                            self.charge=data.data.sortProperty('post');
                            if(self.charge.length==0){
                                self.charge=[{
                                        post:1
                                    },{
                                        post:2
                                    },{
                                        post:3
                                    },{
                                        post:4
                                    },{
                                        post:5
                                    },{
                                        post:6
                                    },{
                                        post:7
                                    },{
                                        post:8
                                    }]
                                self.chargeNew=self.charge.map(item=>{
                                    return{
                                        post:item.post
                                    }
                                })
                            }
                            else{
                                self.chargeNew=self.charge.map(item=>{
                                    return{
                                        post:item.post,
                                        hospChargeId:item.hospChargeId
                                    }
                                })
                            }
                            // self.chargeNew=JSON.parse(JSON.stringify(self.charge));
                        }else if(self.curIndex==2){
                            self.uploadNew=[];
                            self.upload=data.data.sortProperty('post');
                            if(self.upload.length==0){
                                self.upload=[{
                                        post:1,
                                    },{
                                        post:2
                                    },{
                                        post:3
                                    },{
                                        post:4
                                    },{
                                        post:5
                                    }];
                                self.uploadNew=self.upload.map(item=>{
                                    return{
                                        post:item.post
                                    }
                                })
                            }
                            else{
                                self.uploadNew=self.upload.map(item=>{
                                    return{
                                        post:item.post,
                                        uploadChargeId:item.uploadChargeId
                                    }
                                })
                            }
                        }else if(self.curIndex==3){
                            self.system=data.data[0]?data.data[0]:{};
                            if(!self.system.hospComputerSystem){
                                self.system.hospComputerSystem=[];
                            }else{
                                self.system.hospComputerSystem=JSON.parse(self.system.hospComputerSystem);
                            }
                            if(!self.system.internetCondition){
                                self.system.internetCondition=[];
                            }else{
                                self.system.internetCondition=JSON.parse(self.system.internetCondition);
                            }
                            if(!self.system.internetPort){
                                self.system.internetPort=[];
                            }else{
                                self.system.internetPort=JSON.parse(self.system.internetPort);
                            }
                            if(!self.system.hisSystem){
                                self.system.hisSystem=[];
                            }else{
                                self.system.hisSystem=JSON.parse(self.system.hisSystem);
                            }
                            if(!self.system.hisSystemDatabase){
                                self.system.hisSystemDatabase=[];
                            }else{
                                self.system.hisSystemDatabase=JSON.parse(self.system.hisSystemDatabase);
                            }
                            self.system.bandwidthSize=self.system.bandwidthSize || ""
                            // self.system.isOutpatientHis=self.system.isOutpatientHis || "";
                            // self.system.isMedicalRecord=self.system.isMedicalRecord || "";
                            // self.system.isOutPatient=self.system.isOutPatient || "";
                            // self.system.isWardHis=self.system.isWardHis || "";
                            self.systemNew=JSON.parse(JSON.stringify(self.system));
                            var temp1=self.systemNew.hospComputerSystem.filter(m=>{
                                return self.hospComputerSystemList.indexOf(m)<0
                            })[0];
                            if(temp1){
                                self.system.hospComputerSystem.splice(self.system.hospComputerSystem.indexOf(temp1),1,temp1.split("：")[0]+"：");
                                self.systemNew.hospComputerSystem.splice(self.systemNew.hospComputerSystem.indexOf(temp1),1,temp1.split("：")[0]+"：");
                                self.systemNew.hospComputerSystemOther=temp1.split("：")[1];
                                self.system.hospComputerSystemOther=temp1.split("：")[1];
                            }
                            var temp2=self.systemNew.hisSystemDatabase.filter(m=>{
                                return self.hisSystemDatabaseList.indexOf(m)<0
                            })[0];
                            if(temp2){
                                self.system.hisSystemDatabase.splice(self.system.hisSystemDatabase.indexOf(temp2),1,temp2.split("：")[0]+"：");
                                self.systemNew.hisSystemDatabase.splice(self.systemNew.hisSystemDatabase.indexOf(temp2),1,temp2.split("：")[0]+"：");
                                self.systemNew.hisSystemDatabaseOther=temp2.split("：")[1];
                                self.system.hisSystemDatabaseOther=temp2.split("：")[1];
                            }
                            var temp3=self.systemNew.hisSystem.filter(m=>{
                                return self.hisSystemList.indexOf(m)<0
                            })[0];
                            if(temp3){
                                self.system.hisSystem.splice(self.system.hisSystem.indexOf(temp3),1,temp3.split("：")[0]+"：");
                                self.systemNew.hisSystem.splice(self.systemNew.hisSystem.indexOf(temp3),1,temp3.split("：")[0]+"：");
                                self.systemNew.hisSystemOther=temp3.split("：")[1];
                                self.system.hisSystemOther=temp3.split("：")[1];
                            }
                            var temp4=self.systemNew.internetCondition.filter(m=>{
                                return self.internetConditionList.indexOf(m)<0
                            })[0];
                            if(temp4){
                                self.system.internetCondition.splice(self.system.internetCondition.indexOf(temp4),1,temp4.split("：")[0]+"：");
                                self.systemNew.internetCondition.splice(self.systemNew.internetCondition.indexOf(temp4),1,temp4.split("：")[0]+"：");
                                self.systemNew.internetConditionOther=temp4.split("：")[1];
                                self.system.internetConditionOther=temp4.split("：")[1];
                            }

                            var temp5=self.systemNew.internetPort.filter(m=>{
                                return self.internetPortList.indexOf(m)<0
                            })[0];
                            if(temp5){
                                self.system.internetPort.splice(self.system.internetPort.indexOf(temp5),1,temp5.split("：")[0]+"：");
                                self.systemNew.internetPort.splice(self.systemNew.internetPort.indexOf(temp5),1,temp5.split("：")[0]+"：");
                                self.systemNew.internetPortOther=temp5.split("：")[1];
                                self.system.internetPortOther=temp5.split("：")[1];
                            }
                            console.log(self.systemNew)
                        }else if(self.curIndex==4){
                            self.code=data.data[0]?data.data[0]:{};
                            if(!self.code.drugCode){
                                self.code.drugCode=[];
                            }else{
                                self.code.drugCode=JSON.parse(self.code.drugCode);
                            }
                            if(!self.code.operationCode){
                                self.code.operationCode=[];
                            }else{
                                self.code.operationCode=JSON.parse(self.code.operationCode);
                            }
                            if(!self.code.diseaseCode){
                                self.code.diseaseCode=[];
                            }else{
                                self.code.diseaseCode=JSON.parse(self.code.diseaseCode);
                            }
                            if(!self.code.pathologyCode){
                                self.code.pathologyCode=[];
                            }else{
                                self.code.pathologyCode=JSON.parse(self.code.pathologyCode);
                            }
                            self.codeNew=JSON.parse(JSON.stringify(self.code));

                            var temp1=self.codeNew.drugCode.filter(m=>{
                                return self.drugCodeList.indexOf(m)<0
                            })[0];
                            if(temp1){
                                self.code.drugCode.splice(self.code.drugCode.indexOf(temp1),1,temp1.split("：")[0]+"：");
                                self.codeNew.drugCode.splice(self.codeNew.drugCode.indexOf(temp1),1,temp1.split("：")[0]+"：");
                                self.codeNew.drugCodeOther=temp1.split("：")[1];
                                self.code.drugCodeOther=temp1.split("：")[1];
                            }

                            var temp2=self.codeNew.operationCode.filter(m=>{
                                return self.operationCodeList.indexOf(m)<0
                            })[0];
                            if(temp2){
                                self.code.operationCode.splice(self.code.operationCode.indexOf(temp2),1,temp2.split("：")[0]+"：");
                                self.codeNew.operationCode.splice(self.codeNew.operationCode.indexOf(temp2),1,temp2.split("：")[0]+"：");
                                self.codeNew.operationCodeOther=temp2.split("：")[1];
                                self.code.operationCodeOther=temp2.split("：")[1];
                            }

                            var temp3=self.codeNew.diseaseCode.filter(m=>{
                                return self.diseaseCodeList.indexOf(m)<0
                            })[0];
                            if(temp3){
                                self.code.diseaseCode.splice(self.code.diseaseCode.indexOf(temp3),1,temp3.split("：")[0]+"：");
                                self.codeNew.diseaseCode.splice(self.codeNew.diseaseCode.indexOf(temp3),1,temp3.split("：")[0]+"：");
                                self.codeNew.diseaseCodeOther=temp3.split("：")[1];
                                self.code.diseaseCodeOther=temp3.split("：")[1];
                            }

                            var temp4=self.codeNew.pathologyCode.filter(m=>{
                                return self.pathologyCodeList.indexOf(m)<0
                            })[0];
                            if(temp4){
                                self.code.pathologyCode.splice(self.code.pathologyCode.indexOf(temp4),1,temp4.split("：")[0]+"：");
                                self.codeNew.pathologyCode.splice(self.codeNew.pathologyCode.indexOf(temp4),1,temp4.split("：")[0]+"：");
                                self.codeNew.pathologyCodeOther=temp4.split("：")[1];
                                self.code.pathologyCodeOther=temp4.split("：")[1];
                            }

                            console.log(self.codeNew)
                        }else if(self.curIndex==5){
                            self.section=data.data[0]?data.data[0]:data.data; 
                            if(!self.section.chooseSections){
                                self.section.chooseSections=[];
                            }
                            else{
                                self.section.chooseSections=JSON.parse(self.section.chooseSections);
                            }
                            if(!self.section.customSections){
                                self.section.customSections=[];
                            }
                            else{
                                self.section.customSections=JSON.parse(self.section.customSections);
                            }
                            if(!self.sectionNew.chooseSections){
                                self.sectionNew.chooseSections=[];
                            }
                            if(!self.sectionNew.customSections){
                                self.sectionNew.customSections=[];
                            }
                            console.log(self.sectionNew);
                            self.sectionAss();
                            self.section.isSectionLevel=Vue.isNull(self.section.isSectionLevel)?null:self.section.isSectionLevel;
                            self.section.sectionLevel=Vue.isNull(self.section.sectionLevel)?null:self.section.sectionLevel;
                            self.section.isSectionRequest=Vue.isNull(self.section.isSectionRequest)?null:self.section.isSectionRequest;
                            self.section.hospFillPeople=Vue.isNull(self.section.hospFillPeople)?null:self.section.hospFillPeople;
                            self.section.fillDepartment=Vue.isNull(self.section.fillDepartment)?null:self.section.fillDepartment;
                            self.section.fillPeopleTelephone=Vue.isNull(self.section.fillPeopleTelephone)?null:self.section.fillPeopleTelephone;
                            self.section.hospLeader=Vue.isNull(self.section.hospLeader)?null:self.section.hospLeader;
                            self.section.hospFillDate=Vue.isNull(self.section.hospFillDate)?null:self.section.hospFillDate;

                            self.sectionNew.isSectionLevel=self.section.isSectionLevel;
                            self.sectionNew.sectionLevel=self.section.sectionLevel;
                            self.sectionNew.isSectionRequest=self.section.isSectionRequest;
                            self.sectionNew.hospFillPeople=self.section.hospFillPeople;
                            self.sectionNew.fillDepartment=self.section.fillDepartment;
                            self.sectionNew.fillPeopleTelephone=self.section.fillPeopleTelephone;
                            self.sectionNew.hospLeader=self.section.hospLeader;
                            self.sectionNew.hospFillDate=self.section.hospFillDate;
                            self.sectionNew.chooseSections=JSON.parse(JSON.stringify(self.section.chooseSections));
                            self.sectionNew.customSections=JSON.parse(JSON.stringify(self.section.customSections));
                            self.sectionNew.hospSectionId=self.section.hospSectionId;
                            console.log(self.sectionNew);
                        }                        
                    } else {              
                    }
                }
            });
        },
        exportTabel(eve){

            var html = "<html><head><meta charset='utf-8' />"+
                '<style>'+
                'table td,table th{'+
                  'font-size:14px;text-align: left'+
                '}'+
                '</style>'+
            "</head><body>";
            for (var i = 0; i < document.getElementsByTagName("table").length; i++) {
                html+=document.getElementsByTagName("table")[i].outerHTML
            }
            html+="</body></html>";
            html=html.replace(/class="common-table"/g, "border='1'");
            html=html.replace(/<div class="radio-con"><input type="radio"/g, "<input type='radio'");
            html=html.replace(/<div class="checkbox-con"><input type="checkbox"/g, "<input type='checkbox'");
            html=html.replace(/<label><\/label><\/div>/g, "");
            html=html.replace(/<td/g, "<td height='30'"); 
            html=html.replace(/<span class=\"text-red\">*<\/span>/g, ""); 
            
            html=html.replace(/disabled="disabled">/g, "disabled='disabled'>&nbsp;&nbsp;&nbsp;");   
            html=html.replace(/<span class="text-red">\*<\/span>/g, "");
            var blob = new Blob([html], { type: "application/vnd.ms-excel" });
            var a = document.getElementById('exportTabel');
            a.href = URL.createObjectURL(blob);
            a.download = this.basic.hospName+"登记表.xls";
 
        }
    }

};
</script>
<style>

.common-table{
  margin-bottom: 20px;
  width: 100%;
  border-spacing: 0;
  border-left: #e4eaec 1px solid;
  border-top: #e4eaec 1px solid;
  table-layout:fixed;
}
.common-table td,.common-table th{
  border-right: #e4eaec 1px solid;
  border-bottom: #e4eaec 1px solid;
  padding: 4px 8px;
}
.common-table th{
  text-align: left;
}
/* .common-table tr th:last-child,
.common-table tr td:last-child{
  text-align: center;
} */
.common-table .btn{
  height: 30px;
  line-height: 30px;
  width: 30px;
  padding: 0;
  text-align: center;
}
/* .common-table tbody tr{
  background: #f9f9f9;
}
.common-table tbody tr:nth-child(2n){
  background: #f3f3f4;
} */
/* 复选框样式 */
.checkbox-con{
    position: relative;
    width: 14px;
    height: 14px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
}
.checkbox-con input[type="checkbox"]{ 
    opacity: 0;     
    width: 14px;
    height: 14px;
    position: absolute; 
    top: 0; 
    left: 0;
    z-index: 10;
    margin: 0;
} 
.checkbox-con input[type="checkbox"] + label{
    display: inline-block;      
    width: 14px;
    height: 14px;
    background: #fff;
    border: 1px solid #dddfe3;
    position: absolute; 
    top: 0px;
    left: 0px;
    z-index: 1;
}
.checkbox-con input[type="checkbox"]:checked + label{
    border: 1px solid #2d8cf0;
}
.checkbox-con input[type="checkbox"]:checked + label:after{ 
    content: '√';
    font-size: 9px;
    font-weight: bold;
    color: #fff;
    display: block;   
    width: 14px;
    height: 14px;
    padding: 0;
    line-height: 12px;
    text-align: center;
    position: absolute;
    z-index: 20;
    background: #2d8cf0;
}
/* 单选样式 */
.radio-con{
    position: relative;
    width: 14px;
    height: 14px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
}
.radio-con input[type="radio"]{ 
    opacity: 0;   
    width: 14px;
    height: 14px;
    position: absolute; 
    top: 0; 
    left: 0;
    z-index: 10;
    margin: 0;
} 
.radio-con input[type="radio"] + label{
    display: inline-block; 
    width: 14px;
    height: 14px;
    background: #fff;
    border: 1px solid #dddfe3;
    position: absolute; 
    top: 0px;
    left: 0px;
    z-index: 1;
    border-radius: 50%;
}
.radio-con input[type="radio"]:checked + label{    
    border: 1px solid #2d8cf0;
}
.radio-con input[type="radio"]:checked + label:after { 
    content: '';
    z-index: 20;
    position: absolute; 
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    padding: 0;
    background-color: #2d8cf0;
    border-radius: 50%;
}
.common-table input{
    border: 1px solid #bccae2;
    padding: 3px 5px;
}
.file-export{
    margin-bottom: -40px;
    z-index:999;
    float:right;
    width:100px;
    margin-left:-80px;
    position:absolute;
    right:90px;
    /* bottom:90px; */
}
.pdtop{
    padding-top:20px;
}

.pdtop0 > .ivu-tabs-content {
    height: 852px;
}
.pdtop1 > .ivu-tabs-content {
    height: 1130px;
}
.pdtop2 > .ivu-tabs-content {
    height: 912px;
}
.pdtop3 > .ivu-tabs-content {
    height: 442px;
}
.pdtop4 > .ivu-tabs-content {
    height: 235px;
}
.pdtop5 > .ivu-tabs-content {
    height: 5600px;
}
</style>