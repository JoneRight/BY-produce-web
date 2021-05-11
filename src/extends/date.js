/**
 * 时间保持固定位数，不足时前面补0（默认两位）
 * @param {string} 时间
 * @param {number} 位数
 * @returns {string}
 */
function dateFormatZeroFirst (time, level) {
    level = level || 2;
    return time.toString().addLeftPadding('0', level);
}

var propotype = {
    /**
     * 日期格式化
     * @param formatStr @type {string} 格式化规则  如'YYYY-MM-DD HH:mm,ddd'
     *  YYYY-MM-DD HH:mm:ss SSS,ddd
     *  Y:年，M:月，D:日，H:时，m:分，s:秒，d:星期，S:毫秒
     */
    format (formatStr) {
        var o = {
            'Y+': this.getFullYear() + '',
            'M+': dateFormatZeroFirst(this.getMonth() + 1),
            'D+': dateFormatZeroFirst(this.getDate()),
            'H+': dateFormatZeroFirst(this.getHours()),
            'm+': dateFormatZeroFirst(this.getMinutes()),
            's+': dateFormatZeroFirst(this.getSeconds()),
            'S+': dateFormatZeroFirst(this.getMilliseconds(), 3)
        };
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(formatStr)) {
                formatStr = formatStr.replace(RegExp.$1, o[k].substr(-1 * RegExp.$1.length));
            }
        }
        return formatStr;
    },
    timestamp () {
        var tm = this.getTime();
        var rd = dateFormatZeroFirst(Math.floor(Math.random() * (10000 - 1 + 1) + 1), 4);
        return tm + rd;
    }
};

Object.assign(Date.prototype, propotype);
