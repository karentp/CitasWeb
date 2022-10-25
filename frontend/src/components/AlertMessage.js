import React, { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export default function AlertMessage(props) {
    let {errorMessage, successMessage, openMessage } = props;
    return (
        <Collapse in={openMessage}>
        <Alert
            severity={errorMessage ? "error" : "success"}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        openMessage = false;
                    }}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            }
        >
            {errorMessage ? errorMessage : successMessage}
        </Alert>
    </Collapse>
    )
}


