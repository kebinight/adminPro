import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';

Vue.use(Router);
let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                //菜单管理---------------------------------------------------------------------------------
                {
                    path: '/menu-index',   //菜单管理
                    component: resolve => require(['../components/page/menu/MenuIndex.vue'], resolve)
                },
                {
                    path: '/menu-add',   //添加菜单
                    component: resolve => require(['../components/page/menu/MenuSave.vue'], resolve)
                },
                {
                    path: '/menu-edit',   //编辑菜单
                    component: resolve => require(['../components/page/menu/MenuSave.vue'], resolve)
                },
                //权限管理---------------------------------------------------------------------------------
                {
                    path: '/limit-index',   //权限管理
                    component: resolve => require(['../components/page/limit/LimitIndex.vue'], resolve)
                },
                {
                    path: '/limit-add',   //添加权限
                    component: resolve => require(['../components/page/limit/LimitSave.vue'], resolve)
                },
                {
                    path: '/limit-edit',   //编辑权限
                    component: resolve => require(['../components/page/limit/LimitSave.vue'], resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
});

router.beforeEach((to, from, next) => {
    if(to.path == '/login') {
        next();
    } else {
        if(localStorage.getItem('isLogin')) {
            next();
        } else {
            Message({
                showClose: true,
                message: '请先登录',
                type: 'warning'
            });
            next({ path: '/login' });
        }
    }

});

export default router;

