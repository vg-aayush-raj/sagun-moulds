import apiClient from './client';

export interface MaterialType {
  id: number;
  name: string;
  description?: string;
  unit: string;
  is_active: boolean;
}

export interface RawMaterialEntry {
  material_type_id: number;
  kg_quantity: number;
  base_price: number;
  gst_amount: number;
  final_amount: number;
  entry_date: string;
  supplier_name?: string;
  notes?: string;
}

export interface StockBalance {
  material_type_id: number;
  material_name: string;
  current_balance: number;
  min_threshold: number;
  is_low_stock: boolean;
  unit: string;
}

export interface SummaryData {
  summary: {
    total_base_price: number;
    total_gst_amount: number;
    total_final_amount: number;
    total_kg: number;
    entry_count: number;
  };
  entries: any[];
}

export interface MaterialSummary {
  total_base_price: number;
  total_gst_amount: number;
  total_final_amount: number;
  total_kg: number;
}

export const rawMaterialApi = {
  getMaterialTypes: async () => {
    const response = await apiClient.get<MaterialType[]>('/material-types');
    return response.data;
  },

  createEntry: async (data: RawMaterialEntry) => {
    const response = await apiClient.post('/raw-materials/entry', data);
    return response.data;
  },

  getSummary: async (filters?: { month?: number; year?: number; start_date?: string; end_date?: string }) => {
    const response = await apiClient.get<MaterialSummary>('/raw-materials/summary', { params: filters });
    return response.data;
  },

  addStock: async (data: { material_type_id: number; kg_quantity: number; notes?: string }) => {
    const response = await apiClient.post('/raw-materials/stock/add', data);
    return response.data;
  },

  removeStock: async (data: { material_type_id: number; kg_quantity: number; notes?: string }) => {
    const response = await apiClient.delete('/raw-materials/stock/remove', { data });
    return response.data;
  },

  getStockBalance: async () => {
    const response = await apiClient.get<StockBalance[]>('/raw-materials/stock/balance');
    return response.data;
  },

  updateThreshold: async (materialTypeId: number, minThreshold: number) => {
    const response = await apiClient.put(`/raw-materials/stock/threshold/${materialTypeId}`, {
      min_threshold: minThreshold,
    });
    return response.data;
  },

  getTransactionHistory: async (materialTypeId?: number, limit?: number) => {
    const response = await apiClient.get('/raw-materials/transactions', {
      params: { material_type_id: materialTypeId, limit },
    });
    return response.data;
  },
};
