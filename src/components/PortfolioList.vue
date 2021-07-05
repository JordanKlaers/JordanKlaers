<template>
	<div>
		<section class="code-example" id="test" v-for="(thing, index) in codeExamples" :key="index" ref="sections">
			<component :is="thing" :trigger="scrollTriggers[index]"></component>
		</section>
		<div style="height: 100vh"></div>
	</div>
</template>

<script>
// import * as gsap from '_gsap_';
// import ScrollTrigger from '_gsap_/ScrollTrigger';
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
			],
			scrollTriggers: []
		}
	},
	mounted() {
		// this.$data._scrollTrigger.create({
		// 	trigger: this.$el,

		// })
		this.$refs.sections.forEach(section => {
			console.log('section: ', section);
			this.scrollTriggers.push({
				trigger: section,
				start: "top top",
				end: "bottom top",
				scrub: 0.6,
				snap: {
					snapTo: "labels", // snap to the closest label in the timeline
					duration: {min: 0.6, max: 0.6}, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
					delay: 0, // wait 0.2 seconds from the last scroll event before doing the snapping
					// ease: "power1.inOut" // the ease of the snap animation ("power3" by default)
				}
			});
		})
		
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
	// border: 1px solid yellow;
}
</style>
