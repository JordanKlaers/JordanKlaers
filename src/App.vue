<template>
	<div id="app" class="ie-fallback">
		<banner></banner>
		<geometry></geometry>
		<section id="bio">
			<bio></bio>
		</section>
		<portfolio-list></portfolio-list>
	</div>
</template>

<script>
import Bio from './components/Bio';
import Banner from './components/Banner';
import Geometry from './components/Geometry';
import PortfolioList from './components/PortfolioList';
import 'babel-polyfill';
import * as gsap from '_gsap_';
import ScrollTrigger from '_gsap_/ScrollTrigger';
import CustomEase from '_gsap_/CustomEase';



export default {
	name: 'app',
	components: {
		Bio,
		Banner,
		Geometry,
		PortfolioList
	},
	data() {
		return {
			bioAnimation: null
		}
	},
	computed: {
		// bioAnimation: {
		// 	get() {
		// 		new gsap.TimelineMax()
        //         .fromTo('#bio-container .bio-animation-wrapper',
		// 			{ opacity: 1, rotationX: 0, scale: 1, y: 0, z: 0, transformOrigin: "50% 50% -100px" },
		// 			{ duration: .5, ease: gsap.Linear.easeNone(), opacity: 1, rotationX: 90, y: 100, z: -100 })
        //         .fromTo('#bio-container .bio-animation-wrapper',
		// 			{ height: '160' },
        //         	{ height: '0px', duration: .5, ease: CustomEase.create("custom", "M0,0 C0.172,0 0.288,0.154 0.34,0.222 0.756,0.768 0.604,0.988 1,1") },
		// 			'-=.5');
		// 	}
		// }
	},
	mounted() {
		gsap.gsap.registerPlugin(ScrollTrigger);
		gsap.gsap.registerPlugin(CustomEase);
		console.log(gsap);
		let easeConfig = CustomEase.create("custom", "M0,0 C0.126,0.382 0.216,0.692 0.374,0.84 0.566,1.02 0.818,1.001 1,1");
		this.bioAnimation = new gsap.TimelineMax({
				scrollTrigger: {
					trigger: "#bio",
					scrub: true,
					// invalidateOnRefresh: true,
					// anticipatePin: 1,
					// snap: 1 / 10,
					start: "top top",
					end: "bottom top"
				},
				onUpdate: () => {
					console.log('updating', this.bioAnimation.progress());
					gsap.TweenLite.to('#bio-container .bio-animation-wrapper', 0.5, {
						// progress: this.bioAnimation.progress(),
                        ease: gsap.Power3.easeOut
					})
					.progress(this.bioAnimation.progress());
				}
			})
			.fromTo('#bio-container .bio-animation-wrapper',
				{ opacity: 1, rotationX: 0, scale: 1, y: 0, z: 0, transformOrigin: "50% 50% -100px" },
				{ ease: easeConfig, opacity: 1, rotationX: 90, y: 100, z: -100 })
			.fromTo('#bio-container .bio-animation-wrapper',
				{ height: '160' },
				{ height: '0px', ease: CustomEase.create("custom", "M0,0 C0.172,0 0.288,0.154 0.34,0.222 0.756,0.768 0.604,0.988 1,1") },
				'-=.5')
			// .onUpdate(()=> {
			// 	console.log("The animation is updating");
			// });
			// .fromTo('#bio-container .bio-animation-wrapper',
			// 	{ opacity: 1, rotationX: 0, scale: 1, y: 0, z: 0, transformOrigin: "50% 50% -100px" },
			// 	{ duration: .5, ease: gsap.Linear.easeNone(), opacity: 1, rotationX: 90, y: 100, z: -100 })
			// .fromTo('#bio-container .bio-animation-wrapper',
			// 	{ height: '160' },
			// 	{ height: '0px', duration: .5, ease: CustomEase.create("custom", "M0,0 C0.172,0 0.288,0.154 0.34,0.222 0.756,0.768 0.604,0.988 1,1") },
			// 	'-=.5');
	}
};
</script>
<style lang='scss' type='text/css'>
@import '~_scss_/app';
#app {
	&::before {
		content: '';
		transition: 1s;
		background-color: var(--neutral-3);
		position: absolute;
		//this counters the 30px padding
		top: -30px;
		left: 0;
		right: 0;
		height: 470px;
		transform-origin: left;
		transform: skewY(-10deg);
	}
	#bio {
		width: 100vw;
		// height: 30rem;
		height: 70vh;
		border: 1px solid white;
	}
}
</style>
<style type='text/css'>
@import '~_icomoon_/style.css';
</style>
