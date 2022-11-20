import {Machine, assign, InterpreterFrom, actions, ContextFrom, EventFrom} from "xstate";
import {User, IdToken} from "../models";

const {log} = actions;

export interface AuthMachineSchema {
    states: {
        history: {};
        unauthorized: {};
        login: {};
        logout: {};
        refreshing: {};
        authorized: {};
        reauth: {};
        error: {};
        token: {};
    };
}

export interface SocialPayload {
    provider: string,

    [key: string]: any
}
import { createModel } from "xstate/lib/model"
import {Account} from "../gigya/models";
export interface Token {
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
}
 

export const authModel = createModel(
    {
        user: undefined as User | undefined,
        token: undefined as Token | undefined,
        
        
    },
    {
        events: {
            LOGGED_IN: (user: User) => ({ user }),
            LOGGED_OUT: () => ({}),
            REPORT_ACCOUNT_PRESENT: (user: User) => ({ user }),
            REPORT_ACCOUNT_MISSING: () => ({}),
            LOGIN: ( containerID:string) => ({containerID })

        },
    }
)
export const authMachine = authModel.createMachine(
    {
        id: "authStateMachine",
        context: authModel.initialContext,
        initial: "checkingAccount",
        on: {
            LOGIN:{
                target: "login" 
            },
            LOGGED_IN: {
                target: "loggedIn",
                actions: [
                    authModel.assign({
                        user: (_, ev) => ev.type == "LOGGED_IN" && ev.user,
                    }),
                ],
            },
            LOGGED_OUT: {
                target: "loggedOut",
                actions: [
                    authModel.assign({
                        user: undefined,
                    }),
                ],
            },
        },
        states: {
            checkingAccount: {
                invoke: {
                    id: "authMachine-fetch",
                    src: "fetchAccount",
                },
                on: {
                    REPORT_ACCOUNT_PRESENT: {
                        target: "loggedIn",
                        actions: [
                            authModel.assign({
                                user: (_, ev) => ev.user,
                            }),
                        ],
                    },
                    REPORT_ACCOUNT_MISSING: {
                        target: "loggedOut",
                        actions: [
                            authModel.assign({
                                user: undefined,
                            }),
                        ],
                    },
                },
            },
            loggedIn: {},
            loggedOut: {
                
            },
            login:{
                invoke: {
                    id: "authMachine-login",
                    src: "showLogin",
                },

            }
        },
    }
)


export type AuthMachine = typeof authMachine;
export type AuthMachineContext = ContextFrom<AuthMachine>;
// export type AuthMachineContext =typeof authModel.initialContext;
export type AuthMachineEvents = EventFrom<AuthMachine>;

export type AuthService = InterpreterFrom<AuthMachine>;
