// noinspection JSUnusedGlobalSymbols

import type {DataSet, ErrorSet, IError, timestamp} from "@shared/types";
import type {unitOfTime} from "moment-timezone";
import moment from "moment-timezone";
import PasswordValidator from "password-validator";
import type {PasswordValidatorObject} from "@/components/forms/form-types";
import type {AuthRegisterData} from "@/composition/snark-auth";
import {validate as validateEmail} from "email-validator";
import {IContact} from "@shared/crudTypes";

type CurrentErrors = {hasError: boolean, errors: DataSet<IError|IError[]>};

export type Validator = (data: any) => Promise<ErrorSet>;

export const passwordValidator = <PasswordValidatorObject>new PasswordValidator().is().min(8).has().uppercase().has().lowercase().has().digits();

export type UseValidatorsResult = {
    validateRegisterData: Validator
    validateLoginData: Validator
    validateForgotPasswordData: Validator
    validateResetPasswordData: Validator
    validateChangePasswordData: Validator
    validateContactData: Validator
    validateClinicalTrial: Validator
    validateDepartment: Validator
    validatePromoter: Validator
    validateInvestigator: Validator
    validateTeam: Validator

    notset: (data: any) => boolean
    isset: (data: any) => boolean
    isEmptyString: (data?: string|null) => boolean
    isValidDate: (data?: any) => boolean
    isValidEmail: (data?: string|null) => boolean
    isDateOlderThan: (date: timestamp, amount: number, unit: unitOfTime.DurationConstructor) => boolean

    initErrors: () => CurrentErrors
    addError: (errors: CurrentErrors, context: string|null, id: string, data?: any) => void
    errorResult: (errors: CurrentErrors) => ErrorSet
    serverErrorsToLocalErrors: (errors: IError[]) => ErrorSet
}

export function useValidators(): UseValidatorsResult {
    return {
        validateContactData,
        validateRegisterData,
        validateLoginData,
        validateForgotPasswordData,
        validateResetPasswordData,
        validateChangePasswordData,
        validateClinicalTrial,
        validateDepartment,
        validatePromoter,
        validateInvestigator,
        validateTeam,

        notset,
        isset,
        isEmptyString,
        isValidDate,
        isValidEmail,
        isDateOlderThan,

        initErrors,
        addError,
        errorResult,
        serverErrorsToLocalErrors
    };
}

// async function validateUserDescription(data: UserDescriptionEdition): Promise<DataSet<Error|Error[]>|null> {
//     console.log("validateUserDescriptionm: ", data);
//     let errors = initErrors();
//
//     if(isEmptyString(data.username)) {
//         addError(errors, "username", "empty");
//     }
//     if(notset(data.gender)) {
//         addError(errors, "gender", "empty");
//     }
//     if(notset(data.lookingFor)) {
//         addError(errors, "lookingFor", "empty");
//     }
//     if(!isValidDate(data.birthdate)) {
//         addError(errors, "birthdate", "invalid");
//     }
//     else if(!isDateOlderThan(data.birthdate!, 18, "year")) {
//         addError(errors, "birthdate", "not18");
//     }
//
//     if(isset(data.pictures) && (data.pictures!.length === 0)) {
//         addError(errors, "pictures", "empty");
//     }
//
//     return errorResult(errors);
// }
async function validateClinicalTrial(data: any): Promise<ErrorSet | null> {
    let errors = initErrors();
    if (isEmptyString(data.name)) addError(errors, "name", "empty");
    if (isEmptyString(data.userName)) addError(errors, "userName", "empty");
    if (isEmptyString(data.TypeOfSearch)) addError(errors, "TypeOfSearch", "empty");
    if (isEmptyString(data.category)) addError(errors, "category", "empty");
    if (isEmptyString(data.EudraCT_IDRCB)) addError(errors, "EudraCT_IDRCB", "empty");
    if (isEmptyString(data.description)) addError(errors, "description", "empty");
    return errorResult(errors);
}

async function validateDepartment(data: any): Promise<ErrorSet | null> {
    let errors = initErrors();
    if (isEmptyString(data.name)) addError(errors, "name", "empty");
    if (isEmptyString(data.Pathology)) addError(errors, "Pathology", "empty");
    if (!isNumber(data.NumberOfPatients)) addError(errors, "NumberOfPatients", "empty");
    if (isEmptyString(data.medicaments)) addError(errors, "medicaments", "empty");
    return errorResult(errors);
}
async function validateInvestigator(data: any): Promise<ErrorSet | null> {
    let errors = initErrors();
    if (isEmptyString(data.NameOfStucture)) addError(errors, "NameOfStucture", "empty");
    return errorResult(errors);
}
async function validatePromoter(data: any): Promise<ErrorSet | null> {
    let errors = initErrors();
    if (isEmptyString(data.NameOfStucture)) addError(errors, "NameOfStucture", "empty");
    return errorResult(errors);
}
async function validateTeam(data: any[]): Promise<ErrorSet | null> {
    let errors = initErrors();

    if (!Array.isArray(data)) {
        addError(errors, "data", "not_array");
        return errorResult(errors);
    }

    data.forEach((item, index) => {
        if (isEmptyString(item.firstName)) addError(errors, `${index}.firstName`, "empty");
        if (isEmptyString(item.lastName)) addError(errors, `${index}.lastName`, "empty");
        if (isEmptyString(item.title)) addError(errors, `${index}.title`, "empty");
        if (isEmptyString(item.role)) addError(errors, `${index}.role`, "empty")
        else if (!isValidEmail(item.email)) {
            addError(errors, "email", "badFormat");
        }

    });

    return errorResult(errors);
}
async function validateContactData(data: IContact): Promise<ErrorSet> {
    let errors = initErrors();

    if (isEmptyString(data.firstname)) {
        addError(errors, "name", "empty");
    }
    if (isEmptyString(data.lastname)) {
        addError(errors, "name", "empty");
    }

    else if (!isValidEmail(data.email)) {
        addError(errors, "email", "badFormat");
    }
    if (isEmptyString(data.message)) {
        addError(errors, "message", "empty");
    }

    return errorResult(errors);
}

