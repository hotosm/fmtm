import { z } from 'zod/v4';
import { isValidUrl } from '@/utilfunctions/urlChecker';
import { project_visibility } from '@/types/enums';

// Utility regex
const noUnderscore = /^[^_]+$/;

export const basicDetailsValidationSchema = z
  .object({
    // STEP 1: Basic Details
    // name: z
    //   .string()
    //   .min(1, 'Project Name is Required.')
    //   .regex(noUnderscore, 'Project Name should not contain _ (underscore)'),
    // short_description: z.string().min(1, 'Short Description is Required'),
    // description: z.string().min(1, 'Description is Required'),
    // organisation_id: z.number({ error: 'Organization is Required' }),
    // hasODKCredentials: z.boolean(),
    // useDefaultODKCredentials: z.boolean(),
    // odk_central_url: z.string().optional(),
    // odk_central_user: z.string().optional(),
    // odk_central_password: z.string().optional(),
    // project_admins: z.array(z.string()).min(1, 'At least one Project Admin shall be selected'),
    // uploadAreaSelection: z.string().min(1, 'Upload Area Selection is Required'),
    // uploadedAOIFile: z.object({ id: z.string(), file: z.instanceof(File), previewURL: z.string() }).optional(),
    // AOIGeojson: z.unknown().refine((val) => val !== undefined, {
    //   message: 'AOI GeoJSON is required',
    // }),
    // AOIArea: z.string().optional(),
    //-----------------------------------------------------------------------------------------
    // STEP 2: Project Details
    //   username: z.string().optional(), // not validated in your current logic
    //   id: z.string().optional(), // not validated in your current logic
    //   useDefaultODKCredentials: z.boolean(),
    //   hasCustomTMS: z.boolean(),
    //   custom_tms_url: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.uploadAreaSelection === 'upload_file' && !values.uploadedAOIFile) {
      ctx.addIssue({
        path: ['uploadedAOIFile'],
        message: 'AOI Geojson File is Required',
        code: z.ZodIssueCode.custom,
      });
    }

    // Conditional validation for ODK fields
    // if (!values.useDefaultODKCredentials) {
    //   if (!values.odk_central_url) {
    //     ctx.addIssue({
    //       path: ['odk_central_url'],
    //       message: 'ODK URL is Required.',
    //       code: z.ZodIssueCode.custom,
    //     });
    //   } else if (!isValidUrl(values.odk_central_url)) {
    //     ctx.addIssue({
    //       path: ['odk_central_url'],
    //       message: 'Invalid URL.',
    //       code: z.ZodIssueCode.custom,
    //     });
    //   }
    //   if (!values.odk_central_user) {
    //     ctx.addIssue({
    //       path: ['odk_central_user'],
    //       message: 'ODK Central User is Required.',
    //       code: z.ZodIssueCode.custom,
    //     });
    //   }
    //   if (!values.odk_central_password) {
    //     ctx.addIssue({
    //       path: ['odk_central_password'],
    //       message: 'ODK Central Password is Required.',
    //       code: z.ZodIssueCode.custom,
    //     });
    //   }
    // }
    // // Conditional validation for Custom TMS
    // if (values.hasCustomTMS) {
    //   if (!values.custom_tms_url) {
    //     ctx.addIssue({
    //       path: ['custom_tms_url'],
    //       message: 'Custom TMS is Required.',
    //       code: z.ZodIssueCode.custom,
    //     });
    //   } else if (!isValidUrl(values.custom_tms_url)) {
    //     ctx.addIssue({
    //       path: ['custom_tms_url'],
    //       message: 'Invalid Custom TMS URL.',
    //       code: z.ZodIssueCode.custom,
    //     });
    //   }
    // }
  });

export const projectDetailsValidationSchema = z.object({
  visibility: z.enum(project_visibility, { error: 'Project Visibility must be selected' }),
  hashtags: z.array(z.string()),
  hasCustomTMS: z.boolean(),
  custom_tms_url: z.string().optional(),
  per_task_instructions: z.string().optional(),
  use_odk_collect: z.boolean(),
});

export const uploadSurveyValidationSchema = z.object({});

export const mapDataValidationSchema = z.object({});

export const splitTasksValidationSchema = z.object({});

export const createProjectValidationSchema = {
  ...basicDetailsValidationSchema,
  ...projectDetailsValidationSchema,
};
