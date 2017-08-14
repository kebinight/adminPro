    /**
 *
 * Created by kebin on 2017/7/31.
 */
import axios from 'axios';
import router from '../router/index';
import { Message } from 'element-ui';

//axios.defaults.withCredentials = true
const service = axios.create({
    baseURL: (process.env.NODE_ENV === 'development') ? 'http://localhost:8080/api/' : 'http://pro-admin.cn',
    timeout: 15000,

    header: {
        'contentType': 'application/x-www-form-urlencoded; charset=UTF-8',
        //'Access-Control-Allow-Origin': '*',
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
    let msgType = 'success';
    switch (data.code) {
        case 200 :
            break;
        case 201 :  //注册步骤未完成
        case 202 :  //账号被限制登录
        case 203 :  //未注册的账号
            msgType = 'error';
            break;
        case 403 :
            msgType = 'warning';
            router.replace({ path: '/login' });
            break;
        default :
            msgType = 'error';
            break;
    }

    //提示消息弹窗
    if(data.msg) {
        Message({
            showClose: true,
            message: data.msg,
            type: msgType
        });
    }
    return response;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

export default service;

