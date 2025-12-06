import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { rawMaterialApi } from '../../../api/rawMaterialApi';
import { useAppContext } from '../../../context/AppContext';
import { stockOperationSchema, StockOperationFormData } from '../schema';

interface StockManagerProps {
  onSuccess: () => void;
}

export default function StockManager({ onSuccess }: StockManagerProps) {
  const { materialTypes } = useAppContext();
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control: controlAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<StockOperationFormData>({
    resolver: zodResolver(stockOperationSchema),
  });

  const {
    control: controlRemove,
    handleSubmit: handleSubmitRemove,
    reset: resetRemove,
    formState: { errors: errorsRemove },
  } = useForm<StockOperationFormData>({
    resolver: zodResolver(stockOperationSchema),
  });

  const handleAddStock = async (data: StockOperationFormData) => {
    setLoading(true);
    setError(null);

    try {
      await rawMaterialApi.addStock(data);
      setOpenAdd(false);
      resetAdd();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStock = async (data: StockOperationFormData) => {
    setLoading(true);
    setError(null);

    try {
      await rawMaterialApi.removeStock(data);
      setOpenRemove(false);
      resetRemove();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
        Add Stock
      </Button>

      <Button variant="contained" color="error" startIcon={<RemoveIcon />} onClick={() => setOpenRemove(true)}>
        Remove Stock
      </Button>

      {/* Add Stock Dialog */}
      <Dialog open={openAdd} onClose={() => !loading && setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Stock</DialogTitle>
        <form onSubmit={handleSubmitAdd(handleAddStock)}>
          <DialogContent>
            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Controller
              name="material_type_id"
              control={controlAdd}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Material Type"
                  fullWidth
                  required
                  error={!!errorsAdd.material_type_id}
                  helperText={errorsAdd.material_type_id?.message}
                  sx={{ mb: 2 }}
                >
                  {materialTypes.map((mat) => (
                    <MenuItem key={mat.id} value={mat.id}>
                      {mat.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="kg_quantity"
              control={controlAdd}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Quantity (KG)"
                  fullWidth
                  required
                  inputProps={{ step: '0.01', min: '0.01' }}
                  error={!!errorsAdd.kg_quantity}
                  helperText={errorsAdd.kg_quantity?.message}
                  sx={{ mb: 2 }}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />

            <Controller
              name="notes"
              control={controlAdd}
              render={({ field }) => <TextField {...field} label="Notes (Optional)" fullWidth multiline rows={2} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Adding...' : 'Add Stock'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Remove Stock Dialog */}
      <Dialog open={openRemove} onClose={() => !loading && setOpenRemove(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Remove Stock</DialogTitle>
        <form onSubmit={handleSubmitRemove(handleRemoveStock)}>
          <DialogContent>
            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Controller
              name="material_type_id"
              control={controlRemove}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Material Type"
                  fullWidth
                  required
                  error={!!errorsRemove.material_type_id}
                  helperText={errorsRemove.material_type_id?.message}
                  sx={{ mb: 2 }}
                >
                  {materialTypes.map((mat) => (
                    <MenuItem key={mat.id} value={mat.id}>
                      {mat.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="kg_quantity"
              control={controlRemove}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Quantity (KG)"
                  fullWidth
                  required
                  inputProps={{ step: '0.01', min: '0.01' }}
                  error={!!errorsRemove.kg_quantity}
                  helperText={errorsRemove.kg_quantity?.message}
                  sx={{ mb: 2 }}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />

            <Controller
              name="notes"
              control={controlRemove}
              render={({ field }) => <TextField {...field} label="Notes (Optional)" fullWidth multiline rows={2} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRemove(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="error" disabled={loading}>
              {loading ? 'Removing...' : 'Remove Stock'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
