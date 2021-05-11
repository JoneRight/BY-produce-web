2021-03-24 GritTable 内追加数据转换，strUtil 内添加公共排序方法
使用样例
↓↑ 箭头内为主要的逻辑代码

```html
<template>
<div>
...
<CustomTable :columnConfig='drugsCol' :columnDatas='drugsList' :showModal="showModal" @onOutput="showDrugData" @onOk="showModal=false" @onCancel="showModal=false">
...
</CustomTable>
...
</div>
</template>
<script>
// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
import { girdDataSort } from '@/utils/strUtil.js' // 引入数据排序方法
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
export default {
  data() {
    return {
      drugsCol: [
                {
                    text: "药品编码",
                    name: "drug",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                {
                    text: "药品通用名",
                    name: "drugGenericName",
                    sortable: true,
                    moveable: true,
                    width: 150
                },
                ...
                {
                    text: "单价（元）",
                    name: "unitPrice",
                    sortable: true,
                    moveable: true,
                    width: 130,
                    // 可设置为字符串标明类型 'int'、'integer'、'float'、'double' 、'number'
                    // 可设置为函数 Number、parseFloat、parseInt 或自定义转换函数 v=>parseFloat(v.replace(/\,/g, ''))
                    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                    dataType: 'number'
                    // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                },
                {
                    text: "操作",
                    name: "op",
                    filterable: false,
                    removeable: false,
                    width: 180
                }
            ]
    }
  },
  methods: {
    showData: function(datas, showColumns) {
      ...
      /** 将旧代码删除或屏蔽，替换为下面的排序方法
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
      );*/
      // 第一个参数为表格数据；第二个参数为排序的配置；第三个参数是表格字段属性，对应CustomTable内的columnConfig属性
      // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      girdDataSort(this.showDatas, this.currentSort, this.drugsList) //调用新的排序方法
      // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
      ...
    }
  }
}
</script>
```


