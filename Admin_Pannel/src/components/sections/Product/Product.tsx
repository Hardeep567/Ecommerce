import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for redirect
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Alert,
  Button,
} from '@mui/material';
import axios from 'axios';

interface ProductVariant {
  id: number;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  variants: ProductVariant[];
}

interface FlattenedRow extends ProductVariant {
  productId: number;
  name: string;
  description: string;
  category: string;
  brand: string;
}

const ProductTable: React.FC = () => {
  const [rows, setRows] = useState<FlattenedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get<Product[]>('http://localhost:3001/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched products:', res.data);

        if (!Array.isArray(res.data)) {
          console.warn('Unexpected API response:', res.data);
          setError('Unexpected data from server.');
          return;
        }

        const flattened: FlattenedRow[] = res.data.flatMap((product) =>
          (product.variants || []).map((variant) => ({
            ...variant,
            productId: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            brand: product.brand,
          }))
        );

        console.log('Flattened rows:', flattened);

        setRows(flattened);

        if (flattened.length === 0) {
          setError('No product variants found.');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);

        if (err.response?.status === 401) {
          setError('Unauthorized. Redirecting to login...');
          setTimeout(() => navigate('/authentication/login'), 1500);
        } else if (err.request) {
          setError('No response from server. Check backend or network.');
        } else {
          setError('Unexpected error: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [retryKey, navigate]);

  const columns: GridColDef<FlattenedRow>[] = [
    { field: 'productId', headerName: 'Product ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'brand', headerName: 'Brand', width: 130 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'color', headerName: 'Color', width: 100 },
    { field: 'size', headerName: 'Size', width: 100 },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      type: 'number',
    },
    {
      field: 'quantity',
      headerName: 'Stock',
      width: 100,
      type: 'number',
    },
    {
      field: 'image_url',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<string>) => {
        const imagePath = params.value || '';
        const fullImageUrl = `http://localhost:3000/nickelfox${
          imagePath.startsWith('/') ? imagePath : '/' + imagePath
        }`;

        return (
          <img
            src={fullImageUrl}
            alt="variant"
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/fallback.png';
            }}
          />
        );
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Typography variant="h4">Product Inventory</Typography>
  <Button
    variant="contained"
    color="primary"
    onClick={() => navigate('/Product/addProduct')}
  >
    + Add Product
  </Button>
</Box>


      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Box mb={2}>
          <Alert severity="warning" sx={{ mb: 1 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={() => setRetryKey((k) => k + 1)}>
            Retry
          </Button>
        </Box>
      )}

      {!loading && !error && rows.length === 0 && (
        <Typography>No product variants to display.</Typography>
      )}

      {!loading && rows.length > 0 && (
        <Box sx={{ height: 600, width: '100%', mt: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => `${row.productId}-${row.id}`}
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            disableRowSelectionOnClick
            autoHeight={false}
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductTable;
