import React from 'react';
import MapComponent from '@/components/MapComponent/MapLibreComponent/MapContainer';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { FeatureCollection } from 'geojson';

type NewDefineAreaMapProps = {
  drawToggle?: boolean;
  splittedGeojson?: FeatureCollection | null;
  uploadedOrDrawnGeojsonFile: FeatureCollection | null;
  buildingExtractedGeojson?: FeatureCollection | null;
  lineExtractedGeojson?: FeatureCollection;
  onDraw?: ((geojson: any, area: string) => void) | null;
  onModify?: ((geojson: any, area: string) => void) | null;
  hasEditUndo?: boolean;
  getAOIArea?: ((area?: string) => void) | null;
  additionalFeatureGeojson?: FeatureCollection | null;
};

const NewDefineAreaMap = ({
  drawToggle,
  uploadedOrDrawnGeojsonFile,
  splittedGeojson,
  buildingExtractedGeojson,
  lineExtractedGeojson,
  onDraw,
  onModify,
  hasEditUndo,
  getAOIArea,
  additionalFeatureGeojson,
}: NewDefineAreaMapProps) => {
  const isDrawOrGeojsonFile = drawToggle || uploadedOrDrawnGeojsonFile;

  // Common style for all vector layers
  const lineLayerStyle = {
    id: 'line-layer',
    type: 'line' as const,
    paint: {
      'line-color': '#0fffff',
      'line-width': 2,
    },
  };
  const fillLayerStyle = {
    id: 'fill-layer',
    type: 'fill' as const,
    paint: {
      'fill-color': '#000000',
      'fill-opacity': 0.1,
    },
  };
  const buildingLayerStyle = {
    id: 'building-layer',
    type: 'fill' as const,
    paint: {
      'fill-color': '#1a2fa2',
      'fill-opacity': 0.3,
    },
  };
  const additionalLayerStyle = {
    id: 'additional-layer',
    type: 'line' as const,
    paint: {
      'line-color': '#D73F37',
      'line-width': 1.5,
    },
  };

  return (
    <div className="map-container fmtm-w-full fmtm-h-[600px] lg:fmtm-h-full">
      <MapComponent style={{ height: '100%', width: '100%' }}>
        {/* Split GeoJSON */}
        {splittedGeojson && (
          <Source id="splitted-geojson" type="geojson" data={splittedGeojson}>
            <Layer {...lineLayerStyle} />
            <Layer {...fillLayerStyle} />
          </Source>
        )}
        {/* Uploaded or drawn GeoJSON */}
        {isDrawOrGeojsonFile && !splittedGeojson && uploadedOrDrawnGeojsonFile && (
          <Source id="drawn-geojson" type="geojson" data={uploadedOrDrawnGeojsonFile}>
            <Layer {...lineLayerStyle} />
            <Layer {...fillLayerStyle} />
          </Source>
        )}
        {/* Additional features */}
        {additionalFeatureGeojson && (
          <Source id="additional-geojson" type="geojson" data={additionalFeatureGeojson}>
            <Layer {...additionalLayerStyle} />
          </Source>
        )}
        {/* Buildings */}
        {buildingExtractedGeojson && (
          <Source id="building-geojson" type="geojson" data={buildingExtractedGeojson}>
            <Layer {...buildingLayerStyle} />
          </Source>
        )}
        {/* Lines */}
        {lineExtractedGeojson && (
          <Source id="line-geojson" type="geojson" data={lineExtractedGeojson}>
            <Layer {...lineLayerStyle} />
          </Source>
        )}
        {/* TODO: Drawing/editing support for MapLibre can be added with a plugin or custom logic */}
      </MapComponent>
    </div>
  );
};

export default NewDefineAreaMap;
