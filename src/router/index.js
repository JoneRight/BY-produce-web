import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import login from '@/components/login/config'
import business from '@/components/business/config'
import student from '@/components/student/config'
import standard from '@/components/standard/config'
import report from '@/components/report/config'
import rules from '@/components/rules/config'
import authority from '@/components/authority/config'
import systemConfig from '@/components/systemConfig/config'
import dataReportManage from '@/components/dataReportManage/config'
import reportManager from '@/components/reportManager/config'
import reportForms from '@/components/reportForms/config'
import feedBack from '@/components/feedBack/config'
import homePage from '@/components/homePage/config'

Vue.use(Router)

/**
 * $route.params,$route.query,$route.hash
 */
var router = new Router({
    // mode: 'history',
    base: '/cnrud-prouce/',
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/404',
            component: resolve => require(['@/components/common/NotFound'], resolve),
        },
        login.router,
        {
            path: '/main',
            name: 'Main',
            redirect: '/login',
            component: resolve => require(['@/components/Main'], resolve),
            children: [
                business.router,
                student.router,
                standard.router,
                report.router,
                rules.router,
                authority.router,
                systemConfig.router,
                dataReportManage.router,
                reportManager.router,
                reportForms.router,
                feedBack.router,
                homePage.router,
                {
                    path: '/401',
                    component: resolve => require(['@/components/common/NotAuthorize'], resolve),
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        },
    ]
})
router.beforeEach((to, from, next) => {
    if(to.meta.keepAlive === undefined || Vue.store.getters.getHistory.some(m => m.path == (to.meta.baseUrl || to.path))){
        to.meta.keepAlive = true;
    }else{
        to.meta.keepAlive = false;
    }
    if (!to.matched.some(record => record.meta.auth == false) && Vue.getUser() == null) {
        next("/login");
    } else {
        next();
    }
});
export default router