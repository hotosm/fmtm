import React from 'react';
import MapLibreMap from '@/components/MapComponent/MapLibreComponent';
import MapLegend from '@/components/DataConflation/ConflationMap/MapLegend';
import Button from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import { DataConflationActions } from '@/store/slices/DataConflationSlice';

const ConflationMap = () => {
  const dispatch = useAppDispatch();

  const submissionConflationGeojson = useAppSelector((state) => state.dataconflation.submissionConflationGeojson);
  const submissionConflationGeojsonLoading = useAppSelector(
    (state) => state.dataconflation.submissionConflationGeojsonLoading,
  );

  return (
    <>
      <MapLibreMap
        className="map naxatw-relative naxatw-min-h-full !fmtm-h-full fmtm-w-[200px] fmtm-rounded-lg fmtm-overflow-hidden"
        geojson={submissionConflationGeojson}
        onFeatureClick={(feature) => {
          dispatch(
            DataConflationActions.SetSelectedFeatureOSMId(
              feature?.getProperties()?.xid
                ? feature.getProperties().xid
                : feature.getProperties()?.osm_id.toString(),
            ),
          );
        }}
      />
      <div className="fmtm-absolute fmtm-bottom-20 sm:fmtm-top-3 fmtm-right-3 fmtm-z-50 fmtm-rounded-lg fmtm-h-fit">
        <Button variant="primary-red" onClick={() => {}} isLoading={submissionConflationGeojsonLoading}>
          Upload to OSM
        </Button>
      </div>
    </>
  );
};

export default ConflationMap;
