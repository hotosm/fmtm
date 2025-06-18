import React, { useEffect, useState } from 'react';
import CoreModules from '@/shared/CoreModules';
import AssetModules from '@/shared/AssetModules';

export default function MapStyles() {
  const mapTheme = CoreModules.useAppSelector((state) => state.theme.hotTheme);
  const [style, setStyle] = useState({});
  const strokeColor = 'rgb(0,0,0,0.3)';
  const secondaryStrokeColor = 'rgb(0,0,0,1)';

  useEffect(() => {
    // Example usage:
    const lockedPolygonStyle = {
      'fill-color': mapTheme.palette.mapFeatureColors.LOCKED_FOR_MAPPING,
      'fill-opacity': 1,
      'line-color': secondaryStrokeColor,
      'line-width': 3,
    };
    const lockedValidationStyle = {
      'fill-color': mapTheme.palette.mapFeatureColors.LOCKED_FOR_VALIDATION,
      'fill-opacity': 1,
      'line-color': secondaryStrokeColor,
      'line-width': 3,
    };
    const iconStyle = {
      'icon-image': AssetModules.LockPng,
      'icon-size': 0.8,
      'icon-anchor': [0.5, 1],
      'icon-offset': [0, -15],
    };
    const redIconStyle = {
      'icon-image': AssetModules.RedLockPng,
      'icon-size': 0.8,
      'icon-anchor': [0.5, 1],
      'icon-offset': [0, -15],
    };

    const geojsonStyles = {
      UNLOCKED_TO_MAP: {
        'fill-color': mapTheme.palette.mapFeatureColors.UNLOCKED_TO_MAP,
        'fill-opacity': 1,
        'line-color': strokeColor,
        'line-width': 3,
      },
      LOCKED_FOR_MAPPING: [lockedPolygonStyle, iconStyle],
      UNLOCKED_TO_VALIDATE: {
        'fill-color': mapTheme.palette.mapFeatureColors.UNLOCKED_TO_VALIDATE,
        'fill-opacity': 1,
        'line-color': strokeColor,
        'line-width': 3,
      },
      LOCKED_FOR_VALIDATION: [lockedValidationStyle, redIconStyle],
      UNLOCKED_DONE: {
        'fill-color': mapTheme.palette.mapFeatureColors.UNLOCKED_DONE,
        'fill-opacity': 1,
        'line-color': strokeColor,
        'line-width': 3,
      },
    };
    setStyle(geojsonStyles);
  }, []);

  return style;
}
