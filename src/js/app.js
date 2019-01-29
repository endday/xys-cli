//有些库如axios使用原生Promise，故全环境引入Promise支持，但js中的Promise任然使用babel转码
import 'es6-promise/auto'
import Vue from 'vue'
import App from '../component/App.vue'
import router from '../route/index.js'
import store from '../store/index'
import './common/prototype.js'
import '../css/common.scss'

const app = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
document.body.addEventListener('touchmove', e => {
    if (e._prevent) {
        e.preventDefault()
    }
}, { passive: false })
