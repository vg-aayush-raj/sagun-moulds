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

// Re-export the TextFieldProps type from MUI
export type TextFieldProps = MuiTextFieldProps;

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const { sx, ...rest } = props;

  return <MuiTextField ref={ref} variant="outlined" size="medium" fullWidth sx={{ ...baseStyles, ...sx }} {...rest} />;
});

TextField.displayName = 'TextField';

export default TextField;
