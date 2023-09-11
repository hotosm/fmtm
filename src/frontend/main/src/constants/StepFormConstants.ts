interface ICreateProjectSteps {
  step: number;
  label: string;
  name: string;
  children?: IStepChildren[];
}
interface IStepChildren {
  page: number;
  name: string;
}

export const createProjectSteps: ICreateProjectSteps[] = [
  {
    step: 1,
    label: '01',
    name: 'Project Details',
  },
  {
    step: 2,
    label: '02',
    name: 'Upload Area',
    children: [
      { page: 1, name: 'UploadArea1' },
      { page: 2, name: 'UploadArea2' },
    ],
  },
  {
    step: 3,
    label: '03',
    name: 'Data Extract',
    children: [
      { page: 1, name: 'DataExtract1' },
      { page: 2, name: 'DataExtract2' },
    ],
  },
  {
    step: 4,
    label: '04',
    name: 'Split Tasks',
    children: [
      { page: 1, name: 'DefineTasks1' },
      { page: 2, name: 'DefineTasks2' },
      { page: 3, name: 'DefineTasks3' },
    ],
  },
  {
    step: 5,
    label: '05',
    name: 'Select Form',
  },
];
