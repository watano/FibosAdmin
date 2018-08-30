'use strict';
export class RowSpanInfo {
  constructor(colIndex, colField) {
    this.colField = colField;
    this.colIndex = colIndex;
  }

  calcSpanInfo(allData) {
    var _this = this;
    _this.lastValue = '';
    _this.spanInfo = {};
    var lastRow = null;
    for (var i = 0; i < allData.length; i++) {
      var cRow = allData[i];
      var cValue = cRow[_this.colField];
      if (i === 0) {
        _this.spanInfo[cValue] = 0;
      } else {
        if (lastRow[_this.colField] === cValue) {
          _this.spanInfo[cValue] += 1;
        } else {
          _this.spanInfo[cValue] = 0;
        }
      }
      //console.log(cValue, this.spanInfo[cValue]);
      lastRow = cRow;
    }
  }

  spanMethod(row, column, rowIndex, columnIndex) {
    if (columnIndex === this.colIndex) {
      try {
        var value = row[this.colField];
        if (this.spanInfo[value] >= 0) {
          if (this.lastValue === value) {
            return { rowspan: 0, colspan: 1 };
          } else {
            this.lastValue = value;
            return { rowspan: this.spanInfo[value] + 1, colspan: 1 };
          }
        }
      } catch (e) {
        console.error(e);
      }
      return {
        rowspan: 1,
        colspan: 1,
      };
    }
    return { rowspan: 1, colspan: 1 };
  }
}
