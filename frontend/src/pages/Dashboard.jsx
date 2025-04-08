import React from 'react';
import { Container, Typography } from '@mui/material';
import ComplaintForm from '../components/ComplaintForm';

export default function Dashboard() {
  return (
    <Container>
      <Typography variant="h4">New Complaint</Typography>
      <ComplaintForm />
    </Container>
  );
}