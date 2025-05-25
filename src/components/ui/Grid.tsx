import { ElementType, forwardRef } from 'react';
import { Grid as MuiGrid } from '@mui/material';

// Define the props interface for our custom Grid component
export interface GridProps {
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  container?: boolean;
  item?: boolean;
  spacing?: number | string;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  component?: ElementType;
  className?: string;
  children?: React.ReactNode;
  sx?: any;
  [key: string]: any; // Allow other props to pass through
}

// Create a wrapper that correctly handles the props for MUI v7 Grid
export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  // Destructure all the props to ensure we pass them correctly
  const { children, ...otherProps } = props;

  // For MUI v7, we pass all props directly
  return (
    <MuiGrid ref={ref} {...otherProps}>
      {children}
    </MuiGrid>
  );
});

Grid.displayName = 'Grid';

export default Grid;
