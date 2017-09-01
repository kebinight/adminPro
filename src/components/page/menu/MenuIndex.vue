<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 基础设置</el-breadcrumb-item>
                <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-tooltip class="item" effect="dark" content="管理某角色可展示的菜单，与权限没有关系" placement="bottom">
                <el-button>帮助</el-button>
            </el-tooltip>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="success" icon="plus" class="handle-add mr10" @click="add">添加</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" ref="menuTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="菜单名称" width="150">
            </el-table-column>
            <el-table-column prop="node" label="路由标志" width="160">
            </el-table-column>
            <el-table-column prop="class" label="样式" width="100">
            </el-table-column>
            <el-table-column prop="rank" label="排序权重" width="100">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
            </el-table-column>
            <el-table-column
                label="对应角色"
                width="200">
                <template scope="scope">
                    <el-tag
                        v-for="role in scope.row.srole"
                        type="primary">
                    {{role.name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="admin.name" label="操作员" width="120">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="150">
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="150">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"
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
                dataUrl: '/menu/index',
                deleteUrl: '/menu/delete',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false
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
                        self.tableData = data.menu;
                    }
                }).catch(function(response) {
                });
            },
            add() {
                this.$router.push({ path: '/menu-add' });
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
                this.$router.push({ path: '/menu-edit', query: { menu_id: id }});
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
                            let pid = item.id;
                            let newTableData = [];
                            for (let index in self.tableData) {
                                if(self.tableData[index].id != pid && self.tableData[index].parent_id != pid) {
                                    newTableData.push(self.tableData[index]);
                                }
                            }
                            self.tableData = newTableData;
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
            formatStatus(row, column, cellValue) {
               switch(parseInt(row.status   )) {
                    case 1:
                        return '启用';
                    case 0:
                        return '禁用';
                }
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