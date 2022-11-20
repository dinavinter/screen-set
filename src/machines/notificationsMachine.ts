 import {actions, createMachine, InterpreterFrom, MachineConfig} from "xstate";
const  {assign} =actions;

 export type ApiNotificationResponseItem ={
     payload: any,
 }

 export type NotificationResponseItem =ApiNotificationResponseItem &{
     severity?: "success" | "info" | "warning" | "error";
     title: string,
     id: string

 }
export interface NotificationsSchema {

    states: {
        visible: {};
    };
}

export type NotificationsEvents = { type: "ADD", notification: NotificationResponseItem } | { type: "HIDE" };


export interface NotificationsContext {
    notifications: Array<NotificationResponseItem>

}

export const notificationsMachineConfig: MachineConfig<NotificationsContext, NotificationsSchema, NotificationsEvents> = {
    context: {
        notifications: Array.of<NotificationResponseItem>()
    },
    initial: "visible",
    states: {
        visible: {
            on: {
                'ADD': {
                    actions: "addNotification"
                }
            }
        }
    }
};


export const notificationMachine= createMachine(notificationsMachineConfig, {
    actions: {
        addNotification:  assign({
            notifications: (context, event: NotificationsEvents)=> {
                return event.type === "ADD" ? [...context.notifications , event.notification]: context.notifications
            }
        })
    }
})

export type NotificationsService = InterpreterFrom<typeof notificationMachine>
