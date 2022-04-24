import React from 'react'
import Modal from '@mui/material/Modal';

export default function Test(props) {
    const {open, onClose, ...other} = props;
    console.log("hola")
    return (
        <Modal
            open={open}
            onClose={onClose}
            
        >
            <div></div>
        </Modal>
    )
}
