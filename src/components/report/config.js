import config from "../../config";
export default {
    router: {
        path: "/report",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "/report/reportManage",
                component: resolve => require(['@/components/report/reportManage'], resolve)
            },
            {
                path: "/report/replace",
                component: resolve => require(['@/components/report/replace'], resolve)
            },
            {
                path: "/report/replaceRate",
                component: resolve => require(['@/components/report/replaceRateNew'], resolve)
            },
            {
                path: "/report/urge",
                component: resolve => require(['@/components/report/urge'], resolve)
            },
            {
                path: "/report/urgeHistory",
                component: resolve => require(['@/components/report/urgeHistory'], resolve)
            },
            {
                path: "/report/hospital",
                component: resolve => require(['@/components/report/hospital'], resolve)
            },
            {
                path: "/report/hospital/:tabname",
                meta: { baseUrl: "/report/hospital" },
                component: resolve => require(['@/components/report/hospital'], resolve)
            },
            {
                path: "/report/hospitalAdd",
                component: resolve => require(['@/components/report/hospitalAdd'], resolve)
            },
            {
                path: "/report/hospitalContactor",
                component: resolve => require(['@/components/report/hospitalContactor'], resolve)
            },
            {
                path: "/report/hospitalSet",
                component: resolve => require(['@/components/report/hospitalSet'], resolve)
            },
            {
                path: "/report/hospitalPublish",
                component: resolve => require(['@/components/report/hospitalPublish'], resolve)
            },
            {
                path: "/report/sample",
                component: resolve => require(['@/components/report/sampleList'], resolve)
            },
            {
                path: "/report/sample/add",
                component: resolve => require(['@/components/report/sampleAdd'], resolve)
            },
            {
                path: "/report/sample/edit/:id",
                component: resolve => require(['@/components/report/sampleEdit'], resolve)
            },
            {
                path: "/report/sample/:id",
                component: resolve => require(['@/components/report/sampleDetail'], resolve)
            },
            {
                path: "/report/massage",
                component: resolve => require(['@/components/report/massage'], resolve)
            },
            {
                path: "/report/resource",
                component: resolve => require(['@/components/report/resource'], resolve)
            },
            {
                path: "/report/rscPublish",
                component: resolve => require(['@/components/report/rscPublish'], resolve)
            },
            {
                path: "/report/arrivalRate",
                component: resolve => require(['@/components/report/arrivalRate'], resolve)
            },
            {
                path: "/report/reportMistakeMessage",
                component: resolve => require(['@/components/report/reportMistakeMessage'], resolve)
            },
            {
                path: "/report/hospitalFileSign",
                component: resolve => require(['@/components/report/hospitalFileSign'], resolve)
            }
            
        ]
    },
    urls: {
        'report.list': {
            'type': 'POST',
            'real': '/upload/manage',
            'mock': '/mock/report/list'
        },
        'report.mistake':{
            'type': 'POST',
            'real': '/upload/mistake/query',
            'mock': '/mock/report/list'
        },
        'report.discard': {
            'type': 'POST',
            'real': '/upload/cancel',
            'mock': '../../static/mock/common/success.json'
        },
        'report.reasonList': {
            'type': 'POST',
            'real': '/upload/cancel/reasons',
            'mock': '../../static/mock/report/reasonList.json'
        },
        'replace.list': {
            'type': 'POST',
            'real': '/upload/report/query',
            'mock': '/mock/replace/list'
        },
        'replace.uploadFile': {
            'type': 'POST',
            'real': '/file/upload/instead',
            'mock': '../../static/mock/common/success.json'
        },
        'replace.uploadSpeed': {
            'type': 'POST',
            'real': '/upload/status/list',
            'mock': '/mock/replace/uploadSpeed',
        },
        'urge.list': {
            'type': 'POST',
            'real': '/busmessage/urge/query',
            'mock': '/mock/urge/list'
        },
        'urge.urge': {
            'type': 'POST',
            'real': '/message/urge/add',
            'mock': '../../static/mock/common/success.json'
        },
        'urge.urgeMore': {
            'type': 'POST',
            'real': '',
            'mock': '../../static/mock/common/success.json'
        },
        'urge.history': {
            'type': 'POST',
            'real': '/message/urge/history',
            'mock': '/mock/urge/history'
        },
        'hospital.old.list': {
            'type': 'POST',
            'real': '/hospital/query',
            'mock': '/mock/hospital/list'
        },
        'hospital.list': {
            'type': 'POST',
            'real': '/bushospital/query',
            'mock': '/mock/hospital/list'
        },
        'hospital.new': {
            'type': 'POST',
            'real': '/bushospital/check/register',
            'mock': '/mock/hospital/new'
        },
        'hospital.checkEdit': {
            'type': 'POST',
            'real': '/hospital/check/edit',
            'mock': '/mock/hospital/reviewInfo'
        },
        'hospital.resetPWD': {
            'type': 'POST',
            'real': '/hospital/reset',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.review': {
            'type': 'POST',
            'real': '/hospital/register/check',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.reviewNot': {
            'type': 'POST',
            'real': '/hospital/register/reject',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.reviewDel': {
            'type': 'POST',
            'real': '/hospital/register/delete',
            'mock': '../../static/mock/common/success.json'
        },
        'role.queryRole': {
            'type': 'POST',
            'real': '/role/queryRole',
            'apiPrefix': config.authApiPrefix,
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.check': {
            'type': 'POST',
            'real': '/hospital/info/check',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.infoAll': {
            'type': 'POST',
            'real': '/hospital/info/all',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.editCheck': {
            'type': 'POST',
            'real': '/hospital/edit/check',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.signQuery': {
            'type': 'POST',
            'real': '/hospital/sign/query',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.signAdd': {
            'type': 'POST',
            'real': '/hospital/sign/add',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.editCheckNot': {
            'type': 'POST',
            'real': '/hospital/edit/reject',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.deleteCheck': {
            'type': 'POST',
            'real': '/hospital/edit/delete',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.add': {
            'type': 'POST',
            'real': '/hospital/register',
            'mock': '../../static/mock/common/success.json'
        },
        'sample.list': {
            'type': 'POST',
            'real': '/hospital/group/query',
            'mock': '/mock/sample/list'
        },
        'sample.hospitalTree': {
            'type': 'POST',
            'real': '/hospital/query',
            'mock': '../../static/mock/report/hospitalList.json'
        },
        'sample.hospital.all': {
            'type': 'POST',
            'real': '/hospital/query/all',
            'mock': '../../static/mock/report/hospitalList.json'
        },
        'sample.add': {
            'type': 'POST',
            'real': '/hospital/group/add',
            'mock': '/mock/sample/add'
        },
        'sample.edit': {
            'type': 'POST',
            'real': '/hospital/group/edit',
            'mock': '/mock/sample/add'
        },
        'sample.detail': {
            'type': 'POST',
            'real': '/hospital/group/get',
            'mock': '/mock/sample/add'
        },
        'sample.del': {
            'type': 'POST',
            'real': '/hospital/group/delete',
            'mock': '../../static/mock/common/success.json'
        },
        'sample.details': {
            'type': 'POST',
            'real': '',
            'mock': '../../static/mock/report/sampleDetails.json'
        },
        'message.list': {
            'type': 'POST',
            'real': '/message/message/manage',
            'mock': '/mock/message/list'
        },
        'message.add': {
            'type': 'POST',
            'real': '/message/message/add',
            'mock': '../../static/mock/common/success.json'
        },
        'message.del': {
            'type': 'POST',
            'real': '/message/message/delete',
            'mock': '../../static/mock/common/success.json'
        },
        'message.detail': {
            'type': 'POST',
            'real': '',
            'mock': '/mock/message/detail'
        },
        'resource.list': {
            'type': 'POST',
            'real': '/file/resource/query',
            'mock': '/mock/resource/list'
        },
        'resource.del': {
            'type': 'POST',
            'real': '/file/resource/delete',
            'mock': '../../static/mock/common/success.json'
        },
        'resource.detail': {
            'type': 'POST',
            'real': '/file/resource/get',
            'mock': '/mock/resource/detail'
        },
        'resource.add': {
            'type': 'POST',
            'real': '/file/resource/add',
            'mock': '../../static/mock/common/success.json'
        },
        'resource.edit': {
            'type': 'POST',
            'real': '/file/resource/edit',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.basicSave': {
            'type': 'POST',
            'real': '/hospital/basic/edit',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.chargeSave': {
            'type': 'POST',
            'real': '/hospital/charge/edit',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.uploadSave': {
            'type': 'POST',
            'real': '/hospital/uploadcharge/edit',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.systemSave': {
            'type': 'POST',
            'real': '/hospital/system/edit',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.codeSave': {
            'type': 'POST',
            'real': '/hospital/code/edit',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.setting.edit': {
            'type': 'POST',
            'real': '/hospital/setting/edit',
            'mock': '../../static/mock/common/success.json'
        },
        'hospital.sectionSave': {
            'type': 'POST',
            'real': '/hospital/section/edit',
            'mock': '/mock/hospital/sectionSave'
        },
        'hospital.basicInfo': {
            'type': 'POST',
            'real': '/hospital/info/basic',
            'mock': '/mock/hospital/basicInfo'
        },
        'hospital.chargeInfo': {
            'type': 'POST',
            'real': '/hospital/info/charge',
            'mock': '/mock/hospital/chargeInfo'
        },
        'hospital.uploadInfo': {
            'type': 'POST',
            'real': '/hospital/info/uploadCharge',
            'mock': '/mock/hospital/uploadInfo'
        },
        'hospital.systemInfo': {
            'type': 'POST',
            'real': '/hospital/info/system',
            'mock': '/mock/hospital/systemInfo'
        },
        'hospital.codeInfo': {
            'type': 'POST',
            'real': '/hospital/info/code',
            'mock': '/mock/hospital/codeInfo'
        },
        'hospital.sectionInfo': {
            'type': 'POST',
            'real': '/hospital/info/section',
            'mock': '/mock/hospital/sectionInfo'
        },
        'grade.list': {
            'type': 'POST',
            'real': '/base/hospGrade/query',
            'mock': '/mock/hospital/sectionInfo'
        },
        'attached.list': {
            'type': 'POST',
            'real': '/base/hospAttached/query',
            'mock': '/mock/hospital/sectionInfo'
        },
        'type.list': {
            'type': 'POST',
            'real': '/base/hospType/query',
            'mock': '/mock/hospital/sectionInfo'
        },
        'hospital.contactorList': {
            'type': 'POST',
            'real': '/upload/user/list',
            'mock': '/mock/hospital/contactorList'
        },
        'hospital.contactorEdit': {
            'type': 'POST',
            'real': '/upload/user/update',
            'mock': '/mock/hospital/contactorList'
        },
        'hospital.contactorDel': {
            'type': 'POST',
            'real': '/upload/user/delete',
            'mock': '/mock/hospital/contactorList'
        },
        'home.mergeFile': {
            'type': 'POST',
            'real': '/uploader/mergeFile',
            'apiPrefix':config.uploadApiPrefix,
            'mock': '../../static/mock/common/success.json'
        },
        'home.delFile': {
            'type': 'POST',
            'real': '/uploader/delFile',
            'apiPrefix':config.uploadApiPrefix,
            'mock': '../../static/mock/common/success.json'
        }
    }
}

