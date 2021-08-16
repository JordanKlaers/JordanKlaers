'use strict';
import Vue from 'vue';
import App from './App';
import store from '_store_/store';

import utils from '_mixins_/utils';
import _gsap from '_mixins_/Gsap';

Vue.mixin(utils);
Vue.mixin(_gsap);
new Vue({
	el: '#crazyapp',
	components: { App },
	store,
	render: function(createElement) {
		return createElement(App);
	}
});

export default store;