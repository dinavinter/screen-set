import React, {useEffect, useState, createContext, useContext} from "react";
import {GigyaContext, GigyaSdk, useGigya} from "../gigya/provider";
import {authMachine, AuthService, AuthMachineContext, AuthMachine} from "../machines/authMachine";
import {useInterpretWithLocalStorage} from "../machines/withLocalStorage";
import {withGigya} from "../machines/withGigya";

export const AuthContext = createContext<AuthService>({} as AuthService);

export function AuthProvider({ children}:React.PropsWithChildren) {

    const getMachine=():AuthMachine => withGigya(authMachine);
    const authService= useInterpretWithLocalStorage(getMachine);
 
        return  <AuthContext.Provider value={authService}>
            {children}
        </AuthContext.Provider> 
}
