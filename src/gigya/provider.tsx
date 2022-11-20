
import React, {useEffect, useState} from "react";
import * as gigya from "./gigyaAuthService"

import { createContext, useContext } from 'react';

export const GigyaContext = createContext<GigyaSdk>({loaded: false} );

export function useGigya():GigyaSdk {
    return useContext(GigyaContext);

}


declare global {

    interface Window {
        gigya: any,
        onGigyaServiceReady: any

    }


}

export declare type GigyaSdk = (typeof gigya &{
    loaded: true  
}& typeof window.gigya )| {loaded: false};

function onGigyaService(cb: (gigya: GigyaSdk) => void) {
    window.onGigyaServiceReady = ()=> cb(sdk());
 
 
}

function sdk(): GigyaSdk {
    return {
        ...window.gigya,
        ...gigya,
        loaded: true
    }
    // waitForLogin: waitForLogin()

}
  
export function gigyaSdk(): Promise<GigyaSdk> {

    if(window.gigya )return window.gigya;
    return new Promise((resolve) => {
        window.onGigyaServiceReady = ()=> resolve(sdk());

      
    });
}

export function GigyaProvider({ children}:React.PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState( false);
    const [gigya, setGigya] = useState<GigyaSdk>(  );
    
    useEffect( ()=>{
        onGigyaService((g)=>{
            setGigya(g);
            g.socialize.addEventHandlers({
                onLogin: onLogin,
                onLogout:onLogout
            });
        })
    },[window.gigya])
 
    const onLogin=()=> {
        setIsLoggedIn(true);
    }
    const onLogout=()=> {
        setIsLoggedIn(false)
    }


 


    return  <GigyaContext.Provider value={gigya}>
       {children}  
    </GigyaContext.Provider>


}
