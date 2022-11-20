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
import {AuthMachine} from "./authMachine";
import {gigyaSdk} from "../gigya/provider";

function toMfa(tokenDetails: any) {
    return {
    ...{...tokenDetails.sub_id?.sub_id || {}},
    ...omit('sub_id', tokenDetails || {})    
    } 
}

export const withGigya= (authMachine:AuthMachine)=>authMachine.withConfig({
    services: {
        showLogin:  (ctx, event) => (send) => {
            const payload = omit("type", event);
            const show = async (payload:any)=>{
                const gigya= await gigyaSdk();
                const user =await gigya.showLoginScreenSet(payload);
                return {user:{ ...(user?.userInfo || {}),  photo: user?.profile?.photoURL}};
            }
            show(payload) 
                .then(function (user) {
                send({ type: "LOGGED_IN", user: user })
            })
        },
        fetchAccount: (ctx, event) => (send) => {
            const payload = omit("type", event);
            return getAccount(payload)
                .then(function (user) {
                    const account={user:{ ...(user?.profile || {}),  photo: user?.profile?.photoURL}};

                    send({ type: "REPORT_ACCOUNT_PRESENT", user: account })
                })
                .catch(function (err) {
                    send("REPORT_ACCOUNT_MISSING")
                })
        },
    }
});

function decodeJwt(token?:string) {

    return token && token.split && JSON.parse(atob(token.split('.')[1]));

}  