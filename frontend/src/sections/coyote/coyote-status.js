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
import Battery20Icon from '@mui/icons-material/Battery20';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery90Icon from '@mui/icons-material/Battery90';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled';
import BluetoothConnectedIcon from '@mui/icons-material/BluetoothConnected';

import { red, orange, green } from '@mui/material/colors';
import { useEffect } from 'react';
import { set } from 'nprogress';

export const CoyoteStats = () => {
  const [uid, setUid] = useState('');
  const [battery, setBattery] = useState(0);
  const [connected, setConnected] = useState(false);
  const [firstPoll, setFirstPoll] = useState(true);
  const [wantedStatus, setWantedStatus] = useState(false);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState('');

  const getStatus = () => {
    axios.get('/api/coyote/status').then((res) => {
      setBattery(res.data.battery_level);
      setConnected(res.data.is_connected);
      if (firstPoll) {
        setWantedStatus(res.data.is_connected);
        setFirstPoll(false);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  const getUid = () => {
    axios.get('/api/coyote/uid').then((res) => {
      setUid(res.data.uid);
    }).catch((err) => {
      console.error(err);
    });
  }

  const startDevice = () => {
    const data = { "uid": uid };
    axios.post('/api/coyote/start', data).then((res) => {
      setOpenSuccess(true);
    }).catch((err) => {
      console.error(err);
      setMessage(err.response.data.detail);
      setOpenError(true);
    });
  }

  const stopDevice = () => {
    axios.get('/api/coyote/stop').then((res) => {
      setOpenSuccess(true);
    }).catch((err) => {
      console.error(err);
      setMessage(err.response.data.detail);
      setOpenError(true);
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
    getUid();
    getStatus();
    const id = setInterval(getStatus, 3000);
    return () => clearInterval(id);
  }, [firstPoll]);

  return (
    <Card>
      <CardHeader
        subheader="Working status of Coyote"
        title="Coyote Status"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={6}
          wrap="wrap"
          alignItems="center"
          justifyContent="center"
        >

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
          >
            <TextField
              label="Coyote UID"
              variant="standard"
              value={uid}
              sx={{ ml: 1, width: '100%' }}
              helperText="Leave it blank to auto-detect"
              onChange={(evt) => {
                setUid(evt.target.value);
              }} />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Stack spacing={1}>
              <Typography variant="h7">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                  {battery <= 20 && <Battery20Icon sx={{ color: red[500] }} />}
                  {battery > 20 && battery <= 30 && <Battery30Icon sx={{ color: orange[500] }} />}
                  {battery > 30 && battery <= 50 && <Battery50Icon sx={{ color: orange[500] }} />}
                  {battery > 50 && battery <= 60 && <Battery60Icon sx={{ color: green[500] }} />}
                  {battery > 60 && battery <= 80 && <Battery80Icon sx={{ color: green[500] }} />}
                  {battery > 80 && battery <= 90 && <Battery90Icon sx={{ color: green[500] }} />}
                  {battery > 90 && <BatteryFullIcon sx={{ color: green[500] }} />}
                  Battery:
                  {battery}%
                </div>
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
          >
            <Stack spacing={1}>
              <Typography variant="h7">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                  {
                    connected ? <BluetoothConnectedIcon color='success' /> :
                      <BluetoothDisabledIcon color='error' />
                  }
                  <Typography
                    color={connected ? 'success.main' : 'error.main'}
                  >
                    {connected ? 'Connected' : 'Disconnected'}
                  </Typography>
                </div>
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
          >
            <Stack spacing={1}>
              <Button
                variant="outlined"
                size="medium"
                color={connected ? 'error' : 'success'}
                disabled={connected != wantedStatus}
                onClick={() => {
                  if (!connected) {
                    setWantedStatus(true);
                    startDevice();
                  } else {
                    setWantedStatus(false);
                    stopDevice();
                  }
                }}
              >
                {connected != wantedStatus ? ('Waiting') : (connected ? 'Disconnect and Stop' : 'Connect and Start')}
              </Button>
              <Snackbar open={openSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={5000}
                onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess}
                  severity="success"
                  sx={{ width: '100%' }}>
                  start coyote successfully!
                </Alert>
              </Snackbar>
              <Snackbar open={openError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={5000}
                onClose={handleCloseError}>
                <Alert onClose={handleCloseError}
                  severity="error"
                  sx={{ width: '100%' }}>
                  failed to start coyote: {message}
                </Alert>
              </Snackbar>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
