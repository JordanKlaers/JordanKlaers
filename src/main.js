'use strict';
import Vue from 'vue';
import App from './App';
import store from '_store_/store';

import BrowserCheck from '_mixins_/BrowserCheck';
import _gsap from '_mixins_/Gsap';

Vue.mixin(BrowserCheck);
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