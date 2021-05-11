/*
@Author RexSheng
@Date 2018/10/31
@CopyRight 991823949@qq.com
*/
export default {
    defaultCode: "GBK",
    ReadCSV: function(file) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function() {
                resolve(self.ReadCSVContent(this.result));
            };
            reader.onerror = function() {
                reject("read error")
            };
            reader.readAsText(file, self.defaultCode);
        });

    },
    ReadCSVContent: function(content) {
        var self = this;
        var arr = this.CSVToArray(content);
        var maxLength = 0;

        if (arr.length && arr.length > 0) {
            self.tableColumnNames = [];
            self.tableColumnValues = [];
            arr.forEach(item => { maxLength = item.length > maxLength ? item.length : maxLength; });
            for (var i = 0; i < maxLength; i++) {
                self.tableColumnNames.push({ key: "column" + (i + 1), type: self.getType(arr[0].length > i ? arr[0][i] : undefined) })
            }
            arr.forEach(item => {
                if (item.length == 1 && item[0] == "") {
                    return;
                }
                var i = 0;
                var newArr = [];
                self.tableColumnNames.forEach(row => {
                    newArr.push({
                        key: row.key,
                        value: item.length > i ? item[i] : null
                    })
                    i++;
                });

                self.tableColumnValues.push(newArr)


            })
            return self.tableColumnValues;
        }
    },
    CSVToArray: function(strData, strDelimiter) {
        strDelimiter = strDelimiter || ",";

        var objPattern = new RegExp((
            // Delimiters.  
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.  
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.  
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ), "gi");


        // Create an array to hold our data. Give the array  
        // a default empty first row.  
        var arrData = [
            []
        ];

        // Create an array to hold our individual pattern  
        // matching groups.  
        var arrMatches = null;


        // Keep looping over the regular expression matches  
        // until we can no longer find a match.  
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.  
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length  
            // (is not the start of string) and if it matches  
            // field delimiter. If id does not, then we know  
            // that this delimiter is a row delimiter.  
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since we have reached a new row of data,  
                // add an empty row to our data array.  
                arrData.push([]);
            }


            // Now that we have our delimiter out of the way,  
            // let's check to see which kind of value we  
            // captured (quoted or unquoted).  
            if (arrMatches[2]) {
                // We found a quoted value. When we capture  
                // this value, unescape any double quotes.  
                var strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            } else {
                // We found a non-quoted value.  
                var strMatchedValue = arrMatches[3];
            }

            // Now that we have our value string, let's add  
            // it to the data array.  
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.  
        return (arrData);
    },
    getType: function(value) {

        if (typeof(value) == "number") {
            return "INT";
        } else if (typeof(value) == "string") {
            return "STRING"
        } else if (typeof(value) == "boolean") {
            return "BOOLEAN"
        } else
            return "INT";

    },
}