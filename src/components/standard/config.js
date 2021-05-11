import config from "../../config";
export default {
    router: {
        path: "/standard",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [
            // 标准库映射表
            {
                path: "/standard/mapping/inHospital/list", //入院情况list页面
                component: resolve => require(['@/components/standard/mapping/inHospital/list'], resolve)
            },
            {
                path: "/standard/mapping/age/list", //年龄list页面
                component: resolve => require(['@/components/standard/mapping/age/list'], resolve)
            },
            {
                path: "/standard/mapping/disease/list", //疾病list页面
                component: resolve => require(['@/components/standard/mapping/disease/list'], resolve)
            },
            {
                path: "/standard/mapping/adviceType/list", //医嘱类型list页面
                component: resolve => require(['@/components/standard/mapping/adviceType/list'], resolve)
            },
            {
                path: "/standard/mapping/doctorTitle/list", //医生职称list页面
                component: resolve => require(['@/components/standard/mapping/doctorTitle/list'], resolve)
            },
            {
                path: "/standard/mapping/dosage/list", //剂量list页面
                component: resolve => require(['@/components/standard/mapping/dosage/list'], resolve)
            },
            {
                path: "/standard/mapping/form/list", //剂型list页面
                component: resolve => require(['@/components/standard/mapping/form/list'], resolve)
            },
            {
                path: "/standard/mapping/healing/list", //愈合list页面
                component: resolve => require(['@/components/standard/mapping/healing/list'], resolve)
            },
            {
                path: "/standard/mapping/medicalCompany/list", //医药企业list页面
                component: resolve => require(['@/components/standard/mapping/medicalCompany/list'], resolve)
            },
            {
                path: "/standard/mapping/drugs/list", //药品list页面
                component: resolve => require(['@/components/standard/mapping/drugs/list'], resolve)
            }, {
                path: "/standard/mapping/operation/list", //手术list页面
                component: resolve => require(['@/components/standard/mapping/operation/list'], resolve)
            },
            {
                path: "/standard/mapping/pathDrugPres/list", //给药途径-处方list页面
                component: resolve => require(['@/components/standard/mapping/pathDrugPres/list'], resolve)
            },
            {
                path: "/standard/mapping/pay/list", //付费方式list页面
                component: resolve => require(['@/components/standard/mapping/pay/list'], resolve)
            },
            {
                path: "/standard/mapping/office/list", //科室list页面
                component: resolve => require(['@/components/standard/mapping/office/list'], resolve)
            },
            {
                path: "/standard/mapping/sex/list", //性别list页面
                component: resolve => require(['@/components/standard/mapping/sex/list'], resolve)
            },
            {
                path: "/standard/mapping/cureResult/list", //治疗结果list页面
                component: resolve => require(['@/components/standard/mapping/cureResult/list'], resolve)
            },
            {
                path: "/standard/mapping/drugUse/list", //用法list页面
                component: resolve => require(['@/components/standard/mapping/drugUse/list'], resolve)
            },
            {
                path: "/standard/mapping/wound/list", //切口list页面
                component: resolve => require(['@/components/standard/mapping/wound/list'], resolve)
            },
            {
                path: "/standard/mapping/medicalCompany/add", //医药企业新增页面
                component: resolve => require(['@/components/standard/mapping/medicalCompany/add'], resolve)
            },
            {
                path: "/standard/mapping/drugs/add", //药品新增页面
                component: resolve => require(['@/components/standard/mapping/drugs/add'], resolve)
            },
            {
                path: "/standard/mapping/drugs/edit", //药品编辑页面
                component: resolve => require(['@/components/standard/mapping/drugs/edit'], resolve)
            },
            {
                path: "/standard/mapping/genericName/list", //通用名list页面
                component: resolve => require(['@/components/standard/mapping/genericName/list'], resolve)
            },
            {
                path: "/standard/mapping/saleEnterprise/list", //批发企业list页面
                component: resolve => require(['@/components/standard/mapping/saleEnterprise/list'], resolve)
            },
            {
                path: "/standard/mapping/tradeName/list", //商品名list页面
                component: resolve => require(['@/components/standard/mapping/tradeName/list'], resolve)
            },
            {
                path: "/standard/mapping/spec/list", //规格list页面
                component: resolve => require(['@/components/standard/mapping/spec/list'], resolve)
            },
            {
                path: "/standard/mapping/packageSpec/list", //包装规格list页面
                component: resolve => require(['@/components/standard/mapping/packageSpec/list'], resolve)
            },


            {
                path: "/standard/dictionary/reasonDictionary/list", //系统原因list页面
                component: resolve => require(['@/components/standard/dictionary/reasonDictionary/list'], resolve)
            },
            {
                path: "/standard/dictionary/reasonType/list", //系统原因类型list页面
                component: resolve => require(['@/components/standard/dictionary/reasonType/list'], resolve)
            },
            {
                path: "/standard/dictionary/city/list", //城市list页面
                component: resolve => require(['@/components/standard/dictionary/city/list'], resolve)
            },
            {
                path: "/standard/dictionary/city/add", //城市新增页面
                component: resolve => require(['@/components/standard/dictionary/city/add'], resolve)
            },
            {
                path: "/standard/dictionary/city/edit", //城市编辑页面
                component: resolve => require(['@/components/standard/dictionary/city/edit'], resolve)
            },
            {
                path: "/standard/dictionary/cityAggRelation/list", //城市群对应城市list页面
                component: resolve => require(['@/components/standard/dictionary/cityAggRelation/list'], resolve)
            },
            {
                path: "/standard/dictionary/cityGroup/list", //城市群list页面
                component: resolve => require(['@/components/standard/dictionary/cityGroup/list'], resolve)
            },
            {
                path: "/standard/dictionary/companyBloc/list", //生产厂家所属集团list页面
                component: resolve => require(['@/components/standard/dictionary/companyBloc/list'], resolve)
            },
            {
                path: "/standard/dictionary/compeleteReason/list", //质疑原因list页面
                component: resolve => require(['@/components/standard/dictionary/compeleteReason/list'], resolve)
            },
            {
                path: "/standard/dictionary/drugATC/list", //药品ATClist页面
                component: resolve => require(['@/components/standard/dictionary/drugATC/list2'], resolve)
            },
            {
                path: "/standard/dictionary/drugSDCC/list", //药品SDCClist页面
                component: resolve => require(['@/components/standard/dictionary/drugSDCC/list2'], resolve)
            },
            {
                path: "/standard/dictionary/drugsImport/list", //药品进口信息list页面
                component: resolve => require(['@/components/standard/dictionary/drugsImport/list'], resolve)
            },
            {
                path: "/standard/dictionary/economicArea/list", //经济区域list页面
                component: resolve => require(['@/components/standard/dictionary/economicArea/list'], resolve)
            },
            {
                path: "/standard/dictionary/fileCheck/list", //文件初检问题list页面
                component: resolve => require(['@/components/standard/dictionary/fileCheck/list'], resolve)
            },
            {
                path: "/standard/dictionary/injectionItem/list", //注射禁忌配伍问题list页面
                component: resolve => require(['@/components/standard/dictionary/injectionItem/list'], resolve)
            },
            {
                path: "/standard/dictionary/mappingRejected/list", //映射审核不通过list页面
                component: resolve => require(['@/components/standard/dictionary/mappingRejected/list'], resolve)
            },
            {
                path: "/standard/dictionary/pathDrug/list", //给药途径list页面
                component: resolve => require(['@/components/standard/dictionary/pathDrug/list'], resolve)
            },
            {
                path: "/standard/dictionary/unit/list", //计量单位list页面
                component: resolve => require(['@/components/standard/dictionary/unit/list'], resolve)
            },
            {
                path: "/standard/dictionary/drugSaltAcid/list", //盐酸根页面
                component: resolve => require(['@/components/standard/dictionary/drugSaltAcid/list'], resolve)
            },
            {
                path: "/standard/dictionary/formDrugPath/list", //药品剂型_给药途径页面
                component: resolve => require(['@/components/standard/dictionary/formDrugPath/list'], resolve)
            },
            {
                path: "/standard/dictionary/drugValidity/list", //药品有效期页面
                component: resolve => require(['@/components/standard/dictionary/drugValidity/list'], resolve)
            },
            {
                path: "/standard/mapping/saleEnterprise/add", //批发企业新增页面
                component: resolve => require(['@/components/standard/mapping/saleEnterprise/add'], resolve)
            },
            {
                path: "/standard/dictionary/wholesaleBloc/list", //批发厂家集团list页面
                component: resolve => require(['@/components/standard/dictionary/wholesaleBloc/list'], resolve)
            },
            {
                path: "/standard/dictionary/poinpackCompany/list", //分包装企业list页面
                component: resolve => require(['@/components/standard/dictionary/poinpackCompany/list'], resolve)
            },
            {
                path: "/standard/dictionary/poinpackCompany/add", //分包装企业新增页面
                component: resolve => require(['@/components/standard/dictionary/poinpackCompany/add'], resolve)
            },
            {
                path: "/standard/dictionary/drugCompany/list", //药品企业list页面
                component: resolve => require(['@/components/standard/dictionary/drugCompany/list'], resolve)
            },
            {
                path: "/standard/dictionary/drugTrade/list", //药品商品名list页面
                component: resolve => require(['@/components/standard/dictionary/drugTrade/list'], resolve)
            },
            {
                path: "/standard/dictionary/drugUnifiedSpec/list", //药品统一规格list页面
                component: resolve => require(['@/components/standard/dictionary/drugUnifiedSpec/list'], resolve)
            },
            {
                path: "/standard/dictionary/drugProduct/list", //药品产品名称list页面
                component: resolve => require(['@/components/standard/dictionary/drugProduct/list'], resolve)
            },
            {
                path: "/standard/mapping/medicalCompany/version", //医药企业版本list页面
                component: resolve => require(['@/components/standard/mapping/medicalCompany/version'], resolve)
            },
            {
                path: "/standard/mapping/saleEnterprise/version", //医药企业版本list页面
                component: resolve => require(['@/components/standard/mapping/saleEnterprise/version'], resolve)
            },
            {
                path: "/standard/dictionary/drugType/list", 
                component: resolve => require(['@/components/standard/dictionary/drugType/list'], resolve)
            }
        ]
    },
    urls: {
        //审核不通过原因
        "common.baseNoPassList": {
            'type': "POST",
            'real': "/base/reasonDictionary/query",
            'mock': "../../static/mock/business/hospitalList.json"
        },
        'reasonDict.list': {
            'type': 'POST',
            'real': '/base/reasonDictionary/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/cityList',
            'apiPrefix': config.apiPrefix
        },
        'reasonDict.add': {
            'type': 'POST',
            'real': '/base/reasonDictionary/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'reasonDict.edit': {
            'type': 'POST',
            'real': '/base/reasonDictionary/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'reasonDict.del': {
            'type': 'POST',
            'real': '/base/reasonDictionary/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'reasonDict.review': {
            'type': 'POST',
            'real': '/base/reasonDictionary/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //系统原因类型
        'reasonType.list': {
            'type': 'POST',
            'real': '/base/reasonType/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/cityList',
            'apiPrefix': config.apiPrefix
        },
        'reasonType.add': {
            'type': 'POST',
            'real': '/base/reasonType/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'reasonType.edit': {
            'type': 'POST',
            'real': '/base/reasonType/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'reasonType.del': {
            'type': 'POST',
            'real': '/base/reasonType/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },


        // 城市
        'city.list': {
            'type': 'POST',
            'real': '/base/city/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/cityList',
            'apiPrefix': config.apiPrefix

        },
        'city.countryList': {
            'type': 'POST',
            'real': '/base/country/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/provinceList',
            'apiPrefix': config.apiPrefix

        },
        'city.provinceList': {
            'type': 'POST',
            'real': '/base/province/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/provinceList',
            'apiPrefix': config.apiPrefix

        },
        'city.administrativeList': {
            'type': 'POST',
            'real': '/base/administrative/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/provinceList',
            'apiPrefix': config.apiPrefix
        },
        'city.ecoRegionList': {
            'type': 'POST',
            'real': '/base/economicRegion/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/provinceList',
            'apiPrefix': config.apiPrefix
        },
        'city.levelList': {
            'type': 'POST',
            'real': '/base/cityLevel/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/provinceList',
            'apiPrefix': config.apiPrefix
        },
        'city.typeList': {
            'type': 'POST',
            'real': '/base/cityType/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityList.json'
            'mock': '/mock/provinceList',
            'apiPrefix': config.apiPrefix
        },
        'city.del': {
            'type': 'POST',
            'real': '/base/city/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'city.add': {
            'type': 'POST',
            'real': '/base/city/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'city.edit': {
            'type': 'POST',
            'real': '/base/city/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'city.get': {
            'type': 'POST',
            'real': '/base/city/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 城市群定义
        'cityGroup.list': {
            'type': 'POST',
            'real': '/base/cityGroup/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityGroupList.json'
            'mock': '/mock/cityGroupList',
            'apiPrefix': config.apiPrefix
        },
        'cityGroup.del': {
            'type': 'POST',
            'real': '/base/cityGroup/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'cityGroup.add': {
            'type': 'POST',
            'real': '/base/cityGroup/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'cityGroup.edit': {
            'type': 'POST',
            'real': '/base/cityGroup/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 城市群对应城市
        'cityAggRelation.list': {
            'type': 'POST',
            'real': '/base/cityGroupRelation/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/cityGroupList.json'
            'mock': '/mock/cityAggRelationList',
            'apiPrefix': config.apiPrefix

        },
        'cityAggRelation.del': {
            'type': 'POST',
            'real': '/base/cityGroupRelation/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'cityAggRelation.add': {
            'type': 'POST',
            'real': '/base/cityGroupRelation/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'cityAggRelation.edit': {
            'type': 'POST',
            'real': '/base/cityGroupRelation/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 生产厂家所属集团
        'companyBloc.list': {
            'type': 'POST',
            'real': '/base/companyBloc/query',
            'mock': '/mock/companyBlocList',
            'apiPrefix': config.apiPrefix

        },
        'companyBloc.del': {
            'type': 'POST',
            'real': '/base/companyBloc/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'companyBloc.add': {
            'type': 'POST',
            'real': '/base/companyBloc/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'companyBloc.edit': {
            'type': 'POST',
            'real': '/base/companyBloc/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'companyBloc.getBlocList':{
            'type': 'POST',
            'real': '/base/medicalCompany/getBlocList',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'companyBloc.review': {
            'type': 'POST',
            'real': '/base/companyBloc/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 质疑原因
        'query.list': {
            'type': 'POST',
            'real': '/base/completeReason/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/queryList.json'
            'mock': '/mock/queryList',
            'apiPrefix': config.apiPrefix

        },
        'query.del': {
            'type': 'POST',
            'real': '/base/completeReason/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'query.add': {
            'type': 'POST',
            'real': '/base/completeReason/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'query.edit': {
            'type': 'POST',
            'real': '/base/completeReason/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 药品ATC分类
        'drugAtc.list': {
            'type': 'POST',
            'real': '/base/drugTypeAtc/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugAtcList.json'
            'mock': '/mock/drugAtcList',
            'apiPrefix': config.apiPrefix

        },
         // 药品ATC分类2
         'drugAtcL4.list': {
            'type': 'POST',
            'real': '/base/drugTypeAtc/queryL4',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugAtcList.json'
            'mock': '/mock/drugAtcList',
            'apiPrefix': config.apiPrefix

        },
        'drugAtc.del': {
            'type': 'POST',
            'real': '/base/drugTypeAtc/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugAtc.add': {
            'type': 'POST',
            'real': '/base/drugTypeAtc/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugAtc.edit': {
            'type': 'POST',
            'real': '/base/drugTypeAtc/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugAtc.review': {
            'type': 'POST',
            'real': '/base/drugTypeAtc/Operation',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 药品SDCCC分类
        'drugSdcc.list': {
            'type': 'POST',
            'real': '/base/drugTypeSdcc/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugSdccList.json'
            'mock': '/mock/drugSdccList',
            'apiPrefix': config.apiPrefix

        },
        // 药品SDCCC分类
        'drugSdccL4.list': {
            'type': 'POST',
            'real': '/base/drugTypeSdcc/queryL4',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugSdccList.json'
            'mock': '/mock/drugSdccList',
            'apiPrefix': config.apiPrefix

        },
        'drugSdcc.del': {
            'type': 'POST',
            'real': '/base/drugTypeSdcc/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugSdcc.add': {
            'type': 'POST',
            'real': '/base/drugTypeSdcc/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugSdcc.edit': {
            'type': 'POST',
            'real': '/base/drugTypeSdcc/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugSdcc.review': {
            'type': 'POST',
            'real': '/base/drugTypeSdcc/Operation',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 进口药品信息
        'drugsImport.list': {
            'type': 'POST',
            'real': '/base/drugImport/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugsImportList.json'
            'mock': '/mock/drugsImportList',
            'apiPrefix': config.apiPrefix

        },
        'drugsImport.add': {
            'type': 'POST',
            'real': '/base/drugImport/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugsImport.edit': {
            'type': 'POST',
            'real': '/base/drugImport/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugsImport.del': {
            'type': 'POST',
            'real': '/base/drugImport/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugsImport.review': {
            'type': 'POST',
            'real': '/base/drugImport/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugsImport.list': {
            'type': 'POST',
            'real': '/base/drugImport/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugsImportList.json'
            'mock': '/mock/drugsImportList',
            'apiPrefix': config.apiPrefix

        },
        //盐酸根
        'drugSaltAcid.add': {
            'type': 'POST',
            'real': '/base/saltAcid/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugSaltAcid.edit': {
            'type': 'POST',
            'real': '/base/saltAcid/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugSaltAcid.del': {
            'type': 'POST',
            'real': '/base/saltAcid/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugSaltAcid.review': {
            'type': 'POST',
            'real': '/base/saltAcid/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugSaltAcid.list': {
            'type': 'POST',
            'real': '/base/saltAcid/query',
            // 'mock': '../../../../../static/mockdev/standard/dictionary/drugsImportList.json'
            'mock': '/mock/drugsImportList',
            'apiPrefix': config.apiPrefix

        },
        //药品剂型_给药途径
        'formDrugPath.add': {
            'type': 'POST',
            'real': '/base/formDrugPath/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'formDrugPath.edit': {
            'type': 'POST',
            'real': '/base/formDrugPath/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'formDrugPath.del': {
            'type': 'POST',
            'real': '/base/formDrugPath/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'formDrugPath.review': {
            'type': 'POST',
            'real': '/base/formDrugPath/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'formDrugPath.list': {
            'type': 'POST',
            'real': '/base/formDrugPath/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugsImportList.json'
            'mock': '/mock/drugsImportList',
            'apiPrefix': config.apiPrefix

        },
        //药品有效期
        'drugValidity.add': {
            'type': 'POST',
            'real': '/base/drugValidity/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugValidity.edit': {
            'type': 'POST',
            'real': '/base/drugValidity/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugValidity.del': {
            'type': 'POST',
            'real': '/base/drugValidity/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugValidity.review': {
            'type': 'POST',
            'real': '/base/drugValidity/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugValidity.list': {
            'type': 'POST',
            'real': '/base/drugValidity/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/drugsImportList.json'
            'mock': '/mock/drugsImportList',
            'apiPrefix': config.apiPrefix

        },
        // 经济区域
        'economic.list': {
            'type': 'POST',
            'real': '/base/economicRegion/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/economicList.json'
            'mock': '/mock/economicList',
            'apiPrefix': config.apiPrefix

        },
        'economic.del': {
            'type': 'POST',
            'real': '/base/economicRegion/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'economic.add': {
            'type': 'POST',
            'real': '/base/economicRegion/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'economic.edit': {
            'type': 'POST',
            'real': '/base/economicRegion/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 文件初检问题-处方
        'fileCheck.list': {
            'type': 'POST',
            'real': '/base/blankOutReason/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/fileCheckList.json'
            'mock': '/mock/fileCheckList',
            'apiPrefix': config.apiPrefix
        },
        'fileCheck.del': {
            'type': 'POST',
            'real': '/base/blankOutReason/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'fileCheck.add': {
            'type': 'POST',
            'real': '/base/blankOutReason/Add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'fileCheck.edit': {
            'type': 'POST',
            'real': '/base/blankOutReason/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'fileCheck.review': {
            'type': 'POST',
            'real': '/base/blankOutReason/Operation',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 注射剂配伍禁忌项
        'injection.list': {
            'type': 'POST',
            'real': '/base/incompatyInjectionItem/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/injectionList.json'
            'mock': '/mock/injectionList',
            'apiPrefix': config.apiPrefix

        },
        'injection.del': {
            'type': 'POST',
            'real': '/base/incompatyInjectionItem/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'injection.add': {
            'type': 'POST',
            'real': '/base/incompatyInjectionItem/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'injection.edit': {
            'type': 'POST',
            'real': '/base/incompatyInjectionItem/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'injection.review': {
            'type': 'POST',
            'real': '/base/incompatyInjectionItem/Operation',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 映射审核不通过原因
        'mapRejected.list': {
            'type': 'POST',
            'real': '/base/unAuditReason/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/mapRejectedList.json'
            'mock': '/mock/mapRecjectedList',
            'apiPrefix': config.apiPrefix
        },
        'mapRejected.baseTypeList': {
            'type': 'POST',
            'real': '/base/unAuditType/query',
            'mock': '/mock/mapBaseTypeList',
            'apiPrefix': config.apiPrefix
        },
        'mapRejected.del': {
            'type': 'POST',
            'real': '/base/unAuditReason/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'mapRejected.add': {
            'type': 'POST',
            'real': '/base/unAuditReason/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'mapRejected.edit': {
            'type': 'POST',
            'real': '/base/unAuditReason/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },

        // 给药途径
        'pathDrug.list': {
            'type': 'POST',
            'real': '/base/pathDrug/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/pathDrugList.json'
            'mock': '/mock/drugPathList',
            'apiPrefix': config.apiPrefix

        },
        'pathDrug.del': {
            'type': 'POST',
            'real': '/base/pathDrug/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pathDrug.add': {
            'type': 'POST',
            'real': '/base/pathDrug/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pathDrug.edit': {
            'type': 'POST',
            'real': '/base/pathDrug/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pathDrug.review': {
            'type': 'POST',
            'real': '/base/pathDrug/Operation',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 计量单位
        'unit.list': {
            'type': 'POST',
            'real': '/base/unit/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/unitList',
            'apiPrefix': config.apiPrefix
        },
        'unit.del': {
            'type': 'POST',
            'real': '/base/unit/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'unit.add': {
            'type': 'POST',
            'real': '/base/unit/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'unit.edit': {
            'type': 'POST',
            'real': '/base/unit/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },


        // 标准库-----映射表
        //  入院情况
        'inHosp.list': {
            'type': 'POST',
            'real': '/base/admissionOf/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/inHospList',
            'apiPrefix': config.apiPrefix
        },
        'inHosp.del': {
            'type': 'POST',
            'real': '/base/admissionOf/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'inHosp.add': {
            'type': 'POST',
            'real': '/base/admissionOf/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'inHosp.edit': {
            'type': 'POST',
            'real': '/base/admissionOf/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'inHosp.review': {
            'type': 'POST',
            'real': '/base/admissionOf/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //年龄
        'age.list': {
            'type': 'POST',
            'real': '/base/age/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/ageList',
            'apiPrefix': config.apiPrefix
        },
        'age.rangeList': {
            'type': 'POST',
            'real': '/base/ageRange/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/ageList',
            'apiPrefix': config.apiPrefix
        },
        'age.growList': {
            'type': 'POST',
            'real': '/base/ageGrowPeriod/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/ageList',
            'apiPrefix': config.apiPrefix
        },
        'age.del': {
            'type': 'POST',
            'real': '/base/age/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'age.add': {
            'type': 'POST',
            'real': '/base/age/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'age.edit': {
            'type': 'POST',
            'real': '/base/age/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'age.review': {
            'type': 'POST',
            'real': '/base/age/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 疾病
        'disease.list': {
            'type': 'POST',
            'real': '/base/diseaseType/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/diseaseList',
            'apiPrefix': config.apiPrefix
        },
        'disease.keyWordList': {
            'type': 'POST',
            'real': '/base/diseaseType/queryByKeyWord',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/diseaseList',
            'apiPrefix': config.apiPrefix
        },
        'disease.del': {
            'type': 'POST',
            'real': '/base/diseaseType/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'disease.add': {
            'type': 'POST',
            'real': '/base/diseaseType/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'disease.edit': {
            'type': 'POST',
            'real': '/base/diseaseType/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'disease.review': {
            'type': 'POST',
            'real': '/base/diseaseType/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 医嘱类别
        'adviceType.list': {
            'type': 'POST',
            'real': '/base/doctorAdviceType/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/adviceTypeList',
            'apiPrefix': config.apiPrefix
        },
        'adviceType.del': {
            'type': 'POST',
            'real': '/base/doctorAdviceType/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'adviceType.add': {
            'type': 'POST',
            'real': '/base/doctorAdviceType/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'adviceType.edit': {
            'type': 'POST',
            'real': '/base/doctorAdviceType/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'adviceType.review': {
            'type': 'POST',
            'real': '/base/doctorAdviceType/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 医生职称
        'doctorTitle.list': {
            'type': 'POST',
            'real': '/base/doctorTitle/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/doctorTitleList',
            'apiPrefix': config.apiPrefix
        },
        'doctorTitle.del': {
            'type': 'POST',
            'real': '/base/doctorTitle/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'doctorTitle.add': {
            'type': 'POST',
            'real': '/base/doctorTitle/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'doctorTitle.edit': {
            'type': 'POST',
            'real': '/base/doctorTitle/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'doctorTitle.review': {
            'type': 'POST',
            'real': '/base/doctorTitle/apply',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 剂量
        'dosage.list': {
            'type': 'POST',
            'real': '/base/dosage/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/dosageList',
            'apiPrefix': config.apiPrefix
        },
        'dosage.del': {
            'type': 'POST',
            'real': '/base/dosage/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'dosage.add': {
            'type': 'POST',
            'real': '/base/dosage/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'dosage.edit': {
            'type': 'POST',
            'real': '/base/dosage/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'dosage.review': {
            'type': 'POST',
            'real': '/base/dosage/apply',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 剂型
        'form.list': {
            'type': 'POST',
            'real': '/base/form/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/formList',
            'apiPrefix': config.apiPrefix
        },
        'form.treeList': {
            'type': 'POST',
            'real': '/base/form/treeQuery',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/formList',
            'apiPrefix': config.apiPrefix
        },
        'form.del': {
            'type': 'POST',
            'real': '/base/form/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'form.add': {
            'type': 'POST',
            'real': '/base/form/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'form.edit': {
            'type': 'POST',
            'real': '/base/form/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'form.review': {
            'type': 'POST',
            'real': '/base/form/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 愈合
        'healing.list': {
            'type': 'POST',
            'real': '/base/healing/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/healingList',
            'apiPrefix': config.apiPrefix
        },
        'healing.del': {
            'type': 'POST',
            'real': '/base/healing/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'healing.add': {
            'type': 'POST',
            'real': '/base/healing/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'healing.edit': {
            'type': 'POST',
            'real': '/base/healing/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'healing.review': {
            'type': 'POST',
            'real': '/base/healing/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 医药企业
        'medical.list': {
            'type': 'POST',
            'real': '/base/medicalCompany/query', // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/factoryList',
            'apiPrefix': config.apiPrefix
        },
        'medical.del': {
            'type': 'POST',
            'real': '/base/medicalCompany/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medical.add': {
            'type': 'POST',
            'real': '/base/medicalCompany/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medical.edit': {
            'type': 'POST',
            'real': '/base/medicalCompany/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medical.get': {
            'type': 'POST',
            'real': '/base/medicalCompany/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medical.review': {
            'type': 'POST',
            'real': '/base/medicalCompany/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medical.companyTypeList': {
            'type': 'POST',
            'real': '/base/companyType/query',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 药品信息
        'drugs.list': {
            'type': 'POST',
            'real': '/base/drug/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.del': {
            'type': 'POST',
            'real': '/base/drug/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugs.add': {
            'type': 'POST',
            'real': '/base/drug/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugs.edit': {
            'type': 'POST',
            'real': '/base/drug/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugs.review': {
            'type': 'POST',
            'real': '/base/drug/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugClassy.list': {
            'type': 'POST',
            'real': '/base/drugClassy/query',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugPackageMaterial.list': {
            'type': 'POST',
            'real': '/base/drugPackageMaterial/query',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugOwnRange.list': {
            'type': 'POST',
            'real': '/base/drugOwnRange/query',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'otcClassy.list': {
            'type': 'POST',
            'real': '/base/otcClassy/query',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'riskPregnancyGrade.list': {
            'type': 'POST',
            'real': '/base/riskPregnancyGrade/query',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugs.viewDruglist': {
            'type': 'POST',
            'real': '/base/viewDrug/query',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.byLevelList': {
            'type': 'POST',
            'real': '/base/viewDrug/queryByLevel',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.genericList': {
            'type': 'POST',
            'real': '/base/viewDrug/queryGeneric',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.specList': {
            'type': 'POST',
            'real': '/base/viewDrug/querySpec',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.unifiedSpecSearchList': {
            'type': 'POST',
            'real': '/base/viewDrug/queryUnifiedSpec',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.packageSpecList': {
            'type': 'POST',
            'real': '/base/viewDrug/queryPackageSpec',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.tradeNameList': {
            'type': 'POST',
            'real': '/base/viewDrug/queryTradeName',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.companyList': {
            'type': 'POST',
            'real': '/base/viewDrug/queryCompany',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.get': {
            'type': 'POST',
            'real': '/base/viewDrug/get',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.unifiedSpecList': {
            'type': 'POST',
            'real': '/base/drugUnifiedSpec/query',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.productList': {
            'type': 'POST',
            'real': '/base/drugProduct/query',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugClassy.add': {
            'type': 'POST',
            'real': '/base/drugClassy/add',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        'drugs.drugProductList': {
            'type': 'POST',
            'real': '/base/viewDrug/queryProduct',
            'mock': '/mock/drugsList',
            'apiPrefix': config.apiPrefix
        },
        // 手术
        'operation.list': {
            'type': 'POST',
            'real': '/base/operation/query',
            'mock': '/mock/operationList',
            'apiPrefix': config.apiPrefix
        },
        'operation.keywordList': {
            'type': 'POST',
            'real': '/base/operationKeyword/query',
            'mock': '/mock/operationList',
            'apiPrefix': config.apiPrefix
        },
        'operation.del': {
            'type': 'POST',
            'real': '/base/operation/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'operation.add': {
            'type': 'POST',
            'real': '/base/operation/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'operation.edit': {
            'type': 'POST',
            'real': '/base/operation/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'operation.review': {
            'type': 'POST',
            'real': '/base/operation/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 给药途径处方
        'pathDrugPre.list': {
            'type': 'POST',
            'real': '/base/pathDrugPres/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/pathDrugReList',
            'apiPrefix': config.apiPrefix
        },
        'pathDrugPre.del': {
            'type': 'POST',
            'real': '/base/pathDrugPres/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pathDrugPre.add': {
            'type': 'POST',
            'real': '/base/pathDrugPres/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pathDrugPre.edit': {
            'type': 'POST',
            'real': '/base/pathDrugPres/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pathDrugPre.review': {
            'type': 'POST',
            'real': '/base/pathDrugPres/Operation',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 付费方式
        'pay.list': {
            'type': 'POST',
            'real': '/base/paymentMethod/query',
            // 'mock': '../../../../../static/mock/standard/dictionary/unitList.json'
            'mock': '/mock/payList',
            'apiPrefix': config.apiPrefix
        },
        'pay.del': {
            'type': 'POST',
            'real': '/base/paymentMethod/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pay.add': {
            'type': 'POST',
            'real': '/base/paymentMethod/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pay.edit': {
            'type': 'POST',
            'real': '/base/paymentMethod/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'pay.review': {
            'type': 'POST',
            'real': '/base/paymentMethod/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 科室
        'section.list': {
            'type': 'POST',
            'real': '/base/section/query',
            'mock': '/mock/sectionList',
            'apiPrefix': config.apiPrefix
        },
        'section.del': {
            'type': 'POST',
            'real': '/base/section/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'section.add': {
            'type': 'POST',
            'real': '/base/section/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'section.edit': {
            'type': 'POST',
            'real': '/base/section/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'section.review': {
            'type': 'POST',
            'real': '/base/section/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 性别
        'sex.list': {
            'type': 'POST',
            'real': '/base/sex/query',
            'mock': '/mock/sexList',
            'apiPrefix': config.apiPrefix
        },
        'sex.del': {
            'type': 'POST',
            'real': '/base/sex/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'sex.add': {
            'type': 'POST',
            'real': '/base/sex/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'sex.edit': {
            'type': 'POST',
            'real': '/base/sex/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'sex.review': {
            'type': 'POST',
            'real': '/base/sex/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 就诊卡号流水
        // 治疗结果
        'cure.list': {
            'type': 'POST',
            'real': '/base/treatmentResult/query',
            'mock': '/mock/cureList',
            'apiPrefix': config.apiPrefix
        },
        'cure.del': {
            'type': 'POST',
            'real': '/base/treatmentResult/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'cure.add': {
            'type': 'POST',
            'real': '/base/treatmentResult/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'cure.edit': {
            'type': 'POST',
            'real': '/base/treatmentResult/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'cure.review': {
            'type': 'POST',
            'real': '/base/treatmentResult/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 药品用法
        'drugUsage.list': {
            'type': 'POST',
            'real': '/base/usage/query',
            'mock': '/mock/drugUseList',
            'apiPrefix': config.apiPrefix
        },
        'drugUsage.del': {
            'type': 'POST',
            'real': '/base/usage/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugUsage.add': {
            'type': 'POST',
            'real': '/base/usage/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugUsage.edit': {
            'type': 'POST',
            'real': '/base/usage/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugUsage.review': {
            'type': 'POST',
            'real': '/base/usage/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 切口
        'wound.list': {
            'type': 'POST',
            'real': '/base/wound/query',
            'mock': '/mock/woundList',
            'apiPrefix': config.apiPrefix
        },
        'wound.del': {
            'type': 'POST',
            'real': '/base/wound/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wound.add': {
            'type': 'POST',
            'real': '/base/wound/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wound.edit': {
            'type': 'POST',
            'real': '/base/wound/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wound.review': {
            'type': 'POST',
            'real': '/base/wound/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 通用名
        'generic.list': {
            'type': 'POST',
            'real': '/base/genericName/query',
            'mock': '/mock/genericList',
            'apiPrefix': config.apiPrefix
        },
        'generic.del': {
            'type': 'POST',
            'real': '/base/genericName/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'generic.add': {
            'type': 'POST',
            'real': '/base/genericName/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'generic.edit': {
            'type': 'POST',
            'real': '/base/genericName/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'generic.review': {
            'type': 'POST',
            'real': '/base/genericName/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 批发企业 
        'wholesaleCompany.list': {
            'type': 'POST',
            'real': '/base/wholesaleCompany/query',
            'mock': '/mock/wholesaleCompanyList',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleCompany.del': {
            'type': 'POST',
            'real': '/base/wholesaleCompany/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleCompany.add': {
            'type': 'POST',
            'real': '/base/wholesaleCompany/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleCompany.edit': {
            'type': 'POST',
            'real': '/base/wholesaleCompany/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleCompany.review': {
            'type': 'POST',
            'real': '/base/wholesaleCompany/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleCompany.get': {
            'type': 'POST',
            'real': '/base/wholesaleCompany/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleCompany.blocList': {
            'type': 'POST',
            'real': '/base/wholesaleCompanyBloc/query',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 商品名
        'trade.list': {
            'type': 'POST',
            'real': '/base/tradeName/query',
            'mock': '/mock/tradeList',
            'apiPrefix': config.apiPrefix
        },
        'trade.del': {
            'type': 'POST',
            'real': '/base/tradeName/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'trade.add': {
            'type': 'POST',
            'real': '/base/tradeName/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'trade.edit': {
            'type': 'POST',
            'real': '/base/tradeName/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'trade.review': {
            'type': 'POST',
            'real': '/base/tradeName/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 规格
        'spec.list': {
            'type': 'POST',
            'real': '/base/specName/query',
            'mock': '/mock/specList',
            'apiPrefix': config.apiPrefix
        },
        'spec.del': {
            'type': 'POST',
            'real': '/base/specName/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'spec.add': {
            'type': 'POST',
            'real': '/base/specName/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'spec.edit': {
            'type': 'POST',
            'real': '/base/specName/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'spec.review': {
            'type': 'POST',
            'real': '/base/specName/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //包装规格
        'packageSpec.list': {
            'type': 'POST',
            'real': '/base/packageSpec/query',
            'mock': '/mock/specList',
            'apiPrefix': config.apiPrefix
        },
        'packageSpec.del': {
            'type': 'POST',
            'real': '/base/packageSpec/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'packageSpec.add': {
            'type': 'POST',
            'real': '/base/packageSpec/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'packageSpec.edit': {
            'type': 'POST',
            'real': '/base/packageSpec/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'packageSpec.review': {
            'type': 'POST',
            'real': '/base/packageSpec/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //批发厂家所属集团
        'wholesaleBloc.list': {
            'type': 'POST',
            'real': '/base/wholesaleCompanyBloc/query',
            'mock': '/mock/companyBlocList',
            'apiPrefix': config.apiPrefix

        },
        'wholesaleBloc.del': {
            'type': 'POST',
            'real': '/base/wholesaleCompanyBloc/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleBloc.add': {
            'type': 'POST',
            'real': '/base/wholesaleCompanyBloc/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleBloc.edit': {
            'type': 'POST',
            'real': '/base/wholesaleCompanyBloc/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleBloc.review': {
            'type': 'POST',
            'real': '/base/wholesaleCompanyBloc/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //分包装企业
        'poinpack.list': {
            'type': 'POST',
            'real': '/base/poinpackCompany/query',
            'mock': '/mock/companyBlocList',
            'apiPrefix': config.apiPrefix

        },
        'poinpack.del': {
            'type': 'POST',
            'real': '/base/poinpackCompany/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'poinpack.add': {
            'type': 'POST',
            'real': '/base/poinpackCompany/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'poinpack.edit': {
            'type': 'POST',
            'real': '/base/poinpackCompany/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'poinpack.review': {
            'type': 'POST',
            'real': '/base/poinpackCompany/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'poinpack.get': {
            'type': 'POST',
            'real': '/base/poinpackCompany/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //药品企业
        'drugCompany.list': {
            'type': 'POST',
            'real': '/base/drugCompany/query',
            'mock': '/mock/companyBlocList',
            'apiPrefix': config.apiPrefix

        },
        'drugCompany.del': {
            'type': 'POST',
            'real': '/base/drugCompany/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugCompany.add': {
            'type': 'POST',
            'real': '/base/drugCompany/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugCompany.edit': {
            'type': 'POST',
            'real': '/base/drugCompany/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugCompany.get': {
            'type': 'POST',
            'real': '/base/drugCompany/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //药品商品名
        'drugTrade.list': {
            'type': 'POST',
            'real': '/base/drugTrade/query',
            'mock': '/mock/companyBlocList',
            'apiPrefix': config.apiPrefix

        },
        'drugTrade.del': {
            'type': 'POST',
            'real': '/base/drugTrade/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugTrade.add': {
            'type': 'POST',
            'real': '/base/drugTrade/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugTrade.edit': {
            'type': 'POST',
            'real': '/base/drugTrade/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugTrade.get': {
            'type': 'POST',
            'real': '/base/drugTrade/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
//药品统一规格
        'drugUnifiedSpec.list': {
            'type': 'POST',
            'real': '/base/drugUnifiedSpec/query',
            'mock': '/mock/specList',
            'apiPrefix': config.apiPrefix
        },
        'drugUnifiedSpec.del': {
            'type': 'POST',
            'real': '/base/drugUnifiedSpec/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugUnifiedSpec.add': {
            'type': 'POST',
            'real': '/base/drugUnifiedSpec/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugUnifiedSpec.edit': {
            'type': 'POST',
            'real': '/base/drugUnifiedSpec/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugUnifiedSpec.review': {
            'type': 'POST',
            'real': '/base/drugUnifiedSpec/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        //药品产品名称
        'drugProduct.list': {
            'type': 'POST',
            'real': '/base/drugProduct/query',
            'mock': '/mock/specList',
            'apiPrefix': config.apiPrefix
        },
        'drugProduct.del': {
            'type': 'POST',
            'real': '/base/drugProduct/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugProduct.add': {
            'type': 'POST',
            'real': '/base/drugProduct/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugProduct.edit': {
            'type': 'POST',
            'real': '/base/drugProduct/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'drugProduct.review': {
            'type': 'POST',
            'real': '/base/drugProduct/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        // 医药企业版本
        'medicalVersion.list': {
            'type': 'POST',
            'real': '/base/medicalCompanyVersion/query',
            'mock': '/mock/factoryList',
            'apiPrefix': config.apiPrefix
        },
        'medicalVersion.del': {
            'type': 'POST',
            'real': '/base/medicalCompanyVersion/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medicalVersion.add': {
            'type': 'POST',
            'real': '/base/medicalCompanyVersion/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medicalVersion.edit': {
            'type': 'POST',
            'real': '/base/medicalCompanyVersion/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medicalVersion.get': {
            'type': 'POST',
            'real': '/base/medicalCompanyVersion/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'medicalVersion.review': {
            'type': 'POST',
            'real': '/base/medicalCompanyVersion/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },

        // 批发企业版本
        'wholesaleVersion.list': {
            'type': 'POST',
            'real': '/base/wholesaleVersion/query',
            'mock': '/mock/factoryList',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleVersion.del': {
            'type': 'POST',
            'real': '/base/wholesaleVersion/deleteByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleVersion.add': {
            'type': 'POST',
            'real': '/base/wholesaleVersion/add',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleVersion.edit': {
            'type': 'POST',
            'real': '/base/wholesaleVersion/editByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleVersion.get': {
            'type': 'POST',
            'real': '/base/wholesaleVersion/selectByKey',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },
        'wholesaleVersion.review': {
            'type': 'POST',
            'real': '/base/wholesaleVersion/review',
            'mock': '../../../../../static/mock/common/success.json',
            'apiPrefix': config.apiPrefix
        },



        //成功删除一条数据的提示    
        'common.del': {
            'type': 'POST',
            'real': '',
            'mock': '../../../../../static/mock/common/success.json'
        },
        'common.addressList': {
            'type': 'POST',
            'real': '',
            'mock': '../../../../../static/mock/common/address.json'
        },
        //成功保存一条数据的提示
        'map.save': {
            'type': 'POST',
            'real': '',
            'mock': '../../../../../static/mock/common/success.json'
        },
        
        'drugType.list': {
            'type': 'POST',
            'real': '/base/drugType/query',
            'mock': '../../../../../static/mock/common/success.json'
        },
        'drugType.importExcel': {
            'type': 'POST',
            'real': '/base/drugType/excel',
            'mock': '../../../../../static/mock/common/success.json'
        },
        'drugType.excellist': {
            'type': 'POST',
            'real': '/base/drugType/excelList',
            'mock': '../../../../../static/mock/common/success.json'
        },

    }
}





//引入mockjs
// const Mock = require('mockjs')
//     //使用mockjs模拟数据
// var Random = Mock.Random;

// //城市
// Mock.mock('/mock/cityList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 68,
//         "pageSize": 10,
//         "dataList|10": [{
//             'city|+1': 1,
//             'name': function() { return Random.city() },
//             'province': function() { return Random.province() },
//             'administrative': function() { return Random.ctitle(6) },
//             'economicRegion': '长江中下游经济区域',
//             'country': '中国',
//             'postcode': '0532-220896',
//             'cityLevel': '2',
//             'cityType': '2018-05',
//             'isCapital': '否',
//             'isMunicipalities': '是',
//             'cityCode': '1101',
//             'memo': '新增'
//         }]
//     }]
// })

// //获取省份数据
// Mock.mock('/mock/provinceList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 2,
//         "pageSize": 10,
//         "dataList|10": [{
//             'id': '1',
//             'province': '山西省',
//         }]
//     }]
// })



// // 计量单位
// Mock.mock('/mock/unitList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'unit|+1': 1,
//             'unitName': function() { return Random.ctitle(6) },
//             'memo': '新增'
//         }]
//     }]
// })

// //给药途径
// Mock.mock('/mock/drugPathList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'pathDrug|+1': 1,
//             'pathDrugName': function() { return Random.ctitle(6) },
//             'english': 'PXZS',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //注射剂配伍禁忌项
// Mock.mock('/mock/injectionList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'compatibilityDrug': function() { return Random.ctitle(6) },
//             'sCompatibilityDrug': function() { return Random.ctitle(6) },
//             'isCompatibility': '是',
//             'compatibilityEffect': '良好',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })

// //进口药品信息
// Mock.mock('/mock/drugsImportList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'number|+1': 1,
//             'recordId': 101,
//             'country': '中国',
//             'companyName': function() { return Random.ctitle(6) },
//             'companyAddress': function() { return Random.ctitle(6) },
//             'registerNumber|+1': 52001,
//             'certificationDate': function() { return Mock.mock('@date') },
//             'invalidDate': function() { return Mock.mock('@date') },
//             'subpackApproval': '20065',
//             'subpackApprovalDate': function() { return Mock.mock('@date') },
//             'subpackExpirationDate': function() { return Mock.mock('@date') },
//             'subpackCompany': '10025',
//             'subpackCompanyAddress': '时代峰峻那几款',
//             'importTestChinese': '今年福建省',
//             'memo': '新增'
//         }]
//     }]
// })




// // 医院问题-处方
// Mock.mock('/mock/hospProblemList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'name': function() { return Random.ctitle(6) },
//             'hospProblem': function() { return Random.ctitle(15) },
//             'memo': '新增'
//         }]
//     }]
// })

// // 经济区域
// Mock.mock('/mock/economicList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'economicArea': function() { return Random.ctitle(6) },
//             'economicName': function() { return Random.ctitle(6) },
//             'memo': '新增'
//         }]
//     }]
// })


// // 药品sdcc分类
// Mock.mock('/mock/drugSdccList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'sdcc|+1': 101,
//             'sdccName': function() { return Random.ctitle(6) },
//             'dataLevel': '1',
//             'superiorSdcc': 'sdcc',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// // 药品atc分类
// Mock.mock('/mock/drugAtcList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'atc|+1': 101,
//             'atcName': function() { return Random.ctitle(6) },
//             'atcEnglish': 'HJLK',
//             'dataLevel': '1',
//             'superiorAtc': 'atc',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })



// // 质疑原因
// Mock.mock('/mock/queryList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'code|+1': 1,
//             'content': function() { return Random.ctitle(6) },
//             'memo': '新增',
//             'isAutoConfirm': '是',
//         }]
//     }]
// })


// // 生产厂家所属集团
// Mock.mock('/mock/companyBlocList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'number|+1': 1,
//             'companyBlocName': function() { return Random.ctitle(6) },
//             'group': function() { return Random.ctitle(6) },
//             'memo': '新增'
//         }]
//     }]
// })




// // 城市群对应城市
// Mock.mock('/mock/cityAggRelationList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'city|+1': 1,
//             'cityGroup': function() { return Random.ctitle(6) },
//             'memo': '新增'
//         }]
//     }]
// })


// // 城市群定义
// Mock.mock('/mock/cityGroupList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'cityGroup|+1': 1,
//             'cityGroupName': function() { return Random.ctitle(6) },
//             'memo': '新增'
//         }]
//     }]
// })



// // 文件初检问题-处方
// Mock.mock('/mock/fileCheckList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'blankout|+1': 1,
//             'blankoutName': function() { return Random.ctitle(6) },
//             'dataLevel': '2',
//             'superiorBlankout|+5': '005',
//             'dataType|1': ['购药数据', '门急诊数据', '病案数据', '医嘱数据'],
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })





// // 映射审核不通过原因
// Mock.mock('/mock/mapRecjectedList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'code|+1': 1,
//             'content': function() { return Random.ctitle(6) },
//             'reason': function() { return Random.ctitle(50) },
//             'baseType': 'T01',
//             'baseTypeName': '药品',
//             'memo': '新增'
//         }]
//     }]
// })

// //映射---标准类型
// Mock.mock('/mock/mapBaseTypeList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'id|+1': 1,
//             'baseName': '标准类型1'
//         }]
//     }]
// })




// // 标准库映射表
// // 入院情况
// Mock.mock('/mock/inHospList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'inHospId|+1': 1,
//             'inHosp': '一般',
//             'inHospCode|+1': 100025,
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// // 年龄
// Mock.mock('/mock/ageList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'ageId|+1': 1,
//             'ageName|+2': 1,
//             'ageRange': '≥1岁＜3岁',
//             'growingPeriod': '幼儿期',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// // 疾病
// Mock.mock('/mock/diseaseList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'diseaseType|+1': 1,
//             'diseaseName': '神经损伤',
//             'diseaseNameAb': 'SJNK',
//             'diseaseCode|+1': 1025,
//             'nameShort': 'HJ',
//             'dataLevel': '三级',
//             'superiorDiseaseType': '神经',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })



// // 医嘱类型
// Mock.mock('/mock/adviceTypeList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'adviceId|+1': 1,
//             'advice': '长期医嘱',
//             'adviceTypeCode|+1': 1025,
//             'dataLevel': '三级',
//             'superiorAdviceType': '医嘱',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })



// //医生工号
// Mock.mock('/mock/doctorNumList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'doctorId|+1': 1,
//             'doctorNum|+1': 501,
//             'doctorTitle': '主任医师',
//             'memo': '新增'
//         }]
//     }]
// })



// //医生职称
// Mock.mock('/mock/doctorTitleList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'doctorTitle|+1': 1,
//             'dataLevel': '1',
//             'doctorTitleName': '主任医师',
//             'superDoctorTitle': '101',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //剂量
// Mock.mock('/mock/dosageList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'dosage|+1': 1,
//             'dosageName': '一次两片',
//             'dosageEnglish': 'hjhj',
//             'dataLevel': '1',
//             'superiorDosage': '剂量',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //剂型
// Mock.mock('/mock/formList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'form|+1': 1,
//             'formName': '片剂',
//             'formEnglish': 'PJ',
//             'formAb': '片',
//             'formEnglishAb': 'PJT',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //愈合
// Mock.mock('/mock/healingList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'healingId|+1': 1,
//             'healing': '良好',
//             'level': '一级愈合',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //医药企业
// Mock.mock('/mock/factoryList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'number|+1': 1,
//             'name': '长春北华药业有限公司',
//             'originalCompanyName': '长春市北华制药厂',
//             'chineseShort': '北华',
//             'enterpriseLegal': function() { return Random.cname() },
//             'nation': '中国',
//             'companyType': '合资',
//             'addr': '吉林省长春市净月旅游经济开发区金碧街966号',
//             'version': '1.10',
//             'beginDate': function() { return Mock.mock('@date') },
//             'endDate': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //病案号流水

// Mock.mock('/mock/medicalNumList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'medicalNumId|+1': 1,
//             'medicalNum': '454845',
//             'medicalNumCode|+6': 11056,
//             'memo': '新增'
//         }]
//     }]
// })

// //药品信息
// Mock.mock('/mock/drugsList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'number|+1': 1,
//             'genericName': '波立维',
//             'tradeName': '氯吡格雷',
//             'drugCode': '11056',
//             'drugClassy': '高血压类',
//             'spec': '7片/盒',
//             'drugForm': '片剂',
//             'packageUnit': '盒',
//             'proEnterprise': '百洋',
//             'version': '1.10',
//             'beginDate': function() { return Mock.mock('@date') },
//             'endDate': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //手术
// Mock.mock('/mock/operationList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'operationId|+1': 1,
//             'operation': '缝合手术',
//             'operationCode|+6': 11056,
//             'memo': '新增'
//         }]
//     }]
// })


// //给药途径-处方
// Mock.mock('/mock/pathDrugReList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'pathDrugReId|+1': 1,
//             'pathDrugRe': function() { return Random.ctitle(6) },
//             'dataLevel': '1',
//             'superPathDrug': 'PXZS',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //付费方式
// Mock.mock('/mock/payList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'payId|+1': 1,
//             'pay': '全自费',
//             'level': 1,
//             'superPayMethod': 11056,
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //科室
// Mock.mock('/mock/sectionList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'sectionId|+1': 1,
//             'section': '神经内科',
//             'sectionAb': '别名1',
//             'dataLevel': '1',
//             'superiorSection': '脑科',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //性别
// Mock.mock('/mock/sexList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'sexId|+1': 1,
//             'sex': '男',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //就诊卡号流水
// Mock.mock('/mock/cardList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'cardId|+1': 1,
//             'card': '1556688',
//             'cardCode|+6': 11056,
//             'memo': '新增'
//         }]
//     }]
// })



// //治疗结果
// Mock.mock('/mock/cureList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'cureId|+1': 1,
//             'cure': '治愈',
//             'cureCode|+6': 11056,
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //药品用法
// Mock.mock('/mock/drugUseList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'usage|+1': 1,
//             'usageName': '一次一片',
//             'usageAb': 'asd',
//             'usageQuantity': 'sa',
//             'timingQuantity': '八小时',
//             'timingUnit': '小时',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //切口
// Mock.mock('/mock/woundList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'wound|+1': 1,
//             'woundName': '小切口',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })


// //通用名
// Mock.mock('/mock/genericList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'generic|+1': 1,
//             'genericName': '迪巧',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })




// // 批发企业
// Mock.mock('/mock/wholesaleCompanyList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'wholesaleCompany|+1': 1,
//             'wholesaleCompanyName': '百洋医药',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })



// // 商品名
// Mock.mock('/mock/tradeList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'trade|+1': 1,
//             'tradeName': '迪巧儿童钙',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })



// // 规格
// Mock.mock('/mock/specList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'spec|+1': 1,
//             'specName': '500ml/袋',
//             'statusId': '通过',
//             'createUser': function() { return Random.cname() },
//             'createTime': function() { return Mock.mock('@date') },
//             'changeUser': function() { return Random.cname() },
//             'changeTime': function() { return Mock.mock('@date') },
//             'checkUser': function() { return Random.cname() },
//             'checkTime': function() { return Mock.mock('@date') },
//             'memo': '新增'
//         }]
//     }]
// })