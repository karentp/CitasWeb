import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableCell,
  Paper,
  TableRow,
  TableBody,
  Button,
  makeStyles,
  CssBaseline,
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@material-ui/core/Typography';
import i18n from '../../i18n';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    width: 800,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    height: 300,
  },
  table: {
    width: "90%",
    margin: "50px 0 0 0",
  },
  thead: {
    "& > *": {
      fontSize: 20,
      background: "#8ade8f",
      color: "#FFFFFF",
    },
  },
  row: {
    "& > *": {
      fontSize: 18,
    },
  },
  buttonheader: {
    display: "flex",
  },
  programholder: {
    height: 40,
    textAlign: "center",
  },
  button: {
    background: "#4287f5",
    color: "#FFFFFF",
  },
  pageContent: {
    width: "90%",
    margin: "50px 0 0 0",
    padding: theme.spacing(3),
  },
  center: {
    display: "flex",
    textAlign: "center",
  },
  horizmenu: {
    display: "inline-block",
  },
  textLeft: {
    marginLeft: "0",
    paddingLeft: "0",
  },
}));

export default function ProgramSelector({id, setProgram, setProgramName}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [programsBio, setProgramsBio] = React.useState([]);
  const [isProgramsBio, setIsProgramsBio] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");

  const handleParentData = (pl, plName) => {
    setProgram(pl);
    setProgramName(plName);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  useEffect(() => {
    let unmounted = false;
    getProgramsBio();
    return () => { unmounted = true; };
  }, [id]);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const getProgramsBio = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/private/programproject/${id}`,
        config
      );
      setProgramsBio(response.data.programs);
      setLoading(false);
      if (response.data.programs.length > 0) setIsProgramsBio(true);
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
  };


  

  return (
    <div>
      <div className={classes.root}>
        <div hidden={!isProgramsBio}>
          <CssBaseline />
          <div className={classes.programholder} hidden={!loading}>
            <Fade
              in={loading}
              style={{
                transitionDelay: "0m",
              }}
              unmountOnExit
            >
              <CircularProgress />
            </Fade>
            <br />
          </div>
          <Paper className={classes.table}>
            <TableContainer>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.container}
              >
                <TableHead>
                  <TableRow className={classes.thead}>
                    <TableCell>{i18n.t('vieworg7')}</TableCell>
                    <TableCell>{i18n.t('programselector1')}</TableCell>
                    <TableCell>{i18n.t('programselector2')}</TableCell>
                    <TableCell className={classes.programholder}>
                      {i18n.t('programselector2')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {programsBio
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((program) => (
                      <TableRow hover className={classes.row} key={program.id}>
                        <TableCell>{program.name}</TableCell>
                        <TableCell>{program.objetivesProgram}</TableCell>
                        <TableCell>{program.definitionProgram}</TableCell>
                        <TableCell>
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                          >
                              <Tooltip title="Seleccionar">
                              <Button
                                color="primary"
                                variant="contained"
                                style={{ marginRight: 10 }}
                                onClick={() => handleParentData(program._id, program.name)}
                              >
                                <CheckIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title={i18n.t('vieworg11')}>
                              <Button
                                className={classes.button}
                                variant="contained"
                                style={{ marginRight: 10 }}
                                component={Link}
                                to={`/program/show/${program._id}`}
                              >
                                <InfoIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title={i18n.t('programselector4')}>
                              <Button
                                color="inherit"
                                variant="contained"
                                style={{ marginRight: 10 }}
                                component={Link}
                                to={`/data/show/${id}/${program._id}`}
                              >
                                <VisibilityIcon />
                              </Button>
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
              count={programsBio.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <div className={classes.programholder} hidden={isProgramsBio}>
          <br />
          <Typography variant="subtitle1" color="textSecondary" component="p">
            {i18n.t('programselector5')}
          </Typography>
        </div>
      </div>
    </div>
  );
}
