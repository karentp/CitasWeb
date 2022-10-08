import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import InfoIcon from '@material-ui/icons/Info';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PageHeader from "../../components/PageHeader";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import axios from "axios";
import defaultImg from '../../assets/img/defaultImg.jpeg'
import defaultImgService from '../../assets/img/defaultImgService.jpeg'
import { CSVDownloader } from 'react-papaparse'
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { getPrograms } from '../../services/programService';

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
    programholder: {
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
    objetivesProgram: '',
    definitionProgram: '',
    image: '',
    projects: [],
}

const initialProyectValues = {
    name: '',
    description: '',
    objetives: '',
    justification: '',
    country: '',
    department: '',
    district: '',
    definition: '',
    isTimeSeries: true,
    image: '',
    programs: [],
    factors: []
}



export default function ProgramServices() {
    const [program, setProgram] = useState(initialValue);
    const { name, description, objetivesProgram, definitionProgram, image } = program;
    const [toExport, setExport] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);

    const [projects, setProjects] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    const classes = useStyles();
    const { id } = useParams();
    useEffect(async () => {
        let unmounted = false;
        await getProgram();
        return () => { unmounted = true; };
    }, []);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    

    const getProgram = async () => {
        try {
            setLoading(true);
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/program/${id}`, config);
            setProgram(response.data.program);
            let data = response.data.program;
            setExport([
                {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    objetivesProgram: data.objetivesProgram,
                    definitionProgram: data.definitionProgram,
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

    function wrapValues(projects) {
        setProjects(projects);
        setLoading(false);
    }

    const headers = [
        { label: 'id', key: 'id' },
        { label: 'Descripción', key: 'description' },
        { label: 'Precio', key: 'objectives' },
        { label: 'Justificación', key: 'justification' },
        { label: 'País', key: 'country' },
        { label: 'Departamento', key: 'department' },
        { label: 'Distrito', key: 'district' },
        { label: 'Definición', key: 'definition' },
        { label: 'Nombre', key: 'name' },
        { label: 'Percentage', key: 'percentage' }
    ]

    const csvReport = {
        filename: 'Projects.csv',
        headers: headers,
        data: projects
    }

    async function getAllProjects() {
        try {
            const projects = await axios.get(
                process.env.REACT_APP_API_URL + "/api/private/project",
                config
            );

            const currentProgram = await getPrograms(id);

            let valuesToWrap = [];

            projects.data.projects.forEach(element => {
                    if (currentProgram.data.program.name === element.laboratorio) {
                        console.log("Name: " + element.name + " objetives: " + element.objetives)
                        valuesToWrap.push(element);
                    }
                
            });

            wrapValues(valuesToWrap);

        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authenticatin failed!");
        }




    }

    useEffect(() => {
        let unmounted = false;
        getAllProjects();        
        return () => { unmounted = true; };
    }, []);

    return (

        <div className={classes.root}>
            <div className={classes.programholder} hidden={!loading}>
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
                title="Información detallada sobre un laboratorio"
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
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {name ? name : ''}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" component="p">
                            {description ? description : ''}
                        </Typography>
                    </CardContent>

                    <CardActions>
                        <Typography variant="subtitle1" color="primary" component="p">
                            <span>Teléfono:</span>
                            {objetivesProgram ? objetivesProgram : ''}
                        </Typography>
                    </CardActions>
                    <CardActions>
                        <Typography variant="subtitle1" color="primary" component="p">
                            <span>Correo Electrónico:</span>
                            {definitionProgram ? definitionProgram : ''}
                        </Typography>
                        
                    </CardActions>
                </Card>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="left"
                style={{ width: "100%" }}
                xs={12}
            >
                <Card className={classes.cardContainer} >

                    <CardContent >
                        <h3>Servicios Disponibles en este Laboratorio:</h3>
                   

                    </CardContent>


                </Card>
            </Grid>

            <br />
            <br />
            <br />
            
            <Grid container spacing={2}>
                {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                    <><Grid xs={4} className={classes.row} key={project.id}>
                        <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    alt="green iguana"
                                    height="140"
                                    image={project.image ? project.image : defaultImgService} />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {project.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Descripción: {project.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Precio: {project.objetives ? project.objetives : 0}
                                    </Typography>
                                </CardContent>

                                <CardActions>
                                    <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/project/book/${project._id}`}><ModeEditIcon />Agendar</Button>
                                </CardActions>
                            </Card>
                    </Grid><Grid  item xs={2} >
                            <h1></h1>
                        </Grid></>
                ))}

            </Grid>


        </div>
    );
}