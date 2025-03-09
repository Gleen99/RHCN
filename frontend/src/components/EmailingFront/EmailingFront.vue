<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useApi } from '@/composition/api';
import { ref } from 'vue';

const { t } = useI18n();
const { addUserToNewsletter } = useApi();

const email = ref<string>('');
const error = ref<string | null>(null);
const sending = ref<boolean>(false);
const sent = ref<boolean>(false);

async function sendEmail() {
  if (sending.value || !email.value.trim()) return;

  sending.value = true;
  error.value = null;

  try {
    await addUserToNewsletter(email.value);
    sent.value = true;
  } catch (err) {
    console.error('[Newsletter] Error:', err);
    error.value = t('newsletter.error');
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="EmailingFront container">
    <div class="EmailFront">
      <img src="../../assets/BGEmailFront.png" class="BGEmailFront" alt="Email Background" />
      <div class="EmailFrontText">
        <div class="title">{{ t('emailingFront.title') }}</div>
        <div class="text">{{ t('emailingFront.text') }}</div>
        <div v-if="sent" class="thankyou">{{ t('emailingFront.thankyou') }}</div>
        <div v-else class="EmailSender">
          <input
              type="email"
              class="text"
              v-model="email"
              :placeholder="t('global.buttons.email')"
              @keyup.enter="sendEmail"
          />
          <div class="sender" @click="sendEmail">{{ t('global.buttons.register') }}</div>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.EmailingFront {
  padding: 45px 0;

  .EmailFront {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;

    @include mobile {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }

    .BGEmailFront {
      width: 49vw;

      @include desktopMax {
        width: 50vw;
      }

      @include mobile {
        width: 90%;
      }
    }

    .EmailFrontText {
      backdrop-filter: blur(15px) brightness(100%);
      -webkit-backdrop-filter: blur(15px) brightness(50%);
      background-color: rgba(255, 255, 255, 0.2);
      position: relative;
      right: 18%;
      padding: 70px;
      border-radius: 25px;

      @include mobile {
        right: 0;
        padding: 30px;
        width: 90%;
      }

      .title {
        color: $cyellow;
        font-size: 40px;
        font-weight: bold;

        @include mobile {
          font-size: 24px;
        }
      }

      .text {
        padding: 25px 0;
        width: 39vw;
        font-size: 16px;
        line-height: 23px;

        @include mobile {
          width: 100%;
          font-size: 14px;
          padding: 15px 0;
        }
      }
    }

    .EmailSender {
      display: flex;
      padding: 0;
      justify-content: space-between;
      background-color: white;
      border-radius: 25px;
      border: 1px solid $cteal-dark;
      cursor: pointer;
      font-family: $Roboto;

      @include mobile {
        flex-direction: column;
        align-items: center;
        width: 100%;
      }

      .text {
        flex: 1;
        border: none;
        background-color: transparent;
        font-size: 17px;
        color: $cteal-dark;
        font-weight: 600;
        padding: 10px 18px;
        outline: none;

        &::placeholder {
          color: $cteal-dark;
        }

        @include mobile {
          font-size: 14px;
          padding: 8px 12px;
          width: 100%;
          text-align: center;
        }
      }

      .sender {
        background-color: $cteal-dark;
        border-radius: 25px;
        font-size: 18px;
        font-weight: 700;
        padding: 15px;
        color: white;
        width: 26%;
        display: flex;
        align-items: center;
        justify-content: center;

        @include mobile {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
