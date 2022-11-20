import {AuthService} from "../machines/authMachine";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import { useActor } from "@xstate/react";

export function LoginRoute({authService}: { authService: AuthService }) {
    const [state] = useActor(authService)
    switch (true) {
        case state.matches('login.signup'):
            return <SignUp authService={authService}/>
        default:
            return <SignIn authService={authService}/>
    }


}