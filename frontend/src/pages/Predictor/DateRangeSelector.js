import React, { Fragment, useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@mui/material/Paper';
import Box from '@material-ui/core/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import i18n from '../../i18n';

export default function DateRangeSelector({ setInitialDate, setFinalDate }) {

    const handleChangeInput = (id, event) => {
        if (id == 0) {
            setInitialDate(event.target.value);
        } else if (id == 1) {
            setFinalDate(event.target.value);
        }
    }

    return (
        <div>
            <Box sx={{ display: 'flex', p: 1}}>

                <Box
                    sx={{
                        width: "45%"
                    }}
                >
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {i18n.t('datarange1')}
                            </Typography>
                            <TextField
                                style={{ width: "100%" }}
                                type='date'
                                name="initialDate"
                                defaultValue={"00:00"}
                                size="small"
                                variant="outlined"
                                onChange={event => handleChangeInput(0, event)}
                            />
                        </CardContent>

                    </Card>
                </Box>
                <Box
                    sx={{
                        width: "45%"
                    }}
                >
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {i18n.t('datarange')}
                            </Typography>
                            <TextField
                                style={{ width: "100%" }}
                                type='date'
                                name="finalDate"
                                defaultValue={"00:00"}
                                size="small"
                                variant="outlined"
                                onChange={event => handleChangeInput(1, event)}
                            />
                        </CardContent>

                    </Card>
                </Box>
            </Box>
        </div>
    )
}
