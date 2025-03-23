import axios from "axios";
import type {AnalyticsData, objectId, ObjectId, PaginationOption, SortField} from "@shared/types";

import {AnalyticsType, DBCollection, SortOrder} from "@shared/enums";
import {event, pageview} from "vue-gtag";

import {PaginatedList} from "@/front-types";
import {
    IArticleDB,
    IBouserDB,
    ICategorieDB,
    IEventDB,
    IFaqDB,
    IInvitationDB,
    IListImageDB,
    IMemberDB,
    IMembersPartnerDB, IPartnerIcon, IPartnerIconDB,
    IUserDB,
    IDonateUserDB
} from "@shared/crudTypes";
import {PaymentData} from "@shared/baseTypes";
export type UseApiResult = {

    // --- newsletter
    addUserToNewsletter: (email: string) => Promise<boolean>
    // --- user
    loadUserByToken: () => Promise<IUserDB>
    updateCurrentUser: (data: any) => Promise<IUserDB>
    currentUserAskPersonalData: () => Promise<void>
    deleteCurrentUser: () => Promise<boolean>

    //Bo
    BoAuth: (data: any) => Promise<IBouserDB>
    // site
    sendContactMessage: (data: any) => Promise<boolean>
    //UserBO
    CreateUser: (data: any) => Promise<IUserDB>
    DeleteUser: (userId: ObjectId) => Promise<IUserDB>
    GetAllUsers: () => Promise<IUserDB>
    GetUser: (email: string) => Promise<IUserDB>
    PutUser: (data: Partial<IUserDB>, userId: ObjectId) => Promise<IUserDB>
    login: (data: any) => Promise<IUserDB>
    logout: () => Promise<IUserDB>
    forgotPassword: (data: any) => Promise<IUserDB>
    resetPassword: (data: any) => Promise<IUserDB>

    //invitations
    createInvitation: (data: any) => Promise<IInvitationDB>
    listInvitations: () => Promise<IInvitationDB>
    deleteInvitation: (invitationId: objectId) => Promise<IInvitationDB>
    acceptInvitation: (data: any) => Promise<IInvitationDB>
    editInvitation: (data: Partial<IInvitationDB>, userId: ObjectId) => Promise<IInvitationDB>



    //FAQ

    createFaq: (data: any) => Promise<IFaqDB>
    getFaqs: () => Promise<IFaqDB>
    deleteFaq: (faqId: objectId) => Promise<IFaqDB>
    updateFaq: (data: any, faqId: ObjectId) => Promise<IFaqDB>

    //MEMBERS

    createMember: (data: any) => Promise<IMemberDB>
    getMembers: () => Promise<IMemberDB>
    deleteMember: (memberId: objectId) => Promise<IMemberDB>
    updateMember: (data: any, memberId: ObjectId) => Promise<IMemberDB>

    //EventS

    createEvent: (data: any) => Promise<IEventDB>
    getEvents: () => Promise<IEventDB>
    getEvent: (EventId: objectId) => Promise<IEventDB>
    deleteEvent: (EventId: objectId) => Promise<IEventDB>
    updateEvent: (data: any, EventId: ObjectId) => Promise<IEventDB>

    //ArticleS

    createArticle: (data: any) => Promise<IArticleDB>
    getArticles: () => Promise<IArticleDB>
    getArticle: (slug: string) => Promise<IArticleDB>
    GetCategoryArticles: () => Promise<IArticleDB>
    deleteArticle: (articleId: objectId) => Promise<IArticleDB>
    updateArticle: (data: any, articleId: ObjectId) => Promise<IArticleDB>

    //Category
    GetCategories: () => Promise<ICategorieDB>
    GetCategoriesByType: (type: string) => Promise<ICategorieDB>
    CreateCategory: (data: any) => Promise<ICategorieDB>
    DeleteCategories: (categoriesId: ObjectId) => Promise<ICategorieDB>
    UpdateCategories: (data: any, categoriesId: ObjectId) => Promise<ICategorieDB>

    //Image
    GetListImage: () => Promise<IListImageDB>
    GetListImagebyCategorie: () => Promise<IListImageDB>
    CreateListImage: (data: any) => Promise<IListImageDB>
    DeleteListImage: (listImageId: ObjectId) => Promise<IListImageDB>
    UpdateListImage: (data: any, listImageId: ObjectId) => Promise<IListImageDB>

    //IPartnerIcon
    GetPartnerIcon: () => Promise<IPartnerIconDB>
    CreatePartnerIcon: (data: any) => Promise<IPartnerIconDB>
    DeletePartnerIcon: (PartnerIconId: ObjectId) => Promise<IPartnerIconDB>
    UpdatePartnerIcon: (data: any, PartnerIconId: ObjectId) => Promise<IPartnerIconDB>

    // MembersPartners
    PostMembersPartners: (data: any) => Promise<IMembersPartnerDB>
    GetMembersPartners: () => Promise<IMembersPartnerDB>

    // MembersPartners
    PostBecomePartners: (data: any) => Promise<IMembersPartnerDB>
    GetBecomePartners: () => Promise<IMembersPartnerDB>

    // --- analytics
    sendAnalytics: (data: AnalyticsData) => Promise<void>

    // --- site
    registerToNewsletter: (email: string) => Promise<boolean>

    // --- legals

    // --- helpers
    buildStaticUrl: (url: string) => string

    // --- crud
    crudList: <T>(Collection: DBCollection, options?: {
        filters?: any,
        sort?: SortField[],
        pagination?: PaginationOption,
        projection?: string[],
        population?: string[]
    }) => Promise<T[] | PaginatedList<T>>

    // --- payments
    createPayments: (data: { amount: number; donorEmail?: string; contact?: object }) => Promise<PaymentData | null>
    getStripePublicKey: () => Promise<string>,
    SaveDonation: (data: any) => Promise<IDonateUserDB>
}

