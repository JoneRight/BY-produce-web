<template>
    <div class="m15" style="height:calc(100% - 60px);overflow-y:hidden;">
        <div class="fr"></div>
        <h2 class="common-title">资源管理</h2>
        <div class="search-con">
        	<Form :model="searchForm" ref="formInline" inline>
                <FormItem label="标题" :label-width="40">
                    <Input v-model="searchForm.title" style="width: 280px;" placeholder="请输入标题"/>
                </FormItem>
		        <FormItem label="发布时间" :label-width="60">
                    <DatePicker type="daterange" placeholder="请选择发布时间" :start-date="new Date(new Date().getTime() - 30*24*60*60*1000)" v-model="searchForm.date" style="width: 200px" :editable="false" @on-change="searchForm.date=$event"></DatePicker>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="serchList">检索</Button>
		        </FormItem>
                <FormItem  class="fr">
                    <Button type="primary" to="/report/rscPublish" v-authorize="'resourceadd'">+ 新增资源</Button>
		        </FormItem>
		      </Form>
        </div>
        <div class="bg-white mt15" style="height:100%;">
            <CustomTable v-authorize="'resourcelist'" :columnConfig='resourceCol' :columnDatas='resourceList' :showModal="showModal" @onSort="sortColumn" @onOutput="showData" @onOk="showModal=false" @onCancel="showModal=false">
                <tr v-for="(item,index) in showDatas" :key="index">
                  <td class="ellipsis" v-if="showColumns.indexOf('title')>-1">{{item['title']}}</td>
                  <td class="ellipsis" v-if="showColumns.indexOf('introduction')>-1">{{item['introduction']}}</td>
                  <td class="ellipsis" v-if="showColumns.indexOf('createTime')>-1">{{item['createTime']}}</td>
                  <td class="ellipsis" v-if="showColumns.indexOf('readCount')>-1">{{item['readCount']}}</td>
                  <td>
                      <Button v-authorize="'resourcedetail'" icon="md-eye" size="small" title="查看" type="primary" @click='$router.push("/report/rscPublish?Id="+item.resourceId+"&&type=1")'></Button>
                      <Button v-authorize="'resourceedit'" icon="md-create" size="small" title="编辑" type="warning" class="btn-orange" @click='$router.push("/report/rscPublish?Id="+item.resourceId+"&&type=2")'></Button>
                      <Button v-authorize="'resourcedelete'" icon="md-close" size="small" title="删除" type="error" class="btn-red" @click='deleteResource(item)'></Button>
                    </td>
                </tr>
                <EmptyRow style="position:absolute;left:20px;" v-if="!showDatas || showDatas.length==0"/> 
            </CustomTable>
            <div style="" class="page-footer">            
                 <div class="mt15 text-center" v-if="resourceList.length>0">            
                    <Page :total="pageConfig.totalItemCount" :page-size="pageConfig.pageSize" :page-size-opts="[20,50,100,200,1000]" show-total  @on-change='changePage' show-elevator show-sizer @on-page-size-change="changeSize"/>
                    <Button type="text" class="fr" @click="showModal=true">
                        <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                        <span style="font-size:13px;"> 设置显示列</span>
                    </Button>
                </div>
                
            </div>
           
        </div>
       
        
    </div>
</template>

<script>
import Vue from "vue";
import EmptyRow from "../common/EmptyRow";
import CustomTable from "../common/GridTable";
export default {
  name: "duplicateCheck",
  components: { EmptyRow, CustomTable },
  data() {
    return {
      showModal: false,
      searchForm: {
        date: [],
        title: ""
      },
      showDatas: [],
      showColumns: [],
      currentSort: {
        column: "",
        asc: true
      },
      resourceList: [],
      pageConfig: {
        pageIndex: 1,
        pageSize: 20,
        totalItemCount: 1
      },
      resourceCol: [
        {
          text: "标题",
          name: "title",
          sortable: true,
          moveable: true,
          width:400
          // defaultSort: "asc"
        },
        {
          text: "简介",
          name: "introduction",
          sortable: true,
          moveable: true,
          width:700
        },
        {
          text: "发布时间",
          name: "createTime",
          sortable: true,
          moveable: true,
          width:200
        },
        {
          text: "下载量",
          name: "readCount",
          hide: false,
          sortable: true,
          moveable: true,
          width:150
        },
        {
          text: "操作",
          name: "op",
          filterable: false,
          removeable: false,
          width:200
          // fixed:true
        }
      ]
    };
  },
  activated:function(){
        this.getResourceList();
    },
  methods: {
    getResourceList() {
      var self = this;
      Vue.ajax.send({
        name: "resource.list",
        data: {
          state: 0,
          title: self.searchForm.title,
          createTime: self.searchForm.date,
          pageIndex: self.pageConfig.pageIndex,
          pageSize: self.pageConfig.pageSize
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.resourceList = data.data.dataList || [];
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
    serchList() {
      this.pageConfig.totalItemCount = 1;
      this.pageConfig.pageIndex = 1;
      this.getResourceList();
    },
    changePage(currentPage) {
      this.pageConfig.pageIndex = currentPage;
      this.getResourceList();
    },
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getResourceList();
    },
    deleteResource(item) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "确定要删除“" + item.title + "”？",
        onOk: () => {
          var self = this;
          Vue.ajax.send({
            name: "resource.del",
            data: {
              resourceId: item.resourceId,
              checkUser: Vue.getUser().userName
            },
            success: function(data) {
              if (!!data && data.code == "0") {
                self.$Message.info("资源删除成功");
                self.pageConfig.pageIndex = 1;
                self.getResourceList();
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
    sortColumn: function(column, asc) {
      this.currentSort.column = column;
      this.currentSort.asc = asc;
    },
    showData: function(datas, showColumns) {
      console.log(this.currentSort,datas)
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
                    b[this.currentSort.column] || ""
                  )
                : (b[this.currentSort.column] || "").localeCompare(
                    a[this.currentSort.column] || ""
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
