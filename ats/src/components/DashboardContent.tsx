import React from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ListAltIcon from '@mui/icons-material/ListAlt';

const cardTitleColor = "#a020f0"; // vivid purple
const sectionColor = "#bdbd2e";   // yellow-green

const DashboardContent: React.FC = () => (
  <Box sx={{ p: 2 }}>
    {/* Gradient Title */}
    <Box
      sx={{
        borderRadius: 2,
        p: 3,
        mb: 2,
        background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Dairy Processing Units
      </Typography>
    </Box>

    {/* Tabs/Breadcrumbs */}
    <Box sx={{ mb: 2 }}>
      <Tabs value={0} textColor="secondary" indicatorColor="secondary">
        <Tab label={<span style={{ color: cardTitleColor, fontWeight: 600 }}>Dashboard</span>} />
        <Tab label={<span style={{ color: cardTitleColor, fontWeight: 600 }}>Processing Units</span>} />
        <Tab label={<span style={{ color: cardTitleColor, fontWeight: 600 }}>Contacts</span>} />
        <Tab label={<span style={{ color: cardTitleColor, fontWeight: 600 }}>Reports</span>} />
      </Tabs>
    </Box>

    {/* Cards */}
    <Grid container spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
      <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
        <Card sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: 2,
          height: '100%',
        }}>
          <CardContent sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssignmentTurnedInIcon sx={{ color: cardTitleColor, mr: 1 }} />
              <Typography variant="h6" sx={{ color: cardTitleColor, fontWeight: 'bold' }}>
                Total Processing Units
              </Typography>
            </Box>
            <Typography><b>Active:</b> 15</Typography>
            <Typography><b>Inactive:</b> 3</Typography>
            <Typography><b>Total:</b> 18</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
        <Card sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: 2,
          height: '100%',
        }}>
          <CardContent sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleAltIcon sx={{ color: cardTitleColor, mr: 1 }} />
              <Typography variant="h6" sx={{ color: cardTitleColor, fontWeight: 'bold' }}>
                Total Contacts
              </Typography>
            </Box>
            <Typography><b>Suppliers:</b> 50</Typography>
            <Typography><b>Distributors:</b> 30</Typography>
            <Typography><b>Others:</b> 25</Typography>
            <Typography><b>Total:</b> 105</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
        <Card sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: 2,
          height: '100%',
        }}>
          <CardContent sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ListAltIcon sx={{ color: cardTitleColor, mr: 1 }} />
              <Typography variant="h6" sx={{ color: cardTitleColor, fontWeight: 'bold' }}>
                Recent Activities
              </Typography>
            </Box>
            <Typography>New contact added: <b>"Byrne Dairy"</b></Typography>
            <Typography>Updated unit status: <b>"Duddeni Unit"</b> to Active</Typography>
            <Typography>Generated monthly report</Typography>
            <Typography>Scheduled follow-up with <b>"Arokya Farms"</b></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* Section Heading */}
    <Box sx={{ borderBottom: `2px solid ${sectionColor}`, mb: 1, pb: 0.5 }}>
      <Typography variant="h6" sx={{ color: sectionColor, fontWeight: 'bold' }}>
        Processing Units
      </Typography>
    </Box>
    <Box sx={{
      ml: 2, mt: 1, color: sectionColor, fontWeight: 'bold', cursor: 'pointer',
      display: 'flex', alignItems: 'center', fontSize: 18
    }}>
      <Box component="span" sx={{ fontSize: 22, mr: 1 }}>+</Box>
      Add New Processing Unit
    </Box>
  </Box>
);

export default DashboardContent;
