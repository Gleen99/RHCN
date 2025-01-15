import type {Component, ComputedRef} from "vue";
import {computed, reactive} from "vue";
import axios, {type InternalAxiosRequestConfig} from "axios";
import type {NavigationGuardNext, RouteLocationNormalized, Router} from "vue-router";
import {useRouter} from "vue-router";
import type {IUserDB} from "@shared/crudTypes";
import { buildUrl } from "./api";

const LOCALSTORAGE_TOKEN_KEY = "auth_token";
const LOCALSTORAGE_REFRESHTOKEN_KEY = "auth_refresh_token";
export const AUTH_CONFIGURATION_ERROR = "auth.configuration.error";

export const AUTH_ROUTE_DEFAULT_NAMES = {
    LOGIN: "auth-login",
    FORGOTTEN_PASSWORD: "auth-forgotten-password",
    RESET_PASSWORD: "auth-reset-password",
};

const defaultOptions: DefaultAuthOptions = {
    defaultPublic: false,
    useAxios: true,
    mobile: false,
    homeRouteName: "home",
    usernameField: "username",
    api: {
        base: "",
        loginRoute: '/auth/login',
        registerRoute: '/auth/register',
        resetPasswordRoute: '/auth/reset',
        forgotPasswordRoute: '/auth/forgot',
        updatePasswordRoute: '/auth/password'
    },
    routes: {
        cssClass: "",
        login: {
            path: "/login",
            component: "AuthLogin"
        },
        forgottenPassword: {
            path: "/forgotten-password",
            component: "AuthForgottenPassword"
        },
        resetPassword: {
            path: "/reset-password",
            component: "AuthResetPassword"
        }
    },
    labels: {
        login: {
            title: "Login",
            submit: "Connect",
            username: "Username",
            password: "Password",
            forgottenpasswordlink: "Forgotten password ?"
        },
        forgottenpassword: {
            title: "Forgotten password",
            submit: "send request",
            username: "Email",
            loginlink: "Go to login",
            response: "If we had your email in our user database, you'll receive an email in few minutes to reset your password."
        },
        resetpassword: {
            title: "Reset your password",
            submit: "Reset",
            password: "New password",
            confirmpassword: "Confirm the new password",
            response: "Your password has been changed. Go to login page to login with your new credentials.",
            loginlink: "Go to login",
            forgottenpasswordlink: "Retry"
        }
    },
    errors: {
        unknown: "Unable to log in. Please retry",
        login: {
            username: {
                empty: "The username couldn't be empty"
            },
            password: {
                empty: "The password couldn't be empty"
            }
        },
        forgottenpassword: {
            username: {
                empty: "Your email couldn't be empty"
            }
        },
        resetpassword: {
            password: {
                empty: "The password couldn't be empty"
            },
            confirmpassword: {
                empty: "The password confirmation couldn't be empty",
                different: "Your confirmation isn't equal to new password. Please retype in it."
            }
        },
        auth: {
            user: {
                notfound: "Bad authentication data"
            },
            password: {
                invalid: "Bad authentication data"
            },
            resettoken: {
                invalid: "Your password renewing request is too old. Please, send request again."
            }
        }
    }
};

let auth: Auth = reactive({
    initialized: false,
    initializing: false,
    loginVerified: false,
    token: localStorage.getItem(LOCALSTORAGE_TOKEN_KEY),
    refreshToken: localStorage.getItem(LOCALSTORAGE_REFRESHTOKEN_KEY),
    currentUser: null,
    routes: {
        login: AUTH_ROUTE_DEFAULT_NAMES.LOGIN,
        forgottenPassword: AUTH_ROUTE_DEFAULT_NAMES.FORGOTTEN_PASSWORD,
        resetPassword: AUTH_ROUTE_DEFAULT_NAMES.RESET_PASSWORD
    }
});
let options: AuthOptions;

export function useAuth(): UseAuthResult {
    return {
        isAuth: computed(() => (auth.token !== null)),
        loginVerified: computed(() => (auth.loginVerified)),
        token: computed(() => (auth.token)),
        refreshToken: computed(() => (auth.refreshToken)),
        homeRouteName: computed(() => (options.homeRouteName)),
        currentUser: computed(() => (auth.currentUser)),

        // getters
        getLabel,
        getErrorText,

        // commits
        setLoginVerified,
        setToken,
        setRefreshToken,
        setCurrentUser,

        // actions
        login,
        logout,
        updatePassword,
        forgotPassword,
        resetPassword,
        register,
        reloadCurrentUser,

        initAuth: initializeAuth
    };
}

