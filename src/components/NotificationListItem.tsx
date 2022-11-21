import React, {useRef, useState} from "react";

import {
    Check as CheckIcon,
    ThumbUpAltOutlined as LikeIcon,
    Payment as PaymentIcon,
    CommentRounded as CommentIcon,
    MonetizationOn as MonetizationOnIcon,
    ExpandMoreOutlined as ExpandMoreIcon
} from "@mui/icons-material";
import {
    Button,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    ListItem,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
} from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import JsonView from "./JsonTreeViewer";
import {NotificationResponseItem} from "../machines/notificationsMachine";

export interface NotificationListItemProps {
    notification: NotificationResponseItem;
    updateNotification: Function;
}

const useStyles = makeStyles({
    card: {
        minWidth: "100%",
    },
    title: {
        fontSize: 18,
    },
    green: {
        color: "#4CAF50",
    },
    red: {
        color: "red",
    },
    blue: {
        color: "blue",
    },
});

const NotificationListItem: React.FC<NotificationListItemProps> = ({
                                                                       notification,
                                                                       updateNotification,
                                                                   }) => {
    const classes = useStyles();
    const theme = useTheme();
    let listItemText = undefined;
    let listItemIcon = undefined;
    let listItemJson = undefined;
    const xsBreakpoint = useMediaQuery(theme.breakpoints.only("xs"))
    listItemIcon = <MonetizationOnIcon className={classes.green}/>;
    listItemText = `${notification.title}`;
    listItemJson = notification.payload;

    const [expended, setExpended] = useState(false);
    const changeExpand = () => {
        setExpended(!expended)
    }
    const handleClose = () => {
        setExpended(false)
    }
    return (
        <ListItem data-test={`notification-list-item-${notification.id}`}>
 

            <Button onClick={changeExpand}>
                <ListItemIcon>{listItemIcon!}</ListItemIcon>
                <ListItemText primary={listItemText}/>
                <ExpandMoreIcon/>
            </Button>
            <Dialog
                open={expended}
                onClose={handleClose}
                scroll={'paper'} 
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{listItemText}</DialogTitle>
                <DialogContent dividers={true}>
                    <ErrorBoundary data={listItemJson} >
                        <JsonView data={listItemJson} />
                    </ErrorBoundary>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
         
        </ListItem>);
};

class ErrorBoundary extends React.Component<React.PropsWithChildren<{data?: any}>, {hasError:boolean, error?: string }> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error:error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        // console.error(error, errorInfo);
        console.error("failed to load data", this.props.data);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div>
                <h1>Something went wrong.</h1>
            </div>
        }

        return this.props.children;
    }
}
export default NotificationListItem;
