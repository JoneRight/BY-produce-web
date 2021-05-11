<template>
  <Modal
    :value="stateVisible"
    :width="820"
    :closable="false"
    :mask-closable="false"
    :mask="true"
  >
    <Row>
      <Col span="20">
        <Table
          :highlight-row="true"
          :columns="columns"
          :data="stateData"
          @on-current-change="handleRowChange"
        />
        </Col>
      <Col span="4">
        <Row>
          <Button
            type="primary"
            icon="md-add"
            class="ml5"
            @click="handleAddRow">
              新增
          </Button>
        </Row>
        <Row class="mt150">
          <Button
            type="primary"
            icon="ios-arrow-up"
            class="ml5"
            :disabled="selectedRowIdx<1"
            @click="handleUp">
            上移
          </Button>
        </Row>
        <Row>
          <Button
            type="primary"
            icon="ios-arrow-down"
            class="ml5 mt5"
            :disabled="selectedRowIdx === -1 || selectedRowIdx === stateData.length-1"
            @click="handleDown">
            下移
          </Button>
        </Row>
        <Row>
          <Button
            type="error"
            icon="md-trash"
            class="ml5 mt5"
            :disabled="selectedRowIdx === -1"
            @click="handleRemove">删除</Button>
        </Row>
      </Col>
      <code v-if="debug">{{code}}</code>
    </Row>
    <div slot="footer">
      <Button type="text" size="large" @click="stateVisible=false">取消</Button>
      <Button type="primary" size="large" @click="handleModalOk">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { guid, getParameterByName } from '@/utils/strUtil.js'
