import Vue from 'vue'
export const STORAGE_KEY = 'VUEJS'
export default {
    updateClusterData(state, newData) {
        Object.keys(newData).forEach((k) => {
            Vue.set(state.clusterData, k, newData[k]);
        });
    },
    updateCommonData(state, newData) {
        Object.keys(newData).forEach((k) => {
            Vue.set(state.commonData, k, newData[k]);
        });
    },
    activeSystem(state) {
        if (localStorage.getItem(STORAGE_KEY)) {
            var newItem = JSON.parse(localStorage.getItem(STORAGE_KEY));
            Object.keys(newItem).forEach(key => {
                Vue.set(state, key, newItem[key])
            });
        }
    },
    addHistory(state, newData) {
        var list = state.historyList || [];
        list.push(newData);
    },
    updateHistory(state, newData) {
        state.historyList = newData || [];
    }
};