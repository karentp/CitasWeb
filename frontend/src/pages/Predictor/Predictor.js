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
import i18n from '../../i18n';

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
                title={i18n.t('predictor1')}
                subTitle={i18n.t('predictor2')}
                icon={<BiotechIcon fontSize="large"
                />}
            />
            <br />
             <PageHeader
                title={i18n.t('predictor3')}
                subTitle={i18n.t('predictor4')}
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
                        <Typography variant="h5" align="center">{i18n.t('predictor5')}</Typography>
                        <Typography variant="h6" align="center">{projectName}</Typography>
                    </Box>
                </Paper>

            </Grid>
            <br />
            <PageHeader
                title= {i18n.t('predictor6')}
                subTitle={i18n.t('predictor7')}
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
                        <Typography variant="h5" align="center">{i18n.t('predictor8')}</Typography>
                        <Typography variant="h6" align="center">{programName}</Typography>
                    </Box>
                </Paper>

            </Grid>
            <br />
            <PageHeader
                title={i18n.t('predictor9')}
                subTitle={i18n.t('predictor10')}
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
                        <Typography variant="h5" align="center">{i18n.t('predictor11')}</Typography>
                        <Typography variant="h6" align="center">{i18n.t('predictor12')} {projectName}</Typography>
                        <Typography variant="h6" align="center">{i18n.t('predictor13')} {programName}</Typography>
                        <Typography variant="h6" align="center">{i18n.t('predictor14')} {initialDate}</Typography>
                        <Typography variant="h6" align="center">{i18n.t('predictor15')} {finalDate}</Typography>
                    </Box>
                    <Box textAlign='center'>
                        <Controls.Button color="primary" variant="contained" onClick={handleSubmit} text={i18n.t('predictor16')}/>
                    </Box>

                </Paper>

            </Grid>
            <br />

        </div>
    )
}