import { get } from 'lodash'
export default {
  props: {
    title: { type: String, default: '自定义筛选条件' },
    visible: { type: Boolean, default: false },
    data: { type: Array, default: () => ([]) },
    config: { type: Object, default: () => ({}) },
    index: { type: Object, default: () => ({}) }
  },
  watch: {
    visible(bol) {
      this.stateVisible = bol
    },
    config (cfg) {
      this.stateConfig = cfg
    },
    stateVisible(bol) {
      this.$emit('update:visible', bol)
    },
    data: {
      handler: function(val) { this.stateData = val },
      deep: true
    },
  },
  computed: {
    // 拼装 filterMethod 代码
    code: function() {
      let arg = []
      let key = this.stateConfig.key
      this.stateData.forEach(function(item, idx) {
        item.bracket_left && arg.push(item.bracket_left)
        idx !=0 && arg.push({'and': '&&', 'or': '||'}[item.condition])
        // \ => \\   " => \" 规避转义字符注入和字符串截断
        let val = (item.value||'').replace(/\\/g, String.fromCharCode(92,92)).replace(/\"/g, String.fromCharCode(92,34))
        if (item.operator == 'not like') {
          arg.push(`new String(row['${key}']).indexOf("${val}") == -1`)
        } else if (item.operator == 'like') {
          arg.push(`new String(row['${key}']).indexOf("${val}") != -1`)
        } else {
          arg.push(`row['${key}'] ${item.operator} "${val||''}"`)
        }
        item.bracket_right && arg.push(item.bracket_right)
      })
      return arg.join(" ")
    },
    debug: function() {
      return ['1','true'].indexOf(getParameterByName('debug')||'') != -1
    }
  },
  data() {
    let that = this
    let operatorKey = {
      '==': '等于',
      '>': '大于',
      '<': '小于',
      '>=': '大于等于',
      '<=':'小于等于',
      'like': '包含',
      'not like': '不包含',
      '!=': '不等于'
    }
    return {
      stateVisible: this.visible,
      selectedRowIdx: -1,
      stateData: this.data,
      stateIndex: this.index,
      stateConfig: this.config,
      columns: [
        {
          title: ' ',
          width: 20,
          render: (h, params) => params.index != that.selectedRowIdx? h('span') : h('Icon', {
            props: { type: 'md-checkmark', color: '#2b85e4' },
            class: { ml5: true }
          })
        }, {
          title: '条件',
          key: 'condition',
          width: 100,
          render: (h, params) => params.index == 0 ? h('span') : h('Select', {
              props: { size: 'small', transfer: true, value: params.row.condition },
              on: { 'on-change': function(val) { that.setRowVal(val, 'condition', params.index) }}
            }, ['and', 'or'].map(val => h('Option', {
              props: { value: val, key: `opt_operator_${params.index}_${val}`}
            }, val)))
        },
        {
          title: '括号',
          key: 'bracket_left',
          width: 80,
          render: (h, params) => {
            return h('Select', {
              props: { size: 'small', transfer: true, clearable: true, value: params.row.bracket_left, placeholder: '' },
              on: {
                'on-change': function(val) {
                  that.setRowVal(val, 'bracket_left', params.index)
                }
              }
            }, [ h('Option', { props: { value: '(' }}, '(') ])
          }
        },
        { title: '字段', key: 'field', render: (h, params) => h('span', get(that, 'stateConfig.title', get(params, 'row.field'))) },
        { title: '运算符', key: 'operator', width: 120,
          render: (h, params) => h('Select', {
              props: { size: 'small', transfer: true, value: params.row.operator, placeholder: '' },
              on: { 'on-change': function(val) { that.setRowVal(val, 'operator', params.index) }}
            },
            Object.keys(operatorKey).map(val => h('Option', {
                props: { value: val,  label: operatorKey[val],key: `opt_operator_${params.index}_${val}`},
              }, [
                h('span', operatorKey[val]),
                h('span', { style: { float: 'right', color: '#ccc'} }, val)
              ])
          ))
        }, {
          title: '值',
          key: 'value',
          render: (h, params) => h('Input', {
            props: { size: 'small', clearable: true, value: params.row.value },
            on: { 'on-blur': function(e) { that.setRowVal(e.target.value, 'value', params.index) }}
          })
        }, {
          title: '括号',
          key: 'bracket_right',
          width: 80,
          render: (h, params) => h('Select', {
            props: { size: 'small', transfer: true, clearable: true, value: params.row.bracket_right, placeholder: '' },
            on: { 'on-change': function(val) { that.setRowVal(val, 'bracket_right', params.index) }}
          }, [ h('Option', { props: { value: ')' }}, ')') ])
        }
      ]
    }
  },
  methods: {
    show(indexCfg, rowInfo) {
      this.stateIndex = indexCfg
      this.stateConfig = rowInfo
      if (rowInfo._customFilter) {
        this.stateData = rowInfo._customFilter.data || []
      } else {
        this.stateData = []
      }
      this.stateVisible = true
    },
    handleAddRow: function() {
      let len = this.stateData ? this.stateData.length : 0
      let newItem = this.columns.reduce((previous, current) => ({[current.key] : ''}), {})
      this.stateData.push(Object.assign(newItem, {
        id: guid(), operator: '==', field: this.stateConfig.key, condition: 'and',
        ...(len > 0 && { condition: 'and' })}))
    },
    handleRowChange: function(currentRow) {
      this.selectedRowIdx = this.stateData.findIndex(o => o.id === currentRow.id )
    },
    handleUp () {
      let idx = this.selectedRowIdx
      let next = idx - 1
      let item = this.stateData.splice(idx, 1)[0]
      this.stateData.splice(next, 0, item)
      this.selectedRowIdx = next
    },
    handleDown () {
      let idx = this.selectedRowIdx
      let next = idx + 1
      let item = this.stateData.splice(idx, 1)
      this.stateData.splice(next, 0, item[0])
      this.selectedRowIdx = next
    },
    handleRemove () {
      let idx = this.selectedRowIdx
      this.stateData.splice(idx, 1)
      let len = this.stateData.length
      this.selectedRowIdx = len == 0 ? -1 : (len > idx + 1 ? idx : len - 1)
    },
    handleModalOk() {
      let that = this
      let code = this.code
      let filter = null
      try{
        filter = new Function('value', 'row', `return ${code? code : 'true'};`)
      }catch(e) {
        let content = '请检查公式'
        let [l, r] = [0, 0]
        that.stateData.forEach(function(item) {
          item.bracket_left && ++l
          item.bracket_right && ++r
        })
        if (l != r) {
          content = '缺少' + (l > r ? '右' : '左') + '括号'
        }
        that.$Message.error({ background: true, content })
        return
      }
      this.$emit('ok', {
        index: this.stateIndex,
        rules: {
          data: this.stateData,
          template: code,
          filter
        }
      })
      this.stateVisible = false
    },
    setRowVal(val, key, idx) {
      let item = this.stateData[idx]
      item[key] = val
      this.stateData.splice(idx, 1, item)
    },
  },
}
</script>
<style scoped>
.mt100 { margin-top:100px; }
.mt150 { margin-top:150px; }
</style>