import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { CoyoteStats } from 'src/sections/coyote/coyote-status';
import { CoyoteOSCAddress } from 'src/sections/coyote/coyote-address';
import { CoyoteMaxPower } from 'src/sections/coyote/coyote-power';
import { CoyotePattern } from 'src/sections/coyote/coyote-pattern';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

const Page = () => (
  <>
    <Head>
      <title>
        Coyote | OSC Toys
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">
            Coyote
          </Typography>
          <CoyoteStats />
          <CoyoteOSCAddress />
          <CoyoteMaxPower />
          <CoyotePattern />
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
