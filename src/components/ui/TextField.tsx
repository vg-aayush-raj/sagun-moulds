import { forwardRef } from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

// Export the TextFieldProps type that extends MUI's TextFieldProps and also includes inputProps
export interface TextFieldProps extends Omit<MuiTextFieldProps, 'inputProps'> {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

// Our custom TextField component that handles deprecated inputProps
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const { inputProps, ...rest } = props;

  return <MuiTextField ref={ref} variant="outlined" size="medium" fullWidth inputProps={inputProps} {...rest} />;
});

TextField.displayName = 'TextField';

export default TextField;
