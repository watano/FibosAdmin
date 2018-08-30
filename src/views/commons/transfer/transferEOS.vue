<template>
	<div>
		<el-form ref="transferForm" :model="entity" :rules="rules" label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="付款帐号" prop="fromAccount">
						<el-input v-model="entity.fromAccount"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="收款帐号" prop="toAccount">
						<el-input v-model="entity.toAccount"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="金额" prop="amount">
						<el-input v-model="entity.amount"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="备注(选填)" prop="memo">
						<el-input v-model="entity.memo" type="textarea" :rows="2"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24">
					<el-form-item>
						<el-button type="primary" @click="doSave">转帐</el-button>
						<el-button :plain="true" type="warning" @click="doBack">返回</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script>
import _ from 'lodash';
import common from '../../../assets/common.js';
import fibosActions from '../../../actions/fibosActions.js';

export default {
  data() {
    return {
      fibosAccount: '',
      entity: {
        fromAccount: '',
        toAccount: '',
        amount: '',
        memo: '',
      },
      rules: {
        fromAccount: [
          {
            required: true,
            message: '请输入付款帐号',
            trigger: 'blur',
          },
          {
            len: 12,
            message: '长度必须是12个字符',
            trigger: 'blur',
          },
        ],
        toAccount: [
          {
            required: true,
            message: '请输入收款帐号',
            trigger: 'blur',
          },
          {
            len: 12,
            message: '长度必须是12个字符',
            trigger: 'blur',
          },
        ],
        amount: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur',
          },
        ],
      },
      activeName: 'transferOut',
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
      if (_.has(self.$route.params, 'from') && self.$route.params.from !== '_') {
        var fibosAccount = fibosActions.getFibosAccount(self.$route.params.from);
        if (fibosAccount != null && fibosAccount.eosAccount !== '') {
          self.entity.fromAccount = fibosAccount.eosAccount;
          self.entity.memo = fibosAccount.id;
          self.fibosAccount = fibosAccount;
        } else {
          common.errorMsg('不能找到关联的EOS帐号');
          self.entity.fromAccount = '';
        }
      }
      if (_.has(self.$route.params, 'to') && self.$route.params.from !== '_') {
        self.entity.toAccount = self.$route.params.to;
      }
      if (_.has(self.$route.params, 'amount')) {
        self.entity.amount = self.$route.params.amount;
      }
    },
    doSave() {
      //保存实体数据
      var self = this;
      this.$refs.transferForm.validate(valid => {
        if (valid) {
          //TODO 保存前的准备工作
          var newEntity = _.cloneDeep(self.entity);
          fibosActions.transferEOS(self.entity.fromAccount, self.fibosAccount.eosPriKey, self.entity.toAccount, self.entity.amount, self.entity.memo, r => {
            console.log(r);
          });
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
