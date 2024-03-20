export const isInputEmpty = (text: string): boolean => {
  if (typeof text === 'undefined') {
    return true;
  }
  const trimmedText = text.trim();
  return trimmedText === '';
};

export const featureCollectionHasFeatures = (geojson): boolean => {
  if (
    geojson?.type === 'FeatureCollection' &&
    geojson?.features &&
    Array.isArray(geojson?.features) &&
    geojson?.features?.length === 0
  ) {
    return false;
  }
  return true;
};
