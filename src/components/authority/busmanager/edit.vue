<template>
    <div class="bg-white p20  m20">
        <h2 class="common-title">分配系统</h2>
        <div class="mt20">
            <Form :label-width="100" :model="userSystem" ref="userSystemForm">
                <FormItem label="登录账号">
                    <Label>{{userSystem.loginName}}</Label>
                </FormItem>
                <FormItem label="用户名称">
                    <Label>{{userSystem.userName}}</Label>
                </FormItem>
                <FormItem label="分配省份">
                    <div style="padding-bottom:6px;margin-bottom:6px;">
                        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                    </div>
                    <div style="height:255px;overflow-y:auto;">
                        <!-- 动态生成多选框 -->
                        <CheckboxGroup v-model="checkAllGroup" v-for="item in systemList" :key="item.systemId" @on-change="checkAllGroupChange" style="width:175px;display:inline-block">
                            <Checkbox :label="item.province">{{item.provinceName}}</Checkbox>
                        </CheckboxGroup>
                    </div>
                </FormItem>
                <FormItem>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="save()">保存</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
export default {
    name: "userSystem",
    data() {
        return {
            userId: "",
            systemList: [],
            systemIdList: [],
            systemId: "",
            province: "",
            indeterminate: false, //全选状态(默认是非全选)
            checkAll: false, //全选状态（默认是非全选）
            checkAllGroup: [], //选中的多选框
            userSystem: {
                loginName: "",
                userName: ""
            }
        };
    },
    mounted() {
        if (this.$route.query.Id != "") {
            // this.userFormAdd = this.$route.query.data;
            this.userId = this.$route.query.Id;
            //获取用户信息
            this.getUserInfo();
        }
    },
    methods: {
        //获取用户信息
        getUserInfo() {
            var self = this;
            Vue.ajax.send({
                name: "busmanager.getUser",
                data: {
                    userId: self.userId
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.userSystem = data.data;
                        self.checkAllGroup = data.data.provinceList;

                        //获取省份
                        self.getProvinceList();
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        //获取省份
        getProvinceList() {
            var self = this;
            Vue.ajax.send({
                name: "busmanager.getProvince",
                data: {},
                success: function(data) {
                    if (!!data && data.code == "0") {
                        //接口数据
                        self.systemList = data.data;
                        if (data.data[0].province==0) {
                            self.systemList.splice(0,1);
                        }
                        
                        // 选择状态
                        if (self.checkAllGroup.length === self.systemList.length) {
                            self.indeterminate = false;
                            self.checkAll = true;
                        } else if (self.checkAllGroup.length > 0) {
                            self.indeterminate = true;
                            self.checkAll = false;
                        } else {
                            self.indeterminate = false;
                            self.checkAll = false;
                        }
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        },
        //全选
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                this.systemList.forEach(a =>
                    this.checkAllGroup.push(a.province)
                );
                this.systemIdList = [];
                this.systemList.forEach(a => {
                    this.systemIdList.push(a.province);
                });
            } else {
                this.checkAllGroup = [];
            }
        },
        //单个选择
        checkAllGroupChange(data) {
            if (data.length === this.systemList.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
            this.systemIdList = [];
            this.systemIdList = data;
        },
        //返回
        cancel() {
            this.$router.push("/authority/busmanager/list");
        },
        //保存
        save() {
            var self = this;
            Vue.ajax.send({
                name: "busmanager.save",
                data: {
                    userId: self.userId,
                    systemIds: self.systemIdList
                },
                success: function(data) {
                    if (!!data && data.code == "0") {
                        self.$router.push("/authority/busmanager/list");
                        self.$Message.success("用户系统分配成功！");
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.message
                        });
                    }
                }
            });
        }
    }
};
</script>