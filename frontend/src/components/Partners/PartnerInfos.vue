<script setup lang="ts">
import PageTitle from "@/components/ui/PageTitle.vue";
import { useI18n } from "vue-i18n";
import FieldInput from "@/components/forms/FieldInput.vue";
import {ref, watch} from "vue";
import FormPlus from "@/components/forms/FormPlus.vue";
import FieldSelect from "@/components/forms/FieldSelect.vue";
import DocumentUploader from "@/components/ui/DocumentUploader.vue";
import MainButton from "@/components/ui/MainButton.vue";
import ITrash from "@/components/images/ITrash.vue";
import FieldText from '../forms/FieldText.vue';
import IMessageSend from "@/components/images/IMessageSend.vue";
import { IBecomePartner, loader } from "@shared/crudTypes";
import { useApi } from "@/composition/api";

const { t } = useI18n();
const { locale } = useI18n();
const { PostBecomePartners } = useApi();

const partner = ref<IBecomePartner>({
  email: "",
  name: "",
  reference: "",
  typeOfPartnership: "",
  apport: "",
  expentation: "",
  documentUploader: [],
  lang: locale.value,
});

const notificationMessage = ref("");
const globalErrorMessage = ref("");
const isSubmitting = ref(false);

const referenceOptions = ref([
  { value: "yes", label: t("partners.partnersInfos.Forms.reference.placeholderYes") },
  { value: "no", label: t("partners.partnersInfos.Forms.reference.placeholderNo") },
]);

const typeOfPartnershipOptions = ref([
  { value: "longTerm", label: t("partners.partnersInfos.Forms.typeOfPartnership.placeholderLTerm") },
  { value: "shortTerm", label: t("partners.partnersInfos.Forms.typeOfPartnership.placeholderSTerm") },
]);

const documentUploaders = ref<{ id: number }[]>([]);

const addDocumentUploader = () => {
  const newId = Date.now();
  documentUploaders.value.push({ id: newId });
};

