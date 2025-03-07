<script setup lang="ts">
import ContactContent from "@/components/Contact/ContactContent.vue";
import ContactInfos from "@/components/Contact/ContactInfos.vue";
import FaqItem from "@/components/Contact/FaqItem.vue";
import Donate from "@/components/Donate/Donate.vue";
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import EmailingFront from "@/components/EmailingFront/EmailingFront.vue";

</script>

<template>
	<public-template class="Contact">
    <div class="ContactContentInfos container history">
		<ContactContent></ContactContent>
		<ContactInfos></ContactInfos>
	</div>
	<FaqItem></FaqItem>
	<Donate></Donate>
    <EmailingFront/>
	</public-template>
</template>

<style lang="scss">
.Contact {
	height: 100%;
	overflow: auto;
	.ContactContentInfos{
		display: flex;
		gap: 10rem;
	}
}
</style>