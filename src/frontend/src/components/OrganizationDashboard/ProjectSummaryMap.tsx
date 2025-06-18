import React, { useCallback } from 'react';
import MapComponent from '@/components/MapComponent/MapLibreComponent/MapContainer';
import { Source, Layer } from 'react-map-gl/maplibre';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '@/types/reduxTypes';
import type { FeatureCollection } from 'geojson';

const ProjectSummaryMap = () => {
  const history = useHistory();
  const projectList = useAppSelector((state) => state.home.homeProjectSummary);
  const projectListFeatureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: projectList.map((project) => ({
      type: 'Feature',
      properties: {
        project_id: project.id?.toString(),
      },
      geometry: project.centroid || { type: 'Point', coordinates: [0, 0] },
    })),
  };

  // Cluster layer style
  const clusterLayer = {
    id: 'clusters',
    type: 'circle' as const,
    source: 'projects',
    filter: ['has', 'point_count'] as any,
    paint: {
      'circle-color': '#D73F37',
      'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40] as any,
      'circle-opacity': 0.9,
    },
  };

  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol' as const,
    source: 'projects',
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
    type: 'symbol' as const,
    source: 'projects',
    filter: ['!', ['has', 'point_count']] as any,
    layout: {
      'icon-image': 'custom-marker',
      'icon-size': 1.2,
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom' as const,
      'text-field': ['get', 'project_id'] as any,
      'text-offset': [0, 1.5] as [number, number],
      'text-size': 14,
    },
    paint: {
      'text-color': '#000',
    },
  };

  // Register custom marker image on map load
  const onMapLoad = useCallback((event) => {
    const map = event.target;
    if (!map.hasImage('custom-marker')) {
      const img = new window.Image(32, 40);
      img.onload = () => {
        map.addImage('custom-marker', img);
      };
      img.src = '/assets/images/map-pin-primary.png'; // Adjust path as needed
    }
  }, []);

  // Handle click on unclustered point
  const onMapClick = useCallback(
    (event) => {
      if (!event.features || event.features.length === 0) return;
      const feature = event.features[0];
      if (!feature.properties?.project_id) return;
      history.push(`/project/${feature.properties.project_id}`);
    },
    [history],
  );

  return (
    <div className="fmtm-w-full fmtm-h-full fmtm-rounded-lg fmtm-overflow-hidden">
      <MapComponent style={{ height: '100%', width: '100%' }} onLoad={onMapLoad} onClick={onMapClick}>
        <Source
          id="projects"
          type="geojson"
          data={projectListFeatureCollection}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </MapComponent>
    </div>
  );
};

export default ProjectSummaryMap;
