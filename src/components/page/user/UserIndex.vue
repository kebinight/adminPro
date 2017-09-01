<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>账号管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-tooltip class="item" effect="dark" content="设置管理员信息，包括管理员所属角色，角色可以多选" placement="bottom">
                <el-button>帮助</el-button>
            </el-tooltip>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button v-if="checkLimits('save')" type="success" icon="plus" class="handle-add mr10" @click="add">添加</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" ref="menuTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="nick" label="用户名称" width="150">
            </el-table-column>
            <el-table-column prop="truename" label="真实姓名" width="150">
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="100" :formatter="formatGender">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
            </el-table-column>
            <el-table-column
                label="对应角色"
                width="200">
                <template scope="scope">
                    <div v-if="scope.row.is_super">
                        <el-tag type="primary">
                            系统超级管理员
                        </el-tag>
                    </div>
                    <div v-else>
                        <el-tag
                            v-for="role in scope.row.srole"
                            type="primary">
                            {{role.name}}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="150">
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="150">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" v-if="checkLimits('save')"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" v-if="checkLimits('delete')"
                            @click="handleDeleteOne(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataUrl: '/user/index',
                deleteUrl: '/user/delete',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                user_limits: []      //权限管理
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                    /*let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if(d.name === self.del_list[i].name){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.address.indexOf(self.select_cate) > -1 && 
                            (d.name.indexOf(self.select_word) > -1 ||
                            d.address.indexOf(self.select_word) > -1)
                        ){
                            return d;
                        }
                    }*/
                    return d;
                })
            }
        },
        methods: {
            handleCurrentChange(val){
                //this.cur_page = val;
                //this.getData();
            },
            getData(){
                let self = this;
                let url = this.dataUrl;
                this.$fetch.post(url, {
                    page: '1'
                }).then(function(response) {
                    let res = response.data;
                    if(res.status) {
                        let data = res.data;
                        self.tableData = data.users;
                        self.user_limits = data.user_limits;
                    }
                }).catch(function(response) {
                });
            },
            add() {
                this.$router.push({ path: '/user-add' });
            },
            search(){
                //this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                let id = row.id;
                this.$router.push({ path: '/user-edit', query: { user_id: id }});
            },
            handleDeleteOne(item) {
                let self = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = self.deleteUrl;
                    let postData = { id: item.id };
                    self.$fetch.post(url, postData).then(function(response) {
                        let res = response.data;
                        if(res.status) {
                            self.tableData.splice(self.tableData.indexOf(item), 1);
                        }
                    }).catch(function(response) {
                    });
                }).catch(() => {
                    //do something
                });
            },
            handleSelectionChange(val) {
                //this.multipleSelection = val;
            },
            formatGender(row, column, cellValue) {
                switch(parseInt(row.gender)) {
                    case 1:
                        return '男';
                    case 2:
                        return '女';
                }
            },
            formatStatus(row, column, cellValue) {
               switch(parseInt(row.status   )) {
                    case 1:
                        return '启用';
                    case 0:
                        return '禁用';
                }
            },
            //检查是否有权限
            checkLimits(action_name) {
                let has = false;
                (this.user_limits).forEach(function(e) {
                    if(e == action_name) {
                        has =  true;
                    }
                });
                return has;
            }
        }
    }
</script>

<style scoped>
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
</style>