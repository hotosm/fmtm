import React, { useEffect, useState, useCallback } from 'react';
import MapStyles from '@/hooks/MapStyles';
import MapComponent from '@/components/MapComponent/MapLibreComponent/MapContainer';
import MapControlComponent from '@/components/ProjectDetails/MapControlComponent';
import WindowDimension from '@/hooks/WindowDimension';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import MapLegends from '@/components/MapLegends';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { FeatureCollection } from 'geojson';

type ProjectDetailsMapProps = {
  setSelectedTaskArea: (feature: any) => void;
  setSelectedTaskFeature: (feature: any) => void;
  setMap: (feature: any) => void;
};

const ProjectDetailsMap = ({ setSelectedTaskArea, setSelectedTaskFeature }: ProjectDetailsMapProps) => {
  const dispatch = useAppDispatch();
  const { windowSize } = WindowDimension();
  const geojsonStyles = MapStyles();
  const projectTaskBoundaries = useAppSelector((state) => state.project.projectTaskBoundries);

  const [taskBoundariesLayer, setTaskBoundariesLayer] = useState<FeatureCollection | null>(null);

  // Prepare GeoJSON for task boundaries
  useEffect(() => {
    const features = projectTaskBoundaries[0]?.taskBoundries?.map((taskObj) => ({
      type: 'Feature',
      id: taskObj.id,
      geometry: { ...taskObj.outline },
      properties: {
        ...taskObj.outline.properties,
        task_state: taskObj?.task_state,
        actioned_by_uid: taskObj?.actioned_by_uid,
        actioned_by_username: taskObj?.actioned_by_username,
      },
    }));
    const taskBoundariesFeatcol: FeatureCollection = {
      type: 'FeatureCollection',
      features: features || [],
    };
    setTaskBoundariesLayer(taskBoundariesFeatcol);
  }, [projectTaskBoundaries[0]?.taskBoundries?.length]);

  // MapLibre click handler for features
  const onMapClick = useCallback(
    (event) => {
      if (!event.features || event.features.length === 0) return;
      const feature = event.features[0];
      setSelectedTaskArea(feature);
      setSelectedTaskFeature(undefined);
      dispatch({ type: 'TaskActions/SetSelectedTask', payload: feature.id });
      dispatch({ type: 'ProjectActions/ToggleTaskModalStatus', payload: true });
    },
    [setSelectedTaskArea, setSelectedTaskFeature, dispatch],
  );

  // Style for task boundaries layer
  const taskBoundaryLayerStyle = {
    id: 'task-boundaries',
    type: 'line' as const,
    paint: {
      'line-color': '#ff6600',
      'line-width': 2,
    },
  };

  return (
    <div
      className={`map naxatw-relative naxatw-min-h-full naxatw-w-full fmtm-cursor-grab active:fmtm-cursor-grabbing ${
        windowSize.width <= 768 ? '!fmtm-h-[100dvh]' : '!fmtm-h-full'
      }`}
      style={{ width: '100%', height: '100%' }}
    >
      <MapComponent
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['task-boundaries']}
        onClick={onMapClick}
      >
        {/* Render task boundaries as GeoJSON source/layer */}
        {taskBoundariesLayer && (
          <Source id="task-boundaries" type="geojson" data={taskBoundariesLayer}>
            <Layer {...taskBoundaryLayerStyle} />
          </Source>
        )}
        <MapLegends defaultTheme={geojsonStyles} />
        <MapControlComponent map={null} projectName={''} pmTileLayerUrl={null} />
      </MapComponent>
    </div>
  );
};

export default ProjectDetailsMap;
