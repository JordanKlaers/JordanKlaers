<template>
	<div>
		<section class="code-example" v-for="(thing, index) in codeExamples" :key="index">
			<component :is="thing"></component>
		</section>
	</div>
</template>

<script>
import Thermostat from './portfolio/Thermostat.vue';
export default {
	name: 'portfolio-list',
	components: {
		'Thermostat': Thermostat
	},
	data() {
		return  {
			codeExamples: [
				'Thermostat'
				// thermostat,
				// thermostat,
				// thermostat,
				// thermostat,
				// thermostat
			]
		}
	},
	mounted() {
		// console.log(this);
		// gsap.gsap.registerPlugin(ScrollTrigger);
		// gsap.gsap.utils.toArray(".work").forEach((panel, i) => {
		// 	ScrollTrigger.create({
		// 		trigger: panel,
		// 		start: "top 39%",
		// 		end: "bottom 39%",
		// 		scrub: true,
		// 		animation: this.createAnimation(panel)
		// 	});
		// });
	},
	methods: {
		createAnimation(element) {
			// console.log("element thingy: ", element)
			// let timelineMax = new gsap.TimelineMax();
			// return timelineMax.fromTo(element, {
			// 	opacity: 1
			// }, {
			// 	opacity: 0
			// });
		}
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/variables';
@import '~_scss_/_mixins';
/*
#portfolio-list {
	position: relative;
	border: 1px solid white;
	width: calc(75vw - var(--bio-placement));
	margin-left: calc(var(--bio-placement) + 30px);
	margin-right: auto;
	margin-top: 48vh;
	z-index: 3;
	.line {
		position: fixed;
		height: 52vh;
		left: var(--bio-placement);
		top: 48vh;
		width: 0.5em;
		border-radius: 0.25em 0.25em 0 0;
		background-image: linear-gradient(to bottom, var(--primary-1-b) 30%, rgba(255,0,0,0));
	}
}
*/
.code-example {
	height: 100vh;
	width: 100vw;
	border: 1px solid yellow;
}
</style>
