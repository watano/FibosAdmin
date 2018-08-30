import common from '../assets/common.js';
import FIBOS from 'fibos.js';
import _ from 'lodash';
// import http from 'http';

export default {
  FibosChainID: '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a',
  EOSChainID: '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a',
  EOSRPCServer: 'http://api-mainnet1.starteos.io',
  RPCServerPort: 8870,
  P2PServerPort: 9870,
  AllRPCServers: ['se-rpc.fibos.io', 'sl-rpc.fibos.io', 'to-rpc.fibos.io', 'ca-rpc.fibos.io', 'ln-rpc.fibos.io', 'va-rpc.fibos.io'],
  AllP2PServers: ['se-p2p.fibos.io', 'sl-p2p.fibos.io', 'to-p2p.fibos.io', 'ca-p2p.fibos.io', 'ln-p2p.fibos.io', 'va-p2p.fibos.io'],
  FOTokenAccount: 'fiboscouncil',
  _currentServerIndex: 0,
  _currentFibosAccount: '',
  _verbose: true,
  _logger: {
    log: null,
    error: null,
  },
  _fibos_client: null,
  init: function(page) {
    common.init(page);
  },
  getRPCServerUrl: function() {
    return 'http://' + this.AllRPCServers[this._currentServerIndex] + ':' + this.RPCServerPort;
  },
  getP2PServerUrl: function() {
    return 'http://' + this.AllP2PServers[this._currentServerIndex] + ':' + this.P2PServerPort;
  },
  //获取当前Fibos账户的信息
  getFibosAccount: function(accountId) {
    var allAccounts = this.fetchAllAccounts();
    for (var id in allAccounts) {
      if (id === accountId) return allAccounts[id];
    }
    return null;
  },
  //获取所有账户数据
  fetchAllAccounts: function() {
    var allAccounts = common.getState('allAccounts', {});
    return allAccounts;
  },
  //保存Account信息
  saveAccount: function(account) {
    var allAccounts = this.fetchAllAccounts();
    allAccounts[account.id] = account;
    common.upState('allAccounts', allAccounts);
  },
  //删除Account信息
  delAccount: function(accountId) {
    var allAccounts = this.fetchAllAccounts();
    _.unset(allAccounts, accountId);
    common.upState('allAccounts', allAccounts);
  },
  //获取fibos_client对象
  fibosClient: function(fibosPrivKey, recreate) {
    if (recreate === true || this._fibos_client === null) {
      var fibos_client = FIBOS({
        chainId: this.EOSChainID,
        keyProvider: fibosPrivKey,
        httpEndpoint: this.getRPCServerUrl(),
        verbose: this._verbose,
        logger: this._logger,
      });
      this._fibos_client = fibos_client;
    }
    return this._fibos_client;
  },
  errorHandler: function(e) {
    common.closeLoading();
    common.errorMsg(e);
    //TODO 更多友好错误提示
  },
  //----------------------------------------------------------
  //生成一个 FIBOS 公私钥
  genKeys: function(callBack) {
    var keys = {};
    common.openLoading();
    FIBOS.modules.ecc
      .randomKey()
      .then(value => {
        keys.priKey = value;
      }, this.errorHandler)
      .then(() => {
        keys.pubKey = FIBOS.modules.ecc.privateToPublic(keys.priKey);
        callBack(keys);
        common.closeLoading();
      }, this.errorHandler);
  },
  //免费创建一个 FIBOS 账号
  createAccount: function(account, pubkey, callBack, errBack) {
    common.postAction(
      'http://tunnel.fibos.io/1.0/app/token/create',
      // '/api/fibos/app/token/create',
      {
        account: account,
        pubkey: pubkey,
      },
      callBack,
      errBack
    );
    // var httpClient = new http.Client();
    // var res = httpClient
    //   .post('http://tunnel.fibos.io/1.0/app/token/create', {
    //     json: {
    //       account: account,
    //       pubkey: pubkey,
    //     },
    //   })
    //   .json();
    // if (res.message === 'success') {
    //   callBack(res);
    // }
  },

  //跨链转账
  transferEOS: function(eosFromAccount, eosPriKey, eosToAccount, eosNum, memo, callBack) {
    var eos_client = FIBOS({
      chainId: this.EOSChainID,
      keyProvider: eosPriKey,
      httpEndpoint: this.EOSRPCServer,
      verbose: this._verbose,
      logger: this._logger,
    });
    eos_client
      .ctxtransfer(eosFromAccount, eosToAccount, eosNum + ' EOS', memo)
      // 	{
      //   from: eosFromAccount,
      //   to: eosToAccount,
      //   quantity: eosNum + ' EOS',
      //   memo: memo,
      // })
      .then(callBack)
      .catch(this.errorHandler);
  },

  //查询 FIBOS 余额
  getAccountBalances: function(fibosAccount, fibosPrivKey, callBack) {
    var fibos_client = this.fibosClient(fibosPrivKey);
    return fibos_client
      .getTableRows(true, 'eosio.token', fibosAccount, 'accounts')
      .then(callBack)
      .catch(this.errorHandler);
  },

  //兑换通证
  exchangeFOSync: function(fibosAccount, fibosPrivKey, eosNum, memo) {
    var fibos_client = this.fibosClient(fibosPrivKey);
    let ctx = fibos_client.contractSync('eosio.token');
    let result = ctx.exchangeSync(fibosAccount, eosNum + ' EOS@eosio', '0.0000 FO@eosio', memo, {
      authorization: fibosAccount,
    });
    //console.log(result);
    return result;
  },
};
