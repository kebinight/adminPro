import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
import utils from '../util/utils';

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
                    component: resolve => require(['../components/page/menu/MenuIndex.vue'], resolve)
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
                },
                //角色管理---------------------------------------------------------------------------------
                {
                    path: '/role-index',   //角色管理
                    component: resolve => require(['../components/page/role/RoleIndex.vue'], resolve)
                },
                {
                    path: '/role-add',   //添加角色
                    component: resolve => require(['../components/page/role/RoleSave.vue'], resolve)
                },
                {
                    path: '/role-edit',   //编辑角色
                    component: resolve => require(['../components/page/role/RoleSave.vue'], resolve)
                },
                //账号管理---------------------------------------------------------------------------------
                {
                    path: '/user-index',   //账号管理
                    component: resolve => require(['../components/page/user/UserIndex.vue'], resolve)
                },
                {
                    path: '/user-add',   //添加账号
                    component: resolve => require(['../components/page/user/UserSave.vue'], resolve)
                },
                {
                    path: '/user-edit',   //编辑账号
                    component: resolve => require(['../components/page/user/UserSave.vue'], resolve)
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
        let isLogin = utils.getCookie('isLogin');
        if(isLogin) {
            next();
        } else {
            next('/login');
        }
    }

});

export default router;

