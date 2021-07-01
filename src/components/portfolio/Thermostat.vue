<template>
	<div class="work">
        content
    </div>
</template>

<script>
import Axios from 'axios';
import { debounce, throttle } from 'lodash-es';
export default {
	name: 'Thermostat',
	props: {
		placeData: {
			default: () => { return {}; }
		}
	},
    mounted() {
    },
	computed: {
	},
	methods: {
	},
	watch: {
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_scss_/variables';
@import '~_scss_/_mixins';
.work {
	border: 1px solid blue;
	height: 600px;
	margin: 30px;
	&.one {
		background-color: green;
	}
	&.two {
		background-color: turquoise;
	}
	&.three {
		background-color: blue;
	}
	&.four {
		background-color: purple;
	}
	&.five {
		background-color: pink;
	}
}
</style>


