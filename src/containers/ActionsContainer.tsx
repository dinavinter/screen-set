import React, {useEffect} from "react";
import {AnyEventObject, AnyState, Interpreter, PayloadSender, StateLike, StateNode, TransitionDefinition} from "xstate";
import {
    Button,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    AppBar,
    Box,
    responsiveFontSizes,
    createTheme,
    ThemeProvider,
    Theme,
    StyledEngineProvider,
    Icon
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {AuthService} from "../machines/authMachine";
import {useActor} from "@xstate/react";
import {EventObject, Sender} from "xstate/lib/types";
import {MailOutline, LoginOutlined} from "@mui/icons-material"
import IconButton from '@mui/material/IconButton';
import {NotificationsService} from "../machines/notificationsMachine";

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const useStyles = makeStyles((theme) => ({
    paper: {
        minHeight: "90vh",
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "row",
    },

    typography: {
        h5: {
            font: 'mono',
            fontStyle:'bold',
            fontWeight: 'bold'
        }
    },
}));

export interface Props {
    authService: AuthService;
    notificationsService: NotificationsService;
}

const EventsContainer: React.FC<Props> = ({authService, notificationsService}) => {
    const classes = useStyles();
    const [authState] = useActor(authService);
 
    const sendEvent = authService.send;
    let theme = createTheme({
        typography: {
            h5: {
              font: 'mono',
                fontStyle:'bold',
                fontWeight: 'bold' 
            }
        },
    });
    theme = responsiveFontSizes(theme);
    const events:Array<{type:string, icon:string, info: string}>=  [{
        type: "LOGIN",
        icon : 'login',
        info: 'Login!',
    },
        {
            type: "LOGOUT",
            icon : 'logout',
            info: 'Logout'
        },
        {
            type: "ORGANIZATION.REGISTER",
            icon : 'mail',
            info: 'Register new organization'
        }];
    return (
        // <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6">
        <AppBar color="transparent" variant={"outlined"} position="sticky">
            <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                {/*<div*/}
                {/*    className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">*/}
                
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
 
                        { 
                           events .map(({type, icon, info}) => {
                                return (
                                    <Event key={type} state={authState} send={sendEvent} type={type} icon={icon} info={info}/>
                                );
                            })}
                        
{/*
                        <Event type={"SHOW"} state={notificationsService.state} send={notificationsService.send} icon={'log'} info={'Show Logger'}/>
                        <Event type={"HIDE"} state={notificationsService.state} send={notificationsService.send} icon={'remove'} info={'Hide Logger'}/>

*/}
                    </ThemeProvider>
                </StyledEngineProvider>
             </Box>
        </AppBar>
    );
};
/*
const EventsContainerDeclarative: React.FC<Props> = ({authService}) => {
    const classes = useStyles();
    const [authState] = useActor(authService);

    const sendEvent = authService.send;
    let theme = createTheme(adaptV4Theme({
        typography: {
            h5: {
              font: 'mono',
                fontStyle:'bold',
                fontWeight: 'bold' 
            }
        },
    }));
    theme = responsiveFontSizes(theme);

    return (
        <AppBar color="transparent" variant={"outlined"}>
            <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                {/!*<div*!/}
                {/!*    className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">*!/}
                
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>

                        <div className="navbar-start logged is-hidden">

                            <div className="navbar-item is-icon drop-trigger">
                                <a className="icon-link is-primary hint--bottom hint--bounce hint--infoo hint--rounded " aria-label="Sample content" href="#">
                                    <ion-icon name="heart-outline"></ion-icon>
                                </a>

                            </div>
                            <div className="navbar-item is-icon drop-trigger">
                                <a className="icon-link is-primary hint--bottom hint--bounce hint--infoo hint--rounded " aria-label="Sample content" href="#">
                                    <ion-icon name="notifications-outline"></ion-icon>
                                    <span className="indicator"></span>
                                </a>

                            </div>
                            <div className="navbar-item is-icon drop-trigger">
                                <a className="icon-link is-active hint--bottom hint--bounce hint--infoo hint--medium hint--rounded " aria-label="Subscribe to our newsletters!" href="javascript:liteRegisterWithRaaS();">
                                    <ion-icon name="mail-outline"></ion-icon>
                                    <span className="indicator"></span>
                                </a>

                            </div>
                            <div className="navbar-item is-icon drop-trigger">
                                <a className="icon-link hint--bottom hint--bounce hint--errorr hint--mediumm hint--rounded " href="https://github.com/gigya/cdc-starter-kit/" target="_blank" aria-label="GitHub for CDC Starter Kit">
                                    <ion-icon name="logo-github"></ion-icon>
                                    <span className="indicator"></span>
                                </a>
                            </div>


                            <div className="navbar-item is-icon open-chat">
                                <a className="icon-link is-primary hint--bottom hint--bounce hint--infoo hint--rounded " aria-label="Sample content" href="#">
                                    <ion-icon name="chatbox-outline"></ion-icon>
                                    <span className="indicator"></span>
                                </a>
                            </div>
                            <div className="modal sample-content-modal">
                                <div className="modal-background"></div>
                                <div className="modal-content">
                                    <div className="notification is-infoo is-light is-size-5 has-text-centered">
                                        Sample Content
                                    </div>

                                </div>
                             </div>
                        </div>


                    </ThemeProvider>
                </StyledEngineProvider>
             </Box>
        </AppBar>
    );
};
*/
 
export const Event = (props: { type: string, state: AnyState, send: PayloadSender<any>, icon: string, info: string }) => {
    // const {flyJson} = useFlyPane(); 
    const classes = useStyles();

    const {state, send, type, info, icon} = props;
    const defaultEvent = state.meta?.eventPayloads?.[type] || {};
    // const eventData = {
    //     ...defaultEvent,
    //     ...event,
    //     type: props.children,
    // };


    return (
        <div className="navbar-item is-icon drop-trigger">

        <Button
            className="icon-link is-active hint--bottom hint--bounce hint--infoo hint--medium hint--rounded " 
            aria-label={info}
            onClick={() => {
                // flyJson(eventData, eventData.Type);
                send({
                    ...defaultEvent,
                    // ...event,
                    type: type,
                });
            }}
            // To override prose
            style={{margin: 2}}    
        >
            <a className="icon-link is-active hint--bottom hint--bounce hint--infoo hint--medium hint--rounded " >
                <Icon baseClassName="material-icons material-icons-outlined">{icon}</Icon>
                <span className="indicator"></span>
            </a>

        </Button>
        </div>


    );
};

export default EventsContainer;
