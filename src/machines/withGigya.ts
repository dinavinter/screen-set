import {
    getAccount,
    getJwt,
    logout,
    performSignin,
    performSignup, showLoginScreenSet,
    socialLoginAsync,
    SocialLoginParams
} from "../gigya/gigyaAuthService";
import {omit} from "lodash/fp";
import {AuthMachine, AuthMachineContext, AuthMachineEvents, authModel, Token} from "./authMachine";
import {GigyaSdk, gigyaSdk, sdk} from "../gigya/provider";
import {createMachine, interpret, actions} from "xstate";
import {createModel} from 'xstate/lib/model';

const {send} = actions;
import {initDemoSite, loadFromConfig} from "../gigya/engine";

function toMfa(tokenDetails: any) {
    return {
        ...{...tokenDetails.sub_id?.sub_id || {}},
        ...omit('sub_id', tokenDetails || {})
    }
}

import {User} from "../models";
import {checkIfGigyaLoaded} from "../gigya/dynamic-apikey";
import * as  config from "../gigya/config/site.json";

declare type GigyaConfig = object;
export const gigyaModel = createModel(
    {
        service: undefined as GigyaSdk | undefined,
        config: undefined as GigyaConfig | undefined
    },
    {
        events: {
            CHECK: (wait?: number) => ({wait}),
            LOAD: (config: GigyaConfig) => ({config}),
            LOADED: (service: GigyaSdk) => ({service})

        },

    }
)

const gigyaLoadingMachine = gigyaModel.createMachine({
    predictableActionArguments: true,
    context: {
        config: undefined,
        service: undefined
    },
    initial: 'idle',
    on: {
        '*':{
            target: 'loaded',
            cond: (ctx) => ctx.service
        }
    },
    states: {
        idle: {
            on: {
                LOAD: {
                    target: 'loading',
                    actions: [
                        'assignConfig'
                    ]
                }
            }
        },

        loading: {
            entry: ['onLoading'],
            after: {
                // after 1 second, transition checker-service
                500: {target: 'checking.check'}
            },

            on: {
                CHECK: {
                    target: 'checking'
                },
                LOADED: {
                    target: '#loaded',
                    actions: [
                        'assignService'
                    ]
                }
            }
        },
        checking: {
            initial: 'waiting',
            states: {
                waiting: {
                    after: {
                        // after 1 second, transition checker-service
                        2000: {target: 'check'}
                    }
                },
                check: {
                    invoke: {
                        id: "checker-service",
                        src: "checker"
                    },
                    on: {
                        CHECK: 'waiting',
                        LOADED: {
                            target: '#loaded',
                            actions: [
                                'assignService'
                            ]
                        },

                    }
                }
            }


        },
        loaded: {
            id: "loaded",
            type:"final",
            data:(ctx)=>{
                service: ctx.service
            }
        }
    }
}, {

    actions: {
        assignService: gigyaModel.assign({
            service: (_: any, event: { service: GigyaSdk }) => event.service // inferred
        }),
        assignConfig: gigyaModel.assign({
            config: (_: any, ev: { config: GigyaConfig }) => ev.config // inferred
        }),
        onLoading: (ctx, event) => {
            ctx.config && loadFromConfig(ctx.config);
        }
    },
    services: {
        loader: ({config: GigyaConfig}, event) => (send) => {
            loadFromConfig(config);
            send({type: "CHECK", wait: 500})

        },
        checker: ({config: GigyaConfig}, event) => (send) => {
            if (checkIfGigyaLoaded()) {
                send({type: "LOADED", service: sdk()})
            } else {
                send({type: "CHECK", wait: 500})

            }

        }
    }
});

const gigyaService = interpret(gigyaLoadingMachine).start();
import { Subject} from "rxjs";



    export function onGigyaServiceReady() {
    console.group('onGigyaServiceReady');
    // Check if the user was previously logged in
    if (typeof window.gigya === "undefined") {
        alert("Gigya is not loaded on this page :(");
    } else {

        gigyaService.send({type: "LOADED", service: sdk()})

        // Check if the library is properly loaded or not (stops the flow if it's bad loaded)
        checkIfGigyaLoaded();

        // Get Information about the user, and start the load of the page elements
        window.gigya.accounts.getAccountInfo({
            include: "profile, data, preferences",
            callback: console.log,
        });
    }

    console.groupEnd();
}

export function onGigyaLoaded() {
    window.onGigyaServiceReady = onGigyaLoaded;

    gigyaService.send({type: "LOADED", service: sdk()})
    /*
        // Check if the user was previously logged in
        if (typeof window.gigya === "undefined") {
            alert("Gigya is not loaded on this page :(");
        } else {
            // Check if the library is properly loaded or not (stops the flow if it's bad loaded)
            checkIfGigyaLoaded();
            gigyaService.send({type:"LOADED", service:sdk()} )
            
        }
        */

}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize the site (and loads Gigya file)
    gigyaService.send({type: "LOAD", config});
});
 const loadedSubject=new Subject<{type: "LOADED", service: any}>()  ;

export const loginSubject = new Subject<{type: "LOGGED_IN"}>()  ;
 
gigyaService.subscribe(state => {
    if (state.matches("idle"))
        console.groupCollapsed('gigya loader');
   
    console.log(state)

    if (state.matches("loaded")){
        console.log("loaded")
        console.log(state.context.service)

        loadedSubject.next({type: "LOADED" , service: state.context.service})
         console.groupEnd();

    }

})

const subscriber= (send: (event: {type: "LOADED" , service: any}) => void)=>{

    return{ 
        subscriptions: gigyaService.subscribe(state => {
                if (state.matches("loaded")) {
                    send({type: "LOADED", service: state.context.service})
                }
            }
        )
    }
    
}

export const withGigya = (authMachine: AuthMachine) => authMachine.withContext({
    ...authMachine.context,
    loader:loadedSubject
}).withConfig({
    services: {
        loader:  (context, event) => loadedSubject,
       
       
        showLogin: (ctx, event) => {
            const payload = omit("type", event);
            const context = omit("service", ctx);
            const show = async (payload: any) => {
                const user = await ctx.service.showLoginScreenSet(payload);
                return {user: {...(user?.userInfo || {}), photo: user?.profile?.photoURL}};
            }
            ctx.service && show({containerID: context.container, ...payload});             
            return ctx.service.$login;
        },
        fetchAccount: (ctx, event) => (send) => {
            const payload = omit("type", event);
            return getAccount(payload)
                .then(function (user) {
                    const account = {...(user?.profile || {}), photo: user?.profile?.photoURL};

                    send({type: "REPORT_ACCOUNT_PRESENT", user: account})
                })
                .catch(function (err) {
                    send("REPORT_ACCOUNT_MISSING")
                })
        },
    },
    actions:{
        assignService: authModel.assign({
            service: (_: any, ev: { type: "LOADED", service: any; }) => ev.service
        })
    }
});

function decodeJwt(token?: string) {

    return token && token.split && JSON.parse(atob(token.split('.')[1]));

}  