import React from 'react';
import useOLMap from '../hooks/useOlMap';
import { MapContainer as MapComponent } from '../components/MapComponent/OpenLayersComponent';
import LayerSwitcherControl from '../components/MapComponent/OpenLayersComponent/LayerSwitcher/index.js';
import { VectorLayer } from '../components/MapComponent/OpenLayersComponent/Layers';
import { GeoJSONFeatureTypes } from '../store/types/ICreateProject';
import CoreModules from '../shared/CoreModules.js';
import { Loader2 } from 'lucide-react';

type NewDefineAreaMapProps = {
  drawToggle?: boolean;
  splittedGeojson: GeoJSONFeatureTypes | null;
  uploadedOrDrawnGeojsonFile: GeoJSONFeatureTypes;
  buildingExtractedGeojson?: GeoJSONFeatureTypes;
  lineExtractedGeojson?: GeoJSONFeatureTypes;
  onDraw?: (geojson: any, area: number) => void;
  onModify?: (geojson: any, area?: number) => void;
};
const NewDefineAreaMap = ({
  drawToggle,
  uploadedOrDrawnGeojsonFile,
  splittedGeojson,
  buildingExtractedGeojson,
  lineExtractedGeojson,
  onDraw,
  onModify,
}: NewDefineAreaMapProps) => {
  const { mapRef, map } = useOLMap({
    // center: fromLonLat([85.3, 27.7]),
    center: [0, 0],
    zoom: 1,
    maxZoom: 25,
  });
  const isDrawOrGeojsonFile = drawToggle || uploadedOrDrawnGeojsonFile;
  const isFgbFetching = CoreModules.useAppSelector((state) => state.createproject.isFgbFetching);

  return (
    <div className="map-container" style={{ height: '600px', width: '100%' }}>
      <MapComponent
        ref={mapRef}
        mapInstance={map}
        className="map naxatw-relative naxatw-min-h-full naxatw-w-full"
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <LayerSwitcherControl />
        {splittedGeojson && (
          <VectorLayer
            geojson={splittedGeojson}
            viewProperties={{
              size: map?.getSize(),
              padding: [50, 50, 50, 50],
              constrainResolution: true,
              duration: 500,
            }}
            onModify={onModify}
          />
        )}
        {isDrawOrGeojsonFile && !splittedGeojson && (
          <VectorLayer
            geojson={uploadedOrDrawnGeojsonFile}
            viewProperties={{
              size: map?.getSize(),
              padding: [50, 50, 50, 50],
              constrainResolution: true,
              duration: 500,
            }}
            onDraw={onDraw}
            onModify={onModify}
            zoomToLayer
          />
        )}

        {buildingExtractedGeojson && (
          <VectorLayer
            geojson={buildingExtractedGeojson}
            // stylestyle={{
            //     ...getStyles,
            //     fillOpacity: 100,
            //     lineColor: getStyles.fillColor,
            //     lineThickness: 7,
            //     lineOpacity: 40,
            // }}
            viewProperties={{
              // easing: elastic,
              // animate: true,
              size: map?.getSize(),
              // maxZoom: 15,
              padding: [50, 50, 50, 50],
              // duration: 900,
              constrainResolution: true,
              duration: 500,
            }}
            zoomToLayer
          />
        )}
        {lineExtractedGeojson && (
          <VectorLayer
            geojson={lineExtractedGeojson}
            // stylestyle={{
            //     ...getStyles,
            //     fillOpacity: 100,
            //     lineColor: getStyles.fillColor,
            //     lineThickness: 7,
            //     lineOpacity: 40,
            // }}
            viewProperties={{
              // easing: elastic,
              // animate: true,
              size: map?.getSize(),
              // maxZoom: 15,
              padding: [50, 50, 50, 50],
              // duration: 900,
              constrainResolution: true,
              duration: 500,
            }}
            zoomToLayer
          />
        )}
        {isFgbFetching && (
          <div className="fmtm-absolute fmtm-top-0 fmtm-left-0 fmtm-z-50 fmtm-flex fmtm-items-center fmtm-justify-center fmtm-w-full fmtm-pt-2">
            <Loader2 className="fmtm-mr-2 fmtm-h-6 fmtm-w-6 fmtm-animate-spin fmtm-text-red-600" />
            <p className="fmtm-text-red-600">Data extraction is currently in progress. </p>
          </div>
        )}
      </MapComponent>
    </div>
  );
};

export default NewDefineAreaMap;