export function useApi(): UseApiResult {
    return {
        // --- newsletter
        addUserToNewsletter,
        // --- user
        loadUserByToken,
        updateCurrentUser,
        currentUserAskPersonalData,
        deleteCurrentUser,

        //Bo
        BoAuth,

        //site
        sendContactMessage,

        //User
        CreateUser,
        DeleteUser,
        GetAllUsers,
        GetUser,
        PutUser,
        login,
        logout,
        forgotPassword,
        resetPassword,

        //Invitation
        createInvitation,
        listInvitations,
        deleteInvitation,
        acceptInvitation,
        editInvitation,

        //Faq
        createFaq,
        getFaqs,
        deleteFaq,
        updateFaq,

        //Member
        createMember,
        getMembers,
        deleteMember,
        updateMember,

        //Articles
        createArticle,
        getArticles,
        getArticle,
        deleteArticle,
        updateArticle,
        GetCategoryArticles,

        //Category
        GetCategories,
        CreateCategory,
        DeleteCategories,
        UpdateCategories,
        GetCategoriesByType,

        //ListImage
        GetListImage,
        CreateListImage,
        DeleteListImage,
        UpdateListImage,
        GetListImagebyCategorie,

        //Event
        createEvent,
        getEvents,
        getEvent,
        deleteEvent,
        updateEvent,

        //PartnerIcon
        GetPartnerIcon,
        CreatePartnerIcon,
        DeletePartnerIcon,
        UpdatePartnerIcon,

        // MembersPartners
        PostMembersPartners,
        GetMembersPartners,

        // MembersPartners
        GetBecomePartners,
        PostBecomePartners,

        // --- analytics
        sendAnalytics,

        // --- site
        registerToNewsletter,

        // --- payments
        createPayments,
        getStripePublicKey,
        SaveDonation,
        // --- legals

        // --- helpers
        buildStaticUrl,

        // --- crud
        crudList,
    }
}
// -----------------------------------------------------------------------------------
// NEWSLETTER


