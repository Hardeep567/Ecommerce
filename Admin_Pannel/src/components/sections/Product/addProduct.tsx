// Frontend React Component (ProductUploadForm.tsx)
import React, { useState } from 'react';
import {
  Box, Button, Stack, TextField, Typography, IconButton, Input, Paper,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const ProductUploadForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
  });

  const [variants, setVariants] = useState([
    { color: '', size: '', quantity: '', price: '', image: null as File | null }
  ]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleVariantChange = (index: number, field: keyof typeof variants[0], value: any) => {
    const newVariants = [...variants];
    if (field === 'image') {
      newVariants[index][field] = value;
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result as string;
        setPreviews(newPreviews);
      };
      reader.readAsDataURL(value);
    } else {
      newVariants[index][field] = value;
    }
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', quantity: '', price: '', image: null }]);
    setPreviews([...previews, '']);
  };

  const removeVariant = (index: number) => {
    const updated = [...variants];
    const updatedPreviews = [...previews];
    updated.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setVariants(updated);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => formData.append(key, value));

    variants.forEach((variant) => {
      if (variant.image) formData.append('images', variant.image);
    });

    const metadata = variants.map((v) => ({
      color: v.color,
      size: v.size,
      price: v.price,
      quantity: v.quantity,
    }));
    formData.append('variants', JSON.stringify(metadata));

    try {
      const res = await fetch('http://localhost:3001/api/products/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include credentials for cookies
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('✅ Product uploaded successfully!');
        setProduct({ name: '', description: '', category: '', brand: '' });
        setVariants([{ color: '', size: '', quantity: '', price: '', image: null }]);
        setPreviews([]);
      } else {
        setMessage(`❌ ${result.error || 'Upload failed.'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error.');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Upload Product</Typography>
      {message && <Typography color="primary" mb={2}>{message}</Typography>}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {['name', 'description', 'category', 'brand'].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              required
              fullWidth
              value={(product as any)[field]}
              onChange={handleProductChange}
            />
          ))}

          <Typography variant="h6">Variants</Typography>
          {variants.map((variant, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <TextField label="Color" required value={variant.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} />
              <TextField label="Size" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} />
              <TextField label="Quantity" type="number" value={variant.quantity} onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)} />
              <TextField label="Price" type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} />
              <Input type="file" inputProps={{ accept: 'image/*' }} onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];
                if (file) handleVariantChange(index, 'image', file);
              }} />
              {previews[index] && <img src={previews[index]} alt="Preview" style={{ width: 60 }} />}
              {index > 0 && (
                <IconButton onClick={() => removeVariant(index)} color="error">
                  <Delete />
                </IconButton>
              )}
            </Stack>
          ))}
          <Button startIcon={<Add />} onClick={addVariant}>Add Variant</Button>
          <Button type="submit" variant="contained" color="primary">Upload</Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProductUploadForm;
