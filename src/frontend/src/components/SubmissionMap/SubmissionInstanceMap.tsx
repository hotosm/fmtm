import React, { useCallback } from 'react';
import MapComponent from '@/components/MapComponent/MapLibreComponent/MapContainer';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { FeatureCollection } from 'geojson';

type submissionInstanceMapPropType = {
  featureGeojson: { vectorLayerGeojson: FeatureCollection; clusterLayerGeojson: FeatureCollection };
};

const SubmissionInstanceMap = ({ featureGeojson }: submissionInstanceMapPropType) => {
  // Vector layer style
  const vectorLayer = {
    id: 'vector-layer',
    type: 'line' as const,
    source: 'vector-source',
    paint: {
      'line-color': '#D73F37',
      'line-width': 2,
    },
  };

  // Cluster layer style
  const clusterLayer = {
    id: 'clusters',
    type: 'circle' as const,
    source: 'cluster-source',
    filter: ['has', 'point_count'] as any,
    paint: {
      'circle-color': '#D73F37',
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20, 10, 30, 50, 40
      ] as any,
      'circle-opacity': 0.9,
    },
  };

  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol' as const,
    source: 'cluster-source',
    filter: ['has', 'point_count'] as any,
    layout: {
      'text-field': ['get', 'point_count_abbreviated'] as any,
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 14,
    },
    paint: {
      'text-color': '#fff',
    },
  };

  const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle' as const,
    source: 'cluster-source',
    filter: ['!', ['has', 'point_count']] as any,
    paint: {
      'circle-color': '#eb9f9f',
      'circle-radius': 10,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#D73F37',
    },
  };

  // Handle click on unclustered point (optional: add popup logic here)
  const onMapClick = useCallback((event) => {
    // Implement popup or feature selection logic if needed
  }, []);

  return (
    <div className="map-container" style={{ height: '100%' }}>
      <MapComponent
        style={{ height: '100%', width: '100%' }}
        onClick={onMapClick}
      >
        {/* Vector Layer */}
        {featureGeojson?.vectorLayerGeojson?.type && (
          <Source
            id="vector-source"
            type="geojson"
            data={featureGeojson.vectorLayerGeojson}
          >
            <Layer {...vectorLayer} />
          </Source>
        )}
        {/* Cluster Layer */}
        {featureGeojson?.clusterLayerGeojson?.type && (
          <Source
            id="cluster-source"
            type="geojson"
            data={featureGeojson.clusterLayerGeojson}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        )}
      </MapComponent>
    </div>
  );
};

export default SubmissionInstanceMap;
