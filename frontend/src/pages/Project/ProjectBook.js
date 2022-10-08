import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { CalendlyEventListener, InlineWidget } from "react-calendly";
import CalendarTemplate from './Calendar';
import axios from "axios";

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

export default function ProjectBook() {
  const [project, setProject] = useState(initialValue);
  const [url, setURL] = useState('');

  let email = '';
  let name = '';

  const projectId = useParams();
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const prefilInfo = async () => {
    try {
      const uid = localStorage.getItem("uid");
      let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/users/${uid}`, config);
      email = response.data.user.roles[0].projectName;
      name = response.data.user.name;

    }
    catch (error) {
      console.log("Wenuuuski");
    }

  }

  const prefill = {
    email: email,
    name: name
  };

  const getProject = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/project/${projectId['id']}`, config);
      setProject(response.data.project);
      const labName = (response.data.project.laboratorio.toLowerCase()).replace(/\s/g, '-');
      const projectName = (response.data.project.name.toLowerCase()).replace(/\s/g, '-');
      const url2 = "https://calendly.com/" + labName + "/" + projectName;
      setURL(url2)

    } catch (error) {
      setTimeout(() => {
        setTimeout(() => {
          "";
        }, 2000);

      }, 5000);
      return "Authentication failed!";
    }
  }

  useEffect(async () => {

    let unmounted = false;
    await prefilInfo();
    await getProject();
    return () => { unmounted = true; };
  }, []);



  return (
    <div className="App">
      <InlineWidget
        url={url}
        prefill={prefill}
      />
    </div>
  );
}
