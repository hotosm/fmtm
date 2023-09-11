interface ICreateProjectSteps {
  step: number;
  label: string;
  name: string;
  children?: number;
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
    children: 1,
  },
  {
    step: 3,
    label: '03',
    name: 'Data Extract',
    children: 1,
  },
  {
    step: 4,
    label: '04',
    name: 'Split Tasks',
    children: 1,
  },
  {
    step: 5,
    label: '05',
    name: 'Select Form',
  },
];
