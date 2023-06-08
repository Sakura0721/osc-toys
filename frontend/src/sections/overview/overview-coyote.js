import axios from 'axios';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

import Battery20Icon from '@mui/icons-material/Battery20';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery90Icon from '@mui/icons-material/Battery90';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled';
import BluetoothConnectedIcon from '@mui/icons-material/BluetoothConnected';
import BoltSharpIcon from '@mui/icons-material/BoltSharp';
import { red, orange, green, yellow } from '@mui/material/colors';

export const OverviewCoyote = (props) => {
  const { sx } = props;

  const [battery, setBattery] = useState(0);
  const [connected, setConnected] = useState(false);

  const getStatus = () => {
    axios.get('/api/coyote/status').then((res) => {
      setBattery(res.data.battery_level);
      setConnected(res.data.is_connected);
    }).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Coyote
            </Typography>
            <Typography variant="h4">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                {battery <= 20 && <Battery20Icon sx={{ fontSize: 40, color: red[500] }} />}
                {battery > 20 && battery <= 30 && <Battery30Icon sx={{ fontSize: 40, color: orange[500] }} />}
                {battery > 30 && battery <= 50 && <Battery50Icon sx={{ fontSize: 40, color: orange[500] }} />}
                {battery > 50 && battery <= 60 && <Battery60Icon sx={{ fontSize: 40, color: green[500] }} />}
                {battery > 60 && battery <= 80 && <Battery80Icon sx={{ fontSize: 40, color: green[500] }} />}
                {battery > 80 && battery <= 90 && <Battery90Icon sx={{ fontSize: 40, color: green[500] }} />}
                {battery > 90 && <BatteryFullIcon sx={{ fontSize: 40, color: green[500] }} />}
                {battery}%
              </div>
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: yellow[700],
              height: 56,
              width: 56
            }}
          >
            <BoltSharpIcon sx={{ fontSize: 40, color: 'white' }} />
          </Avatar>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={0.5}
          >
            {
              connected ? <BluetoothConnectedIcon color='success' /> :
                <BluetoothDisabledIcon color='error' />
            }
            <Typography
              color={connected ? 'success.main' : 'error.main'}
              variant="body2"
            >
              {connected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewCoyote.prototypes = {
  sx: PropTypes.object
};
