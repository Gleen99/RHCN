import type { DB } from "../shared/baseTypes"

export interface IUser {
    username: string;
    password: string;
    isDefaultPassword: boolean;
  }
export interface IUserDB extends IUser, DB {}
  