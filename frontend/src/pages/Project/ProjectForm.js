import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import { Paper, makeStyles, Box } from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import PageHeader from "../../components/PageHeader";
import CircularStatic from '../../components/CircularStatic'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AlertMessage from '../../components/AlertMessage';
import ImageComponent from '../../components/ImageComponent';
import MenuItem from '@mui/material/MenuItem';
import CalendarTemplate from './Calendar';


const initialBValues = {
    name: '',
    description: '',
    objetives: '',
    isTimeSeries: false,
    image: '',
    programs: [],
    factors: [],
    laboratorio: '',
    availability: ['No hay espacios disponibles']
}

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: '50px 0 0 0',
        width: '90%',
        padding: theme.spacing(3)
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
}))

export default function ProjectForm() {

    let [availability, setAvailability] = useState([])


    const [labName, setLabName] = useState('');
    const { id } = useParams();
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const message = id ? "Se ha actualizado el servicio!" : "Se ha guardado el servicio!"
    const title = id ? "Actualizar servicio" : "Añadir nuevo servicio";
    const type = id ? "actualizar" : "agregar";


    const Calendar = CalendarTemplate({
        availability,
        setAvailability: update => {
            setAvailability(update)
            saveAvailability(update)
            console.log("CRAYOLA")
            console.log(availability)
        },



    });


    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "Este campo es obligatorio."
        if ('objetives' in fieldValues)
            temp.objetives = fieldValues.objetives ? "" : "Este campo es obligatorio."



        setErrors({
            ...temp
        })
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    useEffect(() => {
        let unmounted = false;
        if (id)
            getProject();
        return () => { unmounted = true; };
    }, []);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }, onUploadProgress: (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total));
        },
    };
    const getProject = async () => {
        setLoading(true);
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/project/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                onDownloadProgress: (data) => {
                    //Set the progress value to show the progress bar                    
                    setProgress(Math.round((100 * data.loaded) / data.total));
                },
            });
            setValues(response.data.project);
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

    useEffect(async () => {
        let unmounted = false;
        await getLabName();
        return () => { unmounted = true };
    }, []);

    const getLabName = async () => {
        try {
            const uid = localStorage.getItem("uid");
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/users/${uid}`, config);
            console.log("WENAAAS");
            console.log(response);
            values.laboratorio = response.data.user.roles[0].projectName;
            setLabName(response.data.user.roles[0].projectName);
        }
        catch (error) {
            console.log("Wenuuuski");
        }

    }

    const {
        values,
        avaValues,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialBValues, true, validate);

    const confirmPost = () => {
        setOpen(true);
        setLoading(false);
        if (!id) {
            resetForm({
            })
        }
        setTimeout(function () {
            setOpen(false);
        }, 6000);

    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            setLoading(true);
            try {
                if (id) {
                    await axios
                        .patch(`${process.env.REACT_APP_API_URL}/api/private/project/${id}`, values, config)
                        .then(confirmPost)
                console.log("if")
                } else {
                    await axios
                        .post(process.env.REACT_APP_API_URL + "/api/private/project/", values, config)
                        .patch(`${process.env.REACT_APP_API_URL}/api/private/availability`, values, config)
                        .then(confirmPost)
                console.log("else")
                }
                console.log("en handle submit")
                createAvailability();
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

    

    function saveAvailability(update){
        console.log("LOGGING")
        console.log(update)
        availability = update
        
    }

    const createAvailability = async e => {
        console.log("OLIS")
        console.log(availability)
        if (validate()) {
            setLoading(true);
        
            availability.forEach(element => {
            const avaValue = {
                service: id,
                start: element.start,
                end: element.end,
                timeSlot: 30
    
            }
            try {
                if (id) {
                     axios
                        .post(`${process.env.REACT_APP_API_URL}/api/private/availability/${id}`, avaValue, config)
                        .then(confirmPost)
                } else {
                     axios
                        .patch(`${process.env.REACT_APP_API_URL}/api/private/availability`, avaValue, config)
                        .then(confirmPost)
                }
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
        });
    }
    }
    return (

        <div>
            <PageHeader
                title={title}
                subTitle={`Formulario para ${type} un servicio`}
                icon={<EcoIcon fontSize="large" color='primary'
                />}
            />
            <CircularStatic progress={progress} hidden={!loading} />
            <Paper className={classes.pageContent}>
                <ImageComponent initialValues={values} onChange={handleInputChange} />
                <Form onSubmit={handleSubmit}>
                    <AlertMessage errorMessage={error} successMessage={message} openMessage={open} />
                    <Grid container>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="name"
                                label="Nombre"
                                value={values.name}
                                onChange={handleInputChange}
                                error={errors.name}
                            />
                            <Controls.TextArea
                                label="Descripción"
                                name="description"
                                value={values.description}
                                onChange={handleInputChange}
                                error={errors.description}
                            />
                            <Controls.Input
                                label="Precio"
                                name="objetives"
                                value={values.objetives}
                                onChange={handleInputChange}
                                error={errors.objetives}
                            />
                            <Controls.Input
                                disabled="true"
                                label="Laboratorio"
                                name="laboratorio"
                                value={labName}
                                onChange={handleInputChange}
                            />


                        </Grid>
                        <Grid item xs={6}>
                            <Controls.Checkbox
                                name="isTimeSeries"
                                label="Activar servicio"
                                value={values.isTimeSeries}
                                onChange={handleInputChange}
                                title="Se presentará como servicio activo al marcar la casilla, de lo contrario se presentará como servicio inactivo."
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
        </div>
    )
}