//引入mockjs
// const Mock = require('mockjs')
//     //使用mockjs模拟数据
// var Random = Mock.Random;
// Mock.mock('/mock/report/list', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "currentPageIndex": 1,
//         "totalPageCount": 7,
//         "totalItemCount": 68,
//         "pageSize": 10,
//         "dataList|10": [{
//             'reportId|+1': 1,
//             'hospitalNum|+2': 1565,
//             'hospName': function() { return Random.ctitle(6) },
//             'provinceName': function() { return Random.province() },
//             'cityName': function() { return Random.city() },
//             'dataType|1': [10, 20, 30, 40],
//             'uploadType|1': [1, 2, 3],
//             'uploadDate': function() { return Mock.mock('@date') },
//             'reportor': function() { return Random.cname() },
//             'fileSize|1-400': 30
//         }]
//     }
// })
// Mock.mock('/mock/replace/list', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "currentPageIndex": 1,
//         "totalPageCount": 5,
//         "totalItemCount": 45,
//         "pageSize": 10,
//         "dataList|10": [{
//             'reportId|+1': 1,
//             'hospitalNum|+2': 1565,
//             'fileName|6-10': function() { return Random.ctitle() },
//             'hospitalName|6-10': function() { return Random.ctitle() },
//             'provinceName': function() { return Random.province() },
//             'cityName': function() { return Random.city() },
//             'dataType|1': ['购药数据', '门急诊数据', '病案数据', '医嘱数据'],
//             'reportType|1': ['医院上报', '邮件上报', '代上报'],
//             'fileDate': function() { return Mock.mock('@date') },
//             'reportDate': function() { return Mock.mock('@date') },
//             'reportStatus|1': ['上报成功', '上传失败', '解压失败', '校验失败', '杀毒失败'],
//             'reportRemark|1-10': function() { return Random.ctitle() }
//         }]
//     }
// })
// Mock.mock('/mock/urge/list', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "currentPageIndex": 1,
//         "totalPageCount": 8,
//         "totalItemCount": 75,
//         "pageSize": 10,
//         "dataList|10": [{
//             'urgeId|+1': 1,
//             'hospitalName|6-10': function() { return Random.ctitle() },
//             'provinceName': function() { return Random.province() },
//             'cityName': function() { return Random.city() },
//             'dataType|1': ['购药数据', '门急诊数据', '病案数据', '医嘱数据'],
//             'outDate': function() { return Mock.mock('@date') },
//             'reportor': function() { return Random.cname() },
//             'urgeNum|0-5': 0
//         }]
//     }
// })
// Mock.mock('/mock/urge/history', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "currentPageIndex": 1,
//         "totalPageCount": 8,
//         "totalItemCount": 75,
//         "pageSize": 10,
//         "dataList|10": [{
//             'urgeId|+1': 1,
//             'hospitalName|6-10': function() { return Random.ctitle() },
//             'provinceName': function() { return Random.province() },
//             'cityName': function() { return Random.city() },
//             'dataType|1': ['购药数据', '门急诊数据', '病案数据', '医嘱数据'],
//             'reportor': function() { return Random.cname() },
//             'urgeDate': function() { return Mock.mock('@date') },
//         }]
//     }
// })
// Mock.mock('/mock/hospital/list', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "currentPageIndex": 1,
//         "totalPageCount": 8,
//         "totalItemCount": 75,
//         "pageSize": 10,
//         "dataList|10": [{
//             'hospitalId|+1': 1,
//             'hospitalName|6-10': function() { return Random.ctitle() },
//             'provinceName': function() { return Random.province() },
//             'cityName': function() { return Random.city() },
//             'leader': function() { return Random.cname() },
//             'contactPhone': /^1[3578][0-9]{9}$/,
//             'email': function() { return Mock.mock('@email') },
//             'userName|6-10': function() { return Random.name() },
//             'regiestDate': function() { return Mock.mock('@date') },
//             'reportGrade|0-30': 15,
//             'reportStatus|1': ['在报', '停报'],
//         }]
//     }
// })
// Mock.mock('/mock/hospital/new', {
//     'code': 0,
//     'message': "成功",
//     'data|5': [{
//         'hospitalId|+1': 1,
//         'hospitalName|6-10': function() { return Random.ctitle() },
//         'provinceName': function() { return Random.province() },
//         'cityName': function() { return Random.city() },
//         'leader': function() { return Random.cname() },
//         'contactPhone': /\d{5,10}/,
//         'email': function() { return Mock.mock('@email') },
//         'regiestDate': function() { return Mock.mock('@date') },
//     }]
// })
// Mock.mock('/mock/hospital/reviewInfo', {
//     'code': 0,
//     'message': "成功",
//     'data|3': [{
//         'hospitalId|+1': 1,
//         'hospitalName|6-10': function() { return Random.ctitle() },
//         'provinceName': function() { return Random.province() },
//         'cityName': function() { return Random.city() },
//         'editer': function() { return Random.cname() },
//         'contactPhone': /\d{5,10}/,
//         'email': function() { return Mock.mock('@email') },
//         'editDate': function() { return Mock.mock('@date') },
//         'editInfo': function() { return Mock.mock('@cparagraph(8, 15)') }
//     }]
// })
// Mock.mock('/mock/sample/list', {
//     'code': 0,
//     'message': "成功",
//     'data|8': [{
//         'Id|+1': 1,
//         'name|6-10': function() { return Random.ctitle() },
//     }]
// })

