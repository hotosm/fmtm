import React, { useState } from 'react';
import UploadArea from '../../common/UploadArea';
import { CustomSelect } from '../../common/Select';
import Button from '../../common/Button';

const FormUpdateTab = () => {
  const [uploadedFile, setUploadedFile] = useState([]);

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-10">
      <CustomSelect
        title="Form Category"
        placeholder="Choose"
        // data={roleList}
        dataKey="value"
        // value={assignedRole}
        valueKey="value"
        label="label"
        // onValueChange={(value) => setAssignedRole(value)}
        className="fmtm-bg-white"
      />
      <UploadArea
        title="Upload Form"
        label="Please upload .xls, .slxs, .xml file"
        multiple={false}
        data={uploadedFile || []}
        filterKey="url"
        onUploadFile={(updatedFiles) => {
          setUploadedFile(updatedFiles);
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
