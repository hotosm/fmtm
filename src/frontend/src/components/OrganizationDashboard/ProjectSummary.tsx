import { HomeSummaryService } from '@/api/HomeService';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import React, { useEffect, useState } from 'react';
import Searchbar from '@/components/common/SearchBar';
import useDebouncedInput from '@/hooks/useDebouncedInput';
import Switch from '@/components/common/Switch';
import ExploreProjectCard from '../home/ExploreProjectCard';
import Pagination from '../common/Pagination';
import ProjectSummaryMap from './ProjectSummaryMap';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProjectSummary = () => {
  const dispatch = useAppDispatch();

  const [showMap, setShowMap] = useState(true);
  const [search, setSearch] = useState('');
  const [paginationPage, setPaginationPage] = useState(1);

  const [searchTextData, handleChangeData] = useDebouncedInput({
    ms: 500,
    init: search,
    onChange: (e) => setSearch(e.target.value),
  });

  const projectList = useAppSelector((state) => state.home.homeProjectSummary);
  const projectListPagination = useAppSelector((state) => state.home.homeProjectPagination);

  useEffect(() => {
    dispatch(
      HomeSummaryService(`${VITE_API_URL}/projects/search?page=${paginationPage}&results_per_page=2&search=${search}`),
    );
  }, [search, paginationPage]);

  return (
    <div className="fmtm-bg-white fmtm-rounded-lg fmtm-p-5 fmtm-flex-1 fmtm-overflow-hidden">
      <div className="fmtm-flex fmtm-items-center fmtm-justify-between fmtm-flex-wrap fmtm-pb-4">
        <h4 className="fmtm-text-grey-800">Project Location Map</h4>
        <Searchbar value={searchTextData} onChange={handleChangeData} wrapperStyle="!fmtm-w-[10.5rem]" isSmall />
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <p className="fmtm-body-md fmtm-text-grey-800">Show Map</p>
          <Switch ref={null} className="" checked={showMap} onCheckedChange={() => setShowMap(!showMap)} />
        </div>
      </div>
      <div
        className={`fmtm-h-[calc(100%-56px)] fmtm-grid fmtm-gap-5 ${showMap ? 'fmtm-grid-cols-2' : 'fmtm-grid-cols-1'}`}
      >
        <div className="fmtm-h-full fmtm-relative fmtm-overflow-y-scroll scrollbar">
          <div className={`fmtm-grid ${showMap ? 'fmtm-grid-cols-2' : 'fmtm-grid-cols-4'} fmtm-gap-5`}>
            {projectList?.map((project) => <ExploreProjectCard key={project.id} data={project} />)}
          </div>
          <Pagination
            showing={projectList?.length}
            totalCount={projectListPagination?.total || 0}
            currentPage={projectListPagination?.page || 0}
            isLoading={false}
            pageSize={projectListPagination.per_page}
            handlePageChange={(page) => setPaginationPage(page)}
            className="fmtm-sticky fmtm-bottom-0 fmtm-border-x fmtm-border-b"
          />
        </div>
        {showMap && (
          <div>
            <ProjectSummaryMap />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSummary;
