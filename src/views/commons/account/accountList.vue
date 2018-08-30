<template>
	<page-grid ref="accountPageGrid" v-on:doQuery="search">
		<el-form ref="accountQueryForm" :model="query" label-width="120px" slot="queryForm">
			<el-row>
				<el-col :xs="24" :sm="12" :md="8" :lg="8">
					<el-form-item>
						<el-button type="primary" icon="el-icon-plus" @click="doAdd">新增</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-table :data="allData" stripe border highlight-current-row resizable slot="resultGrid" @expand-change="fetchAccount">
			<el-table-column type="expand">
				<template slot-scope="props">
					<div v-for="account in accountRows" :key="account.balance.quantity" style="width:300px;height:30px;">
						<span>{{ account.balance.quantity }}</span>
						<i class="el-icon-star-on" v-if="account.primary == '1'"></i>
						<span style="float:right;">
							<el-button-group>
								<el-button size="mini" type="success" icon="el-icon-plus" @click="doAddBlance(props.row.id, account)">{{(account.balance.quantity.indexOf('EOS')>0)?'充值':'兑换'}}</el-button>
								<el-button size="mini" type="danger" icon="el-icon-minus" @click="doCutBlance(props.row.id, account)">{{(account.balance.quantity.indexOf('EOS')>0)?'提现':'出售'}}</el-button>
							</el-button-group>
						</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="ID" width="150"></el-table-column>
			<el-table-column label="公/私钥">
				<template slot-scope="scope">
					<div>
						<div>
							<b>公钥:</b>{{scope.row.pubKey}}</div>
						<span @click="showPrivKey(scope.row.priKey)">
							<b>显示私钥</b>
						</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="关联EOS">
				<template slot-scope="scope">
					<div>
						<div>
							<b>帐号:</b>
							<a :href="'https://eospark.com/MainNet/account/'+scope.row.eosAccount" target="_blank">{{scope.row.eosAccount}}</a>
						</div>
						<div>
							<b>公钥:</b>{{scope.row.eosPubKey}}</div>
						<div @click="showPrivKey(scope.row.eosPriKey)">
							<b>显示私钥</b>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button-group>
						<el-button size="small" type="success" icon="el-icon-edit" @click="doEdit(scope.$index, scope.row)"></el-button>
						<el-button size="small" type="danger" icon="el-icon-delete" @click="doDelete(scope.$index, scope.row)"></el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
	</page-grid>
</template>
<script>
import _ from 'lodash';

import common from '../../../assets/common.js';
import PageGrid from '../../../components/PageGrid.vue';
import fibosActions from '../../../actions/fibosActions.js';
import { RowSpanInfo } from '../../../assets/SpanInfo.js';

var spanInfo = new RowSpanInfo(0, 'type');
export default {
  components: {
    'page-grid': PageGrid,
  },
  data() {
    return {
      query: common.getState('accountListQuery', {
        name: '',
      }),
      allData: [],
      accountRows: [],
    };
  },
  created: function() {},
  mounted: function() {
    common.init(this);
    fibosActions.init(this);
    this.search();
  },
  methods: {
    search() {
      var self = this;
      var allAccounts = fibosActions.fetchAllAccounts();
      var allData = [];
      for (var id in allAccounts) {
        allData.push(allAccounts[id]);
      }
      self.allData = allData;
    },
    doAdd() {
      common.goto('/account/add');
    },
    doAddSame(index, el) {
      common.goto('/account/add/' + el.id);
    },
    doEdit(index, el) {
      common.goto('/account/edit/' + el.id);
    },
    doDelete(index, el) {
      var self = this;
      common.confirmMsg('警告', '确认删除这条记录?', () => {
        fibosActions.delAccount(el.id);
        self.search();
      });
    },
    showPrivKey(key) {
      common.okMsg(key);
    },
    fetchAccount(row) {
      var self = this;
      self.accountRows = [{ primary: 0, balance: { quantity: '0.0000 EOS', contract: 'eosio' } }, { primary: 1, balance: { quantity: '881.0206 FO', contract: 'eosio' } }];
      // fibosActions.getAccountBalances(row.id, row.priKey, v => {
      //   if (typeof v === 'object' && typeof v.rows === 'object') {
      //     self.accountRows = v.rows;
      //     row.balances = v.rows;
      //     fibosActions.saveAccount(row);
      //   }
      // });
    },
    doAddBlance(accountId, account) {
      var lst = _.split(account.balance.quantity, ' ', 2);
      var num = lst[0];
      if (account.balance.quantity.indexOf('FO') > 0) {
        common.goto('/transfer/FO/' + accountId + '/' + num);
      } else {
        common.goto('/transfer/EOS/' + accountId + '/' + fibosActions.FOTokenAccount + '/' + num);
      }
    },
    doCutBlance(accountId, account) {
      var lst = _.split(account.balance.quantity, ' ', 2);
      var num = lst[0];
      if (account.balance.quantity.indexOf('FO') > 0) {
        common.goto('/transfer/FO/' + accountId + '/-' + num);
      } else {
        common.errorMsg('暂时不支持此操作!');
        //common.goto('/transfer/EOS/' + accountId + '/' + fibosActions.FOTokenAccount + '/-' + num);
      }
    },
  },
};
</script>
