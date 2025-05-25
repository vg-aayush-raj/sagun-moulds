import { forwardRef } from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  SxProps,
  Theme,
  Typography,
  Box,
} from '@mui/material';

// Base styles for all text fields
const baseStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary-main)',
    },
  },
  // Simplify label styling to make it plain and clean
  '& .MuiInputLabel-root': {
    fontWeight: 'normal',
    color: 'var(--text-secondary)',
    width: 'auto',
    transform: 'none',
    position: 'static',
    marginBottom: '8px',
  },
  // Remove floating label effect
  '& .MuiInputLabel-shrink': {
    transform: 'none',
  },
};

// Export the TextFieldProps type that extends MUI's TextFieldProps and also includes inputProps
export interface TextFieldProps extends Omit<MuiTextFieldProps, 'inputProps'> {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

// Our custom TextField component that handles deprecated inputProps
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const { sx, inputProps, label, ...rest } = props;

  // Handle inputProps specifically for step, min, max attributes
  const updatedProps = inputProps
    ? {
        ...rest,
        InputProps: {
          ...rest.InputProps,
          inputProps: {
            ...(rest.InputProps?.inputProps || {}),
            ...inputProps,
          },
        },
      }
    : rest;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {label && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <MuiTextField
        ref={ref}
        variant="outlined"
        size="medium"
        fullWidth
        sx={{ ...baseStyles, ...sx }}
        {...updatedProps}
      />
    </Box>
  );
});

TextField.displayName = 'TextField';

export default TextField;
