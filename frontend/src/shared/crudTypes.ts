// noinspection JSUnusedGlobalSymbols

import type {timestamp, objectId, DB} from "./baseTypes"
import {
	ContactType,
	LegalType,
	NotificationType,
	NotificationLevel,
	NotificationStatus,
	InvitationStatus,
	confirmationPaiementsStatus
} from "./enums";
export interface Picture {
	path: string
	thumbnail?: string
	mimetype?: string
}
export interface IBouser {
	username: string
	password: string
	token?: string
	tokenDate?: timestamp
}
export interface IBouserDB extends IBouser, DB {}

export interface IContact {
	firstname: string
	lastname: string
	message: string
	email?: string
	type: ContactType
	data?: any
}
export interface IContactDB extends IContact, DB {}

export interface IUser {
	email: string
	password?: string
	firstname: string
	role: string
	lastname: string
	InvitationId?: objectId
	stripeId?: string
	customerStripeId?: string
	paymentConfigurationCompleted?: boolean
	token?: string
	tokenExpire?: timestamp
	resetToken?: string
	resetTokenExpire?: timestamp
	firstRecipeCreated?: boolean
}
export interface IUserDB extends IUser, DB {}

export interface IInvitation{
	firstname: string
	role: string
	lastname: string
	email: string
	invitationToken: string,
	invitationExpire: Date,
	status: InvitationStatus,
}
export interface IInvitationDB extends IInvitation, DB {}

export interface  IFaqContent {
    question: string;
    answer: string;
}
export interface  IFaq {
	en: IFaqContent;
	fr:IFaqContent;
}
export interface IFaqDB extends IFaq, DB {}

export interface IMemberTitle {
	titre: string;
}
export interface  IMember {
	picture: Picture
	firstname: string;
	lastname:string;
	en :IMemberTitle
	fr:IMemberTitle
}
export interface IMemberDB extends IMember, DB {}

export interface ArticleContent {
	blockName: string;
	text?: string;
	image?: Picture;
}
export interface ArticleInfos {
	title: string;
	slug: string;
	categories: string[];
	content: ArticleContent[];
}
export interface IArticle {
	en: ArticleInfos;
	fr: ArticleInfos;
	mainPicture?: Picture;
	date?: timestamp;
	author?: string;
}
export interface IArticleDB extends IArticle, DB {}
export interface ICategoryResponse {
	categories: {
		fr: string[];
		en: string[];
	}[];
}
export interface IEventContent {
	title: string;
	description: string;
	categories: string[];
}
export interface IEvent {
	en: IEventContent;
	fr:IEventContent;
	date: timestamp
	time: timestamp
	address: string;
	price: string;
	mainPicture?: Picture
}
export interface  IEventDB extends IEvent, DB {}

export interface ICategoryContent{
	category : string[];
}
export interface ICategorie{
	type: string | string[];
	en: ICategoryContent;
	fr:ICategoryContent;
}
export interface  ICategorieDB extends ICategorie, DB {}

export interface IListImageContent {
	categories: string
}
export interface IListImage{
	en: IListImageContent
	fr: IListImageContent
	date: timestamp
	mainPicture: Picture
	published: boolean
}
export interface IListImageDB extends IListImage, DB {}

export interface IContact {
	name: string
	message: string
	email?: string
	phone?: string
	type: ContactType
	data?: any
}
export interface IContactDB extends IContact, DB {}

export interface IDonateUser{
	amount: number,
	status: string,
	donor: IdonorContent
}
export interface IdonorContent {
	lastname:string,
	firstname:string,
	email:string,
	number: string,
	street:string,
	city:string,
	postalCode:string,
	country:string,
	domaine: string
}
export interface IDonateUserDB extends IDonateUser, DB {}

export interface LegalImage {
	path: string
	size?: number
	mimetype?: string
}
export interface LegalBlock {
	blockName: string
	text?: string
	image?: LegalImage
}
export interface ILegals {
	type: LegalType
	blocks: LegalBlock[]
}
export interface ILegalsDB extends ILegals, DB {}

export interface INotificationItem {
	userId?: objectId
}
export interface INotification {
	title?: string
	text?: string
	link?: string
	type: NotificationType
	items: INotificationItem
	data: any
	level: NotificationLevel
	status: NotificationStatus
	terminationTimestamp?: timestamp
}
export interface INotificationDB extends INotification, DB {}

export interface IMembersPartner {
	firstName: string,
	lastName: string,
	address: string,
	email: string,
	phone: string,
	birthday: string,
	age:number,
	message:string,
	confirmationPaiements: confirmationPaiementsStatus,
	lang: string,
}
export  interface  IMembersPartnerDB extends IMembersPartner , DB {}
export interface loader {
	name: string,
	content:  string,
	mimetype?: string
	uploaderName: string,
}

export interface IBecomePartner {
	email: string,
	name: string,
	reference: string,
	typeOfPartnership: string,
	apport: string,
	expentation: string,
	documentUploader:loader[]
	lang: string,
}
export interface IBecomePartnerDB extends IBecomePartner, DB {}

export interface IPartnerIcon {
	mainPicture?: Picture
}
export interface IPartnerIconDB extends IPartnerIcon, DB {}

export interface INewsletter {
	email: string;
	dateSubscribed: timestamp;
	preferences?: string[];
	isConfirmed: boolean;
	source?: string;
}
export interface INewsletterDB extends INewsletter, DB {}

