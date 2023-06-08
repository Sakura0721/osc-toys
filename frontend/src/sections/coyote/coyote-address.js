import { useCallback, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useEffect } from 'react';

export const CoyoteOSCAddress = () => {

  const [oscAddressA, setOscAddressA] = useState('');

  const [oscAddressB, setOscAddressB] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState('');

  const updateOscAddress = () => {
    const data = { "addr_a": oscAddressA, "addr_b": oscAddressB };
    axios.post('/api/coyote/osc_addr', data).then((res) => {
      setOpenSuccess(true);
    }).catch((err) => {
      console.error(err);
      setMessage(err.response.data.detail);
      setOpenError(true);
    });
  };

  const getOscAddress = () => {
    axios.get('/api/coyote/osc_addr').then((res) => {
      setOscAddressA(res.data.addr_a);
      setOscAddressB(res.data.addr_b);
    }).catch((err) => {
      console.error(err);
    });
  }

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

  useEffect(() => {
    getOscAddress();
  }, []);

  return (
    <Card>
      <CardHeader
        subheader="Manage OSC addresses of VRChat parameters"
        title="OSC Addresses"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={6}
          wrap="wrap"
        >
          <Grid
            xs={12}
            sm={6}
            md={4}
          >
            <Stack spacing={1}>
              <Typography variant="h6">
                OSC Addresses A
              </Typography>
              <Stack>
                <TextField id="standard-basic"
                  label="Address Name"
                  variant="standard"
                  value={oscAddressA}
                  onChange={(evt) => {
                    setOscAddressA(evt.target.value);
                  }} />
              </Stack>
            </Stack>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
          >
            <Stack spacing={1}>
              <Typography variant="h6">
                OSC Addresses B
              </Typography>
              <Stack>
                <TextField id="standard-basic"
                  label="Address Name"
                  variant="standard"
                  value={oscAddressB}
                  onChange={(evt) => {
                    setOscAddressB(evt.target.value);
                  }} />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          id="save-osc-address"
          variant="contained"
          onClick={() => {
            updateOscAddress();
          }}
        >
          Save
        </Button>
        <Snackbar open={openSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={5000}
          onClose={handleCloseSuccess}>
          <Alert onClose={handleCloseSuccess}
            severity="success"
            sx={{ width: '100%' }}>
              updated OSC addresses successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={openError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={5000}
          onClose={handleCloseError}>
          <Alert onClose={handleCloseError}
            severity="error"
            sx={{ width: '100%' }}>
              failed to update OSC addresses: {message}
          </Alert>
        </Snackbar>
      </CardActions>
    </Card>
  );
};
