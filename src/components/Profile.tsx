import React, {useState} from "react";
import Avatar from "@mui/material/Avatar";
import makeStyles from '@mui/styles/makeStyles';
import {AuthService} from "../machines/authMachine";
import {useActor, useSelector} from "@xstate/react";
import {AnyState} from "xstate";
import {Box, Paper, Typography} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    form: {
        // width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));


export interface ProfileProps {
    authService: AuthService;

}

const profileSelector = (state: AnyState) => state?.context?.user;

function Profile({authService}: ProfileProps) {
    const classes = useStyles();
    const {email, loginProvider, nickname, photo} = useSelector(authService, profileSelector) || {};


    return (
        <Paper className={classes.paper} >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Profile Details
            </Typography>
            <Avatar src={photo} className={classes.avatar}></Avatar>
            <div
                className={classes.form}


            >
                <p>
                    Welcome back, <span style={{fontWeight: "bold"}}> {nickname}</span>.
                </p>
                <p>
                    You logged in using the email address:
                    <span style={{fontWeight: "bold"}}> {email}</span>.
                </p>
                {/* Switch statement here based on loginProvider */}
                <p>
                    and logged in using the provider:
                    <span style={{fontWeight: "bold"}}> {loginProvider}</span>.
                </p>

            </div>


        </Paper>
    );
}

export default Profile;
