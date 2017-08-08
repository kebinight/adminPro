<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item to="/limit-index" ><i class="el-icon-menu"></i> 权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row>
            <br><br>
            <el-col :span="12" :offset="6">
                <div>
                    <el-form :model="limitData" :rules="rules" ref="limitForm" label-width="120px">
                        <el-form-item label="权限名称" prop="name">
                            <el-input v-model="limitData.name" placeholder="请输入权限名称"></el-input>
                        </el-form-item>
                        <el-form-item label="对应controller" prop="node">
                            <el-input v-model="limitData.node" placeholder="填写对应controller名称"></el-input>
                        </el-form-item>
                        <el-form-item label="排序权重" prop="rank" 
                            :rules="[{ required: true, message: '权重不能为空'}, { type: 'number', message: '排序权重必须为数字', trigger: 'blur' }]">
                            <el-input v-model.number="limitData.rank" placeholder="请输入排序权重（数值越大排序越靠前）"></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用" prop="status">
                            <el-switch on-text="启用" off-text="禁用" on-value="1" off-value="0" v-model="limitData.status"></el-switch>
                        </el-form-item>
                        <el-form-item label="备注说明" prop="remark">
                            <el-input type="textarea" v-model="limitData.remark"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submit('limitForm')">立即创建</el-button>
                            <el-button @click="resetForm('limitForm')">重置</el-button>
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
            if(path == '/limit-add') {
                this.pageTitle = '添加权限';
            } else if(path == '/limit-eidt') {
                this.pageTitle = '编辑权限';
            }
        },
        data() {
            return {
                pageTitle: '',
                postUrl: '/slimit/save',
                limitData: {
                    name: '',
                    pid: 0,
                    class: '',
                    node: '',
                    rank: 0,
                    status: '1',
                    remark: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入权限名称', trigger: 'blur' }
                    ],
                    node: [
                        { required: true, message: '请输入controller名称', trigger: 'blur' }      
                    ]
                }
            };
        },
        methods: {
            submit(formName) {
                let url = this.postUrl;
                let formData = this.limitData;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$fetch.post(url, formData).then(function(response) {
                            let res = response.data;
                            if(res.status) {
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
            }
        }
    }
</script>

<style scoped>

</style>