async function addUserToNewsletter(email: string): Promise<boolean> {
    const result = await axios.post(buildUrl("/newsletter"), {email});
    return result.data.success;
}

// -----------------------------------------------------------------------------------
// USER

async function loadUserByToken(): Promise<IUserDB> {
    const response = await axios.get(buildUrl("/current-user"));
    if (response.data) {
        return response.data;
    } else {
        throw "not.found";
    }
}

async function updateCurrentUser(data: any): Promise<IUserDB> {
    try {
        const result = await axios.put(buildUrl("/current-user"), data);
        return result.data;
    } catch (err: any) {
        console.log("updateCurrentUser Error: ", err);
        throw err.response.data;
    }
}

async function currentUserAskPersonalData(): Promise<void> {
    await axios.post(buildUrl("/current-user/ask-data"));
}

async function deleteCurrentUser(): Promise<boolean> {
    const response = await axios.delete(buildUrl("/current-user"));
    if (response.data) {
        return !!response.data.success;
    } else {
        return false;
    }
}

// -----------------------------------------------------------------------------------
//Bo

async function BoAuth(data: Partial<IBouserDB>): Promise<IBouserDB> {
    const response = await axios.post(buildUrl("/bo/authenticate"), data);
    return response.data;
}


// -----------------------------------------------------------------------------------
//Site

async function sendContactMessage(data: any): Promise<boolean> {
    try {
        const result = await axios.post(buildUrl("/contact"), data);
        return result.data;
    } catch (err: any) {
        console.log("sendContactMessage Error: ", err);
        throw err.response.data;
    }
}

// -----------------------------------------------------------------------------------
//User

async function CreateUser(data: Partial<IUserDB>): Promise<IUserDB> {
    const response = await axios.post(buildUrl("/bo/register"), data);
    return response.data;
}

async function DeleteUser(userId: ObjectId): Promise<IUserDB> {
    const response = await axios.delete(buildUrl(`/bo/user/${userId}`));
    return response.data;
}

async function GetAllUsers(): Promise<IUserDB> {
    const response = await axios.get(buildUrl("/bo/users"));
    return response.data;
}

async function GetUser(email: string): Promise<IUserDB> {
    const response = await axios.get(buildUrl(`/bo/user/${email}`));
    return response.data;
}

async function PutUser(data: Partial<IUserDB>, userId: ObjectId): Promise<IUserDB> {
    console.log("data response ", data)
    const response = await axios.put(buildUrl(`/bo/user/${userId}`), data);
    console.log("data response ", response)
    return response.data;
}

async function login(data: Partial<IUserDB>): Promise<IUserDB> {
    const response = await axios.post(buildUrl("/bo/login"), data);
    return response.data;
}

async function logout(): Promise<IUserDB> {
    const response = await axios.post(buildUrl("/bo/logout"));
    return response.data;
}

async function forgotPassword(data: any): Promise<IUserDB> {
    const response = await axios.post(buildUrl("/bo/forgotPassword"), data);
    return response.data;
}

async function resetPassword(data: any): Promise<IUserDB> {
    const response = await axios.post(buildUrl("/bo/resetPassword"), data);
    return response.data;
}

// -----------------------------------------------------------------------------------
// Invitation 


async function createInvitation(data: Partial<IInvitationDB>): Promise<IInvitationDB> {
    const response = await axios.post(buildUrl("/bo/invitation"), data);
    return response.data;
}

async function listInvitations(): Promise<IInvitationDB> {
    const response = await axios.get(buildUrl("/bo/invitations"));
    return response.data;
}

async function deleteInvitation(invitationId: ObjectId): Promise<IInvitationDB> {
    const response = await axios.delete(buildUrl(`/bo/invitation/${invitationId}`));
    return response.data;
}

