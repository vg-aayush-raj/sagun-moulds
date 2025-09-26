import { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, SxProps, Theme } from '@mui/material';

// Base styles for primary and secondary buttons
const primaryStyles: SxProps<Theme> = {
  backgroundColor: 'var(--primary-main)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(44, 108, 176, 0.3)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'var(--primary-dark)',
    boxShadow: '0 4px 12px rgba(44, 108, 176, 0.4)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
};

const secondaryStyles: SxProps<Theme> = {
  backgroundColor: 'transparent',
  color: 'var(--primary-main)',
  borderColor: 'var(--primary-main)',
  borderWidth: '2px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'var(--primary-main)',
    borderColor: 'var(--primary-main)',
    color: 'white',
    borderWidth: '2px',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(44, 108, 176, 0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
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
