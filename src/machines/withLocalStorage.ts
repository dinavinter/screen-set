
// @ts-ignore
import {AnyState, AnyStateMachine, State} from "xstate";
import {authMachine, AuthMachineContext, AuthMachineEvents} from "./authMachine";
import {useInterpret} from "@xstate/react";
import {MaybeLazy} from "@xstate/react/lib/types";


export function useInterpretWithLocalStorage<TMachine extends AnyStateMachine>(getMachine: MaybeLazy<TMachine>){
    const currentState = stateLocalStorage.get();

    return useInterpret(getMachine,
        {
            state: currentState
        }, stateLocalStorage.observer);

}

 
export const stateLocalStorage ={
    get: ()=>{
        const stateDefinition = localStorage.getItem("auth-state");
        if (stateDefinition) {
            return State.create<AuthMachineContext,AuthMachineEvents>(JSON.parse(stateDefinition));
            // @ts-ignore
            // return  authMachine.resolveState(previousState);
        }
        return authMachine.initialState;
      
    },
    observer:(state: AnyState) => {
        if (state.changed) {
            localStorage.setItem("auth-state", JSON.stringify(state));
        }
    }

}
