// noinspection JSUnusedGlobalSymbols

import type {timestamp, objectId, DB, price} from "./baseTypes"
import {NotificationLevel, NotificationStatus, NotificationType} from "./enums";

export interface IBouser {
	username: string
	password: string
	token?: string
	tokenDate?: timestamp
}
export interface IBouserDB extends IBouser, DB {}

export interface Picture {
	path: string
	mimetype?: string
	thumbnail?: string
}

export interface IUser {
	email: string
	password?: string
	firstname: string
	lastname: string
	picture?: Picture
	termsAccepted: boolean
	marketingAccepted: boolean
	token?: string
	tokenExpire?: timestamp
	resetToken?: string
	resetTokenExpire?: timestamp
}
export interface IUserDB extends IUser, DB {}

export interface INotificationItem {
	userId?: objectId
}

export interface INotification {
	text?: string,
	title?: string,
	link?: string
	type: NotificationType,
	items: INotificationItem,
	data: any,
	level: NotificationLevel,
	status: NotificationStatus,
	terminationTimestamp?: number
}
export interface INotificationDB extends INotification, DB {}

export interface IAddress {
	name: string,
	street: string,
	complement: string,
	city: string,
	zip: string,
	countryCode: string
	location: ILocation
}

export interface ILocation {
	lat: string,
	lng: string
}
