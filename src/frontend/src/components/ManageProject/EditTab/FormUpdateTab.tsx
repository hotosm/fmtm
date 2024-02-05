import React, { useEffect, useState } from 'react';
import UploadArea from '../../common/UploadArea';
import { CustomSelect } from '../../common/Select';
import Button from '../../common/Button';
import CoreModules from '@/shared/CoreModules';

const FormUpdateTab = () => {
  const [uploadForm, setUploadForm] = useState([]);
  const [selectedFormCategory, setSelectedFormCategory] = useState<string | null>(null);
  const formCategoryList = CoreModules.useAppSelector((state) => state.createproject.formCategoryList);
  const previousXform_title = CoreModules.useAppSelector((state) => state.project.projectInfo.xform_title);

  useEffect(() => {
    setSelectedFormCategory(previousXform_title);
  }, [previousXform_title]);

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-10">
      <CustomSelect
        title="Form Category"
        placeholder="Choose"
        data={formCategoryList}
        dataKey="title"
        value={selectedFormCategory}
        valueKey="title"
        label="title"
        onValueChange={(value) => value && setSelectedFormCategory(value?.toString())}
        className="fmtm-bg-white"
      />
      <UploadArea
        title="Upload Form"
        label="Please upload .xls, .slxs, .xml file"
        multiple={false}
        data={uploadForm || []}
        filterKey="url"
        onUploadFile={(updatedFiles) => {
          setUploadForm(updatedFiles);
        }}
        acceptedInput=".xls, .slxs, .xml"
      />
      <div className="fmtm-flex fmtm-justify-center">
        <Button btnText="UPDATE" btnType="primary" className="fmtm-rounded-md" />
      </div>
    </div>
  );
};

export default FormUpdateTab;
