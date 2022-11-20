import React, {useEffect} from "react";
import {AnyEventObject, Interpreter, ActionTypes} from "xstate";
import { Paper, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import NotificationList from "../components/NotificationList";
import {AuthService} from "../machines/authMachine";
import {NotificationResponseItem, NotificationsEvents, NotificationsService} from "../machines/notificationsMachine";
import {omit} from "lodash/fp";
import {useActor} from "@xstate/react";

const useStyles = makeStyles((theme) => ({
    paper: {
        minHeight: "90vh",
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
}));

export interface Props {
    authService: AuthService;
    notificationsService: NotificationsService;
}

function generateUniqueID() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    }


interface NotificationUpdatePayload {
}

const NotificationsContainer: React.FC<Props> = ({authService, notificationsService}) => {
    const classes = useStyles();
    // const [authState] = useActor(authService);
    const [notificationsState, sendNotifications] = useActor(notificationsService);

    function getPayload(event: AnyEventObject) {
       return {
        ...omit( ['type','data'], event),
        ...(event.data || {})

        };
    }
  


    function doneDetails(event: AnyEventObject):Partial<NotificationResponseItem >{
        if(event.type.indexOf('DONE.') > 0){
            const title=  `done: ${event.type.replace('DONE.INVOKE.' , '').replace(':INVOCATION[0]' , '')}`
            return {
                severity: 'success',
                title

            }
        }
        return {};
    }
    function errorDetails(event: AnyEventObject):Partial<NotificationResponseItem >{
        if(event.type.indexOf('ERROR.') > 0){
            const title= `${event.type.toLowerCase()
                .replace(ActionTypes.ErrorCommunication , 'communication error: ')
                .replace(ActionTypes.ErrorExecution, 'execution error: ')
                .replace(ActionTypes.ErrorCustom,  'error: ')
                
                .replace(':invocation[0]' , '')} `;
            return { 
                severity: 'error',
                title
                
            }
        }
        return {};
    }
    useEffect(() => {
        authService.onEvent(event => {
            if(!event) return;
            
            sendNotifications({
                type: "ADD", notification: {
                    id: generateUniqueID(),
                    title:  event.type.toLowerCase(),
                    severity: 'info',
                    payload: getPayload(event),
                    ...doneDetails(event),
                    ...errorDetails(event)
                }
            })
        })
    }, [authService])

    // useEffect(() => {
    //   sendNotifications({
    //     type: "ADD", notification: {
    //       id: "Auth State",
    //       title: authState.value as string,
    //       severity:  "info",
    //       payload: authState
    //     }
    //   })
    // }, [authState]);


    const updateNotification = (payload: NotificationUpdatePayload) => {
    };

    return (
        <Paper className={classes.paper} >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Notifications
            </Typography>
            <NotificationList
                notifications={notificationsState?.context?.notifications!}
                updateNotification={updateNotification}
            />
        </Paper>
    );
};

export default NotificationsContainer;