// Mock.mock('/mock/sample/add', {
//     'code': 0,
//     'message': "成功",
//     'data|1': [{
//         'id|100-200': 150
//     }]
// })
// Mock.mock('/mock/message/list', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "currentPageIndex": 1,
//         "totalPageCount": 8,
//         "totalItemCount": 85,
//         "pageSize": 10,
//         "dataList|10": [{
//             'Id|+1': 1,
//             'title|6-10': function() { return Random.ctitle() },
//             'content|10-20': function() { return Mock.mock('@cparagraph(1, 3)') },
//             'date': function() { return Random.now('yyyy-MM-dd HH:mm:ss') },
//             'hospitals|1': ['所有医院', '市中心医院', '妇幼医院', '样本医院：A组、B组、C组'],
//             'readNum|100-9999': 541
//         }]
//     }
// })
// Mock.mock('/mock/message/detail', {
//     'code': 0,
//     'message': "成功",
//     'data|1': [{
//         'title|6-10': function() { return Random.ctitle() },
//         'content|10-20': function() { return Mock.mock('@cparagraph(1, 3)') },
//         'date': function() { return Random.now('yyyy-MM-dd HH:mm:ss') },
//         'hospitals|1': ['所有医院', '市中心医院', '妇幼医院', '样本医院：A组、B组、C组'],
//         'readNum|100-9999': 541,
//         'receiveMode|1': ['短信', '邮件', '短信、邮件']
//     }]
// })
// Mock.mock('/mock/resource/list', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "currentPageIndex": 1,
//         "totalPageCount": 8,
//         "totalItemCount": 45,
//         "pageSize": 10,
//         "dataList|10": [{
//             'Id|+1': 1,
//             'title|6-10': function() { return Random.ctitle() },
//             'content|10-20': function() { return Mock.mock('@cparagraph(1, 3)') },
//             'date': function() { return Random.now('yyyy-MM-dd HH:mm:ss') },
//             'readNum|100-9999': 541,
//             'downNum|100-999': 456
//         }]
//     }
// })
// Mock.mock('/mock/resource/detail', {
//     'code': 0,
//     'message': "成功",
//     'data|1': [{
//         'title|6-10': function() { return Random.ctitle() },
//         'content': function() { return Mock.mock('@cparagraph(10, 40)') },
//         'date': function() { return Random.now('yyyy-MM-dd HH:mm:ss') },
//         'fileName|6-10': function() { return Random.ctitle() },
//         'readNum|100-9999': 541,
//         'downNum|100-999': 456
//     }]
// })

