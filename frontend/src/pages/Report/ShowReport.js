import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import axios from "axios";
import defaultImg from '../../assets/img/defaultImg.jpeg'
import { CSVDownloader } from 'react-papaparse'
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';

import Controls from "../../components/controls/Controls";

const useStyles = makeStyles(theme => ({
    cardContainer: {
        width: 800,
        justifyContent: "center",
        alignItems: "center"
    },
    media: {
        height: 300,
    },
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
    row: {
        '& > *': {
            fontSize: 18
        }
    },
    buttonheader: {
        display: 'flex'

    },
    reportholder: {
        height: 40,
        textAlign: 'center',
        width: '90%'
    },
    button: {
        background: '#4287f5',
        color: '#FFFFFF'
    },
    pageContent: {
        width: '90%',
        margin: '50px 0 0 0',
        padding: theme.spacing(3),
    },
    center: {
        display: 'flex',
        textAlign: 'center'
    },
}));

const initialValue = {
    name: '',
    description: '',
    isTimeSeries: true,
    notesReport: '',
    cost:0,
    valuesReport: '',
    data: ''
}


export default function ShowReports() {
    const [report, setReport] = useState(initialValue);
    const { name, description,isTimeSeries, projects,notesReport, cost, valuesReport,data } = report;
    const [toExport, setExport] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);

    const classes = useStyles();
    const { id } = useParams();
    useEffect(async () => {
        let unmounted = false;
        await getReport();
        return () => { unmounted = true; };
    }, []);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    const getReport = async () => {
        try {
            console.log(id)
            setLoading(true);
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/showreport/${id}`, config);
            setReport(response.data.report);
            let data = response.data.report;
            setExport([
                {id: data.id,
                name: data.name,
                description: data.description,
                isTimeSeries: data.isTimeSeries,
                notesReport: data.notesReport,
                cost: data.cost,
                valuesReport: data.valuesReport,
                data: data.data
            }])
            
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
    return (

        <div className={classes.root}>
            <div className={classes.reportholder} hidden={!loading}>
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: '0m',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>
                <br />
            </div>

            <PageHeader
                title="Información detallada sobre un reporte"
                icon={<InfoIcon fontSize="large"
                />}
            />
            <br />
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ width: "90%" }}
            >
                <Card className={classes.cardContainer}>

                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {name ? name : ''}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" component="p">
                            {description ? description : ''}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" component="p">
                            {cost ? cost : '0'}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" component="p">
                            {valuesReport ? valuesReport : 'No hay valores'}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" component="p">
                            {data ? data : 'No hay datos'}
                        </Typography>



                    </CardContent>
                    <CardActions>
                        {/* <Tooltip title="Exportar programa">
                            <div className={classes.iconContainer}>
                                <CSVDownloader
                                    data={toExport}
                                    filename={'program'}
                                    config={{}}
                                >
                                    <DownloadIcon fontSize={'medium'} color={'success'} />
                                </CSVDownloader>
                            </div>
                        </Tooltip> */}
                    </CardActions>
                </Card>
            </Grid>
            <br />
        </div>
    );
}