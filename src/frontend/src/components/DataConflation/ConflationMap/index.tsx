import React from 'react';
import { MapContainer as MapComponent, useOLMap } from '@/components/MapComponent/OpenLayersComponent';
import LayerSwitcherControl from '@/components/MapComponent/OpenLayersComponent/LayerSwitcher/index';
import MapLegend from '@/components/DataConflation/ConflationMap/MapLegend';
import Button from '@/components/common/Button';
import { useAppSelector } from '@/types/reduxTypes';
import { VectorLayer } from '@/components/MapComponent/OpenLayersComponent/Layers';
import { useDispatch } from 'react-redux';
import { DataConflationActions } from '@/store/slices/DataConflationSlice';

const ConflationMap = () => {
  const dispatch = useDispatch();

  const submissionConflationGeojson = useAppSelector((state) => state.dataconflation.submissionConflationGeojson);

  const { mapRef, map } = useOLMap({
    center: [0, 0],
    zoom: 4,
  });

  return (
    <>
      <MapComponent
        ref={mapRef}
        mapInstance={map}
        className="map naxatw-relative naxatw-min-h-full !fmtm-h-full fmtm-w-[200px] fmtm-rounded-lg fmtm-overflow-hidden"
      >
        <VectorLayer
          geojson={submissionConflationGeojson}
          viewProperties={{
            size: map?.getSize(),
            padding: [50, 50, 50, 50],
            constrainResolution: true,
            duration: 2000,
          }}
          zoomToLayer
          mapOnClick={(properties, feature) => {
            dispatch(DataConflationActions.SetSelectedFeatureOSMId(feature.getProperties().xid));
          }}
        />
        <LayerSwitcherControl visible="osm" />
        <div className="fmtm-absolute fmtm-bottom-20 sm:fmtm-bottom-3 fmtm-left-3 fmtm-z-50 fmtm-rounded-lg">
          <MapLegend />
        </div>
        <div className="fmtm-absolute fmtm-bottom-20 sm:fmtm-top-3 fmtm-right-3 fmtm-z-50 fmtm-rounded-lg fmtm-h-fit">
          <Button btnText="Upload to OSM" type="button" btnType="primary" onClick={() => {}} />
        </div>
      </MapComponent>
    </>
  );
};

export default ConflationMap;
