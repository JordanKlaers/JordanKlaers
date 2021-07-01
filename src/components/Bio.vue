<template>
	<div id="bio-container">
        <h1>Jordan Klaers</h1>
        <div class="bio-animation-wrapper">
            <h1>Front-End Web Developer</h1>
            <div class="sub-text" ref="sub-text">Full stack web developer since 2017 with a passion for front end development and design</div>
        </div>
        <button class="m-rgt-20 m-top-20" v-on:click="openPortfolio()">Portfolio</button>
        <button class="m-top-20">Boop</button>
	</div>
</template>

<script>
import * as gsap from '_gsap_';
import ScrollTrigger from '_gsap_/ScrollTrigger';
import CustomEase from '_gsap_/CustomEase';
export default {
	name: 'bio',
    data() {
        return {
            topOfPageTimeline: null
        }
    },
	computed: {
	},
    mounted() {
        // gsap.gsap.registerPlugin(ScrollTrigger);
        // gsap.gsap.registerPlugin(CustomEase);
        // window.addEventListener('wheel', (event) => {
        //     // console.log(window.scrollTop(), document.height);
        //     if (event.deltaY < 0 && document.body.scrollTop === 0)
        //     {
        //         console.log('scrolling up');
        //         if (this.topOfPageTimeline) this.topOfPageTimeline.reverse();
        //     }
        //     else if (event.deltaY > 0) {
        //         // console.log('scrolling down', this.topOfPageTimeline && this.topOfPageTimeline.progress());
        //         if (!this.topOfPageTimeline || (!this.topOfPageTimeline.isActive() && this.topOfPageTimeline.progress() != 1)) {
        //             console.log('opening on scroll down');
        //             this.openPortfolio();
        //         }
        //     }
        // });
        // window.addEventListener("keydown", event => {
        //     if (event.key === 'ArrowDown') {
        //         this.openPortfolio()
        //     }
        // });
    },
	methods: {
        openPortfolio() {
            // this.topOfPageTimeline = new gsap.TimelineMax();
            // this.topOfPageTimeline
            //     .fromTo('#bio-container .bio-animation-wrapper', {
            //         opacity: 1,
            //         rotationX: 0,
            //         scale: 1,
            //         y: 0,
            //         z: 0,
            //         transformOrigin: "50% 50% -100px"
            //     }, {
            //         duration: .5,
            //         ease: gsap.Linear.easeNone(),
            //         opacity: 1,
            //         rotationX: 90,
            //         y: 100,
            //         z: -100
            //     })
            //     .fromTo('#bio-container .bio-animation-wrapper', {
            //         height: '160'
            //     },
            //     {
            //         height: '0px',
            //         duration: .5,
            //         ease: CustomEase.create("custom", "M0,0 C0.172,0 0.288,0.154 0.34,0.222 0.756,0.768 0.604,0.988 1,1")
            //     }, '-=.5')
            //     .fromTo('#portfolio-list', {
            //         marginTop: '48vh'
            //     },
            //     {
            //         duration: 0.5,
            //         marginTop: '32vh',
            //         ease: CustomEase.create("custom", "M0,0 C0.172,0 0.288,0.154 0.34,0.222 0.756,0.768 0.604,0.988 1,1")
            //     }, '-=.5')
            //     .fromTo('#portfolio-list .line', {
            //         top: '48vh',
            //         height: '52vh'
            //     }, {
            //         top: '32vh',
            //         height: '68vh',
            //         duration: 0.5,
            //         ease: CustomEase.create("custom", "M0,0 C0.172,0 0.288,0.154 0.34,0.222 0.756,0.768 0.604,0.988 1,1")
            //     }, '-=.5')
            //     .fromTo('body', {
            //         overflow: 'hidden'
            //     }, {
            //         overflow: 'scroll',
            //         duration: 0
            //     }, '-=.5')
            //     .eventCallback('onStart', this.openPortfolioOnComplete)
            //     .eventCallback('onRepeat', this.openPortfolioOnReverseComplete)
        },
        openPortfolioOnComplete() {
            // console.log('completed when scrolling down');
        },
        openPortfolioOnReverseComplete() {
            // console.log('completed when scrolling up');
        }
	}
};
</script>
<style lang='scss' type="text/scss">
#bio-container {
    transition: left 1s, color 1s;
    position: fixed;
    top: 60px;
    z-index: 2;
    color: var(--text-color);
    margin-left: var(--bio-placement);
    max-width: 400px;
    width: 60vw;
    h1:first-of-type {
        margin-bottom: 0;
    }
    .bio-animation-wrapper {
        transform: perspective(200px);
        // overflow: hidden;
        h1 {
            margin-top: 0;
        }
        div.sub-text {
            font-size: 1.2em;  
        }
    }
    
    button {
        transition: all 1s;
        position: relative;
        overflow: hidden;
        &::before {
            transition: all 0.6s;
            content: '';
            position: absolute;
            left: -60px;
            top: 0;
            height: 100%;
            width: 50px;
            transform: skewX(20deg);
            background-color: rgba(255,255,255,0.5);
            box-shadow: -1px 0px 12px 2px rgba(255, 255, 255, 0.5);
        }
        &:hover {
            &::before {
                transition: all 0.6s;
                left: calc(100% + 60px);
            }
        }
        &:first-of-type {
            background-color: var(--secondary-1-c);
            color: var(--text-color);
        }
    }
}
</style>