async function acceptInvitation(data: Partial<IInvitationDB>): Promise<IInvitationDB> {
    const response = await axios.post(buildUrl(`/bo/accept-invitation`), data);
    return response.data;
}

async function editInvitation(data: Partial<IInvitationDB>, invitationId: ObjectId): Promise<IInvitationDB> {
    console.log("data response ", data)
    const response = await axios.put(buildUrl(`/bo/invitation/${invitationId}`), data);
    console.log("data response ", response)
    return response.data;
}

// -----------------------------------------------------------------------------------
// Faq 
async function createFaq(data: Partial<IFaqDB>): Promise<IFaqDB> {
    const response = await axios.post(buildUrl("/bo/faq"), data);
    return response.data;
}

async function getFaqs(): Promise<IFaqDB> {
    const response = await axios.get(buildUrl("/bo/faqs"));
    return response.data;
}

async function deleteFaq(faqId: ObjectId): Promise<IFaqDB> {
    const response = await axios.delete(buildUrl(`/bo/faq/${faqId}`));
    return response.data;
}

async function updateFaq(data: any, faqId: ObjectId): Promise<IFaqDB> {
    const response = await axios.put(buildUrl(`/bo/faq/${faqId}`), data);
    return response.data;
}

// -----------------------------------------------------------------------------------
// Member 
async function createMember(data: Partial<IMemberDB>): Promise<IMemberDB> {
    const response = await axios.post(buildUrl("/bo/member"), data);
    return response.data;
}

async function getMembers(): Promise<IMemberDB> {
    const response = await axios.get(buildUrl("/bo/members"));
    return response.data;
}

async function deleteMember(memberId: ObjectId): Promise<IMemberDB> {
    const response = await axios.delete(buildUrl(`/bo/member/${memberId}`));
    return response.data;
}

async function updateMember(data: any, memberId: ObjectId): Promise<IMemberDB> {
    const response = await axios.put(buildUrl(`/bo/member/${memberId}`), data);
    return response.data;
}

// -----------------------------------------------------------------------------------
// Article 
async function createArticle(data: Partial<IArticleDB>): Promise<IArticleDB> {
    const response = await axios.post(buildUrl("/bo/article"), data);
    return response.data;
}

async function getArticles(): Promise<IArticleDB> {
    const response = await axios.get(buildUrl("/bo/articles"));
    return response.data;
}
async function GetCategoryArticles(): Promise<IArticleDB> {
    const response = await axios.get(buildUrl("/categoriesArticles"));
    return response.data;
}


async function getArticle(slug: string): Promise<IArticleDB> {
    const response = await axios.get(buildUrl(`/bo/article/${slug}`));
    return response.data;
}

async function deleteArticle(ArticleId: ObjectId): Promise<IArticleDB> {
    const response = await axios.delete(buildUrl(`/bo/article/${ArticleId}`));
    return response.data;
}

async function updateArticle(data: any, ArticleId: ObjectId): Promise<IArticleDB> {
    const response = await axios.put(buildUrl(`/bo/article/${ArticleId}`), data);
    return response.data;
}
// -----------------------------------------------------------------------------------
// Event
async function createEvent(data: Partial<IEventDB>): Promise<IEventDB> {
    const response = await axios.post(buildUrl("/bo/event"), data);
    return response.data;
}

async function getEvents(): Promise<IEventDB> {
    const response = await axios.get(buildUrl("/bo/events"));
    return response.data;
}

async function getEvent(EventId: ObjectId): Promise<IEventDB> {
    const response = await axios.get(buildUrl(`/bo/event/${EventId}`));
    return response.data;
}

async function deleteEvent(EventId: ObjectId): Promise<IEventDB> {
    const response = await axios.delete(buildUrl(`/bo/event/${EventId}`));
    return response.data;
}

async function updateEvent(data: any, EventId: ObjectId): Promise<IEventDB> {
    const response = await axios.put(buildUrl(`/bo/event/${EventId}`), data);
    return response.data;
}

