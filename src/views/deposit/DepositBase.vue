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


                    <el-button icon="el-icon-search" type="primary" @click="fetchData">
                        搜索
                    </el-button>

                </div>
                <div>

                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
                        添加保证金
                    </el-button>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="deposits"
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
                <el-table-column prop="id" v-if="show" fixed align="left" label="id"/>
                <el-table-column prop="subjectName" label="科目名称" align="left" width="85"/>
                <el-table-column prop="proof" label="凭证" align="left" width="85"/>
                <el-table-column prop="reference" label="参考信息" align="left" width="85"/>
                <el-table-column prop="project" label="摘要" align="left" width="85"/>
                <el-table-column prop="projectCode" label="项目code" align="left" width="85"/>
                <el-table-column prop="businessNo" label="业务编号" align="left" width="85"/>
                <el-table-column prop="settlementType" label="结算方式" align="left" width="85"/>
                <el-table-column prop="settlement" label="结算号" align="left" width="85"/>
                <el-table-column prop="targetSub" label="对方科目" align="left" width="85"/>
                <el-table-column prop="sysModule" label="系统模块" align="left" width="85"/>
                <el-table-column prop="describe" label="描述" align="left" width="85"/>
                <el-table-column prop="debitMoney" label="借方金额" align="left" width="85"/>
                <el-table-column prop="creditMoney" label="贷方金额" align="left" width="85"/>
                <el-table-column prop="direction" label="方向" align="left" width="85" :formatter="dicFormatter"/>
                <el-table-column prop="balance" label="余额" align="left" width="85"/>
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
        <!--        <el-dialog-->
        <!--                :title="title"-->
        <!--                :visible.sync="dialogVisible"-->
        <!--                width="80%">-->
        <!--            <div>-->
        <!--                <el-form :model="sub" :rules="rules" ref="subForm">-->
        <!--                    <el-row>-->
        <!--                        <el-col :span="6">-->
        <!--                            <el-form-item label="科目编码:" prop="subjectCode">-->
        <!--                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"-->
        <!--                                          v-model="sub.subjectCode"-->
        <!--                                          placeholder="请输入科目编码"></el-input>-->
        <!--                            </el-form-item>-->
        <!--                        </el-col>-->
        <!--                        <el-col :span="6">-->
        <!--                            <el-form-item label="科目名称:" prop="subjectName">-->
        <!--                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"-->
        <!--                                          v-model="sub.subjectName"-->
        <!--                                          placeholder="请输入科目名称"></el-input>-->
        <!--                            </el-form-item>-->
        <!--                        </el-col>-->
        <!--                    </el-row>-->
        <!--                </el-form>-->
        <!--            </div>-->
        <!--            <span slot="footer" class="dialog-footer">-->
        <!--            <el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--            <el-button type="primary" @click="doAddSub">确 定</el-button>-->
        <!--          </span>-->
        <!--        </el-dialog>-->
    </div>
</template>

<script>

    export default {
        data() {
            return {
                searchValue: {},
                show: false,
                loading: false,
                id: '',
                subjectName: '',
                proof: '',
                reference: '',
                project: '',
                projectCode: '',
                businessNo: '',
                settlementType: '',
                settlement: '',
                targetSub: '',
                sysModule: '',
                describe: '',
                debitMoney: '',
                creditMoney: '',
                direction: '',
                balance: '',
                deposits: [],
                total: 0,
                page: 1,
                size: 10,
            }
        },
        created() {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        methods: {
            fetchData() {
                let url = '/deposit/base/list';
                let searchValue = this.searchValue;

                this.$axios.post(url, searchValue)
                    .then(resp => {
                        if (resp) {
                            this.deposits = resp.data;
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
                this.$router.push('/deposit/detail')
            },
            dicFormatter(row, column) {
                switch (row.direction) {
                    case 1:
                        return '借';
                        break;
                    case 2 :
                        return '贷';
                        break;
                }
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
