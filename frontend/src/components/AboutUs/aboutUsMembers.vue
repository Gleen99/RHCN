<script setup lang="ts">
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import { useI18n } from "vue-i18n";
import PageTitle from "../ui/PageTitle.vue";

const {t} =useI18n();
</script>

<template>
	<div class="aboutUsMembers">
		<div class="aboutUsMembersContent">
            <PageTitle type="underline" class="title">
                        {{ t('aboutUs.title') }}
                    </PageTitle>
		</div>
		dsdsqsssssssssssss
        membrs

	</div>
</template>

<style lang="scss">
.aboutUsMembers {
    .aboutUsMembersContent
    {
        .title{
            display: flex;
    justify-content: center;
    align-items: center;
        }
    }
	
}
</style>