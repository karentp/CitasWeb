import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { deleteProject } from '../../services/projectService';
import Controls from "../../components/controls/Controls";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from "axios";
import AlertMessage from '../../components/AlertMessage';
import { CSVLink } from "react-csv"
import DownloadIcon from '@mui/icons-material/Download';
import Download from '@mui/icons-material/Download';
import { jsonToCSV, CSVDownloader } from 'react-papaparse';
import {getUsers, editRoles} from '../../services/userService';
import { version } from 'react-dom/cjs/react-dom.development';
import { render } from "react-dom";
import i18n from '../../i18n';

const useStyles = makeStyles((theme) => ({
    table: {
        width: '90%',
        margin: '50px 0 0 0'
    },
    thead: {
        '& > *': {
            fontSize: 20,
            background: '#17c6f6',
            color: '#FFFFFF'
        }
    },
    head: {
        fontSize: 20,
        background: '#17c6f6',
        color: '#FFFFFF'

    },
    row: {
        '& > *': {
            fontSize: 18
        }
    },
    cell: {
        paddingTop: 0
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
        background: '#17c6f6',
        color: '#FFFFFF',
        justifyContent: 'center'
    },
    paper: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 8
    },
    csvContainer: {
        fontSize: 20,
        background: '#108EB0',

    },
    iconContainer: {
        color: 'white',
        textDecoration: 'none',
    }

}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function ViewProject() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [projects, setProjects] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [projectId, setProjectId] = React.useState('');
    const [openDialogAbandon, setOpenDialogAbandon] = useState(false);
    const [currentUserRoles, setCurrentUserRoles] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    const classes = useStyles();

    function wrapValues(projects) {
        setProjects(projects);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        deleteProjectData()
        setOpenDialog(false);
    }

    const handleCloseAbandon = () => {
        setOpenDialogAbandon(false);
    };

    const handleAcceptAbandon = () => {
        abandonProject();
        setOpenDialogAbandon(false);
    };

    const headers = [
        { label: 'id', key: 'id' },
        { label: 'Descripción', key: 'description' },
        { label: 'Precio', key: 'objetives' },
        { label: 'Justificación', key: 'justification' },
        { label: 'País', key: 'country' },
        { label: 'Departamento', key:'department' },
        { label: 'Distrito', key:'district' },
        { label: 'Definición', key:'definition' },
        { label: 'Nombre', key: 'name' },
        { label: 'Percentage', key: 'percentage' }
    ]

    const csvReport = {
        filename: 'Projects.csv',
        headers: headers,
        data: projects
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllProjects() {
        try {

            const projects = await axios.get(
                process.env.REACT_APP_API_URL + "/api/private/project",
                config
            );
            wrapValues(projects.data.projects);
            

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

    const deleteProjectData = async () => {
        try {
            let response = await deleteProject(projectId);
            getAllProjects();
        } catch (error) {
            setOpen(true);
            setError(error.message);
            setTimeout(function () {
                setOpen(false);
                setError("");
            }, 3000);
        }


    }

    const abandonProject = async () => {
        let newRoles = []
        currentUserRoles.forEach(element => {
            if(element.projectId !== projectId){
                newRoles.push(element);
            }
        });

        editRoles(localStorage.getItem("uid"), newRoles);
        getAllProjects();
    }

    
    
    return (
        
        <div className={classes.root}>
            <CssBaseline />
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{i18n.t('availability3')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {i18n.t('availability4')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {i18n.t('availability5')}
                    </Button>
                    <Button onClick={handleAccept} color="secondary">
                        {i18n.t('availability6')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDialogAbandon}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseAbandon}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{i18n.t('viewproject1')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {i18n.t('availability4')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAbandon} color="primary">
                        {i18n.t('availability5')}
                    </Button>
                    <Button onClick={handleAcceptAbandon} color="secondary">
                        {i18n.t('availability6')}   
                    </Button>
                </DialogActions>
            </Dialog>


            <PageHeader
                title={i18n.t('viewproject2')}
                subTitle={i18n.t('viewproject3')}
                icon={<InfoIcon fontSize="large"
                />}
            />


            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h6" align="center">{i18n.t('viewproject4')}</Typography>
                    </Box>
                    <Box textAlign='center'>
                        <Controls.Button color="primary" variant="contained" component={Link} to={`/project/create/`} text={i18n.t('viewproject5')} />
                    </Box>

                </Paper>

            </Grid>

            <div className={classes.programholderLoading} hidden={!loading}>
                <br />
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: '0m',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>

            </div>

            <Paper className={classes.table}>
                <AlertMessage errorMessage={error} successMessage={""} openMessage={open} />
                <TableContainer >
                    <Grid
                        container
                        direction="row"
                        className={classes.csvContainer}
                    >
                        <Tooltip title={i18n.t('viewproject6')}>
                            <div className={classes.iconContainer}>
                                <CSVLink {...csvReport} style={{color:'white', marginLeft: '10px'}}> 
                                    <DownloadIcon fontSize={'large'} />
                                </CSVLink>
                            </div>
                        </Tooltip>
                    </Grid>
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>

                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell className={classes.cell}>{i18n.t('availabilty12')}</TableCell>
                                <TableCell className={classes.cell}>{i18n.t('showproject3')}</TableCell>
                                <TableCell className={classes.cell}>{i18n.t('projectform1')}</TableCell>
                                <TableCell className={classes.programholder} style={{paddingTop: '0px'}}>{i18n.t('viewprogram12')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                                <TableRow hover className={classes.row} key={project.id}>
                                    <TableCell>{project.name}</TableCell>
                                    
                                    <TableCell>{project.description}</TableCell>
                                    <TableCell>{project.objetives}</TableCell>

                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title={i18n.t('viewprogram13')}>
                                                <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/project/update/${project._id}`}><ModeEditIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title={i18n.t('viewprogram14')}>
                                                <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/project/show/${project._id}`}><InfoIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title={i18n.t('viewprogram15')}>
                                                <Button color="secondary" variant="contained" style={{ marginRight: 10 }}  onClick={() => {
                                                    setOpenDialog(true); setProjectId(project._id);
                                                }}><DeleteIcon /></Button>
                                            </Tooltip>
                                            
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={projects.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}
