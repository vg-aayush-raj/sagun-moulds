import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const BusinessAnalysis = lazy(() => import('../features/business-analysis/BusinessAnalysis'));

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
];

export default routesConfig;
