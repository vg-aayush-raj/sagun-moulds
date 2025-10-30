import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const BusinessAnalysis = lazy(() => import('../features/business-analysis/BusinessAnalysis'));
const MinimumSalesSupportPrice = lazy(() => import('../features/minimum-sales-support-price/MinimumSalesSupportPrice'));
const AdvancedCupCalculator = lazy(() => import('../features/advanced-cup-calculator/AdvancedCupCalculator'));
const BreakEvenCalculator = lazy(() => import('../features/break-even-calculator/BreakEvenCalculator'));

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
];

export default routesConfig;
