import { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, SxProps, Theme } from '@mui/material';

// Base styles for primary and secondary buttons
const primaryStyles: SxProps<Theme> = {
  backgroundColor: 'var(--primary-main)',
  color: 'white',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'var(--primary-dark)',
  },
};

const secondaryStyles: SxProps<Theme> = {
  backgroundColor: 'transparent',
  color: 'var(--primary-main)',
  borderColor: 'var(--primary-main)',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'var(--primary-lighter)',
    borderColor: 'var(--primary-main)',
  },
};

export interface ButtonProps extends MuiButtonProps {
  buttonType?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { buttonType = 'primary', variant = buttonType === 'primary' ? 'contained' : 'outlined', sx, ...rest } = props;

  const baseStyles = buttonType === 'primary' ? primaryStyles : secondaryStyles;

  return <MuiButton ref={ref} variant={variant} sx={{ ...baseStyles, ...sx }} {...rest} />;
});

Button.displayName = 'Button';

export default Button;
