import _ from 'lodash';
import common from './common.js';

export default {
  init: function(page) {
    common.init(page);
  },
  //树控件相关配置
  renderContent(createElement, { node, data }, enableFlag, addAuthority, editAuthority, deleteAuthority, enableAuthority) {
    var rootSpan = createElement('span');
    var labelSpan = createElement('span', node.label);
    var btnSpan = createElement('span', {
      style: 'float: right; margin-right: 20px;',
    });

    var nextSpan = createElement('span');
    var editSpan = createElement('span');
    var deleteSpan = createElement('span');
    var enableSpan = createElement('span');

    if (addAuthority) {
      nextSpan = createElement(
        'el-button',
        {
          attrs: {
            size: 'mini',
            style: 'color:#20a0ff;',
          },
          on: {
            click: function() {
              common._page.doAddChild(data);
            },
          },
        },
        '添加下级'
      );
    }

    if (editAuthority) {
      editSpan = createElement(
        'el-button',
        {
          attrs: {
            size: 'mini',
            style: 'color:#13CE66;',
          },
          on: {
            click: function() {
              common._page.doEdit(data);
            },
          },
        },
        '修改'
      );
    }

    if (deleteAuthority) {
      deleteSpan = createElement(
        'el-button',
        {
          attrs: {
            size: 'mini',
            style: 'color:#FF4949;',
          },
          on: {
            click: function() {
              common._page.doDelete(data);
            },
          },
        },
        '删除'
      );
    }

    if (enableFlag && enableAuthority) {
      var label = '启用';
      var color = 'F7BA2A';
      if (data.enableFlag) {
        label = '停用';
        color = 'FF4949';
      }

      enableSpan = createElement(
        'el-button',
        {
          attrs: {
            size: 'mini',
            style: 'color:#' + color + ';',
          },
          on: {
            click: function() {
              common._page.doEnable(data);
            },
          },
        },
        label
      );
    }
    btnSpan.children = [nextSpan, editSpan, deleteSpan, enableSpan];
    rootSpan.children = [labelSpan, btnSpan];
    return rootSpan;
  },
  changePidsToArray(pids) {
    var tmp = [];
    pids = pids.replace(',0,', '');
    if (pids !== '') {
      pids = pids.substring(0, pids.length - 1);
      var ids = pids.split(',');
      _.forEach(ids, function(value) {
        tmp.push(parseInt(value));
      });
    }
    return tmp;
  },
  allParentNodes(action, isExclude, id, parentId) {
    var result = [];
    action.doFetchRelation(id, parentId, isExclude, response => {
      if (response.data.data.data != null) {
        _.forEach(response.data.data.data, function(value) {
          result.push(value);
        });
      }
    });
    return result;
  },
  getNodes(action, vals, index, node) {
    var self = this;
    if (vals.length - 1 !== index) {
      index++;
      _.forEach(node.items, function(item) {
        if (item.id === vals[index]) {
          self.getNodes(action, vals, index, item);
        }
      });
    } else {
      if (node.items !== undefined && node.items.length === 0) {
        //不存在子级时
        action.doFetchRelation(node.id, vals[index], false, response => {
          if (response.data.data.data !== null && response.data.data.data.length > 0) {
            node.items = response.data.data.data;
          }
        });
      }
    }
  },
};
