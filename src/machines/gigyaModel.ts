import {loadFromConfig} from "../gigya/engine";
import * as config from "../gigya/config/site.json";
import {checkIfGigyaLoaded} from "../gigya/dynamic-apikey";
import { createModel } from "xstate/lib/model";
import { interpret } from "xstate";
import { Subject } from "rxjs";
import * as gigya from "../gigya/gigyaAuthService";
import {UserInfo} from "../gigya/models";
declare type GigyaConfig = object;

export declare type GigyaSdk = (typeof gigya & {
    loaded: true
} & typeof window.gigya) | { loaded: false };

declare global {

    interface Window {
        gigya: any,
        onGigyaServiceReady: any

    }


}
export const loginSubject = new Subject<{type: "LOGGED_IN", user:Partial<UserInfo>}>()  ;
export const loadedSubject=new Subject<{type: "LOADED", service: any}>()  ;

export function sdk(): GigyaSdk {
    let onLogin = (event:any)=>{
        loginSubject.next({type: "LOGGED_IN", user:{ ...(event.user?.userInfo || {}),  photo: event.user?.profile?.photoURL}})

    };

    window.gigya.socialize.addEventHandlers({
        onLogin: onLogin
    });
    return {
        ...window.gigya,
        ...gigya,
        loaded: true,
        $login: loginSubject
    }

}
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
 function onGigyaServiceReady() {
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
window.onGigyaServiceReady = onGigyaLoaded;

export function onGigyaLoaded() {

    gigyaService.send({type: "LOADED", service: sdk()})

}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize the site (and loads Gigya file)
    gigyaService.send({type: "LOAD", config});
});

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

export const loader= loadedSubject;