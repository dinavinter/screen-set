import {assign,MachineConfig, createMachine, InterpreterFrom} from "xstate";

export interface SnackbarSchema {
    states: {
        invisible: {};
        visible: {};
    };
}

export type SnackbarEvents = { type: "SHOW" } | { type: "HIDE" };

export interface SnackbarContext {
    severity?: "success" | "info" | "warning" | "error";
    message?: string;
}

export const snackbarMachineConfig: MachineConfig<SnackbarContext, SnackbarSchema, SnackbarEvents> =
    {
        id: "snackbar",
        initial: "invisible",
        context: {
            severity: undefined,
            message: undefined,
        },
        states: {
            invisible: {
                entry: "resetSnackbar",
                on: {SHOW: "visible"},
            },
            visible: {
                entry: "setSnackbar",
                on: {HIDE: "invisible"},
                after: {
                    // after 3 seconds, transition to invisible
                    3000: "invisible",
                },
            },
        },

    };
export const snackbarMachine = createMachine(snackbarMachineConfig, {
    actions: {
        setSnackbar: assign((ctx, event: any) => ({
            severity: event.severity,
            message: event.message,
        })),
        resetSnackbar: assign((ctx, event: any) => ({
            severity: undefined,
            message: undefined,
        })),
    },
});

export type SnackbarService = InterpreterFrom<typeof snackbarMachine>
