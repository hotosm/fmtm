export interface ICreateProjectSteps {
  step: number;
  label: string;
  name: string;
}

export const createProjectSteps: ICreateProjectSteps[] = [
  {
    step: 1,
    label: '01',
    name: 'Basic Details',
  },
  {
    step: 2,
    label: '02',
    name: 'Project Details',
  },
  {
    step: 3,
    label: '03',
    name: 'Upload Survey',
  },
  {
    step: 4,
    label: '04',
    name: 'Map Data',
  },
  {
    step: 5,
    label: '05',
    name: 'Split Tasks',
  },
];
