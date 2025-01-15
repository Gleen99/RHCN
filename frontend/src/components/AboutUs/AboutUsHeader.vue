<script setup lang="ts">
import { useI18n } from "vue-i18n";
import PageTitle from "../ui/PageTitle.vue";

const { t } = useI18n();

</script>

<template>
    <div class="AboutUsHeader">
        <div class="AboutUsHeaderContent">
            <div>
              <img src="../../assets/BGAboutUs.png" class="BGAboutUs" />
                <div class="ContentInfos">
                    <PageTitle type="underlineBleu" class="title">
                        {{ t('aboutUs.title') }}
                    </PageTitle>
                    <div class="ContentInfosText">
                        <div class="textContent">
                            <div class="text">  {{ t('aboutUs.text1') }}</div>
                            <div class="text">  {{ t('aboutUs.text2') }}</div>
                        </div>
                        <div class="TextBottom">  {{ t('aboutUs.textBottom') }}</div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.AboutUsHeader {
    background-color: $cdark-blue-gray;
    position: relative;
    right: 9%;
    bottom: 17rem;
    height: 90vh;
    width: 99.5vw;
    margin: 0;

    .AboutUsHeaderContent {
        margin: 116px 106px 0 116px;
        padding-top: 142px;

        @include desktopLittle {
            margin: 127px;
        }

        .BGAboutUs {
            max-width: 100%;
            height: auto;
            display: block;
        }
        .ContentInfos{
            
            position: relative;
            bottom: 295px;
            .title{
                display: flex;
            justify-content: center;
            
            }
           
        }
        .ContentInfosText{
    background-color: #FFFFFF;
    border-radius: 50px;
    padding: 5% 5%;
    font-size: 18px;
    margin-top: 4.5%;
    line-height: 1.5;
    box-shadow: $box-shadow;
            .textContent{
                display: flex;
                gap:15px
            }
            .TextBottom{
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                padding-top: 5%;
            }
            .text{
                flex: 1;
            }
        }
    }
}
</style>