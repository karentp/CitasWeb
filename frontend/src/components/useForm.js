import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core";
import { getBase64 } from '../services/getFileService';

export function useForm(initialFValues, validateOnChange = false, validate) {


    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleInputChange = e => {
        
        let { name, value } = e.target         
        name = name?name:e.target.id;
        switch (name) {
            case "image":
                getBase64(e.target.files[0])
                .then(result => {                                                     
                    setValues({ ...values, [name]: result});
                })
                .catch(err => {
                    console.log(err);
                });
                break;
            case "clearImage":
                setValues({ ...values, "image": ""});
                break;
            default:
                setValues({
                    ...values,
                    [name]: value
                })
                break;
        }     
        if (validateOnChange)
            validate({ [name]: value })
    }

    const resetForm = () => {

        setValues(initialFValues);        
        setErrors({})
    }


    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm

    }
}


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form(props) {

    const classes = useStyles();
    const { children, ...other } = props;
    return (
        <form className={classes.root} autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}

