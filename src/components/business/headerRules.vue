<template>
    <div class="m20 bg-white p20">
        <h2 class="common-title">文件表头</h2>
        <div class="mt20">

            <Form :model="rulesFrom" ref="addRulesAdd" :label-width="80" style="width:90%">
                 <!-- <FormItem label="表头映射">
                     <Row>
                         <Col span="11">
                      <span style="color:red;font-weight:600;margin-left:40%">已存在的通用表头</span>
                               <CustomTable v-authorize="'BusinessHeaderList'" :columnConfig='initialCol' :columnDatas='initialList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
               <tr v-for="(item,index) in showDatas" :key="index">
                    <td v-for="(colData,colIndex) in initialCol" :key="colIndex" class="ellipsis">
                        {{item[colData.name]}}
                    </td>
                </tr>
            </CustomTable>
                      </Col>
                      <Col span="2">
                      <span>&nbsp;</span></Col>
                
<Col span="11">
                      <span style="color:red;font-weight:600;margin-left:40%">已存在的非通用表头</span>
                    <Table border :columns="headerMapedCol" :data="speicalHeadMapList"></Table>
</Col>
                     </Row>
                </FormItem>    -->

<!-- 
                <FormItem label="Date">
            <Row>
                <Col span="11">
                    <FormItem prop="date">
                        <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <FormItem prop="time">
                        <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                    </FormItem>
                </Col>
            </Row>
        </FormItem> -->



                <FormItem label="级别" style="width:40%">
                    <Select v-model="rulesFrom.rule_type">
                        <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医院" v-if="rulesFrom.rule_type==1">
                    {{hospName}}
                </FormItem>
                <FormItem label="数据类型">
                    {{dataTypeName}}
                </FormItem>
                <FormItem label="表头映射">
                      <span style="color:red;font-weight:600;margin-left:40%">注：合并列请用“+”拼接映射！例：A+B+C</span>
                    <Table border :columns="headerCol" :data="backHeaderList"></Table>
                </FormItem>
                <FormItem>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="save">保存</Button>
                </FormItem>
            </Form>
        </div>


        <div style="height:300px;" class="table-container">
             <p style="width:80%;">文件表头预览</p>
            <Form  ref="queryData" style="width:90%;overflow-y:auto">
                <Tabs :value="tabName" @on-click="showBTdata">
                <TabPane v-for="(item,index) in tabDatas" :label="item.label" :name="item.name" :key="index" style="overflow-y:auto">
                   <table class="common-table" style="overflow:auto">
                       <thead>
                      <th v-for="head in showDatas">{{head}}</th>
                        </thead>
                        <tbody>
                         <tr v-for="(item,index) in dataList" v-if="index>0">
                            <td  class="ellipsis" v-for="cell in item" style="width:100px">
                                <span>
                                    {{cell}}
                                </span>
                            </td>
                        </tr>

                        </tbody>
                   </table>
                    
                 
                </TabPane>
                </Tabs>
            </Form>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
