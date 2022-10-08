import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  programholder: {
    height: 40,
    textAlign: 'center',
    width: '90%',
    marginTop: '20px'
  }
}))

function CircularProgressWithLabel(props) {
  const classes = useStyles();
  return (
    <div hidden={props.hidden}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={classes.programholder}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" {...props} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(props.value)}%`}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </div>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic(props) {
  const { progress, hidden } = props;
  return <CircularProgressWithLabel value={progress} hidden={hidden} />;
}