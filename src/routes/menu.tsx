import { ReactNode } from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FactoryIcon from '@mui/icons-material/Factory';
import HomeIcon from '@mui/icons-material/Home';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';

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
          borderRadius: 1,
          mx: 1,
          '&.active': {
            backgroundColor: 'rgba(44, 108, 176, 0.12)',
            color: 'var(--primary-main)',
            '& .MuiListItemIcon-root': {
              color: 'var(--primary-main)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(44, 108, 176, 0.08)',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

export default function Menu() {
  return (
    <Box sx={{ width: '100%' }}>
      <List sx={{ py: 0 }}>
        <MenuItem to="/" icon={<HomeIcon />} text="Home" />
        <MenuItem to="/business-analysis" icon={<BusinessCenterIcon />} text="Business Analysis" />
        <MenuItem to="/minimum-sales-support-price" icon={<FactoryIcon />} text="Minimum Sales Support Price" />
      </List>
    </Box>
  );
}
