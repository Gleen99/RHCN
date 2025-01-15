<script setup lang="ts">
import AboutUsHeader from "@/components/AboutUs/AboutUsHeader.vue";
import AboutUsInfos from "@/components/AboutUs/aboutUsInfos.vue";
import AboutUsMembers from "@/components/AboutUs/aboutUsMembers.vue";
import EmailingFront from "@/components/EmailingFront/EmailingFront.vue";
import PublicTemplate from "@/components/layout/PublicTemplate.vue";

</script>

<template>
	<public-template class="aboutUs">
    <AboutUsHeader/>
	<AboutUsMembers/>
	<AboutUsInfos/>
	<EmailingFront/>
	</public-template>
</template>

<style lang="scss">
.aboutUs {
	height: 100%;
	overflow: auto;

}
</style>