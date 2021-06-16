<template>
	<div id="app" class="ie-fallback">
		<banner></banner>
		<geometry></geometry>
		<bio></bio>
	</div>
</template>

<script>
import Bio from './components/Bio';
import Card from './components/Card';
import Banner from './components/Banner';
import Geometry from './components/geometry';
import 'babel-polyfill';
export default {
	name: 'app',
	components: {
		Bio,
		Banner,
		Card,
		Geometry
	},
	data() {
		return {
			regionsFilterList: [],
			searchValue: ''
		}
	},
	mounted() {
		if (this.isInternetExplorer) {
			//this.$refs['card-container'].classList.add('ie-fallback');
		}
	}
};
</script>
<style lang='scss' type='text/css'>
@import '~_scss_/app';
</style>
<style type='text/css'>
@import '~_icomoon_/style.css';
</style>
