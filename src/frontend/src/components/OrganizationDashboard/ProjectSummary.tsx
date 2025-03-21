import { HomeSummaryService } from '@/api/HomeService';
import { useAppDispatch } from '@/types/reduxTypes';
import React, { useEffect, useState } from 'react';
import Searchbar from '@/components/common/SearchBar';
import useDebouncedInput from '@/hooks/useDebouncedInput';
import Switch from '@/components/common/Switch';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProjectSummary = () => {
  const dispatch = useAppDispatch();

  const [showMap, setShowMap] = useState(false);
  const [search, setSearch] = useState('');
  const [paginationPage, setPaginationPage] = useState(1);

  const [searchTextData, handleChangeData] = useDebouncedInput({
    ms: 500,
    init: search,
    onChange: (e) => setSearch(e.target.value),
  });

  useEffect(() => {
    dispatch(
      HomeSummaryService(`${VITE_API_URL}/projects/search?page=${paginationPage}&results_per_page=12&search=${search}`),
    );
  }, [search, paginationPage]);

  return (
    <div className="fmtm-bg-white fmtm-rounded-lg fmtm-p-5 fmtm-flex-1">
      <div className="fmtm-flex fmtm-items-center fmtm-justify-between fmtm-flex-wrap">
        <h4 className="fmtm-text-grey-800">Project Location Map</h4>
        <Searchbar value={searchTextData} onChange={handleChangeData} wrapperStyle="fmtm-w-[10.5rem]" isSmall />
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          <p className="fmtm-body-md fmtm-text-grey-800">Show Map</p>
          <Switch ref={null} className="" checked={showMap} onCheckedChange={() => setShowMap(!showMap)} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
