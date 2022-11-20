import { CircularProgress } from "@mui/material";
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, makeStyles, CssBaseline, Grid } from '@material-ui/core'
import PageHeader from "../../components/PageHeader";
import TableContainer from '@material-ui/core/TableContainer';
import { useParams } from 'react-router-dom';
import TablePagination from '@material-ui/core/TablePagination';
import React, { useEffect, useState } from "react";
import Fade from '@material-ui/core/Fade';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
import i18n from '../../i18n';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
    programholder: {
        height: 40,
        textAlign: 'center',
        width: '90%',
        margin: '50px 0'
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

export default function ProgramsOfUser() {
    const { userId } = useParams();

    const [isLoading, setIsLoading] = useState(true)
    const [programs, setPrograms] = useState([])
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
        loadProgramsOfUser()
    }, [isLoading]);

    const loadProgramsOfUser = async () => {
        try 
        {
            let response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/users/${userId}`,
                config
            )
            setPrograms(response.data.user.roles)
            setIsLoading(false)
        }
        catch 
        {
            console.log("There was an error loading the programs of the user.");
        }
    }

    const deleteProgramFromUser = async (program) => {
        try 
        {
            setIsLoading(true)

            let response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/users/${userId}`,
                config
            )

            let userData = response.data.user
            let newRoles = []
            for (let i = 0; i < programs.length; ++i)
            {
                if (programs[i].projectId == program.projectId &&
                    programs[i].projectName == program.projectName &&
                    programs[i].role == program.role)
                    {
                    }
                    else 
                    {
                        newRoles.push(programs[i])
                    }
            }
            userData.roles = newRoles

            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/private/users/${userId}`,
                userData,
                config
            )

            loadProgramsOfUser()
        }
        catch (error) 
        {
            console.log("There was an error removing the program from the user. The error is:")
            console.log(error)
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
            
            <div hidden={isLoading}>
                <Paper className={classes.table}>
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table" className={classes.container}>
                            <TableHead>
                                <TableRow className={classes.thead}>
                                    <TableCell>{i18n.t('programper4')}</TableCell>
                                    <TableCell>{i18n.t('programper5')}</TableCell>
                                    <TableCell className={classes.programholder}>{i18n.t('programper6')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {programs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((program) => (
                                    <TableRow hover className={classes.row}>
                                        <TableCell>{program.projectName}</TableCell>
                                        <TableCell>{program.role}</TableCell>
                                        <TableCell>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Tooltip title={i18n.t('register10')}>
                                                    <Button color="secondary" variant="contained" onClick={() => {
                                                        deleteProgramFromUser(program)
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
                        count={programs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </div>
    )
}