import { STORAGE_KEY } from "./mutations"
const localStoragePlugin = store => {
    //当 store 初始化后调用
    store.commit("activeSystem");
    store.subscribe((mutation, state) => {
        //每次调用mutation之后执行（action时，不执行下方）
        //console.warn("存入数据", mutation.type);
        //mutation的格式为{ type,payload },可根据mutation.type判断是否继续执行
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    })
}

export default [localStoragePlugin]