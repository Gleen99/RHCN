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
			register: "I Register",
			returnHome: "Return Home",
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
			instagram: "https://www.instagram.com/rhcn1804?igsh=aXhjeGJxYnAzYmV",
			facebook: "https://www.instagram.com/rhcn1804?igsh=aXhjeGJxYnAzYmV",
			twitter: "https://www.linkedin.com/company/regroupement-des-ha%C3%AFtiens-de-la-capitale-nationale-rhcn/",
		},
		contact: "Contact Us",
		LegalMentions: "Legal Notice",
		CGV: "Terms and Conditions",
		privacyPolicy: {
			title: "Privacy Policy",
			content: "RHCN is committed to protecting all personal information collected in the context of its services to people contacting us. By communicating with us, you consent to having the obtained information recorded in our databases, enabling us to better assist you. Once communication with RHCN is initiated, information may be collected based on relevance and necessity.\n" +
				"All RHCN personnel agree to adhere to our confidentiality policy, specifically by ensuring the confidentiality of information obtained (whether verbally or in writing) and destroying information when it is no longer necessary or after a period of five (5) years has passed. In case of any confidentiality breach or incident, RHCN commits that the individual responsible for the privacy policy will contact affected persons to notify them.\n" +
				"All information collected by RHCN is retained for a maximum duration of five (5) years after the last interaction with the organization. This data will be anonymized and used solely for statistical purposes. If there is a need to use identifiable data, explicit consent will be requested from the persons involved. If you wish for your information to be destroyed, rectified, or modified, please contact the person responsible for your file or the individuals responsible for data privacy.\n" +
				"Our website may contain certain links to other websites or internet resources, including but not limited to those of our sponsors, partners, or collaborators. When you click on one of these links, you are interacting with another website or internet resource that may collect information about you voluntarily or through cookies or other technologies. We are not responsible for the privacy practices or content of any third-party-owned websites.\n" +
				"Since these other sites may collect and process information differently, we encourage you to carefully review and read the privacy policy of each site you visit.\n" +
				"By using our website, you consent to the processing of data collected about you in the manner and for the purposes described above.\n" +
				"Consent for data collection and retention may be withdrawn at any time by directly contacting the association. Additionally, we use cookies to carry out frequency evaluations, specific page usage analyses, and marketing. Regarding the aforementioned evaluations, we use cookie-based data without associating it with your personal information, making the entire process completely anonymous.\n" +
				"You may configure your web browser to receive notifications when cookies are set, decide in each case whether you wish to accept the cookies, or refuse all cookies. However, if you refuse cookies, this may limit your ability to fully use our site. You may delete cookies already stored on your hard drive at any time. Details on how to do this can be found in the user guide of your internet browser software."
		},
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
	events: {
		cacheDetails: "Details",
		eventsInfos: {
			title: "Our Events",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			seeMore: "More info",
		},
		eventsContent: {
			title: "Filter events by:"
		},
		imagesContent: {
			title: "Filter images by:"
		},
		imagesInfos: {
			title: "Image Gallery",
			text: "Our gallery features photos taken during various meetings and events.",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
		},
		filters: {
			allCategories: "All categories",
			category: {
				label: "Category",
			},
			date: {
				label: "Date"
			},
			noResults: "There are no upcoming events"
		},
		latestEvents: {
			title: "Our events",
			viewMore: "View all events"
		}
	},
	partners: {
		cacheDetails: "Details",
		partnersInfos: {
			title: "Become a Partner",
			text: "Fill in the main information related to your request.",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			seeMore: "More info",
			Forms: {
				email: {
					placeholder: "Email",
					label: "Please enter your email",
				},
				name: {
					label: "What is the name of your association or organization?",
					placeholder: "Antoine"
				},
				reference: {
					label: "Are you the reference person?",
					placeholderYes: "Yes",
					placeholderNo: "No"
				},
				typeOfPartnership: {
					label: "What type of partnership do you need?",
					placeholderLTerm: "Long term",
					placeholderSTerm: "Short term"
				},
				apport: {
					label: "What contributions will you make?",
					placeholder: "Your text here"
				},
				expentation: {
					label: "What are your expectations?",
					placeholder: "Your text here"
				},
				documentUploader: {
					label: "Partnership request letter",
					placeholder: "Please add your document here"
				},
				BottomAdd: "Add document",
				confidentialityText1: "Personal data provided (identity, email, content of the request) are intended for RHCN and will only be used to respond to your request.",
				confidentialityText2: "To learn more about the use of your personal data by RHCN, to exercise your rights of access, rectification, deletion, or to know your other rights, please consult the Privacy Policy."
			},
			errorMessage: "An error occurred while registering your request. Please try again later.",
			successMessage: "Your request has been successfully registered! You will receive a confirmation shortly."
		},
		membersInfos: {
			title: "Become a Member",
			text: "Fill in the main information related to your request.",
			details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla qu\n",
			forms: {
				firstName: {
					label: "Last Name",
					placeholder: "Antoine",
				},
				lastName: {
					label: "First Name",
					placeholder: "Dupond",
				},
				address: {
					label: "Address",
					placeholder: "Please enter your address",
				},
				birthday: {
					label: "Date of birth",
				},
				age: {
					label: "Age",
					placeholder: "Please enter your age",
				},
				email: {
					label: "Email",
					placeholder: "Please enter your email",
				},
				phoneNumber: {
					label: "Phone number",
					placeholder: "Please enter your phone number",
				},
				message: {
					label: "Your message",
					placeholder: "Please add a message",
				},
				confirmationPaiements: "Commitment to pay annual membership fees of $20\n",
			},
			errorMessage: "An error occurred while registering your request. Please try again later.",
			successMessage: "Your request has been successfully registered! You will receive a confirmation shortly."
		},
	},
	home: {
		header: "Haitian Association of the\nCapitale-Nationale",
		infos1: "A Non-Profit Organization\nEstablished according to Quebec Companies Act",
		infos2: "Committed to Community Support and Integration\nPromoting Diversity, Unity, and Openness in Quebec\nA Network for All, Based on Common Values",
		links1: "Make a Donation",
		links2: "Become a Partner",
		links3: "Become a Member"
	},
	joinUs: {
		title: "Join us",
		member: {
			title: "Become a Member",
			description: "Maecenas vel lorem imperdiet, scelerisque ipsum quis, tincidunt arcu. Vestibulum ut eros ut sem tincidunt finibus. t augue iaculis vitae nullam a bibendum elit.",
			bottom: "Become a member",
		},
		partner: {
			title: "Become a Partner",
			description: "Maecenas vel lorem imperdiet, scelerisque ipsum quis, tincidunt arcu. Vestibulum ut eros ut sem tincidunt finibus. t augue iaculis vitae nullam a bibendum elit.",
			bottom: "Become a partner",
		}
	},
	partnerIcon: {
		title: "Our Partners",
	},
	articles: {
		title: "Our Articles",
		readMore: "Read more",
	},
	notFound: "The requested page could not be found..."
};