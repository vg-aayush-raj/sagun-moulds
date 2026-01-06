import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Typography, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import styles from './CompanyManagement.module.css';
import CompanyForm from './components/CompanyForm';
import CompanyList from './components/CompanyList';
import { CompanyFormData } from './schema';
import { companyApi, Company } from '../../api/companyApi';
import { useAppContext } from '../../context/AppContext';

export default function CompanyManagement() {
  const { companies, refreshCompanies, loading: contextLoading } = useAppContext();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = () => {
    setFormMode('create');
    setSelectedCompany(null);
    setFormOpen(true);
  };

  const handleEdit = (company: Company) => {
    setFormMode('edit');
    setSelectedCompany(company);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CompanyFormData) => {
    try {
      setError(null);

      if (formMode === 'create') {
        await companyApi.create(data);
        setSuccess('Company created successfully');
      } else if (selectedCompany) {
        await companyApi.update(selectedCompany.id!, data);
        setSuccess('Company updated successfully');
      }
      await refreshCompanies();
      setFormOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await companyApi.delete(id);
      setSuccess('Company deleted successfully');
      await refreshCompanies();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Company Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Company
        </Button>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card className={styles.cardContainer}>
        <CardContent>
          <CompanyList companies={companies} loading={contextLoading} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <CompanyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCompany}
        mode={formMode}
      />
    </div>
  );
}
