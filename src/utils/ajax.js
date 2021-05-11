import Vue from 'vue';
import axios from 'axios';
import router from '../router';
/*import role from '../views/role/config';*/
import login from '@/components/login/config'
import business from '@/components/business/config'
import student from '@/components/student/config'
import report from '@/components/report/config'
import standard from '@/components/standard/config'
import rules from '@/components/rules/config'
import authority from '@/components/authority/config'
import systemConfig from '@/components/systemConfig/config'
import dataReportManage from '@/components/dataReportManage/config'
import reportManager from '@/components/reportManager/config'
import reportForms from '@/components/reportForms/config'
import feedBack from '@/components/feedBack/config'
import homePage from '@/components/homePage/config'

//axios.defaults.baseURL = Vue.config.apiPrefix;

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    if (response.headers.token) {
        Vue.setData("token", response.headers.token);
    }
    return response;
}, function(error) {
    // 对响应错误做点什么
    switch (error.response.status) {
        case 401:
            Vue.cleanUp();
            Vue.store.commit('updateHistory', []);
            router.push('/login');
            break;
        case 403:
            router.push('/403');
            break;
    }
    return Promise.reject(error);
});

const initUrls = {
    'user.login': {
        'type': 'POST',
        'real': '/user/login',
        'mock': 'mock/login/user_login_{loginName}.json'
    },
    'user.logout': {
        'type': 'POST',
        'real': '/user/logout',
        'mock': 'mock/common/success.json'
    }
};

var urls = Object.assign(initUrls, login.urls, business.urls, rules.urls, student.urls, report.urls, standard.urls, authority.urls, systemConfig.urls, dataReportManage.urls, reportManager.urls, reportForms.urls, feedBack.urls, homePage.urls);

/**
 * 格式化表单数据
 * @param {send 参数} config
 */
var formatFormOption = function(config) {
    var option = Object.assign({}, this);
    var self = this;
    var formData = this.data;
    if (self.data && self.data.constructor.name) {
        if (self.data.constructor.name.toLowerCase() === 'object') {
            formData = new FormData();
            Object.keys(self.data).forEach(key => {
                formData.append(key, self.data[key]);
            });
        }
    }
    option.data = formData;
    option.type = config.type || 'POST';
    option.dataType = this.dataType || 'json';
    option.async = this.async ? this.async : true;
    option.headers = [{
        'token': Vue.getData("token")
    }];
    if (Vue.config.testMode) {
        option.type = 'GET';
        option.url = Vue.config.mockServer + config.mock;
    } else {
        var prefix = this.apiPrefix !== undefined ? this.apiPrefix : Vue.config.apiPrefix;
        option.url = prefix + config.real;
    }
    option.cancel = this.cancel;

    return option;
};

/**
 * 格式化Url（替换占位符）
 *
 * @param {String} url,如/user/{userId}
 * @param {Object} data,如{userId:3}
 * @return {String} 如 /user/3
 */
var formatUrl = function(url, data) {
    if (!url) return null;
    var keys = url.match(/\{\w+\}/g);
    keys = (keys === null) ? [] : keys;
    if (keys) {
        keys.forEach(function(key) {
            var rawKey = key.substr(1, key.length - 2);
            var replace;
            if (!data || !data[rawKey]) {
                replace = '';
            } else {
                replace = data[rawKey];
            }
            url = url.replace(new RegExp(key, 'g'), replace);
        });
    }
    return url;
};

/**
 * this = object from config
 * 根据配置和数据预处理Ajax请求参数
 */
var formatRequest = function(data) {
    var opt = {};
    if (!Vue.config.testMode) {
        opt = {
            method: this.type || 'POST',
            timeout: Vue.config.timeout,
            responseType: 'json',
            headers: {
                'token': Vue.getData("token")
            }
        };
    }

    if (Vue.config.testMode) {
        opt.url = formatUrl(this.mock ? this.mock : '', data);
        opt.method = 'GET';
    } else {
        var prefix = this.apiPrefix !== undefined ? this.apiPrefix : Vue.config.apiPrefix;
        opt.url = prefix + formatUrl(this.real, data);
    }

    if (this.format) {
        var formatedOpt = this.format(data, opt);
        if (!Vue.config.testMode) {
            Object.assign(opt, formatedOpt);
        } else if (formatedOpt.data) {
            opt.data = encodeURI(formatedOpt.data);
        }
    } else {

        if (!Vue.config.testMode) {
            Object.assign(opt, {
                data: data
            });
        } else if (data) {
            opt.data = encodeURI(data);
        }
    }
    return opt;
};

var ajax = {
    send: function(config) {
        // 提交表单操作
        if (config.formData && !Vue.config.testMode) {
            if (!urls[config.name]) {
                console.warn('提供的ajax name在ajax.js中不存在 [' + config.name + ']!');
                return null;
            }
            var opt = formatFormOption.call(config || {}, urls[config.name]);
            var request = new XMLHttpRequest();
            request.open(opt.type, opt.url, opt.async);
            if (opt.headers) {
                opt.headers.forEach(header => {
                    Object.keys(header).forEach(item => {
                        request.setRequestHeader(item, header[item]);
                    });
                });
            }
            request.send(opt.data);
            if (opt.cancel) {
                opt.cancel.call(config || {}, function() {
                    request.abort();
                });
            }
            request.onreadystatechange = function() {
                if (request.readyState === 4) { // 4代表执行完成
                    if (opt.complete) {
                        opt.complete();
                    }
                    if (request.status === 200) { // 200代表执行成功
                        if (opt.success) {
                            if (request.responseText && opt.dataType.toLowerCase() === 'json') {
                                opt.success(JSON.parse(request.responseText));
                            } else {
                                opt.success(request.responseText);
                            }
                        }
                    } else {
                        if (request.status == 401) {
                            Vue.cleanUp();
                            Vue.store.commit('updateHistory', []);
                            router.push('/login');
                            return;
                        }
                        if (opt.error) {
                            if (request.responseText && opt.dataType.toLowerCase() === 'json') {
                                opt.error(JSON.parse(request.responseText));
                            } else {
                                opt.error(request.responseText);
                            }
                        } else {
                            console.error('请求失败');
                        }
                    }
                }
            };
            return null;
        }
        // 默认参数
        var params = {};
        // 根据提供的数据扩展默认参数
        if (config.hasOwnProperty('data') && config.data) {
            Object.assign(params, config.data);
        }
        if (!urls[config.name]) {
            console.warn('提供的ajax name在ajax.js中不存在 [' + config.name + ']!');
            return null;
        }
        if (urls[config.name].auth && !Vue.authorize(urls[config.name].auth)) {
            /*Vue.showWarningPopup('权限提示', '当前用户没有此访问权限!!!', function () {
                router.go(-1);
            });*/
            return null;
        }

        var properties = formatRequest.call(urls[config.name], params);
        return axios(properties).then(function(response) {
            if (config.success) {
                config.success(response.data);
            }
        }).catch(function(error) {
            if (config.error) {
                config.error(error);
            }
        });
    }
};

export default ajax;