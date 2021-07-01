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
import { debounce, throttle } from 'lodash-es';
import cssVariables from '_mixins_/cssVariables';
export default {
	name: 'bann1er',
	mixins: [ cssVariables ],
	data() {
		return {
			clickHandler: debounce(this.toggleMode, 300, { 'leading': true, 'trailing': false }),
			windowResizeScaleHandler: debounce(this.setScale, 300, { 'leading': false, 'trailing': true }),
			mousemoveHandler: throttle(this.mouseAvoidAnimationHandler, 100),
			activeMode: 'dark',
			inactiveMode: 'light'
		}
	},
	beforeMount() {
		window.addEventListener('resize', this.windowResizeScaleHandler);
		window.addEventListener('mousemove', this.mousemoveHandler);
	},
	mounted() {
		this.setScale();
	},
	methods: {
		toggleMode() {
			/*
			this.isLight = !this.isLight;
			let styles = document.getElementById('app').style;
			if (this.activeMode == 'light') {
				this.activeMode = 'dark';
				this.inactiveMode = 'light';
			}
			else if (this.activeMode == 'dark') {
				this.activeMode = 'light';
				this.inactiveMode = 'dark';
			}
			this.active.forEach(activeStyle => {
				/*
					if there is a css variable for the current mode, that matches the name of the active variable, update to that value
					for example if the active variable is "--active-background-color" and the mode is "dark", look for "--dark-background-color"
					via this['dark']["--dark-background-color"]
				/
				let currentModeColorValue = this[this.activeMode][activeStyle.replace('active', this.activeMode)];
				if (currentModeColorValue) {
					styles.setProperty(activeStyle, currentModeColorValue);
				} 
				/*
					If there is not variable/value for the current mode matching the active variable name, then check if there is an inactive and swap to that
					This allows for a 
				/
			});
			this.inactive.forEach(inactiveStyle => {
				styles.setProperty(inactiveStyle, this[this.inactiveMode][inactiveStyle.replace('inactive', this.inactiveMode)]);
			});
			*/
			if (this.activeMode == 'light') {
				this.activeMode = 'dark';
				this.inactiveMode = 'light';
			}
			else if (this.activeMode == 'dark') {
				this.activeMode = 'light';
				this.inactiveMode = 'dark';
			}
			document.body.setAttribute('data-mode', this.activeMode);
			Array.from(document.querySelectorAll('.light')).forEach(el => el.classList.toggle('visible'));
			Array.from(document.querySelectorAll('.dark')).forEach(el => el.classList.toggle('visible'));
		},
		map( x,  in_min,  in_max,  out_min,  out_max) {
			return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		},
		setScale() {
			let styles = document.getElementById('app').style;
			let globalScale =  Math.min(window.innerWidth, 1000)/1000;
			styles.setProperty('--global-scale-to-window-width', globalScale);

			let bioScale = Math.min(window.innerWidth * 0.2, 100);
			console.log('bioScale: ', bioScale);
			styles.setProperty('--bio-placement', `${bioScale}px`);
		},
		mouseAvoidAnimationHandler(event) {
			//The tiny square at the top
			let square2DStyles = document.querySelectorAll('.square-2-d');
			let rightValue = this.map(event.clientX, 0, window.innerWidth, 240, 265);

			let curve1CStyles;
			let curve1CRotateValue;
			let square2CStyles;
			let square2CRotateXValue;
			let square2CTranslateYValue;
			if (!this.isInternetExplorer) {
				//the bottom left curve use in everything but IE
				curve1CStyles = document.querySelector('#curve-1-c').style
				curve1CRotateValue = this.map(event.clientX, 0, window.innerWidth, 204, 123);
			} else {
				//The bottom left colored square used as a fallback for IE
				square2CStyles = document.querySelectorAll('.square-2-c');
				square2CRotateXValue = this.map(event.clientY, 0, window.innerHeight, -20, 28);
				square2CTranslateYValue = this.map(event.clientY, 0, window.innerHeight, -5, 20);
			}
			//The medium sized square on the right
			let square1BStyles = document.querySelectorAll('.square-1-b');
			let square1BRotateValue = this.map(event.clientX, 0, window.innerWidth, -45, 10);

			window.requestAnimationFrame(() => {
				//set both light and dark instance of the square
				square2DStyles[0].style.setProperty('--right', `${rightValue}px`);
				square2DStyles[1].style.setProperty('--right', `${rightValue}px`);
				if (!this.isInternetExplorer) {
					curve1CStyles.setProperty('--rotate', `${curve1CRotateValue}deg`);
				} else {
					square2CStyles[0].style.setProperty('--rotateX', `${square2CRotateXValue}deg`);
					square2CStyles[1].style.setProperty('--translateY', `${square2CTranslateYValue}px`);
				}

				square1BStyles[0].style.setProperty('--rotate', `${square1BRotateValue}deg`);
				square1BStyles[1].style.setProperty('--rotate', `${square1BRotateValue}deg`);
				
			});

		}
	},
	watch: {}
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/_mixins';
#banner {
	// visibility: hidden;
	// @include box-shadow((color: rgba(0,0,0,0.05))...);
	display: flex;
	transition: 1s;
	color: var(--text-color);
	position: fixed;
	top: 0;
    z-index: 1;
    left: 0;
    right: 0;
	// &::before {
	// 	content: '';
	// 	transition: 1s;
	// 	background-color: var(--neutral-3);
	// 	position: absolute;
	// 	//this counters the 30px padding
	// 	top: -30px;
	// 	left: 0;
	// 	right: 0;
	// 	height: 470px;
	// 	transform-origin: left;
	// 	transform: skewY(-10deg);
	// }
	span {
		display: inline-block;
		line-height: 20px;
		z-index: 2;
		&.dark-mode {
			cursor: pointer;
		}
	}
}
</style>


