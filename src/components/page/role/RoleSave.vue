<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统设置</el-breadcrumb-item>
                <el-breadcrumb-item to="/role-index" ><i class="el-icon-menu"></i> 角色管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row>
            <br><br>
            <el-col :span="12" :offset="6">
                <div>
                    <el-form :model="formData" :rules="rules" ref="roleForm" label-width="100px">
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="排序权重" prop="rank" 
                            :rules="[{ required: true, message: '权重不能为空'}, { type: 'number', message: '排序权重必须为数字', trigger: 'blur' }]">
                            <el-input v-model.number="formData.rank" placeholder="请输入排序权重（数值越大排序越靠前）"></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用" prop="status">
                            <el-switch on-text="启用" off-text="禁用" on-value="1" off-value="0" v-model="formData.status"></el-switch>
                        </el-form-item>
                        <el-form-item label="角色权限">
                            <el-transfer
                                v-model="formData.slimit._ids"
                                :props="{ key: 'id', label: 'name' }"
                                :data="picker.allData"
                                :titles="picker.title">
                            </el-transfer>
                        </el-form-item>
                        <el-form-item label="备注说明" prop="remark">
                            <el-input type="textarea" v-model="formData.remark"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submit('roleForm')">提交</el-button>
                            <el-button @click="resetForm('roleForm')">重置</el-button>
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
            if(path == '/role-add') {
                this.pageTitle = '添加角色';
            } else if(path == '/role-edit') {
                this.pageTitle = '编辑角色';
                let role_id = this.$route.query.role_id;
                let url = this.initUrl;
                this.$fetch.post(url, { 
                    id: role_id
                }).then(function(response) {
                    let res = response.data;
                    if(res.status) {
                        let data = res.data;
                        let role = data.role;
                        let limits = data.limits;
                        let limit_selected = [];
                        role.slimit = limits;
                        role.status = role.status.toString();
                        role.slimit.forEach(function(e) {
                            limit_selected.push(e.id);
                        });
                        role.slimit = { _ids: limit_selected };

                        self.formData = role;
                        self.picker.allData = limits;
                    }
                }).catch(function(response) {
                    //do something
                });
            }
        },
        data() {
            return {
                pageTitle: '',
                postUrl: '/role/save',
                initUrl: '/role/editIndex',
                formData: {
                    name: '',
                    rank: 0,
                    status: '1',
                    slimit: {
                        _ids: []
                    },
                    remark: ''
                },
                picker: {
                    title: ['待选择的权限', '已拥有的权限'],
                    allData: []
                },
                rules: {
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                    ],
                    node: [
                        { required: true, message: '请输入路由标识', trigger: 'blur' }      
                    ]
                }
            };
        },
        methods: {
            submit(formName) {
                let url = this.postUrl;
                let formData = this.formData;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$fetch.post(url, formData).then(function(response) {
                            let res = response.data;
                            if(res.status) {
                                self.$router.push({ path: '/role-index' });
                            }
                        }).catch(function(response) {
                            //do something
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>