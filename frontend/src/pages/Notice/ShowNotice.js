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
    noticeholder: {
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
    entrada: '',
    image: '',
    projects: [],
    date: '',
}


export default function ShowProjects() {
    const [notice, setNotice] = useState(initialValue);
    const { name, entrada, image,date } = notice;
    const [toExport, setExport] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);

    const classes = useStyles();
    const { id } = useParams();
    useEffect(async () => {
        let unmounted = false;
        await getNotice();
        return () => { unmounted = true; };
    }, []);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    const getNotice = async () => {
        try {
            setLoading(true);
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/notice/${id}`, config);
            setNotice(response.data.notice);
            let data = response.data.notice;
            setExport([
                {id: data.id,
                name: data.name,
                entrada: data.entrada,
                date: date.datae,
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
            <div className={classes.noticeholder} hidden={!loading}>
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
                title="Información detallada sobre una noticia"
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

                    <CardMedia
                        className={classes.media}
                        image={image ? image : defaultImg}
                        title="Noticia"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Título: {name ? name : ''}
                        </Typography>
                    </CardContent>

                    <CardActions>
                        <Typography variant="subtitle1" color="primary" component="p">
                            <span>Noticia: </span>
                            {entrada ? entrada : ''}
                        </Typography>
                    </CardActions>

                    <CardActions>
                        <Typography variant="subtitle1" color="primary" component="p">
                            <span>Fecha: </span>
                            {date ? date : 'No hay información'}
                        </Typography>
                    </CardActions>
                    <CardActions>
                        {/* <Tooltip title="Exportar notice">
                            <div className={classes.iconContainer}>
                                <CSVDownloader
                                    data={toExport}
                                    filename={'notice'}
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