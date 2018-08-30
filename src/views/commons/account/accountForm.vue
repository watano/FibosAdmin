<template>
	<div>
		<el-form ref="accountForm" :model="entity" :rules="rules" label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24">
					<h2>基本账户信息</h2>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="账户名" prop="id">
						<el-input v-model="entity.id"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="公钥" prop="pubKey">
						<el-input v-model="entity.pubKey">
							<el-button slot="append" icon="el-icon-refresh" @click="genKeys"></el-button>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="私钥" prop="priKey">
						<el-input v-model="entity.priKey"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24">
					<h2>EOS关联账户</h2>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="EOS账户名" prop="eosAccount">
						<el-input v-model="entity.eosAccount"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="EOS公钥" prop="eosPubKey">
						<el-input v-model="entity.eosPubKey"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item label="EOS私钥" prop="eosPriKey">
						<el-input v-model="entity.eosPriKey"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24">
					<el-form-item>
						<el-button type="primary" @click="doReg">注册</el-button>
						<el-button type="success" @click="doSave">保存</el-button>
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
      entity: {
        id: '',
        pubKey: '',
        priKey: '',
      },
      rules: {
        id: [
          {
            required: true,
            message: '请输入帐号名',
            trigger: 'blur',
          },
          {
            len: 12,
            message: '长度必须是12个字符',
            trigger: 'blur',
          },
        ],
        pubKey: [
          {
            required: true,
            message: '请输入公钥',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur',
          },
        ],
        priKey: [
          {
            required: true,
            message: '请输入私钥',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur',
          },
        ],
      },
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
    doReg() {
      var self = this;
      fibosActions.createAccount(
        self.entity.id,
        self.entity.pubKey,
        r => {
          common.okMsg(r);
        },
        common.errorMsg
      );
    },
    genKeys() {
      var self = this;
      var keys = fibosActions.genKeys(keys => {
        if (typeof keys === 'object' && typeof keys.pubKey === 'string' && typeof keys.priKey === 'string') {
          self.entity.pubKey = keys.pubKey;
          self.entity.priKey = keys.priKey;
        }
      });
    },
  },
};
</script>
