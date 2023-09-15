export interface IIndividualStep {
  url: string;
  step: number;
  label: string;
  name: string;
}

export interface IButton {
  btnText: string;
  btnType: 'primary' | 'secondary' | 'other';
  type: 'submit' | 'button';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  count?: number;
  dataTip?: string;
  icon?: React.ReactNode;
}

export interface IInputTextFieldProps {
  id?: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
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
  required?: boolean;
}

export interface IRadioButton {
  name: string;
  value: string;
  label: string | number;
  icon?: React.ReactNode;
}

export interface RadioButtonProps {
  topic?: string;
  options: IRadioButton[];
  direction: 'row' | 'column';
  onChangeData: (value: string) => void;
}

export interface ITextAreaFieldProps {
  id?: string;
  label: string;
  rows: number;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorMsg?: string;
  value: string;
  placeholder?: string;
  name?: string;
  classNames?: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
}