async function validateRegisterData(data: AuthRegisterData): Promise<ErrorSet> {
    let errors = initErrors();

    if(isEmptyString(data.lastname)) {
        addError(errors, "lastname", "empty");
    }
    if(isEmptyString(data.firstname)) {
        addError(errors, "firstname", "empty");
    }
  
    if(isEmptyString(data.password)) {
        addError(errors, "password", "empty");
    }


    return errorResult(errors);
}

async function validateLoginData(data: AuthRegisterData): Promise<ErrorSet> {
    let errors = initErrors();

    if(isEmptyString(data.username)) {
        addError(errors, "username", "empty");
    }
    if(isEmptyString(data.password)) {
        addError(errors, "password", "empty");
    }

    return errorResult(errors);
}

// noinspection JSUnusedLocalSymbols
async function validateForgotPasswordData(data: {username: string}): Promise<ErrorSet> {
    let errors = initErrors();

    if (isEmptyString(data.username)) {
        addError(errors, "username", "empty");
    }
    else if (!validateEmail(data.username)) {
        addError(errors, "username", "badFormat");
    }

    return errorResult(errors);
}

async function validateResetPasswordData(data: any): Promise<ErrorSet> {
    let errors = initErrors();

    if(isEmptyString(data.password)) {
        addError(errors, "password", "empty");
    }

    if(data.password !== data.confirmPassword) {
        addError(errors, "confirmPassword", "diff");
    }

    return errorResult(errors);
}
async function validateChangePasswordData(data: any): Promise<ErrorSet> {
    let errors = initErrors();

    if(isEmptyString(data.password)) {
        addError(errors, "password", "empty");
    }
    if(isEmptyString(data.newPassword)) {
        addError(errors, "newPassword", "empty");
    }

    if(data.newPassword !== data.confirmPassword) {
        addError(errors, "confirmPassword", "diff");
    }

    return errorResult(errors);
}
// ------------------------------------------------------------
function notset(data: any): boolean {
    return (data === null) || (data === undefined);
}

function isset(data: any): boolean {
    return (data !== null) && (data !== undefined);
}

function isEmptyString(data?: string|null): boolean {
    return notset(data) || (typeof data !== "string") || (data.trim().length === 0);
}
function isNumber(value: any): value is number {
    return !isNaN(Number(value));
}

function isValidDate(data: any): boolean {
    if(isset(data)) {
        const m = moment(data);
        return m.isValid();
    }
    else {
        return false;
    }
}

function isValidEmail(data?: string|null): boolean {
    if(notset(data) || typeof data !== "string") {
        return false;
    }
    else {
        return validateEmail(data);
    }
}

function isDateOlderThan(date: timestamp, amount: number, unit: unitOfTime.DurationConstructor): boolean {
    const limit = moment().subtract(amount, unit);
    console.log("COMPARE: ", moment(date), limit);
    return moment(date).isBefore(limit);
}

// ------------------------------------------------------------

function initErrors(): CurrentErrors {
    return {
        hasError: false,
        errors: {}
    };
}

function addError(errors: CurrentErrors, context: string|null, id: string, data?: any) {
    if(errors.errors[context? context:"_global"] === undefined) {
        errors.errors[context ? context : "_global"] = {id, data};
    }
    else {
        if(!Array.isArray(errors.errors[context? context:"_global"])) {
            errors.errors[context? context:"_global"] = <IError[]>[errors.errors[context? context:"_global"]];
        }
        (<IError[]>errors.errors[context? context:"_global"]).push({id, data});
    }
    errors.hasError = true;
}

function errorResult(errors: CurrentErrors): ErrorSet {
    if(errors.hasError) {
        return errors.errors;
    }
    else {
        return null;
    }
}

function serverErrorsToLocalErrors(errors: IError[]): DataSet<IError|IError[]>|null {
    const err = initErrors();
    if(errors) {
        for (const error of errors) {
            addError(err, error.context ? error.context : null, error.id ? error.id : "unknown", error.data);
        }
    }
    return errorResult(err);
}