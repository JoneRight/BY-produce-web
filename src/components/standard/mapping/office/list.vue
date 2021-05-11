<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <h2 class="common-title">科室</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="状态" :label-width="60">
                    <Select v-model="searchForm.statusId" filterable clearable style="width: 100px;">
                        <Option v-for="item in reviewStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
		        <FormItem label="科室名称" :label-width="80">
		            <Input v-model="searchForm.keywords" type="text" placeholder="请输入科室名称" style="width: 260px;" />
		        </FormItem>
		        <FormItem>
		            <Button type="primary" @click="changePage(1)">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button v-authorize="'MappedOfficeAdd'" type="primary"  @click="addModal">新增</Button>
		        </FormItem>
		    </Form>
        </div>

        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'MappedOfficeList'" :columnConfig='sectionCol' :columnDatas='sectionList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-for="(col) in sectionCol.filter(m=>m.name!='op')" :key='col.name' v-if="showColumns.indexOf(col.name)>-1">{{sectionCol.find(m=>m.name==col.name).render?sectionCol.find(m=>m.name==col.name).render(item):item[col.name]}}</td>
                  <td>
                  <Button v-authorize="'MappedOfficeAudit'" v-if='item.statusId == 1' class='btn-green' icon="md-checkmark-circle" size="small" title="通过" type="success" @click='sectionInfo = Object.assign({},item);sectionOk(2);'></Button>
                  <Button v-authorize="'MappedOfficeAudit'" v-if='item.statusId == 1' class='btn-red' icon="md-close-circle" size="small" title="不通过" type="error" @click='noPassModel = true;sectionInfo = Object.assign({},item);getAuditList();'></Button>
                  <Button v-authorize="'MappedOfficeEdit'" class='btn-green' icon="md-create" size="small" title="编辑" type="success" @click='editModel = true;sectionInfo = Object.assign({},item);editTitle = "编辑";okText = "确定";cancelText = "取消";'></Button>
                  
                  <Button v-authorize="'MappedOfficeIssus'" v-if='item.statusId == 2' class='btn-orange' icon="md-paper-plane" size="small" title="发布" type="warning" @click='pubConfirm(item)'></Button>
                  <Button v-authorize="'MappedOfficeState'" v-if='item.statusId == 0 || item.statusId == 4' :class="item.statusId == 0 ? 'btn-deep-blue' : 'btn-red'" :icon="item.statusId == 0 ? 'md-play' : 'md-remove'" size="small" :title="item.statusId == 0 ? '启用' : '停用'" :type="item.statusId ==0 ? 'primary' :'error'" @click='openConfirm(item)'></Button>
                  <Button v-authorize="'MappedOfficeDel'" v-show="item.statusId == 0 || item.statusId == 1 || item.statusId == 3" class='btn-red' icon="md-close" size="small" title="删除" type="error" @click='deleteConfirm(item)'></Button>
                  </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/>                 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="sectionList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :current="pageConfig.pageNum" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
            </div>
        </div>
        

        <!-- 新增弹框 -->
        <Modal v-model="addModel" title="新增" class-name="vertical-center-modal"  @on-ok="addOk" :loading="loadingAdd" :mask-closable="false">
                
                <Form :model="sectionForm" ref="sectionFormAdd" :rules="ruleValidate" :label-width="80">
                    <FormItem label="父级科室">
                        <Select v-model="sectionForm.superiorSection" @on-change="getDataLevel">
                            <OptionGroup label="0级科室">
                                <Option v-for="item in sectionAllList" v-if="item.dataLevel==0"  :value="item.section" :key="item.section">{{ item.sectionName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级科室">
                                <Option v-for="item in sectionAllList" v-if="item.dataLevel==1"  :value="item.section" :key="item.section">{{ '&nbsp;&nbsp;' +  item.sectionName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="科室编号" prop="section">
                        <Input v-model.trim="sectionForm.section" :maxlength="20" />
                    </FormItem>
                    <FormItem label="科室名称" prop="sectionName">
                        <Input v-model.trim="sectionForm.sectionName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="科室别名">
                        <Input v-model.trim="sectionForm.sectionAb" :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="sectionForm.dataLevel" :disabled="true"/>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="sectionForm.remark" :maxlength="60" :autosize="{minRows: 4,maxRows: 8}"  type="textarea" :rows="1"  />
                    </FormItem>
                </Form>
        </Modal>
        <!-- 编辑弹框 -->
        <Modal v-model="editModel" title="编辑" class-name="vertical-center-modal" @on-ok="editSectionInfo"  :loading="loading">
            <Form ref="sectionForm" :model="sectionInfo" :rules="ruleValidate" :label-width="80">
                    <input type="hidden" v-model="sectionInfo.section"/>
                    <FormItem label="父级科室">
                        <Select v-model="sectionInfo.superiorSection" @on-change="getDataLevel">
                            <OptionGroup label="0级科室">
                                <Option v-for="item in sectionAllList" v-if="item.dataLevel==0"  :value="item.section" :key="item.section">{{ item.sectionName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="一级科室">
                                <Option v-for="item in sectionAllList" v-if="item.dataLevel==1"  :value="item.section" :key="item.section">{{ '&nbsp;&nbsp;' +  item.sectionName }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="科室名称" prop="sectionName">
                        <Input v-model.trim="sectionInfo.sectionName" :maxlength="60" />
                    </FormItem>
                    <FormItem label="科室别名">
                        <Input v-model.trim="sectionInfo.sectionAb"  :maxlength="60" />
                    </FormItem>
                    <FormItem label="数据等级" prop="dataLevel">
                        <Input v-model.trim="sectionInfo.dataLevel" :disabled="true"/>
                    </FormItem>
                    
                    <FormItem label="备注">
                        <Input v-model.trim="sectionInfo.remark" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
                    </FormItem>
            </Form>
        </Modal>      
        <Modal v-model="noPassModel" title="不通过" class-name="vertical-center-modal" @on-ok="sectionOk(3)">
            <Form :model="sectionInfo" :label-width="90">
                <input type="hidden" v-model="sectionInfo.section"/>
                <FormItem label="请选择不通过原因">
                    <Select v-model="sectionInfo.checkNoReason" class="cellLength" filterable>
                        <Option v-for="item in checkNoReasonList" :value="item.dictionaryName" :key="item.dictionaryKey">{{ item.dictionaryName }}</Option>
                    </Select>
                </FormItem>                
                <FormItem label="备注">
                    <Input v-model.trim="sectionInfo.checkNoReasonMemo" :maxlength="60" type="textarea" :autosize="{minRows: 4,maxRows: 8}" />
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
  name: "sectionCla",
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
        statusId: 1
      },
      reviewStateList: reviewStateJson.reviewStateList, //数据类型
      sectionForm: {
        section: "",
        sectionName: "",
        sectionAb: "",
        dataLevel: "",
        superiorSection: "",
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
      sectionList: [],
      sectionAllList: [],
      sectionInfo: {},
      editTitle: "",
      okText: "",
      cancelText: "",
      addModel: false, //弹框状态(新增)
      editModel: false, //弹框状态(编辑)
      checkNoReasonList: [],
      noPassModel: false, //弹框状态(不通过)
      pageConfig: {
        pageNum: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      ruleValidate: {
        section: [{ required: true, message: "科室不能为空", trigger: "blur" }],
        sectionName: [
          { required: true, message: "科室名称不能为空", trigger: "blur" }
        ],
        dataLevel: [
          {
            required: true,
            message: "数据等级不能为空",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      sectionCol: [
        {
          text: "科室编号",
          name: "section",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "科室名称",
          name: "sectionName",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "科室别名",
          name: "sectionAb",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "数据等级",
          name: "dataLevel",
          sortable: true,
          moveable: true,
          width: 130
        },
        {
          text: "父级科室编码",
          name: "superiorSection",
          sortable: true,
          moveable: true,
          width: 160
        },
        {
          text: "父级科室",
          name: "superiorSectionName",
          sortable: true,
          moveable: true,
          width: 160
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
          filterable: false,
          removeable: false,
          name: "op",
          width: 180
        }
      ]
    };
  },
  mounted: function() {
    this.getSectionList();
    this.getAllSectionList();
  },
  methods: {
    deleteConfirm(item) {
      if (item.isHaveSubLevel == 1) {
        //如果存在子级则不能删除
        this.$Modal.warning({
          title: "提示",
          content: "该科室下存在子级，请先删除子级科室!"
        });
      } else {
        this.$Modal.confirm({
          title: "删除确认",
          content: "确定要删除“" + item.sectionName + "”？",
          onOk: () => {
            var self = this;
            Vue.ajax.send({
              name: "section.del",
              data: {
                section: item.section,
                changeUser: Vue.getUser().userName
              },
              success: function(data) {
                if (!!data && data.code == "0") {
                  self.$Message.info("科室信息删除成功");
                  self.getSectionList();
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
      }
    },
    openConfirm(item) {
      this.$Modal.confirm({
        title: item.statusId == 0 ? "启用确认" : "停用确认",
        content:
          item.statusId == 0
            ? "确定要启用“" + item.sectionName + "”？"
            : "确定要停用“" + item.sectionName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "section.review",
            data: {
              section: item.section,
              sectionName: item.sectionName,
              sectionAb: item.sectionAb,
              dataLevel: item.dataLevel,
              superiorSection: item.superiorSection,
              statusId: item.statusId == 0 ? "4" : "0",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                item.statusId == 0
                  ? self.$Message.info("科室信息启用成功")
                  : self.$Message.info("科室信息停用成功");
                self.getSectionList();
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
        content: "确定要发布“" + item.sectionName + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "section.review",
            data: {
              section: item.section,
              sectionName: item.sectionName,
              sectionAb: item.sectionAb,
              dataLevel: item.dataLevel,
              superiorSection: item.superiorSection,
              statusId: "4",
              changeUser: Vue.getUser().userName,
              remark: item.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("科室信息发布成功");
                self.getSectionList();
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
    //获取审核不通过原因
    getAuditList() {
      var self = this;
      Vue.ajax.send({
        name: "common.baseNoPassList",
        data: {
          reasonTypeId: "A36",
          statusId: 2,
          pageIndex: 1, //页码
          pageSize: 99999 //每页条数
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.checkNoReasonList = data.data.dataList;
            self.sectionInfo.checkNoReason =
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
    getAllSectionList() {
      var self = this;
      Vue.ajax.send({
        name: "section.list",
        data: {
          pageIndex: 1,
          pageSize: 99999
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.sectionAllList = data.data.dataList;
          } else {
            this.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    getSectionList(pageIndex) {
      var self = this;
      Vue.ajax.send({
        name: "section.list",
        data: {
          sectionName: self.searchForm.keywords,
          pageIndex: pageIndex || self.pageConfig.pageNum,
          pageSize: self.pageConfig.pageSize,
          statusId: self.searchForm.statusId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.sectionList = data.data.dataList;
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
      this.getSectionList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getSectionList();
    },
    addModal() {
      this.$refs["sectionFormAdd"].resetFields();
      this.sectionForm.remark = "";
      this.sectionForm.superiorSection = "";
      this.sectionForm.section = "";
      this.sectionForm.sectionName = "";
      this.sectionForm.sectionAb = "";
      this.sectionForm.dataLevel = "";
      this.addModel = true;
    },
    getDataLevel(value) {
      if (value != "" && value != null) {
        var item = this.sectionAllList.filter(x => x.section == value);
        this.sectionForm.dataLevel = item[0].dataLevel + 1;

        this.sectionInfo.dataLevel = item[0].dataLevel + 1;
      }
    },
    addOk() {
      this.$refs["sectionFormAdd"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "section.add",
            data: {
              section: self.sectionForm.section,
              sectionName: self.sectionForm.sectionName,
              sectionAb: self.sectionForm.sectionAb,
              dataLevel: self.sectionForm.dataLevel,
              superiorSection: self.sectionForm.superiorSection,
              statusId: "1",
              createUser: Vue.getUser().userName,
              remark: self.sectionForm.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.addModel = false;
                self.$refs["sectionFormAdd"].resetFields();
                self.$Message.success("新增科室提交成功！");

                self.sectionForm.superiorSection = "";
                self.sectionForm.remark = "";
                //刷新页面
                self.getSectionList();

                self.getAllSectionList();
              } else {
                setTimeout(() => {
                  self.loadingAdd = false;
                  self.$nextTick(() => {
                    self.loadingAdd = true;
                  });
                }, 0);
                self.$Modal.error({
                  title: "",
                  content: data.message
                });
              }
            }
          });
        } else {
          setTimeout(() => {
            this.loadingAdd = false;
            this.$nextTick(() => {
              this.loadingAdd = true;
            });
          }, 0);
        }
      });
    },
    sectionOk(value) {
      var self = this;
      Vue.ajax.send({
        name: "section.review",
        data: {
          section: self.sectionInfo.section,
          sectionName: self.sectionInfo.sectionName,
          sectionAb: self.sectionInfo.sectionAb,
          dataLevel: self.sectionInfo.dataLevel,
          superiorSection: self.sectionInfo.superiorSection,
          changeUser: Vue.getUser().userName,
          checkUser: Vue.getUser().userName,
          statusId: value,
          checkNoReason: value == 2 ? "" : self.sectionInfo.checkNoReason,
          checkNoReasonMemo:
            value == 2 ? "" : self.sectionInfo.checkNoReasonMemo
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.editModel = false;

            value == 2
              ? self.$Message.success("科室通过信息提交成功！")
              : self.$Message.success("科室不通过信息提交成功！");
            //刷新页面
            self.getSectionList();
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
    editSectionInfo() {
      this.$refs["sectionForm"].validate(valid => {
        if (valid) {
          var self = this;
          Vue.ajax.send({
            name: "section.edit",
            data: {
              section: self.sectionInfo.section,
              sectionName: self.sectionInfo.sectionName,
              sectionAb: self.sectionInfo.sectionAb,
              dataLevel: self.sectionInfo.dataLevel,
              superiorSection: self.sectionInfo.superiorSection,
              changeUser: Vue.getUser().userName,
              checkUser: self.sectionInfo.checkUser,
              statusId: 1,
              remark: self.sectionInfo.remark
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.editModel = false;
                self.$Message.success("科室信息" + self.editTitle + "成功！");
                //刷新页面
                self.getSectionList();

                self.getAllSectionList();
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
        } else {
          setTimeout(() => {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          }, 0);
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
          this.currentSort.column == "dataLevel" ||
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