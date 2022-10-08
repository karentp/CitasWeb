import FileManager from '../components/FileManager';
import Grid from '@material-ui/core/Grid'
import React from 'react'

const Home = ({ history }) => {    
    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <h1>Scyto: Gestor de servicios de laboratorios</h1>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <h2>El mejor lugar para sacar citas para sus servicios de laboratorio.</h2>
            </Grid>
        </div>
    )
}

export default Home;