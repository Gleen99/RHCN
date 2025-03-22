<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { IFaqContent, IFaqDB } from "@shared/crudTypes";

const { createFaq, getFaqs, deleteFaq, updateFaq } = useApi();

const faqs = ref<IFaqDB[]>([]);
const faqForms = ref<{ fr: IFaqContent; en: IFaqContent }[]>([
  { fr: { question: "", answer: "" }, en: { question: "", answer: "" } },
]);
const formErrors = ref<Record<number, { en: boolean; fr: boolean }>>({});
const editingFaq = ref<IFaqDB | null>(null);

async function fetchFaqs() {
  try {
    const result = await getFaqs();
    if (result && typeof result === "object") {
      faqs.value = Object.values(result);
    } else {
      throw new Error("Unexpected API response.");
    }
  } catch (error) {
    console.error("Error fetching FAQs:", error);
  }
}

function addFaqForm() {
  faqForms.value.push({ fr: { question: "", answer: "" }, en: { question: "", answer: "" } });
}

function removeFaqForm(index: number) {
  if (faqForms.value.length > 1) {
    faqForms.value.splice(index, 1);
  }
}

async function addAllFaqs() {
  for (let i = 0; i < faqForms.value.length; i++) {
    const form = faqForms.value[i];
    formErrors.value[i] = {
      en: !form.en.question || !form.en.answer,
      fr: !form.fr.question || !form.fr.answer,
    };

    if (formErrors.value[i].en || formErrors.value[i].fr) {
      continue;
    }

    try {
      await createFaq({ en: form.en, fr: form.fr });
      faqForms.value[i] = { fr: { question: "", answer: "" }, en: { question: "", answer: "" } };
    } catch (error) {
      console.error(`Error creating FAQ for form ${i}:`, error);
    }
  }

  fetchFaqs();
}

async function removeFaq(faqId: string) {
  try {
    await deleteFaq(faqId);
    faqs.value = faqs.value.filter((faq) => faq._id !== faqId);
  } catch (error) {
    console.error("Error deleting FAQ:", error);
  }
}

function editFaq(faq: IFaqDB) {
  editingFaq.value = { ...faq };
}

function cancelEdit() {
  editingFaq.value = null;
}

async function updateFaqItem() {
  if (!editingFaq.value) return;

  try {
    const updatedFaq = { en: editingFaq.value.en, fr: editingFaq.value.fr };
    await updateFaq(updatedFaq, editingFaq.value._id);
    fetchFaqs();
    editingFaq.value = null;
  } catch (error) {
    console.error("Error updating FAQ:", error);
  }
}

onMounted(fetchFaqs);
</script>

