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


export interface IUser {
	email: string
	password: string
	firstname: string
	role: string
	lastname: string
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
