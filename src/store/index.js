import Vue  from 'vue';
import Vuex from 'vuex';
import gState   from './state.js';//全局配置
import gGetters from './getters.js';//全局配置
import gActions from './actions.js';//全局配置
import gMutations from './mutations.js';//全局配置
Vue.use(Vuex);
export default new Vuex.Store({
	strict: false,
	state:gState,
	getters:gGetters,
	actions:gActions,
	mutations:gMutations,
	modules:{
	}
});