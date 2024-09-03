import { LuAsterisk } from "react-icons/lu";

export const LabelText = ({
  htmlFor,
  text,
  error,
  isMandatory = true,
  className,
  children,
}: any) => {
  return (
    <label
      className={`flex mb-2 text-sm font-medium items-center gap-1 ${className} ${
        error && "text-red-500"
      }`}
      htmlFor={htmlFor}
    >
      <span>{text || children}</span>{" "}
      {isMandatory && <LuAsterisk className="text-red-500 scale-90" />}
    </label>
  );
};

const Input = ({
  type,
  error,
  id,
  placeholder,
  value,
  dispatch,
  className,
  disabled = false,
  onChange,
}: any) => {
  return (
    <>
      <input
        type={type}
        className={`bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5
        ${className} ${
          error && "text-red-600 placeholder:text-red-600 border-red-600"
        } disabled:bg-gray-200`}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => {
          onChange
            ? onChange(e)
            : error && dispatch({ type: `${id}Err`, payload: "" });
          dispatch({ type: `${id}Val`, payload: e.target.value });
        }}
      />
      {error && <h1 className="text-red-600 p-2 animate-pulse">{error}</h1>}
    </>
  );
};

export default Input;
