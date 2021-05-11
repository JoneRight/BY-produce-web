<template>
    <div class="bg-white p20">
        <h2 class="common-title">质检管理</h2>
        <div class="search-con">
            
        </div>
        <div class="mt5">
            <Button type="primary" @click="batchOperation()">批量重新清洗</Button>
            <Button type="primary" @click="batchAffirm()">批量确认</Button>
            <Button type="text" style="float: right;" @click="cloumnSet()">
                <Icon type="md-settings" size="18" style="margin-bottom:5px;" />
                <span style="font-size:13px;"> 设置显示列</span>
            </Button>
            <Table border @on-selection-change='getSelectList' @on-row-dblclick='rowClick' 
                :columns="columns5" :data="data5" style="margin-top: 10px;"></Table>
        </div>
        <div class="mt15 text-center mb25">
            <Page :total="pageConfig.totalItemCount" show-total @on-change='changePage' transfer show-elevator show-sizer @on-page-size-change="changeSize" />
        </div>
        <Modal v-model="model3" title="设置显示列" width=600 @on-ok="columnYes">
            <div style="padding-bottom:6px;margin-bottom:6px;">
                <b>勾选显示的列选项：</b>
                <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <div style="height:255px;overflow-y:auto;">
                <!-- 动态生成多选框 -->
                <CheckboxGroup v-model="checkAllGroup" v-for="item in checkBoxList" :key="item.key" @on-change="checkAllGroupChange" style="width:175px;display:inline-block">
                    <Checkbox :label="item.key">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </div>
        </Modal>

    </div>
</template>

<script>
import Vue from "vue";
import commonJson from "@/assets/data/business/common.json";
//数据列
import columns from "@/assets/data/business/cloumnCommon.json";
import "../../assets/css/business/dataerror.css"; //错误列样式
import expandRow from "./qualityTestExpand.vue";

