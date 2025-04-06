<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import IMessage from '../images/IMessage.vue';
import PageTitle from '../ui/PageTitle.vue';
import { useApi } from '@/composition/api';
import { ref } from 'vue';
import FormPlus from '../forms/FormPlus.vue';
import FieldInput from '../forms/FieldInput.vue';
import FieldText from '../forms/FieldText.vue';
import FieldNumber from '../forms/FieldNumber.vue';
import MainButton from '../ui/MainButton.vue';
import IMessageSend from '../images/IMessageSend.vue';

const { sendContactMessage } = useApi();
const { t } = useI18n();

const notificationMessage = ref('');
const globalErrorMessage = ref('');
const { locale } = useI18n();

interface ErrorMessages {
    lastname?: string;
    firstname?: string;
    email?: string;
    number?: string;
    message?: string;

}

const errors = ref<ErrorMessages>({});

const contact = ref<any>({
    type: "site",
    lastname: "",
    firstname: "",
    email: "",
    number: "",
    message: "",
    lang: locale.value,
});

function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
}

async function save() {
    let isValid = true;

    // Réinitialiser les messages d'erreur et de notification
    notificationMessage.value = '';
    globalErrorMessage.value = '';
    errors.value = {};

    // Validation pour chaque champ
    if (!contact.value.lastname.trim()) {
        errors.value.lastname = t('contact.errors.ErrorsValueLastName');
        isValid = false;
    }
    if (!contact.value.firstname.trim()) {
        errors.value.firstname = t('contact.errors.ErrorsValueFirstName');
        isValid = false;
    }
    if (!isValidEmail(contact.value.email)) {
        errors.value.email = t('contact.errors.ErrorsValueEmail');
        isValid = false;
    }
    if (!contact.value.number.trim()) {
        errors.value.number = t('contact.errors.ErrorsValueNumber');
        isValid = false;
    }
    if (!contact.value.message.trim()) {
        errors.value.message = t('contact.errors.ErrorsValueMessage');
        isValid = false;
    }

    if (!isValid) {
        globalErrorMessage.value = t('contact.errors.globalErrorMessage');
        return;
    }

    try {
        await sendContactMessage(contact.value);
        notificationMessage.value = t('contact.messages.NotificationMessageConfirmation');
    } catch (e) {
        notificationMessage.value = t('contact.errors.NotificationMessageError');
    }
}
</script>


<template>
    <div class="ContactInfos">
        <div class="ContactInfosTitle">
            <PageTitle type="icon" class="Title">
                <template #icon>
                    <IMessage />
                </template>
                {{ t('contact.title') }}
            </PageTitle>
        </div>
        <div>
            <!-- Message d'erreur global -->
            <div v-if="globalErrorMessage" class="global-error-message">
                {{ globalErrorMessage }}
            </div>

            <FormPlus error-prefix="contact" class="FormPlus">
                <!-- Champs prénom et nom -->
                <div class="name-fields">
                    <FieldInput
                        class="input-style"
                        name="lastname"
                        :label="t('user.fields.lastName.label')"
                        v-model="contact.lastname"
                        :placeholder="t('user.fields.lastName.placeholder')"
                        mandatory
                    />
                    <FieldInput
                        class="input-style"
                        name="firstname"
                        :label="t('user.fields.firstName.label')"
                        v-model="contact.firstname"
                        :placeholder="t('user.fields.firstName.placeholder')"
                        mandatory
                    />
                </div>

                <!-- Champs email et numéro -->
                <div class="name-fields">
                    <FieldInput
                        class="input-style"
                        name="email"
                        :label="t('user.fields.email.label')"
                        v-model="contact.email"
                        :placeholder="t('user.fields.email.placeholder')"
                        mandatory
                    />
                    <FieldNumber
                        class="input-style"
                        name="number"
                        :label="t('user.fields.number.label')"
                        v-model="contact.number"
                        :placeholder="'+1 123 456 7890'"
                        mandatory
                    />
                </div>

                <!-- Champ message -->
                <FieldText
                    name="message"
                    v-model="contact.message"
                    :label="t('user.fields.message.label')"
                    class="long-textarea larger-fieldtext"
                    :placeholder="t('user.fields.message.label')"
                    mandatory
                />
            </FormPlus>

            <!-- Notification -->
            <div class="notificationMessage" v-if="notificationMessage">{{ notificationMessage }}</div>
            <div class="contacMessage">
                <div>{{ t('contact.messagePart1') }}</div>
            <div class="messagePart2">{{ t('contact.messagePart2') }}</div>
            </div>
        </div>

        <!-- Bouton d'envoi -->
        <MainButton type="dimmed" @click="save" class="MessageSend">
            <IMessageSend />{{ t('contact.submit') }}
        </MainButton>
    </div>
</template>



<style lang="scss">
.ContactInfos {
    flex: 1;
  @include mobile{
    border: 1px solid $csoft-light-gray;
    margin-bottom: 30px;
  }
  @include mobile{

    .PageTitle{
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      margin: 23px 0;
        .title{
         font-size: 25px !important;
      }
    }
  }

    .ContactInfosTitle {
        border-bottom: 1px solid $csoft-light-gray;
        padding-bottom: 24px;
        margin-bottom: 24px;
      @include mobile{
        padding-bottom: 0;
        margin-bottom: 24px;
      }
    }
    .name-fields {
        display: flex;
        gap: 20px;
      @include mobile{
        display:block;
        padding: 0 30px;
      }
        .FieldInput,
        .FieldNumber {
            flex: 1;
        }

    }
  .FieldLayout {
    @include mobile{
      padding: 0 30px;
    }
  }
    .global-error-message {
        font-size: 16px;
        color: $cerror;
        margin-bottom: 20px;
        font-weight: bold;
    }
    .error-message {
        font-size: 14px;
        color: $cerror;
        margin-top: 5px;
    }
    .MessageSend {
        width: max-content;
        border-radius: 20px;
        position: relative;
        margin-left: auto;
        margin-top: 30px;
      @include mobile{
        margin-bottom: 20px;
        margin-right: 20px;
      }
    }
    .notificationMessage {
        font-size: 14px;
        color: $csuccess;
        margin-top: 10px;
    }
    .contacMessage{
        margin-top: 15px;
      @include mobile{
        padding: 0 30px;
      }
        .messagePart2 {
        margin-top: 5px;

    }
    }
   
}
</style>
