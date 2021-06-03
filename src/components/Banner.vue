<template>
	<div id="banner" class="p-30">
		<span
			class="ft-normal m-rgt-auto ft-sz-18 dark-mode"
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
			windowResizeScaleHandler: debounce(this.setScale, 300, { 'leading': false, 'trailing': true }),
			mode: 'dark'
		}
	},
	beforeMount() {
		window.addEventListener('resize', this.windowResizeScaleHandler);
	},
	mounted() {
		this.setScale();
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
		},
		setScale() {
			let styles = document.getElementById('app').style;
			let globalScale =  Math.min(window.innerWidth, 1000)/1000;
			styles.setProperty('--global-scale-to-window-width', globalScale);

			let bioScale = Math.min(window.innerWidth * 0.2, 100);
			console.log('bioScale: ', bioScale);
			styles.setProperty('--bio-placement', `${bioScale}px`);

		}
	},
	watch: {}
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/_mixins';
#banner {
	// visibility: hidden;
	@include box-shadow((color: rgba(0,0,0,0.05))...);
	display: flex;
	transition: 1s;
	color: var(--active-text-color);
	background-color: var(--active-neutral-3);
	position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
	height: 470px;
	clip-path: polygon(0px 0px, 100% 0%, 100% 170px, 0% 100%, 0px 0px);
	span {
		display: inline-block;
		line-height: 20px;
		&.dark-mode {
			cursor: pointer;
		}
	}
}
</style>


