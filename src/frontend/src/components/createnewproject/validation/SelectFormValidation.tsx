interface ProjectValues {
  formExampleSelection: string;
  xlsFormFileUpload: File | null;
}
interface ValidationErrors {
  formExampleSelection?: string;
  xlsFormFileUpload?: any;
}

function SelectFormValidation(values: ProjectValues) {
  const errors: ValidationErrors = {};

  if (!values?.xlsFormFileUpload) {
    errors.xlsFormFileUpload = 'Form needs to be Uploaded.';
  }

  return errors;
}

export default SelectFormValidation;