export async function initializeAuth(authOptions: PartialAuthOptions): Promise<boolean> {
    if(auth.initialized) {
        console.log("[auth] already initialized.");
        return false;
    }
    if(auth.initializing) {
        console.log("[auth] already initializing.");
        return false;
    }

    options = <AuthOptions>mergeObjects(mergeObjects({}, defaultOptions), authOptions);
    console.log("[auth] initializing with options: ", options);

    // --- verify
    if((options.router === null) || (options.router === undefined)) {
        console.error("[auth] Unable to install Auth, missing router options.");
        return false;
    }

    // --- add routes and guards
    addRoutes();
    addRoutesGuard();

    // --- add axios interceptor
    if(options.useAxios) {
        axiosInterceptor();
    }

    // --- load current user if auth is set.
    const user = await loadCurrentUser();
    if(user === null) {
        setToken(null);
        setRefreshToken(null);
    }

    console.log("[auth] initialized.");
    return true;
}

function addRoutes() {
    const router = useRouter();

    const routeOptions = options.routes || {};

    if((<AuthRouteRef>routeOptions.login).name) {
        auth.routes.login = (<AuthRouteRef>routeOptions.login).name;
    }
    else {
        router.addRoute({
            path: (<AuthRouteData>routeOptions.login).path,
            name: auth.routes.login,
            component: (typeof (<AuthRouteData>routeOptions.login).component === "string") ? <Component>(() => import( /* @vite-ignore */ <string>(<AuthRouteData>routeOptions.login).component)) : <Component>(<AuthRouteData>routeOptions.login).component,
            meta: {
                cssClass: routeOptions.cssClass
            },
            beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
                if (auth.token !== null) {
                    next(from.fullPath);
                } else {
                    next();
                }
            }
        });
    }

    if((<AuthRouteRef>routeOptions.forgottenPassword).name) {
        auth.routes.forgottenPassword = (<AuthRouteRef>routeOptions.forgottenPassword).name;
    }
    else {
        router.addRoute({
            path: (<AuthRouteData>routeOptions.forgottenPassword).path,
            name: auth.routes.forgottenPassword,
            component: (typeof (<AuthRouteData>routeOptions.forgottenPassword).component === "string") ? <Component>(() => import( /* @vite-ignore */ <string>(<AuthRouteData>routeOptions.forgottenPassword).component)) : <Component>(<AuthRouteData>routeOptions.forgottenPassword).component,
            meta: {
                cssClass: routeOptions.cssClass
            }
        });
    }

    if((<AuthRouteRef>routeOptions.resetPassword).name) {
        auth.routes.resetPassword = (<AuthRouteRef>routeOptions.resetPassword).name;
    }
    else {
        router.addRoute({
            path: (<AuthRouteData>routeOptions.resetPassword).path + "/:resetToken",
            name: auth.routes.resetPassword,
            component: (typeof (<AuthRouteData>routeOptions.resetPassword).component === "string") ? <Component>(() => import( /* @vite-ignore */ <string>(<AuthRouteData>routeOptions.resetPassword).component)) : <Component>(<AuthRouteData>routeOptions.resetPassword).component,
            meta: {
                cssClass: routeOptions.cssClass
            }
        });
    }
}

function addRoutesGuard() {
    const router = useRouter();

    router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
        // console.log("Before route: ", to, auth);
        if ((auth.token !== null) || isAuthOpenRoute(to)) {
            next();
        } else {
            if (options.defaultPublic) {
                if (to.meta && to.meta.needAuthentication) {
                    // if (options.preLoginRoute) {
                    //     next({...options.preLoginRoute, query: {...options.preLoginRoute.query, redirect: to.path}});
                    // }
                    // else {
                    next({name: auth.routes.login, query: {redirect: to.path}});
                    // }
                } else {
                    next();
                }
            } else {
                if (to.meta && to.meta.noAuthentication) {
                    console.log("let go to ", to);
                    next();
                } else {
                    // if (options.preLoginRoute) {
                    //     next({...options.preLoginRoute, query: {...options.preLoginRoute.query, redirect: to.path}});
                    // } else {
                    console.log("cant go to ", to, " redirect to ", auth.routes.login);
                    next({name: auth.routes.login, query: {redirect: to.path}});
                    // }
                }
            }
        }
    });
}

function isAuthOpenRoute(to: RouteLocationNormalized) : boolean {
    if(to.name) {
        return [auth.routes.login, auth.routes.forgottenPassword, auth.routes.resetPassword].includes(to.name.toString());
    }
    else {
        return false;
    }
}

function axiosInterceptor() {
    axios.interceptors.response.use(
        function(response:any) {
            return response;
        },
        async function(err: any) {
            if (err.statusCode === 401 || err.statusCode === 403) {
                console.log("ERROR 401 OR 403");
                await logout();
            }
            return Promise.reject(err);
        }
    );

    axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        if(auth.token) {
            config.headers!.Authorization = 'Bearer ' + auth.token;
        }
        return config;
    });
}


