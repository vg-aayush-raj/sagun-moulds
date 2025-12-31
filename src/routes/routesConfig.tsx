import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const BusinessAnalysis = lazy(() => import('../features/business-analysis/BusinessAnalysis'));
const MinimumSalesSupportPrice = lazy(() => import('../features/minimum-sales-support-price/MinimumSalesSupportPrice'));
const AdvancedCupCalculator = lazy(() => import('../features/advanced-cup-calculator/AdvancedCupCalculator'));
const BreakEvenCalculator = lazy(() => import('../features/break-even-calculator/BreakEvenCalculator'));
const CupPriceCalculator = lazy(() => import('../features/cup-price-calculator/CupPriceCalculator'));
const RawMaterialManagement = lazy(() => import('../features/raw-material-management/RawMaterialManagement'));
const Invoicing = lazy(() => import('../features/invoicing/Invoicing'));
const CompanyManagement = lazy(() => import('../features/company-management/CompanyManagement'));
const ProformaManagement = lazy(() => import('../features/proforma-management/ProformaManagement'));
const Quotation = lazy(() => import('../features/quotation/Quotation'));
const EmployeeManagement = lazy(() => import('../features/employee-management/EmployeeManagement'));

const routesConfig: RouteObject[] = [
  // Business Analysis route
  {
    path: 'business-analysis',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BusinessAnalysis />
      </Suspense>
    ),
  },
  // Minimum Sales Support Price route
  {
    path: 'minimum-sales-support-price',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <MinimumSalesSupportPrice />
      </Suspense>
    ),
  },
  // Advanced Cup Calculator route
  {
    path: 'advanced-cup-calculator',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdvancedCupCalculator />
      </Suspense>
    ),
  },
  // Break-Even Calculator route
  {
    path: 'break-even-calculator',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BreakEvenCalculator />
      </Suspense>
    ),
  },
  // Cup Price Calculator route
  {
    path: 'cup-price-calculator',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CupPriceCalculator />
      </Suspense>
    ),
  },
  // Raw Material Management route
  {
    path: 'raw-materials',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RawMaterialManagement />
      </Suspense>
    ),
  },
  // Invoicing route
  {
    path: 'invoicing',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Invoicing />
      </Suspense>
    ),
  },
  // Company Management route
  {
    path: 'companies',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CompanyManagement />
      </Suspense>
    ),
  },
  // Proforma Management route
  {
    path: 'proforma',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProformaManagement />
      </Suspense>
    ),
  },
  // Quotation route
  {
    path: 'quotation',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Quotation />
      </Suspense>
    ),
  },
  // Employee Management route
  {
    path: 'employees',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EmployeeManagement />
      </Suspense>
    ),
  },
];

export default routesConfig;
