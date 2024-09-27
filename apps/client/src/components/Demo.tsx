"use client";

import * as React from "react";
import { X } from "lucide-react";
import Select, {
  components,
  MultiValueRemoveProps,
  MultiValueGenericProps,
  GroupBase,
} from "react-select";

import { Badge } from "@/components/ui/badge";

// Define the shape of your option
type OptionType = { value: string; label: string };

// Sample contacts data
const contacts: OptionType[] = [
  {
    value: "kaarthika@retainful.com",
    label: "Kaarthika Nagarajan <kaarthika@retainful.com>",
  },
  { value: "madhav@shopjar.co", label: "Madhav Krishna <madhav@shopjar.co>" },
  {
    value: "team@retainful.com",
    label: "Ramesh Subramaniam <team@retainful.com>",
  },
  {
    value: "vaishaak@flycart.org",
    label: "Vaishaak Shanmugharaj <vaishaak@flycart.org>",
  },
];

// Email validation function
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Custom MultiValue Container
const MultiValueContainer = (
  props: MultiValueGenericProps<OptionType, true, GroupBase<OptionType>>
) => {
  return (
    <Badge variant="secondary" className="text-sm mr-1 mb-1 flex items-center">
      {props.data.label}
      <button
        className="ml-1 hover:bg-muted rounded-full p-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          //   @ts-ignore
          props.removeProps.onClick(e); // Accessing removeProps correctly
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};

// Custom MultiValueRemove (optional, since we're handling removal in MultiValueContainer)
const MultiValueRemove = (
  props: MultiValueRemoveProps<OptionType, true, GroupBase<OptionType>>
) => {
  return (
    <components.MultiValueRemove {...props}>
      <X className="h-3 w-3" />
    </components.MultiValueRemove>
  );
};

export default function EmailRecipientInput() {
  const [recipients, setRecipients] = React.useState<OptionType[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const options = contacts;

  const handleChange = (newValue: OptionType[] | null) => {
    setRecipients(newValue || []);
    setError(null);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setError(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        event.preventDefault();
        if (isValidEmail(inputValue)) {
          const newRecipient = { value: inputValue, label: inputValue };
          // Prevent adding duplicates
          if (
            !recipients.find(
              (recipient) => recipient.value === newRecipient.value
            )
          ) {
            setRecipients([...recipients, newRecipient]);
          }
          setInputValue("");
        } else {
          setError("Invalid email format");
        }
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: "#e2e8f0",
      "&:hover": {
        borderColor: "#cbd5e0",
      },
    }),
    multiValue: () => ({}),
    multiValueLabel: () => ({}),
    multiValueRemove: () => ({}),
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm font-medium">To</span>
        <div className="flex-1">
          <Select<OptionType, true, GroupBase<OptionType>>
            isMulti
            name="recipients"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            value={recipients}
            //   @ts-ignore
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            inputValue={inputValue}
            components={{
              MultiValue: MultiValueContainer,
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            styles={customStyles}
            placeholder="Enter email address"
            noOptionsMessage={() =>
              inputValue.includes("@")
                ? `Press Enter to add "${inputValue}"`
                : "No matching contacts"
            }
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="flex space-x-2 text-sm text-blue-600">
        <button>Cc</button>
        <button>Bcc</button>
      </div>
    </div>
  );
}
