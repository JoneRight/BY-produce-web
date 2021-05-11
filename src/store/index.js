import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import state from './state';
import plugins from './plugins'

Vue.use(Vuex)
const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins
});
// Vue.prototype.$store = store

export default store;