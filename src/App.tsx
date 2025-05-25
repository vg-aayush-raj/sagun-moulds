import { FC } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Drawer } from '@mui/material';
import LandingPage from './features/landing-page/LandingPage';
import Menu from './routes/menu';
import routesConfig from './routes/routesConfig';

const AppLayout: FC = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Sagun Moldify
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Menu />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      ...routesConfig,
    ],
  },
]);

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
