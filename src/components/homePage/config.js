import config from "../../config";
export default {
    router: {
        path: "/homePage",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "/homePage/list",
                component: resolve => require(['@/components/homePage/list'], resolve)
            }



        ]
    },
    urls: {
        'warn.list': {
            'type': 'POST',
            'real': '/warn/query',
            'mock': '/mock/feedBackList'
        },
        'warn.add': {
            'type': 'POST',
            'real': '/warn/add',
            'mock': '../../../static/mock/common/success.json'
        },
        'warn.get': {
            'type': 'POST',
            'real': '/warn/get',
            'mock': '../../../static/mock/common/success.json'
        },

    }
}