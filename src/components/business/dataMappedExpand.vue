<template>

    <div>
        <div v-for="(item,dataIndex) in data.backList" :key="dataIndex">
            <div style="width:175px;margin: auto;display:inline-block">
                <Row class="expand-row">
                    <Col span="24">
                    <span class="expand-value error">{{item.errorValue}}</span>
                    </Col>
                </Row>
            </div>
            <div style="display:inline-block;width:90%">
                <Row class="expand-row" v-for="(rowData,rowIndex) in item.dataList" :key="rowIndex">
                    <Col span="1" style="width:100px;" v-for="(colData,index) in rowData" :key="index">
                    <span v-if="index!='id'" class="expand -value">{{colData}}</span>
                    </Col>
                    <Col span="2">
                    <Button type="primary" size="small" @click="batchOperation(data.hospitalNum,rowData.id,rowIndex,dataIndex)">创建医院规则</Button>
                    <Button type="primary" size="small" @click="batchQuestion(rowData.id,rowIndex,dataIndex)">创建通用规则</Button>
                    </Col>
                </Row>
            </div>
            <hr style="margin-bottom:10px;margin-top:-15px;" />
        </div>
    </div>

</template>
<style scoped>
.expand-row {
    margin-bottom: 16px;
    margin-left: 60px;
    width: 100%;
}
.error {
    color: red;
}
</style>
<script>
import Vue from "vue";
export default {
    props: {
        data: Object
    },
    name: "dedede",
    data() {
        return {
            // data:Object
        };
    },
    methods: {
        batchOperation(hospitalNum, id, rowIndex, dataIndex) {
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.hospitalRule",
                data: {
                    hospitalNum: hospitalNum,
                    ruleId: id,
                    ruleType: 0
                },
                success: function(success) {
                    if (!!success && success.code == "0") {
                        self.$Modal.success({
                            title: "成功",
                            closable: true,
                            content: "<h5>映射规则创建成功</h5>"
                        });
                        self.data.backList[dataIndex].dataList.splice(
                            rowIndex,
                            1
                        );
                        //判断条件删除backList
                        if (
                            self.data.backList[dataIndex].dataList.length == 0
                        ) {
                            self.data.backList.splice(dataIndex, 1);
                        }
                    } else {
                        self.$Modal.success({
                            title: "失败",
                            closable: true,
                            content: success.message
                        });
                    }
                }
            });
        },
        batchQuestion(id, rowIndex, dataIndex) {
            var self = this;
            Vue.ajax.send({
                name: "dataMapped.hospitalRule",
                data: {
                    ruleId: id,
                    ruleType: 1
                },
                success: function(success) {
                    if (!!success && success.code == "0") {
                        self.$Modal.success({
                            title: "成功",
                            closable: true,
                            content: "<h5>映射规则创建成功</h5>"
                        });
                        self.data.backList[dataIndex].dataList.splice(
                            rowIndex,
                            1
                        );
                        //判断条件删除backList
                        if (
                            self.data.backList[dataIndex].dataList.length == 0
                        ) {
                            self.data.backList.splice(dataIndex, 1);
                        }
                    } else {
                        self.$Modal.success({
                            title: "失败",
                            closable: true,
                            content: success.message
                        });
                    }
                }
            });
        }
    }
};
</script>