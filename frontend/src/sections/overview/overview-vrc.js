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

export const OverviewVRC = () => {

  const [vrcHost, setVrcHost] = useState('');

  const [vrcPort, setVrcPort] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState('');

  const updateOscAddress = () => {
    const data = { "host": vrcHost, "port": vrcPort };
    axios.post('/api/osc_server/address', data).then((res) => {
      setOpenSuccess(true);
    }).catch((err) => {
      console.error(err);
      setMessage(err.response.data.detail);
      setOpenError(true);
    });
  };

  const getVRCAddress = () => {
    axios.get('/api/osc_server/address').then((res) => {
      setVrcHost(res.data.host);
      setVrcPort(res.data.port);
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
    getVRCAddress();
  }, []);

  return (
    <Card>
      <CardHeader
        subheader="The VRChat OSC host and port to listen"
        title="VRChat Address"
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
                VRChat Host
              </Typography>
              <Stack>
                <TextField
                  label="Host"
                  variant="standard"
                  value={vrcHost}
                  onChange={(evt) => {
                    setVrcHost(evt.target.value);
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
                VRChat OSC Port
              </Typography>
              <Stack>
                <TextField
                  label="Port"
                  variant="standard"
                  value={vrcPort}
                  onChange={(evt) => {
                    setVrcPort(evt.target.value);
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
              updated VRC address successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={openError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={5000}
          onClose={handleCloseError}>
          <Alert onClose={handleCloseError}
            severity="error"
            sx={{ width: '100%' }}>
              failed to update VRC address: {message}
          </Alert>
        </Snackbar>
      </CardActions>
    </Card>
  );
};
