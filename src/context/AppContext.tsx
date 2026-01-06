import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { companyApi, Company } from '../api/companyApi';
import { invoiceApi, GSTBalance } from '../api/invoiceApi';
import { rawMaterialApi, MaterialType } from '../api/rawMaterialApi';

interface AppContextType {
  materialTypes: MaterialType[];
  companies: Company[];
  gstBalance: GSTBalance | null;
  loading: boolean;
  error: string | null;
  refreshMaterialTypes: () => Promise<void>;
  refreshCompanies: () => Promise<void>;
  refreshGSTBalance: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [gstBalance, setGSTBalance] = useState<GSTBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMaterialTypes = async () => {
    try {
      const data = await rawMaterialApi.getMaterialTypes();
      setMaterialTypes(data);
    } catch (err: any) {
      console.error('Failed to fetch material types:', err);
      setError(err.message);
    }
  };

  const refreshCompanies = async () => {
    try {
      const data = await companyApi.list();
      setCompanies(data);
    } catch (err: any) {
      console.error('Failed to fetch companies:', err);
      setError(err.message);
    }
  };

  const refreshGSTBalance = async () => {
    try {
      const data = await invoiceApi.getGSTCreditBalance();
      setGSTBalance(data);
    } catch (err: any) {
      console.error('Failed to fetch GST balance:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      try {
        await Promise.all([refreshMaterialTypes(), refreshCompanies(), refreshGSTBalance()]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        materialTypes,
        companies,
        gstBalance,
        loading,
        error,
        refreshMaterialTypes,
        refreshCompanies,
        refreshGSTBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
