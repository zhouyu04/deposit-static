<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-select style="width: 200px;margin-right: 10px" v-model="searchValue.subId" :filterable="false" filterable
                               placeholder="请选择科目">
                        <el-option :key="'全部'" :label="'全部'" :value=null></el-option>
                        <el-option
                                v-for="item in subs"
                                :key="item.subjectCode"
                                :label="item.subjectName"
                                :value="item.id">
                        </el-option>
                    </el-select>

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

                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView" style="margin-right: 20px">
                        添加保证金
                    </el-button>

                    <el-button type="primary" icon="el-icon-edit" @click="showEditEmpView" style="margin-right: 20px">
                        修改
                    </el-button>

                    <el-dropdown split-button type="primary" icon="el-icon-upload"
                                 @click="importExcel" slot="dropdown">
                        导入
                        <input id="file" name="file" type="file" value="" hidden="hidden"/>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="downloadExcel">下载模板</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </div>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="deposits"
                    stripe border
                    ref="multipleTable"
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style=" width: 100%">
                <el-table-column
                        type="selection"
                        width="40">
                    <template slot-scope="scope">
                        <el-radio v-model="currentRowId" :label="scope.row.id" @change="changeRedio($event,scope.row)">
                            &nbsp;
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="id" v-if="show" fixed align="left" label="id"/>
                <el-table-column prop="subjectName" label="科目名称" align="left" width="200"/>
                <el-table-column prop="proof" label="凭证" align="left" width="85"/>
                <el-table-column prop="reference" label="参考信息" align="left" width="85"/>
                <el-table-column prop="project" label="摘要" align="left" width="400"/>
                <el-table-column prop="empDate" label="业务日期" align="left" width="150"/>
                <el-table-column prop="projectCode" label="项目code" align="left" width="300"/>
<!--                <el-table-column prop="businessNo" label="业务编号" align="left" width="85"/>-->
<!--                <el-table-column prop="settlementType" label="结算方式" align="left" width="85"/>-->
<!--                <el-table-column prop="settlement" label="结算号" align="left" width="85"/>-->
<!--                <el-table-column prop="targetSub" label="对方科目" align="left" width="85"/>-->
<!--                <el-table-column prop="sysModule" label="系统模块" align="left" width="85"/>-->
                <el-table-column prop="describe" label="描述" align="left" width="85"/>
                <el-table-column prop="money" label="金额" align="left" width="100"/>
                <el-table-column prop="direction" label="方向" align="left" width="85" :formatter="dicFormatter"/>
                <el-table-column prop="balance" label="余额" align="left" width="100"/>
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
    </div>
</template>

<script>

    export default {
        data() {
            return {
                currentRowId: null,
                searchValue: {subId:null,type:''},
                show: false,
                loading: false,
                id: '',
                subs:[],
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
            this.fetchData();
            this.fetchSub();
        },
        methods: {
            fetchData() {
                let url = '/deposit/base/list';
                let searchValue = this.searchValue;
                let type = this.$route.query.type;

                this.searchValue.type = type;

                console.log(searchValue);

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
            fetchSub(){
                let url = '/deposit/sub/list';
                let searchValue = this.searchValue;

                this.$axios.post(url, searchValue)
                    .then(resp => {
                        if (resp) {
                            this.subs = resp.data;
                        }
                    })
                    .catch(function (response) {
                        console.log(response)
                    });
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
            showEditEmpView(rows) {
                let currentRowId = this.currentRowId;
                console.log("选中行ID：" + currentRowId);
                if (currentRowId == null){
                    this.$message.error('请选择数据行');
                    return;
                }
                this.$router.push({path:'/deposit/detail', query: {appointmentId: currentRowId}})
                    .then(resp => {
                        console.log(resp)
                    })
                    .catch(err => {
                        console.log(err)
                    })
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
            },
            importExcel() {
                console.log("importExcel");
                $('#file').click()
            },
            downloadExcel() {
                console.log("下载模板");
                window.location.href = "/src/assets/履约导入模板.xlsx";
            },
            changeRedio(event, row) {
                console.log('event,row:', event, row);
                this.currentRowId = event;
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
