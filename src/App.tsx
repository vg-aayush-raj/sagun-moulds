import { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routesConfig from './routes/routesConfig';
import LandingPage from './features/landing-page/LandingPage';

const AppLayout = () => {
  return <LandingPage />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routesConfig,
  },
]);

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
