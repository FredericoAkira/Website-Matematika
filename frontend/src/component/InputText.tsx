import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "./InputField/input";

interface InputFieldProps {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  tempValue?: string | number;
}

export const InputText: React.FC<InputFieldProps> = ({
  name,
  type,
  placeholder,
  required,
  disabled,
  label,
  tempValue,
}) => {
  const { setValue } = useFormContext();
  const [inputValue, setInputValue] = useState<string | number | undefined>(
    (tempValue as string) || "",
  );

  useEffect(() => {
    if (tempValue !== undefined) {
      setInputValue(tempValue);
      setValue(name, tempValue); // Set inputValue when tempValue is defined
    }
  }, [tempValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      type === "number"
        ? e.target.value
          ? Number(e.target.value)
          : undefined
        : e.target.value;
    setInputValue(newValue); // Update inputValue when input changes
    setValue(name, newValue);
  };

  return (
    <div>
        <label
            htmlFor={name}
            className="text-xs font-sans text-black-400 font-semibold mr-3"
        >
            {label ? label : name}
            {required && <span className="text-red-500">*</span>}
        </label>
        <Input
            type={type}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            value={inputValue}
            onChange={handleChange}
            className="border border-gray-400 w-full"
        />
    </div>
  );
};
