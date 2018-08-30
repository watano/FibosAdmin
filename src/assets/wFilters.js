export default {
  formatDay: function(d) {
    var date = new Date(d);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  },
  formatDay2: function(d) {
    var date = new Date(d);
    var weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return date.getMonth() + 1 + '-' + date.getDate() + '（' + weeks[date.getDay()] + '）';
  },
  formatDay3: function(d) {
    var date = new Date(d);
    return date.getFullYear() + '-' + (date.getMonth() + 1);
  },
  formatDate: function(d) {
    var date = new Date(d);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  },
  formatPrice: function(price) {
    return (price * 1.0).toFixed(0);
  },
};
