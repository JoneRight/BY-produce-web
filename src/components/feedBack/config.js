import config from "../../config";
export default {
    router: {
        path: "/feedBack",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "/feedBack/list",
                component: resolve => require(['@/components/feedBack/list'], resolve)
            },
            {
                path: "/feedBack/add",
                component: resolve => require(['@/components/feedBack/add'], resolve)
            },
            {
                path: "/feedBack/detail",
                component: resolve => require(['@/components/feedBack/detail'], resolve)
            }
        ]
    },
    urls: {
        'feedBack.list': {
            'type': 'POST',
            'real': '/feedBack/query',
            'mock': '/mock/feedBackList'
        },
        'feedBack.get': {
            'type': 'POST',
            'real': '/feedBack/get',
            'mock': '/mock/feedBackList'
        },
        'feedBack.add': {
            'type': 'POST',
            'real': '/feedBack/add',
            'mock': '../../../static/mock/common/success.json'
        },
        'feedBack.del': {
            'type': 'POST',
            'real': '/feedBack/delete',
            'mock': '../../static/mock/common/success.json'
        },
        'feedBack.revoke': {
            'type': 'POST',
            'real': '/feedBack/revoke',
            'mock': '../../static/mock/common/success.json'
        },
        'feedBack.handle': {
            'type': 'POST',
            'real': '/feedBack/handle',
            'mock': '../../static/mock/common/success.json'
        },
        'feedBack.handleGet': {
            'type': 'POST',
            'real': '/feedBack/handleGet',
            'mock': '../../static/mock/common/success.json'
        },
        'deptUser.list': {
            'type': 'POST',
            'real': '/user/deptUserQuery',
            'mock': '../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'feedBack.proType': {
            'type': 'POST',
            'real': '/feedBack/proTypeQuery',
            'mock': '../../static/mock/common/success.json'
        },
        'feedBack.proStage': {
            'type': 'POST',
            'real': '/feedBack/proStageQuery',
            'mock': '../../static/mock/common/success.json'
        }
    }
}



// //??????mockjs
// const Mock = require('mockjs')
//     //??????mockjs????????????
// var Random = Mock.Random;

// //??????????????????
// Mock.mock('/mock/feedBackList', {
//     'code': 0,
//     'message': "??????",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'feedbackId|+1': 1,
//             'headName': '????????????',
//             'feedStep': '????????????',
//             'problemType': '????????????',
//             'feedName': 'admin',
//             'feedTime': '2018-08-10',
//             'replyTime': '2018-10-12',
//             'province': '?????????',
//             'city': '?????????',
//             'hospId': '370158',
//             'hospName': '????????????????????????',
//             'date': '2018???8???',
//             'proDesc': '????????????',
//             'urgent': '??????',
//             'status': '?????????'
//         }]
//     }]
// })