// Mock.mock('/mock/hospital/basicInfo', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         address: "山东省青岛市市北区",
//         'bedTurnoverRate|150-330': 220,
//         'dailyEmergency|150-330': 310,
//         'dailyOutpartient|150-330': 210,
//         hospAttached: "市级",
//         hospBed: "444444",
//         hospBedOpen: "55555",
//         hospEmail: "123@123.com",
//         hospFax: "052-2222222222",
//         hospGrade: "三甲",
//         hospName: "青岛妇女儿童医院",
//         hospTelephone: "0532-1111111",
//         hospType: "专科医院",
//         hospWebsite: "http://www.123.com",
//         pharmacistLevel1Count: "65656",
//         pharmacistLevel2Count: "54545",
//         pharmacistLevel3Count: "3434",
//         pharmacistLevel4Count: "3434",
//         pharmacistLevel5Count: "434",
//         pharmacistTotalCount: "23232323",
//         physicianLevel1Count: "5456546",
//         physicianLevel2Count: "3434",
//         physicianLevel3Count: "3434",
//         physicianLevel4Count: "3434",
//         physicianLevel5Count: "5434",
//         physicianTotalCount: "232323232",
//         postcode: "255600",
//         specialistSection_type: "妇女儿童",
//         yearHospTrips: "3333"
//     }
// })
// Mock.mock('/mock/hospital/chargeInfo', {
//     'code': 0,
//     'message': "成功",
//     'data|8': [{
//         email: function() { return Mock.mock('@email') },
//         fax: "0532-2222222",
//         mobile: /^1[3578][0-9]{9}$/,
//         'name|2-4': function() { return Random.ctitle() },
//         officPhone: "0532-1111111",
//         sex: "男",
//         'specialty|6-10': function() { return Random.ctitle() },
//         'title|6-10': function() { return Random.ctitle() }
//     }]
// })
// Mock.mock('/mock/hospital/uploadInfo', {
//     'code': 0,
//     'message': "成功",
//     'data|6': [{
//         email: function() { return Mock.mock('@email') },
//         fax: "0532-2222222",
//         mobile: /^1[3578][0-9]{9}$/,
//         'name|2-4': function() { return Random.ctitle() },
//         officPhone: "0532-333333",
//         sex: "男",
//         'specialty|6-10': function() { return Random.ctitle() },
//         'title|6-10': function() { return Random.ctitle() },
//         'department|6-15': function() { return Random.ctitle() }