// -----------------------------------------------------------------------------------
//Categories
async function GetCategories(): Promise<ICategorieDB> {
    const response = await axios.get(buildUrl("/bo/categories"));
    return response.data;
}

async function CreateCategory(data: any): Promise<ICategorieDB> {
    const response = await axios.post(buildUrl(`/bo/categories`), data);
    return response.data;
}
async function GetCategoriesByType(type: string): Promise<ICategorieDB> {
    const response = await axios.get(buildUrl(`/bo/categories/${type}`) );
    return response.data;
}

async function UpdateCategories(data: any, categoriesId: ObjectId): Promise<ICategorieDB> {
    const response = await axios.put(buildUrl(`/bo/categories/${categoriesId}`), data);
    return response.data;
}

async function DeleteCategories(categoriesId: ObjectId): Promise<ICategorieDB> {
    const response = await axios.delete(buildUrl(`/bo/categories/${categoriesId}`));
    return response.data;
}

// -----------------------------------------------------------------------------------
//ListImage
async function GetListImagebyCategorie(): Promise<IListImageDB> {
    const response = await axios.get(buildUrl("/bo/image"));
    return response.data;
}
async function GetListImage(): Promise<IListImageDB> {
    const response = await axios.get(buildUrl("/bo/images"));
    return response.data;
}

async function CreateListImage(data: any): Promise<IListImageDB> {
    const response = await axios.post(buildUrl(`/bo/image`), data);
    return response.data;
}

async function UpdateListImage(data: any, listImageId: ObjectId): Promise<IListImageDB> {
    const response = await axios.put(buildUrl(`/bo/image/${listImageId}`), data);
    return response.data;
}

async function DeleteListImage(listImageId: ObjectId): Promise<IListImageDB> {
    const response = await axios.delete(buildUrl(`/bo/image/${listImageId}`));
    return response.data;
}
// -----------------------------------------------------------------------------------
//IPartnerIcon

async function GetPartnerIcon(): Promise<IPartnerIconDB> {
    const response = await axios.get(buildUrl("/bo/PartnerIcon"));
    return response.data;
}

async function CreatePartnerIcon(data: IPartnerIcon): Promise<IPartnerIconDB> {
    const response = await axios.post(buildUrl("/bo/PartnerIcon"), data);
    return response.data;
}

async function UpdatePartnerIcon(data: any, PartnerIconId: ObjectId): Promise<IPartnerIconDB> {
    const response = await axios.put(buildUrl(`/bo/partnerIcon/${PartnerIconId}`), data);
    return response.data;
}

async function DeletePartnerIcon(PartnerIconId: ObjectId): Promise<IPartnerIconDB> {
    const response = await axios.delete(buildUrl(`/bo/PartnerIcon/${PartnerIconId}`));
    return response.data;
}

// -----------------------------------------------------------------------------------
// ANALYTICS

// -----------------------------------------------------------------------------------
//BecomeAPartner
async function GetBecomePartners(): Promise<IMembersPartnerDB> {
    const response = await axios.get(buildUrl("/partners"));
    return response.data;
}

async function PostBecomePartners(data: any): Promise<IMembersPartnerDB> {
    const response = await axios.post(buildUrl(`/partners`), data);
    return response.data;
}
// -----------------------------------------------------------------------------------
//MembersPartner
async function GetMembersPartners(): Promise<IMembersPartnerDB> {
    const response = await axios.get(buildUrl("/member-partners"));
    return response.data;
}

async function PostMembersPartners(data: any): Promise<IMembersPartnerDB> {
    const response = await axios.post(buildUrl(`/member-partners`), data);
    return response.data;
}

