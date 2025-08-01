import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@client/components/ui/form.tsx";
import { Input } from "@client/components/ui/input.tsx";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  description?: string;
};

const StringFormControl = <T extends FieldValues>(props: Props<T>) => {
  const { label, name, placeholder, description, className, disabled } = props;

  const { control } = useFormContext<T, unknown, T>();

  const renderDescription = () => {
    if (!description) return null;

    return <FormDescription>{description}</FormDescription>;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>

          {renderDescription()}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StringFormControl;
