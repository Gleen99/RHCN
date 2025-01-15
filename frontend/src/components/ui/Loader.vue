<script setup lang="ts">
// props

// events

// data
const size = "9px";
const margin = "2px";
const radius = "100%";

const spinnerStyle = {
    width: size,
    height: size,
    margin: margin,
    borderRadius: radius,
    display: "inline-block",
    animationName: "v-pulseStretchDelay",
    animationDuration: "0.75s",
    animationIterationCount: "infinite",
    animationTimingFunction: "cubic-bezier(.2,.68,.18,1.08)",
    animationFillMode: "both",
    backgroundColor: "white"
};
const spinnerDelay1 = {
    animationDelay: "0.12s"
};
const spinnerDelay2 = {
    animationDelay: "0.24s"
};
const spinnerDelay3 = {
    animationDelay: "0.36s"
};

// computed

// methods

// watch

// hooks
</script>

<template>
    <div class="Loader">
        <div class="v-pulse v-pulse1" v-bind:style="[spinnerStyle,spinnerDelay1]"></div>
        <div class="v-pulse v-pulse2" v-bind:style="[spinnerStyle,spinnerDelay2]"></div>
        <div class="v-pulse v-pulse3" v-bind:style="[spinnerStyle,spinnerDelay3]"></div>
    </div>
</template>

<style lang="scss">
.Loader {
    display: flex;
    align-items: center;
    justify-content: center;
}
@-webkit-keyframes v-pulseStretchDelay {
    0%,
    80% {
        transform: scale(1);
        opacity: 1;
    }
    45% {
        transform: scale(0.1);
        opacity: 0.7;
    }
}

@keyframes v-pulseStretchDelay {
    0%,
    80% {
        transform: scale(1);
        opacity: 1;
    }
    45% {
        transform: scale(0.1);
        opacity: 0.7;
    }
}

</style>