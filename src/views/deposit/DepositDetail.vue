<template>
    <div style="">
        <el-form ref="depositForm" :rules="rules" :model="deposit" label-width="80px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="科目名称" prop="subId" v-if="this.$route.query.appointmentId ==null">
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
                    <el-form-item v-if="this.$route.query.appointmentId !=null" label="科目名称" prop="subId">
                        <el-select style="width: 200px" v-model="deposit.subId" :filterable="false" filterable
                                   placeholder="请选择" disabled="disabled">
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
                        <el-autocomplete class="inline-input" size="medium" style="width: 200px"
                                         prefix-icon="el-icon-edit"
                                         v-model="deposit.project" :fetch-suggestions="queryProject"
                                         placeholder="请输入摘要" @select="handleSelect"></el-autocomplete>
                    </el-form-item>
                </el-col>

                <el-col :span="6" v-if="this.$route.query.appointmentId ==null">
                    <el-form-item label="摘要编码:">
                        <el-input size="medium" style="width: 200px" prefix-icon="el-icon-edit"
                                  disabled="disabled" placeholder="系统自动生成"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6" v-if="this.$route.query.appointmentId !=null">
                    <!--                    <el-form-item label="关联摘要:" prop="releateProjectId">-->
                    <!--                        <el-autocomplete class="inline-input" size="medium" style="width: 200px"-->
                    <!--                                         prefix-icon="el-icon-edit"-->
                    <!--                                         v-model="deposit.releateProject" :fetch-suggestions="queryProject"-->
                    <!--                                         placeholder="请输入摘要" @select="handleSelectReleated"></el-autocomplete>-->
                    <!--                    </el-form-item>-->

                    <el-form-item label="关联摘要" prop="releateProjectId">
                        <el-select style="width: 200px" v-model="deposit.releateProject" multiple
                                   filterable
                                   remote
                                   reserve-keyword
                                   :remote-method="remoteMethod"
                                   placeholder="请选择">
                            <el-option v-for="pro in deposit.pros"
                                       :key="pro.code"
                                       :label="pro.name"
                                       :value="pro.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="业务日期:" v-if="this.$route.query.appointmentId ==null">
                        <el-date-picker style="width: 200px"
                                        v-model="deposit.empDate"
                                        type="date"
                                        value-format="yyyy-MM-dd">
                                        placeholder="请输入业务日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="业务日期:" v-if="this.$route.query.appointmentId !=null">
                        <el-date-picker style="width: 200px" disabled="disabled"
                                        v-model="deposit.empDate"
                                        type="date"
                                        placeholder="请输入业务日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6">
                    <el-form-item label="凭证字号:" v-if="this.$route.query.appointmentId ==null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.proof"
                                  placeholder="请输入凭证字号"></el-input>
                    </el-form-item>

                    <el-form-item label="凭证字号:" v-if="this.$route.query.appointmentId !=null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit" disabled="disabled"
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
                    <el-form-item label="结算方式:" v-if="this.$route.query.appointmentId ==null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.settlementType"
                                  placeholder="请输入结算方式"></el-input>
                    </el-form-item>

                    <el-form-item label="结算方式:" v-if="this.$route.query.appointmentId !=null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit" disabled="disabled"
                                  v-model="deposit.settlementType"
                                  placeholder="请输入结算方式"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="结算号:" v-if="this.$route.query.appointmentId ==null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.settlement"
                                  placeholder="请输入结算号"></el-input>
                    </el-form-item>
                    <el-form-item label="结算号:" v-if="this.$route.query.appointmentId !=null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit" disabled="disabled"
                                  v-model="deposit.settlement"
                                  placeholder="请输入结算号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6">
                    <el-form-item label="金额:" v-if="this.$route.query.appointmentId ==null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.money" type="number"
                                  placeholder="请输入借方金额"></el-input>
                    </el-form-item>

                    <el-form-item label="金额:" v-if="this.$route.query.appointmentId !=null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit" disabled="disabled"
                                  v-model="deposit.money" type="number"
                                  placeholder="请输入借方金额"></el-input>
                    </el-form-item>
                </el-col>

