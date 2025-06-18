import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from '@/components/MapComponent/MapLibreComponent/MapContainer';
import { Source, Layer } from 'react-map-gl/maplibre';
import CoreModules from '@/shared/CoreModules';
import { useNavigate } from 'react-router-dom';
import type { FeatureCollection } from 'geojson';

const ProjectListMap = () => {
  const navigate = useNavigate();
  const [projectGeojson, setProjectGeojson] = useState<FeatureCollection | null>(null);
  const homeProjectSummary = CoreModules.useAppSelector((state) => state.home.homeProjectSummary);

  useEffect(() => {
    if (!homeProjectSummary?.length) return;
    const convertedHomeProjectSummaryGeojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: homeProjectSummary.map((project) => ({
        type: 'Feature',
        properties: {
          ...project,
          project_id: `#${project.id}`,
        },
        geometry: project.centroid || { type: 'Point', coordinates: [0, 0] },
      })),
    };
    setProjectGeojson(convertedHomeProjectSummaryGeojson);
  }, [homeProjectSummary]);

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
      if (!feature.properties?.id) return;
      navigate(`/project/${feature.properties.id}`);
    },
    [navigate],
  );

  return (
    <div className="lg:fmtm-order-last lg:fmtm-w-[50%] fmtm-h-[33rem] lg:fmtm-h-full fmtm-bg-gray-300 fmtm-mx-0 lg:fmtm-mx-4 fmtm-mb-2 fmtm-rounded-lg fmtm-overflow-hidden">
      <div className="map-container" style={{ height: '100%' }}>
        <MapComponent style={{ height: '100%', width: '100%' }} onLoad={onMapLoad} onClick={onMapClick}>
          <Source
            id="projects"
            type="geojson"
            data={projectGeojson || { type: 'FeatureCollection', features: [] }}
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
    </div>
  );
};

export default ProjectListMap;
