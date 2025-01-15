<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useApi} from "@/composition/api";
import {useAnalytics} from "@/composition/analytics";
import {useRoute, useRouter} from "vue-router";
import {useAuth} from "@/composition/snark-auth";
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import vResize from "@/directives/resize-directive";
import Ileft from "@/components/images/pagination/Ileft.vue";
import Iright from "@/components/images/pagination/Iright.vue";

const DEFAULT_AUTOPLAY_SPEED = 4000;
const DEFAULT_TRANSITION_SPEED = 400;

export enum SliderMode {
	horizontal = "horizontal",
	vertical = "vertical"
}

export enum SliderAutoPlay {
	forward = "forward",
	backward = "backward"
}

const props = defineProps<{
	controllers?: boolean
	infinite?: boolean
	autoplay?: boolean|SliderAutoPlay	// si true => forward
	autoplaySpeed?: number
	transitionSpeed?: number
	continuousSpeed?: number	// si continuousSpeed a une valeur, il remplace autoplaySpeed et transitionSpeed
	mode?: SliderMode
}>();
// const emit = defineEmits<{
//     (e: 'click', value: any): void
// }>();

const router = useRouter();
const currentRoute = useRoute();
const {t} = useI18n();
const {sendEventAnalytics} = useAnalytics();
const {currentUser, isAuth} = useAuth();
const {} = useApi();

const sliderWindow = ref<HTMLElement>();
const sliderContent = ref<HTMLElement>();

const windowWidth = ref<number>(0);
const contentWidth = ref<number>(0);
const contentPosition = ref<number>(1);
const noTransition = ref<boolean>(false);
const moving = ref<boolean>(false);
const autoplayInterval = ref<any>(null);

const windowHeight = ref<number>(0);
const contentHeight = ref<number>(0);


const sliderMode = computed<SliderMode>(() => {
	return props.mode ? props.mode : SliderMode.horizontal;
});

const autoplaySpeed = computed<number>(() => {
	return (props.continuousSpeed && props.continuousSpeed > 0) ? props.continuousSpeed : ((props.autoplaySpeed && props.autoplaySpeed > 0) ? props.autoplaySpeed : DEFAULT_AUTOPLAY_SPEED);
});

const transitionSpeed = computed<number>(() => {
	return (props.continuousSpeed && props.continuousSpeed > 0) ? props.continuousSpeed : ((props.transitionSpeed && props.transitionSpeed > 0) ? props.transitionSpeed : DEFAULT_TRANSITION_SPEED);
});

const autoplayMode = computed<SliderAutoPlay|null>(() => {
	return props.autoplay ? (props.autoplay === SliderAutoPlay.backward ? SliderAutoPlay.backward : SliderAutoPlay.forward) : null;
})

function contentResized() {
	if(sliderContent.value) {
		contentWidth.value = sliderContent.value!.scrollWidth;
		contentHeight.value = sliderContent.value!.scrollHeight;
	}
}

function windowResized() {
	if(sliderWindow.value) {
		windowWidth.value = sliderWindow.value!.clientWidth;
		windowHeight.value = sliderWindow.value!.clientHeight;
	}
}

const isInfinite = computed<boolean>(() => {
	return props.infinite &&
		(
			(sliderMode.value === SliderMode.horizontal && windowWidth.value < contentWidth.value)
			||
			(sliderMode.value === SliderMode.vertical && windowHeight.value < contentHeight.value)
		)
});

const leftMargin = computed<number>(() => {
	if(contentWidth.value < windowWidth.value) {
		contentPosition.value = 0;
		return Math.floor((windowWidth.value - contentWidth.value) / 2);
	}
	else {
		return 0;
	}
});

const topMargin = computed<number>(() => {
	if(contentHeight.value < windowHeight.value) {
		contentPosition.value = 0;
		return Math.floor((windowHeight.value - contentHeight.value) / 2);
	}
	else {
		return 0;
	}
});

const contentStyle = computed<any>(() => {
	let pos = 0;
	if(sliderContent.value && contentPosition.value > 0) {
		const items = sliderContent.value!.children;
		let i = 0;
		let count = 0;
		while(count < contentPosition.value && i < items.length) {
			const item = (items.item(i) as HTMLElement);
			if(item.className !== "resize-sensor") {
				if(sliderMode.value === SliderMode.horizontal) {
					pos += item.clientWidth + 30;
				}
				else {
					pos += item.clientHeight + 30;
				}
				++count;
			}
			++i;
		}
	}

	if(sliderMode.value === SliderMode.horizontal) {
		const maxLeft = Math.max(0, contentWidth.value - windowWidth.value);
		const nextLeft = leftMargin.value - pos;
		let left = isInfinite.value ? nextLeft : Math.max(nextLeft, -maxLeft);
		return {
			transitionProperty: noTransition.value ? "none" : "left",
			transitionSpeed: transitionSpeed.value,
			left: left + "px"
		};
	}
	else {
		const maxTop = Math.max(0, contentHeight.value - windowHeight.value);
		const nextTop = topMargin.value - pos;
		let top = isInfinite.value ? nextTop : Math.max(nextTop, -maxTop);
		return {
			transitionProperty: noTransition.value ? "none" : "top",
			transitionSpeed: transitionSpeed.value,
			top: top + "px"
		};
	}
});

