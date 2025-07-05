import React from 'react';
import AssetModules from '@/shared/AssetModules';

import LayerSwitchMenu from '../MapComponent/OpenLayersComponent/LayerSwitcher/LayerSwitchMenu';
import { Tooltip } from '@mui/material';

type mapControlComponentType = {
  map: any;
  hasEditUndo?: boolean;
};

const btnList = [
  {
    id: 'add',
    icon: <AssetModules.AddIcon className="!fmtm-text-[1rem]" />,
    title: 'Zoom In',
  },
  {
    id: 'minus',
    icon: <AssetModules.RemoveIcon className="!fmtm-text-[1rem]" />,
    title: 'Zoom Out',
  },
  {
    id: 'edit',
    icon: (
      <AssetModules.TimelineIcon
        className={`${false ? 'fmtm-text-primaryRed' : 'fmtm-text-[#666666]'} !fmtm-text-[1rem]`}
      />
    ),
    title: 'Edit Project Boundary',
  },
];

const MapControls = ({ map, hasEditUndo, toggleEdit, setToggleEdit }: mapControlComponentType) => {
  const handleOnClick = (btnId) => {
    const actualZoom = map.getView().getZoom();
    if (btnId === 'add') {
      map.getView().setZoom(actualZoom + 1);
    } else if (btnId === 'minus') {
      map.getView().setZoom(actualZoom - 1);
    } else if (btnId === 'edit') {
      setToggleEdit(!toggleEdit);
    }
  };

  return (
    <div className="fmtm-absolute fmtm-bottom-24 md:fmtm-bottom-10 fmtm-right-3 fmtm-z-[45] fmtm-flex fmtm-flex-col fmtm-border-[1px]  fmtm-border-grey-300 fmtm-rounded fmtm-overflow-hidden">
      <LayerSwitchMenu map={map} />
      {btnList.map((btn) => (
        <>
          {(btn.id !== 'Edit' && btn.id !== 'Undo') || (btn.id === 'Edit' && hasEditUndo) ? (
            <Tooltip title={btn.title} placement="left" arrow key={btn.title}>
              <div
                className="fmtm-bg-white hover:fmtm-bg-gray-100 fmtm-cursor-pointer fmtm-duration-300 fmtm-w-6 fmtm-h-6 fmtm-min-h-6 fmtm-min-w-6 fmtm-max-w-6 fmtm-max-h-6 fmtm-flex fmtm-justify-center fmtm-items-center fmtm-border-t fmtm-border-blue-light"
                onClick={() => handleOnClick(btn.id)}
              >
                {btn.icon}
              </div>
            </Tooltip>
          ) : (
            <></>
          )}
        </>
      ))}
    </div>
  );
};

export default MapControls;
