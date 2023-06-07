import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Slider,
  Snackbar,
  Stack,
  Typography,
  TextField
} from '@mui/material';

export const CoyoteMaxPower = () => {
  const [maxPowerA, setMaxPowerA] = useState(0);
  const [maxPowerB, setMaxPowerB] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const updateMaxPower = () => {
    const data = { "pow_a": maxPowerA, "pow_b": maxPowerB };
    axios.post('/api/coyote/max_power', data).then((res) => {
      console.log(res);
      setOpenSuccess(true);
    }).catch((err) => {
      console.error(err);
      setMessage(err.response.data.detail);
      setOpenError(true);
    });
  }

  const getMaxPower = () => {
    axios.get('/api/coyote/max_power').then((res) => {
      console.log(res);
      setMaxPowerA(res.data.pow_a);
      setMaxPowerB(res.data.pow_b);
    }).catch((err) => {
      console.error(err);
    });
  };

  // get max power on page load
  useEffect(() => {
    getMaxPower();
  }, []);


  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  }

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  }


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Max output power of two channels"
          title="Max Power"
        />
        <Divider />
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">
              Max Power A
            </Typography>
            <Stack
              spacing={3}
              sx={{ maxWidth: 600, mb: 1 }}
              direction="row"
            >
              0
              <Slider
                value={maxPowerA}
                onChange={(event, newValue) => {
                  setMaxPowerA(newValue);
                  console.log(newValue);
                }}
                aria-label="Default"
                max={768}
                valueLabelDisplay="auto"
                sx={{ ml: 2, mr: 2 }} />
              768
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h6">
              Max Power B
            </Typography>
            <Stack
              spacing={3}
              sx={{ maxWidth: 600, mb: 1 }}
              direction="row"
            >
              0
              <Slider
                defaultValue={0}
                value={maxPowerB}
                onChange={(event, newValue) => {
                  setMaxPowerB(newValue);
                }}
                aria-label="Default"
                max={768}
                valueLabelDisplay="auto"
                sx={{ ml: 2, mr: 2 }} />
              768
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained"
            onClick={updateMaxPower}>
            Update
          </Button>
          <Snackbar open={openSuccess}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={5000}
            onClose={handleCloseSuccess}>
            <Alert onClose={handleCloseSuccess}
              severity="success"
              sx={{ width: '100%' }}>
              updated max power successfully!
            </Alert>
          </Snackbar>
          <Snackbar open={openError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={5000}
            onClose={handleCloseError}>
            <Alert onClose={handleCloseError}
              severity="error"
              sx={{ width: '100%' }}>
              failed to update max power: {message}
            </Alert>
          </Snackbar>
        </CardActions>
      </Card>
    </form>
  );
};
