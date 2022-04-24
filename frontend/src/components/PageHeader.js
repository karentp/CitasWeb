import React from 'react'
import { Paper, Card, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    pageForm: {
        backgroundColor: '#17c6f6',
        width: '90%'
    },
    pageHeader:{
        padding:theme.spacing(2),
        display:'flex',
        marginBottom:theme.spacing(2),
    },
    pageIcon:{
        display:'inline-block',
        padding:theme.spacing(1),
        marginTop: 'auto',
        marginBottom: 'auto',
        color:'#3c44b1'
    },
    pageTitle:{
        paddingLeft:theme.spacing(4),
        '& .MuiTypography-subtitle2':{
            opacity:'0.6'
        }
    }
}))

export default function PageHeader(props) {

    const classes = useStyles();
    const { title, subTitle, icon } = props;
    return (
        <Paper elevation={0} variant="outlined" className={classes.pageForm}>
            <div className={classes.pageHeader}>
                <Card className={classes.pageIcon}>
                    {icon}
                </Card>
                <div className={classes.pageTitle}>
                    <Typography
                        variant="h6"
                        component="div">
                        {title}</Typography>
                    <Typography
                        variant="subtitle1"
                        component="div">
                        {subTitle}</Typography>
                </div>
            </div>
        </Paper>
    )
}
