<template>
  <div>
    <o-table v-bind="stateTableProps" ref="table"/>
    <div style="" class="page-footer">
        <div class="mt15 text-center" v-if="stateTableProps.data.length>0">
            <Page v-bind="statePageProps" v-on="statePageOn"/>
            <Button type="text" class="fr" @click="showModal=true">
                <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                <span style="font-size:13px;">设置显示列</span>
            </Button>
        </div>
    </div>
    <Modal v-model="selectedColumnModal"
      title="设置显示列"
      width=600
      :styles="{top: '250px'}"
      @on-ok="columnYes"
      @on-cancel="cancelNo">
        <div style="padding-bottom:6px;margin-bottom:6px;">
            <b>勾选显示的列选项：</b>
            <Checkbox
              :value="selectColumnList.length==stateTableProps.columns.length" 
              @on-change="selectAllColumn">全选</Checkbox>
        </div>
        <div style="height:255px;overflow-y:auto;">
            <CheckboxGroup v-model="selectColumnList" 
              style="width:175px;display:inline-block">
                <Checkbox
                  v-for="item in stateTableProps.columns"
                  :key="item.key"
                  :label="item.title">{{item.title}}</Checkbox>
            </CheckboxGroup>
        </div>
    </Modal>
  </div>
</template>
<script>
import OTable from './OTable.vue'
import { isFunction, isEmpty, isArray, isObject, get } from 'lodash'
// 判断参数是Promise对象
// https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise
export function isNativePromise (p) {
  return p && typeof p.constructor === 'function' &&
    Function.prototype.toString.call(p.constructor).replace(/\(.*\)/, '()') === Function.prototype.toString.call(Function)
      .replace('Function', 'Promise')
      .replace(/\(.*\)/, '()')
}
// 将参数包装为 Promise 对象
export function parsePromise (obj) {
  if (obj && isNativePromise(obj)) {
    return obj
  }
  return Promise.resolve(obj)
}

export default {
  components: { OTable },
  model: {
    prop: 'listData',
    event: 'change'
  },
  props: {
    listData: [ Object, Function, Promise, Array ],
    tableProps: Object,
    tableOn: Object,
    pageProps: Object,
    pageOn: Object
  },
  watch: {
    listData: {
      handler: function (o) {
        this.stateTableProps.data = this.initData(o)
      },
      deep: true
    }
  },
  data() {
    let listData = this.initData(this.listData)
    let stateTableProps = Object.assign({ data: isArray(listData)? listData: get(listData, 'data', []) , columns: []}, this.tableProps || {})
    let stateTableOn = Object.assign({}, this.tableOn || {})
    let statePageProps = Object.assign({'page-size': 20, 'page-size-opts': [20,50,100,200,1000], 'show-total': true, 'show-elevator': true, 'show-sizer': true }, this.pageProps || {})
    let statePageOn = Object.assign({}, this.pageOn || {})
    return {
      selectedColumnModal: false,
      columns: [],
      selectColumnList: [],
      stateTableProps,
      stateTableOn,
      statePageProps,
      statePageOn
    }
  },
  methods: {
    initData: function(obj) {
      let data = []
      let isFn = isFunction(obj)
      let isDefe = isNativePromise(obj)
      if (isFn || isDefe) {
        let defe = isFn? parsePromise(obj.call(this)): obj
        defe.then((res) => {
          let { total, totalList, currentPage } = get(res, 'data')
          this.statePageProps = { ...this.statePageProps, current: currentPage, total}
          this.stateTableProps.data = totalList
        })
      } else {
        data = obj
      }
      return data
    },
    selectAllColumn: function() {
      let { selectColumnList, stateTableProps } = this
      this.selectColumnList = selectColumnList.length === stateTableProps.columns.length? []: stateTableProps.columns.map(o => o.key)
    },
    columnYes: function() {

    },
    cancelNo: function() {

    }
  },
}
</script>
<style scoped>
table {
    width: 100%;
    overflow-y: auto;
}
table td {
    max-width: 300px;
}
.page-footer .fl {
    position: absolute;
    left: 220px;
    top: 8px;
}
.page-footer button.fl {
    position: absolute;
    left: 280px;
    top: 3px;
}
.page-footer button.fr {
    position: absolute;
    right: 40px;
    top: 3px;
}
.page-footer .text-center {
    position: relative;
    display: block;
    width: 100%;
}
</style>
