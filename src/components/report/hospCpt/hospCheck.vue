<template>
	<div>
    <CustomTable key='hospitalCheckCol'  :columnConfig='hospitalCheckCol' :columnDatas='hospitalCheck' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
            <tr v-for="(item,index) in showDatas" :key="index">
              <td class="ellipsis" v-for="(col) in hospitalCheckCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{hospitalCheckCol.find(m=>m.name==col.name).render?hospitalCheckCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
              
                
              <td>
                  <Button v-authorize="'hospitalregistercheck'" icon="md-create" :disabled="item.state!=0" size="small" title="审核" class="btn-orange" type="primary" @click='beginCheck(item)'></Button>
                  <Button v-authorize="'hospitalregisterdelete'" icon="md-close" :disabled="item.state==0" size="small"   title="删除" type="error" class="btn-red" @click='deleteConfirm(item)'></Button>
                </td>
            </tr>
    </CustomTable>

    <EmptyRow v-if="!hospitalCheck || hospitalCheck.length==0"/>

    <Modal title="医院登记表审核" class-name="vertical-center-modal" :styles="{top:'120px',marginBottom:'20px'}"   v-model="checkShow" width='700'>
        <Form  :label-width="100">
            <FormItem label="医院">
                <h3>{{checkInfo.hospitalName}}</h3>
            </FormItem>               
            <FormItem label="修改时间" prop="userName">
                <span>{{checkInfo.createTime}}</span>
            </FormItem>
            <Table border :columns="checkInfoCol" :data="checkInfoList" height="500"></Table>
          </Form>
          <div slot="footer">
              <Input type="text" v-model='rejectReason' style="max-width:500px;" :maxlength="100" placeholder="请输入不通过原因"></Input>
              <Button type="error"  @click="checkInfoNot">不通过</Button>
              <Button type="primary"  @click="checkInfoOk">通过</Button>
          </div>
    </Modal> 
	</div>
