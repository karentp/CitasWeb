import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import { Paper, makeStyles, Box } from '@material-ui/core';
import AlertMessage from '../../components/AlertMessage';
import { getUsers } from '../../services/userService';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Modal from '@mui/material/Modal';
import axios from "axios";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: '50px 0 0 0',
        width: '90%',
        padding: theme.spacing(3)
    },
    divContent: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 400,
    },
    programholder: {
        height: 40,
        textAlign: 'center',
        width: '90%'
    },
    sizeAvatar: {
        height: "150px",
        width: "150px",
        marginBottom: "25px",
    },
    imageButton: {
        marginBottom: "25px"
    },
    center: {
        display: 'flex',
        textAlign: 'center'
      },
}))

const initialValues = {
    roles: "",
}

export default function AssignPermission(props) {
    const inputRef = React.createRef();
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [isEmpty, setIsEmpty] = React.useState(true);
    const { userId, openM, onClose, ...other } = props;
    const validate = (fieldValues = values) => {
    }
    useEffect(async () => {
        let unmounted = false;
        if (userId && openM) {
            let response = await getUsers(userId);
            setValues(response.data.user.roles);
        }else{
            setIsEmpty(true);
            setRoleValue(undefined);
            setInputValue('');
        }
        return () => { unmounted = true; };
    }, [userId, openM]);

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialValues, false, validate);

    function fixRoles (role){
        for (const roleIndex in values) {
            if (values[roleIndex].projectId === role.projectId){
                let temp = values;
                temp[roleIndex] = role;   
                return temp;             
            }
        }
    }

    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

    const handleSubmit = async (e) => {
        
        try{
            if(isEmpty){
                throw new Error("Por favor seleccione un proyecto");
            }else{
                setOpen(true);
                const newRoles = fixRoles(roleValue);
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/private/userRole/${userId}`, {roles: newRoles}, config
                );
                let responseGet = await getUsers(userId);
                setValues(responseGet.data.user.roles);
                setTimeout(() =>{
                    setOpen(false);
                }, 2000)
            }
        }catch(error){
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
                setTimeout(() => {
                    setError("");
                }, 2000);

            }, 5000);
            setLoading(false);
            return setError(error.message);
        }

        
    }



    const [roleValue, setRoleValue] = React.useState(values[0]);
    const [inputValue, setInputValue] = React.useState('');

    return (
        <Modal
        open={openM}
        onClose={onClose}            
        >
            <div className={classes.divContent}>
                <Paper className={classes.pageContent}>
                <AlertMessage errorMessage={error} successMessage={"Se ha asignado los permisos!"} openMessage={open} />
                    <Form >


                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginTop: '20px' }}
                        >
                            
                            <Autocomplete
                                value={roleValue}
                                onChange={(event, newValue) => {
                                    if(newValue){
                                        setRoleValue(newValue);
                                    }
                                }}
                                className={classes.center}
                                id="combo-box-programs"
                                options={values}
                                getOptionLabel={(option) => option.projectName}
                                style={{ width: 300, justifyContent: "center" }}
                                renderInput={(params) => <TextField {...params} label="Proyectos" variant="outlined" />}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                    if (newInputValue === '') {
                                        setIsEmpty(true);
                                        setRoleValue(undefined);
                                    }
                                    else
                                        setIsEmpty(false);
                                }}
                            />
                            
                        </Grid>
                        
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Controls.Checkbox
                                    name="export"
                                    label="Exportar CSV"
                                    value={roleValue? roleValue.export:false}
                                    onChange={() => {
                                        if (roleValue) setRoleValue({...roleValue, ["export"]: !roleValue.export})}
                                    }
                                    
                            />
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Controls.Checkbox
                                    name="editFactor"
                                    label="Editar factores"
                                    value={roleValue? roleValue.editFactor:false}
                                    onChange={() => {
                                        if (roleValue) setRoleValue({...roleValue, ["editFactor"]: !roleValue.editFactor})}
                                    }
                                    
                            />
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Controls.Checkbox
                                    name="editData"
                                    label="Editar datos"
                                    value={roleValue? roleValue.editData:false}
                                    onChange={() => {
                                        if (roleValue) setRoleValue({...roleValue, ["editData"]: !roleValue.editData})}
                                    }
                                    
                            />
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginTop: '20px' }}
                        >
                            <div>
                                <Controls.Button
                                    text="Guardar"
                                    onClick = {handleSubmit}
                                />
                            </div>
                        </Grid>
                    </Form>
                </Paper>
            </div>
        </Modal>
    )
}
