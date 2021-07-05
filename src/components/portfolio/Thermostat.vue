<template>
	<a id="work" href="https://codepen.io/jordanklaers/pen/xxKLReZ" target="_blank" rel="noopener noreferrer">
        <img src="https://assets.codepen.io/1379941/internal/screenshots/pens/xxKLReZ.default.png?fit=cover&format=auto&ha=false&height=540&quality=75&v=2&version=1587057955&width=960"/>
		<span class="title">Notification Widget</span>
    </a>
</template>

<script>
import { throttle } from 'lodash-es';
export default {
	name: 'Thermostat',
	props: {
		trigger: {
			default: () => { return null }
		}
	},
    data() {
		return {
			scrollDirection: null,
			toggleActivClassHandler: throttle(this.toggleActiveClass, 100)
		}
    },
	mounted() {
		const rule = this.$data._cssRulePlugin.getRule('#work:after');
		// const tl = new this.$data._gsap.TimelineMax({
		// 	paused: true,
		// 	duration: 0.3
		// });
		// const hoverScale = tl.to(rule, {
		// 	cssRule: {
		// 		height: '16.25rem',
		// 		width: '24rem'
		// 	}
		// });

		const hoverScale = this.$data._gsap.to([rule], {
			cssRule: {
				height: '16.25rem',
				width: '24rem'
			},
			duration: 1,
			// ease: "power2.inOut",
			// paused: true
			stagger: 0.5,
			repeat: -1,
			yoyo: true
		});


		this.$el.addEventListener('mouseenter', hoverScale.play);
  		this.$el.addEventListener('mouseleave', hoverScale.reverse);

		// const testTL = new this.$data._gsap.TimelineMax({ repeat: -1, yoyo: true });
		// testTL.add(new this.$data._gsap.TweenMax(rule, 1, {
		// 	cssRule: {
		// 		left: 100
		// 	}
		// }, 0));
	},
	methods: {
		toggleActiveClass(self) {
			if ((self.progress >= ((2/7) -  0.01)) && (self.progress <= ((5/7) + 0.01))) {
				this.$el.classList.add('active');
			} else {
				this.$el.classList.remove('active');
			}
		}
	},
	watch: {
		trigger(val) {
			console.log('thermostat scrollTrigger: ', val);
			val['onUpdate'] = throttle(this.toggleActiveClass, 100);
			new this.$data._gsap.TimelineMax({
					scrollTrigger: val
				})
				.addLabel('topOut')
				.fromTo(this.$el,
					{ opacity: 0, rotationX:45, y: -200, z: -100, transformOrigin: "50% 50% -100px" },
					{ opacity: 1, rotationX: 0, y: 0, z: 0, duration: 2 }
				)
				.addLabel('topIn')
				.to(this.$el, { opacity: 1, duration: 1.5 })
				.addLabel('middleIn')
				.to(this.$el, { opacity: 1, duration: 1.5 })
				.addLabel('bottomIn')
				.to(this.$el, { y: -200, opacity: 0, duration: 2 })
				.addLabel('bottomOut')
		}
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/variables';
@import '~_scss_/_mixins';
#work {
	position: fixed;
	top: 25rem;
	left: calc((var(--bio-placement) * 2) + 1rem);
	height: 14.25rem;
    width: 23rem;
	transform: perspective(200px);
	opacity: 0;
	display: flex;
	flex-direction: column;
	text-decoration: none;
	&.active {
		cursor: pointer;
	}
	&::after {
		content: '';
		position: absolute;
		transform-origin: bottom right;
		bottom: 0;
		right: 0rem;
		width: 22rem;
		height: 14.25rem;
		background-color: green;
		z-index: -1;
		border-radius: 0.7rem;
	}
	&:hover .title {
		text-decoration: underline;
	}
	.title {
		// position: absolute;
		display: inline-block;
		// width: max-content;
		// bottom: 1rem;
		// left: 2.5rem;
		margin: auto auto 1rem 2.5rem;
		width: 100%;
		color: white;
		font-size: 1.5rem;
	}
	img {
		position: absolute;
		bottom: 4rem;
		width: 20rem;
		height: 11.25rem;
		border-radius: 0.7rem;
	}
}
</style>
