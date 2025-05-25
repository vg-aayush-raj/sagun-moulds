import { forwardRef } from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps, SxProps, Theme } from '@mui/material';

// Base styles for all text fields
const baseStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary-main)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--primary-main)',
  },
};

// Export the TextFieldProps type that extends MUI's TextFieldProps and also includes inputProps
export interface TextFieldProps extends Omit<MuiTextFieldProps, 'inputProps'> {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

// Our custom TextField component that handles deprecated inputProps
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const { sx, inputProps, ...rest } = props;

  // Handle inputProps specifically for step, min, max attributes
  // Instead of trying to map to slotProps (which has a different structure),
  // we'll use InputProps.inputProps which is still supported for basic HTML attributes
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
    <MuiTextField
      ref={ref}
      variant="outlined"
      size="medium"
      fullWidth
      sx={{ ...baseStyles, ...sx }}
      {...updatedProps}
    />
  );
});

TextField.displayName = 'TextField';

export default TextField;
