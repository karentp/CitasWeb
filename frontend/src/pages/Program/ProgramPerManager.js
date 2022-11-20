import { CircularProgress } from "@mui/material";
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import React, { useEffect, useState } from "react";
import Fade from '@material-ui/core/Fade';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
import i18n from '../../i18n';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles(theme => ({
    programholder: {
        height: 40,
        textAlign: 'center',
        width: '90%'
    },
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
    button: {
        background: '#4287f5',
        color: '#FFFFFF',
        justifyContent: 'center'
    },
    row: {
        '& > *': {
            fontSize: 18
        }
    },
}))

export default function LabsPerManager() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const classes = useStyles();
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    useEffect(() => {
        loadUsers()
    }, [isLoading]);

    const loadUsers = async () => {
        try
        {
            let response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/gestores`,
                config
            )
            console.log("Managers read from DB: ");
            console.log(response.data.users)
            setUsers(response.data.users)
            setIsLoading(false)
        }
        catch (error) 
        {
            console.log("There was an error loading the users. The error is: " + error)
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            <PageHeader
                title={i18n.t('programper2')}
                subTitle={i18n.t('programper3')}
                icon={<InfoIcon fontSize="large"
                />}
            />

            <div className={classes.programholder} hidden={!isLoading}>
                <Fade
                    in={isLoading}
                    style={{
                        transitionDelay: '0m',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>
                <br />
            </div>
            
            <Paper className={classes.table}>
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table" className={classes.container}>
                        <TableHead>
                            <TableRow className={classes.thead}>
                                <TableCell>{i18n.t('assignrole5')}</TableCell>
                                <TableCell>{i18n.t('orgform2')}</TableCell>
                                <TableCell className={classes.programholder}>{i18n.t('programper1')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                <TableRow hover className={classes.row} key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Tooltip title={i18n.t('register18')}>
                                                <Button className={classes.button} variant="contained" style={{ marginRight: 10 }} component={Link} to={`/program/user/${user._id}`}><InfoIcon /></Button>
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