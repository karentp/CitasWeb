import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import defaultImg from '../assets/img/defaultImg.jpeg'
import { Divider, Grid, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
    sizeAvatar: {
        height: "150px",
        width: "150px",
        marginBottom: "25px",
    },
    margin: {
        marginBottom: "25px"
    },
    right: {
        display: "inline-flex",
        flex: "row"
    }
}))

export default function ImageComponent(props) {
    const { initialValues, onChange, profile, ...other } = props
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className={classes.margin}
            >
                <div className={classes.right}>
                    <div>
                        <Avatar
                            src={initialValues.image ? initialValues.image : profile?"":defaultImg}
                            alt=""
                            className={classes.sizeAvatar}
                            style={{ margin: 'auto' }}>

                        </Avatar>
                    </div>

                    <div className={classes.toolbarButtons}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <EditIcon fontSize="small" color="success" />
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
                            <MenuItem>
                                <input
                                    name="image"
                                    accept="image/*"
                                    className={classes.input}
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    hidden
                                    onChange={onChange}
                                />                                
                                <label htmlFor="raised-button-file">
                                    Cambiar
                                </label>
                            </MenuItem>
                            <MenuItem id="clearImage" onClick={onChange}>
                                Quitar
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </Grid>
            <Divider />
            <br />
        </div>
    )
}
