<template>
	<div>
		<div id="scroll-reference">
			<template v-for="(card, index) in  codePenCards">
				<span class="dark visible location-tracer tracer-square" :key="`dark-square-${index}`"></span>
				<span class="light location-tracer tracer-square" :key="`light-square-${index}`"></span>
			</template>
			<div class="arrow-down-indicator"></div>
			<template v-for="(card, index) in Array.apply(null, { length: codePenCards.length - 1 })">
				<div class="arrow-up" :key="`down-${index}`"></div>
				<div class="arrow-down" :key="`up-${index}`" ></div>
			</template>
			<div class="portfolio-summary">
				A collection of work briefly demonstrating some of my capabilities in front end development.
			</div>
		</div>
		<template v-for="(card, index) in codePenCards">
			<section class="code-example" :key="index" ref="sections">
				<component :is="card.module" :title="card.title" :id="card.id" :url="card.url" :imgUrl="card.imgUrl" :trigger="scrollTriggers[index]" :description="card.description" :isLastModule="codePenCards.length - 1 == index"></component>
			</section>
			<div class="spacer" :key="`spacer-${index}`"></div>
		</template>
		<div style="height: 100vh"></div>
	</div>
</template>

<script>
import CodePenCard from './portfolio/CodePenCard.vue';
import AniamtionDemo from '_images_/AnimationDemo.PNG';
import Brightland from '_images_/brightland.jpg';
export default {
	name: 'portfolio-list',
	components: {
		'CodePenCard': CodePenCard
	},
	props: {
		summaryTrigger: {
			//The scroll trigger for the text at the beginning is the same as the bio trigger.
			//Both the bio and the portfolio summary text should animation from the same trigger.
			type: Object
		}
	},
	data() {
		return  {
			codePenCards: [
				{
					module: CodePenCard,
					url: 'https://brightlandlights.com/',
					imgUrl: Brightland,
					title: 'Brightland',
					id: 'brightland',
					description: 'A client project to promote their lighting decoration business.'
				},
				{
					module: CodePenCard,
					url: 'https://jordanklaers.github.io/animationDemonstration/',
					imgUrl: AniamtionDemo,
					title: 'Animation Demo',
					id: 'animation-demo',
					description: 'A Collection of animations; transitions, keyframe, and requestAnimationFrame. For use in a knowledge share presentation.'
				},
				{
					module: CodePenCard,
					url: 'https://codepen.io/jordanklaers/pen/xxKLReZ',
					imgUrl: 'https://assets.codepen.io/1379941/internal/screenshots/pens/xxKLReZ.default.png?fit=cover&format=auto&ha=false&height=540&quality=75&v=2&version=1587057955&width=960',
					title: 'Notification Widget',
					id: 'notification-widget',
					description: "A CSS challenge to create content from an image. Implemented a canvas animation to add some extra flair."
				},
				{
					module: CodePenCard,
					url: 'https://codepen.io/jordanklaers/pen/qBWRgjP',
					imgUrl: 'https://assets.codepen.io/1379941/internal/screenshots/pens/qBWRgjP.default.png?fit=cover&format=auto&ha=false&height=540&quality=75&v=2&version=1624748014&width=960',
					title: 'Thermostat',
					id: 'thermostat',
					description: "A CSS challenge to create a thermostat."
				},
				{
					module: CodePenCard,
					url: 'https://cdpn.io/jordanklaers/fullcpgrid/agVGjR',
					imgUrl: 'https://assets.codepen.io/1379941/internal/screenshots/pens/agVGjR.default.png?fit=cover&format=auto&ha=true&height=540&quality=75&v=2&version=1587058875&width=960',
					title: 'Hover Rotation Animations',
					id: 'hover-rotation-animation',
					description: "A CSS challenge to create content from an image. Added some 3D animation to add some flair."
				}
				// {
				// 	module: '',
				// 	url: ''
				// 	imgUrl: '',
				// 	title: '',
				// 	id: ''
				// }
			],
			scrollTriggers: []
		}
	},
	mounted() {
		//The scroll triggers associated to each section, wrapping the content, are generated here, and passed to the CodePenCard module, so each module generates its own animation
		//The animations of the arrows and dot that track the scroll progress are created here, and use the same scroll trigger passed to each card
		const lightTracerSquares = document.querySelectorAll('#scroll-reference .light.tracer-square');
		const darkTracerSquares = document.querySelectorAll('#scroll-reference .dark.tracer-square');
		const upArrows = document.querySelectorAll('#scroll-reference .arrow-up');
		const downArrows = document.querySelectorAll('#scroll-reference .arrow-down');
		this.$refs.sections.forEach((section, index) => {
			this.scrollTriggers.push({
				trigger: section,
				start: "top top",
				end: "bottom top",
				scrub: 0.7,
				snap: {
					snapTo: "labels",
					duration: {min: 0.6, max: 0.6},
					delay: 0.2
				}
			});
			this.createScrollTracerAnimation(lightTracerSquares[index], index);
			this.createScrollTracerAnimation(darkTracerSquares[index], index);
			//upArrow indexing would result in scroll trigger for the second card to use the first upArrow element.
			//Down arrows would result in no element to associate to the last scrolTrigger (because there is no more to scroll down)
			this.createArrowIndicatorAnimation(upArrows[index - 1] || null, downArrows[index] || null, index);
		});
		//--same note from the props--
		//The scroll trigger for the text at the beginning is the same as the bio trigger.
		//Both the bio and the portfolio summary text should animation from the same trigger.
		new this.$data._gsap.TimelineMax({
				scrollTrigger: this.summaryTrigger
			})
			.addLabel('in')
			.fromTo('#scroll-reference .portfolio-summary', 
				{
					opacity: 1
				},
				{
					opacity: 0
				}
			)
			.fromTo('#scroll-reference .arrow-down-indicator',
				{
					y: '0rem',
					opacity: 1
				},
				{
					y: '-7.125rem',
					opacity: 0
				},
				'<'
			)
			.addLabel('out')
	},
	methods: {
		createScrollTracerAnimation(el, index) {
			//This is the animation and trigger for the blue square
			const timeline = new this.$data._gsap.TimelineMax({
					scrollTrigger: this.scrollTriggers[index]
				})
				.addLabel('topOut')
				.fromTo(el,
					{ y: '14.25rem', opacity: 0 },
					{ y: '7.125rem', opacity: 1, duration: 2 }
				)
				.addLabel('topIn')
				.to(el, { y: '7.125rem', opacity: 1, duration: 1.5 })
				.addLabel('middleIn')
				.to(el, { y: '7.125rem', opacity: 1, duration: 1.5 })
				.addLabel('bottomIn')
			if (index == this.$refs.sections.length - 1) timeline.to(el, { y: '7.125rem', opacity: 1, duration: 2 });
			else timeline.to(el, { y: '0rem', opacity: 0, duration: 2 });
				// .addLabel('bottomOut')
		},
		createArrowIndicatorAnimation(topArrowEl, bottomArrowEl, index) {
			if (bottomArrowEl) {
				const bottomArrowTimeline = new this.$data._gsap.TimelineMax({
					scrollTrigger: this.scrollTriggers[index]
				});
				bottomArrowTimeline
					.fromTo(bottomArrowEl, 
						{ y: '16.25rem', opacity: 0 },
						{ y: '9.125rem', opacity: 1, duration: 2 }
					)
					.addLabel('topIn')
					.to(bottomArrowEl, { y: '9.125rem', opacity: 1, duration: 1.5 })
					.addLabel('middleIn')
					.to(bottomArrowEl, { y: '9.125rem', opacity: 1, duration: 1.5 })
					.addLabel('bottomIn')
					.to(bottomArrowEl, { y: '2rem', opacity: 0, duration: 2 });
			}
			// if any card other then the first, then an arrow to scroll up should exist
			if (index != 0) {
				const topArrowTimeline = new this.$data._gsap.TimelineMax({
					scrollTrigger: this.scrollTriggers[index]
				});
				topArrowTimeline
					.fromTo(topArrowEl, 
						{ y: '12.25rem', opacity: 0 },
						{ y: '5.125rem', opacity: 1, duration: 2 }
					)
					.addLabel('topIn')
					.to(topArrowEl, { y: '5.125rem', opacity: 1, duration: 1.5 })
					.addLabel('middleIn')
					.to(topArrowEl, { y: '5.125rem', opacity: 1, duration: 1.5 })
					.addLabel('bottomIn')
					.to(topArrowEl, { y: '-2rem', opacity: 0, duration: 2 });
			}
		}
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/variables';
@import '~_scss_/_mixins';
#scroll-reference {
	position: fixed;
	top: 27rem;
	transform: translateY(-25%);
	width: 0.25rem;
	background: linear-gradient(to bottom, transparent, var(--secondary-1-c) 20%, var(--secondary-1-c) 80%, transparent);
	height: 14.25rem;
	left: calc(var(--bio-placement) + 1rem);
	.location-tracer {
		display: none;
		position: absolute;
		@include square-diagonal-split-rem((
			className: "tracer-square",
			height: 1.5,
			width: 1.5,
			top: -1.5,
			right: -.625,
			rotate: -45deg,
			dark-before-one: var(--primary-1-a),    dark-before-two: var(--primary-1-b),
			dark-after-one: var(--primary-1-c),       dark-after-two: var(--primary-1-d),
			light-before-one: var(--primary-1-a),       light-before-two: var(--primary-1-b),
			light-after-one: var(--primary-1-c),        light-after-two: var(--primary-1-d)
		));
	}
	.arrow-down, .arrow-up, .arrow-down-indicator {
		position: absolute;
		height: 1.5rem;
		width: 1.5rem;
		right: -0.625rem;
		border: 0.2rem solid;
		top: -1.5rem;
		opacity: 0;
		border-color: transparent transparent var(--secondary-line-1) var(--secondary-line-1);
	}
	.arrow-up {
		transform: rotate(135deg);
	}
	.arrow-down {
		transform: rotate(-45deg);
	}
	.arrow-down-indicator {
		transform: rotate(-45deg);
		top: 5.625rem;
		opacity: 1;
	}
	.portfolio-summary {
		position: absolute;
		color: white;
		left: 2rem;
		top: 7.125rem;
		width: 35rem;
		transform: translateY(-50%);
		font-size: 1.2rem;
        line-height: 1.4rem;
	}
}
.code-example {
	height: 100vh;
	width: 100vw;
	// border: 1px solid yellow;
}
.spacer {
	width: 100vw;
	// height: 35vh;
}
</style>
