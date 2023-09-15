import React from 'react';

interface IRadioButton {
  name: string;
  value: string;
  label: string | number;
  icon?: React.ReactNode;
}

interface RadioButtonProps {
  topic?: string;
  options: IRadioButton[];
  direction: 'row' | 'column';
  onChangeData: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ topic, options, direction, onChangeData }) => (
  <div>
    <div>
      <p className="fmtm-text-xl fmtm-font-[600] fmtm-mb-3">{topic}</p>
    </div>
    <div className={`fmtm-flex ${direction === 'column' ? 'fmtm-flex-col' : 'fmtm-flex-wrap fmtm-gap-x-16'}`}>
      {options.map((option) => {
        return (
          <div key={option.value} className="fmtm-gap-2 fmtm-flex fmtm-items-center fmtm-cursor-pointer">
            <input
              type="radio"
              id={option.value}
              name={option.name}
              value={option.value}
              className="fmtm-accent-primaryRed fmtm-cursor-pointer"
              onChange={(e) => onChangeData(e.target.value)}
            />
            <label htmlFor={option.value}>
              <div className="fmtm-flex fmtm-gap-2 fmtm-cursor-pointer fmtm-pb-[0.1rem]">
                <p className="fmtm-text-lg fmtm-bg-white fmtm-text-gray-500">{option.label}</p>
                {option.icon && option.icon}
              </div>
            </label>
          </div>
        );
      })}
    </div>
  </div>
);

export default RadioButton;
