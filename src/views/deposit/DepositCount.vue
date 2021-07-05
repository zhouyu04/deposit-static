<template xmlns:border-radius="http://www.w3.org/1999/xhtml">
    <div style="">


        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <a href="javascript:void(0)" @click.prevent='getDetail("zero")'>账目对齐共 {{zero}} 条</a>
                </div>

            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <a href="javascript:void(0)" @click.prevent='getDetail("positive")'>已借未收账目共 {{positive}} 条</a>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <a href="javascript:void(0)" @click.prevent='getDetail("negative")'>已收未绑定出账共 {{negative}} 条</a>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    预留
                </div>
            </el-col>
        </el-row>
    </div>


</template>

<style>

    .bg-purple {
        background: #f4f4f4;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
        height: 150px;
        padding: 70px;
        text-align: center;
    }

</style>

<script>

    export default {
        name: "DepositDetail",
        data() {
            return {
                zero: '',
                positive: '',
                negative: '',
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

                let url = '/deposit/base/statistics';

                this.$axios.post(url)
                    .then(resp => {
                        if (resp) {
                            let obj = resp.obj;
                            this.zero = obj.zero;
                            this.positive = obj.positive;
                            this.negative = obj.negative;
                        }
                    })
                    .catch(function (response) {
                        console.log(response)
                    });
            },
            getDetail(event) {

                let type = '';
                if (event == 'zero') {
                    type = 'zero';
                } else if (event == 'positive') {
                    type = 'positive'
                } else if (event == 'negative') {
                    type = 'negative';
                }
                console.log(type);

                this.$router.push({path:'/deposit/base', query: {type: type}})
                    .then(resp => {
                        console.log(resp)
                    })
                    .catch(err => {
                        console.log(err)
                    })

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
