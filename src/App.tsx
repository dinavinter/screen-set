// import logo from "./logo.svg";
import React, {useEffect} from "react";
import "./App.css";
import "./styles/globals.css";
import SignIn from "./components/SignIn";
import {authMachine, AuthService} from "./machines/authMachine";
import {Router} from "@reach/router";
import {useMachine} from "@xstate/react";
import {AnyState} from "xstate";
import {Box, Container} from "@mui/material";
import {SnackbarContext, snackbarMachine} from "./machines/snackbarMachine";
import AlertBar from "./components/AlertBar";
import {withGigya} from "./machines/withGigya";
import {notificationMachine} from "./machines/notificationsMachine";
import NotificationsContainer from "./containers/NotificationsContainer";
import ProfileContainer from "./containers/ProfileContainer";
import EventsContainer from "./containers/ActionsContainer";
import {useInterpretWithLocalStorage} from "./machines/withLocalStorage";
import {PrivateRoute} from "./routes";

import { ThemeProvider, Theme, StyledEngineProvider, createTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import SignInOidc from "./components/SignInOidc";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const theme = createTheme();

const useStyles = makeStyles((theme) => {
    root: {
        // some CSS that accesses the theme
    }
});



const App = () => {


    const authService = useInterpretWithLocalStorage(() => withGigya(authMachine));
    

    const [, sendSnackbar, snackbarService] = useMachine(snackbarMachine);
    const [, sendNotification, notificationService] = useMachine(notificationMachine);

    const showSnackbar = (payload: SnackbarContext) => sendSnackbar({type: "SHOW", ...payload});

    // authService.subscribe(state => {
    //     showSnackbar({message: state.value as string, severity: "info" })
    // })

    useEffect(() => {
        const subscription = authService.subscribe((state: AnyState) => {
            // simple state logging
            console.log(state);
            showSnackbar({message: state.value.toString(), severity: "info"})

        });

        return subscription.unsubscribe;
    }, [authService]);

    // @ts-ignore
    // @ts-ignore
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>

            <div>
                <EventsContainer authService={authService}/>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'none',
                        m: 20,

                        alignItems: "left"
                    }}
                >
                    <Box>

                        <Router>
                            <PrivateRoute default as={ProfileContainer} path={"/"} authService={authService}/>
                            <SignIn path={"/signin-more"} authService={authService}/>
                            <SignInOidc path={"/signin"} authService={authService}/>
                            <ProfileContainer path="/profile" authService={authService}/>

                        </Router>
                    </Box>

                    <Container fixed maxWidth="sm">
                        <NotificationsContainer authService={authService} notificationsService={notificationService}/>
                    </Container>
                </Box>


                <AlertBar snackbarService={snackbarService}/>

            </div>
             </ThemeProvider>
        </StyledEngineProvider>
    );
};




export default App;
