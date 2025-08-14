import { useEffect, useState, ReactElement} from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";
import paths from 'routes/paths';
import { Stack, Avatar, Tooltip, Typography, CircularProgress } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  GridRowsProp,
  useGridApiRef,
  GridActionsCellItem,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import { rows } from 'data/user-data';
import { stringAvatar } from 'helpers/string-avatar';
import IconifyIcon from 'components/base/IconifyIcon';
import { currencyFormat } from 'helpers/format-functions';
import Available from 'components/base/usersData/available';
import UserNoResultsOverlay from 'components/base/usersData/NoUserFound';

const columns: GridColDef<any>[] = [
  {
    field: 'id',
    headerName: 'ID',
    resizable: false,
    minWidth: 60,
  },
  {
    field: 'name',
    headerName: 'Name',
    valueGetter: (params: any) => {
      return params;
    },
    renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
      return (
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title={params.row.name} placement="top" arrow>
            <Avatar {...stringAvatar(params.row.name)} />
          </Tooltip>
          <Typography variant="body2">{params.row.name}</Typography>
        </Stack>
      );
    },
    resizable: false,
    flex: 1,
    minWidth: 155,
  },
  {
    field: 'email',
    headerName: 'Email',
    resizable: false,
    flex: 0.5,
    minWidth: 145,
  },
  {
    field: 'password',
    headerName: 'Hashed Password',
    resizable: false,
    flex: 1,
    minWidth: 115,
  },
];
type UserRow = {
  id: number;
  name: string;
  email: string;
  hashedPassword: string;
};
const UserTable = ({ searchText }: { searchText: string }): ReactElement => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const apiRef = useGridApiRef();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<UserRow[]>('http://localhost:3001/api/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        if(!res){
          navigate(paths.login);
        }
        setRows(res.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredRows = searchText
    ? rows.filter((row) =>
        row.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : rows;

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={columns}
        rows={filteredRows}
        autoHeight
        rowHeight={56}
        checkboxSelection
        disableColumnMenu
        disableRowSelectionOnClick
        onResize={() => {
          apiRef.current.autosizeColumns({
            includeOutliers: true,
            expand: true,
          });
        }}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 7 } },
        }}
        slots={{
          loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
          pagination: Available as GridSlots['pagination'],
          noResultsOverlay: UserNoResultsOverlay as GridSlots['noResultsOverlay'],
        }}
        slotProps={{
          pagination: { labelRowsPerPage: rows.length },
        }}
        sx={{
          height: 1,
          width: 1,
          tableLayout: 'fixed',
          scrollbarWidth: 'thin',
        }}
      />
    </>
  );
};

export default UserTable;
