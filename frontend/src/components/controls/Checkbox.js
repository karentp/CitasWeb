import React from 'react'
import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core';
import Tooltip from '@mui/material/Tooltip';

export default function Checkbox(props) {

    const { name, label, value, onChange, disabled, title, ...other } = props;


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        <FormControl {...other}>
            <FormControlLabel
                control={
                <Tooltip title = {title?title:''}>
                    <MuiCheckbox
                        name={name}
                        color="primary"
                        checked={value}
                        onChange={e => onChange(convertToDefEventPara(name, e.target.checked))}
                        disabled={disabled?true:false}
                    />
                </Tooltip>
                }
                label={label}
            />
        </FormControl>
    )
}
