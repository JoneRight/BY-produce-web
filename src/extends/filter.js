import Vue from 'vue';

/**
 * 自定义过滤器
 * 全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
*/

/**
 *  过滤器格式化日期
 */
Vue.filter('formatDate', function (value) {
    let date = new Date(value);
    return date.format('YYYY-MM-DD');
});
/**
 *  过滤器格式化时间
 */
Vue.filter('formatTime', function (value) {
    let date = new Date(value);
    return date.format('YYYY-MM-DD HH:mm:ss');
});
