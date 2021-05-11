<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title" style="margin-left:0px;">分配任务</h2>
        <div class="mt20">
            <Form ref="allocation" :label-width="100">
                <FormItem label="映射类型">
                    <span>{{mapTypeText}}</span>
                </FormItem>
                <FormItem label="数据类型">
                    <span>{{getDataType(dataType)}}</span>
                </FormItem>
                <FormItem label="医院">
                    <span>{{hospName}}</span>
                </FormItem>
                <FormItem label="未分配总条数">
                    <span>{{count}} 条</span>
                </FormItem>
                <FormItem label="选择部门和人员">
                    <Table border :columns="dataCol" :data="dateList" style="margin-top: 10px;"></Table>
                </FormItem>
             <FormItem label="数据年月" :label-width="60">
                    <span>{{yearMonth}}</span>
                </FormItem>
                <FormItem label="分配任务数量" prop="dataType">
                    <Table border :columns="dataInitialCol" :data="checkboxNameList" style="margin-top: 10px;"></Table>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="save">保存</Button>
                    <Button @click="cancel">取消</Button>
                </FormItem>
            </Form>
        </div>
        <Modal v-model="model1" title="提示" width=420 @on-ok="yesSave">
            还剩余未分配信息：{{updateCount}} 条，是否只确认分配任务？
        </Modal>
    </div>
</template>

<style>
.cellLength {
    width: 90%;
}
</style>

