export enum DBState {
	deleted = "deleted",
	draft = "draft"
}

export enum AnalyticsType {
	page = "page",
	action = "action"
}

export enum UserStatus {
	created = "created",
}

export enum ContactType {
	site = "site",
	getOwnData = "getOwnData",
	deleteAccount = "deleteAccount"
}

export enum NotificationMode {
	email = "email",
	push = "push",
}

export enum NotificationLevel {
	info = 'info',
}

export enum NotificationStatus {
	read = 'read',
}
export enum InvitationStatus {
    PENDING = "pending", 
    ACCEPTED = "accepted", 
    CANCELLED = "cancelled",
	DELETED = "deleted",
}


export enum NotificationType {
	userForgotPassword = "userForgotPassword",
	contactFromSite = "contactFromSite",
	personalDataRequest = "personalDataRequest"
}

export enum LegalType {
	termsAndConditions = "termsAndConditions",
	privacyPolicy = "privacyPolicy",
	legalTerms = "legalTerms",
	cookies = "cookies"
}
export enum confirmationPaiementsStatus {
	accepted = "accepted",
	rejected = "rejected",
}

export enum DBCollection {
	bouser = "bouser",
	contact = "contact",
	legals = "legals",
	notification = "notification",
	user = "user",
}

export enum SortOrder {
	asc = "asc",
	desc = "desc",
	random = "random",
	none = "none"
}
export enum NotificationType{
	firstRecipeCreated= "firstRecipeCreated"
}
