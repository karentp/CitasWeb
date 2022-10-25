import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { deleteUser } from '../../services/userService';
import Controls from "../../components/controls/Controls";
import DeleteIcon from '@material-ui/icons/Delete';
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
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from "axios";
import AlertMessage from '../../components/AlertMessage';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Modal from '@mui/material/Modal';
import AssignPermission from './AssignPermission';
import Test from './Test';
import { resolveCname } from 'dns';

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


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function ViewUsers() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const uid = localStorage.getItem("uid");
    const [users, setUsers] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [userId, setUserId] = React.useState('');;
    const [openUser, setOpenUser] = React.useState(false);
    const handleOpenUser = () => setOpenUser(true);
    const handleCloseUser = () => setOpenUser(false);

    const classes = useStyles();

    function wrapValues(users) {
        setUsers(users);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        deleteUserData()
        setOpenDialog(false);
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllUsers() {
        try {
            const users = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/allUsers/${uid}`,
                config
            );
            wrapValues(users.data.users);


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
        getAllUsers();
        return () => { unmounted = true; };
    }, []);

    const deleteUserData = async () => {
        try {
            let response = await deleteUser(userId);
            getAllUsers();
        } catch (error) {
            setOpen(true);
            setError(error.message);
            setTimeout(function () {
                setOpen(false);
                setError("");
            }, 3000);
        }


    }

    function roleName(role) {
      if(role === 'admin') return "Administrador";
      if(role === 'user') return "Usuario";
      if(role === 'gestor') return "Gestor de Laboratorio";
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
                <DialogTitle id="alert-dialog-slide-title">{"¿Desea borrar este usuario?"}</DialogTitle>
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


            <PageHeader
                title="Información sobre los usuarios"
                subTitle="Acá se muestran todos los usuarios en el sistema"
                icon={<InfoIcon fontSize="large"
                />}
            />

            <AssignPermission userId = {userId} openM={openUser}
            onClose={handleCloseUser}/>


            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.table}
            >
                <Paper className={classes.paper} elevation={3}>
                    <Box sx={{ width: 'auto' }} padding>
                        <Typography variant="h6" align="center">¿Se necesita un nuevo usuario?</Typography>

                    </Box>
                    <Box textAlign='center'>
                        <Controls.Button color="primary" variant="contained" component={Link} to={`/register/`} text="Crear usuario" />
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
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>
                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell className={classes.programholder}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                <TableRow hover className={classes.row} key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{roleName(user.type)}</TableCell>
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title="Información">
                                                <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/profile/${user._id}`}><InfoIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <Button color="secondary" variant="contained" onClick={() => {
                                                    setOpenDialog(true); setUserId(user._id);
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
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}
