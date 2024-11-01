import { geojson as fgbGeojson } from 'flatgeobuf';
import type { Rect } from 'flatgeobuf';
import type { GeoJSON, Feature, FeatureCollection } from 'geojson';

// function stripGeometryCollection(feature: Feature) {
//     // Extract first geom from geomcollection
//     return {
//         ...feature,
//         geometry: feature.geometry.geometries[0],
//     };
// }

function handleHeaderMeta(headerMeta) {
	// console.log('METADATA')
	// console.log(headerMeta)
}

export async function fetchFlatGeobufData(url: string, bbox: Rect | null): Promise<GeoJSON> {
	// FIXME this should work but getting 'n2 is null' error
	// import { deserialize } from 'flatgeobuf/lib/mjs/geojson.js';
	// const geojsonData = {
	//     type: 'FeatureCollection',
	//     features: [],
	// }
	// const iterable = deserialize(url, bbox);
	// let index = 0;
	// for await (let feature of iterable) {
	//     geojsonData.features.push({ ...feature, id: feature.properties?.id ?? index });
	//     index += 1;
	// }

	// FIXME this is a hack, see above
	const fgbFile = await fetch(url);
	const binaryData = await fgbFile.arrayBuffer();
	const uint8ArrayData = new Uint8Array(binaryData);
	const geojsonData = await fgbGeojson.deserialize(uint8ArrayData, bbox, handleHeaderMeta);
	return geojsonData;
}
