import Vue from 'vue';
import App from './App';
import router from './router';
import fetch from './util/fetch';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import "babel-polyfill";

//定义全局常量

//引入全局对象
Vue.use(ElementUI);
Vue.prototype.$fetch = fetch;
Vue.prototype.$message = Message;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');