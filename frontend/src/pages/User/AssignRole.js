import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";
import { useHistory } from "react-router-dom";
import Controls from "../../components/controls/Controls";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const AssignRole = ({ }) => {
    const history = useHistory();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = useState("");
    const [projects, setProjects] = React.useState([{ name: "" }]);
    const [users, setUsers] = React.useState([{ username: " " }]);
    const [selectedUser, setSelectedUser] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState(false);
    const [roleType, setRole] = useState("investigador");
    const [open, setOpen] = React.useState(false);
    const [inputUser, setInputUser] = React.useState('');
    const [inputProject, setInputProject] = React.useState('');
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };
    function wrapUsers(users) {

        setUsers(users);

        setLoading(false);
    }

    function wrapProjects(projects) {
        setProjects(projects);
        setLoading(false);
        setSelectedUser(true);

    }

    function cleanForm() {
        setSelectedProject(false);
        setRole("investigador");
        setInputProject("");
        
    }

    async function getBio(userValue) {
        try {
            setLoading(true);
            setSelectedUser(false);
            const projects = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/filteredprogram/${userValue.id}`,
                config
            );
            console.log(projects);
            wrapProjects(projects.data.programs);


        } catch (error) {
            setTimeout(() => {
                setError("");
            }, 5000);
            setLoading(false);
            return setError("Authentication failed!");
        }
    }

    useEffect(() => {
        let unmounted = false;
        async function getUsers() {
            try {
                const users = await axios.get(
                    process.env.REACT_APP_API_URL + "/api/private/gestores/",
                    config
                );
                wrapUsers(users.data.users);


            } catch (error) {
                setTimeout(() => {
                    setError("");
                }, 5000);
                setLoading(false);
                return setError("Authentication failed!");
            }
        }


        getUsers();
        return () => { unmounted = true; };
    }, []);

    const [projectValue, setprojectValue] = React.useState(projects[0]);
    const [userValue, setuserValue] = React.useState(users[0]);

    const roleItems = [
        { id: 'investigador', title: 'Investigador' },
        { id: 'asistente', title: 'Asistente' },
    ]


    const registerHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (selectedUser === false || selectedProject === false) {

            setTimeout(() => {
                setError("");
            }, 5000);
            setLoading(false)
            return setError("Seleccione un proyecto");
        }


        try {
            const role = {
                projectId: projectValue.id,
                projectName: projectValue.name,
                role: roleType,
                editFactor: true,
                editData: true,
                export: true
            }
            userValue.roles.push(role);
            const { data } = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/private/users/${userValue.id}`,
                {
                    username: userValue.username,
                    email: userValue.email,
                    type: userValue.type,
                    roles: userValue.roles
                },
                config
            );
            await getBio(userValue);
            setLoading(false);
            setOpen(true);
            cleanForm();
            setTimeout(function () {
                setOpen(false);
            }, 6000);
        } catch (error) {
            console.log(error);
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    const useStyles = makeStyles(() => ({
        programholder: {
            height: 40,
            textAlign: 'center'
        },
    }));
    const classes = useStyles();
    return (

        <div className="register-screen">

            <form onSubmit={registerHandler} className="register-screen__form">
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
                        {error ? error : 'Se ha asociado el laboratorio!'}
                    </Alert>
                </Collapse>

                <h3 className="register-screen__title">Asignar laboratorio a usuario existente</h3>
                {error && <span className="error-message">{error}</span>}
                <br />
                <div >
                    <Autocomplete
                        value={userValue}
                        onChange={(event, newValue) => {
                            setuserValue(newValue);
                            setSelectedUser(true);
                            setSelectedProject(false);
                            console.log(newValue);
                            getBio(newValue);
                        }}
                        id="combo-box-users"
                        options={users}
                        getOptionLabel={(option) => option.username}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Gestor" variant="outlined" />}
                        disabled={loading}
                        disableClearable
                        inputValue={inputUser}
                        onInputChange={(event, newInputValue) => {
                            setInputUser(newInputValue);
                        }}
                    />
                    <br />
                    <Autocomplete
                        value={projectValue}
                        onChange={(event, newValue) => {
                            setprojectValue(newValue);
                            setSelectedProject(true);
                        }}
                        id="combo-box-assign"
                        options={projects}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Laboratorios" variant="outlined" />}
                        disabled={!selectedUser}
                        disableClearable
                        inputValue={inputProject}
                        onInputChange={(event, newInputValue) => {
                            setInputProject(newInputValue);
                        }}
                    />
                    <br />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                    Asignar laboratorio
                </button>
            </form>
        </div>
    );
};

export default AssignRole;
