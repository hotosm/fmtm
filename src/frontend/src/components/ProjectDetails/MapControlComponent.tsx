import React from 'react';
import ProjectOptions from '@/components/ProjectDetails/ProjectOptions';
import { Tooltip } from '@mui/material';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/common/Dropdown';

type mapControlComponentType = {
  map: any;
  projectName: string;
};

const btnList = [
  {
    id: 'add',
    icon: <span>+</span>,
    title: 'Zoom In',
  },
  {
    id: 'minus',
    icon: <span>-</span>,
    title: 'Zoom Out',
  },
  {
    id: 'taskBoundries',
    icon: <span>#</span>,
    title: 'Zoom to Project',
  },
];

const MapControlComponent = ({ map, projectName }: mapControlComponentType) => {
  const handleOnClick = (btnId) => {
    const actualZoom = map.getView().getZoom();
    if (btnId === 'add') {
      map.getView().setZoom(actualZoom + 1);
    } else if (btnId === 'minus') {
      map.getView().setZoom(actualZoom - 1);
    } else if (btnId === 'taskBoundries') {
      // TODO: Implement zoom to project logic using MapLibre or remove if obsolete.
    }
  };

  return (
    <div className="fmtm-absolute fmtm-bottom-24 md:fmtm-bottom-10 fmtm-right-3 fmtm-z-[45] fmtm-flex fmtm-flex-col fmtm-border-[1px]  fmtm-border-grey-300 fmtm-rounded fmtm-overflow-hidden">
      {/* TODO: Refactor this component to use MapLibre logic or remove if obsolete. */}
      {btnList.map((btn) => (
        <Tooltip title={btn.title} placement="left" arrow key={btn.title}>
          <div
            className="fmtm-bg-white hover:fmtm-bg-gray-100 fmtm-cursor-pointer fmtm-duration-300 fmtm-w-6 fmtm-h-6 fmtm-min-h-6 fmtm-min-w-6 fmtm-max-w-6 fmtm-max-h-6 fmtm-flex fmtm-justify-center fmtm-items-center fmtm-border-t fmtm-border-blue-light"
            onClick={() => handleOnClick(btn.id)}
          >
            {btn.icon}
          </div>
        </Tooltip>
      ))}
      {/* download options (mobile screens) */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="fmtm-outline-none fmtm-border-t fmtm-border-blue-light fmtm-bg-white md:fmtm-hidden">
          <Tooltip title="Base Maps" placement="left" arrow>
            <AssetModules.FileDownloadIcon className="!fmtm-text-[1rem]" />
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            className="fmtm-border-none fmtm-z-50 fmtm-bg-white"
            align="end"
            alignOffset={200}
            sideOffset={-25}
          >
            <ProjectOptions projectName={projectName} />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};

export default MapControlComponent;