const removeDocumentUploader = (id: number) => {
  documentUploaders.value = documentUploaders.value.filter((uploader) => uploader.id !== id);
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    await PostBecomePartners(partner.value);
    notificationMessage.value = t("partners.partnersInfos.successMessage");
  } catch (error: any) {
    const msg = error?.response?.data?.message;
    if (msg) {
      // traduction personnalisée si connue
      switch (msg) {
        case "Tous les champs obligatoires doivent être remplis.":
          globalErrorMessage.value = t("partners.partnersInfos.errorRequiredFields");
          break;
        case "Ce partenaire existe déjà.":
          globalErrorMessage.value = t("partners.partnersInfos.errorAlreadyExists");
          break;
        case "Erreur lors de l'enregistrement du partenaire.":
          globalErrorMessage.value = t("partners.partnersInfos.errorDatabase");
          break;
        default:
          globalErrorMessage.value = msg;
      }
    } else {
      globalErrorMessage.value = t("partners.partnersInfos.errorMessage");
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleFileUpload = (fileData: loader, uploaderName: string) => {
  const existingIndex = partner.value.documentUploader.findIndex(doc => doc.uploaderName === uploaderName);
  if (existingIndex !== -1) {
    partner.value.documentUploader[existingIndex] = fileData;
  } else {
    partner.value.documentUploader.push(fileData);
  }
  console.log(`Fichiers ajoutés :`, partner.value.documentUploader);
};
watch(locale, (newLocale) => {
  partner.value.lang = newLocale;
  console.log("Langue envoyée au backend :", partner.value.lang);
});
</script>

<template>
  <div class="partnerInfos">
    <div class="partnerInfos-header">
      <PageTitle class="Title">
        {{ t('partners.partnersInfos.title') }}
      </PageTitle>
    </div>
    <div class="partnerInfos-body">
      <!-- Message d'erreur global -->
      <div v-if="globalErrorMessage" class="global-error-message">
        {{ globalErrorMessage }}
      </div>
      <div v-if="notificationMessage" class="notificationMessage">
        {{ notificationMessage }}
      </div>
      <FormPlus @submit.prevent="submitForm" error-prefix="contact" class="FormPlus">
        <div class="FormPlus__form">
          <FieldInput
              class="input-style"
              name="email"
              :label="t('partners.partnersInfos.Forms.email.label')"
              v-model="partner.email"
              :placeholder="t('partners.partnersInfos.Forms.email.placeholder')"
              mandatory
          />
          <FieldInput class="input-style" name="name" :label="t('partners.partnersInfos.Forms.name.label')"
                      v-model="partner.name" :placeholder="t('partners.partnersInfos.Forms.name.placeholder')" mandatory />
          <FieldSelect class="select-style" name="reference" :options="referenceOptions" v-model="partner.reference"
                       :label="t('partners.partnersInfos.Forms.reference.label')" />
          <FieldSelect class="select-style" name="typeOfPartnership" :options="typeOfPartnershipOptions"
                       v-model="partner.typeOfPartnership" :label="t('partners.partnersInfos.Forms.typeOfPartnership.label')" />
        </div>
        <div class="FormPlus__form">
          <FieldText class="input-style-apport" name="apport"
                     :label="t('partners.partnersInfos.Forms.apport.label')" v-model="partner.apport"
                     :placeholder="t('partners.partnersInfos.Forms.apport.placeholder')" mandatory />
          <FieldText class="input-style-expentation" name="expentation"
                     :label="t('partners.partnersInfos.Forms.expentation.label')" v-model="partner.expentation"
                     :placeholder="t('partners.partnersInfos.Forms.expentation.placeholder')" mandatory />
        </div>
        <div class="document-uploader-wrapper">
          <DocumentUploader :label="t('partners.partnersInfos.Forms.documentUploader.label')"
                            :placeholder="t('partners.partnersInfos.Forms.documentUploader.placeholder')"
                            mandatory
                            :max-file-size="5 * 1024 * 1024"
                            name="defaultDocumentUploader"
                            class="documentUploader"
                            @onChange="(fileData) => handleFileUpload(fileData, 'defaultUploader')"

          />
        </div>
        <div>
          <div v-for="uploader in documentUploaders" :key="uploader.id" class="document-uploader-wrapper">
            <DocumentUploader
                :placeholder="t('partners.partnersInfos.Forms.documentUploader.placeholder')"
                mandatory
                :max-file-size="5 * 1024 * 1024"
                :name="'documentUploader' + uploader.id"
                class="documentUploader2"
                @onChange="(fileData) => handleFileUpload(fileData, 'defaultUploader')"

            />
            <div class="remove-button" @click="removeDocumentUploader(uploader.id)">
              <ITrash size="20" />
            </div>
          </div>
          <MainButton type="standard" @click="addDocumentUploader" class="add-document-uploader">
            {{ t('partners.partnersInfos.Forms.BottomAdd') }}
          </MainButton>
        </div>
        <div class="contacMessage">
          <div>{{ t('partners.partnersInfos.Forms.confidentialityText1') }}</div>
          <div class="messagePart2">{{ t('partners.partnersInfos.Forms.confidentialityText2') }}</div>
        </div>
      </FormPlus>
    </div>
    <MainButton :disabled="isSubmitting" @click="submitForm" type="dimmed" class="MessageSend">
      <IMessageSend />{{ t('contact.submit') }}
    </MainButton>
  </div>
</template>


<style scoped lang="scss">
.partnerInfos {
  border: 1px solid $csoft-light-gray;
  padding: 30px 30px 30px 90px;
  @include mobile {
    padding: 30px 30px 30px 30px;
  }
  .partnerInfos-header {
    border-bottom: 1px solid $csoft-light-gray;
    margin-bottom: $gap;
  }
  .FormPlus__form{
    display: flex;
    gap:23px;
    align-items: center;
    @include mobile {
      display: block;
    }
    .input-style-apport, .input-style-expentation , .input-style , .select-style{
      flex: 1;
    }

  }
  .document-uploader-wrapper {
    display: flex;
    gap:23px;
    .documentUploader{
      flex:1;
    }
    .documentUploader2{
      flex:1
    }
  }
  .add-document-uploader{
  }
  .MainButton{
    width:fit-content;
  }
  .contacMessage {
    .messagePart2 {
      margin-top: 5px;
    }
  }
  .global-error-message {
    font-size: 16px;
    color: $cerror;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .notificationMessage {
    font-size: 14px;
    color: $csuccess;
    margin-top: 10px;
  }
  .MessageSend {
    width: max-content;
    border-radius: 20px;
    position: relative;
    margin-left: auto;
    margin-top: 30px;
  }
}
</style>