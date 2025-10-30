import { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, SxProps, Theme } from '@mui/material';

// Base styles for primary and secondary buttons
const primaryStyles: SxProps<Theme> = {
  backgroundColor: '#2c6cb0',
  color: '#ffffff',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(44, 108, 176, 0.3)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#1d4c82',
    boxShadow: '0 4px 12px rgba(44, 108, 176, 0.4)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
};

const secondaryStyles: SxProps<Theme> = {
  backgroundColor: 'transparent',
  color: '#2c6cb0',
  borderColor: '#2c6cb0',
  borderWidth: '2px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#2c6cb0',
    borderColor: '#2c6cb0',
    color: '#ffffff',
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
  const { buttonType, variant, color, sx, ...rest } = props;

  // Determine the variant based on buttonType or explicit variant prop
  const finalVariant = variant || (buttonType === 'secondary' ? 'outlined' : 'contained');

  // If color prop is explicitly set (like 'error'), don't apply custom styles
  if (color && color !== 'primary') {
    return <MuiButton ref={ref} variant={finalVariant} color={color} sx={sx} {...rest} />;
  }

  // Determine which styles to apply
  let baseStyles: SxProps<Theme>;

  if (finalVariant === 'outlined' || buttonType === 'secondary') {
    baseStyles = secondaryStyles;
  } else {
    // Default to primary styles for contained buttons
    baseStyles = primaryStyles;
  }

  return <MuiButton ref={ref} variant={finalVariant} sx={{ ...baseStyles, ...sx }} {...rest} />;
});

Button.displayName = 'Button';

export default Button;
