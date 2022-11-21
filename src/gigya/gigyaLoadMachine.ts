
export interface GigyaStoreContext {
    apiKey: '--',
    domain: 'gigya.com'

}


type Idle = {
    value: 'idle';
    context: GigyaStoreContext & {
        loading: undefined;
        error: undefined;
    };
}

type Loading = {
    value: 'loading';
    context: GigyaStoreContext & {
        loading: true;
        error: undefined;
    };
}

type Loaded = {
    value: 'success';
    context: GigyaStoreContext & {
        loading: false;
        error: undefined;
        sdk: HTMLScriptElement
    };
}

type Failure = {
    value: 'failure';
    context: GigyaStoreContext & {
        loading: false;
        error: undefined;
        sdk: undefined;
    };
}
type GigyaStoreTypestate =
    Idle |
    Loading |
    Loaded |
    Failure;

// type GigyaStoreEvent = {
//   events: EventCreators<Prop<GigyaStoreContext, 'events'>> & LoadingEvents
// }

type LoadingEvents =
    { type: 'load'; apiKey: '--'; domain: 'gigya.com'; } |
    { type: 'onDone'; sdk: HTMLScriptElement } |
    { type: 'onError'; error: string };

function loadScript(domain: string, apiKey: string) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        // window.onGigyaServiceReady = () => {
        //   resolve(script);
        // }
        script.src = `https://cdns.${domain}/js/gigya.js?apikey=${apiKey}`;
        script.async = true;
        document.body.appendChild(script);
        resolve(script);

        return () => {
            document.body.removeChild(script);
        }
    })
}
 

// @ts-ignore
const gigyaStoreMachine = (initialContext:GigyaStoreContext )=> MachineConfig<GigyaStoreContext, GigyaStoreTypestate, LoadingEvents>({
    id: 'fetch',
    initial: 'idle',
    context: initialContext,
    // entry: [
    //   // assign((context) => {
    //   //   return {
    //   //     apiKey: context.apiKey,
    //   //     domain: context.domain,
    //   //   };
    //   // }),
    //
    // ],
    states:
        {
            idle: {
                on: {
                    load: {
                        target: "loading"
                    }
                }
            },

            loading: {
                invoke: {
                    src: (context, _) => loadScript(context.domain, context.apiKey),
                    // exit: (context, _) => assign({sdk: (context, event) => event.data}),
                    onDone: {
                        target: 'success',
                        actions: 'consoleLogData'
                        // actions: send({sdk: (context, event) => event.data.sdk})
                    },
                    onError: {
                        target: 'failure',
                        actions: 'consoleLogData'
                        // actions: assign({
                        //   error: (_, event) => {
                        //     return event.data;
                        //   }
                        // })
                    }
                },
                after: {
                    3000: 'failure.timeout'
                }
            },
            success: {
                // entry: assign({sdk: (_, event) => event.sdk})
            },
            failure: {
                // entry: assign({error: (_, event) => event.error}),

                on: {
                    RETRY: {target: 'loading'}
                }
            }
        },
    actions: {
        consoleLogData: (context, event) => {
            // Error on this line - data does not exist!
            console.log(context);
            console.log(event.data);
        },
        consoleLogError: (context, event) => {
            console.log(context);
            console.log(event.data);
        }
    }
    // services: {
    //   loadScript: (context, _) => loadScript(context.domain, context.apiKey)
    // }
});