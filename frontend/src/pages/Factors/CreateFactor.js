import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import { Paper, makeStyles, Box } from "@material-ui/core";
import EcoIcon from "@material-ui/icons/Eco";
import PageHeader from "../../components/PageHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import { useParams } from "react-router-dom";
import { addFactor } from "../../services/factorService";
import i18n from '../../i18n';
import i18next from "../../i18n";

const typeItems = [
  { id: "value", title: "Valor" },
  { id: "image", title: "Imagen" },
];

const initialValues = {
  name: "",
  description: "",
  isDependent: false,
  type: "value",
  projectID: "",
};

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: '50px 0 0 0',
    width: '90%',
    padding: theme.spacing(3)
  },
  programholder: {
    height: 40,
    textAlign: "center",
    width: '90%'
  },
}));

export default function CreateFactor() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : i18next.t('blog21');
    if ("description" in fieldValues)
      temp.description = fieldValues.description
        ? ""
        : i18next.t('blog21');
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate);

  const confirmPost = () => {
    setOpen(true);
    setLoading(false);
    resetForm({});
    setTimeout(function () {
      setOpen(false);
    }, 6000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        values.projectID = id;
        await addFactor(values).then(confirmPost).catch(console.log);
        
        
      } catch (error) {
        setLoading(false);
        setTimeout(() => {
          setTimeout(() => {
            setError("");
          }, 2000);
        }, 5000);
        return setError("Authentication failed!");
      }
    }
  };

  return (
    <div>
      <PageHeader
        title={i18n.t('createfactor1')}   
        subTitle={i18n.t('createfactor2')}
        icon={<EcoIcon fontSize="large" color="primary" />}
      />
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
      <Paper className={classes.pageContent} >
        <Form onSubmit={handleSubmit}>
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
              {error ? error : "Se ha agregado un nuevo factor!"}
            </Alert>
          </Collapse>
          <Grid container>
            <Grid item xs={6}>
              <Controls.Input
                name="name"
                label={i18n.t('createfactor3')}
                value={values.name}
                onChange={handleInputChange}
                error={errors.name}
              />
              <Controls.Input
                label={i18n.t('createfactor4')}
                name="description"
                value={values.description}
                onChange={handleInputChange}
                error={errors.description}
              />
            </Grid>
            <Grid item xs={6}>
              <Controls.RadioGroup
                name="type"
                label={i18n.t('createfactor5')}
                value={values.type}
                onChange={handleInputChange}
                items={typeItems}
              />
              <Controls.Checkbox
                name="isDependent"
                label={i18n.t('createfactor6')}
                value={values.isDependent}
                onChange={handleInputChange}
              />

              <div>
                <Controls.Button type="submit" text={i18n.t('createfactor7')}/>

                <Controls.Button
                  text={i18n.t('createfactor8')}
                  color="default"
                  onClick={resetForm}
                />
              </div>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </div>
  );
}
