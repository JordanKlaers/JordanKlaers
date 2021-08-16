<template>
	<div id="bio-container">
        <h1>Jordan Klaers</h1>
        <div class="bio-animation-wrapper">
            <h1>Front-End Web Developer</h1>
            <div class="sub-text" ref="sub-text">Full stack web developer since 2017 with a passion for front end development and design</div>
        </div>
        <button class="m-rgt-20 m-top-20" v-on:click="() => setContent('portfolio')">Portfolio</button>
        <button class="m-top-20"  v-on:click="() => setContent('contact')">Contact</button>
	</div>
</template>

<script>
export default {
	name: 'bio',
    data() {
        return {
            topOfPageTimeline: null
        }
    },
    props: {
        setContent:{
            type: Function
        }
    },
	computed: {
	},
    mounted() {
    },
	methods: {
	}
};
</script>
<style lang='scss' type="text/scss">
#bio-container {
    transition: left 1s, color 1s;
    position: fixed;
    top: 4rem;
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