<template>
  <div class="faq">
    <h1>FAQs</h1>

    <!-- Formulaires dynamiques pour créer de nouvelles FAQ -->
    <div class="faq-form">
      <h2>Création des FAQs</h2>
      <div v-for="(form, index) in faqForms" :key="index" class="FomFAQ">
        <div>
          <label :for="'fr-question-' + index">Question en Français :</label>
          <input
              :id="'fr-question-' + index"
              v-model="form.fr.question"
              placeholder="Entrez la question en Français"
          />
          <span v-if="formErrors[index]?.fr && !form.fr.question" class="error">Ce champ est requis.</span>
        </div>
        <div>
          <label :for="'fr-answer-' + index">Réponse en Français :</label>
          <input
              :id="'fr-answer-' + index"
              v-model="form.fr.answer"
              placeholder="Entrez la réponse en Français"
          />
          <span v-if="formErrors[index]?.fr && !form.fr.answer" class="error">Ce champ est requis.</span>
        </div>
        <div>
          <label :for="'en-question-' + index">Question en Anglais :</label>
          <input
              :id="'en-question-' + index"
              v-model="form.en.question"
              placeholder="Entrez la question en Anglais"
          />
          <span v-if="formErrors[index]?.en && !form.en.question" class="error">Ce champ est requis.</span>
        </div>
        <div>
          <label :for="'en-answer-' + index">Réponse en Anglais :</label>
          <input
              :id="'en-answer-' + index"
              v-model="form.en.answer"
              placeholder="Entrez la réponse en Anglais"
          />
          <span v-if="formErrors[index]?.en && !form.en.answer" class="error">Ce champ est requis.</span>
        </div>

        <!-- Afficher le bouton de suppression uniquement pour les formulaires ajoutés dynamiquement -->
        <button
            v-if="faqForms.length > 1"
            @click="removeFaqForm(index)"
            class="btn-danger"
        >
          Supprimer ce formulaire
        </button>
      </div>
      <div class="boutonForm">
        <button @click="addFaqForm" class="btn-primary">Ajouter un autre formulaire</button>
        <button @click="addAllFaqs" class="btn-primary">Enregistrer toutes les FAQs</button>
      </div>
    </div>

    <!-- Liste des FAQs -->
    <div v-if="faqs.length" class="faq-list">
      <h2>FAQs Existantes</h2>
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <div v-if="editingFaq?._id !== faq._id">
          <h3>Français :</h3>
          <p><strong>Question :</strong> {{ faq.fr.question }}</p>
          <p><strong>Réponse :</strong> {{ faq.fr.answer }}</p>
          <h3>Anglais :</h3>
          <p><strong>Question :</strong> {{ faq.en.question }}</p>
          <p><strong>Réponse :</strong> {{ faq.en.answer }}</p>
          <button @click="removeFaq(faq._id)" class="btn-danger">Supprimer</button>
          <button @click="editFaq(faq)" class="btn-primary">Modifier</button>
        </div>

        <!-- Formulaire d'édition -->
        <div v-else class="edit-form">
          <h3>Modifier la FAQ</h3>
          <div>
            <label for="edit-fr-question">Question en Français :</label>
            <input
                id="edit-fr-question"
                v-model="editingFaq.fr.question"
                placeholder="Modifier la question en Français"
            />
          </div>
          <div>
            <label for="edit-fr-answer">Réponse en Français :</label>
            <input
                id="edit-fr-answer"
                v-model="editingFaq.fr.answer"
                placeholder="Modifier la réponse en Français"
            />
          </div>
          <div>
            <label for="edit-en-question">Question en Anglais :</label>
            <input
                id="edit-en-question"
                v-model="editingFaq.en.question"
                placeholder="Modifier la question en Anglais"
            />
          </div>
          <div>
            <label for="edit-en-answer">Réponse en Anglais :</label>
            <input
                id="edit-en-answer"
                v-model="editingFaq.en.answer"
                placeholder="Modifier la réponse en Anglais"
            />
          </div>
          <div class="edit-buttons">
            <button @click="updateFaqItem" class="btn-primary">Enregistrer</button>
            <button @click="cancelEdit" class="btn-secondary">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.faq {
  padding: 20px;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 2px 5px white;

  h1,
  h2 {
    color: #2c3e50;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-size: 24px;
    letter-spacing: 1px;
  }

  .faq-form,
  .faq-list {
    margin-bottom: 20px;
  }

  .faq-form {
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 5px white;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: scale(1.01);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
      color: #555;
      font-size: 14px;
    }

    input {
      display: block;
      margin-bottom: 15px;
      font-family: $Arial;
      padding: 10px;
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      box-shadow: 0 2px 5px white;
      transition: border-color 0.3s, box-shadow 0.3s;

      &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        background: #fff;
      }
    }

    button {
      background-color: $cyellow;
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: background-color 0.3s, transform 0.3s;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
      margin-right: 20px;
      font-family: $Arial;
      &:hover {
        background-color: $cyellow;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(2px);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .faq-item {
    box-shadow: 0 2px 5px white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 18px;
      font-weight: bold;
    }

    p {
      margin: 5px 0;
      font-size: 14px;
      color: #555;
      line-height: 1.5;
    }

    button {
      background-color: #2c3e50;
      color: $cyellow;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      font-family: $Arial;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px;
      transition: background-color 0.3s, transform 0.3s;

      &:hover {
        background-color: #2c3e50;
        transform: translateY(-2px);
      }

      &:nth-child(2) {
        background-color: #dc3545;

        &:hover {
          background-color: #c82333;
        }
      }
    }
  }

  .edit-form {
    background: #f0f8ff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: scale(1.01);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    input {
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
      transition: border-color 0.3s, background-color 0.3s;

      &:focus {
        border-color: #2c3e50;
        background: #fff;
      }
    }

    .edit-buttons {
      display: flex;
      gap: 10px;

      button {
        background-color: #2c3e50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: background-color 0.3s, transform 0.3s;

        &:hover {
          background-color: #2c3e50;
          transform: translateY(-2px);
        }

        &:nth-child(2) {
          background-color: #6c757d;

          &:hover {
            background-color: #5a6268;
          }
        }
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      p {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      button {
        background-color: #dc3545;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        margin: 10px;
        transition: background-color 0.3s, transform 0.3s;

        &:hover {
          background-color: #c82333;
          transform: translateY(-2px);
        }

        &:nth-child(2) {
          background-color: #6c757d;

          &:hover {
            background-color: #5a6268;
          }
        }
      }
    }
  }

  .error {
    color: #dc3545;
    font-size: 13px;
    margin-top: 5px;
    font-weight: bold;
  }
}

</style>
