import AssetModules from '@/shared/AssetModules';
import { GeoGeomTypesEnum } from '@/types/enums';

function createPolygonStyle(fillColor: string, strokeColor: string) {
  return {
    'fill-color': fillColor,
    'fill-opacity': 0.6,
    'stroke-color': strokeColor,
    'stroke-width': 2,
  };
}

function createFeaturePolygonStyle(color: string, strokeOpacity: number = 1, strokeColor: string) {
  return {
    'fill-color': color,
    'fill-opacity': 0.6,
    'stroke-color': strokeColor,
    'stroke-width': 1,
    'stroke-opacity': strokeOpacity,
  };
}

function createFeatureLineStyle(strokeColor: string) {
  return {
    'stroke-color': strokeColor,
    'stroke-width': 3,
  };
}

function createIconStyle(iconSrc: string, scale: number = 0.8) {
  return {
    'icon-image': iconSrc,
    'icon-size': scale,
    'icon-anchor': [0.5, 1],
    'icon-offset': [0, 0],
    'icon-opacity': 1,
    'text-field': '',
    'text-font': [],
    'text-size': 0,
    'text-offset': [0, 0],
    'text-anchor': 'middle',
  };
}

const strokeColor = 'rgb(0,0,0,0.3)';
const secondaryStrokeColor = 'rgb(0,0,0,1)';

const getTaskStatusStyle = (feature: Record<string, any>, mapTheme: Record<string, any>, taskLockedByUser: boolean) => {
  const status = feature.getProperties().task_state;

  const isTaskStatusLocked = ['LOCKED_FOR_MAPPING', 'LOCKED_FOR_VALIDATION'].includes(status);
  const borderStrokeColor = isTaskStatusLocked && taskLockedByUser ? secondaryStrokeColor : strokeColor;

  const lockedPolygonStyle = createPolygonStyle(
    mapTheme.palette.mapFeatureColors.LOCKED_FOR_MAPPING,
    borderStrokeColor,
  );
  const lockedValidationStyle = createPolygonStyle(
    mapTheme.palette.mapFeatureColors.LOCKED_FOR_VALIDATION,
    borderStrokeColor,
  );
  const iconStyle = createIconStyle(AssetModules.LockPng);
  const redIconStyle = createIconStyle(AssetModules.RedLockPng);

  const geojsonStyles = {
    UNLOCKED_TO_MAP: {
      'fill-color': mapTheme.palette.mapFeatureColors.UNLOCKED_TO_MAP,
      'stroke-color': borderStrokeColor,
      'stroke-width': 3,
    },
    LOCKED_FOR_MAPPING: [lockedPolygonStyle, iconStyle],
    UNLOCKED_TO_VALIDATE: {
      'fill-color': mapTheme.palette.mapFeatureColors.UNLOCKED_TO_VALIDATE,
      'stroke-color': borderStrokeColor,
      'stroke-width': 3,
    },
    LOCKED_FOR_VALIDATION: [lockedValidationStyle, redIconStyle],
    UNLOCKED_DONE: {
      'fill-color': mapTheme.palette.mapFeatureColors.UNLOCKED_DONE,
      'stroke-color': borderStrokeColor,
      'stroke-width': 3,
    },
  };
  return geojsonStyles[status];
};

export const getFeatureStatusStyle = (
  geomType: string,
  mapTheme: Record<string, any>,
  mappingStatus: string,
  isEntitySelected: boolean,
) => {
  let geojsonStyles;

  if (geomType === GeoGeomTypesEnum.POINT) {
    geojsonStyles = {
      READY: createIconStyle(
        AssetModules.MapPinGrey,
        isEntitySelected ? 2 : 1,
        mapTheme.palette.entityStatusColors.ready,
      ),
      OPENED_IN_ODK: createIconStyle(
        AssetModules.MapPinGrey,
        isEntitySelected ? 2 : 1,
        mapTheme.palette.entityStatusColors.opened_in_odk,
      ),
      SURVEY_SUBMITTED: createIconStyle(
        AssetModules.MapPinGrey,
        isEntitySelected ? 2 : 1,
        mapTheme.palette.entityStatusColors.survey_submitted,
      ),
      MARKED_BAD: createIconStyle(
        AssetModules.MapPinGrey,
        isEntitySelected ? 2 : 1,
        mapTheme.palette.entityStatusColors.marked_bad,
      ),
      VALIDATED: createIconStyle(
        AssetModules.MapPinGrey,
        isEntitySelected ? 1.5 : 1,
        mapTheme.palette.entityStatusColors.validated,
      ),
    };
  } else if (geomType === GeoGeomTypesEnum.POLYGON) {
    geojsonStyles = {
      READY: createFeaturePolygonStyle(
        mapTheme.palette.entityStatusColors.ready,
        0.2,
        isEntitySelected ? 'rgb(224,10,7,1)' : 'rgb(0,0,0,0.5)',
      ),
      OPENED_IN_ODK: createFeaturePolygonStyle(
        mapTheme.palette.entityStatusColors.opened_in_odk,
        0.2,
        isEntitySelected ? 'rgb(224,10,7,1)' : 'rgb(0,0,0,0.5)',
      ),
      SURVEY_SUBMITTED: createFeaturePolygonStyle(
        mapTheme.palette.entityStatusColors.survey_submitted,
        1,
        isEntitySelected ? 'rgb(224,10,7,1)' : 'rgb(0,0,0,0.5)',
      ),
      MARKED_BAD: createFeaturePolygonStyle(
        mapTheme.palette.entityStatusColors.marked_bad,
        1,
        isEntitySelected ? 'rgb(224,10,7,1)' : 'rgb(0,0,0,0.5)',
      ),
      VALIDATED: createFeaturePolygonStyle(
        mapTheme.palette.entityStatusColors.validated,
        1,
        isEntitySelected ? 'rgb(224,10,7,1)' : 'rgb(0,0,0,0.5)',
      ),
    };
  } else if (geomType === 'LineString') {
    geojsonStyles = {
      READY: createFeatureLineStyle(mapTheme.palette.lineEntityStatusColors.ready),
      OPENED_IN_ODK: createFeatureLineStyle(mapTheme.palette.lineEntityStatusColors.opened_in_odk),
      SURVEY_SUBMITTED: createFeatureLineStyle(mapTheme.palette.lineEntityStatusColors.survey_submitted),
      MARKED_BAD: createFeatureLineStyle(mapTheme.palette.lineEntityStatusColors.marked_bad),
      VALIDATED: createFeatureLineStyle(mapTheme.palette.lineEntityStatusColors.validated),
    };
  }

  return geojsonStyles[mappingStatus];
};

export default getTaskStatusStyle;
