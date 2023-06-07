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
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useEffect } from 'react';

export const CoyotePattern = () => {
  const [patternList, setPatternList] = useState(['a']);
  const [patternA, setPatternA] = useState('');
  const [patternB, setPatternB] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState('');


  const updatePattern = () => {
    const data = { "pattern_a": patternA, "pattern_b": patternB };
    axios.post('/api/coyote/pattern', data).then((res) => {
      setOpenSuccess(true);
    }).catch((err) => {
      console.error(err);
      setMessage(err.response.data.detail);
      setOpenError(true);
    });
  }

  const getPatternList = () => {
    axios.get('/api/coyote/patterns').then((res) => {
      setPatternList(res.data.patterns);
    }).catch((err) => {
      console.error(err);
    });
  }

  const getPattern = () => {
    axios.get('/api/coyote/pattern').then((res) => {
      console.log(res);
      setPatternA(res.data.pattern_a);
      setPatternB(res.data.pattern_b);
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
    getPatternList();
    getPattern();
  }, []);

  return (
    <Card>
      <CardHeader
        subheader="Manage the output patterns of Coyote"
        title="Patterns"
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
                <FormControl fullWidth
                  variant="standard" >
                  <InputLabel id="pattern-a-select-label">Pattern A</InputLabel>
                  <Select
                    labelId="pattern-a-select-label"
                    id="pattern-a-select"
                    value={patternA}
                    label="PatternA"
                    onChange={
                      (evt) => setPatternA(evt.target.value)
                    }
                  >
                    {
                      patternList.map((pattern) => {
                        return (
                          <MenuItem value={pattern}
                            key={"PatternA" + pattern}
                          >{pattern}</MenuItem>
                        );
                      })
                    }
                  </Select>
                </FormControl>
            </Stack>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
          >
            <Stack spacing={1}>
              <FormControl fullWidth
                variant="standard" >
                <InputLabel id="pattern-b-select-label">Pattern B</InputLabel>
                <Select
                  labelId="pattern-b-select-label"
                  id="pattern-b-select"
                  value={patternB}
                  label="PatternB"
                  onChange={
                    (evt) => setPatternB(evt.target.value)
                  }
                >
                  {
                    patternList.map((pattern) => {
                      return (
                        <MenuItem value={pattern}
                          key={"PatternB" + pattern}
                        >{pattern}</MenuItem>
                      );
                    })
                  }
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          id="save-pattern"
          variant="contained"
          onClick={() => {
            updatePattern();
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
            updated pattern successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={openError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={5000}
          onClose={handleCloseError}>
          <Alert onClose={handleCloseError}
            severity="error"
            sx={{ width: '100%' }}>
            failed to update pattern: {message}
          </Alert>
        </Snackbar>
      </CardActions>
    </Card>
  );
};
