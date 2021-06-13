<template>
	<div id="bio-container">
        <h1>Jordan Klaers<br>Front-End Web Developer</h1>
        <summary class="m-btm-20">Full stack web developer since 2017 with a passion for front end development and design</summary>
        <button class="m-rgt-20">Beep</button>
        <button>Boop</button>
	</div>
</template>

<script>
export default {
	name: 'bio',
	computed: {
	},
	methods: {
	}
};
</script>
<style lang='scss' type="text/scss">
#bio-container {
    transition: left 1s, color 1s;
    position: absolute;
    z-index: 10;
    color: var(--active-text-color);
    left: var(--bio-placement);
    top: 100px;
    max-width: 400px;
    width: 60vw;
    summary {
        font-size: 1.2em;
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
            background-color: var(--active-secondary-1-c);
            color: var(--active-text-color);
        }
    }
}
</style>


