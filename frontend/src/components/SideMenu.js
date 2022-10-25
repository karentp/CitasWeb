// withStyles & makeStyles

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import HomeWork from '@material-ui/icons/HomeWork';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EcoIcon from '@material-ui/icons/Eco';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useHistory } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import BiotechIcon from '@mui/icons-material/Biotech';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import SummarizeIcon from '@mui/icons-material/Summarize';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';

const drawerWidth = 240;



const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));




  
export default function SideMenu() {

  const [value, setValue] = useState(localStorage.getItem("type"));
  console.log(localStorage);

  useEffect(() => {
    console.log(value);
  }, [value])  


  const classes = useStyles();
  const history = useHistory();

  function moveRoute(route) {
    history.push(route);
  }

  function test(){
    const type = localStorage.getItem("type");
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          {value === 'admin' &&
            <div>
              <List>
            <ListItem button key={'programa'} onClick={() => moveRoute('/program')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <BeenhereIcon />}</ListItemIcon>
              <ListItemText primary={'Laboratorios'}/>
            </ListItem>
          </List>
          <Divider />
          {/* <List>
            <ListItem button key={'evidence'} onClick={() => moveRoute('/evidence')}>
              <ListItemIcon><VisibilityIcon /></ListItemIcon>
              <ListItemText primary={'Ver Citas'}/>
            </ListItem>
          </List> */}
          <Divider /> 
              <List>
            <ListItem button key={'register'} onClick={() => moveRoute('/register')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <PersonAddIcon />}</ListItemIcon>
              <ListItemText primary={'Registrar Usuario'}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={'assignRole'} onClick={() => moveRoute('/assignRole')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <AssignmentIndIcon />}</ListItemIcon>
              <ListItemText primary={'Asignar gestores de laboratorio'}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={'usuarios'} onClick={() => moveRoute('/users')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <PersonIcon />}</ListItemIcon>
              <ListItemText primary={'Usuarios'}/>
            </ListItem>
          </List>
          <Divider />
            </div>
          }
          {value === 'user' &&
          <div>
            <List>
            <ListItem button key={'blog'} onClick={() => moveRoute('/blog')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <NoteAddIcon/>}</ListItemIcon>
              <ListItemText primary={'Agendar servicio'}/>
            </ListItem>
          </List>
          <Divider />
          {/* <List>
            <ListItem button key={'notice'} onClick={() => moveRoute('/notice')}>
              <ListItemIcon><NewspaperIcon /></ListItemIcon>
              <ListItemText primary={'Gestionar mis citas'}/>
            </ListItem>
          </List> */}
          <Divider />
          </div>}
          {value === 'gestor' &&
          <div>
          <List>
            <ListItem button key={'proyecto'} onClick={() => moveRoute('/project/')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <EcoIcon />}</ListItemIcon>
              <ListItemText primary={'Servicios'}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={'report'} onClick={() => moveRoute('/availability/')}>
              <ListItemIcon>{1 % 2 === 0 ? <InboxIcon /> : <SummarizeIcon/>}</ListItemIcon>
              <ListItemText primary={'Gestionar espacios'}/>
            </ListItem>
          </List>
          <Divider />
          </div>}

          </div>
        
      </Drawer>
      
    </div>
  );
}