import commonJson from "@/assets/data/business/common.json";
import columns from "@/assets/data/business/cloumnCommon.json";
export default {
    components: { EmptyRow, CustomTable },
    name: "headerMappingAdd",
    data() {
        return {
            showModal:false,
            exceldatatmp:[],
            dataList:[],
            showDatas:[],
            tabName:'',
            tabDatas:[],
            /*tabDatas:[
                {
                label:'aaa',
                name:'name1'

                },
                {
                label:'bbb',
                name:'name2'
                },
                {
                label:'ccc',
                name:'name3'
                },
            ],*/
            checkBoxList: [], //多选框集合
            gradeList: commonJson.gradeList, //级别
            dataTypeName: "", //数据类型
            hospId: 0, //医院id
            hospName: "", //医院名称
            dataType: 0, //数据类型
            unmatchHead: "", //表头
            fileNo: "", //文件标识
            rulesFrom: {
                rule_type: 1
            },

            headerMapedCol:[
                {
                 text: "非标准字段",
                    name: "headName",
                    align: "center",
                    // render: (h, params) => {
                    //     return h("Input", {
                    //         props: {
                    //             value: this.backHeaderList[params.index]
                    //                 .head_name,
                    //             // style: "width:100%;height:25px;border:0;",
                    //             maxlength: 50
                    //         },
                    //         on: {
                    //             input: event => {
                    //                 this.backHeaderList[
                    //                     params.index
                    //                 ].head_name = event;
                    //             }
                    //         }
                    //     });
                    // }
                    },
                    {
                        title:"对应标准字段",
                        key: "baseHeadName",
                        align: "center"
                    }
            ],
            headerCol: [
                {
                    title: "标准字段",
                    key: "base_head_name",
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "Select",
                            {
                                props: {
                                    value: this.backHeaderList[params.index]
                                        .base_head_name,
                                        transfer:true
                                    
                                    // style: "width:100%;height:33px;"
                                },
                                on: {
                                    input: event => {
                                        this.backHeaderList[
                                            params.index
                                        ].base_head_name = event;
                                    }
                                }
                            },
                            this.checkBoxList.map(function(type) {
                                return h(
                                    "Option",
                                    {
                                        props: { value: type.databaseFieldName }
                                    },
                                    type.title
                                );
                            })
                        );
                    }
                },
                {
                    title: "非标准字段",
                    key: "head_name",
                    align: "center",
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                value: this.backHeaderList[params.index]
                                    .head_name,
                                // style: "width:100%;height:25px;border:0;",
                                maxlength: 50
                            },
                            on: {
                                input: event => {
                                    this.backHeaderList[
                                        params.index
                                    ].head_name = event;
                                }
                            }
                        });
                    }
                    // render: (h, params) => {
                    //     return h("Input", {
                    //         props: {
                    //             value: this.backHeaderList[params.index]
                    //                 .head_name,
                    //             readonly: false
                    //         }
                    //     });
                    // }
                },
                {
                    title: "英文字段",
                    key: "en_column_name",
                    align: "center",
                    render: (h, params) => {
                        return h("Input", {
                            props: {
                                value: this.backHeaderList[params.index]
                                    .base_head_name,
                                maxlength: 30,
                                readonly: true
                            }
                        });
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small"
                                    },
                                    style: {
                                        color: "red"
                                    },
                                    on: {
                                        click: () => {
                                            if (
                                                this.backHeaderList.length <= 1
                                            ) {
                                                this.$Message.error(
                                                    "表头映射至少要包含一条数据。"
                                                );
                                            } else {
                                               
                                                    this.backHeaderList.splice(
                                                        params.index,
                                                        1
                                                    );
                                                    
                                                
                                                 
                                            }
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            backHeaderList: [], //返回表头映射数据
            commonHeadMapList:[],
            speicalHeadMapList:[],
            headerList: [
                {
                    base_head_name: "",
                    // head_name: "",
                    en_column_name: ""
                }
            ]
        };
    },
    mounted() {
        //页面传值
        this.hospId = this.$route.query.hospId;
        this.hospName = this.$route.query.hospName;
        this.dataType = this.$route.query.dataType;
        this.unmatchHead = this.$route.query.unmatchHead;
        this.fileNo = this.$route.query.fileNo;
        this.queryData();
                        alert(111);

        this.queryCommonHeaders(this.dataType,this.hospId);
        this.queryCommonHeaders(this.dataType,null);
        
        //数据类型
        let passName = {
            title: "过滤",
            databaseFieldName: "pass_name"
        };
        this.checkBoxList.push(passName);
        if (this.dataType == 10) {
            this.dataTypeName = "购药";
            this.checkBoxList.push.apply(
                this.checkBoxList,
                columns.columnGouyao
            );
        } else if (this.dataType == 20) {
            this.dataTypeName = "门急诊";
            this.checkBoxList.push.apply(
                this.checkBoxList,
                columns.columnMenjizhen
            );
        } else if (this.dataType == 30) {
            this.dataTypeName = "病案";
            this.checkBoxList.push.apply(
                this.checkBoxList,
                columns.columnBingan
            );
        } else if (this.dataType == 40) {
            this.dataTypeName = "医嘱";
            this.checkBoxList.push.apply(
                this.checkBoxList,
                columns.columnYizhu
            );
        }

        //组合数据
        this.unmatchHead.split(",").forEach(m => {
            let model = {
                base_head_name: "",
                head_name: m,
                en_column_name: ""
            };
            this.backHeaderList.push(model);
        });
    },
    methods: {



        
        //取消
        cancel() {
            this.$router.back();
        },
        //保存
        save() {
            let state = true;
            this.backHeaderList.forEach(a => {
                if (a.base_head_name == "") {
                    this.$Message.error("表头映射数据内容不能为空");
                    state = false;
                }
            });
            //过滤掉head_name为空的数据
            this.backHeaderList=this.backHeaderList.filter(x=>x.head_name!="")
            if(this.backHeaderList.length==0) return;
            if (state) {
                var self = this;
                Vue.ajax.send({
                    name: "initial.addRule",
                    data: {
                        rule_type: self.rulesFrom.rule_type,
                        date_type: self.dataType,
                        hospId:
                            self.rulesFrom.rule_type == "0"
                                ? null
                                : self.hospId,
                        headerData: self.backHeaderList,
                        fileNo: self.fileNo
                    },
                    success: function(data) {
                        if (!!data && data.code == "0") {
                            self.$router.push("/business/headerMapped");
                            // self.$Message.success("操作成功。");
                            let mess=data.message.substring(0,data.message.length-2).split("##");
                            for (let i = 0; i < mess.length; i++) {
                                if (mess[i].substring(mess[i].length-1,mess[i].length)=='0') {
                                    self.$Message.success(mess[i].substring(0,mess[i].length-1));
                                }else{
                                    self.$Message.error(mess[i].substring(0,mess[i].length-1));
                                }
                            }
                        } else {
                            self.$Modal.error({
                                title: "失败",
                                content: data.message
                            });
                        }
                    }
                });
            }
        },


        queryCommonHeaders(dataType,hospId){

                var self = this;
            Vue.ajax.send({
                name: "header.queryHeaderData",
                data: {
                    pageIndex: 1,
                    pageSize: 30,
                    dataType:dataType,
                    hospId:hospId                },
                 success: function(data) {
                   
                    if (!!data && data.code == "0") {
                        console.log(data);
                        if(hospId == null){
                            self.commonHeadMapList = data.dataList;
                        }
                        else if(hospId != null){
                            self.speicalHeadMapList = data.dataList;
                        }
        }
                 }
                 });
            }
            ,
        showBTdata(name){
            var self = this;
            var index = parseInt(name.replace("name",""));
            var titles = self.exceldatatmp[index][0];
            self.dataList=self.exceldatatmp[index];
            self.showDatas=titles;
        },
        
        queryData(){
            var self = this;
            Vue.ajax.send({
                name: "header.queryExcelData",
                data: {
                    pageIndex: 1,
                    pageSize: 99999,
                    fileNo: this.$route.query.fileNo
                },
                success: function(data) {
                    console.log(data);
                   
                    if (!!data && data.code == "0") {
                        //接口数据
                       var exceldata = data.data.data;

                       //tab页的展现
                       let index=0;
                       exceldata[0].forEach(m => {
                         self.tabDatas.push({label:m,name:"name"+index});
                         index=index+1;
                       }); 
                       //赋值数据
                       if(exceldata[0].length>1){
                            self.exceldatatmp = exceldata[1];
                            var titles = exceldata[1][0][0];
                            self.dataList=exceldata[1][0];
                            self.showDatas=titles;
                       }else{
                           if(exceldata[0][0].indexOf("tmp")<0){
                                var titles = exceldata[1][0];
                                self.dataList=exceldata[1];
                                self.showDatas=titles;
                                console.log(exceldata[1]);
                           }else{
                                var titles = exceldata[1][0][0];
                                self.dataList=exceldata[1][0];
                                self.showDatas=titles;
                                console.log(exceldata[1]);
                           }
                          
                       }
                     
                       
                    } else {
                        this.$Modal.error({
                            title: "",
                            content: data.data.data.message
                        });
                    }
                }
            });
        }

    }
};
</script>
<style scoped>
.common-table td,
.common-table th {
    border-right: 1px solid #e8eaec;
    border-bottom: 1px solid #e8eaec;
    padding: 2px 12px;
    width: 300px !important
}

td.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: revert !important;
}

</style>