<script>
import Vue from "vue";
export default {
    name: "allocationAdd",
    data() {
        return {
            dateList: [], //部门人员信息
            // dateInitialList:[],//人员任务分配信息
            checkboxIdList: [],
            checkboxNameList: [],
            capcheckboxNameList:[],
            backList: [],
            capbackList:[],
            mapType: "", //映射类型
            mapTypeText: "", //映射类型
            dataType:"",
            hospId:"",
            hospName:"",
            count: 0, //未映射条数
            model1: false,
            updateCount: 0,
            updateType: false, //修改状态
            dataCol: [
                {
                    title: "部门",
                    key: "deptName",
                    // align: "center",
                    width: 250
                },
                {
                    title: "人员",
                    key: "userInfor",
                    // align: "center",
                    render: (h, params) => {
                        var checkThis = this;
                        return h(
                            "CheckboxGroup",
                            {
                                props: {
                                    label: checkThis.checkboxIdList
                                }
                            },
                            params.row.userInfor.map(function(type, cc, dd) {
                                return h(
                                    "Checkbox",
                                    {
                                        props: { label: type.split("#")[0] },
                                        on: {
                                            input: event => {
                                                if (checkThis.count < 1) {
                                                    checkThis.$Modal.error({
                                                        title: "错误",
                                                        content:
                                                            "该映射类型下剩余未分配条数为0，不需要再分配任务。"
                                                    });
                                                }
                                                if (event) {
                                                    //将人员id和名称添加到相应数组记录
                                                    checkThis.checkboxIdList.push(
                                                        type.split("#")[0]
                                                    );
                                                    var userNameCol = {
                                                        userId: type.split(
                                                            "#"
                                                        )[0],
                                                        userName: type.split(
                                                            "#"
                                                        )[1],
                                                        dateCount: 0
                                                    };
                                                    checkThis.checkboxNameList.push(
                                                        userNameCol
                                                    );
                                                } else {
                                                    //判断数组中是否存在该人员记录，存在则删除
                                                    var checkIndex = checkThis.checkboxIdList.indexOf(
                                                        type.split("#")[0]
                                                    );
                                                    if (checkIndex > -1) {
                                                        checkThis.checkboxIdList.splice(
                                                            checkIndex,
                                                            1
                                                        );
                                                        checkThis.checkboxNameList.splice(
                                                            checkIndex,
                                                            1
                                                        );
                                                    }
                                                }
                                                //判断没人分配的条数
                                                var valid = parseInt(
                                                    checkThis.count /
                                                        checkThis
                                                            .checkboxNameList
                                                            .length
                                                );
                                                //修改没人的任务条数
                                                checkThis.checkboxNameList[0].dateCount =
                                                    checkThis.count -
                                                    valid *
                                                        checkThis
                                                            .checkboxNameList
                                                            .length +
                                                    valid;
                                                for (
                                                    let index = 1;
                                                    index <
                                                    checkThis.checkboxNameList
                                                        .length;
                                                    index++
                                                ) {
                                                    checkThis.checkboxNameList[
                                                        index
                                                    ].dateCount = valid;
                                                }
                                                //拷贝数组保存到返回数据
                                                checkThis.backList=checkThis.objDeepCopy(checkThis.checkboxNameList);
                                                
                                            }
                                        }
                                    },
                                    type.split("#")[1]
                                );
                            })
                        );
                    }
                }
            ],
            dataInitialCol: [
                {
                    title: "人员",
                    key: "userName",
                    // align: "center",
                    width: 250
                },
                {
                    title: "数据条数",
                    key: "dateCount",
                    // align: "center",
                    render: (h, params) => {
                        var inputThis = this;
                        return h("input", {
                            domProps: {
                                value: params.row.dateCount,
                                style: "height:20px;"
                            },
                            on: {
                                input: function(event) {
                                    //修改返回数据
                                    inputThis.backList[params.index].dateCount =
                                        event.target.value;
                                    inputThis.updateType = true;
                                }
                            }
                        });
                    }
                }
            ]
        };
    },
    mounted() {
        this.mapType = this.$route.query.mapType;
        this.mapTypeText = this.$route.query.mapTypeText;
        this.dataType=this.$route.query.dataType;
        this.hospId=this.$route.query.hospId;
        this.hospName=this.$route.query.hospName;
        this.yearMonth=this.$route.query.yearMonth
        this.selectList = this.$route.query.mappingId;

        this.getDataList(); //获取基础数据
    },
    methods: {
        getDataList() {
            var self = this;
            Vue.ajax.send({
                name: "allocation.get",
                data: {
                    pageIndex: 1,
                    pageSize: 10,
                    mappingType: self.mapType,
                    dataType:self.dataType,
                    hospId:self.hospId,
                    yearMonth:self.yearMonth,
                    mappingId:self.selectList
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        console.log(data)
                        self.dateList = data.data.dataList;
                        self.count = data.data.totalItemCount;
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        getDataType(dataType){
            if(dataType==10){
                return "购药";
            }
            else if(dataType==20){
                return "门急诊";
            }
            else if(dataType==30){
                return "病案";
            }
            else if(dataType==40){
                return "医嘱";
            }
            else{
                return ""
            }
        },
        //取消
        cancel() {
            this.$router.back();
        },
        save() {
            //判断是否未分配条数和本次分配条数
            if (this.count < 1) {
                this.$Modal.error({
                    title: "错误",
                    content: "该映射类型下剩余未分配条数为0，不需要再分配任务。"
                });
            } else if (this.updateType) {
                var saveCount = 0;
                this.backList.forEach(m => {
                    saveCount = parseInt(saveCount) + parseInt(m.dateCount);
                });
                if (saveCount > this.count) {
                    var errorCount = saveCount - this.count;
                    this.$Modal.error({
                        title: "失败",
                        content:
                            "未分配数据条数不足，超过 " + errorCount + " 条。"
                    });
                } else if (saveCount < this.count) {
                    this.updateCount = this.count - saveCount;
                    this.model1 = true;
                } else {
                    this.yesSave();
                }
            } else {
                this.yesSave();
            }
        },
        yesSave() {
            var self = this;
            let permit=true;
            this.backList.forEach(m => {
                    if(m.dateCount.toString().trim()==="0" || m.dateCount.toString().trim().length==0){
                        permit=false;
                    }
                });
        if(!permit){
            this.$Modal.error({
                        title: "失败",
                        content:
                            "请输入数据条数"
                    });
                    return;
        }
            Vue.ajax.send({
                name: "allocation.save",
                data: {
                    backList: self.backList,
                    mappingType: self.mapType,
                    dataType:self.dataType,
                    hospId:self.hospId,
                    yearMonth:self.yearMonth,
                    mappingId:self.selectList
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.dateList = data.data.dataList;

                        self.$Message.success("分配成功");
                        self.$router.push({
                            path: "/business/taskAllocation"
                        });
                    } else {
                        self.$Modal.error({
                            title: "失败",
                            content: data.message
                        });
                    }
                }
            });
        },
        objDeepCopy(source) {
            var sourceCopy = source instanceof Array ? [] : {};
            for (var item in source) {
                sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
            }
            return sourceCopy;
        }
    }
};
</script>
        