import React, { useState } from 'react';
import AssetModules from '../../shared/AssetModules';
import VectorLayer from 'ol/layer/Vector';
import CoreModules from '../../shared/CoreModules.js';
import { ProjectActions } from '../../store/slices/ProjectSlice';

const btnList = [
  {
    id: 'Add',
    icon: <AssetModules.AddIcon style={{ fontSize: '20px' }} className="fmtm-text-[#666666]" />,
  },
  {
    id: 'Minus',
    icon: <AssetModules.RemoveIcon style={{ fontSize: '20px' }} className="fmtm-text-[#666666]" />,
  },
  {
    id: 'Edit',
    icon: <AssetModules.TimelineIcon style={{ fontSize: '20px' }} className="fmtm-text-[#666666]" />,
  },
  {
    id: 'Undo',
    icon: <AssetModules.UndoIcon style={{ fontSize: '20px' }} className="fmtm-text-[#666666]" />,
  },
];

const MapControlComponent = ({ map, hasEditUndo }) => {
  const dispatch = CoreModules.useAppDispatch();

  const handleOnClick = (btnId) => {
    if (btnId === 'Add') {
      const actualZoom = map.getView().getZoom();
      map.getView().setZoom(actualZoom + 1);
    } else if (btnId === 'Minus') {
      const actualZoom = map.getView().getZoom();
      map.getView().setZoom(actualZoom - 1);
    } else if (btnId === 'Edit') {
    } else if (btnId === 'Undo') {
    }
  };

  return (
    <div className="fmtm-absolute fmtm-top-[20px] fmtm-left-3 fmtm-z-50 fmtm-bg-white fmtm-rounded-md fmtm-p-[2px] fmtm-shadow-xl">
      {btnList.map((btn) => {
        return (
          <div key={btn.id} title={btn.id}>
            {((btn.id !== 'Edit' && btn.id !== 'Undo') ||
              (btn.id === 'Edit' && hasEditUndo) ||
              (btn.id === 'Undo' && hasEditUndo)) && (
              <div
                className="fmtm-bg-white fmtm-p-1 fmtm-rounded-md hover:fmtm-bg-gray-100 fmtm-duration-200"
                onClick={() => handleOnClick(btn.id)}
              >
                {btn.icon}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MapControlComponent;
