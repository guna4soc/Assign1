import React from 'react';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography } from '@mui/material';

const DashboardCards: React.FC = () => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">Total Processing Units</Typography>
          <Typography>Active: 15</Typography>
          <Typography>Inactive: 3</Typography>
          <Typography>Total: 18</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">Total Contacts</Typography>
          <Typography>Suppliers: 50</Typography>
          <Typography>Distributors: 30</Typography>
          <Typography>Others: 25</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" color="primary">Recent Activities</Typography>
          <Typography>New contact added: "Byrne Dairy"</Typography>
          <Typography>Updated unit status: "Duddeni Unit" to Active</Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default DashboardCards;
