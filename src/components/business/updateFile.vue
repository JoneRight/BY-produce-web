<template>
    <div class="bg-white p15">
        <h2>查重管理</h2>
        <div class="mt5">
            <Button type="primary" @click="backPage()">返回</Button>
        </div>
        <Table border :columns="columns2" :data="data3" style="margin-top: 10px;"></Table>
    </div>
</template>

<script>
import dataJson from "@/assets/data/business/testCommon.json";
export default {
    name: "updateFile",
    data() {
        return {
            id: "", //保存上个页面传过来的id标识
            data: "", //后台返回的数据
            html: [], //处理后的数据
            columns2: [],
            data3: [],
            index1: ""
        };
    },
    mounted() {
        this.id = this.$route.query.id;

        this.data = dataJson.testData[0].data;

        let aaa = this.data.split("/t");
        aaa.forEach(element => {
            let bbb = element.split(",");
            //获取最长一条信息的长度
            if (bbb.length > this.index1) {
                this.index1 = bbb.length;
            }
            //将每条信息组装为json格式的字符串
            let ccc = "{";
            for (let index = 0; index < bbb.length; index++) {
                const element = bbb[index];
                if (index == bbb.length - 1) {
                    ccc = ccc + '"' + index + '":"' + element + '"';
                } else {
                    ccc = ccc + '"' + index + '":"' + element + '",';
                }
            }
            ccc = ccc + "}";
            //转为json，放到列表中
            this.data3.push(JSON.parse(ccc));
        });
        for (let index = 0; index < this.index1; index++) {
            this.columns2.push({
                title: index + 1,
                key: index,
                align: "center",
                width: 150,
                heght:160
            });
        }
    },
    methods: {
        backPage() {
            // this.$router.go(-1);
            this.$router.back();
        }
    }
};
</script>