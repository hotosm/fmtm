function checkWGS84Projection(drawnGeojson: any) {
  try {
    if (drawnGeojson && drawnGeojson.features && drawnGeojson.features.length > 0) {
      for (const feature of drawnGeojson.features) {
        const coordinates = feature.geometry.coordinates;

        for (const coord of coordinates) {
          const longitude = coord[0];
          const latitude = coord[1];

          if (
            isNaN(latitude) ||
            isNaN(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
          ) {
            return false;
          }
        }
      }
      return true; // All coordinates are within WGS 84 range
    }
    return false;
  } catch (error) {
    return false;
  }
}

export { checkWGS84Projection };
