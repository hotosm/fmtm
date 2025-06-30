import { z } from 'zod/v4';
import { isValidUrl } from '@/utilfunctions/urlChecker';
import { project_visibility, task_split_type } from '@/types/enums';

// Utility regex
const noUnderscore = /^[^_]+$/;

export const basicDetailsValidationSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Project Name is Required')
      .regex(noUnderscore, 'Project Name should not contain _ (underscore)'),
    short_description: z.string().min(1, 'Short Description is Required'),
    description: z.string().min(1, 'Description is Required'),
    organisation_id: z.number({ error: 'Organization is Required' }),
    hasODKCredentials: z.boolean(),
    useDefaultODKCredentials: z.boolean(),
    odk_central_url: z.string().optional(),
    odk_central_user: z.string().optional(),
    odk_central_password: z.string().optional(),
    project_admins: z.array(z.string()).min(1, 'At least one Project Admin shall be selected'),
    uploadAreaSelection: z.string().min(1, 'Upload Area Selection is Required'),
    uploadedAOIFile: z.object({ id: z.string(), file: z.instanceof(File), previewURL: z.string() }).optional(),
    outline: z.unknown().refine((val) => val !== undefined, {
      message: 'Project AOI is required',
    }),
    outlineArea: z.string().optional(),
  })
  .check((ctx) => {
    const values = ctx.value;
    if (!values.useDefaultODKCredentials) {
      if (!values.odk_central_url) {
        ctx.issues.push({
          input: values.odk_central_url,
          path: ['odk_central_url'],
          message: 'ODK URL is Required',
          code: 'custom',
        });
      } else if (!isValidUrl(values.odk_central_url)) {
        ctx.issues.push({
          input: values.odk_central_url,
          path: ['odk_central_url'],
          message: 'Invalid URL',
          code: 'custom',
        });
      }
      if (!values.odk_central_user) {
        ctx.issues.push({
          input: values.odk_central_user,
          path: ['odk_central_user'],
          message: 'ODK Central User is Required',
          code: 'custom',
        });
      }
      if (!values.odk_central_password) {
        ctx.issues.push({
          input: values.odk_central_password,
          path: ['odk_central_password'],
          message: 'ODK Central Password is Required',
          code: 'custom',
        });
      }
    }
    if (values.uploadAreaSelection === 'upload_file' && !values.uploadedAOIFile) {
      ctx.issues.push({
        input: values.uploadedAOIFile,
        path: ['uploadedAOIFile'],
        message: 'AOI Geojson File is Required',
        code: 'custom',
      });
    }
  });

export const projectDetailsValidationSchema = z
  .object({
    visibility: z.enum(project_visibility, { error: 'Project Visibility must be selected' }),
    hashtags: z.array(z.string()),
    hasCustomTMS: z.boolean(),
    custom_tms_url: z.string().optional(),
    per_task_instructions: z.string().optional(),
    use_odk_collect: z.boolean(),
  })
  .check((ctx) => {
    const values = ctx.value;
    if (values.hasCustomTMS && !values.custom_tms_url) {
      ctx.issues.push({
        input: values.custom_tms_url,
        path: ['custom_tms_url'],
        message: 'Custom TMS URL is Required',
        code: 'custom',
      });
    }
  });

export const uploadSurveyValidationSchema = z
  .object({
    formExampleSelection: z.refine((val) => val, {
      message: 'Please select a form category',
    }),
    xlsFormFile: z.any().optional(),
    isXlsFormFileValid: z.boolean(),
  })
  .check((ctx) => {
    const values = ctx.value;
    if (!values.xlsFormFile) {
      ctx.issues.push({
        input: values.xlsFormFile,
        path: ['xlsFormFile'],
        message: 'File is Required',
        code: 'custom',
      });
    }
    if (values.xlsFormFile && !values.isXlsFormFileValid) {
      ctx.issues.push({
        input: values.xlsFormFile,
        path: ['xlsFormFile'],
        message: 'File is Invalid',
        code: 'custom',
      });
    }
  });

export const mapDataValidationSchema = z.object({});

export const splitTasksValidationSchema = z
  .object({
    task_split_type: z.enum(task_split_type, {
      error: 'Task Split Type is Required',
    }),
    dimension: z.number().optional(),
    average_buildings_per_task: z.number().optional(),
    splitGeojsonBySquares: z.any().optional(),
    splitGeojsonByAlgorithm: z.any().optional(),
  })
  .check((ctx) => {
    const values = ctx.value;

    if (
      values.task_split_type === task_split_type.DIVIDE_ON_SQUARE &&
      values.dimension !== undefined &&
      values.dimension < 10
    ) {
      ctx.issues.push({
        minimum: 10,
        message: 'Dimension must be at least 10',
        input: values.dimension,
        code: 'custom',
        path: ['dimension'],
      });
    }

    if (
      values.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM &&
      values.average_buildings_per_task !== undefined &&
      values.average_buildings_per_task < 1
    ) {
      ctx.issues.push({
        minimum: 1,
        message: 'Average buildings per task must be greater than 0',
        input: values.average_buildings_per_task,
        code: 'custom',
        path: ['average_buildings_per_task'],
      });
    }

    if (values.task_split_type === task_split_type.DIVIDE_ON_SQUARE && !values.splitGeojsonBySquares) {
      ctx.issues.push({
        message: 'Please generate the task splitting GeoJSON by squares',
        input: values.splitGeojsonBySquares,
        code: 'custom',
        path: ['splitGeojsonBySquares'],
      });
    }

    if (values.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM && !values.splitGeojsonByAlgorithm) {
      ctx.issues.push({
        message: 'Please generate the task splitting GeoJSON by algorithm',
        input: values.splitGeojsonByAlgorithm,
        code: 'custom',
        path: ['splitGeojsonByAlgorithm'],
      });
    }
  });

export const createProjectValidationSchema = {
  ...basicDetailsValidationSchema,
  ...projectDetailsValidationSchema,
  ...uploadSurveyValidationSchema,
  ...mapDataValidationSchema,
  ...splitTasksValidationSchema,
};
