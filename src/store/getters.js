import { STORAGE_KEY } from "./mutations"
export default {
    getterNumber(state) {
        return state.customcount
    },
    getLanguage(state) {
        if (state.lang == "" && localStorage.getItem(STORAGE_KEY)) {
            return JSON.parse(localStorage.getItem(STORAGE_KEY))["lang"];
        } else {
            return state.lang == "" ? "zh" : state.lang;
        }
    },
    getHistory(state) {
        return state.historyList;
    }

};