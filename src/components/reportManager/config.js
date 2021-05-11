export default {
    router: {
        path: "/reportManager",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "/reportManager/reportManager",
                component: resolve => require(['@/components/reportManager/reportManage'], resolve)
            },
            {
                path: "/reportManager/reportManagerAdd",
                component: resolve => require(['@/components/reportManager/reportManagerAdd'], resolve)
            }
        ]
    },
    urls: {
        'reportManager.list': {
            'type': 'POST',
            'real': '/report/manage/query',
            'mock': '/mock/reportManager/list'
        },
        'reportManager.publish': {
            'type': 'POST',
            'real': '/report/manage/publish',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.uploadFile': {
            'type': 'POST',
            'real': '/report/manage/upload',
            'mock': '/mock/reportManager/list'
        },
        'reportManager.stopReport': {
            'type': 'POST',
            'real': '/report/manage/stop',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.deleteReport': {
            'type': 'POST',
            'real': '/report/manage/delete',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.sourceList': {
            'type': 'POST',
            'real': '/report/source/list',
            'mock': '/mock/reportManager/list'
        },
        'reportManager.updata': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.show': {
            'type': 'POST',
            'real': '/report/show',
            'mock': '/mock/reportManager/reportManagerPDF'
        },
        'reportManager.reportManagerPDF': {
            'type': 'POST',
            'real': '',
            'mock': '/mock/reportManager/reportManagerPDF'
        },
        'reportManager.sampleList': {
            'type': 'POST',
            'real': '',
            'mock': '/mock/reportManager/sampleList'
        },
        'reportManager.addRule': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.DeleteManager': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.batchDelete': {
            'type': 'POST',
            'real': '',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.loadDataSource': {
            'type': 'POST',
            'real': '/report/prepare/loadData',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.createCube': {
            'type': 'POST',
            'real': '/report/prepare/cubeBuild',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.getCube': {
            'type': 'POST',
            'apiPrefix': '',
            'real': '../../static/mock/common/success.json',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.fillDataSource': {
            'type': 'POST',
            'real': '/report/prepare/fillData',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.updateCube': {
            'type': 'POST',
            'apiPrefix': '',
            'real': '../../static/mock/common/success.json',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.template.list': {
            'real': '/report/templates',
            'mock': "/mock/reportManager/templateList"
        },
        'reportManager.isCreateReport': {
            'type': 'POST',
            'real': '/report/manage/isAdd',
            'mock': "/mock/reportManager/templateList"
        },
        'reportManager.createReport': {
            'type': 'POST',
            'real': '/report/manage/add',
            'mock': "/mock/reportManager/templateList"
        },
        'reportManager.createPDF': {
            'type': 'POST',
            'real': '/reportFile/create',
            'mock': "/mock/reportManager/templateList"
        },
        'reportManager.getSourceDataStatus': {
            'type': 'POST',
            'real': '/report/prepare/loadData/status',
            'mock': "../../static/mock/common/success.json"
        },
        'reportManager.getCubeBuildStatus': {
            'type': 'POST',
            'real': '/report/prepare/cubeBuild/status',
            'mock': "../../static/mock/common/success.json"
        },
        'hospital.group.detail': {
            'type': 'POST',
            'real': '/hospital/group/get',
            'mock': "../../static/mock/common/success.json"
        },



    }
}

//引入mockjs
// const Mock = require('mockjs')
//     //使用mockjs模拟数据
// var Random = Mock.Random;
// Mock.mock('/mock/reportManager/list', {
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
//     'data': ["模板一", "模板二", "模板三"]
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