// --- COMMITS
function setLoginVerified(verified: boolean) {
    auth.loginVerified = verified;
}
function setToken(newToken: string|null) {
    auth.token = newToken;
    if(newToken) {
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, newToken);
    }
    else {
        localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    }
}
function setRefreshToken(newToken: string|null) {
    auth.refreshToken = newToken;
    if(newToken) {
        localStorage.setItem(LOCALSTORAGE_REFRESHTOKEN_KEY, newToken);
    }
    else {
        localStorage.removeItem(LOCALSTORAGE_REFRESHTOKEN_KEY);
    }
}

function setCurrentUser(user: IUserDB|null) {
    auth.currentUser = user;
}

// --- GETTERS
function getErrorText(code: string) : string {
    const text = subProperty(options.errors, code.toLowerCase());
    if(text) {
        return text;
    }
    else {
        console.warn("[auth] Unknown error id: ", code.toLowerCase());
        return options.errors.unknown;
    }
}
function getLabel(code: string) : string {
    const text = subProperty(options.labels, code);
    if(text) {
        return text;
    }
    else {
        return code;
    }
}

// --- ACTIONS
async function login(data: AuthLoginData): Promise<void> {
    try {
        const loginData = {[options.usernameField]: data.username, password: data.password};
        const result: AuthLoginResult = await axios.post(options.api.base + options.api.loginRoute, loginData);
        setToken(result.data.token);
        setRefreshToken(result.data.refreshToken);
        setLoginVerified(true);
        await loadCurrentUser();
    }
    catch(err: any) {
        setLoginVerified(true);
        if(err.response && err.response.data) {
            return Promise.reject(err.response.data);
        }
        else {
            return Promise.reject(err);
        }
    }
}

async function logout(redirection?: string): Promise<void> {
    setToken(null);
    setRefreshToken(null);
    setLoginVerified(false);
    auth.currentUser = null;

    if(redirection) {
        document.location.replace(redirection);
    }
    else if(options.mobile) {
        document.location.reload();
    }
    else {
        document.location.replace("/");
    }
}

async function updatePassword(data: AuthUpdatePasswordData) {
    if(options.api.updatePasswordRoute) {
        try {
            await axios.put(options.api.base + options.api.updatePasswordRoute, data);
        }
        catch(err: any) {
            if(err.response && err.response.data) {
                return Promise.reject(err.response.data);
            }
            else {
                return Promise.reject(err);
            }
        }
    }
    else {
        return Promise.reject(AUTH_CONFIGURATION_ERROR);
    }
}

async function forgotPassword(data: AuthForgotPasswordData) {
    if(options.api.forgotPasswordRoute) {
        try {
            await axios.post(options.api.base + options.api.forgotPasswordRoute, {[options.usernameField]: data.username});
        }
        catch(err: any) {
            if(err.response && err.response.data) {
                return Promise.reject(err.response.data);
            }
            else {
                return Promise.reject(err);
            }
        }
    }
    else {
        return Promise.reject(AUTH_CONFIGURATION_ERROR);
    }
}

async function resetPassword(data: AuthResetPasswordData) {
    if(options.api.resetPasswordRoute) {
        try {
            await axios.post(options.api.base + options.api.resetPasswordRoute, data);
            return Promise.resolve();
        }
        catch(err: any) {
            if(err.response && err.response.data) {
                return Promise.reject(err.response.data);
            }
            else {
                return Promise.reject(err);
            }
        }
    }
    else {
        return Promise.reject(AUTH_CONFIGURATION_ERROR);
    }
}

async function register(data: AuthRegisterData): Promise<boolean> {
    try {
        console.log(data); 
        console.log(options.api.registerRoute); 
        // Vérifiez qu'il contient une route valide.
        
        const result: AuthRegisterResult = await axios.post(options.api.base + options.api.registerRoute, {
            data,
        });
        
        console.log("RESULT REGISTER = ", result.data);
        if(result.data.token) {
            setToken(result.data.token);
            setRefreshToken(result.data.refreshToken);
            setLoginVerified(true);
            await loadCurrentUser();
            return true;
        }
        else {
            return false;
        }
    }
    catch(err: any) {
        // commit("setLoginVerified", true);
         console.log("ERROR RESPONSE: ", err.response.data);
        if(err.response && err.response.data) {
            return Promise.reject(err.response.data);
        }
        else {
            return Promise.reject(err);
        }
    }
}

// --- HELPERS
function mergeObjects(obj1: any, obj2: any) {
    for(let p in obj2) {
        try {
            if(obj2[p].constructor == Object) {
                obj1[p] = mergeObjects(obj1[p], obj2[p]);
            }
            else {
                obj1[p] = obj2[p];
            }
        }
        catch(e) {
            obj1[p] = obj2[p];
        }
    }

    return obj1;
}

