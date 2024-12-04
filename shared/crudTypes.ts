// noinspection JSUnusedGlobalSymbols

import type {timestamp, objectId, DB, price} from "./baseTypes"
import {ContactType, LegalType, NotificationType, NotificationLevel, NotificationStatus} from "./enums";

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
}
export interface IUserDB extends IUser, DB {}
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

export interface Person {
	firstname: string
	lastname: string
}

export interface Picture {
	path: string
	thumbnail?: string
	mimetype?: string
}

export interface IUser extends Person {
	email: string
	password?: string
	currentAccountId?: objectId
	picture?: Picture
	termsAccepted: boolean
	marketingAccepted: boolean
	token?: string
	tokenExpire?: timestamp
	resetToken?: string
	resetTokenExpire?: timestamp
}
export interface IUserDB extends IUser, DB {}

export interface NotificationItem {
	userId?: objectId
}
export interface INotification {
	text?: string
	title?: string
	link?: string
	type: NotificationType
	// items?: NotificationItem
	data: any
	level: NotificationLevel
	status: NotificationStatus
	terminationTimestamp?: timestamp
}
export interface INotificationDB extends INotification, DB {}
