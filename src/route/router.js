const testPage = () => import ( /*webpackChunkName:"test"*/ "../component/test/index.vue");
export default [{
        path: '/test',
        component: testPage
    }
];