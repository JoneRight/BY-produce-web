<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">批发企业</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                
                <FormItem label="状态" :label-width="40">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="省市" :label-width="40">		        	
		            <Cascader :data="addressList" trigger="hover" v-model="searchForm.address" change-on-select style="width: 200px"></Cascader>
		        </FormItem>
		        <FormItem label="批发企业名称" :label-width="70">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入批发企业名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedSaleEnterpriseAdd'" type="primary"  @click="add">新增</Button>
		        </FormItem>
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedSaleEnterpriseList'" :columnConfig='wholesaleCompanyCol' :columnDatas='wholesaleCompanyList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in wholesaleCompanyCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{wholesaleCompanyCol.find(m=>m.name==col.name).render?wholesaleCompanyCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedSaleEnterpriseAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='wholesaleCompanyInfo = Object.assign({},item);wholesaleCompanyOk(2);'></Button>
                  <Button v-authorize="'MappedSaleEnterpriseAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;wholesaleCompanyInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedSaleEnterpriseEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editGo(item)'></Button>
                  
                  <Button v-authorize="'MappedSaleEnterpriseIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedSaleEnterpriseState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedSaleEnterpriseSee'" class='btn-deep-blue' icon="ios-rewind" size="small" title="查看历史版本" type="primary" @click='version(item)'></Button>
                  <Button v-authorize="'MappedSaleEnterpriseDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="wholesaleCompanyList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>
        
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="wholesaleCompanyOk(3)">
            <Form :model="wholesaleCompanyInfo" :label-width="90">
                <input type="hidden" v-model="wholesaleCompanyInfo.salecompanyId"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="wholesaleCompanyInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.unauditreasonId">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="wholesaleCompanyInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "wholesaleCompany",
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
        keywords: "",
        address: [],
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      wholesaleCompanyForm: {
        wholesaleCompany: "",
        wholesaleCompanyName: "",
        statusId: "",
        createUser: "",
        createTime: "",
        changeUser: "",
        changeTime: "",
        checkUser: "",
        checkTime: "",
        remark: ""
      },
      loadingAdd: true,
      loading: true,
      wholesaleCompanyList: [],
      addressList: [],
      checkNoReasonList: [],
      wholesaleCompanyInfo: {},
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      noPassModel: false, // 弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        wholesaleCompanyName: [
          { required: true, message: "批发企业不能为空", trigger: "blur" }
        ]
      },
      wholesaleCompanyCol: [
        {
          text: "批发企业编码",
          name: "salecompanyId",
          sortable: true,
          moveable: true,
          width: 160
        },
        {
          text: "批发企业",
          name: "salecompanyName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "中文简称",
          name: "salecompanyShortname",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "企业法人",
          name: "salecompanyLegal",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "组织机构代码",
          name: "organ",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "企业类型",
          name: "companyType",
          sortable: true,
          moveable: true,
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
        {
          text: "企业地址",
          name: "salecompanyAddress",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "联系人",
          name: "contact",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "国家",
          name: "nation",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "所在省",
          name: "provinceName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "所在市",
          name: "cityName",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "电话",
          name: "telephone",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "邮箱",
          name: "email",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "传真",
          name: "fax",
          sortable: true,
          moveable: true,
          width: 150
        },
        {
          text: "邮编",
          name: "postcode",
          sortable: true,
          moveable: true,
          width: 100
        },
        {
          text: "集团编码",
          name: "wholesaleBlocId",
          sortable: true,
          moveable: true,
          width: 110
        },
        {
          text: "状态",
          name: "statusId",
          sortable: true,
          moveable: true,
          width: 150,
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
          width: 150
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
          width: 150
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
          width: 150
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
          width: 150
        },
        {
          text: "操作",
          name: "op",
          width: 200,
          filterable: false,
          removeable: false
        }
      ]
    };
  },
  activated: function() {
    this.getAddressList();
    this.getWholesaleCompanyList();
  },
  methods: {
    deleteConfirm(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.salecompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "wholesaleCompany.del",
            data: {
              salecompanyId: item.salecompanyId
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("批发企业信息删除成功");
                self.getWholesaleCompanyList();
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
        content: "确定要发布“" + item.salecompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "wholesaleCompany.review",
            data: {
              salecompanyId: item.salecompanyId,
              statusId: 4,
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("批发企业信息发布成功");
                self.getWholesaleCompanyList();
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
    openConfirm(item) {
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.salecompanyName + "”？"
            : "确定要停用“" + item.salecompanyName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "wholesaleCompany.review",
            data: {
              salecompanyId: item.salecompanyId,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("批发企业信息启用成功")
                  : self.$Message.info("批发企业信息停用成功");
                self.getWholesaleCompanyList();
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
        path: "/standard/mapping/saleEnterprise/add",
        query: {
          //query传值不会因为刷新页面导致数据丢失
          Id: item.salecompanyId,
          type: 1
        }
      });
    },
    version(item) {
      this.$router.push({
        path: "/standard/mapping/saleEnterprise/version",
        query: {
          Id: item.salecompanyId
        }
      });
    },
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A40",
          statusId: 2,
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.wholesaleCompanyInfo.checkNoReason =
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
    getWholesaleCompanyList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "wholesaleCompany.list",
        data: {
          salecompanyName: self.searchForm.keywords,
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
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.wholesaleCompanyList = data.data.dataList;
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
      this.getWholesaleCompanyList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getWholesaleCompanyList();
    },
    add() {
      this.$router.push({
        path: "/standard/mapping/saleEnterprise/add",
        query: {
          type: 2
        }
      });
    },
    wholesaleCompanyOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "wholesaleCompany.review",
        data: {
          salecompanyId: self.wholesaleCompanyInfo.salecompanyId,
          statusId: value,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          checkNoReason:
            value == 2 ? "" : self.wholesaleCompanyInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.wholesaleCompanyInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.noPassModel = false;

            value == 2
              ? self.$Message.success("批发企业通过信息提交成功！")
              : self.$Message.success("批发企业不通过信息提交成功！");

            self.getWholesaleCompanyList();
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
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

