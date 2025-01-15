import router from '../router'
import {Routes} from "@/enums";
import type {PartialAuthOptions} from "@/composition/snark-auth";
import type {IUserDB} from "@shared/crudTypes";
import {useApi} from "@/composition/api";

export default <PartialAuthOptions>{
    router,
    api: {
        base: import.meta.env.VITE_API_URL
    },
    defaultPublic: false,
    homeRouteName: Routes.home,
    usernameField: "email",
    routes: {
        login: {
            // name: Routes.login
        }
    },
    loadUserByToken
};

function loadUserByToken(token: string): Promise<IUserDB> {
    const api = useApi();
    return api.loadUserByToken();
}