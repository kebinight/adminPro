<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input placeholder="输入关键字进行筛选" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="success" icon="plus" class="handle-add mr10" @click="add">添加</el-button>
            <el-button type="danger" icon="delete" class="handle-del mr10" @click="">批量删除</el-button>
        </div>
        <el-table
            :data="limitData"
            style="width: 100%">
            <el-table-column
                prop="name"
                label="权限名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="node"
                label="权限标识"
                width="120">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="80">
            </el-table-column>
            <el-table-column
                prop="create_time"  
                label="创建时间"
                width="150">
            </el-table-column>
            <el-table-column
                prop="update_time"
                label="更新时间"
                width="150">
            </el-table-column>
            <el-table-column
                label="权限动作"
                width="380">
                <template scope="scope">
                    <el-tag
                        v-for="action in scope.row.children"
                        type="primary"
                        :closable="true"
                        :close-transition="false"
                        @close="handleCloseTag(scope.row, action)">
                    {{action.name}}
                    </el-tag>
                    <el-button size="small" @click="showAddTag(scope.row)">+添加动作</el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template scope="scope">
                    <el-button
                        size="small"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加权限动作" :visible.sync="dialogFormVisible" size="tiny">
            <el-form :model="actionItem" ref="limitForm" :rules="rules">
                <el-form-item label="动作名称" label-width="120px" prop="name">
                    <el-input v-model="actionItem.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应action名称" label-width="120px" prop="node">
                    <el-input v-model="actionItem.node" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序权重" label-width="120px"  prop="rank"
                    :rules="[{ required: true, message: '权重不能为空'}, { type: 'number', message: '排序权重必须为数字', trigger: 'blur' }]">
                    <el-input v-model.number="actionItem.rank" placeholder="请输入排序权重（数值越大排序越靠前）"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" label-width="120px" prop="status">
                    <el-switch on-text="启用" off-text="禁用" on-value="1" off-value="0" v-model="actionItem.status"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitActionPost('limitForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataUrl: '/slimit/index',
                addActionUrl: '/slimit/save',
                limitData: [],
                dialogFormVisible: false,
                curentOpeLimitIndex: null,  //当前正在操作的权限项
                actionItem: {
                    name: '',
                    parent_id: '',
                    node: '',
                    rank: 0,
                    status: 1,
                    remark: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入动作名称', trigger: 'blur' }
                    ],
                    node: [
                        { required: true, message: '请输入action', trigger: 'blur' }      
                    ]
                }
            }
        },
        created(){
            this.getData();
        },
        methods: {
            getData(){
                let self = this;
                let url = this.dataUrl;
                this.$fetch.post(url, {

                }).then(function(response) {
                    let res = response.data;
                    if(res.status) {
                        let data = res.data;
                        self.limitData = data.limits;
                    }
                }).catch(function(response) {
                    //do something
                });
            },
            handleCloseTag(limit, action) {
                this.$confirm('确定删除该动作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    limit.children.splice(limit.children.indexOf(action), 1);
                }).catch(() => {
                    //do something
                });
            },
            showAddTag(limit) {
                this.dialogFormVisible = true;
                this.curentOpeLimitIndex = this.limitData.indexOf(limit);
            },
            submitActionPost(formName) {
                let self = this;
                let formData = this.actionItem;
                if(self.curentOpeLimitIndex === null) return;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = self.addActionUrl;
                        formData.parent_id = self.limitData[this.curentOpeLimitIndex].id;
                        this.$fetch.post(url, formData).then(function(response) {
                            let res = response.data;
                            if(res.status) {
                                self.dialogFormVisible = false;
                                console.log(self.limitData[self.curentOpeLimitIndex].children);
                                console.log(res.data.action);
                                self.limitData[self.curentOpeLimitIndex].children.push(res.data.action);
                                console.log(self.limitData[self.curentOpeLimitIndex].children);
                            }
                        }).catch(function(response) {
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            add() {
                this.$router.push({ path: '/limit-add' });
            },
            search() {

            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        }
    }
</script>

<style>
.handle-box{
    margin-bottom: 20px;
}

.handle-select{
    width: 120px;
}

.handle-input{
    width: 300px;
    display: inline-block;
}

.el-table .info-row {
background: #c9e5f5;
}

.el-table .positive-row {
background: #e2f0e4;
}
</style>