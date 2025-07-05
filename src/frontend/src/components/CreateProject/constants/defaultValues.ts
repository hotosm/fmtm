import { z } from 'zod/v4';
import { createProjectValidationSchema } from '../validation';
import { project_visibility } from '@/types/enums';

export const defaultValues: z.infer<typeof createProjectValidationSchema> = {
  // 01 Basic Details
  name: '',
  short_description: '',
  description: '',
  organisation_id: null,
  hasODKCredentials: false,
  useDefaultODKCredentials: false,
  odk_central_url: '',
  odk_central_user: '',
  odk_central_password: '',
  project_admins: [],
  uploadAreaSelection: null,
  uploadedAOIFile: undefined,
  outline: undefined,
  outlineArea: undefined,

  // 02 Project Details
  visibility: project_visibility.PUBLIC,
  hashtags: [],
  hasCustomTMS: false,
  custom_tms_url: '',
  per_task_instructions: '',
  use_odk_collect: false,

  // 03 Upload Survey
  formExampleSelection: '',
  xlsFormFile: null,
  isXlsFormFileValid: false,

  // 04 Map Data
  primaryGeomType: null,
  includeCentroid: false,
  useMixedGeomTypes: false,
  newGeomType: null,
  dataExtractType: null,
  customDataExtractFile: null,
  dataExtractGeojson: null,

  // 05 Split Tasks
  task_split_type: null,
  dimension: 10,
  average_buildings_per_task: 1,
  splitGeojsonBySquares: null,
  splitGeojsonByAlgorithm: null,
};