</template>
<script>
import Vue from "vue";
import infos from "@/assets/data/report/hospInfo";
import EmptyRow from '../../common/EmptyRow';
import CustomTable from "../../common/GridTable";
export default {
  name: "hospCheck",
  components:{EmptyRow,CustomTable},
  props: {
    hospitalCheck: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
          column: "",
          asc: true
      },
      checkShow: false,
      checkInfo: [],
      rejectReason:'',
      checkIndex: null,
      checkList: {},
      infoAll: [],
      checkInfoList: [],
      hospitalCheckCol: [
        {
          text: "医院",
          name: "hospitalName",
          sortable: true,
          moveable: true,
          width:250,
        },
        {
          text: "省份",
          name: "provinceName",
          width:200,
          sortable: true,
          moveable: true,
        },
        {
          text: "城市",
          name: "cityName",
          width:200
        },
        {
          text: "修改人",
          name: "chargeUser",
          width:150,
        },
        {
          text: "修改日期",
          name: "createTime",
          width:200,
          render:(params)=>{
              return params.createTime.substr(0,19);
          }
        },
        {
          text: "医院联系方式",
          name: "telphone",
          width:150,
        },
        {
          text: "医院电子邮箱",
          name: "email",
          width:180,
        },
        {
          text: "审核状态",
          name: "state",
          width:150,
          render:(params)=>{
              if(params.state==0){
                  return '未审核';
              }
              return '驳回';
          }
        },
        {
          text: "操作",
          width: 150,
          name: "op",
          filterable: false,
          removeable: false,
        }
      ],
      checkInfoCol: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "旧数据",
          key: "oldValue"
        },
        {
          title: "新数据",
          key: "newValue"
        }
      ]
    };
  },
  mounted: function() {
    console.log(this.hospitalCheck);
    // this.checkInfoList=this.hospitalCheck
  },
  methods: {
    getCheck(hospId) {
      var self = this;
      Vue.ajax.send({
        name: "hospital.check",
        data: { hospId: hospId },
        success: function(data) {
          if (!!data && data.code == "0") {
              self.checkList={}
            Object.keys(data.data.content).forEach(key => {
              self.checkList[key] = JSON.parse(data.data.content[key]);
            });
            console.log("parm",self.checkList);
            self.checkInfoList = [];
            Object.keys(self.checkList).forEach(key => {
              var arr = self.checkList[key];
              arr.forEach(item => {
                if (item) {
                  if (key == 1) {
                    Object.keys(item).forEach(currentKey => {
                      var name = infos.basicInfo[currentKey];
                      if (name) {
                        var oldValue = self.infoAll[key][currentKey];
                        self.checkInfoList.push({
                          name: name,
                          oldValue: self.getValueByName(currentKey,1,oldValue || ""),
                          newValue: self.getValueByName(currentKey,1,item[currentKey])
                        });
                      }
                    });
                  }
                  else if (key == 2){
                      Object.keys(item).forEach(currentKey => {
                      var name = infos.chargeInfo[currentKey];
                      if (name) {
                        var oldValue = self.infoAll[key].filter(m=>m.hospChargeId==item["hospChargeId"]).length>0?self.infoAll[key].filter(m=>m.hospChargeId==item["hospChargeId"])[0][currentKey]:"";
                        self.checkInfoList.push({
                          name: name,
                          oldValue: oldValue || "",
                          newValue: item[currentKey]
                        });
                      }
                    });
                  }
                  else if (key == 3){
                      Object.keys(item).forEach(currentKey => {
                      var name = infos.chargeInfo[currentKey];
                      if (name) {
                        var oldValue = self.infoAll[key].filter(m=>m.uploadChargeId==item["uploadChargeId"]).length>0?self.infoAll[key].filter(m=>m.uploadChargeId==item["uploadChargeId"])[0][currentKey]:"";
                        self.checkInfoList.push({
                          name: name,
                          oldValue: oldValue || "",
                          newValue: item[currentKey]
                        });
                      }
                    });
                  }else if (key == 4){
                      Object.keys(item).forEach(currentKey => {
                      var name = infos.systemInfo[currentKey];
                      if (name) {
                        var oldValue = self.infoAll[key].filter(m=>m.infoSystemId==item["infoSystemId"]).length>0?self.infoAll[key].filter(m=>m.infoSystemId==item["infoSystemId"])[0][currentKey]:"";
                        self.checkInfoList.push({
                          name: name,
                          oldValue: self.getValueByName(currentKey,4,oldValue || ""),
                          newValue: self.getValueByName(currentKey,4,item[currentKey])
                        });
                      }
                    });
                  }else if (key == 5){
                      Object.keys(item).forEach(currentKey => {
                      var name = infos.drugInfo[currentKey];
                      if (name) {
                        var oldValue = self.infoAll[key].filter(m=>m.infoSystemId==item["infoSystemId"]).length>0?self.infoAll[key].filter(m=>m.infoSystemId==item["infoSystemId"])[0][currentKey]:"";
                        self.checkInfoList.push({
                          name: name,
                          oldValue: oldValue || "",
                          newValue: item[currentKey]
                        });
                      }
                    });
                  }else if (key == 6){
                      Object.keys(item).forEach(currentKey => {
                      var name = infos.sectionInfo[currentKey];
                      if (name) {
                        var oldValue = self.infoAll[key].filter(m=>m.hospSectionId==item["hospSectionId"]).length>0?self.infoAll[key].filter(m=>m.hospSectionId==item["hospSectionId"])[0][currentKey]:"";
                        self.checkInfoList.push({
                          name: name,
                          oldValue: oldValue || "",
                          newValue: item[currentKey]
                        });
                      }
                    });
                  }
                }
              });
            });
            console.log("列表",self.checkInfoList);
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getInfoAll(hospId) {
      var self = this;
      Vue.ajax.send({
        name: "hospital.infoAll",
        data: { hospId: hospId },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.infoAll = data.data;
            console.log(self.infoAll);
            self.getCheck(hospId);
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    checkInfoOk() {
      var self = this;
      var content={};
      Object.keys(self.checkList).forEach(key=>{
          content[key]=JSON.stringify(self.checkList[key])
      })
      Vue.ajax.send({
        name: "hospital.editCheck",
        data: {
          hospitalId: self.checkInfo.hospitalId,
          content: content,
          createUser: Vue.getUser().userName
        },
        success: function(data) {
          self.$emit('refreshHospitalCheck');
          if (!!data && data.code == "0") {
            self.checkShow = false;
            self.hospitalCheck=self.hospitalCheck.filter(m=>m.hospitalId!=self.checkInfo.hospitalId);
            self.$Message.success("审核完成!");
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    checkInfoNot() {
      var self = this;

      if(Vue.isNull(self.rejectReason)){
        self.$Modal.error({
              title: "请输入不通过原因",
              content: ""
            });
        return;
      }

      var content={};
       Object.keys(self.checkList).forEach(key=>{
          content[key]=JSON.stringify(self.checkList[key])
      })
      Vue.ajax.send({
        name: "hospital.editCheckNot",
        data: {
          hospitalId: self.checkInfo.hospitalId,
          content: content,
          createUser: Vue.getUser().userName,
          rejectReason:self.rejectReason
        },
        success: function(data) {
          self.$emit('refreshHospitalCheck');
          if (!!data && data.code == "0") {
            self.checkShow = false;
            self.hospitalCheck[self.checkIndex].state = 2;
            self.hospitalCheck=self.hospitalCheck.map(m=>{
              if(m.hospitalId==self.checkInfo.hospitalId){
                m.state=2
              }
              return m;
            });
            self.$Message.success("驳回成功!");
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    deleteInfo(hospitalId){
      var self = this;
      Vue.ajax.send({
        name: "hospital.deleteCheck",
        data: {
          hospitalId: hospitalId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.hospitalCheck=self.hospitalCheck.filter(m=>m.hospitalId!=item.hospitalId);
            self.$Modal.remove();
            self.$Message.success("删除成功!");
            
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getValueByName(name,type,defaultValue){
      
      var newValue=""+(defaultValue);
      if(type==1){
        var dic=infos.basicInfo;
        if(name=="hospAttached"){
          if(newValue=="1"){
            newValue="中央";
          }
          if(newValue=="2"){
            newValue="省级";
          }
          if(newValue=="3"){
            newValue="市级";
          }
          if(newValue=="4"){
            newValue="县级";
          }
          if(newValue=="7"){
            newValue="区级";
          }
          if(newValue=="5"){
            newValue="部队";
          }
          if(newValue=="8"){
            newValue="行业";
          }
          if(newValue=="0"){
            newValue="其他";
          }
        }
        if(name=="hospGrade"){
          if(newValue=="1"){
            newValue="三甲";
          }
          if(newValue=="2"){
            newValue="三乙";
          }
          if(newValue=="4"){
            newValue="二甲";
          }
          if(newValue=="5"){
            newValue="二乙";
          }
          if(newValue=="0"){
            newValue="其他";
          }
        }
        if(name=="hospLevel"){
          if(newValue=="3"){
            newValue="三级";
          }
          if(newValue=="2"){
            newValue="二级";
          }
          if(newValue=="0"){
            newValue="其他";
          }
        }
        if(name=="hospType"){
          if(newValue=="2"){
            newValue="综合医院";
          }
          if(newValue=="1"){
            newValue="专科医院";
          }
          if(newValue=="0"){
            newValue="其他";
          }
        }
      }
      if(type==4){
        console.log(name,newValue)
        if(name=="isWardHis"){
           if(newValue=="0"){
            newValue="是";
          }
          if(newValue=="1"){
            newValue="否";
          }
        }
        if(name=="isMedicalRecord"){
           if(newValue=="0"){
            newValue="是";
          }
          if(newValue=="1"){
            newValue="否";
          }
        }
        if(name=="isOutpatientHis"){
           if(newValue=="0"){
            newValue="是";
          }
          if(newValue=="1"){
            newValue="否";
          }
        }
        if(name=="isOutPatient"){
           if(newValue=="0"){
            newValue="是";
          }
          if(newValue=="1"){
            newValue="否";
          }
        }
      }
      return newValue;
    },
    beginCheck:function(item){
      this.checkInfo = item;
      this.checkShow = true;
      this.getInfoAll(item.hospitalId);
    },
    deleteConfirm:function(item){
        this.$Modal.confirm({
            title: '确定删除',
            content: '<p>确定要删除此条记录吗？</p>',
            loading: true,
            onOk: () => {
                this.deleteInfo(item.hospitalId);
            },
            onCancel: () => {
                
            }
        });
    },
    sortColumn: function(column, asc) {
            this.currentSort.column = column;
            this.currentSort.asc = asc;
        },
    showData: function(datas, showColumns) {
        this.showDatas = datas;
        var self = this;
        if (this.currentSort.column != "") {
            if (this.currentSort.column == "readCount") {
            this.showDatas.sort(
                (a, b) =>
                this.currentSort.asc
                    ? a[this.currentSort.column] - b[this.currentSort.column]
                    : b[this.currentSort.column] - a[this.currentSort.column]
            );
            } else {
            this.showDatas.sort(
                (a, b) =>
                this.currentSort.asc
                    ? (a[this.currentSort.column] || "").localeCompare(
                        b[this.currentSort.column]
                    )
                    : (b[this.currentSort.column] || "").localeCompare(
                        a[this.currentSort.column]
                    )
            );
            }
        }
        this.showColumns = showColumns;
    }
  }
};
</script>
<style scoped>
  @media screen and (max-width:1366px) {
  .bg{
    height:380px;
  }
}
</style>
