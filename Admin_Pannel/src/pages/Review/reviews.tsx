import { ReactElement } from 'react';
import { Box, Grid } from '@mui/material';

import Reviews from 'components/sections/Review/Review';

const reviews = (): ReactElement => {
  return (
    <Box sx={{ flexGrow: 1}}>
        <Grid item xs={12} md={8} lg={6}>
          <Reviews />
        </Grid>
    </Box>
  );
};

export default reviews;
