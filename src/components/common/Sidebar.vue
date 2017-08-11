<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.children">
                    <el-submenu :index="item.node">
                        <template slot="title"><i :class="item.class"></i>{{ item.name }}</template>
                        <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.node">
                        {{ subItem.name }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.node">
                        <i :class="item.class"></i>{{ item.name }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: []
        }
    },
    created () {
        let url = '/menu/getMenu';
        //let url = 'http://www.easy-mock.com/mock/59770dbca1d30433d83d0f6a/adminpro/menu/getMenuList';
        let obj = this;
        this.$fetch.post(url).then(function(response) {
            let res = response.data;
            if(res.status) {
                let data = res.data;
                obj.items = data.menu;
            }
        }).catch(function(response) {
        });
    },
    computed:{
        //返回当前活动的菜单项名
        onRoutes(){
            return this.$route.path.replace('/', '');
        }
    }
}
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
