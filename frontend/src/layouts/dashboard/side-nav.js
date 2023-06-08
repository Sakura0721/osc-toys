import axios from 'axios';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useState, useEffect } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import { height, margin } from '@mui/system';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const [stars, setStars] = useState(0);
  const [forks, setForks] = useState(0);

  const getGithubStats = () => {
    axios.get('https://api.github.com/repos/Sakura0721/osc-toys').then((res) => {
      setStars(res.data.stargazers_count);
      setForks(res.data.forks_count);
    }).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    getGithubStats();
  }, []);

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              p: '12px'
            }}
          >
            <MonitorHeartOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <div>
              <Typography
                color="inherit"
                variant="subtitle1"
              >
                OSC Toys
              </Typography>
              <Typography
                color="neutral.400"
                variant="body2"
              >
                VRC pluggin for toys
              </Typography>
            </div>
            <SvgIcon
              fontSize="small"
              sx={{ color: 'neutral.500' }}
            >
            </SvgIcon>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
          <Typography
            color="neutral.100"
            variant="subtitle2"
          >
            Like this project?
          </Typography>
          <Typography
            color="neutral.500"
            variant="body2"
          >
            Help develop or give a star!
          </Typography>


          <Box
            sx={{ mt: 1, color: 'white' }} >
            <Grid container>
              <Grid item
                xs={2}>
                <Box
                  component={NextLink}
                  target="_blank"
                  href="https://github.com/Sakura0721/osc-toys"
                  sx={{ mt: 1, color: 'white' }} >
                  <GitHubIcon sx={{ fontSize: 40 }} />
                </Box>
              </Grid>
              <Grid item
                xs={9} >
                <Grid container>
                  <Grid item
                    xs={12}
                    style={{ height: "18px" }}
                  >
                    <Typography
                      variant="body1"
                      style={{ height: "18px", marginLeft: "4px" }}
                    >
                      GitHub
                    </Typography>
                  </Grid>
                  <Grid item
                    xs={12} >
                    <Typography
                      color="neutral.500"
                      variant="body2"
                      component={'span'}
                    >

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                        <StarBorderRoundedIcon /> {stars}
                        &nbsp;&nbsp;
                        <CallSplitRoundedIcon /> {forks}
                      </div>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Button
            component="a"
            endIcon={(
              <SvgIcon fontSize="small">
                <ArrowTopRightOnSquareIcon />
              </SvgIcon>
            )}
            fullWidth
            href="https://github.com/Sakura0721/osc-toys"
            sx={{ mt: 2 }}
            target="_blank"
            variant="contained"
          >
            Goto GitHub Repo
          </Button>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
