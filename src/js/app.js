//有些库如axios使用原生Promise，故全环境引入Promise支持，但js中的Promise任然使用babel转码
import 'es6-promise/auto';
import Vue  from 'vue';
import App from '../component/App.vue';
import VueRouter  from 'vue-router';
import RouterConf from '../route/router';
import store from '../store/index';
import "./common/prototype.js";
import "../css/common.scss";
// vuejs错误上报，使用前请替换下面sentry.io链接，申请网址：https://sentry.io
// import Raven from 'raven-js';
// import RavenVue from 'raven-js/plugins/vue';
// Raven.config('https://8f6bf16870944913a53bf9922ddc3d33@sentry.io/267157').addPlugin(RavenVue, Vue).install();
Vue.use(VueRouter);
const router = new VueRouter({
  routes: RouterConf
});
const app = new Vue({
	el:'#app',
    router,
	store,
	components: { App },
    template: '<App/>'
});
document.body.addEventListener("touchmove",e=>{
    if( e._prevent ){
        e.preventDefault();
    }
},{passive: false});
