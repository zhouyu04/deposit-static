<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>

                    <el-input placeholder="请输入关键字进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="fetchData"
                              style="width: 350px;margin-right: 10px" v-model="searchValue.skey"
                              @keydown.enter.native="fetchData"></el-input>

                    是否可用:
                    <el-select v-model="searchValue.isActive" placeholder="是否可用" size="mini"
                               style="width: 130px;margin-right: 10px">
                        <el-option
                                v-for="item in isActive"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>

                    <el-button icon="el-icon-search" type="primary" @click="fetchData">
                        搜索
                    </el-button>

                </div>
                <div>

                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
                        添加科目
                    </el-button>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="subs"
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column prop="subjectCode" fixed align="left" label="科目代码" width="90">
                </el-table-column>
                <el-table-column prop="subjectName" label="科目名称" align="left" width="85">
                </el-table-column>
                <el-table-column prop="isActive" label="状态" align="left" width="85" :formatter="changeActiveProp">
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="80%">
            <div>
                <el-form :model="sub" :rules="rules" ref="subForm">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="科目编码:" prop="subjectCode">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="sub.subjectCode"
                                          placeholder="请输入科目编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="科目名称:" prop="subjectName">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="sub.subjectName"
                                          placeholder="请输入科目名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddSub">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name:"DepositDetail",
        data() {
            return {
                searchValue: {
                    page: 1,
                    size: 10,
                    skey: '',
                    isActive: [{'id': 0, 'name': '全部'}, {'id': 1, 'name': '可用'}, {'id': 2, 'name': '不可用'}],
                },
                title: '',
                subs: [],
                total: 0,
                page: 1,
                size: 10,
                loading: false,
                hasActive: 1,
                isActive: [{'id': 0, 'name': '全部'}, {'id': 1, 'name': '可用'}, {'id': 2, 'name': '不可用'}],
                dialogVisible: false,
                sub: {
                    subjectCode: '',
                    subjectName: '',
                    isActive: [{'id': 0, 'name': '全部'}, {'id': 1, 'name': '可用'}, {'id': 2, 'name': '不可用'}],
                },
                rules: {
                    subjectCode: [{required: true, message: '请输入科目代码', trigger: 'blur'}],
                    subjectName: [{required: true, message: '请输入科目名称', trigger: 'blur'}],
                }
            }
        },
        created() {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        // watch: {
        //     // 如果路由有变化，会再次执行该方法
        //     '$route': 'fetchData'
        // },
        methods: {
            fetchData() {
                let url = '/deposit/sub/list';
                let searchValue = this.searchValue;

                this.$axios.post(url, searchValue)
                    .then(resp => {
                        if (resp) {
                            this.subs = resp.data;
                            this.total = resp.total;
                        }
                    })
                    .catch(function (response) {
                        console.log(response)
                    })
            },

            sizeChange(currentSize) {
                console.log("改变分页：" + currentSize);
                this.searchValue.size = currentSize;
                this.fetchData();
            },
            currentChange(currentPage) {
                console.log("改变当前页：" + currentPage);
                this.searchValue.page = currentPage;
                this.fetchData();
            },

            showAddEmpView() {
                this.emptySub();
                this.title = '添加科目';
                this.dialogVisible = true;
            },

            emptySub() {
                this.sub = {
                    subjectCode: '',
                    subjectName: '',
                    isActive: '',
                };
            },

            doAddSub() {
                this.$refs['subForm'].validate(valid => {
                    if (valid) {
                        console.log(this.sub)
                        this.postRequest("/deposit/sub/add", this.sub).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                                this.fetchData();
                            }
                        })
                    }
                });
            },

            changeActiveProp(row, column) {
                const prop = row[column.property];

                let string = null;
                if (prop == 1) {
                    string = "生效";
                } else {
                    string = "未生效";
                }
                return string;
            }
        }
    }
</script>

<!--<style>-->
<!--    /* 可以设置不同的进入和离开动画 */-->
<!--    /* 设置持续时间和动画函数 */-->
<!--    .slide-fade-enter-active {-->
<!--        transition: all .8s ease;-->
<!--    }-->

<!--    .slide-fade-leave-active {-->
<!--        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);-->
<!--    }-->

<!--    .slide-fade-enter, .slide-fade-leave-to-->
<!--        /* .slide-fade-leave-active for below version 2.1.8 */-->
<!--    {-->
<!--        transform: translateX(10px);-->
<!--        opacity: 0;-->
<!--    }-->
<!--</style>-->
