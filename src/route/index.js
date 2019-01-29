import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const testPage = () => import (/*webpackChunkName:"test"*/'../component/test/index.vue')

export default new Router({
    routes: [{
        path: '/test',
        component: testPage
    }]
})
