import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip
} from '@mui/material';
import api from '../utils/api';

export default function ComplaintList({ adminView = false }) {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const endpoint = adminView ? '/complaints/admin' : '/complaints';
        const res = await api.get(endpoint);
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, [adminView]);

  const handleAssign = async (complaintId, adminId) => {
    await api.put(`/complaints/${complaintId}/assign`, { adminId, hours: 48 });
    // Refresh list
    const res = await api.get(adminView ? '/complaints/admin' : '/complaints');
    setComplaints(res.data);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            {adminView && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint._id}>
              <TableCell>{complaint._id.slice(-6)}</TableCell>
              <TableCell>{complaint.description}</TableCell>
              <TableCell>
                <Chip 
                  label={complaint.status} 
                  color={
                    complaint.status === 'resolved' ? 'success' : 
                    complaint.status === 'open' ? 'default' : 'primary'
                  } 
                />
              </TableCell>
              {adminView && (
                <TableCell>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleAssign(complaint._id, 'ADMIN_ID_HERE')}
                  >
                    Assign to Me
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}              