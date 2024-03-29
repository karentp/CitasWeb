import React from 'react'
import { AppBar, Toolbar, makeStyles, CssBaseline } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Avatar from '@material-ui/core/Avatar';
import axios from "axios";
import {useState, useEffect} from 'react';
import i18next, { changeLanguage } from 'i18next';
import i18n from '../i18n';

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
    toolbarButtons: {
        marginLeft: 'auto',
    },

}));

export default function Header() {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [header, setHeader] = useState('');
    const open = Boolean(anchorEl);
    const image = localStorage.getItem("image");

    useEffect(async () => {
        let unmounted = false;
        await headerName();
        return () => {unmounted = true};
    }, [localStorage]);

    const headerName = async () => {
        try {
            const uid = localStorage.getItem("uid");
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/api/private/users/${uid}`, config);
            console.log(response);
            setHeader(response.data.user.roles[0].projectName);
        }
        catch(error){
            console.log("Wenuuuski");
        }
    
    }

    function setName(){
        console.log(header);
        let name = "Scyto: Gestor de servicios de laboratorios";
        if(header !== ''){
            name = "Scyto: Gestor de servicios de " + header;
        }
        return name;
    }
    
    
    const handleMenu = (event) => {
        console.log('hi')
        setAnchorEl(event.currentTarget);
    };
    
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        history.push("/login");
    };
    const classes = useStyles();

    const profileHandler = () =>{
        const uid = localStorage.getItem("uid");
        history.push(`/profile/${uid}`);
    }

    const home= () =>{
        history.push("/")
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };



    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar style={{backgroundColor: '#465771'}}>
                    <div onClick={home}>
                        <IconButton 
                            color="inherit"    
                        >
                            <Typography variant="h6" noWrap >
                                {setName()}
                            </Typography>
                        </IconButton>
                    </div>
                    <div className={classes.toolbarButtons}>
                        <IconButton
                            aria-label="language to use - es"
                            aria-controls="menu-appbar-es"
                            aria-haspopup="true"
                            size='small'
                            color="inherit">
                                <img
                                    src = "es.png" width={30} height={20}
                                    variant="square" 
                                    onClick={() => {
                                        console.log("handleChangeLanguage start")
                                        window.localStorage.setItem('lan', 'es')
                                        window.location.reload()}}
                                />
                        </IconButton>
                        <IconButton
                            aria-label="language to use - en"
                            aria-controls="menu-appbar-en"
                            aria-haspopup="true"
                            
                            color="inherit">
                                <img
                                    src = "en.svg" width={35} height={30}
                                    variant="square" 
                                    onClick={() => {
                                        console.log("handleChangeLanguage start")
                                        window.localStorage.setItem('lan', 'en')
                                        window.location.reload()
                                    }}
                                />
                        </IconButton>
                        
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar
                            src={image? image: ""}
                            alt=""                            
                            >

                            </Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            getContentAnchorEl={null}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={profileHandler}>{i18n.t('header1')}</MenuItem>
                            <MenuItem onClick={logoutHandler}>{i18n.t('header2')}</MenuItem>
                        </Menu>
                    </div>

                </Toolbar>

            </AppBar>
        </div>
    )
}
