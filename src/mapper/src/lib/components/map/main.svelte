<script lang="ts">
    import '$styles/page.css';
    import '$styles/button.css';
    import '@hotosm/ui/dist/hotosm-ui';
    import { writable } from 'svelte/store';
    import {
        MapLibre,
        GeoJSON,
        FillLayer,
        LineLayer,
        hoverStateFilter,
        SymbolLayer,
        NavigationControl,
        ScaleControl,
        Control,
        ControlGroup,
        ControlButton,
    } from 'svelte-maplibre';
    import type { FeatureCollection } from 'geojson';
    import { polygon } from '@turf/helpers';
    import { buffer } from '@turf/buffer';
    import { bbox } from '@turf/bbox';

    import Legend from '$lib/components/map/legend.svelte';
    import LayerSwitcher from '$lib/components/map/layer-switcher.svelte';
    import { GetDeviceRotation } from '$lib/utils/getDeviceRotation';
    import LocationArcImg from '$assets/images/locationArc.png';
    import LocationDotImg from '$assets/images/locationDot.png';
    import BlackLockImg from '$assets/images/black-lock.png';
    import RedLockImg from '$assets/images/red-lock.png';
    import { setAlert } from '$store/common';
	import { taskFeatcolStore, selectedTaskId } from '$store/tasks';

    export let toggleTaskActionModal: boolean;

	let map: maplibregl.Map | undefined;
	let loaded: boolean;
	let featureClicked = writable(false);

	const osmStyle = {
		id: 'OSM Raster',
		version: 8,
		name: 'OpenStreetMap',
		sources: {
		osm: {
			type: 'raster',
			tiles: [
			'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
			'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
			'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
			],
			minzoom: 0,
			maxzoom: 19,
			attribution:
			'© <a target="_blank" rel="noopener" href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
		},
		},
		layers: [
		{
			id: 'osm',
			type: 'raster',
			source: 'osm',
			layout: {
			visibility: 'visible',
			},
		},
		],
	};

    export async function addProjectPolygonToMap(projectOutlineCoords) {
		const projectPolygon = polygon(projectOutlineCoords);
		const projectBuffer = buffer(projectPolygon, 100, { units: 'meters' });
		if (projectBuffer && map) {
			const projectBbox: [number, number, number, number] = bbox(projectBuffer) as [number, number, number, number];
			map.fitBounds(projectBbox, { duration: 0 });
		}
    }

	// geolocation
	let coords: [number, number];
	let rotationDeg: number | undefined;
	let toggleGeolocationStatus = false;
	let watchId: number;

	$: if (map && toggleGeolocationStatus) {
		// zoom to user's current location
		navigator.geolocation.getCurrentPosition((position) => {
			const currentCoordinate = [position.coords.longitude, position.coords.latitude];
			map.flyTo({
				center: currentCoordinate,
				essential: true,
				zoom: 18,
			});
		});

		// track users location
		watchId = navigator.geolocation.watchPosition(
			function (pos) {
				coords = [pos.coords.longitude, pos.coords.latitude];
			},
			function (error) {
				alert(`ERROR: ${error.message}`);
			},
			{
				enableHighAccuracy: true,
			},
		);
	} else {
		// stop tracking user's location on location toggle off
		navigator.geolocation.clearWatch(watchId);
	}
	const isFirefox = typeof InstallTrigger !== 'undefined';
	const isSafari =
		/constructor/i.test(window.HTMLElement) ||
		(function (p) {
			return p.toString() === '[object SafariRemoteNotification]';
			// @ts-ignore
		})(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

	// locationGeojson: to display point on the map
	let locationGeojson: FeatureCollection;
	$: locationGeojson = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: coords,
				},
				// firefox & safari doesn't support device orientation sensor, so if the browser any of the two set orientation to false
				properties: { orientation: !(isFirefox || isSafari) },
			},
		],
	};

	$: if (map && toggleGeolocationStatus) {
		if (isFirefox || isSafari) {
			// firefox & safari doesn't support device orientation sensor
			setAlert.set({
				variant: 'warning',
				message: "Unable to handle device orientation. Your browser doesn't support device orientation sensors.",
			});
		} else {
			// See the API specification at: https://w3c.github.io/orientation-sensor
			// We use referenceFrame: 'screen' because the web page will rotate when
			// the phone switches from portrait to landscape.
			const sensor = new AbsoluteOrientationSensor({
				frequency: 60,
				referenceFrame: 'screen',
			});
			sensor.addEventListener('reading', (event) => {
				rotationDeg = GetDeviceRotation(sensor.quaternion);
			});

			Promise.all([
				navigator.permissions.query({ name: 'accelerometer' }),
				navigator.permissions.query({ name: 'magnetometer' }),
				navigator.permissions.query({ name: 'gyroscope' }),
			]).then((results) => {
				if (results.every((result) => result.state === 'granted')) {
					sensor.start();
				} else {
				}
			});
		}
	}
