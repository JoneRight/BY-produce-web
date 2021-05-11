import Vue from 'vue'
import axios from 'axios'
import config from '../config.js'
import { merge, get, cloneDeep } from 'lodash'
import qs from 'qs';

/**
 * 主要封装 Dolphin Scheduler Api 
 */

const service = axios.create({
  baseURL: config.dolphinSchedulerApiPrifix,
  timeout: 6000, // 请求超时时间
  headers: {
    // 'Content-Type': 'multipart/form-data',// 'application/json; charset=utf-8',
    'Content-Type': 'application/x-www-form-urlencoded',
    'token': config.dolphinScheduleToken,
    'Accept-Language': 'zh-CN,zh;q=0.9'
  }
})

const err = (error) => {
  error.response && Vue.prototype.$Modal.error({ title: "错误", closable: true, content: get(error, 'error.response.data.message', '请求失败') })
  return Promise.reject(error)
}

// response interceptor
service.interceptors.response.use((response) => response.data, err)

let projectName = config.dolphinSchedulerProjectName

const urlKv = {
  'queryProcessDefinitionListPaging': {
    method: 'get',
    url: `/dolphinscheduler/projects/${projectName}/process/list-paging`,
    data: { pageSize: 20, pageNo: 1 }
  },
  'updateProcessDefinition': {
    method: 'post',
    url: `/dolphinscheduler/projects/${projectName}/process/update`
  },
  'save': {
    method: 'post',
    url: `/dolphinscheduler/projects/${projectName}/process/save`
  },
  // 删除流程定义通过流程定义ID
  deleteProcessDefinitionById: {
    method: 'get',
    url: `/dolphinscheduler/projects/${projectName}/process/delete`,
    data: {
      processDefinitionId: ''// 流程定义ID
    }
  },
  // 查询流程定义通过流程定义ID
  queryProcessDefinitionById: {
    method: 'get',
    url: `/dolphinscheduler/projects/${projectName}/process/select-by-id`,
    data: {
      processId: 0 // 流程定义ID
    }
  },
  // 发布流程定义
  releaseProcessDefinition: {
    method: 'post',
    url: `/dolphinscheduler/projects/${projectName}/process/release`,
    data: {
      processId: 0,// 流程定义ID
      releaseState: 0// 0: 下线; 1: 上线
    }
  },
  // 流程实例执行相关操作 运行流程实例
  startProcessInstance: {
    method: 'post',
    url: `/dolphinscheduler/projects/${projectName}/executors/start-process-instance`,
    data: {
      failureStrategy: 'CONTINUE', // 失败策略,可用值:END,CONTINUE (结束 继续)
      processDefinitionId: '', // 流程定义ID
      processInstancePriority: 'MEDIUM',//流程优先级 ,可用值:HIGHEST,HIGH,MEDIUM,LOW,LOWEST
      scheduleTime: '',// 定时时间
      warningGroupId: 0,// 发送组ID
      taskDependType: 'TASK_POST',// 任务依赖类型,可用值:TASK_ONLY,TASK_PRE,TASK_POST
      runMode: 'RUN_MODE_SERIAL',// 运行模式,可用值:RUN_MODE_SERIAL,RUN_MODE_PARALLEL
      receivers: '',// 收件人
      receiversCc: '',// 收件人(抄送)
      workerGroup: '',// 参考下面 queryAllWorkerGroups
      warningType: 'NONE' // 发送策略,可用值:NONE,SUCCESS,FAILURE,ALL (都不发, 成功发，失败发，成功或失败都发)
    }
  },
  // 检查流程定义
  startCheckProcessDefinition: {
    method: 'post',
    url: `/dolphinscheduler/projects/${projectName}/executors/start-check`,
    warningGroupId: 0
  },
  // 验证流程定义名字
  'verify-name': {
    method: 'get',
    url: `/dolphinscheduler/projects/${projectName}/process/verify-name`,
    data: {
      name: '' //流程定义名称
    }
  },
  // 查询租户列表
  'queryTenantlist': {
    method: 'get',
    url: `/dolphinscheduler/tenant/list`
  },
  // 查询worker group分组
  'queryAllWorkerGroups': {
    method: 'get',
    url: `/dolphinscheduler/worker-group/all-groups`
  }
}

const callApi = function(name, opts) {
  let cfg = get(urlKv, name)
  if (!cfg) return null
  let obj = merge(cloneDeep(cfg), { data: { ...opts } })
  let ts = '_t=' + new Date().getTime()
  if (obj.method === 'get') {
    let data = obj.data || {}
    let arg = Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}` )
    arg.push(ts)
    obj.url = obj.url + (obj.url.indexOf('?') == -1 ? '?' : '&' ) + arg.join('&')
    return service.get(obj.url)
  } else {
    obj.data = qs.stringify(obj.data)
    return service(obj)
  }
}

export {
  service as axios,
  callApi
}