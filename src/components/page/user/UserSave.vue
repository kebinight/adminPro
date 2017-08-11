<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统设置</el-breadcrumb-item>
                <el-breadcrumb-item to="/user-index" ><i class="el-icon-menu"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row>
            <br><br>
            <el-col :span="12" :offset="6">
                <div>
                    <el-form :model="userData" :rules="rules" ref="userForm" label-width="100px">
                        <el-form-item label="昵称" prop="nick">
                            <el-input v-model="userData.nick"></el-input>
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <el-input v-model="userData.avatar"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名" prop="truename">
                            <el-input v-model="userData.truename"></el-input>
                        </el-form-item>
                        <el-form-item label="账号" prop="account">
                            <el-input v-model="userData.account"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="userData.password"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-radio class="radio" v-model="userData.gender" label="1">男</el-radio>
                            <el-radio class="radio" v-model="userData.gender" label="2">女</el-radio>
                        </el-form-item>
                        <el-form-item label="是否启用" prop="status">
                            <el-switch on-text="启用" off-text="禁用" on-value="1" off-value="0" v-model="userData.status"></el-switch>
                        </el-form-item>
                        <el-form-item label="用户角色">
                            <el-transfer
                                v-model="userData.srole._ids"
                                :props="{ key: 'id', label: 'name' }"
                                :data="picker.allData"
                                :titles="picker.title">
                            </el-transfer>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submit('userForm')">提交</el-button>
                            <el-button @click="resetForm('userForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    var util = require('util'); 
    export default {
        created() {
            let path = this.$route.path;
            let self = this;
            if(path == '/user-add') {
                this.pageTitle = '添加用户';
            } else if(path == '/user-edit') {
                this.pageTitle = '编辑用户';
            }

            let user_id = this.$route.query.user_id;
            let postData = user_id ? { id: user_id } : {};
            let url = this.initUrl;
            this.$fetch.post(url, postData).then(function(response) {
                let res = response.data;
                if(res.status) {
                    let data = res.data;
                    let user = data.user;
                    let roles = data.roles;
                    let roles_selected = []; //被选中的权限
                    if(user) {
                        user.status = user.status.toString();
                        user.gender = user.gender.toString();
                        user.srole.forEach(function(e) {
                            roles_selected.push(e.id);
                        });
                        user.srole = { _ids: roles_selected };
                        delete user.create_time;
                        delete user.update_time;
                        
                        self.userData = user;
                    }
                    self.picker.allData = roles;
                }
            }).catch(function(response) {
                //do something
            });
        },
        data() {
            return {
                pageTitle: '',
                initUrl: '/user/saveIndex',
                postUrl: '/user/save',
                userData: {
                    account: '',
                    password: '',
                    avatar: '',
                    nick: '',
                    truename: '',
                    gender: '1',
                    status: '1',
                    srole: {
                        _ids: []
                    }
                },
                picker: {
                    title: ['待选角色', '已选中角色'],
                    allData: []
                },
                rules: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ], 
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submit(formName) {
                let url = this.postUrl;
                let self = this;
                let formData = this.userData;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$fetch.post(url, formData).then(function(response) {
                            let res = response.data;
                            if(res.status) {
                                self.$router.push({ path: '/user-index' });
                            }
                        }).catch(function(response) {
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            onSelectGenderChange(gender) {
                console.log(gender);
            }
        }
    }
</script>

<style scoped>

</style>