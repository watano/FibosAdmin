<template>
	<div class="wrapper">
		<div class="main-header" v-bind:class="{ fixed: headerBarIsFixed ,absolute:!headerBarIsFixed}">
			<div class="appBar" style="overflow:hidden;">
				<div v-bind:class="{ sidebarmargin:open }">
					<div class="left">
						<el-button icon="el-icon-d-arrow-left" type="primary" class="navBtn" @click="toggleAppDrawer" v-show="open"></el-button>
						<el-button icon="el-icon-d-arrow-right" type="primary" class="navBtn" @click="toggleAppDrawer" v-show="!open"></el-button>
					</div>
					<div class="left">
						<el-button type="primary" @click="swichHeadBar" v-show="headerBarIsFixed&&false">
							<i class="mdi mdi-format-vertical-align-top mdi-24px"></i>
						</el-button>
						<el-button type="primary" @click="swichHeadBar" v-show="!headerBarIsFixed&&false">
							<i class="mdi mdi-format-vertical-align-center mdi-24px"></i>
						</el-button>
					</div>
					<div class="appbar-title">
						<span>{{title}}</span>
					</div>
				</div>
				<div class="right">
					<div class="appbar-title">
						<span class="username">&nbsp;{{userInfo.fullName}}&nbsp;</span>&nbsp;&nbsp;&nbsp;
					</div>
				</div>
			</div>
		</div>
		<transition name="el-zoom-in-left">
			<aside class="main-sidebar" v-show="open">
				<div class="brandDiv">
					<a href="#/" class="brand">
						<b>Fibos</b>
					</a>
				</div>
				<div class="sidebar">
					<el-menu class="el-menu-vertical-demo" @select="sidebarSelect" background-color="#324157" text-color="#bfcbd9" :default-active="currentMenu" :unique-opened="true">
						<template v-for="menu in allMenus">
							<el-menu-item v-if="menu.type === '1'" :index="menu.code" v-bind:key="menu.id">
								<i v-if="menu.icon != ''" :class="'mdi mdi-'+menu.icon+' mdi-18px'"></i>{{menu.name}}</el-menu-item>
							<el-submenu v-if="menu.type === '10'" :index="menu.name" v-bind:key="menu.id">
								<template slot="title">
									<i v-if="menu.icon != ''" :class="'mdi mdi-'+menu.icon+' mdi-18px'"></i>{{menu.name}}</template>
								<template v-for="submenu1 in menu.items">
									<el-menu-item v-if="submenu1.type === '1'" :index="submenu1.code" v-bind:key="submenu1.id">
										<i v-if="submenu1.icon != ''" :class="'mdi mdi-'+submenu1.icon+' mdi-18px'"></i>{{submenu1.name}}</el-menu-item>
									<el-submenu v-if="submenu1.type === '20'" :index="submenu1.name" v-bind:key="submenu1.id">
										<template slot="title">
											<i v-if="submenu1.icon != ''" :class="'mdi mdi-'+submenu1.icon+' mdi-18px'"></i>{{submenu1.name}}</template>
										<template v-for="submenu2 in submenu1.items">
											<el-menu-item v-if="submenu2.type === '1'" :index="submenu2.code" v-bind:key="submenu2.id">
												<i v-if="submenu2.icon != ''" :class="'mdi mdi-'+submenu2.icon+' mdi-18px'"></i>{{submenu2.name}}</el-menu-item>
										</template>
									</el-submenu>
								</template>
							</el-submenu>
						</template>
					</el-menu>
				</div>
			</aside>
		</transition>
		<div class="content-wrapper" v-bind:class="{sidebarOpen: open, sidebarClose: !open}">
			<div class="container-fluid">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
import common from '../assets/common.js';
import MenuInfo from '../menus.js';

export default {
  data() {
    return {
      title: '',
      open: function() {
        return window.innerWidth > 993;
      },
      userInfo: {
        id: 0,
        fullName: '',
        user: {
          id: 0,
          username: '',
        },
      },
      allMenus: MenuInfo.allMenus,
      headerBarIsFixed: false,
    };
  },
  computed: {
    currentMenu: function() {
      try {
        return this.$route.path;
      } catch (e) {
        return '';
      }
    },
  },
  created: function() {
    common.init(this);
    this.initData();
  },
  mounted() {
    this.routes = this.$router.options.routes;
    this.title = this.$route.name;
    window.addEventListener('resize', this.resize);
    this.$router.beforeEach((to, from, next) => {
      this.title = to.name;
      next();
    });
  },
  methods: {
    initData() {},
    resize() {
      const fullWidth = window.innerWidth;
      if (fullWidth < 768) {
        this.open = false;
      } else {
        this.open = true;
      }
    },
    toggleAppDrawer() {
      this.open = !this.open;
    },
    sidebarSelect(key, keyPath) {
      // console.log(key);
      common.goto(key);
    },
    appExit() {
      var self = this;
      common.confirmMsg('警告', '确认退出?', () => {});
    },
    swichHeadBar() {
      this.headerBarIsFixed = !this.headerBarIsFixed;
    },
    toUserDetail() {
      var self = this;
      common.goto('/userInfo/userCenter/' + self.userInfo.id);
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
  },
  components: {},
};
</script>
<style lang="css">
.username {
  cursor: pointer;
  padding: 17px 3px;
}

.username:hover {
  background: #1d90e6;
  border-color: #1d90e6;
  color: #fff;
}
</style>
