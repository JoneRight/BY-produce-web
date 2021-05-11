<template>
    <div>
            <div class="div-style">
                <table class="table-style" border="0" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <th class="th-style" colspan="3">系统</th>
                        <th class="th-style" colspan="9">角色</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-show="data.length > 0" v-for="(item,index) in data">
                        <td class="td-style" colspan="3">{{ item.systemName }}</td>
                        <td class="td-style" colspan="9">{{ item.roleNames }}</td>
                    </tr>
                    <tr v-show="data.length == 0">
                         <td class="td-style" colspan="12">{{ "暂无数据" }}</td>
                    </tr>
                </tbody>
                </table>
            </div>
        <!-- </Row> -->
    </div>

</template>
<style scoped>
.expand-row {
    margin-bottom: 15px;
    left: 5px;
}
.div-style {
    position: relative;
    border-left: 1px solid #dde2ec;
    border-bottom: 0;
    border-right: 0;
}
.div-style .table-style {
    width:820px;
}
.td-style {
    text-align: center;
    border-right: 1px solid #e0e0e0;
    background-color:#f8f8f9;
    padding-left: 10px;
    padding-right: 10px;
}
.th-style {
    text-align: center;
    font-weight: bold;
    border-right: 1px solid #e0e0e0;
    background-color:#ebebeb;
}


</style>
<script>
import Vue from "vue";
export default {
    props: {
        row: Object
    },
    name: 'listExpandName',
    
    data (){
        return {
            system: {},
            data: [],
            tabH: 0,
            sysCol: [
                {
                    title: '系统名称',
                    key: 'systemName',
                    align: 'center',
                    width: 60
                },
                {
                    title: '角色',
                    key: 'roleNames',
                    align: 'center'
                }
            ]
        }
    },
    mounted: function()  {
        this.data = this.row.systemRoleList;
        this.tabH = this.data.length * 30;
    }

};
</script>