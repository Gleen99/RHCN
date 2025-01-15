<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import PageTitle from '../ui/PageTitle.vue';
import MainButton from '../ui/MainButton.vue';

const { t } = useI18n();
</script>

<template>
    <div class="Donate">
      <img src="../../assets/BGDonate.png" class="BGDonate" />
      <div class="DonateContent">
            <div class="MainDonate">
                <div class="IAvatarDonate">
                  <img src="../../assets/IAvatarDonate.png" class="IAvatarDonate" />
                </div>
                <div class="DonateContentInfos">
                    <div class="title">
                        <PageTitle class="Title">
                            {{ t('donate.title') }}
                        </PageTitle>
                    </div>
                    <div class="text">
                        <div class="text1">
                            {{ t('donate.text1') }}
                        </div>
                        <div class="text2">
                            {{ t('donate.text2') }}
                        </div>
                        <div class="text3">
                            {{ t('donate.text3') }}
                        </div>
                        <div class="text4">
                            {{ t('donate.text4') }}
                        </div>
                        <div class="text5">
                            {{ t('donate.text5') }}
                        </div>
                        <div>
                            <MainButton type="cancel" class="DonateSubmit">
                                {{ t('donate.submit') }}
                            </MainButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.Donate {
    position: relative;
    margin: 0;
    padding: 0;

    .IAvatarDonate {
        display: flex;
    align-items: flex-start;
    padding: 0 34px;
    }

    .BGDonate {
        position: relative;
        width: 124%;
        right: 12%;

        @include desktopLittle {
            width: 121%;

        }
    }

    .DonateContent {
        position: absolute;
        bottom: 30%;
        // right: 50%;
        z-index: 1;
        background-color: $cdark-gray;
        color: #FFFFFF;
        display: flex;
        padding: 22px;
        border-radius: 150px;

        @include desktopLittle {
            bottom: 22%;
            padding: 50px;

        }

        .MainDonate {
            font-size: 16px;
            display: flex;
            gap: 30px;
            font-family: $Arial;
            font-style: italic;
         

            .Title {
                margin-bottom: 10px !important;
                font-style: normal;

                .title {
                    font-size: 40px !important;
                    @include desktopLittle {
                        font-size: 60px !important;

        }
                }
            }

            .text {
                line-height: 20px;
                font-size: 18px;
                font-weight: normal;
                @include desktopLittle {
                    line-height: 25px;

        }

                .text1 {
                    margin-bottom: 5px;
                }

                .text3 {
                    margin-bottom: 10px;
                }

                .text5 {
                    margin-bottom: 15px;
                }

                @include desktopLittle {

                    .text3 {
                        margin-bottom: 20px;
                    }

                    .text5 {
                        margin-bottom: 20px;
                    }

                }
            }

            .DonateSubmit {
                font-family: $Roboto;
                width: max-content;
                font-style: normal;
                padding: 10px 65px;
                color: $cdark-gray;
                font-size: 18px;
                font-weight: bold;
            }
        }
    }
}
</style>
