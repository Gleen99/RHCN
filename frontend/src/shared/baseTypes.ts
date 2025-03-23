import { IUserDB } from "./crudTypes";
import {AnalyticsType, DBState} from "./enums";

export type timestamp = number;
export type integer = number;
export type price = number;
export type soa = string | Array<string>;
export type DataSet<U> = { [key: string]: U };
export type ObjectId = string;
export type objectId = ObjectId;
export type istring = DataSet<string>

export interface DB {
    _id: ObjectId
    createdAt: timestamp
    updatedAt: timestamp
    state?: DBState
}

export interface IError {
    id: string,
    context?: string,
    data?: any
}
export interface PaymentData {
    clientSecret: string;
    publishableKey: string;
}
export type ErrorSet = DataSet<IError|IError[]>|null;

export interface AnalyticsData {
    type: AnalyticsType
    userId: string
    sessionId: string
    location: string
    action: string
    data?: any
}
export interface GetAllUsersResponse {
    success: boolean;
    users: IUserDB[];
}

export interface IMemberDB {
    _id: ObjectId;
    createdAt: timestamp;
    updatedAt: timestamp;
    picture: { path: string; mimetype: string; thumbnail: string; };
    firstname: string;
    lastname: string;
    fr: { titre: string; };
    en: { titre: string; };
}