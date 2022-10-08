import React, { useState, useEffect } from 'react';
import PageHeader from "../../components/PageHeader";
import BiotechIcon from '@mui/icons-material/Biotech';
import { Paper, Grid, makeStyles } from '@material-ui/core'
import ProjectSelector from './ProjectSelector';
import ProgramSelector from './ProgramSelector';
import DateRangeSelector from './DateRangeSelector';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Controls from "../../components/controls/Controls";
import { Link } from 'react-router-dom';
import EcoIcon from '@material-ui/icons/Eco';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { addPrediction } from '../../services/predictionService';

const useStyles = makeStyles((theme) => ({
    table: {
        width: '90%',
        margin: '50px 0 0 0'
    },
    thead: {
        '& > *': {
            fontSize: 20,
            background: '#8ade8f',
            color: '#FFFFFF'
        }
    },
    head: {
        fontSize: 20,
        background: '#8ade8f',
        color: '#FFFFFF'

    },
    row: {
        '& > *': {
            fontSize: 18
        }
    },
    buttonheader: {
        display: 'flex'

    },
    programholder: {
        height: 40,
        textAlign: 'center'
    },
    programholderLoading: {
        height: 40,
        textAlign: 'center',
        width: '90%'
    },
    button: {
        background: '#4287f5',
        color: '#FFFFFF',
        justifyContent: 'center'
    },
    paper: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 8
    },

}));

export default function Predictor() {
    const classes = useStyles();
    const [project, setProject] = useState("");
    const [program, setProgram] = useState("");
    const [initialDate, setInitialDate] = useState("");
    const [finalDate, setFinalDate] = useState("");

    const [projectName, setProjectName] = useState("");
    const [programName, setProgramName] = useState("");

    useEffect(() => {
        setProgram("");
        setProgramName("");
    }, [project]);

    const handleSubmit = async e => {
        e.preventDefault()
        if(initialDate !== "" && finalDate !== "" && project !== "" && program !== ""){
            let values = {
                projectID: project,
                programID: program,
                initialDate: initialDate,
                finalDate: finalDate
            }
            console.log(values);
            addPrediction(values);

        }else{
            console.log("Error: Falta al menos un dato")
        }
    }

    return (
        <div>
            <PageHeader
                title="Realizar Predicción"
                subTitle="Siga los pasos encontrados en esta página, al finalizar, dirijase al botón al final de la página."
                icon={<BiotechIcon fontSize="large"
                />}
            />
            <br />
             <PageHeader
                title="Elija un proyecto"
                subTitle="Elija el bióproceso al que le desea hacer una predicción."
                icon={<EcoIcon fontSize="large"
                />}
            />
            <ProjectSelector setProject={setProject} setProjectName={setProjectName}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h5" align="center">proyecto Seleccionado:</Typography>
                        <Typography variant="h6" align="center">{projectName}</Typography>
                    </Box>
                </Paper>

            </Grid>
            <br />
            <PageHeader
                title="Elija un programa"
                subTitle="Elija el programa realacionado al proyecto seleccionado al que le desea hacer una predicción."
                icon={<LocationOnIcon fontSize="large"
                />}
            />
            <ProgramSelector id={project} setProgram={setProgram} setProgramName={setProgramName}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h5" align="center">Programa Seleccionado:</Typography>
                        <Typography variant="h6" align="center">{programName}</Typography>
                    </Box>
                </Paper>

            </Grid>
            <br />
            <PageHeader
                title="Elija un rango de fechas"
                subTitle="Los datos encontrados en este rango de fecha serán utilizados para realizar la predicción."
                icon={<CalendarTodayIcon fontSize="large"
                />}
            />
            <br />
            <DateRangeSelector setInitialDate={setInitialDate} setFinalDate={setFinalDate}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h5" align="center">Datos a utilizar para la predicción:</Typography>
                        <Typography variant="h6" align="center">proyecto: {projectName}</Typography>
                        <Typography variant="h6" align="center">Programa: {programName}</Typography>
                        <Typography variant="h6" align="center">FechaInicial: {initialDate}</Typography>
                        <Typography variant="h6" align="center">FechaFinal: {finalDate}</Typography>
                    </Box>
                    <Box textAlign='center'>
                        <Controls.Button color="primary" variant="contained" onClick={handleSubmit} text="Realizar Predicción"/>
                    </Box>

                </Paper>

            </Grid>
            <br />

        </div>
    )
}
