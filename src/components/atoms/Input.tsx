import { LegacyRef, ReactNode, RefObject } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (e: string) => void;
  className?: string;
  reference?: LegacyRef<HTMLInputElement> | undefined;
  maxLength?: number;
  minLength?: number;
  inputMode?:
    | "none"
    | "search"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "number"
    | "decimal"
    | "date"
    | undefined;
  placeholder?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  name?: string;
  pattern?: RegExp;
  containerStyle?: string;
  showError?: boolean;
  ref?: RefObject<HTMLInputElement>;
  icon?: ReactNode;
  autoComplete?: string;
  autoFocus?: boolean;
  height?: string;
  onEnter?: () => void;
  onBackspace?: () => void;
  errorMsg?: string;
  required?: boolean;
};

export function Input(props: Props) {
  const {
    label,
    value,
    onChange,
    className,
    reference,
    maxLength,
    inputMode = "text",
    placeholder,
    disabled,
    onBlur,
    onFocus,
    name,
    minLength,
    pattern,
    containerStyle,
    showError,
    icon,
    autoComplete,
    autoFocus,
    height,
    onEnter,
    onBackspace,
    errorMsg,
    required,
  } = props;

  return (
    <div className={`min-w-0 flex-col relative flex ${containerStyle}`}>
      <div
        className={`absolute left-4 ${
          errorMsg ? "top-0" : label ? "top-7" : "top-0"
        } bottom-0 z-2 text-2xl text-accent flex items-center`}
      >
        {icon}
      </div>
      {label && (
        <div className={"flex flex-row items-center space-x-1 mb-2"}>
          <label className={"text-sm font-medium text-title"}>{label}</label>
          {required ? (
            <span className={"text-red-500 text-sm font-semibold"}>*</span>
          ) : null}
        </div>
      )}

      <input
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        onChange={(e) => {
          if (pattern) {
            if (
              e.currentTarget.value === "" ||
              pattern.test(e.currentTarget.value)
            ) {
              onChange(e.currentTarget.value);
            }
          } else {
            onChange(e.currentTarget.value);
          }
        }}
        name={name}
        className={`${icon ? "pl-14" : ""} ${
          showError ? "ring-red-500 ring-2" : "ring-gray-200 ring-[0.5px]"
        } transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none hover:bg-gray-100 focus:ring-indigo-500 focus:ring-2 focus:outline-none text-title text-sm
          font-medium px-5 ${height || "h-14"} rounded-xl ${className}`}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            onEnter?.();
          } else if (e.key === "Backspace" || e.key === "Delete") {
            onBackspace?.();
          }
        }}
        ref={reference}
        maxLength={maxLength}
        minLength={minLength}
        type={inputMode}
        value={value}
        placeholder={placeholder || "Placeholder"}
        min={minLength}
        max={maxLength}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
      />
      <span
        className={`flex flex-1 overflow-hidden text-red-500 text-[11px] lg:text-sm pl-2  ${
          errorMsg ? "max-h-[50px] py-1" : "max-h-[0px]"
        } transition-all`}
      >
        {errorMsg}
      </span>
    </div>
  );
}
