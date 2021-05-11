import config from "../../config";
export default {
    router: {
        path: "/login",
        component: {
            template: '<router-view></router-view>'
        },
        children: [{
            path: "",
            component: resolve => require(['@/components/login/index'], resolve),
            meta: { auth: false }
        }]
    },
    urls: {
        'user.login': {
            'type': 'POST',
            'real': '/login',
            'mock': '../../static/mock/login/user_login.json',
            'apiPrefix': config.authApiPrefix,
        },
        'user.loginOut': {
            'type': 'POST',
            'real': '/logout',
            'mock': '/mock/api/data',
            'apiPrefix': config.authApiPrefix,
        },
        'user.changePwd': {
            'type': 'POST',
            'real': '/user/changepwd',
            'mock': '../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix,
        },
        'user.noticelist': {
            'type': 'POST',
            'real': '/notice/getUserUnreadNotices',
            'mock': '/mock/api/data'
        },
        'user.readnotice': {
            'type': 'POST',
            'real': '/notice/readNotice',
            'mock': '../../static/mock/common/success.json'
        },
        'role.authlist': {
            'type': "post",
            'real': '/auth/getAuthByRole',
            'mock': '../../static/mock/role/role_auth_getAuthByRole_{userType}.json',
        }
    }
}

//引入mockjs
// const Mock = require('mockjs')
//     //使用mockjs模拟数据
// Mock.mock('/mock/api/data', { //匹配.json文件，可执行匹配成功的参数
//     'list|1-10': [{ //数据模板
//         'id|+1': 1,
//         'email': '@email',
//         'regexp4': /\d{5,10}/,
//         'name': '@cname', //随机产生一个中文的姓名
//     }]
// })