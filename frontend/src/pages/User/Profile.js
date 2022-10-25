import React from 'react'
import { Paper, makeStyles } from '@material-ui/core'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularStatic from '../../components/CircularStatic'
import { useForm, Form } from '../../components/useForm';
import axios from 'axios';
import ImageComponent from '../../components/ImageComponent';
import { Grid } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import AlertMessage from '../../components/AlertMessage';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkIcon from '@mui/icons-material/Work';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";

const useStyles = makeStyles(theme => ({
    programholder: {
        height: 40,
        textAlign: 'center'
    },
    button: {
        background: '#4287f5',
        color: '#FFFFFF',
        justifyContent: 'center'
    },
    paper: {
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        paddingTop: "25px"
    },
    pageContent: {
        margin: '50px 0 0 0',
        width: '100%',
        padding: theme.spacing(3)
    },
    pageContent2: {
        margin: '50px 0 0 50px',
        width: '30%',
    },
    right: {
        display: "inline-flex",
        flex: "row",
        width: '90%'
    },
    gridContainer: {
        marginBottom: '40px'
    }
}))

const initialValues = {
    username: '',
    email: '',
    name: '',
    firstlastname: '',
    secondlastname: '',
    phone: '',
    roles: [],
    type: '',
    image:'',
    details: ''

}

export default function Profile() {
    const { id } = useParams();
    const uid = localStorage.getItem("uid");
    const isUser = uid===id ? true:false;
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [edit, setEdit] = useState(false);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }, onUploadProgress: (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total));
        },
    };

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        var pattern = new RegExp(/^[0-9\b]+$/);
        if ('phone' in fieldValues){
            //temp.phone = fieldValues.phone.length === 8 ? "": "El número debe ser de 8 dígitos"            
            if(fieldValues.phone)
                temp.phone = !pattern.test(fieldValues.phone) ? "Por favor ingrese solo números": "";
        }
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    useEffect(async () => {
        let unmounted = false;
        await getUser();
        return () => { unmounted = true; };
    }, []);


    const getUser = async () => {
        setLoading(true);
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/users/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                onDownloadProgress: (data) => {
                    //Set the progress value to show the progress bar                    
                    setProgress(Math.round((100 * data.loaded) / data.total));
                },
            });
            setValues(response.data.user);
            setLoading(false);
        } catch (error) {
            setTimeout(() => {
                setOpen(false);
                setTimeout(() => {
                    setError("");
                }, 2000);

            }, 5000);
            setOpen(true);
            setLoading(false);
            return setError("Authentication failed!");
        }
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialValues, true, validate);

    const handleChange = (event) => {
        setEdit(event.target.value);
      };

    const confirmPost = async () => {
        localStorage.setItem("image", values.image);
        setOpen(true);
        setLoading(false);
        setTimeout(function () {
            setOpen(false);
        }, 4000);
    }  

    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            setLoading(true);
            try {
                await axios
                    .patch(`${process.env.REACT_APP_API_URL}/api/private/users/${id}`, values, config)
                    .then(confirmPost)

            }

            catch (error) {
                setLoading(false);
                setTimeout(() => {
                    setTimeout(() => {
                        setError("");
                    }, 2000);
                }, 5000);
                return setError("Authentication failed!");
            }

        }        
    }


    return (
        <div>
            <Header image = {values.image} />
            <SideMenu />
            <CircularStatic progress={progress} hidden={!loading} />
            <PageHeader
                title="Información detallada de un usuario"
                subTitle="Puedes ver y modificar algunos campos"
                icon={<InfoIcon fontSize="large"
                />}
            />
            <Grid item className={classes.right}>
                <Paper className={classes.pageContent}>
                    <Form onSubmit={handleSubmit}>
                        <AlertMessage errorMessage={error} successMessage={"Se ha actualizado el usuario!"} openMessage={open} />
                        <div hidden={!isUser}>
                            <Grid container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                style={{ textAlign: 'center' }}>    
                                <Controls.Checkbox
                                        name="edit"
                                        label="Editar usuario"
                                        value={edit}
                                        style={{alignItems: "center"}}
                                        onChange={handleChange}                                    
                                />
                            </Grid>
                        </div>
                        <Grid container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ textAlign: 'center' }}>
                            <Grid item xs={12} className={classes.gridContainer}>
                                <Controls.Input
                                    name="name"
                                    label="Nombre"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.name}
                                    disabled={!edit}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.gridContainer}>
                                <Controls.Input
                                    label="Primer apellido"
                                    name="firstlastname"
                                    value={values.firstlastname}
                                    onChange={handleInputChange}
                                    error={errors.lastname}
                                    disabled={!edit}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.gridContainer}>
                                <Controls.Input
                                    label="Segundo apellido"
                                    name="secondlastname"
                                    value={values.secondlastname}
                                    onChange={handleInputChange}
                                    error={errors.lastname}
                                    disabled={!edit}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.gridContainer}>
                                <Controls.Input
                                    name="phone"
                                    label="Número"
                                    value={values.phone}
                                    onChange={handleInputChange}
                                    error={errors.phone}
                                    disabled={!edit}

                                />
                            </Grid>

                            <Grid item xs={12}  className={classes.gridContainer}>
                                <Controls.Input
                                    name="details"
                                    label="Dirección"
                                    value={values.details}
                                    onChange={handleInputChange}
                                    error={errors.details}
                                    disabled={!edit}

                                />
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                style={{ marginTop: '20px' }}
                                
                            >
                                <div hidden={!edit}>
                                    <Controls.Button
                                        type="submit"
                                        text="Guardar"
                                    />

                                    <Controls.Button
                                        text="Limpiar"
                                        color="inherit"
                                        onClick={resetForm} />
                                </div>
                            </Grid>
                        </Grid>
                    </Form>
                </Paper>
                <div className={classes.pageContent2}>
                    <Paper className={classes.paper} elevation={3}>
                        <ImageComponent initialValues={values} onChange={handleInputChange} profile={true} />
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: "green" }}>
                                        <MailOutlineIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Email" secondary={values ? values.email : ""} />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: "green" }}>
                                        <PeopleAltIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Usuario" secondary={values ? values.username : ""} />
                            </ListItem>
                        </List>
                    </Paper>
                </div>
            </Grid>
        </div>

    )
}
