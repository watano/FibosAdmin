import axios from 'axios';
import _ from 'lodash';

export default {
  DEBUG: false,
  FetchRemote: true, //从服务端获取请求,忽略静态数据. 这是一次性的开关, 在action提交前设置,action返回后自动设置会false;
  ContentPath: '',
  TestData: '/static/data',
  _page: {},
  init: function(page) {
    this._page = page;
  },
  _doAction: function(actionParam, callBack, errBack) {
    if (this.DEBUG && !this.FetchRemote) {
      this._doMock(actionParam, callBack, errBack);
      return;
    }
    if (!_.has(actionParam, 'headers')) {
      actionParam.headers = this._actionHeaders();
    }
    actionParam.url = this.ContentPath + actionParam.url;
    console.log(actionParam);
    axios(actionParam)
      .then(response => {
        this._doOk(response, callBack, errBack);
      })
      .catch(error => {
        this._doError(error, errBack);
      });
  },
  /**
   *请求成功之后的回调处理（供内部使用）
   */
  _doOk: function(response, callBack, errBack) {
    this.FetchRemote = false;
    if (_.has(response, 'status') && response.status === 200) {
      var data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(response.data);
      }
      if (!_.has(data, 'code')) {
        if (_.has(data, 'message')) {
          this.okMsg(data.message);
        } else {
          this.okMsg(data);
        }
        return;
      }
      if (data.code > 0) {
        if (callBack) {
          callBack(response);
        } else if (_.has(data, 'message')) {
          this.okMsg(data.message);
        } else {
          this.okMsg(data);
        }
        return;
      } else if (data.code === -10) {
        this.errorMsg('请登录!');
        this.doLogin();
        return;
      } else if (data.code < 0) {
        if (_.has(data, 'message')) {
          this.errorMsg(data.message);
        } else {
          this.errorMsg(data);
        }
        return;
      }
    }
    this._doError(response, errBack);
  },
  /**
   * 请求失败之后的回调处理（供内部使用）
   */
  _doError: function(error, errBack) {
    this.FetchRemote = false;
    if (_.has(error, 'response.status') && error.response.status === 403) {
      this.errorMsg('权限不足或者登陆信息过期,请重新登陆!');
      this.doLogin();
      return;
    }
    if (errBack) {
      if (error.data) {
        errBack(error.data.message);
      } else {
        errBack(error);
      }
    } else {
      //this.errorMsg(error);
    }
  },
  _actionHeaders: function() {
    var headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS',
    };
    return headers;
  },
  /**
   * 使用静态数据替代实际请求
   */
  _doMock: function(actionParam, callBack, errBack) {
    // console.log(actionParam);
    var newUrl = this.TestData + actionParam.url + '.json';
    if (actionParam.method !== 'get') {
      newUrl = this.TestData + actionParam.url + '_' + actionParam.method + '.json';
    }
    axios
      .get(newUrl, { headers: this._actionHeaders() })
      .then(response => {
        this._doOk(response, callBack);
      })
      .catch(error => {
        this._doError(error, errBack);
      });
  },
  /**
   *发送get请求，以及执行回调函数（根据data.code来判断请求返回的数据是否正常）
   */
  getAction: function(url, callBack, errBack) {
    this._doAction({ method: 'get', url: url }, callBack, errBack);
  },
  /**
   *发送delete请求，以及执行回调函数（根据data.code来判断请求返回的数据是否正常）
   */
  delAction: function(url, callBack, errBack) {
    this._doAction({ method: 'get', url: url }, callBack, errBack);
    //this._doAction({ method: 'delete', url: url }, callBack, errBack);
  },
  /**
   *发送head请求（此请求与get一致，不会返回响应体，只返回消息头），以及执行回调函数（根据data.code来判断请求返回的数据是否正常）
   */
  headAction: function(url, callBack, errBack) {
    this._doAction({ method: 'head', url: url }, callBack, errBack);
  },
  /**
   * 发送options请求，局部更新
   */
  optionsAction: function(url, callBack, errBack) {
    this._doAction({ method: 'options', url: url }, callBack, errBack);
  },
  /**
   * 发送patch请求，局部更新
   */
  patchAction: function(url, data, callBack, errBack) {
    this._doAction({ method: 'patch', url: url, data: data }, callBack, errBack);
  },
  /**
   * 发送post请求，以及执行回调函数（根据data.code来判断请求返回的数据是否正常）
   */
  postAction: function(url, data, callBack, errBack) {
    this._doAction({ method: 'post', url: url, data: data }, callBack, errBack);
  },
  /**
   * 发送put请求(向指定资源位置上传其最新内容)，以及执行回调函数（根据data.code来判断请求返回的数据是否正常）
   */
  putAction: function(url, data, callBack, errBack) {
    this._doAction({ method: 'put', url: url, data: data }, callBack, errBack);
  },
  doLogin: function(fnOk) {
    fnOk();
  },
  getDictLabel: function(allDict, type, value) {
    if (_.has(allDict, type)) {
      var result = _.find(allDict[type], { value: value });
      if (result !== undefined) {
        return result.label;
      }
    }
    return '';
  },
  checkObj: function(obj) {
    try {
      if (typeof obj !== 'undefined') {
        return true;
      }
    } catch (e) {
      console.debug(e);
    }
    return false;
  },
  notNullObj: function(obj) {
    try {
      if (typeof obj !== 'undefined' && obj !== '' && obj !== null) {
        return true;
      }
    } catch (e) {
      console.debug(e);
    }
    return false;
  },
  cloneObj: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  // 取出暂存的值，如果没有值就返回指定的默认值
  getState: function(name, defaultValue) {
    try {
      var storage = window.localStorage;
      var value = storage.getItem(name);
      if (value != null) {
        return JSON.parse(value);
      }
    } catch (e) {
      console.warn(e);
    }
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
    return {};
  },
  upState: function(name, value) {
    try {
      var storage = window.localStorage;
      storage.setItem(name, JSON.stringify(value));
    } catch (e) {
      console.warn(e);
    }
  },
  clearState: function(name) {
    try {
      var storage = window.localStorage;
      storage.removeItem(name);
    } catch (e) {
      console.warn(e);
    }
  },
  okMsg: function(msg) {
    this._page.$message({
      type: 'success',
      showClose: true,
      message: msg,
    });
  },
  warningMsg: function(msg) {
    this._page.$message({
      type: 'warning',
      showClose: true,
      message: msg,
    });
  },
  errorMsg: function(msg) {
    if (msg !== undefined) {
      console.error(msg);
      if (typeof msg === 'string') {
        this._page.$alert(msg, '错误', {
          confirmButtonText: '确定',
          callback: {},
        });
      } else if (typeof msg === 'object' && typeof msg.message === 'string') {
        this._page.$alert(msg.message, '错误', {
          confirmButtonText: '确定',
          callback: {},
        });
      }
    }
  },
  confirmMsg: function(title, msg, fnOk) {
    this._page
      .$confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(fnOk)
      .catch(() => {});
  },
  goto: function(url) {
    this._page.$router.push(url);
  },
  openLoading: function(msg) {
    if (msg === undefined || msg === null) {
      msg = '加载中...';
    }
    this._page.$loading({ text: msg });
  },
  closeLoading: function() {
    this._page.$loading().close();
  },
  filterByType: function(scope, type, value) {
    try {
      var dict = scope._self.allDict[type];
      for (var i = 0; i < dict.length; i++) {
        var v = dict[i];
        if (v.value === value) {
          return v.label;
        }
      }
      return '未知值!';
    } catch (e) {
      console.error(e);
    }
    return '错误!';
  },
  lastId: function(lst) {
    try {
      if (lst.length > 0) {
        return lst[lst.length - 1];
      }
    } catch (e) {
      //console.error(e);
    }
    return null;
  },
  searchTreeNode: function(root, searchNodeId, idField, childrenField) {
    var nodes = [];
    if (_.isArray(root)) {
      for (var i1 = 0; i1 < root.length; i1++) {
        var item1 = root[i1];
        var subIds1 = this.searchTreeNode(item1, searchNodeId, idField, childrenField);
        if (!_.isEmpty(subIds1)) {
          nodes = _.concat(nodes, subIds1);
          return nodes;
        }
      }
    } else {
      if (root[idField] + '' === searchNodeId + '') {
        nodes.push(root);
        return nodes;
      }
      if (root[childrenField] !== undefined) {
        for (var i = 0; i < root[childrenField].length; i++) {
          var item = root[childrenField][i];
          var subIds = this.searchTreeNode(item, searchNodeId, idField, childrenField);
          if (!_.isEmpty(subIds)) {
            nodes.push(root);
            nodes = _.concat(nodes, subIds);
            return nodes;
          }
        }
      }
    }
  },
  itemIds: function(nodes, idField) {
    if (!_.isEmpty(nodes)) {
      var ids = [];
      for (var i = 0; i < nodes.length; i++) {
        ids = _.concat(ids, nodes[i][idField]);
      }
      return ids;
    } else {
      return [];
    }
  },
};
