import React from 'react';
import TextArea from '../../common/TextArea';
import InputTextField from '../../common/InputTextField';
import Button from '../../common/Button';

const ProjectDescriptionTab = () => {
  return (
    <div className="fmtm-w-full fmtm-h-full fmtm-flex fmtm-flex-col fmtm-flex-grow fmtm-gap-5">
      <InputTextField
        id="name"
        name="name"
        label="Project Name"
        // value={user}
        // onChange={(e) => setUser(e.target.value)}
        fieldType="text"
        classNames="fmtm-w-full"
      />
      <TextArea
        id="short_description"
        label="Short Description"
        rows={2}
        // value={values?.description}
        //   onChange={(e) => handleCustomChange('description', e.target.value)}

        //   errorMsg={errors.description}
      />
      <TextArea
        id="description"
        label="Description"
        rows={2}
        // value={values?.description}
        //   onChange={(e) => handleCustomChange('description', e.target.value)}

        //   errorMsg={errors.description}
      />
      <TextArea
        id="instruction"
        label="Instruction"
        rows={2}
        // value={values?.description}
        //   onChange={(e) => handleCustomChange('description', e.target.value)}

        //   errorMsg={errors.description}
      />
      <InputTextField
        id="changeset"
        name="changeset"
        label="Changeset"
        // value={user}
        // onChange={(e) => setUser(e.target.value)}
        fieldType="text"
        classNames="fmtm-w-full"
      />
      <div className="fmtm-flex fmtm-justify-center fmtm-mt-4">
        <Button btnText="SAVE" btnType="primary" type="submit" className="fmtm-rounded-md" />
      </div>
    </div>
  );
};

export default ProjectDescriptionTab;
