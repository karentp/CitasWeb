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
import { getReports } from '../../services/reportService';


const predictionItems = [
    { id: 'regresion', title: 'Regresión lineal' },
    { id: 'clasificacion', title: 'Clasificación' },
]

const initialBValues = {
    name: '',
    description: '',
    isTimeSeries: false,
    projects: '',
    notesReport: '',
    cost: '',
    valuesReport: '',
    data: ''
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

export default function ReportForm() {
    
    const { tid,id } = useParams();
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const message = id ? "Se ha actualizado el proyecto!" : "Se ha guardado el proyecto!"
    const title = id ? "Actualizar reporte" : "Añadir nueva reporte";
    const type = id ? "actualizar" : "agregar";
    const validate = (fieldValues = values) => {
        let temp = { ...errors }        
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
        if ('description' in fieldValues)
            temp.description = fieldValues.description ? "" : "Este campo es obligatorio."
        if ('notesReport' in fieldValues)
            temp.notesReport = fieldValues.notesReport ? "" : "Este campo es obligatorio."
        if ('cost' in fieldValues)
            temp.cost = fieldValues.cost ? "" : "Este campo es obligatorio."
        if ('valuesReport' in fieldValues)
            temp.valuesReport = fieldValues.valuesReport ? "" : "Este campo es obligatorio."
        if ('data ' in fieldValues)
            temp.data  = fieldValues.data  ? "" : "Este campo es obligatorio."
            
        setErrors({
            ...temp
        })        
        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    useEffect(() => {
        let unmounted = false;
        if (id)
            getReport();
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


    const getReport = async () => {
        setLoading(true);
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/showreport/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                onDownloadProgress: (data) => {
                    //Set the progress value to show the progress bar                    
                    setProgress(Math.round((100 * data.loaded) / data.total));
                },
            });
            setValues(response.data.report);
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
                        .patch(`${process.env.REACT_APP_API_URL}/api/private/report/${id}/${tid}`, values, config)
                        .then(confirmPost)
                } else {
                    await axios
                        .post(process.env.REACT_APP_API_URL + `/api/private/report/${tid}`, values, config)
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

        }
    }
    return (
        
        <div>
            <PageHeader
                title={title}
                subTitle={`Formulario para ${type} un reporte`}
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
                            <Controls.TextArea
                                label="Análisis"
                                name="description"
                                value={values.description}
                                onChange={handleInputChange}
                                error={errors.description}
                            />

                        </Grid>

                        <Grid item xs={6}>
                        <Controls.Input
                                name="cost"
                                label="Costo"
                                value={values.cost}
                                onChange={handleInputChange}
                                error={errors.cost}
                                />
                            
                        </Grid>
                        <Controls.TextArea
                                label="Notas"
                                name="notesReport"
                                value={values.notesReport}
                                onChange={handleInputChange}
                                error={errors.notesReport}
                            />

                        </Grid>
                        <Grid item xs={6}>
                            <Controls.TextArea
                                name="data"
                                label="Datos"
                                value={values.data}
                                onChange={handleInputChange}
                                error={errors.data}
                            />
                            <Controls.TextArea
                                label="Valores obtenidos"
                                name="valuesReport"
                                value={values.valuesReport}
                                onChange={handleInputChange}
                                error={errors.valuesReport}
                            />

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
