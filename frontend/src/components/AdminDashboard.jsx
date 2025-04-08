import React, { useEffect, useState } from 'react';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';
import ComplaintList from './ComplaintList';
import UserManagement from './UserManagement';
import api from '../utils/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [value, setValue] = useState(0);
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/complaints/stats');
      setStats(res.data);
    };
    fetchStats();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Complaints" />
          <Tab label="User Management" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        <ComplaintList adminView={true} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserManagement />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>Open: {stats.open}</Typography>
        <Typography>In Progress: {stats.inProgress}</Typography>
        <Typography>Resolved: {stats.resolved}</Typography>
      </TabPanel>
    </Container>
  );
}