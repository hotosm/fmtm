interface ProjectValues {
  formExampleSelection: string;
  customFormUpload: File | null;
}
interface ValidationErrors {
  formExampleSelection?: string;
  customFormUpload?: any;
}

function SelectFormValidation(values: ProjectValues) {
  const errors: ValidationErrors = {};

  if (!values?.customFormUpload) {
    errors.customFormUpload = 'Form needs to be Uploaded.';
  }

  return errors;
}

export default SelectFormValidation;