const maxPosition = computed<number>(() => {
	const condition = sliderContent.value &&
		(
			(sliderMode.value === SliderMode.horizontal && contentWidth.value > windowWidth.value)
			||
			(sliderMode.value === SliderMode.vertical && contentHeight.value > windowHeight.value)
		);
	if(condition) {
		const items = sliderContent.value!.children;
		let diff = sliderMode.value === SliderMode.horizontal ? contentWidth.value - windowWidth.value : contentHeight.value - windowHeight.value;
		let max = 0;
		while (diff > 0 && max < items.length) {
			const item = (items.item(max) as HTMLElement);
			if(item.className !== "resize-sensor") {
				if(sliderMode.value === SliderMode.horizontal) {
					diff -= item.clientWidth + 30;
				}
				else {
					diff -= item.clientHeight + 30;
				}
			}
			++max;
		}
		if(contentPosition.value > max) {
			contentPosition.value = max;
		}
		return max;
	}
	else {
		return 0;
	}
})

const toForward = ref<boolean>(false);

function goForward() {
	if(!moving.value) {
		moving.value = true;
		if (isInfinite.value) {
			toForward.value = true;
			contentPosition.value++;
		}
		else {
			contentPosition.value = Math.min(contentPosition.value + 1, maxPosition.value);
		}
	}
}

function goBackward() {
	if(!moving.value) {
		moving.value = true;
		if (isInfinite.value) {
			const items = sliderContent.value!.children;
			noTransition.value = true;
			nextTick(() => {
				let item = items.item(items.length - 1)!;
				if (item.className === "resize-sensor") {
					item = items.item(items.length - 2)!;
				}
				sliderContent.value!.insertBefore(item, items.item(0)!);
				contentPosition.value++;
				nextTick(() => {
					noTransition.value = false;
					contentPosition.value--;
				});
			});
		}
		else {
			contentPosition.value = Math.max(contentPosition.value - 1, 0);
		}
	}
}

function transitionEnd(evt: Event) {
	if(!isInfinite.value || !toForward.value) {
		moving.value = false;
	}
	else if(toForward.value && sliderContent.value) {
		toForward.value = false;
		noTransition.value = true;
		const items = sliderContent.value!.children;
		let item = items.item(0)!;
		if(item.className === "resize-sensor") {
			item = items.item(1)!;
		}
		sliderContent.value!.appendChild(item);
		nextTick(() => {
			contentPosition.value--;
			setTimeout(() => {
				noTransition.value = false;
				moving.value = false;
			}, 0);
		});
	}
}

const backwardClass = computed<string>(() => {
	let theClass = 'arrow backward';
	if(!isInfinite.value) {
		theClass += contentPosition.value === 0 ? ' disabled':'';
	}
	return theClass;
});

const forwardClass = computed<string>(() => {
	let theClass = 'arrow forward';
	if(!isInfinite.value) {
		theClass += contentPosition.value === maxPosition.value ? ' disabled':'';
	}
	return theClass;
});

onMounted(() => {
	if(autoplayMode.value) {
		autoplayInterval.value = setInterval(autoplayMode.value === SliderAutoPlay.backward ? goBackward : goForward, autoplaySpeed.value);
	}
});
onUnmounted(() => {
	if(autoplayInterval.value) {
		clearInterval(autoplayInterval.value);
		autoplayInterval.value = null;
	}
});

</script>

<template>
	<div :class="'Slider ' + sliderMode">
		<div v-if="controllers" :class="backwardClass" @click="goBackward"><ileft/></div>
		<div class="slider-container">
			<div class="slider-window" ref="sliderWindow" v-resize="windowResized">
				<div class="slider-content" ref="sliderContent" :style="contentStyle" v-resize="contentResized" @transitionend="transitionEnd">
					<slot/>
				</div>
			</div>
		</div>
		<div v-if="controllers" :class="forwardClass" @click="goForward"><iright/></div>
	</div>
</template>

<style lang="scss">
.Slider {
	display: flex;
	gap: $gap;
	align-items: center;

	.arrow {
		width: 40px;
		height: 40px;
		background-color: transparent;
		border-radius: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		.icon {
			width: 75%;
			height: 75%;
			color: white;
		}

		&:hover {
			background-color: rgba(0, 0, 0, 0.1);
		}

		&.disabled {
			cursor: not-allowed;
			opacity: 0.4;
			&:hover {
				background-color: transparent;
			}
		}
	}

	.slider-container {
		flex: 1 1 0;
		position: relative;

		.slider-window {
			position: relative;
			width: 100%;
			height: 100%;
			overflow: hidden;

			.slider-content {
				position: absolute;
				display: flex;
				align-items: center;
				gap: $gap;
				flex-wrap: nowrap;
				transition-timing-function: ease-in-out;

				> * {
					flex-shrink: 0;
				}
			}
		}
	}

	&.horizontal {
		.slider-container .slider-window .slider-content {
			height: 100%;
		}
	}

	&.vertical {
		flex-direction: column;

		.arrow {
			transform: rotate(90deg);
		}

		.slider-container .slider-window .slider-content {
			flex-direction: column;
			width: 100%;
		}
	}
}
</style>