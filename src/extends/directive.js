import Vue from 'vue';

/**
 * 自定义指令
 */

// 权限指令 v-authorize="'STUDENTADD','STUDENTEDIT'"
Vue.directive('authorize', {
    inserted: function(el, binding, vnode) {
        if (!Vue.authorize(binding.value) && el.parentElement!=null) {
            el.parentElement.removeChild(el);
        }
    }
});