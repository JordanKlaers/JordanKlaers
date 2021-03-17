<template>
	<div id="banner" class="p-30">
		<span class="ft-xtr-bold ft-sz-20">Where in the world?</span>
		<span
			class="ft-normal m-lft-auto ft-sz-18 dark-mode"
			@click="clickHandler">
			<i class='icon-moon-stroke ft-sz-16 p-rgt-15'></i>Dark Mode
		</span>
	</div>
</template>

<script>
import { debounce } from 'lodash-es';
import cssVariables from '_mixins_/cssVariables';
export default {
	name: 'bann1er',
	mixins: [ cssVariables ],
	data() {
		return {
			clickHandler: debounce(this.toggleMode, 300, { 'leading': true, 'trailing': false }),
			mode: 'dark'
		}
	},
	methods: {
		toggleMode() {
			this.isLight = !this.isLight;
			let styles = document.getElementById('app').style;
			if (this.mode == 'light') this.mode = 'dark';
			else if (this.mode == 'dark') this.mode = 'light';
			this.active.forEach(activeStyle => {
				styles.setProperty(activeStyle, this[this.mode][activeStyle.replace('active', this.mode)]);
			});
			this.inactive.forEach(inactiveStyle => {
				styles.setProperty(inactiveStyle, this[this.mode][inactiveStyle.replace('inactive', this.mode)]);
			});
			Array.from(document.querySelectorAll('.light')).forEach(el => el.classList.toggle('visible'));
			Array.from(document.querySelectorAll('.dark')).forEach(el => el.classList.toggle('visible'));
		}
	},
	watch: {}
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/_mixins';
#banner {
	@include box-shadow((color: rgba(0,0,0,0.05))...);
	display: flex;
	transition: 1s;
	color: var(--active-text-color);
	background-color: var(--active-app-bg-color);
	position: absolute;
    z-index: 3;
    left: 0;
    right: 0;
	span {
		display: inline-block;
		line-height: 20px;
		&.dark-mode {
			cursor: pointer;
		}
	}
}
</style>


