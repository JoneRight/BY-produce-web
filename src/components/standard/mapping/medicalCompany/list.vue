<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">生产企业</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
		       
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="集团名称" :label-width="40">
                  <Input v-model="searchForm.blocName" type="text" placeholder="请输入集团名称" style="width: 160px;" />

                    <!-- <Select v-model="searchForm.blocId"  filterable clearable remote :remote-method="getBlocList" style="width: 100px;">
                        <Option v-for="item in blocList" :value="item.Id" :key="item.value">{{ item.name }}</Option>
                    </Select> -->
                </FormItem>
                <FormItem label="省市" :label-width="40">		        	
		            <Cascader :data="addressList" trigger="hover" v-model="searchForm.address" change-on-select style="width: 200px"></Cascader>
		        </FormItem>
		        <FormItem>
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入生产企业名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedMedicalCompanyAdd'" type="primary"  @click="add()">新增</Button>
		        </FormItem>
		    </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedMedicalCompanyList'" :columnConfig='medicalCol' :columnDatas='medicalList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in medicalCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{medicalCol.find(m=>m.name==col.name).render?medicalCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedMedicalCompanyAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='medicalInfo = Object.assign({},item);medicalOk(2);'></Button>
                  <Button v-authorize="'MappedMedicalCompanyAudit'" v-if='item.statusId == 1 || item.statusId == 2' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;medicalInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedMedicalCompanyEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editGo(item)'></Button>
                  
                  <Button v-authorize="'MappedMedicalCompanyIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedMedicalCompanyState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedMedicalCompanyDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="medicalList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>

        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="medicalOk(3)">
            <Form :model="medicalInfo" :label-width="90">
                <input type="hidden" v-model="medicalInfo.company"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="medicalInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.unauditreasonId">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="medicalInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                </FormItem>
            </Form>
        </Modal> 
        
    </div>
</template>


<script>
import Vue from "vue";
import EmptyRow from "../../../common/EmptyRow";
import CustomTable from "../../../common/GridTable";
//公用json串，不需要访问后台
import reviewStateJson from "@/assets/data/dicBase/reviewState.json";

export default {
  name: "medical",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      showModal: false,
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      searchForm: {
        address: [],
        keywords: "",
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      addressList: [],
      medicalList: [],
      blocList:[],
      medicalInfo: {},
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      medicalCol: [
        {
          text: "生产企业编码",
          name: "company",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "生产企业",
          name: "companyName",
          sortable: true,
          moveable: true,
          width: 150
        },
        // {
        //     text: '生产企业曾用名',
        //     name: "originalCompanyName",
        //     sortable: true,
        //     moveable: true,
        //     width: 200
        // },
        {
          text: "中文简称",
          name: "chineseShort",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "企业法人",
          name: "enterpriseLegal",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "集团名称",
          name: "blocName",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "国家",
          name: "nation",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "所在省",
          name: "provinceName",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "所在市",
          name: "cityName",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "生产企业类型",
          sortable: true,
          moveable: true,
          name: "companyType",
          width: 150,
          render: params => {
            if (params.companyType == 0) {
              return "无";
            } else if (params.companyType == 1) {
              return "外资/合资企业";
            } else if (params.companyType == 2) {
              return "内资企业";
            } else if (params.companyType == 3) {
              return "台港澳/合资企业";
            } else if (params.companyType == 4) {
              return "已经吊销";
            }
          }
        },
        // {
        //     text: '是否会员',
        //     name: 'isMembers',
        //     sortable: true,
        //     moveable: true,
        //     width: 130
        // },
        // {
        //     text: '会员等级',
        //     name: 'memberGrade',
        //     sortable: true,
        //     moveable: true,
        //     width: 130
        // },
        // {
        //     text: '是否绑定权限',
        //     name: 'isBindingPurview',
        //     sortable: true,
        //     moveable: true,
        //     width: 150
        // },
        {
          text: "地址",
          name: "companyAddress",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "联系方式",
          name: "contact",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "手机号",
          name: "telephone",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "邮箱",
          name: "email",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "传真",
          name: "fax",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 100,
          render: params => {
            if (params.statusId == 0) {
              return "停用";
            } else if (params.statusId == 1) {
              return "待审批";
            } else if (params.statusId == 2) {
              return "通过";
            } else if (params.statusId == 3) {
              return "不通过";
            } else if (params.statusId == 4) {
              return "发布";
            }
          }
        },
        {
          text: "创建人",
          name: "createUser",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "创建时间",
          name: "createTime",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "修改人",
          name: "changeUser",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "修改时间",
          name: "changeTime",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "审核人",
          name: "checkUser",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "审核时间",
          name: "checkTime",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "审核不通过原因",
          name: "checkNoReason",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "审核不通过备注",
          name: "checkNoReasonMemo",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "备注",
          name: "remark",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "操作",
          name: "op",
          filterable: false,
          removeable: false,
          width: 180
        }
      ]
    };
  },
  activated: function() {
    this.getAddressList();
    this.getMedicalList();
  },
  methods: {
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.companyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "medical.del",
            data: {
              company: item.company,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("生产企业信息删除成功");
                self.getMedicalList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    },
    getBlocList(query) {
      //商品名
      var self = this;
      Vue.ajax.send({
        name: "medicalCompany.getBlocList",
        data: {
          pageIndex: 1,
          pageSize: 50,
          drugTradeName: query
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.blocList = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    openConfirm(item) {
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.companyName + "”？"
            : "确定要停用“" + item.companyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "medical.review",
            data: {
              company: item.company,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("生产企业信息启用成功")
                  : self.$Message.info("生产企业信息停用成功");
                self.getMedicalList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    },
    pubConfirm(item) {
      this.$Modal.confirm({
        title: "发布确认",
        content: "确定要发布“" + item.companyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "medical.review",
            data: {
              company: item.company,
              statusId: 4,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("生产企业信息发布成功");
                self.getMedicalList();
              } else {
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        }
      });
    },
    editGo(item) {
      this.$router.push({
        path: "/standard/mapping/medicalCompany/add",
        query: {
          //query传值不会因为刷新页面导致数据丢失
          Id: item.company,
          type: 1
        }
      });
    },
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A34",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.medicalInfo.checkNoReason =
              self.checkNoReasonList[0].dictionaryName;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getAddressList() {
      var self = this;
      Vue.ajax.send({
        name: "common.adressList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.addressList = data.data;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getMedicalList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "medical.list",
        data: {
          companyName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          province:
            self.searchForm.address.length == 1
              ? self.searchForm.address[0]
              : null,
          city:
            self.searchForm.address.length == 2
              ? self.searchForm.address[1]
              : null,
          statusId: self.searchForm.statusId,
          blocName:self.searchForm.blocName
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.medicalList = data.data.dataList;
            self.pageConfig.totalItemCount = data.data.totalItemCount;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    changePage(currentPage) {
      this.pageConfig.pageNum = currentPage;
      this.getMedicalList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getMedicalList();
    },
    medicalOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "medical.review",
        data: {
          company: self.medicalInfo.company,
          statusId: value,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          checkNoReason: value == 2 ? "" : self.medicalInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.medicalInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            value == 2 ? (self.editModel = false) : (self.noPassModel = false);

            value == 2
              ? self.$Message.success("生产企业通过信息提交成功！")
              : self.$Message.success("生产企业不通过信息提交成功！");

            self.getMedicalList();
          } else {
            setTimeout(() => {
              self.loading = false;
              self.$nextTick(() => {
                self.loading = true;
              });
            }, 0);
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    add() {
      this.$router.push({
        path: "/standard/mapping/medicalCompany/add",
        query: {
          type: 2
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
        if (
          this.currentSort.column == "companyType" ||
          this.currentSort.column == "statusId"
        ) {
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
table {
  width: 100%;
  overflow-y: auto;
}
table td {
  max-width: 300px;
}

.page-footer button {
  position: absolute;
  right: 40px;
  top: 3px;
}
.page-footer .text-center {
  position: relative;
  display: block;
  width: 100%;
}
</style>