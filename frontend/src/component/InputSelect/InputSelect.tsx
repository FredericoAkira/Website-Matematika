import React, { useEffect, useState } from "react";
import { Select } from ".";
import { Input } from "../InputField/input";
import { Label } from "../Label";

export type optionType = {
  meaning: string;
  value: string;
  position?: string;
  description?: string;
};

interface AutoCompleteProps {
  disabled?: boolean;
  handleSearch: (value: string) => void;
  onChange?: (val?: optionType) => void;
  label?: string;
  loading?: boolean;
  name: string;
  options?: optionType[];
  required: boolean;
  value?: string;
  placeholder?: string;
  inForm?: boolean;
}

export const InputSelect: React.FC<AutoCompleteProps> = ({
  disabled,
  handleSearch,
  label,
  loading,
  name,
  options,
  onChange,
  required,
  value,
  placeholder,
  inForm
}) => {
//   const { setValue } = useFormContext();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined,
  );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      await handleSearch(e.target.value);
    } else{
      handleSearch("");
    }
  };

  const handleValueChange = (e: string) => {
    const baseData = options?.find((item) => item.value === e);
    if (baseData) {
    //   setValue(name, baseData?.value);
      onChange?.(baseData);
    }
  };

  useEffect(() => {
    if (value && value !== null && value.length > 0) {
      setSelectedValue(value);
    } else{
      setSelectedValue(undefined);
    }
  }, [value]);

  return (
    <>
      <Label
        required={required}
        className={inForm ? "text-xs font-sans text-black-400 font-semibold mb-2.5" : `mb-2.5 ml-1`}
      >
        {label ? label : name}
      </Label>
          <Select
            disabled={disabled}
            onValueChange={(e) => {
              handleValueChange(e);
            }}
            value={selectedValue || ""}
          >
            <Select.Trigger className="-mt-2">
              <Select.Value placeholder={placeholder ? placeholder : "Select Something"} />
            </Select.Trigger>
            <Select.Content className="max-h-56 min-h-12 h-full pb-1">
              <div className="fixed z-50 w-full pr-2 pb-2">
                <Input
                  onChange={handleChange}
                  onBlur={({ target }) =>
                    setTimeout(() => {
                      target.focus();
                    }, 1)
                  }
                  placeholder={`Search ${label}`}
                  className="w-full"
                />
              </div>
              {loading && (
                <div className="flex align-middle justify-center items-center">
                  <div className="inline-block w-6 h-6 animate-spin align-[-0.125em]  items-center text-center rounded-full border-[2px] border-solid border-current border-r-transparent justify- text-red-800 text-sm motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              )}
              <Select.Item
                value="placeholder"
                disabled
                className="mt-8"
              ></Select.Item>
              {options?.map(
                (option) =>
                  option?.meaning.trim() !== "" && (
                    <Select.Item
                      key={option?.value}
                      value={option?.value}
                    >
                      {option?.meaning}
                    </Select.Item>
                  ),
              )}
            </Select.Content>
          </Select>
    </>
  );
};
