export default {
    router: {
        path: "/business",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [

            {
                path: "/business/duplicateCheck", //查重管理
                component: resolve =>
                    require(["@/components/business/duplicateCheck"], resolve)
            },
            {
                path: "/business/duplicateCheck/:id", //查重管理
                meta: { baseUrl: "/business/duplicateCheck" },
                component: resolve =>
                    require(["@/components/business/duplicateCheck"], resolve)
            },
            {
                path: "/business/updateFile", //查看文件内容
                component: resolve =>
                    require(["@/components/business/updateFile"], resolve)
            },
            {
                path: "/business/headerMapped", //表头映射
                component: resolve =>
                    require(["@/components/business/headerMapped"], resolve)
            },
            {
                path: "/business/headerMapped/:id", //表头映射
                meta: { baseUrl: "/business/headerMapped" },
                component: resolve =>
                    require(["@/components/business/headerMapped"], resolve)
            },
            {
                path: "/business/headerRules", //表头映射创建规则
                component: resolve =>
                    require(["@/components/business/headerRules"], resolve)
            },
            {
                path: "/business/initialSurvey/:id", //初检管理
                meta: { baseUrl: "/business/initialSurvey" },
                component: resolve =>
                    require(["@/components/business/initialSurvey"], resolve)
            },
            {
                path: "/business/initialSurvey", //初检管理
                component: resolve =>
                    require(["@/components/business/initialSurvey"], resolve)
            },
            {
                path: "/business/reject", //剔除管理
                component: resolve =>
                    require(["@/components/business/reject"], resolve)
            },
            {
                path: "/business/reject/:id", //剔除管理
                meta: { baseUrl: "/business/reject" },
                component: resolve =>
                    require(["@/components/business/reject"], resolve)
            },
            {
                path: "/business/dataCheck", //数据校验管理
                component: resolve =>
                    require(["@/components/business/dataCheck"], resolve)
            },
            {
                path: "/business/dataCheck/:id", //数据校验管理
                meta: { baseUrl: "/business/dataCheck" },
                component: resolve =>
                    require(["@/components/business/dataCheck"], resolve)
            },
            {
                path: "/business/dataMapped", //数据映射管理
                component: resolve =>
                    require(["@/components/business/dataMapped"], resolve)
            },
            {
                path: "/business/dataMapped/:id", //数据映射管理
                meta: { baseUrl: "/business/dataMapped" },
                component: resolve =>
                    require(["@/components/business/dataMapped"], resolve)
            },
            {
                path: "/business/dataMappedAdd", //数据映射管理创建规则
                component: resolve =>
                    require(["@/components/business/dataMappedAdd"], resolve)
            },
            {
                path: "/business/query", //质疑管理
                component: resolve =>
                    require(["@/components/business/query"], resolve)
            },
            {
                path: "/business/query/:id", //质疑管理
                meta: { baseUrl: "/business/query" },
                component: resolve =>
                    require(["@/components/business/query"], resolve)
            },
            {
                path: "/business/mutex", //互斥管理
                component: resolve =>
                    require(["@/components/business/mutex"], resolve)
            },
            {
                path: "/business/mutex/:id", //互斥管理
                meta: { baseUrl: "/business/mutex" },
                component: resolve =>
                    require(["@/components/business/mutex"], resolve)
            },
            {
                path: "/business/convert", //单位换算管理
                component: resolve =>
                    require(["@/components/business/convert2"], resolve)
            },
            {
                path: "/business/convert/:id", //单位换算管理
                meta: { baseUrl: "/business/convert" },
                component: resolve =>
                    require(["@/components/business/convert2"], resolve)
            },
            {
                path: "/business/history", //数据总检
                component: resolve =>
                    require(["@/components/business/dataHistory"], resolve)
            },
            {
                path: "/business/redo", //重新清洗管理
                component: resolve =>
                    require(["@/components/business/redo"], resolve)
            },
            {
                path: "/business/redoAdd", //重新清洗管理
                component: resolve =>
                    require(["@/components/business/redoAdd"], resolve)
            },
            {
                path: "/business/overview", //数据清洗总览
                component: resolve =>
                    require(["@/components/business/overview"], resolve)
            },
            {
                path: "/business/taskAllocation", //数据清洗总览
                component: resolve =>
                    require(["@/components/business/taskAllocation"], resolve)
            },
            {
                path: "/business/taskAllocationAdd", //数据清洗总览
                component: resolve =>
                    require(["@/components/business/taskAllocationAdd"], resolve)
            },
            {
                path: "/business/qualityTest", //质检管理
                component: resolve =>
                    require(["@/components/business/qualityTest"], resolve)
            },
            {
                path: "/business/dataCompare", //数据对比
                component: resolve =>
                    require(["@/components/business/dataCompare"], resolve)
            }
        ]
    },
    urls: {
        //地区
        "header.queryExcelData": {
            type: "POST",
            real: "/header/queryExcelData"
        },
        //地区
        "common.adressList": {
            type: "POST",
            real: "/hospital/province/query",
            mock: "../../static/mock/common/adress.json"
        },
        //医院
        "common.hospitalList": {
            type: "POST",
            real: "/hospital/list",
            mock: "../../static/mock/business/hospitalList.json"
        },
        //获取前一百家医院
        "common.getPortionHosp": {
            type: "POST",
            real: "/hospital/portlist",
            mock: "../../static/mock/business/hospitalList.json"
        },
        //审核原因
        "common.getDictionary": {
            type: "POST",
            real: "/dictionary/getlist",
            mock: "../../static/mock/business/hospitalList.json"
        },
        //业务地区
        "business.adressList": {
            type: "POST",
            real: "/duplicate/provlist",
            mock: "../../static/mock/common/adress.json"
        },
        //业务医院
        "business.hospitalList": {
            type: "POST",
            real: "/duplicate/hosplist",
            mock: "../../static/mock/business/hospitalList.json"
        },
        //错误数据修改状态
        "errorInfor.updateState": {
            type: "POST",
            real: "/errorInfor/update",
            mock: "../../static/mock/business/hospitalList.json"
        },
        //剔除购药列表
        "rejectDrug.getList": {
            type: "POST",
            real: "/busreject/drug/query",
            mock: "/mock/reject/list"
        },
        //剔除门急诊列表
        "rejectOutpatient.getList": {
            type: "POST",
            real: "/busreject/pat/query",
            mock: "/mock/reject/list"
        },
        //剔除病案列表
        "rejectMedical.getList": {
            type: "POST",
            real: "/busreject/med/query",
            mock: "/mock/reject/list"
        },
        //剔除医嘱列表
        "rejectDoctor.getList": {
            type: "POST",
            real: "/busreject/doc/query",
            mock: "/mock/reject/list"
        },
        //数据校验购药列表
        "checkDrug.getList": {
            type: "POST",
            real: "/buscheck/drug/query",
            mock: "/mock/reject/list"
        },
        //数据校验门急诊列表
        "checkOutpatient.getList": {
            type: "POST",
            real: "/buscheck/pat/query",
            mock: "/mock/reject/list"
        },
        //数据校验病案列表
        "checkMedical.getList": {
            type: "POST",
            real: "/buscheck/med/query",
            mock: "/mock/reject/list"
        },
        //数据校验医嘱列表
        "checkDoctor.getList": {
            type: "POST",
            real: "/buscheck/doc/query",
            mock: "/mock/reject/list"
        },
        //质疑购药列表
        "queryDrug.getList": {
            type: "POST",
            real: "/busquery/drug/query",
            mock: "/mock/reject/list"
        },
        //质疑门急诊列表
        "queryOutpatient.getList": {
            type: "POST",
            real: "/busquery/pat/query",
            mock: "/mock/reject/list"
        },
        //质疑病案列表
        "queryMedical.getList": {
            type: "POST",
            real: "/busquery/med/query",
            mock: "/mock/reject/list"
        },
        //质疑医嘱列表
        "queryDoctor.getList": {
            type: "POST",
            real: "/busquery/doc/query",
            mock: "/mock/reject/list"
        },
        //质疑确认驳回操作
        "queryInfor.updateState": {
            type: "POST",
            real: "/busquery/updateState",
            mock: "/mock/reject/list"
        },
        //互斥购药列表
        "mutexDrug.getList": {
            type: "POST",
            real: "/busmutex/drug/query",
            mock: "/mock/reject/list"
        },
        //互斥门急诊列表
        "mutexOutpatient.getList": {
            type: "POST",
            real: "/busmutex/pat/query",
            mock: "/mock/reject/list"
        },
        //互斥病案列表
        "mutexMedical.getList": {
            type: "POST",
            real: "/busmutex/med/query",
            mock: "/mock/reject/list"
        },
        //互斥医嘱列表
        "mutexDoctor.getList": {
            type: "POST",
            real: "/busmutex/doc/query",
            mock: "/mock/reject/list"
        },
        //单位换算购药列表
        "convertDrug.getList": {
            type: "POST",
            real: "/busconvert/drug/query",
            mock: "/mock/reject/list"
        },
        //单位换算门急诊列表
        "convertOutpatient.getList": {
            type: "POST",
            real: "/busconvert/pat/query",
            mock: "/mock/reject/list"
        },
        //单位换算病案列表
        "convertMedical.getList": {
            type: "POST",
            real: "/busconvert/med/query",
            mock: "/mock/reject/list"
        },
        //单位换算医嘱列表
        "convertDoctor.getList": {
            type: "POST",
            real: "/busconvert/doc/query",
            mock: "/mock/reject/list"
        },
        //数据总检列表
        "history.list": {
            type: "POST",
            real: "/history/list",
            mock: "/mock/reject/list"
        },
        //数据校验编辑保存
        "dataCheck.saveEdit": {
            type: "POST",
            real: "/buscheck/update",
            mock: "../../static/mock/common/success.json"
        },
        //单位换算编辑保存
        "convertManage.saveEdit": {
            type: "POST",
            real: "/busconvert/update",
            mock: "../../static/mock/common/success.json"
        },
        //单位换算编辑保存
        "convertManage.saveEditDrug": {
            type: "POST",
            real: "/busconvert/updateDrug",
            mock: "../../static/mock/common/success.json"
        },
        //保存编辑列表
        "convertManage.addConvertRules": {
            type: "POST",
            real: "/busconvert/add",
            mock: "../../static/mock/common/success.json"
        },
        //保存编辑列表
        "convertManage.updateState": {
            type: "POST",
            real: "/busconvert/updateState",
            mock: "../../static/mock/common/success.json"
        },
        //数据映射购药列表
        "mapDrug.getList": {
            type: "POST",
            real: "/busmapped/drug/query",
            mock: "/mock/reject/list"
        },
        //数据映射门急诊列表
        "mapOutpatient.getList": {
            type: "POST",
            real: "/busmapped/pat/query",
            mock: "/mock/reject/list"
        },
        "header.queryHeaderData": {
            type: "POST",
            real: "/initial/commonHeader/query",
            mock: "/mock/reject/list"
        },
      
        //数据映射病案列表
        "mapMedical.getList": {
            type: "POST",
            real: "/busmapped/med/query",
            mock: "/mock/reject/list"
        },
        //数据映射医嘱列表
        "mapDoctor.getList": {
            type: "POST",
            real: "/busmapped/doc/query",
            mock: "/mock/reject/list"
        },
        //数据映射质疑
        "dataMapped.question": {
            type: "POST",
            real: "/busmapped/question",
            mock: "../../static/mock/common/success.json"
        },
        //数据映射创建规则错误数据
        "dataMapped.errorQuery": {
            type: "POST",
            real: "/busmapped/errorquery",
            mock: "../../static/mock/common/success.json"
        },
        //数据映射创建规则标准数据
        "dataMapped.standardQuery": {
            type: "POST",
            real: "/busmapped/standardquery",
            mock: "../../static/mock/common/success.json"
        },
        //创建规则
        "dataMapped.addRules": {
            type: "POST",
            real: "/busmapped/addRules",
            mock: "../../static/mock/common/success.json"
        },
        //创建字典规则
        "dataMapped.addKeyWord": {
            type: "POST",
            real: "/busmapped/addKeyWord",
            mock: "../../static/mock/common/success.json"
        },
        //质疑原因
        "dataMapped.getQueryReason": {
            type: "POST",
            real: "/busmapped/getQueryReason",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入库
        "dataMapped.select": {
            type: "POST",
            real: "/busmapped/select",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入库
        "dataMapped.delete": {
            type: "POST",
            real: "/busmapped/delete",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入库
        "dataMapped.saveEdit": {
            type: "POST",
            real: "/busmapped/update",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览
        "overview.list": {
            type: "POST",
            real: "/busoverview/query",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入业务库
        "overview.putIn": {
            type: "POST",
            real: "/busoverview/putIn",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入业务库
        "overview.putInProduct": {
            type: "POST",
            real: "/busoverview/putInProduct",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入库
        "overview.updateState": {
            type: "POST",
            real: "/busoverview/updateState",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入库
        "allocation.list": {
            type: "POST",
            real: "/busallocation/query",
            mock: "../../static/mock/common/success.json"
        },
        //数据清洗总览入库
        "allocation.select": {
            type: "POST",
            real: "/busallocation/select",
            mock: "../../static/mock/common/success.json"
        },
        "allocation.delete": {
            type: "POST",
            real: "/busallocation/delete",
            mock: "../../static/mock/common/success.json"
        },
        //获取基础数据
        "allocation.get": {
            type: "POST",
            real: "/busallocation/get",
            mock: "../../static/mock/common/success.json"
        },
        //分配任务
        "allocation.save": {
            type: "POST",
            real: "/busallocation/save",
            mock: "../../static/mock/common/success.json"
        },

        //重洗管理列表
        "redoManager.list": {
            type: "POST",
            real: "/busredo/query",
            mock: "../../static/mock/common/success.json"
        },
        //再次重洗清洗
        "redoManager.updateState": {
            type: "POST",
            real: "/busredo/update",
            mock: "../../static/mock/common/success.json"
        },
        //删除
        "redoManager.deleteRedo": {
            type: "POST",
            real: "/busredo/delete",
            mock: "../../static/mock/common/success.json"
        },
        //新增
        "redoManager.add": {
            type: "POST",
            real: "/busredo/add",
            mock: "../../static/mock/common/success.json"
        },
        //批量重洗
        "common.batch": {
            type: "POST",
            real: "common/batch",
            mock: "../../static/mock/common/success.json"
        },
        //重洗
        "common.clean": {
            type: "POST",
            real: "common/clean",
            mock: "../../static/mock/common/success.json"
        },
        //确认
        "common.affirm": {
            type: "POST",
            real: "common/clean",
            mock: "../../static/mock/common/success.json"
        },

        //查重列表
        "duplicate.list": {
            type: "POST",
            real: "/duplicate/query",
            mock: "/mock/duplicate/list"
        },
        //废弃原因
        "duplicate.discardList": {
            type: "POST",
            real: "/upload/cancel/reasons",
            mock: "../../static/mock/business/discardList.json"
        },
        //废弃
        "duplicate.discard": {
            type: "POST",
            real: "duplicate/discard",
            mock: "../../static/mock/common/success.json"
        },

        //初检列表
        "initial.list": {
            type: "POST",
            real: "/initial/query",
            mock: "/mock/initial/list"
        },
        "initial.listDetail": {
            type: "POST",
            real: "/initial/queryDetail",
            mock: "/mock/initial/listDetail"
        },
        //初检列表创建规则
        "initial.addRule": {
            type: "POST",
            real: "/initial/addRule",
            mock: "/mock/initial/list"
        },

        //剔除列表
        "reject.list": {
            type: "POST",
            real: "reject/getList",
            mock: "/mock/reject/list"
        },
        //剔除规则
        "reject.rejectList": {
            type: "POST",
            real: "common/getRejectList",
            mock: "../../static/mock/business/rejectList.json"
        },

        //数据校验列表
        "dataCheck.list": {
            type: "POST",
            real: "dataCheck/getList",
            mock: "/mock/reject/list"
        },
        //获取必填字段
        "dataCheck.getRequired": {
            type: "POST",
            real: "dataCheck/getRequired",
            mock: "../../static/mock/business/requiredList.json"
        },

        //数据映射列表
        "dataMapped.list": {
            type: "POST",
            real: "dataCheck/getList",
            mock: "/mock/reject/list"
        },
        // //质疑
        // "dataMapped.question": {
        //     type: "POST",
        //     real: "dataCheck/getList",
        //     mock: "../../static/mock/common/success.json"
        // },
        //发通知
        "dataMapped.sendMessage": {
            type: "POST",
            real: "dataCheck/batchQuestion",
            mock: "../../static/mock/common/success.json"
        },
        //批量质疑
        "dataMapped.batchQuestion": {
            type: "POST",
            real: "dataCheck/batchQuestion",
            mock: "../../static/mock/common/success.json"
        },
        //获取规则库
        "dataMapped.expand": {
            type: "POST",
            real: "dataCheck/expand",
            mock: "../../static/mock/business/expandList.json"
        },
        //医院规则
        "dataMapped.hospitalRule": {
            type: "POST",
            real: "dataCheck/hospitalRule",
            mock: "../../static/mock/common/success.json"
        },
        // //通用规则
        // "dataMapped.commonRule": {
        //     type: "POST",
        //     real: "dataCheck/expand",
        //     mock: "../../static/mock/common/success.json"
        // },

        //质疑列表
        "queryManage.list": {
            type: "POST",
            real: "queryManage/getList",
            mock: "/mock/reject/list"
        },
        //质疑规则
        "queryManage.queryList": {
            type: "POST",
            real: "queryManage/queryList",
            mock: "../../static/mock/business/queryList.json"
        },
        //质疑规则
        "query.skip": {
            type: "POST",
            real: "queryManage/queryList",
            mock: "../../static/mock/business/queryList.json"
        },

        //互斥管理
        "mutexManage.list": {
            type: "POST",
            real: "mutexManage/getList",
            mock: "/mock/reject/list"
        },
        //质疑规则
        "mutexManage.mutexList": {
            type: "POST",
            real: "mutexManage/mutexList",
            mock: "../../static/mock/business/mutexList.json"
        },

        //单位换算管理
        "convertManage.list": {
            type: "POST",
            real: "convertManage/getList",
            mock: "/mock/reject/list"
        },
        //获取必填字段
        "convertManage.getRequired": {
            type: "POST",
            real: "convertManage/getRequired",
            mock: "../../static/mock/business/requiredList.json"
        },
        // //保存编辑列表
        // "convertManage.saveEdit": {
        //     type: "POST",
        //     real: "convertManage/saveEdit",
        //     mock: "../../static/mock/common/success.json"
        // },
        // //保存编辑列表
        // "convertManage.addConvertRules": {
        //     type: "POST",
        //     real: "convertManage/saveEdit",
        //     mock: "../../static/mock/common/success.json"
        // },

        //质检管理列表
        "qualityTest.list": {
            type: "POST",
            real: "qualityTest/getList",
            mock: "/mock/reject/list"
        },
        //获取质检规则
        "qualityTest.qualityList": {
            type: "POST",
            real: "qualityTest/qualityList",
            mock: "../../static/mock/business/qualityList.json"
        },
        //保存编辑列表
        "qualityTest.expand": {
            type: "POST",
            real: "",
            mock: "../../static/mock/business/qualityExpand.json"
        }
    },
    json:{
        companyName:"drug_manufacturers",//生产企业
        drugGenericName:"drug_generic_name",//通用名
        drugTradeName:"drug_trade_name",//商品名
        drugSpecName:"drug_spec",//药品规格
        // packageSpecName:"",//包装规格
        formNameChinese:"drug_formulation",//剂型
        unitPrice:"price",//单价
        paymentMethod:"payment_method",//付费方式
        wound:"wound_", //切口
        healing:"healing_",//愈合
        dosage:"dosage",//剂量
        packingQuantity:"packing_quantity",//包装数量
        doctorAdviceType:"doctor_advice_type",//医嘱类别
        drugManufacturers:"drug_manufacturers",//生产企业
        treatmentCard:"treatment_card",//就诊卡号
        doctorId:"doctor_id",//医师工号
        age:"age",//年龄
        sex:"sex",//性别
        drugWholesale:"drug_wholesale",//药品批发企业
        treatmentResultInfect:"treatment_result_infect",//医院感染治疗结果
        usage:"usage",//用法
        pathDrug:"path_drug",//给药途径
        medicareCard:"medical_record",//病案号
        section:"section",//科室名称
        doctorTitle:"doctor_title",//医师职称
    }
};

//引入mockjs
// const Mock = require("mockjs");
// //使用mockjs模拟数据
// var Random = Mock.Random;
// //查重
// Mock.mock("/mock/duplicate/list", {
//     code: 0,
//     message: "成功",
//     data: [{
//         currentPageIndex: 1,
//         totalPageCount: 7,
//         totalItemCount: 68,
//         pageSize: 10,
//         "dataList|10": [{
//             "id|+1": 1,
//             "hospitalNum|+2": 1565,
//             hospitalName: function() {
//                 return Random.ctitle(6);
//             },
//             province: function() {
//                 return Random.province();
//             },
//             city: function() {
//                 return Random.city();
//             },
//             "dataType|1": [
//                 "购药数据",
//                 "门急诊数据",
//                 "病案数据",
//                 "医嘱数据"
//             ],
//             fileName: "asdfjadklsjf",
//             repeatFile: "adfad",
//             fileDate: function() {
//                 return Mock.mock("@date");
//             },
//             repeatRate: "15%",
//             "repeatType|1": ["文件内重复", "文件间重复"]
//         }]
//     }]
// });
// //初检
// Mock.mock("/mock/initial/list", {
//     code: 0,
//     message: "成功",
//     data: [{
//         currentPageIndex: 1,
//         totalPageCount: 7,
//         totalItemCount: 100000,
//         pageSize: 100,
//         "dataList|100": [{
//             "initialId|+1": 1,
//             "hospitalNum|+2": 1565,
//             hospitalName: function() {
//                 return Random.ctitle(6);
//             },
//             province: function() {
//                 return Random.province();
//             },
//             city: function() {
//                 return Random.city();
//             },
//             "dataType|1": [
//                 "购药数据",
//                 "门急诊数据",
//                 "病案数据",
//                 "医嘱数据"
//             ],
//             fileName: "asdfjadklsjf",
//             fileDate: function() {
//                 return Mock.mock("@date");
//             },
//             "errorType|1": ["表头映射", "数据完整性"],
//             "updateType|1": ["已修改", "未修改"]
//         }]
//     }]
// });
// //剔除
// Mock.mock("/mock/reject/list", {
//     code: 0,
//     message: "成功",
//     data: [{
//         currentPageIndex: 1,
//         totalPageCount: 7,
//         totalItemCount: 201,
//         pageSize: 10,
//         "dataList|10": [{
//                 "id|+1": 1,
//                 "hospitalNum|+2": 1565,
//                 hospitalName: function() {
//                     return Random.ctitle(6);
//                 },
//                 province: function() {
//                     return Random.province();
//                 },
//                 city: function() {
//                     return Random.city();
//                 },
//                 "dataType|1": [
//                     "购药数据",
//                     "门急诊数据",
//                     "病案数据",
//                     "医嘱数据"
//                 ],
//                 fileName: "asdfjadklsjf",
//                 fileDate: function() {
//                     return Mock.mock("@date");
//                 },
//                 "errorType|1": ["表头映射", "数据完整性"],
//                 "updateType|1": ["已修改", "未修改"],
//                 "rejectName|1": ["中药剔除", "自研药剔除"],
//                 "drug|+2": 12,
//                 drug_generic_name: "小儿迪巧",
//                 drug_trade_name: "钙片",
//                 "drug_spec|1": ["规格一", "规格二"],
//                 cellClassName: {
//                     city: "error-data",
//                     hospitalNum: null
//                 }
//             },
//             {
//                 "id|+1": 1,
//                 "hospitalNum|+2": 1565,
//                 hospitalName: function() {
//                     return Random.ctitle(6);
//                 },
//                 province: function() {
//                     return Random.province();
//                 },
//                 city: function() {
//                     return Random.city();
//                 },
//                 "dataType|1": [
//                     "购药数据",
//                     "门急诊数据",
//                     "病案数据",
//                     "医嘱数据"
//                 ],
//                 fileName: "asdfjadklsjf",
//                 fileDate: function() {
//                     return Mock.mock("@date");
//                 },
//                 "errorType|1": ["表头映射", "数据完整性"],
//                 "updateType|1": ["已修改", "未修改"],
//                 "rejectName|1": ["中药剔除", "自研药剔除"],
//                 "drug|+2": 12,
//                 drug_generic_name: "小儿迪巧",
//                 drug_trade_name: "钙片",
//                 "drug_spec|1": ["规格一", "规格二"],
//                 cellClassName: {
//                     hospitalName: "error-data"
//                 }
//             }
//         ]
//     }]
// });