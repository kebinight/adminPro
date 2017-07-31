import Vue from 'vue';
import App from './App';
import router from './router';
import fetch from '../static/js/util/fetch';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import "babel-polyfill";

//定义全局常量
global.__STATIC_PATH = "../static";

Vue.use(ElementUI);
Vue.prototype.$fetch = fetch;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');