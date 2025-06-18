import React, { useRef, useEffect } from 'react';
import Map, { NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const DEFAULT_CENTER = [0, 0]; // [lng, lat]
const DEFAULT_ZOOM = 2;

const MapContainer = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  style = { width: '100%', height: '400px' },
  children,
  draw = false,
  onDrawCreate,
  onDrawUpdate,
  onDrawDelete,
  ...mapProps
}) => {
  const mapRef = useRef<MapRef>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    const map = mapRef.current && mapRef.current.getMap && mapRef.current.getMap();
    if (!map) return;
    if (draw && !drawRef.current) {
      drawRef.current = new MapboxDraw();
      map.addControl(drawRef.current as any, 'top-right');
      if (onDrawCreate) map.on('draw.create', onDrawCreate);
      if (onDrawUpdate) map.on('draw.update', onDrawUpdate);
      if (onDrawDelete) map.on('draw.delete', onDrawDelete);
    }
    return () => {
      if (drawRef.current && map && map.hasControl(drawRef.current as any)) {
        map.removeControl(drawRef.current as any);
        if (onDrawCreate) map.off('draw.create', onDrawCreate);
        if (onDrawUpdate) map.off('draw.update', onDrawUpdate);
        if (onDrawDelete) map.off('draw.delete', onDrawDelete);
        drawRef.current = null;
      }
    };
  }, [draw, onDrawCreate, onDrawUpdate, onDrawDelete]);

  return (
    <div style={style}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: center[0], latitude: center[1], zoom }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        style={{ width: '100%', height: '100%' }}
        {...mapProps}
      >
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <NavigationControl />
        </div>
        {children}
      </Map>
    </div>
  );
};

export default MapContainer;
// Ensure no OpenLayers or legacy references remain in this file.
