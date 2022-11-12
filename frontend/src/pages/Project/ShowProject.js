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
import Controls from "../../components/controls/Controls";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BarChartIcon from '@mui/icons-material/BarChart';
import ProgramIcon from '@material-ui/icons/Place';
import { Link } from 'react-router-dom';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { Table, TableHead, TableCell, Paper, TableRow, TableBody, Button, CssBaseline } from '@material-ui/core'
import { useForm, Form } from '../../components/useForm';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ViewFactors from '../Factors/ViewFactors';
import defaultImg from '../../assets/img/defaultImg.jpeg'
import { ScrollToTop } from '../../components/ScrollToTop'
import { CSVDownloader } from 'react-papaparse'
import DownloadIcon from '@mui/icons-material/Download';
import { getPermissions } from '../../services/userService';
import i18n from '../../i18n';

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
    textAlign: 'center'
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
  horizmenu: {
    display: 'inline-block'
  },
  textLeft: {
    marginLeft: '0',
    paddingLeft: '0'
  }
}));

const initialValue = {
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

const initialProgramValues = {
  name: '',
  description: '',
  objetivesProgram: '',
  definitionProgram: '',
  image: '',
  projects: []
}

const cleanProgram = {
  name: '',
  description: '',
  objetivesProgram: '',
  definitionProgram: '',
  image: '',
  projects: []
}


export default function ShowProjects() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [toExport, setExport] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [project, setProject] = useState(initialValue);
  const { name, description, objetives,justification, country,department,district,definition, isTimeSeries, percentage,totalDays,nowDays,totalTasks, image, programs, factors } = project;

  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = React.useState(true);
  const [loadingAso, setLoadingAso] = React.useState(false);
  const [programsBio, setProgramsBio] = React.useState([]);
  const [filteredPrograms, setFilteredPrograms] = React.useState([{ name: "" }]);
  const [isProgramsBio, setIsProgramsBio] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const [programImage, setImage] = React.useState("");
  const userType = localStorage.getItem("type");
  const [role, setRole] = useState();
  const classes = useStyles();
  const { id } = useParams();
  useEffect( async() => {

    let unmounted = false;
    setLoading(true);
    if(userType === "user"){
      const response = await getPermissions(localStorage.getItem("uid"), id);
      setRole(response?.data?.role);
    }
    await getProgramsBio();
    await getFilteredPrograms();
    await getProject();
    setLoading(false);
    return () => { unmounted = true; };
  }, []);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  async function beautifyFactors(){
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/private/factorproject/${id}`,
      config
    );
    let factorsExport = {};
    const factors = response.data.factors;
    for (const factor in factors){
      delete factors[factor]._id;
      delete factors[factor].__v;
      delete factors[factor].projectID;
      factorsExport[`factor${factor}`] = Object.entries(factors[factor]);
    }
    return factorsExport;
  }

  function beautifyPrograms(){
    let programsExport = {};
    for (const program in programsBio) {
      delete programsBio[program]._id;
      delete programsBio[program].__v;
      delete programsBio[program].projects;
      programsExport[`program${program}`] = Object.entries(programsBio[program]);
    }
    return programsExport;
  }

  async function beautifyCSV(projectP){

    const factors = await beautifyFactors();
    const programs = beautifyPrograms();
    let toExport = {
      id: projectP.id,
      name: projectP.name,
      description: projectP.description,
      objetives: projectP.objetives,
      justification: projectP.justification,
      country: projectP.country,
      department: projectP.department,
      district: projectP.district,
      definition: projectP.definition,
      isTimeSeries: projectP.isTimeSeries,
      percentage: projectP.percentage,
      totalDays: projectP.totalDays,
      nowDays: projectP.nowDays,
      totalTasks: projectP.totalTasks
    }
    toExport = Object.assign(toExport,programs);
    toExport = Object.assign(toExport,factors);
    setExport([toExport]);
  }

  const getProject = async () => {
    try {
      
      let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/project/${id}`, config);
      setProject(response.data.project);
      let data = response.data.project;
      
      beautifyCSV(data);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      return setError("Authentication failed!");
    }
  }


  const getProgramsBio = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/programproject/${id}`, config);
      setProgramsBio(response.data.programs);
      setLoading(false);
      if (response.data.programs.length > 0)
        setIsProgramsBio(true);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      return setError("Authentication failed!");
    }
  }

  const getFilteredPrograms = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/filteredprogram/${id}`, config);
      setFilteredPrograms(response.data.programs);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      return setError("Authentication failed!");


    }
  }

  const getPictureProgram = async (program) => {
    try {
      if (program) {
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/programPicture/${program.id}`, config);
        setImage(response.data.program.image);
      } else {
        setImage("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "Este campo es obligatorio."
    if ('description' in fieldValues)
      temp.description = fieldValues.description ? "" : "Este campo es obligatorio."
    if ('objetivesProgram' in fieldValues)
      temp.objetivesProgram = fieldValues.objetivesProgram ? "" : "Este campo es obligatorio."
    if ('definitionProgram' in fieldValues)
      temp.definitionProgram = fieldValues.definitionProgram ? "" : "Este campo es obligatorio."
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const addNewProgram = async () => {
    try {
      setLoadingAso(true);
      values.projects.push(id);
      return await axios.post(`${process.env.REACT_APP_API_URL}/api/private/program/`, values, config);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      setLoadingAso(false);
      return setError("Authentication failed!");
    }
  }

  const updateProgram = async () => {
    try {
      setLoadingAso(true);
      programValue.projects.push(id);
      return await axios.patch(`${process.env.REACT_APP_API_URL}/api/private/program/${programValue.id}`, programValue, config);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      setLoadingAso(false);
      return setError("Authentication failed!");
    }
  }

  const updateProject = async (program) => {
    try {
      setLoadingAso(true);
      project.programs.push(program._id);
      axios.patch(`${process.env.REACT_APP_API_URL}/api/private/project/${id}`, project, config);
      setLoadingAso(false);
    } catch (error) {
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setError("");
        }, 2000);

      }, 5000);
      setOpen(true);
      setLoadingAso(false);
      return setError("Authentication failed!");
    }
  }

  const associateProgram = async () => {
    await updateProgram().then(setLoadingAso(false));
    await updateProject(programValue).then(setLoadingAso(false));
    await getFilteredPrograms();
    await getProgramsBio();
    setProgramValue(filteredPrograms[0]);
    setInputValue('');
    setIsEmpty(true);
    confirmPost();
  }

  const wrapProgram = async (program) => {
    await updateProject(program).then(setLoadingAso(false));
    await getFilteredPrograms();
    await getProgramsBio();
    confirmPost();
  }



  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialProgramValues, true, validate);

  const confirmPost = () => {
    setOpen(true);
    resetForm({

    })
    setTimeout(function () {
      setOpen(false);
    }, 6000);
  }
  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      addNewProgram().then((response) => {
        setLoadingAso(false);
        setValues(cleanProgram);
        wrapProgram(response.data.Program);
      });

    }
  }

  const [programValue, setProgramValue] = React.useState(filteredPrograms[0]);
  const [inputValue, setInputValue] = React.useState('');

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (

    <div className={classes.root}>

      <div className={classes.programholder} hidden={!loading} style={{ width: "90%" }}>
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
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={3000}>
          <Alert severity={error ? "error" : "success"}>
            {error ? "Error!" : "Se ha asociado el laboratorio!"}
          </Alert>
        </Snackbar>
      </div>

      <PageHeader
        title={i18n.t('showproject1')}
        subTitle={i18n.t('showproject2')}
        icon={<InfoIcon fontSize="large"
        />}
      />
      <br id="programas" />
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
            title=""
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {i18n.t('availability12')}: {name ? name : 'Nombre'}
            </Typography>
            
            <Typography variant="subtitle1" color="textSecondary" component="p">
              {i18n.t('showproject3')}: {description ? description : 'Descripción'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              {i18n.t('projectform1')}: {objetives ? objetives: 'Sin objetivos'}
            </Typography>
            
            
          </CardContent>

          <CardActions disableSpacing>
            <Typography variant="subtitle1" color="textSecondary" component="p">
              {i18n.t('showproject4')}
            </Typography>
            <Controls.Checkbox
              name="isTimeSeries"
              label=""
              value={isTimeSeries}
              disabled={true}
            />
          </CardActions>
        </Card>
      </Grid>

      <br />

      <ScrollToTop showBelow={150} />


    </div>
  );
}
