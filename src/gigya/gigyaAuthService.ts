// @ts-nocheck - may need to be at the start of file
import gigyaWebSDK from "./gigyaWebSDK";
import {SocialPayload} from "../machines/authMachine";
import {Account} from "./models";

// @ts-ignore

declare type AnyRequest = { [key: string]: any } | undefined;

export async function performSignup(args: any) {
    return new Promise((resolve, reject) => {
        initRegistration().then(regToken =>
            gigyaWebSDK().accounts.register({
                email: args.email,
                password: args.password,
                finalizeRegistration: true,
                regToken: regToken,
                callback: (response) => {
                    if (response.errorCode === 0) {
                        resolve(response);

                    } else {
                        reject(
                            `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                        );
                    }
                },
            }))

    });
}
export async function performSignupWithSS(args: any) {
    return new Promise((resolve, reject) => {

        gigyaWebSDK().accounts.showScreenSet(
            {
                ...args,
                screenSet: "Default-RegistrationLogin",
                startScreen: 'gigya-register-screen',
                onLogin: (r) => {
                    resolve(r)
                },
                callback: (response) => {
                    if (response.errorCode === 0) {
                        resolve(response);

                    }
                    if (response.errorCode !== 0) {
                        reject(
                            `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                        );
                    }
                },
            })

    });
}

export async function showLoginScreenSet(args: any):Promise<Account> {
    return new Promise((resolve, reject) => {

        const onLogin =(r) => {
            resolve(r)
        }
        gigyaWebSDK().accounts.showScreenSet(
            {
                screenSet: "Default-RegistrationLogin",
                startScreen: 'gigya-login-screen',
                ...args, 
                onLogin:onLogin,
                callback: (response) => {
                    if (response.errorCode === 0) {
                        resolve(response);

                    }
                    if (response.errorCode !== 0) {
                        reject(
                            `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                        );
                    }
                },
            });
        // gigyaWebSDK().accounts.addEventHandlers({
        //     onLogin: onLogin,
        // });

    });
}

export async function initRegistration(args: any) {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().accounts.initRegistration({
            callback: (response) => {
                if (response.errorCode === 0) {
                    resolve(response.regToken);

                } else {
                    reject(
                        `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                    );
                }
            },
        });


    });
}

export async function performSignin(args) {
    return new Promise((resolve, reject) => {
        const params = {
            loginID: args.email,
            password: args.password,
            ...args
        };
        gigyaWebSDK().accounts.login(params, {
            callback: (response) => {
                if (response.errorCode === 0) {
                    resolve(response);
                } else {
                    reject(
                        `Error during login: ${response.errorMessage}, ${response.errorDetails}`
                    );
                }
            }


        });

    });

}

export function getJwt(args) {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().accounts.getJWT({
            ...(args || {}),
            fields: 'phone_number,isRegistered,authMethods,email,provider',
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res.id_token as string)
                } else {
                    reject(res)
                }

            }
        })
    });
}




export function getAccount(args ={}): Promise<Account> {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().accounts.getAccountInfo({
            ...(args || {}),
            include: "all",
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        })
    });
}


async function getAssets(appId) {

    return new Promise((resolve, reject) => {
        gigya.accounts.b2b.auth.getAssets({
            appId: appId,
            callback: function (response) {
                console.log(response);
                if (response.errorCode === 0) {
                    resolve(response.allowedAssets);

                }
                if (response.errorCode !== 0) {
                    reject(
                        `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                    );

                }
            }
        });
    });
    //get portal application assets


}

export async function getApps(appId) {
    try {


        const assets = await getAssets(appId || config.appId);
        return assets.filter(a => a.type === 'Portal Applications').map(e => {
            return {name: e.path, id: e.attributes?.app, ...(e.attributes || {})}
        })
    } catch (ex) {
        console.log(ex);
        return [{
            id: "ssd",
            icon: "img/assets/products/1.svg",
            name: "Portal Application",
            info: ex.message,
            role: "Explorer"
        }]
    }
}

function toApps(response) {
    return response.allowedAssets.filter(a=> a.type ==='Portal Applications').map(e=> {return {name:e.path, id: e.attributes?.app ,...(e.attributes || {})} });
}

export type LoginParams = {
    [key: string]: any
    loginMode?: string
}

export type SocialLoginParams = SocialPayload & LoginParams

export const socialLoginAsync = (args: SocialLoginParams) => {
    return new Promise((resolve, reject) => {
        const params = {
            ...(args || {}),
            include: "all",
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        };
        window.gigya.socialize.login({...params, enabledProviders: params.provider});
    });
}
export const socialLogin = (args: { provider: string, [key: string]: any }, callback: (res) => {}) => {
    const params = {
        ...(args || {}),
        include: "all",
        callback: callback
    }
    gigyaWebSDK().socialize.login({...params, enabledProviders: params.provider});
}
export const startFlow = (args: { provider: string, [key: string]: any }, callback: (res) => {}) => {
    const params = {
        ...(args || {}),
        include: "all",
        callback: callback
    }
    gigyaWebSDK().identityFlows.start({...params, enabledProviders: params.provider});
}


export const logout = (args: AnyRequest = {}) => {
    return new Promise((resolve, reject) => {
        const params = {
            ...(args || {}),
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        };
        gigyaWebSDK().socialize.logout({...params});
    });
}

