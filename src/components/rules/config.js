export default {
    router: {
        path: "/rules",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "/rules/basice", //初检规则
                component: resolve => require(['@/components/rules/basice'], resolve)
            },
            {
                path: "/rules/headerMapping", //表头映射
                component: resolve => require(['@/components/rules/headerMapping'], resolve)
            },
            {
                path: "/rules/headerMappingAdd", //表头映射新增
                component: resolve => require(['@/components/rules/headerMappingAdd'], resolve)
            },
            // {
            //     path: "/rules/initialSurvey",//初检规则
            //     component: resolve => require(['@/components/rules/initialSurvey'], resolve)
            // },
            {
                path: "/rules/initialSurveyAdd", //初检规则新增
                component: resolve => require(['@/components/rules/initialSurveyAdd'], resolve)
            },
            {
                path: "/rules/specialChart", //特殊字符规则
                component: resolve => require(['@/components/rules/specialChart'], resolve)
            },
            {
                path: "/rules/specialChartAdd", //特殊字符规则新增
                component: resolve => require(['@/components/rules/specialChartAdd'], resolve)
            },
            {
                path: "/rules/duplicateCheck", //查重规则
                component: resolve => require(['@/components/rules/duplicateCheck'], resolve)
            },
            {
                path: "/rules/duplicateCheckAdd", //查重规则新增
                component: resolve => require(['@/components/rules/duplicateCheckAdd'], resolve)
            },
            {
                path: "/rules/reject", //剔除规则
                component: resolve => require(['@/components/rules/reject'], resolve)
            },
            {
                path: "/rules/rejectRulesAdd", //剔除规则新增
                component: resolve => require(['@/components/rules/rejectRulesAdd'], resolve)
            },
            // {
            //     path: "/rules/dataCheck",//数据校验规则
            //     component: resolve => require(['@/components/rules/dataCheck'], resolve)
            // },
            {
                path: "/rules/dataMapped", //数据映射规则
                component: resolve => require(['@/components/rules/dataMapped'], resolve)
            },
            {
                path: "/rules/dataMapped/:id", //数据映射规则
                meta: { baseUrl: "/rules/dataMapped" },
                component: resolve => require(['@/components/rules/dataMapped'], resolve)
            },
            {
                path: "/rules/dataMappedAdd", //数据映射规则新增
                component: resolve => require(['@/components/rules/dataMappedAdd'], resolve)
            },
            {
                path: "/rules/query", //质疑规则
                component: resolve => require(['@/components/rules/query'], resolve)
            },
            {
                path: "/rules/queryRulesAdd", //质疑规则新增
                component: resolve => require(['@/components/rules/queryRulesAdd'], resolve)
            },
            {
                path: "/rules/mutex", //互斥规则
                component: resolve => require(['@/components/rules/mutex'], resolve)
            },
            {
                path: "/rules/mutexRulesAdd", //互斥规则新增
                component: resolve => require(['@/components/rules/mutexRulesAdd'], resolve)
            },
            {
                path: "/rules/convert", //单位换算规则
                component: resolve => require(['@/components/rules/convert'], resolve)
            },
            {
                path: "/rules/qualityTest", //质检规则
                component: resolve => require(['@/components/rules/qualityTest'], resolve)
            }
        ]
    },
    urls: {
        //审核不通过原因
        "common.auditNOList": {
            type: "POST",
            real: "/base/unAuditReason/query",
            mock: "../../static/mock/business/hospitalList.json"
        },
        //映射规则导入excel
        'ruleDataMapped.importExcel': {
            'type': 'POST',
            'real': '/mapcom/excel',
            'mock': '/mock/rule/isRepetition'
        },
        //数据校验规则
        'ruleDataMapped': {
            'type': 'POST',
            'real': '/advice/query11',
            'mock': '/mock/ruleDataMapped/list'
        },
        //获取校验字段
        'ruleDataMapped.getColumnsList': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/rules/columnsList.json"
        },
        //发通知
        'ruleDataMapped.sendMessage': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/common/success.json"
        },
        //删除规则
        'delDataMapped': {
            'type': 'POST',
            'real': '/map/mapdrug/deleteByKey',
            'mock': "../../static/mock/common/success.json"
        },
        //获取绑定的标准库数据（单条）
        'map/expandData/get': {
            'type': 'POST',
            'real': '/mapcom/get',
            'mock': "../../static/mock/rules/expandList.json"
        },
        //模糊查询获取标准库数据（多条）
        'standardList': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/rules/standardList.json"
        },
        //获取编辑数据信息
        'ruleDataMapped.getUpdata': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/rules/getUpdata.json"
        },
        //新增
        'ruleDataMappedAddRule': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/common/success.json"
        },
        //编辑
        'ruleDataMappedEditRule': {
            'type': 'POST',
            'real': '/map/admission/editByKey',
            'mock': "../../static/mock/common/success.json"
        },
        //判断映射关系是否存在
        'ruleDataMapped.isRepetition': {
            'type': 'POST',
            'real': '',
            'mock': '/mock/rule/isRepetition'
        },
        //判断映射关系是否存在
        'ruleDataMapped.isRepetition': {
            'type': 'POST',
            'real': '',
            'mock': '/mock/rule/isRepetition'
        },
        //修改状态
        'updataState': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/common/success.json"
        },

        // //初检规则列表
        // 'initialSurvey.list':{
        //     'type':'POST',
        //     'real': '',
        //     'mock': '/mock/initialSurvey/list'
        // },
        // //新增
        // 'initialSurvey.addRule':{
        //     'type':'POST',
        //     'real': '',
        //     'mock': "../../static/mock/common/success.json"
        // },
        // //编辑
        // 'initialSurvey.editRule':{
        //     'type':'POST',
        //     'real': '',
        //     'mock': "../../static/mock/common/success.json"
        // },
        // //获取编辑信息
        // 'initialSurvey.getUpdateRule':{
        //     'type':'POST',
        //     'real': '',
        //     'mock': '/mock/initialSurvey/getUpdateInitial'
        // },
        // // //详情
        // // 'initialSurvey.getRuleDetails':{
        // //     'type':'POST',
        // //     'real': '',
        // //     'mock': '/mock/initialSurvey/getRuleInitial'
        // // },
        // //修改状态
        // 'initialSurvey.updataState':{
        //     'type':'POST',
        //     'real': '',
        //     'mock': "../../static/mock/common/success.json"
        // },
        // //删除
        // 'initialSurvey.delRule':{
        //     'type':'POST',
        //     'real': '',
        //     'mock': "../../static/mock/common/success.json"
        // },

        //基础规则列表
        'basice.list': {
            'type': 'POST',
            'real': '/rule/dataColumns/query',
            'mock': '/mock/basice/list'
        },
        //编辑基础规则
        'basice.updataBasic': {
            'type': 'POST',
            'real': '/rule/dataColumns/edit',
            'mock': "../../static/mock/common/success.json"
        },

        //表头映射列表
        'headerMapping.list': {
            'type': 'POST',
            'real': '/rule/headMap/query',
            'mock': '/mock/initialSurvey/list'
        },
        //修改状态
        'headerMapping.updataState': {
            'type': 'POST',
            'real': '/rule/headMap/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'headerMapping.delRule': {
            'type': 'POST',
            'real': '/rule/headMap/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'headerMapping.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/headMap/get',
            'mock': '/mock/initialSurvey/getUpdateInitial'
        },
        //新增
        'headerMapping.addRule': {
            'type': 'POST',
            'real': '/rule/headMap/add',
            'mock': "../../static/mock/common/success.json"
        },
        //编辑
        'headerMapping.editRule': {
            'type': 'POST',
            'real': '/rule/headMap/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //审核
        'headerMapping.updateAudit': {
            'type': 'POST',
            'real': '/rule/headMap/audit',
            'mock': "../../static/mock/common/success.json"
        },
        //批量删除
        'headerMapping.deleteBatch': {
            'type': 'POST',
            'real': '/rule/headMap/delete/batch',
            'mock': "../../static/mock/common/success.json"
        },

        //特殊字符规则列表
        'specialChart.list': {
            'type': 'POST',
            'real': '/rule/specialChart/query',
            'mock': '/mock/specialChart/list'
        },
        //修改状态
        'specialChart.updataState': {
            'type': 'POST',
            'real': '/rule/specialChart/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'specialChart.delRule': {
            'type': 'POST',
            'real': '/rule/specialChart/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //特殊字符
        'specialChart.oldSymbolList': {
            'type': 'POST',
            'real': '',
            'mock': "/mock/specialChart/oldSymbolList"
        },
        //新增
        'specialChart.addRule': {
            'type': 'POST',
            'real': '/rule/specialChart/add',
            'mock': "../../static/mock/common/success.json"
        },
        //编辑
        'specialChart.editRule': {
            'type': 'POST',
            'real': '/rule/specialChart/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'specialChart.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/specialChart/get',
            'mock': '/mock/specialChart/getUpdateSpecial'
        },
        //审核
        'specialChart.updateAudit': {
            'type': 'POST',
            'real': '/rule/specialChart/audit',
            'mock': "../../static/mock/common/success.json"
        },

        //查重规则列表
        'duplicateCheck.list': {
            'type': 'POST',
            'real': '/rule/checkRepeat/query',
            'mock': '/mock/duplicateCheck/list'
        },
        //修改状态
        'duplicateCheck.updataState': {
            'type': 'POST',
            'real': '/rule/checkRepeat/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'duplicateCheck.delRule': {
            'type': 'POST',
            'real': '/rule/checkRepeat/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'duplicateCheck.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/checkRepeat/get',
            'mock': '/mock/specialChart/getUpdateSpecial'
        },
        //新增
        'duplicateCheck.addRule': {
            'type': 'POST',
            'real': '/rule/checkRepeat/add',
            'mock': "../../static/mock/common/success.json"
        },
        //编辑
        'duplicateCheck.editRule': {
            'type': 'POST',
            'real': '/rule/checkRepeat/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //审核
        'duplicateCheck.updateAudit': {
            'type': 'POST',
            'real': '/rule/checkRepeat/audit',
            'mock': "../../static/mock/common/success.json"
        },

        //剔除规则列表
        'rejectRules.list': {
            'type': 'POST',
            'real': '/rule/checkOut/query',
            'mock': '/mock/specialChart/list'
        },
        //修改状态
        'rejectRules.updataState': {
            'type': 'POST',
            'real': '/rule/checkOut/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'rejectRules.delRule': {
            'type': 'POST',
            'real': '/rule/checkOut/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'rejectRules.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/checkOut/get',
            'mock': '/mock/rejectRules/getUpdateRule'
        },
        //新增
        'rejectRules.addRule': {
            'type': 'POST',
            'real': '/rule/checkOut/add',
            'mock': "../../static/mock/common/success.json"
        },
        //编辑
        'rejectRules.editRule': {
            'type': 'POST',
            'real': '/rule/checkOut/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //审核
        'rejectRules.updateAudit': {
            'type': 'POST',
            'real': '/rule/checkOut/audit',
            'mock': "../../static/mock/common/success.json"
        },

        //质疑规则列表
        'queryRules.list': {
            'type': 'POST',
            'real': '/rule/question/query',
            'mock': '/mock/specialChart/list'
        },
        //修改状态
        'queryRules.updataState': {
            'type': 'POST',
            'real': '/rule/question/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'queryRules.delRule': {
            'type': 'POST',
            'real': '/rule/question/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'queryRules.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/question/get',
            'mock': '/mock/queryRules/getUpdateRule'
        },
        //新增
        'queryRules.addRule': {
            'type': 'POST',
            'real': '/rule/question/add',
            'mock': "../../static/mock/common/success.json"
        },
        //编辑
        'queryRules.editRule': {
            'type': 'POST',
            'real': '/rule/question/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //审核
        'queryRules.updateAudit': {
            'type': 'POST',
            'real': '/rule/question/audit',
            'mock': "../../static/mock/common/success.json"
        },

        //互斥规则列表
        'mutexRules.list': {
            'type': 'POST',
            'real': '/rule/mutex/query',
            'mock': '/mock/specialChart/list'
        },
        //修改状态
        'mutexRules.updataState': {
            'type': 'POST',
            'real': '/rule/mutex/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'mutexRules.delRule': {
            'type': 'POST',
            'real': '/rule/mutex/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'mutexRules.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/mutex/get',
            'mock': '/mock/mutexRules/getUpdateRule'
        },
        //新增
        'mutexRules.addRule': {
            'type': 'POST',
            'real': '/rule/mutex/add',
            'mock': "../../static/mock/common/success.json"
        },
        //编辑
        'mutexRules.editRule': {
            'type': 'POST',
            'real': '/rule/mutex/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //审核
        'mutexRules.updateAudit': {
            'type': 'POST',
            'real': '/rule/mutex/audit',
            'mock': "../../static/mock/common/success.json"
        },

        //单位换算规则列表
        'convertRules.list': {
            'type': 'POST',
            'real': '/rule/unitConvert/query',
            'mock': '/mock/convertRules/list'
        },
        //修改状态
        'convertRules.updataState': {
            'type': 'POST',
            'real': '/rule/unitConvert/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'convertRules.delRule': {
            'type': 'POST',
            'real': '/rule/unitConvert/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //获取药品信息
        'convertRules.getDrug': {
            'type': 'POST',
            'real': '/rule/unitConvert/drug',
            'mock': '/mock/convertRules/getDrug'
        },
        //新增
        'convertRules.addRule': {
            'type': 'POST',
            'real': '/rule/unitConvert/add',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'convertRules.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/unitConvert/get',
            'mock': '/mock/convertRules/getUpdateRule'
        },
        //编辑
        'convertRules.editRule': {
            'type': 'POST',
            'real': '/rule/unitConvert/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //审核
        'convertRules.updateAudit': {
            'type': 'POST',
            'real': '/rule/unitConvert/audit',
            'mock': "../../static/mock/common/success.json"
        },

        //质检规则列表
        'qualityTestRules.list': {
            'type': 'POST',
            'real': '/rule/quality/query',
            'mock': '/mock/qualityTestRules/list'
        },
        //修改状态
        'qualityTestRules.updataState': {
            'type': 'POST',
            'real': '/rule/quality/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //删除
        'qualityTestRules.delRule': {
            'type': 'POST',
            'real': '/rule/quality/delete',
            'mock': "../../static/mock/common/success.json"
        },
        //新增
        'qualityTestRules.addRule': {
            'type': 'POST',
            'real': '/rule/quality/add',
            'mock': "../../static/mock/common/success.json"
        },
        //获取编辑信息
        'qualityTestRules.getUpdateRule': {
            'type': 'POST',
            'real': '/rule/quality/get',
            'mock': '/mock/qualityTestRules/getUpdateRule'
        },
        //编辑
        'qualityTestRules.editRule': {
            'type': 'POST',
            'real': '/rule/quality/edit',
            'mock': "../../static/mock/common/success.json"
        },
        //审核
        'qualityTestRules.updateAudit': {
            'type': 'POST',
            'real': '/rule/quality/audit',
            'mock': "../../static/mock/common/success.json"
        },

    }
}

//引入mockjs
// const Mock = require('mockjs')
//     //使用mockjs模拟数据
// var Random = Mock.Random;
// //数据映射规则
// Mock.mock('/mock/ruleDataMapped/list', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//             "currentPageIndex": 1,
//             "totalPageCount": 7,
//             "totalItemCount": 68,
//             "pageSize": 10,
//             "dataList|10": [{
//                 'id|+1': 1,
//                 'map_type|1': ['通用', '非通用'],
//                 'hosp_name': function() { return Random.ctitle(6) },
//                 'column_name|1': ['性别', '药品编码', '年龄', '医师职称'],
//                 'map_rule|1': ['迪巧钙片→小儿迪巧', '迪巧→小儿迪巧'],
//                 'state|1': ['0', '1', '2', '3'],
//                 'create_user': function() { return Random.cname() },
//                 'create_time': function() { return Mock.mock('@date') },
//                 'change_user': function() { return Random.cname() },
//                 'change_time': function() { return Mock.mock('@date') },
//                 'check_user': function() { return Random.cname() },
//                 'check_time': function() { return Mock.mock('@date') },
//             }]
//         }]
//     })
//     //判断规则是否存在
// Mock.mock('/mock/rule/isRepetition', {
//         'code': 0,
//         'message': "成功",
//         'data|1': ['true', 'false']
//     })
//     //基础规则
// Mock.mock('/mock/basice/list', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//             "dataList|10": [{
//                 'id|+1': 1,
//                 "date_type|1": ["购药数据", "门急诊数据", "病案数据", "医嘱数据"],
//                 'en_column_name|1': ['drug', 'drug_generic_name', 'drug_trade_name', 'price'],
//                 'column_name|1': ['药品编码', '药品通用名', '药品商品名', '单价'],
//                 'is_reported|1': ['0', '1'],
//                 'is_mapping|1': ['0', '1'],
//                 'check_type|1': ['no', 'isTime', 'isDate', 'isPositive', 'isInteger', 'isDouble']
//             }]
//         }]
//     })
//     //初检规则
// Mock.mock('/mock/initialSurvey/list', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//             "currentPageIndex": 1,
//             "totalPageCount": 7,
//             "totalItemCount": 68,
//             "pageSize": 10,
//             "dataList|10": [{
//                 'id|+1': 1,
//                 'rule_type|1': ['通用', '非通用'],
//                 'hosp_name': function() { return Random.ctitle(6) },
//                 'initial_type|1': ['数据完整性校验', '表头映射'],
//                 "date_type|1": ["购药数据", "门急诊数据", "病案数据", "医嘱数据"],
//                 'initial_rule': function() { return Random.ctitle(10) },
//                 'state|1': ['0', '1', '2', '3'],
//                 'create_user': function() { return Random.cname() },
//                 'create_time': function() { return Mock.mock('@date') },
//                 'change_user': function() { return Random.cname() },
//                 'change_time': function() { return Mock.mock('@date') },
//                 'check_user': function() { return Random.cname() },
//                 'check_time': function() { return Mock.mock('@date') },
//             }]
//         }]
//     })
//     //初检编辑
// Mock.mock('/mock/initialSurvey/getUpdateInitial', {
//         'code': 0,
//         'message': "成功",
//         'data': {
//             'id': 1,
//             'grade|1': ['0', '1'],
//             'hospital|1': ['1', '2', '3'],
//             'dataType': [1, 2],
//             'headerList': [{
//                     "id": 1,
//                     "base_column_id": 'drug',
//                     "no_column_name": function() { return Random.ctitle(3) },
//                     "en_column_name": 'drug'
//                 },
//                 {
//                     "id": 2,
//                     "base_column_id": 'drug_generic_name',
//                     "no_column_name": function() { return Random.ctitle(3) },
//                     "en_column_name": 'drug_generic_name'
//                 }
//             ]
//         }
//     })
//     //初检详情
// Mock.mock('/mock/initialSurvey/getRuleInitial', {
//         'code': 0,
//         'message': "成功",
//         'data': {
//             'id': 1,
//             'grade|1': ['0', '1'],
//             "hospitalName": function() { return Random.ctitle(3) },
//             'dataType': [1, 2],
//             "initialType|1": ['0', '1'],
//             'checkAllGroup': ['drug', 'drug_generic_name'],
//             'headerList': [{
//                     "id": 1,
//                     "base_column_id": 'drug',
//                     "no_column_name": function() { return Random.ctitle(3) },
//                     "en_column_name": 'drug'
//                 },
//                 {
//                     "id": 2,
//                     "base_column_id": 'drug_generic_name',
//                     "no_column_name": function() { return Random.ctitle(3) },
//                     "en_column_name": 'drug_generic_name'
//                 }
//             ]
//         }
//     })
//     //特殊字符规则列表
// Mock.mock('/mock/specialChart/list', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//             "currentPageIndex": 1,
//             "totalPageCount": 7,
//             "totalItemCount": 68,
//             "pageSize": 10,
//             "dataList|10": [{
//                 'id|+1': 1,
//                 'rule_type|1': ['通用', '非通用'],
//                 'special_symbol_name': function() { return Random.ctitle(3) },
//                 'hosp_name': function() { return Random.ctitle(6) },
//                 "date_type|1": ["购药数据", "门急诊数据", "病案数据", "医嘱数据"],
//                 'special_rule': function() { return Random.ctitle(10) },
//                 'remark': function() { return Random.ctitle(10) },
//                 'state|1': ['0', '1', '2', '3'],
//                 'create_user': function() { return Random.cname() },
//                 'create_time': function() { return Mock.mock('@date') },
//                 'change_user': function() { return Random.cname() },
//                 'change_time': function() { return Mock.mock('@date') },
//                 'check_user': function() { return Random.cname() },
//                 'check_time': function() { return Mock.mock('@date') },
//                 'check_out_name': function() { return Random.ctitle(6) },
//                 'question_name': function() { return Random.ctitle(6) },
//                 'display_rule': function() { return Random.ctitle(6) },
//                 'mutex_name': function() { return Random.ctitle(6) },
//             }]
//         }]
//     })
//     //查重规则列表
// Mock.mock('/mock/duplicateCheck/list', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//             "currentPageIndex": 1,
//             "totalPageCount": 7,
//             "totalItemCount": 68,
//             "pageSize": 10,
//             "dataList|10": [{
//                 'id|+1': 1,
//                 'rule_type|1': ['通用', '非通用'],
//                 'check_repeat_name': function() { return Random.ctitle(3) },
//                 'hosp_name': function() { return Random.ctitle(6) },
//                 "date_type|1": ["购药数据", "门急诊数据", "病案数据", "医嘱数据"],
//                 'columns_name|1': ['药品通用名', '商品通用名', '单价', '规格'],
//                 'repeat_rate|1': ['20%', '30%', '55%'],
//                 'remark': function() { return Random.ctitle(10) },
//                 'state|1': ['0', '1', '2', '3'],
//                 'create_user': function() { return Random.cname() },
//                 'create_time': function() { return Mock.mock('@date') },
//                 'change_user': function() { return Random.cname() },
//                 'change_time': function() { return Mock.mock('@date') },
//                 'check_user': function() { return Random.cname() },
//                 'check_time': function() { return Mock.mock('@date') },
//             }]
//         }]
//     })
//     //特殊字符
// Mock.mock('/mock/specialChart/oldSymbolList', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//                 "value": "1",
//                 "label": "1"
//             },
//             {
//                 "value": "2",
//                 "label": "2"
//             },
//             {
//                 "value": "3",
//                 "label": "♂"
//             },
//             {
//                 "value": "4",
//                 "label": "♀"
//             }
//         ]
//     })
//     //获取编辑特殊字符信息
// Mock.mock('/mock/specialChart/getUpdateSpecial', {
//         'code': 0,
//         'message': "成功",
//         'data': {
//             'id': 1,
//             'special_symbol_name': function() { return Random.ctitle(3) },
//             'rule_type|1': ['0', '1'],
//             'hosp_id|1': ['1', '2', '3'],
//             'date_type': [1, 2],
//             'checkAllGroup': ['drug', 'drug_generic_name'],
//             "old_symbol|1": ['1', '2', '3', '4'],
//             "new_symbol|1": ['男', '女'],
//             'remark': function() { return Random.ctitle(3) },
//             'check_repeat_name': function() { return Random.ctitle(3) }, //查重信息
//             'repeat_rate|1': ['23', '36', '68', '59', '77', '82'], //查重信息
//         }

//     })
//     //获取编辑剔除规则信息
// Mock.mock('/mock/rejectRules/getUpdateRule', {
//         'code': 0,
//         'message': "成功",
//         'data': {
//             'id': 1,
//             'check_out_name': function() { return Random.ctitle(3) },
//             'rule_type|1': ['0', '1'],
//             'hosp_id|1': ['1', '2', '3'],
//             'date_type': [1, 2],
//             'check_out_list': '[{"rejectRelationOne":"","rejectValue":"drug_trade_name","rejectBracket":"==","rejectText":"1","rejectConditional":"and","rejectRelationTwo":""},{"rejectRelationOne":"(","rejectValue":"drug_generic_name","rejectBracket":"!=","rejectText":"2","rejectConditional":"or","rejectRelationTwo":""},{"rejectRelationOne":"","rejectValue":"drug_trade_name","rejectBracket":">","rejectText":"4","rejectConditional":"","rejectRelationTwo":")"}]',
//             'code_rule': "drug_trade_name==1 and (drug_generic_name!=2 or drug_trade_name>4  )",
//             'remark': function() { return Random.ctitle(3) }
//         }

//     })
//     //获取编辑质疑规则信息
// Mock.mock('/mock/queryRules/getUpdateRule', {
//         'code': 0,
//         'message': "成功",
//         'data': {
//             'id': 1,
//             'question_name': function() { return Random.ctitle(3) },
//             'rule_type|1': ['0', '1'],
//             'hosp_id|1': ['1', '2', '3'],
//             'date_type': [1, 2],
//             'question_list': '[{"queryRelationOne":"","queryValue":"drug_trade_name","queryBracket":"==","queryText":"1","queryConditional":"and","queryRelationTwo":""},{"queryRelationOne":"(","queryValue":"drug_generic_name","queryBracket":"!=","queryText":"2","queryConditional":"or","queryRelationTwo":""},{"queryRelationOne":"","queryValue":"drug_trade_name","queryBracket":">","queryText":"4","queryConditional":"","queryRelationTwo":")"}]',
//             'code_rule': "drug_trade_name==1 and (drug_generic_name!=2 or drug_trade_name>4  )",
//             'remark': function() { return Random.ctitle(3) }
//         }

//     })
//     //获取编辑互斥规则信息
// Mock.mock('/mock/mutexRules/getUpdateRule', {
//         'code': 0,
//         'message': "成功",
//         'data': {
//             'id': 1,
//             'mutex_name': function() { return Random.ctitle(3) },
//             'rule_type|1': ['0', '1'],
//             'hosp_id|1': ['1', '2', '3'],
//             'date_type': [1, 2],
//             'mutex_list': '[{"mutexRelationOne":"","mutexValue":"drug_trade_name","mutexBracket":"==","mutexText":"1","mutexConditional":"and","mutexRelationTwo":""},{"mutexRelationOne":"(","mutexValue":"drug_generic_name","mutexBracket":"!=","mutexText":"2","mutexConditional":"or","mutexRelationTwo":""},{"mutexRelationOne":"","mutexValue":"drug_trade_name","mutexBracket":">","mutexText":"4","mutexConditional":"","mutexRelationTwo":")"}]',
//             'code_rule': "drug_trade_name==1 and (drug_generic_name!=2 or drug_trade_name>4  )",
//             'remark': function() { return Random.ctitle(3) }
//         }

//     })
//     //单位换算规则列表
// Mock.mock('/mock/convertRules/list', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//             "currentPageIndex": 1,
//             "totalPageCount": 7,
//             "totalItemCount": 68,
//             "pageSize": 10,
//             "dataList|10": [{
//                 'id|+1': 1,
//                 'unit_convert_name': function() { return Random.ctitle(3) },
//                 'hosp_name': function() { return Random.ctitle(6) },
//                 "date_type|1": ["购药数据", "门急诊数据", "病案数据", "医嘱数据"],
//                 'drug|1': ["NB001", "NB002", "Nb003", "Nb004"],
//                 'drug_generic_name|1': ["小儿迪巧", "维生素", "青霉素"],
//                 'spec_convert|1': ["单只单片", "整包装"],
//                 'remark': function() { return Random.ctitle(10) },
//                 'state|1': ['0', '1', '2', '3'],
//                 'create_user': function() { return Random.cname() },
//                 'create_time': function() { return Mock.mock('@date') },
//                 'change_user': function() { return Random.cname() },
//                 'change_time': function() { return Mock.mock('@date') },
//                 'check_user': function() { return Random.cname() },
//                 'check_time': function() { return Mock.mock('@date') },
//             }]
//         }]
//     })
//     //获取单位换算药品信息
// Mock.mock('/mock/convertRules/getDrug', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//                 value: 1,
//                 label: "NB001(小儿迪巧)"
//             },
//             {
//                 value: 2,
//                 label: "NB002(维生素)"
//             },
//             {
//                 value: 3,
//                 label: "NB003(青霉素)"
//             }
//         ]

//     })
//     //获取编辑单位换算规则信息
// Mock.mock('/mock/convertRules/getUpdateRule', {
//         'code': 0,
//         'message': "成功",
//         'data': {
//             'unit_convert_id': 1,
//             'unit_convert_name': function() { return Random.ctitle(3) },
//             'hosp_id|1': ['1', '2', '3'],
//             'date_type|1': [1, 2],
//             'drug|1': [1, 2, 3],
//             'spec_convert|1': ["1", "2"],
//             'remark': function() { return Random.ctitle(10) }
//         }

//     })
//     //单位换算规则列表
// Mock.mock('/mock/qualityTestRules/list', {
//         'code': 0,
//         'message': "成功",
//         'data': [{
//             "currentPageIndex": 1,
//             "totalPageCount": 7,
//             "totalItemCount": 68,
//             "pageSize": 10,
//             "dataList|10": [{
//                 'id|+1': 1,
//                 'quality_name': function() { return Random.ctitle(3) },
//                 "date_type|1": ["购药数据", "门急诊数据", "病案数据", "医嘱数据"],
//                 'quality_column_name|1': ["单价", "数量", "金额"],
//                 'ratio_section|1': ["20%-30%", "10%-15%", "3%-9%"],
//                 'remark': function() { return Random.ctitle(10) },
//                 'state|1': ['0', '1', '2', '3'],
//                 'create_user': function() { return Random.cname() },
//                 'create_time': function() { return Mock.mock('@date') },
//                 'change_user': function() { return Random.cname() },
//                 'change_time': function() { return Mock.mock('@date') },
//                 'check_user': function() { return Random.cname() },
//                 'check_time': function() { return Mock.mock('@date') },
//             }]
//         }]
//     })
//     //获取编辑质检规则信息
// Mock.mock('/mock/qualityTestRules/getUpdateRule', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         'quality_id': 1,
//         'quality_name': function() { return Random.ctitle(3) },
//         'date_type|1': [1, 2],
//         'quality_column_name|1': ["price", "quantity", "amount"],
//         'ratio_start': "20%",
//         'ratio_end': "30%",
//         'remark': function() { return Random.ctitle(10) }
//     }

// })