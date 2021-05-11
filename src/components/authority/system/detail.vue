<template>
    <div class="bg-white p20">
        <h2 class="common-title" v-show="type!=''">系统管理详情</h2>
        <div class="mt20">
            <Form :label-width="80" :model="sysDetail" ref="sysDetailForm" :rules="rscValidate">
                <FormItem label="系统名称" prop="systemName">
                    <Label >{{sysDetail.systemName}}</Label>
                </FormItem>
                <FormItem label="系统拥有模块" prop="systemModule">
                    <Label >{{sysDetail.systemModule}}</Label>
                </FormItem>
                <FormItem>
                    <Button type="info" to="/authority/system/list" >返回列表</Button>
                </FormItem>
            </Form>
        </div>        
    </div>
</template>
<script>
import Vue from "vue";
    export default {
        name: 'sysDetail',
        data () {
            return {
                sysDetail: {}
            }
        },
        mounted () {
            //获取系统详情
            this.sysDetail = this.$route.query.data;
            // this.getSystemDetailInfo();
        },
        methods: {
            getSystemDetailInfo(){
            var self = this;
            Vue.ajax.send({
                name: 'system.detail',
                data: {
                    systemID: this.$route.query.data.systemID,
                },
                success: function(data) {
                    if (!!data && data.code == '0') {
                        self.sysDetail = data.data;
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