import React, {useState} from "react";
import Avatar from "@mui/material/Avatar";
import makeStyles from '@mui/styles/makeStyles';
import {AuthService} from "../machines/authMachine";
import {useActor, useSelector} from "@xstate/react";
import {AnyState} from "xstate";
import {Box, List, Paper, Typography} from "@mui/material";
import {NotificationResponseItem} from "../machines/notificationsMachine";
import NotificationListItem from "./NotificationListItem";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

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

const contextSelector = (state: AnyState) => state?.context?.user;

function Apps({authService}: ProfileProps) {
    const {apps} = useSelector(authService, contextSelector) || {};

    console.log(apps);

    return (
        <>
          
          
            {apps?.length > 0 ? (
                <List data-test="apps-list">
                    {apps.map((app: App) => (
                        <App
                            key={app.id}
                            app={app}
                        />
                    ))}
                </List>
            ) : (
                <></>
            )}
        </>
    );
}

interface App {
    id:string;
    icon: string;
    name: string;
    info: string;
    role: string;
}

function App({app = {
    id:"ssd",
    icon: "img/assets/products/1.svg",
    name: "Marketplace",
    info: "A beautiful dress for you best evenings and important dates",
    role: "Buyer"
}}:{app:App}){
    return (<div className="column is-one-fifth-fullhd is-one-quarter-widescreen is-one-third-desktop is-one-third-tablet is-half-mobile">
        <div className="product-card" data-name="Spring Red Dress" data-price="44.00" data-colors="true" data-variants="true" data-path="img/assets/products/1">
            <a className="quickview-trigger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </a>
            <div className="product-image">
                <img src={app.icon} />
            </div>
            <div className="product-info">
                <h3>{app.name}</h3>
                <p>{app.info}</p>
            </div>
            <div className="product-actions">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>{app.role}</span> 
            </div>
        </div>
    </div>);
}
    
export default Apps;
