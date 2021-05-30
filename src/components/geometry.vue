<template>
	<div id="geometry-container">
        <span class="dark visible shape square-1-a"></span>
        <span class="light shape square-1-a"></span>
        <span class="dark visible shape square-1-b"></span>
        <span class="light shape square-1-b"></span>

        <span class="dark visible shape square-2-a"></span>
        <span class="light shape square-2-a"></span>
        <span class="dark visible shape square-2-b"></span>
        <span class="light shape square-2-b"></span>
        <span class="dark visible shape square-2-c"></span>
        <span class="light shape square-2-c"></span>
        <span class="dark visible shape square-2-d"></span>
        <span class="light shape square-2-d"></span>
        <span class="shape square-3-a"></span>
        <span class="shape square-3-b"></span>
        <span class="shape square-3-c"></span>

        <span
            v-for="curve in curveElements"
            :key="curve.class"
            class="shape"
            :id="curve.id"
            :style="`clip-path: polygon(${setClipPath(curve.degree, curve.startDegree)})`"
            >
        </span>
	</div>
</template>

<script>
export default {
	name: 'geometry-container',
    data() {
        return {
            path: '',
            curveElements: [
                { id: 'curve-1-a', degree: 80, startDegree: 0 },
                { id: 'curve-1-b', degree: 80, startDegree: 45 },
                { id: 'curve-1-c', degree: 150, startDegree: 15 },
                { id: 'curve-2-a', degree: 130, startDegree: 20 },
                { id: 'curve-2-b', degree: 130, startDegree: 20 }
            ]
        }
    },
    mounted() {
    },
    methods: {
        setClipPath(degree, startDegree) {
            //start at center
            let path = '50% 50%';
            //add first point that matches the starting degree (0 = bottom, 90 = right, 180 = top, 270 = left, 360 = bottom)
            path += `,${Math.floor(this.x(startDegree, 50))+50}% ${Math.floor(this.y(startDegree, 50))+50}%`;
            //add the corner points between the start and end degree, this prevents the arc from being cut off if it exceeds 180 degrees
            let  closurePoints = [', 100% 100%', ', 100% 0%',  ', 0% 0%', ', 0% 100%'];
            path += closurePoints.slice(Math.floor(startDegree / 90), Math.floor((degree + startDegree) / 90) + 1).join('');
            //add the final point
            path += `,${Math.floor(this.x(degree + startDegree, 50))+50}% ${Math.floor(this.y(degree + startDegree, 50))+50}%`;
            return path;
        },
        x: (degree, radius) => {
           return (Math.sin(degree*(Math.PI/180))*radius);
        },
        y: (degree, radius) => {
            return (Math.cos(degree*(Math.PI/180))*radius);
        }
    }
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/_mixins';
@mixin square-diagonal-split($args) {
    $rotate: if(map-get($args, rotate), map-get($args, rotate), 0deg);
    $z-index: if(map-get($args, z-index), map-get($args, z-index), 1);
    $visible-opacity: if(map-get($args, visible-opacity), map-get($args, visible-opacity), 1);
    $dark-before-gradient-dir: if(map-get($args, dark-before-gradient-dir), map-get($args, dark-before-gradient-dir), to right);
    $dark-after-gradient-dir: if(map-get($args, dark-after-gradient-dir), map-get($args, dark-after-gradient-dir), to bottom);
    $light-before-gradient-dir: if(map-get($args, light-before-gradient-dir), map-get($args, light-before-gradient-dir), to right);
    $light-after-gradient-dir: if(map-get($args, light-after-gradient-dir), map-get($args, light-after-gradient-dir), to right);
    &.#{map-get($args, className)} {
        height: map-get($args, height) * 1px;
        width: map-get($args, width) * 1px;
        right: map-get($args, right) * 1px;
        top: map-get($args, top) * 1px;
        z-index: $z-index;
        transform: rotate($rotate);
        &.dark.visible::before,
        &.dark.visible::after,
        &.light.visible::before,
        &.light.visible::after {
            opacity: $visible-opacity;
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
            height: map-get($args, height) * 1.414px;
            width: map-get($args, width) * 0.75px;
            left: map-get($args, width) * -.25px;
            top: map-get($args, height) * -.207px;
            transform-origin: center right;
            transform: rotate(-45deg);
        }
        &.dark {
            &::before { background: linear-gradient($dark-before-gradient-dir, map-get($args, dark-before-one), map-get($args, dark-before-two)); }
            &::after { background: linear-gradient($dark-after-gradient-dir, map-get($args, dark-after-one), map-get($args, dark-after-two)); }
        }
        &.light {
            &::before { background: linear-gradient($light-before-gradient-dir, map-get($args, light-before-one), map-get($args, light-before-two)); }
            &::after { background: linear-gradient($light-after-gradient-dir, map-get($args, light-after-one), map-get($args, light-after-two)); }
        }
    }
}
@mixin curve($args) {
    &##{map-get($args, id)} {
        top: map-get($args, top);
        right: map-get($args, right);
        width: map-get($args, width);
        height: map-get($args, height);
        border-radius: 50%;
        border: map-get($args, border);
        transform: map-get($args, transform);
        z-index: map-get($args, z-index);
    }
}
#geometry-container {
    position: absolute;
    z-index: 2;
    height: 75vh;
    width: 100vw;
    .shape {
        position: absolute;
        overflow: hidden;
        @include square-diagonal-split((
            className: "square-1-a",
            height: 160,
            width: 160,
            top: -35,
            right: -20,
            dark-before-one: rgba(45, 248, 18, 0.3),    dark-before-two: rgb(0, 92, 8),
            dark-after-one: rgba(54, 221, 76, 1),       dark-after-two: rgba(7, 129, 3, 0),
            light-before-one: rgb(198, 204, 255),       light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255),        light-after-two: rgb(65, 85, 255)
        ));
        @include square-diagonal-split((
            className: "square-1-b",
            height: 80,
            width: 80,
            top: 180,
            right: 15,
            rotate: 45deg,
            dark-before-one: rgba(45, 248, 18, 0.3),    dark-before-two: rgb(0, 92, 8),
            dark-after-one: rgba(35, 179, 54, 0),       dark-after-two: rgb(61, 216, 56),
            light-before-one: rgb(198, 204, 255),       light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255),        light-after-two: rgb(65, 85, 255),
            z-index: 2
        ));
        @include square-diagonal-split((
            className: "square-2-a",
            height: 130,
            width: 130,
            top: 68,
            right: 107,
            rotate: -135deg,
            dark-before-one: rgba(0, 118, 253, 0.3),    dark-before-two: rgb(0, 66, 92),
            dark-after-one: rgba(35, 179, 54, 0),       dark-after-two: rgb(56, 117, 216),
            light-before-one: rgb(198, 204, 255),       light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255),        light-after-two: rgb(65, 85, 255)
        ));
        @include square-diagonal-split((
            className: "square-2-b",
            height: 110,
            width: 110,
            top: 230,
            right: 117,
            rotate: 135deg,
            dark-before-one: rgba(0, 118, 253, 0.6),    dark-before-two: rgb(0, 66, 92),
            dark-after-one: rgba(35, 138, 179, 0.4),       dark-after-two: rgb(56, 117, 216),
            light-before-one: rgb(198, 204, 255),       light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255),        light-after-two: rgb(65, 85, 255),
            z-index: 2
        ));
        @include square-diagonal-split((
            className: "square-2-c",
            height: 60,
            width: 60,
            top: 270,
            right: 260,
            rotate: -25deg,
            dark-before-one: rgb(127, 184, 250),    dark-before-two: rgb(12, 114, 197),
            dark-after-one: rgb(7, 113, 200),       dark-after-two: rgb(56, 117, 216),
            light-before-one: rgb(198, 204, 255),       light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255),        light-after-two: rgb(65, 85, 255)
        ));
        @include square-diagonal-split((
            className: "square-2-d",
            height: 20,
            width: 20,
            top: 25,
            right: 255,
            rotate: -50deg,
            dark-before-one: rgb(166, 219, 255),    dark-before-two: rgb(69, 164, 243),
            dark-after-one: rgb(35, 139, 224),       dark-after-two: rgb(56, 117, 216),
            light-before-one: rgb(198, 204, 255),       light-before-two: rgb(18, 72, 248),
            light-after-one: rgb(208, 213, 255),        light-after-two: rgb(65, 85, 255)
        ));
        &.square-3-a {
            position: absolute;
            z-index: 2;
            height: 160px;
            width: 190px;
            top: 120px;
            right: 180px;
            background-color: rgb(46, 46, 46);
            box-shadow: -1px 1px 12px rgb(27, 27, 27);
            opacity: 1;
            transform: perspective(400px) rotateY(-20deg) skewX(-7deg);
        }
        &.square-3-b {
            z-index: 3;
            height: 90px;
            width: 90px;
            top: 90px;
            right: 115px;
            background-color: rgb(46, 46, 46);
            box-shadow: -1px 1px 12px rgb(27, 27, 27);
            opacity: 1;
            transform: rotateZ(25deg);
        }
        &.square-3-c {
            z-index: 6;
            height: 35px;
            width: 35px;
            top: 180px;
            right: 370px;
            background-color: rgb(46, 46, 46);
            box-shadow: -1px 1px 12px rgb(27, 27, 27);
            opacity: 1;
            transform: rotateZ(25deg);
        }
        @include curve((
            id: "curve-1-a",
            top: 80px,
            right: 330px,
            width: 150px,
            height: 100px,
            border-radius: 50%,
            border: 2px solid rgb(56, 117, 216),
            transform: rotate(28deg),
            z-index: 1
        ));
        @include curve((
            id: "curve-1-b",
            top: -80px,
            right: 225px,
            width: 80px,
            height: 300px,
            border-radius: 50%,
            border: 2px solid rgb(56, 117, 216),
            transform: rotate(-215deg),
            z-index: 1
        ));
        @include curve((
            id: "curve-1-c",
            top: 215px,
            right: 240px,
            width: 140px,
            height: 140px,
            border-radius: 50%,
            border: 2px solid rgb(56, 117, 216),
            transform: rotate(180deg),
            z-index: 1
        ));
        @include curve((
            id: "curve-2-a",
            top: 130px,
            right: 20px,
            width: 60px,
            height: 90px,
            border-radius: 50%,
            border: 2px solid rgba(185, 185, 185, 0.719),
            transform: rotate(110deg),
            z-index: 1
        ));
        @include curve((
            id: "curve-2-b",
            top: 270px,
            right: 160px,
            width: 30px,
            height: 130px,
            border-radius: 50%,
            border: 2px solid rgba(185, 185, 185, 0.719),
            transform: rotate(-30deg),
            z-index: 1
        ));
    }
}
</style>


