<template>

    <div>
        <Row class="expand-row" >
            <Col span="6" v-for="row in data" :key="row.name" style="height:25px;">
                <span class="expand-key"><b>{{row.name}}：</b> </span>
                <span class="expand-value">{{row.value}} </span>
            </Col>
        </Row>
    </div>

</template>
<style scoped>
.expand-row {
    margin-bottom: 10px;
    margin-left: 40px;
    width: 100%;
}
</style>
<script>
import Vue from "vue";
export default {
    props: {
        data: Array
    }
};
</script>