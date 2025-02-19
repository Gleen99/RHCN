import type {objectId, timestamp} from "./baseTypes";
import { IUserDB } from "./crudTypes";
import {NotificationType, SortOrder} from "./enums";

export * from "./baseTypes";
export * from "./baseTypes";

// ----------------------------------------------------------------------------
// Notifications

export type NotificationSender = {
    userId?: objectId
}

export interface IRawNotification {
    sender: NotificationSender
    type: NotificationType
    data: any
    timestamp: timestamp,
    noSenderNotification?: boolean
}

export interface IPerson {
    firstname: string
    lastname: string
}

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

export type SortField = {
    field: string
    order?: SortOrder
}

export type PaginationOption = {
    offset?: number
    limit?: number
}

export interface GetAllUsersResponse {
    success: boolean;
    users: IUserDB[];
  }
  