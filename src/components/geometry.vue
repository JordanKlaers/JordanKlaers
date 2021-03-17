<template>
	<div id="geometry-container">
        <span class="dark visible square-diagonal color-group-1-a"></span>
        <span class="light square-diagonal color-group-1-a"></span>
	</div>
</template>

<script>
export default {
	name: 'geometry-container'
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/_mixins';
@mixin square-diagonal-split($args) {
    &.#{map-get($args, className)} {
        height: map-get($args, height) * 1px;
        width: map-get($args, width) * 1px;
        right: map-get($args, right) * 1px;
        top: map-get($args, top) * 1px;
        &.dark.visible::before,
        &.dark.visible::after,
        &.light.visible::before,
        &.light.visible::after {
            opacity: 1;
        }
        &::before {
            transition: 1s;
            opacity: 0;
            content: '';
            position: absolute;
            height: map-get($args, height) * 1px;
            width: map-get($args, width) * 1px;
        }
        &::after {
            transition: 1s;
            opacity: 0;
            content: '';
            position: absolute;
            height: map-get($args, height) * 1.5px;
            width: map-get($args, width) * 0.75px;
            left: map-get($args, width) * -.25px;
            top: map-get($args, height) * -.25px;
            transform-origin: center right;
            transform: rotate(-45deg);
        }
        &.dark {
            &::before { background: linear-gradient(to right, map-get($args, dark-before-one), map-get($args, dark-before-two)); }
            &::after { background: linear-gradient(to bottom, map-get($args, dark-after-one), map-get($args, dark-after-two)); }
        }
        &.light {
            &::before { background: linear-gradient(to right, map-get($args, light-before-one), map-get($args, light-before-two)); }
            &::after { background: linear-gradient(to right, map-get($args, light-after-one), map-get($args, light-after-two)); }
        }
    }
}
#geometry-container {
    position: absolute;
    z-index: 2;
	border: 1px solid orange;
    height: 75vh;
    width: 100vw;
    .square-diagonal {
        position: absolute;
        overflow: hidden;
        @include square-diagonal-split((
            className: "color-group-1-a",
            height: 80,
            width: 80,
            top: 200,
            right: 400,
            dark-before-one: rgb(45, 248, 18),
            dark-before-two: rgb(0, 92, 8),
            dark-after-one: rgb(54, 221, 76),
            dark-after-two: rgb(7, 129, 3),
            light-before-one: rgb(198, 204, 255),
            light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255), 
            light-after-two: rgb(65, 85, 255)
        ));
        @include square-diagonal-split((
            className: "color-group-1-a",
            height: 80,
            width: 80,
            top: 200,
            right: 400,
            dark-before-one: rgb(45, 248, 18),
            dark-before-two: rgb(0, 92, 8),
            dark-after-one: rgb(54, 221, 76),
            dark-after-two: rgb(7, 129, 3),
            light-before-one: rgb(198, 204, 255),
            light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255), 
            light-after-two: rgb(65, 85, 255)
        ));
    }
}
</style>


