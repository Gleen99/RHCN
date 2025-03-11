<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n"; // Importer vue-i18n
import IllusIconOpen from "../images/IllusIconOpen.vue";
import IllusIconClose from "../images/IllusIconClose.vue";
import { IFaqDB } from "@shared/crudTypes";
import { useApi } from "@/composition/api";

type IFaqWithShowText = IFaqDB & { showText: boolean };

const { getFaqs } = useApi();
const faqs = ref<IFaqWithShowText[]>([]);

const { locale } = useI18n();

async function fetchFaqs() {
  try {
    const result = await getFaqs();
    if (result && typeof result === "object") {
      faqs.value = Object.values(result).map((faq) => ({
        ...faq,
        showText: false,
      })) as IFaqWithShowText[];
    } else {
      throw new Error("Unexpected API response.");
    }
  } catch (error) {
    console.error("Error fetching FAQs:", error);
  }
}
function toggleFaq(faqItem: IFaqWithShowText) {
  const foundFaq = faqs.value.find(faq => faq._id === faqItem._id);
  if (foundFaq) {
    foundFaq.showText = !foundFaq.showText;
  }
}

const localizedFaqs = computed(() =>
    faqs.value.map((faq) => {
      return {
        ...faq,
        localized: faq[locale.value as "en" | "fr"],
        showText: faq.showText,
      };
    })
);

onMounted(fetchFaqs);
</script>

<template>
  <div class="FaqItem container">
    <div class="FaqItemContent">
      <!-- Boucle pour afficher les FAQs -->
      <div
          v-for="faqItem in localizedFaqs"
          :key="faqItem._id"
          class="faq-item-container"
      >
        <p
            :class="{ 'is-open': faqItem.showText }"
            class="title-faq"
            @click="toggleFaq(faqItem)"
        >
          {{ faqItem.localized.question }}
          <IllusIconOpen v-if="faqItem.showText" alt="Close FAQ" class="toggle-icon" />
          <IllusIconClose v-else alt="Open FAQ" class="toggle-icon" />
        </p>
        <div v-if="faqItem.showText" class="text-faq-container">
          <p class="text-faq">{{ faqItem.localized.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.FaqItem {

  .FaqItemContent {

    margin-top:23px;
    .faq-item-container{
      position: relative;
      border-radius: 30px;
      background: #ffffff;
      box-shadow: 0px 3px 6px #00000029;
      margin-bottom: 25px;
    }

    .title-faq {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      color: $cteal-dark;
      font-family: $Arial;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 30px;
      background: #FFF;
      box-shadow: 0px 3px 6px #00000029;
      position: relative;
      z-index: 2;

      &.is-open {
        color: $cteal-dark;
        background-color: $clight-gray;
      }

      .toggle-icon {
        width: 52px;
        height: 30px;
        flex-shrink: 0;
        cursor: pointer;
      }
    }

    .text-faq {
      column-count: 2;
      column-gap: 20px;
      color: #97989F;
      font-family: $Arial;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      padding: 30px;
      text-align: center;
    }

    @include mobile {
      .title-faq {
        font-size: 20px;
        padding: 30px;

        .toggle-icon {
          margin-left: 20px;
        }
      }

      .text-faq {
        column-count: 1;
        font-size: 20px;
      }
    }
  }
}
</style>