<!--                <el-col :span="6">-->
<!--                    <el-form-item label="贷方金额:" v-if="this.$route.query.appointmentId ==null">-->
<!--                        <el-input style="width: 200px" prefix-icon="el-icon-edit"-->
<!--                                  v-model="deposit.creditMoney" type="number"-->
<!--                                  placeholder="请输入贷方金额"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="贷方金额:" v-if="this.$route.query.appointmentId !=null">-->
<!--                        <el-input style="width: 200px" prefix-icon="el-icon-edit" disabled="disabled"-->
<!--                                  v-model="deposit.creditMoney" type="number"-->
<!--                                  placeholder="请输入贷方金额"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->

                <el-col :span="6">
                    <el-form-item label="方向:" v-if="this.$route.query.appointmentId ==null">
                        <el-select style="width: 200px" v-model="deposit.direction" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in dire"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="方向:" v-if="this.$route.query.appointmentId !=null">
                        <el-select style="width: 200px" v-model="deposit.direction" filterable placeholder="请选择"
                                   disabled="disabled">
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
                    <el-form-item label="余额:" v-if="this.$route.query.appointmentId ==null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit"
                                  v-model="deposit.balance" type="number"
                                  placeholder="请输入余额"></el-input>
                    </el-form-item>

                    <el-form-item label="余额:" v-if="this.$route.query.appointmentId !=null">
                        <el-input style="width: 200px" prefix-icon="el-icon-edit" disabled="disabled"
                                  v-model="deposit.balance" type="number"
                                  placeholder="请输入余额"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="是否统计" prop="isCount">
                        <el-radio v-model="deposit.isCount" border="border" @click.native.prevent="type_change()" :label="1">开启</el-radio>
                    </el-form-item>
                </el-col>

            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer" style="text-align: center">
            <el-button @click="cancelDeposit">取 消</el-button>
            <el-button type="primary" v-if="this.$route.query.appointmentId ==null"
                       @click="doAddDeposit">新 增</el-button>
            <el-button type="primary" v-if="this.$route.query.appointmentId !=null"
                       @click="doEditDeposit">修 改</el-button>
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
                    projectId: '',
                    project: '',
                    releateProject: [],
                    releateProjectId: '',
                    projectCode: '',
                    empDate: '',
                    proof: '',
                    reference: '',
                    settlementType: '',
                    settlement: '',
                    money: '',
                    direction: '',
                    balance: '',
                    pros: [],
                    isCount: '',
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
                    });


                let appointmentId = this.$route.query.appointmentId;
                if (appointmentId != null && appointmentId != '') {
                    let url = '/deposit/base/detail?id=' + appointmentId;

                    this.$axios.get(url)
                        .then(resp => {
                            if (resp) {
                                this.deposit = resp.obj;

                                var arr = resp.obj.pros;
                                var ps = new Array(arr.length+1);
                                for (var i = 0;i<arr.length;i++){
                                    ps.push(arr[i].id);
                                }
                                this.deposit.releateProject= arr;

                            }
                        })
                        .catch(function (response) {
                            console.log(response)
                        })
                }
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
                        this.postRequest("/deposit/base/add", this.deposit).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                                this.$router.push('/deposit/base')
                            }
                        })
                    }
                });
            },
            doEditDeposit() {
                console.log(this.deposit);
                this.$refs['depositForm'].validate(valid => {
                    if (valid) {
                        this.postRequest("/deposit/base/edit", this.deposit).then(resp => {
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
                if (prop == 1) {
                    string = "生效";
                } else {
                    string = "未生效";
                }
                return string;
            },
            queryProject(queryString, callback) {

                let params = {"key": queryString};
                this.postRequest('/deposit/pro/list', params)
                    .then(resp => {
                        if (resp) {
                            for (let i of resp.data) {
                                i.value = i.name;
                            }
                            let dataList = resp.data;
                            callback(dataList);
                        }
                    })
                    .catch(function (response) {
                        console.log(response)
                    });
            },
            handleSelect(item) {
                let id = item.id;
                let projectName = item.name;
                let code = item.code;

                this.deposit.projectId = id;
                this.deposit.project = projectName;
                this.deposit.projectCode = code;
            },
            remoteMethod(query) {
                let params = {"key": query};
                this.postRequest('/deposit/pro/list', params)
                    .then(resp => {
                        if (resp) {
                            for (let i of resp.data) {
                                i.value = i.name;
                            }
                            let dataList = resp.data;
                            this.pros = dataList;
                        }
                    })
                    .catch(function (response) {
                    });
            },
            type_change(){
                console.log("asdsa");
                if (this.deposit.isCount == 1){
                    this.deposit.isCount = 0;
                }else{
                    this.deposit.isCount = 1;
                }
            }

        }
    }

    function sleep(NumMillis) {
        let nowTime = new Date();
        let exitTime = nowTime.getTime() + NumMillis;
        while (true) {
            let nowDate = new Date();
            if (nowDate.getTime() > exitTime)
                return;
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
