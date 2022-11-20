import FileManager from '../components/FileManager';
import Grid from '@material-ui/core/Grid'
import React from 'react'
import i18n from '../i18n';

const Home = ({ history }) => {    
    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <h1>{i18n.t('home1')}</h1>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <h2>{i18n.t('home2')}</h2>
            </Grid>
        </div>
    )
}

export default Home;