function subProperty(base: any, path: string) : string|null {
    if(path) {
        let parts = path.split(".");
        let obj = base;
        let index = 0;
        const n = parts.length;
        while(obj && (index < n)) {
            obj = obj[parts[index++]];
        }
        return obj;
    }

    return null;
}

async function loadCurrentUser(): Promise<IUserDB|null> {
    if(options.loadUserByToken && auth.token) {
        try {
            auth.currentUser = await options.loadUserByToken(auth.token);
        }
        catch(err) {
            auth.currentUser = null;
        }
    }
    return auth.currentUser;
}

async function reloadCurrentUser(): Promise<IUserDB|null> {
    return loadCurrentUser();
}

// ---- TYPES

export type UseAuthResult = {
    initAuth(options: PartialAuthOptions): Promise<boolean>

    isAuth: ComputedRef<boolean>
    loginVerified: ComputedRef<boolean>
    token: ComputedRef<string|null>
    refreshToken: ComputedRef<string|null>
    homeRouteName: ComputedRef<string>
    currentUser: ComputedRef<IUserDB|null>

    setLoginVerified: (verified: boolean) => void
    setToken: (newToken: string|null) => void
    setRefreshToken: (newToken: string|null) => void
    setCurrentUser: (user: IUserDB|null) => void

    getErrorText: (code: string) => string
    getLabel: (code: string) => string

    login: (data: AuthLoginData) => Promise<void>
    logout: (redirection?: string) => Promise<void>
    updatePassword: (data: AuthUpdatePasswordData) => Promise<void>
    forgotPassword: (data: AuthForgotPasswordData) => Promise<void>
    resetPassword: (data: AuthResetPasswordData) => Promise<void>
    register: (data: AuthRegisterData) => Promise<boolean>
    reloadCurrentUser: () => Promise<IUserDB|null>
}

export interface Auth {
    initialized: boolean
    initializing: boolean
    loginVerified: boolean
    token: string|null
    refreshToken: string|null

    currentUser: IUserDB|null

    routes: {
        login: string
        forgottenPassword: string
        resetPassword: string
    }
}

export interface AuthOptions extends DefaultAuthOptions {
    router: Router
}

export interface DefaultAuthOptions {
    defaultPublic: boolean,
    useAxios: boolean,
    mobile?: boolean,
    // preLoginRoute?: Location,
    homeRouteName: string,
    api: AuthApiOptions,
    routes: AuthRouteOptions,
    labels: AuthLabelOptions,
    errors: AuthErrorOptions
    usernameField: string
    loadUserByToken?: (token: string) => Promise<any>
}

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type PartialAuthOptions = DeepPartial<AuthOptions>

export type AuthApiOptions = {
    base: string,
    loginRoute: string,
    registerRoute?: string,
    resetPasswordRoute?: string,
    forgotPasswordRoute?: string,
    updatePasswordRoute?: string
};

export type AuthRouteDefinition = AuthRouteRef | AuthRouteData;
export type AuthRouteRef = {
    name: string
}
export type AuthRouteData = {
    path: string,
    component: Component|string
}

export type AuthRouteOptions = {
    cssClass: string
    login: AuthRouteDefinition
    forgottenPassword: AuthRouteDefinition
    resetPassword: AuthRouteDefinition
};

export type AuthLabelOptions = {
    login: {
        title: string,
        submit: string,
        username: string,
        password: string,
        forgottenpasswordlink: string
    },
    forgottenpassword: {
        title: string,
        submit: string,
        username: string,
        loginlink: string,
        response: string
    },
    resetpassword: {
        title: string,
        submit: string,
        password: string,
        confirmpassword: string,
        response: string,
        loginlink: string,
        forgottenpasswordlink: string
    }
};

export type AuthErrorOptions = {
    unknown: string
    login: {
        username: {
            empty: string
        }
        password: {
            empty: string
        }
    },
    forgottenpassword: {
        username: {
            empty: string
        }
    },
    resetpassword: {
        password: {
            empty: string
        }
        confirmpassword: {
            empty: string,
            different: string
        }
    },
    auth: {
        user: {
            notfound: string
        },
        password: {
            invalid: string
        },
        resettoken: {
            invalid: string
        }
    }
};

// --- Login
export type AuthLoginResult = {
    data: {
        token: string
        refreshToken: string
    }
};
export type AuthLoginData = {
    username: string,
    password: string
};

// --- Update Password
export type AuthUpdatePasswordData = {
    username: string,
    password: string,
    newPassword: string
};

// --- Forgot Password
export type AuthForgotPasswordData = {
    username: string
};

// --- Reset Password
export type AuthResetPasswordData = {
    resetToken: string,
    password: string
};

// --- Register
export type AuthRegisterResult = {
    data: any
};
export type AuthRegisterData = {
    firstname: string,
    password: string
} & {[key: string]: any};
