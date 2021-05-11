import config from "../../config";
export default {
    router: {
        path: "/authority",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "/authority/system/list",
                component: resolve => require(['@/components/authority/system/list'], resolve)
            },
            {
                path: "/authority/system/detail",
                component: resolve => require(['@/components/authority/system/detail'], resolve)
            },
            {
                path: "/authority/menu/list",
                component: resolve => require(['@/components/authority/menu/list'], resolve)
            },
            {
                path: "/authority/user/list",
                component: resolve => require(['@/components/authority/user/list'], resolve)
            },
            {
                path: "/authority/user/detail",
                component: resolve => require(['@/components/authority/user/detail'], resolve)
            },
            {
                path: "/authority/user/add",
                component: resolve => require(['@/components/authority/user/add'], resolve)
            },
            {
                path: "/authority/user/userSystem",
                component: resolve => require(['@/components/authority/user/userSystem'], resolve)
            },
            {
                path: "/authority/user/userDept",
                component: resolve => require(['@/components/authority/user/userDept'], resolve)
            },
            {
                path: "/authority/role/list",
                component: resolve => require(['@/components/authority/role/list'], resolve)
            },
            {
                path: "/authority/role/detail",
                component: resolve => require(['@/components/authority/role/detail'], resolve)
            },
            {
                path: "/authority/role/roleAuth",
                component: resolve => require(['@/components/authority/role/roleAuth'], resolve)
            },
            {
                path: "/authority/authority/list",
                component: resolve => require(['@/components/authority/authority/list'], resolve)
            },
            {
                path: "/authority/product/plist",
                component: resolve => require(['@/components/authority/product/plist'], resolve)
            },
            {
                path: "/authority/product/list",
                component: resolve => require(['@/components/authority/product/list'], resolve)
            },
            {
                path: "/authority/product/renewList",
                component: resolve => require(['@/components/authority/product/renewList'], resolve)
            },
            {
                path: "/authority/product/userProList",
                component: resolve => require(['@/components/authority/product/userProList'], resolve)
            },
            {
                path: "/authority/product/productList",
                component: resolve => require(['@/components/authority/product/productList'], resolve)
            },
            {
                path: "/authority/product/addProduct",
                component: resolve => require(['@/components/authority/product/addProduct'], resolve)
            },
            {
                path: "/authority/product/add",
                component: resolve => require(['@/components/authority/product/addP'], resolve)
            },
            {
                path: "/authority/product/addUserProduct",
                component: resolve => require(['@/components/authority/product/addUserProduct'], resolve)
            },
            {
                path: "/authority/product/editUserProduct",
                component: resolve => require(['@/components/authority/product/editUserProduct'], resolve)
            },
            {
                path: "/authority/product/edit",
                component: resolve => require(['@/components/authority/product/edit'], resolve)
            },
            {
                path: "/authority/product/pedit",
                component: resolve => require(['@/components/authority/product/pedit'], resolve)
            },
            {
                path: "/authority/dept/list",
                component: resolve => require(['@/components/authority/dept/list'], resolve)
            },
            {
                path: "/authority/busmanager/list",
                component: resolve => require(['@/components/authority/busmanager/list'], resolve)
            },
            {
                path: "/authority/busmanager/edit",
                component: resolve => require(['@/components/authority/busmanager/edit'], resolve)
            }



        ]
    },
    urls: {
        'system.list': {
            'type': 'POST',
            'real': '/system/list',
            'mock': '../../../../static/mock/authority/systemList.json',
            'apiPrefix': config.authApiPrefix
        },
        'system.add': {
            'type': 'POST',
            'real': '/system/add',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'system.detail': {
            'type': 'POST',
            'real': '/system/get',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'system.edit': {
            'type': 'POST',
            'real': '/system/edit',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'system.del': {
            'type': 'POST',
            'real': '/system/delete',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },

        'menu.list': {
            'type': 'POST',
            'real': '/menu/query',
            'mock': '../../../../static/mock/authority/menuList.json',
            'apiPrefix': config.authApiPrefix
        },
        'menu.add': {
            'type': 'POST',
            'real': '/menu/add',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'menu.detail': {
            'type': 'POST',
            'real': '/menu/get',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'menu.edit': {
            'type': 'POST',
            'real': '/menu/edit',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'menu.del': {
            'type': 'POST',
            'real': '/menu/delete',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },




        'user.list': {
            'type': 'POST',
            'real': '/user/query',
            'mock': '../../../../static/mock/authority/userList.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.productList': {
            'type': 'POST',
            'real': '/product/getUserProduct',
            'mock': '',
            'apiPrefix': config.authApiPrefix
        },
        'user.userTypeList': {
            'type': 'POST',
            'real': '/userType/list',
            'mock': '',
            'apiPrefix': config.authApiPrefix
        },
        'user.detail': {
            'type': 'POST',
            'real': '/user/get',
            'mock': '/mock/userDetail',
            'apiPrefix': config.authApiPrefix
        },
        'user.ownDept': {
            'type': 'POST',
            'real': '/user/getUserOwnDept',
            'mock': '/mock/userDetail',
            'apiPrefix': config.authApiPrefix
        },
        'user.userProDetail': {
            'type': 'POST',
            'real': '/product/getUserProductInfo',
            'mock': '/mock/userDetail',
            'apiPrefix': config.authApiPrefix
        },
        'user.add': {
            'type': 'POST',
            'real': '/user/add',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.child.add': {
            'type': 'POST',
            'real': '/product/child/add',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.addUserProduct': {
            'type': 'POST',
            'real': '/product/addUserProduct',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.editUserProduct': {
            'type': 'POST',
            'real': '/product/editUserProduct',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.deleteUserProduct': {
            'type': 'POST',
            'real': '/product/deleteUserProduct',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.edit': {
            'type': 'POST',
            'real': '/user/edit',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.del': {
            'type': 'POST',
            'real': '/user/delete',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.updateUserRole': {
            'type': 'POST',
            'real': '/user/updateRole',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.updateDept': {
            'type': 'POST',
            'real': '/user/updateDpet',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.updateSystem': {
            'type': 'POST',
            'real': '/user/updateSystem',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.getUserRole': {
            'type': 'POST',
            'real': '/user/queryRole',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'user.resetPwd': {
            'type': 'POST',
            'real': '/user/resetPwd',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },




        'role.list': {
            'type': 'POST',
            'real': '/role/queryRole',
            'mock': '../../../../static/mock/authority/roleList.json',
            'apiPrefix': config.authApiPrefix
        },
        'role.detail': {
            'type': 'POST',
            'real': '/role/getRole',
            'mock': '',
            'apiPrefix': config.authApiPrefix
        },
        'role.add': {
            'type': 'POST',
            'real': '/role/addRole',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'role.edit': {
            'type': 'POST',
            'real': '/role/editRole',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'role.del': {
            'type': 'POST',
            'real': '/role/deleteRole',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'role.queryAuthByRole': {
            'type': 'POST',
            'real': '/role/queryAuthByRole',
            'mock': '/mock/roleList',
            'apiPrefix': config.authApiPrefix
        },
        'role.queryAuthBySystemId': {
            'type': 'POST',
            'real': '/role/queryAuthBySystemId',
            'mock': '/mock/roleList',
            'apiPrefix': config.authApiPrefix
        },
        'role.queryAuth': {
            'type': 'POST',
            'real': '/role/queryAuth',
            'mock': '/mock/roleList',
            'apiPrefix': config.authApiPrefix
        },
        'roleAuth.add': {
            'type': 'POST',
            'real': '/role/roleAuth',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },


        'auth.list': {
            'type': 'POST',
            'real': '/role/queryAuth',
            'mock': '../../../../static/mock/authority/authorityList.json',
            'apiPrefix': config.authApiPrefix
        },
        'auth.add': {
            'type': 'POST',
            'real': '/role/addAuth',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'auth.edit': {
            'type': 'POST',
            'real': '/role/editAuth',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'auth.del': {
            'type': 'POST',
            'real': '/role/deleteAuth',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },


        'product.list': {
            'type': 'POST',
            'real': '/product/query',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.child.list': {
            'type': 'POST',
            'real': '/product/child/query',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.renew.list': {
            'type': 'POST',
            'real': '/product/renew/list',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.renew.call': {
            'type': 'POST',
            'real': '/product/renew/call',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.detail': {
            'type': 'POST',
            'real': '/product/get',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.info': {
            'type': 'POST',
            'real': '/product/info',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.info.user': {
            'type': 'POST',
            'real': '/product/info/user',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.child.info': {
            'type': 'POST',
            'real': '/product/child/info',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.child.all': {
            'type': 'POST',
            'real': '/product/child/all',
            'mock': '/mock/userDetail',
            'apiPrefix': config.authApiPrefix
        },
        'product.child.self.user': {
            'type': 'POST',
            'real': '/product/child/self',
            'mock': '/mock/userDetail',
            'apiPrefix': config.authApiPrefix
        },
        'product.child.edit': {
            'type': 'POST',
            'real': '/product/child/edit',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.child.editStatus': {
            'type': 'POST',
            'real': '/product/child/editStatus',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.dimVals': {
            'type': 'POST',
            'real': '/product/dimVals/list',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.dimVals.self': {
            'type': 'POST',
            'real': '/product/dimVals/self',
            'mock': '/mock/productList',
            'apiPrefix': config.authApiPrefix
        },
        'product.dimensionList': {
            'type': 'POST',
            'real': '/product/dimension/list',
            'mock': '../../../../static/mock/search/dms-list.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.measureList': {
            'type': 'POST',
            'real': '/product/measure/list',
            'mock': '../../../../static/mock/search/dms-list.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.cubeDesc': {
            'type': 'POST',
            'real': '/product/cube_desc',
            'mock': '../../../../static/mock/search/dms-list.json',
            'apiPrefix': config.apiPrefix
        },
        'product.cubeList': {
            'type': 'POST',
            'real': '/product/list/cubes',
            'mock': '../../../../static/mock/role/dimensionSelectList.json',
            'apiPrefix': config.apiPrefix
        },
        'product.add': {
            'type': 'POST',
            'real': '/product/add',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.edit': {
            'type': 'POST',
            'real': '/product/edit',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.editProStatus': {
            'type': 'POST',
            'real': '/product/editProStatus',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.del': {
            'type': 'POST',
            'real': '/product/delete',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'product.user.list': {
            'type': 'POST',
            'real': '/product/user/list',
            'mock': '../../../../static/mock/authority/userList.json',
            'apiPrefix': config.authApiPrefix
        },

        'data.proList': {
            'type': 'POST',
            'real': '',
            mock: "../../../static/mock/search/pro-list.json"
        },
        'data.scaleList': {
            'type': 'POST',
            'real': '',
            mock: "../../../static/mock/search/scale-list.json"
        },
        'data.dmsList': {
            'type': 'POST',
            'real': '',
            mock: "../../../static/mock/search/dms-list.json"
        },




        'dept.list': {
            'type': 'POST',
            'real': '/dept/query',
            'mock': '/mock/deptList',
            'apiPrefix': config.authApiPrefix
        },
        'dept.add': {
            'type': 'POST',
            'real': '/dept/add',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'dept.edit': {
            'type': 'POST',
            'real': '/dept/edit',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'dept.get': {
            'type': 'POST',
            'real': '/dept/get',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'dept.del': {
            'type': 'POST',
            'real': '/dept/delete',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },

        'busmanager.list': {
            'type': 'POST',
            'real': '/busmanager/query',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'busmanager.getUser': {
            'type': 'POST',
            'real': '/busmanager/get',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'busmanager.getProvince': {
            'type': 'POST',
            'real': '/busmanager/province',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },
        'busmanager.save': {
            'type': 'POST',
            'real': '/busmanager/save',
            'mock': '../../../../static/mock/common/success.json',
            'apiPrefix': config.authApiPrefix
        },




        //成功删除一条数据的提示    
        'common.del': {
            'type': 'POST',
            'real': '',
            'mock': '../../../../static/mock/common/success.json'
        },
        //成功保存一条数据的提示
        'common.save': {
            'type': 'POST',
            'real': '',
            'mock': '../../../../static/mock/common/success.json'
        },

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



// //用户列表
// Mock.mock('/mock/userList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'loginName': 'A001',
//             'userName|+1': 'user1',
//             'blocSystem': 'BI系统',
//             'role': '质检员',
//             'product': '门急诊产品C',
//             'company': '百洋医药集团'
//         }]
//     }]
// })


// //用户详情
// Mock.mock('/mock/userDetail', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList": {
//             'loginName': 'A001',
//             'userName': 'user1',
//             'loginPasswd': '123456',
//             'gender': '0',
//             'position': '门急诊产品C',
//             'address': '百洋医药集团',
//             'deptName': '信息部',
//             'email': '123568@qq.com',
//             'specialty': '',
//             'title': '',
//             'officPhone': '',
//             'mobile': '13916669999',
//             'fax': ''
//         }
//     }]
// })



// //产品列表
// Mock.mock('/mock/productList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'productId': 'A001',
//             'productName': function() { return Random.ctitle(5) },
//             'productType|+1': '产品1',
//             'dataType': '购药数据',
//             'totalCount': '1000',
//             'exportCount': '500',
//             'productBeginDate': function() { return Mock.mock('@date') },
//             'productEndDate': function() { return Mock.mock('@date') },
//             'productStatus': '有效',
//             'createTime': function() { return Mock.mock('@date') },
//             'createUser': 'admin',
//             'updateTime': function() { return Mock.mock('@date') },
//             'updateUser': 'admin'
//         }]
//     }]
// })


// //roleList角色管理列表
// Mock.mock('/mock/roleList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'roleId|+1': 1,
//             'roleName': function() { return Random.ctitle(5) },
//             'roleSystemId': '业务系统',
//             'roleRemark': function() { return Random.ctitle(30) }
//         }]
//     }]
// })


// //权限管理列表
// Mock.mock('/mock/authList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'authId|+1': 1,
//             'authNo': '001',
//             'authName': '首页列表',
//             'menuName': '首页'
//         }]
//     }]
// })




// //菜单管理列表
// Mock.mock('/mock/menuList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'menuId': 1,
//             'menuNo': '002',
//             'menuName': '规则管理',
//             'menuParentId': 1,
//             'menuOrder': '2101',
//             'menuSubName': '数据映射规则、质疑规则、单位换算规则、数据映射规则、质疑规则、单位换算规则、数据映射规则、质疑规则、单位换算规则、数据映射规则、质疑规则、单位换算规则、数据映射规则、质疑规则、单位换算规则',
//             'menuSystemId': '百洋业务系统'
//         }]
//     }]
// })





// // //产品维度列表
// // Mock.mock('/mock/proDimensionList', { 
// //     'code':0,
// //     'message':"成功",
// //     'data':[
// //         {
// //             "currentPageIndex":1,
// //             "totalPageCount":1,
// //             "totalItemCount":18,
// //             "pageSize":10,
// //             "dataList|10":[{
// //                 'Id|+1': 1,
// //                 'dimensionName': function(){return Random.ctitle(5)} 
// //             }]
// //         }
// //     ]
// // })


// //用户产品列表
// Mock.mock('/mock/uesrProList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'userProductId|+1': 1,
//             'productId': 'A001',
//             'productName': function() { return Random.ctitle(5) },
//             'userName': function() { return Random.cname() },
//             'dataType': '门急诊药品数据',
//             'productType|+1': 'user1',
//             'totalCount|+100': 1000,
//             'exportCount|+100': 300,
//             'beginTime': function() { return Mock.mock('@date') },
//             'endTime': function() { return Mock.mock('@date') },
//             'createTime': function() { return Mock.mock('@date') },
//             'createUser': 'admin',
//             'updateTime': function() { return Mock.mock('@date') },
//             'updateUser': 'admin'
//         }]
//     }]
// })




// //部门列表
// Mock.mock('/mock/deptList', {
//     'code': 0,
//     'message': "成功",
//     'data': [{
//         "currentPageIndex": 1,
//         "totalPageCount": 1,
//         "totalItemCount": 18,
//         "pageSize": 10,
//         "dataList|10": [{
//             'deptId|+1': 1,
//             'deptNo': 'A001',
//             'deptName': function() { return Random.ctitle(5) },
//             'deptParentId': function() { return Random.ctitle(5) },
//             'deptSystemId': 'baiyang',
//             'productType|+1': 'user1',
//             'deptCreateTime': function() { return Mock.mock('@date') },
//             'deptCreateUser': 'admin',
//             'deptUpdateTime': function() { return Mock.mock('@date') },
//             'deptUpdateUser': 'admin'
//         }]
//     }]
// })