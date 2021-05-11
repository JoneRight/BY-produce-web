import Vue from 'vue'
import App from './App'
import router from './router'
import './extends/index'
import store from './store/index'
import '@/config';
import ajax from '@/utils/ajax.js';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import basic from './assets/css/common.css'
import '@/assets/css/animate.css'
import '@/assets/css/fontface.css'

// import JsonExcel from 'vue-json-excel'
// Vue.component('downloadExcel', JsonExcel)


// Vue.use(download);


Vue.use(iView);
/**
 * ajax扩展
 */
Vue.ajax = ajax;
/**
 * 将store作为全局属性使用
 */
Vue.store = store;
require.context("./assets/data/", true, /\.json$/);
require('./utils/mock')
    /**
     * 系统入口
     */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    beforeCreate: function() {
        if (window.console && PRODUCT_ENV) {
            window.console.log("已禁用console调试！");
            window.console.log = function() {};
            window.console.warn = function() {};
            window.console.error = function() {};
            window.console.info = function() {};
            window.console.debug = function() {};
            window.console.assert = function() {};
            window.console.trace = function() {};
        }
    }
})