//     }]
// })
// Mock.mock('/mock/hospital/systemInfo', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         hisSystem: ['北京众邦', '华东诚信'],
//         hisSystemDatabase: ['ORACLE', 'MYSQL'],
//         hospComputerSystem: ['Win9X/ME', 'WinNT', 'Mac'],
//         internetCondition: ['DDN专线', '拨号'],
//         internetPort: ['8080'],
//         isMedicalRecord: "1",
//         isOutPatient: "0",
//         isOutpatientHis: "1",
//         isWardHis: "0"
//     }
// })

// Mock.mock('/mock/hospital/codeInfo', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         diseaseCode: ['ICD10', '其他'],
//         drugCode: ['WHOATC', '本院编码', '其他'],
//         operationCode: ['ICD9-CM', '其他'],
//         pathologyCode: ['ICD9', '其他'],
//         diseaseCodeOther: "22",
//         drugCodeOther: "11",
//         operationCodeOther: "33",
//         pathologyCodeOther: "444"
//     }
// })
// Mock.mock('/mock/hospital/sectionInfo', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         'choose_sections|35': [{
//             'isSame|1': ['0', '1'],
//             'otherName|2-6': function() { return Random.ctitle() },
//             'childList|28': [{
//                 'isSame|1': ['0', '1'],
//                 'otherName|2-6': function() { return Random.ctitle() },
//                 'thirdName|2-6': function() { return Random.ctitle() },
//             }]
//         }],
//         'custom_sections|15': [{
//             'selfName|2-6': function() { return Random.ctitle() },
//             'hospName|2-6': function() { return Random.ctitle() },
//             'level|1': ['1', '2', '3']
//         }],
//         fill_department: "部门",
//         fill_people_telephone: "联系电话",
//         hosp_fill_date: "填表日期",
//         hosp_fill_people: "填表人",
//         hosp_leader: "负责人签字",
//         isSectionLevel: "1",
//         isSectionRequest: "0",
//         sectionLevel: "1",
//     }
// })

// Mock.mock('/mock/hospital/sectionSave', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         Id: 1
//     }
// })
// Mock.mock('/mock/replace/uploadSpeed', {
//     'code': 0,
//     'message': "成功",
//     'data': {
//         "speedPer|+10": 10,
//         "failStep": 2,
//         "reportResult": function() { return Mock.mock('@cparagraph(3, 5)') }
//     }
// })