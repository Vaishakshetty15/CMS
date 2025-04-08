// frontend/src/components/ComplaintForm.jsx
import React, { useState } from 'react';
import { Button, TextField, MenuItem } from '@mui/material';
import api from '../utils/api';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    category: 'product',
    priority: 'low',
    description: '',
    files: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    data.append('description', formData.description);
    
    formData.files.forEach(file => {
      data.append('attachments', file);
    });

    try {
      await api.post('/complaints', data);
      // Handle success
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {/* Form fields */}
    </form>
  );
};