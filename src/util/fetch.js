/**
 *
 * Created by kebin on 2017/7/31.
 */
import axios from 'axios';
import router from '../router/index';
import { Message } from 'element-ui';

const service = axios.create({
    baseURL: '',
    timeout: 15000,
    header: {
        'contentType': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent' : 'smartlemon' 
    }
});

// 添加一个请求拦截器
service.interceptors.request.use(config => {
    return config;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

// 添加一个响应拦截器
service.interceptors.response.use(response => {
    let data = response.data;
    switch (data.code) {
        case 200 :
            Message({
                showClose: true,
                message: data.msg,
                type: 'success'
            });
            break;
        case 201 :  //注册步骤未完成
        case 202 :  //账号被限制登录
        case 203 :  //未注册的账号
            Message({
                showClose: true,
                message: data.msg,
                type: 'error'
            });
            break;
        case 403 :
            Message({
                showClose: true,
                message: '请先登录',
                type: 'warning'
            });
            router.replace({ path: '/login' });
            break;
        default :
            Message({
                showClose: true,
                message: data.msg,
                type: 'error'
            });
            break;
    }
    return response;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

export default service;