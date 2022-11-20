import {User} from "../models";
import {actions, assign, InterpreterFrom, Machine} from "xstate";
import {SocialEvent, Token} from "./authMachine";
const {log} = actions;

export interface LoginMachineSchema {
    states: {
        signup: {};
        password: {};
        social: {};
        // token: {};
        authorized: {};
        error: {};
    };
}

export type LoginMachineEvents =
    | SocialEvent
    | { type: "SIGNUP" }
    | { type: "PASSWORD" };

export interface LoginMachineContext {
    user?: User;
    message?: string;
    token?: Token;

}

export const loginMachine = Machine<LoginMachineContext, LoginMachineSchema, LoginMachineEvents>({
        id: 'login',
        on: {
            PASSWORD: "password",
            SOCIAL: "social",
            SIGNUP: "signup"
        },
        states: {
            social: {
                entry: log('social'),
                invoke: {
                    src: "performSocialLogin",
                    onDone: {target: "authorized", actions: "onSuccess"},
                    onError: {target: "error", actions: ["onError", "logEventData"]},
                },
            },
            password: {
                invoke: {
                    src: "performLogin",
                    onDone: {target: "authorized", actions: "onSuccess"},
                    onError: {target: "error", actions: ["onError", "logEventData"]},
                }
            },
            signup: {
                entry: log('signup'),

                invoke: {
                    src: "performSignup",
                    onDone: {target: "authorized", actions: "onSuccess"},
                    onError: {target: "error", actions: ["onError", "logEventData"]},
                },
            },

            authorized: {
                entry: [log("authorized"), "onAuthorizedEntry"],
                type: "final",
                data: (ctx, _) => ctx
            },
            error: {
                entry: [log("authorized"), "onAuthorizedEntry"],
                type: "final",
                data: (ctx, _) => ctx
            }
        }
    }, {
        actions: {
            onSuccess: assign((ctx: any, event: any) => ({
                user: event.data.user,
                message: undefined,
            })),
            logEventData: {
                type: 'xstate.log',
                label: 'Finish label',
                expr: (context: any, event: any) => event.data
            },

            setToken: assign((ctx: any, event: any) => ({
                token: {
                    id_token: event.data.idToken,
                    access_token: event.data.access_token,
                    refresh_token: event.data.refresh_token,
                }
            })),

            onError: assign((ctx: any, event: any) => ({
                message: event.data.message,
            })),
        }
    }
);

export interface TokenMachineSchema {
    states: {
        not_authenticated: {};
        authenticated: {};
        getToken: {};
        enrichToken: {};
        revokeToken: {};
    };
}

export type TokenMachineEvents =
    | { type: "AUTHRESPONSE" }
    | { type: "REFRESH" }
    | { type: "REVOKE" };

export const tokenMachine= Machine<Token, TokenMachineSchema, TokenMachineEvents>({
    id: 'token',
    initial: "not_authenticated",
    states:{
        not_authenticated:{
            on:{
                "AUTHRESPONSE": '.enrichToken'
            }
        },

        authenticated:{
            on:{
                "AUTHRESPONSE": '.getToken'
            }
        },

        getToken:{
            invoke: {
                src: "getToken",
                onDone: [
                    { actions: "setToken"},
                    // {target: 'authorized', actions: "enrichToken", cond: context => context.token !== undefined}
                ],
                onError: {target: "error", actions: ["onError", "logEventData"]},
            },


        },
        enrichToken: {
            invoke: {
                src: "enrichToken",
                onDone: {target:'authenticated', actions: ["setToken", "sendTokenResponse"]},
                onError: {target: "error", actions: ["onError", "logEventData"]},
            }

        },
        revokeToken: {
            invoke: {
                src: "revokeToken",
                onDone: {target:'not_authenticated', actions: ["setToken", "sendTokenResponse"]},
                onError: {target: "error", actions: ["onError", "logEventData"]},
            }

        },


    }

})

export type LoginMachine = typeof loginMachine;
export type LoginService = InterpreterFrom<LoginMachine>;