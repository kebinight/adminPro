<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            items: []
        }
    },
    created () {
        var url = 'http://www.easy-mock.com/mock/59770dbca1d30433d83d0f6a/adminpro/common/getMenuList';
        var obj = this;
        axios.post(url).then(function(response) {
            var res = response.data;
            if(res.status) {
                obj.items = res.data;
            }
        }).catch(function(response) {
            console.log(response);
        });
    },
    computed:{
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
