<template>
	<el-tabs v-model="activeName" @tab-click="handleClick">
		<el-tab-pane label="兑换" name="transferIn">todo</el-tab-pane>
		<el-tab-pane label="出售" name="transferOut">todo</el-tab-pane>
	</el-tabs>
</template>
<script>
import _ from 'lodash';
import common from '../../../assets/common.js';
import fibosActions from '../../../actions/fibosActions.js';

export default {
  data() {
    return {
      entity: {},
      rules: {},
      activeName: 'transferIn',
    };
  },
  mounted: function() {
    common.init(this);
    fibosActions.init(this);
    this.initData();
  },
  computed: {
    //
  },
  methods: {
    updateEntity(newEntity) {
      this.entity = newEntity;
      //TODO 获取其他数据
    },
    initData() {
      var self = this;
      self.initEntity();
    },
    initEntity() {
      var self = this;
      var path = self.$route.path;

      if (_.has(self.$route.params, 'id')) {
        self.entity.id = self.$route.params.id;
        var allAccounts = fibosActions.fetchAllAccounts();
        var entity = allAccounts[self.entity.id];
        if (typeof entity !== 'undefined') {
          self.updateEntity(entity);
        }
      }
    },
    doSave() {
      //保存实体数据
      var self = this;
      this.$refs.accountForm.validate(valid => {
        if (valid) {
          var newEntity = _.cloneDeep(self.entity);
          fibosActions.saveAccount(newEntity);
          self.doBack();
        } else {
          return;
        }
      });
    },
    doBack() {
      //返回上一页
      this.$router.go(-1);
    },
  },
};
</script>
