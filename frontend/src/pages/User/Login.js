import React, { useState, useEffect, } from "react";
import axios from "axios";
import "./Login.css";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core';
import { useForm, Form } from '../../components/useForm';
import AlertMessage from '../../components/AlertMessage';
import Grid from '@mui/material/Grid'
import Controls from "../../components/controls/Controls";
import logo from '../../assets/img/logo.png'

const initialValues = {
  email: '',
  password: '',
}

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: '50px 0 0 0',
    width: '90%',
    padding: theme.spacing(3)
  },
  inputField: {
    width: "100%",
    marginBottom: "20px"
  },
  programholder: {
    height: 40,
    textAlign: 'center'
  },
}))

const Login = ({ history }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history]);

  const login = async () => {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_URL + "/api/auth/login", values, config
      );

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("uid", data.id);
      localStorage.setItem("image", data.image);
      localStorage.setItem("type", data.type);
      window.location.reload();
      history.push("/");
    } catch (error) {
      setOpen(true);
      console.log(error.response);
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
        setOpen(false);
      }, 5000);
    }
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validate())
      await login();
    setLoading(false);
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('email' in fieldValues)
      temp.email = fieldValues.email ? "" : "Este campo es obligatorio."
    if ('password' in fieldValues)
      temp.password = fieldValues.password ? "" : "Este campo es obligatorio."
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
    <div className="login-content">
      <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
        </Grid>

      <div className="login-screen">       

        {/* <form onSubmit={loginHandler} className="login-screen__form"> */}
        <Form onSubmit={loginHandler} className="login-screen__form">
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
          <h3 className="login-screen__title">Inicia Sesión</h3>
          <AlertMessage errorMessage={error} successMessage={""} openMessage={open} />

          <Grid item xs={12}>
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
          </Grid>
          <button type="submit" className="btn btn-primary">
            Inicia Sesión
          </button>
        </Form>
      </div>
    </div>

  );
};

export default Login;