import React from "react";
import Select from "react-select";
import { useTheme } from "./ThemeProvider";

const customStyles = (isDarkMode: boolean) => ({
  control: (provided: any) => ({
    ...provided,
    border: "none",
    borderRadius: 0,
    backgroundColor: isDarkMode ? "#1a1a1a" : "#fff", // Adjust background based on dark mode
    color: isDarkMode ? "#fff" : "#000", // Adjust text color based on dark mode
    boxShadow: "none",
    minHeight: "36px", // Adjust height if needed
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#2a2a2a" : "#fff", // Adjust dropdown background
    borderRadius: 0,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? isDarkMode
        ? "#3a3a3a"
        : "#e6e6e6"
      : isDarkMode
        ? "#2a2a2a"
        : "#fff",
    color: isDarkMode ? "#fff" : "#000", // Adjust option text color
    "&:hover": {
      backgroundColor: isDarkMode ? "#3a3a3a" : "#e6e6e6", // Hover effect
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: isDarkMode ? "#aaa" : "#666", // Adjust placeholder color
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: isDarkMode ? "#fff" : "#000", // Adjust selected value color
  }),
});

const ReactSelect = ({
  className,
  placeholder = "Select an email template",
  styles,
  options = [],
  defaultValue,
  dispatch,
  onChange,
}: any) => {
  const { theme } = useTheme();

  return (
    <Select
      className={className}
      placeholder={placeholder}
      options={options}
      defaultValue={defaultValue}
      onChange={(value: any) => onChange(value)}
      styles={styles ? styles : customStyles(theme === "dark")}
      getOptionLabel={(option: any) => option.name} // Use "name" as the label
      getOptionValue={(option: any) => option.html} // Use "html" as the value
    />
  );
};

export default ReactSelect;
