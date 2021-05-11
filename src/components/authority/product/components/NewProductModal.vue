<template>
  <div>
    <Modal
      :value="stateVisible"
      :title="title"
      :width="width"
      :closable="false"
      :mask-closable="false"
      class="product-modal">
      <div slot="footer">
        <Button type="text" size="large" @click="stateVisible=false">取消</Button>
        <Button type="primary" size="large" @click="handleModalOk">确定</Button>
      </div>
      <Form :model="stateData" :label-width="80">
        <Row>
          <Col span="17">
            <Row>
              <Card :bordered="false" dis-hover>
                <p slot="title">基本信息</p>
                <Row>
                  <Col span="11">
                    <FormItem label="产品名称" prop="name" :rules="{required: true, message: '产品名称不能为空'}">
                      <Input type="text" v-model="stateData.name" placeholder="产品名称"/>
                    </FormItem>
                  </Col>
                  <Col span="11">
                    <FormItem label="医院标签" prop="tag" class="ml5" :rules="{required: true, message: '医院标签不能为空'}">
                      <Input type="text" v-model="stateData.tag" placeholder="医院标签"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="11">
                    <FormItem label="负责人" prop="user">
                      <Input type="text" v-model="stateData.user" placeholder="负责人"/>
                    </FormItem>
                  </Col>
                  <Col span="11">
                    <FormItem label="产品描述" prop="description">
                      <Input type="text" v-model="stateData.description" placeholder="产品描述"/>
                    </FormItem>
                  </Col>
                </Row>
              </Card>
            </Row>
            <Row>
              <Card :bordered="false" dis-hover>
                <p slot="title">条件信息</p>
                <FormItem label="条件" prop="where">
                  <Row>
                    <Col :span="20">
                      <Table
                        :highlight-row="true"
                        :columns="whereTableColumns"
                        :data="stateData.where"
                        @on-current-change="handleWhereRowChange"
                        height="250"
                        class="mt5"
                        stripe
                        border/>
                    </Col>
                    <Col :span="4">
                      <Row class="mt100">
                        <Button
                          type="primary"
                          icon="md-add"
                          class="ml5"
                          @click="handleWhereAddRow">
                          新增
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          type="primary"
                          icon="md-add"
                          class="ml5 mt5"
                          :disabled="selectedWhereRowIdx==-1"
                          @click="handleWhereAppendRow">
                          追加
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          type="error"
                          icon="md-add"
                          class="ml5 mt5"
                          :disabled="selectedWhereRowIdx==-1"
                          @click="handleWhereRemoveRow">
                          删除
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="条件sql" prop="where">
                  <Row>
                    <Col span="20">
                      <Input v-model="whereSql" class="mt5" type="textarea" :readonly="true" :rows="5"/>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="执行sql" prop="where">
                  <Row>
                    <Col span="20">
                      <Input v-model="sql" class="mt5" type="textarea" :readonly="true" :rows="5"/>
                    </Col>
                  </Row>
                </FormItem>
              </Card>
            </Row>
          </Col>
          <Col span="7">
            <Card :bordered="false" dis-hover>
              <p slot="title">列顺序</p>
              <Row>
                <Col span="20">
                  <Select v-model="selectedField">
                    <Option v-show="showSelectAllField" value="*">- 全部 -</Option>
                    <Option v-for="item in fieldsList" :value="item.field" :key="item.field">{{ item.label }}</Option>
                  </Select>
                </Col>
                <Col span="4">
                  <Button :disabled="!selectedField" @click="handleAddField" type="primary" icon="md-add" class="ml5">添加</Button>
                </Col>
              </Row>
              <Row>
                <Col span="20">
                  <Table
                    :columns="fieldTableColumns"
                    :data="stateData.fields"
                    :highlight-row="true"
                    :row-class-name="handleFieldRowClz"
                    @on-current-change="handleFieldRowChange"
                    height="540"
                    class="mt5"
                    stripe
                    border/>
                </Col>
                <Col span="4">
                  <Row class="mt150">
                    <Button
                      type="primary"
                      icon="ios-arrow-up"
                      class="ml5"
                      :disabled="selectedFieldRowIdx<1"
                      @click="handleUpField">
                      上移
                    </Button>
                  </Row>
                  <Row>
                    <Button
                      type="primary"
                      icon="ios-arrow-down"
                      class="ml5 mt5"
                      :disabled="selectedFieldRowIdx === -1 || selectedFieldRowIdx === stateData.fields.length-1"
                      @click="handleDownField">
                      下移
                    </Button>
                  </Row>
                  <Row>
                    <Button
                      type="error"
                      icon="md-trash"
                      class="ml5 mt5"
                      :disabled="selectedFieldRowIdx === -1"
                      @click="handleRemoveField">删除</Button>
                  </Row>
                </Col>
              </Row>
              <Input v-model="fieldsSql" type="textarea" :readonly="true" :rows="8" class="mt10"/>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { formatProcessItem, getWhereSql, getFieldsSql, getSql, updateProduct, talbeFields } from './productItemUtil.js'
