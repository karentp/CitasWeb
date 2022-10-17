import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export default function SuccessMessage(props) {
    const [showMessage, setShowMessage] = useState(true)

    let { message } = props;
    return (
        <div hidden = {showMessage ? false : true}>
            <Alert
                severity= "success"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            console.log("clicked...")
                            setShowMessage(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }>
                {message}
            </Alert>
        </div>
    )
}


