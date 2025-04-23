import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const YourComponent = lazy(() => import('../features/your-component/YourComponent'));

const routesConfig: RouteObject[] = [
  // routes will be added here
  {
    path: 'your-path',
    children: [
      {
        path: 'your-module-path',
        element: (
          <Suspense>
            <YourComponent />
          </Suspense>
        ),
      },
    ],
  },
];

export default routesConfig;
