import Vue from 'vue'

let config = Vue.config;

config.testMode = false; //是否使用mock模式
config.mockServer = "http://192.168.0.80:8080/static/"; // 发起ajax请求的路径前缀
// config.apiPrefix = "http://172.16.2.169:8840"; // 发起ajax请求的路径前缀 刘提提地址
// config.authApiPrefix = "http://172.16.2.169:8836";
// config.uploadApiPrefix = "http://172.16.2.169:8842";


config.apiPrefix = "http://172.17.36.16:8840"; // 发起ajax请求的路径前缀 刘提提地址
config.authApiPrefix = "http://172.17.36.16:8836";
config.uploadApiPrefix = "http://172.17.36.16:8842";


config.filePathPrefix = "\\\\172.16.2.129\\";
config.timeout = 300000; // ajax的默认超时时间(ms)
config.servicetimeout = 1 * 60 * 1000; //页面重加载间隔
config.systemId = 20; 
config.uploadSystemId = 22; //上报系统id
config.dolphinSchedulerApiPrifix = '/dolphinSchedulerApi'// 调度系统
config.dolphinSchedulerProjectName = '合理用药产品'
config.dolphinScheduleToken = '6a06b7207b4e681b78c03cd45bf25951'
config.productDownloadPrifix = '/productDownload'// 下载路径前缀
if(process.env.NODE_ENV=='development'){
    config.filePathPrefix = "\\\\172.16.2.129\\";
    // config.apiPrefix = "http://localhost:8840";
    config.apiPrefix = "http://localhost:8840";
    // config.authApiPrefix = "http://localhost:8836";
    config.authApiPrefix = "http://localhost:8836";
    config.uploadApiPrefix = "http://localhost:8842";
    config.dolphinSchedulerApiPrifix = '/dolphinSchedulerApi'
    config.dolphinSchedulerProjectName = '合理用药产品'
    config.dolphinScheduleToken = 'a3a31824f74d04441e239d410adc1105'
    config.productDownloadPrifix = '/productDownload'// 下载路径前缀
}
export default config;