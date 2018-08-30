import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import '../static/css/materialdesignicons.css';
import lang from 'element-ui/lib/locale/lang/zh-CN';
import locale from 'element-ui/lib/locale';
import Index from './views/Index.vue';

import MenuInfo from './menus.js';
import App from './mainApp.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);
locale.use(lang);

// Vue.config.errorHandler = function(err, vm, info) {
//   try {
//     if (err.message.indexOf("'tabIndex'") > 0) {
//       return;
//     }
//   } catch (e) {}
//   console.error(err);
// };
/* eslint-disable no-new */

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/index',
      name: '首页',
      component: Index,
      children: MenuInfo.router,
    },
    { path: '*', redirect: '/index' },
  ],
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  document.title = to.name;
  next();
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
