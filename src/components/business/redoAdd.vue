<template>
    <div class="m20 bg-white" style="height:calc(100% - 50px)">
        <h2 class="common-title">重新清洗</h2>
        <Tabs value="name1" :animated="false" class="p20" style="height:90%">
            <TabPane name="name1" label="自动生成">
                <!-- <hosp-list ref="hospList"></hosp-list> -->
                <Form :model="searchForm" ref="searchForm" :rules="ruleValidate" inline>
                    <FormItem label="数据类型" :label-width="80" prop="dataType">
                        <Select v-model="searchForm.dataType" style="width:300px" @on-change="clickOperation(timeType)">
                            <Option value="backups.buy_medicines">购药</Option>
                            <Option value="backups.prescription">门急诊</Option>
                            <Option value="backups.medical_records">病案</Option>
                            <Option value="backups.doctor_advice">医嘱</Option>
                        </Select>
                    </FormItem>
                    <br/>
                    <FormItem label="数据时间" :label-width="80" prop="yearMonth">
                        <DatePicker type="month" v-model="searchForm.yearMonth" editable:true style="width: 300px;" @on-change="clickOperation($event)"></DatePicker>
                    </FormItem>
                    <br/>
                    <FormItem label="选择医院" :label-width="80" prop="hospital">
                        <Select v-model="searchForm.hospital" style="width: 300px;" filterable @on-change="clickOperation(timeType)">
                            <Option v-for="item in hospitalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <br/>
                    <FormItem label="生成语句" :label-width="80">
                        <Input v-model="searchForm.greater" type="textarea" :rows="4" :maxlength="2000" style="width: 500px;" readonly/>
                    </FormItem>
                    <br/>
                    <FormItem>
                        <Button type="primary" @click="generation()" style="margin-left:80px;">一键生成</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane name="name2" label="自定义SQL">
                <Form :model="customForm" ref="customForm" :rules="ruleValidate" :label-width="20">
                    <FormItem prop="greater">
                        <Input v-model="customForm.greater" type="textarea" :rows="12" :maxlength="800" style="width: 500px;" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="customAdd()" style="margin-left:20px;width:80px;">执行</Button>
                    </FormItem>
                </Form>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import Vue from "vue";
import commonJson from "@/assets/data/business/common.json";
export default {
    name: "redoAdd",
    data() {
        return {
            dataTypeList: commonJson.dataTypeList, //数据类型
            hospitalList: [], //医院
            searchForm: {
                hospital: "",
                dataType: "",
                yearMonth: "",
                greater: ""
            },
            timeType:"",
            customForm: {
                greater: ""
            },
            ruleValidate: {
                dataType: [
                    {
                        required: true,
                        message: "请选择数据类型",
                        trigger: "blur"
                    }
                ],
                hospital: [
                    { required: true, message: "请选择医院", trigger: "blur" }
                ],
                greater: [
                    {
                        required: true,
                        message: "请输入要执行的SQL",
                        trigger: "blur"
                    }
                ],
                yearMonth: [
                    {
                        required: true,
                        message: "请选择年月",
                        trigger: "blur",
                        pattern: /.+/
                    }
                ]
            }
        };
    },
    mounted: function() {
        this.getHospitalList(); //获取医院数据
    },
    methods: {
        //获取医院
        getHospitalList() {
            var self = this;
            Vue.ajax.send({
                name: "common.hospitalList",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.hospitalList = data.data;
                    } else {
                        self.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        clickOperation(type) {
            this.searchForm.greater = "";
            if (this.searchForm.dataType != "") {
                this.searchForm.greater +=
                    "select * from " + this.searchForm.dataType;
            }
            if (this.searchForm.yearMonth != "") {
                this.searchForm.greater +=
                    ' where year_month="' + type.replace("-","") +
                    '"';
                this.timeType=type.replace("-","");
            }
            if (this.searchForm.hospital != "") {
                if (this.searchForm.yearMonth != "") {
                    this.searchForm.greater +=
                        " and hosp_id=" + this.searchForm.hospital;
                } else {
                    this.searchForm.greater +=
                        " where hosp_id=" + this.searchForm.hospital;
                }
            }
        },
        //自动生成新增
        generation() {
            this.$refs["searchForm"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "redoManager.add",
                        data: {
                            hospId: self.searchForm.hospital,
                            dataType: self.searchForm.dataType,
                            yearMonth: self.timeType,
                            taskContent: self.searchForm.greater,
                            taskType: 0
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.success("新增成功");
                                self.$router.push({
                                    path: "/business/redo"
                                });
                            } else {
                                self.$Modal.error({
                                    title: "失败",
                                    content: data.message
                                });
                            }
                        }
                    });
                }
            });
        },
        //自定义新增
        customAdd() {
            this.$refs["customForm"].validate(valid => {
                if (valid) {
                    var self = this;
                    Vue.ajax.send({
                        name: "redoManager.add",
                        data: {
                            taskContent: self.customForm.greater,
                            taskType: 1
                        },
                        success: function(data) {
                            if (!!data && data.code == "0") {
                                self.$Message.success("新增成功");
                                self.$router.push({
                                    path: "/business/redo"
                                });
                            } else {
                                self.$Modal.error({
                                    title: "失败",
                                    content: data.message
                                });
                            }
                        }
                    });
                }
            });
        },
        //时间戳转字符串
        formartDate(param) {
            let date = new Date(param);
            let Y = date.getFullYear();
            let M =
                date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1;
            return Y + M;
        }
    }
};
</script>