export default {
  name: "qualityTest",
  data() {
    return {
      dataTypeList: commonJson.dataTypeList, //数据类型
      hospitalList: [], //医院
      addressList: [], //省市
      qualityList: [], //质检规则
      columns5: [
        {
          title: "Date",
          key: "date",
          sortable: true
        },
        {
          title: "Name",
          key: "name",
          sortable: true
        },
        {
          title: "Age",
          key: "age",
          sortable: true
        },
        {
          title: "Address",
          key: "address",
          sortable: true,
          filters: [
            {
              label: "New York",
              value: "New York"
            },
            {
              label: "London",
              value: "London"
            },
            {
              label: "Sydney",
              value: "Sydney"
            }
          ],
          filterMethod(value, row) {
            return row.address.indexOf(value) > -1;
          }
        }
      ],
      data5: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],
      selectList: "", //选中的信息
      model1: false, //提示框显示状态(重新清洗)
      model2: false, //提示框显示状态(确认)
      model3: false, //提示框显示状态(设置列)
      commonId: "", //存放id
      index: "", //行标识
      currentType: "", //当前显示的数据的类型
      Operation: {}, //操作列,
      checkBoxList: [], //可选列
      indeterminate: false, //全选状态(非全选)
      checkAll: false, //全选状态（非全选）
      checkAllGroup: [], //选中的多选框
      expendData: {}, //expend列表
      searchForm: {
        address: [],
        hospital: "",
        dataType: 1,
        date: "",
        keyword: "",
        quality: ""
      },
      pageConfig: {
        pageNum: 1,
        pageSize: 10,
        totalItemCount: 1
      },
      showCol: [], //显示列
      allCol: [] //该数据类型的全部列
    };
  },
  mounted() {
    //操作列
    this.Operation = [
      {
        title: "复选",
        type: "selection",
        width: 50,
        align: "center",
        fixed: "left",
        key: ""
      },
      {
        title: "操作",
        width: 150,
        align: "center",
        fixed: "right",
        key: "action",
        render: (h, params) => {
          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small",
                  ghost: true
                },
                style: {
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.model2 = true;
                    this.commonId = params.row.id; //当前行id
                  }
                }
              },
              "确认"
            ),
            h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small",
                  ghost: true
                },
                style: {
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.model1 = true;
                    this.commonId = params.row.id; //当前行id
                  }
                }
              },
              "重新清洗"
            ),
            h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small",
                  ghost: true
                },
                style: {
                  color: "#2d8cf0"
                },
                on: {
                  click: () => {
                    this.rowClick(params.row, params.index);
                  }
                }
              },
              "数据对比"
            )
          ]);
        }
      },
      {
        //行下方创建展示栏
        type: "expand",
        width: -1,
        hidden: true,
        key: "expand",
        render: (h, params) => {
          return h(expandRow, {
            props: {
              data: this.expendData
            }
          });
        }
      }
    ];

    // this.getDataMappedList(); //获取列表数据
    // this.getHospitalList(); //获取医院数据
    // this.getAddressList(); //获取省市数据
    // this.getQualityList(); //获取质检规则数据
  },
  methods: {
    //获取列表数据
    getDataMappedList() {
      var self = this;
      if (self.currentType != self.searchForm.dataType) {
        //组装列
        this.showCol = []; //重置显示列
        this.allCol = []; //重置
        this.showCol.push.apply(this.showCol, columns.columncommon);
        if (this.searchForm.dataType == 1) {
          //购药数据
          this.showCol.push.apply(this.showCol, columns.columnGouyao);
        } else if (this.searchForm.dataType == 2) {
          //门急诊数据
          this.showCol.push.apply(this.showCol, columns.columnMenjizhen);
        } else if (this.searchForm.dataType == 3) {
          //病案数据
          this.showCol.push.apply(this.showCol, columns.columnBingan);
        } else {
          //医嘱数据
          this.showCol.push.apply(this.showCol, columns.columnYizhu);
        }
        this.allCol.push.apply(this.allCol, this.showCol);
        this.showCol.push.apply(this.showCol, this.Operation);
      }

      Vue.ajax.send({
        name: "qualityTest.list",
        data: {
          pageNum: self.pageConfig.pageNum, //页码
          pageSize: self.pageConfig.pageSize, //每页条数
          address: self.searchForm.address, //省市
          hospitalId: self.searchForm.hospital, //医院
          dataType: self.searchForm.dataType, //数据类型
          date: self.searchForm.date, //时间
          keywords: self.searchForm.keywords //自定义
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.dataQualityList = data.data.dataList;
            //判断当前数据状态和上次数据状态
            if (self.currentType != self.searchForm.dataType) {
              self.checkAllGroup = []; //清空多选默认选中列数组
              self.indeterminate = false; //全选状态(非全选)
              self.checkAll = false; //全选状态（非全选）
              self.currentType = self.searchForm.dataType; //保存当前显示数据类型
            }
            self.pageConfig.totalItemCount = data.data.totalItemCount;
            self.pageConfig.pageNum = data.data.currentPageIndex;
          } else {
            self.$Modal.error({
              title: "失败",
              content: data.message
            });
          }
        }
      });
    },
    //获取省市
    getAddressList() {
      var self = this;
      Vue.ajax.send({
        name: "business.adressList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.addressList = data.data;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    //获取医院
    getHospitalList() {
      var self = this;
      Vue.ajax.send({
        name: "business.hospitalList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.hospitalList = data.data;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    //获取质检规则
    getQualityList() {
      var self = this;
      Vue.ajax.send({
        name: "qualityTest.qualityList",
        data: {},
        success: function(data) {
          if (!!data && data.code == "0") {
            self.qualityList = data.data;
          } else {
            self.$Modal.error({
              title: "",
              content: data.message
            });
          }
        }
      });
    },
    //切页
    changePage(currentPage) {
      this.pageConfig.pageNum = currentPage;
      this.getDataMappedList();
    },
    //显示条数
    changeSize(num) {
      this.pageConfig.pageSize = num;
      this.getDataMappedList();
    },
    //保存批量选中的信息
    getSelectList(arr) {
      //批量选中的信息
      this.selectList = arr;
    },
    //批量重洗
    batchOperation() {
      var self = this;
      if (this.selectList.length < 1) {
        this.$Modal.error({
          title: "错误",
          closable: true,
          content: "<h5>请选择需要批量重新清洗的数据！</h5>"
        });
      } else {
        let selectIdList = []; //选中数据的id标识
        //遍历选中的数据获取选中数据的id数组
        this.selectList.forEach(element => {
          selectIdList.push(element.recordId);
        });
        Vue.ajax.send({
          name: "common.batch",
          data: {
            idList: selectIdList
          },
          success: function(data) {
            if (!!data && data.code == "0") {
              self.$Modal.success({
                title: "成功",
                closable: true,
                content: "选中的信息已重新进入清洗流程"
              });
              self.getDataMappedList(); //刷新列表
              self.selectList = ""; //清空选中的数据
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
    //批量确认
    batchAffirm() {
      var self = this;
      if (this.selectList.length < 1) {
        this.$Modal.error({
          title: "错误",
          closable: true,
          content: "<h5>请选择需要批量确认的数据！</h5>"
        });
      } else {
        let selectIdList = []; //选中数据的id标识
        this.selectList.forEach(element => {
          selectIdList.push(element.recordId);
        });
        Vue.ajax.send({
          name: "common.affirm",
          data: {
            idList: selectIdList
          },
          success: function(data) {
            if (!!data && data.code == "0") {
              self.$Modal.success({
                title: "成功",
                closable: true,
                content: "选中的信息已确认为错误信息。"
              });
              self.getDataMappedList(); //刷新列表
              self.selectList = ""; //清空选中的数据
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
    //重新清洗确认操作
    cleanYes() {
      var self = this;
      Vue.ajax.send({
        name: "common.clean",
        data: {
          id: self.commonId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.$Modal.success({
              title: "成功",
              closable: true,
              content: "<h5>该信息已重新进入清洗流程。</h5>"
            });
            self.getDataMappedList(); //刷新列表
          } else {
            self.$Modal.error({
              title: "失败",
              content: data.message
            });
          }
        }
      });
    },
    //确认操作
    affirmYes() {
      var self = this;
      Vue.ajax.send({
        name: "common.affirm",
        data: {
          id: self.commonId
        },
        success: function(data) {
          if (!!data && data.code == "0") {
            self.$Modal.success({
              title: "成功",
              closable: true,
              content: "<h5>该信息已确认为错误信息。</h5>"
            });
            self.getDataMappedList(); //刷新列表
          } else {
            self.$Modal.error({
              title: "失败",
              content: data.message
            });
          }
        }
      });
    },
    //自定义显示列
    cloumnSet() {
      //设置显示的可选列
      this.checkBoxList = this.allCol;
      //显示列设置模态框
      this.model3 = true;
    },
    //设置列确认操作
    columnYes() {
      this.showCol = [];
      //取出选中的列放到显示列中
      this.checkAllGroup.forEach(a => {
        this.allCol.forEach(b => {
          if (a == b.key) {
            this.showCol.push(b);
          }
        });
      });
      //添加固定显示列
      this.showCol.push.apply(this.showCol, this.Operation);
    },
    //判断全选的状态
    checkAllGroupChange(data) {
      if (data.length === this.allCol.length && this.currentType == 1) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length === this.allCol.length && this.currentType == 2) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length === this.allCol.length && this.currentType == 3) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length === this.allCol.length && this.currentType == 4) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    //全选/非全选
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = []; //重置多选框数组内容
        this.allCol.forEach(a => this.checkAllGroup.push(a.key));
      } else {
        this.checkAllGroup = [];
      }
    },
    //点击行
    rowClick(rowData, index) {
      //原数据expend的状态，true为显示，false为隐藏
      if (rowData._expanded == true) {
        rowData._expanded = false;
      } else {
        rowData._expanded = true;
      }
      //修改expend状态后与原来的数据进行替换
      this.dataQualityList.splice(index, 1, rowData);
      // 获取错误数据
      let backData = {};
      //编辑具有错误类的数据
      for (let key in rowData.cellClassName) {
        backData[key] = rowData[key]; //将对应该行对应key值的value赋值给backData
      }

      // 获取expend列表展示的数据
      var self = this;
      Vue.ajax.send({
        name: "qualityTest.expand",
        data: {
          errorData: backData
        },
        success: function(success) {
          if (!!success && success.code == "0") {
            self.expendData = success.data;
          } else {
            self.$Modal.error({
              title: "失败",
              content: success.message
            });
          }
        }
      });
    }
  }
};
</script>