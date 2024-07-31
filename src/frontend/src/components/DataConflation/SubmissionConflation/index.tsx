import React, { useState } from 'react';
import Button from '@/components/common/Button';
import AssetModules from '@/shared/AssetModules';

const tags = {
  category: 'Service',
  name: 'Fig',
  building_material: 'Stone',
  building_levels: 4,
  service: 'Beauty',
  roof: 'Tile',
  wall: 'Brick',
  floor: 'Marble',
  window: 'Glass',
  garden: 'Yes',
};

const RenderTags = ({ tag }) => (
  <div className="fmtm-grid fmtm-grid-cols-2 fmtm-border-b fmtm-border-[#E2E2E2] fmtm-py-1">
    <p className="fmtm-text-sm fmtm-text-[#555] fmtm-font-bold">{tag?.[0]}</p>
    <p className="fmtm-text-sm fmtm-text-[#555]">{tag?.[1]}</p>
  </div>
);

const SubmissionConflation = () => {
  const [selectedConflateMethod, setSelectedConflateMethod] = useState<
    'submission_feature' | 'osm_feature' | 'merge_attributes' | ''
  >('');

  return (
    <div className="fmtm-w-full fmtm-h-full">
      <div className="fmtm-flex fmtm-flex-col fmtm-gap-5 fmtm-h-full fmtm-relative">
        <div className="fmtm-flex fmtm-flex-col fmtm-gap-2 fmtm-max-h-[40vh] md:fmtm-max-h-[40%]">
          <h4>SUBMISSION #457</h4>
          <div className="fmtm-bg-white fmtm-rounded-xl fmtm-p-3 fmtm-h-[calc(100%-4.281rem)] fmtm-overflow-y-scroll scrollbar">
            {Object.entries(tags).map((tag) => (
              <RenderTags tag={tag} />
            ))}
          </div>
          <Button
            btnText="Accept Submission Feature"
            btnType="other"
            type="button"
            className={`${
              selectedConflateMethod === 'submission_feature'
                ? 'fmtm-bg-[#40AC8C] fmtm-text-white hover:fmtm-text-white'
                : ''
            } fmtm-py-2 fmtm-px-4 fmtm-text-sm fmtm-mx-auto fmtm-border-none !fmtm-rounded`}
            icon={
              selectedConflateMethod !== 'submission_feature' && <AssetModules.DoneIcon style={{ fontSize: '16px' }} />
            }
            onClick={() => setSelectedConflateMethod('submission_feature')}
          />
        </div>

        <div className="fmtm-flex fmtm-flex-col fmtm-gap-2 fmtm-max-h-[40vh] md:fmtm-max-h-[40%]">
          <h4>OSM TAGS</h4>
          <div className="fmtm-bg-white fmtm-rounded-xl fmtm-p-3 fmtm-h-[calc(100%-4.281rem)] fmtm-overflow-y-scroll scrollbar">
            {Object.entries(tags).map((tag) => (
              <RenderTags tag={tag} />
            ))}
          </div>
          <Button
            btnText="Accept OSM Features"
            btnType="other"
            type="button"
            className={`${
              selectedConflateMethod === 'osm_feature' ? 'fmtm-bg-[#40AC8C] fmtm-text-white hover:fmtm-text-white' : ''
            } fmtm-py-2 fmtm-px-4 fmtm-text-sm fmtm-mx-auto fmtm-border-none !fmtm-rounded`}
            icon={selectedConflateMethod !== 'osm_feature' && <AssetModules.DoneIcon style={{ fontSize: '16px' }} />}
            onClick={() => setSelectedConflateMethod('osm_feature')}
          />
        </div>

        <div className="md:fmtm-absolute md:fmtm-bottom-0 fmtm-w-full">
          <Button
            btnText="Merge Attributes"
            btnType="other"
            type="button"
            className={`${
              selectedConflateMethod === 'merge_attributes'
                ? 'fmtm-bg-[#40AC8C] fmtm-text-white hover:fmtm-text-white !fmtm-border-[#40AC8C] hover:fmtm-border-[#40AC8C]'
                : ''
            } fmtm-py-2 fmtm-px-4 fmtm-text-sm fmtm-w-full fmtm-justify-center !fmtm-rounded`}
            onClick={() => setSelectedConflateMethod('merge_attributes')}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionConflation;
