import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import AlertMessage from '../../components/AlertMessage';
import Controls from "../../components/controls/Controls";
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

export default function ProjectSelector({setProject, setProjectName}) {

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleParentData = (bio, bioName) => {
        setProject(bio);
        setProjectName(bioName);
    }

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

    function wrapValues(projects) {
        setProjects(projects);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        setOpenDialog(false);
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllProjects() {
        try {
            setLoading(true);
            const projects = await axios.get(
                process.env.REACT_APP_API_URL + "/api/private/project",
                config
            );
            wrapValues(projects.data.projects);


        } catch (error) {
            setLoading(false);
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            setLoading(false);
            return setError("Authentication failed!");
        }
    }
    useEffect(() => {
        let unmounted = false;
        getAllProjects();
        return () => { unmounted = true; };
    }, []);


    return (
        <div>
            <Paper className={classes.table}>
                <AlertMessage errorMessage={error} successMessage={""} openMessage={open} />
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>
                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell>{i18n.t('vieworg7')}</TableCell>
                                <TableCell>{i18n.t('programselector6')}</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell className={classes.programholder}>{i18n.t('programselector7')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                                <TableRow hover className={classes.row} key={project.id}>
                                    <TableCell>{project.name}</TableCell>
                                    <TableCell>
                                        <Controls.Checkbox
                                            name="isTimeSeries"
                                            label=""
                                            value={project.isTimeSeries}
                                            disabled={true}
                                        />
                                    </TableCell>
                                    <TableCell>{project.type === 'regresion' ? 'Regresión' : 'Clasificación'}</TableCell>
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title="Seleccionar">
                                                <Button color="primary" variant="contained" style={{ marginRight: 10 }}onClick={() => handleParentData(project._id, project.name)}><CheckIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title="Información">
                                                <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/project/show/${project._id}`}><InfoIcon /></Button>
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
