<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 基础设置</el-breadcrumb-item>
                <el-breadcrumb-item to="/menu-index" ><i class="el-icon-menu"></i> 菜单管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row>
            <br><br>
            <el-col :span="12" :offset="6">
                <div>
                    <el-form :model="menuData" :rules="rules" ref="menuForm" label-width="100px">
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model="menuData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="所属上级" prop="pid">
                            <el-select v-model="menuData.parent_id" placeholder="请选择菜单所属上级">
                                <el-option
                                    v-for="item in rootMenu"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="路由标识" prop="node">
                            <el-input v-model="menuData.node" placeholder="请填写点击跳转页面的路由标识"></el-input>
                        </el-form-item>
                        <el-form-item label="排序权重" prop="rank" 
                            :rules="[{ required: true, message: '权重不能为空'}, { type: 'number', message: '排序权重必须为数字', trigger: 'blur' }]">
                            <el-input v-model.number="menuData.rank" placeholder="请输入排序权重（数值越大排序越靠前）"></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用" prop="status">
                            <el-switch on-text="启用" off-text="禁用" on-value="1" off-value="0" v-model="menuData.status"></el-switch>
                        </el-form-item>
                        <el-form-item label="菜单权限">
                            <el-transfer
                                v-model="menuData.srole._ids"
                                :props="{ key: 'id', label: 'name' }"
                                :data="picker.allData"
                                :titles="picker.title">
                            </el-transfer>
                        </el-form-item>
                        <el-form-item label="备注说明" prop="remark">
                            <el-input type="textarea" v-model="menuData.remark"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submit('menuForm')">立即创建</el-button>
                            <el-button @click="resetForm('menuForm')">重置</el-button>
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
            if(path == '/menu-add') {
                this.pageTitle = '添加菜单';
            } else if(path == '/menu-edit') {
                this.pageTitle = '编辑菜单';
            }

            let menu_id = this.$route.query.menu_id;
            let postData = menu_id ? { id: menu_id } : {};
            let url = this.initUrl;
            this.$fetch.post(url, postData).then(function(response) {
                let res = response.data;
                if(res.status) {
                    let data = res.data;
                    let menu = data.menu;
                    let roles_selected = []; //被选中的权限
                    if(menu) {
                        menu.status = menu.status.toString();
                        menu.srole.forEach(function(e) {
                            roles_selected.push(e.id);
                        });
                        menu.srole = { _ids: roles_selected };
                        delete menu.create_time;
                        delete menu.update_time;
                        self.menuData = menu;
                    }

                    self.picker.allData = data.roles;
                    self.rootMenu = self.rootMenu.concat(data.rootMenus);
                }
            }).catch(function(response) {
                //do something
            });
        },
        data() {
            return {
                pageTitle: '',
                initUrl: '/menu/saveIndex',
                postUrl: '/menu/save',
                menuData: {
                    name: '',
                    parent_id: 0,
                    class: '',
                    node: '',
                    rank: 0,
                    status: '1',
                    srole: {
                        _ids: []
                    },
                    remark: ''
                },
                picker: {
                    title: ['待选角色', '已选中角色'],
                    allData: []
                },
                rootMenu: [
                    { id: 0, name: '根级菜单' }
                ],
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
                let formData = this.menuData;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$fetch.post(url, formData).then(function(response) {
                            let res = response.data;
                            if(res.status) {
                                self.$router.push({ path: '/menu-index' });
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