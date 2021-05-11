<template>
    <div class="m15" style="height:calc(100% - 50px);overflow-y:hidden;">
        <h2 class="common-title">医院管理</h2>
        <Tabs v-model="tabName" @on-click="changeTab" :animated="false" style="height:calc(100% - 60px);overflow-y:hidden;">
            <TabPane  name="name1" label="医院管理" style="height:100% ;overflow-y:hidden;">
                <template v-if="authorize('hospitallist')">
                    <hosp-list ref="hospList"></hosp-list>
                </template>
                <template v-else>
                    <NoAuth></NoAuth>
                </template>
            </TabPane>
            <TabPane :label="tab2" name="name2"  :disabled='hospitalNew.length==0'>
                <template v-if="authorize('hospitalnewlist')">
                    <hosp-new :hospitalNew="hospitalNew" @refreshHospitalNew="getHospitalNew"></hosp-new>
                </template>
                <template v-else>
                    <NoAuth></NoAuth>
                </template>
            </TabPane>
            <TabPane :label="tab3" name="name3"  :disabled='hospitalCheck.length==0'>
                <template v-if="authorize('hospitalregisterlist')">
                    <hosp-check :hospitalCheck="hospitalCheck" @refreshHospitalCheck="getHospitalCheck"></hosp-check> 
                </template>
                <template v-else>
                    <NoAuth></NoAuth>
                </template>
            </TabPane>
           <!-- <TabPane :label="tab4" name="name4"  :disabled='hospitalCheck.length==0'>
                <template v-if="authorize('hospitalregisterlist')">
                    <hosp-check-list :hospitalCheckList="hospitalCheckList" @refreshHospitalCheckList="getHospitalCheckList"></hosp-check-list> 
                </template>
                <template v-else>
                    <NoAuth></NoAuth>
                </template>
            </TabPane> -->
        </Tabs>   
    </div>
</template>

<script>
import Vue from "vue";
import hospList from "@/components/report/hospCpt/hospList";
import hospNew from "@/components/report/hospCpt/hospNew";
import hospCheck from "@/components/report/hospCpt/hospCheck";
import HospCheckList from "@/components/report/hospCpt/hospCheck";
import NoAuth from '@/components/common/NotAuthorize'
export default {
    components: {
        'hosp-list': hospList,
        'hosp-new':hospNew,
        'hosp-check':hospCheck,
        'hosp-check-list':HospCheckList,
        NoAuth
      },
    name: 'hospital',
    data(){
    	return{
            tabName:"name1",
            tab2: (h) => {
                return h('div', [
                    h('span', '新入网医院'),
                    h('Badge', {
                        props: {
                            count: this.hospitalNew.filterProperty("state",0).length
                        }
                    })
                ])
            },
            tab3: (h) => {
                return h('div', [
                    h('span', '医院登记表审核'),
                    h('Badge', {
                        props: {
                            count: this.hospitalCheck.filterProperty("state",0).length
                        }
                    })
                ])
            },
            // tab4: (h) => {
            //     return h('div', [
            //         h('span', '医院登记表审核历史记录'),
            //         h('Badge', {
            //             props: {

            //             }
            //         })
            //     ])
            // },
            hospitalNew:[],
            hospitalCheck:[], 
            hospitalCheckList:[]

    	}
    },
    activated: function() {
        this.getHospitalNew();
        this.getHospitalCheck();
        if(this.$route.params.tabname){
            this.tabName = this.$route.params.tabname;
        }
    },
    methods: {      
        getHospitalNew(){
            var self=this;
            Vue.ajax.send({
                name: 'hospital.new',
                data:{},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.hospitalNew=data.data;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },  
        getHospitalCheck(){
            var self=this;
            Vue.ajax.send({
                name: 'hospital.checkEdit',
                data:{},
                success: function(data) {
                    if (!!data && data.code=='0') {
                        self.hospitalCheck=data.data;
                    } else {
                        this.$Modal.error({
                            title: '',
                            content: data.message
                        });
                    }
                }
            });
        },        
        authorize:function(value){
            return Vue.authorize(value)
        },
        changeTab(name){
            if(name=='name1'){
                this.$refs.hospList.getHospitalList();
            }else if(name=='name2'){
                this.getHospitalNew();
            }else if(name=='name3'){
                this.getHospitalCheck();
            }
        }
    }
};
</script>
<style scoped>
.ivu-tabs-no-animation>.ivu-tabs-content{
    height:100% !important;
}
</style>
