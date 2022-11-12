import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab/';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import axios from "axios";
import DeleteIcon from '@material-ui/icons/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { deleteNotice } from '../../services/noticeService';
import Controls from "../../components/controls/Controls";
import { CSVLink } from "react-csv"
import DownloadIcon from '@mui/icons-material/Download';
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
    buttonheader: {
        display: 'flex'

    },
    noticeholder: {
        height: 40,
        textAlign: 'center'
    },
    noticeholderLoading: {
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



export default function ViewNotice() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [notices, setNotices] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const [noticeId, setNoticeId] = React.useState('');;

    const classes = useStyles();

    function wrapValues(notices) {
        setNotices(notices);
        setLoading(false);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        deleteNoticeData()
        setOpenDialog(false);
    }

    const headers = [
        { label: 'id', key: 'id' },
        { label: 'Nombre', key: 'name' },
        { label: 'Objetivos', key: 'entrada' },
    ]

    const csvReport = {
        filename: 'Notices.csv',
        headers: headers,
        data: notices
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getAllNotices() {
        try {
            const notices = await axios.get(
                process.env.REACT_APP_API_URL + "/api/private/notice",
                config
            );
            wrapValues(notices.data.notices);
        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
    }
    useEffect(async () => {
        let unmounted = false;
        await getAllNotices();
        return () => { unmounted = true; };
    }, []);

    const deleteNoticeData = async () => {
        try {
            await deleteNotice(noticeId);
            getAllNotices();
        } catch (error) {
            setOpen(true);
            setError(error.message);
            setTimeout(function () {
                setOpen(false);
                setError("");
            }, 3000);
        }

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
                <DialogTitle id="alert-dialog-slide-title">{i18n.t('viewnotice1')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {i18n.t('viewfactors2')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {i18n.t('viewfactors3')}
                    </Button>
                    <Button onClick={handleAccept} color="secondary">
                        {i18n.t('viewfactors4')}
                    </Button>
                </DialogActions>
            </Dialog>


            <PageHeader
                title={i18n.t('viewnotice2')}
                subTitle={i18n.t('viewnotice3')}
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
                        <Typography variant="h6" align="center">{i18n.t('viewnotice5')}</Typography>

                    </Box>
                    <Box textAlign='center'>
                        <Controls.Button color="primary" variant="contained" component={Link} to={`/notice/create/`} text={i18n.t('viewnotice4')} />
                    </Box>
                </Paper>

            </Grid>

            <div className={classes.noticeholderLoading} hidden={!loading}>
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
            <Collapse in={open}>
                <Alert

                    severity={error ? "error" : "success"}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <AlertTitle>{error ? error : "Success!"}</AlertTitle>
                    {error}
                </Alert>
            </Collapse>
            <Paper className={classes.table}>
                <TableContainer >
                    <Grid
                        container
                        direction="row"
                        className={classes.csvContainer}
                    >
                        <Tooltip title={i18n.t('viewnotice6')}>
                            <div className={classes.iconContainer}>
                                <CSVLink {...csvReport} style={{ color: 'white', marginLeft: '10px' }}>
                                    <DownloadIcon fontSize={'large'} />
                                </CSVLink>
                            </div>
                        </Tooltip>
                    </Grid>
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>
                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell>Título de la noticia</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell className={classes.noticeholder}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((notice) => (
                                <TableRow hover className={classes.row} key={notice.id}>
                                    <TableCell>{notice.name}</TableCell>
                                    <TableCell>{notice.date}</TableCell>
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title={i18n.t('viewnotice7')}>
                                                <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/notice/update/${notice._id}`}><ModeEditIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title={i18n.t('viewevidene12')}>
                                                <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/notice/show/${notice._id}`}><InfoIcon /></Button>
                                            </Tooltip>
                                            <Tooltip title={i18n.t('viewevidence13')}>
                                                <Button color="secondary" variant="contained" onClick={() => {
                                                    setOpenDialog(true); setNoticeId(notice._id);
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
                    count={notices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}
