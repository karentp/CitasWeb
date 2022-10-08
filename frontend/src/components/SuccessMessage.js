import React from 'react'
import { Paper, Card, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    pageForm: {
        backgroundColor: '#7fffd4',
        width: '90%'
    },
    pageHeader:{
        padding:theme.spacing(2),
        display:'flex',
        marginBottom:theme.spacing(2)
    },
    pageTitle:{
        paddingLeft:theme.spacing(4),
        '& .MuiTypography-subtitle2':{
            opacity:'0.6'
        },
        align:'center'
    }
}))

export default function PageHeader(props) {

    const classes = useStyles();
    const { message } = props;
    return (
        <Paper elevation={0} variant="outlined" className={classes.pageForm}>
            <div className={classes.pageHeader}>
                <div className={classes.pageTitle}>
                    <Typography
                        variant="h4"
                        component="div">
                        {message}</Typography>
                </div>
            </div>
        </Paper>
    )
}