</script>

<MapLibre
    bind:map
    bind:loaded
    style={osmStyle}
    class="flex-auto w-full sm:aspect-video h-[calc(100%-4rem)]"
    center={[0, 0]}
    zoom={2}
    attributionControl={false}
    on:click={(e) => {
        featureClicked.subscribe((fClicked) => {
            if (!fClicked) {
                selectedTaskId.set(null);
            }
            featureClicked.set(false);
            toggleTaskActionModal = false;
        });
    }}
    images={[
        { id: 'LOCKED_FOR_MAPPING', url: BlackLockImg },
        { id: 'LOCKED_FOR_VALIDATION', url: RedLockImg },
        { id: 'locationArc', url: LocationArcImg },
        { id: 'locationDot', url: LocationDotImg },
    ]}
    >
    <NavigationControl position="top-left" />
    <ScaleControl />
    <Control class="flex flex-col gap-y-2" position="top-left">
        <ControlGroup>
            <ControlButton on:click={() => (toggleGeolocationStatus = !toggleGeolocationStatus)}
                ><hot-icon
                    name="geolocate"
                    class={`!text-[1.2rem] cursor-pointer  duration-200 ${toggleGeolocationStatus ? 'text-red-600' : 'text-[#52525B]'}`}
                ></hot-icon></ControlButton
            >
        </ControlGroup></Control
    >
    {#if toggleGeolocationStatus}
        <GeoJSON data={locationGeojson} id="point">
            <SymbolLayer
                applyToClusters={false}
                hoverCursor="pointer"
                layout={{
                    // if orientation true (meaning the browser supports device orientation sensor show location dot with orientation sign)
                    'icon-image': ['case', ['==', ['get', 'orientation'], true], 'locationArc', 'locationDot'],
                    'icon-allow-overlap': true,
                    'text-field': '{mag}',
                    'text-offset': [0, -2],
                    'text-size': 12,
                    'icon-rotate': rotationDeg || 0, // rotate location icon acc to device orientation
                    'icon-rotation-alignment': 'map',
                    'icon-size': 0.5,
                }}
            />
        </GeoJSON>
    {/if}
    <GeoJSON id="states" data={$taskFeatcolStore} promoteId="TASKS">
        <FillLayer
            hoverCursor="pointer"
            paint={{
                'fill-color': [
                    'match',
                    ['get', 'state'],
                    'UNLOCKED_TO_MAP',
                    '#ffffff',
                    'LOCKED_FOR_MAPPING',
                    '#008099',
                    'UNLOCKED_TO_VALIDATE',
                    '#ade6ef',
                    'LOCKED_FOR_VALIDATION',
                    '#fceca4',
                    'UNLOCKED_DONE',
                    '#40ac8c',
                    '#c5fbf5', // default color if no match is found
                ],
                'fill-opacity': hoverStateFilter(0.1, 0),
            }}
            beforeLayerType="symbol"
            manageHoverState
            on:click={(e) => {
                featureClicked.set(true);
                const clickedTask = e.detail.features?.[0]?.properties?.fid;
                selectedTaskId.set(clickedTask);
                toggleTaskActionModal = true;
            }}
        />
        <LineLayer
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{
                'line-color': ['case', ['==', ['get', 'fid'], $selectedTaskId], '#fa1100', '#0fffff'],
                'line-width': 3,
                'line-opacity': ['case', ['==', ['get', 'fid'], $selectedTaskId], 1, 0.35],
            }}
            beforeLayerType="symbol"
            manageHoverState
        />
        <SymbolLayer
            applyToClusters={false}
            hoverCursor="pointer"
            layout={{
                'icon-image': ['case', 
                ['==', ['get', 'state'], 'LOCKED_FOR_MAPPING'], 'LOCKED_FOR_MAPPING', 
                ['==', ['get', 'status'],'LOCKED_FOR_VALIDATION'], 'LOCKED_FOR_VALIDATION', ''],
                'icon-allow-overlap': true,
            }}
        />
    </GeoJSON>
    <div class="absolute right-3 bottom-3 sm:right-5 sm:bottom-5">
        <LayerSwitcher />
        <Legend />
    </div>
</MapLibre>
