import * as React from 'react';
import { DialogProps, Button, Dialog , DialogActions,DialogContent, DialogTitle} from "@mui/material";
import {ReactNode} from "react";

export interface ScrollDialogProps { 
    children: ReactNode;
    summary: ReactNode;
    isOpen?: boolean
}
export default function ScrollDialog(props: ScrollDialogProps){
     const [open, setOpen] = React.useState(props.isOpen || false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

    const {summary} = props;
    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            {/*<Button onClick={handleClickOpen('paper')}>scroll=paper</Button>*/}
            {/*<Button onClick={handleClickOpen('body')}>scroll=body</Button>*/}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{summary}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
