import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`business-analysis-tabpanel-${index}`}
      aria-labelledby={`business-analysis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
