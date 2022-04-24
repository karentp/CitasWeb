import { useState, useEffect } from "react";
import axios from "axios";
import "./Register.css";
import Controls from "../../components/controls/Controls";
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@mui/icons-material/Help';
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip';
import { useForm, Form } from '../../components/useForm';
import AlertMessage from '../../components/AlertMessage';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: 'user',
  roles: [],
}

const useStyles = makeStyles(({
  inputField: {
    width:"100%",
    marginBottom: "20px"
  },
  programholder: {
    height: 40,
    textAlign: 'center'
  }
}))

const Register = ({ }) => {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  // const [items, setItems] = React.useState([{ name: "" }]);
  // const [selected, setSelected] = React.useState(false);  
  // const [inputProject, setInputProject] = React.useState('');

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };
  // function wrapValues(projects) {
  //   setItems(projects);
  //   setLoading(false);

  // }
  useEffect(() => {
    let unmounted = false;
    // async function getBio() {
    //   try {
    //     const projects = await axios.get(
    //       process.env.REACT_APP_API_URL + "/api/private/project",
    //       config
    //     );
    //     wrapValues(projects.data.projects);


    //   } catch (error) {
    //     setTimeout(() => {
    //       setError("");
    //     }, 5000);
    //     return setError("Authentication failed!");
    //   }
    // }
    //getBio();
    return () => { unmounted = true; };
  }, []);

  // const [value, setValue] = React.useState(items[0]);
  // const [inputValue, setInputValue] = React.useState('');

  // const roleItems = [
  //   { id: 'investigador', title: 'Investigador' },
  //   { id: 'asistente', title: 'Asistente' },
  // ]

  const typeItems = [
    { id: 'user', title: 'Usuario' },
    { id: 'admin', title: 'Administrador' },
    { id: 'gestor', title: 'Gestor' },
  ]

  const registerHandler = async (e) => {
    e.preventDefault();
    if(validate()){
      setLoading(true);
      if (values.password !== values.confirmPassword) {
        setValues({...values, password: "", confirmPassword: ""});
        setTimeout(() => {
          setError("");
        }, 5000);
        setLoading(false);
        return setError("Las contraseñas no coinciden");
      }
    // if (selected === false && type === 'user') {

    //   setTimeout(() => {
    //     setError("");
    //   }, 5000);
    //   setLoading(false);
    //   return setError("Seleccione un proyecto");
    // }


      try {
        // const role = {
        //   projectId: value.id,
        //   role: roleType
        // }
        console.log(values);
        const { data } = await axios.post(
          process.env.REACT_APP_API_URL + "/api/private/register",values,config
        );
        setLoading(false);
        setOpen(true);
        resetForm({})
        setTimeout(function () {
          setOpen(false);
        }, 6000);
      } catch (error) {
        console.log(error);
        setError(error.response.data.error);
        setTimeout(() => {
          setError("");
        }, 5000);
        setLoading(false);
      }
    }

  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('username' in fieldValues)
      temp.username = fieldValues.username ? "" : "Este campo es obligatorio."
    if ('email' in fieldValues)
      temp.email = fieldValues.email ? "" : "Este campo es obligatorio."
    if ('password' in fieldValues)
      temp.password = fieldValues.password ? "" : "Este campo es obligatorio."
    if ('confirmPassword' in fieldValues)
      temp.confirmPassword = fieldValues.confirmPassword ? "" : "Este campo es obligatorio."
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialValues, true, validate);

  return (
    <div className="register-screen" style={{width:'90%'}}>
      {/* <form onSubmit={registerHandler} className="register-screen__form"> */}
      <Form onSubmit={registerHandler} className="register-screen__form">
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
        <AlertMessage errorMessage={error} successMessage={"Se ha creado un nuevo usuario!"} openMessage={open}/>
        <h3 className="register-screen__title">Crear una cuenta</h3>
        {error && <span className="error-message">{error}</span>}
        <Grid item xs={12}>
          <Controls.Input
            name="username"
            label="Usuario"
            type="text"
            value={values.username}
            onChange={handleInputChange}
            className={classes.inputField}
            error={errors.username}
          />
          <Controls.Input
            name="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={handleInputChange}
            className={classes.inputField}
            error={errors.email}
          />
          <Controls.Input
            name="password"
            label="Contraseña"
            type="password"
            value={values.password}
            onChange={handleInputChange}
            className={classes.inputField}
            error={errors.password}
          />
          <Controls.Input
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            value={values.confirmPassword}
            onChange={handleInputChange}
            className={classes.inputField}
            error={errors.confirmPassword}
          />
        </Grid>
        <Grid container>
          <Grid item>
            <Controls.RadioGroup
              name="type"
              label="Tipo de usuario"
              value={values.type}
              // onChange={(e) => {
              //   setType(e.target.value);
              //   if (type === 'admin')
              //     setUser(false);
              //   else
              //     setUser(true);
              // }}
              onChange={handleInputChange}
              items={typeItems}
            />
          </Grid>
          <Grid item>
            <Tooltip title="El administrador tiene acceso a todas las funcionalidades del sistema, mientras un usuario tiene acceso limitado asociado a un proyecto.">
              <HelpIcon color={"success"} />
            </Tooltip>

          </Grid>
        </Grid>
        {/* <br />
        <div hidden={isUser}>
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              setSelected(true);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="combo-box-demo"
            options={items}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Proyectos" variant="outlined" />}
            disabled={loading}
            disableClearable
            inputValue={inputProject}
            onInputChange={(event, newInputValue) => {
              setInputProject(newInputValue);
            }}
          />
          <br />
          <Controls.RadioGroup
            name="role"
            label="Tipo de rol"
            value={roleType}
            onChange={(e) => { setRole(e.target.value); }}
            items={roleItems}
          />
        </div>*/}
        <br />
        <button type="submit" className="btn btn-primary">
          Registrar Cuenta
        </button>
      </Form>
    </div>
  );
};

export default Register;
