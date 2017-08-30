<template>
    <div class="header">
        <div class="logo" @click="goHome">后台管理系统</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" :src="user_info.avatar">
                    {{ user_info.name }}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="update-info">个人信息</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            let user_info = this.$utils.getCookie('user_info');
            user_info = JSON.parse(user_info);
            return {
                user_info: {
                    name: user_info.name,
                    avatar: user_info.avatar
                }
            }
        },
        computed:{
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    let url = '/userc/logout';
                    let obj = this;
                    this.$fetch.post(url).then(function(response) {
                        let res = response.data;
                        if(res.status) {
                            obj.$utils.setCookie('isLogin', 0);
                            obj.$utils.setCookie('user_info', '');
                            obj.$router.push('/login');
                        }
                    }).catch(function(response) {
                        //do something
                    });
                } else if(command == 'update-info') {
                    alert('点击了修改个人资料');
                }
            },
            //跳转到首页
            goHome() {
                this.$router.push({ path: '/home' });
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
