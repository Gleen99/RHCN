import EmailingFront from "@/components/EmailingFront/EmailingFront.vue";
import AboutUs from "@/views/aboutUs.vue";
import Contact from "@/views/Contact.vue";

export const fr = {
	global: {
		buttons: {
			donate: "Faire un don",
			joinUs: "Rejoignez-nous",
			becomeMember: "Devenir membre",
			becomePartner: "Devenir partenaire",
			send: "Envoyer",
			addDocument: "Ajouter un document",
			iDonate: "Je donne",
			iRegister: "Je m'inscris",
			cancel: "Annuler",
			confirm: "Confirmer",
			email: "Votre E-mail",
			register: "Je m'inscris"

		}
	},
	menu: {
		events: "Évènements",
		articles: "Article",
		partners: "Partenaire",
		aboutUs: "Qui sommes-nous",
		contact: "Contact"
	},
	footer: {
		socialNetwork: {
			title: "Nous suivre",
			linkedin: "https://www.linkedin.com/company/livecook-app/posts/?feedView=all",
			instagram: "https://www.instagram.com/livecook_fr/",
			facebook: "https://www.facebook.com/profile.php?id=100094482646609",
			twitter: "https://twitter.com/livecook_off",
			tiktok: "https://www.tiktok.com/@livecook_fr"
		},
		contact: "Nous contacter"
	},
	contact:{
		title: "Contactez-nous",
		messagePart1: "Les données personnelles fournies (identité, email, contenu de la demande) sont destinées à RHCN ne seront utilisées que pour répondre à votre demande.",
		messagePart2:"Pour en savoir plus sur l’utilisation de vos données personnelles par RHCN, pour exercer vos droits d’accès, de rectification et de suppression, ainsi que pour connaître vos autres droits, veuillez consulter la Politique de confidentialité.",
		submit: "Envoyer",
		errors:{
			globalErrorMessage: "Veuillez remplir correctement tous les champs obligatoires.",
			ErrorsValueEmail: "L'adresse e-mail n'est pas valide.",
			NotificationMessageError : "Échec de l'envoi de l'e-mail",
		},
		messages: {
			NotificationMessageConfirmation: "Votre message a été envoyé avec succès !"

		},

	},
	donate:{
		title:"Faire un don",
		text1:"En faisant un don à l’organisme, vous contribuez à soutenir directement toute une communauté à surmonter des défis spécifiques liés soit à la langue, le racisme systémique ou encore les difficultés d’intégration.",
		text2:"Vous donnez pour offrir à toutes les personnes les mêmes chances, les mêmes accès aux ressources, à l’éducation et à des opportunités économiques;",
		text3: "Vous donnez dans l’objectif de renforcer un réseau de solidarité et permettre un impact durable au sein de la société;",
		text4:"Enfin vous donnez pour redonner le sourire à quelqu’un!",
		text5:"Et c’est tout ce qui compte.",
		submit: "je donne"
	},
	aboutUs:{
		title: "Qui Sommes-nous",
		text1: "Le Réseau des Haïtiens de la Capitale-Nationale est une organisation apolitique et à but non lucratif dont le siège social est au Québec, au Canada. Elle est fondée conformément à la Loi sur les compagnies (RLRQ, chapitre C-38).",
		text2: "Cette loi, qui s’applique aux OSBL et OBNL (organisations à but non lucratif), régit la création de personnes morales ou associations n’ayant pas de capital-actions, constituées ou continuées par lettres patentes.",
		textBottom: "Nous sommes fiers de vous présenter une association jeune, diversifiée et ouverte à tous les types de communauté !",
		infos:{
			title1: "Nos objectifs",
			text1:"Défendre les droits et intérêts des personnes afrodescendantes Favoriser l’intégration des nouveaux arrivants à la société québécoise Promouvoir la culture haïtienne Combattre la pauvreté et l’isolement des personnes issues des minorités culturelles Promouvoir la santé mentale et le bien-être Renforcer les compétences interculturelles et contribuer à l’éducation",
			title2: "Notre vision",
			text2:"Rallier les Haïtiens à Québec afin de bâtir une communauté dynamique et solidaire, ou chacun peut s’épanouir pleinement, tout en préservant et valorisant ses racines culturelles.",
			title3: "Nos objectifs",
			text3:"Défendre les droits et intérêts des personnes afrodescendantes Favoriser l’intégration des nouveaux arrivants à la société québécoise Promouvoir la culture haïtienne Combattre la pauvreté et l’isolement des personnes issues des minorités culturelles Promouvoir la santé mentale et le bien-être Renforcer les compétences interculturelles et contribuer à l’éducation",
		}
	},
	emailingFront: {
		title: "Souscription à notre liste de diffusion",
		text: "Joignez-vous à notre liste de diffusion en ajoutant ici votre adresse courriel afin d’être les premiers informés de nos opportunités et événements! Nous ne vous harcèlerons pas avec des messages. Promis!",
		submit: "je m'inscris", 
	
	},
	user: {
		fields: {
			firstName: {
				label: "Prénom",
				placeholder: "Prénom"
			},
			lastName: {
				label: "Nom",
				placeholder: "Nom",
			},
			email: {
				label: "Email",
				placeholder: "Email",
			},	
			number: {
				label: "Téléphone",
				placeholder: "Téléphone",
			},
			message:{
				label: "Votre message",
				placeholder: "Votre message",
			},
			password: {
				label: "Mot de passe"
			},
			newPassword: {
				label: "Nouveau mot de passe"
			},
			username: {
				label: "Pseudo"
			},
			description: {
				label: "Description"
			},
			tags: {
				label: "Tags"
			},
			spokenLanguages: {
				label: "Langues parlées"
			},
			cguAccepted: {
				label: "En cochant cette case, j'accepte les",
				link: "CGU/CGV"
			},
			legalAgeDeclaration: {
				label: "Je déclare être majeur"
			},
			socialNetworks: "Vos réseaux sociaux",
			facebook: {
				label: "Facebook"
			},
			instagram: {
				label: "Instagram"
			},
			youtube: {
				label: "Youtube"
			},
			tiktok: {
				label: "TikTok"
			},
			website: {
				label: "Votre site web"
			},
			addressName: {
				label: "Nom de l'adresse"
			},
			address: {
				label: "Adresse"
			},
			zipCode: {
				label: "Code postal"
			},
			city: {
				label: "Ville"
			},
		}
	},
	events: {
		cacheDetails: "Détails",
		eventsInfos: {
			title: "Nos évènements",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			seeMore: "Plus d'infos",
		},
		eventsContent: {
			title: "Filtrer les événements par :"
		},
		imagesContent :{
			title: "Filtrer les images par :"
		},
		imagesInfos: {
			title: "Gallerie d'images",
			text: "Notre galerie regorge de photos prises à l’occasion\n" +
				"de rencontres variées",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
		},
		filters :{
			allCategories:"Tous les catégories",
			category:{
				label: "Catégorie ",
			},
			date:{
				label: "Date"
			} ,

		}
	},
	partners:{
		cacheDetails: "Détails",
		partnersInfos: {
			title: "Devenir partenaire",
			text: "Renseignez les informations principales relatives à votre demande.",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			seeMore: "Plus d'infos",
		},
		membersInfos: {
			title: "Devenir membre",
			text: "Renseignez les informations principales relatives à votre demande.",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
		},
	}
};
