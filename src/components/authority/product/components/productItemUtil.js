
import { template, get, set, isArray, isEmpty, isObject } from 'lodash'
import { callApi } from '@/utils/request.js'
import Vue from 'vue'
import { randomNum } from '@/utils/strUtil.js'

let fromTableSql = ` from formal.buy_medicines a join baseview.t_view_drug b on a.m_drug = b.drug join baseview.t_view_areas c on c.hosp_id = a.hosp_id join baseview.t_view_date d on d.yearmonth_id = a.year_month join baseview.t_view_hosp e on e.hosp_id = a.hosp_id `
let shellTpl = template(`beeline -n hive -u jdbc:hive2://172.16.2.102:10000 --verbose=true --outputformat=csv2 -e "<%=sql%>" >> /data/product/<%=name%>/<%=YYYY%>/<%=MM%>/<%=fileName%>.csv`)
let fileNameTpl = template(`<%name%>_<%=YYYY%><%=MM%><%=DD%><%=HH%><%=mm%><%=ss%><%=SSS%>`)

export const talbeFields = [
  { field: 'province_name', label: '省份' },
  { field: 'city_name', label: '城市' },
  { field: 'year_name', label: '年' },
  { field: 'quarter_name', label: '年季' },
  { field: 'month_name', label: '年月' },
  { field: 'a.hosp_id', label: '医院编码' },
  { field: 'b.drug_generic_name', label: '通用名' },
  { field: 'b.drug_trade_name', label: '商品名' },
  { field: 'b.spec_office', label: '统一规格' },
  { field: 'b.package_spec', label: '包装规格' },
  { field: 'b.form_name1', label: '剂型1' },
  { field: 'b.form_name2', label: '剂型2' },
  { field: 'b.path_drug_name', label: '给药途径' },
  { field: 'b.company_name', label: '生产企业' },
  { field: 'e.hosp_name', label: '医院名称' },
  { field: 'b.package_chinese_name', label: '产品名称' },
  { field: 'b.spec', label: '规格' }
]

export function formatProcessItem(element = {}) { 
  let { id, description = '', name = '', processDefinitionJson } = element
  let rs = {
    id,
    name: name || '',
    '_name': name || '',
    description: description || '',
    tag: '',
    user: '',
    where: [],
    fields: [],
    taskId: 'tasks-' + randomNum(10000, 99999)
  }
  let json = JSON.parse(processDefinitionJson || '{}')
  if (json) {
    let task = get(json, 'tasks[0]')
    if (task) {
      rs.taskId = task.id
      let params = get(task, 'params.localParams')
      if (params) {
        params.forEach(element => {
          let { prop, value } = element
          if (['name', 'tag', 'description', 'user'].indexOf(prop) !== -1) {
            rs[prop] = value
          } else if (['fields', 'where'].indexOf(prop) !== -1) {
            try { value && (rs[prop] = JSON.parse(value)) } catch (error) {}
          }
        })
      }
    }
  }
  return rs
}

export function getFieldsSql(fields = []) {
  return fields.map(o => `${o.field} as '${o.label}'`).join(",")
}

export function getSql(field, where) {
  let fullFieldsSql = isArray(field)? getFieldsSql(field): field
  let whereSql = isArray(where)? getWhereSql(where): where
  return fullFieldsSql && whereSql ? `select ${fullFieldsSql} ${fromTableSql} ${whereSql}` : ''
}

export function getWhereSql(list = []) {
  let trueIdx = 0
  return list && list.length? ' where ' + list.map((o, i) => {
    let arg = [' ']
    if (o.field) {
      trueIdx != 0 && o.condition && arg.push(o.condition)
      o.bracket_left && arg.push(o.bracket_left)
      o.field && arg.push(o.field)
      o.operator && arg.push(o.operator)
      arg.push(`'${o.value||''}'`)
      o.bracket_right && arg.push(o.bracket_right)
      trueIdx++
    }
    return arg.length == 1 ? '' : arg.join(' ')
  }).join(''): ''
}

export function getProcessItem(item) {

}

export function updateProduct(item = {}) {
  let { id = null, where, fields, name, _name, tag, user, description, taskId } = item
  let sql =  getSql(fields, where)
  let [ YYYY, MM, DD, HH, mm, ss, SSS ] = (new Date()).format('YYYY MM DD HH mm ss SSS').split(' ')
  let params = { sql, name, YYYY, MM, DD, HH, mm, ss, SSS }
  let fileName = fileNameTpl(params)
  let path = `${name}/${YYYY}/${MM}/${fileName}.csv`
  let rawScript = shellTpl({...params, fileName}) // @TODO
  // 注意 这个是一个object。 提交的时候，value 都必须是字符串
  let formData = {
    processDefinitionJson: {
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
              { prop: 'user', direct: 'IN', type: 'VARCHAR', value: user },
              { prop: 'filePath', direct: 'IN', type: 'VARCHAR', value: path },
            ],
            rawScript
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
    },
    name,
    description,
    locations: { [taskId]: { name, targetarr: '', nodenumber: '0', x: 387,y: 127 } },
    connects: [],
    id
  }
  let tenantDefe = callApi('queryTenantlist')
  let defe = new Promise(function(resolve, reject) {
    if (isEmpty(_name) || _name == name) { return resolve() }
    callApi('verify-name', { name }).then(function(rs) {
      let { code, msg } = rs
      if (code == 0) {
        resolve()
      } else {
        Vue.prototype.$Message.error(msg||'校验名称错误')
        reject()
      }  
    }).catch(reject)
  })
  return new Promise((resolve, reject) => {
    Promise.all([tenantDefe, defe]).then(function(values) {
      let [ tenantRs ] = values
      // @TODO 分组默认取第一个。或者这部分写入到配置文件
      let tenantId = get( tenantRs, 'data[0].id')
      set(formData, 'processDefinitionJson.tenantId', tenantId)
      for (let key in formData) { formData[key] = isObject(formData[key]) || isArray(formData[key])? JSON.stringify(formData[key]): formData[key] }
      let updateDefe = null
      if (id) {
        updateDefe = callApi('updateProcessDefinition', formData)
      } else {
        delete formData.id
        updateDefe = callApi('save', formData)
      }
      updateDefe.then(function(rs) {
        if(rs.code == 0) {
          resolve(fileName)
        } else {
          reject()
        }
      }).catch(reject)
    }).catch(reject)
  })
}