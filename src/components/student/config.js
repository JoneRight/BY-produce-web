export default {
    router: {
        path: "/student",
        component: resolve => require(['@/components/Layout'], resolve),
        children: [{
                path: "",
                component: resolve => require(['@/components/student/index'], resolve)
            },
            {
                path: "/student/add",
                component: resolve => require(['@/components/student/add'], resolve)
            },
            {
                path: "/student/edit",
                component: resolve => require(['@/components/student/edit'], resolve)
            },
            {
                path: "/student/import",
                component: resolve => require(['@/components/student/import'], resolve)
            },
            /*{
                path: "/student/test",
                component: resolve => require(['@/components/student/test'], resolve)
            },
            {
                path: "/student/upload",
                component: resolve => require(['@/components/student/upload'], resolve)
            }*/
        ]
    },
    urls: {
        'student.list': {
            'type': 'POST',
            'auth': 'STUDENTLIST',
            'real': '/student/list',
            'mock': '../../static/mock/student/student_list.json'
        },
        'student.clazzlist': {
            'type': 'POST',
            'real': '/student/clazzList',
            'mock': '../../static/mock/student/student_clazzlist.json'
        },
        'student.delete': {
            'type': 'POST',
            'auth': 'STUDENTDELETE',
            'real': '/student/studentDelete',
            'mock': '../../static/mock/common/success.json'
        },
        'student.graduate': {
            'type': 'POST',
            'auth': 'STUDENTDELETE',
            'real': '/student/studentGraduate',
            'mock': '../../static/mock/common/success.json'
        },
        'student.resetpass': {
            'type': 'POST',
            'auth': 'STUDENTPASSWORD',
            'real': '/student/resetPass',
            'mock': '../../static/mock/student/student_resetpass.json'
        },
        'student.add': {
            'type': 'POST',
            'auth': 'STUDENTADD',
            'real': '/student/studentAdd',
            'mock': '../../static/mock/common/success.json'
        },
        'student.isexistloginname': {
            'type': 'POST',
            'real': '/student/isExistLoginName',
            'mock': '../../static/mock/common/success.json'
        },
        'student.isExistStudentNo': {
            'type': 'POST',
            'real': '/student/isExistStudentNo',
            'mock': '../../static/mock/common/success.json'
        },
        'student.isExistEmail': {
            'type': 'POST',
            'real': '/student/isExistEmail',
            'mock': '../../static/mock/common/success.json'
        },
        'student.info': {
            'type': 'POST',
            'real': '/student/getStudentInfo',
            'mock': '../../static/mock/common/success.json'
        },
        'student.update': {
            'type': 'POST',
            'auth': 'STUDENTEDIT',
            'real': '/student/studentUpdate',
            'mock': '../../static/mock/common/success.json'
        },
        'student.import': {
            'type': 'POST',
            'real': '/student/importStudents'
        },
    }
}