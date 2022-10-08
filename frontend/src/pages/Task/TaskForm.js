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
import Alert from '../../components/AlertMessage';
import AlertMessage from '../../components/AlertMessage';
import { getTasks } from '../../services/taskService';


const predictionItems = [
    { id: 'regresion', title: 'Regresión lineal' },
    { id: 'clasificacion', title: 'Clasificación' },
]

const initialBValues = {
    name: '',
    description: '',
    diasNecesarios: '',
    diasCompletados: '',
    isTimeSeries: false,
    projects: ''
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

export default function TaskForm() {
    
    const { tid,id } = useParams();
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const message = id ? "Se ha actualizado la tarea!" : "Se ha guardado la tarea!"
    const title = id ? "Actualizar tarea" : "Añadir nueva tarea";
    const type = id ? "actualizar" : "agregar";
    const validate = (fieldValues = values) => {
        let temp = { ...errors }        
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "Este campo es obligatorio."
        if ('diasNecesarios' in fieldValues)
            temp.diasNecesarios = fieldValues.diasNecesarios ? "" : "Este campo es obligatorio."
            
        setErrors({
            ...temp
        })        
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    useEffect(() => {
        let unmounted = false;
        if (id)
            getTask();
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


    const getTask = async () => {
        setLoading(true);
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/showtask/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                onDownloadProgress: (data) => {
                    //Set the progress value to show the progress bar                    
                    setProgress(Math.round((100 * data.loaded) / data.total));
                },
            });
            setValues(response.data.task);
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
    } = useForm(initialBValues, true, validate);

    const confirmPost = () => {
        setOpen(true);
        setLoading(false);
        if(!id){
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
                        .patch(`${process.env.REACT_APP_API_URL}/api/private/task/${id}/${tid}`, values, config)
                        .then(confirmPost)
                    await axios.patch(`${process.env.REACT_APP_API_URL}/api/private/updatePercentage/${tid}`, values, config)
                } else {
                    await axios
                        .post(process.env.REACT_APP_API_URL + `/api/private/task/${tid}`, values, config)
                        .then(confirmPost)
                    await axios.patch(`${process.env.REACT_APP_API_URL}/api/private/updatePercentage/${tid}`, values, config)
                        
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

        }
    }
    
    //ACTUALIZAR
    if(id){
    return (
        
        <div>
            <PageHeader
                title={title}
                subTitle={`Formulario para ${type} una tarea`}
                icon={<EcoIcon fontSize="large" color='primary'
                />}
            />
            <CircularStatic progress={progress} hidden={!loading} />
            <Paper className={classes.pageContent}>                
                <Form onSubmit={handleSubmit}>
                    <AlertMessage errorMessage={error} successMessage={message} openMessage={open}/>
                    <Grid container>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="name"
                                label="Nombre"
                                value={values.name}
                                onChange={handleInputChange}
                                error={errors.name}
                            />
                            <Controls.Input
                                label="Descripción"
                                name="description"
                                value={values.description}
                                onChange={handleInputChange}
                                error={errors.description}
                            />
                            <Controls.Input
                                label="DiasCompletados"
                                name="diasCompletados"
                                value={values.diasCompletados}
                                onChange={handleInputChange}
                                error={errors.diasCompletados}
                            />

                        </Grid>
                        <Grid item xs={6}>
                            <Controls.Checkbox
                                name="isTimeSeries"
                                label="Tarea terminada"
                                value={values.isTimeSeries}
                                onChange={handleInputChange}
                                title="Se presentará como tarea terminada al marcar la casilla, de lo contrario se presentará como una tarea incompleta."
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

    //CREAR
    else{

        return (
        
            <div>
                <PageHeader
                    title={title}
                    subTitle={`Formulario para ${type} una tarea`}
                    icon={<EcoIcon fontSize="large" color='primary'
                    />}
                />
                <CircularStatic progress={progress} hidden={!loading} />
                <Paper className={classes.pageContent}>                
                    <Form onSubmit={handleSubmit}>
                        <AlertMessage errorMessage={error} successMessage={message} openMessage={open}/>
                        <Grid container>
                            <Grid item xs={6}>
                                <Controls.Input
                                    name="name"
                                    label="Nombre"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.name}
                                />
                                <Controls.Input
                                    label="Descripción"
                                    name="description"
                                    value={values.description}
                                    onChange={handleInputChange}
                                    error={errors.description}
                                />
                                <Controls.Input
                                    label="Dias necesarios"
                                    name="diasNecesarios"
                                    value={values.diasNecesarios}
                                    onChange={handleInputChange}
                                    error={errors.diasNecesarios}
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
}
