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
        hidden: {};
    };
}

export type NotificationsEvents = { type: "ADD", notification: NotificationResponseItem } | { type: "HIDE" }| { type: "SHOW" };


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
                },
                'HIDE': {
                    target:"hidden"
                }
            },
          
        },
        hidden:{
            on: {
                'SHOW':{
                    target:"visible"
                }
            }
            
        }
    }
};


export const notificationMachine= createMachine(notificationsMachineConfig, {
    actions: {
        addNotification:  assign({
            notifications: (context, event: NotificationsEvents)=> {
                return event.type === "ADD" ? [...context.notifications , event.notification].filter(onlyUnique): context.notifications
            }
        })
    }
})

 function onlyUnique(value: NotificationResponseItem, index: number, self: NotificationResponseItem[]) {
     return self.map(e=> e.id).indexOf(value.id) === index;
 }



 export type NotificationsService = InterpreterFrom<typeof notificationMachine>
