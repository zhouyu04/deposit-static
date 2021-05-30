<template>
    <div style="">
        <el-form ref="depositForm" :rules="rules" :model="deposit" label-width="80px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="科目名称" prop="subId">
                        <el-select style="width: 200px" v-model="deposit.subId" :filterable="false" filterable
                                   placeholder="请选择">
                            <el-option
                                    v-for="item in subs"
                                    :key="item.subjectCode"
                                    :label="item.subjectName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="摘要:" prop="project">
                        <el-input size="medium" style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.project" @blur=""
                                  placeholder="请输入摘要"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="摘要编码:">
                        <el-input size="medium" style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.projectCode"
                                  placeholder="请输入科目编码"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="业务日期:">
                        <el-date-picker style="width: 200px"
                                        v-model="deposit.empDate"
                                        type="date"
                                        placeholder="请输入业务日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6">
                    <el-form-item label="凭证字号:">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.proof"
                                  placeholder="请输入凭证字号"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="参考信息:">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.reference"
                                  placeholder="请输入参考信息"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="结算方式:">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.settlementType"
                                  placeholder="请输入结算方式"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="结算号:">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.settlement"
                                  placeholder="请输入结算号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6">
                    <el-form-item label="借方金额:">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.debitMoney" type="number"
                                  placeholder="请输入借方金额"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="贷方金额:">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.creditMoney" type="number"
                                  placeholder="请输入贷方金额"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="方向:">
                        <el-select style="width: 200px" v-model="deposit.direction" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in dire"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="余额:">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.balance" type="number"
                                  placeholder="请输入余额"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer" style="text-align: center">
            <el-button @click="cancelDeposit">取 消</el-button>
            <el-button type="primary" @click="doAddDeposit">确 定</el-button>
        </span>
    </div>
</template>

<script>

    export default {
        name: "DepositDetail",
        data() {
            return {
                searchValue: {
                    page: 1,
                    size: 10,
                    skey: '',
                },
                subjectId: '',
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
                    subId: [{required: true, message: '请选择科目代码', trigger: 'blur'}],
                    project: [{required: true, message: '请输入摘要', trigger: 'blur'}],
                },
                dire: [{'id': 1, 'value': '借'}, {'id': 2, 'value': '贷'}],
                deposit: {
                    subId: '',
                    project: '',
                    projectCode: '',
                    empDate: '',
                    proof: '',
                    reference: '',
                    settlementType: '',
                    settlement: '',
                    debitMoney: '',
                    creditMoney: '',
                    direction: '',
                    balance: '',
                }
            }
        },
        created() {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.initSubject()
        },
        // watch: {
        //     // 如果路由有变化，会再次执行该方法
        //     '$route': 'fetchData'
        // },
        methods: {
            initSubject() {
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

            emptySub() {
                this.sub = {
                    subjectCode: '',
                    subjectName: '',
                    isActive: '',
                };
            },

            doAddDeposit() {
                this.$refs['depositForm'].validate(valid => {
                    if (valid) {
                        console.log(this.deposit);
                        this.postRequest("/deposit/base/add", this.sub).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                                this.$router.push('/deposit/base')
                            }
                        })
                    }
                });
            },

            cancelDeposit() {
                this.$router.push('/deposit/base')
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
            },

            onInputBlur() {
                let self = this;
                console.log("失去焦点：" + self)
            },
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
