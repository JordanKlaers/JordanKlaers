<template>
	<a :id="id" class="code-pen-card" :href="url" target="_blank" rel="noopener noreferrer">
        <img :src="imgUrl"/>
		<div class="background"></div>
		<span class="title">{{title}}</span>
		<span class="description">{{description}}</span>
    </a>
</template>

<script>
import { throttle } from 'lodash-es';
export default {
	name: 'CodePenCard',
	props: {
		url: {
			type: String
		},
		imgUrl: {
			type: String
		},
		title: {
			type: String
		},
		id: {
			type: String
		},
		trigger: {
			type: Object
		},
		description: {
			type: String
		},
		isLastModule: {
			type: Boolean
		}
	},
    data() {
		return {
			scrollDirection: null,
			toggleActivClassHandler: throttle(this.toggleActiveClass, 100)
		}
    },
	mounted() {
		const tl = new this.$data._gsap.TimelineMax({
			paused: true,
		});
		const descriptionHeight = this.convertPixelsToRem(window.getComputedStyle(document.querySelector(`#${this.id} .description`)).height);
		const backgroundHeight = this.convertPixelsToRem(window.getComputedStyle(document.querySelector(`#${this.id} .background`)).height);
		const hoverScale = tl.to(`#${this.id} .background`, {
			//add 2 rem to the top and 1 to the bottom for the description text space, plus the height of the description text
			height: `${backgroundHeight + 4 + descriptionHeight}rem`,
			width: '24rem',
			top: '-2rem',
			duration: 0.3,
			ease: "power2.out"
		})
		.to(`#${this.id} .description`, {
			opacity: 1,
			duration: 0.3,
			ease: "power2.out"
		});

		this.$el.addEventListener('mouseenter', () => hoverScale.play());
  		this.$el.addEventListener('mouseleave', () => hoverScale.reverse());
	},
	methods: {
		toggleActiveClass(self) {
			//There are 7 units divided amongst the 4 stages of the animation. 2 units are given to the intro and outro.
			//If the progress is within the middle 3 units, the card is technically in view, therfore active
			if ((self.progress >= ((2/7) -  0.01)) && (self.progress <= ((5/7) + 0.01))) {
				this.$el.classList.add('active');
			} else {
				this.$el.classList.remove('active');
			}
		}
	},
	watch: {
		trigger(val) {
			val['onUpdate'] = throttle(this.toggleActiveClass, 100);
			const timeline = new this.$data._gsap.TimelineMax({
					scrollTrigger: val
				})
				// .addLabel('topOut')
				.fromTo(this.$el,
					{ opacity: 0, rotationX: -45, y: 200, z: -100, transformOrigin: "50% 50% -100px" },
					{ opacity: 1, rotationX: 0, y: 0, z: 0, duration: 2 }
				)
				.addLabel('topIn')
				.to(this.$el, { opacity: 1, duration: 1.5 })
				.addLabel('middleIn')
				.to(this.$el, { opacity: 1, duration: 1.5 })
				.addLabel('bottomIn')
			if (this.isLastModule) timeline.to(this.$el, { opacity: 1, duration: 2 });
			else timeline.to(this.$el, { y: -100, opacity: 0, duration: 2 });
				// .addLabel('bottomOut')
		}
	}
};
</script>
<style lang='scss' type="text/scss">
@use '~_scss_/variables';
@use '~_scss_/_mixins';
.code-pen-card {
	$card-height: 14.25rem;
	$card-width: 22rem;
	position: fixed;
	top: 25rem;
	left: calc((var(--bio-placement) * 2) + 1rem);
	height: $card-height;
    width: $card-width;
	transform: perspective(200px);
	opacity: 0;
	text-decoration: none;
	&.active {
		cursor: pointer;
	}
	.background {
		content: '';
		position: absolute;
		transform-origin: bottom right;
		bottom: 0;
		right: 0;
		width: $card-width;
		height: $card-height;
		background-color: var(--secondary-1-c);
		z-index: -1;
		border-radius: 0.7rem;
		display: flex;
		flex-direction: column;
	}
	&:hover .title {
		text-decoration: underline;
	}
	.title {
		display: inline-block;
		position: absolute;
		bottom: 1rem;
		right: 0;
		width: calc(100% - 1.5rem);
		color: white;
		font-size: 1.5rem;
	}
	img {
		position: absolute;
		bottom: 4rem;
		left: -1rem;
		width: 20rem;
		height: 11.25rem;
		border-radius: 0.7rem;
	}
	.description {
		position: absolute;
		bottom: 0;
		transform: translateY(100%);
		color: white;
		opacity: 0;
		right: 1.5rem;
		width: calc(100% - 3rem);
		// border: 1px solid white;
	}
}
</style>
