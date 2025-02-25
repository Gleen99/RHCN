<script setup lang="ts">
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import HomeHeader from "@/components/Home/HomeHeader.vue";
import JoinUs from "@/components/Home/JoinUs.vue";
import Donate from "@/components/Donate/Donate.vue";
import EmailingFront from "@/components/EmailingFront/EmailingFront.vue";
import PartnerIcon from "@/components/PartnerIcon/PartnerIcon.vue";
import LatestEvents from "@/components/ListEvents/latest-events.vue";

</script>

<template>
	<public-template class="Home">
    <HomeHeader/>
    <JoinUs/>
    <Donate class="Donate" />
    <latest-events/>
    <PartnerIcon/>
    <EmailingFront/>
	</public-template>
</template>

<style lang="scss">
.Home {
	height: 100%;
	overflow: auto;
  .Donate{
    position: relative;
    top: -408px;
  }
}
</style>