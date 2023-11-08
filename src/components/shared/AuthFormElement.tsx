import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, FieldValues, Path } from 'react-hook-form';

interface FormElementProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  control: Control<T>;
}

const FormElement = <
  T extends FieldValues & React.HTMLAttributes<HTMLInputElement>
>({
  name,
  control,
  label,
  type,
  ...rest
}: FormElementProps<T>): React.ReactElement => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} className="shad-input" {...field} {...rest} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormElement;