// -----------------------------------------------------------------------------------
//sendAnalytics
async function sendAnalytics(data: AnalyticsData): Promise<void> {
    try {
        if (import.meta.env.VITE_GTAG && import.meta.env.VITE_GTAG.trim().length > 0) {
            // use GTag
            if (data.type === AnalyticsType.page) {
                pageview({
                    page_path: data.action, page_title: data.data?.title, page_location: data.location
                });
            } else {
                event(data.action, data.data ? {
                    ...data.data,
                    screen_name: data.location
                } : {screen_name: data.location});
            }
        } else {
            await axios.post(buildUrl("/analytics"), data);
        }
    } catch (err) {
        console.log("ERROR Api (sendAnalytics): ", err);
    }
}

// -----------------------------------------------------------------------------------
// SITE

async function registerToNewsletter(email: string): Promise<boolean> {
    try {
        const result = await axios.post(buildUrl("/newsletter"), {email});
        return result.data;
    } catch (err: any) {
        console.log("registerToNewsletter Error: ", err);
        throw err.response.data;
    }
}
// -----------------------------------------------------------------------------------
// PAYMENTS
async function createPayments(data: { amount: number; donorEmail?: string; contact?: object }): Promise<PaymentData | null> {
    try {
        console.log("🔹 Envoi de la requête API `/create-payment-intent` avec :", data);
        const result = await axios.post(buildUrl("/create-payment-intent"), data);

        console.log("✅ Réponse API `createPayments`:", result.data);
        return result.data;
    } catch (error) {
        console.error("❌ Erreur API createPayments :", error);
        return null;
    }
}

export async function getStripePublicKey(): Promise<string>  {
    const result = await axios.get(buildUrl("/stripe-public-key"));
    return result.data;
}
async function SaveDonation(data: any): Promise<IDonateUserDB> {
    const response = await axios.post(buildUrl(`/api/save-donation`), data);
    return response.data;
}

// -----------------------------------------------------------------------------------
// LEGALS


// -----------------------------------------------------------------------------------
// HELPERS


function buildUrl(url: string, query?: any): string {
    let fullUrl = import.meta.env.VITE_API_URL + url;
    if (query) {
        let separator = "?";
        for (const key of Object.keys(query)) {
            fullUrl += separator + key + "=" + encodeURIComponent(query[key].toString());
            separator = "&";
        }
    }
    return fullUrl;
}

function buildStaticUrl(url: string): string {
    return import.meta.env.VITE_API_STATIC_URL + ((url && url.startsWith("/")) ? "" : "/") + url;
}


// -----------------------------------------------------------------------------------
// CRUD

async function crudList<T>(collection: DBCollection, options?: {
    filters?: any,
    sort?: SortField[],
    pagination?: PaginationOption,
    projection?: string[],
    population?: string[]
}): Promise<T[] | PaginatedList<T>> {
    console.log("crudlist options: ", options);
    let query = crudBuildQuery(options);
    const result = await axios.get(buildUrl(`/crud/${collection}`, query));
    return result.data;
}

function crudBuildQuery(options?: {
    filters?: any,
    sort?: SortField[],
    projection?: string[],
    population?: string[],
    pagination?: PaginationOption
}): any {
    let query: any = {};
    if (options) {
        if (options.filters) {
            query = options.filters;
        }
        if (options.population && options.population.length > 0) {
            query.__population = options.population.join(",");
        }
        if (options.projection && options.projection.length > 0) {
            query.__projection = options.projection.join(",");
        }
        if (options.sort && options.sort.length > 0) {
            query.__sort = options.sort.map(s => {
                let sortCode: string = "";
                switch (s.order) {
                    case SortOrder.desc:
                        sortCode = "-";
                        break;
                    case SortOrder.asc:
                        sortCode = "+";
                        break;
                    case SortOrder.random:
                        sortCode = "*";
                        break;
                    case SortOrder.none:
                        sortCode = "?";
                        break;
                }
                return sortCode + s.field;
            });
        }
        if (options.pagination) {
            query.__limit = options.pagination.limit;
            query.__offset = options.pagination.offset;
        }
    }

    return query;
}



// -----------------------------------------------------------------------------------
// DEFAULT VALUES
