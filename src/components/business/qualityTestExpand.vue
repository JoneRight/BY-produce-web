<template>

    <div>
        <table class="tableCss">
            <tr>
                <th v-for="(colData,index) in data" :key="index" style="text-align: center">
                    {{colData}}
                </th>
            </tr>
        </table>
    </div>

</template>
<style>
.tableCss {
    margin-bottom: -10px;
    margin-top: -10px;
    width: 97%;
    border: 0
}
</style>

<script>
import Vue from "vue";
export default {
    props: {
        data: Object
    }
};
</script>