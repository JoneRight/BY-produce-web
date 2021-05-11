<template>
        <div class="bg">
            <div style="width: 100%;display:table;" class="table-container">
              <!-- <checkBox value="fff" v-model="checkData"/>
              <checkBoxGroup v-model="checkDataGroup">
                <checkBox value="aa" label="aaaaaaaa" size='medium' color='blue'/>
                <checkBox value="cc" label="cccccccccc" size='small' color='orange'/>
                <checkBox value="bb" label="bbbbbbbbb" size='large' color='red'/>
                <checkBox value="aa" label="aaaaaaaa" size='medium' color='green'/>
                <checkBox value="cc" label="cccccccccc" size='small' color='blue-outline'/>
                <checkBox value="bb" label="bbbbbbbbb" size='large' color='orange-outline'/>
                <checkBox value="aa" label="aaaaaaaa" size='medium' color='red-outline'/>
                <checkBox value="cc" label="cccccccccc" size='small' color='green-outline'/>
              </checkBoxGroup> -->
            <table class="common-table" ref="customTable" @mousemove="headerDragMouseMove($event)"  >
              <thead>
                <tr>
                 <th :class="{'column-fixed':item.fixed}" v-for="(item,index) in showColumns"   @mousedown="headerDragMouseDown($event,item.name)" :width="item.width || ''"
                 :key="item.name+index" class="sortable" style="position:sticky;top:0px;background: #e8eaec;height: 30px;z-index:200">
                  <span :class="{'column-standard':item.standard}"  @click.stop="item.sortable?sort(item):''">{{item.text}}</span>
                  <i :class="[{'sort-asc':item.asc},{'sort-desc':item.desc}]"/>
                  <template v-if="item.filterable">
                    <i :class="['table-filter',item.filterValues.length==item.filters.length?'table-filter-disactive':'table-filter-active']" 
                    @click="showFilter(item)"/>
                    <div class="filter-bg" v-show="item.showFilters">
                      <div class="filter-container">
                        <checkBoxGroup v-model="item.tempSelect">
                          <ul class="scroll">
                            <li v-for="(filterItem,filterIndex) in item.filters" :key="filterItem+''+filterIndex" :title="filterItem">
                              <checkBox :value="filterItem" size='small' :falseValue="filterItem" :key="index+''+filterItem+''+filterIndex" :title="filterItem" :label="filterItem"/>
                            </li>
                          </ul>
                        </checkBoxGroup>
                        <div style="border-top:1px solid #e8eaec;height:25px;padding-top:5px;padding-left:5px;display:inline-block;width:100%;">
                          <checkBox style="float:left;width:50px;" size='small' label="全选" :checked="item.tempSelect.length==item.filters.length" @onChange="changeSelectAll(item)"/>
                          <button type="button" class="c-btn fr" :ref="'btnCancel_'+item.name" @click="hideFilter(item)">取消</button>
                          <button type="button" class="c-btn fr" :ref="'btnCustom_'+item.name" @click="handleFilterModalShow(item,index)">自定义</button>
                          <button type="button" class="c-btn btn-blue fr" :ref="'btnOk_'+item.name" @click="enableFilter(item)">确定</button>
                        </div>
                      </div>
                    </div>
                  </template>
                </th> 
                </tr>
              </thead>
              <tbody>
                <slot></slot>
              </tbody>
              </table>
              <span class='hide'>{{getColumnDataInUse.length}}</span>
               
              <Modal v-model="showCurrentModal" title="设置显示列" width=600 :styles="{top: '250px'}"  @on-ok="columnYes" @on-cancel="cancelNo">
                  <div style="padding-bottom:6px;margin-bottom:6px;">
                      <b>勾选显示的列选项：</b>
                      <Checkbox  :value="selectColumnList.filter(m=>(m!='sel'&&m!='op')).length==columns.filter(m=>m.removeable==true).length"  @on-change="selectAllColumn">全选</Checkbox>
                  </div>
                  <div style="height:255px;overflow-y:auto;">
                      <!-- 动态生成多选框 -->
                      <CheckboxGroup v-model="selectColumnList" v-for="item in columns.filter(m=>m.removeable)" :key="item.name" style="width:175px;display:inline-block">
                          <Checkbox :label="item.name">{{item.text}}</Checkbox>
                      </CheckboxGroup>
                  </div>
              </Modal>
              <OFilterModal ref="oFilterModal" @ok="handleCustomFilterModalOk"/>
           </div>
        </div>
