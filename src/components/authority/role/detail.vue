<template>
    <div class="bg-white p20 m20">
        <h2 class="common-title">角色详情</h2>
        <div class="mt20">
            <Form :label-width="80" :model="roleDetail">
                <FormItem label="角色名称">
                    <Label >{{roleDetail.roleName}}</Label>
                </FormItem>
                <FormItem label="所属系统">
                    <Label >{{roleDetail.roleSystemName}}</Label>
                </FormItem>
                <FormItem label="拥有权限">
                    <Label >{{roleDetail.roleAuthNames}}</Label>
                </FormItem>
                <FormItem label="角色简介">
                    <Label >{{roleDetail.roleRemark}}</Label>
                </FormItem>

                <FormItem>
                    <Button type="info" to="/authority/role/list" >返回列表</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>
<script>
import Vue from "vue";
export default {
        name: 'roleDetail',
        data () {
            return {
                roleDetail: {
                    roleId: ''
                }
            }
        },
        mounted () {
            //获取本条数据
            // this.roleDetail = this.$route.query.data;
            console.log(this.$route.query.Id);
            if (this.$route.query.Id != "") {
                // this.userFormAdd = this.$route.query.data;
                this.roleId = this.$route.query.Id;
                //获取角色信息
                this.getRoleInfo();
            }
        },
        methods: {
            getRoleInfo(){
            var self = this;
            Vue.ajax.send({
                name: 'role.detail',
                data: {
                    roleId: this.roleId
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.roleDetail = data.data;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },
    }
}    
</script>