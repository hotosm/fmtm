import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { task_split_type } from '@/types/enums';
import { taskSplitOptionsType } from '@/store/types/ICreateProject';

import FieldLabel from '@/components/common/FieldLabel';
import RadioButton from '@/components/common/RadioButton';
import { Input } from '@/components/RadixComponents/Input';
import Button from '@/components/common/Button';
import AssetModules from '@/shared/AssetModules';

const SplitTasks = () => {
  const form = useFormContext();
  const { watch, control, register } = form;
  const values = watch();

  const taskSplitOptions: taskSplitOptionsType[] = [
    {
      name: 'define_tasks',
      value: task_split_type.DIVIDE_ON_SQUARE,
      label: 'Divide into square tasks',
      disabled: false,
    },
    {
      name: 'define_tasks',
      value: task_split_type.CHOOSE_AREA_AS_TASK,
      label: 'Use uploaded AOI as task areas',
      disabled: false,
    },
    {
      name: 'define_tasks',
      value: task_split_type.TASK_SPLITTING_ALGORITHM,
      label: 'Task Splitting Algorithm',
      disabled: !!values.dataExtractGeojson?.features?.length || values.primaryGeomType === 'POLYLINE',
    },
  ];

  const downloadSplittedGeojson = (geojson) => {
    const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task_splitted_geojson.geojson';
    a.click();
  };

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-[1.125rem] fmtm-w-full">
      <div>
        <FieldLabel label="New geometries collected should be of type" astric className="fmtm-mb-1" />
        <Controller
          control={control}
          name="task_split_type"
          render={({ field }) => (
            <RadioButton value={field.value} options={taskSplitOptions} onChangeData={field.onChange} />
          )}
        />
      </div>

      <div>
        <p className="fmtm-text-gray-500">
          Total number of features:{' '}
          <span className="fmtm-font-bold">{values.dataExtractGeojson?.features?.length || 0}</span>
        </p>
      </div>

      {values.task_split_type === task_split_type.DIVIDE_ON_SQUARE && (
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <FieldLabel label="Dimension of square in metres:" />
          <Input {...register('dimension')} className="fmtm-w-20" />
        </div>
      )}

      {values.task_split_type === task_split_type.TASK_SPLITTING_ALGORITHM && (
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <FieldLabel label="Average number of buildings per task:" />
          <Input {...register('average_buildings_per_task')} className="fmtm-w-20" />
        </div>
      )}

      {[task_split_type.DIVIDE_ON_SQUARE, task_split_type.TASK_SPLITTING_ALGORITHM].includes(
        values.task_split_type,
      ) && (
        <div className="fmtm-mt-6 fmtm-pb-3">
          <div className="fmtm-flex fmtm-items-center fmtm-gap-4">
            <Button
              variant="primary-red"
              // isLoading={dividedTaskLoading || taskSplittingGeojsonLoading}
              // onClick={generateTaskBasedOnSelection}
              // disabled={
              //   (taskSplittingMethod === task_split_type.TASK_SPLITTING_ALGORITHM &&
              //     !formValues?.average_buildings_per_task) ||
              //   isFgbFetching
              //     ? true
              //     : false
              // }
            >
              Click to generate task
              <AssetModules.SettingsIcon />
            </Button>
          </div>
        </div>
      )}

      {values.task_split_type && (
        <div>
          <p className="fmtm-text-gray-500 fmtm-mt-5 fmtm-mb-2">
            Total number of task:{' '}
            <span className="fmtm-font-bold">
              {values.dividedTaskGeojson?.features?.length || values.AOIGeojson?.features?.length || 1}
            </span>
          </p>
          {values.dividedTaskGeojson && (
            <Button variant="link-grey" onClick={() => downloadSplittedGeojson(values.dividedTaskGeojson)}>
              <AssetModules.FileDownloadOutlinedIcon />
              Download split geojson
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SplitTasks;
