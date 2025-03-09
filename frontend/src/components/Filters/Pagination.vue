<script setup lang="ts">
import ISwapLeft from "@/components/images/ISwapLeft.vue";
import ISwapright from "@/components/images/ISwapright.vue";

defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["changePage"]);

const goToPage = (page: number) => {
  emit("changePage", page);
};

</script>

<template>
  <div class="pagination">
    <ISwapLeft class="swap" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">&laquo;</ISwapLeft>
    <div class="totalPages">
      <span
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
      >
      {{ page }}
    </span>
    </div>
    <ISwapright class="swap" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">&raquo;</ISwapright>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  margin-top: 20px;
  @include mobile {
    margin: 1rem 5rem;
  }

  button {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    padding: 8px 12px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    padding: 8px 12px;
    border: 1px solid $cteal-dark;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    margin-left: 8px;

    &.active {
      border: none;
      background-color: $clight-gray;
      color: $cteal-dark;
    }
  }
  .swap{
    cursor: pointer;

    &:hover {
      transform: scale(1.5);
    }
  }
}
</style>
