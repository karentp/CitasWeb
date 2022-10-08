import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { deleteReport } from '../../services/reportService';
import Controls from "../../components/controls/Controls";
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/'
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

import { useParams } from 'react-router-dom';



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
        background: '#8ade8f',

    },
    iconContainer: {
        color: 'white',
        textDecoration: 'none',
    }

}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function ViewReport() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const { id } = useParams();
    const [reports, setReports] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [reportId, setReportId] = React.useState('');
    const [openDialogAbandon, setOpenDialogAbandon] = useState(false);
    const [currentUserRoles, setCurrentUserRoles] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    const classes = useStyles();

    function wrapValues(reports) {
        setReports(reports);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        deleteReportData();
        setOpenDialog(false);
    }

    const handleCloseAbandon = () => {
        setOpenDialogAbandon(false);
    };

    const handleAcceptAbandon = () => {
        abandonReport();
        setOpenDialogAbandon(false);
    };

    const headers = [
        { label: 'id', key: 'id' },
        { label: 'Descripción', key: 'description' },
        { label: 'Notas', key: 'notesReport' },
        { label: 'Costo', key: 'cost' },
        { label: 'Valores Obtenidos', key: 'valuesReport' },
        { label: 'Datos', key: 'data' }

    ]

    const csvReport = {
        filename: 'Reports.csv',
        headers: headers,
        data: reports
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllReports() {
        try {
            const reports = await axios.get(
                process.env.REACT_APP_API_URL + `/api/private/filteredreport/${id}`,
                config
                
            );
                    
            const currentUser = await getUsers(localStorage.getItem("uid"));
            if(currentUser.data.user.type === "admin"){
                
                wrapValues(reports.data.reports);
                setIsAdmin(true);

            }else{
                setCurrentUserRoles(currentUser.data.user.roles);
                let permittedReports = [];
                
                currentUser.data.user.roles.forEach(element => {
                    permittedReports.push(element.reportId);
                });

                console.log(permittedReports);

                let valuesToWrap = [];

                reports.data.reports.forEach(element => {
                    if(permittedReports.includes(element._id)){
                        valuesToWrap.push(element);
                    }
                });
                wrapValues(valuesToWrap);
            }
            
            


        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
        

    }
    useEffect(() => {
        let unmounted = false;
        getAllReports();
        return () => { unmounted = true; };
        

    }, []);

    const deleteReportData = async () => {
        try {
            let response =  await deleteReport(reportId);
            getAllReports();
        } catch (error) {
            setOpen(true);
            setError(error.message);
            setTimeout(function () {
                setOpen(false);
                setError("");
            }, 3000);
        }

    }

    const abandonReport = async () => {
        let newRoles = []
        currentUserRoles.forEach(element => {
            if(element.reportId !== reportId){
                newRoles.push(element);
            }
        });

        editRoles(localStorage.getItem("uid"), newRoles);
        getAllReports();
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
                <DialogTitle id="alert-dialog-slide-title">{"¿Desea borrar este reporte?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Esta decisión no es reversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleAccept} color="secondary">
                        Eliminar
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
                <DialogTitle id="alert-dialog-slide-title">{"¿Desea abandonar este reporte?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Esta decisión no es reversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAbandon} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleAcceptAbandon} color="secondary">
                        Abandonar
                    </Button>
                </DialogActions>
            </Dialog>

            <PageHeader
                title="Gestión de Reportes"
                subTitle="Sección para la administración de reportes"
                icon={<InfoIcon fontSize="large"
                
                />}
            />


            

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
                    {/* <div className={classes.test}>
                    <CSVDownloader
                        data= {reports}
                        filename={'reports'}
                        config={{}}
                    > Download</CSVDownloader>
                    </div> */}
                    <Grid
                        container
                        direction="row"
                        className={classes.csvContainer}
                    >
                        <Tooltip title="Exportar reportes">
                            <div className={classes.iconContainer}>
                                <CSVLink {...csvReport} style={{color:'white', marginLeft: '10px'}}> 
                                    
                                </CSVLink>
                            </div>
                        </Tooltip>
                    </Grid>
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>

                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell className={classes.cell}>Nombre</TableCell>
                                <TableCell className={classes.cell}></TableCell>
                                <TableCell className={classes.programholder} style={{paddingTop: '0px'}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report) => (
                                <TableRow hover className={classes.row} key={report.id}>
                                    <TableCell>{report.name}</TableCell>
                                    
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                        </Grid>
                                    </TableCell>

                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title="Editar">
                    
                                                <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/report/update/${report._id}/${id}`}><ModeEditIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title="Información">
                                                <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/report/show/${report._id}`}><InfoIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <Button color="secondary" variant="contained" style={{ marginRight: 10 }}  onClick={() => {
                                                    setOpenDialog(true); setReportId(report._id);
                                                }}><DeleteIcon /></Button>
                                            </Tooltip>
                                            {!isAdmin &&
                                                <Tooltip title="Abandonar reporte">
                                                    <Button color="warning" variant="contained" onClick={() => {
                                                        setOpenDialogAbandon(true); setReportId(report._id);
                                                    }}><LogoutIcon /></Button>
                                                </Tooltip>
                                            }
                                            
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
                    count={reports.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}

            >
                <Controls.Button color="primary" variant="contained" component={Link} to={`/report/create/${id}`} text="Crear reporte" />
            
            </Grid>
        </div>
    )
}
