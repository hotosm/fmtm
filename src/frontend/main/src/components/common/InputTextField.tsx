/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
// import PropTypes from 'prop-types';
export const blockInvalidChar = (e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

interface IInputTextFieldProps {
  id?: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg?: string;
  value: string;
  placeholder?: string;
  fieldType: string;
  name?: string;
  flag?: string;
  classNames?: string;
  maxRange?: string;
  minRange?: string;
  maxLength?: number;
  disabled?: boolean;
}

function InputTextField({
  id,
  label,
  onChange,
  errorMsg,
  value,
  placeholder,
  fieldType,
  name,
  flag,
  classNames,
  maxRange,
  minRange,
  maxLength,
  disabled,
}: IInputTextFieldProps) {
  return (
    <div className={`fmtm-custom-textField ${classNames}`}>
      <p className="fmtm-text-[1rem] fmtm-mb-2 fmtm-font-semibold">{label}</p>
      <div
        className={`fmtm-border-[1px] fmtm-border-gray-300 fmtm-h-[1.8rem] fmtm-bg-inactive_bg fmtm-w-full fmtm-justify-between fmtm-flex fmtm-items-center fmtm-overflow-hidden`}
      >
        <input
          id={id}
          type={fieldType}
          name={name}
          className={`fmtm-w-full fmtm-pr-3 fmtm-px-3 focus:fmtm-outline-none ${
            disabled && 'fmtm-bg-gray-400 fmtm-cursor-not-allowed'
          } fmtm-bg-white fmtm-py-[10px] fmtm-text-[1rem]`}
          placeholder={placeholder}
          value={value}
          min={minRange}
          max={maxRange}
          maxLength={maxLength}
          onChange={onChange}
          disabled={disabled}
          onKeyDown={(event) => fieldType === 'number' && blockInvalidChar(event)}
        />
      </div>
      {errorMsg && <p className="fmtm-form-error fmtm-text-red-600 fmtm-text-sm fmtm-py-1 fmtm-pl-4">{errorMsg}</p>}
    </div>
  );
}

export default InputTextField;
