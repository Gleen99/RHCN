import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vue3Toastify, { toast, type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { createI18n } from 'vue-i18n';
import VueGtag from "vue-gtag";
import VueCookieComply from 'vue-cookie-comply';
import 'vue-cookie-comply/dist/style.css';
import moment from "moment-timezone";
import 'moment/dist/locale/fr';
import { fr } from './i18n/fr';
import { en } from './i18n/en';
import { createPinia } from 'pinia';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { QuillEditor } from '@vueup/vue-quill'

moment.tz.setDefault('Europe/Paris');
moment.locale('fr');

// Création de l'application Vue
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

// --- I18n Configuration ---
type MessageSchema = { fr: typeof fr, en: typeof en };
const i18n = createI18n<MessageSchema, 'fr' | 'en'>({
	legacy: false,
	locale: 'fr',
	fallbackLocale: 'fr',
	messages: { fr, en }
});
app.use(i18n);

// --- Cookies ---
app.use(VueCookieComply);

// --- Analytics ---
app.use(VueGtag, {
	config: {
		id: import.meta.env.VITE_GTAG_KEY,
		params: {
			anonymize_ip: true
		}
	}
});

// --- Toastify ---
app.use(Vue3Toastify, {
	autoClose: import.meta.env.VITE_TOAST_AUTOCLOSE,
	position: toast.POSITION.BOTTOM_RIGHT,
	theme: toast.THEME.COLORED,
	hideProgressBar: true
} as ToastContainerOptions);

// --- Enregistrement global de QuillEditor ---
app.component("QuillEditor", QuillEditor);

// --- Router ---
app.use(router);

// --- Montage de l'application ---
app.mount('#app');
