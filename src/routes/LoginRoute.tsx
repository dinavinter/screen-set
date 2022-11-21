import {AuthService} from "../machines/authMachine";
import SignIn from "../components/SignIn";
import { useActor } from "@xstate/react";

export function LoginRoute({authService}: { authService: AuthService }) {
    const [state] = useActor(authService)
    switch (true) {
        case state.matches('login.signup'):
            return <SignIn authService={authService}/>
        default:
            return <SignIn authService={authService}/>
    }


}