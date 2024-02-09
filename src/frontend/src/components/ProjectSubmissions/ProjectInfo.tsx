import React from 'react';
import CoreModules from '@/shared/CoreModules';
import AssetModules from '@/shared/AssetModules';

const ProjectInfo = () => {
  const projectInfo = CoreModules.useAppSelector((state) => state.project.projectInfo);
  const projectDashboardDetail = CoreModules.useAppSelector((state) => state.project.projectDashboardDetail);
  const projectDashboardLoading = CoreModules.useAppSelector((state) => state.project.projectDashboardLoading);

  const dataCard = [
    {
      title: 'Tasks',
      count: projectDashboardDetail?.total_tasks,
      icon: <AssetModules.TaskIcon sx={{ color: 'white', fontSize: { xs: '35px', xl: '40px' } }} />,
    },
    {
      title: 'Contributors',
      count: projectDashboardDetail?.total_contributors,
      icon: <AssetModules.PeopleAltIcon sx={{ color: 'white', fontSize: { xs: '35px', xl: '40px' } }} />,
    },
    {
      title: 'Submissions',
      count: projectDashboardDetail?.total_submission,
      icon: <AssetModules.SubmissionIcon sx={{ color: 'white', fontSize: { xs: '35px', xl: '40px' } }} />,
    },
  ];

  const ProjectDataCard = ({ data }) => (
    <div className="fmtm-bg-white fmtm-rounded-2xl fmtm-min-w-[12.5rem] fmtm-p-2 fmtm-px-4 md:fmtm-p-4 md:fmtm-shadow-[0px_10px_20px_0px_rgba(96,96,96,0.1)] fmtm-flex fmtm-items-center fmtm-gap-4">
      <div className="fmtm-from-[#f79292] fmtm-to-primaryRed fmtm-rounded-full fmtm-p-2 fmtm-bg-gradient-to-br">
        {data.icon}
      </div>
      <div className="fmtm-flex fmtm-flex-col fmtm-items-start">
        <h2 className="fmtm-text-lg sm:fmtm-text-xl md:fmtm-text-xl fmtm-text-primaryRed fmtm-font-bold">
          {data.title}
        </h2>
        <h2 className="fmtm-text-xl sm:fmtm-text-2xl md:fmtm-text-2xl fmtm-font-bold fmtm-text-primaryRed">
          {data.count}
        </h2>
      </div>
    </div>
  );

  const widthStyle = window.innerWidth >= 640 ? { width: 'calc(100% - 80px)' } : { width: '100%' };

  return (
    <div style={widthStyle} className="sm:fmtm-ml-2 fmtm-border-b-[1px] fmtm-border-gray-300 fmtm-pb-10">
      <div className="fmtm-pb-4">
        <p className="fmtm-text-[#706E6E] fmtm-font-archivo fmtm-text-sm">
          <span>Projects </span>
          <span> &gt; </span>
          <span>Dashboard</span>
        </p>
      </div>
      <div className=" fmtm-flex fmtm-flex-col xl:fmtm-flex-row fmtm-w-full sm:fmtm-items-center fmtm-gap-10 fmtm-mt-3">
        <div className="fmtm-w-full fmtm-min-w-0 sm:fmtm-max-w-[37rem] fmtm-bg-primary-100 fmtm-rounded-2xl fmtm-p-5 fmtm-flex fmtm-flex-col fmtm-gap-5">
          {projectDashboardLoading ? (
            <div>
              <CoreModules.Skeleton className="!fmtm-w-full" />
              <CoreModules.Skeleton className="!fmtm-w-[200px]" />
            </div>
          ) : (
            <h2 className="fmtm-text-xl fmtm-font-archivo">{projectInfo?.title}</h2>
          )}
          <div>
            <p className="fmtm-text-sm fmtm-text-[#706E6E] fmtm-font-archivo">
              Created On:{' '}
              {projectDashboardLoading ? (
                <CoreModules.Skeleton className="!fmtm-w-[100px]" />
              ) : (
                <span>
                  {projectDashboardDetail?.created
                    ? `${projectDashboardDetail?.created?.split('T')[0]} ${projectDashboardDetail?.created
                        ?.split('T')[1]
                        ?.split('.')[0]}`
                    : '-'}
                </span>
              )}
            </p>
            <p className="fmtm-text-sm fmtm-text-[#706E6E] fmtm-font-archivo">
              Last active:{' '}
              {projectDashboardLoading ? (
                <CoreModules.Skeleton className="!fmtm-w-[100px]" />
              ) : (
                <span>{projectDashboardDetail?.last_active ? projectDashboardDetail?.last_active : '-'}</span>
              )}
            </p>
          </div>
        </div>
        <div className="fmtm-w-full fmtm-overflow-x-scroll scrollbar fmtm-pb-1 md:fmtm-pb-0 md:fmtm-overflow-x-visible">
          {projectDashboardLoading ? (
            <div className="fmtm-w-full fmtm-flex sm:fmtm-justify-center fmtm-gap-5">
              {Array.from({ length: 3 }).map((i) => (
                <CoreModules.Skeleton key={i} className="!fmtm-w-[8.5rem] fmtm-h-[6.25rem]" />
              ))}
            </div>
          ) : (
            <div className="fmtm-w-full fmtm-flex md:fmtm-justify-center fmtm-gap-5">
              {dataCard.map((data, i) => (
                <ProjectDataCard key={i} data={data} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
