import { ReactNode } from 'react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalculateIcon from '@mui/icons-material/Calculate';
import DescriptionIcon from '@mui/icons-material/Description';
import FactoryIcon from '@mui/icons-material/Factory';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
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
        <Divider sx={{ my: 1 }} />
        <MenuItem to="/raw-materials" icon={<InventoryIcon />} text="Raw Materials" />
        <MenuItem to="/invoicing" icon={<ReceiptIcon />} text="Invoicing" />
        <MenuItem to="/proforma" icon={<DescriptionIcon />} text="Proforma" />
        <MenuItem to="/quotation" icon={<RequestQuoteIcon />} text="Quotation" />
        <MenuItem to="/companies" icon={<BusinessIcon />} text="Companies" />
        <Divider sx={{ my: 1 }} />
        <MenuItem to="/business-analysis" icon={<BusinessCenterIcon />} text="Business Analysis" />
        <MenuItem to="/minimum-sales-support-price" icon={<FactoryIcon />} text="Minimum Sales Support Price" />
        <MenuItem to="/advanced-cup-calculator" icon={<CalculateIcon />} text="Advanced Cup Calculator" />
        <MenuItem to="/break-even-calculator" icon={<AccountBalanceIcon />} text="Break-Even Calculator" />
        <MenuItem to="/cup-price-calculator" icon={<AttachMoneyIcon />} text="Cup Price Calculator" />
      </List>
    </Box>
  );
}
