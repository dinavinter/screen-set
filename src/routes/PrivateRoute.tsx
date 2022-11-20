import SignIn from "../components/SignIn";
import { useEffect } from "react";
import { useActor } from "@xstate/react";
import {LoginRoute} from "./LoginRoute";
import {AuthService} from "../machines/authMachine";
import { RouteComponentProps } from "@reach/router";
export interface Props extends RouteComponentProps {
    authService: AuthService;
    as: any;


}
export function PrivateRoute({authService, as: Comp, ...props}: Props) {
    const [state, send] = useActor(authService);
    useEffect(() => {
        if (state.matches('unauthorized')) {
            send('LOGIN')
        }
    }, [state]);

    switch (true) {
        case state == undefined:
            return <LoginRoute authService={authService}/>;

        case state.matches('login'):
            return <LoginRoute authService={authService}/>

        case state.matches('reauth'):
            return <SignIn authService={authService}/>
        default:
            return <Comp {...props} authService={authService}/>;
    }


}