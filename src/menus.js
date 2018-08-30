import accountList from './views/commons/account/accountList.vue';
import accountForm from './views/commons/account/accountForm.vue';
import transferEOS from './views/commons/transfer/transferEOS.vue';
import transferFO from './views/commons/transfer/transferFO.vue';

export default {
  router: [
    { path: '/account/list', name: '账户列表', component: accountList },
    { path: '/account/add', name: '新建账户', component: accountForm },
    { path: '/account/edit/:id', name: '编辑账户', component: accountForm },
    { path: '/transfer/EOS/:from/:to/:amount', name: '充值/提现EOS', component: transferEOS },
    { path: '/transfer/FO/:account/:amount', name: '兑换/出售FO', component: transferFO },
  ],
  allMenus: [
    {
      code: '/index',
      name: '首页',
      icon: 'home',
      type: '1',
      sort: 10,
      enableFlag: true,
      delFlag: '0',
      authorities: 'home',
    },
    {
      code: '/',
      name: '账户管理',
      icon: 'settings',
      type: '10',
      items: [
        {
          code: '/account/list',
          name: '账户列表',
          icon: 'settings',
          type: '1',
        },
        {
          code: '/transfer/EOS/_/_/0',
          name: '充值/提现EOS',
          icon: 'settings',
          type: '1',
        },
        {
          code: '/transfer/FO/_/0',
          name: '兑换/出售FO',
          icon: 'settings',
          type: '1',
        },
      ],
    },
  ],
};
