// 四位随机数
export function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}

// guid
export function guid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

// 随机生成
export function randomNum (...arg) {
  let [minNum, maxNum] = arg
  switch (arg.length) { 
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

/**
 * 获取url的参数
 */
export function getParameterByName(name){
  name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
  var regex =new RegExp("[\\?&]"+ name +"=([^&#]*)"),
  results = regex.exec(location.search);
  return results ==null?"": decodeURIComponent(results[1].replace(/\+/g," "));
}

/**
 * 获取字段数据类型
 * @param {*} columnConfig 
 * @returns 
 */
export function getColumnDataTypeKv(columnConfig) {
  let typeKv = {}
  columnConfig.forEach(function(item) {
    if (typeof item.dataType == 'undefined') { return }
    let type = Object.prototype.toString.call(item.dataType).toLocaleLowerCase().slice(1, -1).split(' ')[1]
    let fn = null
    if (type === 'string') {
      switch (item.dataType.toLocaleLowerCase()) {
        case 'int':
        case 'integer':
          fn = parseInt
          break;
        case 'number':
          fn = Number
          break;
        case 'float':
        case 'double':
          fn = parseFloat
          break;
        default:
          fn = String
          break;
      }
    } else if(type === 'function') {
      fn = item.dataType
    } else {
      fn = String
    }
    typeKv[item.name] = fn
  })
  return typeKv
}

/**
 * 数据排序
 * @param {array} list 
 * @param {object} config 
 */
export function girdDataSort(list, sortConfig, columnConfig) {
  let typeKv = getColumnDataTypeKv(columnConfig)
  let col = sortConfig.column
  let asc = sortConfig.asc
  if (col in typeKv) {
    list.sort((a, b) => asc? (a[col]==b[col]?0:(a[col]>b[col]?1:-1)):(a[col]==b[col]?0:(a[col]<b[col]?1:-1)))
  } else {
    list.sort((a, b) => asc? (a[col] || '').localeCompare(b[col]): (b[col] || '').localeCompare(a[col]));
  }
}