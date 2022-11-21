import React, {useEffect, useState} from "react";
import * as gigya from "./gigyaAuthService"

import {createContext, useContext} from 'react';
import {AuthContext} from "../auth/AuthProvider";
import * as config from "./config/site.json";
import {loadFromConfig} from "./engine";
import { Subject } from "rxjs";
import {UserInfo} from "./models";

export const GigyaContext = createContext<GigyaSdk>({loaded: false});

export function useGigya(): GigyaSdk {
    return useContext(GigyaContext);

}


declare global {

    interface Window {
        gigya: any,
        onGigyaServiceReady: any

    }


}

export declare type GigyaSdk = (typeof gigya & {
    loaded: true
} & typeof window.gigya) | { loaded: false };

function onGigyaService(cb: (gigya: GigyaSdk) => void) {
    window.onGigyaServiceReady = () => cb(sdk());


}
export const loginSubject = new Subject<{type: "LOGGED_IN", user:Partial<UserInfo>}>()  ;

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

export function gigyaSdk(): Promise<GigyaSdk> {

    return new Promise((resolve) => {
        if (window.gigya) resolve( sdk());
        else {
            window.onGigyaServiceReady = () => resolve(sdk());

        }



    });
}

export function GigyaProvider({children}: React.PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [gigya, setGigya] = useState<GigyaSdk>();

    const authService = useContext(AuthContext);
/*
    const onGigyaServiceReady = () => {
        setGigya(window.gigya);
        authService.send({type:"LOADED", service:sdk()});
        window.gigya.socialize.addEventHandlers({
            onLogin: onLogin,
            onLogout: onLogout
        });
    };
  
    useEffect(() => {
        window.onGigyaServiceReady = onGigyaServiceReady;
        loadFromConfig(config);
    });
*/


    const onLogin = (event: any) => {
        setIsLoggedIn(true);
        authService.send({type: "LOGGED_IN", user: {user:{ ...(event.user?.userInfo || {}),  photo: event.user?.profile?.photoURL}}})
    }
    const onLogout = () => {
        setIsLoggedIn(false)
    }


    return <GigyaContext.Provider value={gigya}>
        {children}
    </GigyaContext.Provider>


}