import { guid } from '@/utils/strUtil.js'
import { get, isEmpty } from 'lodash'

export default {
  model: { prop: 'data', event: 'change' },
  props: {
    title: { type: String, default: '新增' },
    visible: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) }
  },
  watch: {
    visible(bol) {
      this.stateVisible = bol
    },
    stateVisible(bol) {
      this.$emit('update:visible', bol)
    },
    stateData: {
      handler: function(val) {
        let len = get(val,'fields',[]).length
        this.showSelectAllField = len == 0 || len != this.fields.length
      },
      deep: true
    },
    data: {
      handler: function(val) {
        this.stateData = formatProcessItem(val || {})
      },
      deep: true
    }
  },
  computed: {
    width: function() {
      let w = document.body.clientWidth
      return w < 520 ? 520 : (w - 100)
    },
    whereSql: function() {
      return getWhereSql(get(this, 'stateData.where', []))
    },
    fieldsSql: function() {
      return get(this, 'stateData.fields', []).map(o => o.label).join(",")
    },
    fullFieldsSql: function() {
      return getFieldsSql(get(this, 'stateData.fields', []))
    },
    sql: function() {
      return getSql(this.fullFieldsSql, this.whereSql)
    },
    fieldsList: function() {
      let fields = get(this, 'stateData.fields', [])
      if(!fields || fields.length == 0) {
        return this.fields
      } else {
        let names = fields.map(o => o.field)
        return this.fields.filter(o => names.indexOf(o.field) === -1)
      }
    },
  },
  data: function() {
    let that = this
    let operatorKey = ['=', '>', '<', '>=', '<=', 'like']
    return {
      stateVisible: this.visible,
      stateData: formatProcessItem(this.data || {}),
      selectedField: '',
      selectedFieldRowIdx: -1,
      selectedWhereRowIdx: -1,
      showSelectAllField: true,
      fields: talbeFields,
      whereTableColumns: [{
        title: ' ',
        width: 20,
        render: (h, params) => params.index != that.selectedWhereRowIdx? h('span') : h('Icon', {
          props: { type: 'md-checkmark', color: '#2b85e4' },
          class: { ml5: true }
        })
      } , {
          title: '条件',
          key: 'condition',
          width: 60,
          render: (h, params) => params.index == 0 ? h('span') : h('Select', {
              props: { size: 'small', transfer: true, value: params.row.condition },
              on: { 'on-change': function(val) { that.setRowVal(val, 'condition', params.index) }}
            }, ['and', 'or'].map(val => h('Option', {
              props: { value: val, key: `opt_operator_${params.index}_${val}`}
            }, val)))
        }, {
          title: '括号',
          key: 'bracket_left',
          width: 60,
          render: (h, params) => {
            return h('Select', {
              props: { size: 'small', transfer: true, clearable: true, value: params.row.bracket_left },
              on: {
                'on-change': function(val) {
                  that.setRowVal(val, 'bracket_left', params.index)
                }
              }
            }, [ h('Option', { props: { value: '(' }}, '(') ])
          }
        }, {
          title: '字段名',
          key: 'field',
          render: (h, params) => h('Select', {
            props: { size: 'small', transfer: true, clearable: true, value: params.row.field },
            on: { 'on-change': function(val) { that.setRowVal(val, 'field', params.index) }}
          }, that.fields.map(fieldItem => h('Option', { props: {
              value: fieldItem.field, key: params.row.field}
            }, fieldItem.label||fieldItem.field))
          )
        }, {
          title: '运算符',
          key: 'operator',
          width: 75,
          render: (h, params) => h('Select', {
              props: { size: 'small', transfer: true, value: params.row.operator },
              on: { 'on-change': function(val) { that.setRowVal(val, 'operator', params.index) }}
            }, operatorKey.map(val => h('Option', {
            props: { value: val, key: `opt_operator_${params.index}_${val}`}
          }, val)))
        }, {
          title: '值',
          key: 'value',
          render: (h, params) => h('Input', {
            props: { size: 'small', clearable: true, value: params.row.value },
            on: { 'on-blur': function(e) {
              that.setRowVal(e.target.value, 'value', params.index)
            }}
          })
        }, {
          title: '括号',
          key: 'bracket_right',
          width: 60,
          render: (h, params) => h('Select', {
            props: { size: 'small', transfer: true, clearable: true, value: params.row.bracket_right },
            on: { 'on-change': function(val) {
              that.setRowVal(val, 'bracket_right', params.index)
            }}
          }, [ h('Option', { props: { value: ')' }}, ')') ])
        }
      ],
      fieldTableColumns: [{
        title: ' ',
        width: 20,
        render: (h, params) => params.index != that.selectedFieldRowIdx? h('span') : h('Icon', {
          props: { type: 'md-checkmark', color: '#2b85e4' },
          class: { ml5: true }
        })
      }, {
          title: '字段名',
          key: 'label',
          render: (h, params) => h('div', {'class': { ml10: true }}, params.row.label)
        }
      ]
    }
  },
  methods: {
    handleWhereRowChange: function(currentRow) {
      this.selectedWhereRowIdx = this.stateData.where.findIndex(o => o.id === currentRow.id )
    },
    handleWhereAddRow: function() {
      let len = this.stateData.where ? this.stateData.where.length : 0
      let newItem = this.whereTableColumns.reduce((previous, current) => ({[current.key] : ''}), {})
      this.stateData.where.push(Object.assign(newItem, {
        id: guid(),
        field: this.fields && this.fields.length ? this.fields[0].field: '',
        operator: '=',
        condition: 'and',
        ...(len > 0 && { condition: 'and' })}))
    },
    handleWhereAppendRow: function() {
      let len = this.selectedWhereRowIdx + 1
      let newItem = this.whereTableColumns.reduce((previous, current) => ({[current.key] : ''}), {})
      this.stateData.where.splice(len, 0, (Object.assign(newItem, { id: guid(), operator: '=', ...(len > 0 && { condition: 'and' })})))
    },
    handleWhereRemoveRow: function() {
      let idx = this.selectedWhereRowIdx
      this.stateData.where.splice(idx, 1)
      let len = this.stateData.where.length
      this.selectedWhereRowIdx = len == 0 ? -1 : (len > idx + 1 ? idx : len - 1)
    },
    handleAddField: function() {
      var field = this.selectedField
      if ('*' === field) {
        this.$set(this.stateData, 'fields', JSON.parse(JSON.stringify(this.fields)))
        this.selectedField = ''
      } else  {
        var obj = this.fields.find(item => item.field === field)
        this.stateData.fields.push(obj)
      }
    },
    handleFieldRowClz: function(row, idx) {
      return idx === this.selectedFieldRowIdx? 'ivu-table-row-highlight': ''
    },
    handleFieldRowChange: function(currentRow) {
      this.selectedFieldRowIdx = this.stateData.fields.findIndex(o => o.field === currentRow.field )
    },
    handleUpField: function() {
      let idx = this.selectedFieldRowIdx
      let next = idx - 1
      let item = this.stateData.fields.splice(idx, 1)[0]
      this.stateData.fields.splice(next, 0, item)
      this.selectedFieldRowIdx = next
    },
    handleDownField: function() {
      let idx = this.selectedFieldRowIdx
      let next = idx + 1
      let item = this.stateData.fields.splice(idx, 1)
      this.stateData.fields.splice(next, 0, item[0])
      this.selectedFieldRowIdx = next
    },
    handleRemoveField: function() {
      let idx = this.selectedFieldRowIdx
      this.stateData.fields.splice(idx, 1)
      let len = this.stateData.fields.length
      this.selectedFieldRowIdx = len == 0 ? -1 : (len > idx + 1 ? idx : len - 1)
    },
    setRowVal(val, key, idx) {
      // console.log(val, key, idx)
      // this.stateData.where[idx][key] = val
      let item = this.stateData.where[idx]
      item[key] = val
      this.stateData.where.splice(idx, 1, item)
    },
    handleModalOk: function() {
      let that = this
      let { stateData } = this
      let listKv = { where: '条件信息', fields: '列顺序'}
      let strKv = { name: '产品名称', tag: '医院标签'}
      let err = []
      Object.keys(strKv).forEach(key => isEmpty((stateData[key]||'').trim()) && err.push(`“${strKv[key]}”`))
      Object.keys(listKv).forEach(key => isEmpty(stateData[key]) && err.push(`“${listKv[key]}”`))
      if (err.length) {
        that.$Message.error(err.join("，") + " 不能为空")
        // this.$Modal.error({ title: "错误", closable: true, content: err.join("\n") })
      } else {
        updateProduct(stateData).then(function() {
          that.$emit('change')
          that.cancel()
        }).catch(function() {
          that.$Message.error({ title, desc: stateData.id? `更新失败`: `保存失败` })
        })
      }
    },
    cancel: function() {
      this.stateVisible = false
    },
    getShellStr() {
      let { sql } = this
      let { name } = this.stateData
      let [ YYYY, MM, DD, HH, ss, SSS ] = (new Date()).format('YYYY MM DD HH ss SSS').split(' ')
      return `beeline -n hive -u jdbc:hive2://172.16.2.102:10000 --verbose=true --outputformat=csv2 -e "${sql}" >> /data/product/${name}/${YYYY}/${MM}/${name}${YYYY}${HH}${DD}${HH}${ss}${SSS}.csv`
    },
    getProccess() {
      let { where, fields, name, tag, user, description, taskId } = this.stateData
      let { sql } = this
      let task = {
        globalParams: [],
        tasks: [{
            type: 'SHELL',
            id: taskId,
            name,
            params: {
              resourceList: [],
              localParams: [
                { prop: 'fields', direct: 'IN', type: 'VARCHAR', value: JSON.stringify(fields) },
                { prop: 'where', direct:  'IN ', type:  'VARCHAR ', value: JSON.stringify(where) },
                { prop: 'tag', direct: 'IN', type: 'VARCHAR', value: tag },
                { prop: 'user', direct: 'IN', type: 'VARCHAR', value: user }
              ],
              rawScript: `echo "${sql}"` // @TODO
            },
            description,
            timeout: { strategy: '', interval: null, enable: false },
            runFlag: 'NORMAL',
            conditionResult: { successNode: [''], failedNode: [''] },
            dependence: {},
            maxRetryTimes: '0',
            retryInterval: '1',
            taskInstancePriority: 'MEDIUM',
            workerGroup: 'default',// @TODO
            preTasks: []
          }],
        tenantId: 0,
        timeout: 0
      }
      return {
        processDefinitionJson: JSON.stringify(task),
        name,
        description,
        locations: JSON.stringify({ [taskId]: { name, targetarr: '', nodenumber: '0', x: 593,y: 164 } }),
        connects: []
      }
    }
  }
}
</script>
<style>
.product-modal tbody .ivu-table-cell { padding-left: 1px !important; padding-right: 1px !important; }
.mt100 { margin-top:100px; }
.mt150 { margin-top:150px; }
</style>