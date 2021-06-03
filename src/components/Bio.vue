<template>
	<div id="bio-container">
        <h1>Jordan Klaers<br>Front-End Web Developer</h1>
        <summary>Full stack web developer since 2017 with a passion for front end development and design</summary>
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
}
</style>


