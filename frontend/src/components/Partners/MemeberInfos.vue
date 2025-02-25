<script setup lang="ts">
import PageTitle from "@/components/ui/PageTitle.vue";
import { useI18n } from "vue-i18n";
import FormPlus from "@/components/forms/FormPlus.vue";
import FieldInput from "@/components/forms/FieldInput.vue";
import { ref } from "vue";
import FieldDate from "@/components/forms/FieldDate.vue";
import FieldAge from "@/components/forms/FieldAge.vue";
import FieldNumber from "@/components/forms/FieldNumber.vue";
import MainButton from "@/components/ui/MainButton.vue";
import IMessageSend from "@/components/images/IMessageSend.vue";
import FieldText from "@/components/forms/FieldText.vue";
import { useApi } from "@/composition/api";
import { IMembersPartner } from "@shared/crudTypes";
import { confirmationPaiementsStatus } from "@shared/enums";
import FieldCheckbox from "@/components/forms/FieldCheckbox.vue";

const { t } = useI18n();
const { PostMembersPartners } = useApi();

// Initialisation des données du membre
const member = ref<IMembersPartner>({
  firstName: "",
  lastName: "",
  address: "",
  email: "",
  phone: "",
  birthday: "",
  age: 0,
  message: "",
  confirmationPaiements: confirmationPaiementsStatus.accepted,
});

const notificationMessage = ref("");
const globalErrorMessage = ref("");

// Gestionnaire pour mettre à jour la date et la stocker correctement dans le membre
const onDateChange = (newDate: any) => {
  member.value.birthday = newDate;
};

const submitMember = async () => {
  try {
    const response = await PostMembersPartners(member.value);
    if (response) {
      notificationMessage.value = t("partners.membersInfos.successMessage");
    } else {
      globalErrorMessage.value = t("partners.membersInfos.errorMessage");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi des données :", error);
    globalErrorMessage.value = t("partners.membersInfos.errorMessage");
  }
};
</script>

<template>
  <div class="memberInfos">
    <div class="memberInfos-header">
      <PageTitle class="Title">
        {{ t("partners.membersInfos.title") }}
      </PageTitle>
    </div>
    <div class="memberInfos-body">
      <!-- Message d'erreur global -->
      <div v-if="globalErrorMessage" class="global-error-message">
        {{ globalErrorMessage }}
      </div>
      <div v-if="notificationMessage" class="notificationMessage">
        {{ notificationMessage }}
      </div>

      <FormPlus error-prefix="contact" class="FormPlus">
        <div class="FormPlus__form">
          <FieldInput
              class="input-style"
              name="firstName"
              :label="t('partners.membersInfos.forms.firstName.label')"
              v-model="member.firstName"
              :placeholder="t('partners.membersInfos.forms.firstName.placeholder')"
              mandatory
          />
          <FieldInput
              class="input-style"
              name="lastName"
              :label="t('partners.membersInfos.forms.lastName.label')"
              v-model="member.lastName"
              :placeholder="t('partners.membersInfos.forms.lastName.placeholder')"
              mandatory
          />
          <FieldInput
              class="input-style"
              name="address"
              :label="t('partners.membersInfos.forms.address.label')"
              v-model="member.address"
              :placeholder="t('partners.membersInfos.forms.address.placeholder')"
              mandatory
          />
        </div>

        <div class="FormPlus__form">
          <FieldDate
              class="input-style"
              name="birthday"
              :label="t('partners.membersInfos.forms.birthday.label')"
              :modelValue="member.birthday"
              @update:modelValue="onDateChange"
          />
          <FieldAge
              class="input-style"
              name="age"
              :label="t('partners.membersInfos.forms.age.label')"
              :mandatory="true"
              :minAge="18"
              v-model="member.age"
          />
        </div>

        <div class="FormPlus__form">
          <FieldInput
              class="input-style"
              name="email"
              :label="t('partners.membersInfos.forms.email.label')"
              v-model="member.email"
              :placeholder="t('partners.membersInfos.forms.email.placeholder')"
              mandatory
          />
          <FieldNumber
              class="input-style"
              name="phone"
              :label="t('partners.membersInfos.forms.phone.label')"
              v-model="member.phone"
              :placeholder="'+1 123 456 7890'"
              mandatory
          />
        </div>

        <div class="FormPlus__form">
          <FieldText
              class="input-style"
              name="message"
              :label="t('partners.membersInfos.forms.message.label')"
              v-model="member.message"
              :placeholder="t('partners.membersInfos.forms.message.placeholder')"
          />
        </div>

        <div class="FormPlus__form">
          <FieldCheckbox
              class="input-style"
              name="confirmationPaiements"
              :label="t('partners.membersInfos.forms.confirmationPaiements')"
              :modelValue="member.confirmationPaiements === confirmationPaiementsStatus.accepted"
              @update:modelValue="(newValue) => member.confirmationPaiements = newValue ? confirmationPaiementsStatus.accepted : confirmationPaiementsStatus.rejected"
          />
        </div>

        <div class="contacMessage">
          <div>{{ t('partners.partnersInfos.Forms.confidentialityText1') }}</div>
          <div class="messagePart2">{{ t('partners.partnersInfos.Forms.confidentialityText2') }}</div>
        </div>
      </FormPlus>
    </div>

    <!-- Bouton d'envoi -->
    <MainButton type="dimmed" class="MessageSend" @click="submitMember">
      <IMessageSend />{{ t('contact.submit') }}
    </MainButton>
  </div>
</template>

<style scoped lang="scss">
.memberInfos {
  border: 1px solid $csoft-light-gray;
  padding: 30px 30px 30px 90px;

  .memberInfos-header {
    border-bottom: 1px solid $csoft-light-gray;
    margin-bottom: $gap;
  }

  .FormPlus__form {
    display: flex;
    gap: 23px;
    align-items: center;

    .input-style {
      flex: 1;
    }
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