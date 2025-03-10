import EmailingFront from "@/components/EmailingFront/EmailingFront.vue";
import AboutUs from "@/views/aboutUs.vue";
import Contact from "@/views/Contact.vue";

export const en = {
	global: {
		buttons: {
			donate: "Donate",
			joinUs: "Join Us",
			becomeMember: "Become a Member",
			becomePartner: "Become a Partner",
			send: "Send",
			addDocument: "Add a Document",
			iDonate: "I Donate",
			iRegister: "I Register",
			cancel: "Cancel",
			confirm: "Confirm",
			email: "Your Email",
			register: "I Register"
		}
	},
	form:{
		invalidPhoneNumber: "Invalid phone number",
	},
	modal:{
		modalDonate:{
			modalTitle:"Make a Donation",
			cancel:"Cancel",
			confirm:"Confirm",
			moreInfosSendDonate: {
				infos1: "You can also use an Interac transfer to the association's email: ",
			},
			paymentInfos:{
				amountofDonate: "Donation Amount",
				cardNumber: "Card Number",
				cardExpiry: "Expiration Date",
				cardCvc: "CVC",
				pay:"Donate",
				amount: "Enter an amount",
				processing: "Processing...",
				error: "An error occurred.",
				valid:"Validate your donation",
				paymentError: "Error: {error}",
				paymentSuccess: "Payment successful! Thank you!",
				unexpectedError: "An unexpected error occurred."
			}
		},
		modalEvent:{
			price: "Price:",
			link: "Registrations / Reservations",
		},
		modalSuccess:{
			successTitle:"We sincerely thank you for your donation.<br />\n" +
				"Your support is invaluable and helps fund our actions.",
			cancel:"Close"
		}
	},
	menu: {
		events: "Events",
		articles: "Articles",
		partners: "Partners",
		aboutUs: "About Us",
		contact: "Contact"
	},
	footer: {
		socialNetwork: {
			title: "Follow Us",
			instagram: "",
			facebook: "",
			twitter: "",
		},
		contact: "Contact Us",
		LegalMentions: "Legal Mentions",
		CGV: "Terms and Conditions",
		PrivacyPolic:"Privacy Policy",
	},
	contact:{
		title: "Contact Us",
		messagePart1: "The personal data provided (identity, email, request content) is intended for RHCN and will only be used to respond to your request.",
		messagePart2:"To learn more about how RHCN uses your personal data, to exercise your rights of access, rectification, and deletion, and to know your other rights, please consult the Privacy Policy.",
		submit: "Send",
		errors:{
			globalErrorMessage: "Please correctly fill in all required fields.",
			ErrorsValueEmail: "The email address is not valid.",
			NotificationMessageError : "Failed to send the email",
		},
		messages: {
			NotificationMessageConfirmation: "Your message has been successfully sent!"
		},

	},
	donate:{
		title:"Make a Donation",
		text1:"By donating to the organization, you are directly helping a whole community overcome specific challenges related to language, systemic racism, or integration difficulties.",
		text2:"You give to ensure equal opportunities, equal access to resources, education, and economic opportunities for all;",
		text3: "You give with the goal of strengthening a solidarity network and enabling a lasting impact within society;",
		text4:"Finally, you give to bring a smile to someone's face!",
		text5:"And that's all that matters.",
		submit: "I Donate"
	},
	aboutUs:{
		title: "About Us",
		text1: "The Network of Haitians of the Capitale-Nationale is an apolitical and non-profit organization headquartered in Quebec, Canada. It is founded in accordance with the Companies Act (RLRQ, chapter C-38).",
		text2: "This law, which applies to non-profit organizations (NPOs), governs the creation of legal entities or associations without share capital, established or continued by letters patent.",
		textBottom: "We are proud to present a young, diverse, and open association for all types of communities!",
		infos:{
			title1: "Our Objectives",
			text1:"Defend the rights and interests of Afro-descendant people, Facilitate the integration of newcomers into Quebec society, Promote Haitian culture, Fight poverty and isolation among cultural minorities, Promote mental health and well-being, Strengthen intercultural skills and contribute to education",
			title2: "Our Vision",
			text2:"Unite Haitians in Quebec to build a dynamic and supportive community where everyone can fully flourish while preserving and valuing their cultural roots.",
			title3: "Our Objectives",
			text3:"Defend the rights and interests of Afro-descendant people, Facilitate the integration of newcomers into Quebec society, Promote Haitian culture, Fight poverty and isolation among cultural minorities, Promote mental health and well-being, Strengthen intercultural skills and contribute to education",
		}
	},
	emailingFront: {
		title: "Subscription to Our Mailing List",
		text: "Join our mailing list by adding your email address here to be the first informed about our opportunities and events! We won’t spam you with messages. Promise!",
		submit: "I Register",
		thankyou: "Thank You!",

	},
	user: {
		fields: {
			firstName: {
				label: "First Name",
				placeholder: "First Name"
			},
			lastName: {
				label: "Last Name",
				placeholder: "Last Name",
			},
			email: {
				label: "Email",
				placeholder: "Email",
			},
			number: {
				label: "Phone",
				placeholder: "Phone",
			},
			message:{
				label: "Your Message",
				placeholder: "Your Message",
			},
			password: {
				label: "Password"
			},
			newPassword: {
				label: "New Password"
			},
			username: {
				label: "Username"
			},
			description: {
				label: "Description"
			},
			tags: {
				label: "Tags"
			},
			spokenLanguages: {
				label: "Spoken Languages"
			},
			cguAccepted: {
				label: "By checking this box, I accept the",
				link: "Terms and Conditions"
			},
			legalAgeDeclaration: {
				label: "I declare that I am of legal age"
			},
			socialNetworks: "Your Social Networks",
			facebook: {
				label: "Facebook"
			},
			instagram: {
				label: "Instagram"
			},
			youtube: {
				label: "YouTube"
			},
			tiktok: {
				label: "TikTok"
			},
			website: {
				label: "Your Website"
			},
			addressName: {
				label: "Address Name"
			},
			address: {
				label: "Address"
			},
			zipCode: {
				label: "Postal Code"
			},
			city: {
				label: "City",
				placeholder:"Quebec"
			},
			street:{
				label: "Street",
				placeholder:"Street"
			},
			postalCode: {
				label: "Postal Code",
				placeholder:"XXX XXX"

			},
			country:{
				label: "Country",
				placeholder: "Country"
			},
			domain:{
				label: "Domain to Direct My Donation"
			},
		}
	},
};