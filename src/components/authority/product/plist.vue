<template>
  <div class="m15">
    <h2 class="common-title">产品管理</h2>
    <div class="search-con">
      <Form :model="searchForm" ref="formInline" inline>
          <FormItem label="产品名称" :label-width="80">
              <Input v-model="searchForm.searchVal" type="text" placeholder="请输入产品名称" style="width: 260px;" clearable/>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="loadData">检索</Button>
          </FormItem>
          <Button v-authorize="'ProductManageProductManageAdd'" type="primary" @click="handleAdd" icon="md-add" class="fr">新增</Button>
      </Form>
    </div>
    <div class="mt15">
      <o-grid-table :tableProps="tableProps" v-model="listData" ref="grid"/>
    </div>
    <new-product-modal v-if="visible" :visible.sync="visible" v-model="formData" @change="loadData"/>
  </div>
</template>
<script>
import NewProductModal from './components/NewProductModal';
import OTable from '../../common/OTable'
import OGridTable from '../../common/OGridTable'
import { callApi } from '@/utils/request.js'
import { updateProduct, formatProcessItem } from './components/productItemUtil.js'
import { get } from 'lodash'
import config from '@/config.js'

export default {
  components: { NewProductModal, OTable, OGridTable },
  data() {
    let that = this
    return {
      prefixCls: 'ivu-table',
      visible: false,
      searchForm: { searchVal: '', pageNo: 1, pageSize: 20 },
      listData: {},
      formData: {},
      tableProps: {
        columns: [
          { title: '产品编号', key:'id', sortable: true, moveable: true, width: 120 },
          { title: '产品名称', key: 'name', sortable: true, moveable: true },
          { title: '产品描述', key: 'description', sortable: true, moveable: true },
          { title: '数据包名称', key: 'packageName', sortable: true, moveable: true, width: 130 },
          { title: '产品状态', key: 'releaseState', sortable: true, moveable: true, width: 130 },
          { title: '创建时间', key: 'createTime', sortable: true, moveable: true, width: 150,
            render: (h, opts) => h('div', get(opts, 'row.createTime') ? new Date(opts.row.createTime).format('YYYY-MM-DD HH:mm:ss'): '')
          },
          { title: '创建人', key: 'createUser', sortable: true, moveable: true, width: 100 },
          {
            title: '操作',
            filterable: false,
            removeable: false,
            width: 200,
            render: (h, opts) => h('div', [
              h('Button', {
                props: { size:'small', type: 'primary', icon: 'md-create', 'v-authorize': 'ProductManageProductManageEdit' },
                domProps: { title: '编辑' },
                on: { click: () => {
                  console.log( '编辑', opts.row)
                  that.handleEdit(opts.row)
                }}} ),
              h('Button', {
                props: { size:'small', type: 'primary', icon: 'md-play', 'v-authorize': 'ProductManageProductManageEdit' },
                domProps: { title: '启用' },
                on: { click: () => {
                  console.log( '启用', opts.row)
                  that.handleStart(opts.row)
                }}} ),
              h('Button', {
                props: { size:'small', type: 'primary', icon: 'ios-cloud-download', 'v-authorize': 'ProductManageProductManageEdit' },
                domProps: { title: '下载' },
                on: { click: () => {
                  that.handleDownload(opts.row)
                }}} ),
              h('Button', {
                props: {size:'small', type: 'error', icon: 'md-remove'},
                domProps: { title: '停用' },
                on: { click: () => {
                  console.log('停用', opts.row)
                  that.handleDelete(opts.row)
                }}} )
            ])
          }
        ]
      },
      pageOn: {
        'on-change': pageNo => {
          this.searchForm.pageNo = pageNo
          this.loadData()
        },
        'on-page-size-change': pageSize => {
          this.searchForm.pageSize = pageSize
          this.loadData()
        }
      }
    }
  },
  methods: {
    handleAdd () {
      this.formData = {}
      this.visible = true
    },
    handleEdit (row) {
      let that = this
      let { id } = row
      this.releaseProcessDefinition(row).then(() => {
        callApi('queryProcessDefinitionById', { processId: id }).then(rs => {
          let { code, data } = rs
          if (code !== 0) { return that.$Message.info(`获取数据失败`) }
          that.formData = data
          that.visible = true
        })
      })
    },
    handleDownload (row) {
      let that = this
      let { id, name } = row
      callApi('queryProcessDefinitionById', { processId: id }).then(rs => {
          let { code, data } = rs
          if (code !== 0) { return that.$Message.info(`获取数据失败`) }
          let info = JSON.parse(data.processDefinitionJson||'{}') || {}
          let path =  get(get(info, 'tasks[0].params.localParams', []).filter(o => o.prop === 'filePath'), '0.value')
          if(path) {
            let href = config.productDownloadPrifix + (path.indexOf('/') == 0 ? '' : '/') + path
            that.$Modal.info({ title: '下载', render: (h) => h('a', {attrs: {href, target: '_blank'}}, path) })
          }else {
            that.$Message.warning(`请先运行产品导出功能`) 
          }
      })
    },
    handleDelete (row) {
      let that = this
      let { id, name } = row
      this.$Modal.confirm({
        title: '删除确认',
        content: `确定要删除“${name}”？`,
        onOk: () => {
          that.releaseProcessDefinition(row).then(() => {
            callApi('deleteProcessDefinitionById', { processDefinitionId: id }).then((rs) => {
              let { code, msg } = rs
              if (code != 0) {
                this.$Notice.success({ title: `删除“${name}”`, desc: '删除成功' })
                that.loadData()
              } else {
                this.$Notice.error({ title: `删除“${name}”`, desc: msg || '删除失败' })
              }
            })
          })
        }
      });
      this.releaseProcessDefinition(row)
    },
    handleStart (row) {
      let that = this
      let { id, name } = row
      // 下线
      this.releaseProcessDefinition(row, 0, false).then(function() {
        let title = `产品“${name}”`
        // 查询信息
        callApi('queryProcessDefinitionById', { processId: id }).then(function(item){
          let { code, msg, data } = item
          if (code !== 0) {
            return that.$Notice.error({ title, desc: msg || `获取产品信息失败` })
          }
          let stateData = formatProcessItem(data)
          updateProduct(stateData).then(function(fileName) {
            that.$Notice.success({ title, desc: `更新产品时间戳`})
            that.releaseProcessDefinition(row, 1).then(function() {
              callApi('startProcessInstance', { processDefinitionId: id }).then(function(startRs) {
                let {code, msg } = startRs
                if (code == 0) {
                  that.$Notice.success({ title, desc: `导出流程执行成功` })
                } else {
                  that.$Notice.error({ title, desc: msg || `导出流程执行失败` })
                }
              })
            })
          }).catch(function() {
            that.$Notice.error({ title, desc: `更新时间戳失败` })
          })
        })
      })
    },
    loadData () {
      this.listData = callApi('queryProcessDefinitionListPaging', this.searchForm)
    },
    releaseProcessDefinition(row, state = 0, refresh = true) {
      let that = this
      let { id, releaseState, name } = row
      let title = `产品“${name}”`
      let label = ['下线', '上线'][state]
      let _state = ['OFFLINE', 'ONLINE'].indexOf(releaseState)
      if (_state === state) { return Promise.resolve() }
      this.$Notice.success({ title, desc: `产品${label}` })
      let data = { processId: id, releaseState: state }
      let defe = callApi('releaseProcessDefinition', data)
      return new Promise((resolve, reject) => {
        defe.then(rs => {
          if (rs.code === 0) {
            row.releaseState = ['OFFLINE', 'ONLINE'][state]
            refresh && that.loadData()
            resolve()
          } else {
            this.$Notice.error({ title, desc: rs.msg || `产品${label}失败` })
            reject()
          }
        }).catch(reject)
      })
    },
    update() {
      
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>