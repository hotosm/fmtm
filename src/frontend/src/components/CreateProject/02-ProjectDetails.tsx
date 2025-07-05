import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod/v4';
import { createProjectValidationSchema } from './validation';

import AssetModules from '@/shared/AssetModules';
import { projectVisibilityOptions } from './constants';
import FieldLabel from '@/components/common/FieldLabel';
import RadioButton from '@/components/common/RadioButton';
import Button from '@/components/common/Button';
import Chips from '@/components/common/Chips';
import { Input } from '@/components/RadixComponents/Input';
import Switch from '@/components/common/Switch';
import RichTextEditor from '@/components/common/Editor/Editor';
import ErrorMessage from '@/components/common/ErrorMessage';

const ProjectDetails = () => {
  const { hostname } = window.location;
  const defaultHashtags = ['#Field-TM', `#${hostname}-{project_id}`];
  const [hashtag, setHashtag] = useState('');

  const form = useFormContext<z.infer<typeof createProjectValidationSchema>>();
  const { watch, register, control, setValue, formState } = form;
  const { errors } = formState;

  const values = watch();

  useEffect(() => {
    if (!values.hasCustomTMS && values.custom_tms_url) setValue('custom_tms_url', '');
  }, [values.hasCustomTMS]);

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-[1.125rem] fmtm-w-full">
      <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
        <FieldLabel label="Project Type" astric />
        <Controller
          control={control}
          name="visibility"
          render={({ field }) => (
            <RadioButton value={field.value} options={projectVisibilityOptions} onChangeData={field.onChange} />
          )}
        />
      </div>

      <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
        <FieldLabel
          label="Hashtags"
          tooltipMessage={`Hashtags relate to what is being mapped. By default ${defaultHashtags} is included. Hashtags are sometimes
          used for analysis later, but should be human informative and not overused, #group #event`}
        />
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <Input value={hashtag} onChange={(e) => setHashtag(e.target.value)} className="fmtm-flex-1" />
          <Button
            disabled={!hashtag.trim()}
            variant="primary-red"
            className="!fmtm-rounded-full !fmtm-w-5 !fmtm-h-5 fmtm-mb-[2px] !fmtm-p-0"
            onClick={() => {
              if (!hashtag.trim()) return;
              setValue('hashtags', [...values.hashtags, hashtag]);
              setHashtag('');
            }}
          >
            <AssetModules.AddIcon className="!fmtm-text-lg" />
          </Button>
        </div>
        <div className="fmtm-flex fmtm-items-center fmtm-flex-wrap fmtm-gap-2 fmtm-my-2">
          {defaultHashtags.map((tag, i) => (
            <div
              key={i}
              className="fmtm-body-md fmtm-px-2 fmtm-border-[1px] fmtm-bg-grey-100 fmtm-rounded-[40px] fmtm-flex fmtm-w-fit fmtm-items-center fmtm-gap-1"
            >
              <p>{tag}</p>
            </div>
          ))}
          <Chips
            data={values.hashtags}
            clearChip={(i) =>
              setValue(
                'hashtags',
                values.hashtags.filter((_, index) => index !== i),
              )
            }
          />
        </div>
      </div>

      <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
        <FieldLabel label="Use a custom TMS basemap" />
        <Controller
          control={control}
          name="hasCustomTMS"
          render={({ field }) => (
            <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} className="" />
          )}
        />
      </div>

      {values.hasCustomTMS && (
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
          <FieldLabel label="TMS URL" astric />
          <Input {...register('custom_tms_url')} />
          {errors?.custom_tms_url?.message && <ErrorMessage message={errors.custom_tms_url.message as string} />}
        </div>
      )}

      <div className="fmtm-flex fmtm-flex-col fmtm-gap-1">
        <FieldLabel label="Instructions" />
        <Controller
          control={control}
          name="per_task_instructions"
          render={({ field }) => (
            <RichTextEditor editorHtmlContent={field.value} setEditorHtmlContent={field.onChange} editable={true} />
          )}
        />
      </div>

      <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
        <FieldLabel label="Use ODK Collect Mobile App (instead of Web Forms)" />
        <Controller
          control={control}
          name="use_odk_collect"
          render={({ field }) => (
            <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} className="" />
          )}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
