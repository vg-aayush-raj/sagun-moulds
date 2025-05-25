import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HomeIcon from '@mui/icons-material/Home';

interface MenuItemProps {
  to: string;
  icon: ReactNode;
  text: string;
}

function MenuItem({ to, icon, text }: MenuItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NavLink}
        to={to}
        sx={{
          '&.active': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

export default function Menu() {
  return (
    <Box sx={{ width: '100%' }}>
      <List>
        <MenuItem to="/" icon={<HomeIcon />} text="Home" />
        <MenuItem to="/business-analysis" icon={<BusinessCenterIcon />} text="Business Analysis" />
      </List>
    </Box>
  );
}
