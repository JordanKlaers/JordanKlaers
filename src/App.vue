<template>
	<div id="app" class="ie-fallback">
		<banner></banner>
		<geometry></geometry>
		<section id="bio">
			<bio :setContent="setContent"></bio>
		</section>
		<transition name="content-fade" @after-leave="updateCurrentContent">
			<contact v-if="content == 'contact'">
			</contact>
  		</transition>
		<transition name="content-fade" @after-leave="updateCurrentContent">
			<portfolio-list :summaryTrigger="bioTrigger" v-if="content == 'portfolio'">
			</portfolio-list>
  		</transition>
	</div>
</template>

<script>
import Bio from './components/Bio';
import Banner from './components/Banner';
import Geometry from './components/Geometry';
import PortfolioList from './components/PortfolioList';
import Contact from './components/Contact';
// import 'babel-polyfill';
import CustomEase from '_gsap_/CustomEase';

export default {
	name: 'app',
	components: {
		Bio,
		Banner,
		Contact,
		Geometry,
		PortfolioList
	},
	data() {
		return {
			bioAnimation: null,
			bioTrigger: {
				trigger: "#bio",
				scrub: 1,
				start: "top top",
				end: "bottom top",
				snap: {
					snapTo: "labels",
					duration: {min: 0.6, max: 0.6},
					delay: 0.2
				}
			},
			content: 'portfolio',
			/*
				contentPlaceholder allows for the desired content to be set/saved, while waiting for the leave animation
				of the currently displayed html. When complete, the callback from the vue
				transition element will update the this.content value to that of the placeholder, triggering the
				animation to display the intended html.
			*/
			contentPlaceHolder: ''
		}
	},
	computed: {
	},
	mounted() {
		this.bioAnimation = new this.$data._gsap.TimelineMax({
				scrollTrigger: this.bioTrigger
			})
			.addLabel('in')
			.fromTo('#bio-container .bio-animation-wrapper',
				{ opacity: 1, rotationX: 0, scale: 1, y: 0, z: 0, transformOrigin: "50% 50% -100px" },
				{ opacity: 1, rotationX: 90, y: 100, z: -100, ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.216,0.692 0.374,0.84 0.566,1.02 0.818,1.001 1,1") })
			.fromTo('#bio-container .bio-animation-wrapper',
				{ height: '160' },
				{ height: '0px', ease: CustomEase.create("custom", "M0,0 C0.172,0 0.288,0.154 0.34,0.222 0.756,0.768 0.604,0.988 1,1") },
				'-=.5')
			.addLabel('out')
	},
	methods: {
		updateCurrentContent() {
			console.log('The content has updated to: ', this.contentPlaceHolder);
			this.content = this.contentPlaceHolder;
		},
		setContent(val) {
			console.log('content is gone and placeholder is: ', val);
			this.content = '';
			this.contentPlaceHolder = val;
		}
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
		position: fixed;
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
		// border: 1px solid white;
	}
	.content-fade-enter-active, .content-fade-leave-active {
  		transition: all .3s ease;
	}
	.content-fade-leave-to, .content-fade-enter {
		opacity: 0;
	}
	.content-fade-enter-to, .content-fade-leave {
		opacity: 1;
	}
}
</style>
<style type='text/css'>
@import '~_icomoon_/style.css';
</style>
