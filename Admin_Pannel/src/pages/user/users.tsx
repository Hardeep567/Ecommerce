import { ReactElement } from 'react';
import { Box, Grid } from '@mui/material';

import Customers from 'components/sections/dashboard/users/UsersData';


const users = (): ReactElement => {
  return (
    <Box sx={{ flexGrow: 1}}>
        <Grid item xs={12} md={8} lg={6}>
          <Customers />
        </Grid>
    </Box>
  );
};

export default users;
