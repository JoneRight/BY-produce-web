import config from "../../config";
export default {
    router: {
        path: "/dataReportManage",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "/dataReportManage/dataReportManage",
                component: resolve => require(['@/components/dataReportManage/dataReportManage'], resolve)
            },
            {
                path: "/dataReportManage/detail",
                component: resolve => require(['@/components/dataReportManage/detail'], resolve)
            }


        ]
    },
    urls: {
        'reportType.list': {
            'type': 'POST',
            'real': '/report/data/type/list',
            'mock': '../../../../static/mock/common/success.json'
        },
        'dataReport.add': {
            'type': 'POST',
            'real': '/report/data/add',
            'mock': '../../../../static/mock/common/success.json'
        },
        'dataReport.list': {
            'type': 'POST',
            'real': '/report/data/query',
            'mock': '../../../../static/mock/common/success.json'
        },
        'dataReport.detail': {
            'type': 'POST',
            'real': '/report/data/get',
            'mock': '../../../../static/mock/common/success.json'
        },
        'dataReport.del': {
            'type': 'POST',
            'real': '/report/data/delete',
            'mock': '../../../../static/mock/common/success.json'
        },
        'dataReport.edit': {
            'type': 'POST',
            'real': '/report/data/edit',
            'mock': '../../../../static/mock/common/success.json'
        },
        'dataReport.publish': {
            'type': 'POST',
            'real': '/report/data/publish',
            'mock': '../../../../static/mock/common/success.json'
        },
        'userType.userTree': {
            'type': 'POST',
            'real': '/userType/userTree',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        }

    }
}








// //引入mockjs
// const Mock = require('mockjs')
//     //使用mockjs模拟数据
// var Random = Mock.Random;

// //城市
// Mock.mock('/mock/systemList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 28,
//         "pageSize": 10,
//         "dataList|10": [{
//             'systemId|+1': 1,
//             'systemName': '标准库管理'
//         }]
//     }]
// })