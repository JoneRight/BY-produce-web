export default {
    router: {
        path: "/systemConfig",
        component: {
            template: '<router-view></router-view>'
        },
        children: [
            {
                path: "/systemConfig/systemConfig",
                component: resolve => require(['@/components/systemConfig/systemConfig'], resolve)
            }



        ]
    },
    urls: {
        'systemConfig.updateSettings':{
            'type': 'POST',
            'real': '/message/settings/edit',
            'mock':'../../../../static/mock/common/success.json'
        },
        'systemConfig.getSettings':{
            'type': 'POST',
            'real': '/message/settings',
            'mock':'../../../../static/mock/common/success.json'
        }
    }
}



