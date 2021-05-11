export default {
    router: {
        path: "/reportForms",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
            path: "/reportForms/reportFormsManager",
            component: resolve => require(['@/components/reportForms/reportFormsManager'], resolve)
        }, {
            path: "/reportForms/reportTypeManager",
            component: resolve => require(['@/components/reportForms/reportTypeManager'], resolve)
        }]
    },
    urls: {
        'reportForms.list': {
            'type': 'POST',
            'real': '/reportLog/query',
            'mock': '/mock/reportForms/list'
        },
        'reportForms.excel': {
            'type': 'POST',
            'real': '/reportLog/excel',
            'mock': '/mock/reportForms/list'
        },
        'reportForms.getReportType': {
            'type': 'POST',
            'real': '/reportLog/typeList',
            'mock': '/mock/reportForms/list'
        },
    }
}

//引入mockjs
// const Mock = require('mockjs')
//     //使用mockjs模拟数据
// var Random = Mock.Random;
// Mock.mock('/mock/reportForms/list', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 7,
//         "totalItemCount": 68,
//         "pageSize": 10,
//         "dataList|10": [{
//             'reportId|+1': 1,
//             'rankType|1': ['全国版', '省厅版', '医院版'],
//             'reportType|1': ['分析报告', '统计报告', '数据检索', '数据报告', '智能分析'],
//             'yearDate|1': [2015, 2016, 2017, 2018],
//             'province': function() { return Random.province() },
//             'city': function() { return Random.city() },
//             'hospitalName': function() { return Random.ctitle(6) },
//             'reportName': function() { return Random.ctitle(6) },
//             'status|1': ['0', '1', '2'],
//             'foundName': function() { return Random.cname() },
//             'foundDate': function() { return Mock.mock('@date') },
//             'disableName': function() { return Random.cname() },
//             'disableDate': function() { return Mock.mock('@date') },
//         }]
//     }]
// })
// Mock.mock('/mock/reportManager/reportManagerPDF', {
//     'code': 0,
//     'message': "成功",
//     'data': ["/static/file/demo.pdf"]
// })
// Mock.mock('/mock/reportManager/templateList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//             'value': "1",
//             'label': "模板一"
//         },
//         {
//             'value': "2",
//             'label': "模板二"
//         },
//         {
//             'value': "3",
//             'label': "模板三"
//         }
//     ]
// })
// Mock.mock('/mock/reportManager/sampleList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//             'value': "1",
//             'label': "样本一"
//         },
//         {
//             'value': "2",
//             'label': "样本二"
//         },
//         {
//             'value': "3",
//             'label': "样本三"
//         }
//     ]
// })