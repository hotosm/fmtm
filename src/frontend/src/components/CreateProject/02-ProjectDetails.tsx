import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import AssetModules from '@/shared/AssetModules';
import { projectVisibilityOptions } from './constants';
import FieldLabel from '@/components/common/FieldLabel';
import RadioButton from '@/components/common/RadioButton';
import Button from '@/components/common/Button';
import Chips from '@/components/common/Chips';
import { Input } from '@/components/RadixComponents/Input';
import Switch from '@/components/common/Switch';
import RichTextEditor from '@/components/common/Editor/Editor';

const ProjectDetails = () => {
  const { hostname } = window.location;
  const defaultHashtags = ['#Field-TM', `#${hostname}-{project_id}`];
  const [hashtag, setHashtag] = useState('');

  const form = useFormContext();
  const { watch, register, control, setValue } = form;

  const values = watch();

  useEffect(() => {
    if (!values.hasCustomTMS && values.custom_tms_url) setValue('custom_tms_url', '');
  }, [values.hasCustomTMS]);

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-[1.125rem] fmtm-w-full">
      <div>
        <FieldLabel label="Project Type" astric className="fmtm-mb-1" />
        <Controller
          control={control}
          name="visibility"
          render={({ field }) => (
            <RadioButton value={field.value} options={projectVisibilityOptions} onChangeData={field.onChange} />
          )}
        />
      </div>

      <div>
        <FieldLabel
          label="Hashtags"
          className="fmtm-mb-1"
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
        <FieldLabel label="Use a custom TMS basemap" className="fmtm-mb-1" />
        <Controller
          control={control}
          name="hasCustomTMS"
          render={({ field }) => (
            <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} className="" />
          )}
        />
      </div>

      {values.hasCustomTMS && (
        <div>
          <FieldLabel label="TMS URL" astric className="fmtm-mb-1" />
          <Input {...register('custom_tms_url')} />
        </div>
      )}

      <div>
        <FieldLabel label="Instructions" className="fmtm-mb-1" />
        <Controller
          control={control}
          name="per_task_instructions"
          render={({ field }) => (
            <RichTextEditor editorHtmlContent={field.value} setEditorHtmlContent={field.onChange} editable={true} />
          )}
        />
      </div>

      <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
        <FieldLabel label="Use ODK Collect Mobile App (instead of Web Forms)" className="fmtm-mb-1" />
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
