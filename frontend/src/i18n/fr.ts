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
			register: "Je m'inscris",
			returnHome: "Retour à l'accueil"

		}
	},
	form:{
		invalidPhoneNumber: "Numéro de téléphone invalide",
	},
	modal:{
		modalDonate:{
			modalTitle:"Faire un don",
			cancel:"Annuler",
			confirm:"Confirmer",
			moreInfosSendDonate: {
				infos1: "Vous pouvez aussi utiliser le virement \nInterac au courriel de l’association : ",
			},
			paymentInfos:{
				amountofDonate: "Montant du Don",
				cardNumber: "Numéro de carte",
				cardExpiry: "Date d'expiration",
				cardCvc: "CVC",
				pay:"Faire un Don",
				amount: "Entrez un montant",
				processing: "Traitement en cours...",
				error: "Une erreur est survenue.",
				valid:"Valider votre don",
				paymentError: "Erreur : {error}",
				paymentSuccess: "Paiement réussi ! Merci !",
				unexpectedError: "Une erreur inattendue est survenue."
			}
		},
		modalEvent:{
			price: "Tarif:",
			link: "Inscriptions / réservations",
		},
		modalSuccess:{
			successTitle:"    Nous vous remercions chaleureusement pour votre don.<br />\n" +
				"         Votre soutien est précieux et aide à financer nos actions. ",
			cancel:"Fermer"
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
			instagram: "https://www.instagram.com/rhcn1804?igsh=aXhjeGJxYnAzYmV",
			facebook: "https://www.instagram.com/rhcn1804?igsh=aXhjeGJxYnAzYmV",
			twitter: "https://www.linkedin.com/company/regroupement-des-ha%C3%AFtiens-de-la-capitale-nationale-rhcn/",
		},
		contact: "Nous contacter",
		LegalMentions: "Mentions légales",
		CGV: "CGV",
		privacyPolicy: {
			title: "Politique de confidentialités",
			content: "Le RHCN est soucieux de protéger tous les renseignements personnels collectés dans le cadre de ses services d’intervention auprès des personnes nous contactant. En communiquant avec nous, vous consentez à ce que les informations obtenues soient notées dans nos bases de données, nous permettant ainsi de mieux vous accompagner. Dès qu’une communication est effectuée avec le RHCN, des informations peuvent être recueillies, selon leur pertinence et leur nécessité.\n" +
				"Toute personne œuvrant chez le RHCN s’engage à respecter notre politique concernant la confidentialité, notamment en assurant la confidentialité des renseignements obtenus de quelque manière que ce soit (verbal ou écrit) et de détruire l’information lorsqu’ils ne sont plus nécessaires ou qu’un délai de cinq (5) ans s’est écoulés. En cas de bris ou d’incident concernant la confidentialité, le RHCN s’engage à ce que le ou la responsable de la politique entre en contact avec les personnes concernées afin de les en aviser.\n" +
				"Tous les renseignements qui sont recueillis par le RHCN sont pour une durée maximale de cinq (5) ans après la dernière interaction avec l’organisme. Ces informations seront anonymisées et utilisées à des fins statistiques uniquement. Si des données ont à être nominalisées, l’accord des personnes concernées sera demandé. Si vous désirez que vos informations soient détruites, rectifiées ou modifiées, merci de communiquer avec la personne responsable de votre dossier ou la ou les personnes responsables de la confidentialité des informations.\n" +
				"Notre site web peut contenir certains liens vers d’autres sites web ou ressources Internet, notamment (mais sans s’y limiter) vers ceux qui appartiennent à nos commanditaires, partenaires ou collaborateurs. Quand vous cliquez sur l’un de ces liens, vous entrez en contact avec un autre site Web ou une autre ressource Internet qui peuvent recueillir des renseignements à votre sujet de façon volontaire ou par l’intermédiaire de témoins ou autres technologies. Nous ne sommes pas responsables des pratiques de protection de la vie privée ou du contenu de tout site dont le propriétaire-exploitant est une tierce partie. Ces autres\n" +
				"\n" +
				"sites pouvant recueillir et traiter les renseignements recueillis différemment, nous vous encourageons à passer en revue et lire attentivement la politique sur la protection des renseignements personnels de chaque site que vous visitez.\n" +
				"En utilisant notre site web, vous consentez au traitement des données recueillies à votre sujet, selon la manière décrite et aux fins susmentionnées.\n" +
				"Le consentement pour la collecte et la conservation des données peut être retiré en tout temps en contactant directement l’association. En outre, nous utilisons des témoins pour effectuer des évaluations de fréquence, d’utilisation de pages particulières et de marketing. En ce qui a trait aux évaluations susmentionnées, nous utilisons l’information enregistrée à l’aide des témoins sans qu’il y ait un lien avec vos renseignements personnels, ce qui rend le tout entièrement anonyme.\n" +
				"Vous pouvez configurer votre navigateur Internet de sorte que vous puissiez recevoir des avis lorsque des témoins s’inscrivent, vous pouvez décider dans chaque cas si vous souhaitez accepter les témoins, ou vous pouvez refuser d’accepter tous les témoins. Toutefois, si vous refusez les témoins, vous pouvez limiter la façon dont vous pourrez utiliser notre Site. Vous pouvez supprimer les témoins qui sont déjà enregistrés sur votre disque dur en tout temps. Les détails sur la façon de procéder se trouvent dans le guide d’utilisateur de votre programme de navigateur Internet."
		},
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
		thankyou: "Merci !",
	
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
				label: "Ville",
				placeholder:"Québec"
			},
			street:{
				label: "Rue",
				placeholder:"Rue"
			},
			postalCode: {
				label: "Code Postal",
				placeholder:"XXX XXX"

			},
			country:{
				label: "Pays",
				placeholder: "Pays"
			},
			domain:{
				label: "Domaine souhaité pour diriger mon don"
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
			noResults: "Il y a pas d'évenement à venir"

		},
		latestEvents:{
			title:"Nos évènements",
			viewMore: "Voir tous les évènements"
		}
	},
	partners:{
		cacheDetails: "Détails",
		partnersInfos: {
			title: "Devenir partenaire",
			text: "Renseignez les informations principales relatives à votre demande.",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			seeMore: "Plus d'infos",
			Forms: {
				email:{
					placeholder: "E-mail",
					label:"Veuillez renseigner votre e-mail",
				},
				name:{
					label: "Quel est le nom de votre association ou organisation?",
					placeholder: "Antoine"
				},
				reference:{
					label: "Êtes-vous la personne référence?",
					placeholderYes: "Oui",
					placeholderNo: "Non"
				},
				typeOfPartnership:{
					label:"De quels types de partenariats avez-vous besoin?",
					placeholderLTerm: "Long terme",
					placeholderSTerm: "Court terme"
				},
				apport:{
					label:"Quels seront vos apports ?",
					placeholder: "Votre texte ici"
				},
				expentation:{
					label:"Quels seront vos attentes ?",
					placeholder: "Votre texte ici"
				},
				documentUploader:{
					label:"Lettre de demande de partenariat",
					placeholder: "Veuillez ajouter votre document ici"
				},

				BottomAdd:"Ajouter un document",
				confidentialityText1:"Les données personnelles fournies (identité, email, contenu de la demande) sont destinées à RHCN ne seront utilisées que pour répondre à votre demande.",
				confidentialityText2:"Pour en savoir plus sur l’utilisation de vos données personnelles par RHCN, pour exercer vos droits d’accès, de rectification et de suppression, ainsi que pour connaître vos autres droits, veuillez consulter la Politique de confidentialité.",

			},
			errorMessage:" Une erreur est survenue lors de l’enregistrement de votre demande. Veuillez réessayer plus tard.",
			successMessage:"Votre demande a été enregistrée avec succès ! Vous recevrez une confirmation sous peu."
		},
		membersInfos: {
			title: "Devenir membre",
			text: "Renseignez les informations principales relatives à votre demande.",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			forms:{
				firstName: {
					label: "Nom",
					placeholder:"Antoine",
				},
				lastName: {
					label: "Prénom",
					placeholder:"Dupond",
				},
				address: {
					label: "Adresse",
					placeholder: "Veuillez renseigner votre adresse",
				},
				birthday: {
					label: "Date de naissance",
				},
				age:{
					label: "Age",
					placeholder:"Veuillez renseigner votre âge",
				},
				email: {
					label: "E-mail",
					placeholder:"Veuillez renseigner votre e-mail",
				},
				phoneNumber: {
					label: "Téléphone",
					placeholder:"Veuillez renseigner votre numéro de téléphone",
				},
				message: {
					label:"Votre message",
					placeholder:"Veuillez ajouter un message",
				},
				confirmationPaiements:"Engagement à payer les frais de membre de 20 dollars à chaque année\n",




			},
			errorMessage:" Une erreur est survenue lors de l’enregistrement de votre demande. Veuillez réessayer plus tard.",
			successMessage:"Votre demande a été enregistrée avec succès ! Vous recevrez une confirmation sous peu."
		},
	},
	home:{
		header:"Regroupement des Haïtiens de \n" +
		"la Capitale-Nationale" ,
		infos1:"Un organisme à But Non Lucratif\n" +
		 "Fondé selon la Loi sur les compagnies du Québec",
		infos2: "Engagé dans le Soutien et l’Intégration des Communautés\n" +
			"Favoriser la Diversité, l'Unité et l'Ouverture au Québec\n" +
			"Un Réseau pour Tous, Fondé sur des Valeurs Communes",
		links1:"Faire un Don",
		links2:"Devenir partenaire",
		links3:"Devenir membre"
	},
	joinUs:{
		title: "Nous rejoindre",
		member:{
			title:"Devenir membre",
			description: "Maecenas vel lorem imperdiet, scelerisque ipsum quis, tincidunt arcu. Vestibulum ut eros ut sem tincidunt finibus. t augue iaculis vitae nullam a bibendum elit.",
			bottom:"Devenir membre",
		},
		partner:{
			title:"Devenir partenaire",
			description:"Maecenas vel lorem imperdiet, scelerisque ipsum quis, tincidunt arcu. Vestibulum ut eros ut sem tincidunt finibus. t augue iaculis vitae nullam a bibendum elit.",
			bottom:"Devenir partenaire",
		}
	},
	partnerIcon:{
		title:"Nos partenaires",
	},
	articles: {
		title:"Nos articles",
		readMore: "Lire la suite",
	},
	notFound: "Impossible de trouver la page demandée..."
};
