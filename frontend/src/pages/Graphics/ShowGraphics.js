import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";
import Container from '@material-ui/core/Container';
import ShowBoxplot from './ShowBoxplot';
import ShowHistogram from './ShowHistogram';
import ToggleButton from '@mui/material/ToggleButton';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import i18n from '../../i18n';

function ShowGraphics() {
    const { pid, bid } = useParams();
    const [error, setError] = useState('');
    const [data, setData] = useState({ "_isFull": 0 });
    const [graphics, setGraphics] = React.useState('histogram');

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getData() {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/record/num/${bid}/${pid}`,
                config
            );
            setData(result.data);
        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
    }

    useEffect(() => {
        let unmounted = false;
        getData();
        return () => { unmounted = true; };
    }, []);

    const handleChange = (event, newGraphics) => {
        setGraphics(newGraphics);
    };

    return (
        <Container>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
            >
                <ToggleButtonGroup
                    color="primary"
                    value={graphics}
                    exclusive
                    onChange={handleChange}
                >
                    <ToggleButton value="histogram">{i18n.t('showgraphic')}</ToggleButton>
                    <ToggleButton value="boxplot">Boxplots</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <div>
                {graphics === "histogram" ?
                    <ShowHistogram data={data} />
                    : !data.hasOwnProperty("_isFull") && <div>
                        <ShowBoxplot data={data} />
                    </div>
                }
            </div>
        </Container>
    )
}

export default ShowGraphics;