</template>

<script>
import Vue from "vue";
import checkBox from './CheckBox'
import checkBoxGroup from './CheckBoxGroup'
import OFilterModal from './OFilterModal.vue'; // 扩展，追加自定义筛选
import { getColumnDataTypeKv } from '@/utils/strUtil.js'
import { isEmpty } from 'lodash'

export default {
  name: "qualityTest",
  components:{checkBox,checkBoxGroup,OFilterModal},
  props:{
      columnConfig:{
          type: Array,
          default:function(){
              return[]
          }
      },
      columnDatas:{
          type:Array,
          default:function(){
              return [];
          }
      },
      showModal:{
        type:Boolean,
        default:false
      },
      optionType:{
        type:String
      }
  },
  data() {
    return {
      stateColumnDatas: this.transformListType(this.columnDatas),// 规避内部的迷惑的行为
      checkData:"fff",
      checkDataGroup:["bb"],
      showCurrentModal:false,
      columnDataInUse: [],
      //列表弹框
      selectColumnList:[],
      //当前显示的列信息
      showColumnNames: [],
      //所有列信息
      columns: [],
      currentRow:null,
      mouseDrag: {
        mouseDown: false,
        target: null,
        name: "",
        oldX: 0,
        oldWidth: 0,
        tableX: 0
      },
      outputData:[]
    };
  },
  mounted() {
    var self = this;
    window.addEventListener("mouseup", function(e) {
      self.headerDragMouseUp(e);
    });
    window.addEventListener("click", function(e) {
      var target=e.target;
      var insideClick=false;
      while(target!=null && target!=undefined && target.className!=null){
        if(target.className.indexOf("filter-container")>-1){
          insideClick=true
          console.log("break",target.className,target)
          break;
        }
        else{
          target=target.parentNode
        }
      }
      if(!insideClick){
        self.hideAllFilter()
      }
    },true);
    this.showCurrentModal=this.showModal;
    
  
    

    var tbody=this.$refs.customTable.getElementsByTagName("tbody")[0];
     tbody.addEventListener("click",function(e){
     
      if(e.srcElement.tagName=="TD"){
        if(this.currentRow&&this.currentRow!=e.srcElement.parentElement){
          this.currentRow.style.background="";
        }
        this.currentRow=e.srcElement.parentElement;
        this.currentRow.style.background="#3366";
      }
      if(e.srcElement.tagName=="SPAN"){
        if(this.currentRow&&this.currentRow!=e.srcElement.parentElement.parentNode){
          this.currentRow.style.background="";
        }
        this.currentRow=e.srcElement.parentElement.parentNode;
        this.currentRow.style.background="#3366";
      }
      
   

     });
    // tbody.addEventListener("click",function(e){        
    //     var target=e.target;
    //     var max=10,ind=1,fit=true;
    //     while(target.nodeName!=="TR" && ind<=max){
    //       if(target.nodeName=="INPUT" || target.nodeName=="BUTTON" || target.className.indexOf("checkbox")>-1){
    //         fit=false;
    //       }
    //       target=target.parentNode;
    //       ind++;
    //     }
    //     if(target.nodeName==="TR" && fit){
    //       var className=target.className;
    //       if(className.indexOf("hover")>-1){
    //         className=className.replace("hover","")
    //       }
    //       else{
    //         className+=" hover"
    //       }
    //       target.className=className;
    //     }
    //   })
  },
  watch: {
    checkData:function(val){
      console.log("外层",val)
    },
    checkDataGroup:function(val){
       console.log("2外层",val)
    },
    showColumnNames: function(newValue) {
      this.columns = this.columns.map(m => {
        if (newValue.indexOf(m.name) > -1) {
          m.hide = false;
        } else {
          m.hide = true;
        }
        return m;
      });
    },
    columnDatas:{
        handler:function(val){
            var self=this;
             var tbody=this.$refs.customTable.getElementsByTagName("tbody")[0];
              
              if(tbody){
                 var trs = tbody.getElementsByTagName("tr");
                for (var i = 0; i < trs.length; i++) {
                      trs[i].style.background = "";
                }
              }
           
            // try{
            //   var tbody=this.$refs.customTable.getElementsByTagName("tbody")[0];
              
            //   if(tbody){
            //     for(var ii in (tbody.childNodes || [])){
            //       var child=tbody.childNodes[ii]
            //       console.log(child)
            //       if(child.nodeName==="TR"){
            //         var className=child.className;
            //         if(className!=""){
            //           if(className.indexOf("hover")>-1){
            //             className=className.replace("hover","")
            //           }
            //           child.className=className;
            //         }
            //       }
            //     }
            //   }
            // }
            // catch(e){
            //   console.error("选中行异常",e,tbody,tbody.children)
            // }
            
            if(self.columns.length==0||this.optionType=="business"){
                this.columns = this.columnConfig.map(item => {
                    var newObj = Object.assign({}, item);
                    if(item.render){
                      newObj.render=item.render;
                    }
                    if (item.sortable && item.defaultSort) {
                        newObj.asc = item.defaultSort == "asc" ? true : false;
                        newObj.desc = item.defaultSort == "desc" ? true : false;
                    } else {
                        newObj.asc = false;
                        newObj.desc = false;
                    }
                    if (item.hide == undefined) {
                        newObj.hide = false;
                    }
                    if (item.removeable == undefined) {
                        newObj.removeable = true;
                    }
                    if (item.fixed == undefined) {
                        newObj.fixed = false;
                    }
                    if (item.filterable == undefined) {
                        newObj.filterable = true;
                    } else {
                        newObj.filterable = item.filterable;
                    }
                    newObj.filters = [];
                    newObj.filterValues = [];
                    newObj.tempSelect=[];
                    newObj.showFilters = false;
                    return newObj;
                });
                this.showColumnNames = this.showColumns.map(m => {
                    return m.name;
                });
            }
            self.columns = self.columns.map(item => {
                item.filters = self.columnDatas.map(a => {
                  if(item.render){
                    return item.render(a);
                  }
                  return a[item.name]
                }).distinct();
                item.filterValues = [].concat(item.filters);
                return item;
            });
            // 对列数据进行数据格格式转换
            this.stateColumnDatas = this.transformListType(val)
        },
        deep:true
    },
    showModal:function(val){
      this.showCurrentModal=val;
      if(val){
        this.selectColumnList=[].concat(this.showColumnNames)
      }
      else{
        this.selectColumnList=[]
      }
    }
  },
  computed: {
    showColumns: function() {
      return this.columns.filter(m => m.hide == false);
    },
    getColumnDataInUse: function() {
      var columnDatas = this.stateColumnDatas;
      var self = this;
      var arr = [];
      columnDatas.forEach((item,itemIndex) => {
        var show = true;
        self.columns.filter(column => {return column.hide == false}).forEach(column => {
          if(column.filterable==true){
            var ttValue=item[column.name];
            if(column.render){
              ttValue=column.render(item)
            }
            if (column.filterValues.indexOf(ttValue) < 0) {
              show = false;
            }
          }
        });
        if (show) {
          item.__index=JSON.stringify(item)+itemIndex
          arr.push(item);
        }
      });
      if (this._events.onOutput) {
        this.$emit("onOutput", arr,self.showColumnNames);
      }
      return arr;
    }
  },
  methods: {
    transformListType: function(list) {
      let typeKv = getColumnDataTypeKv(this.columnConfig)
      let keys = Object.keys(typeKv || {})
      return keys.length ? (list || []).map((item => {
        keys.forEach(function(key) {
          if (isEmpty(item[key])) return
          try {
            item[key] = typeKv[key].call(null, item[key])
          } catch (error) {
            console.error(error)
          }
        })
        return item
      })):  list || []
    },
    changeSelectAll:function(item){
      item.tempSelect.length==item.filters.length?item.tempSelect=[]:item.tempSelect=[].concat(item.filters)
    },
    selectAllColumn:function(){
      if(this.selectColumnList.filter(m=>(m!='sel'&&m!='op')).length==this.columns.filter(m=>m.removeable==true).length){
        this.selectColumnList=[];
      }
      else{
        this.selectColumnList=this.columns.map(m=>m.name)
      }
      
    },
    columnYes:function(){
      this.showColumnNames=this.columns.filter(m=>m.removeable==false).map(m=>m.name).concat(this.selectColumnList);
      this.$emit("onOk");
    },
    cancelNo:function(){
      this.$emit("onCancel");
    },
    showFilter: function(d) {
        var self=this;
        self.columns.forEach(item => {
            if (item.name == d.name) {
              item.showFilters = true;
              item.tempSelect=[].concat(item.filterValues)
            } else {
              item.showFilters = false;
            }
        });
        
    },
    hideAllFilter: function() {
      this.columns.forEach(item => {
        item.showFilters = false;
      });
    },
    hideFilter: function(d) {
      d.showFilters = false;
      d.tempSelect=[]
    },
    enableFilter: function(d) {
      d.showFilters = false;
      d.filterValues=[].concat(d.tempSelect)
    },

    headerDragMouseDown: function(event, name) {
      var self = this;
      if (
        event.target.tagName == "TH" &&
        event.offsetX > event.target.offsetWidth - 10
      ) {
        self.mouseDrag.mouseDown = true;
        self.mouseDrag.oldX = event.x;
        self.mouseDrag.oldWidth = event.target.offsetWidth;
        self.mouseDrag.tableX = self.$refs.customTable.rows[0].clientWidth;
        self.mouseDrag.target = event.target;
        self.mouseDrag.name = name;
      } else {
        self.mouseDrag.mouseDown = false;
        self.mouseDrag.oldX = 0;
        self.mouseDrag.oldWidth = 0;
        self.mouseDrag.target = null;
      }
    },
    headerDragMouseMove: function(event, name) {
      var self = this;
      if (
        event.target.tagName == "TH" &&
        event.offsetX > event.target.offsetWidth - 10
      ) {
        event.target.style.cursor = "col-resize";
      } else {
        if (event.target.tagName != "I") event.target.style.cursor = "default";
      }
      if(event.target.tagName == "BUTTON") event.target.style.cursor = "pointer";

      if (self.mouseDrag.mouseDown == true) {
        // if(self.mouseDrag.target==null){
        //   self.mouseDrag.target=event.target;
        // }
        var x = event.clientX;
        var y = event.clientY;
        var divx1 = self.$refs.customTable.offsetLeft;
        var divy1 = self.$refs.customTable.offsetTop;
        var divx2 =
          self.$refs.customTable.offsetLeft +
          self.$refs.customTable.offsetWidth;
        var divy2 =
          self.$refs.customTable.offsetTop +
          self.$refs.customTable.offsetHeight;
        if (
          x < divx1 ||
          x > divx2 ||
          y < divy1 ||
          y > divy2 ||
          self.mouseDrag.target == null
        ) {
          // self.headerDragMouseUp(event);
          // return;
        }
        // if(self.mouseDrag.target!=event.target){
        //   self.mouseDrag.mouseDown = false;
        //   self.mouseDrag.oldX = 0;
        //   self.mouseDrag.oldWidth = 0;
        //   self.mouseDrag.target=null;
        //   return
        // }
        self.mouseDrag.target.style.cursor = "default";
        if (self.mouseDrag.oldWidth + (event.x - self.mouseDrag.oldX) > 10) {
          self.mouseDrag.target.width =
            self.mouseDrag.oldWidth + (event.x - self.mouseDrag.oldX);
        } else {
          self.headerDragMouseUp(event);
          return;
        }
        self.mouseDrag.target.style.width = self.mouseDrag.target.width;
        self.$refs.customTable.style.width =
          self.mouseDrag.tableX + (event.x - self.mouseDrag.oldX) + "px";
        self.mouseDrag.target.style.cursor = "col-resize";
      }
    },
    headerDragMouseUp: function(event) {
      var self = this;
      if (self.mouseDrag.mouseDown == false) {
        return false;
      }
      var w = (self.mouseDrag.target || event.target).width;
       
      if (self._events.onTableMove) {
        self.$emit("onTableMove", w);
      }
      event.target.style.cursor = "default";
      self.mouseDrag.mouseDown = false;
      self.mouseDrag.oldX = 0;
      self.mouseDrag.oldWidth = 0;
      self.mouseDrag.target = null;
    },
    sort(item) {
      var self = this;
      var current = self.columns.filter(m => m.name == item.name)[0];
      if (current.asc) {
        self.columns.forEach(m => {
          if (m.name == current.name) {
            m.asc = false;
            m.desc = true;
          } else {
            m.asc = false;
            m.desc = false;
          }
        });
      } else if (current.desc) {
        self.columns.forEach(m => {
          m.asc = false;
          m.desc = false;
        });
        //还原到默认排序
        var arr = self.columns.filter(m => {
          return m.defaultSort;
        });
        if (arr.length > 0) {
          arr[0].asc = arr[0].defaultSort == "asc" ? true : false;
          arr[0].desc = !arr[0].asc;
        }
      } else {
        self.columns.forEach(m => {
          if (m.name == current.name) {
            m.asc = true;
            m.desc = false;
          } else {
            m.asc = false;
            m.desc = false;
          }
        });
      }
      var name = "",
        asc = true;
      if (item.asc) {
        name = item.name;
      } else if (item.desc) {
        name = item.name;
        asc = false;
      } else {
        //默认排序
        var arr = self.columns.filter(m => {
          return m.defaultSort;
        });
        if (arr.length > 0) {
          name = arr[0].name;
          asc = arr[0].defaultSort == "asc" ? true : false;
        }
      }
      if (self._events.onSort) {
        self.$emit("onSort", name, asc);
      }
    },
    //列拖拽
    columnDrop() {
      var self = this;
      const wrapperTr = self.$refs.customTable.rows[0];
      console.log("Sortable", Sortable);
      this.sortable = new Sortable(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          console.log(evt.oldIndex, evt.newIndex);
          // const oldItem = this.dropCol[evt.oldIndex]
          // this.dropCol.splice(evt.oldIndex, 1)
          // this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      });
    },
    handleFilterModalShow(item, index) {
      this.$refs.oFilterModal.show({index}, {...item, key: item.name, title: item.text})
    },
    handleCustomFilterModalOk(info) {
      let that = this
      let item = this.$refs.oFilterModal.stateConfig
      let { index, rules = {} } = info
      let idx = this.columns.findIndex(o => o.name == item.name)
      this.columns[idx]._customFilter = rules
      let tempSelect = []
      if (rules.data && rules.data.length) {
        item.filters.forEach(v => rules.filter.call(this, item.name, {[item.name]: v}) &&  tempSelect.push(v))
      } else {
        tempSelect = [].concat(item.filters)
      }
      this.showFilter(item)
      setTimeout(function() {
        that.showColumns[index.index].tempSelect = tempSelect
        setTimeout(function() {
          that.enableFilter(that.showColumns[index.index])
        })
      })
    }
    // exportCsv(obj){
    // //  columns,data,filename
    //       this.$refs.customTable.exportCsv({
    //                     filename: obj.filename,
    //                     columns: obj.columns,
    //                     data: obj.data
    //                 });
    //               //   this.data.map(item =>{
		// 			        //     item.date = '="'+item.date+'"'
		// 			        //     return item;
		// 		          // })
    // },
  }
};
</script>
<style scoped>
 /*滚动条样式*/
.scroll::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
.scroll::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.scroll::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
ul.scroll li{
  font-weight:10;
  margin:10px 0;
  padding-left:5px;
}
.p20 {
  height: 100%;
}
.c-btn {
    border-radius: 3px;
    height: 20px;
    line-height: 20px;
    padding: 0 7px;
    border: none;
    display: inline-block;
    outline: none;
}
.btn-blue {
    background: #00a0e9;
    color:#fff;
}
.bg{
  height:calc(100% - 70px);
  overflow:auto;
  padding-right:0px;
}
@media screen and (max-width: 1440px) {
  .bg{
    height:calc(100% - 80px);
  }
}
.common-table {
  clear: both;
  height:  calc(100% - 50px);
  z-index: 99;
  overflow:auto;
  margin-bottom:80px;
  width:max-content;
}
.common-table thead {
  
}
.common-table thead tr {
  background:#e8eaec;
  height:30px;
}

.common-table thead tr,
.common-table tbody tr {
  max-height: 60px !important;
}
.common-table tbody {
  /* height:100px;
  overflow:scroll; */
}

.common-table tbody tr:hover {
  background-color:#cadee7;
}
.common-table tbody tr.hover {
  background-color:#63bfe9;
}
table.common-table td {
  /* word-break: keep-all;
  white-space: nowrap; */
}
.sort-asc,
.sort-desc {
  width: 10px;
}
.sort-asc:after {
  border: 4px solid transparent;
  border-bottom: 8px solid #999;
  width: 0;
  height: 0;
  position: relative;
  content: " ";
  margin-left: 10px;
  top:-10px;
}
.sort-desc:after {
  border: 4px solid transparent;
  border-top: 8px solid #999;
  width: 0;
  height: 0;
  position: relative;
  content: " ";
  margin-left: 10px;
  top:15px;
}
.table-inline {
  min-width: 100px;
  max-width: 300px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  padding: 2px;
  float: left;
}
.table-inline,
.table-inline tr th,
.table-inline tr td {
  border: 1px solid #0094ff;
}
.table-filter {
  width: 12px;
  height: 20px;
  font-family: fontello;
  font-style: normal;
  float: right;
  z-index: 3;
  cursor: pointer;
}
.table-filter-active {
  color: #000;
}
.table-filter-disactive {
  color: #999;
}
.table-filter:after {
  content: "\F0B0";
}
.table-filter:hover {
  cursor: pointer;
}
.filter-bg {
  position: relative;
  float:right;
  right:200px;
  top:20px;
}
.filter-container {
  max-width: 220px;
  min-width:250px;
  margin-left:80px;
  /* border: 1px solid grey; */
  box-shadow: 0px 0px 10px rgb(80, 79, 79);
  padding: 5px;
  position: absolute;
  top: 0;
  right: 0;
  left:50px;
  background-color: white;
  z-index: 100;
  margin-top: 12px;
}
.column-standard{
  color: crimson;
}
.filter-container ul {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 5px;
}
.filter-container ul li span{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.filter-container button {
  float:right;
  margin:0 2px;
}

/* .checkbox +label{
    display: block;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: 2px;
    left: 15px;
    background: rgba(240, 84, 77, 1);
}
.checkbox:checked +label::before{
  display:block;
  content: "\2714";
  text-align: center;
  font-size: 16px;
  color: white;
}
.checkbox{
visibility: hidden;
} */

</style>
